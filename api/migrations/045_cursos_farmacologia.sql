-- ============================================================
--  045_cursos_farmacologia.sql — Farmacología clínica
--
--  Doce cursos de farmacología clínica —oncológica, cardiovascular,
--  endocrina, del sistema nervioso, respiratoria, renal y más—, 405 clases en total, y en cada clase el
--  video, los documentos oficiales y el texto de apoyo que trae el
--  archivo de curaduría.
--
--  Cada enlace fue abierto antes de entrar aquí. Los videos borrados
--  o restringidos y los PDF que daban 404 se quedaron fuera: un
--  reproductor que dice «no disponible» dentro de una clase es peor
--  que no poner nada.
--
--  El archivo trae Unidad › Clase › Subclase y el Aula tiene dos
--  niveles. La subclase es el contenido real, así que es la que pasa
--  a ser clase; el nombre de la «Clase» del archivo se conserva en el
--  subtítulo para no perder ese nivel.
--
--  Quedan en BORRADOR: nada se publica solo.
-- ============================================================

-- ─── 1. Curso de Farmacología Oncológica (31 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Farmacología Oncológica' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Farmacología Oncológica', 'Curso introductorio y de visión general sobre la farmacología del cáncer para Químicos Farmacéuticos en Colombia. Recorre la biología tumoral, la clasificación de los antineoplásicos, la hormonoterapia, la terapia de soporte, el manejo seguro de medicamentos peligrosos y el marco normativo colombiano, con casos clínicos centrados en la intervención del QF.', '<p>Curso introductorio y de visión general sobre la farmacología del cáncer para Químicos Farmacéuticos en Colombia. Recorre la biología tumoral, la clasificación de los antineoplásicos, la hormonoterapia, la terapia de soporte, el manejo seguro de medicamentos peligrosos y el marco normativo colombiano, con casos clínicos centrados en la intervención del QF.</p><h3>Objetivo general</h3><p>Desarrollar en el Químico Farmacéutico las bases farmacológicas, técnicas y normativas para participar en la atención del paciente oncológico en Colombia: validar prescripciones, prevenir y manejar toxicidades, garantizar el manejo seguro de medicamentos peligrosos, gestionar el acceso y realizar farmacovigilancia.</p><h3>A quién va dirigido</h3><p>Químicos Farmacéuticos, estudiantes de último año de Química Farmacéutica y regentes de farmacia que se desempeñan o desean desempeñarse en servicios farmacéuticos oncológicos, centrales de mezclas, EPS, IPS y la industria farmacéutica en Colombia.</p><h3>Contexto normativo</h3><p>Colombia — GPC MinSalud/IETS, PBS/MIPRES, INVIMA</p>',
          'Farmacología', 'intermedio', 'Desarrollar en el Químico Farmacéutico las bases farmacológicas, técnicas y normativas para participar en la atención del paciente oncológico en Colombia: validar prescripciones, prevenir y manejar toxicidades, garantizar el manejo seguro de medicamentos peligrosos, gestionar el acceso y realizar farmacovigilancia.', 'Químicos Farmacéuticos, estudiantes de último año de Química Farmacéutica y regentes de farmacia que se desempeñan o desean desempeñarse en servicios farmacéuticos oncológicos, centrales de mezclas, EPS, IPS y la industria farmacéutica en Colombia.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Biología del cáncer y bases de la farmacología antineoplásica', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: el cáncer y el rol del Químico Farmacéutico', 'Clase 1 · Introducción al curso', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Presenta el alcance del curso, la carga del cáncer en Colombia y la ruta de aprendizaje desde la biología tumoral hasta la farmacia oncológica.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=xBVmylrMC88","provider":"youtube","videoId":"xBVmylrMC88","title":"CURSO DE FARMACOLOGÍA ANTINEOPLÁSICA","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cuentadealtocosto.org/cancer/","title":"[Página web] Cáncer – Cuenta de Alto Costo (informes de situación del cáncer en población adulta y pediátrica del SGSSS)","description":"Fondo Colombiano de Enfermedades de Alto Costo – CAC (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Biología del cáncer: oncogenes, genes supresores y características distintivas', 'Clase 2 · Biología del cáncer y cinética tumoral', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las alteraciones genéticas y los ''hallmarks'' del cáncer que sustentan las dianas farmacológicas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=iu6dKf2xqbE","provider":"youtube","videoId":"iu6dKf2xqbE","title":"CICLO CELULAR Y CÁNCER","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.merckvetmanual.com/es-us/farmacología/fármacos-antineoplásicos/descripción-general-de-los-agentes-antineoplásicos","title":"[Página web] Descripción general de los agentes antineoplásicos (versión para profesionales)","description":"Manual Merck/MSD (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Ciclo celular y cinética tumoral: fracción de crecimiento, crecimiento gompertziano y log-kill', 'Clase 2 · Biología del cáncer y cinética tumoral', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta cómo el ciclo celular y la cinética de crecimiento tumoral determinan la eficacia y el esquema de los antineoplásicos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=M-3GKnuD4_I","provider":"youtube","videoId":"M-3GKnuD4_I","title":"CICLO CELULAR. Resumen. Fases: G0, G1, S, G2. Puntos de Control del Ciclo Celular","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=rsOeSFyS9jc","provider":"youtube","videoId":"rsOeSFyS9jc","title":"¿Qué es la Quimioterapia?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://farmamol.web.uah.es/PDF_files/Farma_3MG_T38-39-2021-22.pdf","title":"Farmacología de los antineoplásicos (temas 38–39, curso de Farmacología)","description":"Universidad de Alcalá (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Clasificación general de los antineoplásicos: citotóxicos, hormonales, dirigidos e inmunoterapia', 'Clase 3 · Bases farmacológicas de los antineoplásicos', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los grandes grupos de antineoplásicos según mecanismo, índice terapéutico y perfil de toxicidad (los cursos 02–04 profundizan cada grupo).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=sjvUlVFansQ","provider":"youtube","videoId":"sjvUlVFansQ","title":"FÁRMACOS ANTINEOPLÁSICOS - PARTE 1","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=ovNVh95GIIE","provider":"youtube","videoId":"ovNVh95GIIE","title":"FÁRMACOS ANTINEOPLÁSICOS","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://farmamol.web.uah.es/PDF_files/Farma_3MG_T38-39-2021-22.pdf","title":"Farmacología de los antineoplásicos (temas 38–39, curso de Farmacología)","description":"Universidad de Alcalá (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Resistencia a los antineoplásicos y fundamentos de la poliquimioterapia', 'Clase 3 · Bases farmacológicas de los antineoplásicos', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los mecanismos de resistencia intrínseca y adquirida y su influencia en la combinación y secuencia de tratamientos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: explicar los principales mecanismos de resistencia a los antineoplásicos y su implicación en la selección y secuencia de tratamientos.</p><p>Desarrollo: la resistencia puede ser intrínseca (el tumor no responde desde el inicio) o adquirida (aparece tras una respuesta inicial). La hipótesis de Goldie-Coldman plantea que, a medida que crece la masa tumoral, aumenta la probabilidad de que existan clones con mutaciones espontáneas resistentes; de ahí la lógica de la poliquimioterapia con fármacos de mecanismos distintos y toxicidades no superpuestas, y de tratar tempranamente (adyuvancia) cuando la carga tumoral es mínima. Los mecanismos celulares más relevantes son: (1) disminución de la captación o aumento del eflujo del fármaco por transportadores ABC, como la glicoproteína P (MDR1/ABCB1), responsable de la resistencia cruzada a antraciclinas, taxanos y alcaloides de la vinca; (2) alteración de la diana (mutaciones en receptores o cinasas, amplificación génica, como ocurre con mutaciones de ESR1 frente a inhibidores de aromatasa o variantes del receptor androgénico frente a antiandrógenos); (3) aumento de la reparación del ADN, relevante frente a agentes alquilantes y platinos; (4) inactivación metabólica intracelular (glutatión, metalotioneínas); (5) evasión de la apoptosis (sobreexpresión de BCL-2, pérdida de p53); (6) activación de vías alternas de señalización (escape de la vía bloqueada) y (7) factores del microambiente tumoral, como hipoxia, baja perfusión y células madre tumorales quiescentes en G0. La resistencia farmacocinética también existe: subdosificación por interacciones (inductores de CYP3A4 con terapias orales), mala adherencia o errores de preparación.</p><p>Ejemplo aplicado: en un servicio farmacéutico oncológico de Medellín, una paciente con cáncer de mama receptor hormonal positivo progresa tras dos años de letrozol. El oncólogo solicita estudio de mutación de ESR1 y cambia a una estrategia basada en fulvestrant más un inhibidor de CDK4/6. El QF revisa que la progresión no se explique por falta de adherencia (registro de dispensación, entrevista), descarta interacciones con inductores enzimáticos (p. ej., carbamazepina prescrita por neurología) y documenta el cambio para el reporte a la Cuenta de Alto Costo. Así, el QF contribuye a diferenciar resistencia biológica de fallo terapéutico por causas evitables.</p><p>Puntos clave:<br>1. La poliquimioterapia y el tratamiento temprano buscan reducir la probabilidad de clones resistentes (Goldie-Coldman).<br>2. Los mecanismos incluyen eflujo (glicoproteína P), alteración de la diana, reparación del ADN, evasión de apoptosis y vías alternas.<br>3. Antes de atribuir una progresión a resistencia biológica, el QF debe descartar baja adherencia, interacciones y errores de medicación.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: primera consulta farmacéutica del paciente oncológico', 'Clase 3 · Bases farmacológicas de los antineoplásicos', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica la validación de la prescripción, la conciliación y la educación inicial en un paciente con cáncer de colon que inicia adyuvancia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar las bases farmacológicas del curso a la revisión inicial de un paciente oncológico por parte del Químico Farmacéutico.</p><p>Caso: hombre de 62 años, afiliado al régimen contributivo en Bogotá, con diagnóstico reciente de adenocarcinoma de colon estadio III, intervenido quirúrgicamente. El oncólogo prescribe quimioterapia adyuvante en una Unidad Funcional para la Atención Integral del Cáncer. Antecedentes: hipertensión (losartán), diabetes tipo 2 (metformina), reflujo (omeprazol) y consumo ocasional de productos naturales (cúrcuma, \"té verde concentrado\"). Función renal: TFG estimada de 55 mL/min.</p><p>Desarrollo de la intervención del QF:<br>1. Validación de la prescripción: verificar que el esquema coincida con la GPC de cáncer de colon y recto de MinSalud/IETS y con el protocolo institucional, confirmar peso, talla y superficie corporal, y revisar que el número de ciclos, la vía y la periodicidad sean coherentes. Las dosis deben confrontarse con el protocolo y la ficha técnica, no \"de memoria\".<br>2. Clasificación de los fármacos: identificar a qué grupo pertenece cada medicamento (citotóxico específico o no de fase del ciclo celular, terapia dirigida, soporte), lo que orienta la toxicidad esperada (mielosupresión, mucositis, diarrea, neuropatía).<br>3. Conciliación medicamentosa: registrar todos los medicamentos y productos naturales. Señalar que los suplementos con potencial antioxidante o de interacción metabólica deben consultarse con el oncólogo; evaluar la necesidad de ajustar medicamentos crónicos según función renal y tolerancia digestiva.<br>4. Plan de soporte: confirmar la profilaxis antiemética según el riesgo emetógeno del esquema (MASCC/ESMO) y el plan ante fiebre o diarrea.<br>5. Educación: explicar signos de alarma (fiebre ≥38 °C, diarrea persistente, úlceras orales, sangrado), la importancia de no automedicarse y los canales de contacto 24 horas.<br>6. Farmacovigilancia: dejar trazabilidad para el reporte de eventos adversos al programa institucional e INVIMA.</p><p>Resultado esperado: el QF registra en la historia farmacoterapéutica los problemas identificados (por ejemplo, necesidad de revisar la dosis de metformina según la función renal y la tolerancia digestiva, y la suspensión de los suplementos mientras dure la quimioterapia, previa consulta con el oncólogo), acuerda con el paciente un plan de seguimiento antes de cada ciclo y le entrega material educativo escrito. Esta primera consulta establece la relación de confianza que facilita la detección temprana de toxicidades en los ciclos siguientes.</p><p>Puntos clave:<br>1. La primera consulta farmacéutica integra validación de la prescripción, conciliación, plan de soporte y educación.<br>2. Conocer la clasificación y el mecanismo de cada fármaco permite anticipar toxicidades y priorizar el seguimiento.<br>3. Toda intervención debe documentarse y apoyarse en GPC, protocolos institucionales y fichas técnicas vigentes.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Terapia hormonal en oncología', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: cánceres hormonodependientes', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume el fundamento de la hormonoterapia en cáncer de mama y próstata y su relevancia en la carga de enfermedad en Colombia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=arj8rgK6Y6Y","provider":"youtube","videoId":"arj8rgK6Y6Y","title":"Tratamientos para el cáncer de próstata en etapa temprana","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://komen.org/wp-content/uploads/Hormone-Therapy-for-Early-Breast-Cancer-SPA-3-17-HR.pdf","title":"Terapia hormonal para el cáncer de mama en etapa temprana (material educativo)","description":"Susan G. Komen (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Moduladores y degradadores del receptor de estrógenos: tamoxifeno y fulvestrant', 'Clase 2 · Hormonoterapia en cáncer de mama', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe mecanismo, farmacocinética (activación por CYP2D6), indicaciones, reacciones adversas y monitorización del tamoxifeno y del fulvestrant.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=_BIXilzHYkQ","provider":"youtube","videoId":"_BIXilzHYkQ","title":"How does Tamoxifen (Nolvadex & Soltamox) Work for HR+ Breast Cancer?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/dochtml/ft/63774/FT_63774.html","title":"[Página web] Ficha técnica Tamoxifeno Cinfa 20 mg comprimidos EFG","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Inhibidores de aromatasa: anastrozol, letrozol y exemestano', 'Clase 2 · Hormonoterapia en cáncer de mama', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los inhibidores de aromatasa con el tamoxifeno en eficacia, seguridad (salud ósea, artralgias) y población (posmenopausia).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cima.aemps.es/cima/dochtml/ft/72125/FT_72125.html","title":"[Página web] Ficha técnica Letrozol Cinfa 2,5 mg comprimidos recubiertos EFG","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Privación androgénica: agonistas y antagonistas de GnRH', 'Clase 3 · Hormonoterapia en cáncer de próstata', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el mecanismo de los análogos de GnRH (fenómeno de ''flare'') frente a los antagonistas, y sus efectos metabólicos, óseos y cardiovasculares.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=arj8rgK6Y6Y","provider":"youtube","videoId":"arj8rgK6Y6Y","title":"Tratamientos para el cáncer de próstata en etapa temprana","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://iets.org.co/guia-de-practica-clinica/","title":"[Página web] Guías de Práctica Clínica – IETS (incluye GPC de cáncer de mama y de cáncer de colon y recto)","description":"Instituto de Evaluación Tecnológica en Salud (IETS) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Antiandrógenos e inhibidores de la síntesis androgénica (bicalutamida, enzalutamida, apalutamida, darolutamida, abiraterona)', 'Clase 3 · Hormonoterapia en cáncer de próstata', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara antiandrógenos de primera y nueva generación y la abiraterona en mecanismo, interacciones y reacciones adversas relevantes.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=xsvMLWKLxSk","provider":"youtube","videoId":"xsvMLWKLxSk","title":"Enzalutamide for Biochemically Recurrent Prostate Cancer","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/dochtml/ft/89615/FT_89615.html","title":"[Página web] Ficha técnica Enzalutamida Accord 40 mg cápsulas blandas EFG","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: tamoxifeno, sofocos e interacción con paroxetina', 'Clase 4 · Aplicación práctica', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica la detección y resolución de una interacción CYP2D6 y el abordaje de la adherencia en una paciente con hormonoterapia adyuvante.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: identificar y resolver una interacción clínicamente relevante en terapia hormonal: tamoxifeno con inhibidores potentes de CYP2D6.</p><p>Caso: mujer de 44 años, premenopáusica, con cáncer de mama receptor de estrógenos positivo, HER2 negativo, en tratamiento adyuvante con tamoxifeno desde hace cuatro meses en una IPS de Cali. Consulta por sofocos intensos e insomnio; el médico general le prescribe paroxetina. Al dispensar, el QF detecta la nueva prescripción.</p><p>Análisis: el tamoxifeno es un profármaco; se transforma, principalmente por CYP2D6, en endoxifeno, su metabolito más activo. La ficha técnica (CIMA-AEMPS) indica que los inhibidores potentes de CYP2D6, como paroxetina, fluoxetina, bupropión, quinidina o cinacalcet, reducen los niveles de endoxifeno (estudios reportan reducciones del 65–75%) y deben evitarse siempre que sea posible, ya que se ha descrito posible disminución de la eficacia. Además, la paciente debe vigilarse por los riesgos propios del tamoxifeno: tromboembolismo venoso y alteraciones endometriales (todo sangrado vaginal anormal debe evaluarse).</p><p>Intervención del QF:<br>1. Comunicar la interacción al prescriptor por escrito, con la referencia a la ficha técnica.<br>2. Proponer alternativas para los síntomas vasomotores con menor inhibición de CYP2D6 (por ejemplo, venlafaxina o gabapentina, según criterio médico) y medidas no farmacológicas.<br>3. Revisar otros medicamentos y productos naturales con potencial de interacción y la adherencia al tamoxifeno, ya que los sofocos son una causa frecuente de abandono.<br>4. Educar a la paciente sobre signos de trombosis (dolor o edema en una pierna, disnea súbita) y sangrado vaginal anormal.<br>5. Registrar la intervención como problema relacionado con medicamentos (PRM) y, si se produjo algún evento, reportarlo al programa de farmacovigilancia.</p><p>Seguimiento: en la siguiente dispensación, el QF verifica que el cambio de antidepresivo se haya hecho, evalúa la intensidad de los sofocos y la calidad del sueño, y refuerza la adherencia recordando que la hormonoterapia adyuvante se mantiene durante años y que su beneficio depende de la toma diaria continua. Si la paciente pasa a la posmenopausia o cambia de esquema, el QF actualiza la revisión de interacciones y efectos adversos.</p><p>Puntos clave:<br>1. El tamoxifeno depende de CYP2D6 para generar endoxifeno; los inhibidores potentes de CYP2D6 deben evitarse.<br>2. Los efectos adversos (sofocos) afectan la adherencia y son una oportunidad de intervención farmacéutica.<br>3. La comunicación escrita y documentada con el prescriptor, basada en la ficha técnica, es la herramienta central del QF.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Tratamiento de soporte en el paciente oncológico', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: toxicidades frecuentes y terapia de soporte', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume las principales toxicidades de los antineoplásicos y el papel de la terapia de soporte en la calidad de vida y la adherencia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=aXuwZ1mykl4","provider":"youtube","videoId":"aXuwZ1mykl4","title":"Efectos gastrointestinales por quimioterapia","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://mascc.org/resources/mascc-guidelines/","title":"[Página web] MASCC Guidelines – índice de guías de soporte (antieméticos, mucositis, neutropenia)","description":"MASCC (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Fisiopatología de las NVIQ y clasificación de emetogenicidad MASCC/ESMO', 'Clase 2 · Náuseas y vómitos inducidos por quimioterapia (NVIQ)', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los tipos de NVIQ (aguda, tardía, anticipatoria, irruptiva) y la clasificación actualizada de riesgo emetógeno MASCC/ESMO.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=dDAGKDVyNvs","provider":"youtube","videoId":"dDAGKDVyNvs","title":"Náuseas y Vómito en Quimioterapia","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://link.springer.com/article/10.1007/s00520-023-08220-5","title":"[Página web] Emetic risk classification and evaluation of the emetogenicity of antineoplastic agents – updated MASCC/ESMO consensus recommendation (Jordan K et al., Support Care Cancer 2024)","description":"Supportive Care in Cancer (Springer) (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Antieméticos y esquemas de profilaxis según riesgo', 'Clase 2 · Náuseas y vómitos inducidos por quimioterapia (NVIQ)', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara antagonistas 5-HT3, antagonistas NK1, corticoides y olanzapina, y su combinación según el riesgo emetógeno.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=dDAGKDVyNvs","provider":"youtube","videoId":"dDAGKDVyNvs","title":"Náuseas y Vómito en Quimioterapia","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://link.springer.com/article/10.1007/s00520-023-08221-4","title":"[Página web] MASCC/ESMO Antiemetic Guidelines 2023 – Highly emetogenic chemotherapy","description":"Supportive Care in Cancer (Springer) (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://media.cancercare.org/publications/original/115-fs_nausea_sp.pdf","title":"Náuseas y vómitos inducidos por la quimioterapia (hoja informativa para pacientes)","description":"CancerCare (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Neutropenia febril y factores estimulantes de colonias (filgrastim, pegfilgrastim, biosimilares)', 'Clase 3 · Mielosupresión y mucositis', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la neutropenia inducida por quimioterapia, los criterios de profilaxis primaria y secundaria con G-CSF y su seguimiento.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=H16yIhTbh8c","provider":"youtube","videoId":"H16yIhTbh8c","title":"Neutropenia: During and After Cancer Treatment","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://mascc.org/resources/mascc-guidelines/","title":"[Página web] MASCC Guidelines – índice de guías de soporte (antieméticos, mucositis, neutropenia)","description":"MASCC (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Mucositis oral: prevención y manejo', 'Clase 3 · Mielosupresión y mucositis', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica las medidas de prevención y manejo de la mucositis y la educación al paciente en higiene oral.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=_XFzF8IVyus","provider":"youtube","videoId":"_XFzF8IVyus","title":"Manejo de la mucositis en pacientes oncológicos. #JuntosXElCáncer 2021","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://mascc.org/resources/mascc-guidelines/","title":"[Página web] MASCC Guidelines – índice de guías de soporte (antieméticos, mucositis, neutropenia)","description":"MASCC (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Dolor oncológico: escalera analgésica OMS, guía OMS 2019 y opioides en Colombia', 'Clase 4 · Dolor oncológico', 5, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el abordaje farmacológico del dolor oncológico, la titulación de opioides, los coadyuvantes y el acceso a opioides de control especial en Colombia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=11Kc22k2gXQ","provider":"youtube","videoId":"11Kc22k2gXQ","title":"Escalera analgésica de la OMS","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=EbMD_u6KsKA","provider":"youtube","videoId":"EbMD_u6KsKA","title":"Control del dolor en el paciente oncológico","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.who.int/publications/i/item/9789241550390","title":"[Página web] WHO Guidelines for the pharmacological and radiotherapeutic management of cancer pain in adults and adolescents (2019)","description":"Organización Mundial de la Salud (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: profilaxis antiemética y dolor en paciente con quimioterapia altamente emetógena', 'Clase 4 · Dolor oncológico', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica la selección de profilaxis antiemética, el escalamiento analgésico y la prevención de duplicidades en un caso integrado.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: integrar la profilaxis antiemética, el manejo del dolor y la prevención de complicaciones en un paciente con quimioterapia altamente emetógena.</p><p>Caso: mujer de 55 años con cáncer de pulmón que recibirá un esquema con cisplatino (alto riesgo emetógeno según la clasificación MASCC/ESMO actualizada). Tiene dolor por metástasis óseas que maneja con acetaminofén y tramadol, con control insuficiente (EVA 7/10). Toma también dexametasona prescrita por otro servicio y presenta glucemias elevadas.</p><p>Desarrollo de la intervención:<br>1. Antiemesis: verificar que el esquema prescrito siga la recomendación MASCC/ESMO 2023 para quimioterapia altamente emetógena (combinación de antagonista 5-HT3, antagonista NK1, dexametasona y olanzapina, según guía y criterio médico). El QF confirma dosis y días de dexametasona para evitar duplicidad con la ya prescrita, alerta sobre el control glucémico y revisa interacciones del antagonista NK1 (aprepitant es inhibidor moderado de CYP3A4).<br>2. Dolor: con dolor moderado a intenso y opioide débil insuficiente, la guía OMS 2019 respalda iniciar opioides potentes (p. ej., morfina) con titulación individual y analgesia por horario, más rescates. Las metástasis óseas pueden requerir radioterapia y fármacos modificadores del hueso. El QF verifica la disponibilidad del opioide (medicamento de control especial, Fondo Nacional de Estupefacientes) y la entrega oportuna.<br>3. Prevención de efectos de opioides: prescribir laxante desde el inicio, vigilar sedación y náuseas; considerar interacción de tramadol con fármacos serotoninérgicos si se mantiene.<br>4. Educación y seguimiento: diario de náuseas y dolor, signos de alarma, técnica de rescate, almacenamiento seguro del opioide en casa.<br>5. Evaluación de resultados: a las 48–72 horas el QF contacta a la paciente para verificar el control de las náuseas tardías y del dolor. Si hay vómitos irruptivos, se comunica al oncólogo para ajustar el rescate antiemético; si el dolor persiste, se propone ajustar la titulación. Los eventos no esperados se reportan a farmacovigilancia y el ciclo siguiente se planea con la información obtenida.<br>6. Hidratación y función renal: dado que el esquema incluye cisplatino, el QF verifica que el protocolo de hidratación y la monitorización de electrolitos y creatinina estén prescritos.</p><p>Puntos clave:<br>1. La profilaxis antiemética se elige según el potencial emetógeno del esquema completo, no de un solo fármaco.<br>2. El dolor oncológico requiere analgesia por horario, titulación y prevención del estreñimiento.<br>3. El QF previene duplicidades (corticoides), interacciones y barreras de acceso a opioides.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Manejo seguro de medicamentos peligrosos y farmacia oncológica', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: riesgo ocupacional y seguridad del paciente en oncología', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume los riesgos de exposición ocupacional a medicamentos peligrosos y los riesgos de errores en el proceso oncológico.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=n9RtSC59gns","provider":"youtube","videoId":"n9RtSC59gns","title":"Preparación de medicamentos biopeligrosos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cdc.gov/niosh/healthcare/hazardous-drugs/index.html","title":"[Página web] Hazardous Drugs Exposures in Healthcare – portal NIOSH (lista 2024, manejo de exposiciones, EPP, vigilancia médica)","description":"CDC / NIOSH (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Medicamentos peligrosos: lista NIOSH 2024 y estándar USP <800>', 'Clase 2 · Marco técnico y normativo', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los criterios NIOSH de medicamento peligroso, la estructura de la lista 2024 y los controles de ingeniería, EPP y procedimientos de USP &lt;800&gt;.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=B7hwi_zFj28","provider":"youtube","videoId":"B7hwi_zFj28","title":"USP 800 Hazardous Drugs: Safe Compounding & Chemotherapy","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cdc.gov/niosh/publications/hcp/numbered/2025-103.html","title":"[Página web] NIOSH List of Hazardous Drugs in Healthcare Settings, 2024 (Publicación DHHS-NIOSH 2025-103)","description":"CDC / NIOSH (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.wolterskluwer.com/en-in/expert-insights/changes-in-the-2024-niosh-list-demand-a-robust-organizational-response","title":"[Página web] Changes in the 2024 NIOSH list demand a robust organizational response (USP <800>)","description":"Wolters Kluwer Expert Insights (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Central de mezclas en Colombia: Resolución 444 de 2008 (BPE) y Ley 1384 de 2010', 'Clase 2 · Marco técnico y normativo', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los requisitos de Buenas Prácticas de Elaboración para mezclas de oncológicos y la obligación de central de mezclas en las Unidades Funcionales.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minproteccion_0444_2008.htm","title":"[Página web] Resolución 444 de 2008 – Instrumento de verificación de cumplimiento de Buenas Prácticas de Elaboración (incluye numeral de mezclas de medicamentos oncológicos)","description":"Normograma INVIMA / MinSalud (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/ley_1384_2010.htm","title":"[Página web] Ley 1384 de 2010 (Ley Sandra Ceballos) – acciones para la atención integral del cáncer en Colombia (con notas de modificación Leyes 2194/2022 y 2360/2024)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Exposición accidental, derrames y residuos de medicamentos citotóxicos', 'Clase 3 · Farmacia oncológica y rol del QF', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica los procedimientos de respuesta ante derrames y exposiciones accidentales y la gestión de residuos de citotóxicos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=FXa9rjeV7PU","provider":"youtube","videoId":"FXa9rjeV7PU","title":"Qué hacer en caso de accidentes con Citostáticos o medicamentos antineoplásicos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cdc.gov/niosh/publications/hcp/numbered/2023-130.html","title":"[Página web] Managing Hazardous Drug Exposures: Information for Healthcare Settings (NIOSH 2023-130)","description":"CDC / NIOSH (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Rol del QF en farmacia oncológica: validación, prevención de errores y oncología oral', 'Clase 3 · Farmacia oncológica y rol del QF', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las funciones del QF en validación de órdenes, verificación de dosis, conciliación, educación y seguimiento de antineoplásicos orales.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=W64qVRw8ZpE","provider":"youtube","videoId":"W64qVRw8ZpE","title":"Gestión de Riesgos en el Uso de Medicamentos: Herramientas para mejorar la Seguridad del Paciente","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minproteccion_0444_2008.htm","title":"[Página web] Resolución 444 de 2008 – Instrumento de verificación de cumplimiento de Buenas Prácticas de Elaboración (incluye numeral de mezclas de medicamentos oncológicos)","description":"Normograma INVIMA / MinSalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: derrame en la central de mezclas y error de dosis interceptado', 'Clase 3 · Farmacia oncológica y rol del QF', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta el procedimiento ante un derrame y la validación de una orden con peso desactualizado.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar el procedimiento de respuesta ante un derrame de medicamento peligroso y la validación farmacéutica en la central de mezclas.</p><p>Caso: en la central de mezclas de una IPS oncológica en Barranquilla, durante el traslado de una bolsa con un citotóxico preparado, el auxiliar la deja caer en el pasillo y se rompe, con un derrame de unos 200 mL. Ese mismo turno, al revisar una orden, el QF detecta que la dosis prescrita de un citotóxico se calculó con un peso desactualizado (el paciente perdió 9 kg).</p><p>Respuesta al derrame:<br>1. Aislar y señalizar el área; alejar a otras personas.<br>2. Usar el kit de derrames: doble guante para quimioterapia, bata impermeable, protección ocular y respiratoria según el procedimiento institucional (alineado con NIOSH y USP &lt;800&gt;).<br>3. Contener con material absorbente desde la periferia hacia el centro, recoger los fragmentos con pala (nunca con las manos) y depositar todo en contenedor rotulado para residuos de medicamentos citotóxicos.<br>4. Descontaminar, desactivar, limpiar y desinfectar la superficie según el procedimiento escrito.<br>5. Si hubo contacto con piel u ojos: lavado inmediato y abundante, valoración por salud ocupacional y registro como accidente de trabajo.<br>6. Documentar el incidente, analizar la causa (transporte sin contenedor secundario) y definir acciones de mejora.<br>7. Gestionar la nueva preparación y notificar el retraso al servicio de administración.</p><p>Validación de la orden: el QF verifica el peso actual, recalcula la superficie corporal, contacta al oncólogo para confirmar la dosis, deja constancia de la intervención y la clasifica como error de medicación interceptado. La Resolución 444 de 2008 exige procedimientos escritos para la validación de órdenes, el rotulado (\"medicamento oncológico de manipulación riesgosa\") y el manejo de mezclas devueltas.</p><p>Análisis posterior: el comité de seguridad del paciente revisa ambos eventos con una metodología de análisis de causa raíz, actualiza el procedimiento de transporte y establece la verificación obligatoria del peso del día en cada ciclo. Se refuerza el entrenamiento periódico del personal en el procedimiento de derrames.</p><p>Puntos clave:<br>1. Toda central de mezclas debe tener kit y procedimiento de derrames, con personal entrenado.<br>2. El transporte de mezclas peligrosas debe hacerse en contenedor secundario cerrado y rotulado.<br>3. La validación farmacéutica de la orden (peso, superficie corporal, protocolo, función orgánica) intercepta errores antes de la preparación.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Contexto colombiano y farmacovigilancia oncológica', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: el control del cáncer en Colombia', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la política de control del cáncer, los actores del sistema y los retos de acceso y calidad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/PP/ENT/plan-choque-fortalecimiento-acciones-dirigidas-control-cancer-colombia.pdf","title":"Plan de choque para el fortalecimiento de las acciones para el control del cáncer en Colombia 2025","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cuentadealtocosto.org/cancer/","title":"[Página web] Cáncer – Cuenta de Alto Costo (informes de situación del cáncer en población adulta y pediátrica del SGSSS)","description":"Fondo Colombiano de Enfermedades de Alto Costo – CAC (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Ley 1384 de 2010 (Sandra Ceballos), sus modificaciones y las Unidades Funcionales', 'Clase 2 · Marco normativo, información y acceso', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el objeto de la Ley 1384, las Unidades Funcionales (Res. 1477 de 2016), el rol del INC (Ley 2291 de 2023) y las modificaciones recientes (Ley 2360 de 2024).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/ley_1384_2010.htm","title":"[Página web] Ley 1384 de 2010 (Ley Sandra Ceballos) – acciones para la atención integral del cáncer en Colombia (con notas de modificación Leyes 2194/2022 y 2360/2024)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/PP/ENT/plan-choque-fortalecimiento-acciones-dirigidas-control-cancer-colombia.pdf","title":"Plan de choque para el fortalecimiento de las acciones para el control del cáncer en Colombia 2025","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Cuenta de Alto Costo y Guías de Práctica Clínica de cáncer (mama, próstata, colon y recto)', 'Clase 2 · Marco normativo, información y acceso', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los indicadores de la CAC y el uso de las GPC MinSalud/IETS como referencia para validar esquemas terapéuticos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cuentadealtocosto.org/cancer/","title":"[Página web] Cáncer – Cuenta de Alto Costo (informes de situación del cáncer en población adulta y pediátrica del SGSSS)","description":"Fondo Colombiano de Enfermedades de Alto Costo – CAC (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cuentadealtocosto.org/situacion-del-cancer-en-la-poblacion-adulta-atendida-en-el-sgsss-de-colombia-en-2024/","title":"[Página web] Situación del cáncer en la población adulta atendida en el SGSSS de Colombia en 2024","description":"Cuenta de Alto Costo (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://iets.org.co/guia-de-practica-clinica/","title":"[Página web] Guías de Práctica Clínica – IETS (incluye GPC de cáncer de mama y de cáncer de colon y recto)","description":"Instituto de Evaluación Tecnológica en Salud (IETS) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Acceso a medicamentos oncológicos: PBS/UPC, MIPRES y barreras', 'Clase 2 · Marco normativo, información y acceso', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica las reglas de financiación y prescripción de tecnologías oncológicas y la gestión farmacéutica del acceso.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: describir cómo acceden los pacientes colombianos a los medicamentos oncológicos y el papel del QF en la gestión de ese acceso.</p><p>Desarrollo: en el Sistema General de Seguridad Social en Salud (SGSSS), las tecnologías se financian por dos vías: (1) las incluidas en el Plan de Beneficios en Salud con cargo a la UPC, cuyos listados actualiza periódicamente el Ministerio de Salud, y (2) las no financiadas con la UPC, que se prescriben mediante la herramienta MIPRES y se pagan con presupuestos máximos o mecanismos que defina la regulación vigente. Muchos antineoplásicos de alto costo (terapias dirigidas, inmunoterapia) se prescriben por MIPRES; los listados y reglas cambian con frecuencia, por lo que el QF debe consultar siempre la norma vigente del Ministerio. Para el cáncer existen reglas particulares: la Ley 1384 de 2010 obliga a que los servicios oncológicos se presten en Unidades Funcionales con central de mezclas para antineoplásicos; la Resolución 4331 de 2012 establece que la autorización de quimioterapia basada en guías o protocolos cubre todo el tratamiento; y el Decreto 441 de 2022 eliminó la exigencia de autorización previa para la atención integral del cáncer (según el Plan de choque de MinSalud 2025). La Resolución 1604 de 2013 regula la entrega de medicamentos pendientes. Para los opioides, el Fondo Nacional de Estupefacientes y la Circular 022 de 2016 buscan garantizar su disponibilidad en cuidados paliativos. Las barreras más frecuentes son demoras en autorizaciones, fragmentación de la red, desabastecimientos (que se pueden revisar en el listado de medicamentos vitales no disponibles y alertas del INVIMA) y tutelas.</p><p>Rol del QF: verificar que la prescripción MIPRES corresponda al diagnóstico, indicación aprobada por el INVIMA o uso incluido en listados oficiales; gestionar la oportunidad de la dispensación; identificar desabastecimientos y alternativas terapéuticas; documentar para la Cuenta de Alto Costo; y educar al paciente sobre sus derechos.</p><p>Ejemplo aplicado: un paciente con cáncer de próstata metastásico recibe prescripción de un antiandrógeno de nueva generación por MIPRES. El QF confirma que la indicación concuerda con el registro sanitario INVIMA, revisa interacciones (p. ej., inductores de CYP3A4) y hace seguimiento a la entrega para evitar interrupciones del tratamiento.</p><p>Puntos clave:<br>1. Los oncológicos se financian por UPC o, si no están financiados, se prescriben por MIPRES; la normativa cambia y debe verificarse siempre.<br>2. La Ley 1384 de 2010 y el Decreto 441 de 2022 buscan eliminar barreras administrativas en cáncer.<br>3. El QF es garante de la oportunidad, la pertinencia y la continuidad del tratamiento.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Farmacovigilancia oncológica: detección, graduación (CTCAE), causalidad y reporte al INVIMA', 'Clase 3 · Farmacovigilancia y caso integrador', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica las herramientas de farmacovigilancia a eventos adversos, errores y fallas terapéuticas en oncología.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar los principios de farmacovigilancia al paciente oncológico en el marco del Programa Nacional de Farmacovigilancia del INVIMA.</p><p>Desarrollo: en oncología, los eventos adversos son frecuentes, graves y a menudo esperados, lo que paradójicamente lleva a reportar menos. Además, los nuevos fármacos (terapias dirigidas, inmunoterapia, biosimilares) llegan con información limitada de seguridad. La farmacovigilancia oncológica busca: (1) detectar reacciones adversas no conocidas o más graves de lo esperado; (2) identificar errores de medicación (prescripción, preparación en la central de mezclas, administración, dispensación de orales); (3) evaluar fallas terapéuticas y problemas de calidad (por ejemplo, con medicamentos genéricos o biosimilares, en relación con el parágrafo del artículo 18 de la Ley 1384 de 2010 sobre calidad, eficacia y seguridad de los oncológicos); y (4) vigilar la intercambiabilidad. La gravedad de la toxicidad se gradúa con los Criterios Comunes de Terminología para Eventos Adversos (CTCAE) del NCI, y la causalidad se evalúa con algoritmos como el de la OMS-UMC o el de Naranjo. Los reportes se envían a través de los canales que define el INVIMA para el Programa Nacional de Farmacovigilancia; el QF debe verificar la plataforma y los plazos vigentes (los eventos serios tienen plazos más cortos que los no serios). También se deben consultar periódicamente las alertas sanitarias del INVIMA y las comunicaciones de seguridad de otras agencias.</p><p>Ejemplo aplicado: en un programa de oncología oral de una EPS, el QF identifica en el seguimiento telefónico que tres pacientes en tratamiento con el mismo antiandrógeno presentan caídas. Revisa la ficha técnica (se describen caídas y fracturas), gradúa la gravedad con CTCAE, evalúa causalidad, reporta los casos al INVIMA, comunica al oncólogo y diseña una estrategia educativa de prevención de caídas para adultos mayores.</p><p>Buenas prácticas para el servicio farmacéutico: incluir preguntas sistemáticas de seguridad en cada dispensación de oncológicos orales, mantener una base de datos de eventos por medicamento y lote, retroalimentar a los prescriptores con los hallazgos y participar en el comité de farmacia y terapéutica para proponer barreras de seguridad.</p><p>Puntos clave:<br>1. Que un evento sea \"esperado\" en oncología no exime de reportarlo; la información de seguridad poscomercialización es esencial.<br>2. CTCAE para gravedad y OMS-UMC/Naranjo para causalidad son herramientas estándar.<br>3. Los errores de medicación y las fallas de calidad o terapéuticas también se reportan.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso integrador: paciente con cáncer de mama metastásico en zona rural', 'Clase 3 · Farmacovigilancia y caso integrador', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta un plan de atención farmacéutica que integra acceso, seguimiento, farmacovigilancia y registro en un caso colombiano realista.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: integrar contexto normativo colombiano, acceso, seguimiento farmacoterapéutico y farmacovigilancia en un caso oncológico completo.</p><p>Caso: mujer de 67 años, régimen subsidiado, residente en un municipio de Boyacá, con cáncer de mama metastásico receptor hormonal positivo. Recibe letrozol y se le prescribe una terapia dirigida asociada por MIPRES. Tiene osteoporosis, enfermedad renal crónica estadio 3 y toma ocho medicamentos. Debe viajar 3 horas a Tunja para sus citas en la Unidad Funcional.</p><p>Intervención del QF:<br>1. Acceso: verificar que la prescripción MIPRES corresponda a una indicación aprobada en el registro sanitario INVIMA, que la autorización no sea exigida como barrera (Decreto 441 de 2022) y coordinar con la EPS la entrega oportuna, idealmente con dispensación en su municipio o domicilio. Ante desabastecimiento, consultar alertas y listado de vitales no disponibles del INVIMA.<br>2. Seguimiento farmacoterapéutico: revisar interacciones de la terapia dirigida (muchas dependen de CYP3A4), ajustes por función renal según ficha técnica, y el efecto de los inhibidores de aromatasa sobre la densidad ósea (artralgias, pérdida ósea): coordinar suplementación de calcio y vitamina D y la valoración de terapia antirresortiva.<br>3. Polifarmacia: deprescripción de medicamentos sin indicación vigente, en acuerdo con el equipo médico.<br>4. Farmacovigilancia: seguimiento de hemograma y eventos adversos según el plan del oncólogo, graduación con CTCAE y reporte al INVIMA.<br>5. Registro: asegurar que la información de tratamiento quede disponible para el reporte a la Cuenta de Alto Costo (Resolución 247 de 2014).<br>6. Educación: calendario de toma, manejo de olvidos, signos de alarma y apoyo de la red familiar; derechos del paciente oncológico según la Ley 1384 de 2010.</p><p>Resultado: tras la intervención, la paciente recibe su medicamento sin interrupciones, se suspenden dos medicamentos sin indicación y se programa seguimiento telefónico mensual. El QF evalúa en cada contacto la adherencia, la tolerancia y la calidad de vida, y documenta los indicadores del programa (oportunidad de entrega, eventos adversos reportados, PRM resueltos), que pueden presentarse al comité institucional como evidencia del valor del servicio farmacéutico.</p><p>Puntos clave:<br>1. La atención farmacéutica oncológica en Colombia integra clínica, acceso y normativa.<br>2. Las barreras geográficas y administrativas son causa de interrupción del tratamiento; el QF las detecta y gestiona.<br>3. La documentación alimenta la farmacovigilancia y los sistemas de información nacionales (CAC).</p>"}'::jsonb);

END
$curso$;

-- ─── 2. Curso de Quimioterapia Antineoplásica (32 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Quimioterapia Antineoplásica' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Quimioterapia Antineoplásica', 'Curso centrado en los citotóxicos clásicos: alquilantes, antimetabolitos, antraciclinas, inhibidores de topoisomerasa y antimicrotúbulos. Desarrolla las competencias del químico farmacéutico en cálculo de dosis, validación de la prescripción, preparación segura, manejo de extravasaciones y toxicidades, interacciones y quimioterapia oral, con casos clínicos en el contexto…', '<p>Curso centrado en los citotóxicos clásicos: alquilantes, antimetabolitos, antraciclinas, inhibidores de topoisomerasa y antimicrotúbulos. Desarrolla las competencias del químico farmacéutico en cálculo de dosis, validación de la prescripción, preparación segura, manejo de extravasaciones y toxicidades, interacciones y quimioterapia oral, con casos clínicos en el contexto colombiano.</p><h3>Objetivo general</h3><p>Que el químico farmacéutico aplique el conocimiento farmacológico de los citotóxicos para validar, preparar y hacer seguimiento seguro de la quimioterapia antineoplásica, previniendo errores de medicación y toxicidades en el sistema de salud colombiano.</p><h3>A quién va dirigido</h3><p>Químicos farmacéuticos de servicios farmacéuticos hospitalarios, centrales de mezclas y unidades oncológicas en Colombia; regentes y estudiantes de último año de Química Farmacéutica.</p><h3>Contexto normativo</h3><p>Colombia — GPC MinSalud/IETS, PBS/MIPRES, INVIMA</p>',
          'Farmacología', 'intermedio', 'Que el químico farmacéutico aplique el conocimiento farmacológico de los citotóxicos para validar, preparar y hacer seguimiento seguro de la quimioterapia antineoplásica, previniendo errores de medicación y toxicidades en el sistema de salud colombiano.', 'Químicos farmacéuticos de servicios farmacéuticos hospitalarios, centrales de mezclas y unidades oncológicas en Colombia; regentes y estudiantes de último año de Química Farmacéutica.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Fundamentos de la quimioterapia citotóxica y agentes alquilantes', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: el QF en la quimioterapia antineoplásica', 'Clase 1 · Introducción al curso', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Presenta el alcance del curso, el papel del químico farmacéutico en la cadena de la quimioterapia citotóxica y el marco colombiano (Ley 1384 de 2010, Cuenta de Alto Costo, PBS).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=sjvUlVFansQ","provider":"youtube","videoId":"sjvUlVFansQ","title":"FÁRMACOS ANTINEOPLÁSICOS - PARTE 1","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cancer.org/es/tratamiento/tratamientos-y-efectos-secundarios/tipos-de-tratamiento/quimioterapia/como-funcionan-los-medicamentos-de-quimioterapia.html","title":"[Página web] Tipos de medicamentos de quimioterapia","description":"American Cancer Society (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Ciclo celular, fármacos fase-específicos y principios de combinación', 'Clase 2 · Bases farmacológicas de la quimioterapia citotóxica', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Relaciona el ciclo celular con los mecanismos de los citotóxicos y explica los principios de la poliquimioterapia, con FOLFOX, AC-T y CHOP como ejemplos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=t7QDJOXeux4&vl=hi","provider":"youtube","videoId":"t7QDJOXeux4","title":"Pharmacology - Chemotherapy agents (MOA, Alkalating, antimetabolites, topoisomerase, antimitotic)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cancer.org/es/tratamiento/tratamientos-y-efectos-secundarios/tipos-de-tratamiento/quimioterapia/como-funcionan-los-medicamentos-de-quimioterapia.html","title":"[Página web] Tipos de medicamentos de quimioterapia","description":"American Cancer Society (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Clasificación de los citotóxicos y mapa de toxicidades', 'Clase 2 · Bases farmacológicas de la quimioterapia citotóxica', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ordena los grupos de citotóxicos (alquilantes, antimetabolitos, antraciclinas, inhibidores de topoisomerasa, antimicrotúbulos) y su toxicidad limitante.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=JFFyYDQoIqc","provider":"youtube","videoId":"JFFyYDQoIqc","title":"Antineoplásicos citotóxicos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=j7_5w_UHGn0","provider":"youtube","videoId":"j7_5w_UHGn0","title":"Antineoplásicos - Parte II - Fármacos antineoplásicos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Ciclofosfamida e ifosfamida: activación, cistitis hemorrágica y mesna', 'Clase 3 · Agentes alquilantes y platinos', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la activación hepática de las oxazafosforinas, la cistitis hemorrágica por acroleína y su prevención con mesna e hidratación, y la encefalopatía por ifosfamida.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=NkQgdPCSqd8","provider":"youtube","videoId":"NkQgdPCSqd8","title":"AGENTES ALQUILANTES, UNA REVISIÓN HISTÓRICO-FARMACOLÓGICA","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/86548/FT_86548.pdf","title":"Ficha técnica – Ciclofosfamida Dr. Reddys 500 mg/ml","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Platinos: cisplatino, carboplatino y oxaliplatino', 'Clase 3 · Agentes alquilantes y platinos', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los tres platinos en mecanismo, potencial emetógeno, nefro-, oto- y neurotoxicidad, hipersensibilidad y manejo práctico.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cima.aemps.es/cima/pdfs/ft/62107/FT_62107.pdf","title":"Ficha técnica – Cisplatino Pharmacia 1 mg/ml","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/62123/FT_62123.pdf","title":"Ficha técnica – Carboplatino Pharmacia 10 mg/ml (incluye fórmula de Calvert)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: seguimiento de un paciente con cisplatino', 'Clase 4 · Caso clínico de la unidad', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso de cáncer de cabeza y cuello con cisplatino concomitante: el QF detecta deterioro renal, hipomagnesemia, AINE concomitante y ototoxicidad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar el seguimiento farmacoterapéutico a un paciente que recibe cisplatino a dosis altas, identificando y previniendo nefrotoxicidad, alteraciones electrolíticas, ototoxicidad y emesis.</p><p>Desarrollo: el cisplatino es un platino que forma enlaces cruzados en el ADN; su toxicidad limitante es renal (daño del túbulo proximal) y se acompaña de pérdida de magnesio y potasio, ototoxicidad acumulativa, neuropatía sensitiva y una emesis de alto potencial emetógeno con fase aguda y tardía. La prevención depende de tres pilares que el QF debe verificar en cada ciclo: (1) función renal previa (creatinina y depuración estimada; el protocolo institucional define el umbral bajo el cual se cambia a carboplatino o se ajusta), (2) hidratación con solución salina antes y después de la infusión con reposición de magnesio y potasio según protocolo, y (3) profilaxis antiemética para quimioterapia altamente emetógena según la guía institucional (MASCC/ESMO o ASCO). Además debe revisar nefrotóxicos concomitantes (aminoglucósidos, AINE, vancomicina, medio de contraste) y ototóxicos (aminoglucósidos, diuréticos de asa a dosis altas).</p><p>Caso aplicado (Colombia): hombre de 58 años, carcinoma escamoso de cabeza y cuello, en un centro oncológico de Bucaramanga. Recibe cisplatino concomitante con radioterapia. Peso 62 kg, creatinina previa 1,1 mg/dL (basal 0,8), magnesio 1,4 mg/dL. En su lista de medicamentos aparece ibuprofeno para odinofagia y gentamicina tópica. Refiere tinnitus desde el ciclo anterior. Intervención del QF: (a) alerta al oncólogo por el aumento de creatinina y solicita recalcular la depuración con Cockcroft-Gault antes de liberar la mezcla; (b) recomienda suspender el AINE y ofrecer analgesia sin efecto renal, coordinando con clínica del dolor; (c) verifica que la orden incluya hidratación prequimioterapia y reposición de magnesio; (d) sugiere audiometría por el tinnitus y documenta el evento en el programa institucional de farmacovigilancia (reporte a INVIMA vía plataforma de reporte en línea); (e) confirma la profilaxis antiemética de 3 días y educa al paciente sobre ingesta de líquidos y signos de alarma. El oncólogo decide diferir el ciclo 48 horas y repetir creatinina.</p><p>Puntos clave:<br>1. Antes de cada ciclo de cisplatino, valida función renal, magnesio y potasio, y la presencia de hidratación y antieméticos en la orden.<br>2. Busca activamente nefrotóxicos y ototóxicos concomitantes; el AINE \"inofensivo\" es un hallazgo frecuente.<br>3. Documenta y reporta las reacciones adversas (tinnitus, elevación de creatinina) al programa de farmacovigilancia.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Antimetabolitos', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a los antimetabolitos', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume cómo los análogos de folato, pirimidinas y purinas interfieren la síntesis de ADN y por qué su toxicidad es dependiente del esquema.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=siUJyw9oi4o","provider":"youtube","videoId":"siUJyw9oi4o","title":"Antineoplásicos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cancer.org/es/tratamiento/tratamientos-y-efectos-secundarios/tipos-de-tratamiento/quimioterapia/como-funcionan-los-medicamentos-de-quimioterapia.html","title":"[Página web] Tipos de medicamentos de quimioterapia","description":"American Cancer Society (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Metotrexato: mecanismo, farmacocinética y toxicidad', 'Clase 2 · Antifolatos: metotrexato', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Explica la inhibición de la dihidrofolato reductasa, la eliminación renal, el tercer espacio y las toxicidades principales del metotrexato oncológico.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=igy_-ds36bg","provider":"youtube","videoId":"igy_-ds36bg","title":"Farmacología: Mecanismo de Acción del METOTREXATO","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/79440/FT_79440.pdf","title":"Ficha técnica – Metotrexato Accord 100 mg/ml concentrado para perfusión (rescate con folinato)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Metotrexato a dosis altas: rescate con leucovorina y monitorización de niveles', 'Clase 2 · Antifolatos: metotrexato', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el procedimiento de hidratación, alcalinización urinaria, niveles séricos seriados y rescate con folinato cálcico, y menciona glucarpidasa en eliminación retardada.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=igy_-ds36bg","provider":"youtube","videoId":"igy_-ds36bg","title":"Farmacología: Mecanismo de Acción del METOTREXATO","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/79440/FT_79440.pdf","title":"Ficha técnica – Metotrexato Accord 100 mg/ml concentrado para perfusión (rescate con folinato)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, '5-fluorouracilo y capecitabina: DPD, modulación con leucovorina y toxicidad', 'Clase 3 · Antagonistas de pirimidinas', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Explica el mecanismo de las fluoropirimidinas, el papel de la DPD y la recomendación de evaluarla antes de iniciar, y la toxicidad según bolo, infusión u oral.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=sPRn8KDrSwI","provider":"youtube","videoId":"sPRn8KDrSwI","title":"Mecanismo del 5-Fluorouracilo","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=BN4VPbofAbo","provider":"youtube","videoId":"BN4VPbofAbo","title":"Profármacos del 5-Fluorouracilo: Flucitosina y Capecitabina","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://cima.aemps.es/cima/pdfs/ft/84872/FT_84872.pdf","title":"Ficha técnica – Capecitabina Glenmark 500 mg (DPD, brivudina, warfarina, ajuste renal)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Gemcitabina y citarabina', 'Clase 3 · Antagonistas de pirimidinas', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los análogos de nucleósidos gemcitabina y citarabina, su toxicidad característica (síndrome de citarabina, toxicidad cerebelosa y conjuntival a dosis altas, toxicidad pulmonar por gemcitabina).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=5xkglXMZzDE","provider":"youtube","videoId":"5xkglXMZzDE","title":"FARMACOS ANTINEOPLASICOS","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/74082/FT_74082.pdf","title":"Ficha técnica – Gemcitabina Hospira 1000 mg","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://cima.aemps.es/cima/pdfs/ft/49154/FT_49154.pdf","title":"Ficha técnica – Citarabina Pfizer 100 mg","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: capecitabina, DPD, warfarina y función renal', 'Clase 4 · Caso clínico de la unidad', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso de adyuvancia en cáncer de colon donde el QF ajusta la dosis por función renal, gestiona la prueba de DPD y la interacción con warfarina.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: resolver un caso de capecitabina en el que confluyen deficiencia de dihidropirimidina deshidrogenasa (DPD), interacción con warfarina y ajuste por función renal.</p><p>Desarrollo: la capecitabina es un profármaco oral que se convierte en 5-fluorouracilo (5-FU) preferentemente en el tejido tumoral. Más del 80 % del 5-FU se cataboliza por la DPD (gen DPYD); los pacientes con deficiencia parcial o completa acumulan el fármaco y pueden presentar mucositis, diarrea, síndrome mano-pie y mielosupresión graves o fatales. La ficha técnica europea recomienda determinar la actividad de DPD (genotipo y/o fenotipo, p. ej., uracilo plasmático) antes de iniciar: la deficiencia completa contraindica el tratamiento y la parcial obliga a reducir la dosis inicial. En Colombia la disponibilidad de la prueba varía entre IPS, por lo que el QF debe conocer cómo se solicita en su red y cómo documentarla. La capecitabina inhibe CYP2C9 y aumenta de forma importante el INR en pacientes con warfarina; la brivudina está contraindicada por inhibir la DPD. Con depuración de creatinina entre 30 y 50 mL/min se reduce la dosis inicial de 1.250 mg/m² al 75 %, y por debajo de 30 mL/min está contraindicada.</p><p>Caso aplicado: mujer de 71 años en Medellín, adenocarcinoma de colon estadio III, inicia capecitabina adyuvante. Anticoagulada con warfarina por fibrilación auricular (INR estable 2,4). Depuración de creatinina calculada 42 mL/min. No tiene prueba de DPD. Intervención del QF: (1) señala que la dosis prescrita (1.250 mg/m²) requiere reducción al 75 % por función renal; (2) recomienda solicitar la prueba de DPD antes del primer ciclo o, si no está disponible a tiempo, documentar la decisión médica y planear vigilancia estrecha de toxicidad temprana; (3) comunica la interacción con warfarina, sugiere control de INR semanal al inicio y discute con el médico tratante la alternativa de un anticoagulante directo si es apropiado; (4) educa a la paciente: tomar los comprimidos dentro de los 30 minutos posteriores a desayuno y cena, no partir ni triturar, esquema de 14 días con 7 de descanso, y consultar ante diarrea de 4 o más deposiciones al día, llagas en la boca o enrojecimiento doloroso de manos y pies; (5) registra el plan en la historia y programa llamada de seguimiento al día 7.</p><p>Puntos clave:<br>1. Antes de una fluoropirimidina, verifica la evaluación de DPD y la función renal.<br>2. Capecitabina más warfarina exige monitorización estrecha del INR; brivudina está contraindicada.<br>3. La educación sobre toxicidad temprana y la llamada de seguimiento evitan hospitalizaciones.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Antraciclinas, inhibidores de topoisomerasa y antimicrotúbulos', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción: citotóxicos de origen natural', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Presenta antraciclinas, camptotecinas, epipodofilotoxinas, taxanos y alcaloides de la vinca como grupos derivados de productos naturales.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=j7_5w_UHGn0","provider":"youtube","videoId":"j7_5w_UHGn0","title":"Antineoplásicos - Parte II - Fármacos antineoplásicos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.salusplay.com/apuntes/apuntes-de-farmacologia/antineoplasicos-derivados-de-plantas/resumen","title":"[Página web] Antineoplásicos derivados de Plantas","description":"Salusplay (apuntes de farmacología) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Antraciclinas: mecanismo, cardiotoxicidad y dosis acumulada', 'Clase 2 · Antraciclinas', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Explica la intercalación y la inhibición de la topoisomerasa II, el mecanismo de cardiotoxicidad y el control de la dosis acumulada de doxorrubicina y epirrubicina.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=0y5Eb7zgyo4","provider":"youtube","videoId":"0y5Eb7zgyo4","title":"Antineoplásicos. Antibióticos citotóxicos RÁPIDAMENTE!","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ncbi.nlm.nih.gov/sites/books/NBK459232/","title":"[Página web] Doxorubicin – StatPearls","description":"NCBI Bookshelf – StatPearls (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://cima.aemps.es/cima/pdfs/ft/73266/FT_73266.pdf","title":"Ficha técnica – Doxorubicina Accord 2 mg/ml","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Monitorización cardiológica y cardioprotección', 'Clase 2 · Antraciclinas', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la evaluación basal y seriada de la fracción de eyección, los factores de riesgo y el papel del dexrazoxano en la cardioprotección.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=0dk_jjKeQxc","provider":"youtube","videoId":"0dk_jjKeQxc","title":"Cardiotoxicidad por antraciclinas (Doxorrubicina) - mecanismo de acción, seguimiento, tratamiento","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ncbi.nlm.nih.gov/sites/books/NBK459232/","title":"[Página web] Doxorubicin – StatPearls","description":"NCBI Bookshelf – StatPearls (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Irinotecán, topotecán y etopósido', 'Clase 3 · Inhibidores de topoisomerasa', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los inhibidores de topoisomerasa I y II, la diarrea temprana colinérgica y tardía del irinotecán, el papel de UGT1A1 y la hipotensión e hipersensibilidad del etopósido.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cima.aemps.es/cima/pdfs/ft/88929/FT_88929.pdf","title":"Ficha técnica – Irinotecán Glenmark 20 mg/ml","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/63625/FT_63625.pdf","title":"Ficha técnica – Etopósido Sandoz 20 mg/ml","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.salusplay.com/apuntes/apuntes-de-farmacologia/antineoplasicos-derivados-de-plantas/resumen","title":"[Página web] Antineoplásicos derivados de Plantas","description":"Salusplay (apuntes de farmacología) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Taxanos: premedicación, hipersensibilidad y neuropatía', 'Clase 4 · Antimicrotúbulos', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe paclitaxel y docetaxel: estabilización de microtúbulos, premedicación, equipos sin PVC y filtro, neuropatía periférica y retención de líquidos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cima.aemps.es/cima/pdfs/ft/66311/FT_66311.pdf","title":"Ficha técnica – Paclitaxel Hospira 6 mg/ml","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.salusplay.com/apuntes/apuntes-de-farmacologia/antineoplasicos-derivados-de-plantas/resumen","title":"[Página web] Antineoplásicos derivados de Plantas","description":"Salusplay (apuntes de farmacología) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Alcaloides de la vinca y el error fatal de la vincristina intratecal', 'Clase 4 · Antimicrotúbulos', 5, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Explica vincristina, vinblastina y vinorelbina, la neurotoxicidad limitante y las barreras para evitar la administración intratecal accidental.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=squNABE26d8","provider":"youtube","videoId":"squNABE26d8","title":"Grave error: ¡Descubriendo el impactante análisis del caso de la vincristina!","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/62378/FT_62378.pdf","title":"Ficha técnica – Vincristina Pfizer 1 mg/ml (vía IV exclusiva – intratecal mortal)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: vincristina e intratecales en LLA pediátrica', 'Clase 4 · Antimicrotúbulos', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso de inducción en leucemia linfoblástica aguda pediátrica donde el QF aplica barreras de seguridad y detecta la interacción con un azol.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar barreras de seguridad para prevenir la administración intratecal accidental de vincristina y validar un ciclo de inducción que combina fármacos intravenosos e intratecales.</p><p>Desarrollo: la administración intratecal de alcaloides de la vinca es casi siempre mortal y sigue ocurriendo en el mundo. El error típico sucede cuando una jeringa de vincristina llega al mismo lugar y al mismo tiempo que las jeringas de metotrexato o citarabina intratecal. La OMS, ISMP y la ficha técnica recomiendan: diluir la vincristina en minibolsa de perfusión (no en jeringa), rotularla con la leyenda \"PARA USO INTRAVENOSO EXCLUSIVAMENTE – MORTAL SI SE ADMINISTRA POR OTRAS VÍAS\", dispensar los intratecales por separado y en otro momento o lugar, y exigir doble verificación independiente en la administración. Además, la dosis adulta usual se limita a un máximo de 2 mg por aplicación, y la neurotoxicidad aumenta con azoles (itraconazol, posaconazol, voriconazol).</p><p>Caso aplicado: niño de 6 años con leucemia linfoblástica aguda en un hospital pediátrico de Bogotá, protocolo de inducción. El mismo día tiene prescrita vincristina IV, metotrexato intratecal y profilaxis antifúngica con posaconazol. La orden llega en el turno de la noche y la enfermera solicita \"preparar todo junto para el procedimiento de la mañana\". Intervención del QF: (1) valida la dosis de vincristina por superficie corporal y comprueba que no supere el tope; (2) prepara la vincristina en minibolsa, con el rótulo de advertencia y etiqueta de color diferenciada; (3) dispensa el metotrexato intratecal por separado, rotulado \"SOLO USO INTRATECAL\", entregado directamente al médico que realiza la punción, nunca en la misma bandeja; (4) alerta sobre la interacción con posaconazol y sugiere al hematólogo valorar otra profilaxis antifúngica o vigilancia neurológica estricta (estreñimiento, íleo, neuropatía, ptosis); (5) recuerda que la Ley 1388 de 2010 protege la atención integral del cáncer infantil en Colombia, y registra el caso como \"casi error\" en el sistema de seguridad del paciente. Al día siguiente socializa el evento con enfermería y hematología para reforzar la regla institucional.</p><p>Puntos clave:<br>1. Vincristina siempre en minibolsa, rotulada y nunca junto a medicamentos intratecales.<br>2. Valida el tope de dosis y las interacciones con azoles.<br>3. Reporta los casi errores: alimentan las barreras del sistema.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Cálculo de dosis, validación y preparación', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción: del cálculo a la mezcla segura', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume el proceso que sigue el QF desde el cálculo de dosis hasta la dispensación de la mezcla de citotóxicos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=xbBOiWfcNdU","provider":"youtube","videoId":"xbBOiWfcNdU","title":"Farmacia oncológica: Medidas de seguridad","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://encolombia.com/?p=186419","title":"[Página web] Guía de Enfermería para la Manipulación de Medicamentos Citostáticos","description":"Actualizaciones en Enfermería – Fundación Santa Fe de Bogotá (encolombia.com) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Superficie corporal: fórmulas, obesidad y redondeo', 'Clase 2 · Cálculo de dosis', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta el cálculo de superficie corporal (Mosteller, DuBois), discute el uso del peso real en obesidad, recálculo por cambio de peso, topes de dosis y redondeo.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=GVCccB_BpxA","provider":"youtube","videoId":"GVCccB_BpxA","title":"Calculating patient dosage using body surface area","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Carboplatino por AUC (fórmula de Calvert) y ajustes renal y hepático', 'Clase 2 · Cálculo de dosis', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica la fórmula de Calvert (dosis mg = AUC × [TFG + 25]) con tope de TFG, y revisa ajustes por función renal y hepática de los principales citotóxicos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cima.aemps.es/cima/pdfs/ft/62123/FT_62123.pdf","title":"Ficha técnica – Carboplatino Pharmacia 10 mg/ml (incluye fórmula de Calvert)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Validación farmacéutica de la prescripción de quimioterapia', 'Clase 3 · Validación y preparación', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica una lista de chequeo de validación: protocolo, ciclo, parámetros de laboratorio, dosis acumuladas, premedicación, secuencia y marco normativo colombiano.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: ejecutar la validación farmacéutica de una prescripción de quimioterapia citotóxica con una lista de chequeo estandarizada.</p><p>Desarrollo: la validación es la barrera de seguridad más eficiente del proceso oncológico. El QF revisa cada orden antes de la preparación con los siguientes elementos: (1) identificación del paciente, diagnóstico, estadio y esquema con referencia bibliográfica o protocolo institucional; (2) número de ciclo, día del ciclo e intervalo desde el último ciclo; (3) peso y talla actualizados, superficie corporal recalculada y variación de peso mayor del 10 % que obligue a recalcular; (4) dosis por m², por kg o por AUC, dosis total y porcentaje de ajuste previo documentado; (5) criterios para administrar: recuento absoluto de neutrófilos, plaquetas, bilirrubina, transaminasas, creatinina y otros específicos (magnesio para cisplatino, FEVI para antraciclinas, audiometría si aplica); (6) dosis acumuladas (antraciclinas, bleomicina); (7) vehículo, volumen, tiempo de infusión, secuencia de administración (p. ej., paclitaxel antes de carboplatino), filtros y equipos sin PVC cuando corresponda; (8) premedicación y profilaxis (antieméticos según potencial emetógeno, premedicación de taxanos, mesna con ifosfamida, rescate con folinato); (9) interacciones y medicamentos concomitantes; (10) firma del médico tratante y orden completa. En Colombia, el servicio farmacéutico debe cumplir la Resolución 1403 de 2007 y los estándares de habilitación vigentes; la mayoría de los citotóxicos clásicos están en el Plan de Beneficios en Salud, y lo no financiado con la UPC se tramita por MIPRES. Las neoplasias se reportan a la Cuenta de Alto Costo, por lo que la trazabilidad del esquema es también un requisito de calidad del dato.</p><p>Ejemplo: una orden de AC (doxorrubicina más ciclofosfamida) para ciclo 3 trae la talla en blanco y un peso de hace dos meses. El QF detiene la preparación, solicita los datos, recalcula la superficie corporal, verifica neutrófilos mayores al umbral del protocolo y confirma la dosis acumulada de doxorrubicina; detecta que no se prescribió antiemético para el día 2 y lo sugiere.</p><p>Puntos clave:<br>1. Usa siempre la misma lista de chequeo; la variabilidad genera errores.<br>2. Ninguna orden incompleta se prepara: se devuelve y se documenta.<br>3. Registra intervenciones farmacéuticas como indicador de calidad del servicio.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Preparación, estabilidad de mezclas y manipulación segura', 'Clase 3 · Validación y preparación', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la preparación en cabina de seguridad biológica, sistemas cerrados, estabilidad y compatibilidad de las mezclas, manejo de derrames y protección del personal.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=ffUV0-UJ0t0","provider":"youtube","videoId":"ffUV0-UJ0t0","title":"Farmacia oncológica: Preparación del campo de trabajo","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=ZTVc-dgBlm8","provider":"youtube","videoId":"ZTVc-dgBlm8","title":"Normalizar los sistemas cerrados de transferencia de medicamentos peligrosos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.insst.es/stp/basequim/015-preparacion-de-farmacos-antineoplasicos-en-los-servicios-de-farmacia-hospitalaria-exposicion-a-agentes-citostaticos-2014","title":"[Página web] Preparación de fármacos antineoplásicos en los servicios de farmacia hospitalaria. Exposición a agentes citostáticos (Basequim 015)","description":"INSST (España) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: validación de FOLFOX con pérdida de peso y neuropatía', 'Clase 4 · Caso clínico de la unidad', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso de cáncer de colon metastásico donde el QF recalcula superficie corporal, evalúa función renal y neuropatía por oxaliplatino y verifica la infusión domiciliaria.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: validar un esquema FOLFOX en un paciente con alteración de la función renal y neuropatía previa, aplicando el cálculo de dosis y los ajustes pertinentes.</p><p>Desarrollo: FOLFOX combina oxaliplatino, leucovorina (ácido folínico) y 5-fluorouracilo en bolo e infusión continua de 46 horas mediante bomba elastomérica. La leucovorina potencia la inhibición de la timidilato sintasa por el 5-FU (aquí no es \"rescate\", a diferencia del metotrexato). El oxaliplatino produce neurotoxicidad aguda desencadenada por frío (disestesias faringolaríngeas y de manos) y neuropatía sensitiva acumulativa, que es la principal causa de modificación de dosis. Se diluye en dextrosa al 5 % y es incompatible con soluciones salinas o alcalinas; no debe compartir línea con 5-FU sin lavado con dextrosa. La ficha técnica de oxaliplatino contraindica su uso con depuración de creatinina menor de 30 mL/min.</p><p>Caso aplicado: hombre de 66 años, Cali, cáncer de colon metastásico, ciclo 5 de FOLFOX. Talla 170 cm, peso actual 64 kg (al inicio pesaba 72 kg). Creatinina 1,5 mg/dL. Refiere hormigueo persistente en los dedos que le dificulta abotonarse la camisa entre ciclos. Actividad de DPD no documentada en la historia. Intervención del QF: (1) recalcula la superficie corporal con el peso actual (variación mayor del 10 %), lo que reduce las dosis absolutas, y lo comunica; (2) calcula la depuración de creatinina con Cockcroft-Gault y verifica que esté por encima del umbral de contraindicación, sugiriendo vigilancia renal; (3) clasifica la neuropatía como grado 2 persistente (interfiere con actividades instrumentales) y sugiere al oncólogo reducción o suspensión del oxaliplatino según el protocolo; (4) recomienda documentar la evaluación de DPD; (5) verifica la dilución del oxaliplatino en dextrosa al 5 % y el rotulado de la bomba elastomérica con hora de inicio y retiro; (6) educa sobre evitar bebidas y objetos fríos los días posteriores a la infusión. El oncólogo decide continuar con 5-FU y leucovorina y omitir oxaliplatino en este ciclo.</p><p>Puntos clave:<br>1. Recalcula la superficie corporal cuando el peso cambia más del 10 %.<br>2. La neuropatía acumulativa es la toxicidad que más modifica los esquemas con oxaliplatino.<br>3. Verifica diluyente, compatibilidades y rotulado de la infusión domiciliaria.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Seguridad: extravasación, toxicidades, interacciones y quimioterapia oral', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la seguridad del paciente en quimioterapia', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume las principales toxicidades y riesgos de la quimioterapia citotóxica y el rol del QF en farmacovigilancia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=nozs2IWqQaY","provider":"youtube","videoId":"nozs2IWqQaY","title":"Administración de un citostático por infusión","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cancer.org/es/tratamiento/tratamientos-y-efectos-secundarios/tipos-de-tratamiento/quimioterapia/como-funcionan-los-medicamentos-de-quimioterapia.html","title":"[Página web] Tipos de medicamentos de quimioterapia","description":"American Cancer Society (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Extravasación: vesicantes, irritantes y antídotos', 'Clase 2 · Extravasación', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Clasifica los citotóxicos por su agresividad tisular y describe medidas generales y específicas (frío o calor, dexrazoxano, DMSO, hialuronidasa) y el kit de extravasación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=b_vyj3wey4A","provider":"youtube","videoId":"b_vyj3wey4A","title":"Evaluation and Treatment of Extravasation Injuries from Chemotherapeutic Agents - R. Tolley","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.hospitaldeclinicas.uba.ar/webhospital/farmacia/protocoloextravasacioncitostaticos.pdf","title":"Protocolo de prevención y tratamiento de la extravasación de citostáticos","description":"Hospital de Clínicas José de San Martín (UBA) – Farmacia (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://encolombia.com/medicina/revistas-medicas/enfermeria/ve-64/enfermeria6403-prevencion/","title":"[Página web] Prevención y Manejo de la Extravasación de Citostáticos","description":"Actualizaciones en Enfermería – Fundación Santa Fe de Bogotá (encolombia.com) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Mielosupresión y neutropenia febril: nadir y criterios de administración', 'Clase 3 · Toxicidades e interacciones', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el nadir de los citotóxicos, los criterios hematológicos para administrar un ciclo y la neutropenia febril como urgencia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=sjvUlVFansQ","provider":"youtube","videoId":"sjvUlVFansQ","title":"FÁRMACOS ANTINEOPLÁSICOS - PARTE 1","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cancer.org/es/tratamiento/tratamientos-y-efectos-secundarios/tipos-de-tratamiento/quimioterapia/como-funcionan-los-medicamentos-de-quimioterapia.html","title":"[Página web] Tipos de medicamentos de quimioterapia","description":"American Cancer Society (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Síndrome de lisis tumoral', 'Clase 3 · Toxicidades e interacciones', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Explica la fisiopatología, estratificación de riesgo, prevención (hidratación, alopurinol, rasburicasa) y monitorización del síndrome de lisis tumoral.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=TmL5ToeLQjI&pp=0gcJCdgAo7VqN5tD","provider":"youtube","videoId":"TmL5ToeLQjI","title":"Actualización Síndrome de Lisis tumoral","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://encolombia.com/medicina/guiasmed/enfermedades-neoplasticas/sindrome-lisis-tumoral/","title":"[Página web] Síndrome de Lisis Tumoral – Guía para Enfermedades Neoplásicas","description":"Instituto Nacional de Cancerología (publicado en encolombia.com) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.mskcc.org/es/cancer-care/patient-education/about-tumor-lysis-syndrome-tls","title":"[Página web] Información sobre el síndrome de lisis tumoral (SLT)","description":"Memorial Sloan Kettering Cancer Center (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Interacciones de alto riesgo con citotóxicos', 'Clase 3 · Toxicidades e interacciones', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Analiza interacciones por CYP3A4, eliminación renal, DPD y farmacodinámicas, incluidos productos naturales.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: identificar y manejar las interacciones farmacológicas de mayor riesgo en pacientes que reciben citotóxicos.</p><p>Desarrollo: los pacientes oncológicos toman en promedio muchos medicamentos simultáneos (antieméticos, analgésicos, antimicrobianos, anticoagulantes, productos naturales), y los citotóxicos tienen margen terapéutico estrecho. Las interacciones más relevantes para el QF son: (1) farmacocinéticas por CYP3A4: azoles y macrólidos aumentan la exposición a vincristina, docetaxel, paclitaxel, irinotecán y etopósido; los inductores (carbamazepina, fenitoína, rifampicina, hierba de San Juan) la reducen; (2) renales: AINE, inhibidores de bomba de protones, penicilinas y trimetoprim-sulfametoxazol disminuyen la eliminación de metotrexato a dosis altas; aminoglucósidos y vancomicina suman nefrotoxicidad al cisplatino; (3) metabólicas: brivudina inhibe la DPD y está contraindicada con 5-FU y capecitabina; alopurinol reduce el metabolismo de la mercaptopurina; (4) farmacodinámicas: suma de mielosupresión (zidovudina, ganciclovir, cotrimoxazol), de cardiotoxicidad (antraciclinas con trastuzumab, que corresponde al curso de terapias dirigidas, o con radioterapia mediastínica) y de prolongación del QT (antieméticos setrones, fluoroquinolonas); (5) con anticoagulantes: capecitabina y 5-FU aumentan el INR con warfarina; (6) vacunas: las vacunas vivas atenuadas están contraindicadas durante la quimioterapia. Los productos naturales (cúrcuma, ginkgo, altas dosis de antioxidantes) son de uso frecuente en Colombia y deben preguntarse activamente.</p><p>Ejemplo: paciente de 45 años con linfoma en esquema CHOP inicia itraconazol por candidiasis esofágica y omeprazol. El QF detecta el riesgo de neurotoxicidad grave por vincristina con itraconazol y sugiere un antifúngico sin inhibición potente de CYP3A4 (p. ej., fluconazol con vigilancia, o equinocandina según criterio médico), y pregunta por suplementos: la paciente toma un \"jugo antioxidante\" que se recomienda suspender durante el tratamiento. Además verifica que el omeprazol no represente un problema en este esquema (sí lo sería con metotrexato a dosis altas), revisa el QT basal por el uso de ondansetrón y deja registrada la intervención con su aceptación por el médico tratante. Finalmente, educa a la paciente para que informe cualquier medicamento nuevo, incluso los formulados en urgencias o por otra especialidad, y entrega por escrito la lista actualizada de su tratamiento. Este registro sirve como fuente para el programa institucional de farmacovigilancia y para los indicadores de intervenciones farmacéuticas aceptadas.</p><p>Puntos clave:<br>1. Revisa CYP3A4, eliminación renal y DPD en cada citotóxico.<br>2. Pregunta siempre por productos naturales y automedicación.<br>3. Usa una ficha de interacciones institucional y documenta cada intervención.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Quimioterapia oral: adherencia, educación y manejo en casa', 'Clase 4 · Quimioterapia oral y caso integrador', 5, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los retos de la quimioterapia oral (adherencia, errores de esquema, manipulación en casa) y las estrategias de atención farmacéutica.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=n74WOaioCGs","provider":"youtube","videoId":"n74WOaioCGs","title":"Qué es la quimioterapia oral? | Dana-Farber Cancer Institute","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://youtube.com/watch?pp=ygUSI3NpbXBhcmFxdWltaW9vcmFs&v=SRIdt3oUeiM","provider":"youtube","videoId":"SRIdt3oUeiM","title":"Quimioterapia oral: cómo usarla de manera segura en la casa | Dana-Farber Cancer Institute","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 3, '{"source":"enlace","url":"https://www.youtube.com/watch?v=ECYZFrbTrEM","provider":"youtube","videoId":"ECYZFrbTrEM","title":"QUIMIOTERAPIA CAPECITABINA RECOMENDACIONES","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso integrador: lisis tumoral y extravasación de antraciclina', 'Clase 4 · Quimioterapia oral y caso integrador', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso de linfoma voluminoso donde el QF previene el SLT y actúa ante una extravasación de doxorrubicina.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: integrar la prevención del síndrome de lisis tumoral (SLT) y el manejo de una extravasación en un mismo episodio de atención.</p><p>Desarrollo: el SLT es una urgencia oncológica que aparece típicamente entre 12 y 72 horas después de iniciar quimioterapia en tumores con alta carga y rápida proliferación (linfoma de Burkitt, leucemias agudas con hiperleucocitosis, linfomas voluminosos). Se caracteriza por hiperuricemia, hiperpotasemia, hiperfosfatemia e hipocalcemia secundaria, y puede causar lesión renal aguda y arritmias. La prevención se basa en estratificar el riesgo, hidratación intravenosa abundante, alopurinol (riesgo intermedio) o rasburicasa (riesgo alto, contraindicada en deficiencia de G6PD) y monitorización de electrolitos y creatinina cada 6 a 12 horas. La alcalinización urinaria ya no se recomienda de rutina. La extravasación de una antraciclina, por su parte, se trata con suspensión inmediata, aspiración del residuo, frío local y dexrazoxano intravenoso o dimetilsulfóxido tópico según disponibilidad institucional.</p><p>Caso aplicado: mujer de 34 años, Barranquilla, linfoma B difuso de células grandes con masa abdominal voluminosa, LDH muy elevada y creatinina 1,3 mg/dL. Inicia R-CHOP (el rituximab se aborda en el curso de terapias dirigidas). Intervención del QF antes del ciclo: estratifica riesgo alto o intermedio, verifica hidratación, alopurinol iniciado 48 horas antes y evalúa con el hematólogo la indicación de rasburicasa (tamizaje de G6PD si es necesario); revisa interacciones del alopurinol y ajusta su dosis a la función renal. Durante la infusión de doxorrubicina por vía periférica, la paciente refiere ardor y se observa edema en el sitio. Intervención: indica detener la infusión, dejar el catéter para aspirar, activar el kit de extravasación, aplicar frío, contactar al oncólogo y dispensar el antídoto institucional; registra el evento, fotografía la zona y programa seguimiento. Recomienda que los siguientes ciclos se administren por catéter central. En las 72 horas siguientes, el QF revisa dos veces al día el potasio, el fósforo, el calcio, el ácido úrico y la creatinina, alerta ante cualquier tendencia ascendente y verifica el balance hídrico. También comprueba que la dexametasona, la ondansetrona y la prednisona del esquema estén bien transcritas, y deja trazabilidad de todo en la historia clínica y en el reporte de farmacovigilancia.</p><p>Puntos clave:<br>1. Estratifica el riesgo de SLT antes del primer ciclo y monitoriza laboratorios seriados.<br>2. Cada servicio debe tener kit de extravasación con antídotos y protocolo conocido por todos.<br>3. Rasburicasa requiere descartar deficiencia de G6PD.</p>"}'::jsonb);

END
$curso$;

-- ─── 3. Curso de Inmunoterapia Oncológica (33 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Inmunoterapia Oncológica' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Inmunoterapia Oncológica', 'Curso para químicos farmacéuticos sobre las bases inmunológicas del cáncer, los inhibidores de puntos de control, las terapias celulares y biespecíficas y el manejo de sus toxicidades. Integra biomarcadores, patrones de respuesta, preparación de anticuerpos, farmacovigilancia y la ruta de acceso en Colombia (INVIMA, UPC/MIPRES, Cuenta de Alto Costo).', '<p>Curso para químicos farmacéuticos sobre las bases inmunológicas del cáncer, los inhibidores de puntos de control, las terapias celulares y biespecíficas y el manejo de sus toxicidades. Integra biomarcadores, patrones de respuesta, preparación de anticuerpos, farmacovigilancia y la ruta de acceso en Colombia (INVIMA, UPC/MIPRES, Cuenta de Alto Costo).</p><h3>Objetivo general</h3><p>Desarrollar en el químico farmacéutico las competencias para validar, preparar, dispensar y hacer seguimiento farmacoterapéutico seguro y costo-efectivo de la inmunoterapia oncológica, incluyendo la detección, graduación y manejo de eventos adversos inmunorrelacionados y la gestión del acceso en el sistema de salud colombiano.</p><h3>A quién va dirigido</h3><p>Químicos farmacéuticos de servicios farmacéuticos hospitalarios, centrales de mezclas, unidades oncológicas, EPS/gestores farmacéuticos e industria farmacéutica en Colombia; estudiantes de últimos semestres de Química Farmacéutica.</p><h3>Contexto normativo</h3><p>Colombia — GPC MinSalud/IETS, PBS/MIPRES, INVIMA</p>',
          'Farmacología', 'intermedio', 'Desarrollar en el químico farmacéutico las competencias para validar, preparar, dispensar y hacer seguimiento farmacoterapéutico seguro y costo-efectivo de la inmunoterapia oncológica, incluyendo la detección, graduación y manejo de eventos adversos inmunorrelacionados y la gestión del acceso en el sistema de salud colombiano.', 'Químicos farmacéuticos de servicios farmacéuticos hospitalarios, centrales de mezclas, unidades oncológicas, EPS/gestores farmacéuticos e industria farmacéutica en Colombia; estudiantes de últimos semestres de Química Farmacéutica.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Fundamentos de inmunología tumoral', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: la inmunoterapia como pilar de la oncología', 'Clase 1 · Introducción al curso', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Presenta la evolución de la inmunoterapia oncológica, sus grandes familias (inhibidores de puntos de control, terapias celulares, biespecíficos, vacunas y virus oncolíticos) y el papel del QF.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=pj-9xg6djdQ","provider":"youtube","videoId":"pj-9xg6djdQ","title":"Inmunoterapia: Cómo el sistema inmunitario combate el cáncer","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cancer.org/es/cancer/como-sobrellevar-el-cancer/tipos-de-tratamiento/inmunoterapia/inhibidores-puestos-de-control-inmunitarios.html","title":"[Página web] Inhibidores de los puntos de control inmunitario y sus efectos secundarios","description":"American Cancer Society (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Inmunovigilancia y ciclo cáncer-inmunidad', 'Clase 2 · Inmunovigilancia, inmunoedición y evasión inmune', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe cómo el sistema inmune reconoce antígenos tumorales y los siete pasos del ciclo cáncer-inmunidad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=K09xzIQ8zsg","provider":"youtube","videoId":"K09xzIQ8zsg","title":"Tumour immunology and immunotherapy","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=AbRaOrpYRHI","provider":"youtube","videoId":"AbRaOrpYRHI","title":"Inmunoterapia - ¿Qué es la Inmunoterapia y cómo funciona?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Inmunoedición y mecanismos de evasión inmune', 'Clase 2 · Inmunovigilancia, inmunoedición y evasión inmune', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las fases de eliminación, equilibrio y escape, y los mecanismos tumorales para evadir la respuesta inmune (pérdida de HLA, PD-L1, citocinas supresoras).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=P8cADS2UoVk","provider":"youtube","videoId":"P8cADS2UoVk","title":"Inmunoedición del cáncer, explicado en 5 min","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=I-7Q8e7v05I","provider":"youtube","videoId":"I-7Q8e7v05I","title":"#InmunoClips - Inmunoedición y mecanismos de evasión inmunológica por células tumorales","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 3, '{"source":"enlace","url":"https://www.youtube.com/watch?v=4m4vYUxhs7A","provider":"youtube","videoId":"4m4vYUxhs7A","title":"Mecanismos de evasión tumoral - Dr. Peter Taylor","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Microambiente tumoral: tumores calientes y fríos', 'Clase 3 · Microambiente tumoral y puntos de control inmunitario', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las poblaciones celulares y moléculas inmunosupresoras del microambiente tumoral (Treg, MDSC, macrófagos M2, TGF-beta, IDO) y su impacto en la respuesta.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=vTdfVs1mPlk","provider":"youtube","videoId":"vTdfVs1mPlk","title":"Evasión de la destrucción inmunológica","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://riull.ull.es/xmlui/handle/915/41820","title":"[Página web] Efecto del microambiente en el desarrollo y progresión del cáncer","description":"Repositorio Universidad de La Laguna (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Fisiología de PD-1/PD-L1 y CTLA-4', 'Clase 3 · Microambiente tumoral y puntos de control inmunitario', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Explica la función de los puntos de control en la tolerancia periférica y por qué su bloqueo reactiva linfocitos T, base del Nobel 2018.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=jlcaD_EJIE0","provider":"youtube","videoId":"jlcaD_EJIE0","title":"Inmunología y Cáncer Parte 3: Introducción a los Puntos de Control Inmunitario","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://biblat.unam.mx/fr/revista/revista-medica-de-chile/articulo/la-inhibicion-de-los-puntos-de-control-inmunologico-una-terapia-en-evolucion-remembranza-del-premio-nobel-de-medicina-2018","title":"[Página web] La inhibición de los puntos de control inmunológico: una terapia en evolución. Remembranza del Premio Nobel de Medicina 2018","description":"Revista Médica de Chile / Biblat UNAM (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: ¿por qué responde un tumor y otro no?', 'Clase 4 · Caso clínico de la unidad', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso de junta multidisciplinaria en el que el QF explica, desde la biología tumoral, la elegibilidad para inmunoterapia de dos pacientes.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar los conceptos de inmunovigilancia, inmunoedición y microambiente tumoral para explicar por qué la respuesta a la inmunoterapia varía entre pacientes.</p><p>Desarrollo: el ciclo cáncer-inmunidad describe cómo los antígenos tumorales liberados son captados por células dendríticas, presentados a linfocitos T en el ganglio, y cómo estos linfocitos activados migran, infiltran el tumor y destruyen células malignas. Cuando el ciclo funciona, el tumor queda \"inflamado\" o \"caliente\": abundantes linfocitos T CD8+ infiltrantes, producción de interferón gamma y, como respuesta adaptativa, expresión de PD-L1 por la célula tumoral para frenar el ataque. Estos tumores son los que más se benefician de bloquear el eje PD-1/PD-L1, porque existe una respuesta inmune previa que solo está \"frenada\". En cambio, en un tumor \"frío\" (desierto inmune o inmunoexcluido) los linfocitos no llegan o quedan atrapados en el estroma; predominan linfocitos T reguladores, células supresoras de origen mieloide (MDSC), macrófagos M2, TGF-beta e IDO. Allí liberar el freno no basta, porque no hay quien acelere.</p><p>Caso aplicado: en la junta multidisciplinaria de un centro oncológico de Bogotá se discuten dos pacientes. El paciente A, 64 años, exfumador de 40 paquetes-año, con adenocarcinoma de pulmón estadio IV, sin alteraciones en EGFR/ALK y PD-L1 alto: tumor con alta carga mutacional por tabaquismo, muchos neoantígenos y buena infiltración linfocitaria. La paciente B, 58 años, con adenocarcinoma de colon metastásico con estabilidad de microsatélites (MSS/pMMR): baja carga mutacional y microambiente inmunosupresor. El oncólogo pregunta al QF por qué el anti-PD-1 se propone para A y no para B. El QF explica que la eficacia depende de la existencia de una respuesta inmune preexistente (neoantígenos, infiltración T, PD-L1 adaptativo), y que en B el beneficio de los inhibidores de puntos de control en monoterapia es mínimo; sí sería distinto si el tumor fuera MSI-H/dMMR, donde los defectos de reparación generan miles de neoantígenos. Además, el QF recuerda que la decisión debe soportarse en el biomarcador validado, en la ficha técnica aprobada por INVIMA y, si el medicamento no está financiado con la UPC, en la prescripción por MIPRES con justificación clínica.</p><p>Puntos clave:<br>1. La inmunoterapia con anti-PD-1/PD-L1 libera una respuesta inmune existente; los tumores \"calientes\" responden mejor que los \"fríos\".<br>2. Carga mutacional, MSI-H/dMMR, infiltración linfocitaria y PD-L1 son reflejos de la inmunogenicidad tumoral, no garantías de respuesta.<br>3. El QF traduce la biología en argumentos para validar la pertinencia de la prescripción y optimizar recursos de alto costo.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Inhibidores de puntos de control inmunitario', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: inhibidores de puntos de control', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Panorama de los anticuerpos anti-PD-1, anti-PD-L1, anti-CTLA-4 y anti-LAG-3 disponibles y su impacto en la supervivencia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=kONnvzq1FK0","provider":"youtube","videoId":"kONnvzq1FK0","title":"Inhibidores de puntos de control inmunitario","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cancer.org/es/cancer/como-sobrellevar-el-cancer/tipos-de-tratamiento/inmunoterapia/inhibidores-puestos-de-control-inmunitarios.html","title":"[Página web] Inhibidores de los puntos de control inmunitario y sus efectos secundarios","description":"American Cancer Society (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Anti-PD-1, anti-PD-L1 y anti-CTLA-4: nivolumab, pembrolizumab, atezolizumab, durvalumab e ipilimumab', 'Clase 2 · Fármacos, farmacocinética y posología', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara mecanismo, isotipo, vías de administración (IV y nuevas formulaciones SC) y perfil de toxicidad de cada grupo.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=w-qQFquIF_g","provider":"youtube","videoId":"w-qQFquIF_g","title":"Inhibidores del punto de control inmunitario en la terapia del cáncer","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=X_fjS1Rqxr8","provider":"youtube","videoId":"X_fjS1Rqxr8","title":"Immunotherapy with Checkpoint Inhibitors (PD1/L1 inhibitor)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.cancer.org/es/cancer/como-sobrellevar-el-cancer/tipos-de-tratamiento/inmunoterapia/inhibidores-puestos-de-control-inmunitarios.html","title":"[Página web] Inhibidores de los puntos de control inmunitario y sus efectos secundarios","description":"American Cancer Society (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Farmacocinética, posología, interacciones y poblaciones especiales', 'Clase 2 · Fármacos, farmacocinética y posología', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la farmacocinética de los anticuerpos monoclonales y sus implicaciones (dosis fijas, sin ajuste renal/hepático, interacciones con corticoides, antibióticos e IBP).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: describir la farmacocinética de los anticuerpos inhibidores de puntos de control y sus implicaciones en posología, interacciones y poblaciones especiales.</p><p>Desarrollo: nivolumab y pembrolizumab son IgG4 humanizadas o humanas anti-PD-1; atezolizumab, durvalumab y avelumab son IgG1 anti-PD-L1 (con Fc modificado para reducir citotoxicidad dependiente de anticuerpos, salvo avelumab), e ipilimumab y tremelimumab son anti-CTLA-4. Por ser proteínas grandes se administran por vía parenteral (IV en infusión de 30–60 minutos y, más recientemente, formulaciones subcutáneas de nivolumab, pembrolizumab y atezolizumab aprobadas por agencias como la FDA). Su distribución es principalmente intravascular e intersticial, y su eliminación ocurre por catabolismo proteolítico en el sistema reticuloendotelial, no por CYP450 ni excreción renal. Por ello, no requieren ajuste por insuficiencia renal o hepática leve a moderada y prácticamente no presentan interacciones farmacocinéticas. Su vida media es larga (del orden de semanas), lo que permite intervalos de 2 a 6 semanas y explica que los eventos adversos inmunorrelacionados puedan aparecer meses después de suspender el tratamiento. La mayoría de anti-PD-1/PD-L1 se usan hoy con dosis fijas (planas), mientras que ipilimumab se dosifica por peso; el QF debe confirmar siempre esquema, dosis e intervalo en la ficha técnica aprobada por INVIMA y en el protocolo institucional.</p><p>Interacciones farmacodinámicas relevantes: los corticoides sistémicos a dosis inmunosupresoras al inicio del tratamiento (por ejemplo, equivalentes a 10 mg/día o más de prednisona por causas no oncológicas) se han asociado a menor beneficio, por lo que debe revisarse su indicación antes de iniciar; su uso posterior para tratar irAEs no parece comprometer la eficacia. Datos observacionales asocian antibióticos de amplio espectro e inhibidores de bomba de protones cerca del inicio con peores desenlaces (posible efecto sobre la microbiota): conviene revisar su necesidad real. En pacientes con enfermedades autoinmunes, trasplantes de órgano sólido o inmunosupresores previos se requiere evaluación individual del riesgo.</p><p>Poblaciones especiales: en embarazo las IgG atraviesan la placenta y pueden afectar la tolerancia materno-fetal; se recomienda anticoncepción eficaz durante el tratamiento y por varios meses después (según ficha técnica). En adulto mayor no se ajusta dosis, pero se vigilan comorbilidades y polifarmacia. En pediatría solo se usan en indicaciones aprobadas.</p><p>Ejemplo colombiano: un paciente en tratamiento con pembrolizumab cada 6 semanas en una IPS de Medellín consulta por neumonía; el QF verifica que el antibiótico no requiere ajuste por interacción, pero documenta el evento y alerta al oncólogo.</p><p>Puntos clave:<br>1. Eliminación por catabolismo proteico: sin ajuste renal/hepático leve-moderado y sin interacciones CYP.<br>2. Vida media larga: intervalos amplios y toxicidad tardía.<br>3. Revisar corticoides basales, antibióticos e IBP antes de iniciar y verificar dosis en la ficha técnica INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'PD-L1: técnicas, puntuaciones (TPS, CPS) y limitaciones', 'Clase 3 · Biomarcadores e indicaciones', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los resultados de PD-L1 por inmunohistoquímica y cómo condicionan la elección entre monoterapia y quimioinmunoterapia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=Q5dyssEFFr0","provider":"youtube","videoId":"Q5dyssEFFr0","title":"PD-L1 Testing by Immunohistochemistry","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=2v9POD652Ts","provider":"youtube","videoId":"2v9POD652Ts","title":"Understanding Immunotherapy for NSCLC with PD-1 and PD-L1 Biomarkers","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'MSI-H/dMMR, TMB e indicaciones principales por tumor', 'Clase 3 · Biomarcadores e indicaciones', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara biomarcadores agnósticos de tumor (MSI-H/dMMR, TMB alta) y resume indicaciones principales: melanoma, pulmón, renal, urotelial, colorrectal MSI-H, hepatocarcinoma, cabeza y cuello y Hodgkin.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=HoPok3jPRnc","provider":"youtube","videoId":"HoPok3jPRnc","title":"Comprender la inmunoterapia para el cáncer de pulmón","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=gVQxOxe7z_M","provider":"youtube","videoId":"gVQxOxe7z_M","title":"KEYNOTE-177 discussion: chemo-immunotherapy, pseudoprogression & biomarkers","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.cancer.org/es/cancer/cancer-de-pulmon/tratamiento-no-microcitico/inmunoterapia.html","title":"[Página web] Inmunoterapia para el cáncer de pulmón no microcítico","description":"American Cancer Society (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: validación farmacéutica de pembrolizumab en cáncer de pulmón', 'Clase 4 · Caso clínico de la unidad', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El QF valida una prescripción de anti-PD-1 de primera línea revisando biomarcador, laboratorios basales, concomitantes y acceso UPC/MIPRES.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: ejecutar la validación farmacéutica de una prescripción de inhibidor de punto de control en un caso real de cáncer de pulmón.</p><p>Caso: hombre de 67 años, afiliado al régimen contributivo, con adenocarcinoma de pulmón estadio IV, ECOG 1, sin mutaciones EGFR ni rearreglo ALK/ROS1, PD-L1 (TPS) 70% con anticuerpo validado. Se prescribe pembrolizumab en monoterapia de primera línea. Antecedentes: hipotiroidismo subclínico no tratado, EPOC con prednisona oral 20 mg/día desde hace dos semanas por exacerbación, omeprazol crónico. Peso 72 kg.</p><p>Desarrollo de la validación (lista de chequeo del QF):<br>1. Indicación: confirmar que la indicación, la línea y el biomarcador coinciden con la ficha técnica aprobada por INVIMA y con la guía adoptada por la institución (ESMO/NCCN, recomendaciones del INC). Verificar que se descartaron alteraciones conductoras (en tumores con EGFR/ALK la monoterapia con anti-PD-1 tiene poco beneficio y más toxicidad si luego se usan inhibidores de tirosina quinasa).<br>2. Dosis e intervalo: dosis fija según ficha técnica (esquema cada 3 o cada 6 semanas); no requiere cálculo por superficie corporal. Revisar redondeo de viales y posibilidad de compartir viales en la central de mezclas.<br>3. Laboratorios basales: hemograma, función renal y hepática, glucemia/HbA1c, TSH y T4 libre, cortisol matutino (según protocolo), serologías de hepatitis B y C y VIH, y radiografía/TC basal y saturación de oxígeno para comparar si aparece neumonitis. El hipotiroidismo subclínico no contraindica pero exige seguimiento de TSH en cada ciclo o cada 4–6 semanas.<br>4. Medicamentos concomitantes: la prednisona 20 mg/día al inicio puede restar eficacia; el QF sugiere al equipo confirmar si la exacerbación resolvió y planear el descenso antes del primer ciclo. Revisar la indicación del omeprazol (deprescribir si no hay indicación clara).<br>5. Acceso: verificar si el medicamento y la indicación están financiados con la UPC en el listado vigente del Plan de Beneficios; si no, la prescripción debe hacerse en MIPRES con soporte clínico. Confirmar registro sanitario vigente y precio regulado si aplica.<br>6. Educación y seguridad: entregar tarjeta de alerta de inmunoterapia, explicar síntomas de alarma (tos y disnea nuevas, diarrea, ictericia, fatiga extrema, cefalea, poliuria) y canal de contacto 24 horas.</p><p>Intervención registrada: aval de la prescripción condicionado al descenso de corticoide, solicitud de TSH/T4L y cortisol basal, deprescripción de IBP, radicación MIPRES y programación de educación al paciente.</p><p>Puntos clave:<br>1. Validar indicación + biomarcador + ausencia de alteraciones conductoras, no solo la dosis.<br>2. Los laboratorios basales son la referencia para detectar irAEs.<br>3. El QF integra seguridad, eficacia y acceso (UPC/MIPRES) en una sola intervención documentada.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Eventos adversos inmunorrelacionados (irAEs)', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: por qué la inmunoterapia causa autoinmunidad', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la fisiopatología, frecuencia y cronología de los irAEs y las guías de referencia (ESMO 2022, ASCO 2021, NCCN).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://ecancer.org/es/video/12478-manejo-de-efectos-adversos-io","title":"[Página web] Manejo de efectos adversos IO (video, Dra. Laura Pelagatti, 2025)","description":"ecancer (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Graduación CTCAE y principios generales de manejo', 'Clase 2 · Graduación y principios de manejo', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la escala CTCAE para irAEs y la regla general: grado 1 continuar con vigilancia, grado 2 suspender y considerar corticoide, grado 3–4 suspender y corticoide sistémico.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=EPm0V9IHbwE","provider":"youtube","videoId":"EPm0V9IHbwE","title":"Immunotherapy and side effects: Introduction","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://pubmed.ncbi.nlm.nih.gov/34724392/","title":"[Página web] Management of Immune-Related Adverse Events in Patients Treated With Immune Checkpoint Inhibitor Therapy: ASCO Guideline Update (2021)","description":"Journal of Clinical Oncology / PubMed (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.guidelinecentral.com/guideline/7369/","title":"[Página web] ASCO – Management of irAEs in patients treated with ICI (resumen de guía)","description":"Guideline Central (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Corticoides e inmunosupresores de segunda línea', 'Clase 2 · Graduación y principios de manejo', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica el uso de corticoides (vía, rango de dosis, descenso en 4–6 semanas) y de rescates (infliximab, vedolizumab, micofenolato, IGIV) con sus profilaxis asociadas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://doi.org/10.56050/01205498.2307","title":"[Página web] Manejo en cuidado crítico de la toxicidad severa relacionada con la inmunoterapia en cáncer","description":"Revista Medicina (Academia Nacional de Medicina de Colombia) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Toxicidad cutánea, gastrointestinal y hepática', 'Clase 3 · irAEs por órgano y monitorización', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara presentación, graduación y manejo de dermatitis, colitis y hepatitis inmunorrelacionadas, y el seguimiento con perfil hepático.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.elsevier.es/es-revista-actas-dermo-sifiliograficas-103-articulo-revision-sistematica-efectos-adversos-cutaneos-S0001731021003811","title":"[Página web] Revisión sistemática de los efectos adversos cutáneos causados por inhibidores de los puntos de control inmunitario: características, manejo y pronóstico","description":"Actas Dermo-Sifiliográficas 2022 (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cancer.org/es/cancer/como-sobrellevar-el-cancer/tipos-de-tratamiento/inmunoterapia/inhibidores-puestos-de-control-inmunitarios.html","title":"[Página web] Inhibidores de los puntos de control inmunitario y sus efectos secundarios","description":"American Cancer Society (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Endocrinopatías y monitorización de tiroides, glucemia y cortisol', 'Clase 3 · irAEs por órgano y monitorización', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta tiroiditis, hipofisitis, insuficiencia suprarrenal y diabetes tipo 1 inmunorrelacionadas y diseña el plan de monitorización hormonal.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: interpretar las endocrinopatías inmunorrelacionadas y diseñar un plan de monitorización hormonal para pacientes con inhibidores de puntos de control.</p><p>Desarrollo: las endocrinopatías están entre los irAEs más frecuentes y, a diferencia de otros, suelen ser permanentes.<br>- Disfunción tiroidea: más común con anti-PD-1/PD-L1 y con la combinación anti-PD-1 + anti-CTLA-4. Típicamente aparece una tiroiditis con fase tirotóxica transitoria (TSH suprimida, T4L alta; manejo sintomático con betabloqueador) seguida de hipotiroidismo que requiere levotiroxina. En general no se necesitan corticoides y la inmunoterapia puede continuar.<br>- Hipofisitis: más asociada a ipilimumab. Se manifiesta con cefalea, fatiga, hiponatremia e hipotensión; el laboratorio muestra ACTH y cortisol bajos y puede haber hipotiroidismo central (TSH baja o normal con T4L baja). El tratamiento es reemplazo con hidrocortisona; si coexiste hipotiroidismo, primero se inicia el glucocorticoide y luego la levotiroxina para no precipitar crisis suprarrenal. Las dosis altas de corticoides se reservan para efecto de masa (cefalea intensa, alteración visual).<br>- Insuficiencia suprarrenal primaria: rara pero potencialmente mortal; cortisol bajo con ACTH alta; requiere hidro y, a veces, fludrocortisona.<br>- Diabetes mellitus tipo 1 de inicio súbito: asociada a anti-PD-1/PD-L1; puede debutar con cetoacidosis. Se trata con insulina; los corticoides no la revierten.</p><p>Monitorización recomendada (ESMO 2022, ASCO 2021; ajustar al protocolo local): TSH y T4L basal y antes de cada ciclo o cada 4–6 semanas durante los primeros meses; glucemia en cada ciclo; cortisol matutino basal y ante síntomas compatibles; sodio y potasio. La graduación se hace con CTCAE, pero el manejo endocrino se orienta más por el déficit hormonal que por el grado.</p><p>Ejemplo colombiano: una paciente con melanoma en tratamiento con nivolumab + ipilimumab en Cali consulta en el ciclo 3 por cefalea y astenia intensa. El QF, al revisar la historia, nota sodio de 129 mEq/L y TSH baja con T4L baja; alerta al oncólogo por sospecha de hipofisitis, sugiere cortisol y ACTH antes de iniciar corticoide, verifica que se inicie hidrocortisona antes de levotiroxina, educa sobre \"reglas de días de enfermedad\" (duplicar dosis ante fiebre o vómito) y entrega tarjeta de paciente con insuficiencia suprarrenal. Notifica el evento a INVIMA por el programa de farmacovigilancia institucional.</p><p>Puntos clave:<br>1. Tiroides: tiroiditis y luego hipotiroidismo; levotiroxina sin suspender la inmunoterapia en la mayoría de casos.<br>2. Hipofisitis (sobre todo anti-CTLA-4): hidrocortisona primero, luego levotiroxina.<br>3. TSH/T4L, glucemia y cortisol deben ser parte del seguimiento rutinario; las endocrinopatías suelen ser permanentes.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'irAEs graves e infrecuentes: neumonitis, miocarditis, nefritis y neurológicos', 'Clase 3 · irAEs por órgano y monitorización', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los irAEs potencialmente mortales, sus signos de alarma y el manejo en cuidado crítico.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://doi.org/10.56050/01205498.2307","title":"[Página web] Manejo en cuidado crítico de la toxicidad severa relacionada con la inmunoterapia en cáncer","description":"Revista Medicina (Academia Nacional de Medicina de Colombia) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: colitis grado 3 con nivolumab + ipilimumab', 'Clase 4 · Caso clínico de la unidad', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El QF aplica la graduación CTCAE y el algoritmo con corticoides, propone profilaxis y notifica el evento a INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar la graduación CTCAE y el algoritmo de manejo con corticoides en un caso de colitis inmunorrelacionada, definiendo las intervenciones del QF.</p><p>Caso: hombre de 52 años con melanoma metastásico BRAF no mutado, en tratamiento con nivolumab + ipilimumab (ciclo 3). Consulta a urgencias por 8 deposiciones diarias sobre su basal, dolor abdominal y sangre en heces desde hace 3 días. Signos vitales estables, PCR elevada, potasio 3,2 mEq/L.</p><p>Análisis: según CTCAE, un aumento de 7 o más deposiciones por día sobre el basal corresponde a diarrea grado 3, y el dolor con sangrado sugiere colitis grado 3. La combinación anti-CTLA-4 + anti-PD-1 tiene la mayor incidencia de colitis.</p><p>Manejo de acuerdo con ESMO 2022 / ASCO 2021 / NCCN (validar con protocolo institucional):<br>1. Suspender la inmunoterapia y hospitalizar; descartar causas infecciosas (coprocultivo, Clostridioides difficile, CMV en biopsia si hay refractariedad) sin retrasar el tratamiento.<br>2. Corticoide IV: metilprednisolona en el rango de 1–2 mg/kg/día.<br>3. Si no hay mejoría en 48–72 horas: inmunosupresor de segunda línea (infliximab o vedolizumab), previa tamización de tuberculosis y hepatitis B cuando sea posible.<br>4. Una vez controlada (grado 1 o menos), pasar a prednisona oral y descender gradualmente en al menos 4–6 semanas para evitar recaída.<br>5. Medidas de soporte: hidratación, reposición de potasio, evitar loperamida/opioides en colitis grave (riesgo de megacolon).</p><p>Intervenciones del QF:<br>- Verificar dosis de corticoide por peso, compatibilidad y estabilidad de infliximab y su disponibilidad (medicamento de alto costo; trámite MIPRES si la indicación no está financiada).<br>- Proponer profilaxis de Pneumocystis jirovecii si se prevé prednisona de 20 mg/día o más por 4 semanas o más; considerar protección gástrica si hay factores de riesgo, control de glucemia, calcio y vitamina D.<br>- Diseñar con el paciente un calendario escrito del descenso de corticoide.<br>- Notificar el evento adverso grave a INVIMA (farmacovigilancia) y registrar causalidad.<br>- Recordar al equipo que, tras colitis grado 3 por la combinación, generalmente no se reintroduce ipilimumab; la reexposición a anti-PD-1 se decide en junta cuando el evento se resuelve.</p><p>Puntos clave:<br>1. Graduar con CTCAE define la intensidad del manejo: grado 3 implica suspender, hospitalizar y corticoide IV.<br>2. Falta de respuesta en 48–72 h obliga a escalar a infliximab o vedolizumab.<br>3. El QF asegura el descenso lento de corticoides, las profilaxis y la notificación a INVIMA.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Terapias celulares, biespecíficos, vacunas y patrones de respuesta', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: más allá de los puntos de control', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Panorama de terapias celulares, anticuerpos biespecíficos, vacunas y virus oncolíticos, y de los patrones de respuesta propios de la inmunoterapia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=YvzxnnwZD9c","provider":"youtube","videoId":"YvzxnnwZD9c","title":"Tratamiento del cáncer con anticuerpos monoclonales","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cancer.org/es/cancer/tipos-de-tratamiento/inmunoterapia/anticuerpos-monoclonales.html","title":"[Página web] Anticuerpos monoclonales (incluye biespecíficos y activadores de linfocitos T)","description":"American Cancer Society (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'CAR-T: estructura, proceso e indicaciones', 'Clase 2 · Terapia con células CAR-T', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la construcción del receptor quimérico, el proceso (aféresis, fabricación, linfodepleción, infusión) e indicaciones en neoplasias hematológicas (anti-CD19, anti-BCMA).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=hC_OnQAL4eE","provider":"youtube","videoId":"hC_OnQAL4eE","title":"CAR T: una terapia que puede ayudar a tratar ciertos tipos de cáncer","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=tXr3M8vFWrk","provider":"youtube","videoId":"tXr3M8vFWrk","title":"¿Qué son las terapias CAR-T contra el cáncer? Video Resumen","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.cancer.org/es/cancer/tipos-de-tratamiento/inmunoterapia/terapia-de-celulas-t.html","title":"[Página web] Terapia con células CAR-T y sus efectos secundarios","description":"American Cancer Society (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Síndrome de liberación de citoquinas e ICANS', 'Clase 2 · Terapia con células CAR-T', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la fisiopatología, graduación ASTCT y manejo del SLC (tocilizumab, corticoides) y del ICANS (puntuación ICE, corticoides).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=6DGRG8AJ_Wg","provider":"youtube","videoId":"6DGRG8AJ_Wg","title":"CRS Explained: Understanding Cytokine Release Syndrome in CAR-T Therapy","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://bmtinfonet.org/sites/default/files/images/symposiums/2022%20ES%20CAR%20T-Cell%20Therapy%20The%20Good%20the%20Bad%20in%20Spanish.pdf","title":"Terapia de células CAR T: lo bueno, lo malo y el largo plazo (2022)","description":"BMT InfoNet (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://medintensiva.org/en-download-pdf-S2173572722000303","title":"Immune effector cell-associated neurotoxicity syndrome: a therapeutic approach in the critically ill (2022)","description":"Medicina Intensiva (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Anticuerpos biespecíficos y engagers de células T: blinatumomab y nuevos agentes', 'Clase 3 · Anticuerpos biespecíficos, vacunas y virus oncolíticos', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara blinatumomab (CD19/CD3) con otros engagers de células T, su forma de administración, escalada de dosis y riesgo de SLC y neurotoxicidad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=H3vJlqIGKYU","provider":"youtube","videoId":"H3vJlqIGKYU","title":"How does Blinatumomab (Blincyto) Work?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=DJNGa8tj0hY","provider":"youtube","videoId":"DJNGa8tj0hY","title":"Moffitt Medical Minute (Ep. 43) - Bispecific Antibodies (BsAbs) in Cancer Treatment","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.cancer.org/es/cancer/tipos-de-tratamiento/inmunoterapia/anticuerpos-monoclonales.html","title":"[Página web] Anticuerpos monoclonales (incluye biespecíficos y activadores de linfocitos T)","description":"American Cancer Society (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Vacunas oncológicas y virus oncolíticos: visión general', 'Clase 3 · Anticuerpos biespecíficos, vacunas y virus oncolíticos', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las vacunas terapéuticas aprobadas (BCG intravesical, sipuleucel-T), el desarrollo de vacunas de ARNm personalizadas y el virus oncolítico T-VEC.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.cancer.org/es/cancer/tipos-de-tratamiento/inmunoterapia/vacunas-contra-el-cancer.html","title":"[Página web] ¿Qué son las vacunas contra el cáncer?","description":"American Cancer Society (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cancer.org/es/cancer/tipos-de-tratamiento/inmunoterapia/oncolytic-virus-therapy.html","title":"[Página web] Terapia con virus oncolíticos y sus efectos secundarios","description":"American Cancer Society (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.farmaceuticos.com/noticias/el-farmaceutico-imprescindible-para-aprovechar-el-potencial-disruptivo-de-la-inmunoterapia/","title":"[Página web] Punto farmacológico 169: La inmunoterapia, presente y futuro","description":"Consejo General de Colegios Farmacéuticos (España) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Pseudoprogresión, hiperprogresión y criterios iRECIST', 'Clase 4 · Patrones de respuesta y caso clínico', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los patrones atípicos de respuesta y las categorías iUPD/iCPD de iRECIST, con confirmación por imagen a las 4–8 semanas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://recist.eortc.org/wp-content/uploads/sites/4/2017/03/Manuscript_IRECIST_Lancet-Oncology_Seymour-et-al_revision_FINAL_clean_nov25.pdf","title":"iRECIST: guidelines for response criteria for use in trials testing immunotherapeutics (Seymour et al., Lancet Oncol 2017)","description":"EORTC – RECIST Working Group (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ctg.queensu.ca/cctg_news/lancet-oncology-publishes-irecist","title":"[Página web] The Lancet Oncology publishes iRECIST","description":"Canadian Cancer Trials Group (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: síndrome de liberación de citoquinas tras CAR-T', 'Clase 4 · Patrones de respuesta y caso clínico', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El QF participa en el manejo de un SLC grado 2 y en la prevención de ICANS, asegurando rescates, profilaxis y farmacovigilancia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cancergrace.org/sites/default/files/2023-04/Efecto%20secundario%20de%20la%20terapia%20de%20ce%CC%81lulas%20CAR-T%20-%20Goodman.pdf","title":"Efecto secundario de la terapia de células CAR-T (Dr. Aaron Goodman)","description":"CancerGRACE (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 2, '{"html":"<p>Objetivo: ejecutar el abordaje farmacéutico de un síndrome de liberación de citoquinas (SLC) e ICANS en un paciente que recibe terapia CAR-T.</p><p>Caso: mujer de 45 años con linfoma B difuso de células grandes refractario a dos líneas, que recibe CAR-T anti-CD19 tras linfodepleción con fludarabina y ciclofosfamida. En el día +3 presenta fiebre de 39,2 °C, frecuencia cardiaca de 118 lpm y presión arterial 85/50 mmHg que responde a bolo de cristaloides, con saturación normal al aire ambiente.</p><p>Análisis: según la escala de consenso ASTCT (Lee et al., 2019), fiebre con hipotensión que no requiere vasopresores corresponde a SLC grado 2. El ICANS se evalúa por separado con la puntuación ICE (orientación, nombrar objetos, seguir órdenes, escritura y atención), nivel de conciencia, convulsiones, función motora y edema cerebral.</p><p>Manejo (según protocolo del centro y fichas técnicas del producto):<br>1. SLC grado 2: tocilizumab IV (anticuerpo anti-receptor de IL-6), dosis por peso con tope máximo según ficha técnica, repetible si no hay respuesta; añadir corticoide (dexametasona) si persiste la hipotensión o en grados mayores. Descartar sepsis y cubrir con antibióticos si hay neutropenia febril.<br>2. Si aparece ICANS: los corticoides son la base del tratamiento (tocilizumab no atraviesa bien la barrera hematoencefálica y no es eficaz sobre el ICANS aislado); anticonvulsivantes según protocolo (por ejemplo, levetiracetam profiláctico en algunos centros).</p><p>Intervenciones del QF antes y después de la infusión:<br>- Confirmar que la institución dispone de tocilizumab (las fichas técnicas exigen disponibilidad antes de infundir) y de corticoides.<br>- Revisar la premedicación: paracetamol y antihistamínico; evitar corticoides profilácticos salvo emergencia, porque pueden reducir la expansión de las células CAR-T.<br>- Verificar que no se use filtro leucocitario en la infusión y que la identificación del producto autólogo sea doble.<br>- Planear profilaxis antiinfecciosa (antiviral contra herpes, Pneumocystis), vigilar citopenias prolongadas e hipogammaglobulinemia (posible reposición de inmunoglobulina) y educar sobre no conducir durante al menos 8 semanas.<br>- Notificar los eventos a INVIMA y documentar en el seguimiento a largo plazo (incluida la vigilancia de neoplasias secundarias de células T señalada por agencias regulatorias).</p><p>Contexto colombiano: el acceso a CAR-T en Colombia es limitado y depende del registro sanitario vigente ante INVIMA, de centros habilitados y de la financiación (MIPRES/recobro). El QF participa en el comité que evalúa la solicitud.</p><p>Puntos clave:<br>1. Graduar SLC e ICANS con la escala ASTCT; son entidades distintas con manejo distinto.<br>2. Tocilizumab para SLC; corticoides como base del ICANS.<br>3. El QF asegura disponibilidad de rescates, premedicación adecuada, profilaxis y farmacovigilancia.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Rol del químico farmacéutico y acceso en Colombia', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: el QF en el equipo de inmunoterapia', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume las funciones del QF en selección, validación, preparación, educación, farmacovigilancia y gestión del acceso a la inmunoterapia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://gruposdetrabajo.sefh.es/infografias/backend/pdfs/papel_farmacia_oncologia_hematologia.pdf","title":"El papel de la farmacia hospitalaria en la atención al paciente oncológico o hematológico","description":"SEFH – Grupos de trabajo (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.farmaceuticos.com/noticias/el-farmaceutico-imprescindible-para-aprovechar-el-potencial-disruptivo-de-la-inmunoterapia/","title":"[Página web] Punto farmacológico 169: La inmunoterapia, presente y futuro","description":"Consejo General de Colegios Farmacéuticos (España) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Validación farmacéutica y seguimiento farmacoterapéutico', 'Clase 2 · Procesos farmacéuticos en inmunoterapia', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica una lista de chequeo de validación (indicación, biomarcador, dosis, intervalos, laboratorios, concomitantes) y define el plan de seguimiento por ciclo.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.sefh.es/bibliotecavirtual/Itinerario_Oncohemato/ItinerarioFormativo_Hematologica_ONCOLOGIA_TUTORES_GEDEFO.pdf","title":"Itinerario formativo en farmacia oncohematológica (GEDEFO)","description":"SEFH – GEDEFO (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://pubmed.ncbi.nlm.nih.gov/34724392/","title":"[Página web] Management of Immune-Related Adverse Events in Patients Treated With Immune Checkpoint Inhibitor Therapy: ASCO Guideline Update (2021)","description":"Journal of Clinical Oncology / PubMed (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Preparación y administración de anticuerpos monoclonales y biespecíficos', 'Clase 2 · Procesos farmacéuticos en inmunoterapia', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la preparación aséptica de ICI (dilución, no agitar, filtro en línea, estabilidad) y los requisitos especiales de blinatumomab.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: ejecutar de forma segura la preparación y dispensación de anticuerpos monoclonales inmunoterapéuticos en una central de mezclas.</p><p>Desarrollo: los inhibidores de puntos de control son proteínas, no citotóxicos clásicos; sin embargo, se preparan en condiciones asépticas en una central de mezclas habilitada (en Colombia, buenas prácticas de elaboración para servicios farmacéuticos según la normativa vigente de MinSalud e INVIMA) para garantizar esterilidad, exactitud de dosis e integridad de la proteína. Pasos generales (confirmar siempre en la ficha técnica de cada producto):<br>1. Validación previa de la orden (paciente, indicación, dosis, ciclo, laboratorios y ausencia de irAE no resuelto).<br>2. Inspección visual del vial: solución transparente o ligeramente opalescente; descartar si hay partículas o cambio de color.<br>3. Dilución en cloruro de sodio 0,9% o dextrosa 5% según el producto, hasta la concentración final indicada.<br>4. Mezclar por inversión suave; no agitar, porque la agitación desnaturaliza y agrega la proteína.<br>5. Administración con filtro en línea estéril, apirógeno y de baja unión a proteínas cuando la ficha técnica lo exige (por ejemplo, para nivolumab, pembrolizumab e ipilimumab), por vía exclusiva, sin mezclar con otros medicamentos.<br>6. Estabilidad: las soluciones diluidas tienen tiempos de uso limitados a temperatura ambiente y algo mayores refrigeradas (2–8 °C); no congelar; proteger de la luz si se indica. Rotular hora de preparación y vencimiento.<br>7. Formulaciones subcutáneas: algunas presentaciones nuevas contienen hialuronidasa y no son intercambiables por la IV; requieren dispensación diferenciada.</p><p>Casos especiales: blinatumomab, anticuerpo biespecífico CD19/CD3, se prepara con una solución estabilizadora específica que se añade antes del fármaco para evitar su adsorción a la bolsa, y se infunde de forma continua durante días con bombas programadas; los errores de preparación y de programación de bomba han causado sobredosis y están advertidos en su ficha técnica. El QF debe usar hojas de preparación estandarizadas y doble verificación.</p><p>Optimización: el uso de dosis fijas, el redondeo de dosis dentro de márgenes aceptados y el agrupamiento de pacientes para compartir viales (cuando la estabilidad microbiológica lo permite) reducen el desperdicio de medicamentos de alto costo.</p><p>Ejemplo colombiano: la central de mezclas de un hospital de Barranquilla programa a los pacientes con nivolumab el mismo día para aprovechar viales, con estabilidad documentada y trazabilidad en el sistema.</p><p>Puntos clave:<br>1. Asepsia, inversión suave (no agitar) y filtro en línea cuando aplique.<br>2. Respetar estabilidad, rotulado y vía exclusiva; las presentaciones SC no son intercambiables con la IV.<br>3. Blinatumomab exige protocolo propio y doble verificación por riesgo de errores graves.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Educación al paciente y farmacovigilancia de irAEs', 'Clase 2 · Procesos farmacéuticos en inmunoterapia', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica estrategias de educación (tarjeta de alerta, signos de alarma, contacto 24/7) y el proceso de notificación de eventos adversos a INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=WPuk9Dko7HU","provider":"youtube","videoId":"WPuk9Dko7HU","title":"Inmunoterapia y cáncer. Preguntas y respuestas","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cancer.org/es/cancer/como-sobrellevar-el-cancer/tipos-de-tratamiento/inmunoterapia/inhibidores-puestos-de-control-inmunitarios.html","title":"[Página web] Inhibidores de los puntos de control inmunitario y sus efectos secundarios","description":"American Cancer Society (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'INVIMA, Plan de Beneficios, MIPRES y Cuenta de Alto Costo', 'Clase 3 · Acceso a la inmunoterapia en Colombia', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la ruta de acceso: registro sanitario e indicaciones aprobadas por INVIMA, financiación con UPC o prescripción MIPRES, reporte a la Cuenta de Alto Costo y regulación de precios.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cuentadealtocosto.org/enfermedades-de-alto-costo/cancer/","title":"[Página web] Cáncer – Cuenta de Alto Costo (Resolución 0247 de 2014, situación del cáncer en Colombia)","description":"Cuenta de Alto Costo (Colombia) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cuentadealtocosto.org/situacion-del-cancer-en-la-poblacion-adulta-atendida-en-el-sgsss-de-colombia-en-2024/","title":"[Página web] Situación del cáncer en la población adulta atendida en el SGSSS de Colombia en 2024","description":"Cuenta de Alto Costo (Colombia) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Evaluación económica y sostenibilidad de la inmunoterapia en Colombia', 'Clase 3 · Acceso a la inmunoterapia en Colombia', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara estudios de costos y costo-efectividad de inhibidores de puntos de control en Colombia y estrategias de optimización (dosis fijas, viales compartidos, duración del tratamiento).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.ispor.org/heor-resources/presentations-database/presentation/euro2022-3567/121897","title":"[Página web] Comparing Costs of Immune Checkpoint Inhibitors for Treatment of 1L NSCLC in Colombia – A Cost Minimisation Analysis (2022)","description":"ISPOR / Value in Health (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://repositorio.unal.edu.co/bitstreams/f4bb89ae-c13e-4835-8748-4cb68faaff40/download","title":"Análisis de costo-efectividad de nivolumab + ipilimumab y pembrolizumab + axitinib vs. sunitinib en cáncer renal metastásico en Colombia (2023)","description":"Repositorio Universidad Nacional de Colombia (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso integrador: melanoma metastásico con nivolumab + ipilimumab', 'Clase 4 · Caso clínico integrador', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El QF gestiona el acceso, valida, prepara, educa y hace seguimiento de una paciente con inmunoterapia combinada hasta la detección y notificación de un irAE.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: ejecutar el seguimiento farmacoterapéutico integral de un paciente con inmunoterapia combinada, desde la prescripción hasta la farmacovigilancia, en el sistema de salud colombiano.</p><p>Caso: mujer de 49 años con melanoma metastásico BRAF no mutado, ECOG 0, afiliada a una EPS del régimen contributivo. Junta oncológica decide nivolumab + ipilimumab por 4 ciclos seguido de nivolumab de mantenimiento. Antecedente de tiroiditis de Hashimoto con levotiroxina.</p><p>Ruta de intervención del QF:<br>1. Acceso: verificar registro sanitario INVIMA vigente y que la indicación esté aprobada; revisar si la combinación está financiada con la UPC; si no lo está, apoyar al médico en la prescripción por MIPRES con la justificación y el soporte del biomarcador. Confirmar que el caso esté reportado a la Cuenta de Alto Costo (Resolución 0247 de 2014) y verificar precio de referencia si el medicamento está sujeto a control de precios.<br>2. Validación: dosis de ipilimumab por peso y nivolumab según ficha técnica; intervalos; laboratorio basal (hemograma, perfil hepático, creatinina, glucemia, TSH/T4L, cortisol, serologías hepatitis). La enfermedad autoinmune tiroidea previa no contraindica, pero aumenta la vigilancia.<br>3. Preparación: central de mezclas, filtros en línea, secuencia de administración según protocolo (nivolumab primero y luego ipilimumab en bolsas y líneas separadas).<br>4. Educación: tarjeta de alerta, diario de síntomas, signos de alarma por órgano, no automedicarse con corticoides ni suplementos, contacto 24/7, informar a cualquier médico que recibe inmunoterapia.<br>5. Seguimiento: llamada telefónica a la semana de cada ciclo; revisión de laboratorios antes de cada dosis. En el ciclo 2 la paciente refiere 5 deposiciones diarias sobre el basal (diarrea grado 2): el QF alerta al oncólogo, se difiere el ciclo y se inicia prednisona oral 0,5–1 mg/kg/día con descenso lento; se coordinan exámenes para descartar infección.<br>6. Farmacovigilancia: reporte del evento a INVIMA, análisis de causalidad, y registro en la historia; seguimiento de la resolución y decisión de reanudar al llegar a grado 1 o menos con prednisona de 10 mg/día o menos.<br>7. Indicadores: adherencia a citas, tiempo entre síntoma y consulta, eventos grado 3 o más, días de hospitalización evitados.</p><p>Puntos clave:<br>1. El QF coordina acceso (INVIMA, UPC/MIPRES, CAC), validación, preparación y educación como un solo proceso.<br>2. La detección temprana por seguimiento telefónico reduce irAEs graves.<br>3. Toda sospecha de irAE se documenta y se notifica a INVIMA.</p>"}'::jsonb);

END
$curso$;

-- ─── 4. Curso de Terapias Dirigidas en Oncología (34 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Terapias Dirigidas en Oncología' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Terapias Dirigidas en Oncología', 'Curso para Químicos Farmacéuticos sobre la medicina de precisión en oncología: biomarcadores y pruebas moleculares, anticuerpos monoclonales, conjugados anticuerpo-fármaco e inhibidores de moléculas pequeñas (ITK, CDK4/6, PARP, mTOR, BTK, BCL-2).', '<p>Curso para Químicos Farmacéuticos sobre la medicina de precisión en oncología: biomarcadores y pruebas moleculares, anticuerpos monoclonales, conjugados anticuerpo-fármaco e inhibidores de moléculas pequeñas (ITK, CDK4/6, PARP, mTOR, BTK, BCL-2). Integra el manejo de toxicidades, las interacciones, la adherencia, la resistencia y el acceso en el sistema de salud colombiano (MIPRES, biosimilares y regulación de precios) mediante casos clínicos.</p><h3>Objetivo general</h3><p>Que el QF comprenda el mecanismo, las indicaciones basadas en biomarcadores, la farmacocinética, las toxicidades y las interacciones de las principales terapias dirigidas en oncología, y que aplique intervenciones de seguimiento farmacoterapéutico, farmacovigilancia y gestión del acceso en el contexto colombiano.</p><h3>A quién va dirigido</h3><p>Químicos Farmacéuticos de servicios farmacéuticos oncológicos, centrales de mezclas, gestores farmacéuticos, EPS e industria farmacéutica en Colombia; estudiantes de último año de Química Farmacéutica.</p><h3>Contexto normativo</h3><p>Colombia — GPC MinSalud/IETS, PBS/MIPRES, INVIMA</p>',
          'Farmacología', 'intermedio', 'Que el QF comprenda el mecanismo, las indicaciones basadas en biomarcadores, la farmacocinética, las toxicidades y las interacciones de las principales terapias dirigidas en oncología, y que aplique intervenciones de seguimiento farmacoterapéutico, farmacovigilancia y gestión del acceso en el contexto colombiano.', 'Químicos Farmacéuticos de servicios farmacéuticos oncológicos, centrales de mezclas, gestores farmacéuticos, EPS e industria farmacéutica en Colombia; estudiantes de último año de Química Farmacéutica.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Medicina de precisión y biomarcadores en oncología', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: de la quimioterapia a la terapia dirigida', 'Clase 1 · Introducción al curso', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Presenta el concepto de terapia dirigida, sus grandes familias (anticuerpos monoclonales, conjugados anticuerpo-fármaco y moléculas pequeñas) y la ruta del curso.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=UjrO9IT71Vw","provider":"youtube","videoId":"UjrO9IT71Vw","title":"Medicina de precisión en oncología y biomarcadores tumorales","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cancer.gov/espanol/cancer/tratamiento/tipos/terapia-dirigida","title":"[Página web] Terapia dirigida para tratar el cáncer","description":"Instituto Nacional del Cáncer (NCI, EE. UU.) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Oncogenes conductores y vías de señalización (RTK, MAPK, PI3K/AKT/mTOR)', 'Clase 2 · Bases moleculares y biomarcadores', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe cómo las mutaciones conductoras activan los receptores tirosina cinasa y las cascadas intracelulares, que son las dianas de la terapia dirigida.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=F4_KXCN3B0w","provider":"youtube","videoId":"F4_KXCN3B0w","title":"Los receptores tirosina quinasa y la vía de señalización de las MAP quinasas","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cancer.org/es/cancer/tipos-de-tratamiento/terapia-dirigida/como-funciona-la-terapia-dirigida.html","title":"[Página web] ¿Cómo funciona la terapia dirigida?","description":"American Cancer Society (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Biomarcadores predictivos y pronósticos: IHQ, FISH y PCR', 'Clase 2 · Bases moleculares y biomarcadores', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Diferencia los biomarcadores predictivos de los pronósticos e interpreta las pruebas clásicas (HER2 por IHQ/ISH, RAS, EGFR, BCR-ABL, BRAF).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=gCaSBkwJDfY","provider":"youtube","videoId":"gCaSBkwJDfY","title":"Qué son los biomarcadores en cáncer y para qué sirven","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cancer.gov/espanol/cancer/tratamiento/tipos/pruebas-de-biomarcadores-tratamiento-cancer","title":"[Página web] Pruebas de biomarcadores para el tratamiento de cáncer","description":"Instituto Nacional del Cáncer (NCI, EE. UU.) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Secuenciación de nueva generación (NGS) y biopsia líquida', 'Clase 3 · Pruebas moleculares de nueva generación', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Explica las ventajas de los paneles NGS frente a las pruebas individuales y el uso del ADN tumoral circulante para el diagnóstico y el seguimiento de la resistencia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=hJD9cm9HDaE","provider":"youtube","videoId":"hJD9cm9HDaE","title":"Avanzando en medicina de precisión: biomarcadores y NGS","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=I24W1KjW-WI","provider":"youtube","videoId":"I24W1KjW-WI","title":"Benefits of Next Generation Sequencing (NGS) biomarker testing for cancer patients","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC10197306","title":"[Página web] La biopsia líquida en el manejo del cáncer: una nueva herramienta revolucionaria de la medicina de precisión, aún con limitaciones","description":"PubMed Central (artículo de revisión) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: paciente con CPCNP sin perfil molecular completo', 'Clase 3 · Pruebas moleculares de nueva generación', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso de adenocarcinoma de pulmón avanzado en el que el QF identifica la falta de pruebas de EGFR, ALK, ROS1, BRAF y PD-L1 antes de iniciar el tratamiento, y propone la ruta de solicitud.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=VEbVimYrZgo","provider":"youtube","videoId":"VEbVimYrZgo","title":"Terapia personalizada en cáncer de pulmón: EGFR, ALK, ROS1, BRAF – Dr. Hugo Castro, oncólogo","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cancer.gov/espanol/cancer/tratamiento/tipos/pruebas-de-biomarcadores-tratamiento-cancer","title":"[Página web] Pruebas de biomarcadores para el tratamiento de cáncer","description":"Instituto Nacional del Cáncer (NCI, EE. UU.) (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Anticuerpos monoclonales dirigidos y conjugados anticuerpo-fármaco', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: estructura y mecanismos de los anticuerpos monoclonales', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la estructura de los anticuerpos monoclonales, sus mecanismos (bloqueo de ligando o receptor, ADCC, CDC) y su farmacocinética característica.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=YvzxnnwZD9c","provider":"youtube","videoId":"YvzxnnwZD9c","title":"Tratamiento del cáncer con anticuerpos monoclonales","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cancer.org/es/cancer/tipos-de-tratamiento/terapia-dirigida/como-funciona-la-terapia-dirigida.html","title":"[Página web] ¿Cómo funciona la terapia dirigida?","description":"American Cancer Society (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Trastuzumab y pertuzumab: bloqueo dual de HER2 y cardiotoxicidad', 'Clase 2 · Anti-HER2 y anti-EGFR', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el mecanismo complementario de trastuzumab y pertuzumab, sus indicaciones en cáncer de mama y gástrico HER2+, y el monitoreo de la FEVI.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=PhVuwt_Q4mQ","provider":"youtube","videoId":"PhVuwt_Q4mQ","title":"¿Cómo funcionan los anticuerpos monoclonales? – Mecanismos de acción","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/00145001/FT_00145001.pdf","title":"Ficha técnica Herceptin (trastuzumab)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Cetuximab y panitumumab: la importancia del estado de RAS', 'Clase 2 · Anti-HER2 y anti-EGFR', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta por qué los anti-EGFR solo benefician al cáncer colorrectal RAS no mutado y cómo manejar el rash acneiforme y la hipomagnesemia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=YvzxnnwZD9c","provider":"youtube","videoId":"YvzxnnwZD9c","title":"Tratamiento del cáncer con anticuerpos monoclonales","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/04281003/FT_04281003.pdf","title":"Ficha técnica Erbitux (cetuximab)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Bevacizumab: antiangiogénesis y sus toxicidades', 'Clase 3 · Anti-VEGF y anti-CD20', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el mecanismo anti-VEGF y la vigilancia de la hipertensión, la proteinuria, las hemorragias, la perforación y la cicatrización.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cima.aemps.es/cima/pdfs/ft/04300001/FT_04300001.pdf","title":"Ficha técnica Avastin (bevacizumab)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cancer.org/es/cancer/tipos-de-tratamiento/terapia-dirigida/efectos-secundarios.html","title":"[Página web] Efectos secundarios de la terapia dirigida","description":"American Cancer Society (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Rituximab: anti-CD20, reacciones a la infusión y reactivación de hepatitis B', 'Clase 3 · Anti-VEGF y anti-CD20', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Explica el mecanismo de rituximab en linfomas y LLC, la premedicación, la velocidad de infusión, la forma subcutánea y el tamizaje obligatorio de VHB.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=uN873azbjM8","provider":"youtube","videoId":"uN873azbjM8","title":"How does Rituxan (Rituximab) Work?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/98067001/FT_98067001.pdf","title":"Ficha técnica MabThera (rituximab)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Concepto de ADC: anticuerpo, enlazador y carga citotóxica', 'Clase 4 · Conjugados anticuerpo-fármaco (ADC)', 5, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los componentes de los ADC, el efecto bystander y las diferencias entre T-DM1 y T-DXd.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=qv7njgyS99o","provider":"youtube","videoId":"qv7njgyS99o","title":"How Antibody Drug Conjugates Work: Smarter Cancer Treatment Explained","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/113885001/FT_113885001.pdf","title":"Ficha técnica Kadcyla (trastuzumab emtansina)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'T-DXd y enfortumab vedotina: indicaciones y toxicidades clave', 'Clase 4 · Conjugados anticuerpo-fármaco (ADC)', 6, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las indicaciones (HER2+, HER2-bajo, urotelial) y las toxicidades: EPI/neumonitis, reacciones cutáneas graves, hiperglucemia y neuropatía.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=tARwM8XYyKY","provider":"youtube","videoId":"tARwM8XYyKY","title":"Trastuzumab-Deruxtecan: A Game-Changer in HER2-Positive Cancers – Pharmacology","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/1201508001/FT_1201508001.pdf","title":"Ficha técnica Enhertu (trastuzumab deruxtecán)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://cima.aemps.es/cima/pdfs/ft/1211615001/FT_1211615001.pdf","title":"Ficha técnica Padcev (enfortumab vedotina)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: tos y disnea en una paciente con T-DXd', 'Clase 4 · Conjugados anticuerpo-fármaco (ADC)', 7, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso clínico de sospecha de enfermedad pulmonar intersticial, en el que el QF detiene la dispensación, comunica al oncólogo y reporta al INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar el seguimiento farmacoterapéutico a una paciente en tratamiento con un conjugado anticuerpo-fármaco (trastuzumab deruxtecán, T-DXd), con énfasis en la detección temprana de enfermedad pulmonar intersticial (EPI)/neumonitis y en la coordinación con el equipo oncológico.</p><p>Desarrollo: T-DXd es un ADC formado por trastuzumab, un enlazador escindible por proteasas y un inhibidor de la topoisomerasa I (derivado de exatecán) con alta relación fármaco-anticuerpo y efecto \"bystander\" sobre células vecinas. Esto explica su actividad en tumores HER2-positivos y también en HER2-bajo (e incluso HER2-ultrabajo en cáncer de mama según indicaciones aprobadas recientemente). Sus toxicidades más relevantes para el QF son náuseas y vómitos (considerarlo de riesgo emetógeno moderado-alto y verificar la profilaxis antiemética prescrita), neutropenia, fatiga, alopecia, disminución de la fracción de eyección y, sobre todo, EPI/neumonitis, que figura como advertencia principal en la ficha técnica y puede ser fatal. La ficha técnica establece la conducta según el grado: en EPI asintomática (grado 1) se interrumpe el fármaco hasta la resolución y se valoran corticoides; en EPI sintomática (grado 2 o mayor) se suspende de forma definitiva y se inician corticoides sistémicos. Factores que aumentan el riesgo: antecedente de enfermedad pulmonar, función renal reducida, origen asiático en algunos estudios y exposición acumulada.</p><p>Caso aplicado (Colombia): mujer de 54 años, afiliada al régimen contributivo, con cáncer de mama metastásico HER2-positivo que progresó a trastuzumab, pertuzumab y taxano. La oncóloga prescribe T-DXd mediante MIPRES. En la tercera aplicación, en la entrevista farmacéutica en la central de mezclas de la IPS, la paciente refiere tos seca de 10 días y disnea leve al subir escaleras, que atribuye a \"un resfriado\". Tiene saturación de 94 %. Intervención del QF: (1) no dispensar ni liberar la preparación hasta la valoración médica y comunicar de inmediato a la oncóloga la sospecha de EPI; (2) sugerir, según protocolo institucional, tomografía de tórax de alta resolución y valoración por neumología; (3) revisar la conciliación medicamentosa para descartar otros fármacos neumotóxicos; (4) documentar el evento y reportarlo como sospecha de reacción adversa al Programa Nacional de Farmacovigilancia del INVIMA (eReporting); (5) educar a la paciente para que consulte ante tos, disnea o fiebre nuevas, sin esperar la siguiente cita. Finalmente, registrar la intervención en la historia clínica y en el seguimiento farmacoterapéutico.</p><p>Puntos clave:<br>1. Toda tos o disnea nueva en un paciente que recibe T-DXd es EPI hasta demostrar lo contrario; el QF debe detener la cadena de preparación/dispensación y avisar al oncólogo.<br>2. La conducta depende del grado: interrupción en grado 1 y suspensión definitiva desde grado 2, siempre según la ficha técnica vigente.<br>3. La farmacovigilancia activa (reporte al INVIMA) y la educación del paciente son parte del valor agregado del QF en terapias de alto costo.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Inhibidores de tirosina cinasa y otras moléculas pequeñas', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: farmacología general de los ITK', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume el mecanismo de los ITK (competencia por ATP), su administración oral, su metabolismo por CYP3A4 y sus toxicidades de clase.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=LCfWsF3y_W0","provider":"youtube","videoId":"LCfWsF3y_W0","title":"Inhibidores de la Tirosin Cinasa","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ncbi.nlm.nih.gov/books/NBK563322/","title":"[Página web] Tyrosine Kinase Inhibitors – StatPearls","description":"NCBI Bookshelf – StatPearls (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Imatinib y los ITK de BCR-ABL en la leucemia mieloide crónica', 'Clase 2 · BCR-ABL, EGFR, ALK y BRAF/MEK', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el modelo de imatinib, las generaciones de ITK de BCR-ABL, el monitoreo de la respuesta molecular y sus toxicidades diferenciales.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=jJe30PyviU4","provider":"youtube","videoId":"jJe30PyviU4","title":"CML: Frontline BCR-ABL TKI Therapy","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/01198010/FT_01198010.pdf","title":"Ficha técnica Glivec (imatinib)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.ncbi.nlm.nih.gov/books/NBK563322/","title":"[Página web] Tyrosine Kinase Inhibitors – StatPearls","description":"NCBI Bookshelf – StatPearls (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Inhibidores de EGFR (osimertinib) y de ALK en el cáncer de pulmón', 'Clase 2 · BCR-ABL, EGFR, ALK y BRAF/MEK', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara las generaciones de ITK de EGFR y ALK, su actividad en el SNC, sus indicaciones (enfermedad avanzada y adyuvancia) y sus toxicidades.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=n2mWmcKfGAs","provider":"youtube","videoId":"n2mWmcKfGAs","title":"Inhibidores de EGFR para el CPCNP: qué son y cómo funcionan","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/1161086002/FT_1161086002.pdf","title":"Ficha técnica Tagrisso (osimertinib)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://cima.aemps.es/cima/pdfs/ft/1161169001/FT_1161169001.pdf","title":"Ficha técnica Alecensa (alectinib)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Inhibidores de BRAF/MEK en melanoma y otros tumores BRAF V600E', 'Clase 2 · BCR-ABL, EGFR, ALK y BRAF/MEK', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Explica la combinación BRAF+MEK para reducir la activación paradójica, la pirexia y la toxicidad cutánea.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=8wtsnbDw4DQ","provider":"youtube","videoId":"8wtsnbDw4DQ","title":"BRAF/MEK Inhibitors in Metastatic Melanoma","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=cdrbS_upjQQ","provider":"youtube","videoId":"cdrbS_upjQQ","title":"Management of Side Effects for BRAF/MEK Inhibitors for Melanoma","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://cima.aemps.es/cima/pdfs/ft/113865001/FT_113865001.pdf","title":"Ficha técnica Tafinlar (dabrafenib)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'ITK multicinasa antiangiogénicos: sorafenib y lenvatinib', 'Clase 3 · Multicinasa, CDK4/6, PARP y mTOR', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe su uso en hepatocarcinoma, cáncer de tiroides y cáncer renal, y el manejo de la hipertensión, el síndrome mano-pie y la proteinuria.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=9No8P4ojbDk","provider":"youtube","videoId":"9No8P4ojbDk","title":"Inhibidores de las tirosina cinasas y rediferenciadores – Dra. Rosella Elisei","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/1151002002/FT_1151002002.pdf","title":"Ficha técnica Lenvima (lenvatinib)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Inhibidores de CDK4/6: palbociclib, ribociclib y abemaciclib', 'Clase 3 · Multicinasa, CDK4/6, PARP y mTOR', 5, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los tres inhibidores de CDK4/6 en el cáncer de mama RH+/HER2-: neutropenia, prolongación del QT (ribociclib), diarrea (abemaciclib) y uso adyuvante.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=9K6luQO-QVE","provider":"youtube","videoId":"9K6luQO-QVE","title":"CDK 4/6 Inhibitors for Breast Cancer: How They Work, Who Gets Them, What to Expect","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=bpJPcF4VmTI","provider":"youtube","videoId":"bpJPcF4VmTI","title":"PATINA: mantenimiento con palbociclib más anti-HER2 en cáncer de mama avanzado HER2+/RH+ – Lo básico","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://cima.aemps.es/cima/pdfs/ft/1171221001/FT_1171221001.pdf","title":"Ficha técnica Kisqali (ribociclib)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Inhibidores de PARP y de mTOR', 'Clase 3 · Multicinasa, CDK4/6, PARP y mTOR', 6, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la letalidad sintética en tumores con mutación de BRCA o deficiencia de recombinación homóloga, y describe everolimus (estomatitis, neumonitis, hiperglucemia).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=sPEFrjmK38I","provider":"youtube","videoId":"sPEFrjmK38I","title":"Pharmacology of Olaparib: mechanism of action, pharmacokinetics, uses, effects","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/114959002/FT_114959002.pdf","title":"Ficha técnica Lynparza (olaparib)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://cima.aemps.es/cima/pdfs/ft/09538004/FT_09538004.pdf","title":"Ficha técnica Afinitor (everolimus)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Inhibidores de BTK (ibrutinib y de segunda generación) y de BCL-2 (venetoclax)', 'Clase 4 · Terapias dirigidas en hematología: BTK y BCL-2', 7, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los inhibidores de BTK (fibrilación auricular, sangrado, hipertensión) y venetoclax (síndrome de lisis tumoral y escalada de dosis) en LLC y linfomas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=bAo5Vwq3UsY","provider":"youtube","videoId":"bAo5Vwq3UsY","title":"The potential role of BCL2 inhibitors in the CLL treatment landscape","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/114945001/FT_114945001.pdf","title":"Ficha técnica Imbruvica (ibrutinib)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://cima.aemps.es/cima/pdfs/ft/161138005/FT_161138005.pdf","title":"Ficha técnica Venclyxto (venetoclax)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: inicio de venetoclax en LLC, lisis tumoral e interacciones CYP3A4', 'Clase 4 · Terapias dirigidas en hematología: BTK y BCL-2', 8, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso en el que el QF valida la escalada de dosis, la profilaxis del SLT y la conciliación con antimicrobianos que interactúan.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: ejecutar la validación farmacéutica del inicio de venetoclax en leucemia linfocítica crónica (LLC), con foco en la prevención del síndrome de lisis tumoral (SLT) y en las interacciones mediadas por CYP3A4 y glicoproteína P.</p><p>Desarrollo: venetoclax es un inhibidor selectivo de BCL-2, proteína antiapoptótica sobreexpresada en LLC. Al liberar la apoptosis, produce una reducción rápida de la masa tumoral, por lo que el SLT es su riesgo más grave al inicio. Por eso la ficha técnica exige una fase de escalada de dosis de cinco semanas (aumentos semanales hasta la dosis objetivo), estratificación del riesgo de SLT según la carga tumoral (tamaño de adenopatías y recuento absoluto de linfocitos), hidratación oral (o intravenosa en alto riesgo), un hipouricemiante desde antes del inicio (alopurinol; rasburicasa en casos seleccionados) y control de química sanguínea (potasio, fósforo, calcio, ácido úrico, creatinina) antes de cada dosis inicial y de cada aumento, en los tiempos que indica la ficha. Venetoclax es sustrato de CYP3A4 y de P-gp: los inhibidores potentes de CYP3A4 (posaconazol, voriconazol, claritromicina, ritonavir) están contraindicados durante el inicio y la escalada en LLC, y después requieren una reducción importante de la dosis; los inhibidores moderados y los de P-gp también exigen ajuste o evitarlos, y los inductores (rifampicina, carbamazepina, fenitoína, hierba de San Juan) reducen la exposición. Se debe evitar el pomelo/toronja y la naranja agria. Venetoclax se toma con alimentos y agua, siempre a la misma hora.</p><p>Caso aplicado (Colombia): hombre de 68 años con LLC con del(17p), que tiene creatinina estable con TFGe de 55 mL/min y adenopatías de 6 cm. Su hematólogo prescribe venetoclax con obinutuzumab. En la conciliación, el QF del servicio farmacéutico de la EPS encuentra que recibe fluconazol profiláctico (inhibidor moderado de CYP3A4), que un médico general le formuló claritromicina por una sinusitis la semana anterior y que no tiene alopurinol prescrito. Intervención: (1) clasificar el riesgo de SLT (alto, por adenopatía de 5 cm o más) y recomendar hospitalización para las primeras dosis según protocolo; (2) solicitar suspender la claritromicina y proponer una alternativa sin interacción relevante; (3) informar al hematólogo sobre el fluconazol para valorar la reducción de dosis según la ficha técnica; (4) recomendar iniciar alopurinol antes de la primera dosis y asegurar los paraclínicos; (5) entregar un calendario visual de escalada y educar en hidratación (aproximadamente 1,5 a 2 L/día, según indicación médica); (6) verificar la autorización (MIPRES o PBS, según corresponda) para evitar interrupciones en la escalada.</p><p>Puntos clave:<br>1. El SLT es prevenible: la escalada de cinco semanas, la hidratación, el hipouricemiante y el monitoreo de laboratorio no son opcionales.<br>2. La conciliación debe buscar activamente inhibidores e inductores de CYP3A4/P-gp, incluidos antimicrobianos y antifúngicos formulados por otros prescriptores.<br>3. La educación y la continuidad del suministro son críticas en terapias orales de alto costo.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Seguridad: toxicidades, interacciones, adherencia y resistencia', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: el perfil de seguridad de las terapias dirigidas', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume por qué las toxicidades se derivan de la diana (on-target) o de otras dianas (off-target), y el papel de la farmacovigilancia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=GD_n5DJ_wvw","provider":"youtube","videoId":"GD_n5DJ_wvw","title":"Inhibidores de tirosina cinasas – Efectos secundarios – Dra. Rosella Elisei","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cancer.org/es/cancer/tipos-de-tratamiento/terapia-dirigida/efectos-secundarios.html","title":"[Página web] Efectos secundarios de la terapia dirigida","description":"American Cancer Society (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Toxicidad dermatológica y gastrointestinal: rash acneiforme, mano-pie y diarrea', 'Clase 2 · Toxicidades características', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica la graduación CTCAE y las medidas preventivas y terapéuticas del rash por anti-EGFR, el síndrome mano-pie y la diarrea por ITK o CDK4/6.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.cancer.org/es/cancer/tipos-de-tratamiento/terapia-dirigida/efectos-secundarios.html","title":"[Página web] Efectos secundarios de la terapia dirigida","description":"American Cancer Society (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Toxicidad cardiovascular, hepática y pulmonar: HTA, QT, FEVI, hepatotoxicidad y EPI', 'Clase 2 · Toxicidades características', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los esquemas de monitoreo (presión arterial, ECG, ecocardiograma, pruebas hepáticas y síntomas respiratorios) por familia de fármacos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.revespcardiol.org/es-congresos-sec-2025-el-congreso-de-la-salud-cardiov-178-sesion-6004-cardio-oncologia-8809-comunicacion-cardiotoxicidad-inducida-por-inhibidores-107766-pdf","title":"Cardiotoxicidad inducida por inhibidores (comunicación, Congreso SEC 2025 – Cardio-oncología)","description":"Revista Española de Cardiología (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ncbi.nlm.nih.gov/books/NBK563322/","title":"[Página web] Tyrosine Kinase Inhibitors – StatPearls","description":"NCBI Bookshelf – StatPearls (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Interacciones por CYP3A4, P-gp, pH gástrico (antiácidos/IBP) y alimentos', 'Clase 3 · Interacciones y adherencia en terapias orales', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Analiza las interacciones más relevantes de los ITK y cómo resolverlas según la ficha técnica (evitar, separar o ajustar dosis).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.ncbi.nlm.nih.gov/books/NBK563322/","title":"[Página web] Tyrosine Kinase Inhibitors – StatPearls","description":"NCBI Bookshelf – StatPearls (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/01198010/FT_01198010.pdf","title":"Ficha técnica Glivec (imatinib)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: pérdida de respuesta a dasatinib por IBP, hipérico y falta de adherencia', 'Clase 3 · Interacciones y adherencia en terapias orales', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso integrador en el que el QF descarta causas farmacológicas antes de asumir resistencia molecular en la LMC.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar un método sistemático de revisión de interacciones y adherencia en un paciente que recibe inhibidores de tirosina cinasa (ITK) orales, integrando CYP3A4, pH gástrico, prolongación del QT y alimentos.</p><p>Desarrollo: la mayoría de los ITK son sustratos de CYP3A4, por lo que los inhibidores potentes (claritromicina, itraconazol, voriconazol, ritonavir, pomelo) aumentan su exposición y toxicidad, y los inductores (rifampicina, carbamazepina, fenitoína, hierba de San Juan) pueden causar fracaso terapéutico. Además, varios ITK tienen solubilidad dependiente del pH: su absorción disminuye con inhibidores de la bomba de protones (IBP), antagonistas H2 y antiácidos. Ejemplos clásicos son erlotinib, gefitinib, dasatinib, bosutinib y pazopanib. La recomendación general de las fichas técnicas es evitar los IBP; si se necesita supresión ácida, usar un antagonista H2 o un antiácido escalonados en el tiempo respecto del ITK, con los intervalos exactos que define cada ficha. Osimertinib, imatinib y alectinib no muestran una interacción clínicamente relevante con IBP, lo que demuestra que no se puede generalizar. Otros ITK (nilotinib, vandetanib, ribociclib, lapatinib, entre otros) prolongan el QT y requieren ECG y electrolitos, así como evitar otros fármacos que prolongan el QT (macrólidos, fluoroquinolonas, ondansetrón a dosis altas, antipsicóticos, metadona). La relación con los alimentos también es específica: nilotinib se toma en ayunas, imatinib con alimentos y lapatinib en ayunas.</p><p>Caso aplicado (Colombia): mujer de 61 años con leucemia mieloide crónica que cambió de imatinib a dasatinib por respuesta subóptima. Consulta en la farmacia de su EPS porque \"le volvió a subir el BCR-ABL\". En la entrevista refiere omeprazol de 20 mg diarios por gastritis (comprado sin fórmula), un preparado de hierbas con hipérico \"para el ánimo\" y olvidos de dosis los fines de semana. Intervención del QF: (1) explicar que el omeprazol reduce la absorción de dasatinib y proponer al médico suspenderlo o cambiarlo por un antiácido separado en el tiempo, según la ficha técnica; (2) identificar el hipérico como inductor potente de CYP3A4 y recomendar su suspensión; (3) medir la adherencia (conteo de tabletas, test de Morisky-Green u otra herramienta validada, registros de dispensación) y acordar estrategias (alarma, pastillero, vincular la toma a una rutina); (4) recordar la vigilancia del derrame pleural, propio de dasatinib; (5) comunicar al hematólogo los hallazgos antes de concluir que existe resistencia molecular y sugerir repetir la PCR cuantitativa de BCR-ABL tras corregir los factores; (6) registrar la intervención y reportar si hay sospecha de falla terapéutica.</p><p>Puntos clave:<br>1. Ante una pérdida de respuesta a un ITK, descarte primero la falta de adherencia y las interacciones antes de asumir resistencia.<br>2. La interacción con IBP depende de cada molécula: consulte siempre la ficha técnica.<br>3. Los productos naturales y la automedicación (IBP sin fórmula, hipérico, pomelo) deben preguntarse de forma explícita en la conciliación.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Mecanismos de resistencia a las terapias dirigidas', 'Clase 4 · Mecanismos de resistencia', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la resistencia por alteración de la diana, las vías de escape, la transformación histológica y las causas farmacológicas, con ejemplos (T315I, T790M/C797S, MET).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: comprender los principales mecanismos de resistencia a las terapias dirigidas y su implicación en la selección de la siguiente línea y en el seguimiento farmacoterapéutico.</p><p>Desarrollo: la resistencia puede ser primaria (el tumor no responde desde el inicio) o adquirida (progresión tras una respuesta inicial). Se agrupa en cuatro grandes mecanismos. (1) Alteraciones en la diana: mutaciones secundarias que impiden la unión del fármaco. Ejemplos: T315I en BCR-ABL, que confiere resistencia a imatinib, dasatinib, nilotinib y bosutinib, y que es sensible a ponatinib y asciminib; T790M en EGFR tras ITK de primera o segunda generación, que fue la base del desarrollo de osimertinib; C797S, que surge con osimertinib; y mutaciones de ALK como G1202R, que orientan hacia lorlatinib. (2) Activación de vías alternativas (bypass): amplificación de MET o de HER2 en cáncer de pulmón EGFR-mutado, y reactivación de MAPK en melanoma tratado con inhibidores de BRAF, lo que justificó combinar BRAF con MEK. En cáncer colorrectal tratado con anti-EGFR, la aparición de mutaciones de RAS en clones resistentes es un mecanismo típico. (3) Transformación histológica: por ejemplo, la transformación a carcinoma de células pequeñas en adenocarcinoma de pulmón EGFR-mutado, que cambia completamente el tratamiento. (4) Factores farmacológicos: concentraciones insuficientes por mala adherencia, interacciones con inductores de CYP3A4, absorción reducida por IBP o santuarios como el sistema nervioso central (la mejor penetración en el SNC de osimertinib, alectinib y lorlatinib es una ventaja clínica). En los ADC se describen la pérdida del antígeno, el aumento de las bombas de eflujo y la alteración del procesamiento lisosomal; en los CDK4/6, la pérdida de RB1 y la activación de ciclina E; en los PARP, la restauración de la recombinación homóloga (mutaciones de reversión de BRCA).</p><p>Caso aplicado (Colombia): paciente con adenocarcinoma de pulmón EGFR exón 19 en tratamiento con osimertinib durante 20 meses, que presenta progresión. Antes de cambiar de tratamiento, el oncólogo solicita una nueva caracterización molecular. El QF aporta: el historial de dispensación (que confirma una adherencia mayor al 95 %), la ausencia de inductores en la conciliación y la información de que la biopsia líquida (ADN tumoral circulante) puede detectar amplificación de MET o C797S sin una nueva biopsia de tejido; si es negativa, se recomienda biopsia tisular para descartar transformación histológica. Con esto se evita atribuir a la resistencia lo que en realidad es un problema farmacológico, y se orienta la gestión del MIPRES para la siguiente línea.</p><p>Puntos clave:<br>1. Los mecanismos de resistencia son: diana (mutaciones secundarias), bypass, transformación histológica y factores farmacológicos.<br>2. La reevaluación molecular (biopsia líquida o tisular) al progresar guía la siguiente terapia.<br>3. El QF descarta las causas farmacológicas (adherencia, interacciones, absorción) antes de declarar resistencia biológica.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: progresión con osimertinib y uso de la biopsia líquida', 'Clase 4 · Mecanismos de resistencia', 6, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso en el que el QF apoya la reevaluación molecular al progresar y documenta la adherencia y las interacciones para orientar la siguiente línea.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=WyYFrFbonS8","provider":"youtube","videoId":"WyYFrFbonS8","title":"Terapia dirigida en el cáncer de pulmón de células no pequeñas","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC10197306","title":"[Página web] La biopsia líquida en el manejo del cáncer: una nueva herramienta revolucionaria de la medicina de precisión, aún con limitaciones","description":"PubMed Central (artículo de revisión) (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Acceso en Colombia y casos integradores', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: alto costo, sostenibilidad y acceso a terapias dirigidas', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume los retos de acceso y sostenibilidad de las terapias dirigidas en Colombia y el aporte de los biosimilares.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=FOd5ttyXDbE","provider":"youtube","videoId":"FOd5ttyXDbE","title":"Biosimilares en cáncer: trastuzumab, bevacizumab, rituximab, epoetinas, filgrastim, pegfilgrastim","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://consultorsalud.com/biosimilares-oportunidad-sistema-de-salud/","title":"[Página web] BioSummit: biosimilares, una oportunidad para el sistema de salud colombiano","description":"Consultorsalud (Colombia) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'PBS, MIPRES, presupuestos máximos y Cuenta de Alto Costo', 'Clase 2 · Marco de acceso, biosimilares y precios', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe cómo se financian y prescriben las terapias dirigidas en Colombia y el papel del QF en la gestión y el reporte.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: describir las rutas de acceso a terapias dirigidas en el sistema de salud colombiano y el papel del QF en su gestión: Plan de Beneficios en Salud (PBS) con cargo a la UPC, MIPRES y presupuestos máximos, Cuenta de Alto Costo y continuidad del tratamiento.</p><p>Desarrollo: en Colombia, las tecnologías en salud se financian por dos vías principales. La primera es el PBS con cargo a la UPC, cuyo listado de medicamentos actualiza anualmente el Ministerio de Salud mediante resolución. Varias moléculas oncológicas (por ejemplo, algunos anticuerpos monoclonales y biosimilares) se han ido incluyendo con indicaciones específicas, por lo que el QF debe consultar la resolución vigente y la indicación financiada, no solo el principio activo. La segunda vía son las tecnologías no financiadas con la UPC, que se prescriben a través de MIPRES (Mi Prescripción), la herramienta tecnológica del Ministerio. Desde la Resolución 1885 de 2018 (régimen contributivo) y su armonización posterior, el médico tratante prescribe directamente en la plataforma, y se financian con los presupuestos máximos que el Ministerio transfiere a las EPS (Resolución 205 de 2020 y sus actualizaciones). Algunas tecnologías requieren análisis de junta de profesionales. Toda prescripción en MIPRES genera un número que el gestor farmacéutico usa para direccionar, programar, entregar y reportar el suministro. La regulación normativa cambia con frecuencia: verifique siempre las resoluciones vigentes en minsalud.gov.co. Además, el cáncer es una de las patologías de reporte obligatorio a la Cuenta de Alto Costo (CAC), que consolida información sobre diagnósticos, pruebas de biomarcadores (por ejemplo, el estado de HER2 o EGFR) y tratamientos, y que permite medir indicadores de oportunidad y calidad. La Ley 1384 de 2010 (Ley Sandra Ceballos) establece la atención integral del cáncer en adultos y el Instituto Nacional de Cancerología (INC) emite lineamientos técnicos. El precio de varias moléculas está sometido a control directo por la Comisión Nacional de Precios de Medicamentos y Dispositivos Médicos (CNPMDM).</p><p>Caso aplicado: un paciente con melanoma BRAF V600E recibe una fórmula de dabrafenib con trametinib. En la farmacia de la IPS oncológica, el QF verifica: (1) que la indicación y el biomarcador estén documentados en la historia clínica (requisito clínico y para el reporte a la CAC); (2) si la tecnología está en el PBS para esa indicación o requiere MIPRES, y que el número de prescripción, la cantidad y la vigencia sean coherentes con la duración del ciclo; (3) el direccionamiento al gestor farmacéutico y la fecha de entrega antes de que se acabe la medicación (para evitar interrupciones que comprometan la eficacia); (4) el precio facturado frente al precio máximo regulado, si aplica; (5) el registro sanitario INVIMA vigente del producto dispensado. Si hay una barrera de acceso (por ejemplo, demora en la entrega), el QF documenta y escala a la EPS, e informa al paciente sobre los canales de PQRS y la Superintendencia Nacional de Salud.</p><p>Puntos clave:<br>1. Verifique si la molécula y la indicación están en el PBS vigente o si requieren MIPRES; la financiación depende de la indicación, no solo del fármaco.<br>2. La gestión oportuna (direccionamiento, programación y entrega) evita interrupciones en terapias orales continuas.<br>3. Los datos de biomarcadores y tratamiento alimentan la Cuenta de Alto Costo: la calidad del registro también es responsabilidad del servicio farmacéutico.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Biosimilares de trastuzumab, rituximab y bevacizumab, y regulación de precios', 'Clase 2 · Marco de acceso, biosimilares y precios', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara biosimilar e innovador (Decreto 1782 de 2014, intercambiabilidad y farmacovigilancia por marca) y analiza el control de precios de la CNPMDM.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://consultorsalud.com/primer-medicamento-biosimilar-contra-el-cancer-aprobado-por-el-invima/","title":"[Página web] Primer medicamento biosimilar contra el cáncer aprobado por el Invima","description":"Consultorsalud (Colombia) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.bluradio.com/salud/medicamentos-de-alto-costo-tendran-nuevos-topes-de-precio-en-colombia-para-reducir-costos-so35","title":"[Página web] Medicamentos de alto costo tendrán nuevos topes de precio en Colombia para reducir costos (Circular 022 de 2026)","description":"Blu Radio (Colombia), jun. 2026 (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://consultorsalud.com/circular-20-medicamentos-oncologicos/","title":"[Página web] Impacto de la Circular 19 de 2024 y la propuesta de Circular 20 de 2026: análisis para medicamentos oncológicos","description":"Consultorsalud (Colombia), 2026 (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: cáncer de mama RH+/HER2- con ribociclib y un nuevo antiemético', 'Clase 3 · Casos clínicos integradores', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso en el que el QF detecta un riesgo de prolongación del QT al añadir ondansetrón, programa ECG y hemogramas, y gestiona la continuidad del suministro.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=9K6luQO-QVE","provider":"youtube","videoId":"9K6luQO-QVE","title":"CDK 4/6 Inhibitors for Breast Cancer: How They Work, Who Gets Them, What to Expect","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/1171221001/FT_1171221001.pdf","title":"Ficha técnica Kisqali (ribociclib)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: cáncer de mama HER2+ con cambio a biosimilar de trastuzumab', 'Clase 3 · Casos clínicos integradores', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso en el que el QF gestiona el cambio a un biosimilar, la trazabilidad por marca y lote, el monitoreo de la FEVI y el reporte de eventos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cima.aemps.es/cima/pdfs/ft/00145001/FT_00145001.pdf","title":"Ficha técnica Herceptin (trastuzumab)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ispor.org/publications/journals/value-in-health/abstract/Volume-28--Supplemental-Issue-6S1/CO21-Real-World-Evidence-on-Clinical-Outcomes-and-Safety-of-Trastuzumab-Biosimilar-in-Colombian-Breast-Cancer-Patients","title":"[Página web] CO21 Real-World Evidence on Clinical Outcomes and Safety of Trastuzumab Biosimilar in Colombian Breast Cancer Patients","description":"ISPOR – Value in Health (2025) (EN)"}'::jsonb);

END
$curso$;

-- ─── 5. Curso de Farmacología Cardiovascular (33 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Farmacología Cardiovascular' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Farmacología Cardiovascular', 'Curso para Químicos Farmacéuticos sobre los antihipertensivos, los fármacos para la insuficiencia cardiaca y la cardiopatía isquémica, los antiarrítmicos y los hipolipemiantes, con enfoque en seguridad, interacciones, monitorización y seguimiento farmacoterapéutico.', '<p>Curso para Químicos Farmacéuticos sobre los antihipertensivos, los fármacos para la insuficiencia cardiaca y la cardiopatía isquémica, los antiarrítmicos y los hipolipemiantes, con enfoque en seguridad, interacciones, monitorización y seguimiento farmacoterapéutico. Integra las guías vigentes (GPC de HTA MinSalud 2025, ESC 2024–2026, ACC/AHA) y el contexto colombiano de gestión del riesgo cardiovascular (programas de RCV, Cuenta de Alto Costo, PBS/MIPRES, INVIMA). No incluye anticoagulantes ni antiagregantes (curso 12).</p><h3>Objetivo general</h3><p>Capacitar al Químico Farmacéutico para seleccionar, monitorizar y optimizar la farmacoterapia cardiovascular (hipertensión, insuficiencia cardiaca, cardiopatía isquémica, arritmias y dislipidemias), identificar y resolver problemas relacionados con medicamentos y contribuir a los indicadores de control del riesgo cardiovascular en Colombia.</p><h3>A quién va dirigido</h3><p>Químicos Farmacéuticos y estudiantes de último año de Química Farmacéutica en servicios farmacéuticos ambulatorios y hospitalarios, programas de riesgo cardiovascular, EPS/IPS e industria farmacéutica en Colombia.</p><h3>Contexto normativo</h3><p>Colombia — GPC MinSalud/IETS, PBS/MIPRES, INVIMA</p>',
          'Farmacología', 'intermedio', 'Capacitar al Químico Farmacéutico para seleccionar, monitorizar y optimizar la farmacoterapia cardiovascular (hipertensión, insuficiencia cardiaca, cardiopatía isquémica, arritmias y dislipidemias), identificar y resolver problemas relacionados con medicamentos y contribuir a los indicadores de control del riesgo cardiovascular en Colombia.', 'Químicos Farmacéuticos y estudiantes de último año de Química Farmacéutica en servicios farmacéuticos ambulatorios y hospitalarios, programas de riesgo cardiovascular, EPS/IPS e industria farmacéutica en Colombia.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Fundamentos de la farmacología cardiovascular y riesgo cardiovascular en Colombia', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: el QF frente a la enfermedad cardiovascular', 'Clase 1 · Introducción al curso', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Presenta el alcance del curso, las guías de referencia (MinSalud/IETS, ESC, ACC/AHA) y el rol del Químico Farmacéutico en la farmacoterapia cardiovascular.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=kA92gDqUL4o","provider":"youtube","videoId":"kA92gDqUL4o","title":"Farmacología en Cardiología: vasoactivos, inotrópicos y antiarrítmicos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/","title":"[Página web] ESC Clinical Practice Guidelines – listado completo","description":"European Society of Cardiology (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Cuenta de Alto Costo: HTA, diabetes y ERC en cifras', 'Clase 2 · Epidemiología y gestión del riesgo cardiovascular en Colombia', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Revisa los indicadores de la Cuenta de Alto Costo sobre HTA, DM y ERC (periodo 2024–2025) y las brechas de diagnóstico y control.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://consultorsalud.com/riesgo-cardiovascular-colombia-millones-hta-d/","title":"[Página web] Siete millones de colombianos enfrentan riesgo cardiovascular: avance, brechas y prioridades de gestión para 2026","description":"ConsultorSalud (datos CAC) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cuentadealtocosto.org/situacion-de-la-enfermedad-renal-cronica-la-hipertension-arterial-y-la-diabetes-mellitus-en-colombia-2025/","title":"[Página web] Situación de la enfermedad renal crónica, la hipertensión arterial y la diabetes mellitus en Colombia 2025","description":"Cuenta de Alto Costo (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Programas de riesgo cardiovascular y adherencia terapéutica', 'Clase 2 · Epidemiología y gestión del riesgo cardiovascular en Colombia', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la organización de los programas de RCV en EPS/IPS, los determinantes de la adherencia y las estrategias del servicio farmacéutico para mejorarla.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=sOfNShyZ-mk","provider":"youtube","videoId":"sOfNShyZ-mk","title":"La adherencia terapéutica, un factor clave para mejorar la calidad de vida del paciente","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/CA/gpc-actualizacion-parcial-hta-primaria-vpc.pdf","title":"GPC hipertensión arterial – actualización parcial 2025: guía para pacientes y cuidadores","description":"MinSalud / IETS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Medición correcta de la presión arterial y educación al paciente', 'Clase 2 · Epidemiología y gestión del riesgo cardiovascular en Colombia', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Explica la técnica de medición y automedición de la PA y su papel en el seguimiento farmacoterapéutico.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=n_1zYbYI5s8","provider":"youtube","videoId":"n_1zYbYI5s8","title":"Atención Farmacéutica 3 – Toma correcta de la tensión arterial","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/CA/gpc-actualizacion-parcial-hta-primaria-vps.pdf","title":"Actualización parcial de la Guía de Práctica Clínica para el manejo de la hipertensión arterial primaria (Guía No. 18, 2.ª ed., 2025) – versión profesionales","description":"MinSalud / IETS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: paciente con HTA, DM2 y ERC en el programa de RCV', 'Clase 3 · Caso clínico: seguimiento farmacoterapéutico en el programa de RCV', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso clínico de una paciente con multimorbilidad cardiometabólica en el que el QF identifica PRM, interacciones (AINE + SRAA + diurético) y problemas de adherencia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar el seguimiento farmacoterapéutico (SFT) a un paciente inscrito en un programa de riesgo cardiovascular (RCV) en Colombia, identificando problemas relacionados con medicamentos (PRM) y resultados negativos asociados a la medicación (RNM).</p><p>Desarrollo: los programas de RCV de las EPS e IPS (articulados a la Ruta Integral de Atención para la promoción y mantenimiento de la salud y a la ruta de riesgo cardio-cerebro-vascular-metabólico) agrupan a personas con hipertensión arterial (HTA), diabetes mellitus tipo 2 (DM2) y enfermedad renal crónica (ERC). Estas tres condiciones se reportan obligatoriamente a la Cuenta de Alto Costo (CAC), que mide indicadores como control de presión arterial, HbA1c, colesterol LDL, tamizaje de albuminuria y estadio de ERC. El Químico Farmacéutico aporta valor en tres frentes: (1) conciliación de la medicación en cada transición (consulta, hospitalización, dispensación); (2) evaluación de necesidad, efectividad y seguridad de cada medicamento (método Dáder o similar); (3) educación y adherencia, incluyendo técnica de automedición de la presión arterial.</p><p>Caso aplicado: mujer de 64 años, afiliada al régimen subsidiario en un municipio intermedio, con HTA de 10 años, DM2 y ERC estadio G3a A2. Recibe losartán, hidroclorotiazida, metformina y atorvastatina; además compra ibuprofeno sin fórmula para dolor de rodilla. En el último control: PA 152/94 mmHg, potasio 5,3 mEq/L, TFGe 52 mL/min/1,73 m², LDL por encima de la meta para su riesgo. Refiere olvidar la dosis de la tarde y suspender la tiazida \"porque la hace orinar mucho\" cuando viaja.</p><p>Análisis del QF: (a) RNM de inefectividad (PA no controlada) asociado a falta de adherencia y a la interacción AINE–ARA-II–diurético (el llamado \"triple whammy\", que además eleva el riesgo de lesión renal aguda e hiperpotasemia); (b) riesgo de seguridad por potasio en límite alto; (c) oportunidad de simplificar el esquema con una combinación a dosis fija, opción que respalda la actualización 2025 de la GPC de HTA de MinSalud (\"politerapia fija\"); (d) estatina posiblemente subdosificada: verificar intensidad frente a la meta de LDL de la guía vigente. Intervención: educar sobre el riesgo de los AINE y alternativas analgésicas seguras, informar al médico tratante con una nota estructurada (PRM, evidencia, propuesta), acordar control de potasio y creatinina, y programar un nuevo contacto de SFT en 2–4 semanas. Registrar la intervención para que alimente los indicadores del programa.</p><p>Puntos clave:<br>1. HTA, DM2 y ERC coexisten con frecuencia; el QF debe mirar el esquema completo, no cada fármaco aislado.<br>2. La combinación AINE + bloqueador del SRAA + diurético es una interacción de alto riesgo que debe buscarse activamente en cada dispensación.<br>3. Toda intervención debe documentarse y comunicarse al prescriptor, con seguimiento programado y medible.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Farmacoterapia de la hipertensión arterial', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: clasificación de los antihipertensivos', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Presenta los grupos antihipertensivos, su sitio de acción y la lógica de la terapia combinada.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=T9YQw1HLI_Q","provider":"youtube","videoId":"T9YQw1HLI_Q","title":"Antihipertensivos: clasificación y mecanismo de acción","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/elevated-blood-pressure-and-hypertension/","title":"[Página web] 2024 ESC Guidelines for the Management of Elevated Blood Pressure and Hypertension","description":"European Society of Cardiology (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'IECA y ARA-II: mecanismo, farmacocinética e indicaciones', 'Clase 2 · Bloqueadores del sistema renina-angiotensina-aldosterona', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara IECA y ARA-II en mecanismo, perfil farmacocinético, indicaciones (HTA, ERC con albuminuria, IC) y contraindicaciones (embarazo, doble bloqueo).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=YNm1petYdAE","provider":"youtube","videoId":"YNm1petYdAE","title":"IECAS vs ARA II. ¿Cuál es la mejor medicina para la presión alta?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cardioteca.com/ieca-ara-ii-y-sacubitrilo-valsartan.html","title":"[Página web] IECA, ARA-II y sacubitrilo/valsartán: guía práctica del SRAA","description":"CardioTeca (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://sanidad.castillalamancha.es/sites/sescam.castillalamancha.es/files/documentos/farmacia/i_3_antagonistas_angiotensina_ii.pdf","title":"Antagonistas de los receptores de angiotensina II","description":"SESCAM – Castilla-La Mancha (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Angioedema, tos e hiperpotasemia por bloqueo del SRAA', 'Clase 2 · Bloqueadores del sistema renina-angiotensina-aldosterona', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Analiza las reacciones adversas del bloqueo del SRAA, los factores de riesgo de hiperpotasemia y el manejo del angioedema, incluido el lavado de 36 h antes de un ARNI.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.cardioteca.com/ieca-ara-ii-y-sacubitrilo-valsartan.html","title":"[Página web] IECA, ARA-II y sacubitrilo/valsartán: guía práctica del SRAA","description":"CardioTeca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Calcioantagonistas dihidropiridínicos y no dihidropiridínicos', 'Clase 3 · Calcioantagonistas, diuréticos tiazídicos, betabloqueadores y otros', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe ambas familias, sus usos en HTA y angina, su perfil de efectos adversos (edema maleolar, bradicardia) y sus interacciones por CYP3A4.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=uzf27v1x0X8","provider":"youtube","videoId":"uzf27v1x0X8","title":"ANTIHIPERTENSIVOS – Farmacología de la hipertensión arterial","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cardioteca.com/antagonistas-del-calcio.html","title":"[Página web] Antagonistas del calcio en cardiología: dihidropiridinas y no dihidropiridinas","description":"CardioTeca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Tiazidas y diuréticos tipo tiazida como antihipertensivos', 'Clase 3 · Calcioantagonistas, diuréticos tiazídicos, betabloqueadores y otros', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Explica el papel de hidroclorotiazida, clortalidona e indapamida en la HTA y su monitorización metabólica (sodio, potasio, ácido úrico, glucosa). El detalle renal se aborda en el curso 11.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=fooZDCQILQk","provider":"youtube","videoId":"fooZDCQILQk","title":"Farmacología antihipertensiva","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cardioteca.com/diureticos.html","title":"[Página web] Diuréticos en cardiología: tiazidas, furosemida y ahorradores de potasio","description":"CardioTeca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Betabloqueadores y otros antihipertensivos (alfabloqueadores, acción central, vasodilatadores, ARM en HTA resistente)', 'Clase 3 · Calcioantagonistas, diuréticos tiazídicos, betabloqueadores y otros', 5, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Revisa la posición de los betabloqueadores en HTA según sus indicaciones específicas y la de los fármacos de cuarta línea en la HTA resistente.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=_0A9RdIYDeA","provider":"youtube","videoId":"_0A9RdIYDeA","title":"Fármacos antihipertensivos – Parte 1 (generalidades, alfa y betabloqueantes)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cardioteca.com/betabloqueantes.html","title":"[Página web] Betabloqueantes en cardiología: guía práctica y evidencia 2026","description":"CardioTeca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'GPC de HTA: MinSalud 2025, ESH 2023, ESC 2024 y AHA/ACC 2025', 'Clase 4 · Guías de práctica clínica y aplicación', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara umbrales diagnósticos, metas de PA, inicio de tratamiento y uso de la combinación en una sola tableta entre la GPC colombiana actualizada en 2025 y las guías internacionales.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/CA/gpc-actualizacion-parcial-hta-primaria-vps.pdf","title":"Actualización parcial de la Guía de Práctica Clínica para el manejo de la hipertensión arterial primaria (Guía No. 18, 2.ª ed., 2025) – versión profesionales","description":"MinSalud / IETS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/elevated-blood-pressure-and-hypertension/","title":"[Página web] 2024 ESC Guidelines for the Management of Elevated Blood Pressure and Hypertension","description":"European Society of Cardiology (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.jacc.org/doi/10.1016/j.jacc.2025.05.007","title":"[Página web] 2025 AHA/ACC High Blood Pressure Guideline (JACC)","description":"ACC / AHA (listado en acc.org/Guidelines) (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: HTA no controlada, politerapia fija y adherencia', 'Clase 4 · Guías de práctica clínica y aplicación', 7, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso de un paciente con HTA no controlada con monoterapia, en el que el QF propone una combinación a dosis fija y un plan de adherencia y seguimiento.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=kqE9zLoMBvc","provider":"youtube","videoId":"kqE9zLoMBvc","title":"Hipertensión arterial: tratamiento farmacológico","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/CA/gpc-actualizacion-parcial-hta-primaria-vpc.pdf","title":"GPC hipertensión arterial – actualización parcial 2025: guía para pacientes y cuidadores","description":"MinSalud / IETS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/INEC/IETS/GPC_Completa_HTA.pdf","title":"Guía de Práctica Clínica Hipertensión arterial primaria (Guía No. 18, 2013) – versión completa","description":"MinSalud / Colciencias (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Insuficiencia cardiaca y cardiopatía isquémica', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: fisiopatología y objetivos terapéuticos en IC y angina', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la activación neurohormonal en la IC, el desequilibrio entre oferta y demanda de oxígeno en la angina y los objetivos del tratamiento.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=LV9zSzMnf-Y","provider":"youtube","videoId":"LV9zSzMnf-Y","title":"Tratamiento farmacológico de la insuficiencia cardíaca: recomendaciones en una píldora","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/heart-failure/","title":"[Página web] 2026 ESC Guidelines for the management of heart failure","description":"European Society of Cardiology (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Los cuatro pilares de la ICFEr: ARNI/IECA, betabloqueador, ARM e iSGLT2', 'Clase 2 · Farmacoterapia de la insuficiencia cardiaca', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el mecanismo, la evidencia, la titulación y la monitorización de los cuatro grupos que reducen mortalidad en ICFEr, y su papel en la IC con FE levemente reducida o preservada.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.cardioteca.com/farmacos-para-la-insuficiencia-cardiaca.html","title":"[Página web] Fármacos para la insuficiencia cardíaca: los 4 pilares y más allá","description":"CardioTeca (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.jacc.org/doi/10.1016/j.jacc.2021.12.012","title":"[Página web] 2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure (JACC)","description":"ACC / AHA / HFSA (listado en acc.org/Guidelines) (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Diuréticos de asa, digoxina e ivabradina', 'Clase 2 · Farmacoterapia de la insuficiencia cardiaca', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Explica el uso sintomático de los diuréticos de asa, el estrecho margen terapéutico de la digoxina y su toxicidad, y la indicación de la ivabradina.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=QqoAY86hMAg","provider":"youtube","videoId":"QqoAY86hMAg","title":"Digoxina: peligro y precisión – cómo usarla con seguridad en cardiología","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cardioteca.com/farmacos-para-la-insuficiencia-cardiaca.html","title":"[Página web] Fármacos para la insuficiencia cardíaca: los 4 pilares y más allá","description":"CardioTeca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Fármacos a evitar en IC y evidencia de costo-efectividad', 'Clase 2 · Farmacoterapia de la insuficiencia cardiaca', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Identifica los medicamentos que empeoran la IC (AINE, glitazonas, calcioantagonistas no DHP en ICFEr, entre otros) y analiza críticamente la evidencia de ARNI e iSGLT2.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=FaeWAyt4Ew0","provider":"youtube","videoId":"FaeWAyt4Ew0","title":"Fármacos a evitar en insuficiencia cardíaca","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://sanidad.castillalamancha.es/sites/sescam.castillalamancha.es/files/documentos/farmacia/hem_2022_2_tercer_escalon_en_el_tratamiento_de_la_ic.pdf","title":"Tercer escalón en el tratamiento de la IC con FEr: sacubitrilo/valsartán y gliflozinas (Hoja de Evaluación de Medicamentos 2022)","description":"SESCAM – Castilla-La Mancha (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Nitratos: farmacocinética, tolerancia e interacciones', 'Clase 3 · Cardiopatía isquémica crónica: antianginosos', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los nitratos de acción corta y prolongada, la tolerancia y el intervalo libre de nitratos, y la contraindicación con inhibidores de PDE-5.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=K59ej5Q0bRU","provider":"youtube","videoId":"K59ej5Q0bRU","title":"Fármacos antianginosos – Farmacología terapéutica","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cardioteca.com/antianginosos-y-vasodilatadores.html","title":"[Página web] Antianginosos y vasodilatadores en cardiología: nitratos, ranolazina y nuevas opciones","description":"CardioTeca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Betabloqueadores, calcioantagonistas y ranolazina en la angina crónica', 'Clase 3 · Cardiopatía isquémica crónica: antianginosos', 5, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los antianginosos de primera y segunda línea según la guía ESC 2024 de síndromes coronarios crónicos, incluido el perfil de interacciones de la ranolazina.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=biLUq8RaWwA","provider":"youtube","videoId":"biLUq8RaWwA","title":"Fármacos en cardiología: antianginosos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/chronic-coronary-syndromes/","title":"[Página web] 2024 ESC Guidelines for the management of chronic coronary syndromes","description":"European Society of Cardiology (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://sanidad.castillalamancha.es/sites/sescam.castillalamancha.es/files/documentos/farmacia/ranolazina.pdf","title":"Ranolazina – Hoja de Evaluación de Medicamentos (2011)","description":"SESCAM – Castilla-La Mancha (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: ICFEr tras hospitalización – transición a ARNI y vigilancia de potasio', 'Clase 4 · Caso clínico: titulación en insuficiencia cardiaca', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso de seguimiento farmacoterapéutico de un paciente con ICFEr en el que el QF gestiona la transición IECA→ARNI, la hiperpotasemia y la educación en autocuidado.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: ejecutar el seguimiento farmacoterapéutico de un paciente con insuficiencia cardiaca con fracción de eyección reducida (ICFEr) durante la titulación de la terapia de cuatro pilares.</p><p>Desarrollo: las guías internacionales (ESC 2021 con actualización 2023, ACC/AHA/HFSA 2022 y la nueva guía ESC 2026, que propone una nomenclatura revisada de las terapias) coinciden en que la ICFEr debe tratarse con cuatro clases que reducen mortalidad y hospitalización: inhibidor del receptor de angiotensina–neprilisina (ARNI) o, si no es posible, IECA/ARA-II; betabloqueador con evidencia (bisoprolol, carvedilol, metoprolol succinato, nebivolol); antagonista del receptor de mineralocorticoides (ARM: espironolactona o eplerenona); e inhibidor de SGLT2 (dapagliflozina o empagliflozina). Los diuréticos de asa alivian la congestión pero no modifican el pronóstico. La recomendación actual es iniciar los cuatro grupos de forma temprana y titular hasta la dosis objetivo o la máxima tolerada, en lugar de esperar meses entre uno y otro.</p><p>Caso aplicado: hombre de 58 años, egresado de una hospitalización en una IPS de Medellín por IC descompensada; FEVI 30 %. Al alta recibe enalapril, carvedilol a dosis baja, espironolactona, furosemida y dapagliflozina. El cardiólogo planea cambiar enalapril por sacubitrilo/valsartán (medicamento que en Colombia puede requerir verificar su cobertura en el PBS o su prescripción por MIPRES, según la presentación y la normativa vigente). Laboratorios: creatinina 1,3 mg/dL, potasio 4,9 mEq/L, PA 104/68 mmHg, FC 82 lpm.</p><p>Intervención del QF: (1) Transición IECA → ARNI: asegurar un intervalo libre de al menos 36 horas tras la última dosis de enalapril para evitar angioedema; educar al paciente para que no tome ambos. (2) Hiperpotasemia: potasio en límite alto con ARM + bloqueo del SRAA; recomendar control de potasio y creatinina a la semana y periódicamente durante la titulación, evitar suplementos de potasio, sustitutos de sal con KCl y AINE. (3) Hipotensión: la PA es baja pero asintomática; sugerir revisar si la dosis de furosemida puede reducirse si el paciente está euvolémico antes de bajar fármacos pronósticos. (4) iSGLT2: advertir sobre infecciones genitales, depleción de volumen y la suspensión temporal en enfermedad aguda o ayuno (riesgo de cetoacidosis, sobre todo en diabéticos). (5) Autocuidado: peso diario, restricción razonable de sal, signos de alarma. Documentar en el plan de SFT las dosis objetivo y el calendario de titulación acordado con el equipo.</p><p>Puntos clave:<br>1. Los cuatro pilares se inician pronto y se titulan; el diurético de asa se ajusta según congestión.<br>2. El paso de IECA a sacubitrilo/valsartán exige un lavado mínimo de 36 horas.<br>3. Potasio, creatinina y presión arterial son los parámetros de seguridad que el QF debe vigilar en cada ajuste.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Fármacos antiarrítmicos', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: electrofisiología básica y potencial de acción cardiaco', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume las fases del potencial de acción y los canales iónicos sobre los que actúan los antiarrítmicos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=jOoeI7JZ6yA","provider":"youtube","videoId":"jOoeI7JZ6yA","title":"Fármacos antiarrítmicos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Clases I a IV y otros antiarrítmicos (adenosina, digoxina)', 'Clase 2 · Clasificación de Vaughan-Williams y seguridad', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la clasificación de Vaughan-Williams, su versión modernizada y los representantes, indicaciones y contraindicaciones de cada clase.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=sRDSolAk2n8","provider":"youtube","videoId":"sRDSolAk2n8","title":"Antiarrítmicos – Pablo Passarella","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.msdmanuals.com/es/professional/multimedia/table/antiarrítmicos-clasificación-de-vaughan-williams","title":"[Página web] Antiarrítmicos (clasificación de Vaughan Williams) – Manual MSD versión para profesionales","description":"Manual MSD (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.cardioteca.com/antiarritmicos.html","title":"[Página web] Antiarrítmicos en cardiología: clasificación de Vaughan-Williams revisitada y uso clínico práctico","description":"CardioTeca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Proarritmia y prolongación del QT', 'Clase 2 · Clasificación de Vaughan-Williams y seguridad', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el riesgo de proarritmia (lección del CAST), los factores de riesgo de torsade de pointes y las interacciones farmacodinámicas con otros prolongadores del QT.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: interpretar el concepto de proarritmia y de prolongación del intervalo QT como riesgo transversal de los antiarrítmicos y de otros medicamentos de uso frecuente.</p><p>Desarrollo: los antiarrítmicos pueden, paradójicamente, provocar arritmias. El ensayo CAST (bloqueadores de sodio de clase Ic tras infarto de miocardio) mostró aumento de la mortalidad, por lo que flecainida y propafenona se contraindican en cardiopatía estructural significativa (cardiopatía isquémica con disfunción, insuficiencia cardiaca). Los fármacos de clase III que bloquean canales de potasio (sotalol, dofetilida y, en menor grado, amiodarona) prolongan la repolarización y el QT; si el QT corregido se alarga en exceso puede aparecer torsade de pointes, una taquicardia ventricular polimórfica potencialmente mortal. La amiodarona prolonga el QT con frecuencia, pero su riesgo de torsade es relativamente bajo gracias a su acción multicanal; aun así, el riesgo aumenta al combinarla con otros fármacos que prolongan el QT.</p><p>Factores de riesgo que el QF debe identificar: sexo femenino, edad avanzada, bradicardia, hipopotasemia e hipomagnesemia (por ejemplo, por diuréticos de asa o tiazidas), insuficiencia renal (sotalol se elimina por vía renal), cardiopatía estructural, QT largo congénito y polifarmacia con otros prolongadores del QT: macrólidos, fluoroquinolonas, antifúngicos azólicos, antipsicóticos, algunos antidepresivos, ondansetrón, metadona, hidroxicloroquina, entre otros. Las bases de datos de referencia (por ejemplo, CredibleMeds) clasifican el riesgo de cada fármaco.</p><p>Ejemplo aplicado: en un servicio farmacéutico hospitalario de Bogotá se valida una orden de claritromicina para neumonía en una paciente de 78 años que recibe sotalol y furosemida, con potasio de 3,3 mEq/L y TFGe de 35 mL/min. El QF identifica cuatro factores de riesgo acumulados (edad, sexo, hipopotasemia, función renal reducida) más dos prolongadores del QT. Interviene sugiriendo un antibiótico alternativo sin efecto relevante sobre el QT, corrección del potasio y del magnesio, revisión de la dosis de sotalol según la función renal y un electrocardiograma de control. La intervención se documenta y, si se presentara un evento, se notifica al programa de farmacovigilancia.</p><p>Puntos clave:<br>1. Los clase Ic están contraindicados en cardiopatía estructural (lección del CAST).<br>2. La torsade de pointes es el principal riesgo de los bloqueadores de potasio; el riesgo es aditivo con otros fármacos y con trastornos electrolíticos.<br>3. El QF debe revisar sistemáticamente interacciones farmacodinámicas sobre el QT, electrolitos y función renal al validar prescripciones.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Amiodarona: farmacocinética, toxicidad y monitorización', 'Clase 3 · Amiodarona, digoxina e interacciones', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la farmacocinética particular de la amiodarona y su toxicidad tiroidea, pulmonar, hepática, ocular y cutánea, con el esquema de monitorización recomendado.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=BeCb9x4fn3M","provider":"youtube","videoId":"BeCb9x4fn3M","title":"Amiodarona: mecanismo de acción, vida media y riesgos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cardioteca.com/antiarritmicos.html","title":"[Página web] Antiarrítmicos en cardiología: clasificación de Vaughan-Williams revisitada y uso clínico práctico","description":"CardioTeca (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/atrial-fibrillation/","title":"[Página web] 2024 ESC Guidelines for the management of atrial fibrillation","description":"European Society of Cardiology (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Interacciones de amiodarona con digoxina, estatinas y bradicardizantes', 'Clase 3 · Amiodarona, digoxina e interacciones', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Analiza las interacciones farmacocinéticas (CYP3A4, CYP2C9, gp-P) y farmacodinámicas de la amiodarona y cómo manejarlas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=CxNS2Vt1XQI","provider":"youtube","videoId":"CxNS2Vt1XQI","title":"Amiodarone and Digoxin: Drug Interaction Explained","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/ventricular-arrhythmias-and-the-prevention-of-sudden-cardiac-death/","title":"[Página web] 2022 ESC Guidelines for the management of patients with ventricular arrhythmias and the prevention of sudden cardiac death","description":"European Society of Cardiology (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: inicio de amiodarona en fibrilación auricular – plan de monitorización', 'Clase 3 · Amiodarona, digoxina e interacciones', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso en el que el QF diseña el plan de monitorización y gestiona las interacciones de una paciente que inicia amiodarona.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: diseñar un plan de monitorización y seguimiento farmacoterapéutico para un paciente que inicia amiodarona.</p><p>Desarrollo: la amiodarona es un antiarrítmico de clase III con acciones de las clases I, II y IV. Es muy lipofílica, tiene gran volumen de distribución y una vida media de eliminación muy prolongada (semanas a meses), por lo que requiere dosis de carga, tarda en alcanzar su efecto y sus toxicidades e interacciones persisten mucho tiempo después de suspenderla. Contiene una alta proporción de yodo. Sus toxicidades extracardiacas dependen de la dosis y la duración: tiroideas (hipotiroidismo e hipertiroidismo), pulmonares (neumonitis, fibrosis), hepáticas (elevación de transaminasas, hepatitis), oculares (microdepósitos corneales, raramente neuropatía óptica), cutáneas (fotosensibilidad, coloración azul-grisácea) y neurológicas (temblor, neuropatía). En el corazón produce bradicardia y prolonga el QT.</p><p>Plan de monitorización típico (ajustar según la ficha técnica y la guía institucional): basal, función tiroidea (TSH, T4 libre), pruebas hepáticas, radiografía de tórax y, según el caso, pruebas de función pulmonar, electrocardiograma, electrolitos y valoración oftalmológica si hay síntomas visuales; durante el tratamiento, tiroides y hepático cada 6 meses aproximadamente, electrocardiograma periódico y evaluación clínica de síntomas respiratorios.</p><p>Interacciones clave: la amiodarona inhibe CYP3A4, CYP2C9, CYP2D6 y la glicoproteína P. Eleva las concentraciones de digoxina (suele requerir reducir su dosis y vigilar niveles), de algunas estatinas metabolizadas por CYP3A4, como la simvastatina (riesgo de miopatía; respetar los límites de dosis de la ficha técnica), y potencia anticoagulantes; el manejo de estos últimos corresponde al curso 12 de esta línea. Con betabloqueadores, verapamilo o diltiazem suma efectos sobre la bradicardia y la conducción AV.</p><p>Caso aplicado: mujer de 70 años con fibrilación auricular y cardiopatía estructural, en Cali, que inicia amiodarona para control del ritmo. Recibe además digoxina, simvastatina y bisoprolol. El QF propone: reducir la digoxina y medir sus niveles; cambiar la simvastatina por una estatina con menor interacción o ajustarla al límite permitido; vigilar frecuencia cardiaca y síntomas de bradicardia; registrar las pruebas basales; educar sobre fotoprotección y síntomas de alarma (disnea, tos persistente, intolerancia al frío o al calor, alteraciones visuales); y agendar controles a los 3 y 6 meses.</p><p>Puntos clave:<br>1. La vida media muy larga de la amiodarona hace que sus efectos adversos e interacciones persistan meses.<br>2. La monitorización mínima incluye tiroides, hígado, pulmón, ECG y ojos.<br>3. Al iniciarla, revise digoxina, estatinas, anticoagulantes y fármacos bradicardizantes.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Dislipidemias, seguridad farmacológica e integración', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: metabolismo lipídico y metas de colesterol LDL', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume el metabolismo de las lipoproteínas, la estratificación del riesgo y las metas de LDL según las guías vigentes.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/dyslipidaemias/","title":"[Página web] 2025 Focused Update of the 2019 ESC/EAS Guidelines for the management of dyslipidaemias","description":"European Society of Cardiology / EAS (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Estatinas: mecanismo, intensidad y uso clínico', 'Clase 2 · Hipolipemiantes', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el mecanismo de las estatinas, su clasificación por intensidad, la farmacocinética diferencial (CYP3A4 vs no CYP) y su uso en prevención primaria y secundaria.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=6cSewHi2Ubw","provider":"youtube","videoId":"6cSewHi2Ubw","title":"Estatinas // hipolipemiantes // súper fácil // farmacología","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cardioteca.com/hipolipemiantes.html","title":"[Página web] Hipolipemiantes en cardiología: estatinas, ezetimiba, PCSK9 e inclisirán","description":"CardioTeca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Terapias no estatínicas: ezetimiba, ácido bempedoico, iPCSK9 e inclisirán', 'Clase 2 · Hipolipemiantes', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara mecanismos, reducción esperada de LDL, evidencia de desenlaces, vía de administración y acceso en Colombia (PBS/MIPRES) de las terapias no estatínicas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=V8ImMpJuD-Q","provider":"youtube","videoId":"V8ImMpJuD-Q","title":"El reto del tratamiento hipolipemiante: inhibidores PCSK9 y su impacto clínico","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cardioteca.com/hipolipemiantes.html","title":"[Página web] Hipolipemiantes en cardiología: estatinas, ezetimiba, PCSK9 e inclisirán","description":"CardioTeca (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.jacc.org/doi/10.1016/j.jacc.2025.11.016","title":"[Página web] 2026 ACC/AHA Dyslipidemia Guideline (JACC)","description":"ACC / AHA (listado en acc.org/Guidelines) (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Miopatía por estatinas e interacciones', 'Clase 2 · Hipolipemiantes', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el espectro de los síntomas musculares asociados a estatinas, su abordaje escalonado y las interacciones que aumentan el riesgo (amiodarona, calcioantagonistas no DHP, macrólidos, fibratos).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.cardioteca.com/hipolipemiantes.html","title":"[Página web] Hipolipemiantes en cardiología: estatinas, ezetimiba, PCSK9 e inclisirán","description":"CardioTeca (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cardioteca.com/antagonistas-del-calcio.html","title":"[Página web] Antagonistas del calcio en cardiología: dihidropiridinas y no dihidropiridinas","description":"CardioTeca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Fármacos cardiovasculares en ERC, embarazo, adulto mayor y perioperatorio', 'Clase 3 · Seguridad y poblaciones especiales', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Revisa los ajustes por función renal, los fármacos contraindicados en el embarazo (IECA, ARA-II, ARNI, estatinas), la deprescripción en el adulto mayor frágil y el manejo perioperatorio.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.cardioteca.com/situaciones-especiales.html","title":"[Página web] Fármacos cardiovasculares en situaciones especiales (embarazo, ERC, anciano, perioperatorio)","description":"CardioTeca (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/cvd-chronic-kidney-disease/","title":"[Página web] 2026 ESC Guidelines for the management of cardiovascular disease and chronic kidney disease","description":"European Society of Cardiology (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Farmacovigilancia de medicamentos cardiovasculares en Colombia', 'Clase 3 · Seguridad y poblaciones especiales', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica el proceso de detección, evaluación de causalidad y notificación al INVIMA de las RAM cardiovasculares más relevantes.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar el proceso de farmacovigilancia a los eventos adversos de los medicamentos cardiovasculares en el contexto regulatorio colombiano.</p><p>Desarrollo: en Colombia, el Programa Nacional de Farmacovigilancia es coordinado por el INVIMA, y los servicios farmacéuticos, IPS, EPS y titulares de registro sanitario deben notificar sospechas de reacciones adversas (RAM), errores de medicación y fallos terapéuticos por los canales oficiales del INVIMA (reporte en línea), en los plazos que fija la normativa: los eventos serios se notifican de forma inmediata y los no serios en los consolidados periódicos. El INVIMA publica alertas sanitarias y comunicaciones de seguridad que el QF debe consultar y difundir al equipo de salud.</p><p>Los medicamentos cardiovasculares concentran eventos relevantes para farmacovigilancia: angioedema por IECA (más frecuente en personas afrodescendientes y que puede aparecer incluso años después de iniciar el tratamiento) y por sacubitrilo/valsartán; hiperpotasemia por bloqueo del SRAA y ARM; hiponatremia por tiazidas; edema maleolar por dihidropiridinas; bradicardia y bloqueo AV por betabloqueadores y calcioantagonistas no dihidropiridínicos; toxicidad digitálica; toxicidad tiroidea y pulmonar por amiodarona; miopatía y rabdomiólisis por estatinas, sobre todo con interacciones por CYP3A4; infecciones genitales y cetoacidosis euglucémica por iSGLT2. También deben notificarse los fallos terapéuticos, por ejemplo una PA no controlada tras cambiar de fabricante de un genérico, porque permiten detectar problemas de calidad.</p><p>Ejemplo aplicado: en una droguería de cadena en Barranquilla, un paciente de 55 años que recibe enalapril desde hace 3 años consulta por hinchazón de labios y lengua. El QF reconoce la urgencia (riesgo de compromiso de la vía aérea) y deriva de inmediato a urgencias. Luego documenta el caso con el método de imputación de causalidad (por ejemplo, la escala de Naranjo o el algoritmo de la OMS-UMC), lo notifica al INVIMA como evento serio y recomienda dejar en la historia clínica la contraindicación definitiva de los IECA y de sacubitrilo/valsartán. También propone al médico alternativas (por ejemplo, un calcioantagonista; los ARA-II pueden usarse con precaución según el criterio clínico y la ficha técnica).</p><p>Puntos clave:<br>1. Notificar RAM, errores y fallos terapéuticos al INVIMA es una obligación del servicio farmacéutico, no una opción.<br>2. El angioedema por IECA puede ser tardío y contraindica para siempre los IECA y los ARNI.<br>3. Consultar periódicamente las alertas sanitarias del INVIMA y trasladarlas al equipo es parte del rol del QF.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso integrador: paciente post-SCA con HTA, dislipidemia e IC', 'Clase 4 · Caso clínico integrador', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso integrador de conciliación y seguimiento farmacoterapéutico que prioriza las contraindicaciones, la adecuación a las guías y la terapia hipolipemiante intensiva.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: integrar los contenidos del curso en un caso de seguimiento farmacoterapéutico de un paciente con multimorbilidad cardiovascular, priorizando las intervenciones del Químico Farmacéutico.</p><p>Desarrollo: el paciente cardiovascular real rara vez tiene una sola enfermedad. La conciliación de la medicación al alta y en atención ambulatoria, el análisis de interacciones y la adecuación a guías vigentes (GPC de HTA de MinSalud 2025, ESC 2024 de HTA y de síndromes coronarios crónicos, actualización ESC/EAS 2025 de dislipidemias, guía ESC 2026 de insuficiencia cardiaca, guías ACC/AHA) son el núcleo del aporte del QF. El método recomendado es estructurado: recoger datos (estado de situación), evaluar cada medicamento según necesidad, efectividad y seguridad, priorizar los problemas, intervenir con el prescriptor y el paciente, y hacer seguimiento.</p><p>Caso aplicado: hombre de 67 años, egresado de un hospital de Bucaramanga tras un síndrome coronario agudo, con HTA, dislipidemia, FEVI 38 % y ERC G3a. Fórmula de egreso: metoprolol tartrato, enalapril, atorvastatina de intensidad moderada, nitroglicerina sublingual de rescate y furosemida. La terapia antitrombótica la gestiona el curso 12 y aquí solo se concilia. En casa toma además sildenafil \"ocasional\" e ibuprofeno. LDL de 110 mg/dL antes del evento, potasio de 4,6 mEq/L.</p><p>Priorización del QF:<br>1. Seguridad crítica: nitratos + inhibidores de PDE-5 (sildenafil) están contraindicados por el riesgo de hipotensión grave; educar y documentar. Suspender el AINE (riesgo renal, retención de sodio, empeora la IC).<br>2. Efectividad y adecuación a la guía en IC con FEVI levemente reducida tras infarto: discutir con cardiología cambiar a un betabloqueador con evidencia en IC (por ejemplo, metoprolol succinato, bisoprolol o carvedilol), valorar un ARM y un iSGLT2 según el fenotipo, y evaluar ARNI frente a IECA conforme a la guía vigente.<br>3. Dislipidemia en muy alto riesgo: la meta de LDL de las guías ESC es muy baja (&lt;55 mg/dL con reducción ≥50 %), por lo que se requiere una estatina de alta intensidad, probablemente con ezetimiba desde el inicio. Si no se logra la meta, valorar iPCSK9, inclisirán o ácido bempedoico según disponibilidad, PBS/MIPRES y criterios institucionales.<br>4. Monitorización: creatinina y potasio a 1–2 semanas de cada ajuste del SRAA o ARM; perfil lipídico a las 4–12 semanas; vigilar síntomas musculares; PA y FC en cada contacto.<br>5. Adherencia y educación: pastillero o calendario, uso correcto de la nitroglicerina sublingual, signos de alarma, rehabilitación cardiaca e inscripción en el programa de RCV.</p><p>Puntos clave:<br>1. Primero lo que puede causar daño inmediato (contraindicaciones, interacciones graves), luego la efectividad.<br>2. Tras un SCA, el paciente es de muy alto riesgo: terapia hipolipemiante intensiva y combinada temprana.<br>3. La conciliación y el SFT estructurado son la herramienta del QF para llevar al paciente real hacia lo que recomiendan las guías.</p>"}'::jsonb);

END
$curso$;

-- ─── 6. Curso de Farmacología Endocrina (35 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Farmacología Endocrina' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Farmacología Endocrina', 'Curso aplicado para Químicos Farmacéuticos sobre la farmacoterapia de la diabetes mellitus, la obesidad, las enfermedades tiroideas, los glucocorticoides, la osteoporosis, la hipófisis y las hormonas sexuales.', '<p>Curso aplicado para Químicos Farmacéuticos sobre la farmacoterapia de la diabetes mellitus, la obesidad, las enfermedades tiroideas, los glucocorticoides, la osteoporosis, la hipófisis y las hormonas sexuales. Integra las guías vigentes (GPC MinSalud/IETS, ADA Standards of Care 2026, criterios de elegibilidad OMS 2025) con el contexto colombiano de PBS, MIPRES y farmacovigilancia INVIMA, mediante casos clínicos.</p><h3>Objetivo general</h3><p>Desarrollar en el QF las competencias para seleccionar, dispensar, educar y hacer seguimiento farmacoterapéutico seguro de los medicamentos endocrinos, con énfasis en el paciente con diabetes, aplicando la evidencia y la normativa vigentes en Colombia.</p><h3>A quién va dirigido</h3><p>Químicos Farmacéuticos, regentes de farmacia y estudiantes de último año de Química Farmacéutica en Colombia, en servicios farmacéuticos hospitalarios y ambulatorios, programas de crónicos de EPS/IPS e industria farmacéutica.</p><h3>Contexto normativo</h3><p>Colombia — GPC MinSalud/IETS, PBS/MIPRES, INVIMA</p>',
          'Farmacología', 'intermedio', 'Desarrollar en el QF las competencias para seleccionar, dispensar, educar y hacer seguimiento farmacoterapéutico seguro de los medicamentos endocrinos, con énfasis en el paciente con diabetes, aplicando la evidencia y la normativa vigentes en Colombia.', 'Químicos Farmacéuticos, regentes de farmacia y estudiantes de último año de Química Farmacéutica en Colombia, en servicios farmacéuticos hospitalarios y ambulatorios, programas de crónicos de EPS/IPS e industria farmacéutica.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Diabetes mellitus: bases terapéuticas e insulinoterapia', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: farmacología endocrina para el QF en Colombia', 'Clase 1 · Introducción al curso', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Presenta el alcance del curso, la carga de la diabetes y otras endocrinopatías en Colombia y las fuentes de referencia (GPC MinSalud/IETS, ADA 2026, OMS).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://diabetesjournals.org/care/issue/49/Supplement_1","title":"[Página web] Standards of Care in Diabetes—2026 (Diabetes Care, vol. 49, Supl. 1)","description":"American Diabetes Association (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://iets.org.co/guia-de-practica-clinica/2/","title":"[Página web] Listado de Guías de Práctica Clínica IETS (incluye GPC DM1 >15 años, DM2 >18 años y diabetes gestacional)","description":"IETS – Instituto de Evaluación Tecnológica en Salud (Colombia) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Fisiopatología de la DM1 y DM2 y dianas farmacológicas', 'Clase 2 · Bases fisiopatológicas y metas terapéuticas', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Relaciona la deficiencia de insulina, la resistencia a la insulina y el eje incretínico con el sitio de acción de cada grupo de antidiabéticos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=tR-zYsWWjxc","provider":"youtube","videoId":"tR-zYsWWjxc","title":"Antidiabéticos: resumen, fisiopatología de la diabetes, epidemiología","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ncbi.nlm.nih.gov/books/NBK430900/","title":"[Página web] Hyperglycemia","description":"StatPearls – NCBI Bookshelf (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Metas glucémicas y guías: GPC MinSalud/IETS y ADA Standards of Care 2026', 'Clase 2 · Bases fisiopatológicas y metas terapéuticas', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las metas de HbA1c, glucemia y tiempo en rango, y compara las recomendaciones colombianas con la actualización ADA 2026.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://doi.org/10.2337/dc26-s006","title":"[Página web] ADA Standards of Care 2026 – Sección 6: Glycemic Goals and Hypoglycemia","description":"American Diabetes Association (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://iets.org.co/guia-de-practica-clinica/2/","title":"[Página web] Listado de Guías de Práctica Clínica IETS (incluye GPC DM1 >15 años, DM2 >18 años y diabetes gestacional)","description":"IETS – Instituto de Evaluación Tecnológica en Salud (Colombia) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Tipos de insulina y perfiles de acción', 'Clase 3 · Insulinoterapia', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara insulinas humanas y análogos (ultrarrápidos, rápidos, intermedios, basales de acción prolongada, premezclas) según inicio, pico y duración.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=tVcavz9ZU1c","provider":"youtube","videoId":"tVcavz9ZU1c","title":"TIPOS DE INSULINA","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www3.gobiernodecanarias.org/sanidad/scs/content/89c7236d-9b8f-11eb-a091-6da1bd91722d/INFARMA%20insulinas_1_marzo%202021.pdf","title":"INFARMA: Insulinas (1ª parte): tipos y presentaciones (marzo 2021)","description":"Servicio Canario de la Salud (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.ncbi.nlm.nih.gov/books/NBK560688/","title":"[Página web] Insulin","description":"StatPearls – NCBI Bookshelf (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Esquemas de insulinización: basal, basal-plus y basal-bolo', 'Clase 3 · Insulinoterapia', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el inicio de insulina basal en DM2, la titulación, la intensificación prandial y el esquema basal-bolo en DM1.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=miHKTRaNsSY","provider":"youtube","videoId":"miHKTRaNsSY","title":"Tipos de Insulinas","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://sanidad.castillalamancha.es/sites/sescam.castillalamancha.es/files/documentos/farmacia/pautas_de_insulinizacion.pdf","title":"Pautas de insulinización","description":"SESCAM – Servicio de Salud de Castilla-La Mancha (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://euskadi.eus/contenidos/informacion/cevime_infac_2017/es_def/adjuntos/INFAC-Vol-25-n 5_actualizacion_de-insulinas.pdf","title":"INFAC Vol. 25 nº 5: Actualización de insulinas","description":"CEVIME – Gobierno Vasco (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Dispositivos, técnica de inyección y conservación de la insulina', 'Clase 3 · Insulinoterapia', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Explica el uso de plumas, viales y jeringas, la rotación de zonas, la lipohipertrofia y la cadena de frío en la farmacia y en el hogar.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.saludcastillayleon.es/portalmedicamento/en/noticias-destacados/noticias/insulinas-clasificacion-presentaciones-dispositivos-adminis","title":"[Página web] Insulinas: clasificación, presentaciones y dispositivos para su administración","description":"Portal del Medicamento – Junta de Castilla y León (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.lecturio.com/es/concepts/insulina","title":"[Página web] Insulina – Domina Conceptos Médicos","description":"Lecturio (en español) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Hipoglucemia: clasificación, causas farmacológicas y tratamiento', 'Clase 4 · Hipoglucemia y educación del paciente con diabetes', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los niveles de hipoglucemia, los fármacos que la producen, la regla 15-15 y el uso de glucagón.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.ncbi.nlm.nih.gov/books/NBK534841/","title":"[Página web] Hypoglycemia","description":"StatPearls – NCBI Bookshelf (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://doi.org/10.2337/dc26-s006","title":"[Página web] ADA Standards of Care 2026 – Sección 6: Glycemic Goals and Hypoglycemia","description":"American Diabetes Association (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: rol del QF en la educación del paciente con DM1 en insulinoterapia', 'Clase 4 · Hipoglucemia y educación del paciente con diabetes', 7, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso clínico de hipoglucemias por técnica de inyección y conservación inadecuadas, con intervención educativa y comunicación al médico.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar el modelo de educación terapéutica y seguimiento farmacoterapéutico del Químico Farmacéutico (QF) a una persona con diabetes en insulinoterapia, integrando técnica de inyección, conservación, autocontrol y prevención de hipoglucemia.</p><p>Desarrollo: la educación en diabetes es una intervención con impacto demostrado en HbA1c, hipoglucemias y adherencia. El QF, en el servicio farmacéutico ambulatorio, en programas de riesgo cardiovascular y renal de las EPS/IPS o en la dispensación, es con frecuencia el último profesional que ve al paciente antes de que use el medicamento. Sus tareas: (1) conciliar la lista completa de medicamentos, incluidos productos de venta libre y \"naturales\"; (2) verificar la técnica con el dispositivo real (purgado de la pluma, rotación de zonas, cambio de aguja en cada inyección, tiempo de permanencia de la aguja); (3) revisar la conservación: viales y plumas sin abrir en nevera (2–8 °C, nunca congelados) y el dispositivo en uso a temperatura ambiente por el tiempo que indique la ficha técnica; en Colombia insistir en evitar el vehículo, la ventana o la nevera de icopor sin control; (4) enseñar a reconocer y tratar la hipoglucemia (regla 15-15) y a disponer de glucagón cuando esté indicado; (5) revisar el glucómetro o el monitor continuo, la frecuencia de autocontrol y la interpretación de registros; (6) detectar problemas relacionados con medicamentos (PRM) y resultados negativos (RNM) y comunicarlos por escrito al médico tratante; (7) reportar eventos adversos y fallas de calidad (p. ej. dispositivo defectuoso o sospecha de producto fraudulento) al programa de farmacovigilancia e INVIMA.</p><p>Caso aplicado: Andrés, 24 años, DM1 desde los 12, usuario de régimen contributivo en Medellín, con insulina glargina nocturna e insulina asparta prandial en pluma. Consulta en la farmacia por \"bajones\" a media mañana. En la entrevista el QF identifica: inyecta la prandial siempre en la misma zona del abdomen (lipohipertrofia palpable), reutiliza la aguja toda la semana, guarda la pluma en uso en la guantera de la moto y se aplica la dosis prandial completa aunque desayune poco. Intervenciones: educación sobre rotación de zonas y cambio de aguja; corrección de la conservación; explicación del ajuste prandial según la ingesta según lo pactado con su endocrinólogo; entrenamiento en regla 15-15 y en el uso de glucagón por un familiar; nota escrita al médico describiendo la lipohipertrofia y las hipoglucemias para que valore la titulación; registro del PRM (uso inadecuado del dispositivo) y plan de seguimiento a 2 semanas con revisión del registro de glucometrías.</p><p>Puntos clave:<br>1. La técnica de inyección y la conservación son causas frecuentes y corregibles de variabilidad glucémica e hipoglucemia.<br>2. El QF no modifica dosis por su cuenta: documenta, educa y comunica al prescriptor con datos (registros, hallazgos).<br>3. Toda sospecha de reacción adversa, falla terapéutica o falla de calidad se notifica al programa institucional de farmacovigilancia e INVIMA.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Antidiabéticos no insulínicos y farmacoterapia de la obesidad', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: del control glucémico al beneficio cardiorrenal', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la evolución del tratamiento de la DM2 hacia la elección por comorbilidades y la incorporación de la farmacoterapia de la obesidad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=uWA5jkudgt0","provider":"youtube","videoId":"uWA5jkudgt0","title":"ANTIDIABÉTICOS ORALES ¿Cómo elegir? – Apuntes de Farmacia 2025","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ibsalut.es/elcomprimido/docs/Boletines_el_comprimido/elComprimido%20n%C3%BAm%2026_DM2_ESP.pdf","title":"El Comprimido nº 26: Diabetes mellitus tipo 2","description":"IB-Salut – Servicio de Salud de las Islas Baleares (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Metformina: mecanismo, farmacocinética, función renal y seguridad', 'Clase 2 · Metformina, sulfonilureas y pioglitazona', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el uso de metformina como base del tratamiento, su ajuste por filtración glomerular, la intolerancia digestiva, el déficit de B12 y la acidosis láctica.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=T5Ca9z1IkY0","provider":"youtube","videoId":"T5Ca9z1IkY0","title":"Medicamentos orales / Educación en Diabetes AMD","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ncbi.nlm.nih.gov/books/NBK518983/","title":"[Página web] Metformin","description":"StatPearls – NCBI Bookshelf (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://cima.aemps.es/cima/pdfs/ft/68167/FT_68167.pdf","title":"Ficha técnica Metformina Cinfa 850 mg comprimidos","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Sulfonilureas y pioglitazona: eficacia, hipoglucemia, peso y riesgos', 'Clase 2 · Metformina, sulfonilureas y pioglitazona', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara sulfonilureas (glibenclamida, glimepirida, gliclazida) y pioglitazona en eficacia, hipoglucemia, peso, edema e insuficiencia cardiaca.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=5PqwBLHnUAY","provider":"youtube","videoId":"5PqwBLHnUAY","title":"Sulfonilureas y Meglitinidas: hipoglicemiantes orales – Conoce tu agente antidiabético","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ncbi.nlm.nih.gov/books/NBK513225/","title":"[Página web] Sulfonylureas","description":"StatPearls – NCBI Bookshelf (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.ncbi.nlm.nih.gov/books/NBK544287/","title":"[Página web] Pioglitazone","description":"StatPearls – NCBI Bookshelf (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Inhibidores de la DPP-4', 'Clase 3 · Terapias incretínicas e inhibidores de SGLT2', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe sitagliptina, linagliptina y otras gliptinas: mecanismo, ajuste renal, neutralidad de peso y seguridad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=_3MWDLCaGx0","provider":"youtube","videoId":"_3MWDLCaGx0","title":"Oral Antidiabetic Medications – Pharmacology – Endocrine System","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ncbi.nlm.nih.gov/books/NBK542331/","title":"[Página web] Dipeptidyl Peptidase IV (DPP IV) Inhibitors","description":"StatPearls – NCBI Bookshelf (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Agonistas del receptor de GLP-1 y agonista dual GIP/GLP-1: semaglutida y tirzepatida', 'Clase 3 · Terapias incretínicas e inhibidores de SGLT2', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el mecanismo, el escalamiento de dosis, los efectos gastrointestinales, las contraindicaciones (cáncer medular de tiroides, MEN2) y el beneficio cardiovascular.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.ncbi.nlm.nih.gov/books/NBK551568/","title":"[Página web] Glucagon-Like Peptide-1 Receptor Agonists","description":"StatPearls – NCBI Bookshelf (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ncbi.nlm.nih.gov/books/NBK603723/","title":"[Página web] Semaglutide","description":"StatPearls – NCBI Bookshelf (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.ncbi.nlm.nih.gov/books/NBK585056/","title":"[Página web] Tirzepatide","description":"StatPearls – NCBI Bookshelf (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Inhibidores de SGLT2: beneficio cardiorrenal y seguridad', 'Clase 3 · Terapias incretínicas e inhibidores de SGLT2', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe dapagliflozina, empagliflozina y canagliflozina: indicaciones en IC y ERC, infecciones genitales, cetoacidosis euglucémica y días de enfermedad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.ncbi.nlm.nih.gov/books/NBK576405/","title":"[Página web] Sodium-Glucose Transport 2 (SGLT2) Inhibitors","description":"StatPearls – NCBI Bookshelf (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://nefrologiaaldia.org/es-articulo-farmacos-antidiabeticos-en-la-enfermedad-renal-cronica-512-pdf","title":"Fármacos antidiabéticos en la enfermedad renal crónica","description":"Nefrología al Día – Sociedad Española de Nefrología (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Algoritmo de tratamiento de la DM2 centrado en comorbilidades', 'Clase 4 · Algoritmo terapéutico, obesidad y caso integrador', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica el algoritmo ADA 2026 para elegir y combinar fármacos según enfermedad cardiovascular, renal, IC, peso y riesgo de hipoglucemia, en el contexto PBS/MIPRES.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://doi.org/10.2337/dc26-s009","title":"[Página web] ADA Standards of Care 2026 – Sección 9: Pharmacologic Approaches to Glycemic Treatment","description":"American Diabetes Association (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://sanidad.castillalamancha.es/sites/sescam.castillalamancha.es/files/documentos/farmacia/ii_1_antidiabeticos.pdf","title":"Antidiabéticos (guía farmacoterapéutica)","description":"SESCAM – Servicio de Salud de Castilla-La Mancha (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Farmacoterapia actual de la obesidad', 'Clase 4 · Algoritmo terapéutico, obesidad y caso integrador', 7, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara semaglutida, tirzepatida, liraglutida, orlistat y naltrexona/bupropión en eficacia, seguridad y criterios de uso.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://doi.org/10.2337/dc26-s008","title":"[Página web] ADA Standards of Care 2026 – Sección 8: Obesity and Weight Management for the Prevention and Treatment of Type 2 Diabetes","description":"American Diabetes Association (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ncbi.nlm.nih.gov/books/NBK585056/","title":"[Página web] Tirzepatide","description":"StatPearls – NCBI Bookshelf (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: DM2 con enfermedad renal crónica e insuficiencia cardiaca', 'Clase 4 · Algoritmo terapéutico, obesidad y caso integrador', 8, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso clínico de optimización del tratamiento con ajuste de metformina, retiro de glibenclamida e inicio de iSGLT2 con educación del QF.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: seleccionar y monitorizar la farmacoterapia de un paciente con diabetes tipo 2, enfermedad renal crónica e insuficiencia cardiaca, aplicando el enfoque centrado en comorbilidades de los Standards of Care de la ADA 2026 y el contexto colombiano.</p><p>Desarrollo: los estándares actuales recomiendan elegir los fármacos no solo por su efecto sobre la HbA1c sino por su beneficio cardiorrenal demostrado: iSGLT2 en insuficiencia cardiaca y enfermedad renal crónica (con indicación que se mantiene aun con filtración glomerular reducida, según ficha técnica), y arGLP-1 con beneficio cardiovascular demostrado en enfermedad aterosclerótica, además del control de peso. La metformina sigue siendo útil si la función renal lo permite (contraindicada con TFG &lt;30 mL/min/1,73 m² y con reducción de dosis entre 30 y 45). Las sulfonilureas, especialmente glibenclamida, aumentan el riesgo de hipoglucemia en ERC y en el adulto mayor. La GPC colombiana de DM2 (MinSalud/IETS, 2015-2016) es anterior a buena parte de esta evidencia; el QF debe conocer la guía nacional y, a la vez, las actualizaciones internacionales, y verificar la cobertura: varios fármacos están en el PBS financiado con la UPC y otros requieren prescripción por MIPRES.</p><p>Caso aplicado: Gloria, 68 años, Barranquilla. DM2 de 15 años, HbA1c 8,4 %, TFG 38 mL/min/1,73 m², albuminuria elevada, IC con fracción de eyección reducida, IMC 31. Recibe metformina en dosis plena, glibenclamida y enalapril. Refiere mareos y sudoración en la tarde. Análisis del QF: (1) metformina en dosis plena con TFG 38: requiere reducción según ficha técnica; (2) glibenclamida con ERC y edad avanzada: alto riesgo de hipoglucemia, probablemente causa de los síntomas; (3) ausencia de iSGLT2 pese a ERC con albuminuria e IC: oportunidad de mejora con beneficio cardiorrenal; (4) un arGLP-1 podría considerarse para peso y riesgo CV. Intervención: informe escrito al médico con estas observaciones y referencia a la ADA 2026, sección 9; educación sobre síntomas de hipoglucemia; al iniciar un iSGLT2, educar sobre higiene genital, hidratación, \"días de enfermedad\" (suspender temporalmente ante vómito, diarrea o ayuno y antes de cirugía por riesgo de cetoacidosis euglucémica) y esperar una caída inicial transitoria de la TFG. Si se inicia un arGLP-1, explicar el escalamiento gradual y los síntomas gastrointestinales.</p><p>Puntos clave:<br>1. Escoger por comorbilidad (IC, ERC, enfermedad aterosclerótica, obesidad) además de HbA1c.<br>2. Ajustar metformina y evitar sulfonilureas de larga acción en ERC y en el adulto mayor.<br>3. Educar sobre días de enfermedad con iSGLT2 y verificar la ruta de acceso (PBS o MIPRES).</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Tiroides y glucocorticoides', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: el eje tiroideo y el eje hipotálamo-hipófisis-suprarrenal', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la fisiología de los ejes tiroideo y suprarrenal y su relevancia para el uso seguro de hormonas tiroideas, antitiroideos y glucocorticoides.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=cdo-2Fym_Lk","provider":"youtube","videoId":"cdo-2Fym_Lk","title":"CORTICOIDES (GLUCOCORTICOIDES) FARMACOLOGÍA","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Levotiroxina: absorción, interacciones y monitorización', 'Clase 2 · Farmacología tiroidea', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la forma correcta de toma, las interacciones por quelación e inducción, el cambio de marca y el control de TSH.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=o0ycAFjGfuI","provider":"youtube","videoId":"o0ycAFjGfuI","title":"Consejos para tomar la levotiroxina correctamente","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/64014/FT_64014.pdf","title":"Ficha técnica Eutirox 100 microgramos comprimidos (levotiroxina)","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Antitiroideos: metimazol y propiltiouracilo; agranulocitosis y hepatotoxicidad', 'Clase 2 · Farmacología tiroidea', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara metimazol y PTU en mecanismo, indicaciones, embarazo y reacciones graves, y las señales de alarma que debe conocer el paciente.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=Mc-JgMU5Ths","provider":"youtube","videoId":"Mc-JgMU5Ths","title":"Farmacología del hipertiroidismo. Metimazol y propiltiouracilo","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ncbi.nlm.nih.gov/books/NBK545223/","title":"[Página web] Methimazole","description":"StatPearls – NCBI Bookshelf (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.ncbi.nlm.nih.gov/books/NBK549828/","title":"[Página web] Propylthiouracil (PTU)","description":"StatPearls – NCBI Bookshelf (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: hipotiroidismo descompensado por interacciones y cambio de marca', 'Clase 2 · Farmacología tiroidea', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso clínico de TSH elevada por toma con calcio, hierro e IBP, con intervención del QF y comunicación al médico.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: identificar y resolver problemas de absorción e interacciones de la levotiroxina en un paciente polimedicado, y reconocer las señales de alarma del tratamiento antitiroideo.</p><p>Desarrollo: la levotiroxina (T4) tiene un margen terapéutico estrecho y su absorción intestinal es variable. Se recomienda tomarla en ayunas, con agua, 30–60 minutos antes del desayuno (o al acostarse, al menos 3 horas después de la última comida), siempre de la misma forma. Reducen su absorción: sales de calcio y hierro, antiácidos con aluminio o magnesio, sucralfato, resinas secuestradoras de ácidos biliares, sevelámer, inhibidores de la bomba de protones, café y fibra; se aconseja separarlos unas 4 horas. Aumentan su metabolismo los inductores (carbamazepina, fenitoína, rifampicina). Los estrógenos orales aumentan la globulina transportadora y pueden elevar el requerimiento, igual que el embarazo. Cambiar de marca o de genérico puede alterar la TSH, por lo que se recomienda control de TSH 6–8 semanas después de cualquier cambio. En antitiroideos, la agranulocitosis por metimazol o propiltiouracilo es rara pero grave, generalmente en los primeros meses: el paciente debe suspender el medicamento y consultar de inmediato ante fiebre, dolor de garganta o úlceras orales, con hemograma urgente. El PTU tiene riesgo de hepatotoxicidad grave y se reserva sobre todo para el primer trimestre del embarazo y la crisis tirotóxica.</p><p>Caso aplicado: Martha, 58 años, Bogotá, hipotiroidismo posquirúrgico. Toma levotiroxina con el desayuno junto con carbonato de calcio + vitamina D, sulfato ferroso y omeprazol. La TSH subió de 2,1 a 9,8 mUI/L tras cambiar de marca porque la EPS dispensó otro laboratorio. El médico le subió la dosis dos veces sin mejoría. Análisis del QF: interacción por quelación con calcio y hierro; menor absorción por el IBP; toma con alimento; cambio de producto sin control de TSH. Intervención: educación sobre la toma en ayunas, separación de 4 horas de calcio y hierro, revisión con el médico de la necesidad del IBP, recomendación de mantener la misma presentación y de control de TSH en 6–8 semanas; comunicación escrita al prescriptor para evitar sobredosificación cuando se corrija la absorción (riesgo de fibrilación auricular y pérdida ósea en mayores).</p><p>Puntos clave:<br>1. Antes de subir la dosis de levotiroxina, revisar adherencia, forma de toma e interacciones.<br>2. Separar calcio, hierro y antiácidos unas 4 horas; controlar TSH tras cualquier cambio de marca o de dosis.<br>3. Con metimazol o PTU, fiebre u odinofagia obligan a suspender y consultar de inmediato (agranulocitosis).</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Glucocorticoides: mecanismo, equivalencias y efectos adversos', 'Clase 3 · Glucocorticoides', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara hidrocortisona, prednisona, prednisolona, metilprednisolona y dexametasona en potencia, duración y actividad mineralocorticoide.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=JWohw-SUR94","provider":"youtube","videoId":"JWohw-SUR94","title":"Corticoides. Farmacología explicada","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://gpnotebook.com/es/pages/hematologia/equivalencia-de-corticosteroides-esteroides","title":"[Página web] Equivalencia de corticosteroides (esteroides)","description":"GPnotebook (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://cima.aemps.es/cima/pdfs/ft/57819/FT_57819.pdf","title":"Ficha técnica Dacortin 30 mg comprimidos (prednisona)","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Supresión del eje HHS, retiro gradual y dosis de estrés', 'Clase 3 · Glucocorticoides', 5, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el riesgo de insuficiencia suprarrenal secundaria según dosis y duración, los principios del desmonte y la educación sobre dosis de estrés.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=lJzl6Wfgq2g","provider":"youtube","videoId":"lJzl6Wfgq2g","title":"Farmacocinética de los glucocorticoides e indicaciones","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/57819/FT_57819.pdf","title":"Ficha técnica Dacortin 30 mg comprimidos (prednisona)","description":"CIMA – AEMPS (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Metabolismo óseo e hipófisis', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: remodelado óseo y regulación hipofisaria', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume el remodelado óseo, los factores de riesgo de fractura (FRAX) y la visión general de las hormonas hipofisarias de uso terapéutico.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.osmosis.org/learn/es/Osteoporosis_medications","title":"[Página web] Fármacos para la osteoporosis","description":"Osmosis (en español) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Calcio, vitamina D y bisfosfonatos', 'Clase 2 · Farmacoterapia de la osteoporosis', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la suplementación de calcio y vitamina D y el uso de bisfosfonatos orales e intravenosos: administración, osteonecrosis maxilar, fracturas atípicas y vacaciones terapéuticas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=y6-bR1cN1pg","provider":"youtube","videoId":"y6-bR1cN1pg","title":"Osteoporosis. Bifosfonatos y fracturas por fragilidad","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/dochtml/ft/63955/FT_63955.html","title":"[Página web] Ficha técnica Fosamax Semanal 70 mg comprimidos (alendronato)","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Denosumab, teriparatida y romosozumab', 'Clase 2 · Farmacoterapia de la osteoporosis', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara antirresortivos y anabólicos: efecto rebote al suspender denosumab, duración máxima de teriparatida y riesgo cardiovascular del romosozumab.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=p_D4Zg_BOfo","provider":"youtube","videoId":"p_D4Zg_BOfo","title":"Farmacología del Denosumab","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ncbi.nlm.nih.gov/books/NBK585139/","title":"[Página web] Romosozumab","description":"StatPearls – NCBI Bookshelf (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.euskadi.eus/contenidos/informacion/uso_responsable_medicamentos/es_def/adjuntos/Denosumab-cas.pdf","title":"Denosumab: uso responsable del medicamento","description":"Gobierno Vasco – Osakidetza (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: osteoporosis inducida por glucocorticoides y discontinuación de denosumab', 'Clase 2 · Farmacoterapia de la osteoporosis', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso clínico de administración incorrecta de alendronato y de interrupción de denosumab por barreras de acceso, con intervención del QF.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: diseñar la intervención del QF en una paciente con osteoporosis inducida por glucocorticoides, incluyendo la administración correcta de bisfosfonatos, la suplementación de calcio y vitamina D y los riesgos de suspender el denosumab.</p><p>Desarrollo: los glucocorticoides orales en dosis equivalentes a prednisona ≥2,5–5 mg/día por 3 meses o más aumentan el riesgo de fractura desde las primeras semanas. Las guías recomiendan evaluar el riesgo (densitometría, FRAX ajustado), asegurar calcio y vitamina D adecuados y usar antirresortivos en riesgo moderado-alto. Los bisfosfonatos orales (alendronato, risedronato) requieren tomarse en ayunas, con un vaso lleno de agua, en posición erguida durante al menos 30 minutos y sin otros alimentos o medicamentos, para reducir la esofagitis y garantizar la absorción. Antes de iniciarlos, conviene una valoración odontológica (riesgo raro de osteonecrosis maxilar) y corregir la hipocalcemia y el déficit de vitamina D. El denosumab, cada 6 meses por vía subcutánea, no debe suspenderse ni retrasarse sin plan: al interrumpirlo hay un efecto rebote con riesgo de fracturas vertebrales múltiples, por lo que se requiere transición a un bisfosfonato. La teriparatida o el romosozumab (este último contraindicado con antecedente reciente de infarto o ACV) se reservan para el riesgo muy alto.</p><p>Caso aplicado: Luz Marina, 72 años, Cali, con artritis reumatoide en prednisona 7,5 mg/día desde hace 1 año. Le formularon alendronato semanal, que toma el domingo con el café y el calcio, acostándose después. Además, su EPS demoró la autorización de denosumab que recibía su hermana y esta lleva 10 meses sin dosis. Intervención del QF: (1) enseñar la técnica de toma del alendronato y separar el calcio a otro momento del día; (2) indagar síntomas esofágicos; (3) recomendar valoración odontológica; (4) verificar con el médico la meta de vitamina D; (5) para la hermana, alertar al médico tratante y a la EPS sobre la interrupción del denosumab y el riesgo de fracturas por rebote, documentando la barrera de acceso; (6) reportar al programa de farmacovigilancia cualquier evento adverso.</p><p>Puntos clave:<br>1. La osteoporosis por glucocorticoides se previene: evaluar el riesgo al iniciar corticoides prolongados.<br>2. La técnica de toma del bisfosfonato oral determina su eficacia y seguridad.<br>3. El denosumab no se interrumpe sin transición: es un problema de seguridad y de acceso que el QF debe escalar.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Hormona de crecimiento (somatropina): indicaciones y seguimiento', 'Clase 3 · Hipófisis: visión breve', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las indicaciones aprobadas de la somatropina, sus efectos adversos y los aspectos de acceso, cadena de frío y adherencia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: describir el uso clínico de la hormona de crecimiento (somatropina) y de la desmopresina, sus riesgos principales y el papel del QF en su dispensación y seguimiento.</p><p>Desarrollo: la somatropina es la hormona de crecimiento humana recombinante, de administración subcutánea, indicada en el déficit de GH en niños y adultos, el síndrome de Turner, el síndrome de Prader-Willi, la insuficiencia renal crónica en niños y el niño pequeño para la edad gestacional sin crecimiento compensatorio, entre otras indicaciones según la ficha técnica aprobada por INVIMA. Existen también formulaciones de acción prolongada de administración semanal. Sus efectos adversos incluyen hipertensión intracraneal idiopática, edema, artralgias, deslizamiento de la epífisis femoral, intolerancia a la glucosa y empeoramiento de la escoliosis; está contraindicada con neoplasia activa y en la enfermedad crítica aguda. Es un medicamento biotecnológico de alto costo, por lo que el QF debe verificar la indicación, la autorización (PBS o MIPRES según el caso), la cadena de frío y la técnica con el dispositivo, y apoyar la adherencia, que suele caer en la adolescencia. Su uso con fines de rendimiento o \"antienvejecimiento\" no está aprobado y debe desestimularse.</p><p>La desmopresina es un análogo sintético de la vasopresina con acción selectiva V2 (antidiurética) y mínima vasopresora. Se usa en la diabetes insípida central (deficiencia de arginina vasopresina), en la enuresis nocturna primaria, en la nicturia y, por vía parenteral o nasal, en la enfermedad de von Willebrand tipo 1 y la hemofilia A leve. Su principal riesgo es la hiponatremia por intoxicación hídrica, con cefalea, náuseas, confusión y convulsiones; los grupos de riesgo son el adulto mayor, los niños y los pacientes con alta ingesta de líquidos. Por eso hay que restringir líquidos desde una hora antes hasta 8 horas después de la dosis nocturna (enuresis) y suspender ante vómito o diarrea. Las formas sublinguales y orales tienen biodisponibilidad diferente de la nasal, por lo que no se intercambian dosis 1:1.</p><p>Caso aplicado: un padre en Bucaramanga solicita en la farmacia desmopresina sublingual para su hijo de 8 años con enuresis y comenta que el niño \"toma mucha agua antes de dormir para no deshidratarse\". El QF explica la restricción hídrica nocturna, los signos de hiponatremia y la suspensión ante gastroenteritis, y entrega el material educativo de la ficha técnica.</p><p>Puntos clave:<br>1. La somatropina requiere verificar indicación, acceso, cadena de frío y adherencia.<br>2. La hiponatremia es el riesgo clave de la desmopresina: educación sobre la ingesta de líquidos.<br>3. Las presentaciones de desmopresina no son intercambiables dosis a dosis.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Desmopresina: diabetes insípida, enuresis y riesgo de hiponatremia', 'Clase 3 · Hipófisis: visión breve', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las indicaciones de la desmopresina, las diferencias entre presentaciones y la prevención de la hiponatremia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cima.aemps.es/cima/pdfs/ft/68268/FT_68268.pdf","title":"Ficha técnica Minurin Flas 120 microgramos liofilizado oral (desmopresina)","description":"CIMA – AEMPS (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Hormonas sexuales', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: estrógenos, progestágenos y andrógenos', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la farmacología básica de estrógenos, progestágenos y andrógenos y sus aplicaciones en anticoncepción, menopausia e hipogonadismo.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=G896eCA8jRA","provider":"youtube","videoId":"G896eCA8jRA","title":"Anticonceptivos y terapia de reemplazo hormonal","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Tipos de anticoncepción hormonal', 'Clase 2 · Anticoncepción hormonal', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los métodos combinados (píldora, parche, anillo, inyectable mensual) y los de solo progestágeno (píldora, implante, inyectable trimestral, DIU-LNG) y la anticoncepción de emergencia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=HNJgPU-BMy0","provider":"youtube","videoId":"HNJgPU-BMy0","title":"Anticoncepción hormonal combinada: pastillas, parche, anillo vaginal – Ginecología y Obstetricia","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.farmaceuticos.com/wp-content/uploads/2023/09/PF-173-Anticoncepcion-farmacologica.pdf","title":"Punto Farmacológico 173: Anticoncepción farmacológica","description":"Consejo General de Colegios Oficiales de Farmacéuticos (España) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Criterios médicos de elegibilidad OMS e interacciones', 'Clase 2 · Anticoncepción hormonal', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las categorías 1–4 de la OMS (6.ª ed., 2025) y las interacciones con inductores enzimáticos y lamotrigina.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=fsH8cLzawro","provider":"youtube","videoId":"fsH8cLzawro","title":"Anticonceptivos hormonales y antibióticos: ¿cómo interaccionan?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.who.int/publications/i/item/9789240115583","title":"[Página web] Medical eligibility criteria for contraceptive use, 6th ed. (2025)","description":"Organización Mundial de la Salud (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: anticoncepción combinada en mujer fumadora con migraña con aura', 'Clase 2 · Anticoncepción hormonal', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso clínico de contraindicaciones categoría 4 e interacción con carbamazepina, con orientación y remisión por el QF.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar los Criterios Médicos de Elegibilidad para el uso de anticonceptivos de la OMS (6.ª ed., 2025) y la revisión de interacciones en la orientación farmacéutica sobre anticoncepción hormonal.</p><p>Desarrollo: los criterios de la OMS clasifican cada método en 4 categorías según la condición de la usuaria: 1, sin restricción; 2, las ventajas superan los riesgos; 3, los riesgos generalmente superan las ventajas; 4, riesgo inaceptable. Para los anticonceptivos hormonales combinados (píldora, parche, anillo, inyectable mensual), son categoría 4, entre otras: migraña con aura, fumar ≥15 cigarrillos/día con ≥35 años, hipertensión no controlada, antecedente o alto riesgo de tromboembolismo venoso, cardiopatía isquémica o ACV, mutaciones trombogénicas conocidas, cáncer de mama actual y posparto reciente según lactancia y tiempo. En estas situaciones suelen ser elegibles los métodos solo con progestágeno (píldora, implante subdérmico, inyectable trimestral, DIU de levonorgestrel) o el DIU de cobre. Interacciones relevantes: los inductores enzimáticos (carbamazepina, fenitoína, topiramato en dosis altas, rifampicina, efavirenz, hierba de San Juan) reducen la eficacia de los métodos orales, del parche, del anillo y del implante; la lamotrigina ve reducidos sus niveles con los combinados. En Colombia, la anticoncepción hace parte de las rutas de atención en salud sexual y reproductiva y los métodos modernos están cubiertos por el PBS.</p><p>Caso aplicado: Camila, 36 años, Pereira, fuma 20 cigarrillos al día, tiene migraña con aura y usa un anticonceptivo oral combinado comprado sin fórmula. Además, su neurólogo inició carbamazepina. Análisis del QF: dos condiciones de categoría 4 para el combinado (edad ≥35 + tabaquismo intenso, migraña con aura) y una interacción que reduce la eficacia anticonceptiva. Intervención: explicar el riesgo trombótico y de ACV sin alarmar, recomendar consulta prioritaria con su médico o con el programa de planificación familiar de su EPS para cambiar a un método elegible (p. ej. DIU de cobre o DIU de levonorgestrel, que no dependen del metabolismo hepático para su eficacia), indicar método de respaldo (preservativo) mientras tanto, ofrecer apoyo para la cesación tabáquica y documentar la intervención.</p><p>Puntos clave:<br>1. Usar la tabla de criterios de la OMS en cada dispensación de anticonceptivos combinados.<br>2. Revisar siempre inductores enzimáticos y hierba de San Juan.<br>3. La dispensación sin fórmula es una oportunidad de tamizaje y de remisión, no solo de venta.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Terapia hormonal de la menopausia', 'Clase 3 · Terapia hormonal de la menopausia y testosterona', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe indicaciones, vías, necesidad de progestágeno con útero, ventana de oportunidad, contraindicaciones y riesgos (TEV, cáncer de mama).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=G896eCA8jRA","provider":"youtube","videoId":"G896eCA8jRA","title":"Anticonceptivos y terapia de reemplazo hormonal","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ncbi.nlm.nih.gov/books/NBK493191/","title":"[Página web] Hormone Replacement Therapy","description":"StatPearls – NCBI Bookshelf (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Testosterona: hipogonadismo masculino, monitorización y uso indebido', 'Clase 3 · Terapia hormonal de la menopausia y testosterona', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe indicaciones, presentaciones, monitorización de hematocrito y PSA, transferencia secundaria del gel y riesgos del uso no médico.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cima.aemps.es/cima/dochtml/ft/80617/FT_80617.html","title":"[Página web] Ficha técnica Testogel 16,2 mg/g gel (testosterona)","description":"CIMA – AEMPS (ES)"}'::jsonb);

END
$curso$;

-- ─── 7. Curso de Farmacología del Sistema Nervioso Central (34 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Farmacología del Sistema Nervioso Central' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Farmacología del Sistema Nervioso Central', 'Curso de farmacología neurológica, no psiquiátrica, para químicos farmacéuticos: neurotransmisión, anestésicos, analgesia con opioides y no opioides, antiepilépticos, Parkinson, demencias, migraña, esclerosis múltiple y relajantes musculares. Integra la regulación colombiana de medicamentos de control especial (FNE, Res. 1478/2006, Res. 315/2020 y Res.', '<p>Curso de farmacología neurológica, no psiquiátrica, para químicos farmacéuticos: neurotransmisión, anestésicos, analgesia con opioides y no opioides, antiepilépticos, Parkinson, demencias, migraña, esclerosis múltiple y relajantes musculares. Integra la regulación colombiana de medicamentos de control especial (FNE, Res. 1478/2006, Res. 315/2020 y Res. 116/2026), la farmacovigilancia y casos clínicos con intervención farmacéutica.</p><h3>Objetivo general</h3><p>Que el químico farmacéutico aplique los principios de mecanismo de acción, farmacocinética, seguridad e interacciones de los fármacos del SNC al seguimiento farmacoterapéutico, la dispensación segura y la farmacovigilancia, en el marco normativo y del sistema de salud colombiano.</p><h3>A quién va dirigido</h3><p>Químicos farmacéuticos y estudiantes de último año de Química Farmacéutica en Colombia que trabajan en farmacia hospitalaria, servicios farmacéuticos de IPS y EPS, farmacia comunitaria, cuidados paliativos o industria farmacéutica.</p><h3>Contexto normativo</h3><p>Colombia — GPC MinSalud/IETS, PBS/MIPRES, INVIMA</p>',
          'Farmacología', 'intermedio', 'Que el químico farmacéutico aplique los principios de mecanismo de acción, farmacocinética, seguridad e interacciones de los fármacos del SNC al seguimiento farmacoterapéutico, la dispensación segura y la farmacovigilancia, en el marco normativo y del sistema de salud colombiano.', 'Químicos farmacéuticos y estudiantes de último año de Química Farmacéutica en Colombia que trabajan en farmacia hospitalaria, servicios farmacéuticos de IPS y EPS, farmacia comunitaria, cuidados paliativos o industria farmacéutica.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Bases de la neurofarmacología y anestésicos', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: el químico farmacéutico frente a la farmacología del SNC', 'Clase 1 · Introducción al curso', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Presenta el alcance del curso, la organización del SNC y el papel del químico farmacéutico en el uso seguro de los medicamentos neurológicos en Colombia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://espanol.libretexts.org/Bookshelves/Salud/Enfermeria/Farmacologia_de_Enfermeria_(OpenRN)/08%3A_Sistema_Nervioso_Central/8.01%3A_Introducci%C3%B3n_al_Sistema_Nervioso_Central","title":"[Página web] 8.1: Introducción al Sistema Nervioso Central (Farmacología de Enfermería OpenRN)","description":"LibreTexts Español (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Neurotransmisores y receptores: dianas de los fármacos del SNC', 'Clase 2 · Neurotransmisión y acceso de los fármacos al SNC', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los principales sistemas de neurotransmisión (GABA, glutamato, dopamina, acetilcolina, serotonina, opioides endógenos) y los tipos de receptores sobre los que actúan los fármacos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://espanol.libretexts.org/Bookshelves/Salud/Enfermeria/Farmacologia_de_Enfermeria_(OpenRN)/08%3A_Sistema_Nervioso_Central/8.02%3A_Revisi%C3%B3n_de_Conceptos_B%C3%A1sicos_del_Sistema_Nervioso_Central","title":"[Página web] 8.2: Revisión de Conceptos Básicos del Sistema Nervioso Central","description":"LibreTexts Español (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Barrera hematoencefálica y farmacocinética en el SNC', 'Clase 2 · Neurotransmisión y acceso de los fármacos al SNC', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Explica los determinantes del paso de fármacos al SNC (liposolubilidad, unión a proteínas, LAT1, glicoproteína P) y sus implicaciones terapéuticas y de seguridad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: comprender cómo la barrera hematoencefálica (BHE) condiciona la llegada de los fármacos al sistema nervioso central (SNC) y cómo el químico farmacéutico usa ese conocimiento en la selección, el seguimiento y la prevención de reacciones adversas.</p><p>Desarrollo. La BHE está formada por células endoteliales capilares unidas por uniones estrechas, rodeadas por pericitos y pies astrocitarios. A diferencia de otros capilares, casi no tiene fenestraciones ni transcitosis inespecífica, de modo que el paso de un fármaco depende de: (1) liposolubilidad y grado de ionización al pH fisiológico; (2) tamaño molecular (en general, moléculas pequeñas de bajo peso molecular difunden mejor); (3) unión a proteínas plasmáticas, porque solo la fracción libre atraviesa; y (4) transportadores. Entre estos destacan los transportadores de entrada (p. ej., el transportador de aminoácidos neutros grandes LAT1, que usa la levodopa) y las bombas de salida, sobre todo la glicoproteína P (P-gp, ABCB1), que expulsa fármacos como la loperamida o la domperidona y explica por qué casi no tienen efectos centrales a dosis habituales.</p><p>Consecuencias clínicas: (a) la dopamina no atraviesa la BHE, por eso se administra su precursor levodopa junto con un inhibidor periférico de la dopa-descarboxilasa (carbidopa o benserazida) que no entra al SNC; (b) los antagonistas opioides periféricos (metilnaltrexona, naloxegol) tratan el estreñimiento sin revertir la analgesia; (c) los antihistamínicos H1 de segunda generación son sustratos de P-gp y producen menos sedación; (d) la inflamación meníngea aumenta la permeabilidad y modifica las concentraciones en el líquido cefalorraquídeo; (e) en neonatos, adultos mayores y pacientes con encefalopatía la barrera puede ser más permeable, con mayor riesgo de toxicidad central. Los anticuerpos monoclonales (p. ej., anti-amiloide) llegan al cerebro en proporciones muy bajas, lo que explica la necesidad de dosis altas y ciclos de infusión.</p><p>Las interacciones también pasan por la BHE: los inhibidores de P-gp (algunos macrólidos, verapamilo, ciclosporina, amiodarona) pueden aumentar la exposición central de sustratos y provocar efectos inesperados.</p><p>Ejemplo aplicado a Colombia: en una farmacia hospitalaria de Medellín, un adulto mayor recibe loperamida a dosis altas por diarrea crónica junto con un inhibidor potente de P-gp. El químico farmacéutico detecta el riesgo de depresión del SNC y de cardiotoxicidad (prolongación del QT), recomienda revisar la indicación y reporta cualquier evento al programa institucional de farmacovigilancia, que lo comunica al INVIMA.</p><p>Puntos clave:<br>1. Solo la fracción libre, liposoluble y no ionizada atraviesa con facilidad la BHE; los transportadores (LAT1, P-gp) pueden facilitar o impedir el paso.<br>2. Varias estrategias terapéuticas del SNC se basan en la BHE: el profármaco levodopa, los inhibidores periféricos de la descarboxilasa y los antagonistas opioides de acción periférica.<br>3. La edad, la inflamación y las interacciones con P-gp cambian la exposición cerebral: hay que considerarlas en el seguimiento farmacoterapéutico.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Anestésicos generales inhalados e intravenosos', 'Clase 3 · Anestésicos generales y locales', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los anestésicos inhalados y los intravenosos (propofol, ketamina, etomidato, tiopental) en mecanismo, farmacocinética (CAM, coeficiente sangre/gas) y efectos adversos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.osmosis.org/learn/es/General_anesthetics","title":"[Página web] Anestésicos generales (video y resumen)","description":"Osmosis (Elsevier) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/58785/FT_58785.pdf","title":"Ficha técnica Diprivan (propofol) 10 mg/ml emulsión inyectable","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Anestésicos locales: mecanismo, tipos y toxicidad', 'Clase 3 · Anestésicos generales y locales', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el bloqueo de canales de sodio, las diferencias entre ésteres y amidas, el papel del vasoconstrictor y la toxicidad sistémica.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.salusplay.com/apuntes/apuntes-de-farmacologia/anestesicos-locales/resumen","title":"[Página web] Anestésicos Locales (apuntes de farmacología, resumen)","description":"SalusPlay (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.redalyc.org/pdf/5517/551757317012.pdf","title":"Anestésicos locales (artículo de revisión)","description":"Redalyc (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: toxicidad sistémica por anestésicos locales e hipertermia maligna', 'Clase 3 · Anestésicos generales y locales', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso de toxicidad sistémica por anestésicos locales en cirugía ambulatoria con intervención del químico farmacéutico en prevención, disponibilidad de emulsión lipídica y dantroleno, y farmacovigilancia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar el conocimiento de anestésicos locales y generales para reconocer y apoyar el manejo de la toxicidad sistémica por anestésicos locales (LAST) y de la hipertermia maligna desde el servicio farmacéutico.</p><p>Caso. Mujer de 34 años, 58 kg, programada en un hospital de Bogotá para cirugía ambulatoria de mano con bloqueo de plexo braquial con bupivacaína más infiltración adicional de lidocaína por el cirujano. A los pocos minutos presenta sabor metálico, parestesias peribucales, tinnitus y agitación, seguidos de convulsión tónico-clónica y bradicardia con ensanchamiento del QRS.</p><p>Análisis farmacológico. Los anestésicos locales bloquean canales de sodio dependientes de voltaje. Con concentraciones plasmáticas elevadas, por dosis total acumulada de dos agentes, por inyección intravascular inadvertida o por zonas muy vascularizadas, aparecen primero los síntomas del SNC y después la cardiotoxicidad. La bupivacaína es la más cardiotóxica por su alta liposolubilidad y su disociación lenta del canal. Las dosis máximas se suman: usar dos anestésicos no permite dar la dosis máxima de cada uno.</p><p>Intervención del químico farmacéutico:<br>1. Prevención: verificar en la orden médica la dosis total por kg de peso, con y sin vasoconstrictor, según la ficha técnica; alertar cuando se combinen agentes; promover dosis fraccionadas y aspiración previa.<br>2. Disponibilidad: asegurar un kit de LAST con emulsión lipídica al 20 % y el protocolo institucional (basado en las recomendaciones de la ASRA) en quirófanos y salas de bloqueo. Las convulsiones se tratan preferiblemente con benzodiacepinas. Se evitan el propofol a dosis altas, la vasopresina, los bloqueadores de canales de calcio y los betabloqueadores, y se usan dosis reducidas de adrenalina.<br>3. Hipertermia maligna: el mismo carro debe considerar el dantroleno. Ante anestésicos inhalados halogenados o succinilcolina en un paciente susceptible pueden aparecer hipercapnia, rigidez e hipertermia. El químico farmacéutico debe garantizar el stock, conocer el tiempo de reconstitución y, si no hay oferta nacional, gestionar la importación consultando el listado de medicamentos vitales no disponibles del INVIMA.<br>4. Farmacovigilancia: reportar el evento como reacción adversa grave a través del programa institucional al INVIMA (reporte en línea) y analizar las causas: error de medicación o reacción no prevenible.</p><p>Desenlace. Tras las benzodiacepinas, el soporte vital y la emulsión lipídica, la paciente se recupera. El comité de seguridad del paciente incorpora una calculadora de dosis máxima de anestésicos locales en la historia clínica electrónica.</p><p>Puntos clave:<br>1. Las dosis de anestésicos locales son acumulativas: hay que calcular la dosis total por kilo y por agente.<br>2. La emulsión lipídica al 20 % y el dantroleno son medicamentos críticos: su disponibilidad depende de la gestión farmacéutica.<br>3. Todo evento de LAST o de hipertermia maligna debe notificarse y analizarse como evento de seguridad del paciente.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Dolor: analgésicos opioides y no opioides', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: fisiopatología del dolor y analgesia', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume las vías del dolor, los tipos de dolor y el enfoque escalonado o multimodal de la analgesia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=0qAmRjgt5PA","provider":"youtube","videoId":"0qAmRjgt5PA","title":"Generalidades de los Opioides","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Receptores opioides, agonistas y agonistas parciales', 'Clase 2 · Farmacología de los opioides', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los receptores μ, κ y δ, la clasificación de los opioides (agonistas puros, parciales, mixtos) y sus efectos farmacológicos y adversos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=OpQMG8DmvAI","provider":"youtube","videoId":"OpQMG8DmvAI","title":"Farmacología de los opioides","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.nysora.com/es/anestesia/opioides/","title":"[Página web] Opioides: farmacología básica y clínica","description":"NYSORA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://cima.aemps.es/cima/pdfs/ft/59656/FT_59656.pdf","title":"Ficha técnica Sevredol (morfina) 10 mg comprimidos","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Farmacocinética de los opioides y particularidades por molécula', 'Clase 2 · Farmacología de los opioides', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las diferencias farmacocinéticas (metabolitos activos, CYP2D6 en codeína y tramadol, CYP3A4 en fentanilo y oxicodona, vía transdérmica) y su impacto en falla renal y hepática.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=npfjRA5gFtc&pp=0gcJCfwAo7VqN5tD","provider":"youtube","videoId":"npfjRA5gFtc","title":"Farmacocinética de los opioides y usos clínicos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/61961/FT_61961.pdf","title":"Ficha técnica Durogesic Matrix (fentanilo) parches transdérmicos","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Antagonistas opioides: naloxona, naltrexona y antagonistas periféricos', 'Clase 2 · Farmacología de los opioides', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el uso de naloxona en la sobredosis por opioides, la naltrexona y los antagonistas periféricos en el estreñimiento inducido por opioides.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.osmosis.org/learn/es/Opioid_antagonists","title":"[Página web] Antagonistas de los opioides","description":"Osmosis (Elsevier) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/69533/FT_69533.pdf","title":"Ficha técnica Naloxona B. Braun 0,4 mg/ml solución inyectable","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Tolerancia, dependencia, hiperalgesia y rotación de opioides', 'Clase 3 · Uso seguro de opioides y regulación colombiana', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los mecanismos de tolerancia e hiperalgesia y aplica los principios de rotación de opioides con tablas equianalgésicas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: interpretar los fenómenos de tolerancia, dependencia física, hiperalgesia inducida por opioides y la estrategia de rotación de opioides para optimizar la analgesia con seguridad.</p><p>Desarrollo. La tolerancia es la pérdida progresiva del efecto con la misma dosis. Se produce por desensibilización y por internalización del receptor μ (fosforilación por GRK y reclutamiento de β-arrestina), regulación del AMPc y cambios en la neurotransmisión glutamatérgica (receptor NMDA). Se desarrolla rápido para la analgesia, la sedación, las náuseas y la depresión respiratoria, pero casi no para el estreñimiento ni la miosis. Por eso el laxante debe pautarse siempre de forma profiláctica. La dependencia física es una adaptación esperable que causa síndrome de abstinencia si se suspende de golpe o si se administra un antagonista. Es distinta del trastorno por uso de opioides, un diagnóstico conductual. La hiperalgesia inducida por opioides es una paradoja: el dolor aumenta y se difunde a pesar de subir la dosis. Se sospecha cuando el escalamiento empeora el dolor.</p><p>Rotación de opioides: cambiar de un opioide a otro (o de vía) por analgesia insuficiente con efectos adversos limitantes, por neurotoxicidad (mioclonías, delirium, alucinaciones, a menudo por metabolitos como la morfina-3-glucurónido en falla renal), por cambios en la vía disponible o por interacciones. Pasos generales: (1) calcular la dosis total diaria del opioide actual, incluidos los rescates; (2) convertirla a equivalentes de morfina oral con una tabla equianalgésica de una guía reconocida; (3) reducir la dosis calculada, habitualmente entre un 25 % y un 50 %, por la tolerancia cruzada incompleta; (4) ajustar según la situación clínica (más reducción en adultos mayores y en falla renal o hepática); (5) prescribir rescates (en general cerca de una sexta a una décima parte de la dosis diaria); y (6) reevaluar en 24 a 72 horas. La metadona exige protocolos específicos por su vida media larga y variable, su relación de conversión no lineal y su riesgo de prolongar el QT. El fentanilo transdérmico tarda horas en alcanzar el equilibrio y no sirve para el dolor agudo ni para pacientes que nunca han recibido opioides.</p><p>Ejemplo colombiano: un paciente con cáncer de páncreas atendido en una IPS oncológica de Cali recibe morfina oral y desarrolla mioclonías con deterioro de la función renal. El químico farmacéutico propone rotar a un opioide con menos metabolitos activos de eliminación renal, calcula la dosis con reducción por tolerancia cruzada y verifica que la nueva prescripción cumpla con el recetario oficial para medicamentos de control especial y con la disponibilidad en el Fondo Rotatorio de Estupefacientes del departamento.</p><p>Puntos clave:<br>1. Hay tolerancia a casi todos los efectos de los opioides excepto al estreñimiento y la miosis: el laxante es obligatorio.<br>2. La rotación se hace con tablas equianalgésicas, reduciendo la dosis por tolerancia cruzada incompleta y reevaluando pronto.<br>3. La metadona y el fentanilo transdérmico requieren protocolos especiales: el químico farmacéutico valida la conversión y la monitorización.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Fondo Nacional de Estupefacientes y medicamentos de control especial en Colombia', 'Clase 3 · Uso seguro de opioides y regulación colombiana', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el marco normativo de los medicamentos de control especial (Res. 1478/2006, Res. 315/2020 modificada por la Res. 116/2026), el monopolio del Estado, el FNE, los Fondos Rotatorios y el recetario oficial.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_0315_2020.htm","title":"[Página web] Resolución 315 de 2020 (MinSalud): actualización de listados de sustancias y medicamentos de control especial","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ica.gov.co/getattachment/Areas/Pecuaria/Servicios/Regulacion-y-Control-de-Medicamentos-Veterinarios/Normatividad-Aplicable/Resolucion-No-116-de-2026-MECE_260219_085726_ESTUPEFACIENTES.pdf.aspx?lang=es-CO","title":"Resolución 116 de 2026 (MinSalud): modifica el artículo 4 y los anexos técnicos de la Resolución 315 de 2020","description":"MinSalud (publicado por el ICA) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'AINE y paracetamol en el manejo del dolor: visión desde el SNC', 'Clase 4 · Analgesia no opioide y caso integrador', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los AINE y el paracetamol (mecanismos centrales y periféricos, techo analgésico, hepatotoxicidad, riesgo renal, gastrointestinal y cardiovascular) y su lugar en la analgesia multimodal.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.salusplay.com/apuntes/apuntes-de-farmacologia/farmacos-para-el-dolor-opiaceos-y-aines/2","title":"[Página web] Fármacos para el Dolor: Opiáceos y AINES","description":"SalusPlay (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: dolor oncológico, rotación de opioides y dispensación de control especial', 'Clase 4 · Analgesia no opioide y caso integrador', 7, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso de un paciente paliativo con morfina, tramadol, AINE y enfermedad renal crónica, con identificación de problemas relacionados con medicamentos y cumplimiento de la normativa del FNE.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: ejecutar un seguimiento farmacoterapéutico integral a un paciente con dolor oncológico que recibe opioides, aplicando la regulación colombiana de medicamentos de control especial.</p><p>Caso. Hombre de 67 años con cáncer de próstata y metástasis óseas, atendido en el programa de cuidados paliativos de una IPS en Barranquilla. Recibe morfina oral de liberación inmediata cada 4 horas más varios rescates diarios, acetaminofén y naproxeno. Refiere dolor de 7/10, estreñimiento de 5 días y somnolencia. Tiene enfermedad renal crónica estadio 3b y toma sertralina y tramadol, que le formuló otro especialista.</p><p>Problemas relacionados con medicamentos identificados por el químico farmacéutico:<br>1. Duplicidad opioide y riesgo serotoninérgico: el tramadol, además de ser un opioide débil, inhibe la recaptación de serotonina y noradrenalina. Con sertralina aumenta el riesgo de síndrome serotoninérgico y de convulsiones. Se recomienda suspenderlo.<br>2. AINE en enfermedad renal crónica: el naproxeno aumenta el riesgo de deterioro renal y de sangrado digestivo. Se sugiere valorar su retiro o un uso muy limitado con protección gástrica, considerando otras opciones para el dolor óseo (radioterapia, bifosfonatos o denosumab según el oncólogo).<br>3. Estreñimiento inducido por opioides sin profilaxis: se recomienda un laxante osmótico o estimulante pautado y, si es refractario, valorar un antagonista periférico.<br>4. Analgesia insuficiente con somnolencia y función renal reducida: se propone pasar a un esquema de liberación prolongada o rotar a un opioide más seguro en falla renal, convirtiendo la dosis total diaria (incluidos los rescates) con reducción por tolerancia cruzada y definiendo rescates.<br>5. Seguridad: educar al cuidador sobre signos de sobredosis (miosis marcada, respiración lenta, somnolencia profunda) y sobre el uso de naloxona según el protocolo institucional.</p><p>Aspectos regulatorios en Colombia:<br>- La prescripción de medicamentos de control especial se hace según la Resolución 1478 de 2006 y sus modificaciones, en el recetario oficial dispuesto por la norma, con los datos completos del paciente y del prescriptor.<br>- Los listados de sustancias y medicamentos de control especial y de monopolio del Estado fueron actualizados por la Resolución 315 de 2020, a su vez modificada en 2026 por la Resolución 116. El químico farmacéutico debe consultar el listado vigente antes de dispensar.<br>- La dispensación la hacen establecimientos inscritos ante el Fondo Rotatorio de Estupefacientes departamental. Se lleva el libro oficial de control y se presentan los informes periódicos al FNE.<br>- Si el medicamento no está en el PBS, se verifica la prescripción por MIPRES.</p><p>Seguimiento: se reevalúan el dolor, el estreñimiento y el estado de alerta a las 48–72 horas y la función renal semanalmente. Se documentan las intervenciones y su aceptación.</p><p>Puntos clave:<br>1. En el dolor oncológico hay que revisar las duplicidades, las interacciones serotoninérgicas y la función renal antes de escalar opioides.<br>2. La profilaxis del estreñimiento y la educación sobre sobredosis y naloxona son parte del estándar de cuidado.<br>3. La dispensación de opioides en Colombia exige cumplir la normativa del FNE y de los Fondos Rotatorios y consultar los listados vigentes (Res. 315/2020 modificada por la Res. 116/2026).</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Antiepilépticos', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: epilepsia y principios del tratamiento antiepiléptico', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la clasificación de las crisis, los objetivos del tratamiento y los principios de monoterapia, titulación y adherencia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=vSqS-rE7H_k","provider":"youtube","videoId":"vSqS-rE7H_k","title":"Antiepilépticos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Mecanismos de acción y clasificación de los antiepilépticos', 'Clase 2 · Mecanismos y fármacos antiepilépticos', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los mecanismos (bloqueo de canales de sodio y calcio, potenciación GABA, SV2A, antiglutamatérgicos) y clasifica los antiepilépticos clásicos y nuevos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=18KUAzJFr_A","provider":"youtube","videoId":"18KUAzJFr_A","title":"Fármacos antiepilépticos y anticonvulsivantes","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://espanol.libretexts.org/Bookshelves/Salud/Enfermeria/Farmacologia_de_Enfermeria_(OpenRN)/08%3A_Sistema_Nervioso_Central/8.10%3A_Anticonvulsivos","title":"[Página web] 8.10: Anticonvulsivos (Farmacología de Enfermería OpenRN)","description":"LibreTexts Español (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Antiepilépticos clásicos y monitorización de niveles plasmáticos', 'Clase 2 · Mecanismos y fármacos antiepilépticos', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la farmacocinética de fenitoína (cinética no lineal), carbamazepina (autoinducción), valproato y fenobarbital, y la monitorización de niveles plasmáticos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=AZcgJbi7uRU","provider":"youtube","videoId":"AZcgJbi7uRU","title":"Tratamiento antiepiléptico (farmacología)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/45695/FT_45695.pdf","title":"Ficha técnica Epanutin (fenitoína) 100 mg cápsulas","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://cima.aemps.es/cima/pdfs/ft/39955/FT_39955.pdf","title":"Ficha técnica Tegretol (carbamazepina) 200 mg comprimidos","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Nuevos antiepilépticos: levetiracetam, lamotrigina y otros', 'Clase 2 · Mecanismos y fármacos antiepilépticos', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los antiepilépticos de nueva generación (levetiracetam, lamotrigina, lacosamida, topiramato, oxcarbazepina) en eficacia, perfil de seguridad e interacciones.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=mtsiVlwor4s","provider":"youtube","videoId":"mtsiVlwor4s","title":"Farmacología del levetiracetam. Antiepilépticos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/00146030/FT_00146030.pdf","title":"Ficha técnica Keppra (levetiracetam) 100 mg/ml concentrado para perfusión","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://cima.aemps.es/cima/pdfs/ft/61568/FT_61568.pdf","title":"Ficha técnica Lamictal (lamotrigina) 100 mg comprimidos","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Inducción e inhibición enzimática con antiepilépticos', 'Clase 3 · Interacciones, seguridad y caso clínico', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Analiza las interacciones por inducción (carbamazepina, fenitoína, fenobarbital) e inhibición (valproato) con anticonceptivos, anticoagulantes, antirretrovirales y otros antiepilépticos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=ckumhPmjS30","provider":"youtube","videoId":"ckumhPmjS30","title":"Farmacología de anticonvulsivantes","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.intramed.net/content/aspectos-farmacologicos-de-los-medicamentos-anticonvulsivos","title":"[Página web] Aspectos farmacológicos de los medicamentos anticonvulsivos","description":"IntraMed (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Seguridad: teratogenicidad del valproato y HLA-B*1502 con carbamazepina', 'Clase 3 · Interacciones, seguridad y caso clínico', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el programa de prevención de embarazo del valproato, las reacciones cutáneas graves asociadas con HLA-B*1502 y HLA-A*3101, y otras alertas de seguridad de los antiepilépticos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cima.aemps.es/cima/pdfs/ft/60350/FT_60350.pdf","title":"Ficha técnica Depakine Crono (valproato) 500 mg comprimidos de liberación prolongada","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/56232/FT_56232.pdf","title":"Ficha técnica Tegretol (carbamazepina) 400 mg comprimidos","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: mujer en edad fértil con valproato y carbamazepina', 'Clase 3 · Interacciones, seguridad y caso clínico', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso de una paciente que planea un embarazo, con valproato, carbamazepina y anticonceptivos orales, con intervención del químico farmacéutico en teratogenicidad, interacciones y farmacogenética.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar los principios de farmacocinética, interacciones y seguridad de los antiepilépticos en una paciente en edad fértil.</p><p>Caso. Mujer de 24 años con epilepsia generalizada idiopática, controlada con ácido valproico desde la adolescencia. Consulta en el servicio farmacéutico de su EPS en Bucaramanga porque desea planear un embarazo. Además, toma anticonceptivos orales combinados. Un neurólogo le formuló recientemente carbamazepina como complemento por crisis ocasionales.</p><p>Problemas relacionados con medicamentos:<br>1. Teratogenicidad del valproato: la exposición intrauterina se asocia con malformaciones congénitas mayores (defectos del tubo neural, entre otras) y con alteraciones del neurodesarrollo. Las agencias regulatorias (EMA desde 2018, con medidas del programa de prevención de embarazo y alertas posteriores) restringen su uso en niñas y mujeres con capacidad de gestar, salvo que otras alternativas sean ineficaces o no toleradas y se cumplan las condiciones del programa. Revisiones más recientes de la EMA también recomendaron precauciones en hombres tratados que planean concebir. El químico farmacéutico debe verificar las alertas y comunicaciones vigentes del INVIMA sobre valproato.<br>2. Interacción entre inductores y anticonceptivos: la carbamazepina es un potente inductor de CYP3A4 y reduce la eficacia de los anticonceptivos hormonales, con riesgo de embarazo no planeado durante la exposición a fármacos teratógenos.<br>3. Interacción entre carbamazepina y valproato: la carbamazepina reduce las concentraciones de valproato, y el valproato puede aumentar el metabolito epóxido de la carbamazepina, con más toxicidad.<br>4. Farmacogenética: si la paciente tuviera ascendencia asiática (p. ej., Han, tailandesa, malaya), se recomendaría tipificar HLA-B*1502 antes de iniciar carbamazepina por el riesgo de síndrome de Stevens-Johnson y necrólisis epidérmica tóxica. HLA-A*3101 también se asocia con reacciones cutáneas graves.</p><p>Intervención del químico farmacéutico:<br>- Remitir de forma prioritaria al neurólogo antes de suspender nada: nunca se debe retirar un antiepiléptico de golpe.<br>- Sugerir valorar alternativas con menor riesgo teratógeno, según la guía y el perfil de crisis (la lamotrigina y el levetiracetam son opciones frecuentemente consideradas), con un plan de transición escalonado.<br>- Recomendar un método anticonceptivo eficaz no afectado por inductores (p. ej., un DIU) mientras dure la transición.<br>- Recomendar suplementación con ácido fólico antes de la concepción, según la indicación médica.<br>- Planear la monitorización de niveles plasmáticos cuando sea pertinente. El embarazo modifica la farmacocinética: el aclaramiento de lamotrigina aumenta de forma importante y puede requerir ajustes.<br>- Educar sobre la adherencia, el registro de crisis y la notificación de eventos al programa de farmacovigilancia.</p><p>Puntos clave:<br>1. El valproato está contraindicado o restringido en mujeres con capacidad de gestar si no se cumple el programa de prevención del embarazo; hay que revisar siempre la alerta vigente.<br>2. Los inductores enzimáticos (carbamazepina, fenitoína, fenobarbital) reducen la eficacia de los anticonceptivos hormonales y de muchos otros fármacos.<br>3. Los cambios de antiepiléptico se hacen siempre de forma escalonada, coordinados con el neurólogo y con seguimiento de crisis y niveles.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Enfermedades neurodegenerativas: Parkinson y demencias', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: neurodegeneración y abordaje farmacológico', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la fisiopatología de la enfermedad de Parkinson y de la enfermedad de Alzheimer y las estrategias farmacológicas sintomáticas y modificadoras.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=croG9xMytTo","provider":"youtube","videoId":"croG9xMytTo","title":"Tratamiento de la Enfermedad de Parkinson: Levodopa, Carbidopa y Fármacos Modernos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Levodopa/carbidopa: mecanismo, farmacocinética y complicaciones motoras', 'Clase 2 · Farmacología de la enfermedad de Parkinson', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la levodopa con inhibidor de la dopa-descarboxilasa, su paso por la barrera hematoencefálica, la interacción con proteínas de la dieta y las fluctuaciones y discinesias.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=kLVECcLYmmE","provider":"youtube","videoId":"kLVECcLYmmE","title":"Fármacos Antiparkinsonianos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.lecturio.com/es/concepts/medicamentos-para-la-enfermedad-de-parkinson","title":"[Página web] Medicamentos para la Enfermedad de Parkinson","description":"Lecturio (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://cima.aemps.es/cima/pdfs/ft/55866/FT_55866.pdf","title":"Ficha técnica Sinemet Plus (levodopa/carbidopa) 25/100 mg comprimidos","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Agonistas dopaminérgicos, IMAO-B, ICOMT y amantadina', 'Clase 2 · Farmacología de la enfermedad de Parkinson', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los agonistas dopaminérgicos (pramipexol, ropinirol, rotigotina), los IMAO-B (rasagilina, selegilina, safinamida), los ICOMT (entacapona, opicapona) y la amantadina.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=x-5dvniwBS8","provider":"youtube","videoId":"x-5dvniwBS8","title":"Tratamiento farmacológico de la enfermedad de Parkinson","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/97051003/FT_97051003.pdf","title":"Ficha técnica Mirapexin (pramipexol) comprimidos","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://cima.aemps.es/cima/pdfs/ft/98081003/FT_98081003.pdf","title":"Ficha técnica Comtan (entacapona) 200 mg comprimidos","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: Parkinson avanzado con fluctuaciones y trastorno del control de impulsos', 'Clase 2 · Farmacología de la enfermedad de Parkinson', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso de un paciente con levodopa, pramipexol y rasagilina con fluctuaciones motoras, trastorno del control de impulsos y prescripción de metoclopramida.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: identificar y resolver problemas relacionados con medicamentos en un paciente con enfermedad de Parkinson avanzada.</p><p>Caso. Hombre de 72 años con enfermedad de Parkinson de 9 años de evolución. Recibe levodopa/carbidopa cuatro veces al día, pramipexol y rasagilina. Su esposa reporta en la farmacia de su IPS en Pereira que el efecto de cada dosis dura menos (\"se le acaba antes\"), que presenta movimientos involuntarios cuando la dosis hace su pico, que últimamente compra objetos sin control y apuesta en línea, y que le formularon metoclopramida para las náuseas y un antidepresivo por síntomas depresivos.</p><p>Problemas identificados:<br>1. Fluctuaciones motoras (deterioro de fin de dosis) y discinesias de pico: son propias de la levodopa crónica por la vida media corta y la pérdida de capacidad de almacenamiento dopaminérgico. Opciones que el químico farmacéutico puede sugerir al neurólogo: fraccionar dosis, añadir un inhibidor de la COMT (entacapona u opicapona), usar formulaciones de liberación modificada y, para las discinesias, valorar amantadina. Hay que revisar el horario de las comidas: las proteínas compiten con la levodopa por el transporte intestinal y de la BHE.<br>2. Trastorno del control de impulsos (juego patológico, compras compulsivas): es un efecto de clase de los agonistas dopaminérgicos. Se debe alertar al prescriptor para valorar una reducción gradual. No se suspenden de golpe por el riesgo de síndrome de abstinencia a agonistas.<br>3. Metoclopramida: es un antagonista dopaminérgico central que empeora el parkinsonismo y está contraindicada. Si se requiere un antiemético, se prefiere la domperidona (con precaución por el QT) según la ficha técnica.<br>4. Rasagilina más antidepresivo: los IMAO-B combinados con ISRS, IRSN, tricíclicos, tramadol, meperidina o dextrometorfano aumentan el riesgo de síndrome serotoninérgico. Hay que revisar la ficha técnica y elegir con el psiquiatra la alternativa más segura (la farmacoterapia psiquiátrica se aborda en el curso de Psicofarmacología).<br>5. Hipotensión ortostática y riesgo de caídas: son comunes con levodopa y agonistas en el adulto mayor. Se educa sobre levantarse lentamente y la hidratación.</p><p>Plan de seguimiento: un diario de \"on/off\" diligenciado por la familia, la revisión de horarios y adherencia, y una reevaluación en cuatro semanas. Se notifica el trastorno del control de impulsos como reacción adversa al programa de farmacovigilancia (INVIMA).</p><p>Puntos clave:<br>1. La levodopa sigue siendo el fármaco más eficaz. Sus complicaciones motoras se manejan ajustando dosis y con ICOMT, IMAO-B o amantadina.<br>2. Los agonistas dopaminérgicos exigen tamizar de forma activa los trastornos del control de impulsos y la somnolencia súbita.<br>3. Hay que evitar los antagonistas dopaminérgicos centrales (metoclopramida, antipsicóticos típicos) y vigilar las combinaciones serotoninérgicas con IMAO-B.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Inhibidores de la colinesterasa y memantina', 'Clase 3 · Farmacología de las demencias', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe donepezilo, rivastigmina, galantamina y memantina: mecanismo, indicaciones por estadio, efectos adversos (bradicardia, síntomas gastrointestinales) y ajustes.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cima.aemps.es/cima/pdfs/ft/68214/FT_68214.pdf","title":"Ficha técnica Aricept Flas (donepezilo) 10 mg comprimidos bucodispersables","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/02219001/FT_02219001.pdf","title":"Ficha técnica Ebixa (memantina) 10 mg comprimidos","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Anticuerpos anti-amiloide (lecanemab, donanemab): evidencia, ARIA y estado regulatorio', 'Clase 3 · Farmacología de las demencias', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el mecanismo, el beneficio clínico modesto, el riesgo de ARIA, el papel de ApoE4 y el estado regulatorio (FDA, UE, INVIMA) de lecanemab y donanemab.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cima.aemps.es/cima/dochtml/ft/1241891001/FT_1241891001.html","title":"Ficha técnica Leqembi (lecanemab) 100 mg/ml concentrado para perfusión","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/dochtml/ft/1251926001/FT_1251926001.html","title":"Ficha técnica Kisunla (donanemab) 350 mg concentrado para perfusión","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.saludyfarmacos.org/?p=75692","title":"[Página web] Donanemab: un nuevo análisis respalda la designación de ''No Usar'' (Boletín Fármacos, nov. 2025)","description":"Salud y Fármacos (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: Alzheimer con carga anticolinérgica y bradicardia', 'Clase 3 · Farmacología de las demencias', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso de una adulta mayor con donepezilo, memantina, anticolinérgicos y betabloqueador, con deprescripción y orientación sobre terapias anti-amiloide.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar el seguimiento farmacoterapéutico en un paciente con demencia tipo Alzheimer, con énfasis en la carga anticolinérgica, la seguridad cardiovascular y la información sobre nuevas terapias anti-amiloide.</p><p>Caso. Mujer de 80 años con enfermedad de Alzheimer moderada, atendida en un programa de atención domiciliaria en Bogotá. Recibe donepezilo, al que hace dos meses le agregaron memantina. También toma oxibutinina por incontinencia, difenhidramina para dormir y metoprolol por hipertensión. Su hija refiere más confusión, dos episodios de mareo con una caída y frecuencia cardíaca de 50 latidos por minuto. Además, pregunta si su madre puede recibir \"la nueva medicina para el Alzheimer que salió en las noticias\".</p><p>Problemas identificados:<br>1. Antagonismo farmacodinámico y carga anticolinérgica: la oxibutinina y la difenhidramina tienen alta carga anticolinérgica, empeoran la cognición y contrarrestan el inhibidor de la colinesterasa. El químico farmacéutico calcula la carga con una escala validada (p. ej., ACB) y, apoyándose en los criterios de Beers o STOPP/START, propone deprescribir la difenhidramina e iniciar medidas no farmacológicas para el sueño. Para la incontinencia, sugiere valorar alternativas de menor efecto central con el médico.<br>2. Bradicardia y síncope: los inhibidores de la colinesterasa aumentan el tono vagal. Combinados con betabloqueadores, pueden causar bradicardia, bloqueos y caídas. Se recomienda un electrocardiograma y una revisión médica de la dosis o del betabloqueador.<br>3. Memantina: se revisa la función renal, porque se ajusta en insuficiencia renal según la ficha técnica, y se vigilan mareo y confusión al inicio.<br>4. Terapias anti-amiloide (lecanemab, donanemab): solo están indicadas en fases tempranas (deterioro cognitivo leve o demencia leve) con patología amiloide confirmada. Requieren tipificación de ApoE4, resonancias seriadas por el riesgo de ARIA (edema y microhemorragias) y precaución con anticoagulantes. La paciente, con demencia moderada, no sería candidata. El químico farmacéutico explica a la familia que estos productos tienen autorización en EE. UU. y en la Unión Europea, pero que su disponibilidad en Colombia depende del registro sanitario INVIMA, que debe consultarse antes de informar.</p><p>Plan: deprescripción escalonada, educación al cuidador sobre caídas y signos de alarma, revisión de la adherencia (pastillero, supervisión) y reevaluación en cuatro semanas. Se documentan las intervenciones en el formato de seguimiento farmacoterapéutico.</p><p>Puntos clave:<br>1. Los anticolinérgicos anulan el beneficio de los inhibidores de la colinesterasa y empeoran la cognición: deprescribirlos es una intervención de alto impacto.<br>2. Los inhibidores de la colinesterasa pueden causar bradicardia y síncope, sobre todo con betabloqueadores u otros bradicardizantes.<br>3. Los anticuerpos anti-amiloide tienen indicación restringida a fases tempranas y exigen monitorización por resonancia por el riesgo de ARIA; su estado regulatorio en Colombia debe verificarse en el INVIMA.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Migraña, esclerosis múltiple y relajantes musculares', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: migraña, esclerosis múltiple y espasticidad', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la fisiopatología de la migraña (CGRP), de la esclerosis múltiple y de la espasticidad, y los grupos farmacológicos de la unidad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: resumir el alcance de la unidad, que integra tres áreas de la neurofarmacología con alto impacto en la práctica del químico farmacéutico: migraña, esclerosis múltiple y relajantes musculares.</p><p>Desarrollo. La migraña es una de las principales causas de discapacidad en adultos jóvenes, sobre todo en mujeres. Su fisiopatología involucra la activación del sistema trigeminovascular y la liberación de neuropéptidos, en especial el péptido relacionado con el gen de la calcitonina (CGRP), que produce vasodilatación e inflamación neurogénica. El tratamiento tiene dos ejes. El agudo incluye analgésicos y AINE, triptanes (agonistas 5-HT1B/1D), gepantes (antagonistas del receptor de CGRP) y ditanes (agonistas 5-HT1F). El preventivo incluye betabloqueadores, topiramato, amitriptilina, onabotulinumtoxinA en migraña crónica y anticuerpos monoclonales anti-CGRP o contra su receptor. El químico farmacéutico tiene un papel clave en detectar la cefalea por uso excesivo de medicación, frecuente en pacientes que se automedican con analgésicos de venta libre.</p><p>La esclerosis múltiple es una enfermedad inflamatoria desmielinizante autoinmune del SNC. Las terapias modificadoras de la enfermedad van desde las de eficacia moderada (interferones beta, acetato de glatiramer, teriflunomida, dimetilfumarato) hasta las de alta eficacia (natalizumab, fingolimod y otros moduladores de S1P, ocrelizumab, ofatumumab, cladribina, alemtuzumab). Son medicamentos de alto costo que, en Colombia, a menudo requieren prescripción por MIPRES y seguimiento estrecho por el riesgo de infecciones oportunistas (p. ej., leucoencefalopatía multifocal progresiva con natalizumab).</p><p>Los relajantes musculares incluyen los antiespásticos de acción central (baclofeno, tizanidina), los relajantes para espasmos musculoesqueléticos (ciclobenzaprina, metocarbamol, orfenadrina), el dantroleno de acción directa y la toxina botulínica. Su principal problema de seguridad es la depresión del SNC, sobre todo combinados con opioides, benzodiacepinas o alcohol, y en adultos mayores. Varios figuran en los criterios de Beers como potencialmente inapropiados.</p><p>Ejemplo colombiano: en una droguería de Cartagena, una paciente compra a diario analgésicos combinados con cafeína para su \"migraña de siempre\". El químico farmacéutico aplica un tamizaje breve, identifica más de 15 días de cefalea al mes y la remite al médico por sospecha de migraña crónica con uso excesivo de medicación.</p><p>Puntos clave:<br>1. El CGRP es el blanco de las nuevas terapias de la migraña (gepantes y anticuerpos monoclonales); los triptanes siguen siendo la base del tratamiento agudo específico.<br>2. Las terapias modificadoras de la esclerosis múltiple exigen gestión de alto costo (MIPRES) y monitorización de infecciones y laboratorios.<br>3. Los relajantes musculares de acción central suman depresión del SNC: hay que vigilar las combinaciones y el uso en adultos mayores.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Tratamiento agudo de la migraña: AINE, triptanes, gepantes y ditanes', 'Clase 2 · Farmacología de la migraña', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los tratamientos agudos de la migraña, sus contraindicaciones cardiovasculares y la prevención de la cefalea por uso excesivo de medicación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cima.aemps.es/cima/pdfs/ft/66406/FT_66406.pdf","title":"Ficha técnica Imigran Neo (sumatriptán) 50 mg comprimidos","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://gpnotebook.com/es/pages/neurologia/gepants-antagonistas-de-los-receptores-cgrp-para-la-migrana-aguda","title":"[Página web] Gepants: antagonistas de los receptores CGRP para la migraña aguda","description":"GPnotebook (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Tratamiento preventivo: anticuerpos anti-CGRP y fármacos orales', 'Clase 2 · Farmacología de la migraña', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los preventivos clásicos (betabloqueadores, topiramato, amitriptilina, onabotulinumtoxinA) y los anticuerpos monoclonales anti-CGRP, con criterios de uso y acceso por MIPRES en Colombia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cima.aemps.es/cima/pdfs/ft/1181293004/FT_1181293004.pdf","title":"Ficha técnica Aimovig (erenumab) 140 mg pluma precargada","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.quironsalud.com/blogs/es/cefablog/anticuerpos-monoclonales-amc-peptido-relacionado-gen-calcit.nodos,40,10","title":"[Página web] Anticuerpos monoclonales anti-CGRP para la migraña (Cefablog)","description":"Quirónsalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Esclerosis múltiple: visión general de las terapias modificadoras de la enfermedad', 'Clase 3 · Esclerosis múltiple, relajantes musculares y caso integrador', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las terapias modificadoras de la esclerosis múltiple por nivel de eficacia, sus riesgos (leucoencefalopatía multifocal progresiva, infecciones, linfopenia) y la monitorización.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cima.aemps.es/cima/pdfs/ft/1171231001/FT_1171231001.pdf","title":"Ficha técnica Ocrevus (ocrelizumab) 300 mg concentrado para perfusión","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Relajantes musculares de acción central y periférica', 'Clase 3 · Esclerosis múltiple, relajantes musculares y caso integrador', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara baclofeno, tizanidina, ciclobenzaprina, metocarbamol y dantroleno: mecanismo, sedación, riesgo de abstinencia (baclofeno) y uso en adultos mayores.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cima.aemps.es/cima/pdfs/ft/62346/FT_62346.pdf","title":"Ficha técnica Lioresal (baclofeno) 0,05 mg/ml solución inyectable intratecal","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico integrador: migraña con uso excesivo de medicación, triptán y riesgo serotoninérgico', 'Clase 3 · Esclerosis múltiple, relajantes musculares y caso integrador', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso en farmacia comunitaria de una paciente con migraña crónica, hipertensión no controlada, ergotamínicos, ISRS y ciclobenzaprina, con decisión de no dispensar el triptán y remisión.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: integrar el conocimiento de migraña y relajantes musculares en un caso de dispensación y seguimiento con riesgo de interacciones.</p><p>Caso. Mujer de 38 años, docente, que acude a una farmacia de cadena en Bogotá con fórmula de sumatriptán oral. Refiere migraña desde hace 15 años, ahora con cefalea 18 días al mes. Usa casi a diario acetaminofén con cafeína y ergotamina, que compra sin fórmula. Toma fluoxetina, que le formuló su médico, y ciclobenzaprina por contractura cervical. Tiene hipertensión arterial no controlada (registros de 150/95 mmHg) y fuma.</p><p>Problemas identificados por el químico farmacéutico:<br>1. Probable migraña crónica con cefalea por uso excesivo de medicación: el consumo frecuente de analgésicos combinados y ergotamínicos perpetúa la cefalea. Se requiere valoración médica para un tratamiento preventivo y la retirada de los fármacos de uso excesivo.<br>2. Contraindicación cardiovascular de los triptanes: por su efecto vasoconstrictor 5-HT1B, los triptanes están contraindicados en hipertensión no controlada, cardiopatía isquémica, enfermedad cerebrovascular o vascular periférica, según la ficha técnica. Se debe contactar al prescriptor.<br>3. Ergotamina más triptán: no deben usarse dentro del intervalo que fija la ficha técnica por el riesgo de vasoespasmo aditivo.<br>4. Riesgo serotoninérgico: la combinación de triptán, ISRS y ciclobenzaprina (estructuralmente relacionada con los tricíclicos) puede contribuir al síndrome serotoninérgico. Aunque el riesgo absoluto con triptanes e ISRS es bajo, hay que educar sobre los signos de alarma (agitación, temblor, hipertermia, diarrea, clonus).<br>5. Ciclobenzaprina: tiene efectos anticolinérgicos y sedantes; no se recomienda su uso prolongado, que debe limitarse a ciclos cortos.</p><p>Intervención:<br>- No dispensar el triptán y comunicarse con el médico, documentando las razones: la hipertensión no controlada contraindica el triptán.<br>- Sugerir alternativas al tratamiento agudo sin efecto vasoconstrictor, como los gepantes o un AINE, según disponibilidad, registro INVIMA y la evaluación médica, y una estrategia preventiva. Si cumple criterios de migraña crónica refractaria, puede ser candidata a anticuerpos anti-CGRP, que en Colombia pueden requerir trámite por MIPRES.<br>- Remitir para control de la presión arterial y apoyar la cesación de tabaquismo.<br>- Recomendar un diario de cefaleas y de consumo de analgésicos, con meta de menos de 10 días al mes de tratamiento agudo.<br>- Reportar al programa de farmacovigilancia cualquier sospecha de reacción adversa.</p><p>Puntos clave:<br>1. Antes de dispensar un triptán hay que tamizar el riesgo cardiovascular y el uso concomitante de ergotamínicos.<br>2. La cefalea por uso excesivo de medicación es frecuente y prevenible desde la farmacia comunitaria.<br>3. Se deben revisar las combinaciones serotoninérgicas y depresoras del SNC (ISRS, relajantes musculares, opioides) y educar sobre los signos de alarma.</p>"}'::jsonb);

END
$curso$;

-- ─── 8. Curso de Psicofarmacología (33 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Psicofarmacología' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Psicofarmacología', 'Curso para químicos farmacéuticos sobre la farmacología de antidepresivos, ansiolíticos, hipnóticos, antipsicóticos, estabilizadores del ánimo, tratamientos del TDAH y de las adicciones. Integra las GPC colombianas de depresión y esquizofrenia, la Ley 1616 de 2013 y la normativa de medicamentos de control especial, con casos clínicos de intervención farmacéutica.', '<p>Curso para químicos farmacéuticos sobre la farmacología de antidepresivos, ansiolíticos, hipnóticos, antipsicóticos, estabilizadores del ánimo, tratamientos del TDAH y de las adicciones. Integra las GPC colombianas de depresión y esquizofrenia, la Ley 1616 de 2013 y la normativa de medicamentos de control especial, con casos clínicos de intervención farmacéutica.</p><h3>Objetivo general</h3><p>Desarrollar en el químico farmacéutico las competencias para promover el uso seguro y efectivo de los psicofármacos mediante el conocimiento de sus mecanismos, riesgos, interacciones y monitorización, y su aplicación en el seguimiento farmacoterapéutico y la farmacovigilancia dentro del sistema de salud colombiano.</p><h3>A quién va dirigido</h3><p>Químicos farmacéuticos, regentes de farmacia y profesionales de servicios farmacéuticos hospitalarios y ambulatorios en Colombia.</p><h3>Contexto normativo</h3><p>Colombia — GPC MinSalud/IETS, PBS/MIPRES, INVIMA</p>',
          'Farmacología', 'intermedio', 'Desarrollar en el químico farmacéutico las competencias para promover el uso seguro y efectivo de los psicofármacos mediante el conocimiento de sus mecanismos, riesgos, interacciones y monitorización, y su aplicación en el seguimiento farmacoterapéutico y la farmacovigilancia dentro del sistema de salud colombiano.', 'Químicos farmacéuticos, regentes de farmacia y profesionales de servicios farmacéuticos hospitalarios y ambulatorios en Colombia.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Fundamentos neurobiológicos y marco normativo de la psicofarmacología en Colombia', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: el QF en la atención de la salud mental', 'Clase 1 · Introducción al curso', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Presenta el alcance del curso, la carga de los trastornos mentales y el rol del QF en el uso seguro de psicofármacos en el marco de la Ley 1616 de 2013.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.dmsjuridica.com/buscador_20179478954/legislacion/leyes/2020/11/24/ley-1616-de-2013/","title":"[Página web] Ley 1616 de 2013 – por medio de la cual se expide la ley de Salud Mental (texto con modificaciones, incl. Ley 2460 de 2025)","description":"DMS Jurídica (compilación normativa) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ncbi.nlm.nih.gov/sites/books/NBK538182/","title":"[Página web] Antidepressants – StatPearls (act. 2026)","description":"NCBI Bookshelf – StatPearls (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Monoaminas: serotonina, noradrenalina y dopamina', 'Clase 2 · Neurobiología de los trastornos mentales', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe síntesis, receptores y vías de las monoaminas y su relación con la depresión, la psicosis y el TDAH, incluyendo los límites de la hipótesis monoaminérgica.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.ncbi.nlm.nih.gov/sites/books/NBK538182/","title":"[Página web] Antidepressants – StatPearls (act. 2026)","description":"NCBI Bookshelf – StatPearls (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.msdmanuals.com/es/professional/trastornos-psiquiátricos/trastornos-del-estado-de-ánimo/tratamiento-farmacológico-de-la-depresión","title":"[Página web] Tratamiento farmacológico de la depresión – Manual MSD versión para profesionales (rev. 2026)","description":"Manual MSD (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Glutamato y GABA: el equilibrio excitación-inhibición', 'Clase 2 · Neurobiología de los trastornos mentales', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el papel del receptor GABA-A y del sistema glutamatérgico (NMDA) como base de ansiolíticos, hipnóticos y de la esketamina.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.lecturio.com/es/concepts/benzodiacepinas/","title":"[Página web] Benzodiacepinas – biblioteca de conceptos médicos","description":"Lecturio (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ncbi.nlm.nih.gov/sites/books/NBK538182/","title":"[Página web] Antidepressants – StatPearls (act. 2026)","description":"NCBI Bookshelf – StatPearls (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Ley 1616 de 2013 de salud mental y sus modificaciones', 'Clase 3 · Marco normativo colombiano', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume derechos de las personas con trastornos mentales, acceso a medicamentos y la red integral de servicios; incluye las modificaciones recientes (Ley 2460 de 2025).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.dmsjuridica.com/buscador_20179478954/legislacion/leyes/2020/11/24/ley-1616-de-2013/","title":"[Página web] Ley 1616 de 2013 – por medio de la cual se expide la ley de Salud Mental (texto con modificaciones, incl. Ley 2460 de 2025)","description":"DMS Jurídica (compilación normativa) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.supersalud.gov.co/compilacion/docs/concepto_minsaludps_0954281_2022.htm","title":"[Página web] Concepto MinSalud 954281 de 2022 – vigencia e implementación de la Ley 1616 de 2013","description":"Normograma Superintendencia Nacional de Salud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Medicamentos de control especial y monopolio del Estado', 'Clase 3 · Marco normativo colombiano', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el rol del FNE y los FRE, la Resolución 1478 de 2006 y las obligaciones del QF en la dispensación de benzodiacepinas, fármacos Z y metilfenidato.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: describir cómo se regulan en Colombia los psicofármacos sometidos a fiscalización (benzodiacepinas, fármacos Z, metilfenidato, algunos anticonvulsivantes y opioides usados en adicciones) y cuál es el papel del químico farmacéutico (QF) en su gestión.</p><p>Desarrollo. Colombia aplica las convenciones internacionales de fiscalización (Convención Única de 1961 y Convenio sobre Sustancias Sicotrópicas de 1971) a través del Ministerio de Salud y Protección Social, el Fondo Nacional de Estupefacientes (FNE) y los Fondos Rotatorios de Estupefacientes (FRE) de cada departamento. La norma marco para el manejo de sustancias y medicamentos de control especial es la Resolución 1478 de 2006 y sus modificaciones, que define dos grandes grupos: (1) medicamentos de control especial, que puede producir o importar la industria bajo vigilancia, y (2) medicamentos monopolio del Estado, cuya importación y distribución hace directamente el FNE (ej. algunos opioides y, según el listado vigente, metilfenidato). Las benzodiacepinas (alprazolam, clonazepam, lorazepam, midazolam, diazepam) y los hipnóticos Z (zolpidem, zopiclona) están en el grupo de control especial.</p><p>Para el QF esto implica: inscripción del establecimiento ante el FRE; adquisición solo a proveedores autorizados; almacenamiento con seguridad diferenciada; dispensación únicamente con prescripción que cumpla los requisitos de ley (datos completos del paciente y prescriptor, nombre genérico, concentración, forma farmacéutica, cantidad en números y letras, duración, y recetario oficial cuando el listado lo exija); registro en el libro oficial o sistema autorizado; informes periódicos al FRE; y gestión de pérdidas, vencimientos y destrucción con acta. El listado de medicamentos y los formatos cambian por actos administrativos, por lo que siempre debe verificarse la versión vigente publicada por el FNE/MinSalud antes de capacitar o auditar.</p><p>Ejemplo aplicado. Un servicio farmacéutico de una IPS de Medellín recibe una fórmula de clonazepam en gotas sin cantidad en letras ni tiempo de tratamiento. El QF no dispensa, contacta al prescriptor, documenta la novedad y orienta al paciente para evitar un retiro abrupto si ya venía en tratamiento. Además, revisa en el sistema si el paciente recibió el mismo medicamento en otra sede en los últimos días (posible duplicidad) y alerta al comité de farmacia si detecta patrones de sobreprescripción.</p><p>Puntos clave:<br>1. Benzodiacepinas y fármacos Z son de control especial; algunos psicofármacos (según listado vigente) son monopolio del Estado distribuidos por el FNE/FRE.<br>2. La dispensación exige verificar requisitos formales de la prescripción, registro y reporte; las fallas deben resolverse con el prescriptor, no con el paciente.<br>3. El QF es responsable de la custodia, trazabilidad y detección de uso inadecuado o desvío; verificar siempre la normativa vigente del FNE.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: seguimiento farmacoterapéutico en salud mental', 'Clase 4 · Caso integrador de la unidad', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica el SFT a una paciente con depresión, ansiedad y uso prolongado de alprazolam con duplicidad de prescriptores.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar el seguimiento farmacoterapéutico (SFT) a un paciente con trastorno mental, integrando el marco de la Ley 1616 de 2013 y la normativa de control especial.</p><p>Caso. Mujer de 34 años, Bogotá, diagnóstico de trastorno depresivo recurrente y trastorno de ansiedad generalizada. Tratamiento: sertralina 100 mg/día desde hace 8 meses y alprazolam 0,5 mg cada 8 horas desde hace 6 meses \"mientras hace efecto la sertralina\". Acude al servicio farmacéutico con una fórmula de alprazolam de una segunda IPS y refiere que \"si no lo toma, siente que se le acelera el corazón y no puede dormir\". No asiste a psicoterapia por barreras de agenda.</p><p>Análisis del QF. (1) Necesidad: la sertralina es una opción de primera línea en la GPC de depresión de MinSalud; el alprazolam se justificaba como puente de corta duración, pero 6 meses de uso continuo exceden lo recomendado y ya hay señales de dependencia fisiológica (síntomas interdosis). (2) Seguridad: dos prescriptores para el mismo medicamento de control especial sugieren riesgo de duplicidad; alprazolam de vida media corta favorece rebote y síntomas de abstinencia. (3) Efectividad: no hay escala de seguimiento (PHQ-9, GAD-7) documentada. (4) Derechos: la Ley 1616 reconoce el derecho a recibir los medicamentos necesarios y a tratamientos basados en evidencia, y a la atención integral, lo que incluye psicoterapia.</p><p>Intervención. No suspender la benzodiacepina abruptamente; dispensar solo la fórmula válida y comunicar por escrito al médico tratante la duplicidad, proponiendo (a) consolidar un solo prescriptor, (b) evaluar optimización del ISRS, y (c) plan de desprescripción gradual de alprazolam, considerando cambio a una benzodiacepina de vida media más larga si el médico lo considera. Educar a la paciente sobre síntomas de retiro, no combinar con alcohol, y riesgo al conducir. Registrar el problema relacionado con medicamentos (PRM) y el resultado negativo asociado (RNM), y programar seguimiento en 2–4 semanas. Si la paciente expresara ideación suicida, activar la ruta de atención en salud mental de la institución de inmediato.</p><p>Puntos clave:<br>1. El SFT en salud mental integra necesidad, efectividad, seguridad y adherencia, con escalas validadas.<br>2. La duplicidad de prescriptores en medicamentos de control especial es un PRM que el QF debe documentar y comunicar.<br>3. La Ley 1616/2013 respalda la atención integral; el QF promueve la articulación con psicoterapia y la red de servicios.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Antidepresivos', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: depresión y abordaje farmacológico', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la epidemiología, el diagnóstico y los objetivos del tratamiento de la depresión según la GPC No. 22 de MinSalud.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://medicosgeneralescolombianos.com/Guias_2013/gpc_22prof_sal_depre_compressed.pdf","title":"GPC No. 22 – Detección temprana y diagnóstico del episodio depresivo y trastorno depresivo recurrente en adultos (versión profesionales, 2013)","description":"MinSalud / Colciencias – alianza CINETS (copia alojada por Médicos Generales Colombianos) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/INEC/IETS/GPC_Ptes_Depre%20(1).pdf","title":"GPC Detección temprana y diagnóstico de depresión en adultos – versión para pacientes y familiares (2013)","description":"Ministerio de Salud y Protección Social / IETS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'ISRS e IRSN', 'Clase 2 · Grupos de antidepresivos', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara mecanismo, farmacocinética, perfil de efectos adversos e interacciones por CYP de fluoxetina, sertralina, paroxetina, escitalopram, venlafaxina y duloxetina.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.msdmanuals.com/es/professional/trastornos-psiquiátricos/trastornos-del-estado-de-ánimo/tratamiento-farmacológico-de-la-depresión","title":"[Página web] Tratamiento farmacológico de la depresión – Manual MSD versión para profesionales (rev. 2026)","description":"Manual MSD (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ncbi.nlm.nih.gov/sites/books/NBK538182/","title":"[Página web] Antidepressants – StatPearls (act. 2026)","description":"NCBI Bookshelf – StatPearls (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Tricíclicos e IMAO', 'Clase 2 · Grupos de antidepresivos', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la farmacología de los antidepresivos tricíclicos e IMAO, su toxicidad en sobredosis, el efecto quinidínico y las restricciones dietarias (tiramina).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.ncbi.nlm.nih.gov/sites/books/NBK557791/","title":"[Página web] Tricyclic Antidepressants – StatPearls (act. 2023)","description":"NCBI Bookshelf – StatPearls (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ncbi.nlm.nih.gov/sites/books/NBK539848/","title":"[Página web] Monoamine Oxidase Inhibitors (MAOIs) – StatPearls (act. 2025)","description":"NCBI Bookshelf – StatPearls (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Bupropión, mirtazapina, vortioxetina y esketamina', 'Clase 2 · Grupos de antidepresivos', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara mecanismos y nichos clínicos de los antidepresivos atípicos y de la esketamina intranasal en depresión resistente, incluyendo sus requisitos de administración supervisada.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.msdmanuals.com/es/professional/trastornos-psiquiátricos/trastornos-del-estado-de-ánimo/tratamiento-farmacológico-de-la-depresión","title":"[Página web] Tratamiento farmacológico de la depresión – Manual MSD versión para profesionales (rev. 2026)","description":"Manual MSD (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ncbi.nlm.nih.gov/sites/books/NBK538182/","title":"[Página web] Antidepressants – StatPearls (act. 2026)","description":"NCBI Bookshelf – StatPearls (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Síndrome serotoninérgico', 'Clase 3 · Seguridad de los antidepresivos', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el mecanismo, los criterios de Hunter, los fármacos implicados y el manejo de la toxicidad serotoninérgica.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.ncbi.nlm.nih.gov/sites/books/NBK482377/","title":"[Página web] Serotonin Syndrome – StatPearls (act. 2024)","description":"NCBI Bookshelf – StatPearls (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.intramed.net/content/sindrome-serotoninergico-1","title":"[Página web] Síndrome serotoninérgico (resumen de Buckley et al., BMJ 2014)","description":"IntraMed (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Síndrome de discontinuación y advertencia de riesgo suicida en jóvenes', 'Clase 3 · Seguridad de los antidepresivos', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los síntomas de discontinuación y la reducción gradual, y explica de forma factual la advertencia regulatoria sobre pensamientos y conductas suicidas en niños, adolescentes y adultos jóvenes al iniciar antidepresivos, junto con la vigilancia y la ruta de atención.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.msdmanuals.com/es/professional/trastornos-psiquiátricos/trastornos-del-estado-de-ánimo/tratamiento-farmacológico-de-la-depresión","title":"[Página web] Tratamiento farmacológico de la depresión – Manual MSD versión para profesionales (rev. 2026)","description":"Manual MSD (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ncbi.nlm.nih.gov/sites/books/NBK538182/","title":"[Página web] Antidepressants – StatPearls (act. 2026)","description":"NCBI Bookshelf – StatPearls (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'GPC de depresión de MinSalud: selección del antidepresivo', 'Clase 4 · Guía colombiana y caso clínico', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica las recomendaciones de la GPC (primera línea fluoxetina, sertralina, amitriptilina o mirtazapina; consideraciones en adulto mayor; líneas sucesivas) a la práctica del servicio farmacéutico.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://medicosgeneralescolombianos.com/Guias_2013/gpc_22prof_sal_depre_compressed.pdf","title":"GPC No. 22 – Detección temprana y diagnóstico del episodio depresivo y trastorno depresivo recurrente en adultos (versión profesionales, 2013)","description":"MinSalud / Colciencias – alianza CINETS (copia alojada por Médicos Generales Colombianos) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/INEC/IETS/GPC_Ptes_Depre%20(1).pdf","title":"GPC Detección temprana y diagnóstico de depresión en adultos – versión para pacientes y familiares (2013)","description":"Ministerio de Salud y Protección Social / IETS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: síndrome serotoninérgico por interacción', 'Clase 4 · Guía colombiana y caso clínico', 7, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la identificación y la intervención del QF en un paciente con fluoxetina, tramadol, metoclopramida e hipérico.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: identificar un síndrome serotoninérgico por interacción y definir la intervención del QF.</p><p>Caso. Hombre de 58 años, Cali, con depresión mayor tratada con fluoxetina 40 mg/día. Tras una cirugía de rodilla recibe en la formulación de egreso tramadol 50 mg cada 8 horas y, por náuseas, metoclopramida. Al tercer día consulta a urgencias con agitación, diaforesis, temblor, diarrea, temperatura de 38,4 °C, taquicardia y clonus inducible en tobillos. Además, toma por cuenta propia un suplemento de hierba de San Juan \"para el ánimo\".</p><p>Análisis. Los criterios de Hunter (clonus inducible o espontáneo, clonus ocular, agitación, diaforesis, temblor, hiperreflexia, hipertermia con hipertonía) en un paciente expuesto a agentes serotoninérgicos son compatibles con toxicidad serotoninérgica. La fluoxetina es ISRS e inhibidor potente de CYP2D6: reduce la conversión de tramadol a su metabolito opioide (menos analgesia) y aumenta la exposición al tramadol original, que también inhibe la recaptación de serotonina. La hierba de San Juan suma efecto serotoninérgico e induce enzimas, y la GPC colombiana no recomienda el hipérico. La metoclopramida se ha asociado a casos de toxicidad serotoninérgica y a efectos extrapiramidales. La larga vida media de fluoxetina y norfluoxetina mantiene el riesgo varias semanas después de suspenderla.</p><p>Intervención del QF. En urgencias: apoyar la suspensión de todos los agentes serotoninérgicos, recomendar medidas de soporte y control de la agitación con benzodiacepina según protocolo; ciproheptadina puede considerarse en casos moderados según criterio médico; los casos graves con hipertermia requieren manejo en cuidado intensivo. Evitar antipiréticos como pilar (la hipertermia es muscular). Al egreso: proponer analgesia sin efecto serotoninérgico (paracetamol, AINE si no hay contraindicación, u opioide sin acción serotoninérgica relevante según criterio médico), educar sobre no automedicarse con productos naturales y registrar la interacción. Reportar el evento adverso al programa de farmacovigilancia institucional y al INVIMA (reporte de eventos adversos a medicamentos). Implementar una alerta en el sistema de dispensación para combinaciones ISRS/IRSN + tramadol, linezolid, triptanes, IMAO, dextrometorfano.</p><p>Puntos clave:<br>1. Los criterios de Hunter y la historia farmacológica completa (incluyendo productos naturales) orientan el diagnóstico.<br>2. Las interacciones farmacodinámicas y por CYP2D6 de ISRS con tramadol son prevenibles desde la dispensación.<br>3. Todo caso debe notificarse a farmacovigilancia (INVIMA) y generar una barrera de seguridad en el sistema.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Ansiolíticos e hipnóticos', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: ansiedad, insomnio y uso racional', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume los trastornos de ansiedad e insomnio, el lugar de los ansiolíticos/hipnóticos y el problema de su uso prolongado.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://psiquiatria.com/tratamientos/guia-practica-para-el-uso-de-ansioliticos-hipnoticos","title":"[Página web] Guía práctica para el uso de ansiolíticos/hipnóticos (Interpsiquis 2025)","description":"Psiquiatria.com (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Benzodiacepinas: mecanismo y farmacocinética', 'Clase 2 · Farmacología de ansiolíticos e hipnóticos', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la modulación del receptor GABA-A, las diferencias de vida media y potencia, y el uso de flumazenil.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.lecturio.com/es/concepts/benzodiacepinas/","title":"[Página web] Benzodiacepinas – biblioteca de conceptos médicos","description":"Lecturio (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.salusplay.com/apuntes/apuntes-de-farmacologia/farmacos-hipnoticos-y-sedantes","title":"[Página web] Fármacos hipnóticos y sedantes – apuntes de farmacología","description":"SalusPlay (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Dependencia, abstinencia y desprescripción de benzodiacepinas', 'Clase 2 · Farmacología de ansiolíticos e hipnóticos', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los mecanismos de tolerancia y abstinencia y los principios de la reducción gradual.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: interpretar los mecanismos de tolerancia, dependencia y abstinencia por benzodiacepinas y aplicar principios de desprescripción.</p><p>Desarrollo. Las benzodiacepinas son moduladores alostéricos positivos del receptor GABA-A: aumentan la frecuencia de apertura del canal de cloro en presencia de GABA. Con el uso continuo (semanas) se producen adaptaciones del receptor (cambios en la composición de subunidades y desacoplamiento del sitio benzodiacepínico) y aumento compensatorio del tono glutamatérgico. Esto explica la tolerancia al efecto hipnótico y sedante (rápida) y, en menor medida, al ansiolítico, y la aparición de dependencia fisiológica incluso a dosis terapéuticas. Al reducir o suspender bruscamente aparecen: rebote (reaparición intensificada de los síntomas originales), síndrome de abstinencia (ansiedad, insomnio, irritabilidad, temblor, hiperacusia, despersonalización, y en casos graves convulsiones y delirium) y recurrencia del trastorno de base. El riesgo es mayor con fármacos de vida media corta y alta potencia (alprazolam, lorazepam, triazolam), dosis altas y uso prolongado.</p><p>Otros riesgos: deterioro cognitivo, caídas y fracturas en adultos mayores, accidentes de tránsito, depresión respiratoria al combinarse con opioides, alcohol u otros depresores (advertencia de seguridad de varias agencias), y uso no médico. Por ello las guías recomiendan para ansiedad e insomnio tratamientos breves (generalmente 2–4 semanas) y priorizar ISRS/IRSN y terapia cognitivo-conductual.</p><p>Desprescripción. Principios generales: decisión compartida con el paciente; reducción gradual (por ejemplo, disminuciones de aproximadamente 10–25 % de la dosis cada 2–4 semanas, ajustando según tolerancia; los usuarios de largo plazo pueden requerir meses); en algunos casos cambiar a una benzodiacepina de vida media larga equivalente antes de reducir; tratar el trastorno de base; apoyo con TCC para insomnio. Las tablas de equivalencia son aproximadas y deben usarse con criterio clínico.</p><p>Ejemplo colombiano. En un programa de atención farmacéutica de una EPS en Barranquilla, el QF identifica en los registros de dispensación 120 adultos mayores con clonazepam por más de un año. Con el médico de familia diseña un protocolo de desprescripción con folleto educativo, calendario de reducción y llamadas de seguimiento, y mide caídas y consultas por insomnio a 6 meses.</p><p>Puntos clave:<br>1. Tolerancia y dependencia son adaptaciones esperables del receptor GABA-A; la abstinencia puede ser grave (convulsiones).<br>2. Nunca suspender bruscamente tras uso prolongado; reducción gradual individualizada.<br>3. Evitar la combinación con opioides, alcohol y otros depresores del SNC.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Fármacos Z y buspirona', 'Clase 2 · Farmacología de ansiolíticos e hipnóticos', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara zolpidem, zopiclona y buspirona con las benzodiacepinas en mecanismo, indicación y riesgos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: comparar los hipnóticos Z y la buspirona con las benzodiacepinas en mecanismo, indicaciones y seguridad.</p><p>Fármacos Z (zolpidem, zopiclona, eszopiclona; zaleplón no está disponible en todos los mercados). Mecanismo: también son moduladores positivos del receptor GABA-A, pero con mayor selectividad por subunidades α1 (zolpidem), lo que explica su predominio hipnótico con menor efecto ansiolítico, miorrelajante y anticonvulsivante. Farmacocinética: absorción rápida y vida media corta (zolpidem ≈ 2–3 h; zopiclona ≈ 5 h; mayor en adultos mayores y en insuficiencia hepática). Indicación: insomnio de corta duración, idealmente pocas semanas, junto a higiene del sueño y TCC para insomnio. Seguridad: no son \"benzodiacepinas seguras\": producen tolerancia, dependencia, insomnio de rebote, somnolencia residual y deterioro psicomotor al día siguiente (las agencias regulatorias redujeron la dosis recomendada de zolpidem en mujeres por niveles matutinos elevados) y conductas complejas del sueño (sonambulismo, conducir o cocinar dormido), motivo de advertencia de recuadro de la FDA desde 2019; ante un episodio debe suspenderse. Interacciones: alcohol, opioides y otros depresores; inhibidores de CYP3A4 aumentan su exposición. En Colombia son medicamentos de control especial. Para adultos mayores los criterios de Beers los incluyen entre los fármacos a evitar.</p><p>Buspirona. Agonista parcial 5-HT1A, sin acción sobre GABA-A: no produce sedación importante, dependencia ni potenciación con alcohol, y no protege del síndrome de abstinencia a benzodiacepinas. Su efecto ansiolítico tarda 2–4 semanas, por lo que no sirve \"a demanda\". Indicación: trastorno de ansiedad generalizada, a veces como potenciador. Efectos adversos: mareo, náuseas, cefalea. Interacciones: metabolismo por CYP3A4 (evitar inhibidores potentes y jugo de toronja); no combinar con IMAO. Verificar disponibilidad en el mercado colombiano y registro INVIMA vigente.</p><p>Ejemplo. Un paciente de 45 años en Pereira con TAG lleva 3 meses con zolpidem para dormir y pide más cantidad porque \"ya no le hace\". El QF identifica tolerancia, revisa consumo de alcohol, educa sobre higiene del sueño, comunica al médico la pérdida de eficacia y sugiere evaluar tratamiento del TAG de base (ISRS/IRSN, o buspirona según criterio) con desmonte progresivo del hipnótico.</p><p>Puntos clave:<br>1. Los fármacos Z comparten riesgos de dependencia y deterioro psicomotor; además pueden causar conductas complejas del sueño.<br>2. La buspirona no es sedante ni genera dependencia, pero su efecto es diferido y no reemplaza la desprescripción gradual de benzodiacepinas.<br>3. En adultos mayores, benzodiacepinas y fármacos Z se consideran potencialmente inapropiados.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: adulto mayor con caídas y polifarmacia sedante', 'Clase 3 · Caso clínico', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta una revisión de medicación y un plan de desprescripción en una paciente de 79 años con benzodiacepina, fármaco Z y anticolinérgicos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: ejecutar una intervención farmacéutica en un adulto mayor con caídas asociadas a psicofármacos.</p><p>Caso. Mujer de 79 años, Tunja, con hipertensión, artrosis, insomnio crónico y síntomas ansiosos. Medicamentos: losartán 50 mg/día, hidroclorotiazida 25 mg/día, lorazepam 1 mg en la noche (hace 3 años), zolpidem 10 mg en la noche (agregado hace 2 meses por otro médico), amitriptilina 25 mg en la noche \"para el dolor\", y difenhidramina de venta libre ocasional. En el último mes ha tenido dos caídas nocturnas, una con contusión en cadera. Refiere boca seca, estreñimiento y \"olvidos\".</p><p>Análisis. (1) Carga sedante y anticolinérgica alta: lorazepam + zolpidem (duplicidad GABAérgica), amitriptilina y difenhidramina (fuertemente anticolinérgicos). (2) Los criterios de Beers (AGS 2023) y STOPP/START versión 3 señalan benzodiacepinas, fármacos Z, antidepresivos tricíclicos terciarios y antihistamínicos de primera generación como potencialmente inapropiados en adultos mayores, especialmente con historia de caídas o deterioro cognitivo. (3) Hidroclorotiazida y losartán pueden contribuir con hipotensión ortostática y alteraciones del sodio. (4) El insomnio y la ansiedad de base no han sido evaluados con escalas.</p><p>Intervención del QF. Elaborar un informe al médico tratante priorizando: suspender difenhidramina (educación a la paciente y a la familia); retirar el zolpidem (duplicidad); plan de reducción gradual del lorazepam en semanas a meses; sustituir amitriptilina por una alternativa con menor carga anticolinérgica para el dolor, según criterio médico; medir presión arterial en decúbito y de pie, y solicitar sodio sérico. Proponer TCC para insomnio y medidas no farmacológicas (higiene del sueño, iluminación nocturna, retiro de tapetes). Realizar conciliación de medicamentos con todas las fórmulas, unificar prescriptor y registrar los PRM. Seguimiento a las 2 y 6 semanas para verificar síntomas de retiro y nuevas caídas.</p><p>Puntos clave:<br>1. Las caídas en el adulto mayor deben activar una revisión de psicofármacos y fármacos anticolinérgicos.<br>2. Beers y STOPP/START son herramientas de apoyo, no sustituyen el juicio clínico ni la decisión compartida.<br>3. La desprescripción se hace por pasos, priorizando el fármaco de mayor riesgo y con seguimiento estrecho.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Antipsicóticos y estabilizadores del ánimo', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: esquizofrenia, trastorno bipolar y la GPC colombiana', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume el abordaje de la esquizofrenia y del trastorno bipolar y presenta la GPC No. 29 de MinSalud.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.redalyc.org/pdf/806/80650066001.pdf","title":"GPC para el diagnóstico, tratamiento e inicio de la rehabilitación psicosocial de los adultos con esquizofrenia: ''hacer bien las cosas que hacen bien'' (Rev Colomb Psiquiatr 2014)","description":"Revista Colombiana de Psiquiatría – Redalyc (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.quindio.gov.co/home/docs/items/item_196/GPC_Esquizofrenia_Pacientes.pdf","title":"GPC No. 29 – Diagnóstico, tratamiento e inicio de la rehabilitación psicosocial de adultos con esquizofrenia – versión pacientes y cuidadores (2014)","description":"MinSalud (copia alojada por Gobernación del Quindío) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Antipsicóticos típicos y atípicos', 'Clase 2 · Antipsicóticos', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara el bloqueo D2, el antagonismo 5-HT2A y el agonismo parcial (aripiprazol) y sus implicaciones en eficacia y efectos adversos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://gpnotebook.com/es/pages/psiquiatria/comparacion-de-antipsicoticos-tipicos-primera-generacion-y-atipicos-segunda-generacion","title":"[Página web] Comparación de antipsicóticos típicos (primera generación) y atípicos (segunda generación)","description":"GPnotebook (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.osmosis.org/learn/es/Atypical_antipsychotics","title":"[Página web] Antipsicóticos atípicos (video con transcripción en español)","description":"Osmosis (Elsevier) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Síntomas extrapiramidales y síndrome neuroléptico maligno', 'Clase 2 · Antipsicóticos', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta distonía, acatisia, parkinsonismo, discinesia tardía y SNM, con su manejo según la GPC colombiana.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.ncbi.nlm.nih.gov/sites/books/NBK534115/","title":"[Página web] Extrapyramidal Side Effects – StatPearls (act. 2025)","description":"NCBI Bookshelf – StatPearls (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://encolombia.com/medicina/guiasmed/adultos-esquizofrenia/diagnostico-de-esquizofrenia/","title":"[Página web] GPC esquizofrenia: Tratamiento de los efectos adversos agudos más frecuentes por el uso de antipsicóticos","description":"encolombia.com (reproducción de la GPC MinSalud) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.merckmanuals.com/es-us/professional/lesiones-y-envenenamientos/enfermedades-por-calor/s%C3%ADndrome-neurol%C3%A9ptico-maligno","title":"[Página web] Síndrome neuroléptico maligno – Manual Merck versión para profesionales (rev. 2025)","description":"Manual Merck (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Síndrome metabólico, QT y clozapina con monitorización de neutrófilos', 'Clase 2 · Antipsicóticos', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica el seguimiento metabólico, la vigilancia del QT y el protocolo de seguridad de la clozapina.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.redalyc.org/pdf/806/80643083005.pdf","title":"Evaluación y seguimiento metabólico del paciente con diagnóstico de esquizofrenia (Rev Colomb Psiquiatr 2015)","description":"Revista Colombiana de Psiquiatría – Redalyc (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://sanidad.castillalamancha.es/sites/sescam.castillalamancha.es/files/documentos/farmacia/efectosadversosantipsicoticosatipicos.pdf","title":"Efectos adversos asociados al tratamiento con antipsicóticos atípicos (Boletín Farmacoterapéutico de Castilla-La Mancha, 2004)","description":"SESCAM – Área de Farmacia (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.ncbi.nlm.nih.gov/sites/books/NBK482282/","title":"[Página web] Neuroleptic Malignant Syndrome – StatPearls (act. 2023)","description":"NCBI Bookshelf – StatPearls (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Tratamiento de mantenimiento, antipsicóticos de depósito e interacciones', 'Clase 2 · Antipsicóticos', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las recomendaciones de mantenimiento de la GPC, los antipsicóticos inyectables de acción prolongada y las interacciones relevantes.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.redalyc.org/pdf/806/80650066004.pdf","title":"Tratamiento con antipsicóticos de mantenimiento del paciente adulto con diagnóstico de esquizofrenia (Rev Colomb Psiquiatr 2014)","description":"Revista Colombiana de Psiquiatría – Redalyc (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.redalyc.org/pdf/806/80650066006.pdf","title":"Tratamiento farmacológico del paciente adulto con esquizofrenia que presenta conducta violenta o agitación (Rev Colomb Psiquiatr 2014)","description":"Revista Colombiana de Psiquiatría – Redalyc (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://ciencialatina.org/index.php/cienciala/article/view/6722","title":"[Página web] Interacciones medicamentosas de los fármacos antipsicóticos (Ciencia Latina, 2023)","description":"Ciencia Latina Revista Científica Multidisciplinar (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Litio: farmacología y niveles séricos', 'Clase 3 · Estabilizadores del ánimo', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe mecanismo, farmacocinética renal, rango terapéutico, toxicidad y monitorización del litio.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.salusplay.com/apuntes/apuntes-de-farmacologia/farmacos-contra-las-psicosis-y-las-manias/3","title":"[Página web] Fármacos contra las psicosis y las manías – 3. Estabilizadores del estado del ánimo","description":"SalusPlay (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://psiquiatria.com/tratamientos/guia-practica-para-el-uso-de-estabilizadores-del-animo","title":"[Página web] Guía práctica para el uso de estabilizadores del ánimo (Interpsiquis 2025)","description":"Psiquiatria.com (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Valproato y lamotrigina', 'Clase 3 · Estabilizadores del ánimo', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara indicaciones, seguridad, teratogenicidad e interacciones de valproato y lamotrigina.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: comparar valproato y lamotrigina como estabilizadores del ánimo, con énfasis en seguridad, interacciones y monitorización.</p><p>Valproato (ácido valproico/divalproato). Mecanismo multimodal: aumento de la disponibilidad de GABA, bloqueo de canales de sodio y calcio tipo T, y efectos sobre vías de señalización intracelular. Indicaciones en psiquiatría: manía aguda y mantenimiento del trastorno bipolar, especialmente con episodios mixtos o ciclación rápida. Farmacocinética: alta unión a proteínas (saturable), metabolismo hepático (glucuronidación y beta-oxidación), es inhibidor enzimático. Se monitorizan niveles séricos (el rango de referencia lo define la guía/laboratorio), pruebas hepáticas, hemograma con plaquetas, peso y perfil metabólico; amonio si hay somnolencia o confusión. Adversos: náuseas, temblor, aumento de peso, alopecia, trombocitopenia, hepatotoxicidad (mayor en niños pequeños y enfermedad mitocondrial), pancreatitis, hiperamonemia, síndrome de ovario poliquístico. Teratogenicidad: malformaciones congénitas (defectos del tubo neural, entre otras) y trastornos del neurodesarrollo; las agencias europeas exigen un programa de prevención del embarazo y no usarlo en mujeres con capacidad gestacional salvo que no haya alternativa, y en 2024 la EMA introdujo precauciones sobre un posible riesgo en hijos de varones tratados en los meses previos a la concepción. Interacciones: aumenta niveles de lamotrigina; carbapenémicos reducen drásticamente sus niveles (combinación a evitar).</p><p>Lamotrigina. Bloquea canales de sodio voltaje-dependientes y reduce la liberación de glutamato. Su principal utilidad es la prevención de episodios depresivos en el trastorno bipolar; no es eficaz para la manía aguda. Efectos adversos: exantema, y en raros casos síndrome de Stevens-Johnson/necrólisis epidérmica tóxica, con mayor riesgo si se escala rápido, en niños y si se combina con valproato. Por eso la titulación es lenta (varias semanas) y la dosis se reduce aproximadamente a la mitad con valproato y se incrementa con inductores (carbamazepina, fenitoína). Los anticonceptivos con estrógenos disminuyen sus niveles. Si se suspende más de unos días, debe reiniciarse la titulación. Otros: mareo, diplopía, cefalea; advertencia sobre posibles alteraciones de la conducción cardiaca en pacientes con cardiopatía estructural.</p><p>Ejemplo colombiano. En un servicio farmacéutico de Bucaramanga llega una mujer de 24 años con prescripción de ácido valproico para trastorno bipolar. El QF verifica uso de anticoncepción eficaz, entrega información escrita sobre riesgos en el embarazo y sugiere al psiquiatra documentar la valoración de alternativas; reporta al programa de farmacovigilancia cualquier embarazo expuesto.</p><p>Puntos clave:<br>1. Valproato: eficaz en manía, pero hepatotóxico, teratogénico e inhibidor enzimático; requiere monitorización clínica y de laboratorio.<br>2. Lamotrigina: útil en prevención de depresión bipolar; la titulación lenta es la principal medida de seguridad frente al exantema grave.<br>3. La interacción valproato–lamotrigina obliga a ajustar la titulación; verificar siempre la ficha técnica INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: intoxicación por litio por interacciones', 'Clase 4 · Caso clínico', 7, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la detección y la intervención del QF en un paciente con litio que inicia IECA, tiazida y AINE.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: detectar y prevenir la intoxicación por litio mediante el seguimiento de niveles séricos e interacciones.</p><p>Caso. Hombre de 66 años, Manizales, con trastorno bipolar tipo I estable desde hace 10 años con carbonato de litio 300 mg cada 8 horas (litemia de mantenimiento en rango hace 4 meses). Recientemente su médico general le inició enalapril por hipertensión e hidroclorotiazida, y en la última semana se automedicó con ibuprofeno 400 mg cada 6 horas por dolor lumbar. Tuvo además un cuadro de diarrea con baja ingesta de líquidos. Consulta por temblor grueso, náuseas, marcha inestable, disartria y confusión.</p><p>Análisis. El litio tiene un margen terapéutico estrecho, no se metaboliza y se elimina por vía renal; su reabsorción tubular se acompaña de la del sodio. Las tiazidas, los IECA/ARA-II y los AINE reducen su depuración y elevan la litemia; la deshidratación y la hiponatremia potencian el efecto. Los síntomas (temblor grueso, ataxia, disartria, confusión, síntomas gastrointestinales) son compatibles con toxicidad. En el adulto mayor la función renal disminuida aumenta el riesgo; además, el litio a largo plazo se asocia a hipotiroidismo, diabetes insípida nefrogénica, enfermedad renal crónica e hiperparatiroidismo.</p><p>Intervención del QF. En urgencias: apoyar la solicitud de litemia (muestra unas 12 horas tras la última dosis cuando se monitoriza el estado estable; en intoxicación, mediciones seriadas), electrolitos, creatinina, TSH y ECG; suspender litio, AINE, IECA y tiazida según criterio médico; los casos graves pueden requerir hemodiálisis. Tras la estabilización: proponer antihipertensivo con menor interacción (por ejemplo, calcioantagonista, según criterio médico), analgesia con paracetamol, educación sobre hidratación, signos de alarma y evitar automedicación con AINE; establecer un calendario de litemia, creatinina/TFG, calcio y TSH, y alertas en el sistema de dispensación. Reportar el evento a farmacovigilancia (INVIMA).</p><p>Puntos clave:<br>1. Litio: estrecho margen terapéutico; toda nueva prescripción de tiazida, IECA/ARA-II o AINE requiere control de litemia.<br>2. Deshidratación, diarrea, fiebre y dietas hiposódicas elevan la litemia; la educación al paciente es una intervención clave.<br>3. El seguimiento incluye litemia, función renal, tiroidea y calcio de forma periódica.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. TDAH, adicciones, poblaciones especiales y casos integradores', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: grupos de riesgo y prioridades en salud mental', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume las prioridades de la política de salud mental (niños, adolescentes y jóvenes) y los retos del uso de psicofármacos en poblaciones especiales.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.dmsjuridica.com/buscador_20179478954/legislacion/leyes/2020/11/24/ley-1616-de-2013/","title":"[Página web] Ley 1616 de 2013 – por medio de la cual se expide la ley de Salud Mental (texto con modificaciones, incl. Ley 2460 de 2025)","description":"DMS Jurídica (compilación normativa) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.redalyc.org/pdf/806/80646794002.pdf","title":"Implementación de la guía de práctica clínica para el manejo de adultos con esquizofrenia en Colombia (Rev Colomb Psiquiatr 2016)","description":"Revista Colombiana de Psiquiatría – Redalyc (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'TDAH: metilfenidato y atomoxetina', 'Clase 2 · TDAH y adicciones', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la farmacología, seguridad y requisitos de control de metilfenidato y atomoxetina.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: describir la farmacología de metilfenidato y atomoxetina en el TDAH y las responsabilidades del QF.</p><p>Desarrollo. El trastorno por déficit de atención e hiperactividad (TDAH) se asocia a una disfunción de las vías dopaminérgicas y noradrenérgicas frontoestriatales. El tratamiento combina intervenciones psicosociales y educativas con farmacoterapia cuando el impacto funcional lo justifica.</p><p>Metilfenidato. Psicoestimulante que bloquea los transportadores de dopamina (DAT) y noradrenalina (NET), aumentando su concentración sináptica en la corteza prefrontal y el estriado. Existen formulaciones de liberación inmediata (efecto de 3–4 h) y prolongada (sistemas osmóticos o de liberación modificada, 8–12 h), que mejoran la adherencia y reducen el potencial de mal uso. Efectos adversos: disminución del apetito, insomnio, cefalea, dolor abdominal, aumento de frecuencia cardiaca y presión arterial, posible enlentecimiento del crecimiento (vigilar talla y peso), tics y, raramente, síntomas psicóticos o maníacos. Contraindicaciones relevantes: uso de IMAO en los últimos 14 días, glaucoma, hipertiroidismo, enfermedad cardiovascular significativa no controlada. Antes de iniciar se recomienda historia cardiovascular personal y familiar (muerte súbita, arritmias). En Colombia es un medicamento fiscalizado (verificar en el listado vigente del FNE si se distribuye como monopolio del Estado), con requisitos especiales de prescripción, custodia y registro, y riesgo de uso no médico (\"potenciador cognitivo\" en estudiantes).</p><p>Atomoxetina. Inhibidor selectivo de la recaptación de noradrenalina, no estimulante y sin potencial de abuso relevante, por lo que no es de control especial. Inicio de efecto en semanas. Metabolismo por CYP2D6: los metabolizadores lentos o el uso de fluoxetina/paroxetina aumentan su exposición. Efectos adversos: síntomas gastrointestinales, disminución del apetito, aumento de frecuencia cardiaca y presión arterial, y advertencia sobre ideación suicida en niños y adolescentes (vigilancia clínica estrecha al inicio), además de raros casos de daño hepático.</p><p>Ejemplo. En una droguería de Bogotá, una madre consulta porque su hijo de 9 años con metilfenidato de liberación prolongada \"casi no come\". El QF verifica horario de administración (en la mañana, con o después del desayuno), sugiere comidas nutritivas al final del día, revisa curva de peso y talla y orienta a comunicar al pediatra o psiquiatra infantil. Le explica que no debe triturar las tabletas de liberación prolongada.</p><p>Puntos clave:<br>1. Metilfenidato: bloqueo DAT/NET, eficacia rápida, fiscalizado; vigilar apetito, crecimiento, sueño y parámetros cardiovasculares.<br>2. Atomoxetina: no estimulante, efecto diferido, interacciones por CYP2D6 y advertencia de ideación suicida en jóvenes.<br>3. El QF educa sobre administración correcta, almacenamiento seguro y prevención del desvío.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Farmacoterapia de las adicciones: visión general', 'Clase 2 · TDAH y adicciones', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume las opciones farmacológicas para alcohol, opioides y tabaco, y el rol del QF en reducción de daños.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: resumir las principales estrategias farmacológicas para los trastornos por consumo de sustancias y el papel del QF en reducción de daños.</p><p>Desarrollo. El tratamiento de las adicciones combina intervenciones psicosociales y farmacoterapia orientada a reducir el craving, prevenir recaídas y disminuir daños. En Colombia, la Ley 1566 de 2012 reconoce el consumo problemático de sustancias como un asunto de salud pública con derecho a atención integral, y la Ley 1616 de 2013 integra la salud mental y el consumo de sustancias en la red de servicios.</p><p>Alcohol. Abstinencia: benzodiacepinas (protocolos de dosis guiados por síntomas), con tiamina antes de la glucosa para prevenir encefalopatía de Wernicke. Prevención de recaídas: naltrexona (antagonista opioide; contraindicada si el paciente usa opioides; vigilar función hepática), acamprosato (modulador glutamatérgico; ajuste en falla renal), disulfiram (inhibe la aldehído deshidrogenasa; requiere consentimiento informado y abstinencia previa; reacción con alcohol oculto en jarabes o enjuagues). La disponibilidad de cada uno en Colombia debe verificarse en el registro INVIMA y su cobertura en PBS o MIPRES.</p><p>Opioides. Tratamiento con agonistas: metadona (agonista completo, riesgo de prolongación del QT e interacciones por CYP) y buprenorfina (agonista parcial, techo de depresión respiratoria). Naltrexona de liberación prolongada en pacientes desintoxicados. Naloxona para revertir sobredosis, estrategia clave de reducción de daños; en Colombia metadona y naloxona se gestionan a través del FNE/FRE como medicamentos fiscalizados o monopolio del Estado (verificar listado vigente).</p><p>Tabaco. Terapia de reemplazo de nicotina (parches, chicles), bupropión y vareniclina (agonista parcial α4β2). Las alertas de neuropsiquiatría de vareniclina y bupropión se revisaron tras el estudio EAGLES, que no mostró aumento significativo de eventos graves frente a placebo, pero se mantiene la vigilancia clínica.</p><p>Cannabis, cocaína y estimulantes: no hay fármacos aprobados con eficacia robusta; el manejo es psicosocial y sintomático.</p><p>Ejemplo. En un CAMAD (Centro de Atención Móvil a Drogodependientes) de una ciudad colombiana, el QF participa en la capacitación sobre uso de naloxona, la custodia de metadona y el seguimiento de interacciones (por ejemplo, metadona con antirretrovirales o con antipsicóticos que prolongan el QT).</p><p>Puntos clave:<br>1. Existen fármacos eficaces para alcohol, opioides y tabaco; para estimulantes y cannabis el pilar es psicosocial.<br>2. Metadona y naloxona son medicamentos fiscalizados en Colombia; el QF asegura custodia, trazabilidad y educación.<br>3. La reducción de daños y la atención sin estigma son parte del enfoque de derechos de la Ley 1616 y la Ley 1566.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Embarazo y lactancia', 'Clase 3 · Poblaciones especiales', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el balance riesgo-beneficio de antidepresivos, estabilizadores, antipsicóticos y benzodiacepinas en el embarazo y la lactancia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: interpretar el balance riesgo-beneficio de los psicofármacos durante el embarazo y la lactancia.</p><p>Desarrollo. Los trastornos mentales no tratados durante la gestación (depresión, trastorno bipolar, esquizofrenia) se asocian a peor autocuidado, consumo de sustancias, bajo peso al nacer, parto prematuro, depresión posparto y riesgo suicida; por ello la suspensión abrupta del tratamiento no es una medida \"segura\" por defecto. La decisión debe ser individual, compartida y planificada, idealmente antes de la concepción, usando la menor dosis eficaz y evitando la polifarmacia.</p><p>Antidepresivos. Los ISRS (sertralina es de los más estudiados) no se asocian de forma consistente a un aumento importante de malformaciones mayores; la paroxetina se ha relacionado con un riesgo de malformaciones cardiacas en el primer trimestre y suele evitarse. La exposición en el tercer trimestre puede producir síndrome de adaptación neonatal (irritabilidad, dificultad para alimentarse) y se ha descrito un pequeño aumento del riesgo de hipertensión pulmonar persistente del recién nacido. En lactancia, sertralina y paroxetina pasan en baja cantidad a la leche.</p><p>Estabilizadores. El valproato es el más teratogénico (defectos del tubo neural, otras malformaciones y trastornos del neurodesarrollo): no debe usarse en mujeres con posibilidad de embarazo salvo que no exista alternativa y con un programa de prevención del embarazo. Carbamazepina también es teratogénica. El litio se asocia a un pequeño aumento de anomalías cardiacas (como la de Ebstein) y sus niveles cambian por el aumento de la filtración glomerular durante el embarazo y caen bruscamente tras el parto (riesgo de toxicidad), por lo que requiere litemias más frecuentes. La lamotrigina tiene un perfil más favorable, pero sus niveles disminuyen durante la gestación.</p><p>Antipsicóticos y benzodiacepinas. Los antipsicóticos no muestran un patrón claro de malformaciones; algunos atípicos se asocian a diabetes gestacional y aumento de peso, y en el neonato pueden aparecer síntomas extrapiramidales o de abstinencia. Las benzodiacepinas cerca del parto pueden producir hipotonía y depresión respiratoria neonatal (síndrome del \"niño hipotónico\").</p><p>Ejemplo colombiano. En un control prenatal en Cartagena, una gestante de 10 semanas suspendió por su cuenta la sertralina y presenta recaída. El QF, articulado con el equipo de la ruta materno-perinatal, explica los riesgos de la depresión no tratada, aclara mitos, documenta las preferencias de la paciente y comunica al médico para reevaluar; además se asegura de que reciba ácido fólico.</p><p>Puntos clave:<br>1. No tratar también tiene riesgos; la decisión es individual y planificada.<br>2. Valproato es el psicofármaco de mayor riesgo teratogénico; litio requiere vigilancia estrecha de niveles en embarazo y posparto.<br>3. Consultar fuentes especializadas actualizadas (fichas técnicas, bases de datos de lactancia) antes de recomendar.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Adulto mayor: criterios de Beers y STOPP/START', 'Clase 3 · Poblaciones especiales', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica Beers 2023 y STOPP/START v3 a la revisión de psicofármacos en personas mayores.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar los criterios de Beers y STOPP/START a la psicofarmacología del adulto mayor.</p><p>Desarrollo. El envejecimiento modifica la farmacocinética (menor masa magra y agua corporal, aumento relativo de grasa que prolonga la vida media de fármacos liposolubles como diazepam; reducción de la función renal que afecta litio y algunos metabolitos; menor metabolismo de fase I) y la farmacodinamia (mayor sensibilidad a efectos sedantes, anticolinérgicos, extrapiramidales y ortostáticos). La polifarmacia multiplica las interacciones y las cascadas de prescripción.</p><p>Criterios de Beers (American Geriatrics Society, actualización 2023). Listan medicamentos potencialmente inapropiados en mayores de 65 años. En psicofármacos destacan: evitar benzodiacepinas (riesgo de deterioro cognitivo, delirium, caídas, fracturas y accidentes) y fármacos Z; evitar antidepresivos con fuerte efecto anticolinérgico (amitriptilina, imipramina, paroxetina); evitar antipsicóticos para el manejo de síntomas conductuales de la demencia o el delirium salvo fracaso de alternativas no farmacológicas y riesgo para sí o para otros (aumento de mortalidad y eventos cerebrovasculares); usar con precaución ISRS, IRSN, mirtazapina, antipsicóticos y carbamazepina por riesgo de hiponatremia/SIADH (vigilar sodio); y evitar combinaciones de tres o más fármacos activos en el SNC por riesgo de caídas.</p><p>STOPP/START (versión 3, 2023). Herramienta europea que, además de criterios para suspender (STOPP: por ejemplo, benzodiacepinas por más de 4 semanas, antipsicóticos en pacientes con parkinsonismo, tricíclicos en demencia o glaucoma, ISRS con hiponatremia significativa), incluye omisiones de tratamiento indicado (START: por ejemplo, antidepresivo no tricíclico en depresión mayor persistente).</p><p>Aplicación práctica para el QF. 1) Conciliación completa, incluyendo productos de venta libre (antihistamínicos sedantes). 2) Calcular la carga anticolinérgica con una escala validada. 3) Priorizar fármacos de mayor riesgo y proponer desprescripción gradual. 4) Monitorizar sodio, función renal, ortostatismo, caídas y estado cognitivo. 5) Comunicar por escrito al prescriptor con fuentes citadas.</p><p>Ejemplo. En un hogar geriátrico de Popayán, el QF revisa 40 residentes y encuentra 15 con quetiapina \"para dormir\" sin diagnóstico psiquiátrico. Con el médico implementa un plan de reducción, medidas de higiene del sueño y seguimiento de conducta, documentando los resultados.</p><p>Puntos clave:<br>1. Los cambios farmacocinéticos y farmacodinámicos aumentan la sensibilidad del adulto mayor a los psicofármacos.<br>2. Beers 2023 y STOPP/START v3 identifican benzodiacepinas, fármacos Z, anticolinérgicos y antipsicóticos en demencia como prioridades de revisión.<br>3. Vigilar hiponatremia con ISRS/IRSN y mirtazapina, y la combinación de 3 o más fármacos del SNC.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: inicio de clozapina en esquizofrenia resistente', 'Clase 4 · Caso integrador final', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta un plan de seguimiento interdisciplinario para un paciente fumador que inicia clozapina, integrando monitorización, interacciones y desprescripción.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: integrar los contenidos del curso en un caso complejo con intervención del QF en un equipo interdisciplinario.</p><p>Caso. Hombre de 27 años, Villavicencio, con esquizofrenia paranoide de 6 años de evolución, dos hospitalizaciones por abandono del tratamiento y fracaso documentado de risperidona y haloperidol a dosis adecuadas. Fuma 20 cigarrillos/día y consume alcohol los fines de semana. El psiquiatra inicia clozapina con titulación ambulatoria. Medicamentos concomitantes: omeprazol, lorazepam 2 mg/noche (hace un año) y biperideno. IMC 31 kg/m², glucemia en ayunas 112 mg/dL.</p><p>Análisis del QF. (1) Indicación: la clozapina es el antipsicótico de elección en esquizofrenia resistente según la GPC colombiana y guías internacionales. (2) Seguridad hematológica: requiere recuento de neutrófilos basal y monitorización según la ficha técnica aprobada por el INVIMA y el protocolo institucional (frecuencia semanal en las primeras semanas y luego espaciada). En 2025 la FDA eliminó su programa REMS en EE. UU., pero la vigilancia de neutropenia sigue recomendada; en Colombia se debe seguir la ficha técnica vigente. (3) Otros riesgos: miocarditis (sobre todo primeras semanas: fiebre, taquicardia, dolor torácico; vigilar troponina y PCR según protocolo), convulsiones dosis-dependientes, sialorrea, estreñimiento e íleo (potencialmente mortal), hipotensión ortostática, síndrome metabólico. (4) Interacciones: el tabaco induce CYP1A2 y reduce los niveles de clozapina; si el paciente deja de fumar (por ejemplo, durante una hospitalización) los niveles pueden aumentar marcadamente; el omeprazol también induce CYP1A2 en menor grado; la combinación con benzodiacepinas al inicio de la titulación se asocia a hipotensión y depresión respiratoria. (5) Anticolinérgicos: el biperideno suma estreñimiento y deterioro cognitivo, y puede no ser necesario con clozapina.</p><p>Intervención. Plan de seguimiento acordado con el psiquiatra: calendario de hemogramas y entregas condicionadas a resultado; educación al paciente y a la familia sobre fiebre, dolor de garganta, dolor torácico y estreñimiento; recomendación de profilaxis del estreñimiento; revisar la necesidad de biperideno y planear la reducción del lorazepam; seguimiento metabólico (peso, perímetro abdominal, glucemia, lípidos, presión arterial) según la guía colombiana de seguimiento metabólico; ofrecer cesación tabáquica informando al psiquiatra para ajustar dosis y considerar niveles plasmáticos. Valorar la cobertura y trámite de la tecnología (PBS o MIPRES según corresponda). Registrar y notificar sospechas de reacciones adversas a farmacovigilancia (INVIMA).</p><p>Puntos clave:<br>1. Clozapina: eficacia superior en resistencia, con un plan de seguridad estructurado (neutrófilos, miocarditis, estreñimiento, convulsiones).<br>2. Cambios en el hábito de fumar alteran significativamente sus niveles por CYP1A2.<br>3. El QF coordina monitorización, educación, desprescripción de fármacos innecesarios y farmacovigilancia.</p>"}'::jsonb);

END
$curso$;

-- ─── 9. Curso de Farmacología Respiratoria (32 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Farmacología Respiratoria' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Farmacología Respiratoria', 'Curso para Químicos Farmacéuticos sobre la farmacoterapia del asma, la EPOC y otras enfermedades respiratorias, actualizado a GINA 2025-2026 y GOLD 2025-2026 y contextualizado con las GPC del MinSalud y el sistema de salud colombiano. Integra los dispositivos de inhalación, la atención farmacéutica y casos clínicos con intervención del QF.', '<p>Curso para Químicos Farmacéuticos sobre la farmacoterapia del asma, la EPOC y otras enfermedades respiratorias, actualizado a GINA 2025-2026 y GOLD 2025-2026 y contextualizado con las GPC del MinSalud y el sistema de salud colombiano. Integra los dispositivos de inhalación, la atención farmacéutica y casos clínicos con intervención del QF.</p><h3>Objetivo general</h3><p>Capacitar al QF para seleccionar, dispensar, educar y hacer seguimiento farmacoterapéutico de los medicamentos respiratorios (broncodilatadores, corticosteroides, biológicos, antifibróticos, antituberculosos y fármacos sintomáticos), aplicando guías internacionales y nacionales vigentes y optimizando la técnica inhalatoria y la seguridad del paciente.</p><h3>A quién va dirigido</h3><p>Químicos Farmacéuticos y estudiantes de Química Farmacéutica en Colombia (farmacia hospitalaria, servicio farmacéutico ambulatorio, droguerías, gestores de alto costo y de la industria farmacéutica).</p><h3>Contexto normativo</h3><p>Colombia — GPC MinSalud/IETS, PBS/MIPRES, INVIMA</p>',
          'Farmacología', 'intermedio', 'Capacitar al QF para seleccionar, dispensar, educar y hacer seguimiento farmacoterapéutico de los medicamentos respiratorios (broncodilatadores, corticosteroides, biológicos, antifibróticos, antituberculosos y fármacos sintomáticos), aplicando guías internacionales y nacionales vigentes y optimizando la técnica inhalatoria y la seguridad del paciente.', 'Químicos Farmacéuticos y estudiantes de Química Farmacéutica en Colombia (farmacia hospitalaria, servicio farmacéutico ambulatorio, droguerías, gestores de alto costo y de la industria farmacéutica).',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Fundamentos: fisiopatología respiratoria, broncodilatadores y corticosteroides', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: farmacología respiratoria para el QF en Colombia', 'Clase 1 · Introducción al curso', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Presenta el alcance del curso, la carga de asma y EPOC en Colombia y el rol del QF en la optimización de la terapia inhalada.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www-cloudfront-alias.coursera.org/learn/enfermedad-respiratoria-cronica-asma-epoc","title":"[Página web] Enfermedad respiratoria crónica: asma y EPOC (curso)","description":"Universidad de los Andes – Coursera (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/PP/ENT/lineamiento-implementacion-prevencion-control-respiratorias-cronicas.pdf","title":"Lineamiento para la implementación de la prevención y control de enfermedades respiratorias crónicas","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Asma: inflamación T2 y no T2, hiperreactividad y obstrucción reversible', 'Clase 2 · Fisiopatología del asma y la EPOC', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la inmunopatología del asma (IL-4, IL-5, IL-13, IgE, TSLP) como base de los blancos farmacológicos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=Vx00zNIMuns","provider":"youtube","videoId":"Vx00zNIMuns","title":"Asma: Fisiopatología - Abordaje diagnóstico - Manejo terapéutico. GINA 2023","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.msdmanuals.com/es-es/professional/trastornos-pulmonares/asma-y-trastornos-relacionados/farmacoterapia-para-el-asma","title":"[Página web] Tratamiento farmacológico del asma – Manual MSD versión para profesionales (rev. dic 2025)","description":"Manual MSD (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'EPOC: inflamación neutrofílica, limitación persistente del flujo aéreo y diferencias con el asma', 'Clase 2 · Fisiopatología del asma y la EPOC', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara la fisiopatología, los factores de riesgo (tabaco, humo de leña) y la respuesta a fármacos entre la EPOC y el asma.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://goldcopd.org/wp-content/uploads/2026/03/2026-Pocket-GOLD-SPANISH_Final.v2_WMV.pdf","title":"Guía de bolsillo para el diagnóstico, manejo y prevención de la EPOC – Edición 2026","description":"Global Initiative for Chronic Obstructive Lung Disease (GOLD) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www-cloudfront-alias.coursera.org/learn/enfermedad-respiratoria-cronica-asma-epoc","title":"[Página web] Enfermedad respiratoria crónica: asma y EPOC (curso)","description":"Universidad de los Andes – Coursera (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Agonistas beta-2: SABA y LABA (salbutamol, formoterol, salmeterol, vilanterol, indacaterol, olodaterol)', 'Clase 3 · Broncodilatadores', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Explica el mecanismo, el inicio y la duración de acción, los efectos adversos (taquicardia, temblor, hipopotasemia) y las implicaciones del inicio rápido del formoterol.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=KZgO3t1nIMU","provider":"youtube","videoId":"KZgO3t1nIMU","title":"Farmacología del salbutamol, el ipratropio y otros broncodilatadores","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.msdmanuals.com/es-es/professional/trastornos-pulmonares/asma-y-trastornos-relacionados/farmacoterapia-para-el-asma","title":"[Página web] Tratamiento farmacológico del asma – Manual MSD versión para profesionales (rev. dic 2025)","description":"Manual MSD (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://cima.aemps.es/cima/pdfs/ft/78813/FT_78813.pdf","title":"Ficha técnica Gibiter Easyhaler 160/4,5 µg (budesonida/formoterol)","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Antimuscarínicos: SAMA y LAMA (ipratropio, tiotropio, glicopirronio, umeclidinio, aclidinio)', 'Clase 3 · Broncodilatadores', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el bloqueo de los receptores M3, la selectividad cinética, los efectos anticolinérgicos y las precauciones (glaucoma de ángulo cerrado, retención urinaria).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=HKVlkvRYqDE","provider":"youtube","videoId":"HKVlkvRYqDE","title":"Módulo 3: Medicamentos para el asma","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.msdmanuals.com/es/professional/trastornos-pulmonares/enfermedad-pulmonar-obstructiva-cr%C3%B3nica-y-trastornos-relacionados/tratamiento-de-la-enfermedad-pulmonar-obstructiva-cr%C3%B3nica-estable","title":"[Página web] Tratamiento de la enfermedad pulmonar obstructiva crónica estable – Manual MSD","description":"Manual MSD (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Corticosteroides inhalados y sistémicos: potencia, dosis bajas/medias/altas y seguridad', 'Clase 4 · Corticosteroides en enfermedad respiratoria', 5, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las equivalencias de CI (beclometasona, budesonida, fluticasona, mometasona, ciclesonida), los efectos locales y sistémicos y el impacto de los ciclos de corticoide oral.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=N8jJWaldG2Q","provider":"youtube","videoId":"N8jJWaldG2Q","title":"Corticoides inhalados en EPOC y Asma","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=Mad9l7Bey1o","provider":"youtube","videoId":"Mad9l7Bey1o","title":"Los Corticoides Orales y Parenterales en asma y EPOC","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://ginasthma.org/wp-content/uploads/2026/05/GINA-2025-Update-25_11_08-WMSA.pdf","title":"Global Strategy for Asthma Management and Prevention (2025 update)","description":"Global Initiative for Asthma (GINA) (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: sobreuso de SABA y corticofobia en una paciente con asma', 'Clase 4 · Corticosteroides en enfermedad respiratoria', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso en farmacia comunitaria: detección del sobreuso de salbutamol, educación sobre el CI y derivación documentada al médico.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar el conocimiento de broncodilatadores y corticosteroides para identificar y resolver problemas relacionados con medicamentos (PRM) en un paciente con asma mal controlada atendido en una droguería o servicio farmacéutico colombiano.</p><p>Desarrollo del caso: Andrea, 34 años, docente en Bogotá, solicita en la droguería dos inhaladores de salbutamol 100 µg/dosis \"porque el anterior ya se acabó\". Al indagar, refiere que usa el salbutamol casi todos los días, se despierta por tos dos noches a la semana y en el último año recibió dos ciclos de prednisolona oral prescritos en urgencias. Tiene prescrito beclometasona inhalada, pero la dejó \"porque es un corticoide y engorda\" y solo la usa cuando está muy mal. Además, comenta palpitaciones y temblor fino tras usar varias inhalaciones seguidas.</p><p>Análisis del QF: 1) Problema de efectividad: el uso de SABA en más de dos ocasiones por semana y los despertares nocturnos indican asma no controlada; la dispensación de tres o más inhaladores de SABA al año se asocia con mayor riesgo de exacerbaciones graves y muerte por asma. 2) Problema de adherencia por creencias: la corticofobia es frecuente; el QF debe explicar que el corticoide inhalado (CI) actúa localmente, a dosis de microgramos, y que el riesgo sistémico es mucho menor que el de los ciclos repetidos de corticoide oral, que sí acumulan efectos adversos (hiperglucemia, osteoporosis, cataratas, supresión suprarrenal). 3) Seguridad: el temblor y las palpitaciones son efectos esperables de la estimulación beta-2 y beta-1 residual; dosis repetidas pueden producir taquicardia e hipopotasemia. 4) Técnica inhalatoria: se le pide demostrar el uso del pMDI y se observa que dispara al final de la inspiración y no hace apnea.</p><p>Intervención: el QF no suspende ni cambia el tratamiento por cuenta propia; educa sobre la diferencia entre aliviador y controlador, corrige la técnica (idealmente con cámara espaciadora), recomienda enjuague bucal tras el CI para prevenir candidiasis y disfonía, y deriva a la paciente al médico con una nota escrita que documente el uso excesivo de SABA, los dos ciclos de corticoide oral y la baja adherencia al CI. En la nota menciona que GINA (2024-2025) recomienda como opción preferente la terapia con CI-formoterol como aliviador (Track 1, MART en pasos 3-5) y desaconseja el tratamiento con SABA solo en adolescentes y adultos. Finalmente programa un seguimiento a las 4 semanas para revisar control (cuestionario ACT), técnica y adherencia, y reporta cualquier evento adverso relevante al programa de farmacovigilancia institucional/INVIMA.</p><p>Puntos clave:<br>- El sobreuso de SABA es un marcador de riesgo, no un signo de \"buen tratamiento\"; el QF debe detectarlo en la dispensación.<br>- La corticofobia se aborda con educación: el CI reduce exacerbaciones y la necesidad de corticoide oral, que es el que más efectos adversos sistémicos acumula.<br>- Toda intervención del QF se documenta y se comunica al prescriptor; la decisión de cambiar a CI-formoterol corresponde al médico según GINA y la evaluación clínica.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Asma: GINA 2024-2026, GPC colombiana, controladores y biológicos', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: del SABA solo al aliviador antiinflamatorio', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume el cambio de paradigma de GINA desde 2019 y la estructura de la unidad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=YizT42xnWxs","provider":"youtube","videoId":"YizT42xnWxs","title":"Curso de actualización en Asma 2025","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://ginasthma.org/2026-gina-strategy-report/","title":"[Página web] 2026 GINA Strategy Report","description":"Global Initiative for Asthma (GINA) (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'GINA Track 1: MART con budesonida-formoterol y por qué no SABA solo', 'Clase 2 · Estrategia GINA y guía colombiana', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los Tracks 1 y 2, el CI-formoterol como aliviador y la evidencia de reducción de exacerbaciones graves.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=YizT42xnWxs","provider":"youtube","videoId":"YizT42xnWxs","title":"Curso de actualización en Asma 2025","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://ginasthma.org/wp-content/uploads/2026/05/GINA-2025-Update-25_11_08-WMSA.pdf","title":"Global Strategy for Asthma Management and Prevention (2025 update)","description":"Global Initiative for Asthma (GINA) (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://cima.aemps.es/cima/pdfs/ft/78813/FT_78813.pdf","title":"Ficha técnica Gibiter Easyhaler 160/4,5 µg (budesonida/formoterol)","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Escalonamiento, desescalamiento, niños y la GPC de asma MinSalud (2013)', 'Clase 2 · Estrategia GINA y guía colombiana', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los pasos de GINA 2025 (incluidos los menores de 12 años) con la GPC colombiana pediátrica de 2013 e identifica las recomendaciones desactualizadas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/INEC/IETS/GPC_Comp_Asma.pdf","title":"GPC para el diagnóstico, atención integral y seguimiento de niños y niñas con diagnóstico de asma (GPC-2013-01) – versión completa","description":"Ministerio de Salud y Protección Social – Colciencias – IETS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/INEC/IETS/GPC_Padres_Cuidadores_Asma.pdf","title":"GPC asma – versión para padres y cuidadores","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://ginasthma.org/wp-content/uploads/2024/02/GINA-Pocket-Guide-2023-SPANISH-WMS.pdf","title":"GINA Pocket Guide 2023 (versión en español)","description":"Global Initiative for Asthma (GINA) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Antileucotrienos (montelukast): eficacia, lugar en la terapia y alerta neuropsiquiátrica', 'Clase 3 · Controladores no esteroideos', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el antagonismo del receptor CysLT1, su papel en el asma y la rinitis alérgica y la advertencia de eventos neuropsiquiátricos (recuadro de la FDA de 2020).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cima.aemps.es/cima/pdfs/ft/75831/FT_75831.pdf","title":"Ficha técnica Montelukast Cinfa 10 mg","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.msdmanuals.com/es-es/professional/trastornos-pulmonares/asma-y-trastornos-relacionados/farmacoterapia-para-el-asma","title":"[Página web] Tratamiento farmacológico del asma – Manual MSD versión para profesionales (rev. dic 2025)","description":"Manual MSD (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Teofilina y metilxantinas: margen estrecho, niveles séricos e interacciones por CYP1A2', 'Clase 3 · Controladores no esteroideos', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Analiza por qué la teofilina tiene hoy un lugar marginal y cómo monitorizarla.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: describir la farmacología de la teofilina y justificar por qué hoy es un fármaco de uso restringido en asma y EPOC, con alto valor para la monitorización por el QF.</p><p>Desarrollo: la teofilina es una metilxantina con efecto broncodilatador débil y cierto efecto antiinflamatorio a concentraciones bajas. Su mecanismo incluye la inhibición no selectiva de fosfodiesterasas (aumento de AMPc) y el antagonismo de receptores de adenosina; a bajas concentraciones activa la histona desacetilasa-2, lo que se ha propuesto para revertir parcialmente la resistencia a corticoides. Las guías actuales la relegan: GINA no la recomienda como controlador habitual por su menor eficacia y su perfil de seguridad, y GOLD indica que su efecto broncodilatador es modesto y que su uso solo se considera cuando no hay acceso o tolerancia a los broncodilatadores inhalados de larga acción. En Colombia sigue disponible en presentaciones orales de liberación prolongada y la aminofilina intravenosa aún aparece en algunos protocolos hospitalarios de exacerbación, aunque las guías no la recomiendan de rutina en exacerbaciones.</p><p>Farmacocinética y estrecho margen terapéutico: se metaboliza principalmente por CYP1A2 (y en menor grado CYP2E1 y CYP3A4) con cinética que puede volverse no lineal; su rango terapéutico es estrecho y la toxicidad (náuseas, vómitos, taquicardia, arritmias, convulsiones) aparece con concentraciones séricas por encima del rango de referencia. Se recomienda medir niveles séricos al iniciar, ante cambios de dosis, signos de toxicidad o interacciones; los rangos de referencia deben consultarse en la ficha técnica y el laboratorio.</p><p>Interacciones de alto impacto: aumentan la concentración ciprofloxacino, eritromicina/claritromicina, fluvoxamina, cimetidina, alopurinol a dosis altas y anticonceptivos orales; la disminuyen el tabaquismo (inducción de CYP1A2), la rifampicina, la carbamazepina y la fenitoína. Clínicamente relevante: cuando un fumador deja de fumar, la concentración de teofilina puede subir en días o semanas. También la elevan la insuficiencia cardíaca, la hepatopatía, la fiebre viral y la edad avanzada.</p><p>Ejemplo aplicado: un hombre de 72 años con EPOC en Cali, tratado con teofilina de liberación prolongada, recibe ciprofloxacino por una infección urinaria y consulta por náuseas, palpitaciones y temblor. El QF identifica la interacción (inhibición de CYP1A2), contacta al médico para sugerir una alternativa antibiótica o la medición de niveles y el ajuste de la dosis, y reporta la sospecha de reacción adversa por interacción.</p><p>Puntos clave:<br>- Teofilina: eficacia modesta, margen estrecho y muchas interacciones; no es controlador de primera línea en GINA ni en GOLD.<br>- Vigilar CYP1A2: quinolonas, macrólidos, fluvoxamina y cambios en el hábito tabáquico modifican sus niveles.<br>- El QF debe promover niveles séricos y educar sobre los signos tempranos de toxicidad.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Biológicos en asma grave: omalizumab, mepolizumab, benralizumab, dupilumab y tezepelumab', 'Clase 4 · Asma grave y biológicos', 5, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los blancos (IgE, IL-5, IL-5R, IL-4Rα, TSLP), los biomarcadores predictores, la administración y los eventos adversos de cada biológico.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=VISal7basrA","provider":"youtube","videoId":"VISal7basrA","title":"El asma, menos grave con los anticuerpos monoclonales","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://ginasthma.org/2026-gina-severe-asthma-guide/","title":"[Página web] 2026 GINA Severe Asthma Guide","description":"Global Initiative for Asthma (GINA) (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://cima.aemps.es/cima/pdfs/ft/1221677001/FT_1221677001.pdf","title":"Ficha técnica Tezspire 210 mg (tezepelumab)","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: asma grave eosinofílica con pólipos nasales — selección de biológico y gestión MIPRES', 'Clase 4 · Asma grave y biológicos', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso aplicado: confirmación de asma grave, selección del biológico por fenotipo, acceso, cadena de frío y seguimiento por el QF.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar los criterios de asma grave y la selección de biológicos según el fenotipo, integrando el rol del QF en la gestión del acceso (MIPRES/PBS) y en el seguimiento.</p><p>Caso: Jorge, 46 años, Medellín, con asma desde la infancia. Usa budesonida-formoterol a dosis alta, más tiotropio, con buena técnica verificada y adherencia por encima del 80 % según registros de dispensación. Aun así, presentó tres exacerbaciones en el último año que requirieron corticoide oral y una hospitalización. Tiene rinosinusitis crónica con pólipos nasales, eosinófilos en sangre de 450 células/µL, FeNO elevado e IgE total moderadamente elevada con sensibilización a ácaros. IMC 31, antecedente de prediabetes.</p><p>Análisis: primero se confirma que es asma de difícil control y luego que es asma grave: el QF contribuye verificando técnica, adherencia (registros de reclamación), interacciones y comorbilidades tratables (rinosinusitis, obesidad, reflujo, apnea del sueño). Cumple criterios de asma grave con fenotipo T2 (eosinofílico y alérgico). GINA, en su guía de asma grave, propone evaluar biológicos según biomarcadores: anti-IgE (omalizumab) en asma alérgica con IgE y peso dentro del rango de dosificación; anti-IL-5/IL-5R (mepolizumab, benralizumab) en asma eosinofílica; anti-IL-4Rα (dupilumab) en T2 con eosinofilia o FeNO elevado, con beneficio adicional en pólipos nasales; anti-TSLP (tezepelumab) con eficacia también en pacientes con biomarcadores T2 bajos. En este paciente, con pólipos nasales y eosinofilia, el especialista podría considerar dupilumab o un anti-IL-5; la elección final es médica.</p><p>Rol del QF y contexto colombiano: varios biológicos para asma no siempre están financiados con la UPC; según la indicación y el estado regulatorio pueden requerir prescripción por MIPRES y gestión ante la EPS. El QF del servicio farmacéutico verifica registro sanitario INVIMA vigente, indicación aprobada y la cadena de frío (2-8 °C), educa en la autoadministración subcutánea (pluma o jeringa precargada) y la rotación de sitios, y programa la evaluación de respuesta (habitualmente alrededor de los 4 meses): exacerbaciones, uso de corticoide oral, ACT y función pulmonar. Vigila reacciones adversas: reacciones en el sitio de inyección, anafilaxia (especialmente con omalizumab), eosinofilia transitoria y conjuntivitis con dupilumab, y la necesidad de descartar parasitosis antes de terapias anti-eosinofílicas en zonas endémicas. Los eventos adversos se notifican a INVIMA.</p><p>Puntos clave:<br>- Antes de un biológico, se descartan las causas de \"falso asma grave\": técnica, adherencia y comorbilidades.<br>- El biomarcador (eosinófilos, IgE, FeNO) y las comorbilidades orientan el biológico; la respuesta se reevalúa de forma estructurada.<br>- El QF gestiona el acceso (MIPRES/EPS), la cadena de frío, la educación en la autoinyección y la farmacovigilancia.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. EPOC: GOLD 2025-2026, GPC colombiana y terapias complementarias', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: EPOC en Colombia y la estrategia GOLD', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la carga de la EPOC (incluida la exposición a biomasa) y la lógica de evaluación y tratamiento de GOLD.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=Ui8MAYzp72E","provider":"youtube","videoId":"Ui8MAYzp72E","title":"Nuevo Tratamiento para la EPOC","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://goldcopd.org/wp-content/uploads/2026/03/2026-Pocket-GOLD-SPANISH_Final.v2_WMV.pdf","title":"Guía de bolsillo para el diagnóstico, manejo y prevención de la EPOC – Edición 2026","description":"Global Initiative for Chronic Obstructive Lung Disease (GOLD) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Evaluación ABE y tratamiento inicial: broncodilatador, LABA+LAMA', 'Clase 2 · Tratamiento farmacológico según GOLD y la GPC', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los grupos A, B y E (mMRC/CAT y exacerbaciones) y el tratamiento inicial recomendado.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=olK6yHTBivE","provider":"youtube","videoId":"olK6yHTBivE","title":"GUÍA GOLD 2026: TRATAMIENTO DETALLADO!","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://goldcopd.org/wp-content/uploads/2026/03/2026-Pocket-GOLD-SPANISH_Final.v2_WMV.pdf","title":"Guía de bolsillo para el diagnóstico, manejo y prevención de la EPOC – Edición 2026","description":"Global Initiative for Chronic Obstructive Lung Disease (GOLD) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Seguimiento: eosinófilos, triple terapia en un solo dispositivo y retirada del CI', 'Clase 2 · Tratamiento farmacológico según GOLD y la GPC', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Analiza los umbrales de eosinófilos (&lt;100, 100-300, ≥300 células/µL), el riesgo de neumonía con CI y cuándo escalar a LABA+LAMA+CI.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=KceM0d6uPys","provider":"youtube","videoId":"KceM0d6uPys","title":"PART 2 GOLD 2025 Guidelines for COPD: Treatment Updates","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://goldcopd.org/wp-content/uploads/2024/11/KEY-CHANGES-GOLD-2025-11Nov2024.pdf","title":"GOLD 2025 – Summary of key changes","description":"GOLD (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://goldcopd.org/wp-content/uploads/2026/01/GOLD-REPORT-2026-v1.3-8Dec2025_WMV2.pdf","title":"GOLD 2026 Report","description":"GOLD (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'GPC EPOC MinSalud (Guía No. 28, 2014): recomendaciones y brechas frente a GOLD actual', 'Clase 2 · Tratamiento farmacológico según GOLD y la GPC', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara la GPC colombiana con GOLD 2025-2026 y discute cómo aplicar ambas en el sistema de salud.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://extranet.who.int/ncdccs/Data/COL_D1_GPC_EPOC_completa.pdf","title":"GPC basada en la evidencia para la prevención, diagnóstico, tratamiento y seguimiento de la EPOC en población adulta (Guía No. 28, 2014)","description":"MinSalud – Colciencias (repositorio OMS) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/INEC/IETS/GPC-EPOC-Pacientes.pdf","title":"GPC EPOC – versión para pacientes","description":"Ministerio de Salud y Protección Social – IETS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Roflumilast, azitromicina, mucolíticos y biológicos en EPOC (dupilumab, mepolizumab); ensifentrina', 'Clase 3 · Terapias complementarias, exacerbaciones y caso', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el lugar de cada terapia en el seguimiento de GOLD, sus RAM (pérdida de peso, síntomas digestivos y psiquiátricos con roflumilast; QT y ototoxicidad con azitromicina).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=X_3PU2yBXME","provider":"youtube","videoId":"X_3PU2yBXME","title":"DUPILUMAB Y EPOC Beneficios en Exacerbaciones y Función Pulmonar","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/86766/FT_86766.pdf","title":"Ficha técnica Roflumilast 500 µg comprimidos","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://cima.aemps.es/cima/pdfs/ft/1171229010/FT_1171229010.pdf","title":"Ficha técnica Dupixent 200 mg (dupilumab)","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Exacerbaciones y oxigenoterapia como medicamento', 'Clase 3 · Terapias complementarias, exacerbaciones y caso', 5, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Explica el manejo farmacológico de la exacerbación (SABA ± SAMA, corticoide sistémico de corta duración, antibiótico según criterios) y la prescripción del oxígeno domiciliario (dosis, horas, objetivos de saturación, seguridad).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=iWx5GCizx98","provider":"youtube","videoId":"iWx5GCizx98","title":"Manejo farmacológico del Broncoespasmo","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.msdmanuals.com/es/professional/trastornos-pulmonares/enfermedad-pulmonar-obstructiva-cr%C3%B3nica-y-trastornos-relacionados/tratamiento-de-la-enfermedad-pulmonar-obstructiva-cr%C3%B3nica-estable#v28585007_es","title":"[Página web] Oxigenoterapia en EPOC estable – Manual MSD (sección)","description":"Manual MSD (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://goldcopd.org/wp-content/uploads/2026/03/2026-Pocket-GOLD-SPANISH_Final.v2_WMV.pdf","title":"Guía de bolsillo para el diagnóstico, manejo y prevención de la EPOC – Edición 2026","description":"Global Initiative for Chronic Obstructive Lung Disease (GOLD) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: EPOC grupo E con eosinófilos bajos y neumonía en LABA+CI', 'Clase 3 · Terapias complementarias, exacerbaciones y caso', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso aplicado de optimización según GOLD: retirada del CI, LABA+LAMA, ajuste del dispositivo y medidas no farmacológicas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar la clasificación GOLD 2025-2026 y los criterios de uso de corticoide inhalado según eosinófilos para optimizar el tratamiento de un paciente con EPOC, con intervención documentada del QF.</p><p>Caso: Luis, 68 años, Boyacá, exfumador (40 paquetes-año) y expuesto al humo de leña durante su infancia. EPOC con FEV1 posbroncodilatador del 45 %. mMRC 2, CAT 18. En el último año tuvo dos exacerbaciones moderadas tratadas con prednisolona y antibiótico, y una neumonía. Recibe salmeterol-fluticasona dos veces al día desde hace cinco años más salbutamol a demanda. Eosinófilos en sangre: 80 células/µL. Usa un inhalador de polvo seco, pero el QF observa una inspiración débil y lenta.</p><p>Análisis del QF: según GOLD, el paciente pertenece al grupo E (una o más exacerbaciones). Para el seguimiento, GOLD recomienda escalar con base en los eosinófilos: con menos de 100 células/µL la evidencia no favorece el uso del CI, y en un paciente con neumonía previa el CI aumenta el riesgo de neumonía. El esquema LABA + CI sin LAMA ya no es el preferido en EPOC: si hay indicación de CI, GOLD prefiere la triple terapia LABA + LAMA + CI en un solo dispositivo, y si no la hay, LABA + LAMA. En este caso, el QF puede sugerir al médico considerar el cambio a LABA + LAMA, con retirada del CI bajo supervisión. También son opciones para exacerbaciones persistentes la azitromicina (preferentemente en exfumadores, con vigilancia de QT y audición) y el roflumilast (FEV1 &lt; 50 % y bronquitis crónica), y en algunos fenotipos los biológicos que GOLD 2026 incluye en el algoritmo (dupilumab, mepolizumab), de uso especializado.</p><p>Técnica y dispositivo: el flujo inspiratorio bajo compromete la eficacia del DPI. El QF puede proponer un pMDI con cámara o un inhalador de niebla fina, según disponibilidad en el PBS.</p><p>Medidas no farmacológicas: vacunación (influenza, neumococo, COVID-19, VSR según disponibilidad y lineamientos del PAI), rehabilitación pulmonar y evaluación de oxigenoterapia si hay hipoxemia crónica en reposo.</p><p>Intervención documentada: nota al médico con la clasificación GOLD, el recuento de eosinófilos, el antecedente de neumonía y la observación de la técnica; propuesta de alternativas, sin modificar el tratamiento por cuenta propia. Seguimiento a 4-8 semanas con CAT, revisión de técnica y adherencia, y registro de PRM.</p><p>Puntos clave:<br>- En EPOC el CI no es universal: se indica según exacerbaciones y eosinófilos, y se pondera el riesgo de neumonía.<br>- LABA + LAMA es la base; la triple terapia en un solo dispositivo se reserva para pacientes con exacerbaciones y eosinofilia.<br>- El dispositivo debe ajustarse a la capacidad inspiratoria del paciente: un buen fármaco en un mal dispositivo fracasa.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Dispositivos de inhalación y técnica inhalatoria: el rol del QF', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: depósito pulmonar y por qué el dispositivo importa', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume los determinantes del depósito (tamaño de partícula, flujo inspiratorio, coordinación) y la frecuencia de errores críticos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=I0ynbdELREg","provider":"youtube","videoId":"I0ynbdELREg","title":"¿Inhalar lento o rápido los fármacos para asma y EPOC?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.aepap.org/sites/default/files/309.Terapia%20inhalada%20lo%20que%20nos%20queda%20por%20saber.pdf","title":"Terapia inhalada: lo que nos queda por saber","description":"Asociación Española de Pediatría de Atención Primaria (AEPap) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Inhalador presurizado (pMDI) y cámaras espaciadoras con válvula (con boquilla y con mascarilla)', 'Clase 2 · Tipos de dispositivos', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta paso a paso la técnica del pMDI solo y con cámara, en adultos y niños, incluidos el cebado y la limpieza.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=357P3EpQq_s","provider":"youtube","videoId":"357P3EpQq_s","title":"Técnica para usar el inhalador presurizado con cámara con válvula y boquilla.","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=FPB7AvN5jGo","provider":"youtube","videoId":"FPB7AvN5jGo","title":"Cómo Utilizar un Inhalador con Espaciador y mascarilla","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Inhaladores de polvo seco (DPI), inhalador de niebla fina y nebulizadores', 'Clase 2 · Tipos de dispositivos', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los DPI (unidosis y multidosis), el inhalador de niebla fina y los nebulizadores: flujo inspiratorio requerido, ventajas, errores frecuentes e indicaciones.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=IPD9cagrwkk","provider":"youtube","videoId":"IPD9cagrwkk","title":"Utiliza inhalador de polvo seco - Aerovial","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.aepap.org/sites/default/files/309.Terapia%20inhalada%20lo%20que%20nos%20queda%20por%20saber.pdf","title":"Terapia inhalada: lo que nos queda por saber","description":"Asociación Española de Pediatría de Atención Primaria (AEPap) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Rol del QF: evaluación de la técnica, adherencia, educación y farmacovigilancia', 'Clase 3 · Atención farmacéutica en terapia inhalada', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica herramientas de evaluación (listas de chequeo, test de adherencia) e intervenciones educativas en dispensación y seguimiento farmacoterapéutico.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=vj9JuFRSIpE","provider":"youtube","videoId":"vj9JuFRSIpE","title":"CÁMARA ESPACIADORA ¿Sí o no? NEUMÓLOGO Explica","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: adulta mayor con EPOC, artrosis y errores críticos de inhalación', 'Clase 3 · Atención farmacéutica en terapia inhalada', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso de evaluación y corrección de la técnica, simplificación de dispositivos y prevención de errores de medicación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: ejecutar una evaluación estructurada de técnica inhalatoria y adherencia en farmacia comunitaria, y aplicar una intervención educativa medible.</p><p>Caso: Rosa, 74 años, Barranquilla, con EPOC y artrosis en las manos. Le dispensan tiotropio en inhalador de polvo seco con cápsulas y salbutamol en pMDI. Refiere que \"los inhaladores no le sirven\". En la demostración se observa: 1) no exhala antes de inhalar y sopla dentro del dispositivo, lo que humedece el polvo; 2) no logra perforar bien la cápsula por la artrosis; 3) con el pMDI no coordina el disparo con la inspiración; 4) en ocasiones se traga la cápsula de tiotropio pensando que es una tableta. Usa además dos inhaladores distintos con técnicas diferentes.</p><p>Procedimiento del QF:<br>1. Evaluar con una lista de chequeo paso a paso por dispositivo (preparación, exhalación fuera del dispositivo, sellado de labios, inspiración adecuada al dispositivo: lenta y profunda en el pMDI, rápida y enérgica en el DPI, apnea de unos 10 segundos, enjuague si hay CI). Registrar los errores críticos.<br>2. Identificar las causas: limitación de la destreza manual, posible flujo inspiratorio insuficiente y confusión de la vía de administración (error de medicación con riesgo de PRM).<br>3. Intervenir: enseñanza con demostración y \"repetir de vuelta\" (teach-back); proponer al médico la simplificación a un solo tipo de dispositivo y, para el pMDI, el uso de cámara espaciadora con válvula. Explicar por escrito, con letra grande, que las cápsulas se inhalan y nunca se tragan.<br>4. Adherencia: aplicar una prueba validada (por ejemplo, el test TAI para inhaladores o Morisky-Green) y revisar el registro de dispensación.<br>5. Seguimiento: nueva demostración en 2-4 semanas; repetir la evaluación de la técnica en cada dispensación. Documentar en la historia farmacoterapéutica y notificar el error de medicación según el programa institucional de seguridad del paciente y farmacovigilancia.</p><p>Contexto colombiano: el servicio farmacéutico debe incluir la educación al paciente dentro de la dispensación (Decreto 780 de 2016, título de servicio farmacéutico, y Resolución 1403 de 2007). En la práctica, las cámaras espaciadoras no siempre se entregan con el inhalador; el QF puede orientar sobre su obtención y sobre las cámaras caseras solo como último recurso, según las recomendaciones de la OMS/GINA.</p><p>Puntos clave:<br>- Los errores críticos de técnica son frecuentes y explican muchos \"fracasos terapéuticos\".<br>- Hay que adaptar el dispositivo al paciente (destreza, flujo inspiratorio, cognición) y minimizar la mezcla de dispositivos.<br>- La educación es iterativa: demostrar, verificar y reevaluar en cada contacto.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Otros fármacos respiratorios: tos, rinitis, fibrosis pulmonar y tuberculosis', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: autocuidado, especialidad y salud pública en farmacología respiratoria', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume el espectro de la unidad, desde los medicamentos de venta libre para la tos y la rinitis hasta los antifibróticos de alto costo y el programa de TB.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.minsalud.gov.co/salud/publica/PET/Paginas/Tuberculosis.aspx","title":"[Página web] Tuberculosis – Programa Nacional (documentos de interés)","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.msdmanuals.com/es/professional/trastornos-pulmonares/s%C3%ADntomas-de-los-trastornos-pulmonares/tos-en-adultos","title":"[Página web] Tos en adultos – Manual MSD","description":"Manual MSD (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Antitusivos, mucolíticos y expectorantes: qué dice la evidencia', 'Clase 2 · Tos y rinitis alérgica', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Analiza la evidencia limitada de los antitusivos (dextrometorfano, codeína) y los expectorantes, las restricciones de la codeína en pediatría y el papel de los mucolíticos (N-acetilcisteína, carbocisteína) en la EPOC.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.msdmanuals.com/es/professional/trastornos-pulmonares/s%C3%ADntomas-de-los-trastornos-pulmonares/tos-en-adultos","title":"[Página web] Tos en adultos – Manual MSD","description":"Manual MSD (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://goldcopd.org/wp-content/uploads/2026/03/2026-Pocket-GOLD-SPANISH_Final.v2_WMV.pdf","title":"Guía de bolsillo para el diagnóstico, manejo y prevención de la EPOC – Edición 2026","description":"Global Initiative for Chronic Obstructive Lung Disease (GOLD) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Rinitis alérgica: antihistamínicos H1, corticoides intranasales, antileucotrienos y técnica del spray nasal', 'Clase 2 · Tos y rinitis alérgica', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los antihistamínicos de 1.ª y 2.ª generación y los corticoides nasales, y explica la técnica correcta del spray nasal y su relación con el asma.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=uoGhb0YYJ9g","provider":"youtube","videoId":"uoGhb0YYJ9g","title":"Tratamiento y prevención de la Rinitis Alérgica","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=FbViyNyBeDs","provider":"youtube","videoId":"FbViyNyBeDs","title":"Rinitis 4: ¿cómo usar un corticoide inhalado?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.msdmanuals.com/es/professional/inmunolog%C3%ADa-y-trastornos-al%C3%A9rgicos/enfermedades-al%C3%A9rgicas-autoinmunitarias-y-otros-trastornos-por-hipersensibilidad/rinitis-al%C3%A9rgica","title":"[Página web] Rinitis alérgica – Manual MSD versión para profesionales","description":"Manual MSD (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Fibrosis pulmonar idiopática: pirfenidona y nintedanib', 'Clase 3 · Fibrosis pulmonar y tuberculosis', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el mecanismo, las RAM (fotosensibilidad y alteraciones digestivas con pirfenidona; diarrea y hepatotoxicidad con nintedanib), las interacciones (CYP1A2, gp-P) y la monitorización hepática.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=iiBKtgpv3QI","provider":"youtube","videoId":"iiBKtgpv3QI","title":"Tratamiento de la Fibrosis Pulmonar","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/87483/FT_87483.pdf","title":"Ficha técnica Pirfenidona 267 mg comprimidos","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://cima.aemps.es/cima/pdfs/ft/90482/FT_90482.pdf","title":"Ficha técnica Nintedanib 150 mg cápsulas blandas","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Tuberculosis: esquema 2HRZE/4HR, tratamiento supervisado y Programa Nacional (visión breve)', 'Clase 3 · Fibrosis pulmonar y tuberculosis', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume el esquema para TB sensible, las RAM principales y las interacciones de la rifampicina, y los lineamientos de la Resolución 227 de 2020.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=HyrTSJ2t16g","provider":"youtube","videoId":"HyrTSJ2t16g","title":"Tuberculosis Pulmonar: ¿Cuál es el tratamiento?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/PP/ET/abece-tuberculosis-msps.pdf","title":"ABECÉ Tuberculosis (2021)","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www2.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%20No.%20227%20de%202020.pdf","title":"Resolución 227 de 2020 – Lineamientos técnicos y operativos del Programa Nacional de Prevención y Control de la Tuberculosis","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: TB sensible en paciente con VIH y metadona — interacciones de la rifampicina', 'Clase 3 · Fibrosis pulmonar y tuberculosis', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso integrador de identificación de interacciones, manejo de RAM y articulación con el Programa de TB.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar el conocimiento del esquema antituberculoso y del programa nacional para resolver interacciones y problemas de adherencia en un paciente con tuberculosis sensible, de forma articulada con el Programa de TB.</p><p>Caso: Camilo, 39 años, Cali, con tuberculosis pulmonar sensible y baciloscopia positiva; vive con VIH y está en tratamiento antirretroviral. Inició el esquema de primera línea de dosis fija combinada (fase intensiva de 2 meses con isoniazida, rifampicina, pirazinamida y etambutol, seguida de 4 meses de isoniazida y rifampicina), administrado bajo observación directa en la IPS según los lineamientos del programa (Resolución 227 de 2020). Además toma anticonceptivos hormonales su pareja, y él usa metadona por un programa de reducción de daños. A las 3 semanas consulta por náuseas, orina naranja y hormigueo en los pies.</p><p>Análisis del QF:<br>1. Interacciones por inducción enzimática de la rifampicina (CYP3A4, 2C9, 2C19 y glicoproteína P): reduce las concentraciones de muchos antirretrovirales (por ejemplo, inhibidores de proteasa y algunos inhibidores de integrasa requieren ajuste o sustitución), de la metadona (riesgo de síndrome de abstinencia) y de los anticonceptivos hormonales (riesgo de falla). El QF revisa cada combinación en fuentes especializadas y comunica al equipo tratante; la decisión de ajuste es médica.<br>2. Reacciones adversas: la coloración naranja de los fluidos por la rifampicina es esperable (educar, y advertir sobre el teñido de lentes de contacto); la neuropatía periférica sugiere toxicidad por isoniazida, prevenible con piridoxina en grupos de riesgo (VIH, desnutrición, diabetes, alcoholismo, embarazo); las náuseas obligan a vigilar la hepatotoxicidad (isoniazida, rifampicina, pirazinamida) con pruebas hepáticas si hay síntomas. El etambutol requiere vigilar la agudeza visual y la visión de colores.<br>3. Adherencia: la tuberculosis es de notificación obligatoria y el tratamiento es gratuito por el programa; la adherencia estrictamente supervisada es fundamental para evitar la resistencia. El QF refuerza la educación, coordina con el programa y reporta las RAM a farmacovigilancia (INVIMA y programa).</p><p>Intervención: nota al médico tratante y al programa con las interacciones identificadas, la sugerencia de evaluar la piridoxina y las pruebas hepáticas, y la recomendación de anticoncepción de barrera adicional. Seguimiento semanal durante la fase intensiva.</p><p>Puntos clave:<br>- La rifampicina es uno de los inductores más potentes: revise siempre antirretrovirales, opioides, anticonceptivos, anticoagulantes y anticonvulsivantes.<br>- La tuberculosis sensible se trata con un esquema estandarizado de 6 meses supervisado; el QF no modifica el esquema, pero sí vigila RAM e interacciones.<br>- La articulación con el Programa Nacional de TB y la notificación son parte del rol del QF.</p>"}'::jsonb);

END
$curso$;

-- ─── 10. Curso de Farmacología Gastrointestinal (40 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Farmacología Gastrointestinal' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Farmacología Gastrointestinal', 'Curso para químicos farmacéuticos sobre la farmacoterapia de las enfermedades digestivas: antisecretores, erradicación de H. pylori, motilidad, enfermedad inflamatoria intestinal, enfermedad hepática y enzimas pancreáticas. Integra las alertas INVIMA, la resistencia antimicrobiana local y el seguimiento farmacoterapéutico en el sistema de salud colombiano.', '<p>Curso para químicos farmacéuticos sobre la farmacoterapia de las enfermedades digestivas: antisecretores, erradicación de H. pylori, motilidad, enfermedad inflamatoria intestinal, enfermedad hepática y enzimas pancreáticas. Integra las alertas INVIMA, la resistencia antimicrobiana local y el seguimiento farmacoterapéutico en el sistema de salud colombiano.</p><h3>Objetivo general</h3><p>Que el QF seleccione, dispense, monitorice y optimice los fármacos gastrointestinales con criterios de eficacia, seguridad y evidencia actualizada, interviniendo en casos clínicos y aplicando la normativa y la farmacovigilancia colombianas.</p><h3>A quién va dirigido</h3><p>Químicos farmacéuticos y regentes de farmacia de servicios farmacéuticos hospitalarios y ambulatorios, gestores farmacéuticos de EPS e IPS y profesionales de la industria farmacéutica en Colombia.</p><h3>Contexto normativo</h3><p>Colombia — GPC MinSalud/IETS, PBS/MIPRES, INVIMA</p>',
          'Farmacología', 'intermedio', 'Que el QF seleccione, dispense, monitorice y optimice los fármacos gastrointestinales con criterios de eficacia, seguridad y evidencia actualizada, interviniendo en casos clínicos y aplicando la normativa y la farmacovigilancia colombianas.', 'Químicos farmacéuticos y regentes de farmacia de servicios farmacéuticos hospitalarios y ambulatorios, gestores farmacéuticos de EPS e IPS y profesionales de la industria farmacéutica en Colombia.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Secreción ácida gástrica y fármacos antisecretores', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: el QF frente a la farmacoterapia digestiva', 'Clase 1 · Clase 1 – Introducción al curso', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Presenta el alcance del curso, la carga de las enfermedades digestivas en Colombia y el rol del QF en la dispensación, el seguimiento y la farmacovigilancia de los fármacos gastrointestinales.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=hYFEBfYlCYM","provider":"youtube","videoId":"hYFEBfYlCYM","title":"La enfermedad de las úlceras pépticas y la infección por H. pylori","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.elsevier.es/es-revista-gastroenterologia-hepatologia-14-resumen-evidencias-e-incertidumbres-del-uso-S0210570510700029","title":"[Página web] Evidencias e incertidumbres del uso de los inhibidores de la bomba de protones","description":"Gastroenterología y Hepatología (Elsevier) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Regulación de la secreción ácida: célula parietal, histamina, gastrina y acetilcolina', 'Clase 2 · Fisiología de la secreción ácida e inhibidores de la bomba de protones', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la célula parietal, la H+/K+-ATPasa y las dianas farmacológicas de la secreción ácida.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.ugr.es/~rsaucedo/temas/digesti3/digesti3.htm","title":"[Página web] Farmacología de la motilidad del aparato digestivo","description":"Universidad de Granada (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'IBP: mecanismo, farmacocinética, CYP2C19 e interacciones', 'Clase 2 · Fisiología de la secreción ácida e inhibidores de la bomba de protones', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Analiza los profármacos activados en medio ácido, la toma antes de las comidas, el polimorfismo CYP2C19 y las interacciones (clopidogrel, metotrexato, absorción dependiente del pH).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=x3IYDwdpl2I","provider":"youtube","videoId":"x3IYDwdpl2I","title":"Omeprazole in 15 Minutes: Mechanism, Dosing, Side Effects & Clinical Pearls","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://siicsalud.com/dato/experto.php/80891","title":"[Página web] Inhibidores de la bomba de protones. Actualización","description":"SIIC Salud (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://cima.aemps.es/cima/dochtml/ft/82921/FT_82921.html","title":"[Página web] Ficha técnica Esomeprazol Cinfa 20 mg cápsulas gastrorresistentes","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Seguridad de los IBP: evidencia sobre efectos adversos del uso prolongado', 'Clase 2 · Fisiología de la secreción ácida e inhibidores de la bomba de protones', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la evidencia sobre hipomagnesemia, déficit de B12, fracturas, C. difficile y nefritis intersticial, distinguiendo la asociación de la causalidad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=HEtOj9B1A8M","provider":"youtube","videoId":"HEtOj9B1A8M","title":"OMEPRAZOL: Indicaciones, Efectos Secundarios, Mecanismo de Acción","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://scielo.isciii.es/pdf/diges/v103n2/informacionpaciente.pdf","title":"Información al paciente: inhibidores de la bomba de protones (Rev Esp Enferm Dig, v103 n2)","description":"SciELO España – Rev Esp Enferm Dig (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'AntiH2 y el retiro de la ranitidina por NDMA: alertas INVIMA 2020', 'Clase 3 · AntiH2, bloqueadores de ácido competitivos de potasio (P-CAB) y antiácidos', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la farmacología de los antiH2 (famotidina) y el retiro de todas las formas de ranitidina en Colombia (alertas INVIMA 110-2020 oral y 153-2020 inyectable) por nitrosaminas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/alertas-sanitarias/alerta-sanitaria-sobre-retiro-del-mercado-ranitidina","title":"[Página web] Alerta sanitaria sobre retiro del mercado Ranitidina (Alerta No. 110-2020)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/alertas-sanitarias/retiro-del-mercado-ranitidina-solucion-inyectable","title":"[Página web] Retiro del mercado Ranitidina solución inyectable (Alerta No. 153-2020)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://cima.aemps.es/cima/dochtml/ft/63319/FT_63319.html","title":"[Página web] Ficha técnica Famotidina Cinfa 20 mg comprimidos","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Vonoprazán y los P-CAB: un nuevo paradigma antisecretor', 'Clase 3 · AntiH2, bloqueadores de ácido competitivos de potasio (P-CAB) y antiácidos', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara el mecanismo, el inicio de acción y la independencia del CYP2C19 de los P-CAB frente a los IBP, su papel en la esofagitis erosiva y en la erradicación de H. pylori, y su perfil de seguridad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.cun.es/diccionario-medico/terminos/vonoprazan","title":"[Página web] Vonoprazán – Diccionario médico","description":"Clínica Universidad de Navarra (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://pubmed.ncbi.nlm.nih.gov/39720884/","title":"[Página web] Integrated Analysis of Vonoprazan Safety for Symptomatic GERD or Erosive Oesophagitis","description":"PubMed (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Antiácidos, alginatos y protectores de mucosa', 'Clase 3 · AntiH2, bloqueadores de ácido competitivos de potasio (P-CAB) y antiácidos', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los antiácidos, los alginatos, el sucralfato y el misoprostol, con énfasis en las interacciones por quelación y la consulta de mostrador.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: comparar los antiácidos, los alginatos y los protectores de mucosa por su mecanismo, sus interacciones y su uso en la consulta de mostrador.</p><p>Desarrollo: los antiácidos neutralizan el ácido ya secretado. El hidróxido de aluminio produce estreñimiento e hipofosfatemia y se acumula en la insuficiencia renal. El hidróxido de magnesio produce diarrea y puede causar hipermagnesemia en la enfermedad renal crónica. El carbonato de calcio actúa rápido, pero puede causar rebote ácido, hipercalcemia y síndrome leche-álcali. El bicarbonato de sodio aporta una carga de sodio y produce alcalosis metabólica. Las combinaciones de aluminio y magnesio compensan sus efectos sobre el tránsito intestinal. Su efecto dura 30 a 60 minutos en ayunas y hasta 3 horas si se toman después de las comidas.</p><p>Los alginatos (alginato de sodio con bicarbonato) forman una \"balsa\" que flota sobre el contenido gástrico y reduce el reflujo postprandial, y son útiles en el embarazo. El sucralfato forma una barrera sobre la úlcera en medio ácido, contiene aluminio y reduce la absorción de levotiroxina, quinolonas, warfarina y fenitoína. El misoprostol (análogo de la PGE1) previene la úlcera por AINE, pero causa diarrea y está contraindicado en el embarazo por su efecto abortivo.</p><p>Interacciones clave para el QF: los antiácidos con cationes divalentes o trivalentes forman quelatos con las quinolonas, las tetraciclinas, el hierro, la levotiroxina, el dolutegravir y los bifosfonatos. Se debe separar la administración al menos 2 a 4 horas según la ficha técnica de cada fármaco. Además, el aumento del pH reduce la absorción del ketoconazol, el itraconazol (cápsulas), el atazanavir y algunos inhibidores de tirosina quinasa.</p><p>Caso aplicado: un hombre de 68 años con enfermedad renal crónica estadio 4 en Bucaramanga pide en la droguería un antiácido con magnesio para la acidez. El QF desaconseja el magnesio y el aluminio por el riesgo de acumulación, recomienda un alginato a demanda y medidas no farmacológicas, y lo remite al médico si los síntomas son frecuentes o hay signos de alarma (disfagia, pérdida de peso, sangrado, anemia o inicio después de los 50 a 55 años).</p><p>Puntos clave:<br>1. Los antiácidos alivian rápido, pero su efecto es corto y no cicatrizan la esofagitis.<br>2. Separar los antiácidos de las quinolonas, las tetraciclinas, el hierro y la levotiroxina.<br>3. Evitar los antiácidos con magnesio y aluminio en la enfermedad renal crónica avanzada; los alginatos son una opción segura en el embarazo.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Protocolo de deprescripción de IBP', 'Clase 4 · Uso prolongado de IBP y deprescripción', 7, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica un algoritmo de revisión de la indicación, reducción gradual y manejo del rebote ácido.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar un protocolo de revisión y deprescripción de inhibidores de bomba de protones (IBP) en pacientes con uso prolongado sin indicación vigente.</p><p>Desarrollo: los IBP se encuentran entre los medicamentos más dispensados en Colombia y una proporción importante de los tratamientos crónicos carece de indicación documentada (por ejemplo, \"protección gástrica\" sin factores de riesgo, o continuación indefinida tras un episodio de dispepsia). El uso prolongado se ha asociado, en estudios mayoritariamente observacionales, con déficit de vitamina B12 y magnesio, fracturas, infección por Clostridioides difficile, neumonía y alteración de la absorción de hierro; aunque la causalidad no está demostrada para todos los desenlaces, el balance beneficio-riesgo es desfavorable cuando no hay indicación.</p><p>El QF debe distinguir tres grupos: (1) indicación clara de uso crónico, que no se deprescribe: esófago de Barrett, esofagitis grave (LA C/D), antecedente de hemorragia digestiva por úlcera, gastroprotección en pacientes de alto riesgo que reciben AINE, antiagregación dual o anticoagulación con factores de riesgo; (2) indicación cumplida (ERGE leve o no erosiva controlada, úlcera ya cicatrizada y H. pylori erradicado), que son candidatos a deprescripción; y (3) ausencia de indicación, donde se suspende.</p><p>Estrategias: reducir la dosis (de dosis doble a estándar, o de estándar a media), pasar a uso \"a demanda\" en ERGE no erosiva, o suspender. La reducción gradual durante 2 a 4 semanas disminuye la hipersecreción ácida de rebote, que puede aparecer en las primeras semanas y confundirse con una recaída. Para los síntomas transitorios se pueden usar antiácidos o alginatos y un antiH2 (famotidina) a demanda; la ranitidina ya no es una opción en Colombia (retiro INVIMA 2020). El seguimiento se hace entre la semana 4 y la 12: si los síntomas reaparecen de forma persistente, se vuelve a la dosis eficaz más baja.</p><p>Caso aplicado: mujer de 74 años, afiliada a una EPS del régimen contributivo en Bogotá, con polifarmacia (9 medicamentos) y omeprazol 20 mg/día desde hace 6 años \"porque toma muchas pastillas\". No toma AINE ni antiagregantes y no tiene antecedente de úlcera. Tiene una B12 baja y una fractura de radio el año pasado. El QF documenta la falta de indicación y propone al médico tratante reducir a 10 mg/día durante 2 semanas, pasar luego a días alternos y suspender, con famotidina a demanda. Entrega educación sobre el rebote ácido y medidas higiénico-dietéticas, y programa seguimiento telefónico a las 4 y 12 semanas. Registra la intervención como problema relacionado con medicamentos (PRM) de necesidad.</p><p>Puntos clave:<br>1. Revisar la indicación de todo IBP con más de 8 semanas de uso; no se deprescribe en Barrett, esofagitis grave ni gastroprotección justificada.<br>2. La reducción gradual y la educación sobre el rebote ácido mejoran el éxito de la deprescripción.<br>3. Documentar la intervención y hacer seguimiento entre las semanas 4 y 12; la ranitidina no es alternativa en Colombia.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: polifarmacia en el adulto mayor con IBP crónico sin indicación', 'Clase 4 · Uso prolongado de IBP y deprescripción', 8, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso de un paciente en un programa de atención domiciliaria con IBP, clopidogrel y déficit de B12; el QF formula una intervención y la documenta como PRM.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cima.aemps.es/cima/dochtml/ft/82921/FT_82921.html","title":"[Página web] Ficha técnica Esomeprazol Cinfa 20 mg cápsulas gastrorresistentes","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.elsevier.es/es-revista-gastroenterologia-hepatologia-14-resumen-evidencias-e-incertidumbres-del-uso-S0210570510700029","title":"[Página web] Evidencias e incertidumbres del uso de los inhibidores de la bomba de protones","description":"Gastroenterología y Hepatología (Elsevier) (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. ERGE, úlcera péptica y erradicación de Helicobacter pylori', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción: enfermedad ácido-péptica y H. pylori en Colombia', 'Clase 1 · Clase 1 – Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la alta prevalencia de H. pylori en Colombia, su relación con el cáncer gástrico y el papel del QF en la adherencia a los esquemas de erradicación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=hYFEBfYlCYM","provider":"youtube","videoId":"hYFEBfYlCYM","title":"La enfermedad de las úlceras pépticas y la infección por H. pylori","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://revistabiomedica.org/index.php/biomedica/article/download/454/845/3836","title":"Sensibilidad in vitro a amoxicilina y claritromicina de Helicobacter pylori en pacientes de Tumaco (Biomédica 2012;32:32-42)","description":"Biomédica – Instituto Nacional de Salud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'ERGE: escalonamiento terapéutico, IBP a dosis estándar o doble y terapia a demanda', 'Clase 2 · Enfermedad por reflujo gastroesofágico (ERGE)', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la ruta de tratamiento de la ERGE: medidas higiénico-dietéticas, IBP por 8 semanas, mantenimiento a la dosis mínima eficaz o a demanda, y signos de alarma.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=G5AcFMVsdWk","provider":"youtube","videoId":"G5AcFMVsdWk","title":"Reflujo Gastroesofágico: Opciones de Tratamiento","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://siicsalud.com/dato/experto.php/80891","title":"[Página web] Inhibidores de la bomba de protones. Actualización","description":"SIIC Salud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Poblaciones especiales: ERGE en embarazo, pediatría y adulto mayor', 'Clase 2 · Enfermedad por reflujo gastroesofágico (ERGE)', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara las opciones seguras en el embarazo (alginatos, antiácidos, IBP con mayor experiencia), en pediatría y en el adulto mayor.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://scielo.isciii.es/pdf/diges/v103n2/informacionpaciente.pdf","title":"Información al paciente: inhibidores de la bomba de protones (Rev Esp Enferm Dig, v103 n2)","description":"SciELO España – Rev Esp Enferm Dig (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/dochtml/ft/82921/FT_82921.html","title":"[Página web] Ficha técnica Esomeprazol Cinfa 20 mg cápsulas gastrorresistentes","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Úlcera péptica: H. pylori, AINE y gastroprotección', 'Clase 3 · Úlcera péptica y Helicobacter pylori', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la etiología de la úlcera, los factores de riesgo de complicaciones por AINE y antitrombóticos, y las indicaciones de gastroprotección.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=hYFEBfYlCYM","provider":"youtube","videoId":"hYFEBfYlCYM","title":"La enfermedad de las úlceras pépticas y la infección por H. pylori","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.elsevier.es/es-revista-gastroenterologia-hepatologia-14-resumen-evidencias-e-incertidumbres-del-uso-S0210570510700029","title":"[Página web] Evidencias e incertidumbres del uso de los inhibidores de la bomba de protones","description":"Gastroenterología y Hepatología (Elsevier) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Maastricht VI/Florencia: esquemas actuales de erradicación', 'Clase 3 · Úlcera péptica y Helicobacter pylori', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las recomendaciones de Maastricht VI: cuádruple con bismuto de 14 días como primera línea donde la resistencia a claritromicina supera el 15 % o es desconocida, papel de la concomitante, rescate con levofloxacina y uso de P-CAB.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=dRhLye7ahPc","provider":"youtube","videoId":"dRhLye7ahPc","title":"HELICOBACTER PYLORI: terapia 1ª línea – Apuntes de Farmacia 2025","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://gut.bmj.com/content/71/9/1724","title":"[Página web] Management of Helicobacter pylori infection: the Maastricht VI/Florence consensus report (Gut 2022;71:1724)","description":"Gut – BMJ / European Helicobacter and Microbiota Study Group (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://cima.aemps.es/cima/dochtml/ft/75095/FT_75095.html","title":"[Página web] Ficha técnica PYLERA 140/125/125 mg cápsulas (bismuto, metronidazol, tetraciclina)","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Resistencia antimicrobiana de H. pylori en Colombia', 'Clase 3 · Úlcera péptica y Helicobacter pylori', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Analiza los datos colombianos de resistencia (claritromicina cercana al 20–30 %, metronidazol superior al 80 %, amoxicilina variable, tetraciclina baja) y sus implicaciones para la elección empírica.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://bibliotecadigital.udea.edu.co/dspace/handle/10495/32863","title":"[Página web] Patrón de susceptibilidad de Helicobacter pylori a cinco antibióticos: aislamientos de Antioquia 2019–2021","description":"Biblioteca Digital Universidad de Antioquia (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://revistabiomedica.org/index.php/biomedica/article/download/454/845/3836","title":"Sensibilidad in vitro a amoxicilina y claritromicina de Helicobacter pylori en pacientes de Tumaco (Biomédica 2012;32:32-42)","description":"Biomédica – Instituto Nacional de Salud (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://actamedicacolombiana.com/ojs/index.php/actamed/article/download/3476/2417","title":"Tratamiento de la infección gástrica con Helicobacter pylori: encuesta a médicos en Colombia (Acta Med Colomb 2001)","description":"Acta Médica Colombiana (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: fracaso de la triple terapia y rescate con cuádruple con bismuto', 'Clase 3 · Úlcera péptica y Helicobacter pylori', 6, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Paciente con fracaso del tratamiento con claritromicina; el QF propone el rescate, revisa interacciones (domperidona-claritromicina, alcohol-metronidazol) y diseña un plan de adherencia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=dRhLye7ahPc","provider":"youtube","videoId":"dRhLye7ahPc","title":"HELICOBACTER PYLORI: terapia 1ª línea – Apuntes de Farmacia 2025","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/dochtml/ft/75095/FT_75095.html","title":"[Página web] Ficha técnica PYLERA 140/125/125 mg cápsulas (bismuto, metronidazol, tetraciclina)","description":"CIMA – AEMPS (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Motilidad digestiva: antieméticos, procinéticos, laxantes, antidiarreicos, SII y probióticos', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción: control de la motilidad y del vómito', 'Clase 1 · Clase 1 – Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la fisiología de la motilidad, el centro del vómito, la zona gatillo quimiorreceptora y los receptores diana (D2, 5-HT3, 5-HT4, H1, M1, NK1).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=Zxcq4NUEcu8","provider":"youtube","videoId":"Zxcq4NUEcu8","title":"Antieméticos y eméticos - Generalidades","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ugr.es/~rsaucedo/temas/digesti3/digesti3.htm","title":"[Página web] Farmacología de la motilidad del aparato digestivo","description":"Universidad de Granada (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Metoclopramida: advertencias de seguridad (máximo 5 días, discinesia tardía)', 'Clase 2 · Antieméticos no oncológicos y procinéticos', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las restricciones de la ficha técnica: máximo 5 días, 30 mg/día, contraindicación en menores de 1 año y riesgo de síntomas extrapiramidales y de discinesia tardía irreversible.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cima.aemps.es/cima/dochtml/ft/75665/FT_75665.html","title":"[Página web] Ficha técnica Metoclopramida Accord 10 mg comprimidos","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.salusplay.com/apuntes/apuntes-de-farmacologia/farmacos-antiemeticos","title":"[Página web] Fármacos antieméticos – apuntes de farmacología","description":"SalusPlay (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Domperidona: riesgo de prolongación del QT e interacciones con inhibidores del CYP3A4', 'Clase 2 · Antieméticos no oncológicos y procinéticos', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el riesgo de arritmias y muerte súbita, la dosis máxima de 30 mg/día durante no más de 1 semana y las contraindicaciones con claritromicina, azoles e inhibidores de proteasa y en la hepatopatía moderada o grave.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cima.aemps.es/cima/dochtml/ft/67523/FT_67523.html","title":"[Página web] Ficha técnica Domperidona Pensa 10 mg comprimidos","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ugr.es/~rsaucedo/temas/digesti3/digesti3.htm","title":"[Página web] Farmacología de la motilidad del aparato digestivo","description":"Universidad de Granada (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Náuseas y vómitos en el embarazo, la gastroenteritis y el postoperatorio', 'Clase 2 · Antieméticos no oncológicos y procinéticos', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara la doxilamina-piridoxina, los antiH1, el ondansetrón y los procinéticos según el escenario clínico no oncológico.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.boletinfarmacologia.hc.edu.uy/images/2019/2019-2/3_boletin_antiemeticos_y_embarazo_1.pdf","title":"Antieméticos y embarazo – Boletín de Farmacología","description":"Hospital de Clínicas – Universidad de la República (Uruguay) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/dochtml/ft/69378/FT_69378.html","title":"[Página web] Ficha técnica Ondansetrón Normon 4 mg comprimidos","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Laxantes: formadores de masa, osmóticos, estimulantes, emolientes y secretagogos', 'Clase 3 · Estreñimiento, diarrea y síndrome de intestino irritable', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los laxantes por mecanismo, latencia y seguridad (macrogol, lactulosa, bisacodilo, senósidos) y los usos especiales: estreñimiento por opioides y adulto mayor.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=UW98eHl2GxI","provider":"youtube","videoId":"UW98eHl2GxI","title":"Laxantes Guía práctica Farmacología - Estreñimiento crónico y ocasional","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=UeFhsBtmrjU","provider":"youtube","videoId":"UeFhsBtmrjU","title":"Laxantes y catárticos - Generalidades","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://cima.aemps.es/cima/dochtml/ft/84126/FT_84126.html","title":"[Página web] Ficha técnica Macrogol Aurovitas 10 g polvo para solución oral","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Antidiarreicos y rehidratación: loperamida, racecadotrilo y SRO', 'Clase 3 · Estreñimiento, diarrea y síndrome de intestino irritable', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la loperamida (riesgo cardíaco en sobredosis, contraindicación en la diarrea invasiva y en menores), el racecadotrilo, y la prioridad de las sales de rehidratación oral según la OMS.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cima.aemps.es/cima/dochtml/ft/87970/FT_87970.html","title":"[Página web] Ficha técnica Loperamida Aurovitas 2 mg cápsulas","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.salusplay.com/apuntes/apuntes-de-farmacologia/farmacos-para-la-motilidad-intestinal-laxantes-y-antidiarreicos/resumen","title":"[Página web] Fármacos para la motilidad intestinal: laxantes y antidiarreicos","description":"SalusPlay (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Síndrome de intestino irritable: abordaje farmacológico por subtipo', 'Clase 3 · Estreñimiento, diarrea y síndrome de intestino irritable', 6, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el tratamiento del SII por subtipos (estreñimiento, diarrea, mixto): antiespasmódicos, fibra soluble, laxantes, loperamida, rifaximina, neuromoduladores y dieta baja en FODMAP.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=gnCoZ_2ZPxY","provider":"youtube","videoId":"gnCoZ_2ZPxY","title":"¿Cómo es el tratamiento del síndrome del intestino irritable?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.salusplay.com/apuntes/apuntes-de-farmacologia/farmacos-para-la-motilidad-intestinal-laxantes-y-antidiarreicos/resumen","title":"[Página web] Fármacos para la motilidad intestinal: laxantes y antidiarreicos","description":"SalusPlay (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Probióticos: lo que dice la evidencia', 'Clase 3 · Estreñimiento, diarrea y síndrome de intestino irritable', 7, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Analiza la evidencia dependiente de la cepa (diarrea asociada a antibióticos, prevención de C. difficile, SII, coadyuvante en la erradicación de H. pylori) y la regulación en Colombia como medicamento o suplemento.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=U3VpTD0y3mw","provider":"youtube","videoId":"U3VpTD0y3mw","title":"Intestino irritable y probióticos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://gut.bmj.com/content/71/9/1724","title":"[Página web] Management of Helicobacter pylori infection: the Maastricht VI/Florence consensus report (Gut 2022;71:1724)","description":"Gut – BMJ / European Helicobacter and Microbiota Study Group (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: adulto mayor con náuseas, polifarmacia y prolongación del QT', 'Clase 4 · Caso clínico de motilidad', 8, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Paciente con domperidona, claritromicina y citalopram; el QF detecta la interacción, propone alternativas y reporta a farmacovigilancia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cima.aemps.es/cima/dochtml/ft/67523/FT_67523.html","title":"[Página web] Ficha técnica Domperidona Pensa 10 mg comprimidos","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/dochtml/ft/75665/FT_75665.html","title":"[Página web] Ficha técnica Metoclopramida Accord 10 mg comprimidos","description":"CIMA – AEMPS (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Enfermedad inflamatoria intestinal', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción: colitis ulcerosa y enfermedad de Crohn', 'Clase 1 · Clase 1 – Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume las diferencias entre la colitis ulcerosa y la enfermedad de Crohn, los objetivos terapéuticos (remisión clínica y endoscópica) y las estrategias de escalonamiento frente a top-down.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://gruposdetrabajo.sefh.es/infografias/backend/pdfs/Guia_practica_farmaceutica_EII.pdf","title":"Guía de práctica farmacéutica en enfermedad inflamatoria intestinal","description":"Sociedad Española de Farmacia Hospitalaria (SEFH) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Aminosalicilatos y corticoides (budesonida, prednisona)', 'Clase 2 · Terapia convencional', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la mesalazina por formulación y lugar de liberación, la sulfasalazina, la budesonida MMX y la de liberación ileal, y los corticoides sistémicos, con su monitorización renal y metabólica.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=4SS--RcgcrA","provider":"youtube","videoId":"4SS--RcgcrA","title":"Tratamiento de la Colitis Ulcerativa Crónica Inespecífica (CUCI): Manejo médico y Cirugía","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/dochtml/ft/77022/FT_77022.html","title":"[Página web] Ficha técnica Pentasa 1 g comprimidos de liberación prolongada (mesalazina)","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Tiopurinas y TPMT; metotrexato', 'Clase 2 · Terapia convencional', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el genotipo o fenotipo de TPMT antes de la azatioprina, la interacción con el alopurinol (reducir al 25 %), la monitorización hematológica y hepática, y el metotrexato en el Crohn (ácido fólico, teratogenicidad).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cima.aemps.es/cima/dochtml/ft/50043/FT_50043.html","title":"[Página web] Ficha técnica Imurel 50 mg comprimidos (azatioprina)","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/dochtml/ft/62121/FT_62121.html","title":"[Página web] Ficha técnica Metotrexato Pfizer 25 mg/ml solución inyectable","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Anti-TNF (infliximab, adalimumab) y biosimilares', 'Clase 3 · Terapias avanzadas: biológicos y pequeñas moléculas', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el mecanismo, la inmunogenicidad, la monitorización de niveles, el cribado de TB y VHB y el uso de biosimilares.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=2SJmLzxiyKk","provider":"youtube","videoId":"2SJmLzxiyKk","title":"Biosimilares en Crohn y colitis ulcerosa: adalimumab e infliximab. Tu Farmacéutico","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/dochtml/ft/99116001/FT_99116001.html","title":"[Página web] Ficha técnica Remicade 100 mg (infliximab)","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://gruposdetrabajo.sefh.es/infografias/backend/pdfs/Guia_practica_farmaceutica_EII.pdf","title":"Guía de práctica farmacéutica en enfermedad inflamatoria intestinal","description":"Sociedad Española de Farmacia Hospitalaria (SEFH) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Vedolizumab y ustekinumab: selectividad intestinal y vía IL-12/23', 'Clase 3 · Terapias avanzadas: biológicos y pequeñas moléculas', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara la anti-integrina α4β7 y la anti-IL-12/23 por su eficacia, seguridad, vía de administración y lugar en la terapia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=r5j2FlvfBHg","provider":"youtube","videoId":"r5j2FlvfBHg","title":"Novedades en el tratamiento de la Colitis Ulcerosa y la Enfermedad de Crohn - Dr. Miquel Sans","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/dochtml/ft/114923001/FT_114923001.html","title":"[Página web] Ficha técnica Entyvio 300 mg (vedolizumab)","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://cima.aemps.es/cima/dochtml/ft/108494005/FT_108494005.html","title":"[Página web] Ficha técnica Stelara 130 mg (ustekinumab)","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Inhibidores JAK (tofacitinib, upadacitinib) y restricciones de seguridad', 'Clase 3 · Terapias avanzadas: biológicos y pequeñas moléculas', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las restricciones de la EMA por eventos cardiovasculares mayores, trombosis, neoplasias y edad igual o mayor a 65 años, y la pauta de inducción y mantenimiento en la colitis ulcerosa.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cima.aemps.es/cima/dochtml/ft/1171178007/FT_1171178007.html","title":"[Página web] Ficha técnica Xeljanz 5/10 mg comprimidos (tofacitinib)","description":"CIMA – AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.farmaceuticos.com/noticias/enfermedad-de-crohn-terapias-biologicas-y-dianas-prometedoras-que-revolucionan-su-abordaje/","title":"[Página web] Enfermedad de Crohn: terapias biológicas y dianas prometedoras que revolucionan su abordaje","description":"Consejo General de Colegios Farmacéuticos (España) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Monitorización, vacunación y embarazo en pacientes con EII', 'Clase 4 · Atención farmacéutica en la EII', 6, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica el plan de monitorización de laboratorio, el esquema de vacunas (sin vacunas vivas) y la compatibilidad de los fármacos con el embarazo y la lactancia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=IA72Hk1JnAA","provider":"youtube","videoId":"IA72Hk1JnAA","title":"Tratamiento de la Enfermedad de Crohn: Medicamentos y Cirugía","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://gruposdetrabajo.sefh.es/infografias/backend/pdfs/Guia_practica_farmaceutica_EII.pdf","title":"Guía de práctica farmacéutica en enfermedad inflamatoria intestinal","description":"Sociedad Española de Farmacia Hospitalaria (SEFH) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: inicio de infliximab con azatioprina en el sistema de salud colombiano', 'Clase 4 · Atención farmacéutica en la EII', 7, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Caso integrador de cribado, MIPRES y PBS, educación al paciente, interacciones y farmacovigilancia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar el seguimiento farmacoterapéutico a un paciente con enfermedad inflamatoria intestinal (EII) que inicia terapia biológica dentro del sistema de salud colombiano.</p><p>Desarrollo: los biológicos y las pequeñas moléculas para la EII (infliximab, adalimumab, vedolizumab, ustekinumab, inhibidores JAK) son tecnologías de alto costo. Su prescripción y dispensación pueden requerir trámites como MIPRES según su inclusión en el Plan de Beneficios en Salud vigente, por lo que el QF debe verificar la cobertura y la continuidad de la entrega, ya que las interrupciones favorecen la inmunogenicidad y la pérdida de respuesta. Antes del inicio deben estar documentados: el cribado de tuberculosis latente (PPD o IGRA y radiografía de tórax), las serologías de hepatitis B y C y de VIH, el esquema de vacunación (las vacunas vivas atenuadas están contraindicadas durante la inmunosupresión) y, en el caso de los JAK, el perfil lipídico y la evaluación del riesgo cardiovascular y tromboembólico.</p><p>Caso: hombre de 32 años en Cali con enfermedad de Crohn ileocolónica, corticodependiente pese a azatioprina (TPMT normal, con leucopenia leve). El gastroenterólogo indica infliximab en combinación con azatioprina. Intervenciones del QF:<br>1. Verificar el cribado de TB, el VHB (si el HBsAg o el anti-HBc son positivos, se requiere valoración para profilaxis) y la vacunación (influenza, neumococo y hepatitis B inactivadas; no aplicar fiebre amarilla durante el tratamiento, lo cual es relevante en Colombia para viajeros a zonas endémicas).<br>2. Educar sobre las reacciones infusionales, los signos de infección y la necesidad de no suspender el tratamiento por su cuenta.<br>3. Coordinar la monitorización: hemograma y transaminasas por la azatioprina; niveles valle de infliximab y anticuerpos antifármaco cuando haya pérdida de respuesta (monitorización terapéutica de fármacos, véase la guía de la SEFH).<br>4. Revisar las interacciones: alopurinol con azatioprina (reducir la azatioprina al 25 %) y vacunas vivas.<br>5. Gestionar MIPRES y la continuidad de las entregas con el gestor farmacéutico, y notificar cualquier sospecha de reacción adversa al programa de farmacovigilancia del INVIMA.<br>6. Considerar el cambio a un biosimilar según la política institucional, informando al paciente.</p><p>A los 6 meses el paciente está en remisión libre de esteroides y el QF registra los indicadores de adherencia y de seguridad.</p><p>Puntos clave:<br>1. Antes del biológico: TB, VHB y VHC, VIH, vacunas inactivadas al día y ninguna vacuna viva.<br>2. La continuidad de la dispensación y la monitorización de niveles reducen la pérdida de respuesta por inmunogenicidad.<br>3. El QF integra los aspectos clínicos, administrativos (MIPRES/PBS) y de farmacovigilancia.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Hígado y páncreas: cirrosis, hepatotoxicidad y enzimas pancreáticas', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción: el hígado como órgano de biotransformación', 'Clase 1 · Clase 1 – Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume el metabolismo de fase I y II, la extracción hepática y por qué la enfermedad hepática altera la farmacoterapia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=g_Gq124kIXQ","provider":"youtube","videoId":"g_Gq124kIXQ","title":"Farmacocinética: metabolismo o biotransformación del fármaco (parte 1)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Cambios farmacocinéticos y farmacodinámicos en la cirrosis', 'Clase 2 · Farmacología en la cirrosis y ajuste por Child-Pugh', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los cambios en el primer paso, la unión a proteínas y el volumen de distribución, y los fármacos a evitar (AINE, benzodiacepinas de vida media larga).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://pubmed.ncbi.nlm.nih.gov/41665246/","title":"[Página web] Vonoprazan Is Associated With Better Liver-Related Outcomes Compared With PPIs in Cirrhosis","description":"PubMed (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 2, '{"html":"<p>Objetivo: interpretar cómo la cirrosis modifica la farmacocinética y la farmacodinamia, y qué fármacos requieren especial vigilancia.</p><p>Desarrollo: la cirrosis altera la disposición de los fármacos por cuatro vías. (1) Reducción del flujo sanguíneo hepático y derivaciones portosistémicas: los fármacos de alta extracción hepática (propranolol, morfina, verapamilo, midazolam oral) pierden el efecto de primer paso, aumentan su biodisponibilidad oral y requieren dosis iniciales menores. (2) Disminución de la masa y la función de los hepatocitos: el metabolismo de fase I (CYP450) se afecta más precozmente que la glucuronidación, de modo que lorazepam u oxazepam son preferibles a diazepam. (3) Hipoalbuminemia: aumenta la fracción libre de los fármacos muy unidos a proteínas (fenitoína, AINE, ácido valproico), lo que obliga a interpretar con cautela las concentraciones totales. (4) Ascitis y aumento del volumen de distribución de los fármacos hidrosolubles; además, con frecuencia coexiste disfunción renal (síndrome hepatorrenal) que se subestima con la creatinina sérica por la baja masa muscular.</p><p>En farmacodinamia, el paciente cirrótico es más sensible a los depresores del SNC (riesgo de encefalopatía), a los AINE (insuficiencia renal, hemorragia, resistencia a diuréticos) y a los aminoglucósidos (nefrotoxicidad). Los AINE deben evitarse. El paracetamol es el analgésico de elección, a dosis reducidas (en general no más de 2 g/día), y los opioides se usan con cautela, junto con laxantes para prevenir la encefalopatía. Los IBP prolongados se han asociado con peritonitis bacteriana espontánea y encefalopatía, por lo que se debe revisar su indicación.</p><p>Fármacos propios de la cirrosis que el QF debe dominar: betabloqueantes no selectivos (propranolol, carvedilol) para la hipertensión portal; espironolactona con furosemida para la ascitis (vigilar sodio, potasio y creatinina); lactulosa y rifaximina para la encefalopatía hepática; y profilaxis antibiótica de la peritonitis bacteriana espontánea según la indicación.</p><p>Caso aplicado: hombre de 58 años en Medellín, con cirrosis alcohólica Child-Pugh B, que acude a la droguería con dolor lumbar y pide naproxeno. El QF identifica la contraindicación relativa, recomienda paracetamol a dosis máxima de 2 g/día, remite al médico y reporta la consulta en el seguimiento farmacoterapéutico.</p><p>Puntos clave:<br>1. La cirrosis aumenta la biodisponibilidad oral de los fármacos de alta extracción y la fracción libre de los fármacos muy unidos a proteínas.<br>2. Evitar AINE y benzodiacepinas de vida media larga; preferir paracetamol a dosis reducida.<br>3. La creatinina sobreestima la función renal en el cirrótico: interpretar con cautela al ajustar dosis.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Ajuste de dosis según Child-Pugh: procedimiento con ficha técnica', 'Clase 2 · Farmacología en la cirrosis y ajuste por Child-Pugh', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta el cálculo de Child-Pugh y la búsqueda sistemática en la ficha técnica para ajustar o contraindicar fármacos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: ejecutar un ajuste de dosis basado en la clasificación de Child-Pugh usando la ficha técnica como fuente principal.</p><p>Desarrollo: a diferencia de la función renal, no existe un marcador hepático único que prediga el aclaramiento de los fármacos. La escala de Child-Pugh combina bilirrubina, albúmina, tiempo de protrombina o INR, ascitis y encefalopatía, y clasifica al paciente en A (5–6 puntos, leve), B (7–9, moderada) y C (10–15, grave). Las agencias regulatorias (FDA, EMA) exigen estudios farmacocinéticos en insuficiencia hepática estratificados por Child-Pugh, por lo que las fichas técnicas expresan sus recomendaciones con esta escala. El score MELD se usa para pronóstico y trasplante, no para dosificar.</p><p>Procedimiento del QF en cinco pasos:<br>1. Calcular o verificar el Child-Pugh con datos recientes de la historia clínica.<br>2. Consultar la sección 4.2 (Posología) y 4.3 (Contraindicaciones) de la ficha técnica, además de la 5.2 (Farmacocinética), para cada fármaco del perfil.<br>3. Clasificar el fármaco: sin ajuste; ajuste de dosis o intervalo; uso con precaución; o contraindicado (por ejemplo, la domperidona está contraindicada en la insuficiencia hepática moderada o grave y el metotrexato en la hepatopatía significativa).<br>4. Cuando no hay datos, aplicar principios farmacocinéticos: en fármacos de alta extracción reducir la dosis oral; en fármacos de baja extracción con metabolismo hepático, alargar el intervalo y titular lentamente (\"start low, go slow\").<br>5. Monitorizar la respuesta clínica, la función hepática y los signos de encefalopatía, y documentar la recomendación.</p><p>Ejemplos en gastroenterología: los IBP pueden requerir una dosis máxima reducida en la insuficiencia hepática grave (revisar cada ficha técnica); la metoclopramida debe reducirse en la insuficiencia hepática grave; la terapia cuádruple con bismuto está contraindicada en la insuficiencia hepática; y los inhibidores JAK y varios biológicos tienen restricciones en hepatopatía grave.</p><p>Caso aplicado: mujer de 63 años con cirrosis por esteatohepatitis (bilirrubina 2,4 mg/dL, albúmina 2,9 g/dL, INR 1,8, ascitis leve controlada, sin encefalopatía: Child-Pugh B, 9 puntos) a la que se prescribe domperidona por náuseas. El QF identifica la contraindicación en la ficha técnica y sugiere una alternativa según la valoración médica, a la dosis más baja y por el menor tiempo posible.</p><p>Puntos clave:<br>1. Child-Pugh es la escala usada en las fichas técnicas para el ajuste en la insuficiencia hepática; MELD no sirve para dosificar.<br>2. Ante la falta de datos, aplicar los principios de extracción hepática y titular lentamente.<br>3. Documentar las contraindicaciones (domperidona, Pylera, metotrexato) y monitorizar la encefalopatía.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'DILI: mecanismos, patrones (índice R) y fármacos implicados', 'Clase 3 · Hepatotoxicidad inducida por fármacos (DILI)', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el DILI intrínseco frente al idiosincrásico, el índice R, la ley de Hy y los fármacos y productos herbales más implicados.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=ROS23nX93lA","provider":"youtube","videoId":"ROS23nX93lA","title":"Hepatotoxicidad por fármacos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=IBMEp2jU2ws","provider":"youtube","videoId":"IBMEp2jU2ws","title":"Hepatotoxicidad inducida por fármacos | Ciencia en pequeñas dosis","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC12627584/","title":"[Página web] Identifying high-risk drugs and demographic patterns in drug-induced liver injury from FAERS and CVARD analyses","description":"PubMed Central – NCBI (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Evaluación de causalidad (RUCAM/RECAM) y manejo', 'Clase 3 · Hepatotoxicidad inducida por fármacos (DILI)', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la evaluación de causalidad, la retirada del fármaco, la N-acetilcisteína y la reexposición.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=0KUhTYeukXQ","provider":"youtube","videoId":"0KUhTYeukXQ","title":"Conferencia \"Toxicidad de los medicamentos en el hígado: resolviendo el puzle\"","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC10627588/","title":"[Página web] Advances in the management of idiosyncratic drug-induced liver injury","description":"PubMed Central – NCBI (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: ictericia colestásica tras amoxicilina-clavulánico y un producto herbal', 'Clase 3 · Hepatotoxicidad inducida por fármacos (DILI)', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El QF construye la línea de tiempo, evalúa la causalidad y reporta al INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar un enfoque sistemático ante la sospecha de lesión hepática inducida por fármacos (DILI) en un paciente polimedicado y realizar el reporte de farmacovigilancia.</p><p>Desarrollo: el DILI es una causa importante de hepatitis aguda y de falla hepática aguda. Se distinguen el DILI intrínseco, que depende de la dosis y es predecible (paracetamol), y el idiosincrásico, que es impredecible (amoxicilina-clavulánico, isoniazida, AINE, antiepilépticos, productos herbales y suplementos). El patrón de lesión se define con el índice R = (ALT/LSN) ÷ (FA/LSN): un R ≥ 5 indica un patrón hepatocelular, un R ≤ 2 colestásico, y un valor intermedio, mixto. La causalidad se valora con la escala RUCAM o su versión actualizada (RECAM), considerando la latencia, la evolución tras la retirada (dechallenge), la exclusión de otras causas (hepatitis virales, autoinmune, biliar, alcohol) y el riesgo conocido del fármaco (base LiverTox). La ley de Hy (ALT &gt; 3×LSN con bilirrubina &gt; 2×LSN, sin colestasis) predice una mortalidad cercana al 10 %. Las medidas clave son suspender el fármaco sospechoso, monitorizar el INR y la bilirrubina y, en la sobredosis de paracetamol, administrar N-acetilcisteína.</p><p>Caso: mujer de 45 años en Barranquilla que tomó amoxicilina-clavulánico por sinusitis y 3 semanas después presenta ictericia y prurito. Analítica: ALT 4×LSN, FA 3×LSN (R ≈ 1,3, patrón colestásico). Además consume un \"té quemador de grasa\" sin registro sanitario y omeprazol crónico. El QF:<br>1. Elabora la línea de tiempo de todos los fármacos y productos naturales, incluidos los no registrados.<br>2. Identifica la amoxicilina-clavulánico como sospechoso principal (latencia compatible y patrón colestásico típico, que puede aparecer incluso tras la suspensión) y el producto herbal como factor concomitante.<br>3. Recomienda suspender el producto herbal y revisar la indicación del IBP.<br>4. Reporta el evento al INVIMA mediante el formato de reporte de eventos adversos o la plataforma de farmacovigilancia vigente, y notifica el producto sin registro a la secretaría de salud.<br>5. Educa a la paciente para evitar la reexposición y registra la alergia o intolerancia en la historia clínica.</p><p>Puntos clave:<br>1. Calcular el índice R para clasificar el patrón de DILI y aplicar RUCAM o RECAM para la causalidad.<br>2. La ley de Hy es una señal de gravedad: requiere remisión inmediata.<br>3. Incluir siempre los productos herbales y suplementos en la anamnesis y reportar al INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Terapia de reemplazo con enzimas pancreáticas', 'Clase 4 · Enzimas pancreáticas', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica la dosificación por unidades de lipasa con las comidas, la técnica de administración, el uso coadyuvante de IBP y el seguimiento en la insuficiencia pancreática exocrina y la fibrosis quística.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC6858980/","title":"[Página web] Pancreatic Enzyme Replacement Therapy: A Concise Review (JOP 2019)","description":"PubMed Central – NCBI (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/dochtml/ft/58719/FT_58719.html","title":"[Página web] Ficha técnica Kreon 10.000 U cápsulas gastrorresistentes (pancreatina)","description":"CIMA – AEMPS (ES)"}'::jsonb);

END
$curso$;

-- ─── 11. Curso de Farmacología Renal (35 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Farmacología Renal' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Farmacología Renal', 'Curso para Químicos Farmacéuticos sobre la farmacología aplicada al riñón: diuréticos, trastornos hidroelectrolíticos y nefrotoxicidad por medicamentos, estimación de la función renal y ajuste de dosis, farmacoterapia de la ERC según KDIGO, inmunosupresión en trasplante renal e infecciones urinarias.', '<p>Curso para Químicos Farmacéuticos sobre la farmacología aplicada al riñón: diuréticos, trastornos hidroelectrolíticos y nefrotoxicidad por medicamentos, estimación de la función renal y ajuste de dosis, farmacoterapia de la ERC según KDIGO, inmunosupresión en trasplante renal e infecciones urinarias. Integra el contexto colombiano de la Cuenta de Alto Costo y la guía nacional de ERC con casos clínicos de intervención farmacéutica.</p><h3>Objetivo general</h3><p>Desarrollar en el Químico Farmacéutico las competencias para seleccionar, ajustar y monitorizar fármacos en pacientes con alteración de la función renal, prevenir la nefrotoxicidad y los trastornos electrolíticos inducidos por medicamentos y realizar seguimiento farmacoterapéutico en ERC, diálisis y trasplante renal, conforme a las guías KDIGO y al marco colombiano.</p><h3>A quién va dirigido</h3><p>Químicos Farmacéuticos de servicios farmacéuticos hospitalarios y ambulatorios, unidades renales, programas de nefroprotección y gestores de EPS/IPS en Colombia; estudiantes de último año de Química Farmacéutica.</p><h3>Contexto normativo</h3><p>Colombia — GPC MinSalud/IETS, PBS/MIPRES, INVIMA</p>',
          'Farmacología', 'intermedio', 'Desarrollar en el Químico Farmacéutico las competencias para seleccionar, ajustar y monitorizar fármacos en pacientes con alteración de la función renal, prevenir la nefrotoxicidad y los trastornos electrolíticos inducidos por medicamentos y realizar seguimiento farmacoterapéutico en ERC, diálisis y trasplante renal, conforme a las guías KDIGO y al marco colombiano.', 'Químicos Farmacéuticos de servicios farmacéuticos hospitalarios y ambulatorios, unidades renales, programas de nefroprotección y gestores de EPS/IPS en Colombia; estudiantes de último año de Química Farmacéutica.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Fisiología renal aplicada a los fármacos y estimación de la función renal', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: el riñón como órgano diana y vía de eliminación de fármacos', 'Clase 1 · Clase 1 – Introducción al curso', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Presenta el alcance del curso, la carga de la ERC en Colombia y el papel del QF en nefroprotección y ajuste de dosis.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=h0XVOlnQHPY","provider":"youtube","videoId":"h0XVOlnQHPY","title":"Fármacos que actúan sobre la función renal con Harper Academia & uDocz | Nivel básico","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cuentadealtocosto.org/enfermedades-de-alto-costo/erc/","title":"[Página web] ERC – Cuenta de Alto Costo (sección de enfermedad renal crónica)","description":"Cuenta de Alto Costo (CAC) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Filtración glomerular, secreción y reabsorción tubular de fármacos', 'Clase 2 · Procesos renales que determinan la disposición de los fármacos', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la filtración dependiente de la fracción libre, la secreción tubular por transportadores (OAT, OCT, P-gp, MATE) y la reabsorción pasiva dependiente del pH urinario.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=h0XVOlnQHPY","provider":"youtube","videoId":"h0XVOlnQHPY","title":"Fármacos que actúan sobre la función renal con Harper Academia & uDocz | Nivel básico","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://sanidad.castillalamancha.es/sites/sescam.castillalamancha.es/files/documentos/farmacia/farmacos_en_insuficiencia_renal_y_hepatica.pdf","title":"Fármacos en insuficiencia renal y hepática (Boletín Farmacoterapéutico de Castilla-La Mancha, 2011)","description":"SESCAM – Servicio de Farmacia CHU Albacete (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Cambios farmacocinéticos en la enfermedad renal crónica', 'Clase 2 · Procesos renales que determinan la disposición de los fármacos', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta cómo la ERC modifica absorción, unión a proteínas, volumen de distribución, metabolismo y excreción, incluida la acumulación de metabolitos activos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://sanidad.castillalamancha.es/sites/sescam.castillalamancha.es/files/documentos/farmacia/farmacos_en_insuficiencia_renal_y_hepatica.pdf","title":"Fármacos en insuficiencia renal y hepática (Boletín Farmacoterapéutico de Castilla-La Mancha, 2011)","description":"SESCAM – Servicio de Farmacia CHU Albacete (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Cockcroft-Gault frente a CKD-EPI 2021: qué ecuación usar para dosificar', 'Clase 3 · Estimación de la función renal y ajuste de dosis', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara la estimación del aclaramiento de creatinina y de la TFGe (CKD-EPI 2021 sin coeficiente de raza, cistatina C), sus limitaciones y su uso según ficha técnica y KDIGO 2024.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://kdigo.org/guidelines/ckd-evaluation-and-management/","title":"[Página web] KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of CKD (suite de documentos)","description":"KDIGO (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: ajuste de dosis en un adulto mayor con ERC estadio 3b', 'Clase 3 · Estimación de la función renal y ajuste de dosis', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El QF estima la función renal, identifica fármacos que requieren ajuste (antimicrobianos, antidiabéticos, anticoagulantes) y propone dosis según ficha técnica.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.sspa.juntadeandalucia.es/servicioandaluzdesalud/hrs3/fileadmin/user_upload/area_atencion_alprofesional/acceso_pro/area_medica/dosificacion_atb_ir.pdf","title":"Recomendaciones sobre el ajuste de dosis de antimicrobianos en adultos con insuficiencia renal (2011)","description":"Servicio Andaluz de Salud – Farmacocinética Clínica (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://sanidad.castillalamancha.es/sites/sescam.castillalamancha.es/files/documentos/farmacia/farmacos_en_insuficiencia_renal_y_hepatica.pdf","title":"Fármacos en insuficiencia renal y hepática (Boletín Farmacoterapéutico de Castilla-La Mancha, 2011)","description":"SESCAM – Servicio de Farmacia CHU Albacete (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Diuréticos: farmacología y uso clínico', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: los diuréticos según su sitio de acción en la nefrona', 'Clase 1 · Clase 1 – Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la clasificación de los diuréticos por segmento tubular y sus usos en hipertensión, insuficiencia cardiaca, cirrosis y ERC.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://espanol.libretexts.org/Bookshelves/Salud/Enfermeria/Farmacologia_de_Enfermeria_(OpenRN)/06%3A_Sistema_Cardiovascular_y_Renal/6.09%3A_Diur%C3%A9ticos","title":"[Página web] Farmacología de Enfermería (OpenRN) – 6.9 Diuréticos","description":"LibreTexts Español (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Diuréticos de asa: furosemida, bumetanida y torasemida', 'Clase 2 · Diuréticos de asa y tiazídicos', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la inhibición del cotransportador NKCC2, la farmacocinética (biodisponibilidad variable, secreción tubular), la curva dosis-respuesta y sus efectos adversos (ototoxicidad, hipopotasemia, hipomagnesemia).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=DTY2C_Ic76g","provider":"youtube","videoId":"DTY2C_Ic76g","title":"Diuréticos tiazídicos, de asa y ahorradores de potasio (fármacos antihipertensivos)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://nefrologiaaldia.org/es-articulo-diureticos-217-pdf","title":"[Página web] Diuréticos y alteraciones electrolíticas (Nefrología al Día, 2019)","description":"Sociedad Española de Nefrología – Nefrología al Día (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Tiazidas y similares: hidroclorotiazida, clortalidona e indapamida', 'Clase 2 · Diuréticos de asa y tiazídicos', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara la inhibición del cotransportador NCC, la potencia y duración, el papel en hipertensión y ERC avanzada, y los efectos metabólicos (hiponatremia, hipopotasemia, hiperuricemia, hiperglucemia).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=PE2i7C7kiAE","provider":"youtube","videoId":"PE2i7C7kiAE","title":"Diuréticos (farmacología)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://nefrologiaaldia.org/es-articulo-diureticos-217-pdf","title":"[Página web] Diuréticos y alteraciones electrolíticas (Nefrología al Día, 2019)","description":"Sociedad Española de Nefrología – Nefrología al Día (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Ahorradores de potasio: espironolactona, eplerenona, amilorida y triamtereno', 'Clase 3 · Ahorradores de potasio, inhibidores de anhidrasa carbónica y osmóticos', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el antagonismo del receptor mineralocorticoide y el bloqueo de ENaC, sus indicaciones y el riesgo de hiperpotasemia combinado con IECA/ARA-II.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=oSfqLR5QSDk","provider":"youtube","videoId":"oSfqLR5QSDk","title":"Diuréticos como nunca te los habían explicado","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.lecturio.com/es/concepts/diureticos-ahorradores-de-potasio/","title":"[Página web] Diuréticos ahorradores de potasio","description":"Lecturio (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Acetazolamida y manitol: inhibidores de anhidrasa carbónica y diuréticos osmóticos', 'Clase 3 · Ahorradores de potasio, inhibidores de anhidrasa carbónica y osmóticos', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el mecanismo, usos actuales (glaucoma, mal de altura, alcalosis metabólica, hipertensión intracraneal) y precauciones de acetazolamida y manitol.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=bo5cL_1nx7Q","provider":"youtube","videoId":"bo5cL_1nx7Q","title":"Diuréticos: importancia del mecanismo de acción","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://espanol.libretexts.org/Bookshelves/Salud/Enfermeria/Farmacologia_de_Enfermeria_(OpenRN)/06%3A_Sistema_Cardiovascular_y_Renal/6.09%3A_Diur%C3%A9ticos","title":"[Página web] Farmacología de Enfermería (OpenRN) – 6.9 Diuréticos","description":"LibreTexts Español (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Resistencia diurética y bloqueo secuencial de la nefrona', 'Clase 4 · Uso clínico y resistencia diurética', 5, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las causas de resistencia (umbral de natriuresis, rebote posdiurético, hipertrofia del túbulo distal, AINE, ingesta de sal) y las estrategias: aumento de dosis, infusión, combinación con tiazida o acetazolamida.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=B4fdhV8IjJY","provider":"youtube","videoId":"B4fdhV8IjJY","title":"Indicaciones y uso de diuréticos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://nefrologiaaldia.org/es-articulo-diureticos-217-pdf","title":"[Página web] Diuréticos y alteraciones electrolíticas (Nefrología al Día, 2019)","description":"Sociedad Española de Nefrología – Nefrología al Día (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: paciente con insuficiencia cardiaca y ERC con edema refractario e hipopotasemia', 'Clase 4 · Uso clínico y resistencia diurética', 6, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El QF analiza el esquema diurético, identifica la causa de resistencia y la hipopotasemia, y propone ajustes y monitorización de electrolitos y función renal.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=DTY2C_Ic76g","provider":"youtube","videoId":"DTY2C_Ic76g","title":"Diuréticos tiazídicos, de asa y ahorradores de potasio (fármacos antihipertensivos)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://nefrologiaaldia.org/es-articulo-diureticos-217-pdf","title":"[Página web] Diuréticos y alteraciones electrolíticas (Nefrología al Día, 2019)","description":"Sociedad Española de Nefrología – Nefrología al Día (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Trastornos hidroelectrolíticos inducidos por fármacos y nefrotoxicidad', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: el fármaco como causa de daño renal y de alteraciones electrolíticas', 'Clase 1 · Clase 1 – Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume los principales mecanismos de nefrotoxicidad y de alteraciones de sodio, potasio y magnesio inducidas por medicamentos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=iQqlkuMJ39o","provider":"youtube","videoId":"iQqlkuMJ39o","title":"Nefrotoxicidad por fármacos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://kdigo.org/wp-content/uploads/2019/01/KDIGO-2012-AKI-Guideline-English.pdf","title":"KDIGO 2012 Clinical Practice Guideline for Acute Kidney Injury","description":"KDIGO (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Hipopotasemia e hiperpotasemia inducidas por fármacos', 'Clase 2 · Alteraciones electrolíticas por medicamentos', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los fármacos que reducen (diuréticos, agonistas beta-2, insulina) o elevan el potasio (IECA/ARA-II, ARM, TMP-SMX, inhibidores de calcineurina, heparina, betabloqueadores) y su manejo.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=HKiI7rWxvKU","provider":"youtube","videoId":"HKiI7rWxvKU","title":"Trastornos del potasio (hiperkalemia e hipokalemia)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.revistanefrologia.com/en-consensus-document-on-management-hyperkalemia-avance-S2013251423001785","title":"[Página web] Consensus document on the management of hyperkalemia (SEN, SEMES, SEEN, SEMI, SEC; Nefrología 2023)","description":"Revista Nefrología (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Hiponatremia y alteraciones del magnesio por medicamentos', 'Clase 2 · Alteraciones electrolíticas por medicamentos', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la hiponatremia por tiazidas, ISRS, carbamazepina/oxcarbazepina, desmopresina y otros, y la hipomagnesemia por IBP, diuréticos, cisplatino e inhibidores de calcineurina.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=8TjzdwZZddM","provider":"youtube","videoId":"8TjzdwZZddM","title":"Trastornos del sodio: hiponatremia e hipernatremia","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://nefrologiaaldia.org/es-articulo-diureticos-217-pdf","title":"[Página web] Diuréticos y alteraciones electrolíticas (Nefrología al Día, 2019)","description":"Sociedad Española de Nefrología – Nefrología al Día (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'AINE, IECA/ARA-II y el "triple whammy": nefrotoxicidad hemodinámica', 'Clase 3 · Nefrotoxicidad por medicamentos', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la autorregulación de la TFG y cómo la combinación de AINE, bloqueo del SRAA y diuréticos precipita lesión renal aguda.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=iQqlkuMJ39o","provider":"youtube","videoId":"iQqlkuMJ39o","title":"Nefrotoxicidad por fármacos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://kdigo.org/wp-content/uploads/2019/01/KDIGO-2012-AKI-Guideline-English.pdf","title":"KDIGO 2012 Clinical Practice Guideline for Acute Kidney Injury","description":"KDIGO (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Aminoglucósidos y vancomicina: nefrotoxicidad y monitorización terapéutica', 'Clase 3 · Nefrotoxicidad por medicamentos', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica los principios de dosificación de aminoglucósidos en intervalo extendido y de vancomicina guiada por AUC/CMI o niveles, con ajuste en insuficiencia renal y diálisis.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=wxenFAiQ45U","provider":"youtube","videoId":"wxenFAiQ45U","title":"Clase nefrotoxicidad por fármacos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=_70B9n70DkM","provider":"youtube","videoId":"_70B9n70DkM","title":"Antibiotic dosing in renal failure: the mistake that delays bacterial killing","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.sspa.juntadeandalucia.es/servicioandaluzdesalud/hrs3/fileadmin/user_upload/area_atencion_alprofesional/acceso_pro/area_medica/dosificacion_atb_ir.pdf","title":"Recomendaciones sobre el ajuste de dosis de antimicrobianos en adultos con insuficiencia renal (2011)","description":"Servicio Andaluz de Salud – Farmacocinética Clínica (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Contraste yodado y otras nefrotoxinas: prevención en la práctica', 'Clase 3 · Nefrotoxicidad por medicamentos', 5, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el riesgo de lesión renal asociada a contraste, las medidas preventivas basadas en evidencia (hidratación isotónica, evitar nefrotóxicos concomitantes) y el manejo de metformina.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=iQqlkuMJ39o","provider":"youtube","videoId":"iQqlkuMJ39o","title":"Nefrotoxicidad por fármacos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://kdigo.org/wp-content/uploads/2019/01/KDIGO-2012-AKI-Guideline-English.pdf","title":"KDIGO 2012 Clinical Practice Guideline for Acute Kidney Injury","description":"KDIGO (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: "triple whammy" y toxicidad por litio en una adulta mayor', 'Clase 4 · Caso clínico de la unidad', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El QF detecta una lesión renal aguda por AINE + ARA-II + tiazida con elevación de litemia, interviene con el prescriptor y reporta a farmacovigilancia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar el razonamiento farmacoterapéutico para detectar y resolver una lesión renal aguda (LRA) por la combinación IECA/ARA-II + diurético + AINE (\"triple whammy\") y su impacto sobre un fármaco de estrecho margen terapéutico de eliminación renal como el litio.</p><p>Desarrollo: la tasa de filtración glomerular depende del equilibrio entre la vasodilatación de la arteriola aferente (mediada por prostaglandinas) y la vasoconstricción de la eferente (mediada por angiotensina II). El diurético reduce el volumen circulante; el IECA o ARA-II dilata la eferente y el AINE, al inhibir la COX, contrae la aferente. El resultado es una caída hemodinámica de la presión de filtración, especialmente en adultos mayores, pacientes con ERC, insuficiencia cardiaca, cirrosis o deshidratación (diarrea, calor, ayuno). El riesgo es mayor en las primeras semanas tras añadir el AINE. El litio se filtra libremente y se reabsorbe en el túbulo proximal junto con el sodio; la depleción de volumen, las tiazidas, los IECA/ARA-II y los AINE aumentan su reabsorción y elevan sus concentraciones séricas, con riesgo de toxicidad neurológica (temblor grueso, ataxia, confusión). A largo plazo, el litio puede producir diabetes insípida nefrogénica y ERC.</p><p>Caso aplicado (Colombia): mujer de 68 años, afiliada al régimen contributivo, con trastorno bipolar en tratamiento con carbonato de litio, hipertensión controlada con losartán e hidroclorotiazida. Por gonartrosis, un médico de urgencias le formula diclofenaco cada 8 horas durante 10 días, y en la farmacia de su barrio compra además ibuprofeno de venta libre. Al día 6 consulta por vómito, temblor y somnolencia. La creatinina pasó de 1,0 a 2,1 mg/dL y la litemia está muy por encima del rango terapéutico de su laboratorio. Intervención del QF: (1) identificar la interacción triple y la duplicidad de AINE (incluido el de venta libre); (2) recomendar al médico suspender los AINE y, de forma transitoria, el diurético y el ARA-II mientras se corrige la volemia (\"sick day rules\"); (3) sugerir monitorización estrecha de litemia, creatinina, sodio y potasio, y valorar con psiquiatría la conducta frente al litio; (4) proponer analgesia alternativa (paracetamol a dosis seguras, medidas no farmacológicas, tópicos); (5) reportar el evento adverso al programa de farmacovigilancia institucional y a INVIMA (VigiFlow/eReporting); (6) educar a la paciente para que siempre consulte antes de usar analgésicos de venta libre y para suspender temporalmente diuréticos e IECA/ARA-II ante vómito o diarrea, según indicación médica.</p><p>Puntos clave:<br>1. El \"triple whammy\" (IECA/ARA-II + diurético + AINE) es una causa prevenible de LRA; el QF debe vigilarlo en la dispensación, incluso con AINE de venta libre.<br>2. El litio es un fármaco de estrecho margen con eliminación renal: cualquier caída de la TFG o depleción de sodio eleva sus niveles; requiere litemias, función renal y tiroidea periódicas.<br>3. Las \"reglas de días de enfermedad\" y la educación al paciente son intervenciones farmacéuticas de alto impacto en nefroprotección.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Farmacoterapia de la enfermedad renal crónica y de sus complicaciones', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: clasificación KDIGO de la ERC (TFG y albuminuria) y pilares terapéuticos', 'Clase 1 · Clase 1 – Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la clasificación G/A, el riesgo de progresión y los pilares farmacológicos de la nefroprotección según KDIGO 2024.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=jLS7OfCqlVs","provider":"youtube","videoId":"jLS7OfCqlVs","title":"Nueva Guía Enfermedad Renal Crónica","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://kdigo.org/guidelines/ckd-evaluation-and-management/","title":"[Página web] KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of CKD (suite de documentos)","description":"KDIGO (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Bloqueo del SRAA, iSGLT2 y control de la presión arterial', 'Clase 2 · Nefroprotección farmacológica (KDIGO 2024)', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las recomendaciones KDIGO 2024 sobre IECA/ARA-II a dosis máxima tolerada, iSGLT2 (dapagliflozina, empagliflozina) en ERC con o sin diabetes y metas de presión arterial (KDIGO 2021).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://kdigo.org/wp-content/uploads/2026/04/KDIGO-2024-CKD-Guideline.pdf","title":"KDIGO 2024 CKD Guideline (texto completo)","description":"KDIGO (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://kdigo.org/wp-content/uploads/2021/03/Top-10-Takeaways-Clinicians-KDIGO-BP-Guideline.pdf","title":"KDIGO 2021 – Top 10 Takeaways: Blood Pressure in CKD","description":"KDIGO (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Finerenona, agonistas GLP-1 y terapia combinada en ERC con diabetes tipo 2', 'Clase 2 · Nefroprotección farmacológica (KDIGO 2024)', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara finerenona con ARM esteroideos, sus criterios de uso (albuminuria persistente con potasio normal) y la monitorización de potasio; papel de los agonistas GLP-1.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cima.aemps.es/cima/dochtml/ft/1211616002/FT_1211616002.html","title":"[Página web] Ficha técnica Kerendia 10 mg (finerenona)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://kdigo.org/wp-content/uploads/2022/10/KDIGO-2022-Diabetes-Management-in-CKD-Guideline-Top-10-Takeaways-for-Clinicians.pdf","title":"KDIGO 2022 Diabetes Management in CKD – Top 10 Takeaways for Clinicians","description":"KDIGO (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Anemia renal: agentes estimulantes de la eritropoyesis, hierro IV e inhibidores de HIF-PH', 'Clase 3 · Complicaciones de la ERC', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la guía KDIGO 2026 de anemia: diagnóstico, umbrales de inicio y metas de hemoglobina con AEE, uso de hierro IV y lugar de los HIF-PHI.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=wPmchgG98R4","provider":"youtube","videoId":"wPmchgG98R4","title":"Enfermedad renal crónica – manejo y complicaciones","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://kdigo.org/wp-content/uploads/2026/03/KDIGO-2026-Anemia-Guideline-Key-Takeaways-for-HCPs.pdf","title":"KDIGO 2026 Anemia in CKD Guideline – Key Takeaways for HCPs","description":"KDIGO (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Trastorno mineral óseo: quelantes de fósforo, calcitriol/análogos y cinacalcet', 'Clase 3 · Complicaciones de la ERC', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara quelantes cálcicos y no cálcicos, activadores del receptor de vitamina D y calcimiméticos, sus interacciones y la monitorización de calcio, fósforo y PTH (KDIGO 2017).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://kdigo.org/wp-content/uploads/2017/02/KDIGO-2017-CKD-MBD-GL-Update-Synopsis.pdf","title":"KDIGO 2017 CKD-MBD Guideline Update – Synopsis","description":"KDIGO (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/04292002/FT_04292002.pdf","title":"Ficha técnica Mimpara 30 mg (cinacalcet)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Hiperpotasemia crónica: patiromer y ciclosilicato de sodio y zirconio', 'Clase 3 · Complicaciones de la ERC', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe mecanismo, inicio de acción, interacciones por separación de tomas y efectos adversos de los nuevos quelantes de potasio para mantener el bloqueo del SRAA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cima.aemps.es/cima/pdfs/ft/1171179001/FT_1171179001.pdf","title":"Ficha técnica Veltassa 8,4 g (patiromer)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cima.aemps.es/cima/pdfs/ft/1171173002/FT_1171173002.pdf","title":"Ficha técnica Lokelma 5 g (ciclosilicato de sodio y zirconio)","description":"CIMA-AEMPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.revistanefrologia.com/en-consensus-document-on-management-hyperkalemia-avance-S2013251423001785","title":"[Página web] Consensus document on the management of hyperkalemia (SEN, SEMES, SEEN, SEMI, SEC; Nefrología 2023)","description":"Revista Nefrología (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Dosificación de fármacos en hemodiálisis, diálisis peritoneal y TRR continua', 'Clase 4 · Diálisis, terapias de reemplazo renal y caso clínico', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica los determinantes de la dializabilidad (peso molecular, unión a proteínas, volumen de distribución) para ajustar dosis y horarios respecto a la sesión de diálisis.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.sspa.juntadeandalucia.es/servicioandaluzdesalud/hrs3/fileadmin/user_upload/area_atencion_alprofesional/acceso_pro/area_medica/dosificacion_atb_ir.pdf","title":"Recomendaciones sobre el ajuste de dosis de antimicrobianos en adultos con insuficiencia renal (2011)","description":"Servicio Andaluz de Salud – Farmacocinética Clínica (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://sanidad.castillalamancha.es/sites/sescam.castillalamancha.es/files/documentos/farmacia/farmacos_en_insuficiencia_renal_y_hepatica.pdf","title":"Fármacos en insuficiencia renal y hepática (Boletín Farmacoterapéutico de Castilla-La Mancha, 2011)","description":"SESCAM – Servicio de Farmacia CHU Albacete (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: paciente con diabetes tipo 2 y ERC G3b A3 sin tratamiento nefroprotector óptimo', 'Clase 4 · Diálisis, terapias de reemplazo renal y caso clínico', 7, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El QF identifica brechas frente a KDIGO 2024 (iSGLT2, dosis de ARA-II, finerenona, estatina), ajusta metformina por TFGe y propone plan de monitorización.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://kdigo.org/wp-content/uploads/2022/10/KDIGO-2022-Diabetes-Management-in-CKD-Guideline-Top-10-Takeaways-for-Clinicians.pdf","title":"KDIGO 2022 Diabetes Management in CKD – Top 10 Takeaways for Clinicians","description":"KDIGO (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://kdigo.org/guidelines/ckd-evaluation-and-management/","title":"[Página web] KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of CKD (suite de documentos)","description":"KDIGO (EN)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Trasplante renal, infecciones urinarias y contexto colombiano de la ERC', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: inmunosupresión, ITU y el modelo colombiano de gestión de la ERC', 'Clase 1 · Clase 1 – Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume los esquemas de inmunosupresión en trasplante renal, la relevancia de las ITU en pacientes renales y el rol de la CAC.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=RwBxabPakUE","provider":"youtube","videoId":"RwBxabPakUE","title":"Farmacología de la inmunosupresión, de la teoría a la práctica","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cuentadealtocosto.org/enfermedades-de-alto-costo/erc/","title":"[Página web] ERC – Cuenta de Alto Costo (sección de enfermedad renal crónica)","description":"Cuenta de Alto Costo (CAC) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Inhibidores de calcineurina: tacrolimus y ciclosporina, monitorización de niveles', 'Clase 2 · Inmunosupresores en trasplante renal', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el mecanismo, la farmacocinética variable (CYP3A4/3A5, P-gp), los niveles valle objetivo, las toxicidades y la no intercambiabilidad de formulaciones.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=RwBxabPakUE","provider":"youtube","videoId":"RwBxabPakUE","title":"Farmacología de la inmunosupresión, de la teoría a la práctica","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=E326K7AKowk","provider":"youtube","videoId":"E326K7AKowk","title":"Tacrolimus after a kidney transplant","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://revistas.unal.edu.co/index.php/rccquifa/article/download/113036/94281/721557","title":"Correlating tacrolimus levels with dose formulation: implications for toxicity and renal graft rejection (cohorte colombiana, 2025)","description":"Rev. Colomb. Cienc. Quím. Farm. 54(1):28-43 (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Micofenolato, inhibidores de mTOR y corticoides: seguridad y seguimiento', 'Clase 2 · Inmunosupresores en trasplante renal', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe micofenolato (mofetilo y sódico), everolimus/sirolimus y corticoides: toxicidad hematológica y gastrointestinal, teratogenicidad, infecciones oportunistas y profilaxis.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=0V08VooDwZ8","provider":"youtube","videoId":"0V08VooDwZ8","title":"Immunosuppressive management of the kidney transplant recipient","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"http://kdigo.org/wp-content/uploads/2022/01/KDIGO-2009-Transplant-Recipient-Guideline_Spanish.pdf","title":"Guía KDIGO 2009 para el cuidado del receptor de trasplante renal (traducción al español)","description":"KDIGO (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso clínico: interacción claritromicina–tacrolimus en un receptor de trasplante renal', 'Clase 2 · Inmunosupresores en trasplante renal', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El QF detecta una interacción mayor, propone alternativa terapéutica y plan de monitorización de niveles y función renal.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: resolver un caso de interacción farmacocinética con tacrolimus en un receptor de trasplante renal, aplicando monitorización de niveles valle y seguimiento farmacoterapéutico.</p><p>Desarrollo: el tacrolimus es un inhibidor de la calcineurina con estrecho margen terapéutico, gran variabilidad interindividual y metabolismo por CYP3A4/CYP3A5, además de ser sustrato de la glicoproteína P. Los inhibidores de CYP3A4 (claritromicina, eritromicina, azoles como fluconazol, voriconazol o posaconazol, diltiazem, verapamilo, ritonavir y otros potenciadores, jugo de toronja) elevan sus concentraciones y su toxicidad: nefrotoxicidad (vasoconstricción aferente), neurotoxicidad (temblor, cefalea), hiperglucemia/diabetes postrasplante, hiperpotasemia e hipomagnesemia. Los inductores (rifampicina, carbamazepina, fenitoína, fenobarbital, hierba de San Juan) disminuyen los niveles y aumentan el riesgo de rechazo. Las presentaciones de liberación inmediata y prolongada no son intercambiables mg a mg sin control de niveles, y cualquier cambio de marca o formulación exige monitorización estrecha. El objetivo de nivel valle lo define el grupo de trasplante según el tiempo postrasplante, el riesgo inmunológico y el esquema concomitante (micofenolato, corticoides).</p><p>Caso aplicado (Colombia): hombre de 45 años, trasplante renal hace 14 meses en una IPS de Medellín, en tratamiento con tacrolimus de liberación inmediata, micofenolato y prednisolona. Acude a la farmacia con una fórmula de claritromicina por 10 días para una neumonía adquirida en la comunidad, prescrita en una consulta extramural. Sus últimos niveles valle estaban dentro del objetivo y su creatinina basal es 1,3 mg/dL. Intervención del QF: (1) detectar la interacción mayor claritromicina-tacrolimus y no dispensar sin comunicación con el prescriptor y el grupo de trasplante; (2) proponer una alternativa antibiótica sin inhibición relevante del CYP3A4 (por ejemplo, un betalactámico con o sin doxiciclina o azitromicina según evaluación médica, considerando que la azitromicina tiene menor potencial de interacción), dejando la elección al médico; (3) si no hay alternativa, recomendar ajuste empírico y nivel valle a las 48–72 horas con control de creatinina, potasio y glucemia; (4) verificar adherencia, horario fijo de toma y ausencia de productos naturales; (5) registrar la intervención y, si ocurre toxicidad, reportarla al programa de farmacovigilancia e INVIMA. Recordar que el micofenolato es teratogénico y requiere anticoncepción eficaz en pacientes en edad fértil.</p><p>Puntos clave:<br>1. Tacrolimus y ciclosporina son sustratos de CYP3A4/P-gp: toda prescripción nueva en un trasplantado debe pasar por un filtro de interacciones.<br>2. La monitorización de niveles valle, la creatinina, el potasio, el magnesio y la glucemia son la base del seguimiento del inhibidor de calcineurina.<br>3. El cambio de formulación o de marca de tacrolimus requiere control de niveles; el QF garantiza continuidad y adherencia, en especial ante barreras de dispensación en las EPS.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Infecciones del tracto urinario: elección antimicrobiana y ajuste por función renal', 'Clase 3 · Infecciones urinarias: visión breve', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume el abordaje de cistitis, ITU complicada y pielonefritis con énfasis en resistencia local, ajuste renal y seguridad de antimicrobianos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: describir de forma breve el abordaje farmacológico de las infecciones del tracto urinario (ITU) con énfasis en el ajuste por función renal y en la seguridad de los antimicrobianos.</p><p>Desarrollo: las ITU se clasifican en cistitis no complicada (mujer sana no embarazada), ITU complicada (hombres, embarazo, anomalías urológicas, sonda, inmunosupresión, trasplante renal) y pielonefritis. La elección empírica debe basarse en la epidemiología local de resistencia: en Colombia, Escherichia coli presenta altas tasas de resistencia a trimetoprim-sulfametoxazol y a fluoroquinolonas, y es creciente la presencia de enterobacterias productoras de betalactamasas de espectro extendido. Para la cistitis no complicada se usan con frecuencia nitrofurantoína y fosfomicina trometamol; la nitrofurantoína pierde eficacia urinaria y aumenta su toxicidad cuando la función renal está muy reducida, por lo que debe evitarse en ERC avanzada según la ficha técnica y los criterios de Beers. Las fluoroquinolonas no deben ser primera línea en cistitis no complicada por sus reacciones adversas incapacitantes (tendinopatía, neuropatía, aneurisma aórtico), objeto de alertas de agencias regulatorias. Muchos antimicrobianos de eliminación renal (betalactámicos, fluoroquinolonas, aminoglucósidos, TMP-SMX) requieren ajuste de dosis o intervalo según el aclaramiento de creatinina estimado. TMP-SMX puede elevar el potasio (efecto similar a amilorida) y la creatinina sérica (inhibición de la secreción tubular), lo que es relevante en pacientes con IECA/ARA-II o trasplantados. La bacteriuria asintomática no debe tratarse, salvo en embarazo y antes de procedimientos urológicos invasivos.</p><p>Caso aplicado (Colombia): mujer de 74 años con ERC estadio 4 (TFGe 22 mL/min/1,73 m2), en tratamiento con enalapril y espironolactona, recibe en una consulta prioritaria una fórmula de nitrofurantoína por cistitis. El QF identifica que la función renal limita el uso de nitrofurantoína y comunica al médico la necesidad de una alternativa acorde al urocultivo y al perfil local, advirtiendo además evitar TMP-SMX por el riesgo de hiperpotasemia con enalapril y espironolactona. Propone verificar el antibiograma, ajustar dosis por función renal y educar en hidratación y signos de alarma.</p><p>Puntos clave:<br>1. La elección empírica en ITU depende de la resistencia local y del tipo de ITU; el urocultivo guía el tratamiento en ITU complicada.<br>2. La función renal condiciona la eficacia y la seguridad de varios antimicrobianos urinarios (nitrofurantoína, aminoglucósidos, TMP-SMX).<br>3. El QF previene interacciones (TMP-SMX + IECA/ARA-II/ahorradores de K) y promueve el uso prudente de fluoroquinolonas.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Cuenta de Alto Costo: situación de la ERC en Colombia e indicadores', 'Clase 4 · Contexto colombiano y caso integrador', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el informe de situación de ERC, HTA y DM de la CAC, los indicadores de gestión del riesgo en diálisis y los programas de nefroprotección.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cuentadealtocosto.org/situacion-de-la-enfermedad-renal-cronica-la-hipertension-arterial-y-la-diabetes-mellitus-en-colombia-2025/","title":"[Página web] Situación de la enfermedad renal crónica, la hipertensión arterial y la diabetes mellitus en Colombia 2025","description":"Cuenta de Alto Costo (CAC) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cuentadealtocosto.org/actualizacion-del-consenso-basado-en-la-evidencia-indicadores-minimos-para-la-medicion-evaluacion-y-monitoreo-de-la-gestion-del-riesgo-en-adultos-con-enfermedad-renal-cronica-tratados-con-dialisis/","title":"[Página web] Actualización del consenso: indicadores mínimos para la gestión del riesgo en adultos con ERC tratados con diálisis","description":"Cuenta de Alto Costo (CAC) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://cuentadealtocosto.org/herramienta-tecnica-contenidos-minimos-y-suficientes-de-un-programa-de-nefroproteccion-2026/","title":"[Página web] Herramienta técnica: contenidos mínimos y suficientes de un programa de nefroprotección (2026)","description":"Cuenta de Alto Costo (CAC) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Guía de manejo de la ERC de MinSalud y modelo de prevención: rol del QF', 'Clase 4 · Contexto colombiano y caso integrador', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el modelo de prevención y control de la ERC en Colombia, contrastando la guía nacional con las recomendaciones KDIGO vigentes.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/guia-manejo-enfermedad-renal-cronica-2007-pars.pdf","title":"Guía para el manejo de la enfermedad renal crónica y Modelo de prevención y control de la ERC (MPS-PARS, 2007)","description":"Ministerio de la Protección Social – MinSalud Colombia (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://kdigo.org/guidelines/ckd-evaluation-and-management/","title":"[Página web] KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of CKD (suite de documentos)","description":"KDIGO (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso integrador: seguimiento farmacoterapéutico de un paciente en hemodiálisis polimedicado', 'Clase 4 · Contexto colombiano y caso integrador', 7, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El QF revisa la medicación de un paciente en hemodiálisis, ajusta fármacos de eliminación renal, resuelve interacciones con quelantes y vincula su intervención con los indicadores de la CAC.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: integrar los contenidos del curso en un caso de seguimiento farmacoterapéutico de un paciente en hemodiálisis, con revisión de la medicación, ajuste de dosis y articulación con los indicadores de la Cuenta de Alto Costo.</p><p>Desarrollo: el paciente en hemodiálisis suele recibir más de diez medicamentos (antihipertensivos, quelantes de fósforo, calcitriol o análogos, cinacalcet, agentes estimulantes de la eritropoyesis, hierro intravenoso, estatina, antidiabéticos, protector gástrico, suplementos). Los problemas relacionados con medicamentos más frecuentes son: dosis no ajustadas a la función renal residual y a la diálisis, horario incorrecto respecto a la sesión (fármacos dializables que deben administrarse después de la hemodiálisis), quelantes tomados lejos de las comidas, interacciones de quelantes con levotiroxina, fluoroquinolonas o tetraciclinas, hiperpotasemia por fármacos, uso de AINE o de productos naturales y baja adherencia por carga de pastillas. La dializabilidad de un fármaco depende de su peso molecular, unión a proteínas, volumen de distribución y tipo de membrana.</p><p>Caso aplicado (Colombia): hombre de 63 años con diabetes tipo 2 y ERC estadio 5 en hemodiálisis tres veces por semana en una unidad renal de Barranquilla. Medicamentos: insulina glargina, carbonato de calcio con las comidas, calcitriol, eritropoyetina tres veces por semana, hierro sacarosa mensual, losartán, amlodipino, atorvastatina, omeprazol, gabapentina 300 mg cada 8 horas por neuropatía y levotiroxina tomada junto con el desayuno y el calcio. Refiere somnolencia y mareo. Laboratorios: hemoglobina 12,3 g/dL, potasio predialítico 6,1 mEq/L, fósforo 6,4 mg/dL, calcio en límite alto, PTH elevada. Intervención del QF: (1) gabapentina se elimina por vía renal y se acumula en diálisis: recomendar ajuste a la dosis recomendada en ficha técnica para hemodiálisis, con suplemento posdiálisis; (2) separar la levotiroxina del carbonato de calcio al menos 4 horas; (3) con calcio alto y fósforo elevado, sugerir valorar un quelante sin calcio (sevelamer) y revisar la dosis de calcitriol o el uso de cinacalcet según PTH (KDIGO CKD-MBD 2017); (4) con hemoglobina de 12,3 g/dL, alertar que supera el objetivo de la guía KDIGO 2026 (menor de 11,5 g/dL con AEE) y proponer reducir la dosis de AEE; (5) evaluar causas de hiperpotasemia (losartán, dieta, constipación, diálisis inadecuada) y discutir un quelante de potasio; (6) educación sobre restricción de líquidos, potasio y fósforo, y adherencia. Registrar indicadores de anemia, fósforo y PTH, que la unidad renal reporta a la CAC.</p><p>Puntos clave:<br>1. La conciliación y revisión de la medicación en diálisis detecta acumulación de fármacos de eliminación renal (gabapentinoides, ciertos antimicrobianos, metformina, opioides como morfina).<br>2. Las interacciones con quelantes y la sincronización con las sesiones de diálisis son intervenciones simples y de alto impacto.<br>3. El trabajo del QF se articula con los indicadores de calidad de la CAC (anemia, metabolismo mineral, adecuación de diálisis).</p>"}'::jsonb);

END
$curso$;

-- ─── 12. Curso de Farmacología de Anticoagulantes y Antiagregantes (33 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Farmacología de Anticoagulantes y Antiagregantes' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Farmacología de Anticoagulantes y Antiagregantes', 'Curso para Químicos Farmacéuticos sobre la farmacología clínica de antiagregantes plaquetarios y anticoagulantes parenterales, warfarina y anticoagulantes orales directos. Integra la monitorización, el manejo perioperatorio, la reversión y el seguimiento farmacoterapéutico con casos clínicos y el contexto normativo colombiano.', '<p>Curso para Químicos Farmacéuticos sobre la farmacología clínica de antiagregantes plaquetarios y anticoagulantes parenterales, warfarina y anticoagulantes orales directos. Integra la monitorización, el manejo perioperatorio, la reversión y el seguimiento farmacoterapéutico con casos clínicos y el contexto normativo colombiano.</p><h3>Objetivo general</h3><p>Que el QF seleccione, verifique, monitorice y ajuste la terapia antitrombótica con criterios de seguridad y eficacia, aplicando guías vigentes (MinSalud/IETS, ACCP/CHEST, ESC) y liderando intervenciones de atención farmacéutica y farmacovigilancia en el sistema de salud colombiano.</p><h3>A quién va dirigido</h3><p>Químicos Farmacéuticos de servicios farmacéuticos hospitalarios y ambulatorios, clínicas de anticoagulación, gestores farmacéuticos y la industria farmacéutica en Colombia; estudiantes de último año de Química Farmacéutica.</p><h3>Contexto normativo</h3><p>Colombia — GPC MinSalud/IETS, PBS/MIPRES, INVIMA</p>',
          'Farmacología', 'intermedio', 'Que el QF seleccione, verifique, monitorice y ajuste la terapia antitrombótica con criterios de seguridad y eficacia, aplicando guías vigentes (MinSalud/IETS, ACCP/CHEST, ESC) y liderando intervenciones de atención farmacéutica y farmacovigilancia en el sistema de salud colombiano.', 'Químicos Farmacéuticos de servicios farmacéuticos hospitalarios y ambulatorios, clínicas de anticoagulación, gestores farmacéuticos y la industria farmacéutica en Colombia; estudiantes de último año de Química Farmacéutica.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Fundamentos de la hemostasia y monitorización de la coagulación', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: antitrombóticos como medicamentos de alto riesgo', 'Clase 1 · Introducción al curso', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Presenta el alcance del curso, la relevancia de anticoagulantes y antiagregantes en la seguridad del paciente y el rol del QF en Colombia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=pNpil0UkVTU","provider":"youtube","videoId":"pNpil0UkVTU","title":"Hemostasia: tapón plaquetario y cascada de la coagulación (más fármacos relacionados)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Hemostasia primaria: activación y agregación plaquetaria', 'Clase 2 · Fisiología de la hemostasia', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe adhesión, activación (TXA2, ADP, trombina) y agregación vía GP IIb/IIIa como base de los antiagregantes.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=qA_-Doy3HWk","provider":"youtube","videoId":"qA_-Doy3HWk","title":"TODO SOBRE HEMOSTASIA Y CASCADA DE COAGULACIÓN | Súper fácil","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ugr.es/~morillas/temas/sangre2/sangre2.pdf","title":"Farmacología de la sangre (antiagregantes, heparinas, cumarínicos, fibrinolíticos)","description":"Universidad de Granada – Departamento de Farmacología (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Modelo celular de la coagulación: iniciación, amplificación, propagación y terminación', 'Clase 2 · Fisiología de la hemostasia', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el modelo celular frente a la cascada clásica y ubica sobre él a heparinas, warfarina y ACOD.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=rbjwY_rxE1I","provider":"youtube","videoId":"rbjwY_rxE1I","title":"Modelo clásico y modelo celular de la coagulación. Hemostasia secundaria","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.scielo.br/j/rbhh/a/rDLP3JcrWkbWpQWrCLBpyNL/?lang=en","title":"[Página web] A cell-based model of coagulation and its implications (Rev Bras Hematol Hemoter, 2010)","description":"SciELO – Revista Brasileira de Hematologia e Hemoterapia (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.redalyc.org/pdf/1951/195124163011.pdf","title":"Tromboelastografía: nuevos conceptos en la fisiología de la hemostasia (Rev Colomb Anestesiol, 2012)","description":"Revista Colombiana de Anestesiología (Redalyc) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'TP/INR, aPTT, anti-Xa y pruebas específicas para ACOD', 'Clase 3 · Pruebas de coagulación para el seguimiento farmacoterapéutico', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta qué prueba monitoriza cada antitrombótico y sus limitaciones.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: interpretar las pruebas de coagulación que el Químico Farmacéutico (QF) usa para monitorizar antitrombóticos y reconocer qué prueba sirve para cada fármaco.</p><p>Desarrollo: el tiempo de protrombina (TP) explora los factores VII, X, V, II y fibrinógeno; como depende de la sensibilidad de la tromboplastina, se expresa como INR (Razón Normalizada Internacional) usando el Índice de Sensibilidad Internacional (ISI) del reactivo. El INR es la prueba estándar para antagonistas de la vitamina K (warfarina): el rango terapéutico habitual es 2,0–3,0 para la mayoría de indicaciones y algo superior en ciertas prótesis valvulares mecánicas según la guía vigente. El tiempo de tromboplastina parcial activada (TTPa o aPTT) explora la vía intrínseca y común y es la prueba clásica para ajustar heparina no fraccionada (HNF) en infusión mediante nomogramas institucionales; su rango terapéutico debe calibrarse localmente contra niveles anti-Xa, porque varía entre reactivos. La actividad anti-Xa calibrada para heparina es útil en HNF (cuando el aPTT es poco confiable: resistencia a heparina, anticoagulante lúpico, déficit de factor XII) y en HBPM en poblaciones especiales: embarazo, obesidad extrema, insuficiencia renal, pediatría. Para los anticoagulantes orales directos (ACOD) no se requiere monitorización rutinaria; en urgencias se usan pruebas específicas: tiempo de trombina diluido o tiempo de ecarina para dabigatrán, y anti-Xa calibrado para el fármaco (rivaroxabán, apixabán, edoxabán). Un tiempo de trombina normal prácticamente descarta niveles relevantes de dabigatrán; un TP normal no descarta niveles de apixabán. Recuento de plaquetas: obligatorio al iniciar heparina para detectar trombocitopenia inducida por heparina (TIH). La función plaquetaria (agregometría, VerifyNow) tiene uso limitado y no se recomienda de rutina para ajustar P2Y12. Los métodos viscoelásticos (tromboelastografía/ROTEM) aportan una visión global coherente con el modelo celular, sobre todo en cirugía y trauma.</p><p>Ejemplo aplicado (Colombia): en un hospital de tercer nivel, el QF del servicio farmacéutico revisa el perfil de un paciente con HNF en infusión cuyo aPTT es 3 veces el control 6 horas después de un bolo. Antes de recomendar suspender, verifica la hora de toma (¿se tomó de la misma vía de infusión?), el nomograma institucional y la ausencia de sangrado, y propone repetir la muestra por punción periférica. Documenta la intervención según el programa institucional de seguridad del paciente y, si hay evento adverso, lo reporta al Programa Nacional de Farmacovigilancia del INVIMA.</p><p>Puntos clave:<br>1. INR para warfarina, aPTT o anti-Xa para HNF, anti-Xa para HBPM en poblaciones especiales; los ACOD no se monitorizan de rutina.<br>2. Los rangos de aPTT dependen del reactivo y deben estar validados por el laboratorio de la institución.<br>3. Antes de cambiar una dosis, el QF verifica la calidad de la muestra, la hora de toma frente a la dosis y el contexto clínico.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: paciente anticoagulado en urgencias con pruebas de coagulación casi normales', 'Clase 3 · Pruebas de coagulación para el seguimiento farmacoterapéutico', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica la interpretación de pruebas, la conciliación y el cálculo de función renal en un caso clínico.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar la interpretación de pruebas de coagulación a un caso real de urgencias, definiendo qué información debe aportar el QF.</p><p>Caso: mujer de 78 años, 58 kg, llega a urgencias de una IPS en Medellín tras una caída con hematoma frontal. Familiar refiere que toma un \"anticoagulante\" para fibrilación auricular, pero no trae fórmula. Laboratorios: TP prolongado leve, INR 1,4; aPTT 38 s (normal); creatinina 1,6 mg/dL; plaquetas 210.000. El médico pregunta al QF si \"está bien anticoagulada\" y si debe revertirse.</p><p>Desarrollo: el primer paso del QF es la conciliación medicamentosa: identificar el fármaco exacto, la dosis y la hora de la última toma (consulta a familiares, historia clínica, dispensación del gestor farmacéutico de la EPS, empaques). Un INR de 1,4 tiene interpretación diferente según el fármaco: si es warfarina, indica anticoagulación subterapéutica; si es un inhibidor del Xa (rivaroxabán o apixabán), el INR no refleja el efecto y puede haber concentraciones clínicamente significativas con valores casi normales, sobre todo con apixabán. Un aPTT normal tampoco excluye dabigatrán en concentraciones bajas; el tiempo de trombina sería la prueba de tamizaje. Supongamos que la conciliación confirma apixabán, última dosis hace 6 horas. El QF calcula la depuración de creatinina con Cockcroft-Gault (edad, peso, creatinina, sexo) y revisa si cumplía criterios de reducción de dosis según la ficha técnica (dos de tres: edad ≥80 años, peso ≤60 kg, creatinina ≥1,5 mg/dL). Aquí cumple dos criterios (peso y creatinina), por lo que una dosis plena sería inapropiada; esto se documenta como problema relacionado con medicamentos. Si existe sangrado intracraneal confirmado por imagen, el QF apoya el protocolo institucional de reversión (ver Unidad 5), verifica disponibilidad del agente en la farmacia, prepara y verifica la dosis, y registra el evento en farmacovigilancia (reporte al INVIMA a través del sistema vigente).</p><p>Intervención del QF: (a) conciliación y hora de última dosis; (b) elección de la prueba correcta (anti-Xa calibrado si el laboratorio lo tiene); (c) ajuste por función renal y peso; (d) educación a la familia sobre el esquema correcto al alta; (e) reporte de RAM y del error de dosificación.</p><p>Puntos clave:<br>1. El INR solo sirve para antagonistas de vitamina K; con ACOD, un INR casi normal no garantiza ausencia de efecto.<br>2. La hora de la última dosis y la función renal son tan importantes como el resultado de laboratorio.<br>3. La conciliación medicamentosa es la intervención más rentable del QF en el paciente anticoagulado que ingresa a urgencias.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Antiagregantes plaquetarios', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: antiagregantes en la prevención aterotrombótica', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume clases de antiagregantes, indicaciones en prevención secundaria y riesgos hemorrágicos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=chZY0kUD8-4","provider":"youtube","videoId":"chZY0kUD8-4","title":"Antiagregantes plaquetarios – Curso de farmacología clínica","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Ácido acetilsalicílico, cilostazol y dipiridamol', 'Clase 2 · Farmacología de los antiagregantes', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe inhibición irreversible de COX-1, dosis bajas, gastrolesividad, interacción con AINE; cilostazol (inhibidor PDE3) en claudicación y su contraindicación en insuficiencia cardíaca.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=xtiQhDEa0F8","provider":"youtube","videoId":"xtiQhDEa0F8","title":"¡Antiagregantes plaquetarios!","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ugr.es/~morillas/temas/sangre2/sangre2.pdf","title":"Farmacología de la sangre (antiagregantes, heparinas, cumarínicos, fibrinolíticos)","description":"Universidad de Granada – Departamento de Farmacología (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Inhibidores P2Y12: clopidogrel, prasugrel y ticagrelor', 'Clase 2 · Farmacología de los antiagregantes', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara profármaco vs acción directa, reversibilidad, farmacogenética CYP2C19, contraindicaciones (prasugrel y ACV/AIT; ticagrelor y disnea) e interacciones.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=Zi_4WisBL0w","provider":"youtube","videoId":"Zi_4WisBL0w","title":"Antiagregantes plaquetarios – Módulo síndrome coronario agudo","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cun.es/enfermedades-tratamientos/medicamentos/clopidogrel","title":"[Página web] Clopidogrel – Diccionario médico CUN","description":"Clínica Universidad de Navarra (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://sanidad.castillalamancha.es/sites/sescam.castillalamancha.es/files/documentos/farmacia/ticagrelor2.pdf","title":"Ticagrelor – Boletín farmacoterapéutico (PLATO, comparación con clopidogrel y prasugrel)","description":"SESCAM – Servicio de Farmacia, Castilla-La Mancha (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Inhibidores de la GP IIb/IIIa y cangrelor en el entorno hospitalario', 'Clase 2 · Farmacología de los antiagregantes', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe abciximab, eptifibatida y tirofibán, su uso restringido en intervención coronaria, ajuste renal y riesgo de trombocitopenia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://revistachilenadeanestesia.cl/PII/revchilanestv47n04.04.pdf","title":"Nuevos anticoagulantes orales y antiagregantes en el perioperatorio de cirugía no cardíaca. Parte 2: nuevos antiagregantes (2018)","description":"Revista Chilena de Anestesia (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'DAPT: indicaciones, elección del P2Y12, duración y desescalamiento', 'Clase 3 · Doble antiagregación en síndrome coronario agudo y stent', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las recomendaciones de la guía ESC 2023 sobre DAPT, gastroprotección y estrategias en alto riesgo hemorrágico.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=C7FcuFfr_Lc","provider":"youtube","videoId":"C7FcuFfr_Lc","title":"Uso del ticagrelor en el síndrome coronario agudo","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/acute-coronary-syndromes/","title":"[Página web] 2023 ESC Guidelines for the management of acute coronary syndromes","description":"European Society of Cardiology (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.cardioteca.com/sca/566-ticagrelor.html","title":"[Página web] Ticagrelor – CardioTeca (SCA)","description":"CardioTeca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: interrupción de DAPT e interacción clopidogrel–omeprazol', 'Clase 3 · Doble antiagregación en síndrome coronario agudo y stent', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica el seguimiento farmacoterapéutico a un paciente post-IAM con stent y barreras de acceso al medicamento.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar el seguimiento farmacoterapéutico a un paciente con doble antiagregación tras un síndrome coronario agudo (SCA) e intervención coronaria percutánea con stent.</p><p>Caso: hombre de 62 años, diabético, egresa de una clínica en Bogotá tras IAM sin elevación del ST con stent medicado. Fórmula de egreso: ácido acetilsalicílico (AAS) en dosis baja, clopidogrel, atorvastatina en alta intensidad, metoprolol, omeprazol, metformina. Antecedente de ACV isquémico hace 3 años. Al mes consulta a la farmacia con equimosis y refiere que \"dejó el clopidogrel 5 días porque no se lo entregaron completo\".</p><p>Desarrollo: el QF revisa (1) la elección del inhibidor P2Y12: la guía ESC 2023 de SCA prefiere ticagrelor o prasugrel sobre clopidogrel en pacientes con SCA llevados a angioplastia salvo alto riesgo de sangrado; sin embargo, prasugrel está contraindicado con antecedente de ACV/AIT, y ticagrelor requiere AAS en dosis bajas. En este paciente la decisión de usar clopidogrel puede estar justificada, pero debe documentarse. (2) Interacción clopidogrel–IBP: omeprazol y esomeprazol inhiben CYP2C19 y reducen la activación de clopidogrel; el QF sugiere pantoprazol como alternativa con menor interacción, manteniendo la gastroprotección indicada en DAPT. (3) Adherencia: la interrupción precoz de la DAPT es el principal predictor de trombosis del stent. La barrera fue administrativa (entrega incompleta); el QF verifica si el medicamento está financiado con recursos de la UPC dentro del Plan de Beneficios en Salud o si requiere prescripción por MIPRES, orienta al paciente sobre el mecanismo de pendientes del gestor farmacéutico y escala el caso. (4) Duración de la DAPT: por defecto 12 meses tras SCA, con estrategias de acortamiento o desescalamiento en alto riesgo hemorrágico, a decidir por cardiología. (5) Sangrado menor (equimosis): no justifica suspender; se educa sobre signos de alarma (melenas, hematuria, sangrado que no cede), evitar AINE y no suspender sin consultar. (6) Antes de cualquier procedimiento dental o quirúrgico, el paciente debe avisar que tiene un stent.</p><p>Intervención del QF: nota de seguimiento farmacoterapéutico (método Dáder o el institucional), comunicación escrita al cardiólogo sobre IBP e interrupción, tarjeta de paciente con stent y fecha de fin de DAPT, y reporte a farmacovigilancia si se presenta un evento trombótico o hemorrágico.</p><p>Puntos clave:<br>1. La interrupción no planeada de la DAPT es una urgencia farmacoterapéutica: el QF debe detectarla y resolver la barrera de acceso.<br>2. Prasugrel está contraindicado con ACV/AIT previo; clopidogrel interactúa con IBP inhibidores de CYP2C19.<br>3. Educar sobre sangrado menor evita suspensiones innecesarias.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Trombosis del stent y triple terapia en pacientes con FA', 'Clase 3 · Doble antiagregación en síndrome coronario agudo y stent', 6, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara riesgos de trombosis del stent y sangrado al combinar DAPT con anticoagulantes orales.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=GooWO7NDNVw","provider":"youtube","videoId":"GooWO7NDNVw","title":"Tratamiento antiagregante en trombosis del stent","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cardioteca.com/sca/8437-dapt-mvd-prolongar-la-doble-antiagregacion-12-meses-mas-reduce-eventos-isquemicos-en-la-enfermedad-multivaso-br.html","title":"[Página web] DAPT-MVD: prolongar la doble antiagregación 12 meses más en enfermedad multivaso","description":"CardioTeca (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Anticoagulantes parenterales y antagonistas de la vitamina K', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: heparinas y warfarina', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume el papel de los anticoagulantes parenterales y de la warfarina, y por qué exigen monitorización estrecha.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=nm8rjlyGd8M","provider":"youtube","videoId":"nm8rjlyGd8M","title":"Anticoagulantes y antiagregantes plaquetarios","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Heparina no fraccionada: mecanismo, nomogramas por aPTT y protamina', 'Clase 2 · Anticoagulantes parenterales', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la potenciación de antitrombina, la farmacocinética no lineal, el ajuste por aPTT/anti-Xa y la reversión con protamina.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=HTCQiXZBdCU","provider":"youtube","videoId":"HTCQiXZBdCU","title":"Anticoagulants (heparin & warfarin) – Pharmacology – Cardiovascular","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ugr.es/~morillas/temas/sangre2/sangre2.pdf","title":"Farmacología de la sangre (antiagregantes, heparinas, cumarínicos, fibrinolíticos)","description":"Universidad de Granada – Departamento de Farmacología (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'HBPM, fondaparinux y bivalirudina: dosificación en poblaciones especiales', 'Clase 2 · Anticoagulantes parenterales', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara enoxaparina, dalteparina, fondaparinux y bivalirudina; ajuste renal, obesidad, embarazo y monitorización anti-Xa.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=HbFc7ysr6LI","provider":"youtube","videoId":"HbFc7ysr6LI","title":"Heparina, cuándo y cómo debemos administrarla #TuFarmacéuticoInforma","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ugr.es/~morillas/temas/sangre2/sangre2.pdf","title":"Farmacología de la sangre (antiagregantes, heparinas, cumarínicos, fibrinolíticos)","description":"Universidad de Granada – Departamento de Farmacología (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Trombocitopenia inducida por heparina (TIH)', 'Clase 2 · Anticoagulantes parenterales', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la escala 4T, las pruebas diagnósticas y el cambio a anticoagulantes no heparínicos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=SUQs5cPcjvk","provider":"youtube","videoId":"SUQs5cPcjvk","title":"Trombocitopenia inducida por heparina ¿Estamos diagnosticando bien?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=_v9BWlubVtw","provider":"youtube","videoId":"_v9BWlubVtw","title":"Heparin Induced Thrombocytopenia BSH Recommendations","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Farmacología de la warfarina, INR y farmacogenética CYP2C9/VKORC1', 'Clase 3 · Warfarina', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el ciclo de la vitamina K, el inicio y la superposición con heparina, el rango de INR y la influencia de CYP2C9 y VKORC1 en la dosis.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=R-xabd7i1Fw","provider":"youtube","videoId":"R-xabd7i1Fw","title":"Vitamin K antagonists","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://encolombia.com/?p=95239","title":"[Página web] Anticoagulantes en urgencias toxicológicas (warfarina: farmacología, CYP2C9, INR, vitamina K1)","description":"Guías de urgencias toxicológicas – Universidad Nacional de Colombia (encolombia.com) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Interacciones de la warfarina con medicamentos, alimentos y productos naturales', 'Clase 3 · Warfarina', 5, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Analiza interacciones farmacocinéticas (CYP2C9, CYP3A4, CYP1A2) y farmacodinámicas, y la consejería sobre dieta constante en vitamina K.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=7FSqNNdC-s8","provider":"youtube","videoId":"7FSqNNdC-s8","title":"Warfarina y alimentos prohibidos, qué debes saber para evitar riesgos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://encolombia.com/?p=95239","title":"[Página web] Anticoagulantes en urgencias toxicológicas (warfarina: farmacología, CYP2C9, INR, vitamina K1)","description":"Guías de urgencias toxicológicas – Universidad Nacional de Colombia (encolombia.com) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Manejo del INR fuera de rango y del sangrado con warfarina', 'Clase 3 · Warfarina', 6, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica las recomendaciones de ACCP/CHEST para INR elevado con y sin sangrado: omisión de dosis, vitamina K y CCP.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=WqvNZopQl6w","provider":"youtube","videoId":"WqvNZopQl6w","title":"Warfarin Monitoring: INR Targets, Side Effects & Management","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://encolombia.com/?p=95239","title":"[Página web] Anticoagulantes en urgencias toxicológicas (warfarina: farmacología, CYP2C9, INR, vitamina K1)","description":"Guías de urgencias toxicológicas – Universidad Nacional de Colombia (encolombia.com) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: INR elevado por interacción con antibiótico en prótesis valvular mecánica', 'Clase 4 · Caso clínico de la unidad', 7, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la evaluación de una interacción mayor y propone el manejo del INR y la educación al paciente.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: ejecutar el seguimiento de un paciente en inicio de warfarina que recibe un antibiótico interactuante, aplicando el manejo del INR fuera de rango.</p><p>Caso: mujer de 55 años con prótesis valvular mecánica mitral, en warfarina con INR estable en su rango objetivo desde hace 6 meses (controles en clínica de anticoagulación de una IPS en Cali). Consulta por infección urinaria y en urgencias le formulan trimetoprim-sulfametoxazol. A los 5 días el INR es 6,2, sin sangrado. Además, cuenta que dejó de comer verduras de hoja verde \"porque leyó que la vitamina K es mala\".</p><p>Desarrollo: el QF identifica dos problemas. Primero, una interacción farmacocinética mayor: el sulfametoxazol inhibe CYP2C9, principal vía de metabolismo de la S-warfarina (el enantiómero más potente), elevando el INR. Otros interactuantes frecuentes en la práctica colombiana son metronidazol, fluconazol, amiodarona, ciprofloxacina, macrólidos (inhibidores), y rifampicina o carbamazepina (inductores), además de fitoterapéuticos y suplementos. Segundo, un cambio dietario: la vitamina K no está prohibida; lo importante es mantener una ingesta constante. La suspensión brusca de vegetales también potencia el efecto. Manejo del INR elevado sin sangrado: según ACCP/CHEST y guías locales, con INR por encima del rango pero &lt;10 sin sangrado se omite una o más dosis y se reanuda a dosis menor cuando el INR vuelve al rango; la vitamina K oral a dosis baja puede considerarse según riesgo de sangrado y protocolo institucional; con INR &gt;10 sin sangrado suele recomendarse vitamina K oral; ante sangrado mayor se usan vitamina K intravenosa más concentrado de complejo protrombínico (CCP). En prótesis mecánica se evita sobrecorregir, porque el riesgo trombótico es alto; no se usan ACOD en prótesis mecánicas. Se sugiere al prescriptor una alternativa antibiótica con menor interacción según el urocultivo, o mantener el antibiótico con controles de INR más estrechos.</p><p>Intervención del QF: comunicación al médico de la clínica de anticoagulación con la propuesta de manejo; control de INR en 24–72 horas; educación sobre dieta constante, signos de sangrado y la obligación de informar todo nuevo medicamento (incluidos productos naturales); registro de la interacción como problema relacionado con medicamentos y reporte del evento al programa de farmacovigilancia.</p><p>Puntos clave:<br>1. Toda prescripción nueva en un paciente con warfarina debe revisarse por interacciones, especialmente inhibidores de CYP2C9.<br>2. La dieta con vitamina K debe ser constante, no eliminada.<br>3. El manejo del INR elevado depende de la magnitud y de si hay sangrado, siempre siguiendo el protocolo institucional y la guía vigente.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Anticoagulantes orales directos e indicaciones clínicas', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: la era de los ACOD', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume el cambio de paradigma de warfarina a ACOD y las indicaciones principales: FA, TEV y profilaxis.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=hS0ELU8lsVI","provider":"youtube","videoId":"hS0ELU8lsVI","title":"DOACs (anticoagulantes orales directos) ¿Hacia dónde vamos?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Dabigatrán, rivaroxabán, apixabán y edoxabán: farmacología comparada', 'Clase 2 · Farmacología de los ACOD', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara mecanismo (anti-IIa vs anti-Xa), biodisponibilidad, efecto de los alimentos, eliminación renal y posología.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=I2Q0Ieww4T4","provider":"youtube","videoId":"I2Q0Ieww4T4","title":"Apixaban, Rivaroxaban, Edoxaban (Direct Factor X Inhibitor Drugs)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://revistas.unal.edu.co/index.php/revfacmed/article/view/49963","title":"[Página web] Uso de los anticoagulantes orales directos en la práctica clínica (Rev Fac Med UNAL, 2016)","description":"Revista de la Facultad de Medicina – Universidad Nacional de Colombia (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'ACOD: ajuste renal, interacciones P-gp/CYP3A4 y poblaciones especiales', 'Clase 2 · Farmacología de los ACOD', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica Cockcroft-Gault, criterios de reducción de dosis, interacciones y precauciones en adulto mayor, obesidad, hepatopatía, embarazo, lactancia, prótesis valvulares y síndrome antifosfolípido.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=50S0nPS7bjA","provider":"youtube","videoId":"50S0nPS7bjA","title":"Anticoagulación y empleo correcto de anticoagulantes directos en el paciente complejo","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://revistas.unal.edu.co/index.php/revfacmed/article/view/49963","title":"[Página web] Uso de los anticoagulantes orales directos en la práctica clínica (Rev Fac Med UNAL, 2016)","description":"Revista de la Facultad de Medicina – Universidad Nacional de Colombia (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Fibrilación auricular: CHA2DS2-VASc/CHA2DS2-VA y HAS-BLED', 'Clase 3 · Indicaciones de la anticoagulación', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las escalas de riesgo trombótico y hemorrágico y la elección del anticoagulante según la guía ESC 2024.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=XJ396Tk0P3c","provider":"youtube","videoId":"XJ396Tk0P3c","title":"Score HAS-BLED: cómo calcular el riesgo de sangrado en fibrilación auricular","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=FHFHHspNRxM","provider":"youtube","videoId":"FHFHHspNRxM","title":"Calculadora de CHA2DS2-VASc y HAS-BLED en AppICFA","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/atrial-fibrillation/","title":"[Página web] 2024 ESC Guidelines for the management of atrial fibrillation","description":"European Society of Cardiology (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Tromboembolismo venoso: fases de tratamiento y duración', 'Clase 3 · Indicaciones de la anticoagulación', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la fase inicial, de mantenimiento y extendida, el uso de HBPM en cáncer y embarazo y la elección del ACOD.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=A8UiXfSyMys","provider":"youtube","videoId":"A8UiXfSyMys","title":"Anticoagulants Pharmacology: Heparin, Warfarin & DOACs","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/acute-pulmonary-embolism/","title":"[Página web] ESC Guidelines – Acute pulmonary embolism (2019)","description":"European Society of Cardiology (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Profilaxis de TEV en pacientes médicos, quirúrgicos y en gestación', 'Clase 3 · Indicaciones de la anticoagulación', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica escalas de riesgo (Padua, Caprini) y la elección de profilaxis farmacológica, con datos colombianos de subutilización.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.redalyc.org/pdf/843/84322466007.pdf","title":"Profilaxis de la tromboembolia venosa en pacientes colombianos: resultados para Colombia del estudio ENDORSE (Biomédica, 2011)","description":"Biomédica – Instituto Nacional de Salud (Redalyc) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.redalyc.org/journal/1952/195257401005/195257401005.pdf","title":"GPC para la prevención de eventos tromboembólicos venosos durante la gestación, el parto o el puerperio (Rev Colomb Obstet Ginecol, 2017)","description":"Revista Colombiana de Obstetricia y Ginecología – ASBOG (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: adulto mayor con FA, enfermedad renal e interacciones', 'Clase 4 · Caso clínico de la unidad', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la estratificación de riesgo, la selección y dosificación del ACOD y la deprescripción de AAS y AINE.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar la estratificación de riesgo y la selección y dosificación de un ACOD en un adulto mayor con fibrilación auricular y enfermedad renal crónica.</p><p>Caso: hombre de 81 años, 64 kg, hipertenso, con insuficiencia cardíaca con fracción de eyección preservada y diabetes. Diagnóstico nuevo de fibrilación auricular no valvular. Creatinina 1,7 mg/dL. Medicamentos: amlodipino, losartán, metformina, verapamilo (formulado por otro especialista), ácido acetilsalicílico \"por prevención\" y diclofenaco ocasional. El médico propone rivaroxabán en dosis plena y solicita concepto del QF.</p><p>Desarrollo: (1) Riesgo trombótico: la guía ESC 2024 de FA usa el CHA2DS2-VA (retira el sexo como criterio). El paciente puntúa por insuficiencia cardíaca, hipertensión, edad ≥75 (2 puntos) y diabetes: indicación clara de anticoagulación oral. (2) Riesgo hemorrágico: HAS-BLED u otra escala sirve para identificar factores modificables, no para negar la anticoagulación. Aquí los modificables son: AAS sin indicación vascular adicional, AINE (diclofenaco), y presión arterial no siempre controlada. (3) Función renal: el QF calcula la depuración de creatinina con Cockcroft-Gault usando peso real: aproximadamente 37 mL/min. Con ese valor, rivaroxabán requiere la dosis reducida de la ficha técnica para FA (umbral 15–49 mL/min); apixabán solo reduce dosis si cumple dos criterios (edad ≥80 y creatinina ≥1,5 se cumplen aquí, por lo que aplicaría la reducción); dabigatrán, de eliminación predominantemente renal, se usa con precaución y está contraindicado por debajo de 30 mL/min. (4) Interacciones: verapamilo es inhibidor de P-gp y moderado de CYP3A4, lo que aumenta la exposición a dabigatrán y edoxabán (con recomendación de ajuste en la ficha técnica) y en menor grado a los inhibidores Xa; se documenta y vigila. (5) Valvular: confirmar que no hay estenosis mitral moderada-grave ni prótesis mecánica (contraindicaciones de ACOD).</p><p>Intervención del QF: recomendar la dosis ajustada del ACOD elegido; proponer suspender el AAS si no hay indicación coronaria o vascular reciente y eliminar el diclofenaco (alternativa: acetaminofén); educación con tarjeta de anticoagulado, horario fijo, qué hacer ante dosis olvidada; control de función renal al menos cada 6–12 meses (más frecuente si la depuración es &lt;60 mL/min, una regla práctica es dividir la depuración por 10 para obtener los meses entre controles); verificar si el ACOD está cubierto con UPC en el PBS vigente o requiere MIPRES.</p><p>Puntos clave:<br>1. Dosificar ACOD con Cockcroft-Gault y criterios de la ficha técnica; las dosis inapropiadamente bajas también son errores.<br>2. HAS-BLED sirve para corregir factores modificables (AAS, AINE, HTA), no para negar la anticoagulación.<br>3. Revisar inhibidores de P-gp/CYP3A4 y contraindicaciones valvulares antes de iniciar un ACOD.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Perioperatorio, reversión y atención farmacéutica en anticoagulación', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: escenarios de alto riesgo con antitrombóticos', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume el manejo perioperatorio, la reversión y el seguimiento ambulatorio como ejes de la atención farmacéutica.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: resumir los temas de la unidad sobre manejo perioperatorio, reversión de antitrombóticos y el rol del QF en clínicas de anticoagulación.</p><p>Desarrollo: los antitrombóticos son, de manera consistente, uno de los grupos de medicamentos con mayor proporción de eventos adversos prevenibles en los hospitales; por eso son considerados medicamentos de alto riesgo en las listas de seguridad del paciente (ISMP) y en los programas institucionales de farmacovigilancia exigidos en Colombia. Esta unidad integra lo aprendido en las anteriores para resolver tres situaciones críticas en la práctica. La primera es el paciente que va a un procedimiento o cirugía: debe decidirse si se suspende el antitrombótico, cuántos días antes (según la vida media, la función renal y el riesgo hemorrágico del procedimiento), si se necesita terapia puente con heparina (hoy reservada para un grupo reducido de pacientes con muy alto riesgo trombótico en warfarina, tras evidencias como el ensayo BRIDGE) y cuándo reanudar. En los pacientes con stent reciente, la suspensión de la doble antiagregación debe consensuarse con cardiología. La segunda situación es el sangrado mayor o la cirugía urgente: el QF debe conocer los agentes de reversión (vitamina K, concentrado de complejo protrombínico, protamina, idarucizumab, andexanet alfa), su disponibilidad real en la institución, su registro sanitario INVIMA y su preparación. La tercera es el seguimiento ambulatorio: las clínicas de anticoagulación lideradas o apoyadas por QF han demostrado mejorar el tiempo en rango terapéutico (TTR) de la warfarina y reducir eventos; con los ACOD el foco cambia hacia la adherencia, la dosificación renal y las interacciones. Por último, se revisa el marco normativo y de guías: GPC del Ministerio de Salud y Protección Social/IETS (por ejemplo, la de síndrome coronario agudo y la de ataque cerebrovascular isquémico), guías ACCP/CHEST, ESC y ASH, la regulación del servicio farmacéutico (Decreto 780 de 2016 y Resolución 1403 de 2007) y los mecanismos de acceso PBS/MIPRES.</p><p>Ejemplo: un QF de una clínica en Barranquilla elabora la tabla institucional de suspensión preoperatoria de antitrombóticos, acordada con anestesiología, cirugía y hematología, y la integra a la lista de verificación de cirugía segura.</p><p>Puntos clave:<br>1. Perioperatorio, reversión y seguimiento ambulatorio son los tres escenarios de mayor riesgo con antitrombóticos.<br>2. La terapia puente es hoy la excepción, no la regla.<br>3. El QF aporta protocolos institucionales, verificación de dosis, disponibilidad de antídotos y farmacovigilancia.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Suspensión perioperatoria de antitrombóticos y terapia puente', 'Clase 2 · Manejo perioperatorio y reversión', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica la clasificación de riesgo hemorrágico del procedimiento, los tiempos de suspensión según fármaco y función renal y los criterios actuales de terapia puente.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=KfLlr7XI0JQ","provider":"youtube","videoId":"KfLlr7XI0JQ","title":"Manejo perioperatorio de la anticoagulación: de la teoría a la práctica","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.intramed.net/content/como-actuar-ante-la-cirugia-y-procedimientos-invasivos-en-pacientes-anticoagulados","title":"[Página web] ¿Cómo actuar ante la cirugía y procedimientos invasivos en pacientes anticoagulados? (resumen de BMJ 2015)","description":"IntraMed (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/non-cardiac-surgery/","title":"[Página web] ESC Guidelines – Cardiovascular assessment and management of patients undergoing non-cardiac surgery (2022)","description":"European Society of Cardiology (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Reversión: vitamina K, CCP, protamina, idarucizumab y andexanet alfa', 'Clase 2 · Manejo perioperatorio y reversión', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara agentes de reversión, indicaciones, preparación y riesgos trombóticos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=b3C0RKxwDVU","provider":"youtube","videoId":"b3C0RKxwDVU","title":"Reversing oral anticoagulants with a focus on Andexanet Alfa","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=LiRC-oTWHxc","provider":"youtube","videoId":"LiRC-oTWHxc","title":"Idarucizumab reversal of dabigatran in acute ischemic stroke and intracranial hemorrhage","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Clínicas de anticoagulación y rol del QF', 'Clase 3 · Atención farmacéutica y marco de guías', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la organización de una clínica de anticoagulación, el TTR y las funciones del QF en seguimiento y farmacovigilancia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: describir la organización de una clínica de anticoagulación y las funciones del QF en el seguimiento farmacoterapéutico de pacientes anticoagulados en Colombia.</p><p>Desarrollo: una clínica (o programa) de anticoagulación es un modelo de atención sistemático para pacientes con anticoagulantes orales, que incluye protocolo escrito, base de datos de pacientes, educación estructurada, controles programados y canal de comunicación ante eventos. En warfarina, el indicador clave es el tiempo en rango terapéutico (TTR, por método de Rosendaal); un TTR inferior a aproximadamente 65–70% sugiere control deficiente y, si no hay contraindicación, es motivo para evaluar el cambio a un ACOD. En Colombia, la Resolución 1403 de 2007 y el Decreto 780 de 2016 definen el servicio farmacéutico y la atención farmacéutica como procesos del QF; los programas de seguimiento farmacoterapéutico se apoyan en metodologías como Dáder. Funciones del QF: (1) entrevista inicial y conciliación medicamentosa, incluyendo productos naturales; (2) educación con material escrito sobre el objetivo de la terapia, la dosis, el horario, la dieta constante en vitamina K, los signos de sangrado y trombosis y la conducta ante dosis olvidadas; (3) ajuste de dosis de warfarina por protocolo (cuando la institución lo delega bajo supervisión médica) o recomendación al médico; (4) revisión de interacciones en cada nueva prescripción; (5) para ACOD: verificación de dosis según indicación, función renal, edad y peso, y medición de adherencia (los ACOD tienen vida media corta y la falta de adherencia deja al paciente desprotegido); (6) control de función renal, hemoglobina y función hepática con la periodicidad acordada; (7) coordinación del manejo perioperatorio; (8) reporte de RAM y errores de medicación al Programa Nacional de Farmacovigilancia del INVIMA, y seguimiento de alertas sanitarias INVIMA sobre antitrombóticos; (9) gestión de barreras de acceso con la EPS y el gestor farmacéutico (entregas incompletas, cambios de marca o genérico, MIPRES). El autocontrol del INR con coagulómetro portátil es una opción en pacientes seleccionados y entrenados.</p><p>Ejemplo: una IPS de Bucaramanga con 400 pacientes en warfarina crea una consulta de QF para quienes tienen TTR bajo; identifica como causas principales interacciones no detectadas y falta de adherencia, y propone al comité de farmacia criterios para cambiar a ACOD en candidatos sin contraindicación.</p><p>Puntos clave:<br>1. El TTR es el indicador de calidad de la anticoagulación con warfarina.<br>2. Con ACOD, el seguimiento del QF se centra en adherencia, dosis renal e interacciones.<br>3. Todo evento adverso o error con antitrombóticos debe reportarse a farmacovigilancia.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'GPC MinSalud, ACCP/CHEST y ESC: del papel al protocolo institucional', 'Clase 3 · Atención farmacéutica y marco de guías', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara las recomendaciones de las guías y su aplicación en el sistema colombiano (PBS/UPC, MIPRES, INVIMA).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: comparar las principales guías de práctica clínica (GPC) que orientan el uso de antitrombóticos y ubicarlas en el sistema de salud colombiano.</p><p>Desarrollo: el Ministerio de Salud y Protección Social, con el IETS y universidades, publicó GPC basadas en evidencia (metodología GRADE) que tocan el uso de antitrombóticos, entre ellas la GPC de síndrome coronario agudo y la GPC de ataque cerebrovascular isquémico, disponibles en el repositorio gpc.minsalud.gov.co. Varias de estas guías tienen más de cinco años; por ello, en la práctica se complementan con guías internacionales actualizadas: (a) ESC: SCA 2023 (DAPT, preferencia de ticagrelor/prasugrel en SCA con angioplastia, estrategias de acortamiento y desescalamiento), FA 2024 (CHA2DS2-VA, preferencia de ACOD sobre warfarina salvo prótesis mecánica o estenosis mitral moderada-grave, manejo de factores modificables de sangrado), embolia pulmonar 2019 y cirugía no cardíaca 2022; (b) ACCP/CHEST: terapia antitrombótica para TEV (actualizaciones 2016 y 2021) y manejo perioperatorio de antitrombóticos (2022), que restringe la terapia puente; (c) ASH: guías de TEV (incluidas TIH, embarazo y profilaxis en pacientes médicos y quirúrgicos); (d) sociedades colombianas: Sociedad Colombiana de Cardiología y Cirugía Cardiovascular, Asociación Colombiana de Medicina Interna y la Asociación Colombiana de Hematología y Oncología, además de GPC de sociedades como la de prevención de TEV en gestación (ASBOG). Para el QF, el valor de las guías está en convertirlas en protocolos institucionales: tablas de dosificación renal de HBPM y ACOD, nomogramas de HNF, algoritmo de reversión, tabla de suspensión perioperatoria. Acceso: el listado del Plan de Beneficios en Salud financiado con UPC se actualiza anualmente por resolución del Ministerio; antes de recomendar un antitrombótico, el QF verifica si el principio activo, la concentración y la indicación están cubiertos o si requieren prescripción por MIPRES, y revisa el registro sanitario vigente y las alertas en la página del INVIMA.</p><p>Ejemplo: el comité de farmacia y terapéutica de una clínica de Pereira actualiza su protocolo de FA: incorpora el CHA2DS2-VA de la ESC 2024, una tabla de dosis de ACOD por depuración de creatinina y la verificación de cobertura PBS/MIPRES para cada ACOD disponible.</p><p>Puntos clave:<br>1. Las GPC colombianas son la referencia normativa, pero deben complementarse con guías internacionales recientes (ESC, CHEST, ASH).<br>2. El QF traduce las guías a protocolos institucionales operativos.<br>3. Cobertura PBS/MIPRES, registro INVIMA y alertas sanitarias deben verificarse antes de cada recomendación.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso integrador: sangrado digestivo mayor en paciente con rivaroxabán', 'Clase 4 · Caso integrador', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta el algoritmo de sangrado mayor con ACOD, la reversión y el reporte a farmacovigilancia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: ejecutar el algoritmo de manejo de un sangrado mayor en un paciente con ACOD, definiendo las acciones del QF.</p><p>Caso: hombre de 70 años, 80 kg, en rivaroxabán por tromboembolismo venoso recurrente, ingresa a urgencias de un hospital en Bogotá con hemorragia digestiva alta, presión arterial 85/50 mmHg y hemoglobina 7,1 g/dL. Última dosis hace 8 horas. Depuración de creatinina estimada 55 mL/min. Toma además sertralina e ibuprofeno de venta libre.</p><p>Desarrollo: el manejo del sangrado mayor sigue pasos generales: (1) suspender el anticoagulante y los antiagregantes/AINE; (2) medidas de soporte: reanimación con líquidos, transfusión según umbrales, control endoscópico de la fuente; (3) estimar el efecto anticoagulante residual: hora de última dosis, función renal y, si está disponible, nivel anti-Xa calibrado para rivaroxabán; (4) considerar reversión cuando el sangrado amenaza la vida o compromete un órgano crítico. Para inhibidores del factor Xa, las opciones son andexanet alfa (antídoto específico; su disponibilidad en Colombia y su registro INVIMA deben verificarse; el ensayo ANNEXA-I mostró mejor control hemostático en hemorragia intracerebral con aumento de eventos trombóticos) o concentrado de complejo protrombínico de 4 factores como alternativa inespecífica. Para dabigatrán, idarucizumab es el antídoto específico, y la hemodiálisis es una opción. El carbón activado puede considerarse si la ingesta fue muy reciente. La vitamina K y el plasma fresco congelado no revierten los ACOD. (5) Reinicio: tras la hemostasia, evaluar con el equipo cuándo reiniciar la anticoagulación, porque no reanudarla aumenta el riesgo trombótico y la mortalidad; reconsiderar duración de la terapia si el TEV ya superó el periodo indicado.</p><p>Intervención del QF: conciliación (hora de última dosis, AINE, ISRS que aumentan el riesgo de sangrado), verificación de disponibilidad del antídoto o del CCP en la farmacia y su preparación con doble chequeo, registro de lote, recomendación de suspender ibuprofeno y valorar un IBP, reporte del evento al Programa Nacional de Farmacovigilancia del INVIMA, y educación al alta (evitar AINE de venta libre, uso de acetaminofén).</p><p>Puntos clave:<br>1. Soporte y control de la fuente primero; la reversión es para sangrado amenazante o en órgano crítico.<br>2. Idarucizumab para dabigatrán; andexanet alfa o CCP para inhibidores Xa según disponibilidad y protocolo.<br>3. Los AINE de venta libre y los ISRS son interacciones farmacodinámicas frecuentes que el QF debe detectar.</p>"}'::jsonb);

END
$curso$;
