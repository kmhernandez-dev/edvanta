-- ============================================================
--  044_cursos_productos_especiales.sql — Productos especiales
--
--  Diez cursos sobre el registro y la regulación de productos de
--  manejo especial —biológicos, vacunas, cannabis, radiofármacos—, 336 clases en total, y en cada clase el
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

-- ─── 11. Curso de Registro Sanitario de Medicamentos Biológicos (34 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Registro Sanitario de Medicamentos Biológicos' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Registro Sanitario de Medicamentos Biológicos', 'Curso especializado en el registro sanitario de medicamentos biológicos en Colombia bajo el Decreto 1782 de 2014. Cubre categorías de biológicos, rutas de evaluación, guías de inmunogenicidad, estabilidad y gestión de riesgo, calidad ICH, BPM de biológicos, migración normativa y cadena de frío, con casos prácticos de trámites INVIMA.', '<p>Curso especializado en el registro sanitario de medicamentos biológicos en Colombia bajo el Decreto 1782 de 2014. Cubre categorías de biológicos, rutas de evaluación, guías de inmunogenicidad, estabilidad y gestión de riesgo, calidad ICH, BPM de biológicos, migración normativa y cadena de frío, con casos prácticos de trámites INVIMA.</p><h3>Objetivo general</h3><p>Que el Químico Farmacéutico planee, prepare y mantenga el registro sanitario de un medicamento biológico ante el INVIMA, aplicando el Decreto 1782 de 2014, sus guías técnicas, los estándares ICH de calidad y los requisitos de BPM y cadena de frío.</p><h3>A quién va dirigido</h3><p>Químicos Farmacéuticos y profesionales de asuntos regulatorios, calidad y farmacovigilancia de laboratorios, importadores y titulares de registros de medicamentos biológicos en Colombia.</p><h3>Contexto normativo</h3><p>Colombia — normativa INVIMA / MinSalud</p>',
          'Asuntos regulatorios — productos especiales', 'intermedio', 'Que el Químico Farmacéutico planee, prepare y mantenga el registro sanitario de un medicamento biológico ante el INVIMA, aplicando el Decreto 1782 de 2014, sus guías técnicas, los estándares ICH de calidad y los requisitos de BPM y cadena de frío.', 'Químicos Farmacéuticos y profesionales de asuntos regulatorios, calidad y farmacovigilancia de laboratorios, importadores y titulares de registros de medicamentos biológicos en Colombia.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Fundamentos de los medicamentos biológicos y su marco normativo', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: por qué los biológicos tienen un régimen propio', 'Clase 1 · Clase 1 – Introducción al curso', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume el alcance del curso y por qué los biológicos se evalúan bajo el Decreto 1782 de 2014 además del régimen base del Decreto 677 de 1995.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=Cq2diDJQSgo","provider":"youtube","videoId":"Cq2diDJQSgo","title":"¿Qué son los Medicamentos Biológicos y Biosimilares?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.unbosque.edu.co/sites/default/files/2025-07/Diplomado%20en%20Asuntos%20regulatorios%20sobre%20medicamentos%20biologicos%20y%20de%20sintesis%20quimica.pdf","title":"Diplomado en Asuntos regulatorios sobre medicamentos biológicos y de síntesis química (contenidos y módulos)","description":"Universidad El Bosque (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Definición de medicamento biológico y diferencias con la síntesis química', 'Clase 2 · Qué es un medicamento biológico y sus categorías', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la definición legal del Decreto 1782 (biológico y biotecnológico) y las diferencias de tamaño, complejidad, variabilidad y dependencia del proceso frente a moléculas pequeñas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=Cq2diDJQSgo","provider":"youtube","videoId":"Cq2diDJQSgo","title":"¿Qué son los Medicamentos Biológicos y Biosimilares?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1782_2014.htm","title":"[Página web] Decreto 1782 de 2014 – Evaluación farmacológica y farmacéutica de medicamentos biológicos (texto compilado)","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.saludcastillayleon.es/portalmedicamento/es/noticias-destacados/noticias/acerca-medicamentos-biologicos","title":"[Página web] Acerca de los medicamentos biológicos (inmunológicos, hemoderivados, biotecnológicos, terapias avanzadas)","description":"Portal del Medicamento – Junta de Castilla y León / CADIME (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Proteínas recombinantes y anticuerpos monoclonales', 'Clase 2 · Qué es un medicamento biológico y sus categorías', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las principales clases biotecnológicas (proteínas recombinantes, anticuerpos monoclonales, proteínas de fusión) y su nomenclatura (-mab, -cept).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.nfid.org/wp-content/uploads/2023/05/mAbs-Fact-Sheet-Spanish.pdf","title":"Anticuerpos monoclonales (mAb) – hoja informativa","description":"National Foundation for Infectious Diseases (NFID) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.saludcastillayleon.es/portalmedicamento/es/noticias-destacados/noticias/acerca-medicamentos-biologicos","title":"[Página web] Acerca de los medicamentos biológicos (inmunológicos, hemoderivados, biotecnológicos, terapias avanzadas)","description":"Portal del Medicamento – Junta de Castilla y León / CADIME (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.novartis.com/es-es/stories/que-son-los-medicamentos-biologicos","title":"[Página web] ¿Qué son los medicamentos biológicos?","description":"Novartis España (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Hemoderivados y terapias avanzadas: panorama general', 'Clase 2 · Qué es un medicamento biológico y sus categorías', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el encuadre regulatorio de los hemoderivados y el estado de la regulación de terapias avanzadas en Colombia frente a referentes internacionales.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/concepto_invima_0000116_2025.htm","title":"[Página web] Concepto INVIMA 116 de 2025 – marco normativo del plasma y productos sanguíneos (actualización Decreto 1571 de 1993)","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/dispositivos_componentes_anatomicos/PRESENTACION-TERAPIAS-AVANZADAS-UNA-MIRADA-DESDE-EL-CONTEXTO-COLOMBIA-16-11-2017.pdf","title":"Terapias avanzadas: una mirada desde el contexto colombiano (INVIMA, 2017)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.ema.europa.eu/es/human-regulatory-overview/advanced-therapy-medicinal-products-overview/guidelines-relevant-advanced-therapy-medicinal-products","title":"[Página web] Guidelines relevant for advanced therapy medicinal products","description":"European Medicines Agency (EMA) (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Mapa normativo de biológicos en Colombia', 'Clase 3 · Mapa normativo y clasificación de productos', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la articulación entre Decreto 677/1995, Decreto 1782/2014, guías técnicas de MinSalud, Decreto 334/2022, Decreto 1474/2023 y Circular 19/2023.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=NBxhZYo_RJM","provider":"youtube","videoId":"NBxhZYo_RJM","title":"Arquitectura regulatoria para ampliar competencia en biológicos y biosimilares","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/normatividad-medicamentos","title":"[Página web] Normatividad aplicable a Medicamentos y Productos Biológicos","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/biblioteca/preview/126906","title":"[Página web] Decreto 1782 de 2014 (ficha y documento en la biblioteca INVIMA)","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: clasificar un portafolio de productos de origen biológico', 'Clase 3 · Mapa normativo y clasificación de productos', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica la definición del Decreto 1782 para decidir la norma y el trámite INVIMA de cinco productos frontera.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: clasificar correctamente un portafolio de productos de origen biológico para decidir bajo qué marco normativo y qué trámite INVIMA debe gestionarse cada uno.</p><p>Desarrollo: el primer error en asuntos regulatorios de biológicos es aplicar la norma equivocada. El Decreto 1782 de 2014 define el medicamento biológico como aquel derivado de organismos o células vivas o sus partes, obtenido por cultivo celular, microorganismos, procesamiento de tejidos o fluidos, transgénesis, ADN recombinante o hibridomas; los obtenidos por estas tres últimas técnicas se denominan biotecnológicos. Esa definición cubre proteínas recombinantes (insulinas, eritropoyetinas, factores estimulantes de colonias), anticuerpos monoclonales y proteínas de fusión, hemoderivados (albúmina, inmunoglobulinas, factores de coagulación) y vacunas (estas últimas tienen curso propio, el 13). Quedan por fuera, o con un marco aún en construcción, los componentes anatómicos y las terapias celulares manipuladas mínimamente en IPS, que el INVIMA ha descrito como productos que no encajan del todo en las categorías tradicionales. Los péptidos de síntesis química (por ejemplo, algunos análogos de GLP-1 obtenidos por síntesis) deben analizarse caso a caso: el origen del IFA, no su tamaño, determina la ruta.</p><p>Ejemplo aplicado: una compañía importadora tiene cinco productos: (1) un anticuerpo monoclonal anti-TNF innovador, (2) una insulina glargina de un segundo fabricante, (3) una albúmina humana al 20 %, (4) un péptido producido por síntesis en fase sólida, (5) un producto de células mesenquimales para uso ortopédico. La matriz de decisión queda así: (1) biológico biotecnológico, Decreto 1782, ruta de expediente completo, evaluación farmacológica ante la Sala Especializada de Medicamentos y Productos Biológicos; (2) biotecnológico, Decreto 1782, ruta de comparabilidad o abreviada frente a un producto de referencia (ver curso 12); (3) hemoderivado, Decreto 1782, con especial atención a la seguridad viral (ICH Q5A) y al origen del plasma; (4) no es biológico: sigue el régimen de síntesis química del Decreto 677 de 1995; (5) terapia avanzada: requiere consulta previa al INVIMA, porque no existe todavía un trámite de registro estandarizado equiparable al de un medicamento. Para cada caso, el profesional debe documentar en el expediente la justificación de la clasificación y conservar el soporte normativo.</p><p>Puntos clave:<br>1. El origen del ingrediente activo (organismo vivo, ADN recombinante, hibridoma, fluido biológico) define si aplica el Decreto 1782.<br>2. Una clasificación errónea al inicio genera requerimientos, negaciones o la necesidad de una migración normativa posterior.<br>3. Ante productos frontera (terapias avanzadas, péptidos, productos combinados), formule una consulta escrita al INVIMA antes de radicar.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Decreto 1782 de 2014: rutas y evaluación farmacológica', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: la lógica del Decreto 1782', 'Clase 1 · Clase 1 – Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume el objeto del Decreto 1782, sus actores (Sala Especializada, Dirección de Medicamentos) y la secuencia evaluación farmacológica–farmacéutica–legal.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preview/126906","title":"[Página web] Decreto 1782 de 2014 (ficha y documento en la biblioteca INVIMA)","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/autorizacion-de-comercializacion-registros","title":"[Página web] Autorización de comercialización (Registros Sanitarios) – Medicamentos","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Estructura del Decreto 1782: definiciones e información común (art. 6)', 'Clase 2 · Las tres rutas de evaluación', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las definiciones (biológico, referencia, comparabilidad) y los requisitos comunes a las tres rutas: proceso, sistema de expresión, identidad, potencia, pureza, inmunogenicidad y PGR.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1782_2014.htm","title":"[Página web] Decreto 1782 de 2014 – Evaluación farmacológica y farmacéutica de medicamentos biológicos (texto compilado)","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.unbosque.edu.co/sites/default/files/2025-07/Diplomado%20en%20Asuntos%20regulatorios%20sobre%20medicamentos%20biologicos%20y%20de%20sintesis%20quimica.pdf","title":"Diplomado en Asuntos regulatorios sobre medicamentos biológicos y de síntesis química (contenidos y módulos)","description":"Universidad El Bosque (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Ruta de expediente completo', 'Clase 2 · Las tres rutas de evaluación', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe cuándo aplica la ruta del art. 7 y qué estudios de calidad, preclínicos y clínicos propios exige.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1782_2014.htm","title":"[Página web] Decreto 1782 de 2014 – Evaluación farmacológica y farmacéutica de medicamentos biológicos (texto compilado)","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/sites/default/files/medicamentos-y-productos-biologicos/tecnico-medicamentos-2/FM166.pdf","title":"ASS-RSA-FM166 Formato de solicitud unificada de evaluación farmacológica y registro sanitario nuevo","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Rutas de comparabilidad y abreviada: visión general', 'Clase 2 · Las tres rutas de evaluación', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara brevemente las rutas de los arts. 8 y 9 con la de expediente completo (el detalle se estudia en el curso 12 de biosimilares).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=xA6CEMEQVpQ","provider":"youtube","videoId":"xA6CEMEQVpQ","title":"¿Qué es un medicamento biológico biosimilar? Tu Farmacéutico Informa – #Biosimilares","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=NBxhZYo_RJM","provider":"youtube","videoId":"NBxhZYo_RJM","title":"Arquitectura regulatoria para ampliar competencia en biológicos y biosimilares","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/sites/default/files/medicamentos-y-productos-biologicos/tecnico-medicamentos-2/Decreto_1782_de_2014.pdf","title":"Listado de medicamentos biológicos aprobados por las rutas de comparabilidad – Decreto 1782 de 2014 (corte 31 dic. 2024)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'La Sala Especializada de Medicamentos y Productos Biológicos', 'Clase 3 · Evaluación farmacológica, farmacéutica y legal', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el rol de la Sala (art. 4), sus cronogramas, actas y lineamientos de radicación, y cómo leer un concepto.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/sala-especializada-medicamentos-sintesis","title":"[Página web] Sala Especializada de Medicamentos – Comisión Revisora (cronogramas, actas SEMPB, normatividad, preguntas frecuentes)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/acta_no_07_de_2025_sempb_segunda_partepdf","title":"Acta No. 07 de 2025 – Comisión Revisora, Sala Especializada de Medicamentos y Productos Biológicos (segunda parte)","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_sala_especializada_medicamentos_sintesis/LINEAMIENTOS-PARA-LA-RADICACION-DE-TRAMITES-ANTE-LA-SALA-ESPECIALIZADA-DE-MEDICAMENTOS-Y-PRODUCTOS-BIOLOGICOS-DE-LA-COMISION-REVISORA-07-10-2016.pdf","title":"Lineamientos para la radicación de trámites ante la Sala Especializada de Medicamentos y Productos Biológicos de la Comisión Revisora","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Solicitud unificada y tiempos del trámite', 'Clase 3 · Evaluación farmacológica, farmacéutica y legal', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica el formato ASS-RSA-FM166 y la información de tiempos de trámite para planear la radicación de un biológico.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/sites/default/files/medicamentos-y-productos-biologicos/tecnico-medicamentos-2/FM166.pdf","title":"ASS-RSA-FM166 Formato de solicitud unificada de evaluación farmacológica y registro sanitario nuevo","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/tiempos-tramites-registros-sanitarios","title":"[Página web] Tiempos de trámites de registros sanitarios – Dirección de Medicamentos y Productos Biológicos","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/autorizacion-de-comercializacion-registros","title":"[Página web] Autorización de comercialización (Registros Sanitarios) – Medicamentos","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: ruta y solicitud de un anticuerpo monoclonal nuevo', 'Clase 3 · Evaluación farmacológica, farmacéutica y legal', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la selección de ruta y la planeación completa de la solicitud de evaluación farmacológica y registro de un anticuerpo innovador.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: ejecutar la selección de ruta y la planeación de la solicitud de evaluación farmacológica y registro sanitario de un anticuerpo monoclonal nuevo en Colombia.</p><p>Desarrollo: el Decreto 1782 de 2014 (art. 5) establece tres rutas con el mismo estándar de evaluación: expediente completo (art. 7), comparabilidad (art. 8) y ruta abreviada de comparabilidad (art. 9). Un anticuerpo innovador, sin producto de referencia, solo puede ir por expediente completo: información de calidad propia más estudios preclínicos y ensayos clínicos propios. Además, el art. 6 exige para las tres rutas información sobre el proceso y lugar de producción, sistema de expresión, identidad, potencia, propiedades fisicoquímicas, actividad biológica, pureza, inmunogenicidad y plan de gestión de riesgo. La evaluación farmacológica es función de la Sala Especializada de Medicamentos y Productos Biológicos de la Comisión Revisora (art. 4); la farmacéutica y la legal las realiza la Dirección de Medicamentos y Productos Biológicos.</p><p>Ejemplo aplicado (trámite INVIMA): la compañía X quiere registrar el anticuerpo \"mAb-X\" para artritis reumatoide, ya aprobado por FDA y EMA. Pasos: (1) confirmar que es molécula nueva en Colombia y que no existe comparador; (2) elegir ruta de expediente completo; (3) usar el formato unificado ASS-RSA-FM166 para solicitar en un solo trámite la evaluación farmacológica y el registro sanitario nuevo; (4) armar el dossier en formato CTD: Módulo 1 regional (certificados BPM de la planta del IFA, del granel si aplica, del envasador y del producto terminado, poder, CPP), Módulo 2 resúmenes, Módulo 3 calidad (ICH Q5A–Q5E, Q6B), Módulos 4 y 5 estudios no clínicos y clínicos; (5) incluir el informe de inmunogenicidad según la Resolución 4490 de 2016 modificada por la 553 de 2017, los estudios de estabilidad según la Resolución 3690 de 2016 y el PGR según la Resolución 213 de 2022; (6) radicar por la Oficina Virtual, pagar la tarifa en UVB vigente y hacer seguimiento a la agenda de la Sala y al acta donde se publique el concepto; (7) responder requerimientos dentro del plazo. Si la Sala conceptúa favorablemente con condiciones (por ejemplo, farmacovigilancia activa o estudios posautorización), esas condiciones se trasladan a la resolución del registro.</p><p>Puntos clave:<br>1. Molécula sin referente = expediente completo; las rutas de comparabilidad requieren un producto de referencia (curso 12).<br>2. Inmunogenicidad, estabilidad y PGR son requisitos transversales a las tres rutas, no anexos opcionales.<br>3. Las actas de la Sala Especializada son la mejor fuente para anticipar requerimientos en moléculas similares.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Guías técnicas: inmunogenicidad, estabilidad y gestión de riesgo', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: las guías que desarrollan el Decreto 1782', 'Clase 1 · Clase 1 – Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume las guías expedidas por MinSalud en desarrollo del art. 22 (inmunogenicidad, estabilidad, PGR) y su relación con la entrada en vigencia del decreto.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1782_2014.htm","title":"[Página web] Decreto 1782 de 2014 – Evaluación farmacológica y farmacéutica de medicamentos biológicos (texto compilado)","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/normatividad-medicamentos","title":"[Página web] Normatividad aplicable a Medicamentos y Productos Biológicos","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Guía de inmunogenicidad: Resoluciones 4490 de 2016 y 553 de 2017', 'Clase 2 · Inmunogenicidad', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el alcance de la guía, las modificaciones de la Res. 553/2017 y su entrada en vigor (19 de agosto de 2017).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/resolucion_minsaludps_4490_2016.htm","title":"[Página web] Resolución 4490 de 2016 – Guía de Evaluación de la Inmunogenicidad para los Medicamentos Biológicos","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/compilacion/docs/resolucion_minsaludps_0553_2017.htm","title":"[Página web] Resolución 553 de 2017 – modifica la Resolución 4490 de 2016 (guía de inmunogenicidad)","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.minsalud.gov.co/Normatividad_Nuevo/Resolución%204490%20de%202016.pdf","title":"Resolución 4490 de 2016 (PDF MinSalud)","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Evaluación del riesgo inmunogénico y estrategia de ensayos', 'Clase 2 · Inmunogenicidad', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los factores de producto, paciente y enfermedad y la estrategia escalonada de detección de anticuerpos antifármaco.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/MET/abc-inmunogenicidad.pdf","title":"ABECÉ sobre inmunogenicidad","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/compilacion/docs/resolucion_minsaludps_4490_2016.htm","title":"[Página web] Resolución 4490 de 2016 – Guía de Evaluación de la Inmunogenicidad para los Medicamentos Biológicos","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Guía de estabilidad de medicamentos biológicos (Res. 3690 de 2016) e ICH Q5C', 'Clase 3 · Estabilidad de biológicos', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica los requisitos de diseño de estudios de estabilidad, indicadores de estabilidad y asignación de vida útil para biológicos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_3690_2016.htm","title":"[Página web] Resolución 3690 de 2016 – Guía de Estabilidad de Medicamentos Biológicos","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ema.europa.eu/en/documents/scientific-guideline/quality-biotechnological-products-stability-testing-biotechnological/biological-products_en.pdf","title":"ICH Q5C – Stability Testing of Biotechnological/Biological Products","description":"EMA / ICH (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Plan de gestión de riesgo: Resolución 213 de 2022', 'Clase 4 · Plan de gestión de riesgo y farmacovigilancia', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la estructura del PGR (especificaciones de seguridad, plan de farmacovigilancia, minimización de riesgos) y a quiénes aplica.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/resolucion_minsaludps_0213_2022.htm","title":"[Página web] Resolución 213 de 2022 – Guía para la elaboración de Planes de Gestión de Riesgo de medicamentos de síntesis química con nuevos IFA y medicamentos biológicos","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Aplicabilidad de los PGR y farmacovigilancia activa (Res. 2024015321 de 2024)', 'Clase 4 · Plan de gestión de riesgo y farmacovigilancia', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la guía externa INVIMA de aplicabilidad de PGR, las actualizaciones (trámite 4001-72), plazos y la farmacovigilancia activa del art. 24 del Decreto 1782.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preview/122196","title":"Guía externa para aclarar la aplicabilidad de los Planes de Gestión de Riesgo (PGR) – v1.0, dic. 2024 (Res. 2024015321)","description":"INVIMA – Grupo de Farmacovigilancia (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/download/122268","title":"Segunda mesa de trabajo para la implementación de la Resolución 2024015321 de 2024 (PGR y estudios posautorización)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/biblioteca/preview/143927","title":"Boletín FARMASEGURIDAD Vol. 17 (enero–junio 2025) – PGR evaluados, PSUR/PBRER","description":"INVIMA – Grupo de Farmacovigilancia (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: paquete integrado de inmunogenicidad, estabilidad y PGR', 'Clase 4 · Plan de gestión de riesgo y farmacovigilancia', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la integración coherente de los tres bloques técnicos para una eritropoyetina recombinante.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: integrar en un solo paquete técnico coherente la información de inmunogenicidad, estabilidad y gestión de riesgo que exige el INVIMA para un biológico.</p><p>Desarrollo: los requerimientos más frecuentes en biológicos aparecen cuando estos tres bloques se presentan de forma aislada y no dialogan entre sí. La guía de inmunogenicidad (Resolución 4490 de 2016, modificada por la 553 de 2017, vigente desde el 19 de agosto de 2017) pide caracterizar el riesgo inmunogénico según el producto, el paciente y la enfermedad, con métodos de detección de anticuerpos antifármaco y neutralizantes validados y un plan de seguimiento. La guía de estabilidad (Resolución 3690 de 2016) exige estudios en condiciones reales de almacenamiento, con indicadores de estabilidad que detecten cambios en la estructura de la proteína (agregados, variantes de carga, potencia). La guía de PGR (Resolución 213 de 2022 e implementación INVIMA mediante la Resolución 2024015321 de 2024) pide especificaciones de seguridad, plan de farmacovigilancia y medidas de minimización. El hilo conductor: los agregados detectados en estabilidad son un factor de riesgo inmunogénico, y la inmunogenicidad es un riesgo importante que debe figurar en el PGR.</p><p>Ejemplo aplicado: para una eritropoyetina recombinante con vida útil propuesta de 24 meses a 2–8 °C, el equipo regulatorio prepara: (a) en estabilidad, datos de tres lotes a tiempo real, estudio de estrés térmico y estudio de excursión fuera de refrigeración que soporte el texto de etiqueta; (b) en inmunogenicidad, la estrategia escalonada de ensayos (tamizaje, confirmación, neutralización), la incidencia observada en ensayos clínicos y la discusión del riesgo de aplasia pura de células rojas; (c) en el PGR, la aplasia como riesgo importante identificado o potencial, la farmacovigilancia activa del art. 24 del Decreto 1782, y medidas de minimización como material educativo y advertencias de conservación. Antes de radicar, se verifica que la condición de almacenamiento, la vida útil y las advertencias sean idénticas en el Módulo 3, el inserto, la etiqueta y el PGR.</p><p>Puntos clave:<br>1. Estabilidad, inmunogenicidad y PGR deben contar una misma historia de riesgo del producto.<br>2. Use una matriz de trazabilidad (riesgo – dato que lo soporta – medida de control) antes de radicar.<br>3. El resumen público del PGR y los materiales educativos deben presentarse en español.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Calidad de biológicos y Buenas Prácticas de Manufactura', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: calidad de biológicos en el dossier', 'Clase 1 · Clase 1 – Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume cómo las guías ICH Q5 y Q6B estructuran el Módulo 3 de un biológico y su relación con las BPM.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.ema.europa.eu/es/human-regulatory-overview/research-development/scientific-guidelines/ich-guidelines/ich-guidelines-quality","title":"[Página web] ICH guidelines: Quality (Q5A–Q5E, Q6B y demás guías de calidad)","description":"European Medicines Agency (EMA) (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.unbosque.edu.co/sites/default/files/2025-07/Diplomado%20en%20Asuntos%20regulatorios%20sobre%20medicamentos%20biologicos%20y%20de%20sintesis%20quimica.pdf","title":"Diplomado en Asuntos regulatorios sobre medicamentos biológicos y de síntesis química (contenidos y módulos)","description":"Universidad El Bosque (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'ICH Q5A y Q5D: sustratos celulares y seguridad viral', 'Clase 2 · Guías ICH de calidad para biotecnológicos', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la caracterización de bancos celulares y la evaluación de seguridad viral, incluidos los estudios de remoción e inactivación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.ema.europa.eu/es/node/69743","title":"[Página web] ICH Q5A(R2) – Viral safety evaluation of biotechnology products derived from cell lines of human or animal origin","description":"EMA / ICH (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ema.europa.eu/es/node/68758","title":"[Página web] ICH Q5D – Derivation and characterisation of cell substrates used for production of biotechnological/biological products","description":"EMA / ICH (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.ema.europa.eu/es/human-regulatory-overview/research-development/scientific-guidelines/ich-guidelines/ich-guidelines-quality","title":"[Página web] ICH guidelines: Quality (Q5A–Q5E, Q6B y demás guías de calidad)","description":"European Medicines Agency (EMA) (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'ICH Q5B y Q5E: constructo de expresión y comparabilidad tras cambios', 'Clase 2 · Guías ICH de calidad para biotecnológicos', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el análisis del constructo de expresión y la comparabilidad cuando cambia el proceso de fabricación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.ema.europa.eu/es/node/69241","title":"[Página web] ICH Q5B – Analysis of the expression construct in cell lines used for production of r-DNA derived protein products","description":"EMA / ICH (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ema.europa.eu/es/node/69582","title":"[Página web] ICH Q5E – Comparability of biotechnological/biological products subject to changes in their manufacturing process","description":"EMA / ICH (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'ICH Q6B: especificaciones y caracterización', 'Clase 2 · Guías ICH de calidad para biotecnológicos', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica los principios de caracterización (estructura, actividad biológica, pureza, impurezas) y la definición de especificaciones.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.ema.europa.eu/es/node/69581","title":"[Página web] ICH Q6B – Specifications: test procedures and acceptance criteria for biotechnological/biological products","description":"EMA / ICH (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ema.europa.eu/es/human-regulatory-overview/research-and-development/scientific-guidelines/biological-guidelines/biologicals-finished-product","title":"[Página web] Biologicals: drug product – scientific guidelines","description":"EMA (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Proceso de fabricación upstream y downstream en el dossier', 'Clase 3 · Proceso de fabricación', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta cómo se describe el proceso de producción y purificación y cómo se responden requerimientos de proceso.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: interpretar cómo se describe el proceso de fabricación de un biológico en el dossier y por qué \"el proceso es el producto\".</p><p>Desarrollo: a diferencia de una molécula de síntesis química, que puede caracterizarse completamente por métodos analíticos, la estructura y la actividad de una proteína terapéutica dependen del sistema de expresión y del proceso. Por eso el Decreto 1782 exige describir proceso y lugar de producción y sistema de expresión, y las guías ICH desarrollan el detalle. El proceso se describe en dos grandes etapas. Upstream: banco celular maestro y de trabajo (ICH Q5D), construcción del vector de expresión (ICH Q5B), expansión del cultivo y producción en biorreactor, con parámetros críticos como temperatura, pH, oxígeno disuelto y tiempo de cultivo. Downstream: cosecha, clarificación, purificación cromatográfica (afinidad con proteína A en anticuerpos, intercambio iónico), pasos específicos de inactivación y remoción viral (bajo pH, nanofiltración) que se validan según ICH Q5A, formulación, filtración estéril y llenado aséptico. Cada etapa debe tener controles en proceso, intermedios definidos y atributos críticos de calidad (glicosilación, agregados, variantes de carga, proteínas de la célula huésped, ADN residual) ligados a las especificaciones (ICH Q6B).</p><p>Ejemplo aplicado: en un requerimiento típico, el INVIMA solicita aclarar el número de pasos de remoción viral y su factor de reducción logarítmica, o la justificación de un cambio de escala del biorreactor entre lotes clínicos y comerciales. La respuesta correcta remite a los estudios de validación de remoción viral (sección 3.2.A.2 del CTD) y al ejercicio de comparabilidad del proceso según ICH Q5E, mostrando que los atributos críticos de calidad de los lotes pre y poscambio son comparables. Una respuesta solo narrativa, sin datos analíticos lado a lado, suele generar un nuevo requerimiento. Como buena práctica, el equipo regulatorio debe pedir al fabricante el diagrama de flujo completo con los rangos operativos aprobados y verificar que coincida con lo declarado en los certificados BPM y en las modificaciones históricas del producto.</p><p>Puntos clave:<br>1. En biológicos, cambios menores del proceso pueden alterar el producto; todo cambio requiere evaluación de comparabilidad.<br>2. Los bancos celulares, la validación viral y los atributos críticos de calidad son el núcleo del Módulo 3.<br>3. Mantenga una tabla de trazabilidad entre parámetros críticos del proceso, atributos críticos de calidad y especificaciones.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Manual BPM de medicamentos biológicos (Res. 5402 de 2015)', 'Clase 4 · BPM de biológicos y certificación', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el manual, el instrumento de verificación (hallazgos críticos, mayores, informativos), el ámbito y el régimen de transición.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_5402_2015.htm","title":"[Página web] Resolución 5402 de 2015 – Manual e instrumento de verificación de BPM de medicamentos biológicos","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/sites/default/files/medicamentos-y-productos-biologicos/tecnico-medicamentos/medicamentos-sintesis-quimica-y-biologica/Resolucion-5402-de-2015.pdf","title":"Resolución No. 5402 de 2015 – BPM Biológicos (PDF)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Certificación BPM y fabricantes extranjeros', 'Clase 4 · BPM de biológicos y certificación', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el marco de certificación (Decreto 335/2022, Res. 1160/2016) y los requisitos documentales para plantas extranjeras.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_1160_2016.htm","title":"[Página web] Resolución 1160 de 2016 – Manuales de BPM y guías de inspección","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/preguntas-frecuentes-medicamentos","title":"[Página web] Preguntas frecuentes sobre medicamentos (documentos BPM de fabricantes extranjeros, CUM)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1782_2014.htm","title":"[Página web] Decreto 1782 de 2014 – Evaluación farmacológica y farmacéutica de medicamentos biológicos (texto compilado)","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: revisión de certificados BPM de una cadena de fabricación multinacional', 'Clase 4 · BPM de biológicos y certificación', 7, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la verificación documental de BPM para cada etapa de fabricación de un anticuerpo importado.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: ejecutar la revisión documental de los certificados de Buenas Prácticas de Manufactura que exige el Decreto 1782 para un biológico fabricado fuera de Colombia.</p><p>Desarrollo: el art. 12 del Decreto 1782 de 2014 exige acreditar BPM para cada etapa: planta del ingrediente activo, producto a granel (si aplica), envasador y producto terminado. La Resolución 5402 de 2015 adoptó el manual y el instrumento de verificación de BPM de medicamentos biológicos (complementario al Informe 32 de la OMS y a la guía de inspección de la Resolución 1087 de 2001), de obligatorio cumplimiento para fabricantes nacionales y extranjeros; su instrumento clasifica los hallazgos en críticos, mayores e informativos. El procedimiento de certificación y reconocimiento de certificados extranjeros se rige actualmente por el Decreto 335 de 2022. En la práctica, el profesional regulatorio debe verificar, antes de radicar, que cada sitio declarado en el dossier tenga un certificado vigente que cubra la actividad y la forma farmacéutica específicas.</p><p>Ejemplo aplicado: un anticuerpo se fabrica así: IFA en Irlanda, llenado aséptico en Alemania, acondicionamiento secundario en Puerto Rico. Lista de verificación: (1) ¿existe certificado o evidencia aceptada para cada una de las tres plantas?; (2) ¿la autoridad emisora es de un país de referencia o requiere visita del INVIMA?; (3) ¿el alcance del certificado menciona \"productos biológicos/biotecnológicos\" y la forma farmacéutica \"solución inyectable estéril\"?; (4) ¿las direcciones coinciden exactamente con las del Módulo 1 y el Módulo 3?; (5) ¿los documentos están apostillados o legalizados y traducidos según aplique?; (6) ¿la vigencia cubre el tiempo estimado de evaluación? Una discrepancia de dirección o alcance es causa frecuente de requerimiento. Si una planta no cuenta con certificación aceptable, debe programarse la certificación BPM por el INVIMA antes o en paralelo con la radicación, considerando los tiempos y tarifas vigentes. Documente la revisión en un acta interna firmada y adjunte la tabla de sitios al Módulo 1, de modo que el evaluador encuentre de inmediato la correspondencia entre cada etapa y su certificado.</p><p>Puntos clave:<br>1. Cada etapa de fabricación declarada necesita su soporte BPM.<br>2. El alcance (biológicos, estériles, forma farmacéutica) importa tanto como la vigencia.<br>3. Mantenga un registro maestro de sitios con fechas de vencimiento de certificados y alertas de renovación.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Ciclo de vida: migración normativa, modificaciones y cadena de frío', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: el registro como compromiso permanente', 'Clase 1 · Clase 1 – Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume las obligaciones posregistro de un biológico tras la vigencia indefinida del Decreto 1474 de 2023.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/circular_invima_0019_2023.htm","title":"[Página web] Circular 19 de 2023 – registros sanitarios de medicamentos biológicos tras el Decreto 1474 de 2023","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://efpia.eu/media/413202/post-approval-changes-for-biologics-in-latin-american-markets.pdf","title":"Post-approval Changes for Biologics in Latin American Markets","description":"EFPIA (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Decreto 1474 de 2023 y Circular 19 de 2023', 'Clase 2 · Migración normativa y modificaciones', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los dos escenarios de la Circular 19: renovaciones en trámite convertidas en modificaciones y migración normativa al Decreto 1782 de registros nunca evaluados bajo él.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/circular_invima_0019_2023.htm","title":"[Página web] Circular 19 de 2023 – registros sanitarios de medicamentos biológicos tras el Decreto 1474 de 2023","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/preview/145219","title":"Circular 19 de 2023 (documento en biblioteca INVIMA)","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: migración normativa de un registro otorgado bajo el Decreto 677', 'Clase 2 · Migración normativa y modificaciones', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la planeación de la modificación por migración normativa de un biológico registrado antes del Decreto 1782, usando las guías de modificaciones de biológicos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=-xY8swFb0A0","provider":"youtube","videoId":"-xY8swFb0A0","title":"Medicamentos biológicos y biotecnológicos, incluidas vacunas. MCRS (modificaciones a las condiciones del registro sanitario)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/preview/144808","title":"ASS-RSA-GU49 – Guía para solicitud de modificaciones de productos biológicos (calidad)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/biblioteca/preview/145499","title":"ACOM-INS85 v1 – Instructivo para solicitud de modificaciones de productos biológicos (jun. 2026)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Modificaciones de seguridad y eficacia de biológicos', 'Clase 2 · Migración normativa y modificaciones', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica la guía de modificaciones de seguridad y eficacia y su relación con la actualización del PGR.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/sites/default/files/medicamentos-y-productos-biologicos/tecnico-medicamentos-2/ASS-RSA-GU044.pdf","title":"ASS-RSA-GU044 – Guía de modificaciones de seguridad y eficacia para medicamentos biológicos","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/preview/144808","title":"ASS-RSA-GU49 – Guía para solicitud de modificaciones de productos biológicos (calidad)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Cadena de frío: almacenamiento y transporte de biológicos', 'Clase 3 · Cadena de frío y caso integrador', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los requisitos de almacenamiento y transporte de productos sensibles a la temperatura y la gestión de excursiones.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.who.int/publications/m/item/trs961-annex9-modelguidanceforstoragetransport","title":"[Página web] TRS 961 – Annex 9: Model guidance for the storage and transport of time- and temperature-sensitive pharmaceutical products (2011)","description":"Organización Mundial de la Salud (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.sefh.es/pdfs/ConservacionDeMedicamentos.pdf","title":"Conservación de medicamentos termolábiles (manual)","description":"Sociedad Española de Farmacia Hospitalaria / H.U. Virgen de la Arrixaca (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_3690_2016.htm","title":"[Página web] Resolución 3690 de 2016 – Guía de Estabilidad de Medicamentos Biológicos","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso integrador: del registro a la distribución de un biológico importado', 'Clase 3 · Cadena de frío y caso integrador', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica de manera integrada vigencia, migración normativa, PGR y gestión de una excursión de temperatura en un anticuerpo importado.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar de forma integrada los requisitos de registro, liberación y cadena de frío en el ciclo completo de un biológico importado.</p><p>Desarrollo: obtener el registro sanitario no es el final del trabajo regulatorio. Desde el Decreto 1474 de 2023 los registros de medicamentos biológicos tienen vigencia indefinida, pero el titular debe mantener las condiciones aprobadas, cumplir el Decreto 1782 (incluida la migración normativa de la Circular 19 de 2023 si el producto se registró bajo el Decreto 677 sin evaluación por el 1782), notificar o solicitar modificaciones según su nivel de riesgo (Decreto 334 de 2022 y guías ASS-RSA para biológicos) y ejecutar el PGR y la farmacovigilancia activa. El art. 25 del Decreto 1782 se refiere a la liberación de lotes, aspecto que en Colombia es especialmente relevante para vacunas y algunos hemoderivados. La cadena de frío es parte de las condiciones del registro: la temperatura de almacenamiento aprobada en el estudio de estabilidad (Resolución 3690 de 2016) es la que debe garantizarse en el transporte internacional, el almacenamiento en bodega, la distribución y la dispensación.</p><p>Ejemplo aplicado: un lote de un anticuerpo monoclonal (2–8 °C) llega al aeropuerto de Bogotá y el registrador de datos muestra una excursión de 6 horas a 12 °C. Pasos: (1) poner el lote en cuarentena; (2) descargar y conservar los registros de temperatura; (3) consultar los datos de estabilidad y excursión del titular (no basta con el texto del inserto); (4) documentar la desviación, la investigación de causa raíz y la decisión de liberar o rechazar, firmada por el responsable de calidad; (5) si se libera, verificar que la vida útil remanente no se vea comprometida; (6) si el producto se rechaza, gestionar su destrucción y, si hay riesgo para pacientes, evaluar el reporte al INVIMA. Paralelamente, el equipo verifica que el registro tenga al día su migración normativa y que el PGR esté actualizado.</p><p>Puntos clave:<br>1. La vigencia indefinida traslada la carga al mantenimiento continuo del cumplimiento.<br>2. La cadena de frío se defiende con datos de estabilidad, no con supuestos.<br>3. Integre en un tablero único: estado del registro, modificaciones en curso, PGR, certificados BPM y desviaciones de temperatura.</p>"}'::jsonb);

END
$curso$;

-- ─── 12. Curso de Regulación de Medicamentos Biosimilares (34 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Regulación de Medicamentos Biosimilares' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Regulación de Medicamentos Biosimilares', 'Curso especializado sobre la demostración de biosimilitud y el registro de biosimilares en Colombia bajo el Decreto 1782 de 2014, contrastado con OMS, EMA, FDA, ANMAT y COFEPRIS. Recorre el ejercicio de comparabilidad, las rutas de comparabilidad y abreviada, la extrapolación, la intercambiabilidad, la farmacovigilancia y casos reales (trastuzumab, adalimumab, insulinas).', '<p>Curso especializado sobre la demostración de biosimilitud y el registro de biosimilares en Colombia bajo el Decreto 1782 de 2014, contrastado con OMS, EMA, FDA, ANMAT y COFEPRIS. Recorre el ejercicio de comparabilidad, las rutas de comparabilidad y abreviada, la extrapolación, la intercambiabilidad, la farmacovigilancia y casos reales (trastuzumab, adalimumab, insulinas).</p><h3>Objetivo general</h3><p>Que el químico farmacéutico diseñe y sustente la estrategia regulatoria de un biosimilar ante el INVIMA: que elija la ruta, planee el ejercicio de comparabilidad, interprete las guías nacionales e internacionales y gestione la vigilancia poscomercialización.</p><h3>A quién va dirigido</h3><p>Químicos farmacéuticos y profesionales de asuntos regulatorios, farmacovigilancia, calidad y acceso al mercado de laboratorios, importadores, EPS e IPS en Colombia.</p><h3>Contexto normativo</h3><p>Colombia — normativa INVIMA / MinSalud</p>',
          'Asuntos regulatorios — productos especiales', 'intermedio', 'Que el químico farmacéutico diseñe y sustente la estrategia regulatoria de un biosimilar ante el INVIMA: que elija la ruta, planee el ejercicio de comparabilidad, interprete las guías nacionales e internacionales y gestione la vigilancia poscomercialización.', 'Químicos farmacéuticos y profesionales de asuntos regulatorios, farmacovigilancia, calidad y acceso al mercado de laboratorios, importadores, EPS e IPS en Colombia.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Fundamentos: qué es un biosimilar y por qué no es un genérico', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: biosimilares en el sistema de salud colombiano', 'Clase 1 · Introducción al curso', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Presenta el alcance del curso, el lugar de los biosimilares en el mercado colombiano y la ruta de aprendizaje, desde el concepto hasta la farmacovigilancia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=Cq2diDJQSgo","provider":"youtube","videoId":"Cq2diDJQSgo","title":"¿Qué son los Medicamentos Biológicos y Biosimilares?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/MET/abc-biomedicamentos.pdf","title":"Abecé sobre medicamentos biotecnológicos","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Medicamentos biológicos, biotecnológicos y biosimilares', 'Clase 2 · El concepto de biosimilar', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Define medicamento biológico, biotecnológico (Decreto 1782, art. 3.1) y biosimilar, y explica la variabilidad inherente de los productos derivados de células vivas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=dJZCpPlAF1c","provider":"youtube","videoId":"dJZCpPlAF1c","title":"¿Qué es un biosimilar?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=0jtsR3vVWW0","provider":"youtube","videoId":"0jtsR3vVWW0","title":"Webinario Medicamentos Biológicos VS Biosimilares","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.fda.gov/media/142496/download","title":"¿Qué es un biosimilar? (material educativo FDA)","description":"FDA (ES) · misma dirección, corregido el «www.»"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Biosimilar frente a genérico: diferencias regulatorias', 'Clase 2 · El concepto de biosimilar', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara el paradigma de bioequivalencia de los genéricos de síntesis con el ejercicio de comparabilidad de los biosimilares y sus consecuencias regulatorias.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=JPmPITdEypE","provider":"youtube","videoId":"JPmPITdEypE","title":"BIOSIMILARES vs GENÉRICOS: diferencias, seguridad e intercambiabilidad (EMA)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ema.europa.eu/es/documents/leaflet/biosimilars-eu-information-guide-healthcare-professionals_es.pdf","title":"Los biosimilares en la UE – Guía informativa para profesionales sanitarios","description":"EMA / Comisión Europea (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'El medicamento de referencia y su papel', 'Clase 2 · El concepto de biosimilar', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Explica la definición de medicamento de referencia (Decreto 1782, art. 3.2), los criterios para elegirlo y el uso de referentes no locales según la OMS 2022.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/DIJ/decreto-1782-de-2014.pdf","title":"Decreto 1782 de 2014 – requisitos y procedimiento para las evaluaciones farmacológica y farmacéutica de medicamentos biológicos","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cdn.who.int/media/docs/default-source/biologicals/who_trs_1043_annex-3_biosimilars_tk.pdf","title":"WHO TRS 1043, Annex 3: Guidelines on evaluation of biosimilars (2022)","description":"Organización Mundial de la Salud (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Política farmacéutica, competencia y acceso', 'Clase 3 · Biosimilares en Colombia: contexto y decisión de ruta', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume las razones de política pública que motivaron el Decreto 1782 de 2014 y el peso de los biológicos en el gasto en salud.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=2SLUSncj5zw","provider":"youtube","videoId":"2SLUSncj5zw","title":"¿Qué son los medicamentos biosimilares y por qué son una buena alternativa?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://minsalud.gov.co/salud/medicamentos-y-tecnologias/Paginas/biologicos-biotecnologicos.aspx","title":"[Página web] Medicamentos biológicos y biotecnológicos (normativa, guías y consultas públicas)","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/MET/abc-biomedicamentos.pdf","title":"Abecé sobre medicamentos biotecnológicos","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: ¿biosimilar o expediente completo?', 'Clase 3 · Biosimilares en Colombia: contexto y decisión de ruta', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica criterios del Decreto 1782 para decidir si un producto puede presentarse al INVIMA como biosimilar y por cuál ruta.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: decidir, con criterios regulatorios, si un producto biológico puede presentarse ante el INVIMA como biosimilar (ruta de comparabilidad o ruta abreviada de comparabilidad) o si debe ir por la ruta de expediente completo del Decreto 1782 de 2014.</p><p>Desarrollo. El Decreto 1782 de 2014 (art. 5) establece tres rutas para la evaluación farmacológica de medicamentos biológicos: (1) expediente completo (art. 7), con estudios preclínicos y ensayos clínicos propios sobre desenlaces clínicos relevantes; (2) comparabilidad (art. 8), basada en un ejercicio de comparación escalonado frente a un medicamento de referencia que demuestre que el producto es altamente similar; y (3) abreviada de comparabilidad (art. 9), reservada a principios activos suficientemente caracterizados, con perfil de seguridad y eficacia bien documentado, experiencia clínica considerable e información robusta de farmacovigilancia. El estándar de evaluación es el mismo en las tres rutas; lo que cambia es el tipo de evidencia aceptada.</p><p>El primer filtro es el medicamento de referencia (art. 3.2): un biológico cuyo registro se otorgó con base en un expediente completo, por el INVIMA o por una agencia sanitaria de referencia. Si no existe un medicamento de referencia identificable, o el solicitante no puede acceder a él para el ejercicio de comparación, la ruta biosimilar no es viable y el producto debe ir por expediente completo. El segundo filtro es el grado de conocimiento de la molécula: insulinas, filgrastim o eritropoyetinas, con décadas de uso, son candidatas razonables a la ruta abreviada; un anticuerpo monoclonal complejo (trastuzumab, adalimumab) suele requerir la ruta de comparabilidad con estudios PK/PD e inmunogenicidad y, normalmente, evidencia clínica comparativa.</p><p>Ejemplo aplicado. Un laboratorio quiere registrar un adalimumab producido en una línea celular CHO y tiene como comparador el producto innovador comprado en la Unión Europea. Pasos: (a) confirmar que el innovador fue aprobado por expediente completo en una agencia de las listadas en el art. 8; (b) justificar que el comparador europeo es representativo del producto comercializado en Colombia (puentes analíticos, como recomienda la OMS 2022); (c) mapear la evidencia disponible: caracterización analítica comparativa, estudio PK en voluntarios sanos con evaluación de inmunogenicidad conforme a la Res. 4490 de 2016 (modificada por la Res. 553 de 2017), ensayo comparativo en pacientes; (d) concluir la ruta: comparabilidad (art. 8). Luego se consulta el listado trimestral del INVIMA de biológicos aprobados por rutas de comparabilidad para identificar competidores ya autorizados y su titular.</p><p>Puntos clave:<br>1. Sin medicamento de referencia aprobado por expediente completo no hay ruta biosimilar.<br>2. La ruta abreviada no es \"para todos\": exige molécula muy conocida, experiencia clínica y farmacovigilancia robusta (art. 9).<br>3. La decisión de ruta se documenta al inicio del proyecto y condiciona el diseño de todo el dossier.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. El ejercicio de comparabilidad paso a paso', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: totalidad de la evidencia', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Presenta el enfoque escalonado (calidad, no clínico, clínico) y el principio de totalidad de la evidencia que rige la demostración de biosimilitud.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=hcgUE4HAM4g","provider":"youtube","videoId":"hcgUE4HAM4g","title":"Aula Abierta – Encarnación Cruz (biosimilares)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.who.int/teams/health-product-policy-and-standards/standards-and-specifications/norms-and-standards/sbp","title":"[Página web] WHO – Biosimilars (normas y estándares)","description":"Organización Mundial de la Salud (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caracterización analítica y atributos críticos de calidad', 'Clase 2 · Comparabilidad de calidad', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Identifica los atributos críticos de calidad (estructura, glicosilación, variantes, potencia) y cómo se fijan rangos de similitud frente al referente.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cdn.who.int/media/docs/default-source/biologicals/who_trs_1043_annex-3_biosimilars_tk.pdf","title":"WHO TRS 1043, Annex 3: Guidelines on evaluation of biosimilars (2022)","description":"Organización Mundial de la Salud (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.who.int/publications/m/item/mAbs-trs-no-1004-a2","title":"[Página web] Guidelines on evaluation of monoclonal antibodies as similar biotherapeutic products (SBPs), Annex 2, TRS 1004","description":"Organización Mundial de la Salud (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Estabilidad comparativa de biológicos', 'Clase 2 · Comparabilidad de calidad', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica la Guía de estabilidad de medicamentos biológicos (Res. 3690 de 2016) a los estudios de degradación comparativa entre biosimilar y referente.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/DIJ/resolucion-3690-2016.pdf","title":"Resolución 3690 de 2016 – Guía de estabilidad de medicamentos biológicos","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://consultorsalud.com/unifican-fecha-de-implementacion-de-las-guias-de-evaluacion-para-medicamentos-biologicos-resolucion-553-de-2017","title":"[Página web] Unifican fecha de implementación de las guías de evaluación para medicamentos biológicos – Resolución 553 de 2017","description":"Consultorsalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Estudios no clínicos: del in vitro al in vivo', 'Clase 3 · Comparabilidad no clínica y clínica', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Explica el enfoque escalonado no clínico de la OMS 2022, que prioriza ensayos in vitro y reserva los estudios en animales para casos de incertidumbre.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cdn.who.int/media/docs/default-source/biologicals/who_trs_1043_annex-3_biosimilars_tk.pdf","title":"WHO TRS 1043, Annex 3: Guidelines on evaluation of biosimilars (2022)","description":"Organización Mundial de la Salud (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://gabionline.net/layout/set/print/biosimilars/research/who-revised-guidelines-for-biosimilars-scientific-background","title":"[Página web] WHO revised guidelines for biosimilars: scientific background","description":"GaBI Online (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'PK/PD comparativos y ensayo comparativo de eficacia', 'Clase 3 · Comparabilidad no clínica y clínica', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el diseño de estudios PK/PD de equivalencia y el debate internacional sobre cuándo es prescindible el ensayo comparativo de eficacia (OMS 2022, borrador FDA 2025).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cdn.who.int/media/docs/default-source/biologicals/who_trs_1043_annex-3_biosimilars_tk.pdf","title":"WHO TRS 1043, Annex 3: Guidelines on evaluation of biosimilars (2022)","description":"Organización Mundial de la Salud (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.alston.com/en/insights/publications/2025/11/fda-comparative-efficacy-studies-biosimilars","title":"[Página web] Comparative Efficacy Studies Are No Longer the Default Requirement for Biosimilars (borrador FDA, oct. 2025)","description":"Alston & Bird (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://hlc.com/en/publications/fda-rethinks-need-for-comparative-efficacy-studies-for-certain-biosimilars","title":"[Página web] FDA rethinks need for comparative efficacy studies for certain biosimilars","description":"Hogan Lovells (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Inmunogenicidad: la guía colombiana', 'Clase 3 · Comparabilidad no clínica y clínica', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la Guía de evaluación de la inmunogenicidad (Res. 4490 de 2016, modificada por la Res. 553 de 2017, vigente desde el 19 de agosto de 2017) y sus directrices de aplicación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/resolucion_minsaludps_4490_2016.htm","title":"[Página web] Resolución 4490 de 2016 – Guía de Evaluación de la Inmunogenicidad para los Medicamentos Biológicos (compilación con modificaciones)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/compilacion/docs/resolucion_minsaludps_0553_2017.htm","title":"[Página web] Resolución 553 de 2017 – modifica la Resolución 4490 de 2016","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://minsalud.gov.co/Normatividad_Nuevo/Circualr%20No.%200015%20de%202017.pdf","title":"Circular 015 de 2017 – directrices de aplicación de la guía de inmunogenicidad","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: plan de comparabilidad de un trastuzumab biosimilar', 'Clase 4 · Caso práctico de comparabilidad', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Diseña el plan completo del ejercicio de comparabilidad de un anticuerpo monoclonal para la ruta de comparabilidad ante el INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: diseñar, paso a paso, el plan del ejercicio de comparabilidad de un trastuzumab biosimilar para presentarlo al INVIMA por la ruta de comparabilidad del Decreto 1782 de 2014 (art. 8).</p><p>Desarrollo. El ejercicio de comparabilidad sigue un enfoque escalonado y de \"totalidad de la evidencia\" (OMS, TRS 1043 Anexo 3, 2022). Cada escalón reduce la incertidumbre residual y define cuánto se necesita en el siguiente.</p><p>Paso 1 – Producto de referencia. Adquirir varios lotes del innovador (idealmente de distintas fechas de vencimiento) para conocer su variabilidad. Si el comparador no es el comercializado en Colombia, documentar el puente analítico.</p><p>Paso 2 – Calidad analítica. Definir atributos críticos de calidad (CQA) y clasificarlos por riesgo: secuencia de aminoácidos y estructura primaria (mapeo peptídico, masas intactas), estructuras de orden superior, perfil de glicosilación (fucosilación, galactosilación, ácido siálico), variantes de carga y tamaño (agregados, fragmentos), y actividad biológica: unión a HER2, inhibición de proliferación, ADCC y unión a receptores Fcγ. Establecer rangos de similitud basados en la variabilidad del innovador; toda diferencia debe explicarse y su relevancia clínica justificarse.</p><p>Paso 3 – No clínico. Priorizar estudios in vitro (unión y función). Solo si persiste incertidumbre se consideran estudios in vivo; la OMS 2022 espera que sean excepcionales.</p><p>Paso 4 – Clínico. (a) PK comparativa: dosis única en voluntarios sanos o pacientes, con márgenes de equivalencia predefinidos (habitualmente 80–125 % para AUC y Cmáx). (b) Eficacia comparativa: en cáncer de mama HER2+ temprano neoadyuvante, la respuesta patológica completa (pCR) es un desenlace sensible. (c) Inmunogenicidad: anticuerpos antifármaco y neutralizantes con métodos validados, según la guía de la Res. 4490 de 2016 (vigente desde el 19 de agosto de 2017, tras la Res. 553 de 2017). (d) Seguridad: cardiotoxicidad como riesgo de interés.</p><p>Paso 5 – Extrapolación. Justificar científicamente la extensión a cáncer gástrico metastásico HER2+ (mismo mecanismo de acción, mismo receptor).</p><p>Paso 6 – Plan de gestión de riesgo y farmacovigilancia (arts. 6.9 y 24 del Decreto 1782) y estabilidad conforme a la Res. 3690 de 2016.</p><p>Ejemplo de trámite: el dossier se radica en la Oficina Virtual del INVIMA como evaluación farmacológica de medicamento biológico por ruta de comparabilidad; la Sala Especializada de Medicamentos evalúa la totalidad de la evidencia y puede pedir información complementaria mediante auto.</p><p>Puntos clave:<br>1. La calidad analítica es la base; la clínica confirma, no reemplaza.<br>2. Los márgenes y CQA se fijan antes de generar datos, a partir de la variabilidad del innovador.<br>3. La extrapolación se justifica por mecanismo de acción, no se presume.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Marco colombiano: las rutas del Decreto 1782 de 2014', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: el Decreto 1782 y sus guías', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la estructura del Decreto 1782 de 2014, sus guías reglamentarias y su relación con el registro sanitario de biológicos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://minsalud.gov.co/salud/medicamentos-y-tecnologias/Paginas/biologicos-biotecnologicos.aspx","title":"[Página web] Medicamentos biológicos y biotecnológicos (normativa, guías y consultas públicas)","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/MET/infografia-rutas-aprobacion-medicamentos-biologicos.pdf","title":"Infografía: Rutas de aprobación de medicamentos biológicos","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Expediente completo, comparabilidad y ruta abreviada', 'Clase 2 · Las tres rutas de evaluación', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara las tres rutas del art. 5 del Decreto 1782 y la evidencia exigida en cada una (arts. 7, 8 y 9).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/DIJ/decreto-1782-de-2014.pdf","title":"Decreto 1782 de 2014 – requisitos y procedimiento para las evaluaciones farmacológica y farmacéutica de medicamentos biológicos","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/MET/infografia-rutas-aprobacion-medicamentos-biologicos.pdf","title":"Infografía: Rutas de aprobación de medicamentos biológicos","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Ruta de comparabilidad: requisitos y evaluación INVIMA', 'Clase 2 · Las tres rutas de evaluación', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el art. 8 (comparación escalonada, alta similitud, agencias de referencia) y la experiencia de evaluación del INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/DIJ/decreto-1782-de-2014.pdf","title":"Decreto 1782 de 2014 – requisitos y procedimiento para las evaluaciones farmacológica y farmacéutica de medicamentos biológicos","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://gabi-journal.net/wp-content/uploads/Garcia-V19G11LT.pdf","title":"Biosimilar regulation in Colombia: one year later (J. A. García Cortés, INVIMA, 2019)","description":"GaBI Journal / INVIMA (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/sites/default/files/medicamentos-y-productos-biologicos/tecnico-medicamentos-2/Decreto_1782_de_2014.pdf","title":"Listado de medicamentos biológicos por las rutas de comparabilidad – Decreto 1782 de 2014","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Ruta abreviada de comparabilidad: condiciones del art. 9', 'Clase 2 · Las tres rutas de evaluación', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las condiciones de la ruta abreviada y aclara qué evidencia exige y qué mitos circulan sobre ella.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/MET/infografia-rutas-aprobacion-medicamentos-biologicos.pdf","title":"Infografía: Rutas de aprobación de medicamentos biológicos","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ambitojuridico.com/sites/default/files/BancoMedios/Archivos/comunicadominsaluddefiendedecretobiotecnol%C3%B3gicosenconsejo%20de%20estado-17.pdf","title":"Minsalud defiende decreto de biotecnológicos en Consejo de Estado (comunicado, 2017)","description":"Ámbito Jurídico / MinSalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Debate y críticas a la ruta abreviada', 'Clase 3 · Debate, litigio e implementación', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Analiza los argumentos de la industria innovadora, el Ministerio de Salud y la sociedad civil, y la decisión preliminar del Consejo de Estado que negó suspender el art. 9.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.saludyfarmacos.org/boletin-farmacos/boletines/ago201903/03_re","title":"[Página web] Reglamento de biogenéricos de Colombia. Una decisión judicial preliminar a favor de la salud pública","description":"Salud y Fármacos (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.saludyfarmacos.org/boletin-farmacos/boletines/nov201703/33_colombia/","title":"[Página web] Biotecnológicos: oposición de Misión Salud a aspiraciones de Afidro ante el Consejo de Estado","description":"Salud y Fármacos (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://olartemoure.com/en/?p=10190","title":"[Página web] Colombia approves “biosimilar” market entry using alternative way","description":"OlarteMoure (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Guías reglamentarias y estado de implementación', 'Clase 3 · Debate, litigio e implementación', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Revisa qué guías del Decreto 1782 se expidieron (inmunogenicidad, estabilidad), cuáles quedaron en proyecto (comparabilidad, planes de gestión de riesgo) y el desempeño del INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://minsalud.gov.co/salud/medicamentos-y-tecnologias/Paginas/biologicos-biotecnologicos.aspx","title":"[Página web] Medicamentos biológicos y biotecnológicos (normativa, guías y consultas públicas)","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/MET/respuesta-comentarios-cpublica-nacional-comparabilidad.pdf","title":"Respuestas a comentarios de la consulta pública nacional del proyecto de guía de comparabilidad","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://gabi-journal.net/wp-content/uploads/Garcia-V19G11LT.pdf","title":"Biosimilar regulation in Colombia: one year later (J. A. García Cortés, INVIMA, 2019)","description":"GaBI Journal / INVIMA (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: radicación de un biosimilar ante el INVIMA', 'Clase 4 · Caso práctico de trámite', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la preparación, radicación y seguimiento de una solicitud de evaluación farmacológica por ruta de comparabilidad o abreviada.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: preparar y radicar ante el INVIMA una solicitud de evaluación farmacológica de un biosimilar por la ruta de comparabilidad (art. 8) o la ruta abreviada (art. 9) del Decreto 1782 de 2014, y gestionar su seguimiento.</p><p>Desarrollo. Antes de radicar se confirma la ruta, el medicamento de referencia y la agencia de referencia que lo aprobó (art. 8, literales a–c). El dossier, estructurado en formato CTD (ver curso 5), debe responder a los nueve aspectos que MinSalud resume para cualquier ruta: proceso y sitio de producción, sistema de expresión, pruebas de identidad biológica, potencia, propiedades fisicoquímicas, actividad biológica, inmunogenicidad, plan de gestión de riesgo y pureza.</p><p>Checklist mínimo:<br>1. Módulo 3 (calidad) con el ejercicio de comparabilidad analítica frente al referente, lotes utilizados y justificación de diferencias.<br>2. Estabilidad conforme a la Guía de estabilidad de medicamentos biológicos (Res. 3690 de 2016).<br>3. Módulo 4: estudios no clínicos comparativos (principalmente in vitro).<br>4. Módulo 5: PK/PD comparativos con evaluación de inmunogenicidad (Res. 4490 de 2016 mod. por Res. 553 de 2017) y, cuando aplique, ensayo comparativo de eficacia y seguridad.<br>5. Plan de gestión de riesgo (art. 6.9) y programa de farmacovigilancia activa (art. 24).<br>6. Justificación de extrapolación de indicaciones.<br>7. Certificado de BPM del fabricante (Decreto 335 de 2022 para certificación) y documentación legal.<br>8. Pago de la tarifa vigente (expresada en UVB, Res. 2025067543 y modificatorias) en la Oficina Virtual.</p><p>Para la ruta abreviada, el expediente además debe sustentar que el principio activo está suficientemente caracterizado, que existe experiencia clínica considerable y farmacovigilancia robusta, y aportar la información preclínica y clínica pública del conjunto de medicamentos con principio activo altamente similar; la Sala puede solicitar estudios adicionales.</p><p>Ejemplo aplicado: una empresa radica un filgrastim por ruta abreviada. La Sala Especializada emite un auto pidiendo datos de inmunogenicidad en humanos. La empresa debe responder dentro del término otorgado (ver curso 6, requerimientos) con un estudio PK/PD en voluntarios sanos que incluya anticuerpos antifármaco. Aprobada la evaluación farmacológica y farmacéutica, se expide el registro con prefijo MBT (biotecnológico, art. 19), que bajo el Decreto 1474 de 2023 tiene vigencia indefinida, sin perjuicio de la vigilancia poscomercialización.</p><p>Puntos clave:<br>1. La ruta y el referente se justifican explícitamente en la carta de radicación.<br>2. Inmunogenicidad y plan de gestión de riesgo son obligatorios en todas las rutas.<br>3. La ruta abreviada reduce estudios, pero no elimina la evaluación de la Sala ni la posibilidad de requerir datos adicionales.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Referentes internacionales: OMS, EMA, FDA y Latinoamérica', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: convergencia regulatoria internacional', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume cómo las autoridades de referencia han evolucionado hacia más peso analítico y menos ensayos clínicos confirmatorios.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=JIdyAAQFl8g","provider":"youtube","videoId":"JIdyAAQFl8g","title":"Medicamentos biosimilares en la UE","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ema.europa.eu/es/news/improving-understanding-biosimilars-eu","title":"[Página web] Improving understanding of biosimilars in the EU (EMA, 2018)","description":"EMA (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'De la guía OMS 2009 a la revisión 2022 (TRS 1043, Anexo 3)', 'Clase 2 · Guías de la OMS', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara la guía de productos bioterapéuticos similares de 2009 con la revisión de 2022: referentes no locales, flexibilidad en estudios de eficacia y estudios en animales.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.who.int/teams/health-product-policy-and-standards/standards-and-specifications/norms-and-standards/sbp","title":"[Página web] WHO – Biosimilars (normas y estándares)","description":"Organización Mundial de la Salud (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cdn.who.int/media/docs/default-source/biologicals/who_trs_1043_annex-3_biosimilars_tk.pdf","title":"WHO TRS 1043, Annex 3: Guidelines on evaluation of biosimilars (2022)","description":"Organización Mundial de la Salud (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.who.int/publications/m/item/mAbs-trs-no-1004-a2","title":"[Página web] Guidelines on evaluation of monoclonal antibodies as similar biotherapeutic products (SBPs), Annex 2, TRS 1004","description":"Organización Mundial de la Salud (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Marco de la EMA para biosimilares', 'Clase 3 · EMA y FDA', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el marco europeo de biosimilares, sus guías generales y específicas por producto y su posición sobre intercambiabilidad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.ema.europa.eu/es/documents/leaflet/biosimilars-eu-information-guide-healthcare-professionals_es.pdf","title":"Los biosimilares en la UE – Guía informativa para profesionales sanitarios","description":"EMA / Comisión Europea (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ema.europa.eu/en/documents/scientific-guideline/guideline-similar-biological-medicinal-products-first-version_en.pdf","title":"Guideline on similar biological medicinal products (primera versión)","description":"EMA (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://wwW.ema.europa.eu/en/documents/public-statement/statement-scientific-rationale-supporting-interchangeability-biosimilar-medicines-eu_en.pdf","title":"Statement on the scientific rationale supporting interchangeability of biosimilar medicines in the EU (EMA/HMA, 2022-2023)","description":"EMA / HMA (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'FDA: biosimilar, intercambiable y los cambios de 2024–2025', 'Clase 3 · EMA y FDA', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la ruta 351(k), la categoría de intercambiable y los borradores de guía que eliminan los estudios de switching (2024) y los estudios comparativos de eficacia por defecto (2025).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://gabionline.net/guidelines/fda-interchangeable-biosimilars-guidance-update-on-revised-approach-to-switching-studies","title":"[Página web] FDA interchangeable biosimilars guidance update on revised approach to switching studies","description":"GaBI Online (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.thefdalawblog.com/2024/06/the-interchangeables-are-a-changin-new-fda-guidance-proposes-eliminating-switching-studies-requirements/","title":"[Página web] The Interchangeables Are A-Changin’: New FDA Guidance Proposes Eliminating Switching Studies Requirements","description":"FDA Law Blog (Hyman, Phelps & McNamara) (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.alston.com/en/insights/publications/2025/11/fda-comparative-efficacy-studies-biosimilars","title":"[Página web] Comparative Efficacy Studies Are No Longer the Default Requirement for Biosimilars (borrador FDA, oct. 2025)","description":"Alston & Bird (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'ANMAT, COFEPRIS y el panorama latinoamericano', 'Clase 4 · Latinoamérica y análisis comparado', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los marcos de Argentina (Disposiciones 7729/2011 y 1741/2025), México (NOM-257-SSA1-2014) y otros países de la región.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.ellitoral.com/salud/anmat-regulacion-biosimilares-prohibicion-productos-limpieza-registrados-boletin-oficial_0_9GGmNOSHGP.html","title":"[Página web] ANMAT: regulación de biosimilares (Disposición 1741/2025, complementaria de la 7729/2011)","description":"El Litoral (Argentina) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://mexicobusiness.news/health/news/new-norm-clear-pathway-biopharmaceuticals","title":"[Página web] New Norm to Clear Pathway for Biopharmaceuticals (NOM-257-SSA1-2014)","description":"Mexico Business News (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://revistaseug.ugr.es/index.php/ars/article/download/15862/20214","title":"Registro sanitario de medicamentos biológicos y biotecnológicos en América Latina (Ars Pharm. 2021)","description":"Ars Pharmaceutica – Universidad de Granada (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: matriz regulatoria multipaís', 'Clase 4 · Latinoamérica y análisis comparado', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Construye una matriz de requisitos (referente, clínica, inmunogenicidad, extrapolación, intercambiabilidad, farmacovigilancia) para planear el registro de un biosimilar en varios mercados.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: construir una matriz comparativa de requisitos para biosimilares en Colombia, OMS, EMA, FDA, Argentina y México, útil para planear una estrategia regulatoria multipaís.</p><p>Desarrollo. Para cada autoridad se comparan siete variables: definición y base legal, producto de referencia, exigencia de estudios clínicos comparativos de eficacia, inmunogenicidad, extrapolación, intercambiabilidad/sustitución y farmacovigilancia.</p><ul><li>Colombia (INVIMA): Decreto 1782 de 2014; tres rutas; referente aprobado por expediente completo en INVIMA o agencia de referencia; ruta abreviada para moléculas bien conocidas; inmunogenicidad según Res. 4490/2016; no define intercambiabilidad; plan de gestión de riesgo y farmacovigilancia activa obligatorios.</li><li>OMS: TRS 1043 Anexo 3 (2022), que reemplaza la guía de 2009 (TRS 977 Anexo 2); acepta referentes no locales de jurisdicciones con marco regulatorio robusto; el ensayo comparativo de eficacia no siempre es necesario si PK/PD aportan evidencia confirmatoria; deja la intercambiabilidad a cada autoridad nacional.</li><li>EMA: marco de biosimilares desde 2005; extrapolación aceptada con justificación; desde 2022 la declaración EMA/HMA establece que los biosimilares aprobados en la UE son científicamente intercambiables; la sustitución la decide cada Estado miembro.</li><li>FDA: ruta 351(k); categoría adicional de \"intercambiable\"; borrador de junio de 2024 propone que los estudios de switching ya no sean necesarios por regla general; borrador del 29 de octubre de 2025 propone que los estudios comparativos de eficacia dejen de ser exigencia por defecto. Verifique si estas guías ya se publicaron en versión final.</li><li>Argentina (ANMAT): Disposición 7729/2011, complementada por la Disposición 1741/2025 sobre requisitos del ejercicio de comparabilidad.</li><li>México (COFEPRIS): NOM-257-SSA1-2014 (medicamentos biotecnológicos), biocomparabilidad bajo NOM-177-SSA1-2013 y farmacovigilancia NOM-220; referente registrado en México; pruebas definidas caso a caso por el Subcomité de Evaluación de Productos Biotecnológicos.</li></ul><p>Ejemplo aplicado: una empresa con un biosimilar de bevacizumab aprobado por EMA quiere entrar a Colombia. Usando la matriz identifica que el comparador europeo es aceptable si el innovador fue aprobado por expediente completo por una agencia de referencia del art. 8; que el dossier europeo es reutilizable en formato CTD; que debe adaptar la información de inmunogenicidad a la guía colombiana, incluir el plan de gestión de riesgo con actividades locales y no declarar intercambiabilidad en la información para prescribir, pues Colombia no la reglamenta.</p><p>Puntos clave:<br>1. La convergencia internacional va hacia más peso analítico y menos ensayos clínicos confirmatorios.<br>2. Intercambiabilidad y sustitución son decisiones nacionales, no consecuencias automáticas de la aprobación.<br>3. Toda matriz debe fecharse: las guías de FDA, EMA y ANMAT cambiaron entre 2022 y 2025.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Uso, vigilancia y acceso: extrapolación, intercambiabilidad y casos reales', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: la vida del biosimilar después del registro', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume los temas poscomercialización: extrapolación, intercambiabilidad, nomenclatura, farmacovigilancia y acceso.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=tpubWwLFCZY","provider":"youtube","videoId":"tpubWwLFCZY","title":"Medicamentos biosimilares: Lo que los pacientes deben saber","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=oSX7s_gFHeM","provider":"youtube","videoId":"oSX7s_gFHeM","title":"¿Conoces los medicamentos biosimilares? – Semana de los Biosimilares","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Extrapolación de indicaciones', 'Clase 2 · Extrapolación e intercambiabilidad', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Explica las bases científicas (mecanismo de acción, receptor, población sensible) para extrapolar indicaciones y cómo lo trata el Decreto 1782 (art. 4, parágrafo 1).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=K0nMDklyTFU","provider":"youtube","videoId":"K0nMDklyTFU","title":"El Dr. Martínez, sobre importancia de conceptos como variabilidad y extrapolación en biosimilares","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ema.europa.eu/es/documents/leaflet/biosimilars-eu-information-guide-healthcare-professionals_es.pdf","title":"Los biosimilares en la UE – Guía informativa para profesionales sanitarios","description":"EMA / Comisión Europea (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/DIJ/decreto-1782-de-2014.pdf","title":"Decreto 1782 de 2014 – requisitos y procedimiento para las evaluaciones farmacológica y farmacéutica de medicamentos biológicos","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Intercambiabilidad, switching y sustitución: el mundo y Colombia', 'Clase 2 · Extrapolación e intercambiabilidad', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Distingue intercambiabilidad, cambio médico y sustitución automática, y contrasta la posición EMA/HMA y FDA con la ausencia de reglamentación específica en Colombia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=dRYr-l-415Y","provider":"youtube","videoId":"dRYr-l-415Y","title":"Intercambiabilidad de Biosimilares: prácticas médicas para ampliar acceso a medicamento de alto costo","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=q8m1k1D94Tg","provider":"youtube","videoId":"q8m1k1D94Tg","title":"Intercambiabilidad de biosimilares y productos de referencia","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://wwW.ema.europa.eu/en/documents/public-statement/statement-scientific-rationale-supporting-interchangeability-biosimilar-medicines-eu_en.pdf","title":"Statement on the scientific rationale supporting interchangeability of biosimilar medicines in the EU (EMA/HMA, 2022-2023)","description":"EMA / HMA (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Nomenclatura, farmacovigilancia y trazabilidad', 'Clase 2 · Extrapolación e intercambiabilidad', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los enfoques de nomenclatura (DCI + marca, sufijos FDA, propuesta de calificador biológico OMS) y las obligaciones de farmacovigilancia y trazabilidad del art. 24 del Decreto 1782.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.ema.europa.eu/es/documents/leaflet/biosimilars-eu-information-guide-healthcare-professionals_es.pdf","title":"Los biosimilares en la UE – Guía informativa para profesionales sanitarios","description":"EMA / Comisión Europea (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/DIJ/decreto-1782-de-2014.pdf","title":"Decreto 1782 de 2014 – requisitos y procedimiento para las evaluaciones farmacológica y farmacéutica de medicamentos biológicos","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.freyrsolutions.com/es/parte-2-mas-alla-del-registro-trazabilidad-y-farmacovigilancia-en-colombia","title":"[Página web] Trazabilidad y farmacovigilancia en Colombia (más allá del registro)","description":"Freyr Solutions (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Acceso y precios: visión breve', 'Clase 3 · Acceso y precios', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume el efecto esperado de la competencia biosimilar sobre precios y acceso, con datos del MinSalud y experiencias internacionales.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=2SLUSncj5zw","provider":"youtube","videoId":"2SLUSncj5zw","title":"¿Qué son los medicamentos biosimilares y por qué son una buena alternativa?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/MET/abc-biomedicamentos.pdf","title":"Abecé sobre medicamentos biotecnológicos","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://paho.org/sites/default/files/PANDRH-Valentina-Carricarte---ALIFAR.pdf","title":"Productos bioterapéuticos – presentación ALIFAR en la VII Conferencia Panamericana (Red PARF)","description":"OPS / Red PARF (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso real: trastuzumab, el primer biosimilar por ruta de comparabilidad', 'Clase 4 · Casos reales y caso integrador', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Analiza la aprobación de trastuzumab biosimilar en Colombia, la experiencia de evaluación del INVIMA y la vigilancia de seguridad poscomercialización.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://gabi-journal.net/wp-content/uploads/Garcia-V19G11LT.pdf","title":"Biosimilar regulation in Colombia: one year later (J. A. García Cortés, INVIMA, 2019)","description":"GaBI Journal / INVIMA (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://catalogues.ema.europa.eu/node/3520/study-documents","title":"[Página web] Safety evaluation of biosimilar trastuzumab in breast cancer: Experience of Colombian institutions (EUPAS49290)","description":"HMA-EMA Catalogues (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://gabionline.net/biosimilars/general/biosimilars-approved-in-colombia","title":"[Página web] Biosimilars approved in Colombia","description":"GaBI Online (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Casos reales: adalimumab e insulinas', 'Clase 4 · Casos reales y caso integrador', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara la llegada del adalimumab biosimilar y de las insulinas biosimilares (glargina) a Colombia y consulta el listado oficial del INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://consultorsalud.com/primer-biosimilar-en-colombia-para-el-tratamiento-de-enfermedades-complejas/","title":"[Página web] Primer biosimilar en Colombia para el tratamiento de enfermedades complejas (adalimumab, 2019)","description":"Consultorsalud (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/sites/default/files/medicamentos-y-productos-biologicos/tecnico-medicamentos-2/Decreto_1782_de_2014.pdf","title":"Listado de medicamentos biológicos por las rutas de comparabilidad – Decreto 1782 de 2014","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://gabionline.net/biosimilars/general/biosimilars-approved-in-colombia","title":"[Página web] Biosimilars approved in Colombia","description":"GaBI Online (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso integrador: señal de farmacovigilancia tras un cambio a biosimilar', 'Clase 4 · Casos reales y caso integrador', 7, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta el análisis de una señal de seguridad tras un switch no médico, aplicando trazabilidad, notificación al INVIMA y evaluación de causalidad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar la farmacovigilancia y la trazabilidad de biosimilares a un caso integrador: una señal de posible pérdida de eficacia tras el cambio de un innovador a un biosimilar de adalimumab en una red de prestadores colombiana.</p><p>Situación. Una EPS consolida la compra de adalimumab y migra a sus pacientes con artritis reumatoide y enfermedad de Crohn del innovador a un biosimilar aprobado por el INVIMA. A los cuatro meses, el programa de farmacovigilancia de una IPS recibe nueve reportes de \"pérdida de respuesta\" y dos reacciones en el sitio de inyección.</p><p>Desarrollo paso a paso.<br>1. Trazabilidad: verificar que cada reporte identifica nombre comercial, titular, número de registro sanitario (prefijo MBT) y número de lote. Sin estos datos no se puede atribuir el evento al producto correcto. Por eso la EMA insiste en registrar marca y lote, y el art. 24 del Decreto 1782 exige al titular una tecnología de señalización que permita identificar el producto en la cadena de distribución.<br>2. Notificación: reportar al INVIMA a través del Programa Nacional de Farmacovigilancia (sistema de reporte en línea) y al titular del registro, quien debe incorporarlo a sus informes periódicos de seguridad.<br>3. Evaluación de causalidad: considerar factores de confusión: efecto nocebo tras un cambio no consensuado con el paciente, adherencia, actividad de la enfermedad, comedicación con metotrexato y técnica de inyección con un dispositivo nuevo.<br>4. Inmunogenicidad: solicitar niveles valle y anticuerpos antifármaco cuando sea clínicamente pertinente. La Res. 4490 de 2016 (modificada por la Res. 553 de 2017, art. 5) exige al titular reportar al INVIMA los eventos adversos asociados a inmunogenicidad y, en ciertos casos, análisis de anticuerpos antifármaco.<br>5. Gestión del riesgo: el titular revisa su plan de gestión de riesgo (art. 6.9) y evalúa si se trata de una señal real o de un artefacto; el INVIMA puede pedir información adicional o medidas sanitarias.<br>6. Comunicación: dado que Colombia no ha reglamentado la intercambiabilidad ni la sustitución automática de biológicos, el cambio debe ser una decisión clínica informada con el paciente y documentada en la historia clínica.</p><p>Resultado esperado: el estudiante elabora un informe de caso con la tabla de reportes, análisis de causalidad (algoritmo OMS-UMC), conclusión sobre la señal y recomendaciones para la EPS: educación al paciente, seguimiento estructurado del switch y registro de marca y lote en la dispensación.</p><p>Puntos clave:<br>1. Sin marca y lote no hay farmacovigilancia útil de biológicos.<br>2. El efecto nocebo es un confusor frecuente en los switches no médicos.<br>3. La responsabilidad de vigilancia es compartida: titular, prestador, EPS e INVIMA.</p>"}'::jsonb);

END
$curso$;

-- ─── 13. Curso de Registro Sanitario de Vacunas (35 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Registro Sanitario de Vacunas' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Registro Sanitario de Vacunas', 'Curso especializado en las particularidades regulatorias de las vacunas en Colombia: su evaluación como biológicos bajo el Decreto 1782 de 2014 y la Resolución 1606 de 2014, la liberación lote a lote por el INVIMA, la precalificación OMS, el Fondo Rotatorio de la OPS y el PAI.', '<p>Curso especializado en las particularidades regulatorias de las vacunas en Colombia: su evaluación como biológicos bajo el Decreto 1782 de 2014 y la Resolución 1606 de 2014, la liberación lote a lote por el INVIMA, la precalificación OMS, el Fondo Rotatorio de la OPS y el PAI. Incluye el uso de emergencia (ASUE, caso COVID-19), la farmacovigilancia de ESAVI y la cadena de frío, con casos prácticos de trámites reales.</p><h3>Objetivo general</h3><p>Que el químico farmacéutico gestione el ciclo regulatorio completo de una vacuna en Colombia, desde la preparación del dossier y la evaluación clínica y de calidad hasta la liberación de lotes, el suministro al PAI y la vigilancia de su seguridad.</p><h3>A quién va dirigido</h3><p>Químicos farmacéuticos de asuntos regulatorios, garantía de calidad, farmacovigilancia y acceso de laboratorios fabricantes e importadores de vacunas, así como profesionales del PAI, entidades territoriales e IPS vacunadoras.</p><h3>Contexto normativo</h3><p>Colombia — normativa INVIMA / MinSalud</p>',
          'Asuntos regulatorios — productos especiales', 'intermedio', 'Que el químico farmacéutico gestione el ciclo regulatorio completo de una vacuna en Colombia, desde la preparación del dossier y la evaluación clínica y de calidad hasta la liberación de lotes, el suministro al PAI y la vigilancia de su seguridad.', 'Químicos farmacéuticos de asuntos regulatorios, garantía de calidad, farmacovigilancia y acceso de laboratorios fabricantes e importadores de vacunas, así como profesionales del PAI, entidades territoriales e IPS vacunadoras.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Las vacunas como medicamentos biológicos: marco regulatorio y plataformas', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: por qué las vacunas tienen un régimen propio', 'Clase 1 · Introducción al curso', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume qué hace distintas a las vacunas dentro de los biológicos (uso en sanos, población masiva, liberación lote a lote, PAI) y presenta la ruta del curso.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1782_2014.htm","title":"[Página web] Decreto 1782 de 2014 — evaluación farmacológica y farmacéutica de medicamentos biológicos (Normograma INVIMA)","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_1606_2014.htm","title":"[Página web] Resolución 1606 de 2014 — lineamientos técnicos para la presentación de información en el control de vacunas (Normograma INVIMA)","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Decreto 1782 de 2014: rutas de evaluación y artículos específicos para vacunas', 'Clase 2 · Decreto 1782 de 2014 y Resolución 1606 de 2014 aplicados a vacunas', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las rutas (expediente completo, comparabilidad, abreviada) y los artículos que mencionan vacunas: art. 4 parágrafo 2 (Res. 1606) y art. 25 (liberación lote a lote).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1782_2014.htm","title":"[Página web] Decreto 1782 de 2014 — evaluación farmacológica y farmacéutica de medicamentos biológicos (Normograma INVIMA)","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Resolución 1606 de 2014: lineamientos técnicos para presentar información de vacunas', 'Clase 2 · Decreto 1782 de 2014 y Resolución 1606 de 2014 aplicados a vacunas', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la estructura del anexo técnico de la Resolución 1606 (información general, resúmenes, calidad, preclínica, clínica, etiquetas, liberación de lotes, aspectos ambientales, muestras).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_1606_2014.htm","title":"[Página web] Resolución 1606 de 2014 — lineamientos técnicos para la presentación de información en el control de vacunas (Normograma INVIMA)","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/DIJ/Resolucion-1606-de-2014.pdf","title":"Resolución 1606 de 2014 (texto oficial MinSalud)","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Transición normativa: vigencia indefinida (Decreto 1474/2023) y migración al Decreto 1782 (Circular 19/2023)', 'Clase 2 · Decreto 1782 de 2014 y Resolución 1606 de 2014 aplicados a vacunas', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta cómo la vigencia indefinida y la Circular 19 de 2023 afectan a las vacunas registradas bajo el Decreto 677 y qué trámite de migración deben radicar los titulares.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/circular_invima_0019_2023.htm","title":"[Página web] Circular INVIMA 19 de 2023 — renovaciones de biológicos y migración normativa al Decreto 1782","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Plataformas clásicas: vivas atenuadas, inactivadas, toxoides, polisacáridas, conjugadas y recombinantes', 'Clase 3 · Tipos de vacunas y plataformas tecnológicas', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara las plataformas tradicionales según su composición, respuesta inmune y retos regulatorios (reversión de virulencia, inactivación, conjugación, adyuvantes).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=xiW_7aDRcgI","provider":"youtube","videoId":"xiW_7aDRcgI","title":"¿Cuáles son los diferentes tipos de vacunas contra el COVID y cómo funcionan?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://vaccination-info.europa.eu/es/acerca-de-las-vacunas/como-funcionan-las-vacunas","title":"[Página web] Cómo funcionan las vacunas (tipos: vivas atenuadas, inactivadas, subunidades, toxoides, ARNm, vectoriales)","description":"Portal Europeo de Información sobre Vacunación (ECDC/Comisión Europea) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.chop.edu/parents-pack/vaccines-on-the-go-esp/tipos-de-vacunas","title":"[Página web] Tipos de vacunas (combinadas, toxoides, virus muerto, vivas, ácido nucleico, polisacáridas, recombinantes)","description":"Children''s Hospital of Philadelphia (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Nuevas plataformas: ARNm, vectores virales y ADN', 'Clase 3 · Tipos de vacunas y plataformas tecnológicas', 5, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe cómo funcionan las vacunas de ARNm, de vector viral y de ADN, y qué aspectos regulatorios nuevos plantean (nanopartículas lipídicas, ultracongelación, inmunidad al vector).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=NTSPYryppC0","provider":"youtube","videoId":"NTSPYryppC0","title":"¿Qué tipos de vacunas contra el Covid-19 se están produciendo?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.who.int/publications/m/item/plasmid-dna-vaccines-annex-2-trs-no-1028","title":"[Página web] Guidelines on the quality, safety and efficacy of plasmid DNA vaccines, Annex 2, TRS No 1028","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: ruta y requisitos para registrar una vacuna conjugada importada', 'Clase 3 · Tipos de vacunas y plataformas tecnológicas', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica el Decreto 1782 y la Resolución 1606 para definir la ruta de evaluación y la lista de requisitos de una vacuna conjugada importada ante el INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: decidir la ruta de evaluación y armar la lista de requisitos para solicitar el registro sanitario de una vacuna conjugada importada (ejemplo: vacuna neumocócica conjugada fabricada en el exterior).</p><p>Desarrollo. Las vacunas son medicamentos biológicos y, por tanto, su evaluación farmacológica y farmacéutica se rige por el Decreto 1782 de 2014. Este decreto contempla tres rutas: expediente completo (art. 7), ruta de la comparabilidad (art. 8) y ruta abreviada de comparabilidad (art. 9). El artículo 5 aclara que el estándar de evaluación no depende de la ruta escogida. Además, el parágrafo 2 del artículo 4 exige que la evaluación farmacológica de vacunas cumpla también la Resolución 1606 de 2014, cuyo anexo técnico define la información que se presenta para vacunas: información general (certificados de BPM, registros en otros países, fabricantes y responsables de liberación de lotes), resúmenes, información de producción y calidad del principio activo y del producto terminado (incluidas estabilidad y cadena de frío), estudios preclínicos, estudios clínicos (inmunogenicidad, eficacia y seguridad, con plan de farmacovigilancia para vacunas nuevas), etiquetas e insertos, liberación de lotes, aspectos ambientales y muestras.</p><p>Para una vacuna conjugada innovadora con desarrollo clínico propio, la ruta natural es el expediente completo: el solicitante aporta su propio paquete de calidad, preclínico y clínico. La comparabilidad tiene poco uso en vacunas, porque la protección depende del proceso de fabricación (cepa, conjugación, adyuvante) y rara vez existe un \"producto de referencia\" frente al que demostrar similitud analítica completa.</p><p>Ejemplo aplicado al trámite INVIMA. El importador colombiano: (1) verifica que el fabricante tenga certificado de BPM aceptado por el INVIMA y que la vacuna esté aprobada por la autoridad del país de origen; (2) organiza el dossier en formato CTD siguiendo la estructura del anexo de la Resolución 1606; (3) radica la evaluación farmacológica ante la Sala Especializada de Medicamentos de la Comisión Revisora y la evaluación farmacéutica y legal en la Oficina Virtual, pagando la tarifa vigente en UVB; (4) incluye desde el inicio el plan de gestión de riesgos y el compromiso de liberación lote a lote (art. 25 del Decreto 1782), porque ningún lote podrá comercializarse sin el certificado de liberación del INVIMA. Recuerde que, por el Decreto 1474 de 2023, el registro que se otorgue tendrá vigencia indefinida, aunque el decreto 1782 menciona originalmente cinco años.</p><p>Puntos clave:<br>1. Las vacunas siguen el Decreto 1782/2014 y, en lo específico, la Resolución 1606/2014; ambos se leen junto con el Decreto 677/1995.<br>2. La ruta de expediente completo es la habitual para vacunas; elegir otra ruta exige justificar la comparabilidad.<br>3. La liberación lote a lote (art. 25) y el plan de farmacovigilancia forman parte del diseño del trámite desde el primer día.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Desarrollo clínico y calidad de vacunas', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: evidencia clínica y calidad como ejes del registro de vacunas', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume por qué la evaluación de vacunas combina ensayos clínicos en sanos con un control de calidad estricto del proceso (\"el proceso es el producto\").</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.who.int/teams/health-product-policy-and-standards/standards-and-specifications/norms-and-standards/vaccine-standardization/clinical-evaluation-of-vaccines","title":"[Página web] Clinical evaluation of vaccines (OMS — normas y estándares)","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Fases del desarrollo clínico de vacunas (I a IV)', 'Clase 2 · Desarrollo clínico de vacunas', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los objetivos, tamaños de muestra y desenlaces de cada fase del desarrollo clínico de una vacuna, incluida la fase IV.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=n8B1m33vmBg","provider":"youtube","videoId":"n8B1m33vmBg","title":"¿Qué significan las fases de las vacunas?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=wjl4YmeP9D8","provider":"youtube","videoId":"wjl4YmeP9D8","title":"¿Conoce las fases para elaborar una vacuna? — El Espectador","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.who.int/publications/m/item/WHO-TRS-1004-web-annex-9","title":"Guidelines on clinical evaluation of vaccines: regulatory expectations (TRS 1004, Annex 9)","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Inmunogenicidad, eficacia y correlatos de protección', 'Clase 2 · Desarrollo clínico de vacunas', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta cuándo la autoridad acepta un correlato inmunológico de protección en lugar de un ensayo de eficacia y qué compromisos posaprobación genera.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.who.int/teams/health-product-policy-and-standards/standards-and-specifications/norms-and-standards/vaccine-standardization/clinical-evaluation-of-vaccines","title":"[Página web] Clinical evaluation of vaccines (OMS — normas y estándares)","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.who.int/publications/m/item/WHO-TRS-1004-web-annex-9","title":"Guidelines on clinical evaluation of vaccines: regulatory expectations (TRS 1004, Annex 9)","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: revisar el módulo clínico de una vacuna y anticipar requerimientos de la Comisión Revisora', 'Clase 2 · Desarrollo clínico de vacunas', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta una revisión del paquete clínico de una vacuna con matriz de preguntas de la Sala Especializada del INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: revisar críticamente el módulo clínico de una solicitud de registro de vacuna y anticipar los requerimientos que podría formular la Comisión Revisora del INVIMA.</p><p>Desarrollo. El numeral 5 del anexo técnico de la Resolución 1606 de 2014 pide estudios clínicos de inmunogenicidad, eficacia y seguridad y, para vacunas nuevas, un plan de farmacovigilancia. La guía OMS de evaluación clínica de vacunas (TRS 1004, anexo 9) describe qué datos se esperan en cada fase: fase I (seguridad y primera inmunogenicidad en pocos voluntarios), fase II (selección de dosis, esquema y población), fase III (eficacia clínica o, cuando no es factible, inmunogenicidad frente a un correlato de protección aceptado) y fase IV (efectividad y seguridad poscomercialización). Cuando se usa un correlato inmunológico (por ejemplo, título de anticuerpos protector), debe estar justificado científicamente y la eficacia debe confirmarse después de la comercialización.</p><p>Ejemplo aplicado. Un laboratorio radica la evaluación farmacológica de una vacuna antimeningocócica conjugada tetravalente. El revisor QF construye una matriz con las preguntas que la Sala Especializada suele hacer: ¿los ensayos pivotales incluyeron la población objetivo del esquema colombiano (lactantes, adolescentes)?; ¿el criterio de no inferioridad frente a la vacuna comparadora es aceptable y está predefinido?; ¿se evaluó la coadministración con vacunas del esquema del PAI?; ¿el lote clínico es representativo del proceso comercial (si no, se requiere puente de comparabilidad según ICH Q5E)?; ¿la base de seguridad es suficiente para detectar eventos poco frecuentes y existe un plan de farmacovigilancia activo con indicadores? Con esa matriz se completa el resumen clínico (módulo 2.7) y se preparan respuestas preventivas. También revisa que el inserto propuesto refleje fielmente la población, el esquema y las reacciones adversas observadas en los ensayos, pues las discrepancias entre el módulo clínico y el texto de etiquetado son una causa frecuente de requerimiento. Si falta un estudio en población latinoamericana, el titular puede proponer un compromiso de estudio posaprobación en lugar de esperar un requerimiento.</p><p>Puntos clave:<br>1. La eficacia clínica es el estándar; los correlatos de protección solo la reemplazan con justificación y confirmación posterior.<br>2. La coherencia entre lote clínico y lote comercial es una pregunta regulatoria, no solo de calidad.<br>3. Anticipar requerimientos en el resumen clínico acorta el trámite ante la Comisión Revisora.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Recomendaciones y guías OMS (TRS) por vacuna', 'Clase 3 · Calidad de vacunas: guías OMS e ICH Q5', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe cómo usar las Recommendations/Guidelines del Comité de Expertos en Estandarización Biológica de la OMS como estándar de calidad específico por vacuna.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.who.int/teams/health-product-policy-and-standards/standards-and-specifications/norms-and-standards/guidelines-for-biologicals","title":"[Página web] Guidelines for Biologicals — documentos OMS (Recomendaciones/Guías TRS) por vacuna","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.who.int/publications/m/item/poliomyelitis-vaccines-annex-3-trs-no-1024","title":"[Página web] Recommendations to assure the quality, safety and efficacy of poliomyelitis vaccines (inactivated), Annex 3, TRS No 1024","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.who.int/publications/m/item/influenza-vaccine-inactivated-annex-3-trs-no-927","title":"[Página web] Recommendations for the production and control of influenza vaccine (inactivated), Annex 3, TRS No 927","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'ICH Q5 y estabilidad de vacunas', 'Clase 3 · Calidad de vacunas: guías OMS e ICH Q5', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara lo que piden ICH Q5C/Q5E y la guía OMS de estabilidad de vacunas (TRS 962) frente a la Resolución 3690 de 2016 sobre estabilidad de biológicos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.hhs.gov/guidance/sites/default/files/hhs-guidance-documents/FDA/Q5C-Quality-of-Biotechnological-Products--Stability-Testing-of-Biotechnological-Biological-Products.pdf","title":"ICH Q5C — Quality of Biotechnological Products: Stability Testing of Biotechnological/Biological Products","description":"ICH / FDA (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ema.europa.eu/en/documents/scientific-guideline/ich-q-5-e-comparability-biotechnological/biological-products-step-5_en.pdf","title":"ICH Q5E — Comparability of Biotechnological/Biological Products Subject to Changes in Their Manufacturing Process","description":"ICH / EMA (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.who.int/publications/m/item/guidelines-on-stability-evaluation-of-vaccines","title":"[Página web] Guidelines on Stability Evaluation of Vaccines, Annex 3, TRS No 962","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: cambio de sitio de fabricación de una vacuna y su modificación ante INVIMA', 'Clase 3 · Calidad de vacunas: guías OMS e ICH Q5', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica la guía OMS de cambios a vacunas aprobadas (TRS 993) e ICH Q5E para clasificar un cambio y armar el soporte de comparabilidad de la modificación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.who.int/publications/m/item/procedures-and-data-requirements-changes-to-approved-vaccines-annex-4-trs-no-993","title":"[Página web] Guidelines on procedures and data requirements for changes to approved vaccines, Annex 4, TRS No 993","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ema.europa.eu/en/documents/scientific-guideline/ich-q-5-e-comparability-biotechnological/biological-products-step-5_en.pdf","title":"ICH Q5E — Comparability of Biotechnological/Biological Products Subject to Changes in Their Manufacturing Process","description":"ICH / EMA (EN)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Liberación lote a lote, precalificación OMS y PAI', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: la autoridad nacional libera cada lote', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la lógica de la liberación independiente de lotes por la autoridad reguladora y su conexión con la compra pública y el PAI.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.who.int/publications/m/item/guidelines-for-independent-lot-release-of-vaccines-annex-2-trs-no-978","title":"[Página web] Guidelines for Independent Lot Release of Vaccines by Regulatory Authorities, Annex 2, TRS No 978","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Marco legal: artículo 25 del Decreto 1782 y Resolución 22392 de 2010', 'Clase 2 · Liberación de lotes por el INVIMA', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la obligación de presentar el protocolo resumido de producción, certificado de análisis y muestras antes de comercializar cada lote de vacuna.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1782_2014.htm","title":"[Página web] Decreto 1782 de 2014 — evaluación farmacológica y farmacéutica de medicamentos biológicos (Normograma INVIMA)","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_invima_22392_2010.htm","title":"[Página web] Resolución INVIMA 2010022392 de 2010 — toma de muestras precomercialización de productos biológicos","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Guía INVIMA de liberación de lotes: documental vs por análisis, plazos y excepciones', 'Clase 2 · Liberación de lotes por el INVIMA', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los tipos de liberación (documental, por análisis según índice de riesgo), plazos (23 y 45 días hábiles), causales de análisis obligatorio y excepciones.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preview/97251","title":"Guía de liberación de lotes de vacunas, hemoderivados y sueros de origen animal (actualizada 2025)","description":"INVIMA – Oficina de Laboratorios y Control de Calidad (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/download/104863","title":"Guía de liberación de lotes de vacunas, hemoderivados y sueros de origen animal (suero antiofídico) — requisitos, muestras y plazos","description":"INVIMA – Oficina de Laboratorios y Control de Calidad (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/biblioteca/download/104866","title":"Lineamientos para la ejecución de ensayos en el laboratorio de productos biológicos (PO04-DS-603-D002 v04)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: preparar el expediente de liberación de un lote importado', 'Clase 2 · Liberación de lotes por el INVIMA', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la preparación del paquete de liberación (protocolo resumido, CoA, certificado de la autoridad de origen, diluyente, oficio remisorio, muestras) para un lote de vacuna.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/download/104863","title":"Guía de liberación de lotes de vacunas, hemoderivados y sueros de origen animal (suero antiofídico) — requisitos, muestras y plazos","description":"INVIMA – Oficina de Laboratorios y Control de Calidad (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.who.int/publications/m/item/guidelines-for-independent-lot-release-of-vaccines-annex-2-trs-no-978","title":"[Página web] Guidelines for Independent Lot Release of Vaccines by Regulatory Authorities, Annex 2, TRS No 978","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Precalificación de vacunas por la OMS', 'Clase 3 · Precalificación OMS y Fondo Rotatorio de la OPS', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el procedimiento de precalificación (TRS 978, anexo 6), su relación con la autoridad reguladora nacional y su papel en el suministro a agencias de la ONU.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.who.int/teams/health-product-policy-and-standards/standards-and-specifications/norms-and-standards/vaccines-quality/vaccine-pq/prequalification-system-for-un-supply","title":"[Página web] System for the prequalification of vaccines for UN supply","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://extranet.who.int/prequal/vaccines/prequalification-procedures-and-fees-vaccines","title":"[Página web] Prequalification Procedures and Fees: Vaccines","description":"OMS – Prequalification (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://extranet.who.int/prequal/vaccines/who-technical-report-series","title":"[Página web] WHO Technical Report Series — documentos de referencia para precalificación de vacunas","description":"OMS – Prequalification (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Fondo Rotatorio de la OPS: compra conjunta de vacunas', 'Clase 3 · Precalificación OMS y Fondo Rotatorio de la OPS', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta cómo funciona el Fondo Rotatorio (precio único, recargo, requisitos de calidad, planificación de demanda) y qué implica para el titular y el PAI.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.paho.org/es/fondo-rotatorio-para-acceso-vacunas-motor-equidad","title":"[Página web] El Fondo Rotatorio para acceso a las vacunas, un motor de equidad","description":"OPS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.paho.org/hq/dmdocuments/2015/RF-OperatingProcedures-s.pdf","title":"Procedimientos operativos del Fondo Rotatorio de la OPS para la compra de vacunas, jeringas y otros insumos relacionados","description":"OPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'PAI de Colombia: esquema, gestión y actores', 'Clase 4 · Programa Ampliado de Inmunizaciones (PAI)', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la organización del PAI, el esquema nacional vigente y sus actualizaciones recientes, y los módulos de cadena de frío y vacunación segura.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/PP/PAI/lineamientos-gestion-administracion-pai-2026.pdf","title":"Lineamientos para la gestión y administración del Programa Ampliado de Inmunizaciones – PAI – 2026","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/PP/PAI/lineamientos-gestion-administracion-pai-2025.pdf","title":"Lineamientos para la gestión y administración del PAI 2025","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: de registro sanitario a vacuna aplicada en el PAI', 'Clase 4 · Programa Ampliado de Inmunizaciones (PAI)', 7, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica de manera integrada registro, precalificación, compra por Fondo Rotatorio, liberación de lotes y vigilancia para la introducción de una vacuna al PAI.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: integrar las piezas que llevan una vacuna desde el registro sanitario hasta su aplicación gratuita en el Programa Ampliado de Inmunizaciones (PAI) de Colombia.</p><p>Desarrollo. El PAI, a cargo del Ministerio de Salud y Protección Social, define el esquema nacional y lo actualiza (los lineamientos 2026 describen, por ejemplo, la incorporación de la vacuna hexavalente, la vacuna contra el VSR en gestantes y la vacuna contra el dengue). Para que una vacuna entre al PAI deben confluir: (1) una decisión técnica del Ministerio, apoyada por el Comité Nacional de Prácticas en Inmunización; (2) el registro sanitario INVIMA (o una figura excepcional, como la ASUE en la pandemia); (3) un mecanismo de compra, que para Colombia suele ser el Fondo Rotatorio de la OPS, que exige vacunas precalificadas por la OMS o registradas por autoridades reguladoras reconocidas; (4) la liberación lote a lote por el INVIMA antes de distribuir cada lote; y (5) la logística de cadena de frío y la vigilancia de eventos adversos.</p><p>Ejemplo aplicado. El Ministerio decide incluir una nueva vacuna conjugada. El área regulatoria del fabricante confirma que el producto tiene registro sanitario vigente en Colombia y que está precalificado por la OMS, condición para participar en la licitación del Fondo Rotatorio. Adjudicada la compra, cada embarque llega a nombre del Ministerio; antes de distribuirlo, el titular o importador radica ante el INVIMA la solicitud de liberación con el protocolo resumido de producción y control, el certificado de análisis, el certificado de liberación de la autoridad del país de origen y, si el índice de riesgo lo pide, muestras. Con el certificado de liberación, el lote se distribuye por la red de frío nacional, departamental y municipal. Cualquier ESAVI grave detectado se notifica al INS y al INVIMA, y el titular debe reportarlo al Programa Nacional de Farmacovigilancia en 72 horas.</p><p>Puntos clave:<br>1. Registro sanitario, precalificación OMS y liberación de lotes son requisitos distintos y acumulativos.<br>2. El Fondo Rotatorio de la OPS compra a precio único regional productos de calidad garantizada; el área regulatoria debe mantener vigente la precalificación.<br>3. El QF regulatorio coordina calendario de liberaciones con la programación de entregas del PAI para evitar desabastecimiento.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Autorización sanitaria de uso de emergencia (ASUE): el caso COVID-19', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: regulación de vacunas en emergencias', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume los mecanismos regulatorios de emergencia para vacunas y las recomendaciones OMS para países importadores.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.who.int/publications/m/item/trs1004-annex7-pandemic-influenza-vaccine","title":"[Página web] Guidelines on regulatory preparedness for the oversight of pandemic or other emergency use vaccines in importing countries (TRS 1054, Annex 2)","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Decreto 1787 de 2020: requisitos, procedimiento y vigencia de la ASUE', 'Clase 2 · Decreto 1787 de 2020 y resoluciones ASUE', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los requisitos de elegibilidad, el dossier CTD, los plazos de 10 días hábiles y la vigencia de un año renovable (Decreto 710/2021) de la ASUE.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://consultorsalud.com/?p=161894","title":"[Página web] Decreto 1787 de 2020: uso de emergencia de medicamentos y vacunas","description":"Consultorsalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Obligaciones del titular de una ASUE: análisis de resoluciones CoronaVac y Moderna', 'Clase 2 · Decreto 1787 de 2020 y resoluciones ASUE', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara las condiciones impuestas en dos resoluciones ASUE (entrega progresiva de datos, farmacovigilancia, prohibición de publicidad).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preview/143421","title":"Resolución INVIMA 2021023888 — ASUE vacuna CoronaVac (inactivada, célula Vero)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/preview/143434","title":"Resolución INVIMA 2021025857 — ASUE COVID-19 Vaccine Moderna (ARNm)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: ASUE de vacunas actualizadas (Comirnaty bivalente y XBB.1.5) en la pospandemia', 'Clase 2 · Decreto 1787 de 2020 y resoluciones ASUE', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica la lectura de resoluciones ASUE recientes para identificar indicación, población, compromisos de calidad y PSUR/PBRER semestrales.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preview/143468","title":"Resolución INVIMA 2023029935 — ASUE Comirnaty bivalente (original/Ómicron BA.4-5)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/preview/143475","title":"Resolución INVIMA 2024005378 — ASUE Comirnaty Omicron XBB.1.5 (raxtozinameran)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'De la ASUE al registro sanitario: lecciones y verificación de vigencia', 'Clase 3 · Lecciones y transición al registro sanitario', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el carácter temporal de la ASUE, sus causales de pérdida de ejecutoria y cómo verificar la situación actual de una vacuna COVID-19.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: comprender cómo terminó la vía de autorización sanitaria de uso de emergencia (ASUE) y qué debe verificar un QF antes de afirmar la situación actual de una vacuna COVID-19 en Colombia.</p><p>Desarrollo. El Decreto 1787 de 2020 creó la ASUE para medicamentos de síntesis química y biológicos destinados a diagnosticar, prevenir o tratar la COVID-19 cuando aún no existía toda la información de un registro sanitario. Exigía un estudio clínico en curso, un balance beneficio-riesgo favorable y una necesidad no cubierta; el dossier se presentaba en formato CTD con un plan de entrega progresiva de datos. El INVIMA tenía 10 días hábiles para decidir o requerir información. La ASUE dura un año y puede renovarse una vez (art. 9, modificado por el Decreto 710 de 2021). El decreto se vinculó a la emergencia sanitaria; el normograma del INVIMA lo indica como vigente hasta el 29 de junio de 2022 tras la prórroga del Decreto 1781 de 2021. Sin embargo, el INVIMA siguió expidiendo resoluciones ASUE para vacunas actualizadas (Comirnaty bivalente en julio de 2023 y Comirnaty XBB.1.5 en febrero de 2024). Por eso, antes de afirmar la base jurídica o el estado de una autorización, el QF debe consultar el texto vigente en el normograma, las notas de vigencia y la resolución particular del producto. Entre las causas de pérdida de ejecutoria de una ASUE (art. 14) está obtener el registro sanitario completo; así, la ASUE es un puente, no un fin.</p><p>Ejemplo aplicado. Un hospital pregunta si puede seguir aplicando lotes de una vacuna COVID-19 con ASUE. El QF revisa: (1) fecha de ejecutoria de la resolución ASUE y si fue renovada; (2) si el producto obtuvo registro sanitario y en qué condiciones; (3) si los lotes tienen certificado de liberación del INVIMA; (4) si hay alertas sanitarias vigentes. Con eso emite un concepto escrito y orienta a la institución.</p><p>Puntos clave:<br>1. La ASUE es temporal, condicionada y vinculada a obligaciones de entrega de datos, farmacovigilancia y prohibición de publicidad.<br>2. La transición al registro sanitario completo exige cerrar los compromisos pendientes de calidad, eficacia y seguridad.<br>3. Verifique siempre la vigencia en el normograma INVIMA: las normas de emergencia cambian con prórrogas y modificaciones.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Vacunas en situaciones excepcionales: emergencias, donaciones y vitales no disponibles frente a la liberación de lotes', 'Clase 3 · Lecciones y transición al registro sanitario', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara cómo se aplican la liberación de lotes y la evaluación documental mínima a vacunas que ingresan por emergencia sanitaria, donación o como vital no disponible.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preview/97251","title":"Guía de liberación de lotes de vacunas, hemoderivados y sueros de origen animal (actualizada 2025)","description":"INVIMA – Oficina de Laboratorios y Control de Calidad (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.who.int/publications/m/item/trs1004-annex7-pandemic-influenza-vaccine","title":"[Página web] Guidelines on regulatory preparedness for the oversight of pandemic or other emergency use vaccines in importing countries (TRS 1054, Annex 2)","description":"OMS (EN)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Farmacovigilancia de vacunas, ESAVI y cadena de frío', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: vacunación segura', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume el concepto de vacunación segura y el papel del titular, el INVIMA, el INS y el PAI en la vigilancia de vacunas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=g6heS-f7qbc","provider":"youtube","videoId":"g6heS-f7qbc","title":"¿Cómo se vigila la seguridad de las vacunas?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.paho.org/es/temas/servicios-salud/farmacovigilancia-covid-19-vacunas","title":"[Página web] Farmacovigilancia y COVID-19: Vacunas","description":"OPS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'ESAVI: definiciones, gravedad y clasificación de causalidad', 'Clase 2 · ESAVI: definición, clasificación y notificación', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe qué es un ESAVI, cómo se distinguen leves y graves, y las categorías de causalidad (vacuna, calidad, error programático, ansiedad, coincidente).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://docs.bvsalud.org/biblioref/2021/11/1348299/guia-vigilancia-esavi_op.pdf","title":"Guía de vigilancia de eventos supuestamente atribuibles a la vacunación e inmunización (Bolivia 2021, con asistencia técnica OPS)","description":"MinSalud Bolivia / OPS (BVS) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://argentina.gob.ar/sites/default/files/bancos/2023-02/Manual_Seguridad_Vacunas_322023.pdf","title":"Manual de vigilancia de la seguridad de las vacunas (Argentina, 2023)","description":"Ministerio de Salud de Argentina (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Flujo de notificación en Colombia: UPGD, INS, INVIMA y titulares', 'Clase 2 · ESAVI: definición, clasificación y notificación', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el flujo de notificación (Sivigila, VigiFlow, Programa Nacional de Farmacovigilancia) y los plazos del titular: 72 horas para graves y reporte bimestral de no graves.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=pabpQoPi888","provider":"youtube","videoId":"pabpQoPi888","title":"Vacunación COVID-19: farmacovigilancia, seguimiento y notificación de ESAVIs","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/preview/145525","title":"VISN-INS2 — Instructivo de notificación de ESAVI (v1, 2026)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.saludcapital.gov.co/CTDLab/Publicaciones/2021/Farmacovigilancia_de_vacunas.pdf","title":"Protocolo de vigilancia en salud pública: Farmacovigilancia de vacunas (evento adverso posterior a la vacunación), código 298","description":"Instituto Nacional de Salud (INS) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: el titular recibe un ESAVI grave', 'Clase 2 · ESAVI: definición, clasificación y notificación', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la notificación de un ESAVI grave dentro de 72 horas y su seguimiento con el INS y el INVIMA, incluyendo la revisión de señales y su reflejo en informes periódicos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preview/145525","title":"VISN-INS2 — Instructivo de notificación de ESAVI (v1, 2026)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/ED/boletin14-farmacovigilancia-vacunas-jun2022.pdf","title":"Boletín de farmacovigilancia de vacunas contra COVID-19 n.º 14 (junio 2022)","description":"MinSalud / INVIMA / INS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Cadena de frío en el PAI: equipos, monitoreo y contingencias', 'Clase 3 · Cadena de frío y estabilidad', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los niveles de la red de frío, el monitoreo de temperatura y los planes de contingencia definidos en los lineamientos del PAI.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=L-ZOThuks1c","provider":"youtube","videoId":"L-ZOThuks1c","title":"Introducción a Vacunas — Elementos de cadena de frío y preparación de CIP para vacunación extramural","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=SXx1xV5bv0g","provider":"youtube","videoId":"SXx1xV5bv0g","title":"Mantener la cadena de frío, clave para almacenamiento y distribución de vacunas","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/PP/PAI/lineamientos-gestion-administracion-pai-2026.pdf","title":"Lineamientos para la gestión y administración del Programa Ampliado de Inmunizaciones – PAI – 2026","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Soporte regulatorio de la cadena de frío: estabilidad y condiciones de temperatura controlada', 'Clase 3 · Cadena de frío y estabilidad', 5, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los datos de estabilidad que respaldan la cadena de frío (TRS 962, TRS 999 sobre temperatura controlada extendida) con lo que se declara en el registro sanitario.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=aoaJWM70iQM","provider":"youtube","videoId":"aoaJWM70iQM","title":"Cadena de frío para almacenar vacuna contra la COVID-19","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.who.int/publications/m/item/guidelines-on-stability-evaluation-of-vaccines","title":"[Página web] Guidelines on Stability Evaluation of Vaccines, Annex 3, TRS No 962","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.who.int/publications/m/item/ectc-annex-5-trs-no-999","title":"[Página web] Guidelines on the stability evaluation of vaccines for use under extended controlled temperature conditions, Annex 5, TRS No 999","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico integrador: excursión de temperatura en un lote de vacunas', 'Clase 3 · Cadena de frío y estabilidad', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica criterios de estabilidad, cuarentena y farmacovigilancia para decidir el destino de un lote expuesto fuera de rango.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: resolver una excursión de temperatura en un lote de vacunas aplicando criterios regulatorios, de estabilidad y de farmacovigilancia.</p><p>Desarrollo. La cadena de frío es el conjunto de procesos que mantienen la vacuna en su rango de temperatura (generalmente 2 °C a 8 °C; algunas vacunas de ARNm requieren ultracongelación) desde la fabricación hasta la aplicación. Su soporte regulatorio está en los datos de estabilidad del registro sanitario (Resolución 1606 de 2014, numeral de producción y calidad que incluye estabilidad y cadena de frío; Resolución 3690 de 2016 sobre estabilidad de biológicos; guías OMS TRS 962 y TRS 999 para condiciones controladas de temperatura extendida) y, operativamente, en el módulo de cadena de frío de los lineamientos del PAI. La decisión sobre un producto expuesto no se toma \"a ojo\": se basa en los datos de estabilidad del fabricante, el tiempo y la temperatura registrados y, cuando existe, el indicador de vial de vacuna (VVM).</p><p>Ejemplo aplicado. Un distribuidor reporta que un refrigerador con 2.000 dosis de una vacuna inactivada registró 11 °C durante 6 horas por un corte de energía. El QF: (1) pone el lote en cuarentena, sin aplicar; (2) descarga el registro del datalogger y documenta la excursión; (3) solicita al titular el concepto basado en sus estudios de estabilidad (el titular compara la excursión con datos de estrés térmico presentados en el registro); (4) si el titular concluye que el producto sigue dentro de especificaciones, se libera internamente con soporte documental; si no, se destruye conforme a la normativa de residuos y se reporta la pérdida al PAI; (5) si ya se aplicaron dosis del lote afectado, se refuerza la vigilancia de ESAVI y se notifica por la vía correspondiente; (6) se abre una acción correctiva (plan de contingencia eléctrica). Si la exposición afecta un lote antes de su distribución, el INVIMA puede ordenar liberación por análisis.</p><p>Puntos clave:<br>1. Toda decisión sobre producto expuesto se soporta en datos de estabilidad del titular, no en criterios genéricos.<br>2. Cuarentena, documentación y comunicación al titular son los primeros pasos obligatorios.<br>3. Las fallas de cadena de frío pueden generar ESAVI por error programático: vigile y notifique.</p>"}'::jsonb);

END
$curso$;

-- ─── 14. Curso de Registro Sanitario de Productos Fitoterapéuticos (31 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Registro Sanitario de Productos Fitoterapéuticos' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Registro Sanitario de Productos Fitoterapéuticos', 'Curso especializado en el régimen colombiano de productos fitoterapéuticos bajo el Decreto 1156 de 2018: clasificación PFM, PFT y PFTI, listado de plantas aceptadas y Vademécum, evaluación farmacéutica del material vegetal y trámites ante el INVIMA. Cubre además BPM, etiquetado, publicidad y fitovigilancia con casos basados en registros reales.', '<p>Curso especializado en el régimen colombiano de productos fitoterapéuticos bajo el Decreto 1156 de 2018: clasificación PFM, PFT y PFTI, listado de plantas aceptadas y Vademécum, evaluación farmacéutica del material vegetal y trámites ante el INVIMA. Cubre además BPM, etiquetado, publicidad y fitovigilancia con casos basados en registros reales.</p><h3>Objetivo general</h3><p>Capacitar al Químico Farmacéutico para clasificar, documentar, radicar, mantener y renovar registros sanitarios de productos fitoterapéuticos ante el INVIMA, conforme al Decreto 1156 de 2018 y sus normas complementarias vigentes.</p><h3>A quién va dirigido</h3><p>Químicos Farmacéuticos y profesionales de asuntos regulatorios, calidad y desarrollo de laboratorios de productos naturales, importadores y titulares de registros fitoterapéuticos en Colombia.</p><h3>Contexto normativo</h3><p>Colombia — normativa INVIMA / MinSalud</p>',
          'Asuntos regulatorios — productos especiales', 'intermedio', 'Capacitar al Químico Farmacéutico para clasificar, documentar, radicar, mantener y renovar registros sanitarios de productos fitoterapéuticos ante el INVIMA, conforme al Decreto 1156 de 2018 y sus normas complementarias vigentes.', 'Químicos Farmacéuticos y profesionales de asuntos regulatorios, calidad y desarrollo de laboratorios de productos naturales, importadores y titulares de registros fitoterapéuticos en Colombia.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Marco normativo, definiciones y clasificación de los productos fitoterapéuticos', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: los productos fitoterapéuticos en el sistema regulatorio colombiano', 'Clase 1 · Clase 1 – Introducción al curso', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Presenta el alcance del curso, el papel del QF de asuntos regulatorios en fitoterapéuticos y la ruta desde la planta hasta el registro y la vigilancia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://consultorsalud.com/?p=19254","title":"[Página web] Reglamentación de productos fitoterapéuticos incluido en Cannabis: Decreto 1156 de 2018","description":"ConsultorSalud (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_homeopaticos_fitoterapeuticos_NEW/Decreto_1156_de_2018.pdf","title":"Decreto 1156 de 2018 (texto oficial en PDF)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Del Decreto 2266 de 2004 al Decreto 1156 de 2018', 'Clase 2 · Evolución y mapa normativo', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Explica por qué se reformó el régimen de fitoterapéuticos, qué derogó el Decreto 1156 y qué artículos del Decreto 2266 siguen vigentes (BPM y etiquetas).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www2.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/MET/respuesta-a-comentarios-modificacion-decreto-2266.pdf","title":"Respuesta a comentarios del proyecto de decreto que modifica el Decreto 2266 de 2004 (consulta pública 2015)","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_homeopaticos_fitoterapeuticos_NEW/Decreto_1156_de_2018.pdf","title":"Decreto 1156 de 2018 (texto oficial en PDF)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/normatividad_normatividad_interna/decreto_3553_2004_2.pdf","title":"Decreto 3553 de 2004 (modificó el Decreto 2266 de 2004)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Mapa de normas vigentes aplicables a un fitoterapéutico', 'Clase 2 · Evolución y mapa normativo', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Identifica las normas satélite (Vademécum, listado de plantas, BPM, publicidad, farmacovigilancia) y confirma que los fitoterapéuticos mantienen vigencia de 10 años, fuera del Decreto 1474 de 2023.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: construir el mapa de normas que hoy rigen un producto fitoterapéutico en Colombia y saber cuál consultar en cada etapa de su ciclo de vida.</p><p>Desarrollo. El eje es el Decreto 1156 de 2018 (MinSalud), que reglamenta el régimen de registro sanitario de productos fitoterapéuticos y derogó los Decretos 2266 y 3553 de 2004. Esa derogatoria tiene dos excepciones expresas (art. 52): siguen vigentes las disposiciones del Decreto 2266 sobre buenas prácticas de manufactura y sobre envases, etiquetas y empaques (arts. 7 a 12 y apartes de los arts. 44 y 45), mientras el Ministerio no expida la reglamentación que las sustituya. Por eso, al revisar un arte de etiqueta todavía se consulta el Decreto 2266.</p><p>Alrededor del decreto gravitan normas satélite: (1) Resolución 2834 de 2008, que adopta el Vademécum de Plantas Medicinales Colombiano como referencia obligatoria; (2) el Listado de plantas medicinales aceptadas con fines terapéuticos que actualiza el INVIMA a través de la Sala Especializada de Productos Fitoterapéuticos y Suplementos Dietarios (SEPFSD) de la Comisión Revisora; (3) Resolución 3131 de 1998, manual de BPM para productos farmacéuticos con base en recursos naturales, que en 2026 MinSalud propuso sustituir por nuevos manuales (proyecto notificado con transición de 24 meses); (4) Resolución 1896 de 2023 sobre información, promoción y publicidad de medicamentos y fitoterapéuticos, que derogó la Resolución 4320 de 2004; (5) Resolución INVIMA 2024015321 de 2024 sobre reportes de eventos adversos y programas de farmacovigilancia, que expresamente reglamenta el art. 48 del Decreto 1156 (fitovigilancia); (6) las resoluciones de tarifas del INVIMA vigentes para cada año.</p><p>Un punto crítico: el Decreto 1474 de 2023 dio vigencia indefinida a los registros de medicamentos (síntesis, biológicos, homeopáticos, gases), pero los productos fitoterapéuticos conservan el régimen propio del Decreto 1156: vigencia de 10 años renovable por periodos iguales (art. 14). Los actos de renovación expedidos por el INVIMA en 2024 lo confirman (renovaciones por diez años con sufijo -R1).</p><p>Ejemplo aplicado. Un laboratorio nacional quiere lanzar un jarabe de hiedra. Ruta normativa: verificar Hedera helix en el listado (categoría PFM o PFT) y en el Vademécum; definir la categoría y la documentación (arts. 15-26 del Decreto 1156); confirmar certificado BPM del fabricante bajo Res. 3131/1998; diseñar etiqueta con Decreto 2266 arts. 7-12 y arts. 34-37 del Decreto 1156; si es de venta libre, preparar la publicidad bajo Res. 1896/2023; y documentar el programa de farmacovigilancia según Res. 2024015321.</p><p>Puntos clave:<br>1. Decreto 1156/2018 es la norma base, pero el Decreto 2266/2004 sigue vigente en BPM y etiquetado.<br>2. Los fitoterapéuticos NO entraron en la vigencia indefinida del Decreto 1474/2023: siguen con 10 años renovables.<br>3. Listado de plantas, Vademécum, BPM, publicidad y farmacovigilancia son normas satélite que se deben revisar en cada trámite.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Definiciones y clasificación: PFM, PFT y PFTI', 'Clase 3 · Definiciones y fronteras regulatorias', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las definiciones del art. 3 y la clasificación del art. 10 del Decreto 1156: preparación farmacéutica con base en plantas medicinales, producto fitoterapéutico de uso tradicional nacional e importado.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1156_2018.htm","title":"[Página web] Decreto 1156 de 2018 – Régimen de registro sanitario de productos fitoterapéuticos (compilación jurídica)","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Fitoterapéutico vs medicamento de síntesis, suplemento dietario y cosmético', 'Clase 3 · Definiciones y fronteras regulatorias', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los criterios de frontera: principios activos aislados, finalidad terapéutica, declaraciones permitidas y régimen (Decreto 677/1995, Decreto 3249/2006, Decreto 1156/2018).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_3249_2006.htm","title":"[Página web] Decreto 3249 de 2006 – Régimen de suplementos dietarios (compilación jurídica)","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/alertas-sanitarias/productos-promocionados-como-suplementos-dietarios-y-potenciadores-sexuales","title":"[Página web] Alerta sanitaria: productos promocionados como suplementos dietarios y potenciadores sexuales","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: clasificar cuatro productos con base en plantas', 'Clase 3 · Definiciones y fronteras regulatorias', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica las definiciones a registros reales del INVIMA (un PFM de venta libre y un PFT tradicional nacional) y a casos de frontera para decidir la categoría y la vía de trámite.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://webservice.invima.gov.co/registros/pdf/16172774_2024004537.pdf","title":"Resolución INVIMA 2024004537 – Registro sanitario PFM2024-0002953 (Psyllium, preparación farmacéutica con base en plantas, venta libre)","description":"INVIMA – Consulta de registros (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://webservice.invima.gov.co/registros/pdf/16512640_2024004297.pdf","title":"Resolución INVIMA 2024004297 – Renovación de registro: PFM2010-0001618 pasa a PFT2024-0001618-R1 (asociación boldo, cáscara sagrada, psyllium y sen)","description":"INVIMA – Consulta de registros (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Plantas medicinales aceptadas y evaluación farmacológica', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: la planta como punto de partida del registro', 'Clase 1 · Clase 1 – Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume por qué ningún fitoterapéutico puede registrarse si su planta no está aceptada y el papel del Vademécum y de la Comisión Revisora.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://consultorsalud.com/?p=19254","title":"[Página web] Reglamentación de productos fitoterapéuticos incluido en Cannabis: Decreto 1156 de 2018","description":"ConsultorSalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'El Vademécum de Plantas Medicinales Colombiano (Res. 2834 de 2008)', 'Clase 2 · Vademécum y listado de plantas aceptadas', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la resolución que adopta el Vademécum como referencia obligatoria, la información de cada monografía y quién lo actualiza.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minproteccion_2834_2008.htm","title":"[Página web] Resolución 2834 de 2008 – Adopta el Vademécum de Plantas Medicinales Colombiano y lineamientos para su actualización","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Listado de plantas medicinales aceptadas con fines terapéuticos y sus actualizaciones', 'Clase 2 · Vademécum y listado de plantas aceptadas', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la estructura del listado por categoría (PFM, PFT/PFTI), sus versiones (2015, 2019) y actualizaciones posteriores mediante actas de la SEPFSD y la Resolución 2025011938 de 2025.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/listado_20de_20plantas-_20v_20julio_20publicarpdf","title":"Listado de plantas medicinales aceptadas con fines terapéuticos (Sala Especializada de Productos Fitoterapéuticos y Suplementos Dietarios)","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/acta_20no_2016_20-_202023_20sepfsdpdf","title":"Acta No. 16 de 2023 – Comisión Revisora, Sala Especializada de Productos Fitoterapéuticos y Suplementos Dietarios (revisión del listado de plantas v. 2019)","description":"INVIMA – Comisión Revisora (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.agronegocios.co/remedios/invima-abre-la-puerta-al-uso-terapeutico-del-dividivi-para-enfermedades-respiratorias-4323108","title":"[Página web] Invima abre la puerta al uso terapéutico del dividivi para enfermedades respiratorias","description":"Agronegocios (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Criterios y trámite de inclusión de plantas (arts. 5 a 9 del Decreto 1156)', 'Clase 3 · Inclusión de nuevas plantas y Sala Especializada', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Explica los requisitos de eficacia y seguridad para PFM (toxicidad, estudios de eficacia) y de tradición de uso para PFT/PFTI (cuatro décadas, tres referencias), y el plazo de tres meses para el concepto.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1156_2018.htm","title":"[Página web] Decreto 1156 de 2018 – Régimen de registro sanitario de productos fitoterapéuticos (compilación jurídica)","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://consultorsalud.com/?p=19254","title":"[Página web] Reglamentación de productos fitoterapéuticos incluido en Cannabis: Decreto 1156 de 2018","description":"ConsultorSalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'La Sala Especializada de Productos Fitoterapéuticos y Suplementos Dietarios: lectura de actas', 'Clase 3 · Inclusión de nuevas plantas y Sala Especializada', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta cómo conceptúa la Comisión Revisora sobre asociaciones, posología, contraindicaciones y revisiones de oficio a partir de actas reales.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/acta_20no_2016_20-_202023_20sepfsdpdf","title":"Acta No. 16 de 2023 – Comisión Revisora, Sala Especializada de Productos Fitoterapéuticos y Suplementos Dietarios (revisión del listado de plantas v. 2019)","description":"INVIMA – Comisión Revisora (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/preview/128669","title":"Acta 09 de 2009 – Comisión Revisora, Sala Especializada de Productos Naturales","description":"INVIMA – Comisión Revisora (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/biblioteca/acta-no-12-de-2017-sepfsd-noviembre_0pdf","title":"Acta No. 12 de 2017 – Comisión Revisora, Sala Especializada de Productos Fitoterapéuticos y Suplementos Dietarios","description":"INVIMA – Comisión Revisora (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: la inclusión del dividivi (Caesalpinia spinosa) en el listado PFM', 'Clase 3 · Inclusión de nuevas plantas y Sala Especializada', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Analiza el recorrido de una planta nativa desde la investigación hasta su inclusión en el listado y lo que significa para un futuro registro PFM.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.javeriana.edu.co/pesquisa/invima-dividivi-medicamento/","title":"[Página web] Usos terapéuticos del dividivi, a punto aprobación de Invima (inclusión de Caesalpinia spinosa en el listado PFM)","description":"Pontificia Universidad Javeriana – Pesquisa (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.agronegocios.co/remedios/invima-abre-la-puerta-al-uso-terapeutico-del-dividivi-para-enfermedades-respiratorias-4323108","title":"[Página web] Invima abre la puerta al uso terapéutico del dividivi para enfermedades respiratorias","description":"Agronegocios (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Evaluación farmacéutica y control de calidad del material vegetal', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: identidad, consistencia y pureza', 'Clase 1 · Clase 1 – Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume las tres preguntas de la evaluación farmacéutica de un fitoterapéutico y en qué difiere de la de un medicamento de síntesis.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: entender por qué la evaluación farmacéutica de un fitoterapéutico es distinta de la de un medicamento de síntesis y qué preguntas responde ante el INVIMA.</p><p>Desarrollo. En un medicamento de síntesis la sustancia activa es una molécula definida con monografía farmacopeica; en un fitoterapéutico la \"sustancia activa\" es el material vegetal o su preparación (extracto, tintura, polvo, aceite). El Decreto 1156 de 2018 lo reconoce: si los constituyentes activos no se conocen, la planta completa o su preparación se considera la sustancia activa (art. 21, con referencia a la guía de la OMS). Por eso la evaluación farmacéutica gira en torno a tres preguntas: ¿es la planta correcta?, ¿es siempre igual? y ¿está libre de contaminantes?</p><p>La primera se responde con la identificación botánica: certificado de clasificación botánica expedido por un herbario colombiano reconocido (o del país de origen, listado en el Index Herbariorum, para PFTI), descripción macro y microscópica y perfil cromatográfico (TLC/HPLC). La segunda, con la estandarización: marcadores químicos (activos o analíticos), especificaciones de contenido, relación droga-extracto, solvente y proceso definidos, y estudios de estabilidad que soportan la vida útil (máximo 2 años, o hasta 4 con envejecimiento natural, según el decreto). La tercera, con el control de contaminantes exigido por el art. 45: metales pesados, residuos de plaguicidas, carga microbiológica, y cuando aplique, micotoxinas, solventes residuales y materia extraña.</p><p>Los textos de referencia admitidos (art. 4) incluyen farmacopeas oficiales y monografías de la OMS y la EMA; la Sala Especializada de Productos Fitoterapéuticos y Suplementos Dietarios del INVIMA aplica estos referentes al conceptuar.</p><p>Ejemplo aplicado. Para una cápsula de valeriana (Valeriana officinalis, raíz), el dossier farmacéutico debe incluir: certificado de herbario del lote de materia prima, especificaciones de la droga vegetal según farmacopea (pérdida por secado, cenizas, ácidos valerénicos como marcador), certificado de análisis de excipientes, descripción del proceso, especificaciones y métodos del producto terminado (uniformidad de peso, desintegración, identificación cromatográfica, microbiología) y estabilidad de al menos dos lotes piloto. Si falta el certificado botánico, el INVIMA formulará requerimiento o negará la solicitud.</p><p>Puntos clave:<br>1. En fitoterapéuticos la sustancia activa puede ser la planta completa o su preparación: identidad y estandarización son el núcleo del dossier.<br>2. El certificado de clasificación botánica es requisito documental, no un anexo opcional.<br>3. El art. 45 del Decreto 1156 fija el control fisicoquímico, cromatográfico, de contaminantes y microbiológico de materias primas y producto terminado.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Origen, identificación botánica y buenas prácticas agrícolas y de recolección', 'Clase 2 · Calidad del material vegetal', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el certificado de clasificación botánica (herbario colombiano o Index Herbariorum), la trazabilidad del cultivo y las BPAR de la OMS.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://fitoterapiabrasil.com.br/sites/default/files/documentos-oficiais/directrices_de_la_oms_sobre-falta.pdf","title":"Directrices de la OMS sobre buenas prácticas agrícolas y de recolección (BPAR) de plantas medicinales (2003)","description":"OMS (copia en Fitoterapia Brasil) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1156_2018.htm","title":"[Página web] Decreto 1156 de 2018 – Régimen de registro sanitario de productos fitoterapéuticos (compilación jurídica)","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Control de calidad de materias primas y producto terminado (art. 45)', 'Clase 2 · Calidad del material vegetal', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica los ensayos físicos, fisicoquímicos (perfil cromatográfico, metales pesados, plaguicidas) y microbiológicos exigidos para materias primas y producto terminado.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://revistas.unal.edu.co/index.php/rccquifa/article/download/110745/90847/669111","title":"Estado del arte en la estandarización de extractos vegetales (Rev. Colomb. Cienc. Quím. Farm., 2023)","description":"Universidad Nacional de Colombia (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.redalyc.org/pdf/4761/476150821009.pdf","title":"Control de calidad de los fitofármacos: Ecuador, uso y comercio de plantas medicinales","description":"Universitas – Universidad Politécnica Salesiana (Redalyc) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Marcadores, estandarización de extractos y estabilidad', 'Clase 2 · Calidad del material vegetal', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el uso de marcadores activos y analíticos, la relación droga-extracto y los estudios de estabilidad que soportan la vida útil (2 años, hasta 4 con envejecimiento natural).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://revistas.unal.edu.co/index.php/rccquifa/article/download/110745/90847/669111","title":"Estado del arte en la estandarización de extractos vegetales (Rev. Colomb. Cienc. Quím. Farm., 2023)","description":"Universidad Nacional de Colombia (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Documentación legal y farmacéutica por categoría (arts. 17, 18, 21 y 24)', 'Clase 3 · Dossier legal y farmacéutico', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los requisitos documentales de PFM, PFT y PFTI: certificados BPM, contratos, marca, CVL, fórmula, certificados de análisis, métodos y artes.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1156_2018.htm","title":"[Página web] Decreto 1156 de 2018 – Régimen de registro sanitario de productos fitoterapéuticos (compilación jurídica)","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_homeopaticos_fitoterapeuticos_NEW/Decreto_1156_de_2018.pdf","title":"Decreto 1156 de 2018 (texto oficial en PDF)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: armar el dossier de un PFM nacional de venta libre', 'Clase 3 · Dossier legal y farmacéutico', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta el armado del dossier de una preparación de psyllium a partir de un registro real del INVIMA, identificando cada requisito cumplido.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://webservice.invima.gov.co/registros/pdf/16172774_2024004537.pdf","title":"Resolución INVIMA 2024004537 – Registro sanitario PFM2024-0002953 (Psyllium, preparación farmacéutica con base en plantas, venta libre)","description":"INVIMA – Consulta de registros (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1156_2018.htm","title":"[Página web] Decreto 1156 de 2018 – Régimen de registro sanitario de productos fitoterapéuticos (compilación jurídica)","description":"INVIMA – Normograma (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Trámites ante el INVIMA: registro, renovación y modificaciones', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: vías de trámite para fitoterapéuticos', 'Clase 1 · Clase 1 – Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume las vías de registro (automático y con evaluación), la vigencia de 10 años y los trámites de renovación y modificación propios del Decreto 1156.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_homeopaticos_fitoterapeuticos_NEW/Decreto_1156_de_2018.pdf","title":"Decreto 1156 de 2018 (texto oficial en PDF)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://es.investinbogota.org/wp-content/uploads/2025/12/ABC-13_RegistrosSanitarios-1.pdf","title":"ABC Registros sanitarios en Colombia","description":"Invest in Bogotá (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Registro de PFM con evaluación (arts. 15 a 19)', 'Clase 2 · Obtención del registro sanitario', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica el procedimiento de evaluación de una PFM: condiciones del art. 15, plazo de 30 días hábiles, requerimiento único con 60 días hábiles para responder y desistimiento.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1156_2018.htm","title":"[Página web] Decreto 1156 de 2018 – Régimen de registro sanitario de productos fitoterapéuticos (compilación jurídica)","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://webservice.invima.gov.co/registros/pdf/16172774_2024004537.pdf","title":"Resolución INVIMA 2024004537 – Registro sanitario PFM2024-0002953 (Psyllium, preparación farmacéutica con base en plantas, venta libre)","description":"INVIMA – Consulta de registros (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Registro automático de PFT y PFTI y revisión posterior (arts. 20 a 26)', 'Clase 2 · Obtención del registro sanitario', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las condiciones del registro automático (planta en listado, venta libre, formas no inyectables ni oftálmicas) y las consecuencias de la revisión posterior.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1156_2018.htm","title":"[Página web] Decreto 1156 de 2018 – Régimen de registro sanitario de productos fitoterapéuticos (compilación jurídica)","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://webservice.invima.gov.co/registros/pdf/16514493_2024003999.pdf","title":"Resolución INVIMA 2024003999 – Renovación de registro: PFM2011-0001663 pasa a PFT2024-0001663-R1 (producto fitoterapéutico tradicional nacional)","description":"INVIMA – Consulta de registros (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Revisión de oficio de productos fitoterapéuticos (art. 47)', 'Clase 2 · Obtención del registro sanitario', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe cuándo el INVIMA llama a revisión de oficio, cómo responder dentro del plazo y las posibles decisiones sobre el registro.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/acta_20no_2016_20-_202023_20sepfsdpdf","title":"Acta No. 16 de 2023 – Comisión Revisora, Sala Especializada de Productos Fitoterapéuticos y Suplementos Dietarios (revisión del listado de plantas v. 2019)","description":"INVIMA – Comisión Revisora (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Vigencia de 10 años y renovación automática o con evaluación (arts. 14, 27 y 29)', 'Clase 3 · Vigencia, renovación y modificaciones', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Explica la vigencia del registro, los requisitos de la renovación automática (listado, misma información, estabilidad, BPM, CVL) y cuándo se tramita con evaluación completa.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1156_2018.htm","title":"[Página web] Decreto 1156 de 2018 – Régimen de registro sanitario de productos fitoterapéuticos (compilación jurídica)","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://webservice.invima.gov.co/registros/pdf/16514493_2024003999.pdf","title":"Resolución INVIMA 2024003999 – Renovación de registro: PFM2011-0001663 pasa a PFT2024-0001663-R1 (producto fitoterapéutico tradicional nacional)","description":"INVIMA – Consulta de registros (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Modificaciones automáticas y no automáticas y agotamiento de existencias (arts. 30-32 y 39)', 'Clase 3 · Vigencia, renovación y modificaciones', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Clasifica los cambios posregistro según el Decreto 1156 y aplica la regla de agotamiento de existencias del art. 39.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: distinguir las modificaciones automáticas y no automáticas de un registro fitoterapéutico y aplicar la regla de agotamiento de existencias del art. 39 del Decreto 1156 de 2018.</p><p>Desarrollo. A diferencia de los medicamentos de síntesis, cuyas modificaciones se clasifican por riesgo bajo el Decreto 334 de 2022, los productos fitoterapéuticos tienen un régimen propio en los arts. 30 a 32 del Decreto 1156. Son automáticas (art. 30) los cambios de nombre, dirección o razón social de titular, fabricante, importador o envasador; las cesiones del registro; nuevas presentaciones comerciales que no requieran estudios de estabilidad; cambios de etiqueta que no alteren los textos aprobados; cambio de marca; reducción de la vida útil; y cambio de condición de venta cuando el listado esté actualizado. Estas se aprueban al radicar y quedan sujetas a revisión posterior (art. 31), con requerimiento que debe responderse dentro del plazo fijado por el INVIMA (60 días hábiles).</p><p>Son no automáticas (art. 32) las que alteran usos terapéuticos o condiciones de comercialización (evaluación en 60 días hábiles) y las demás que requieren evaluación técnica, como cambio de fabricante, de proceso, de especificaciones, de material de envase o ampliación de vida útil (decisión en 30 días hábiles). El envase debe estar aprobado con base en estabilidad (art. 34) y el nombre del producto no puede ser engañoso ni aludir a indicaciones (art. 35).</p><p>El art. 39 regula el agotamiento de existencias: cuando el registro se renueva o modifica, el producto fabricado con la información anterior puede comercializarse hasta el fin de su vida útil; si el registro vence sin renovación, no se puede fabricar ni importar más, pero las existencias pueden venderse dentro de su vida útil. La regla no aplica si hay riesgo para la salud pública o afectación de la calidad.</p><p>Ejemplo aplicado. Un titular de un PFT de caléndula cambia la razón social de su fabricante y, a la vez, quiere ampliar la vida útil de 2 a 3 años. Debe radicar dos trámites: el primero es automático (art. 30) y se aprueba con revisión posterior; el segundo es no automático y requiere estudios de estabilidad a largo plazo que soporten la ampliación (máximo 4 años con envejecimiento natural). Las unidades ya etiquetadas con la razón social anterior pueden agotarse según el art. 39.</p><p>Puntos clave:<br>1. Los fitoterapéuticos usan los arts. 30-32 del Decreto 1156, no la clasificación por riesgo del Decreto 334/2022.<br>2. Automática no significa sin control: el INVIMA hace revisión posterior y puede requerir información.<br>3. El agotamiento de existencias (art. 39) permite vender hasta el fin de la vida útil, salvo riesgo sanitario.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: renovación con migración de PFM a PFT', 'Clase 3 · Vigencia, renovación y modificaciones', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Analiza dos renovaciones reales de 2024 en las que registros PFM de 2010-2011 se renovaron como PFT con sufijo -R1 y diez años de vigencia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://webservice.invima.gov.co/registros/pdf/16514493_2024003999.pdf","title":"Resolución INVIMA 2024003999 – Renovación de registro: PFM2011-0001663 pasa a PFT2024-0001663-R1 (producto fitoterapéutico tradicional nacional)","description":"INVIMA – Consulta de registros (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://webservice.invima.gov.co/registros/pdf/16512640_2024004297.pdf","title":"Resolución INVIMA 2024004297 – Renovación de registro: PFM2010-0001618 pasa a PFT2024-0001618-R1 (asociación boldo, cáscara sagrada, psyllium y sen)","description":"INVIMA – Consulta de registros (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. BPM, etiquetado, publicidad y fitovigilancia', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: cumplimiento continuo después del registro', 'Clase 1 · Clase 1 – Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume las obligaciones posregistro del titular y demás actores (BPM, etiquetado, expendio, publicidad, fitovigilancia) y sus consecuencias sobre el registro.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: presentar el bloque de vigilancia y cumplimiento posterior al registro (BPM, etiquetado, expendio, publicidad y fitovigilancia) y su relación con el mantenimiento del registro sanitario.</p><p>Desarrollo. Obtener el registro de un producto fitoterapéutico es solo el inicio. El Decreto 1156 de 2018 hace al titular, fabricante, importador, envasador y distribuidor responsables del cumplimiento en su ámbito (art. 49) y le da al INVIMA herramientas permanentes: revisión posterior de los registros automáticos (arts. 23 y 26), revisión de oficio (art. 47), fitovigilancia (art. 48) y control de publicidad (art. 42).</p><p>La unidad recorre cinco frentes. Primero, BPM: hoy la Resolución 3131 de 1998 es el manual aplicable a productos farmacéuticos con base en recursos naturales y su certificado es requisito del registro y de la renovación; en 2026 MinSalud notificó un proyecto de resolución con nuevos manuales y guías de inspección (incluido uno para estériles), que derogaría las Resoluciones 3131/1998 y 5107/2005 tras 24 meses de transición. Segundo, etiquetado: siguen vigentes los arts. 7 a 12 del Decreto 2266/2004, complementados por los arts. 34 a 37 del Decreto 1156 (envases aprobados, nombres permitidos, idioma castellano con nombre científico en latín, imágenes alusivas solo en venta libre). Tercero, expendio (art. 41): con fórmula facultativa solo en droguerías, farmacias-droguerías, tiendas naturistas y establecimientos autorizados; venta libre en otros comercios con buenas prácticas de abastecimiento, en estantería separada; prohibida la venta ambulante. Cuarto, publicidad: autorización del INVIMA y Resolución 1896 de 2023. Quinto, fitovigilancia: Resolución 2024015321 de 2024.</p><p>Ejemplo aplicado. Una visita de inspección del INVIMA a un laboratorio que fabrica tisanas PFT encuentra lotes sin certificado de análisis de materia prima. Consecuencias posibles: medida sanitaria en planta, afectación del certificado BPM y, por extensión, revisión de oficio de los registros que dependen de ese fabricante. El QF de asuntos regulatorios debe coordinar con calidad un plan de acción y documentar la respuesta.</p><p>Puntos clave:<br>1. El registro se mantiene con cumplimiento continuo: BPM, etiqueta, expendio, publicidad y fitovigilancia.<br>2. Las BPM de fitoterapéuticos están en transición: Res. 3131/1998 vigente y proyecto 2026 en curso.<br>3. El art. 49 del Decreto 1156 reparte responsabilidad entre todos los actores de la cadena.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'BPM para fitoterapéuticos: Res. 3131 de 1998 y proyecto de nuevos manuales 2026', 'Clase 2 · BPM y etiquetado', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el manual vigente de BPM para productos con base en recursos naturales y el proyecto de MinSalud que lo sustituiría con transición de 24 meses.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/resolucion-3131-de-1998pdf","title":"Resolución 3131 de 1998 – Manual de BPM para productos farmacéuticos con base en recursos naturales","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www2.aladi.org/nsfaladi/normasTecnicas.nsf/09267198f1324b64032574960062343c/613c2f30efd1089103258da900624cff/$FILE/Not_Col_275_P.Res_BPM.pdf","title":"Proyecto de resolución 2026 – Manuales de BPM de productos fitoterapéuticos y guías de inspección (notificación Colombia)","description":"ALADI – Notificación de reglamentos técnicos (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://consultorsalud.com/buenas-practicas-manufactura-fitoterapeuticos","title":"[Página web] Buenas prácticas de manufactura de productos fitoterapéuticos (análisis de impacto normativo MinSalud)","description":"ConsultorSalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Etiquetado, nombre del producto, envase y expendio (Dec. 2266 arts. 7-12; Dec. 1156 arts. 34-37 y 41)', 'Clase 2 · BPM y etiquetado', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica las reglas de etiqueta, nombres permitidos, idioma, imágenes y canales de expendio según la condición de venta.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar las reglas de etiquetado, nombre del producto, envase y condición de venta específicas de los productos fitoterapéuticos.</p><p>Desarrollo. El etiquetado de fitoterapéuticos combina dos normas. Por mandato del art. 52 del Decreto 1156 de 2018, siguen vigentes los arts. 7 a 12 del Decreto 2266 de 2004 (envases, etiquetas y empaques) hasta que MinSalud expida nueva reglamentación. El Decreto 1156 añade: el INVIMA aprueba los envases con base en estudios de estabilidad y se prohíbe entregar el producto en envase no autorizado (art. 34); el nombre no puede ser engañoso, exagerado, confuso, aludir a usos o indicaciones, estar formado solo por iniciales o números, tener connotación religiosa ni usar títulos como \"doctor\" (art. 35); la información va en castellano, salvo el nombre científico de la planta, que va en latín (art. 36); en productos con prescripción no se permiten dibujos alusivos a la actividad terapéutica, mientras en los de venta libre se aceptan si corresponden al uso tradicional o indicación aprobada (art. 37).</p><p>Elementos mínimos a verificar en el arte: nombre del producto y nombre científico de la(s) planta(s) con la parte usada; forma farmacéutica; composición cualicuantitativa por unidad de dosis (droga o extracto y relación); uso tradicional (PFT/PFTI) o indicación aprobada (PFM) tal como figura en el listado; posología, contraindicaciones, advertencias e interacciones del listado o del acto de registro; número de registro con el prefijo correcto (PFM, PFT, PFTI); lote y fecha de vencimiento; titular, fabricante e importador; condición de venta. El registro diferencia \"PFM de venta libre\" o \"con fórmula facultativa\" y el PFT es de venta libre por definición (art. 21).</p><p>Expendio (art. 41): los productos con fórmula facultativa solo se venden con fórmula médica en droguerías, farmacias-droguerías, tiendas naturistas u otros establecimientos autorizados; los de venta libre pueden venderse en otros comercios que cumplan buenas prácticas de abastecimiento, en estantería separada; la venta ambulante está prohibida.</p><p>Ejemplo aplicado. Un PFT de manzanilla propone el nombre \"Dr. Calma Digestiva\" e incluye en la etiqueta \"elimina la gastritis\". Ambos incumplen: \"Dr.\" viola el art. 35 y \"elimina la gastritis\" supera el uso tradicional aprobado (p. ej., coadyuvante en alivio sintomático de trastornos digestivos leves). La corrección es un nombre de fantasía neutro y la transcripción literal del uso tradicional aprobado. El cambio de nombre con justificación se tramita como modificación.</p><p>Puntos clave:<br>1. Etiquetado = Decreto 2266/2004 arts. 7-12 (vigentes) + Decreto 1156/2018 arts. 34-37.<br>2. El texto de uso o indicación debe coincidir con el listado y con el acto de registro, sin ampliaciones.<br>3. La condición de venta determina el canal de expendio (art. 41) y las reglas de publicidad.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Publicidad de fitoterapéuticos: de la Res. 4320 de 2004 a la Res. 1896 de 2023', 'Clase 3 · Publicidad, fitovigilancia y caso integrador', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las reglas de autorización y contenido de la publicidad de fitoterapéuticos de venta libre y qué cambió con la Resolución 1896 de 2023.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minproteccion_4320_2004.htm","title":"[Página web] Resolución 4320 de 2004 – Publicidad de medicamentos y productos fitoterapéuticos de venta libre (derogada por Res. 1896 de 2023)","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.bu.com.co/es/insights/noticias/propuesta-regulatoria-informacion-de-medicamentos-y-fitoterapeuticos","title":"[Página web] Propuesta regulatoria: información de medicamentos y fitoterapéuticos","description":"Brigard Urrutia (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Fitovigilancia: Resolución 2024015321 de 2024', 'Clase 3 · Publicidad, fitovigilancia y caso integrador', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el programa de farmacovigilancia exigido al titular de fitoterapéuticos y los plazos de reporte (serios 15 días, no serios 90, trimestral sin eventos).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://invima.gov.co/biblioteca/resolucion-2024015321-reportes-eventos-adversos-farmacovigilancia","title":"[Página web] Resolución 2024015321 del 08 de abril de 2024: reglamentación de reportes de eventos adversos y farmacovigilancia","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso integrador: plan regulatorio de un PFTI importado', 'Clase 3 · Publicidad, fitovigilancia y caso integrador', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta de principio a fin el plan regulatorio de un producto tradicional importado: verificación de plantas, dossier, registro automático, etiqueta, publicidad, fitovigilancia y renovación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: integrar todo el curso en un plan regulatorio para un producto fitoterapéutico tradicional importado (PFTI), desde la verificación de la planta hasta la vigilancia posterior.</p><p>Caso. Una empresa colombiana quiere importar desde España un producto terminado en comprimidos de raíz de valeriana y flor de pasiflora, autorizado allí como medicamento tradicional a base de plantas, y comercializarlo bajo su marca como PFTI.</p><p>Desarrollo paso a paso.<br>1. Clasificación: verificar que ambas plantas, la parte usada y su asociación figuren en el Listado de plantas medicinales aceptadas con fines terapéuticos para la categoría de uso tradicional, con el mismo uso (p. ej., coadyuvante en estados de nerviosismo o trastornos leves del sueño). Si la asociación no está aceptada, primero se solicita evaluación de inclusión (arts. 6, 8 y 9 del Decreto 1156): uso documentado de al menos cuatro décadas, tres referencias documentales, ausencia de toxicidad y sinergia o complementariedad del uso; el INVIMA tiene tres meses para emitir concepto.<br>2. Documentación legal (art. 24): autorización del producto en el país de origen, certificado de BPM del fabricante, autorización del titular extranjero, Certificado de Venta Libre, certificado de marca y documentos de existencia del importador; documentos extranjeros con menos de un año de expedición y apostillados o legalizados.<br>3. Documentación farmacéutica: fórmula cualicuantitativa, clasificación botánica de un herbario listado en el Index Herbariorum, especificaciones y certificados de materias primas y producto terminado, control de contaminantes, estabilidad que soporte la vida útil (máx. 2 años, hasta 4 con envejecimiento natural) y artes de etiqueta. Si se importara a granel para envasar en Colombia, se requiere estabilidad local de al menos dos lotes industriales.<br>4. Trámite: registro automático (arts. 25-26) en la Oficina Virtual del INVIMA con pago de la tarifa vigente; el registro se expide con prefijo PFTI y vigencia de 10 años (art. 14), sujeto a revisión posterior con requerimiento que debe atenderse en el plazo fijado.<br>5. Importación: visto bueno del INVIMA para materias primas cuando aplique (art. 38).<br>6. Postregistro: etiquetado en castellano con nombre científico en latín; publicidad bajo Res. 1896/2023; programa de farmacovigilancia según Res. 2024015321 (reporte de eventos serios en 15 días calendario, no serios en 90, reporte trimestral \"sin eventos\"); seguimiento de alertas internacionales de la AEMPS o la EMA.<br>7. Renovación: planear con al menos un año de anticipación la renovación a los 10 años; si se mantiene la información aprobada, el producto sigue en el listado, hay estabilidad y BPM vigente y CVL, procede la renovación automática (art. 27).</p><p>Puntos clave:<br>1. El listado de plantas es la puerta de entrada: sin él no hay registro automático.<br>2. El PFTI exige soporte del país de origen (autorización, CVL, BPM, herbario Index Herbariorum).<br>3. El ciclo se cierra con fitovigilancia y una renovación planificada antes del vencimiento.</p>"}'::jsonb);

END
$curso$;

-- ─── 15. Curso de Regulación de Medicamentos Homeopáticos (35 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Regulación de Medicamentos Homeopáticos' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Regulación de Medicamentos Homeopáticos', 'Curso especializado sobre el régimen colombiano de medicamentos homeopáticos: Decreto 3554 de 2004 y sus modificaciones, Decreto 1737 de 2005, BPM homeopáticas, registro sanitario, etiquetado y publicidad. Incluye la comparación con la UE, EE. UU. y Latinoamérica, y un módulo sobre evidencia científica y comunicación responsable.', '<p>Curso especializado sobre el régimen colombiano de medicamentos homeopáticos: Decreto 3554 de 2004 y sus modificaciones, Decreto 1737 de 2005, BPM homeopáticas, registro sanitario, etiquetado y publicidad. Incluye la comparación con la UE, EE. UU. y Latinoamérica, y un módulo sobre evidencia científica y comunicación responsable.</p><h3>Objetivo general</h3><p>Que el químico farmacéutico clasifique, registre, mantenga y comunique medicamentos homeopáticos en Colombia conforme a la normativa vigente (Decretos 3554/2004, 1737/2005, 1861/2006, 334/2022 y 1474/2023; Resoluciones 4594/2007, 3665/2009 y 1896/2023), con criterio técnico y ético.</p><h3>A quién va dirigido</h3><p>Químicos farmacéuticos y profesionales de asuntos regulatorios, calidad, dirección técnica de farmacias homeopáticas y mercadeo de laboratorios homeopáticos en Colombia.</p><h3>Contexto normativo</h3><p>Colombia — normativa INVIMA / MinSalud</p>',
          'Asuntos regulatorios — productos especiales', 'intermedio', 'Que el químico farmacéutico clasifique, registre, mantenga y comunique medicamentos homeopáticos en Colombia conforme a la normativa vigente (Decretos 3554/2004, 1737/2005, 1861/2006, 334/2022 y 1474/2023; Resoluciones 4594/2007, 3665/2009 y 1896/2023), con criterio técnico y ético.', 'Químicos farmacéuticos y profesionales de asuntos regulatorios, calidad, dirección técnica de farmacias homeopáticas y mercadeo de laboratorios homeopáticos en Colombia.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Fundamentos y marco normativo de los medicamentos homeopáticos en Colombia', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: qué hace distinto a un medicamento homeopático ante el INVIMA', 'Clase 1 · Introducción al curso', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Presenta el alcance del curso, el mapa normativo de los homeopáticos y las competencias que el QF adquirirá para gestionar su registro, calidad y comunicación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/decreto-3554-2004-medicamentos-homeopaticos","title":"[Página web] Decreto 3554 de 2004: Régimen de Registro Sanitario y Control de Medicamentos Homeopáticos","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_3554_2004.htm","title":"[Página web] Decreto 3554 de 2004 – Régimen de registro sanitario, vigilancia y control sanitario de los medicamentos homeopáticos para uso humano (compilación con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Decreto 3554 de 2004 y su modificación por el Decreto 1861 de 2006', 'Clase 2 · Marco normativo colombiano y su evolución', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Identifica el objeto, la estructura y los artículos clave del régimen homeopático y los cambios introducidos en 2006 (venta libre, indicación terapéutica, utilidad terapéutica, registro simplificado).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_3554_2004.htm","title":"[Página web] Decreto 3554 de 2004 – Régimen de registro sanitario, vigilancia y control sanitario de los medicamentos homeopáticos para uso humano (compilación con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1861_2006.htm","title":"[Página web] Decreto 1861 de 2006 – Por el cual se modifica y adiciona el Decreto 3554 de 2004","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/biblioteca/decreto_3554_2004pdf","title":"Decreto 3554 de 2004 (PDF)","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Decreto 1737 de 2005 y Decreto 4664 de 2006: magistrales, oficinales y farmacias homeopáticas', 'Clase 2 · Marco normativo colombiano y su evolución', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Reconoce qué regula el Decreto 1737/2005, qué derogó del 3554 y la excepción para médicos de medicina alternativa del Decreto 4664/2006.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1737_2005.htm","title":"[Página web] Decreto 1737 de 2005 – Preparación, distribución, dispensación, comercialización, etiquetado, rotulado y empaque de medicamentos homeopáticos magistrales y oficinales","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_medicamentos_homeopaticos_fitoterapicos_suplementos/Decreto-1737-de-2005.pdf","title":"Decreto 1737 de 2005 (PDF)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Cómo impactan los Decretos 334 de 2022 y 1474 de 2023 al régimen homeopático', 'Clase 2 · Marco normativo colombiano y su evolución', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta qué artículos del Decreto 3554 derogó el Decreto 334/2022 (modificaciones, publicidad) y cómo el Decreto 1474/2023 establece la vigencia indefinida de los registros homeopáticos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_3554_2004.htm","title":"[Página web] Decreto 3554 de 2004 – Régimen de registro sanitario, vigilancia y control sanitario de los medicamentos homeopáticos para uso humano (compilación con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.asuntoslegales.com.co/analisis/luz-helena-vargas-3212671/los-registros-sanitarios-de-medicamentos-cambian-su-vigencia-a-indefinidos-3712998","title":"[Página web] Los registros sanitarios de medicamentos cambian su vigencia a indefinidos (análisis)","description":"Asuntos Legales (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Homeopático simple, complejo, magistral y oficinal; venta libre y con fórmula; con y sin indicación', 'Clase 3 · Definiciones y clasificación', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las categorías legales de medicamentos homeopáticos y las consecuencias regulatorias de cada una.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_3554_2004.htm","title":"[Página web] Decreto 3554 de 2004 – Régimen de registro sanitario, vigilancia y control sanitario de los medicamentos homeopáticos para uso humano (compilación con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1861_2006.htm","title":"[Página web] Decreto 1861 de 2006 – Por el cual se modifica y adiciona el Decreto 3554 de 2004","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1737_2005.htm","title":"[Página web] Decreto 1737 de 2005 – Preparación, distribución, dispensación, comercialización, etiquetado, rotulado y empaque de medicamentos homeopáticos magistrales y oficinales","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Cepas, tinturas madre y escalas de dilución y dinamización (D/X, CH, LM, K)', 'Clase 3 · Definiciones y clasificación', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Comprende qué es una cepa o tintura madre y cómo se expresan las escalas de dilución reconocidas por la norma colombiana.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_3554_2004.htm","title":"[Página web] Decreto 3554 de 2004 – Régimen de registro sanitario, vigilancia y control sanitario de los medicamentos homeopáticos para uso humano (compilación con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: clasificar el portafolio de un laboratorio homeopático', 'Clase 3 · Definiciones y clasificación', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica un árbol de decisión para clasificar productos y asignarles el trámite INVIMA correcto.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: clasificar correctamente un portafolio de productos homeopáticos según el Decreto 3554 de 2004, modificado por el Decreto 1861 de 2006, y el Decreto 1737 de 2005, para definir qué trámite corresponde a cada uno ante el INVIMA.</p><p>Desarrollo: la clasificación es la primera decisión regulatoria y condiciona todo lo demás (tipo de registro, evaluación, etiquetado, condición de venta y canal). Conviene aplicar un árbol de decisión con cuatro preguntas:<br>1) ¿Se fabrica de forma industrial para comercializarse con marca o denominación, o se prepara para un paciente individual? Si es para un paciente con fórmula médica, en una farmacia homeopática autorizada y bajo la dirección de un químico farmacéutico, es un medicamento homeopático magistral; si se prepara en la farmacia según fórmula de farmacopea o de uso frecuente, es oficinal. Magistrales y oficinales NO requieren registro sanitario (Decreto 1737/2005, arts. 10 y 11), pero sí cumplir las condiciones de preparación, vida útil máxima de 18 meses y rotulado.<br>2) Si es industrial, ¿tiene una sola cepa o varias? Una sola cepa o tintura madre = homeopático simple; mezcla de dos o más diluciones de una misma cepa o de cepas distintas = homeopático complejo (definición modificada por el Decreto 1861/2006).<br>3) ¿Declara indicación terapéutica? El Decreto 1861 introdujo las categorías con y sin indicación terapéutica específica y el concepto de utilidad terapéutica. Los productos con indicación requieren concepto de la Sala Especializada de Medicamentos Homeopáticos (SEMH) de la Comisión Revisora; los simples sin indicación pueden ir por el registro simplificado por cepa (codificación MHS), que exige que la etiqueta no lleve indicación terapéutica particular.<br>4) ¿Condición de venta? Venta libre o con fórmula médica, según lo que asigne el INVIMA; los de venta libre llevan la leyenda \"Medicamento homeopático simple/complejo de venta libre\".</p><p>Ejemplo aplicado: un laboratorio con 1) Arnica montana 30 CH glóbulos sin indicación, 2) un complejo de cinco cepas \"para síntomas gripales\", 3) una fórmula que la farmacia homeopática prepara por receta para un paciente, y 4) Calendula tintura madre de uso externo. Clasificación: (1) simple sin indicación → registro simplificado MHS, etiqueta sin indicación; (2) complejo con indicación → registro con evaluación farmacéutica, legal y de utilidad terapéutica por la SEMH; (3) magistral → sin registro, rige el Decreto 1737/2005; (4) simple a partir de tintura madre: verificar que la cepa esté en una farmacopea aceptada (art. 3 del Decreto 3554) y la condición de venta asignada.</p><p>Puntos clave:<br>- La clasificación (simple/complejo, con/sin indicación, magistral/oficinal) define el trámite y la carga de evidencia.<br>- Magistrales y oficinales no tienen registro sanitario, pero sí controles de preparación y rotulado.<br>- Declarar una indicación terapéutica dispara la evaluación de utilidad terapéutica ante la SEMH.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Calidad: farmacopeas, cepas y Buenas Prácticas de Manufactura homeopáticas', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: la calidad como eje del medicamento homeopático', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume por qué la identidad de la cepa, la farmacopea de referencia y las BPM específicas son el núcleo de la evaluación farmacéutica.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/resoluci_c3_b3n_4594_de_2007pdf","title":"Resolución número 4594 de 2007 – Manual de buenas prácticas de manufactura para medicamentos homeopáticos (PDF)","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Farmacopeas homeopáticas aceptadas en Colombia (HAB/GHP, HPUS, francesa, europea y otras)', 'Clase 2 · Farmacopeas homeopáticas y control de calidad de tinturas madre', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Identifica las farmacopeas oficiales del art. 3 del Decreto 3554 y el alcance de sus monografías.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_3554_2004.htm","title":"[Página web] Decreto 3554 de 2004 – Régimen de registro sanitario, vigilancia y control sanitario de los medicamentos homeopáticos para uso humano (compilación con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.hpus.com/document/homeopathic-pharmacopoeia-of-the-united-states/","title":"[Página web] Homœopathic Pharmacopoeia of the United States (HPUS)","description":"HPCUS (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.deutscher-apotheker-verlag.de/en/German-Homoeopathic-Pharmacopoeia-GHP-2025/9783804751033","title":"[Página web] German Homoeopathic Pharmacopoeia (GHP 2025) – edición en inglés de la HAB","description":"Deutscher Apotheker Verlag (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Cepas no farmacopeicas: requisitos del Decreto 1861 de 2006', 'Clase 2 · Farmacopeas homeopáticas y control de calidad de tinturas madre', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los requisitos para cepas o tinturas no incluidas en farmacopeas oficiales y el papel de la Sala Especializada de Medicamentos Homeopáticos (SEMH).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1861_2006.htm","title":"[Página web] Decreto 1861 de 2006 – Por el cual se modifica y adiciona el Decreto 3554 de 2004","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/acta_no_08_-2025_semhpdf","title":"Acta No. 08 de 2025 – Comisión Revisora, Sala Especializada de Medicamentos Homeopáticos (SEMH)","description":"INVIMA – Comisión Revisora (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Control de calidad de tinturas madre, diluciones y producto terminado', 'Clase 2 · Farmacopeas homeopáticas y control de calidad de tinturas madre', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los controles de identidad, pureza y calidad de tinturas madre y diluciones según las farmacopeas y las BPM, incluidos los requisitos de productos parenterales.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://bibliotecadigital.anvisa.gov.br/jspui/bitstream/anvisa/828/1/Farmacopeia%20Homeopatica%203%20ed..pdf","title":"Farmacopeia Homeopática Brasileira, 3.ª edição (en portugués)","description":"ANVISA – Biblioteca Digital (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_4594_2007.htm","title":"[Página web] Resolución 4594 de 2007 – Manual de Buenas Prácticas de Manufactura para Medicamentos Homeopáticos","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Manual de BPM homeopáticas: Resolución 4594 de 2007', 'Clase 3 · Buenas Prácticas de Manufactura de medicamentos homeopáticos', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Recorre los capítulos del manual BPM homeopático y sus diferencias con las BPM generales de medicamentos (Res. 1160/2016).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_4594_2007.htm","title":"[Página web] Resolución 4594 de 2007 – Manual de Buenas Prácticas de Manufactura para Medicamentos Homeopáticos","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/resoluci_c3_b3n_4594_de_2007pdf","title":"Resolución número 4594 de 2007 – Manual de buenas prácticas de manufactura para medicamentos homeopáticos (PDF)","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Certificación BPM: guía de verificación (Res. 3665/2009) y clasificación de no conformidades', 'Clase 3 · Buenas Prácticas de Manufactura de medicamentos homeopáticos', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el proceso de certificación BPM homeopática ante el INVIMA, la vigencia del certificado y cómo se clasifican los hallazgos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minproteccion_3665_2009.htm","title":"[Página web] Resolución 3665 de 2009 – Guía de verificación de cumplimiento de BPM de medicamentos homeopáticos","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: preparar la visita de certificación BPM de un laboratorio homeopático', 'Clase 3 · Buenas Prácticas de Manufactura de medicamentos homeopáticos', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Planifica una autoinspección y un plan de acción ante hallazgos típicos de producción homeopática.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: preparar a un laboratorio farmacéutico homeopático para la visita de certificación de Buenas Prácticas de Manufactura (BPM) del INVIMA, usando la Resolución 4594 de 2007 (manual BPM para medicamentos homeopáticos), la Resolución 3665 de 2009 (guía de verificación) y la guía de clasificación de no conformidades del INVIMA (2022).</p><p>Desarrollo: para los homeopáticos, el referente de BPM no es la Resolución 1160 de 2016 (BPM general de medicamentos), sino el manual específico de la Res. 4594/2007, verificado con la guía adoptada por la Res. 3665/2009. El certificado tiene vigencia de cinco años y el INVIMA puede inspeccionar al menos una vez al año. La preparación se organiza en cinco pasos:<br>1) Autoinspección completa con la guía de verificación de la Res. 3665/2009, capítulo por capítulo: garantía de calidad, personal, saneamiento, instalaciones, equipos y sistemas de apoyo crítico (agua, aire), producción, control de calidad, almacenamiento, documentación, reclamos y retiros.<br>2) Clasificación de hallazgos como críticos, mayores o menores, con los ejemplos de la guía INVIMA de 2022, para priorizar el plan de acción.<br>3) Foco en riesgos propios del homeopático: evaluación de proveedores de cepas y tinturas madre; áreas independientes con captación de polvo para secado y molienda de material vegetal; trazabilidad de cada paso de dilución y sucusión (dinamización); identificación y separación de potencias para evitar confusiones; limpieza validada entre cepas; y producción según las técnicas de la farmacopea oficial declarada.<br>4) Expediente documental: procedimientos, registros de lote, certificados de análisis de tinturas madre, programa de estabilidad y control de cambios.<br>5) Logística de la visita: radicación por la Oficina Virtual, pago de la tarifa vigente en UVB, designación de acompañantes y sala documental.</p><p>Ejemplo aplicado: en la autoinspección se detecta que los frascos de dilución intermedia 6 CH y 12 CH de Belladonna se rotulan a mano y sin fecha. Según la guía, una falla que puede llevar a mezclas o errores de potencia en una cepa de posible toxicidad se trataría como mayor, o incluso crítica. Acción: rótulos preimpresos con cepa, potencia, lote, fecha y responsable; verificación por segunda persona y registro en la orden de producción.</p><p>Puntos clave:<br>- BPM homeopáticas: Res. 4594/2007 (manual) + Res. 3665/2009 (guía de verificación); certificado de 5 años.<br>- Los riesgos críticos son la identidad de cepas y potencias, la contaminación cruzada y la calidad de las tinturas madre.<br>- Usar la guía de no conformidades del INVIMA para autoclasificar y priorizar antes de la visita.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Registro sanitario de medicamentos homeopáticos', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: rutas de registro homeopático ante el INVIMA', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume las modalidades de registro, las evaluaciones exigidas y los canales de radicación vigentes.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/tramites-y-servicios/requisitos-tramites","title":"[Página web] Requisitos de trámites INVIMA","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/tramites-y-servicios/tarifas","title":"[Página web] Tarifas INVIMA","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Modalidades de registro y evaluación farmacéutica y legal', 'Clase 2 · Evaluaciones y tipos de registro', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las modalidades (fabricar y vender, importar y vender, importar-acondicionar-vender, fabricar y exportar) y el contenido de las evaluaciones farmacéutica y legal.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_3554_2004.htm","title":"[Página web] Decreto 3554 de 2004 – Régimen de registro sanitario, vigilancia y control sanitario de los medicamentos homeopáticos para uso humano (compilación con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1861_2006.htm","title":"[Página web] Decreto 1861 de 2006 – Por el cual se modifica y adiciona el Decreto 3554 de 2004","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Evaluación de utilidad terapéutica y la Sala Especializada de Medicamentos Homeopáticos', 'Clase 2 · Evaluaciones y tipos de registro', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los criterios de utilidad terapéutica (art. 24, Dec. 1861) y cómo leer las actas de la SEMH para anticipar requerimientos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/acta_no_08_-2025_semhpdf","title":"Acta No. 08 de 2025 – Comisión Revisora, Sala Especializada de Medicamentos Homeopáticos (SEMH)","description":"INVIMA – Comisión Revisora (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/acta_20no_2003_20-_202024_20semhpdf","title":"Acta No. 03 de 2024 – Sala Especializada de Medicamentos Homeopáticos","description":"INVIMA – Comisión Revisora (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1861_2006.htm","title":"[Página web] Decreto 1861 de 2006 – Por el cual se modifica y adiciona el Decreto 3554 de 2004","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Registro simplificado por cepa (MHS) para homeopáticos simples sin indicación', 'Clase 2 · Evaluaciones y tipos de registro', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Comprende la agrupación de diluciones de una misma cepa bajo un solo registro y sus restricciones de etiquetado.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1861_2006.htm","title":"[Página web] Decreto 1861 de 2006 – Por el cual se modifica y adiciona el Decreto 3554 de 2004","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Vigencia indefinida (Decreto 1474 de 2023) y archivo de renovaciones', 'Clase 3 · Ciclo de vida del registro', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el paso de la vigencia de 10 años (art. 23, Dec. 3554) a la vigencia indefinida y sus efectos sobre solicitudes de renovación en curso.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/resoluci_c3_b3n_no_2025002473__del_23_de_enero_de_2025_13pdf","title":"Resolución 2025002473 de 2025 – Por la cual se ordena el archivo de solicitudes relacionadas con renovaciones de registros sanitarios","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Modificaciones al registro homeopático por nivel de riesgo', 'Clase 3 · Ciclo de vida del registro', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica la guía INVIMA de modificaciones de homeopáticos (riesgo menor, moderado y mayor; seguridad y eficacia) y el formato ACOM-FOR78.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/acom-for78docx","title":"[Página web] ACOM-FOR78 – Presentación de modificaciones de seguridad y eficacia al registro sanitario de medicamentos homeopáticos","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: registro de un homeopático complejo importado con indicación terapéutica', 'Clase 3 · Ciclo de vida del registro', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la ruta completa de un registro, desde la preevaluación de cepas hasta la respuesta a un requerimiento de la SEMH.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: recorrer de principio a fin la solicitud de registro sanitario de un medicamento homeopático complejo con indicación terapéutica, en la modalidad \"importar y vender\", identificando las evaluaciones y los puntos de control del INVIMA.</p><p>Desarrollo: el Decreto 3554 de 2004 exige registro sanitario para fabricar, importar, exportar, envasar y comercializar homeopáticos industriales (art. 15). Prevé modalidades como fabricar y vender; importar y vender; importar, acondicionar y vender (adicionada por el Decreto 1861/2006); y fabricar y exportar. Todo registro requiere evaluación farmacéutica y legal; los complejos y los que declaran indicación requieren además evaluación de utilidad terapéutica por la Sala Especializada de Medicamentos Homeopáticos (SEMH).<br>Ruta sugerida:<br>1) Preevaluación: confirmar que cada cepa y su dilución estén en una farmacopea aceptada (art. 3: alemana, estadounidense, francesa, británica, mexicana, brasileña, europea, italiana). Si alguna no lo está, aplicar las reglas de cepas no farmacopeicas del Decreto 1861 (arts. 21–22).<br>2) Paquete legal: poder, certificado de existencia y representación, autorización del fabricante, certificado BPM del fabricante extranjero (o el de su autoridad de origen, según el Decreto 1861) y certificado de venta libre, según los requisitos vigentes.<br>3) Paquete farmacéutico: fórmula cuali-cuantitativa con nomenclatura latina y escala de dilución (D/X, CH, LM, K); método de preparación por farmacopea; especificaciones y certificados de análisis de producto y tinturas madre; estudios de estabilidad que soporten la vida útil (máximo 5 años); y artes de etiqueta en castellano, con cepas en latín.<br>4) Utilidad terapéutica: dossier de soporte bibliográfico (materia médica, uso tradicional, literatura) según la tabla de criterios del art. 24 del Decreto 1861, para concepto de la SEMH.<br>5) Radicación por la Oficina Virtual con pago en UVB; seguimiento y respuesta de autos de requerimiento.<br>6) Resultado: registro con prefijo MH y, según el Decreto 1474 de 2023, vigencia indefinida. El titular no renueva, pero sí debe mantener actualizadas las modificaciones (guía INVIMA de modificaciones de homeopáticos).</p><p>Ejemplo aplicado: un complejo importado de Alemania de seis cepas en gotas, \"coadyuvante en síntomas de resfriado\". La SEMH solicita sustentar la indicación y la seguridad de una cepa vegetal en baja dilución. El equipo responde con monografías HAB/GHP, el límite de primera dilución permitida y la literatura de uso. Si la SEMH no acepta la indicación, la estrategia alternativa es redefinir el producto sin indicación terapéutica específica, con el impacto que eso tiene en etiquetado y publicidad.</p><p>Puntos clave:<br>- Simple sin indicación → vía simplificada (MHS); complejo o con indicación → además, utilidad terapéutica ante la SEMH.<br>- La farmacopea de referencia de cada cepa es el eje de la evaluación farmacéutica.<br>- Tras el Decreto 1474/2023 el registro no vence, pero la gestión de modificaciones sigue siendo obligatoria.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Etiquetado, publicidad, farmacias homeopáticas y farmacovigilancia', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: del registro al punto de venta', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume las reglas que rigen el producto en el mercado: etiquetas, publicidad, canales de distribución y vigilancia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_1896_2023.htm","title":"[Página web] Resolución 1896 de 2023 – Información no publicitaria, promoción, publicidad y comercialización de medicamentos (incluye homeopáticos)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Etiquetado de medicamentos homeopáticos: contenido, idioma, nombres y prohibiciones', 'Clase 2 · Etiquetado y publicidad', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los requisitos de etiqueta (arts. 41–47 del Dec. 3554 y art. 25 del Dec. 1861), incluidos los casos en que no se permiten indicaciones terapéuticas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_3554_2004.htm","title":"[Página web] Decreto 3554 de 2004 – Régimen de registro sanitario, vigilancia y control sanitario de los medicamentos homeopáticos para uso humano (compilación con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1861_2006.htm","title":"[Página web] Decreto 1861 de 2006 – Por el cual se modifica y adiciona el Decreto 3554 de 2004","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Publicidad de homeopáticos bajo la Resolución 1896 de 2023', 'Clase 2 · Etiquetado y publicidad', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta cómo se aplica la Resolución 1896/2023 a los homeopáticos de venta libre (información previa al INVIMA, leyendas, veracidad) tras la derogatoria de los arts. 48–49 del Dec. 3554.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_1896_2023.htm","title":"[Página web] Resolución 1896 de 2023 – Información no publicitaria, promoción, publicidad y comercialización de medicamentos (incluye homeopáticos)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: revisión de etiqueta y pieza publicitaria de un homeopático de venta libre', 'Clase 2 · Etiquetado y publicidad', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Detecta y corrige incumplimientos en un arte de etiqueta y en un post de redes sociales.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: revisar el arte de etiqueta y una pieza publicitaria de un medicamento homeopático de venta libre, verificando su conformidad con el Decreto 3554/2004 (arts. 41–47), el Decreto 1861/2006 (art. 25) y la Resolución 1896 de 2023.</p><p>Desarrollo: en etiquetado y publicidad confluyen dos marcos. El primero es el específico: las etiquetas van en castellano, con el nombre de las cepas o tinturas en latín (art. 41). Deben incluir denominación, composición con nomenclatura latina y escala de dilución, lote, vencimiento, número de registro, vía de administración y las leyendas \"Medicamento Homeopático\" y \"Manténgase fuera del alcance de los niños\", además de la condición de venta (art. 43). Si es de venta libre, deben decir \"Medicamento homeopático simple/complejo de venta libre\", con indicación y posología aprobadas (Decreto 1861, art. 25). Los productos con registro simplificado o importados sin indicación no pueden incluir indicaciones ni propiedades terapéuticas (art. 21 b y art. 44, par. 2). Los nombres comerciales se permiten solo en complejos (art. 46) y se prohíben denominaciones que induzcan a engaño, sugieran acción farmacológica o usen términos como \"tónico\", \"súper\" o \"doctor\" (art. 47).<br>El segundo marco es la publicidad. Los artículos 48 y 49 del Decreto 3554 fueron derogados por el Decreto 334 de 2022. Hoy rige la Resolución 1896 de 2023, que incluye expresamente a los homeopáticos. En los de venta libre, la publicidad puede ir en medios masivos, se informa previamente al INVIMA y no requiere aprobación previa, pues el control es posterior. Debe ser objetiva y veraz, ceñirse a las indicaciones aprobadas en el registro e incluir las leyendas obligatorias.</p><p>Ejemplo aplicado: un complejo de venta libre con registro e indicación aprobada \"alivio de síntomas de estrés leve\". Hallazgos en la revisión: (a) el arte dice \"Relax Súper Homeopático\"; \"Súper\" está prohibido por el art. 47; (b) la composición omite la escala de dilución de dos cepas; (c) el post de redes dice \"cura la ansiedad sin efectos secundarios\", lo que excede la indicación aprobada, sugiere curación y hace una afirmación absoluta de seguridad; (d) falta la leyenda \"Si los síntomas persisten, consultar al médico\". Correcciones: renombrar; completar las cepas en latín con su potencia (p. ej. Passiflora incarnata 6 CH); reformular el mensaje a \"Medicamento homeopático indicado para el alivio de síntomas de estrés leve\", e incluir las leyendas e informar la pieza al INVIMA antes de difundirla.</p><p>Puntos clave:<br>- La etiqueta debe reflejar exactamente el registro: cepas en latín, potencias, condición de venta e indicación solo si fue aprobada.<br>- Publicidad: Resolución 1896/2023 (se informa previamente y el INVIMA controla después en venta libre); los arts. 48–49 del Decreto 3554 ya no rigen.<br>- Nunca prometer curación ni \"cero efectos\": es el error más frecuente en marketing de homeopáticos.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Farmacias homeopáticas Nivel I y II, magistrales y oficinales', 'Clase 3 · Farmacias homeopáticas, laboratorios y farmacovigilancia', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las condiciones de preparación, vida útil, rotulado y dispensación del Decreto 1737/2005 y los canales de venta de homeopáticos registrados.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1737_2005.htm","title":"[Página web] Decreto 1737 de 2005 – Preparación, distribución, dispensación, comercialización, etiquetado, rotulado y empaque de medicamentos homeopáticos magistrales y oficinales","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_medicamentos_homeopaticos_fitoterapicos_suplementos/Decreto-1737-de-2005.pdf","title":"Decreto 1737 de 2005 (PDF)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Farmacovigilancia de medicamentos homeopáticos', 'Clase 3 · Farmacias homeopáticas, laboratorios y farmacovigilancia', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Comprende la obligación de los titulares de mantener programas de farmacovigilancia (art. 27, Dec. 1861) y la compara con el enfoque de la UE.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/sites/default/files/medicamentos-y-productos-biologicos/farmacovigilancia/Decreto-1861-de-2006.pdf","title":"Decreto 1861 de 2006 (PDF, sitio de farmacovigilancia INVIMA)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ema.europa.eu/documents/regulatory-procedural-guideline/traditional-herbal-medicinal-products-simplified-registrations-homeopathic-medicinal-products_en.pdf","title":"Traditional herbal medicinal products and simplified registrations for homeopathic medicinal products: pharmacovigilance requirements and EudraVigilance access (EMA/80556/2017)","description":"European Medicines Agency (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: una farmacia Nivel II quiere escalar un oficinal con marca propia', 'Clase 3 · Farmacias homeopáticas, laboratorios y farmacovigilancia', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica los límites del Decreto 1737/2005 y decide cuándo un producto debe pasar al régimen de registro.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar el Decreto 1737 de 2005 a la operación de una farmacia homeopática Nivel II que prepara un medicamento homeopático oficinal y dispensa magistrales.</p><p>Desarrollo: el Decreto 1737/2005 reglamenta la preparación, distribución, dispensación, comercialización, etiquetado, rotulado y empaque de los homeopáticos magistrales y oficinales. Clasifica las farmacias homeopáticas en Nivel I (dispensación y venta al detal) y Nivel II (además, preparación de magistrales y oficinales, con dirección técnica de químico farmacéutico). Reglas operativas clave:<br>- No usar diluciones inferiores a las autorizadas en las farmacopeas oficiales; controlar la calidad de cepas, tinturas madre, diluciones base y excipientes (art. 3).<br>- El código de preparación oficinal se asigna solo si el volumen no supera 30 unidades comerciales (art. 3).<br>- Vida útil máxima de 18 meses desde la preparación, si se cumplen las Buenas Prácticas de Preparación (art. 4).<br>- Fórmulas con nomenclatura latina o científica internacional, dilución y forma farmacéutica (art. 5). Las formas deben ser no estériles y sin nombre comercial o de marca (art. 6).<br>- Los magistrales requieren fórmula médica; los oficinales también, salvo que puedan venderse sin prescripción (arts. 10–11). Ninguno de los dos requiere registro sanitario.<br>- Está prohibido adulterar fórmulas o despacharlas en clave; cualquier sustitución requiere autorización del médico prescriptor (art. 17).<br>- Por el Decreto 4664 de 2006 (que adicionó el parágrafo 2 del art. 3), los médicos de servicios habilitados en medicina alternativa pueden elaborar y dispensar magistrales u oficinales, solo a sus propios pacientes.<br>- La inspección, vigilancia y control corresponden al INVIMA, en coordinación con las secretarías departamentales y distritales de salud (art. 19).<br>Además, los homeopáticos industriales con registro sanitario pueden distribuirse en farmacias homeopáticas, farmacias-droguerías, droguerías y tiendas naturistas, entre otros (art. 9, modificado por el Decreto 1229/2015).</p><p>Ejemplo aplicado: la farmacia quiere producir 200 frascos de un oficinal \"Arnica 9 CH glóbulos\" para venderlos en cadena con una marca propia. Análisis: (1) 200 unidades exceden el tope de 30 unidades comerciales del oficinal; (2) no puede llevar nombre comercial; (3) venderlo con marca en otros canales lo convierte en un producto industrial que requiere registro sanitario y fabricación en un laboratorio con certificado BPM homeopático. Alternativas: mantener el oficinal dentro del tope y dispensarlo en la propia farmacia, o tramitar un registro simplificado a través de un laboratorio certificado.</p><p>Puntos clave:<br>- Magistral = paciente individual con receta; oficinal = fórmula de farmacopea en lotes pequeños (máximo 30 unidades).<br>- Sin registro, pero con vida útil máxima de 18 meses, rotulado completo y dirección de químico farmacéutico en Nivel II.<br>- Escalar volumen o poner marca lleva el producto al régimen de registro del Decreto 3554.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Contexto internacional, debate científico y comunicación responsable', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: la homeopatía entre la regulación y la evidencia', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume por qué los reguladores tratan a los homeopáticos de forma especial y cuál es la posición de la comunidad científica.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://easac.eu/media-room/press-releases/details/homeopathy-harmful-or-helpful-european-scientists-recommend-an-evidence-based-approach/","title":"[Página web] Homeopathy: harmful or helpful? European scientists recommend an evidence-based approach (2017)","description":"EASAC (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Unión Europea: Directiva 2001/83/CE y registro simplificado (arts. 13–16)', 'Clase 2 · Regulación internacional comparada', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara el registro simplificado europeo (vía oral o externa, sin indicación, dilución ≥ 1:10.000) con el régimen colombiano.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.legislation.gov.uk/eudr/2001/83/title/III/chapter/2","title":"[Página web] Directiva 2001/83/CE – Título III, Capítulo 2: Disposiciones específicas para medicamentos homeopáticos (arts. 13–16)","description":"legislation.gov.uk (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://medicinesauthority.gov.mt/homeopathicmedicinalproducts","title":"[Página web] Homeopathic Medicinal Products – Simplified registration procedure","description":"Malta Medicines Authority (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.ema.europa.eu/en/documents/report/report-emea-workshop-homeopathic-medicinal-products_en.pdf","title":"Report of the EMEA workshop on homeopathic medicinal products","description":"European Medicines Agency (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Estados Unidos: HPUS y política de cumplimiento de la FDA (guía de 2022)', 'Clase 2 · Regulación internacional comparada', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el papel de la HPUS como compendio oficial y el enfoque de la FDA basado en riesgo para homeopáticos no aprobados.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.fda.gov/regulatory-information/search-fda-guidance-documents/homeopathic-drug-products-guidance-fda-staff-and-industry","title":"[Página web] Homeopathic Drug Products – Guidance for FDA Staff and Industry (dic. 2022)","description":"U.S. FDA (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.hpus.com/document/homeopathic-pharmacopoeia-of-the-united-states/","title":"[Página web] Homœopathic Pharmacopoeia of the United States (HPUS)","description":"HPCUS (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.thefdalawblog.com/2022/12/fda-finalizes-guidance-re-enforcement-policy-for-homeopathic-drugs/","title":"[Página web] FDA Finalizes Guidance Re Enforcement Policy for Homeopathic Drugs","description":"FDA Law Blog (Hyman, Phelps & McNamara) (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Latinoamérica: referentes regulatorios (Uruguay, El Salvador)', 'Clase 2 · Regulación internacional comparada', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara requisitos de registro homeopático en otros países de la región con los de Colombia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.impo.com.uy/bases/decretos/404-2016","title":"[Página web] Decreto 404/016 – Aprobación del marco regulatorio de los medicamentos homeopáticos (Uruguay)","description":"IMPO Uruguay (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Qué dice la evidencia: EASAC, Real Academia Nacional de Farmacia y AEMPS (2026)', 'Clase 3 · Debate científico y comunicación responsable', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume las conclusiones de organismos científicos y reguladores sobre la eficacia de la homeopatía y los riesgos de sustituir tratamientos eficaces.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.redaccionmedica.com/politica/sanidad-hoy/20260422/asi-no-funciona-la-homeopatia-senalada-por-sanidad/261219_0.html","title":"[Página web] Así (no) funciona la homeopatía señalada por Sanidad (informe AEMPS, abr. 2026)","description":"Redacción Médica (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ranf.com/wp-content/uploads/informes/homeopatiacompleto1.pdf","title":"Posición de la Real Academia Nacional de Farmacia en relación con la situación actual de los medicamentos homeopáticos (2017)","description":"Real Academia Nacional de Farmacia (España) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://maldita.es/malditaciencia/20250410/no-la-homeopatia-no-funciona-mas-alla-del-placebo/","title":"[Página web] No, la homeopatía no funciona (más allá del placebo)","description":"Maldita Ciencia (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Comunicación responsable del QF y del área de mercadeo', 'Clase 3 · Debate científico y comunicación responsable', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta cómo comunicar un homeopático sin inducir a error: límites de la indicación aprobada, transparencia y rol educativo del farmacéutico.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://easac.eu/media-room/press-releases/details/homeopathy-harmful-or-helpful-european-scientists-recommend-an-evidence-based-approach/","title":"[Página web] Homeopathy: harmful or helpful? European scientists recommend an evidence-based approach (2017)","description":"EASAC (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_1896_2023.htm","title":"[Página web] Resolución 1896 de 2023 – Información no publicitaria, promoción, publicidad y comercialización de medicamentos (incluye homeopáticos)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.consumer.es/salud/atencion-sanitaria/la-polemica-regulacion-de-los-medicamentos-homeopaticos.html","title":"[Página web] La polémica regulación de los medicamentos homeopáticos","description":"Consumer (Eroski) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso integrador: dictamen regulatorio y de comunicación para lanzar una línea homeopática', 'Clase 3 · Debate científico y comunicación responsable', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Elabora un dictamen que integra clasificación, calidad, registro, ciclo de vida, publicidad y comunicación responsable.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: integrar lo aprendido en un dictamen regulatorio y de comunicación para lanzar en Colombia una línea homeopática importada, con una estrategia de mensajes responsable y defendible ante el INVIMA y ante la comunidad científica.</p><p>Desarrollo: el dictamen debe responder seis preguntas:<br>1) Clasificación de cada referencia: simple o complejo, con o sin indicación, condición de venta.<br>2) Calidad: ¿cada cepa está en una farmacopea aceptada (art. 3, Dec. 3554)? ¿El fabricante tiene BPM homeopáticas certificadas o, para extranjeros, la certificación de su autoridad que acepta el Decreto 1861?<br>3) Ruta de registro: simplificado (MHS) frente a registro con utilidad terapéutica ante la SEMH; tiempos, tarifas en UVB y riesgo de requerimientos.<br>4) Ciclo de vida: vigencia indefinida (Dec. 1474/2023), modificaciones por nivel de riesgo (guía INVIMA) y farmacovigilancia obligatoria (Dec. 1861, art. 27).<br>5) Etiquetado y publicidad: arts. 41–47 del Dec. 3554 y Res. 1896/2023.<br>6) Comunicación responsable: cómo informar sin inducir a error, considerando el consenso científico.<br>Sobre este último punto, el contexto pesa. Organismos como EASAC (2017), la Real Academia Nacional de Farmacia de España (2017) y la AEMPS (informe de abril de 2026) concluyen que no hay evidencia sólida de eficacia más allá del placebo. Alertan además del riesgo de que los pacientes abandonen tratamientos eficaces. Un registro sanitario acredita calidad y seguridad conforme a la norma, y la indicación aprobada delimita lo que se puede decir; no equivale a una demostración de eficacia comparable a la de un medicamento de síntesis.</p><p>Ejemplo aplicado: la marca propone el claim \"La alternativa natural y segura a los antibióticos para tu familia\". Dictamen: rechazado. Sugiere sustituir un tratamiento con eficacia demostrada (riesgo sanitario), excede cualquier indicación homeopática aprobada, hace una afirmación absoluta de seguridad y contraviene los principios de objetividad y veracidad de la Res. 1896/2023. Alternativa: \"Medicamento homeopático [indicación aprobada textual]. Si los síntomas persisten, consulte a su médico\". Para la fuerza de ventas, un argumentario centrado en calidad (farmacopea, BPM, trazabilidad) y en la indicación aprobada, con instrucciones expresas de no desaconsejar tratamientos médicos. Además, un protocolo para reportar eventos adversos al programa de farmacovigilancia.</p><p>Puntos clave:<br>- El dictamen une regulación (clasificación, calidad, registro, ciclo de vida) y comunicación.<br>- Lo que se comunica debe limitarse a la indicación aprobada; nunca debe presentar el producto como sustituto de terapias con eficacia demostrada.<br>- El químico farmacéutico debe conocer el debate científico para asesorar con honestidad a pacientes, médicos y equipos comerciales.</p>"}'::jsonb);

END
$curso$;

-- ─── 16. Curso de Registro Sanitario de Suplementos Dietarios (32 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Registro Sanitario de Suplementos Dietarios' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Registro Sanitario de Suplementos Dietarios', 'Curso especializado en el régimen colombiano de suplementos dietarios: definición y fronteras de la categoría, composición y niveles máximos, registro sanitario SD ante el INVIMA, BPM, importación, rotulado, declaraciones y publicidad. Incluye vigilancia de productos fraudulentos, comparación con FDA/DSHEA y Latinoamérica, y casos prácticos con trámites reales.', '<p>Curso especializado en el régimen colombiano de suplementos dietarios: definición y fronteras de la categoría, composición y niveles máximos, registro sanitario SD ante el INVIMA, BPM, importación, rotulado, declaraciones y publicidad. Incluye vigilancia de productos fraudulentos, comparación con FDA/DSHEA y Latinoamérica, y casos prácticos con trámites reales.</p><h3>Objetivo general</h3><p>Capacitar al Químico Farmacéutico para clasificar, formular, registrar, rotular, publicitar e importar suplementos dietarios conforme al Decreto 3249 de 2006 y sus modificaciones (Decretos 3863 de 2008 y 272 de 2009, Resolución 3096 de 2007), y para prevenir riesgos frente a productos fraudulentos y cambios normativos en curso.</p><h3>A quién va dirigido</h3><p>Químicos Farmacéuticos y profesionales de asuntos regulatorios, calidad, dirección técnica y mercadeo de laboratorios, importadores, comercializadoras y droguerías en Colombia.</p><h3>Contexto normativo</h3><p>Colombia — normativa INVIMA / MinSalud</p>',
          'Asuntos regulatorios — productos especiales', 'intermedio', 'Capacitar al Químico Farmacéutico para clasificar, formular, registrar, rotular, publicitar e importar suplementos dietarios conforme al Decreto 3249 de 2006 y sus modificaciones (Decretos 3863 de 2008 y 272 de 2009, Resolución 3096 de 2007), y para prevenir riesgos frente a productos fraudulentos y cambios normativos en curso.', 'Químicos Farmacéuticos y profesionales de asuntos regulatorios, calidad, dirección técnica y mercadeo de laboratorios, importadores, comercializadoras y droguerías en Colombia.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Fundamentos: qué es un suplemento dietario y su marco normativo', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: suplementos dietarios en Colombia', 'Clase 1 · Introducción al curso', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Recorre el alcance del curso, el mercado de suplementos y por qué el QF regulatorio es clave frente al auge de productos fraudulentos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=fqeR_OYLYjA","provider":"youtube","videoId":"fqeR_OYLYjA","title":"Mitos y verdades sobre los suplementos dietarios","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/decreto-3249-2006-suplementos-dietarios","title":"[Página web] Decreto 3249 de 2006: Regulación de suplementos dietarios en Colombia","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Definición legal de suplemento dietario', 'Clase 2 · Definición y fronteras de la categoría', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la definición del art. 2 del Decreto 3249 de 2006 y la condición negativa añadida por el Decreto 3863 de 2008.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_3863_2008.htm","title":"[Página web] Decreto 3863 de 2008 – Por el cual se modifica el Decreto 3249 de 2006","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/circular_invima_0352_2006.htm","title":"[Página web] Circular 352 de 2006 INVIMA – Expedición del Decreto 3249 (suplementos dietarios)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Frontera con alimentos, medicamentos y fitoterapéuticos', 'Clase 2 · Definición y fronteras de la categoría', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara las categorías con criterios de finalidad, composición, presentación y niveles para elegir la vía de registro.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: distinguir un suplemento dietario de un alimento, un medicamento y un producto fitoterapéutico para elegir la vía de registro correcta ante el INVIMA.</p><p>Desarrollo. El Decreto 3249 de 2006 (art. 2, con el ajuste del Decreto 3863 de 2008) define el suplemento dietario como el producto cuyo propósito es adicionar la dieta normal y que es fuente concentrada de nutrientes y otras sustancias con efecto fisiológico o nutricional. Puede contener vitaminas, minerales, proteínas, aminoácidos, otros nutrientes y derivados de nutrientes, plantas, concentrados y extractos de plantas, solos o combinados. La norma añade una condición negativa: el producto no puede ajustarse a las definiciones de alimento, medicamento, producto fitoterapéutico ni bebida alcohólica, y no puede contener sustancias que representen riesgo (hormonas, antibióticos, estupefacientes, psicotrópicos, entre otras).</p><p>Las fronteras prácticas se analizan con cuatro preguntas: (1) Finalidad declarada: si el producto promete prevenir, tratar, curar o rehabilitar una enfermedad, es un medicamento (Decreto 677 de 1995) o un fitoterapéutico con indicación (Decreto 1156 de 2018), nunca un suplemento. (2) Composición: si el componente principal es una planta con actividad farmacológica y el producto no aporta nutrientes, la Comisión Revisora suele rechazarlo como suplemento (ver Acta 05 de 2008). (3) Forma de presentación y dosis: el suplemento se presenta en formas como cápsulas, tabletas, polvos o líquidos dosificados; un alimento convencional se consume como parte de la dieta sin dosificación y se rige por las normas de alimentos (notificación, permiso o registro sanitario según riesgo). (4) Niveles: si las vitaminas o minerales superan los niveles máximos del Anexo 1, el producto no cabe como suplemento.</p><p>Ejemplo aplicado. Una empresa quiere registrar \"Magnesio + ashwagandha para dormir mejor y tratar el insomnio\". La frase \"tratar el insomnio\" es una indicación terapéutica, prohibida en suplementos (art. 24 mod. Decreto 272 de 2009). Antes de radicar en la Oficina Virtual del INVIMA, el equipo regulatorio debe decidir: (a) reformular la declaración a una de apoyo nutricional aceptada (por ejemplo, función del magnesio en el sistema nervioso) y verificar que la ashwagandha esté en las listas de referencia o pedir su evaluación a la Sala Especializada de Productos Fitoterapéuticos y Suplementos Dietarios; o (b) migrar a la vía fitoterapéutica si se quiere conservar una indicación. Si se radica como suplemento con la indicación, el resultado esperable es un requerimiento o la negación.</p><p>Puntos clave:<br>1. La clasificación se decide por finalidad, composición, presentación y niveles, no por el nombre comercial.<br>2. Una indicación terapéutica saca al producto de la categoría de suplemento dietario.<br>3. Ante duda, se documenta un análisis de frontera y, si es necesario, se consulta a la Comisión Revisora antes de radicar.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Decreto 3249 de 2006 y sus modificaciones (3863/2008, 272/2009, permanencia 2474/2018)', 'Clase 3 · Marco normativo vigente y autoridades', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la arquitectura normativa vigente y el estado del proyecto de nuevo reglamento de MinSalud.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_3249_2006.htm","title":"[Página web] Decreto 3249 de 2006 (texto compilado con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_2474_2018.htm","title":"[Página web] Decreto 2474 de 2018 – Permanencia del reglamento técnico de suplementos dietarios","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.perezllorca.com/es-co/actualidad/boletin/proyecto-de-nueva-regulacion-en-suplementos-dietarios/","title":"[Página web] Proyecto de nueva regulación en suplementos dietarios","description":"Pérez-Llorca (boletín jurídico) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'INVIMA y la Comisión Revisora: la Sala Especializada de Productos Fitoterapéuticos y Suplementos Dietarios', 'Clase 3 · Marco normativo vigente y autoridades', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe quién evalúa ingredientes y declaraciones y qué efecto jurídico tienen sus conceptos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/acta-no-08-de-2018-sepfsd-ext-juniopdf","title":"Acta No. 08 de 2018 – Comisión Revisora, Sala Especializada de Productos Fitoterapéuticos y Suplementos Dietarios","description":"INVIMA – Comisión Revisora (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/compilacion/docs/concepto_invima_16042560_2016.htm","title":"[Página web] Concepto INVIMA 16042560 de 2016 – Naturaleza y alcance de los conceptos de las Salas de la Comisión Revisora","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: clasificar un portafolio de cinco productos', 'Clase 3 · Marco normativo vigente y autoridades', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica los criterios de frontera para decidir la categoría y la vía de trámite de cinco productos reales.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar los criterios de frontera del Decreto 3249 de 2006 a un portafolio real de productos y decidir la vía de trámite ante el INVIMA.</p><p>Desarrollo. Usted es el QF de asuntos regulatorios de una comercializadora que quiere lanzar cinco productos. Para cada uno debe definir la categoría, la norma aplicable y el riesgo regulatorio. Use esta matriz: finalidad declarada / composición / forma de presentación / niveles frente al Anexo 1 / categoría propuesta / vía de trámite.</p><p>Producto A: cápsulas de vitamina D3 2.000 UI, \"contribuye al mantenimiento de huesos normales\". Vitamina en forma dosificada, declaración de función de nutriente y nivel que debe contrastarse con el UL del Anexo 1 (mod. Decreto 3863 de 2008). Propuesta: suplemento dietario; registro sanitario SD ante la Dirección de Medicamentos y Productos Biológicos.</p><p>Producto B: proteína de suero sabor chocolate en polvo, 30 g por porción, para deportistas. Aporta macronutrientes en forma dosificada. Puede ser suplemento dietario si no se ajusta a la definición de alimento y si no declara efectos ergogénicos no demostrados. El proyecto de decreto de 2024 propone una subcategoría de suplementos para deportistas, aún no vigente. Riesgo: declaraciones como \"aumenta la testosterona\" la volverían fraudulenta (ver alertas de 2026).</p><p>Producto C: tabletas de extracto de valeriana \"para el insomnio\". La planta tiene actividad farmacológica y la declaración es terapéutica. Propuesta: fitoterapéutico (Decreto 1156 de 2018), no suplemento.</p><p>Producto D: barra de cereal adicionada con hierro. Se consume como alimento, sin dosificación farmacéutica. Propuesta: alimento (normas sanitarias de alimentos y de rotulado de alimentos, p. ej. Res. 5109 de 2005 y la reglamentación vigente de rotulado nutricional), no suplemento.</p><p>Producto E: cápsulas \"detox\" con sen y cáscara sagrada, laxantes. Plantas con actividad farmacológica y efecto laxante. No es suplemento; requeriría vía fitoterapéutica con evaluación farmacológica, y su venta como suplemento sin registro es exactamente el patrón de las alertas por productos fraudulentos.</p><p>Ejemplo de trámite. Para el producto A, el expediente incluye los documentos legales, la fórmula cuali-cuantitativa por unidad, la ficha técnica, las especificaciones, la vida útil (máximo dos años, o hasta tres con estudios de estabilidad), el proyecto de etiqueta con la leyenda obligatoria y la evidencia de BPM del fabricante. Se radica en la Oficina Virtual del INVIMA, se paga la tarifa vigente en UVB y el INVIMA tiene 15 días hábiles para decidir.</p><p>Puntos clave:<br>1. Documente siempre por escrito la justificación de la categoría elegida; será su defensa frente a un requerimiento.<br>2. Las declaraciones definen la categoría tanto como la composición.<br>3. Un mismo ingrediente (por ejemplo, hierro) puede ir en un alimento, un suplemento o un medicamento según dosis, forma y finalidad.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Composición: ingredientes, niveles máximos y evaluación de ingredientes nuevos', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: la fórmula como eje del registro', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume por qué la composición determina la viabilidad del registro y qué referencias se usan.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://faolex.fao.org/docs/pdf/col86189.pdf","title":"Decreto 3863 de 2008 (PDF Diario Oficial)","description":"FAOLEX – FAO (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Niveles máximos de vitaminas, minerales y oligoelementos (Anexo 1)', 'Clase 2 · Ingredientes y niveles', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta VRD y niveles máximos de consumo tolerable (UL) y las advertencias de rótulo asociadas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_3863_2008.htm","title":"[Página web] Decreto 3863 de 2008 – Por el cual se modifica el Decreto 3249 de 2006","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_3249_2006.htm","title":"[Página web] Decreto 3249 de 2006 (texto compilado con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Ingredientes permitidos y listas de referencia (FDA, Codex, EFSA, ICBF)', 'Clase 2 · Ingredientes y niveles', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe cómo se demuestra que un ingrediente es admisible y cómo usar las referencias internacionales.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_3863_2008.htm","title":"[Página web] Decreto 3863 de 2008 – Por el cual se modifica el Decreto 3249 de 2006","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://thefoodtech.com/normatividad-y-certificaciones/codex-alimentarius-en-la-regulacion-de-los-complementos-alimenticios","title":"[Página web] Codex Alimentarius en la regulación de los complementos alimenticios","description":"The Food Tech (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Sustancias prohibidas y ingredientes de riesgo', 'Clase 2 · Ingredientes y niveles', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Identifica sustancias no admitidas y los adulterantes más frecuentes en el mercado.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: identificar las sustancias que no pueden formar parte de un suplemento dietario y los criterios con los que el INVIMA rechaza ingredientes.</p><p>Desarrollo. El artículo 3 del Decreto 3249 de 2006, modificado por el Decreto 3863 de 2008, fija los requisitos de composición. El suplemento no puede contener sustancias que representen riesgo para la salud, como hormonas, antibióticos, residuos de plaguicidas, metales pesados por encima de los límites, ni sustancias estupefacientes o psicotrópicas. Tampoco puede incluir ingredientes con acción farmacológica o terapéutica, porque eso lo haría ajustarse a la definición de medicamento o fitoterapéutico. Las vitaminas, minerales y oligoelementos deben respetar los niveles máximos del Anexo 1.</p><p>Los ingredientes admitidos son, en principio, los que aparecen en las referencias aceptadas por la norma (listas de la FDA, Codex Alimentarius, EFSA/legislación europea, tabla del ICBF). Si un ingrediente no figura allí, la solicitud se niega salvo que la Sala Especializada de la Comisión Revisora (hoy de Productos Fitoterapéuticos y Suplementos Dietarios) lo evalúe y lo acepte. En sus actas, la Sala ha rechazado plantas con actividad farmacológica sin aporte nutricional y especies tóxicas como Aristolochia (Acta 05 de 2008).</p><p>En la práctica, las alertas sanitarias del INVIMA muestran los grupos de mayor riesgo: productos \"potenciadores sexuales\" adulterados con análogos de sildenafilo o tadalafilo, \"quemadores de grasa\" con estimulantes o sibutramina, \"detox\" con laxantes y productos deportivos con anabolizantes o prohormonas. El proyecto de decreto de 2024 propone ampliar expresamente la prohibición a anabolizantes, estimulantes del sistema nervioso central y sustancias de la lista de dopaje de la WADA, pero a octubre de 2026 debe verificarse si fue expedido.</p><p>Ejemplo aplicado. Un importador quiere registrar un \"pre-entreno\" con cafeína anhidra 300 mg, beta-alanina, citrulina y 1,3-dimetilamilamina (DMAA). La DMAA es un estimulante prohibido en múltiples jurisdicciones y no está en las listas de referencia; el registro sería negado. La cafeína en dosis altas requiere justificar seguridad frente a las referencias. El QF debe reformular retirando la DMAA, justificar la dosis de cafeína y no declarar efectos sobre el rendimiento que no estén aprobados.</p><p>Puntos clave:<br>1. Ingrediente no listado = negación, salvo evaluación favorable de la Comisión Revisora.<br>2. Ninguna sustancia con acción farmacológica, hormonal, estupefaciente o psicotrópica cabe en un suplemento.<br>3. Revise las alertas sanitarias del INVIMA para conocer los adulterantes más frecuentes en el mercado.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Cómo evalúa la Sala Especializada un ingrediente o una declaración', 'Clase 3 · Evaluación por la Comisión Revisora', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta actas de la Comisión Revisora y los criterios con que acepta o rechaza ingredientes.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preview/128299","title":"Acta 05 de 2008 – Sala Especializada de Productos Naturales (evaluación de suplementos dietarios)","description":"INVIMA – Comisión Revisora (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/acta-no-08-de-2018-sepfsd-ext-juniopdf","title":"Acta No. 08 de 2018 – Comisión Revisora, Sala Especializada de Productos Fitoterapéuticos y Suplementos Dietarios","description":"INVIMA – Comisión Revisora (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/biblioteca/preview/138001","title":"Acta 08/02 – Sala Especializada de Alimentos y Bebidas Alcohólicas (nutracéuticos y alimentos en formas farmacéuticas)","description":"INVIMA – Comisión Revisora (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: solicitud de evaluación de un ingrediente nuevo', 'Clase 3 · Evaluación por la Comisión Revisora', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la preparación de un dossier para incluir un ingrediente no listado.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: preparar una solicitud de evaluación de un ingrediente nuevo para suplementos dietarios ante la Comisión Revisora del INVIMA.</p><p>Desarrollo. Cuando un ingrediente no aparece en las listas de referencia aceptadas (FDA, Codex, EFSA, ICBF), el artículo 12 del Decreto 3249 de 2006 (mod. Decreto 3863 de 2008) obliga a que la Sala Especializada lo evalúe antes de otorgar el registro. Hoy esa función la ejerce la Sala Especializada de Productos Fitoterapéuticos y Suplementos Dietarios (SEPFSD) de la Comisión Revisora. Sus conceptos se publican en actas y, según el Concepto INVIMA 16042560 de 2016, son recomendaciones técnicas que producen efectos frente a terceros cuando el INVIMA las adopta mediante acto administrativo.</p><p>Caso. Su empresa quiere incluir NMN (nicotinamida mononucleótido) en una cápsula para adultos. Pasos sugeridos:<br>1. Búsqueda previa: revisar las actas publicadas de la Sala y las listas de referencia. Si el ingrediente ya fue aceptado o negado, el expediente debe citar ese antecedente.<br>2. Dossier técnico del ingrediente: identidad química, origen y proceso de obtención, especificaciones y método analítico, estabilidad, impurezas y contaminantes.<br>3. Seguridad: estudios toxicológicos, historia de uso, estatus regulatorio en otras jurisdicciones (por ejemplo, si la FDA lo considera ingrediente dietario o fármaco, si la EFSA lo trata como nuevo alimento), dosis diaria propuesta y margen frente a datos de seguridad.<br>4. Aporte nutricional o fisiológico: justificar por qué el ingrediente encaja en la definición de suplemento y no tiene acción farmacológica.<br>5. Declaraciones: si se pretende una declaración en salud, aportar la evidencia científica que exige el artículo 6 del Decreto 3249 y la Resolución 3096 de 2007.<br>6. Radicación: se presenta por la Oficina Virtual del INVIMA como solicitud de concepto a la Comisión Revisora, con el pago de la tarifa vigente en UVB, y luego se continúa el trámite de registro.</p><p>Posibles resultados: aceptación con condiciones (dosis máxima, advertencias en rótulo), aplazamiento por información insuficiente o negación. Si el estatus internacional es de fármaco, la probabilidad de aceptación es baja.</p><p>Puntos clave:<br>1. Antes de formular, verifique si cada ingrediente está en las listas de referencia o en actas de la Comisión Revisora.<br>2. El dossier debe demostrar seguridad, identidad y ausencia de acción farmacológica.<br>3. Los conceptos de la Sala se convierten en precedente para todo el mercado.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Registro sanitario, fabricación e importación', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: el registro sanitario SD', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume el ciclo del registro sanitario de suplementos: solicitud, vigencia, renovación y modificaciones.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=Rt01819ncho","provider":"youtube","videoId":"Rt01819ncho","title":"REGISTROS INVIMA","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/atencion_preguntas_frecuentes/Portafolio_de_Servicios_INVIMA.pdf","title":"Portafolio de Servicios INVIMA (tiempos del registro sanitario de suplementos dietarios)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Modalidades y requisitos documentales (arts. 9–11)', 'Clase 2 · El trámite de registro', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las modalidades (fabricar y vender, importar y vender, importar-envasar-vender) y la documentación legal y técnica.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_3249_2006.htm","title":"[Página web] Decreto 3249 de 2006 (texto compilado con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/preview/102873","title":"Decreto Número 3249 de 2006 (texto oficial)","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Radicación, tiempos, requerimientos y tarifas', 'Clase 2 · El trámite de registro', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el flujo del trámite: 15 días hábiles de estudio, 2 meses para responder requerimientos y tarifas en UVB.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/atencion_preguntas_frecuentes/Portafolio_de_Servicios_INVIMA.pdf","title":"Portafolio de Servicios INVIMA (tiempos del registro sanitario de suplementos dietarios)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_invima_22273_2006.htm","title":"[Página web] Resolución 2006022273 de 2006 INVIMA – Tarifas de registro sanitario de suplementos dietarios (histórica)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_3863_2008.htm","title":"[Página web] Decreto 3863 de 2008 – Por el cual se modifica el Decreto 3249 de 2006","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Vigencia, renovación y modificaciones del registro', 'Clase 2 · El trámite de registro', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara vigencia de 10 años de suplementos con la vigencia indefinida de medicamentos y aplica las reglas de renovación y modificación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_3249_2006.htm","title":"[Página web] Decreto 3249 de 2006 (texto compilado con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'BPM y condiciones sanitarias de fabricación (art. 7 y Anexo 2)', 'Clase 3 · Fabricación e importación', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las opciones de certificación según el tipo de planta y los requisitos del Anexo 2.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_3863_2008.htm","title":"[Página web] Decreto 3863 de 2008 – Por el cual se modifica el Decreto 3249 de 2006","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_3249_2006.htm","title":"[Página web] Decreto 3249 de 2006 (texto compilado con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://consultorsalud.com/minsalud-regulacion-suplementos-dietarios-colom/","title":"[Página web] Minsalud actualiza regulación de suplementos dietarios en Colombia (proyecto de decreto, 2024)","description":"Consultorsalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Importación: visto bueno VUCE, certificados del país de origen y BPM extranjeras', 'Clase 3 · Fabricación e importación', 5, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica los requisitos de importación de suplementos y el visto bueno sanitario por VUCE.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=yfqeURSW2uw","provider":"youtube","videoId":"yfqeURSW2uw","title":"¿Qué productos necesitan INVIMA para importar a Colombia?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.analdex.org/wp-content/uploads/2023/10/Presentacion_-Invima_-2023_-Autorizaciones-y-Vo.Bo_.-de-Importacion-Invima.pdf","title":"Importación de productos competencia del INVIMA (Autorizaciones y Vo.Bo. de importación, 2023)","description":"INVIMA / Analdex (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://invima.gov.co/tramites-y-servicios/grupo-autorizaciones-licencias-vuce","title":"[Página web] Autorizaciones y visto bueno de importación/exportación (Registro o licencia VUCE)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: registro de un suplemento importado', 'Clase 3 · Fabricación e importación', 6, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta un expediente completo de registro en modalidad importar y vender.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=oUtGpEKZV5E","provider":"youtube","videoId":"oUtGpEKZV5E","title":"How to Launch Food & Supplements in Colombia","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/atencion_preguntas_frecuentes/Portafolio_de_Servicios_INVIMA.pdf","title":"Portafolio de Servicios INVIMA (tiempos del registro sanitario de suplementos dietarios)","description":"INVIMA (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Rotulado, declaraciones de propiedades y publicidad', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: qué puede y qué no puede decir un suplemento', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume las reglas de comunicación del producto: etiqueta, declaraciones y publicidad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minproteccion_3096_2007.htm","title":"[Página web] Resolución 3096 de 2007 – Reglamento técnico de rotulado y declaraciones de suplementos dietarios","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Rotulado obligatorio y etiquetas de importados (arts. 21–22)', 'Clase 2 · Rotulado y declaraciones', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la información mínima del rótulo, la leyenda obligatoria y las reglas para etiquetas de origen.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_3863_2008.htm","title":"[Página web] Decreto 3863 de 2008 – Por el cual se modifica el Decreto 3249 de 2006","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/compilacion/docs/concepto_invima_2005036_2018.htm","title":"[Página web] Concepto INVIMA 2005036 de 2018 – Promociones, publicidad y presentaciones de suplementos dietarios","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Resolución 3096 de 2007: información nutricional y declaraciones de contenido', 'Clase 2 · Rotulado y declaraciones', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la tabla nutricional por porción, el %VD y términos como ''buena fuente'' o ''alto''.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minproteccion_3096_2007.htm","title":"[Página web] Resolución 3096 de 2007 – Reglamento técnico de rotulado y declaraciones de suplementos dietarios","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Declaraciones de propiedades de salud y su actualización', 'Clase 2 · Rotulado y declaraciones', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara declaraciones de función de nutriente, reducción de riesgo y otras funciones, y cómo se actualiza el listado.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minproteccion_3096_2007.htm","title":"[Página web] Resolución 3096 de 2007 – Reglamento técnico de rotulado y declaraciones de suplementos dietarios","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/acta-no-08-de-2018-sepfsd-ext-juniopdf","title":"Acta No. 08 de 2018 – Comisión Revisora, Sala Especializada de Productos Fitoterapéuticos y Suplementos Dietarios","description":"INVIMA – Comisión Revisora (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Publicidad de suplementos: arts. 24–25 y Decreto 272 de 2009', 'Clase 3 · Publicidad', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las prohibiciones publicitarias, la aprobación previa y el control de promociones e influenciadores.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_0272_2009.htm","title":"[Página web] Decreto 272 de 2009 – Modifica el parágrafo del artículo 24 del Decreto 3249 de 2006","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/compilacion/docs/concepto_invima_2005036_2018.htm","title":"[Página web] Concepto INVIMA 2005036 de 2018 – Promociones, publicidad y presentaciones de suplementos dietarios","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: revisar etiqueta y pieza publicitaria', 'Clase 3 · Publicidad', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la revisión de una etiqueta importada y una pieza en redes sociales con hallazgos y correcciones.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: revisar un proyecto de etiqueta y una pieza publicitaria de un suplemento dietario frente al Decreto 3249 de 2006, el Decreto 3863 de 2008, el Decreto 272 de 2009 y la Resolución 3096 de 2007.</p><p>Caso. Producto: \"ColaBella Plus\", polvo de colágeno hidrolizado 10 g + vitamina C 80 mg + biotina 30 µg por porción. Proyecto de etiqueta: nombre y marca, \"Rejuvenece tu piel en 30 días y elimina el dolor articular\", tabla nutricional por 100 g, lote y vencimiento, sin leyenda obligatoria, texto principal en inglés por ser importado. Pieza para Instagram: testimonio de una influenciadora con \"adiós a la artrosis\".</p><p>Revisión paso a paso:<br>1. Leyendas obligatorias (art. 21 mod. Decreto 3863 de 2008): falta \"Este producto es un suplemento dietario, no es un medicamento y no suple una alimentación equilibrada\". Deben agregarse también las advertencias que correspondan al Anexo 1 o a las condiciones del registro.<br>2. Importados (art. 22 mod.): se acepta la etiqueta de origen, pero la información mínima exigida debe estar en castellano (puede ir en adhesivo, que también debe cumplir los requisitos de rotulado, según el Concepto INVIMA 2005036 de 2018).<br>3. Tabla nutricional (Res. 3096 de 2007): debe declararse por porción o por recomendación diaria de uso, con vitaminas y minerales como %VD.<br>4. Declaraciones: \"rejuvenece\" y \"elimina el dolor articular\" son atribuciones terapéuticas o no comprobables, prohibidas. Se puede evaluar una declaración de función de nutriente aprobada, por ejemplo la vitamina C en la formación normal de colágeno, si está en el listado de declaraciones adoptado por el INVIMA; su inclusión se tramita como modificación del registro.<br>5. Publicidad (art. 24 y 25, parágrafo mod. Decreto 272 de 2009): no puede confundir, exagerar o engañar ni ostentar indicaciones preventivas, de rehabilitación o terapéuticas. La pieza con \"adiós a la artrosis\" es inaceptable. La publicidad de suplementos requiere aprobación previa del INVIMA según el art. 24 y el Concepto 2005036 de 2018; verifique el trámite vigente en la Oficina Virtual.<br>6. Coherencia: la presentación comercial que se anuncie (por ejemplo, packs 2x1 con contenido adicional) debe estar aprobada en el registro sanitario.</p><p>Resultado esperado: etiqueta corregida, declaraciones respaldadas y pieza publicitaria reformulada antes de pedir su aprobación.</p><p>Puntos clave:<br>1. La leyenda obligatoria y el castellano no son negociables.<br>2. Toda declaración debe estar en el listado aprobado o tener soporte científico evaluado.<br>3. Influenciadores y testimonios están sujetos a las mismas prohibiciones que la etiqueta.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Vigilancia, productos fraudulentos y comparación internacional', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: el reto de los suplementos fraudulentos', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la magnitud del problema de productos sin registro y el papel del QF en la vigilancia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=_vf5pP4bSMo","provider":"youtube","videoId":"_vf5pP4bSMo","title":"Invima alerta por venta de vitaminas sin registro sanitario en Colombia | El Tiempo","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.fenalco.com.co/blog/juridico-2/notijuridico-165-minsalud-realiza-evaluacion-ex-post-de-los-suplementos-dietarios-44","title":"[Página web] Notijurídico 165 – MinSalud realiza evaluación ex post de los suplementos dietarios","description":"Fenalco (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Alertas sanitarias del INVIMA sobre suplementos fraudulentos', 'Clase 2 · Vigilancia y control', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la estructura de una alerta y sus recomendaciones para cada actor.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=eU_BZZeFsPw","provider":"youtube","videoId":"eU_BZZeFsPw","title":"INVIMA alerta sobre comercialización ilegal de suplemento dietario","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/alertas-sanitarias/productos-promocionados-y-comercializados-en-redes-sociales-de-comercio-eletronico-como-suplementos-dietarios-son-fraudu","title":"[Página web] Alerta 129-2025: Productos promocionados en redes sociales como suplementos dietarios son fraudulentos","description":"INVIMA – Alertas sanitarias (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/alertas-sanitarias/productos-fraudulentos-marca-madretierra","title":"[Página web] Alerta 325-2025: Productos fraudulentos marca MADRETIERRA","description":"INVIMA – Alertas sanitarias (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Casos recientes: ''potenciadores'', ''detox'', productos deportivos e infantiles', 'Clase 2 · Vigilancia y control', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara casos de alertas 2023–2026 e identifica patrones de fraude y riesgo.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=Bz2mMHAJodQ","provider":"youtube","videoId":"Bz2mMHAJodQ","title":"Invima mantiene alerta por suplementos promocionados como potenciadores: ¿qué encontraron?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/download/101187","title":"Alerta No. 034-2023: Productos promocionados como suplementos dietarios bajo la marca SoHealthy","description":"INVIMA – Alertas sanitarias (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.noticiasrcn.com/salud-y-bienestar/invima-alerta-por-suplementos-dietarios-fraudulentos-1036804","title":"[Página web] Proteínas, creatinas, preentrenos, colágenos: Invima emitió alerta por decenas de suplementos (jul. 2026)","description":"Noticias RCN (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Medidas sanitarias, sanciones y responsabilidad de los actores', 'Clase 2 · Vigilancia y control', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe medidas de seguridad, proceso sancionatorio y prevención en establecimientos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: describir cómo opera la inspección, vigilancia y control (IVC) de suplementos dietarios y qué medidas y sanciones pueden imponerse.</p><p>Desarrollo. El INVIMA y las entidades territoriales de salud ejercen la IVC de los suplementos dietarios con base en la Ley 9 de 1979 y el Decreto 3249 de 2006. El INVIMA vigila a fabricantes e importadores, verifica BPM y condiciones de fabricación, revisa de oficio registros (arts. 16 y 17, con concepto previo de la Comisión Revisora) y emite alertas sanitarias; las secretarías de salud inspeccionan los establecimientos de comercialización, que deben estar autorizados (art. 8 prohíbe la venta ambulante).</p><p>Las medidas sanitarias de seguridad son preventivas y de ejecución inmediata: decomiso, congelación, suspensión de actividades, destrucción o desnaturalización de productos. Luego puede abrirse un proceso sancionatorio cuyas sanciones incluyen amonestación, multas, decomiso, suspensión o cancelación del registro sanitario y cierre temporal o definitivo del establecimiento. Cuando un producto clasificable como suplemento tenía registro en otra categoría y no se ajustó en los plazos transitorios del Decreto 3863 de 2008, la consecuencia prevista fue la cancelación del registro y el proceso sancionatorio.</p><p>Las alertas sanitarias son el instrumento más visible frente a productos fraudulentos. Su estructura es estable: identificación del producto, motivo (sin registro sanitario, registro de otro producto, adulteración, declaraciones terapéuticas), riesgos y recomendaciones para ciudadanía, IPS y profesionales, establecimientos, entidades territoriales y red de farmacovigilancia. Los eventos adversos se notifican por VigiFlow o al correo de farmacovigilancia del INVIMA.</p><p>Ejemplo aplicado. Una droguería recibe una visita de la secretaría de salud y le encuentran unidades de un producto incluido en una alerta como fraudulento. La medida inmediata es el decomiso y la destrucción, y el establecimiento puede enfrentar un proceso sancionatorio. Como QF o director técnico, la prevención consiste en: verificar en la consulta de registros sanitarios del INVIMA cada producto antes de comprarlo, comprar solo a proveedores con documentación, revisar semanalmente las alertas y documentar la cuarentena y la devolución de productos sospechosos.</p><p>Puntos clave:<br>1. Medidas sanitarias (inmediatas) y sanciones (tras proceso) son diferentes.<br>2. La responsabilidad alcanza a fabricantes, importadores y comercializadores.<br>3. Un sistema interno de vigilancia de alertas protege al establecimiento y al paciente.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Estados Unidos: DSHEA, NDI y declaraciones estructura/función', 'Clase 3 · Comparación internacional y perspectiva', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara el modelo posmercado de la FDA con el registro previo colombiano.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://corporate.findlaw.com/law-library/dietary-supplement-health-and-education-act-summary.html","title":"[Página web] Dietary Supplement Health and Education Act Summary","description":"FindLaw (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.fda.gov/media/158369/download","title":"Policy Regarding Certain New Dietary Ingredients and Dietary Supplements Subject to the Requirement for Premarket Notification (Draft Guidance, 2022)","description":"FDA (EN) · misma dirección, corregido el «www.»"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Latinoamérica y Codex: modelos regulatorios y armonización (Alianza del Pacífico)', 'Clase 3 · Comparación internacional y perspectiva', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara enfoques regionales y las directrices Codex sobre complementos de vitaminas y minerales.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://supplysidesj.com/supplement-regulations/regulatory-trends-whats-required-to-successfully-launch-dietary-supplements-across-latin-america-part-1-of-2-","title":"[Página web] Regulatory Trends: What''s Required to Successfully Launch Dietary Supplements across Latin America (Part 1 of 2)","description":"SupplySide Supplement Journal (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://thefoodtech.com/normatividad-y-certificaciones/codex-alimentarius-en-la-regulacion-de-los-complementos-alimenticios","title":"[Página web] Codex Alimentarius en la regulación de los complementos alimenticios","description":"The Food Tech (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://nutraingredients.com/Article/2010/11/12/IADSA-diverse-regulations-hinder-Latin-America-food-supplement-markets","title":"[Página web] IADSA: diverse regulations hinder Latin America food supplement markets","description":"NutraIngredients (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso integrador: lanzar en Colombia un suplemento aprobado bajo DSHEA', 'Clase 3 · Comparación internacional y perspectiva', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta un plan regulatorio completo y anticipa los cambios del proyecto de decreto de MinSalud.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: integrar todo el curso en un plan regulatorio completo para lanzar un suplemento dietario importado en Colombia y prepararlo frente a cambios normativos.</p><p>Caso. Una empresa estadounidense vende en EE. UU. una gomita de melatonina 3 mg + magnesio + L-teanina \"for better sleep\" bajo DSHEA (sin aprobación previa de la FDA, con declaración estructura/función y la advertencia de que no ha sido evaluada por la FDA). Quiere venderla en Colombia en droguerías y comercio electrónico.</p><p>Paso 1. Clasificación. En Colombia debe verificarse si la melatonina es admisible como ingrediente de suplemento (listas de referencia y actas de la Comisión Revisora); en varias jurisdicciones se regula como medicamento. Si no es admisible, la fórmula debe cambiar (por ejemplo, retirar la melatonina) o tramitarse por otra vía. Esta es la diferencia de fondo: lo que en EE. UU. es suplemento puede ser medicamento en Colombia.</p><p>Paso 2. Composición. Contrastar el magnesio con el UL del Anexo 1 (Decreto 3863 de 2008) y verificar la L-teanina en las referencias; si no está, solicitar evaluación a la Sala Especializada de Productos Fitoterapéuticos y Suplementos Dietarios.</p><p>Paso 3. Registro sanitario (modalidad importar y vender). Documentos legales del importador y autorización del titular, certificado de la autoridad sanitaria del país exportador, evidencia de BPM del fabricante (certificado del país de origen o equivalente; si no existe, el INVIMA puede visitar), fórmula, especificaciones, vida útil (dos años, o hasta tres con estabilidad), proyecto de etiqueta. Radicación por la Oficina Virtual, tarifa en UVB, decisión en 15 días hábiles; si hay requerimiento, dos meses para responder. Vigencia de diez años; renovar al menos tres meses antes del vencimiento.</p><p>Paso 4. Rotulado y declaraciones. Leyenda obligatoria, información mínima en castellano, tabla por porción con %VD (Res. 3096 de 2007). \"Better sleep\" se convierte en una declaración aprobada de función de nutriente o se elimina.</p><p>Paso 5. Importación. Visto bueno del INVIMA en la VUCE para cada despacho, con número de registro sanitario y vigencia.</p><p>Paso 6. Publicidad y canales. Aprobación previa de la publicidad, control de influenciadores, venta solo en establecimientos autorizados y comercio electrónico con el registro visible.</p><p>Paso 7. Vigilancia normativa. El proyecto de decreto de MinSalud de 2024 (restricción a adultos sanos, subcategoría deportiva, BPM y Buenas Prácticas de Abastecimiento propias) podría cambiar requisitos. Mantenga un tablero de seguimiento y un análisis de brechas.</p><p>Puntos clave:<br>1. DSHEA no se traslada: cada ingrediente se revisa con las reglas colombianas.<br>2. Registro, rotulado, VUCE y publicidad son trámites encadenados.<br>3. Un plan regulatorio incluye la vigilancia de los cambios normativos.</p>"}'::jsonb);

END
$curso$;

-- ─── 17. Curso de Regulación Sanitaria del Cannabis Medicinal en Colombia (35 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Regulación Sanitaria del Cannabis Medicinal en Colombia' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Regulación Sanitaria del Cannabis Medicinal en Colombia', 'Curso especializado sobre el régimen sanitario del cannabis con fines médicos y científicos en Colombia: Ley 1787 de 2016, Título 11 del Decreto 780 de 2016 (Decreto 811 de 2021 y Decreto 1138 de 2025), Resolución 227 de 2022 y normas 2026.', '<p>Curso especializado sobre el régimen sanitario del cannabis con fines médicos y científicos en Colombia: Ley 1787 de 2016, Título 11 del Decreto 780 de 2016 (Decreto 811 de 2021 y Decreto 1138 de 2025), Resolución 227 de 2022 y normas 2026. Cubre licencias, cupos, control especial, vías sanitarias ante el INVIMA (medicamentos, magistrales, fitoterapéuticos, cosméticos, alimentos y suplementos), exportación y farmacovigilancia, con casos prácticos.</p><h3>Objetivo general</h3><p>Que el Químico Farmacéutico identifique la autoridad, la licencia, el cupo y la vía sanitaria que corresponden a cada material y producto de cannabis, y planifique y ejecute los trámites ante INVIMA, MinJusticia y el FNE cumpliendo la normativa vigente a 2026.</p><h3>A quién va dirigido</h3><p>Químicos Farmacéuticos de asuntos regulatorios, directores técnicos de laboratorios y farmacias magistrales, profesionales de calidad, licenciatarios de cannabis y estudiantes de último año de Química Farmacéutica en Colombia.</p><h3>Contexto normativo</h3><p>Colombia — normativa INVIMA / MinSalud</p>',
          'Asuntos regulatorios — productos especiales', 'intermedio', 'Que el Químico Farmacéutico identifique la autoridad, la licencia, el cupo y la vía sanitaria que corresponden a cada material y producto de cannabis, y planifique y ejecute los trámites ante INVIMA, MinJusticia y el FNE cumpliendo la normativa vigente a 2026.', 'Químicos Farmacéuticos de asuntos regulatorios, directores técnicos de laboratorios y farmacias magistrales, profesionales de calidad, licenciatarios de cannabis y estudiantes de último año de Química Farmacéutica en Colombia.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Marco legal y gobernanza del cannabis medicinal en Colombia', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: del Acto Legislativo 02 de 2009 a la flor medicinal de 2025', 'Clase 1 · Introducción al curso', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Presenta la ruta del curso y la evolución del cannabis regulado en Colombia, sus actores y por qué el QF es clave en la cadena.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=-CWbKTH1nQc","provider":"youtube","videoId":"-CWbKTH1nQc","title":"El camino para la legalización de la marihuana en Colombia comenzó hace décadas","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.polisura.edu.co/normatividad-del-cannabis-medicinal-y-su-produccion","title":"[Página web] Normatividad del cannabis medicinal y su producción","description":"Politécnico de Suramérica (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Ley 1787 de 2016: acceso seguro e informado al uso médico y científico', 'Clase 2 · Evolución normativa', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el objeto de la ley, el control estatal de la cadena, las competencias de MinSalud y MinJusticia y la protección de pequeños cultivadores.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preview/127387","title":"Ley 1787 de 2016 — marco regulatorio del acceso seguro e informado al uso médico y científico del cannabis (copia INVIMA)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/preview/122395","title":"[Página web] Marco normativo: cannabis para uso médico y científico (documento INVIMA, contexto 2016–2018)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Decreto 811 de 2021: el Título 11 del Decreto 780 de 2016', 'Clase 2 · Evolución normativa', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta cómo el Decreto 811 sustituyó el régimen del Decreto 613 de 2017: definiciones, licencias de 10 años, fines industriales y exportación de flor seca.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=JgC_9Ny2tKs","provider":"youtube","videoId":"JgC_9Ny2tKs","title":"El Gobierno aprueba el uso del cannabis medicinal: en qué situaciones podrá usarse","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.dian.gov.co/dian/compilacion/docs/decreto_0811_2021.htm","title":"[Página web] Decreto 811 de 2021 — sustituye el Título 11, Parte 8, Libro 2 del Decreto 780 de 2016 (texto compilado)","description":"Normograma DIAN (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.supersalud.gov.co/compilacion/docs/decreto_0811_2021.htm","title":"[Página web] Decreto 811 de 2021 (normograma Supersalud)","description":"Superintendencia Nacional de Salud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Decreto 1138 de 2025 y reformas en curso (2026)', 'Clase 2 · Evolución normativa', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los cambios del Decreto 1138 de 2025 (flor como producto terminado, licencia de uso nacional y exportación, magistrales con materia prima nacional, régimen transitorio) y el proyecto de modificación de 2026.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_1138_2025.htm","title":"[Página web] Decreto 1138 de 2025 — modifica parcialmente el Título 11 del Decreto 780 de 2016 (flor como producto terminado, licencias de uso nacional y exportación)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://consultorsalud.com/gobierno-habilita-cannabis-producto-medicinal/","title":"[Página web] Gobierno habilita la flor de cannabis como producto medicinal: así se aplicará el Decreto 1138 de 2025","description":"Consultorsalud (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.minsalud.gov.co/Normativa/anexosproyectos/20260505%20Memoria%20Justificativa%20mod%20Dec113820260506163519_20260515141013.pdf","title":"Memoria justificativa — proyecto de decreto 2026 que modifica el Decreto 1138 de 2025","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Mapa institucional: MinJusticia, INVIMA, FNE, ICA, MinAgricultura y MinCIT', 'Clase 3 · Autoridades, definiciones y umbrales de THC', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Identifica qué entidad otorga cada licencia, cupo o autorización y el nuevo SICAMED de MinCIT.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.dian.gov.co/dian/compilacion/docs/decreto_0811_2021.htm","title":"[Página web] Decreto 811 de 2021 — sustituye el Título 11, Parte 8, Libro 2 del Decreto 780 de 2016 (texto compilado)","description":"Normograma DIAN (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://sidn.ramajudicial.gov.co/SIDN/NORMATIVA/TEXTOS_COMPLETOS/8_RESOLUCIONES/RESOLUCIONES 2026/Resolucion 1241 de 2026.pdf","title":"Resolución 1241 de 2026 (MinSalud–MinCIT) — reglamenta el art. 2.8.11.5.7 del Decreto 780/2016 y crea el SICAMED","description":"Rama Judicial — SIDN (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.mincit.gov.co/normatividad/proyectos-de-normatividad/proyectos-de-resolucion-2026/17-03-2026-mj-pr-reglamenta-el-articulo-15-del-dec.aspx","title":"[Página web] Proyecto de resolución que reglamenta el artículo 15 del Decreto 1138 de 2025 (SICAMED)","description":"Ministerio de Comercio, Industria y Turismo (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Psicoactivo vs. no psicoactivo y límite de fiscalización: control especial THC vs. CBD', 'Clase 3 · Autoridades, definiciones y umbrales de THC', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el umbral del 1 % de THC, el límite de fiscalización del 0,2 % y la figura del derivado no psicoactivo fiscalizado.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://consultorsalud.com/reglamentan-uso-medicinal-cannabis-res-227-2022/","title":"[Página web] Reglamentan uso medicinal e industrial del cannabis en Colombia (Res. 227 de 2022)","description":"Consultorsalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: clasificar materiales y actividades para definir autoridad y trámite', 'Clase 3 · Autoridades, definiciones y umbrales de THC', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica las definiciones y umbrales para decidir qué licencia, cupo y vía sanitaria corresponden a tres escenarios reales.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar los umbrales de THC y las definiciones del Título 11 del Decreto 780 de 2016 (sustituido por el Decreto 811 de 2021 y modificado por el Decreto 1138 de 2025) para decidir qué autoridad y qué trámite aplican a un caso.</p><p>Desarrollo: la primera pregunta regulatoria con cannabis no es \"qué producto quiero vender\" sino \"qué material voy a manejar\". La norma distingue dos umbrales distintos que el QF no debe confundir. (1) El umbral agronómico/de licenciamiento: cannabis psicoactivo es el que tiene THC igual o superior al 1 % en peso seco; el no psicoactivo (cáñamo) tiene menos del 1 %. Lo mismo aplica a los derivados (psicoactivos y no psicoactivos). Este umbral decide qué licencia se necesita y si hay cupos. (2) El límite de fiscalización sanitario que fija el Ministerio de Salud: la Resolución 227 de 2022, remitiendo a la Resolución 315 de 2020, considera sustancias fiscalizadas los derivados con THC igual o superior al 0,2 %. De ahí surge la figura del \"derivado no psicoactivo fiscalizado\" (THC ≥ límite de fiscalización y &lt; 1 %). Los productos de uso industrial (cosméticos, alimentos, bebidas, suplementos) no pueden alcanzar ese límite de fiscalización.</p><p>Las autoridades se reparten así: MinJusticia (Subdirección de Control y Fiscalización de Sustancias Químicas y Estupefacientes) expide licencias de semillas y de cultivo; el INVIMA expide las licencias de fabricación de derivados (psicoactivos y no psicoactivos) además de sus competencias sanitarias (registro, BPM/BPE, vigilancia); el Fondo Nacional de Estupefacientes (FNE) controla los derivados psicoactivos y productos fiscalizados y otorga cupos de fabricación; el ICA controla semillas, cultivares y certificación fitosanitaria; y desde 2026 MinCIT administra el SICAMED (Res. 1241 de 2026) como sistema de fomento y trazabilidad comercial, sin función habilitante.</p><p>Ejemplo aplicado: una empresa quiere (a) importar aislado de CBD para un medicamento, (b) comprar extracto de espectro completo con 0,6 % de THC a un licenciatario nacional para un aceite cosmético y (c) fabricar un aceite con 5 % de THC para preparaciones magistrales. Caso (a): CBD aislado como principio activo de medicamento sigue la vía de registro sanitario del Decreto 677/1995 ante el INVIMA (evaluación farmacológica + farmacéutica + legal). Caso (b): no es viable como cosmético, porque 0,6 % supera el límite de fiscalización del 0,2 %; habría que reformular con un derivado bajo el límite y tramitar la Notificación Sanitaria Obligatoria. Caso (c): es un derivado psicoactivo: requiere licencia de fabricación de derivados del INVIMA, inscripción y cupo ante el FNE, y el producto será de control especial.</p><p>Puntos clave:<br>1. Hay dos umbrales: 1 % THC (psicoactivo vs. no psicoactivo, licencias y cupos) y el límite de fiscalización sanitario (0,2 % según Res. 315/2020 citada en la Res. 227/2022).<br>2. El INVIMA expide licencias de fabricación de derivados desde el Decreto 811 de 2021; MinJusticia expide las de semillas y cultivo; el FNE controla lo fiscalizado.<br>3. Antes de cualquier trámite, documente en una matriz el material, su % THC certificado, la licencia del proveedor y la vía sanitaria del producto final.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Licencias y cupos', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: el sistema de licencias y cupos', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la lógica licencia–inscripción–cupo y por qué determina la viabilidad de cualquier proyecto con cannabis.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=DJ_5gMbzI_w","provider":"youtube","videoId":"DJ_5gMbzI_w","title":"La promesa del cannabis medicinal se esfuma para los pequeños productores","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cesed.uniandes.edu.co/wp-content/uploads/2023/12/Cannabisentrega3_DIAGRAMADO-1.pdf","title":"Cannabis legal: desafíos de la industria de cannabis para usos médicos y científicos en Colombia (Documento temático 41)","description":"CESED — Universidad de los Andes (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Tipos y modalidades de licencias (semillas, cultivo psicoactivo y no psicoactivo, fabricación de derivados, extraordinarias)', 'Clase 2 · Tipos de licencias y requisitos', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe cada licencia, sus modalidades, su vigencia de 10 años renovables y la regla del autocultivo.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.dian.gov.co/dian/compilacion/docs/decreto_0811_2021.htm","title":"[Página web] Decreto 811 de 2021 — sustituye el Título 11, Parte 8, Libro 2 del Decreto 780 de 2016 (texto compilado)","description":"Normograma DIAN (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Licencia de fabricación de derivados ante el INVIMA', 'Clase 2 · Tipos de licencias y requisitos', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los requisitos de la licencia de fabricación de derivados (psicoactivos y no psicoactivos), el director técnico, el protocolo de seguridad y la visita previa.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.dian.gov.co/dian/compilacion/docs/decreto_0811_2021.htm","title":"[Página web] Decreto 811 de 2021 — sustituye el Título 11, Parte 8, Libro 2 del Decreto 780 de 2016 (texto compilado)","description":"Normograma DIAN (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://encolombia.com/derecho/decretos/minsalud/licencia-derivados-cannabis/","title":"[Página web] Licencia de fabricación de derivados de cannabis","description":"encolombia.com (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Licencias de cultivo: modalidad de uso nacional y exportación, investigación no comercial y pequeños cultivadores', 'Clase 2 · Tipos de licencias y requisitos', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara las modalidades de cultivo tras el Decreto 1138 de 2025 y las medidas para pequeños y medianos cultivadores.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=N380I1-UyOc","provider":"youtube","videoId":"N380I1-UyOc","title":"Pacientes y cultivadores se beneficiarán del decreto que legaliza cannabis medicinal en Colombia","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_1138_2025.htm","title":"[Página web] Decreto 1138 de 2025 — modifica parcialmente el Título 11 del Decreto 780 de 2016 (flor como producto terminado, licencias de uso nacional y exportación)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://consultorsalud.com/gobierno-habilita-cannabis-producto-medicinal/","title":"[Página web] Gobierno habilita la flor de cannabis como producto medicinal: así se aplicará el Decreto 1138 de 2025","description":"Consultorsalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Cupos de cultivo y de fabricación: ordinarios y suplementarios', 'Clase 3 · Cupos y Fondo Nacional de Estupefacientes', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe quién otorga cada cupo, sus vigencias (2 años ordinario, 1 año suplementario) y los criterios de justificación de demanda.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preview/122395","title":"[Página web] Marco normativo: cannabis para uso médico y científico (documento INVIMA, contexto 2016–2018)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'El FNE: inscripción, control especial y reportes', 'Clase 3 · Cupos y Fondo Nacional de Estupefacientes', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las funciones del FNE sobre derivados psicoactivos y productos fiscalizados y las obligaciones de reporte del licenciatario.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: comprender el rol del Fondo Nacional de Estupefacientes (FNE) frente al cannabis psicoactivo y sus derivados, y las obligaciones de inscripción, reporte y control especial que asume el titular.</p><p>Desarrollo: el FNE (Unidad Administrativa Especial adscrita al Ministerio de Salud) es la autoridad de control administrativo y operativo de las sustancias sometidas a fiscalización. En cannabis, según el Decreto 811 de 2021 y la Resolución 227 de 2022, cumple cuatro funciones: (1) inscribe a los licenciatarios de fabricación de derivados que manejarán material psicoactivo o fiscalizado (la Res. 227 regula las inscripciones ante el FNE en sus arts. 12 a 14); (2) otorga los cupos de fabricación de derivados (cantidad máxima de cannabis en peso seco que se puede adquirir y transformar), mientras que los cupos de cultivo los otorga MinJusticia (art. 48); (3) hace seguimiento a las licencias de fabricación y a los productos terminados fiscalizados; y (4) recibe reportes periódicos de movimiento (compras, transformación, inventarios, ventas, destrucciones). El Decreto 1138 de 2025 reitera que el FNE vigila derivados y productos terminados fiscalizados y que la clasificación \"fiscalizado / no fiscalizado\" depende del umbral de THC fijado por MinSalud. Además, el mismo decreto dispone que las transferencias de cannabis psicoactivo para venta nacional sigan el procedimiento de compra y venta local de la Resolución 1478 de 2006 (norma marco de medicamentos de control especial).</p><p>Nota histórica útil: la Resolución 485 de 2016 había creado la inscripción previa ante el FNE para cultivo con fines de investigación y fabricación/exportación de derivados; fue derogada por la Resolución 315 de 2020, que hoy forma parte del bloque de control junto con la Res. 1478 de 2006.</p><p>Ejemplo aplicado: un laboratorio con licencia de fabricación de derivados del INVIMA quiere producir un extracto con 10 % de THC para venderlo a farmacias magistrales certificadas en BPE. Debe: (a) estar inscrito ante el FNE; (b) contar con cupo ordinario de fabricación aprobado (vigencia de dos años según la Res. 227; los suplementarios, un año); (c) comprar la flor solo a licenciatarios de cultivo psicoactivo con cupo; (d) llevar libros y reportes de movimiento; y (e) entregar a la farmacia magistral el extracto con certificado de análisis y el código de cupo favorable del FNE que la guía ASS-AYC-GU017 del INVIMA exige verificar.</p><p>Puntos clave:<br>1. Licencia (INVIMA) ≠ inscripción y cupo (FNE): sin cupo no se puede transformar cannabis psicoactivo.<br>2. Todo lo que supere el límite de fiscalización entra al régimen de control especial (Res. 1478/2006 y Res. 315/2020): libros, reportes, seguridad y compra-venta controlada.<br>3. Programe en el cronograma regulatorio los reportes al FNE y la solicitud de cupos con suficiente anticipación; la demora en cupos es una de las barreras más citadas por la industria.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: solicitud de un cupo ordinario de fabricación', 'Clase 3 · Cupos y Fondo Nacional de Estupefacientes', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la simulación de una solicitud de cupo con cálculo de necesidad, soportes de demanda y plan de reporte.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: ejecutar paso a paso la solicitud de un cupo ordinario de fabricación de derivados psicoactivos de cannabis.</p><p>Desarrollo: la Resolución 227 de 2022 (Título 3, arts. 48 a 58) regula los cupos. Los de cultivo los otorga MinJusticia y los de fabricación de derivados el FNE. Existen cupos ordinarios (vigencia de dos años) y suplementarios (un año), estos últimos cuando la demanda supera lo previsto. El art. 58 fija los requisitos generales del cupo ordinario de fabricación, entre ellos justificar la necesidad con base en demanda por consumo, prestación de servicio o morbilidad. Las solicitudes y la información de licencias se gestionan en el Mecanismo de Información para el Control del Cannabis (MICC).</p><p>Pasos sugeridos (simulación de trámite):<br>1. Verificar prerrequisitos: licencia de fabricación de derivados vigente (expedida por el INVIMA; vigencia de 10 años renovables según el art. 2.8.11.2.1.8), modalidad que corresponda (uso nacional, investigación o exportación), inscripción ante el FNE y director técnico.<br>2. Construir la justificación de demanda: contratos o cartas de intención de clientes (farmacias magistrales con BPE, titulares de registro sanitario, importadores extranjeros con autorización de su país), proyecciones de ventas y, si aplica, datos epidemiológicos para el uso médico.<br>3. Calcular la cantidad: peso seco de cannabis requerido = producto proyectado ÷ rendimiento de extracción validado, más pérdidas de proceso y muestras de control de calidad.<br>4. Identificar proveedores: licenciatarios de cultivo psicoactivo con cupo de cultivo vigente. Recuerde que el Decreto 1138 de 2025 fijó un régimen transitorio de dos años en el que solo pequeños y medianos cultivadores y micro/pequeñas empresas abastecerán la materia prima para el mercado médico nacional, contado desde la reglamentación de su art. 17; valide el estado de esa reglamentación antes de contratar.<br>5. Radicar en el MICC con soportes y pagar la tarifa correspondiente; responder requerimientos.<br>6. Una vez otorgado, ejecutar y reportar: movimientos periódicos al FNE, conciliación de inventarios y solicitud de cupo suplementario si la demanda crece.</p><p>Ejemplo: una compañía proyecta 2.000 frascos de aceite de 30 mL al 2,5 % de THC para un medicamento con registro sanitario. Con un rendimiento de 10 % de extracto por peso seco y 20 % de pérdidas, calcula la necesidad de flor, la soporta con un contrato de suministro con el titular del registro y radica el cupo ordinario para dos años.</p><p>Puntos clave:<br>1. El cupo se justifica con demanda real y documentada; las proyecciones infladas generan requerimientos o rechazo.<br>2. Cupo ordinario: dos años; suplementario: un año (Res. 227/2022, art. 56).<br>3. Integre cupo, licencia, compras y reportes en un único tablero de cumplimiento.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Productos derivados: vías sanitarias ante el INVIMA', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: de derivado a producto terminado', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume las vías sanitarias disponibles (medicamento, fitoterapéutico, magistral, cosmético, alimento, suplemento) y el papel de la declaración de uso.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=bu4Gw3CMRm8","provider":"youtube","videoId":"bu4Gw3CMRm8","title":"¿Decreto destraba el tema del cannabis medicinal en Colombia? MinSalud respondió","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.asuntoslegales.com.co/analisis/adriana-duran-400027/cannabis-medicinal-donde-estamos-2894237","title":"[Página web] Cannabis medicinal: dónde estamos (columna 2019)","description":"Asuntos Legales (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Registro sanitario y BPM de medicamentos a base de cannabis', 'Clase 2 · Medicamentos y fitoterapéuticos a base de cannabis', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la evaluación farmacológica, farmacéutica y legal de un medicamento con cannabinoides y los requisitos de BPM y control analítico de THC/CBD, con un registro real como ejemplo.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://webservice.invima.gov.co/registros/pdf/16506734_2024005286.pdf","title":"Resolución INVIMA 2024005286 — concede registro sanitario INVIMA 2024M-0021290 (cannabidiol 100 mg/mL solución oral)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_1160_2016.htm","title":"[Página web] Resolución 1160 de 2016 — Manuales de Buenas Prácticas de Manufactura","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/biblioteca/preview/122395","title":"[Página web] Marco normativo: cannabis para uso médico y científico (documento INVIMA, contexto 2016–2018)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Fitoterapéuticos con cannabis', 'Clase 2 · Medicamentos y fitoterapéuticos a base de cannabis', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara la vía de fitoterapéutico (Decreto 1156/2018) con la de medicamento de síntesis y sus limitaciones para extractos de cannabis.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://consultorsalud.com/?p=19254","title":"[Página web] Reglamentación de productos fitoterapéuticos incluido el cannabis: Decreto 1156 de 2018","description":"Consultorsalud (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.asuntoslegales.com.co/analisis/monica-bonnett-529291/registros-sanitarios-de-productos-derivados-de-cannabis-2829059","title":"[Página web] Registros sanitarios de productos derivados de cannabis (análisis 2019)","description":"Asuntos Legales (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Buenas Prácticas de Elaboración (BPE) de preparaciones magistrales con cannabis', 'Clase 3 · Preparaciones magistrales y flor medicinal', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los requisitos de la guía ASS-AYC-GU017: formas no estériles, proveedores licenciados, prescripción individual, estabilidad y trazabilidad.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Flor como producto terminado y nueva reglamentación técnica (2025–2026)', 'Clase 3 · Preparaciones magistrales y flor medicinal', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las nuevas reglas: materia prima nacional obligatoria para magistrales, flor medicinal, reglamentación técnica del INVIMA, trazabilidad SEED y SICAMED.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.publimetro.co/noticias/2026/02/26/se-acaba-el-limbo-el-invima-tiene-pronta-fecha-para-fijar-las-reglas-del-cannabis-medicinal-en-colombia/","title":"[Página web] Se acaba el limbo: el INVIMA tiene pronta fecha para fijar las reglas del cannabis medicinal","description":"Publimetro Colombia (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.asuntoslegales.com.co/actualidad/invima-tiene-plazo-hasta-marzo-para-reglamentar-uso-medicinal-del-cannabis-en-colombia-4337894","title":"[Página web] INVIMA tendrá plazo hasta marzo para reglamentar uso medicinal del cannabis en Colombia","description":"Asuntos Legales (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.saludyfarmacos.org/lang/en/boletin-farmacos/boletines/may202603/10_co","title":"[Página web] Colombia: reglamentación técnica del cannabis medicinal (Boletín Fármacos, mayo 2026)","description":"Salud y Fármacos (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: certificación BPE de una farmacia magistral con alcance cannabis', 'Clase 3 · Preparaciones magistrales y flor medicinal', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la preparación de la solicitud y la visita de certificación BPE con alcance cannabis ante el INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_1138_2025.htm","title":"[Página web] Decreto 1138 de 2025 — modifica parcialmente el Título 11 del Decreto 780 de 2016 (flor como producto terminado, licencias de uso nacional y exportación)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Cosméticos con CBD', 'Clase 4 · Productos de uso humano no medicinal', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las condiciones para cosméticos con derivados no psicoactivos: NSO, límite de THC, trazabilidad y prohibición de claims terapéuticos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: identificar las condiciones para comercializar cosméticos con derivados no psicoactivos de cannabis (CBD) en Colombia y los errores regulatorios más comunes.</p><p>Desarrollo: el Decreto 811 de 2021 define los \"fines industriales\" e incluye expresamente los usos cosméticos del grano, el componente vegetal y los derivados no psicoactivos para uso humano y veterinario, con la condición de que el producto no tenga una cantidad de THC (incluidos isómeros, sales y formas ácidas) igual o superior al límite de fiscalización fijado por MinSalud (0,2 % según la Res. 315 de 2020, citada en la Res. 227 de 2022). Por tanto, un cosmético con CBD no es un producto de cannabis \"medicinal\": sigue el régimen andino de cosméticos (Notificación Sanitaria Obligatoria — NSO ante el INVIMA), con los requisitos generales de composición, etiquetado, BPM cosméticas y vigilancia del mercado.</p><p>Condiciones prácticas: (1) materia prima trazable: el derivado debe provenir de un fabricante con licencia de fabricación de derivados (el INVIMA las expide) y venir con certificado de análisis que cuantifique THC y CBD; (2) THC del producto final por debajo del límite de fiscalización; (3) ingredientes aceptados en listados internacionales de referencia para cosméticos; (4) declaraciones exclusivamente cosméticas: un cosmético no puede atribuirse efectos sobre dolor, inflamación, insomnio, ansiedad u otras enfermedades; y (5) publicidad y etiquetado sin imágenes ni mensajes que sugieran uso psicoactivo o terapéutico. Desde 2019 la base del INVIMA ya registraba decenas de cosméticos con \"cannabis\" en el nombre, y el INVIMA ha emitido alertas por productos que se promocionan como medicamentos sin registro.</p><p>Ejemplo aplicado: una marca quiere lanzar un \"bálsamo de CBD para el dolor muscular\". El QF debe: retirar la palabra \"dolor\" y cualquier indicación terapéutica; verificar el CoA del proveedor (THC &lt; 0,2 %); confirmar la licencia del proveedor; ajustar el arte de etiqueta; y tramitar la NSO. Si la marca insiste en la indicación analgésica, el producto debe ir por la vía de medicamento (fitoterapéutico o de síntesis) con registro sanitario.</p><p>Puntos clave:<br>1. El CBD en cosméticos es un uso industrial permitido si el THC queda bajo el límite de fiscalización.<br>2. La vía es la NSO de cosméticos, no el registro de medicamentos, y no admite claims terapéuticos.<br>3. La trazabilidad del derivado (licencia del proveedor + CoA) es el punto que más se revisa en inspección.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Alimentos, bebidas y suplementos dietarios con cannabis', 'Clase 4 · Productos de uso humano no medicinal', 7, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta lo permitido por la Res. 227 de 2022 (componentes no psicoactivos, grano, THC &lt; 0,2 %, suplementos sin liberación modificada) y el proyecto de resolución sobre alimentos con CBD.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cms.law/es/col/publication/cannabis-en-alimentos-bebidas-alcoholicas-y-suplementos-dietarios","title":"[Página web] Cannabis en alimentos, bebidas alcohólicas y suplementos dietarios","description":"CMS Rodríguez-Azuero (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://consultorsalud.com/reglamentan-uso-medicinal-cannabis-res-227-2022/","title":"[Página web] Reglamentan uso medicinal e industrial del cannabis en Colombia (Res. 227 de 2022)","description":"Consultorsalud (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://radionacional.co/actualidad/salud/requisitos-alimentos-base-de-cannabis-en-colombia-invima","title":"[Página web] Requisitos para alimentos a base de cannabis en Colombia, según el INVIMA","description":"Radio Nacional de Colombia (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: clasificar un portafolio de productos con cannabis', 'Clase 4 · Productos de uso humano no medicinal', 8, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica un árbol de decisión para asignar la vía sanitaria a cuatro productos y preparar su ruta de trámite.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: decidir la vía sanitaria correcta para un portafolio de productos con cannabis y preparar la ruta de trámites ante el INVIMA.</p><p>Desarrollo: use el siguiente árbol de decisión. Pregunta 1: ¿el producto tiene finalidad terapéutica, preventiva o diagnóstica declarada? Si sí, es medicamento: (a) molécula aislada o sintética (p. ej. CBD aislado) → registro sanitario de medicamento (Decreto 677/1995, evaluación farmacológica ante la Sala Especializada de Medicamentos); (b) extracto vegetal estandarizado de cannabis no psicoactivo → evaluar la vía de fitoterapéutico (Decreto 1156/2018) y el listado de plantas aceptadas, consultando a la Sala Especializada; (c) preparación individualizada para un paciente con prescripción → preparación magistral en establecimiento con certificación BPE con alcance cannabis (no requiere registro). Si no tiene finalidad terapéutica, pregunta 2: ¿es un cosmético, alimento, bebida o suplemento? → uso industrial: solo derivados no psicoactivos, THC bajo el límite de fiscalización, NSO (cosméticos) o registro/permiso sanitario (alimentos, suplementos) con las condiciones de la Res. 227/2022. Pregunta 3: ¿contiene THC ≥ límite de fiscalización? → producto fiscalizado (control especial, FNE).</p><p>Caso práctico: una empresa presenta cuatro productos: 1) gotas de CBD 100 mg/mL para epilepsia refractaria; 2) gomitas con CBD \"para dormir mejor\"; 3) crema de cáñamo hidratante; 4) aceite con 10 % de THC para dolor oncológico de un paciente específico. Resolución: 1) medicamento con registro sanitario (existe precedente: registro INVIMA 2024M-0021290, CBD 100 mg/mL solución oral, modalidad fabricar y vender); 2) no puede comercializarse con esa declaración: como suplemento no se admiten claims terapéuticos ni formas de liberación modificada, y el CBD como ingrediente requiere evaluación de la Sala Especializada de Productos Fitoterapéuticos y Suplementos Dietarios; como alimento, el proyecto de resolución de MinSalud sobre alimentos con CBD (2024) excluía productos dirigidos a niños: verifique si ya fue expedido antes de decidir; 3) cosmético con NSO, sin claims terapéuticos; 4) preparación magistral en farmacia con BPE cannabis, derivado psicoactivo nacional con cupo FNE, prescripción individual.</p><p>Puntos clave:<br>1. La declaración de uso (claim) define la vía regulatoria más que el ingrediente.<br>2. Cannabis psicoactivo solo tiene salida médica o científica; los usos industriales exigen THC bajo el límite de fiscalización.<br>3. Documente la decisión en una ficha de clasificación firmada por el QF y, ante duda, solicite concepto a la Sala Especializada del INVIMA.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Exportación, vigilancia y farmacovigilancia', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: el cannabis colombiano fuera del laboratorio', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume los retos de exportación, vigilancia del mercado, publicidad y seguridad del paciente.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=1Ss_MatQzik","provider":"youtube","videoId":"1Ss_MatQzik","title":"Colombia autoriza venta de marihuana medicinal en droguerías: lo que debe saber","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cesed.uniandes.edu.co/wp-content/uploads/2023/12/Cannabisentrega3_DIAGRAMADO-1.pdf","title":"Cannabis legal: desafíos de la industria de cannabis para usos médicos y científicos en Colombia (Documento temático 41)","description":"CESED — Universidad de los Andes (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Exportación de flor seca y derivados: Resolución 539 de 2022 y mercados destino', 'Clase 2 · Exportación', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el marco de exportación de flor seca y derivados, destinos y barreras reportadas por la industria.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.bloomberglinea.com/latinoamerica/colombia/exportacion-de-flor-seca-de-cannabis-cuanto-se-ha-vendido-y-a-que-destinos/","title":"[Página web] Exportación de flor seca de cannabis: ¿cuánto se ha vendido y a qué destinos?","description":"Bloomberg Línea (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.bluradio.com/nacion/gobierno-autoriza-exportacion-de-flor-seca-de-cannabis-para-uso-medicinal","title":"[Página web] Gobierno autoriza exportación de flor seca de cannabis para uso medicinal","description":"Blu Radio (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: ruta regulatoria para exportar un extracto de cannabis', 'Clase 2 · Exportación', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la planificación de una exportación de un derivado psicoactivo, desde la licencia hasta la conciliación de cupo.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: estructurar la ruta regulatoria para exportar un derivado de cannabis (extracto) o flor seca desde Colombia.</p><p>Desarrollo: la exportación es una modalidad de las licencias (art. 2.8.11.2.1.3 para fabricación de derivados; arts. 2.8.11.2.1.6 y 2.8.11.2.1.7 para cultivo). El Decreto 1138 de 2025 creó la modalidad \"uso nacional y exportación\" para cultivos psicoactivos y no psicoactivos, y aclaró que los licenciatarios con modalidad de exportación vigente no necesitan modificar su licencia. La Res. 227 de 2022 (art. 7) exige indicar el material a exportar y los países de destino, cuyo marco legal debe permitir la importación (para cannabis psicoactivo, con fines médicos y científicos). La exportación de flor seca se habilitó con el Decreto 811 de 2021 y se operó a partir de la Resolución 539 de 2022 (MinCIT, MinAgricultura, MinJusticia).</p><p>Ruta para un extracto psicoactivo (simulación): 1) licencia de fabricación de derivados con modalidad exportación (INVIMA); 2) inscripción FNE y cupo de fabricación que incluya el volumen exportable; 3) verificación de la autorización de importación del país destino (bajo la Convención Única de 1961, la exportación de estupefacientes requiere certificado de importación de la autoridad del destino y autorización de exportación del país de origen); 4) solicitud de autorización/licencia de exportación ante el FNE y trámites en VUCE; 5) certificado de análisis y, si el destino lo exige, certificado de BPM (p. ej. EU-GMP para Alemania); 6) requisitos de transporte y protocolo de seguridad de la Res. 227 (capítulo 5); 7) reporte de la salida y conciliación de cupo. Para flor seca, adicionar los requisitos fitosanitarios del ICA.</p><p>Ejemplo: en 2023 el ICA reportó 65 exportaciones de flor seca, con destinos principales Australia, Suiza, Alemania y Estados Unidos; los exportadores señalaron como cuellos de botella la demora en cupos y los requisitos cambiantes del país destino.</p><p>Puntos clave:<br>1. Exportar requiere modalidad de exportación en la licencia, cupo y autorización del país importador.<br>2. El país destino define los estándares de calidad (GMP, farmacopea, límites de cannabinoides): planifíquelos desde el diseño del producto.<br>3. Mantenga una matriz por país destino con requisitos, vigencias y contactos, y revísela antes de cada embarque, porque los requisitos de importación de flor medicinal cambian con frecuencia y un certificado vencido detiene la carga en aduana.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Farmacovigilancia de medicamentos y magistrales con cannabis', 'Clase 3 · Vigilancia sanitaria y farmacovigilancia', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las obligaciones de farmacovigilancia y los riesgos específicos (interacciones CYP, hepatotoxicidad, efectos psicoactivos, menores).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: describir cómo se aplica la farmacovigilancia a medicamentos y preparaciones magistrales a base de cannabis en Colombia.</p><p>Desarrollo: los medicamentos con cannabis registrados ante el INVIMA (de síntesis, aislados como CBD o fitoterapéuticos) están sujetos al mismo sistema de farmacovigilancia de cualquier medicamento: el titular del registro debe tener un programa con responsable designado, notificar eventos adversos y problemas relacionados con medicamentos al Programa Nacional de Farmacovigilancia del INVIMA, gestionar señales y presentar informes periódicos de seguridad cuando aplique. Las preparaciones magistrales con derivados de cannabis también requieren seguimiento: la guía ASS-AYC-GU017 del INVIMA exige trazabilidad de cada preparación hasta la institución y el paciente, prescripción individual y evidencia de uso clínico, lo cual permite investigar casos. Las alertas sanitarias del INVIMA sobre productos de cannabis sin registro (por ejemplo, la Alerta 170-2025 sobre aceites y mieles artesanales promocionados para artritis, cáncer, depresión o epilepsia, y la Alerta 079-2022 sobre gomitas y aceites con CBD fraudulentos) piden a la ciudadanía y a los programas institucionales reportar eventos adversos.</p><p>Aspectos específicos del cannabis: (1) interacciones farmacocinéticas: el CBD inhibe isoenzimas del citocromo P450 (CYP3A4, CYP2C19) y puede elevar niveles de clobazam, warfarina u otros fármacos; (2) hepatotoxicidad (elevación de transaminasas) descrita con CBD a dosis altas; (3) efectos psicoactivos, sedación, mareo, taquicardia e hipotensión con THC; (4) uso en menores: la Ley 1787 de 2016 exige que padres o tutores reciban información del médico tratante antes de consentir terapias con cannabis psicoactivo; (5) variabilidad de potencia entre lotes en productos no estandarizados, uno de los focos de la nueva reglamentación técnica derivada del Decreto 1138 de 2025 (potencia constante por lote, etiquetado con riesgos, trazabilidad hasta el paciente vía SEED).</p><p>Ejemplo aplicado: una IPS reporta somnolencia severa en un paciente que recibe una preparación magistral con THC/CBD junto con clonazepam. El QF del establecimiento magistral identifica el lote y la prescripción, notifica al INVIMA, revisa la interacción y propone ajuste de dosis al médico; si hay varios casos, se analiza la consistencia de potencia del extracto proveedor.</p><p>Puntos clave:<br>1. Mismas obligaciones de farmacovigilancia que cualquier medicamento, con especial atención a interacciones CYP y hepatotoxicidad.<br>2. La trazabilidad lote–paciente es la herramienta clave en magistrales.<br>3. Los productos sin registro son un riesgo sanitario: reporte y oriente a consultar el registro en la base del INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Productos fraudulentos y alertas sanitarias del INVIMA', 'Clase 3 · Vigilancia sanitaria y farmacovigilancia', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Analiza alertas reales sobre productos de cannabis sin registro y cómo orientar a pacientes y establecimientos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/download/100716","title":"Alerta sanitaria INVIMA No. 170-2025 — productos artesanales de cannabis sin registro sanitario","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/alertas-sanitarias/new-pharma-hemp-gummies-150mg-o-450mg-new-pharma-premium-hemp-oil-300mg-o-600mg-y-new-pharma-hemp-gummies-75mg","title":"[Página web] Alerta INVIMA 079-2022 — NEW PHARMA HEMP GUMMIES / HEMP OIL (productos con CBD fraudulentos)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/biblioteca/download/100832","title":"Alerta sanitaria INVIMA No. 079-2022 (documento completo)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: auditoría de publicidad, trazabilidad y cumplimiento de un licenciatario', 'Clase 3 · Vigilancia sanitaria y farmacovigilancia', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica los requisitos de publicidad (Res. 227, cap. 8), trazabilidad (SEED, SICAMED) y reportes en una auditoría simulada.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://sidn.ramajudicial.gov.co/SIDN/NORMATIVA/TEXTOS_COMPLETOS/8_RESOLUCIONES/RESOLUCIONES 2026/Resolucion 1241 de 2026.pdf","title":"Resolución 1241 de 2026 (MinSalud–MinCIT) — reglamenta el art. 2.8.11.5.7 del Decreto 780/2016 y crea el SICAMED","description":"Rama Judicial — SIDN (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.asuntoslegales.com.co/actualidad/invima-tiene-plazo-hasta-marzo-para-reglamentar-uso-medicinal-del-cannabis-en-colombia-4337894","title":"[Página web] INVIMA tendrá plazo hasta marzo para reglamentar uso medicinal del cannabis en Colombia","description":"Asuntos Legales (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Tendencias internacionales y casos integradores', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: Colombia en el mapa global del cannabis medicinal', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume el contexto internacional y prepara los casos integradores del curso.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=QfVxSghDlpU","provider":"youtube","videoId":"QfVxSghDlpU","title":"Regulación del cannabis medicinal en Colombia: le contamos lo que propone este proyecto de decreto","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.eltiempo.com/justicia/investigacion/panorama-del-cannabis-medicinal-en-colombia-a-8-anos-de-su-regulacion-el-mercado-no-florece-3385439","title":"[Página web] Panorama del cannabis medicinal en Colombia a 8 años de su regulación: el mercado no florece","description":"El Tiempo (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Reclasificación del cannabis en la ONU (OMS 2019 – CND 2020)', 'Clase 2 · Tendencias internacionales', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las recomendaciones de la OMS y la decisión de la Comisión de Estupefacientes de 2020 y su efecto en el control internacional.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.tni.org/es/publicacion/re-clasificacion-del-cannabis-una-introduccion-global","title":"[Página web] Re-clasificación del cannabis: una introducción global","description":"Transnational Institute / IDPC (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Estados Unidos: reclasificación parcial a Lista III (2025–2026) y otros mercados', 'Clase 2 · Tendencias internacionales', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara la orden final de la DEA de abril de 2026 con los marcos de otros mercados de exportación y sus implicaciones para Colombia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.foley.com/es/insights/publications/2026/04/dea-issues-long-awaited-final-order-rescheduling-certain-marijuana-products-to-schedule-iii-what-it-means-what-it-doesnt-and-what-comes-next/","title":"[Página web] Marihuana: algunos productos reclasificados en la Lista III — qué significa y qué vendrá después (abril 2026)","description":"Foley & Lardner (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://allende.com/life-sciences/ee-uu-flexibiliza-la-clasificacion-de-ciertos-productos-de-cannabis-medicinal-04-23-2026/","title":"[Página web] EE. UU. flexibiliza la clasificación de ciertos productos de cannabis medicinal","description":"Allende & Brea (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Desafíos de la industria colombiana: mercado, pequeños cultivadores y competitividad', 'Clase 2 · Tendencias internacionales', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Analiza los datos de licencias, registros y exportaciones y las críticas al modelo regulatorio.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=DJ_5gMbzI_w","provider":"youtube","videoId":"DJ_5gMbzI_w","title":"La promesa del cannabis medicinal se esfuma para los pequeños productores","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cesed.uniandes.edu.co/wp-content/uploads/2023/12/Cannabisentrega3_DIAGRAMADO-1.pdf","title":"Cannabis legal: desafíos de la industria de cannabis para usos médicos y científicos en Colombia (Documento temático 41)","description":"CESED — Universidad de los Andes (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso integrador: lanzamiento de un medicamento con cannabinoides', 'Clase 3 · Casos integradores', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta un plan regulatorio completo (clasificación, licencias, cupos, BPM, registro, farmacovigilancia) para un medicamento con CBD y una extensión con THC.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: integrar licencias, cupos, registro sanitario, BPM y farmacovigilancia en el plan de lanzamiento de un medicamento a base de cannabis.</p><p>Caso: Laboratorio Andino S.A.S. (ficticio) quiere lanzar en Colombia una solución oral de CBD 100 mg/mL de extracto de cannabis no psicoactivo fabricado en planta propia, y en una segunda fase una solución con THC:CBD 1:1 para espasticidad.</p><p>Fase 1 — CBD: 1) Clasificación: si el CBD es aislado (molécula definida), la vía es medicamento bajo el Decreto 677/1995; si es extracto estandarizado de espectro amplio, evaluar con la Sala Especializada si califica como fitoterapéutico o como medicamento nuevo. 2) Licencias: licencia de fabricación de derivados no psicoactivos ante el INVIMA (sin cupos mientras el material se mantenga no psicoactivo); proveedor de flor con licencia de cultivo no psicoactivo (MinJusticia). Si el extracto en proceso supera el límite de fiscalización, aplica control FNE. 3) BPM: certificación de la planta (Res. 1160/2016), validación del método analítico de cannabinoides (THC, CBD, CBN) e impurezas, estudios de estabilidad. 4) Registro: dossier con evaluación farmacológica (eficacia y seguridad, p. ej. en epilepsias refractarias), farmacéutica y legal; existe un precedente de registro de CBD 100 mg/mL solución oral (INVIMA 2024M-0021290). 5) Comercial: publicidad solo a profesionales de la salud según condición de venta. 6) Farmacovigilancia: plan de gestión de riesgos con foco en hepatotoxicidad e interacciones.</p><p>Fase 2 — THC:CBD: requiere licencia de fabricación de derivados (psicoactivos), inscripción y cupo ante el FNE, proveedores psicoactivos con cupo (considerando el régimen transitorio del Decreto 1138/2025 que prioriza a pequeños y medianos), clasificación como medicamento de control especial (Res. 1478/2006 y Res. 315/2020), y evaluación de evidencia clínica para la indicación.</p><p>Entregables del estudiante: cronograma (Gantt) con dependencias, matriz de autoridades (INVIMA, MinJusticia, FNE, ICA), lista de chequeo del dossier y estimación de tarifas INVIMA 2026 en UVB.</p><p>Puntos clave:<br>1. Licencia, cupo y registro son trámites distintos con autoridades distintas: el cronograma debe tratarlos en paralelo.<br>2. El nivel de THC determina si el proyecto entra en control especial.<br>3. El precedente regulatorio (registros ya concedidos) reduce incertidumbre en la evaluación farmacológica; consúltelo en la base de registros del INVIMA antes de diseñar el dossier y cite las actas de la Sala Especializada pertinentes.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso integrador: pequeño cultivador y flor medicinal bajo el Decreto 1138 de 2025', 'Clase 3 · Casos integradores', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica el régimen transitorio, el SICAMED y la reglamentación técnica pendiente a un caso de asociación de pequeños cultivadores.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar las disposiciones del Decreto 1138 de 2025 y la Resolución 1241 de 2026 al caso de un pequeño cultivador que quiere vender flor como producto terminado con fines médicos.</p><p>Caso: una asociación de pequeños cultivadores del Cauca tiene licencia de cultivo psicoactivo con modalidad de fabricación de derivados y quiere vender flor seca a farmacias para pacientes con prescripción.</p><p>Análisis: 1) Base normativa: el Decreto 1138 de 2025 (27 de octubre de 2025) amplió la definición de producto terminado y habilitó la flor como producto terminado con fines médicos, que solo podrá venderse con esa finalidad; dio cinco meses a MinJusticia, MinAgricultura y MinSalud para expedir la reglamentación técnica, al INVIMA para la guía de BPE, a MinJusticia para el trámite simplificado de licencias de pequeños y medianos, y a MinSalud y MinCIT para el fomento de la comercialización. 2) Ventana transitoria: durante dos años desde la entrada en vigor de esa reglamentación, solo pequeños y medianos cultivadores y micro/pequeñas empresas podrán abastecer materia prima para el mercado médico nacional (art. 16); la condición de microempresa se verifica en el RUES. 3) Fomento: la Resolución 1241 de 2026 (MinSalud–MinCIT, 4 de agosto de 2026) creó el SICAMED, sistema de apoyo, vitrina comercial y trazabilidad administrado por MinCIT, con plan piloto de tres años; el registro en SICAMED no valida licencias ni registros sanitarios. 4) Pendientes: a la fecha de este curso (oct. 2026) estaba en curso un proyecto de decreto que modificaría el art. 16 hacia una apertura por fases (fase 1 para cultivadores de cinco municipios del Norte del Cauca), y la reglamentación técnica del INVIMA sobre calidad, analítica de cannabinoides, BPE, etiquetado, dispensación y trazabilidad con el sistema SEED. El estudiante debe verificar su estado en el normograma antes de recomendar.</p><p>Tareas: (a) listar los trámites que la asociación necesitaría (modificación de licencia a \"uso nacional y exportación\" si no la tiene, certificado ICA, autorización sanitaria del producto terminado, cupo, inscripción FNE si es fiscalizado, inscripción voluntaria en SICAMED); (b) identificar riesgos (contaminación microbiológica y metales pesados en flor, potencia variable, almacenamiento); (c) proponer un plan de calidad mínimo (CoA por lote, cuarentena, etiquetado con THC y CBD).</p><p>Puntos clave:<br>1. La flor como producto terminado medicinal es una novedad de 2025 cuya reglamentación técnica es progresiva.<br>2. El régimen transitorio favorece a pequeños y medianos, pero no los exime de requisitos sanitarios.<br>3. Antes de asesorar, verifique siempre la norma vigente: el marco del cannabis cambió en 2021, 2022, 2025 y 2026.</p>"}'::jsonb);

END
$curso$;

-- ─── 18. Curso de Asuntos Regulatorios de Radiofármacos (34 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Asuntos Regulatorios de Radiofármacos' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Asuntos Regulatorios de Radiofármacos', 'Curso especializado en la regulación de radiofármacos y radiofarmacias en Colombia: certificación BPER (Res. 560 de 2024), registro e importación, autorizaciones radiológicas del Ministerio de Minas y Energía/Servicio Geológico Colombiano, transporte de material radiactivo y control de calidad según OMS/OIEA.', '<p>Curso especializado en la regulación de radiofármacos y radiofarmacias en Colombia: certificación BPER (Res. 560 de 2024), registro e importación, autorizaciones radiológicas del Ministerio de Minas y Energía/Servicio Geológico Colombiano, transporte de material radiactivo y control de calidad según OMS/OIEA. Integra diagnóstico, PET y teranósticos con casos prácticos de trámites reales.</p><h3>Objetivo general</h3><p>Que el QF identifique, interprete y gestione los requisitos sanitarios y radiológicos aplicables a radiofármacos y radiofarmacias en Colombia, desde la certificación BPER y el registro sanitario hasta las autorizaciones del SGC, el transporte y la liberación de lotes de vida media corta.</p><h3>A quién va dirigido</h3><p>Químicos farmacéuticos de asuntos regulatorios, directores técnicos de radiofarmacias, profesionales de calidad de servicios de medicina nuclear e importadores de radiofármacos en Colombia.</p><h3>Contexto normativo</h3><p>Colombia — normativa INVIMA / MinSalud</p>',
          'Asuntos regulatorios — productos especiales', 'intermedio', 'Que el QF identifique, interprete y gestione los requisitos sanitarios y radiológicos aplicables a radiofármacos y radiofarmacias en Colombia, desde la certificación BPER y el registro sanitario hasta las autorizaciones del SGC, el transporte y la liberación de lotes de vida media corta.', 'Químicos farmacéuticos de asuntos regulatorios, directores técnicos de radiofarmacias, profesionales de calidad de servicios de medicina nuclear e importadores de radiofármacos en Colombia.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Fundamentos de radiofármacos y radiofarmacia', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: el radiofármaco como medicamento y material radiactivo', 'Clase 1 · Introducción al curso', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante conoce el alcance del curso y la doble naturaleza regulatoria del radiofármaco (sanitaria y radiológica) en Colombia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=sNo-BQQZY1I","provider":"youtube","videoId":"sNo-BQQZY1I","title":"Radiofármaco","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://iaea.org/sites/default/files/13105891319_es.pdf","title":"Radiofármacos – W. Wolf y A. T. Balaban (Boletín OIEA)","description":"OIEA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Radiofármaco, radionúclido, kit frío, generador y precursor', 'Clase 2 · Conceptos esenciales', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las definiciones normativas de la Res. 560 de 2024 y las relaciona con productos reales (99mTc, 68Ga, 131I).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=Ncq3gsyiAeU","provider":"youtube","videoId":"Ncq3gsyiAeU","title":"Farmacopea. Radiofármacos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_0560_2024.htm","title":"[Página web] Resolución 560 de 2024 – Requisitos para la certificación en Buenas Prácticas de Elaboración de Radiofármacos (BPER)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://journals.unam.mx/index.php/req/article/download/66633/58533/194037","title":"Radiofarmacia y radioinmunoanálisis – Educación Química (UNAM)","description":"UNAM – Educación Química (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Diagnóstico, terapia, PET y teranóstica', 'Clase 2 · Conceptos esenciales', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los radiofármacos de diagnóstico SPECT/PET y de terapia, sus radionúclidos (18F, 99mTc, 131I, 177Lu) y vidas medias.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=DasFDevASwI","provider":"youtube","videoId":"DasFDevASwI","title":"Radiofármacos para la detección precoz de enfermedades","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=RjjQJQ_8mFE","provider":"youtube","videoId":"RjjQJQ_8mFE","title":"Uso de \"radiofármacos\" en el tratamiento de pacientes con cáncer","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.iaea.org/sites/default/files/15205681319_es.pdf","title":"Las drogas radiactivas en la medicina clínica (Boletín OIEA)","description":"OIEA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Producción de radionúclidos: reactor, ciclotrón y generadores', 'Clase 2 · Conceptos esenciales', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta cómo el origen del radionúclido condiciona la logística, la cadena de suministro y la regulación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=qD0X4JS1iuI","provider":"youtube","videoId":"qD0X4JS1iuI","title":"El ciclotrón permite la fabricación de radiofármacos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=PbnPvoGSEe4","provider":"youtube","videoId":"PbnPvoGSEe4","title":"Proyecto del Ciclotrón creará radiofármacos y diagnosticará enfermedades de ticos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://iaea.org/sites/default/files/publications/magazines/bulletin/bull56-1/56105811213_es.pdf","title":"Garantizar la calidad actuando a nivel local: el OIEA ayuda a Cuba a producir radiofármacos (Boletín OIEA)","description":"OIEA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Tipos de radiofarmacia: hospitalaria, centralizada e industrial', 'Clase 3 · La radiofarmacia y el servicio de medicina nuclear', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Diferencia los tres tipos de radiofarmacia definidos en la Res. 560 de 2024 y sus implicaciones regulatorias.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=YyEjGqSkM64","provider":"youtube","videoId":"YyEjGqSkM64","title":"Radiofarmacia en el INC","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_0560_2024.htm","title":"[Página web] Resolución 560 de 2024 – Requisitos para la certificación en Buenas Prácticas de Elaboración de Radiofármacos (BPER)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Organización del servicio de medicina nuclear y funciones del QF', 'Clase 3 · La radiofarmacia y el servicio de medicina nuclear', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume las áreas, el personal y las funciones del químico farmacéutico en radiofarmacia y medicina nuclear.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://fisiquimicamente.com/recursos-fisica-quimica/radiofisica/ciclos-formativos/imagen-diagnostico-medicina-nuclear/tecnicas-radiofarmacia/TEMA1.pdf","title":"Técnicas de Radiofarmacia – Tema 1: el servicio de medicina nuclear","description":"Fisiquimicamente (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: mapa de actores y autorizaciones de un servicio con radiofarmacia', 'Clase 4 · Caso práctico de la unidad', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Construye el mapa de autoridades, autorizaciones y vigencias para una IPS que prepara 99mTc a partir de generador y kits.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: identificar, para un servicio real de medicina nuclear, qué autoridad regula cada eslabón de la cadena del radiofármaco y qué documento habilitante debe existir.</p><p>Desarrollo: en Colombia el radiofármaco tiene una doble naturaleza: es un medicamento (competencia sanitaria de MinSalud e INVIMA) y es material radiactivo (competencia del Ministerio de Minas y Energía y de su entidad delegada, el Servicio Geológico Colombiano – SGC). A ello se suma la habilitación del servicio de medicina nuclear, que verifican las secretarías departamentales y distritales de salud. Por eso, antes de cualquier trámite, el QF de asuntos regulatorios debe construir un \"mapa de actores\". Los eslabones típicos son: (1) fabricante industrial o proveedor extranjero del kit, generador o radionúclido; (2) importador, que necesita licencia de importación de material radiactivo (Res. MinMinas 181419 de 2004) y, para el producto farmacéutico, registro sanitario o la autorización que aplique ante INVIMA; (3) transportador, sujeto al Reglamento para el Transporte Seguro de Materiales Radiactivos (Res. 40306 de 2024, que derogó la Res. 181682 de 2005); (4) radiofarmacia hospitalaria o centralizada, que necesita certificado BPER del INVIMA si realiza procesos especiales (Res. 560 de 2024) y autorización del SGC para el manejo de fuentes no selladas (Res. 90874 de 2014, modificada por Res. 41226 de 2016 y 40234 de 2024); (5) IPS con servicio de medicina nuclear habilitado; (6) gestión de desechos radiactivos (Res. 180005 de 2010).</p><p>Ejemplo aplicado: una IPS de Medellín quiere iniciar estudios de perfusión miocárdica con 99mTc-sestamibi preparado in situ a partir de un generador 99Mo/99mTc y kits fríos importados. El mapa resultante es: kit con registro sanitario INVIMA vigente (verificable en la consulta de registros INVIMA); generador importado con licencia de importación de MinMinas; autorización del SGC para la instalación (manejo de material radiactivo no sellado); certificado BPER del INVIMA, porque radiomarcar kits es un proceso especial; habilitación del servicio ante la secretaría de salud; y contrato con transportador que cumpla la Res. 40306/2024. Si la IPS solo recibiera dosis listas para usar desde una radiofarmacia centralizada certificada, se trataría de un proceso general: no necesita BPER, pero sí cumplir el anexo técnico en lo aplicable y obtener concepto sanitario del INVIMA.</p><p>Puntos clave:<br>1. Todo radiofármaco tiene doble control: sanitario (MinSalud/INVIMA) y radiológico (MinMinas/SGC); ninguna autorización sustituye a la otra.<br>2. El tipo de proceso que realiza la radiofarmacia (general o especial) define si se exige el certificado BPER.<br>3. Documente el mapa de actores con número de licencia, vigencia y titular de cada autorización; es la base de la matriz de cumplimiento regulatorio.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Marco sanitario colombiano: BPER, certificación y registro', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: evolución normativa de la BPER (Res. 444/2008 → 4245/2015 → 560/2024)', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la evolución de la regulación de radiofarmacias en Colombia y las sucesivas prórrogas de plazo hasta la norma vigente.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://minsalud.gov.co/salud/medicamentos-y-tecnologias/Paginas/radiofarmacos.aspx","title":"[Página web] Radiofármacos – normatividad y consultas públicas (MinSalud)","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_4245_2015.htm","title":"[Página web] Resolución 4245 de 2015 (derogada por Res. 560/2024) – antecedente BPER","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://consultorsalud.com/certificacion-bmp-de-las-radiofarmacias","title":"[Página web] Estos son los nuevos plazos que tendrán las radiofarmacias para seguir operando","description":"ConsultorSalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Objeto, ámbito, definiciones y competencias de la Res. 560/2024', 'Clase 2 · Resolución 560 de 2024', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el objeto, ámbito, exclusiones (radiofarmacia industrial) y el reparto de competencias entre INVIMA, SGC y secretarías de salud.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_0560_2024.htm","title":"[Página web] Resolución 560 de 2024 – Requisitos para la certificación en Buenas Prácticas de Elaboración de Radiofármacos (BPER)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/MET/respuesta-comentarios-radiofarmacos-instrumento-abr2024.pdf","title":"Respuesta a comentarios del proyecto de resolución de radiofármacos (instrumento BPER, abril 2024)","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Procesos generales vs. procesos especiales: ¿quién necesita BPER?', 'Clase 2 · Resolución 560 de 2024', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica los criterios de la Res. 560/2024 para decidir si una radiofarmacia requiere certificado BPER o concepto sanitario.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: clasificar correctamente las actividades de una radiofarmacia según la Resolución 560 de 2024 para determinar si requiere certificado BPER o solo concepto sanitario.</p><p>Desarrollo: la Resolución 560 de 2024 (MinSalud), que derogó la Resolución 4245 de 2015 y la 529 de 2023, distingue tres tipos de radiofarmacia (hospitalaria, centralizada e industrial) y dos grupos de procesos. Los procesos generales (numeral 5.1) se limitan a la recepción y entrega de dosis listas para usar; requieren vigilancia y autorización del INVIMA, pero no certificación BPER (art. 14). Los procesos especiales (numerales 5.2.1 a 5.2.10) incluyen, entre otros, radiomarcación de kits, dilución y dosificación, marcación de muestras autólogas (p. ej. leucocitos), elaboración a partir de materias primas, liofilización, procesos orales para terapia y síntesis de radiofármacos PET. Estos sí requieren el certificado BPER. Las radiofarmacias centralizadas se consideran siempre de procesos especiales. Las industriales quedan fuera de la BPER y se rigen por las BPM que defina el Ministerio. La producción del radionúclido en reactor o ciclotrón no es parte de la BPER: se trata como materia prima.</p><p>El art. 6 añade que requieren BPER quienes elaboran preparaciones magistrales o adecuan, ajustan, reenvasan o reempacan dosis. Según la transitoriedad (art. 16), desde el 1 de abril de 2025 las radiofarmacias hospitalarias y centralizadas en funcionamiento deben tener el certificado; sin él no pueden realizar actividades de radiofarmacia. El certificado tiene vigencia de cinco años, y la renovación, las ampliaciones y la cancelación se rigen por el Decreto 335 de 2022.</p><p>Ejemplo aplicado: una clínica hace tres actividades: (a) recibe jeringas de 18F-FDG en dosis unitarias de un proveedor certificado; (b) diluye y fracciona una dosis de 131I para ajustarla a la prescripción; (c) marca kits de MDP con 99mTc. La actividad (a) es un proceso general, pero (b) y (c) son procesos especiales, así que la clínica necesita BPER con alcance que cubra dilución/dosificación y radiomarcación de kits. Si más adelante quiere marcar leucocitos, deberá tramitar una ampliación del certificado conforme al Decreto 335 de 2022.</p><p>Puntos clave:<br>1. El certificado BPER se define por proceso, no por el nombre de la institución: cada nuevo proceso especial implica revisar el alcance.<br>2. \"Solo recibir dosis listas\" no exime de cumplir el anexo técnico en lo aplicable ni de la vigilancia del INVIMA.<br>3. Desde el 1 de abril de 2025 operar procesos especiales sin BPER expone a medidas sanitarias de seguridad.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Anexo Técnico: requisitos de personal, instalaciones, documentación y calidad', 'Clase 2 · Resolución 560 de 2024', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la estructura del instrumento de verificación BPER y cómo usarlo para autoinspección.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_4245_2015.htm","title":"[Página web] Resolución 4245 de 2015 (derogada por Res. 560/2024) – antecedente BPER","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://consultorsalud.com/?p=19786","title":"[Página web] Radiofármacos, Radiofarmacias y certificación BPER","description":"ConsultorSalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Procedimiento de certificación, vigencia, renovación y ampliaciones (Decreto 335/2022)', 'Clase 3 · Certificación y registro sanitario', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el procedimiento de certificación BPER, la vigencia de 5 años y la gestión de ampliaciones y renovaciones.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_0335_2022.htm","title":"[Página web] Decreto 335 de 2022 – procedimiento de certificación BPM/BPER (art. 7 par. 2 radiofármacos)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Registro sanitario e importación de radiofármacos industriales', 'Clase 3 · Certificación y registro sanitario', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Distingue cuándo se requiere registro sanitario (kits, generadores, productos terminados) y cuándo no (preparaciones magistrales, PET).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: entender cuándo un radiofármaco necesita registro sanitario en Colombia y qué vacíos normativos existen para la fabricación industrial.</p><p>Desarrollo: Colombia no tiene un decreto específico de registro sanitario para radiofármacos. Los productos industriales terminados (kits fríos, generadores 99Mo/99mTc o 68Ge/68Ga, radiofármacos listos como 131I en cápsulas o 177Lu-PSMA) siguen el régimen general de medicamentos del Decreto 677 de 1995, con las modificaciones del Decreto 334 de 2022. Según el Análisis de Impacto Normativo publicado por MinSalud en 2024, la aplicación de requisitos pensados para medicamentos de síntesis química o biológicos a los radiofármacos genera ambigüedades. El mismo análisis reporta tiempos de registro de 18 a 24 meses y la ausencia de BPM específicas para radiofármacos industriales.</p><p>Para el certificado de BPM del fabricante extranjero, el Decreto 335 de 2022 (art. 7, parágrafo 2) acepta certificados de BPM de países productores de radiofármacos, radioisótopos de reactor, generadores y juegos de reactivos, siempre que estén autorizados para uso humano por su autoridad sanitaria. Por su parte, la Resolución 560 de 2024 (art. 6, parágrafo) indica que no requieren registro sanitario las preparaciones magistrales elaboradas o ajustadas a partir de insumos con o sin registro, los radiofármacos PET y los elaborados a partir de materias primas sin registro disponible. En los procesos especiales, algunos kits y radiofármacos sí deben contar con registro o autorización del INVIMA.</p><p>Ejemplo aplicado: un importador quiere comercializar kits de MAG3 y generadores de 68Ga. Para cada uno debe verificar si ya existe registro sanitario (consulta pública INVIMA) o preparar una solicitud nueva con dossier, apoyándose en el certificado de BPM del país de origen (Decreto 335/2022, art. 7, par. 2). Para el generador debe además obtener la licencia de importación de material radiactivo de MinMinas (Res. 181419/2004) y coordinar el transporte conforme a la Res. 40306/2024. En cambio, la 18F-FDG sintetizada en una radiofarmacia certificada para un paciente con prescripción médica no necesita registro, pero sí el certificado BPER de síntesis PET.</p><p>Puntos clave:<br>1. Distinga producto industrial terminado (registro sanitario) de preparación magistral en radiofarmacia (BPER, sin registro).<br>2. Use el art. 7, par. 2 del Decreto 335/2022 para el certificado BPM de fabricantes extranjeros de radiofármacos.<br>3. Vigile los proyectos normativos de BPM industriales para radiofármacos (AIN MinSalud 2024): pueden cambiar los requisitos.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: solicitud de certificación BPER de una radiofarmacia hospitalaria', 'Clase 4 · Caso práctico de la unidad', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta paso a paso la preparación y radicación de la solicitud BPER ante el INVIMA, incluida una ampliación posterior.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: ejecutar paso a paso la solicitud de certificación BPER de una radiofarmacia hospitalaria ante el INVIMA.</p><p>Desarrollo: el trámite combina la Resolución 560 de 2024 (requisitos e instrumento de verificación) con el Decreto 335 de 2022 (procedimiento de certificación de buenas prácticas). La secuencia práctica es: (1) definir el alcance: listar los procesos especiales que se realizarán (numerales 5.2.x de la Res. 560/2024), por ejemplo radiomarcación de kits y dilución/dosificación; (2) autoinspección con el Anexo Técnico y cierre de brechas; (3) reunir los requisitos documentales que exige el Decreto 335/2022: identificación del establecimiento, representación legal, director técnico, plano de áreas, lista de procesos y productos, y evidencias del sistema de calidad; (4) verificar las autorizaciones conexas: autorización del SGC para el manejo de material radiactivo no sellado y habilitación del servicio de medicina nuclear; (5) radicar la solicitud en la plataforma del INVIMA y pagar la tarifa vigente (expresada en UVB según la resolución de tarifas del INVIMA); (6) atender la visita de verificación; (7) responder dentro del plazo cualquier requerimiento o plan de mejora; y (8) recibir el certificado, válido por cinco años, e incorporar en el plan de vigilancia la fecha de renovación y los cambios que requieran ampliación.</p><p>Ejemplo aplicado: la radiofarmacia de un hospital universitario en Bucaramanga marca kits de 99mTc (MDP, sestamibi, MAA) desde un generador. El equipo arma una carpeta digital por capítulos del Anexo Técnico, prepara una matriz de procesos especiales vs. evidencias (procedimientos, registros de lote, validaciones, calibración del activímetro) y anexa la autorización del SGC vigente. Tras la visita, el INVIMA solicita completar la calificación de desempeño de la cabina de flujo laminar. Una vez cerrada la no conformidad, se expide el certificado BPER para los procesos especiales solicitados. Seis meses después el hospital quiere marcar leucocitos autólogos, un proceso especial nuevo, por lo que debe solicitar la ampliación del certificado conforme al Decreto 335/2022.</p><p>Puntos clave:<br>1. El alcance del certificado se define por procesos especiales; documéntelo desde el inicio.<br>2. La autorización radiológica del SGC y la habilitación del servicio son prerrequisitos prácticos que el INVIMA verificará.<br>3. Calendarice la renovación quinquenal y gestione las ampliaciones antes de iniciar un nuevo proceso.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Protección radiológica, autorizaciones y transporte', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: el marco radiológico (MinMinas, SGC y MinSalud)', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume qué autoridad regula el material radiactivo (MinMinas/SGC) y cuál los equipos generadores de radiación (MinSalud/secretarías).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://minenergia.gov.co/es/misional/asuntos-nucleares/","title":"[Página web] Asuntos nucleares – normatividad vigente (Ministerio de Minas y Energía)","description":"Ministerio de Minas y Energía (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www2.sgc.gov.co/AtencionAlCiudadano/Documents/Respuestas-anonimas/Radicado-respuesta-anonima-20238100028771.pdf","title":"SGC – respuesta institucional sobre licencias/registros de medicina nuclear y radiofarmacia de baja complejidad","description":"Servicio Geológico Colombiano (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Reglamento de Protección y Seguridad Radiológica y categorización de fuentes', 'Clase 2 · Autorizaciones para el manejo de material radiactivo', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los principios de la Res. 181434/2002 y la categorización de fuentes de la Res. 180052/2008.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://minenergia.gov.co/documents/7512/20914-1695.pdf","title":"Resolución 181434 de 2002 – Reglamento de Protección y Seguridad Radiológica","description":"Ministerio de Minas y Energía (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://minenergia.gov.co/documents/7513/21941-1662.pdf","title":"Resolución 180052 de 2008 – sistema de categorización de fuentes radiactivas","description":"Ministerio de Minas y Energía (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Licencias y registros ante el SGC: Res. 90874/2014 y sus modificaciones', 'Clase 2 · Autorizaciones para el manejo de material radiactivo', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los tipos de autorización (licencia, registro, notificación), sus vigencias y los requisitos para medicina nuclear y radiofarmacia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normas.cra.gov.co/Gestor/Docs/resolucion_minminas_90874_2014.htm","title":"[Página web] Resolución 90874 de 2014 – autorizaciones para el empleo de fuentes radiactivas e inspecciones","description":"Gestor normativo CRA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://minenergia.gov.co/documents/7514/Resoluci%C3%B3n_90874_del_11_de_agosto_de_2014.pdf","title":"Resolución 90874 de 2014 (PDF MinEnergía)","description":"Ministerio de Minas y Energía (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://minenergia.gov.co/documents/7515/37323-Resolucion-41226-16Dic2016.pdf","title":"Resolución 41226 de 2016 – modifica la Res. 90874 de 2014","description":"Ministerio de Minas y Energía (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Importación de material radiactivo, desechos y dosimetría personal', 'Clase 2 · Autorizaciones para el manejo de material radiactivo', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Identifica las licencias de importación (Res. 181419/2004), la gestión de desechos (Res. 180005/2010) y el nuevo régimen de dosimetría (Res. 40377/2025).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://minenergia.gov.co/documents/7516/RES181419_2004.pdf","title":"Resolución 181419 de 2004 – licencias de importación de material radiactivo","description":"Ministerio de Minas y Energía (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://minenergia.gov.co/documents/7518/RES180005_2010.pdf","title":"Resolución 180005 de 2010 – gestión de desechos radiactivos","description":"Ministerio de Minas y Energía (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normativame.minenergia.gov.co/normatividad/7356/norma/","title":"[Página web] Resolución 40377 de 2025 – nuevo régimen de licencias de dosimetría personal (MinEnergía)","description":"Ministerio de Minas y Energía (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'De la Res. 482/2018 a la Res. 1811/2025: licencias de equipos generadores', 'Clase 3 · Equipos generadores de radiación y transporte', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara ambos regímenes y aclara que solo aplican a equipos (p. ej. el CT de un PET/CT), no al material radiactivo.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://minsalud.gov.co/salud/medicamentos-y-tecnologias/Paginas/radiaciones-ionizantes.aspx","title":"[Página web] Radiaciones ionizantes – Res. 482/2018, Res. 1811/2025 y licencias (MinSalud)","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/DIJ/resolucion-1811-de-2025.pdf","title":"Resolución 1811 de 2025 – uso de equipos generadores de radiación ionizante (sustituye la Res. 482/2018)","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/MET/Abece-resolucion-482-de-2018.pdf","title":"ABECÉ de licenciamiento – Resolución 482 de 2018","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Control de calidad de equipos en medicina nuclear', 'Clase 3 · Equipos generadores de radiación y transporte', 5, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los controles de calidad de equipos (PET/CT, gammacámara, activímetro) y su relación con la licencia y la BPER.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=CuB_r_sA75I","provider":"youtube","videoId":"CuB_r_sA75I","title":"62. Control de Calidad del PET/CT – Dra. Nathalia Ivanovna Núñez","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www-pub.iaea.org/MTCD/Publications/PDF/TE-1856web.pdf","title":"IAEA-TECDOC-1856 Quality Control in the Production of Radiopharmaceuticals","description":"OIEA (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Transporte seguro de material radiactivo: Res. 40306/2024 y SSR-6', 'Clase 3 · Equipos generadores de radiación y transporte', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los tipos de bulto, el índice de transporte, el etiquetado y las obligaciones del nuevo reglamento nacional.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://minenergia.gov.co/documents/12300/Resoluci%C3%B3n_Reglamento_de_Transporte_40306-2024.pdf","title":"Resolución 40306 de 2024 – Reglamento para el Transporte Seguro de Materiales Radiactivos","description":"Ministerio de Minas y Energía (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.fenalco.com.co/blog/juridico-2/notijuridico-122-minminas-actualiza-el-reglamento-para-el-transporte-seguro-de-materiales-radiactivos-7413","title":"[Página web] MinMinas actualiza el reglamento para el transporte seguro de materiales radiactivos","description":"FENALCO (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normas.cra.gov.co/gestor/docs/resolucion_minminas_181682_2005.htm","title":"[Página web] Resolución 181682 de 2005 (derogada por Res. 40306/2024) – antecedente de transporte","description":"Gestor normativo CRA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: despacho diario de dosis de 18F-FDG desde una radiofarmacia centralizada', 'Clase 4 · Caso práctico de la unidad', 7, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica el reglamento de transporte y los requisitos de suministro de la Res. 560/2024 a un envío real de dosis PET.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar el Reglamento para el Transporte Seguro de Materiales Radiactivos (Res. 40306 de 2024) a un envío real de dosis de radiofármacos.</p><p>Desarrollo: el Ministerio de Minas y Energía actualizó el reglamento de transporte mediante la Resolución 40306 de 2024, que derogó la Resolución 181682 de 2005. La nueva norma se alinea con el reglamento del OIEA SSR-6 (Rev. 1, edición 2018) e incorpora aspectos de seguridad física de la Colección de Seguridad Física Nuclear n.º 9. Es obligatoria para toda persona que participe en el transporte en el territorio nacional, sin perjuicio de las normas de mercancías peligrosas clase 7, y dio seis meses de transición desde su publicación. Sus elementos centrales son: valores básicos A1/A2 por radionúclido para definir límites de actividad; tipos de bulto (exceptuado, industriales IP-1 a IP-3, tipo A, tipo B(U), B(M) y C); índice de transporte y límites de tasa de dosis; marcado, etiquetado (categorías I-BLANCA, II-AMARILLA, III-AMARILLA) y rotulado del vehículo; programa de protección radiológica, capacitación del personal y respuesta a emergencias.</p><p>Ejemplo aplicado: una radiofarmacia centralizada en Bogotá envía cada mañana 20 dosis unitarias de 18F-FDG (vida media cercana a 110 minutos) a tres IPS. El responsable regulatorio debe: (1) verificar que la actividad total por bulto no supere el límite A2 del 18F para bulto tipo A; (2) usar contenedores blindados certificados como bulto tipo A; (3) medir la tasa de dosis en contacto y a 1 m para calcular el índice de transporte y asignar la etiqueta correcta; (4) emitir la documentación de envío con número ONU, radionúclido, actividad y categoría; (5) confirmar que el vehículo y el conductor cumplan las exigencias de mercancías peligrosas clase 7; y (6) registrar la entrega con hora, porque el decaimiento afecta la actividad que llega al paciente. En paralelo, la radiofarmacia debe tener el certificado BPER y el contrato o convenio de suministro previsto en el art. 13 de la Res. 560/2024.</p><p>Puntos clave:<br>1. Res. 40306/2024 reemplaza la Res. 181682/2005: actualice procedimientos, formatos y capacitación.<br>2. La categoría de etiqueta depende de la tasa de dosis y del índice de transporte, no solo del radionúclido.<br>3. El transporte es parte de la cadena de calidad: la hora de calibración y de entrega afecta la dosis administrada.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Calidad de radiofármacos: BPM OMS/OIEA y control de calidad', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: referentes internacionales de calidad', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume el papel de las guías OMS/OIEA (TRS 1025 Anexo 2) y de las farmacopeas en la calidad de radiofármacos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=Ncq3gsyiAeU","provider":"youtube","videoId":"Ncq3gsyiAeU","title":"Farmacopea. Radiofármacos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.who.int/publications/m/item/trs1025-annex2","title":"[Página web] TRS 1025 – Annex 2: IAEA-WHO good manufacturing practices for radiopharmaceutical products","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'TRS 1025 Anexo 2: BPM OIEA-OMS para radiofármacos', 'Clase 2 · BPM y control de calidad', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los requisitos específicos de BPM para radiofármacos: áreas, celdas blindadas, validación y protección del producto y del operador.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cdn.who.int/media/docs/default-source/medicines/norms-and-standards/guidelines/trs1025/trs1025-annex2.pdf?sfvrsn=7aceb0c1_6&download=true","title":"TRS 1025 Annex 2 – IAEA/WHO GMP for radiopharmaceutical products (PDF)","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.who.int/publications/m/item/trs1025-annex2","title":"[Página web] TRS 1025 – Annex 2: IAEA-WHO good manufacturing practices for radiopharmaceutical products","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Pureza radionuclídica, radioquímica y química', 'Clase 2 · BPM y control de calidad', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los tipos de pureza, sus métodos (espectrometría gamma, TLC/HPLC) y ejemplos como la ruptura de 99Mo en eluidos de 99mTc.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www-pub.iaea.org/MTCD/Publications/PDF/TE-1856web.pdf","title":"IAEA-TECDOC-1856 Quality Control in the Production of Radiopharmaceuticals","description":"OIEA (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://journals.unam.mx/index.php/req/article/download/66633/58533/194037","title":"Radiofarmacia y radioinmunoanálisis – Educación Química (UNAM)","description":"UNAM – Educación Química (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Esterilidad, endotoxinas y validación aséptica', 'Clase 2 · BPM y control de calidad', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los controles microbiológicos de radiofármacos parenterales y la validación aséptica (media fills) en radiofarmacia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www-pub.iaea.org/MTCD/Publications/PDF/TE-1856web.pdf","title":"IAEA-TECDOC-1856 Quality Control in the Production of Radiopharmaceuticals","description":"OIEA (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cdn.who.int/media/docs/default-source/medicines/norms-and-standards/guidelines/trs1025/trs1025-annex2.pdf?sfvrsn=7aceb0c1_6&download=true","title":"TRS 1025 Annex 2 – IAEA/WHO GMP for radiopharmaceutical products (PDF)","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Producción y control de 18F-FDG', 'Clase 3 · Radiofármacos PET y liberación', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el proceso de síntesis de 18F-FDG y sus controles críticos (pureza radioquímica, disolventes residuales, Kryptofix, pH).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=qD0X4JS1iuI","provider":"youtube","videoId":"qD0X4JS1iuI","title":"El ciclotrón permite la fabricación de radiofármacos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www-pub.iaea.org/MTCD/Publications/PDF/TE-1856web.pdf","title":"IAEA-TECDOC-1856 Quality Control in the Production of Radiopharmaceuticals","description":"OIEA (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Liberación anticipada y paramétrica en radiofármacos de vida media corta', 'Clase 3 · Radiofármacos PET y liberación', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica los criterios para liberar un lote antes del resultado de esterilidad y gestionar resultados fuera de especificación posteriores.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: interpretar cómo se liberan radiofármacos de vida media corta antes de conocer el resultado de esterilidad, y qué controles compensan ese riesgo.</p><p>Desarrollo: muchos radiofármacos PET tienen vidas medias de minutos (18F ≈ 110 min, 68Ga ≈ 68 min, 11C ≈ 20 min). El ensayo de esterilidad farmacopeico tarda al menos 14 días, así que es imposible esperar su resultado antes de administrar el lote. Las guías OIEA/OMS de BPM para radiofármacos (TRS 1025, Anexo 2) y la literatura técnica del OIEA (TECDOC-1856) aceptan una liberación anticipada condicionada: el lote se libera con base en controles críticos rápidos y en un proceso validado, y la esterilidad se completa de forma retrospectiva. Los elementos que respaldan esta decisión son: proceso aséptico validado con simulaciones (media fills); filtración esterilizante con prueba de integridad del filtro (punto de burbuja) antes de la liberación; endotoxinas bacterianas por método rápido; apariencia, pH, identidad y pureza radionuclídica (energía gamma y vida media); pureza radioquímica (HPLC o TLC); disolventes residuales (p. ej. etanol y acetonitrilo en 18F-FDG) y residuos del catalizador de transferencia de fase (p. ej. Kryptofix 2.2.2). Algunas pruebas, como la pureza radionuclídica de larga duración, también se completan después de la liberación. El sistema debe definir quién libera (persona calificada), cómo se documenta y qué hacer si el resultado posterior es fuera de especificación: investigación, notificación al médico tratante y evaluación de impacto en el paciente.</p><p>Ejemplo aplicado: durante la visita BPER del INVIMA a una radiofarmacia PET, el inspector solicita el expediente del lote de 18F-FDG del día. El QF debe mostrar el registro de síntesis, la prueba de integridad del filtro aprobada, los resultados de endotoxinas, pH y pureza radioquímica, la firma de liberación con hora, la siembra de esterilidad con resultado pendiente y el procedimiento para gestionar resultados fuera de especificación. Si una esterilidad posterior resulta positiva, deben existir la investigación, la comunicación al servicio de medicina nuclear y el reporte de farmacovigilancia.</p><p>Puntos clave:<br>1. La liberación antes de la esterilidad solo es aceptable con un proceso aséptico validado y la integridad del filtro verificada en cada lote.<br>2. Las pruebas rápidas (pureza radioquímica, endotoxinas, pH, apariencia) son la base documental de la liberación.<br>3. Todo resultado posterior fuera de especificación exige investigación, trazabilidad al paciente y notificación.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: preparación de la visita BPER del INVIMA y cierre de brechas de calidad', 'Clase 4 · Caso práctico de la unidad', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta una autoinspección con el Anexo Técnico y prioriza un plan de acción ante hallazgos típicos de calidad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: preparar una radiofarmacia para la visita de certificación o seguimiento BPER del INVIMA, priorizando los hallazgos más frecuentes.</p><p>Desarrollo: la Resolución 560 de 2024 adopta un Anexo Técnico como instrumento de verificación y permite al INVIMA visitas presenciales, virtuales o mixtas (arts. 17–19). El procedimiento de certificación, renovación (el certificado dura cinco años) y ampliaciones remite al Decreto 335 de 2022. Una preparación eficaz combina tres frentes. Documental: manual de calidad, organigrama con director técnico QF o profesional idóneo, procedimientos de elaboración por proceso especial, registros de lote, especificaciones, procedimiento de liberación, gestión de desviaciones y fuera de especificación, control de cambios, quejas y retiros, farmacovigilancia, contratos de suministro (art. 13) y de análisis. Técnico: calificación de celdas blindadas y cabinas, clasificación de áreas y monitoreo ambiental, calibración del activímetro con fuentes de referencia, validación de métodos de pureza radioquímica, media fills, validación de limpieza y sistema de agua si aplica. Radiológico: la autorización vigente del SGC, la dosimetría personal del equipo y la gestión de desechos deben estar coordinadas con el oficial de protección radiológica. La competencia en protección radiológica corresponde al SGC, pero el inspector del INVIMA verificará que exista la autorización.</p><p>Ejemplo aplicado: tres semanas antes de la visita, el QF hace una autoinspección con el Anexo Técnico y encuentra tres brechas: la validación de la TLC de pureza radioquímica del 99mTc-MAG3 no documenta la especificidad; no hay simulación aséptica en el último semestre; y el contrato con la radiofarmacia centralizada que suministra 18F-FDG no define responsabilidades de liberación. El plan de acción: completar el protocolo de validación, programar tres media fills, firmar un contrato de calidad con matriz de responsabilidades y preparar evidencias organizadas por numeral del anexo. También designa a un responsable por capítulo para acompañar al inspector, ensaya con el equipo las respuestas sobre liberación de lotes y desviaciones, y confirma que los registros electrónicos del activímetro y del módulo de síntesis tengan trazabilidad y control de acceso.</p><p>Puntos clave:<br>1. Use el Anexo Técnico de la Res. 560/2024 como lista de autoinspección y organice las evidencias por numeral.<br>2. Los contratos de suministro y de análisis son hallazgos frecuentes: deben definir responsabilidades de calidad.<br>3. Mantenga la dosimetría y la autorización del SGC vigentes y a la vista: son condiciones para operar aunque las otorgue otra autoridad.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Teranósticos, suministro y casos integrales', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: la teranóstica y los nuevos retos regulatorios', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume el auge de la teranóstica (68Ga/177Lu) y los retos de suministro, regulación y producción local en Colombia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=HJBLb2nt7gA&pp=ygULI3R1bWVyaXByZW0%3D","provider":"youtube","videoId":"HJBLb2nt7gA","title":"Theranostics Lutecio 177-PSMA en Cáncer de Próstata: ¿En dónde estamos y hacia dónde vamos?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://docta.ucm.es/entities/publication/542c1cbe-7ce8-46e4-bb66-cc2ecc2254aa","title":"[Página web] Teranóstica, una tendencia al alza en medicina nuclear (TFG, U. Complutense, 2025)","description":"Universidad Complutense de Madrid (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www2.minsalud.gov.co/Normativa/SiteAssets/Paginas/analisis-de-impacto-normativo/238820241107100510321.pdf","title":"Análisis de Impacto Normativo ex ante: BPM para radiofármacos de producción industrial (2024)","description":"MinSalud / Colombia Productiva (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, '177Lu-PSMA y otros radiofármacos terapéuticos: aspectos clínicos y de seguridad', 'Clase 2 · Radiofármacos terapéuticos', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta criterios de selección de pacientes, protección radiológica y manejo de excretas en terapia con 177Lu.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=lFlY2FdyERY","provider":"youtube","videoId":"lFlY2FdyERY","title":"Pacientes candidatos a tratamiento Lu177-PSMA","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=gTyt5D9QI8k","provider":"youtube","videoId":"gTyt5D9QI8k","title":"Investigación Clínica: Terapia con 177 Lutecio","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 3, '{"source":"enlace","url":"https://www.youtube.com/watch?v=RjjQJQ_8mFE","provider":"youtube","videoId":"RjjQJQ_8mFE","title":"Uso de \"radiofármacos\" en el tratamiento de pacientes con cáncer","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: cadena regulatoria de un teranóstico de 177Lu importado', 'Clase 2 · Radiofármacos terapéuticos', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la matriz regulatoria completa (registro, importación, transporte, SGC, BPER, desechos) para iniciar terapia con 177Lu-PSMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: recorrer la cadena regulatoria completa de un radiofármaco teranóstico de 177Lu, desde la importación hasta la administración y la gestión de desechos.</p><p>Desarrollo: la teranóstica combina un radiofármaco diagnóstico (p. ej. 68Ga-PSMA o 18F-PSMA para PET) y uno terapéutico dirigido a la misma diana (177Lu-PSMA). El 177Lu tiene una vida media cercana a 6,7 días y emite radiación beta (terapéutica) y gamma (útil para imagen y dosimetría). Esta vida media permite importar dosis listas o viales multidosis desde fabricantes extranjeros, pero eleva las exigencias de protección radiológica: hospitalización o aislamiento según la actividad administrada, manejo de excretas y gestión de desechos.</p><p>Cadena regulatoria en Colombia: (1) producto terminado industrial: registro sanitario INVIMA bajo el régimen general de medicamentos (Decreto 677/1995 y Decreto 334/2022), con certificado BPM del fabricante aceptado según el art. 7, par. 2 del Decreto 335/2022; si no existe registro, analizar con el curso de vitales no disponibles la figura de importación aplicable; (2) importación del material radiactivo: licencia de importación del Ministerio de Minas y Energía (Res. 181419/2004); (3) transporte internacional y nacional conforme a SSR-6 y a la Res. 40306/2024; (4) instalación: autorización del SGC para el uso de fuentes no selladas con fines terapéuticos, con categorización según la Res. 180052/2008 y los requisitos de la Res. 90874/2014; (5) si la radiofarmacia ajusta o fracciona dosis o marca el ligando (p. ej. con kits de PSMA y 177LuCl3), necesita BPER con el proceso especial correspondiente (Res. 560/2024); (6) servicio de medicina nuclear habilitado; (7) farmacovigilancia y desechos radiactivos (Res. 180005/2010, mod. por Res. 41178/2016).</p><p>Ejemplo aplicado: un hospital de Cali quiere ofrecer 177Lu-PSMA. El QF regulatorio elabora una matriz con cada requisito, su autoridad, su estado y su vigencia, y detecta que la licencia del SGC solo cubre diagnóstico. Debe solicitar la modificación de la autorización para incluir terapia con 177Lu antes de recibir el primer envío. Además, como la radiofarmacia ajustará la actividad por paciente, verifica que el alcance BPER incluya dilución y dosificación.</p><p>Puntos clave:<br>1. La teranóstica exige la autorización radiológica para terapia, no solo para diagnóstico.<br>2. El producto terapéutico industrial necesita registro u otra autorización de comercialización del INVIMA; ajustar dosis en la radiofarmacia exige BPER.<br>3. Planifique desechos y excretas desde el diseño del servicio, porque la vida media del 177Lu prolonga el almacenamiento para decaimiento.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Suministro entre radiofarmacias, contratos y farmacovigilancia', 'Clase 3 · Suministro, vigilancia y cierre', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica el art. 13 de la Res. 560/2024 (dosis unitarias y viales multidosis bajo contrato) y las obligaciones de farmacovigilancia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_0560_2024.htm","title":"[Página web] Resolución 560 de 2024 – Requisitos para la certificación en Buenas Prácticas de Elaboración de Radiofármacos (BPER)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/MET/respuesta-comentarios-radiofarmacos-instrumento-abr2024.pdf","title":"Respuesta a comentarios del proyecto de resolución de radiofármacos (instrumento BPER, abril 2024)","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Producción local y soberanía sanitaria: BPM industriales de radiofármacos en Colombia', 'Clase 3 · Suministro, vigilancia y cierre', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara la situación actual (sin BPM industriales específicas) con las alternativas analizadas por MinSalud y los modelos de otros países.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=PbnPvoGSEe4","provider":"youtube","videoId":"PbnPvoGSEe4","title":"Proyecto del Ciclotrón creará radiofármacos y diagnosticará enfermedades de ticos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www2.minsalud.gov.co/Normativa/SiteAssets/Paginas/analisis-de-impacto-normativo/238820241107100510321.pdf","title":"Análisis de Impacto Normativo ex ante: BPM para radiofármacos de producción industrial (2024)","description":"MinSalud / Colombia Productiva (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://iaea.org/sites/default/files/publications/magazines/bulletin/bull56-1/56105811213_es.pdf","title":"Garantizar la calidad actuando a nivel local: el OIEA ayuda a Cuba a producir radiofármacos (Boletín OIEA)","description":"OIEA (ES)"}'::jsonb);

END
$curso$;

-- ─── 19. Curso de Regulación Sanitaria de Gases Medicinales (33 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Regulación Sanitaria de Gases Medicinales' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Regulación Sanitaria de Gases Medicinales', 'Curso especializado en el régimen colombiano de los gases medicinales como medicamentos: BPM y certificación de plantas (Res. 4410/2009), registro sanitario y estabilidad (Res. 1497/2023), cilindros y trazabilidad, sistemas de gases en IPS, transporte y vigilancia. Integra las lecciones de la pandemia y casos prácticos con trámites INVIMA.', '<p>Curso especializado en el régimen colombiano de los gases medicinales como medicamentos: BPM y certificación de plantas (Res. 4410/2009), registro sanitario y estabilidad (Res. 1497/2023), cilindros y trazabilidad, sistemas de gases en IPS, transporte y vigilancia. Integra las lecciones de la pandemia y casos prácticos con trámites INVIMA.</p><h3>Objetivo general</h3><p>Que el químico farmacéutico aplique el marco regulatorio colombiano de los gases medicinales en toda la cadena —fabricación, llenado, registro, distribución, uso en IPS y vigilancia— para asegurar productos legales, trazables y seguros.</p><h3>A quién va dirigido</h3><p>Químicos farmacéuticos de asuntos regulatorios, aseguramiento de calidad y dirección técnica en plantas de gases, distribuidores, servicios farmacéuticos hospitalarios y empresas de oxígeno domiciliario.</p><h3>Contexto normativo</h3><p>Colombia — normativa INVIMA / MinSalud</p>',
          'Asuntos regulatorios — productos especiales', 'intermedio', 'Que el químico farmacéutico aplique el marco regulatorio colombiano de los gases medicinales en toda la cadena —fabricación, llenado, registro, distribución, uso en IPS y vigilancia— para asegurar productos legales, trazables y seguros.', 'Químicos farmacéuticos de asuntos regulatorios, aseguramiento de calidad y dirección técnica en plantas de gases, distribuidores, servicios farmacéuticos hospitalarios y empresas de oxígeno domiciliario.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Los gases medicinales como medicamentos', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Bienvenida: por qué los gases medicinales son un régimen regulatorio propio', 'Clase 1 · Introducción al curso', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Reconoce el peso sanitario y económico del sector y la ruta del curso, desde la planta de llenado hasta la cama del paciente.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://consultorsalud.com/regulacion-gases-medicinales-analisis-minsalud/","title":"[Página web] Regulación de gases medicinales, ¿hacia dónde marcha el sistema? (2022)","description":"Consultorsalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Definición legal: gas medicinal vs. gas industrial', 'Clase 2 · Qué es un gas medicinal y quién lo maneja', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Distingue el gas medicinal como medicamento (Res. 4410/2009) del gas industrial y entiende las consecuencias regulatorias de esa distinción.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minproteccion_4410_2009.htm","title":"[Página web] Resolución 4410 de 2009 MPS – Reglamento técnico que contiene el Manual de BPM de gases medicinales","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://app.invima.gov.co/alertas/ckfinder/userfiles/files/ALERTAS%20SANITARIAS/medicamentos_pbiologicos/2023/Noviembre/Alerta%20No_%20%23373-2023.pdf","title":"Alerta Sanitaria No. 373-2023 – OXYFULL Oxígeno gas para inhalación sin registro sanitario","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Portafolio: oxígeno, aire medicinal, óxido nitroso, CO2, nitrógeno, mezclas y óxido nítrico', 'Clase 2 · Qué es un gas medicinal y quién lo maneja', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe usos terapéuticos, formas (comprimido, líquido criogénico) y riesgos de cada gas, incluidos los ''gases altamente estables''.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://assets.linde.com/-/media/global/north-latam/colombia/hojas-de-datos-de-seguridad/hds_linde-colombia/fgec-085-oxigeno-medicinal_newf.pdf","title":"Ficha técnica: Oxígeno medicinal (UN 1072 / UN 1073, clase 2.2)","description":"Linde Colombia (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_1497_2023.htm","title":"[Página web] Resolución 1497 de 2023 MSPS – Requisitos y criterios para estudios de estabilidad de gases medicinales","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Actores de la cadena: fabricante, estación de llenado, distribuidor, IPS y paciente domiciliario', 'Clase 2 · Qué es un gas medicinal y quién lo maneja', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Identifica las obligaciones de cada actor y los riesgos del mercado informal de cilindros.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://scielo.isciii.es/pdf/ofil/v33n1/1699-714X-ofil-33-1-8.pdf","title":"Gestión de gases de uso medicinal en el ámbito sanitario, ¿a quién corresponde? (Rev. OFIL·ILAPHAR 2023)","description":"SciELO España / OFIL·ILAPHAR (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Normas vigentes: Res. 4410/2009, Res. INVIMA 2011012580/2011, Decretos 677, 335 y 1474, Res. 1497/2023', 'Clase 3 · Mapa normativo colombiano', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta cómo se articulan el reglamento técnico de BPM, la guía de inspección, el registro sanitario y la estabilidad, y qué normas fueron derogadas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_invima_12580_2011.htm","title":"[Página web] Resolución 2011012580 de 2011 INVIMA – Guía de inspección BPM para fabricación, llenado, control de calidad, distribución y comercialización de gases medicinales","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/MET/ain-expost-bpm-gases-medicinales-res-4410-de-2009.pdf","title":"AIN ex post BPM gases medicinales – Resolución 4410 de 2009 (Biblioteca Digital RID)","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: detectar un ''oxígeno'' sin registro sanitario', 'Clase 3 · Mapa normativo colombiano', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica la consulta de registros y alertas INVIMA para identificar un gas ilegal y definir las acciones de la IPS y del distribuidor.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://app.invima.gov.co/alertas/ckfinder/userfiles/files/ALERTAS%20SANITARIAS/medicamentos_pbiologicos/2023/Noviembre/Alerta%20No_%20%23373-2023.pdf","title":"Alerta Sanitaria No. 373-2023 – OXYFULL Oxígeno gas para inhalación sin registro sanitario","description":"INVIMA (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Buenas Prácticas de Manufactura y certificación de plantas', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción: el reglamento técnico de BPM de gases medicinales', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume el alcance de la Res. 4410/2009 (industria e IPS) y el papel de la certificación BPM en la cadena.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minproteccion_4410_2009.htm","title":"[Página web] Resolución 4410 de 2009 MPS – Reglamento técnico que contiene el Manual de BPM de gases medicinales","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/MET/ain-expost-bpm-gases-medicinales-res-4410-de-2009.pdf","title":"AIN ex post BPM gases medicinales – Resolución 4410 de 2009 (Biblioteca Digital RID)","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Sistema de calidad, personal, instalaciones y equipos', 'Clase 2 · Requisitos del Manual de BPM', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los requisitos de garantía de calidad, validación, personal, áreas y equipos aplicados a plantas de gases.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minproteccion_4410_2009.htm","title":"[Página web] Resolución 4410 de 2009 MPS – Reglamento técnico que contiene el Manual de BPM de gases medicinales","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Llenado de cilindros y liberación de lotes', 'Clase 2 · Requisitos del Manual de BPM', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los pasos críticos del llenado (evacuación a 25 pulgadas de Hg o purga y venteo, pruebas previas, análisis, registros de lote) y la liberación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minproteccion_4410_2009.htm","title":"[Página web] Resolución 4410 de 2009 MPS – Reglamento técnico que contiene el Manual de BPM de gases medicinales","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://assets.linde.com/-/media/global/north-latam/colombia/hojas-de-datos-de-seguridad/hds_linde-colombia/fgec-085-oxigeno-medicinal_newf.pdf","title":"Ficha técnica: Oxígeno medicinal (UN 1072 / UN 1073, clase 2.2)","description":"Linde Colombia (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Guía de inspección INVIMA y clasificación de no conformidades', 'Clase 2 · Requisitos del Manual de BPM', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara no conformidades críticas, mayores y menores según la guía de riesgo del INVIMA para gases medicinales.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_invima_12580_2011.htm","title":"[Página web] Resolución 2011012580 de 2011 INVIMA – Guía de inspección BPM para fabricación, llenado, control de calidad, distribución y comercialización de gases medicinales","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Certificación BPM de plantas de llenado: alcance y vigencia', 'Clase 3 · Certificación BPM y producción en sitio', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta un certificado BPM de gases (formas autorizadas, productos, cambios críticos que exigen notificación) bajo el Decreto 335/2022.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/establecimiento/1275-gases-industriales-de-colombia-sa-cryogas-yo-air-products-estaci%C3%B3n-de-llenado-bogot%C3%A1","title":"[Página web] Establecimiento certificado BPM gases medicinales: Gases Industriales de Colombia – Estación de llenado Bogotá (Res. 2024052351)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Gases producidos en sitio: plantas PSA (tamiz molecular) y aire medicinal por compresor en IPS', 'Clase 3 · Certificación BPM y producción en sitio', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los requisitos técnicos y sanitarios de la producción en sitio (analizadores, toma de aire, reserva, punto de rocío y CO) y su exclusión de la Res. 1497.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_1066_2020.htm","title":"[Página web] Resolución 1066 de 2020 MSPS – Requisitos sanitarios transitorios COVID-19 (incluye fabricación de gases medicinales en IPS, Anexo 3)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.who.int/publications/i/item/WHO-2019-nCoV-PSA_Specifications-2020.1","title":"[Página web] WHO – Technical specifications for Pressure Swing Adsorption (PSA) Oxygen Plants (2020)","description":"Organización Mundial de la Salud (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://covid19-evidence.paho.org/handle/20.500.12663/1777","title":"[Página web] Technical specifications for PSA Oxygen Plants, 8 June 2020 (repositorio de evidencia COVID-19)","description":"OPS/OMS (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: preparar la visita de certificación de una estación de llenado', 'Clase 3 · Certificación BPM y producción en sitio', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta un plan de preparación de inspección BPM con autoinspección y clasificación de riesgos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/establecimiento/1275-gases-industriales-de-colombia-sa-cryogas-yo-air-products-estaci%C3%B3n-de-llenado-bogot%C3%A1","title":"[Página web] Establecimiento certificado BPM gases medicinales: Gases Industriales de Colombia – Estación de llenado Bogotá (Res. 2024052351)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_invima_12580_2011.htm","title":"[Página web] Resolución 2011012580 de 2011 INVIMA – Guía de inspección BPM para fabricación, llenado, control de calidad, distribución y comercialización de gases medicinales","description":"Normograma INVIMA (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Registro sanitario, estabilidad, envases y trazabilidad', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción: del certificado BPM al registro sanitario', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume qué agrega el registro sanitario a la certificación BPM y cómo cambió la estabilidad con la Res. 1497/2023.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://consultorsalud.com/regulacion-gases-medicinales-analisis-minsalud/","title":"[Página web] Regulación de gases medicinales, ¿hacia dónde marcha el sistema? (2022)","description":"Consultorsalud (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.fenalco.com.co/blog/juridico-2/notijuridico-157-minsalud-establece-los-requisitos-y-criterios-para-la-realizacion-de-estudios-de-estabilidad-de-gases-medicinales-2302","title":"[Página web] Notijurídico 157 – MinSalud establece los requisitos y criterios para estudios de estabilidad de gases medicinales","description":"Fenalco (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Particularidades del registro sanitario de gases medicinales', 'Clase 2 · Registro sanitario y estabilidad', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica el régimen del Decreto 677/1995 y sus modificaciones a un gas medicinal, incluida la vigencia indefinida del Decreto 1474/2023.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: identificar las particularidades del registro sanitario de un gas medicinal frente al régimen general de medicamentos.</p><p>Desarrollo: en Colombia el gas medicinal es un medicamento (Res. 4410 de 2009 lo define como un medicamento constituido por uno o más componentes gaseosos), de modo que su comercialización exige registro sanitario INVIMA bajo el régimen del Decreto 677 de 1995 y sus modificaciones (Decreto 334 de 2022 para modificaciones clasificadas por riesgo). Lo específico del gas está en cuatro frentes. (1) Fabricante: el registro se ancla a un establecimiento con certificado de BPM vigente para gases medicinales (Res. 4410/2009 y guía de inspección INVIMA 2011012580; procedimiento de certificación del Decreto 335 de 2022); el certificado define formas (gas comprimido en cilindro de alta presión, líquido criogénico en termos o cisternas) y productos autorizados. (2) Calidad: especificaciones de farmacopea oficial (pureza, impurezas como CO, CO2, humedad, aceite; identificación), métodos analíticos y liberación por lote, incluida la trazabilidad cilindro-lote. (3) Estabilidad: desde el 1 de abril de 2024 aplica la Res. 1497 de 2023; los gases altamente estables (oxígeno, aire medicinal, CO2, N2O, carbógeno, O2/He y O2/N2O) pueden acogerse a la vida útil estándar de 24 meses sin estudio; los demás, o quien pida más vida útil, presentan estudios acelerado (40 °C) y a largo plazo (30 °C). Los gases comercializados como líquido criogénico no requieren estudios. (4) Envase y rotulado: cilindros y válvulas conformes, identificación del contenido (código de colores y etiqueta), fecha de expiración por lote.</p><p>Vigencia: por el Decreto 1474 de 2023 los registros de gases medicinales tienen vigencia indefinida; el INVIMA archiva las solicitudes de renovación, por lo que las menciones a ''renovación'' en la Res. 1497 deben leerse hoy como modificaciones del registro. Los gases producidos y usados in situ dentro de la misma institución están excluidos del ámbito de la Res. 1497.</p><p>Ejemplo aplicado: un titular con registro de oxígeno medicinal comprimido quiere añadir la presentación en cilindro portátil de aluminio. No solicita un registro nuevo: tramita en la Oficina Virtual INVIMA una modificación (nuevo material de envase), verifica que su certificado BPM cubra el llenado en esa forma, aporta especificaciones del cilindro y la válvula, bocetos de etiqueta y, si se acoge a la vida útil estándar de 24 meses, la declaración del cumplimiento de condiciones de envase, cierre y almacenamiento (≤52 °C).</p><p>Puntos clave:<br>1. Gas medicinal = medicamento: sin registro sanitario y BPM no puede comercializarse (ver alertas por oxígeno ''recreativo'' sin registro).<br>2. Registro de vigencia indefinida (Dec. 1474/2023); los cambios se gestionan como modificaciones según el Decreto 334/2022.<br>3. La Res. 1497/2023 simplifica la estabilidad para gases altamente estables (24 meses estándar), pero exige estudios para mezclas y gases no incluidos.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Res. 1497/2023: gases altamente estables y vida útil estándar de 24 meses', 'Clase 2 · Registro sanitario y estabilidad', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta qué gases se acogen a la vida útil estándar, sus condiciones y el régimen de transición (1 de abril de 2024).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_1497_2023.htm","title":"[Página web] Resolución 1497 de 2023 MSPS – Requisitos y criterios para estudios de estabilidad de gases medicinales","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.fenalco.com.co/blog/juridico-2/notijuridico-157-minsalud-establece-los-requisitos-y-criterios-para-la-realizacion-de-estudios-de-estabilidad-de-gases-medicinales-2302","title":"[Página web] Notijurídico 157 – MinSalud establece los requisitos y criterios para estudios de estabilidad de gases medicinales","description":"Fenalco (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Diseño de estudios de estabilidad para mezclas y gases no altamente estables', 'Clase 2 · Registro sanitario y estabilidad', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el diseño mínimo: tres lotes, tres cilindros por lote, 40 °C acelerado y 30 °C largo plazo, homogeneidad de mezclas y programa on-going.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_1497_2023.htm","title":"[Página web] Resolución 1497 de 2023 MSPS – Requisitos y criterios para estudios de estabilidad de gases medicinales","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/DIJ/resolucion-1497-de-2023.pdf","title":"Resolución 1497 de 2023 (PDF oficial)","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Cilindros, válvulas y código de colores', 'Clase 3 · Cilindros, identificación y trazabilidad', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los sistemas de identificación de contenido (color, etiqueta, conexiones no intercambiables) y su remisión normativa en la Res. 4410.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.iso.org/es/contents/data/standard/00/36/3659.html","title":"[Página web] ISO 32:1977 Gas cylinders for medical use — Marking for identification of content","description":"ISO (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://assets.linde.com/-/media/global/north-latam/colombia/hojas-de-datos-de-seguridad/hds_linde-colombia/fgec-085-oxigeno-medicinal_newf.pdf","title":"Ficha técnica: Oxígeno medicinal (UN 1072 / UN 1073, clase 2.2)","description":"Linde Colombia (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Trazabilidad de cilindros y lotes, devolución y mercado informal', 'Clase 3 · Cilindros, identificación y trazabilidad', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la trazabilidad cilindro–lote–paciente y el rol de la devolución de cilindros contra el mercado ilegal.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.noticiasrcn.com/salud/cuidados-a-la-hora-de-manipular-una-bala-de-oxigeno-381954","title":"[Página web] ¿Cómo manejar correctamente un cilindro de oxígeno en casa y en los hospitales?","description":"Noticias RCN (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: solicitud de modificación por nueva presentación y vida útil', 'Clase 3 · Cilindros, identificación y trazabilidad', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta el análisis de un caso de titular que añade una presentación y decide si se acoge a la vida útil estándar o presenta estudios.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_1497_2023.htm","title":"[Página web] Resolución 1497 de 2023 MSPS – Requisitos y criterios para estudios de estabilidad de gases medicinales","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/establecimiento/1275-gases-industriales-de-colombia-sa-cryogas-yo-air-products-estaci%C3%B3n-de-llenado-bogot%C3%A1","title":"[Página web] Establecimiento certificado BPM gases medicinales: Gases Industriales de Colombia – Estación de llenado Bogotá (Res. 2024052351)","description":"INVIMA (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Gases en las IPS, almacenamiento, distribución y transporte', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción: el gas medicinal dentro del hospital y en la vía', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume los requisitos que aplican después de la planta: redes centralizadas, servicio farmacéutico, oxígeno domiciliario y transporte de mercancías peligrosas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://scielo.isciii.es/pdf/ofil/v33n1/1699-714X-ofil-33-1-8.pdf","title":"Gestión de gases de uso medicinal en el ámbito sanitario, ¿a quién corresponde? (Rev. OFIL·ILAPHAR 2023)","description":"SciELO España / OFIL·ILAPHAR (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.who.int/publications/i/item/WHO-2019-nCoV-Oxygen_sources-2020.1","title":"[Página web] WHO – Oxygen sources and distribution for COVID-19 treatment centres (interim guidance, 2020)","description":"Organización Mundial de la Salud (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Sistemas centralizados: NFPA 99 y habilitación (Res. 3100/2019)', 'Clase 2 · Sistemas de gases en IPS', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe fuentes, redes, alarmas y tomas de gases según NFPA 99 y su relación con los estándares de habilitación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_3100_2019.htm","title":"[Página web] Resolución 3100 de 2019 MSPS – Procedimientos y condiciones de inscripción de prestadores y habilitación de servicios de salud","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.who.int/publications/i/item/WHO-2019-nCoV-Oxygen_sources-2020.1","title":"[Página web] WHO – Oxygen sources and distribution for COVID-19 treatment centres (interim guidance, 2020)","description":"Organización Mundial de la Salud (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'El servicio farmacéutico y la gestión de gases medicinales', 'Clase 2 · Sistemas de gases en IPS', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el rol del QF en selección, adquisición, recepción, almacenamiento, dispensación y vigilancia de gases.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://scielo.isciii.es/pdf/ofil/v33n1/1699-714X-ofil-33-1-8.pdf","title":"Gestión de gases de uso medicinal en el ámbito sanitario, ¿a quién corresponde? (Rev. OFIL·ILAPHAR 2023)","description":"SciELO España / OFIL·ILAPHAR (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_1066_2020.htm","title":"[Página web] Resolución 1066 de 2020 MSPS – Requisitos sanitarios transitorios COVID-19 (incluye fabricación de gases medicinales en IPS, Anexo 3)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Oxígeno domiciliario: concentradores y cilindros', 'Clase 2 · Sistemas de gases en IPS', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara concentradores (dispositivo médico) y cilindros (medicamento) en el domicilio y sus requisitos de seguridad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.noticiasrcn.com/salud/cuidados-a-la-hora-de-manipular-una-bala-de-oxigeno-381954","title":"[Página web] ¿Cómo manejar correctamente un cilindro de oxígeno en casa y en los hospitales?","description":"Noticias RCN (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.who.int/publications/i/item/9789241509886","title":"[Página web] WHO technical specifications for oxygen concentrators (2015)","description":"Organización Mundial de la Salud (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Transporte de gases: mercancías peligrosas (Decreto 1079/2015)', 'Clase 3 · Almacenamiento, transporte y verificación de redes', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica los requisitos de rotulado (NTC 1692), tarjeta de emergencia, hoja de seguridad, curso del conductor y número UN al despacho de cilindros.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normas.cra.gov.co/gestor/docs/decreto_1609_2002.htm","title":"[Página web] Decreto 1609 de 2002 – Manejo y transporte terrestre automotor de mercancías peligrosas (compilado en el Decreto 1079 de 2015)","description":"Gestor normativo CRA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://assets.linde.com/-/media/global/north-latam/colombia/hojas-de-datos-de-seguridad/hds_linde-colombia/fgec-085-oxigeno-medicinal_newf.pdf","title":"Ficha técnica: Oxígeno medicinal (UN 1072 / UN 1073, clase 2.2)","description":"Linde Colombia (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Almacenamiento seguro de cilindros y termos', 'Clase 3 · Almacenamiento, transporte y verificación de redes', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe condiciones de almacenamiento (≤52 °C, áreas cubiertas, separación llenos/vacíos, sujeción) exigidas por la Res. 4410 y la Res. 1497.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.noticiasrcn.com/salud/cuidados-a-la-hora-de-manipular-una-bala-de-oxigeno-381954","title":"[Página web] ¿Cómo manejar correctamente un cilindro de oxígeno en casa y en los hospitales?","description":"Noticias RCN (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minproteccion_4410_2009.htm","title":"[Página web] Resolución 4410 de 2009 MPS – Reglamento técnico que contiene el Manual de BPM de gases medicinales","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: verificación de la red de gases tras una ampliación de UCI', 'Clase 3 · Almacenamiento, transporte y verificación de redes', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta pruebas de hermeticidad, gases cruzados, pureza y alarmas antes de la puesta en servicio.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: ejecutar una verificación sanitaria de la red centralizada de gases de una IPS antes de su puesta en servicio o tras una intervención.</p><p>Desarrollo: la mayoría de eventos graves con gases medicinales en hospitales no provienen del producto sino de la red: conexiones cruzadas, tuberías contaminadas, alarmas inoperantes o fuentes de reserva sin cambio automático. El AIN ex post de la Res. 4410/2009 recuerda incidentes como el suministro de nitrógeno en lugar de oxígeno. La Res. 4410 incorporó requisitos para cilindros y redes de distribución y la Res. 1066 de 2020 (Anexo 3) exigió, para la producción en sitio, prueba de fugas y prueba de gases cruzados de la red intrahospitalaria. La referencia técnica de diseño e instalación es NFPA 99 (Health Care Facilities Code), complementada por ISO 7396-1 para redes; los estándares de habilitación de la Res. 3100 de 2019 exigen que la dotación e infraestructura de los servicios que usan gases cuenten con mantenimiento y condiciones de seguridad.</p><p>Secuencia sugerida: (1) revisar planos as-built y matriz de tomas por servicio; (2) verificar fuentes (central de cilindros, tanque criogénico, planta PSA o compresores) con su certificado BPM o autorización y su sistema de reserva; (3) prueba de hermeticidad y de presión estática; (4) prueba de conexión cruzada: presurizar un solo gas a la vez y comprobar que solo salen por las tomas correspondientes; (5) purga y prueba de partículas; (6) análisis de pureza en tomas representativas (O2 con analizador calibrado; aire: punto de rocío y CO); (7) verificación de alarmas maestras y de área, válvulas de zona y señalización/código de colores; (8) registro firmado y liberación por el responsable (químico farmacéutico/ingeniería biomédica).</p><p>Ejemplo aplicado: un hospital amplía su UCI y extiende la red de oxígeno y aire. Antes de habilitar las nuevas camas en el REPS, el comité de gases ejecuta la secuencia, encuentra que dos tomas de ''aire'' entregan 99 % de O2 (inversión de conexión), bloquea el área, corrige, repite la prueba y deja la evidencia para la visita de verificación de la secretaría de salud; si el fallo hubiera afectado a un paciente, se reporta como evento adverso/incidente.</p><p>Puntos clave:<br>1. Toda intervención en la red exige prueba de gases cruzados y de pureza antes del uso clínico.<br>2. NFPA 99 e ISO 7396-1 son las referencias técnicas; la habilitación (Res. 3100/2019) y la Res. 4410 exigen evidencia documental.<br>3. Los hallazgos con riesgo para pacientes se gestionan por farmacovigilancia/tecnovigilancia.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Pandemia, vigilancia y casos integradores', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción: lecciones de la COVID-19 para el oxígeno medicinal', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume cómo la demanda de oxígeno se multiplicó en la pandemia y qué medidas de emergencia se adoptaron y ya no están vigentes.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.who.int/publications/m/item/covid-19-and-the-oxygen-bottleneck","title":"[Página web] COVID-19 and the oxygen bottleneck (informe de reunión, 2020)","description":"Organización Mundial de la Salud (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://consultorsalud.com/regulacion-gases-medicinales-analisis-minsalud/","title":"[Página web] Regulación de gases medicinales, ¿hacia dónde marcha el sistema? (2022)","description":"Consultorsalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Res. 1066/2020 y Decreto 465/2021: producción en IPS y priorización del oxígeno', 'Clase 2 · Normas de emergencia y referentes internacionales', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las medidas transitorias (fabricación en IPS previa declaración de desabastecimiento, priorización, reportes) y su terminación con el fin de la emergencia (1 de julio de 2022).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_1066_2020.htm","title":"[Página web] Resolución 1066 de 2020 MSPS – Requisitos sanitarios transitorios COVID-19 (incluye fabricación de gases medicinales en IPS, Anexo 3)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_0465_2021.htm","title":"[Página web] Decreto 465 de 2021 – Medida transitoria para garantizar la disponibilidad y suministro de oxígeno medicinal","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Referentes OMS: plantas PSA, concentradores y sistemas de oxígeno', 'Clase 2 · Normas de emergencia y referentes internacionales', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara las especificaciones técnicas de la OMS con los requisitos colombianos de producción en sitio.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.who.int/teams/health-product-policy-and-standards/assistive-and-medical-technology/medical-devices/oxygen","title":"[Página web] WHO – Medical use of Oxygen (página temática con especificaciones técnicas)","description":"Organización Mundial de la Salud (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.who.int/publications/i/item/WHO-2019-nCoV-PSA_Specifications-2020.1","title":"[Página web] WHO – Technical specifications for Pressure Swing Adsorption (PSA) Oxygen Plants (2020)","description":"Organización Mundial de la Salud (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.who.int/publications/i/item/9789241509886","title":"[Página web] WHO technical specifications for oxygen concentrators (2015)","description":"Organización Mundial de la Salud (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Farmacovigilancia y tecnovigilancia en la cadena de gases', 'Clase 3 · Vigilancia y casos integradores', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Distingue cuándo reportar a farmacovigilancia (gas) y a tecnovigilancia (equipos) y cómo usar la trazabilidad en la investigación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: interpretar cómo se integran farmacovigilancia y tecnovigilancia en la cadena de gases medicinales.</p><p>Desarrollo: el gas medicinal es un medicamento, por lo que sus reacciones adversas, errores de medicación (gas equivocado, flujo incorrecto) y problemas de calidad se reportan al Programa Nacional de Farmacovigilancia del INVIMA (Res. 1403 de 2007 y modelo de gestión del servicio farmacéutico; reporte en línea en la plataforma del INVIMA). La Res. 1066 de 2020 exigió expresamente incluir los gases medicinales en el programa de farmacovigilancia de las IPS que producían en sitio, y el Decreto 465 de 2021 obligó a titulares y fabricantes de oxígeno a reportar eventos adversos. Al mismo tiempo, muchos elementos de la cadena son dispositivos médicos o equipos biomédicos (Decreto 4725 de 2005): concentradores de oxígeno, reguladores, flujómetros, humidificadores, mezcladores, ventiladores, tomas de pared y alarmas. Sus incidentes se reportan al Programa Nacional de Tecnovigilancia (Res. 4816 de 2008). La clave es clasificar bien: si el paciente recibió un gas fuera de especificación, es farmacovigilancia; si falló el regulador o la alarma, es tecnovigilancia; un mismo evento puede generar ambos reportes.</p><p>Riesgos típicos: hipoxia por agotamiento de cilindro o falla de fuente; administración de gas equivocado por conexión cruzada; incendios y quemaduras (oxígeno + grasa o tabaco); toxicidad por oxígeno en neonatos; exposición ocupacional a N2O; contaminación del aire medicinal con CO o aceite; uso de productos ilegales (alerta INVIMA 373-2023 sobre ''oxígeno'' en lata sin registro).</p><p>Ejemplo aplicado: en una IPS un paciente domiciliario presenta desaturación; se encuentra un cilindro de un proveedor no autorizado sin etiqueta y con válvula manipulada. El QF reporta el evento adverso al INVIMA (farmacovigilancia), conserva el cilindro en cuarentena con su número de serie, informa a la secretaría de salud y verifica en la consulta de registros y certificados BPM del INVIMA que el proveedor habitual esté vigente.</p><p>Buenas prácticas para el QF: incluir los gases en la política de farmacovigilancia institucional, capacitar a enfermería y terapia respiratoria en la identificación de eventos, y revisar periódicamente las alertas del INVIMA.</p><p>Puntos clave:<br>1. Gas = farmacovigilancia; equipos y accesorios = tecnovigilancia; documente ambos cuando aplique.<br>2. La trazabilidad (lote, número de cilindro, proveedor) es indispensable para investigar un evento.<br>3. Las alertas sanitarias del INVIMA sobre gases ilegales deben difundirse a pacientes domiciliarios.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Alertas sanitarias e ilegalidad: oxígeno en lata y cilindros informales', 'Clase 3 · Vigilancia y casos integradores', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica la gestión de una alerta sanitaria del INVIMA sobre gases en la IPS y la red de distribución.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://app.invima.gov.co/alertas/ckfinder/userfiles/files/ALERTAS%20SANITARIAS/medicamentos_pbiologicos/2023/Noviembre/Alerta%20No_%20%23373-2023.pdf","title":"Alerta Sanitaria No. 373-2023 – OXYFULL Oxígeno gas para inhalación sin registro sanitario","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso integrador: nitrógeno entregado como oxígeno', 'Clase 3 · Vigilancia y casos integradores', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta el análisis de causa raíz y las acciones de cada actor de la cadena ante un error de identidad de gas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar de forma integrada el marco regulatorio de gases medicinales a un incidente real tipo: suministro de nitrógeno en lugar de oxígeno.</p><p>Desarrollo del caso: una clínica recibe un termo criogénico rotulado como oxígeno líquido; durante el cambio de fuente, el operario usa un adaptador para conectarlo a la central. Minutos después, la alarma de baja concentración no suena porque el analizador estaba fuera de servicio, y dos pacientes en UCI se deterioran. La investigación revela que el termo contenía nitrógeno.</p><p>Análisis por eslabones: (1) Fabricante/llenador (Res. 4410/2009 y guía INVIMA 2011012580): controles de identidad del producto antes del despacho, segregación de termos de distintos gases, etiquetado y liberación por lote; las conexiones de llenado deben ser específicas por gas. (2) Transporte (Decreto 1079 de 2015, que compila el Decreto 1609 de 2002): rotulado UN y documentos (tarjeta de emergencia, hoja de seguridad) que permiten verificar el contenido al recibir. (3) IPS: recepción técnica con verificación de etiqueta, número de lote y certificado de análisis; prohibición absoluta de adaptadores que anulen conexiones no intercambiables; analizadores y alarmas de la red con mantenimiento (NFPA 99; habilitación Res. 3100/2019). (4) Vigilancia: reporte inmediato de evento adverso serio al INVIMA (farmacovigilancia) y del fallo del analizador (tecnovigilancia); cuarentena del termo; aviso al titular, que debe evaluar retiro de producto según los capítulos de quejas y retiros de la Res. 4410.</p><p>Preguntas de análisis para el estudiante: ¿qué barrera falló primero? ¿Qué registro del lote permitiría saber si otros clientes recibieron termos del mismo llenado? ¿Qué debe decir el reporte al INVIMA y en qué plazo? ¿Qué evidencia pediría la secretaría de salud en la visita posterior?</p><p>Acciones correctivas y preventivas: retirar adaptadores, capacitar al personal de cambio de fuentes, implementar lista de chequeo de recepción con doble verificación, analizador de O2 en línea con alarma redundante, auditoría al proveedor con revisión de su certificado BPM vigente, y simulacro anual.</p><p>Puntos clave:<br>1. Los errores de identidad de gases son prevenibles con conexiones no intercambiables, segregación y verificación en recepción.<br>2. Cada actor de la cadena tiene obligaciones normativas distintas pero complementarias.<br>3. El reporte oportuno y la trazabilidad permiten al INVIMA y al titular actuar sobre otros lotes o clientes.</p>"}'::jsonb);

END
$curso$;

-- ─── 20. Curso de Importación de Medicamentos Vitales No Disponibles (33 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Importación de Medicamentos Vitales No Disponibles' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Importación de Medicamentos Vitales No Disponibles', 'Curso práctico sobre el régimen de Medicamentos Vitales No Disponibles (MVND) en Colombia: criterios del Decreto 481 de 2004, listado de la Sala Especializada del INVIMA, modalidades de autorización y trámite en VUCE. Integra la gestión del desabastecimiento (Decreto 334 de 2022), los medicamentos huérfanos, el control especial ante el FNE y la farmacovigilancia del importador.', '<p>Curso práctico sobre el régimen de Medicamentos Vitales No Disponibles (MVND) en Colombia: criterios del Decreto 481 de 2004, listado de la Sala Especializada del INVIMA, modalidades de autorización y trámite en VUCE. Integra la gestión del desabastecimiento (Decreto 334 de 2022), los medicamentos huérfanos, el control especial ante el FNE y la farmacovigilancia del importador.</p><h3>Objetivo general</h3><p>Que el Químico Farmacéutico determine cuándo procede la vía MVND, prepare y radique correctamente las solicitudes de autorización en sus distintas modalidades, gestione el visto bueno de importación en VUCE y asuma las responsabilidades de calidad, trazabilidad y farmacovigilancia del importador.</p><h3>A quién va dirigido</h3><p>Químicos Farmacéuticos de asuntos regulatorios, de EPS, gestores farmacéuticos, IPS de alta complejidad, operadores logísticos e importadores de medicamentos en Colombia.</p><h3>Contexto normativo</h3><p>Colombia — normativa INVIMA / MinSalud</p>',
          'Asuntos regulatorios — productos especiales', 'intermedio', 'Que el Químico Farmacéutico determine cuándo procede la vía MVND, prepare y radique correctamente las solicitudes de autorización en sus distintas modalidades, gestione el visto bueno de importación en VUCE y asuma las responsabilidades de calidad, trazabilidad y farmacovigilancia del importador.', 'Químicos Farmacéuticos de asuntos regulatorios, de EPS, gestores farmacéuticos, IPS de alta complejidad, operadores logísticos e importadores de medicamentos en Colombia.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Fundamentos del régimen de Medicamentos Vitales No Disponibles', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: el acceso a medicamentos sin registro sanitario en Colombia', 'Clase 1 · Introducción al curso', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Presenta el propósito del régimen MVND, los actores (INVIMA, MinSalud, EPS, IPS, importadores, FNE) y la ruta del curso.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/medicamentos-vitales-no-disponibles","title":"[Página web] Medicamentos Vitales No Disponibles (normatividad, listados, formatos, requisitos y preguntas frecuentes)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://consultorsalud.com/medicamentos-vitales-no-disponibles-invima-con-seccion-exclusiva","title":"[Página web] Medicamentos Vitales No Disponibles – Invima con sección exclusiva","description":"ConsultorSalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Decreto 481 de 2004: estructura y artículos clave', 'Clase 2 · Marco normativo vigente', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Recorre los 14 artículos del Decreto 481 de 2004: definición, listado, criterios, exención de registro, modalidades, etiquetado y sanciones.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_0481_2004.htm","title":"[Página web] Decreto 481 de 2004 – Normas para incentivar la oferta de medicamentos vitales no disponibles (texto compilado)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/DIJ/Decreto-0481-de-2004.pdf","title":"Decreto 0481 de 2004 (texto oficial)","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Vigencia y normas conexas: qué está vigente y qué no', 'Clase 2 · Marco normativo vigente', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Distingue el Decreto 481/2004 (norma autónoma vigente) de normas conexas: Decreto 677/1995 (art. 96, sanciones), Decreto 249/2013, Decreto 1148/2020 (transitorio COVID-19), Decreto 334/2022 y Circular 027/2025.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_0481_2004.htm","title":"[Página web] Decreto 481 de 2004 – Normas para incentivar la oferta de medicamentos vitales no disponibles (texto compilado)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/circular_minsaludps_0027_2025.htm","title":"[Página web] Circular Externa 027 de 2025 – Conminación a las EPS para gestionar la importación y compra de MVND","description":"Normograma INVIMA (MinSalud) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.cerlatam.com/normatividad/normas-nacionales-de-colombia/ministerio-de-salud-y-proteccion-social-decreto-1148-de-2020/","title":"[Página web] Decreto 1148 de 2020 – Requisitos (transitorios) para productos y servicios declarados vitales no disponibles","description":"CERLATAM (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Datos del sistema: cuántas solicitudes, para qué y con qué resultados', 'Clase 2 · Marco normativo vigente', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Analiza la evidencia publicada sobre solicitudes de importación de MVND y recobros para dimensionar el uso real del mecanismo.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://scielosp.org/pdf/csc/2021.v26n11/5441-5452/es","title":"Caracterización de las solicitudes de importación de medicamentos vitales no disponibles años 2016 y 2017 en Colombia","description":"Ciência & Saúde Coletiva (SciELO) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://consultorsalud.com/medicamentos-vitales-no-disponibles-invima-con-seccion-exclusiva","title":"[Página web] Medicamentos Vitales No Disponibles – Invima con sección exclusiva","description":"ConsultorSalud (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://repository.usta.edu.co/bitstreams/5d744131-0bdf-487a-8f7e-6d20e85c2b17/download","title":"Medicamentos no incluidos en el plan de beneficios que deban ser importados (working paper)","description":"Universidad Santo Tomás (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Definición y criterios del artículo 2 y 4', 'Clase 3 · Concepto y criterios de un MVND', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los criterios concurrentes (indispensable e irremplazable, no investigación clínica, no comercializado o insuficiente, sin sustitutos) y cuándo se excluye un producto.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: interpretar los criterios del Decreto 481 de 2004 para decidir si un medicamento puede tramitarse como Medicamento Vital No Disponible (MVND) y anticipar el concepto de la Sala Especializada del INVIMA.</p><p>Desarrollo. El artículo 2 define el MVND como un medicamento indispensable e irremplazable para salvaguardar la vida o aliviar el sufrimiento de un paciente, que por condiciones de baja rentabilidad en su comercialización no se encuentra disponible en el país o, estándolo, no lo está en cantidades suficientes. El artículo 4 agrega tres criterios concurrentes: (a) no estar en fase de investigación clínica; (b) no comercializarse en el país, o hacerlo en cantidades insuficientes; (c) no contar con sustitutos en el mercado. Las preguntas frecuentes del INVIMA añaden que, para el listado, el principio activo debe estar incluido en normas farmacológicas. El parágrafo 1 del artículo 4 permite excluir un producto del listado cuando desaparecen las condiciones o cuando un titular demuestra que puede abastecer la demanda.</p><p>Para el QF regulatorio, el análisis se hace como un árbol de decisión: 1) ¿existe registro sanitario vigente en Colombia para el mismo principio activo, concentración y forma farmacéutica? Si existe y el producto se comercializa en cantidad suficiente, NO es MVND; 2) si el registro existe pero el producto está \"temporalmente no comercializado\" o figura en los listados de desabastecimiento del INVIMA, puede haber cabida; 3) ¿hay alternativa terapéutica equivalente disponible? La palabra clave es \"irremplazable\": si el médico puede usar otra concentración o forma farmacéutica con igual resultado, el INVIMA suele negar; 4) ¿el uso propuesto corresponde a indicaciones reconocidas y no a un ensayo clínico? Los productos en investigación siguen la vía de investigación clínica, no la de MVND; 5) ¿hay soporte científico (ficha técnica de agencia de referencia, literatura) para la indicación?</p><p>Ejemplo aplicado. Una IPS oncológica solicita importar un citotóxico cuyo único registro sanitario fue cancelado por el titular. En el listado de abastecimiento del INVIMA figura como \"desabastecido\" y no existe otro fabricante con registro. El QF documenta: consulta de registros (pantallazo de la base INVIMA), carta del titular confirmando la discontinuación, ausencia de sustitutos según guías de práctica clínica y ficha técnica del producto en EMA/FDA. Con ese expediente la solicitud cumple los tres criterios y puede presentarse por la modalidad \"más de un paciente\" con soporte de la cantidad requerida.</p><p>Error frecuente: confundir \"no cubierto por el plan de beneficios\" o \"costoso\" con \"no disponible\". El precio o la cobertura no son criterio del Decreto 481; la no disponibilidad debe deberse a falta de oferta.</p><p>Puntos clave:<br>1. Los tres criterios del artículo 4 son concurrentes y se suman a la definición del artículo 2.<br>2. \"Irremplazable\" exige demostrar la ausencia de alternativa terapéutica en el mercado colombiano.<br>3. Un producto en investigación clínica nunca entra por la vía MVND.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: ¿procede la vía MVND? Tres escenarios', 'Clase 3 · Concepto y criterios de un MVND', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica la matriz de criterios a un antídoto discontinuado, un producto costoso con registro y una molécula en fase III.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar los criterios del Decreto 481 de 2004 a tres situaciones reales para decidir si procede la vía MVND.</p><p>Caso A – Antídoto discontinuado. El único titular con registro sanitario de un antídoto para intoxicación por un plaguicida reporta al INVIMA la discontinuación definitiva (art. 18 del Decreto 334 de 2022, reporte dentro de los 30 días calendario). Los toxicólogos indican que no hay alternativa con igual eficacia. Análisis: cumple la definición (indispensable e irremplazable), no se comercializa, no está en investigación y no tiene sustitutos. Procede MVND; las IPS pueden usar urgencia clínica y los distribuidores la modalidad de más de un paciente. El QF debe revisar el listado vigente del INVIMA y, si el principio activo no aparece, documentar la solicitud de inclusión ante la Sala Especializada.</p><p>Caso B – Medicamento costoso no cubierto. Una EPS pregunta si puede importar como MVND una versión más barata de un anticuerpo monoclonal que tiene registro sanitario vigente y se comercializa con normalidad en Colombia. Análisis: no procede. El producto está disponible en cantidad suficiente y el precio no es criterio del Decreto 481. Alternativas: negociación de precios, compras centralizadas o, si existe, un biosimilar con registro.</p><p>Caso C – Nueva molécula en fase III. Un médico solicita importar un fármaco en fase III para un paciente con cáncer avanzado. Análisis: no procede por el literal a) del artículo 4 (no estar en investigación clínica). La vía es la inclusión del paciente en un estudio clínico aprobado o en un programa de acceso expandido conforme a la normativa de investigación clínica.</p><p>Metodología para el estudiante. Para cada caso, completa una matriz con cinco columnas: (1) ¿indispensable e irremplazable?; (2) ¿no comercializado o insuficiente?; (3) ¿fuera de investigación clínica?; (4) ¿sin sustitutos?; (5) modalidad sugerida (paciente específico, urgencia clínica, más de un paciente, o vía distinta). Documenta la evidencia que soporta cada respuesta: consulta de la base de registros sanitarios del INVIMA, listado de abastecimiento/desabastecimiento en seguimiento, listado vigente de MVND, guías de práctica clínica y ficha técnica de la agencia de referencia.</p><p>Ejemplo de redacción de conclusión (Caso A): \"El principio activo X cumple la definición del artículo 2 y los criterios a), b) y c) del artículo 4 del Decreto 481 de 2004, dado que su único registro sanitario fue cancelado por discontinuación comercial (radicado ...), no existe alternativa terapéutica según [guía], y no se encuentra en investigación clínica. Se recomienda solicitar autorización bajo la modalidad de más de un paciente.\"</p><p>Puntos clave:<br>1. La matriz de cuatro criterios evita solicitudes improcedentes y requerimientos.<br>2. Precio o cobertura no convierten un producto en MVND.<br>3. Siempre deja trazabilidad documental de la verificación de disponibilidad.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Listado de MVND y papel de la Sala Especializada del INVIMA', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: cómo se construye y usa el listado de MVND', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume el papel de la Comisión Revisora – Sala Especializada de Medicamentos y Productos Biológicos en la declaratoria y actualización del listado.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/medicamentos-vitales-no-disponibles","title":"[Página web] Medicamentos Vitales No Disponibles (normatividad, listados, formatos, requisitos y preguntas frecuentes)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Consulta e interpretación del listado vigente', 'Clase 2 · El listado de MVND', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aprende a consultar los listados de MVND publicados por el INVIMA (PDF y Excel, 2016–2026) y a interpretar sus campos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/listado-de-medicamentos-vitales-no-disponibles-agosto-2026-2pdf","title":"Listado de Medicamentos Vitales No Disponibles – agosto 2026","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/listado-de-medicamentos-vitales-no-disponibles-julio-2026pdf","title":"Listado de Medicamentos Vitales No Disponibles – julio 2026","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/medicamentos-vitales-no-disponibles","title":"[Página web] Medicamentos Vitales No Disponibles (normatividad, listados, formatos, requisitos y preguntas frecuentes)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Inclusión y exclusión: conceptos de la Sala Especializada', 'Clase 2 · El listado de MVND', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta cómo la Sala Especializada conceptúa inclusiones y exclusiones del listado y cómo leer las actas de la Comisión Revisora.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/acta_no_07_de_2025_sempb_primera_partepdf","title":"Acta No. 07 de 2025 – Comisión Revisora, Sala Especializada de Medicamentos y Productos Biológicos (primera parte)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_0481_2004.htm","title":"[Página web] Decreto 481 de 2004 – Normas para incentivar la oferta de medicamentos vitales no disponibles (texto compilado)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Declaratorias por grupos terapéuticos en crisis de abastecimiento', 'Clase 3 · Declaratorias masivas y casos', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Analiza la declaratoria de 2020 de medicamentos de cuidado crítico como MVND y el Decreto 1148 de 2020 como respuesta transitoria a la emergencia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://consultorsalud.com/medicamentos-para-uci-son-declarados-vitales-no-disponibles/","title":"[Página web] Medicamentos para cuidado crítico son declarados vitales no disponibles (2020)","description":"ConsultorSalud (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cerlatam.com/normatividad/normas-nacionales-de-colombia/ministerio-de-salud-y-proteccion-social-decreto-1148-de-2020/","title":"[Página web] Decreto 1148 de 2020 – Requisitos (transitorios) para productos y servicios declarados vitales no disponibles","description":"CERLATAM (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: solicitar la inclusión de un principio activo en el listado', 'Clase 3 · Declaratorias masivas y casos', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Prepara la sustentación técnica para pedir que un principio activo sin oferta local sea incluido en el listado de MVND.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/medicamentos-vitales-no-disponibles","title":"[Página web] Medicamentos Vitales No Disponibles (normatividad, listados, formatos, requisitos y preguntas frecuentes)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/dispositivos_dispositivos_medicos_vitales_no_disponibles/Instructivo-de-diligenciamiento-del-formato-para-solicitud-de-MVND.pdf","title":"Instructivo de diligenciamiento del formato para solicitud de medicamentos como vitales no disponibles","description":"INVIMA (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Modalidades de autorización y trámite de importación', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: modalidades y secuencia INVIMA – VUCE – aduana', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume las tres modalidades del Decreto 481/2004, sus tarifas INVIMA y el orden de los trámites hasta la nacionalización.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/MET/infografia-medicamentos-vitales-no-disponibles.pdf","title":"Infografía: Medicamentos Vitales No Disponibles – pasos y requisitos por modalidad","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://invima.gov.co/tramites-y-servicios/grupo-autorizaciones-licencias-vuce","title":"[Página web] Grupo Autorizaciones y Licencias VUCE – trámites, tarifas MVND (4002-24/25/26) y visto bueno (4003)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Paciente específico (art. 8)', 'Clase 2 · Modalidades de autorización', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta una solicitud para un paciente identificado: formato, fórmula médica, resumen de historia clínica, pago y renovación por continuidad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: ejecutar paso a paso una solicitud de autorización de importación de un MVND para un paciente específico ante el INVIMA.</p><p>Desarrollo. El artículo 8 del Decreto 481 de 2004 permite que el propio paciente o una persona natural o jurídica, pública o privada, importe un MVND para un paciente determinado. Los requisitos mínimos son: solicitud expresa de autorización; nombre completo y documento de identidad del paciente; nombre del principio activo en denominación genérica y su composición; fórmula médica y resumen de historia clínica firmados por el médico tratante con número de tarjeta o registro profesional; y copia del recibo de pago (tarifa INVIMA 4002-24). La autorización se concede por una sola vez; para continuar el tratamiento se requiere nueva solicitud con nueva fórmula, citando el número de radicado de la autorización anterior (campo previsto en el formato).</p><p>Secuencia práctica: 1) verificar que el principio activo figure en el listado vigente de MVND del INVIMA; si no figura, la solicitud se somete a estudio y la Sala Especializada puede incluirlo; 2) diligenciar el formato Word (firmado) y el formato Excel de solicitud de MVND según el instructivo: tipo de solicitud \"un paciente\", EAPB del paciente, si el importador cuenta con autorización de la EPS, código ATC, IUM cuando exista, concentración, forma farmacéutica, presentación, cantidad, datos del prescriptor, diagnóstico CIE-10, tiempo de tratamiento y continuidad; 3) adjuntar fórmula médica, resumen de historia clínica, documento del paciente y soporte de pago; la infografía del MinSalud agrega oficio de autorización de la EPS, compromiso de reporte a farmacovigilancia y evidencia científica; 4) radicar ante el INVIMA (Dirección de Operaciones Sanitarias) por el canal vigente; 5) si hay faltantes, el INVIMA emite auto de requerimiento; 6) con la autorización, tramitar el visto bueno de importación en la VUCE (tarifa 4003) antes de la llegada de la mercancía; 7) nacionalizar y entregar al paciente a través de la EPS/IPS/gestor farmacéutico.</p><p>Ejemplo aplicado. Paciente de 6 años con epilepsia refractaria requiere un anticonvulsivante sin registro en Colombia. El neuropediatra emite fórmula por 3 meses y resumen de historia clínica con fracasos terapéuticos previos. La EPS designa a un operador logístico como importador. El QF verifica que la cantidad solicitada coincida exactamente con la posología x duración, que el diagnóstico tenga código CIE-10 y que el nombre del paciente sea idéntico en todos los documentos. Tras la autorización, el operador registra el visto bueno en VUCE citando el número de autorización.</p><p>Puntos clave:<br>1. La autorización por paciente es de uso único y no permite comercializar excedentes.<br>2. La cantidad debe ser coherente con fórmula y duración del tratamiento.<br>3. Sin autorización MVND previa no procede el visto bueno en VUCE.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Urgencia clínica (art. 9) frente a las demás modalidades', 'Clase 2 · Modalidades de autorización', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara la urgencia clínica con las modalidades de paciente específico y más de un paciente, y define cómo justificar cantidades no comerciales.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: comparar la modalidad de urgencia clínica con las de paciente específico y más de un paciente, y saber cuándo utilizarla.</p><p>Desarrollo. El artículo 9 del Decreto 481 de 2004 permite importar MVND en cantidades no comerciales sin los documentos del paciente (fórmula e historia clínica individual), siempre que exista justificación médica de la urgencia. Está pensada para instituciones prestadoras que deben tener disponible un medicamento para eventos agudos impredecibles: antídotos (p. ej. para intoxicaciones poco frecuentes), antivenenos específicos no producidos en el país, fármacos para crisis metabólicas o hipertermia maligna. Se identifica con la tarifa INVIMA 4002-26 y utiliza el mismo formato que la solicitud de paciente específico, marcando \"urgencia clínica\".</p><p>Comparación rápida: Paciente específico (art. 8, tarifa 4002-24): un paciente identificado, fórmula y resumen de historia clínica, autorización por una vez. Urgencia clínica (art. 9, tarifa 4002-26): sin paciente identificado al momento de la solicitud, cantidades no comerciales, justificación médica institucional (epidemiología del evento, consumo histórico, protocolo institucional). Más de un paciente (art. 10, tarifa 4002-25): importador persona jurídica autorizado para distribuir medicamentos, certificado de venta libre o tipo OMS, certificado de existencia y representación legal, certificado de análisis; no exige documentos clínicos individuales.</p><p>Buenas prácticas de justificación: describir el riesgo vital y la ventana terapéutica, mostrar que no existe alternativa disponible, calcular la cantidad con base en dosis por evento y número de eventos esperados en el período, e indicar el plan de custodia (almacenamiento, vencimientos y trazabilidad de cada unidad dispensada). Es recomendable que el comité de farmacia y terapéutica de la IPS avale la solicitud.</p><p>Ejemplo aplicado. Un hospital de alta complejidad con unidad de toxicología necesita un antídoto sin registro en Colombia. Presenta solicitud de urgencia clínica por 10 viales, sustentada en 4 casos atendidos el año anterior, dosis de 2–3 viales por caso, vida útil del producto y acta del comité de farmacia. Cada uso posterior se documenta en la historia clínica del paciente y se conserva en el expediente para auditorías del INVIMA y reporte a farmacovigilancia.</p><p>Puntos clave:<br>1. Urgencia clínica = cantidades no comerciales con justificación médica, sin documentos individuales del paciente.<br>2. Elegir mal la modalidad genera requerimientos o negación: si hay paciente identificado, usar art. 8; si hay demanda poblacional recurrente, usar art. 10.<br>3. La trazabilidad del uso posterior es responsabilidad de la institución.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Más de un paciente (art. 10) y acceso para salud pública', 'Clase 2 · Modalidades de autorización', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los requisitos para importadores (CVL/CPP tipo OMS, existencia y representación, certificado de análisis) y diferencia la vía de salud pública por entidades públicas vía OPS (Decreto 249/2013).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_0481_2004.htm","title":"[Página web] Decreto 481 de 2004 – Normas para incentivar la oferta de medicamentos vitales no disponibles (texto compilado)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_0249_2013.htm","title":"[Página web] Decreto 249 de 2013 – Importación por entidades públicas de medicamentos e insumos críticos de salud pública vía OPS","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/circular_minsaludps_0027_2025.htm","title":"[Página web] Circular Externa 027 de 2025 – Conminación a las EPS para gestionar la importación y compra de MVND","description":"Normograma INVIMA (MinSalud) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Diligenciamiento del formato de solicitud de MVND', 'Clase 3 · Requisitos documentales y radicación', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica el instructivo oficial para diligenciar el formato Word y el Excel (ATC, IUM, concentración, prescriptor, CIE-10, continuidad del tratamiento).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/dispositivos_dispositivos_medicos_vitales_no_disponibles/Instructivo-de-diligenciamiento-del-formato-para-solicitud-de-MVND.pdf","title":"Instructivo de diligenciamiento del formato para solicitud de medicamentos como vitales no disponibles","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/medicamentos-vitales-no-disponibles","title":"[Página web] Medicamentos Vitales No Disponibles (normatividad, listados, formatos, requisitos y preguntas frecuentes)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/MET/infografia-medicamentos-vitales-no-disponibles.pdf","title":"Infografía: Medicamentos Vitales No Disponibles – pasos y requisitos por modalidad","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Visto bueno en VUCE y registro/licencia de importación', 'Clase 3 · Requisitos documentales y radicación', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta el visto bueno de importación del INVIMA en VUCE 2.0 y entiende cuándo se requiere registro o licencia de importación ante MinCIT.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/tramites_grupo_autorizaciones_licencias_vuce/GUIA_DE_DILIGENCIAMIENTO_DE_VISTO_BUENO_VUCE-INVIMA-enero_22012020.pdf","title":"Guía de diligenciamiento de intenciones de importación ante la VUCE 2.0 – Invima (v4.0, enero 2020)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://invima.gov.co/tramites-y-servicios/grupo-autorizaciones-licencias-vuce","title":"[Página web] Grupo Autorizaciones y Licencias VUCE – trámites, tarifas MVND (4002-24/25/26) y visto bueno (4003)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_0925_2013.htm","title":"[Página web] Decreto 925 de 2013 – Solicitudes de registro y licencia de importación (VUCE)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Tiempos, requerimientos y puntos críticos de control', 'Clase 3 · Requisitos documentales y radicación', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la línea de tiempo del trámite, los plazos de VUCE (Decreto 925/2013) y las causas frecuentes de requerimiento o rechazo.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: interpretar los tiempos y controles de un trámite de importación de MVND, desde la radicación ante el INVIMA hasta la nacionalización.</p><p>Desarrollo. El Decreto 481 de 2004 no fija un plazo específico de respuesta para las autorizaciones de MVND, y la página oficial del INVIMA tampoco publica un tiempo de trámite; por ello aplica el régimen general de peticiones (Ley 1755 de 2015) y la práctica institucional, que prioriza las solicitudes por paciente y de urgencia clínica. Para la etapa de comercio exterior, el Decreto 925 de 2013 establece que las entidades que participan en la VUCE deben informar en un día hábil si una solicitud está incompleta y resolver en dos días hábiles los registros de importación de bienes de libre importación sometidos a requisito, y en tres días hábiles las licencias previas. El visto bueno del INVIMA (tarifa 4003 por ítem) debe obtenerse ANTES de la llegada y nacionalización de la mercancía.</p><p>Línea de tiempo típica: (1) preparación documental: 1–5 días, según la disponibilidad de fórmula, historia clínica y certificados de origen apostillados/traducidos para más de un paciente; (2) radicación ante el INVIMA y estudio; si hay requerimiento (auto), el reloj se detiene hasta su respuesta; (3) autorización de la Dirección de Operaciones Sanitarias; (4) intención de importación/visto bueno en VUCE, citando la autorización MVND; (5) registro de importación ante MinCIT cuando aplica (el MinCIT indica que para valores iguales o superiores a USD 30.000 se requiere firma digital); (6) embarque, llegada a depósito y declaración de importación; (7) entrega al paciente o a la institución.</p><p>Puntos críticos de control: correspondencia exacta entre la autorización y la mercancía (principio activo, concentración, forma farmacéutica, cantidad, fabricante, lote cuando aplique); vida útil remanente suficiente para el tratamiento; condiciones de cadena de frío documentadas; etiquetado del país de origen aceptado (art. 11), y para importaciones comerciales el sello de \"medicamento vital\".</p><p>Ejemplo aplicado. Un operador logístico recibe una autorización para más de un paciente de un antiinfeccioso desabastecido. Programa el embarque solo tras obtener el visto bueno en VUCE; al llegar, el inspector verifica que el lote coincida con el certificado de análisis presentado. Una diferencia de lote obliga a solicitar modificación, retrasando la entrega una semana: por eso conviene solicitar al proveedor lote reservado antes de radicar.</p><p>Puntos clave:<br>1. Ningún embarque debe salir antes de contar con autorización MVND y visto bueno VUCE.<br>2. Los requerimientos del INVIMA son la principal causa de demora: un checklist previo los evita.<br>3. La consistencia documental entre formato, autorización, factura y mercancía es determinante en la inspección.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: importación para un paciente pediátrico paso a paso', 'Clase 4 · Caso práctico de la unidad', 7, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Simula el trámite completo de un MVND para un paciente: desde la fórmula hasta la nacionalización y entrega por la EPS.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/MET/infografia-medicamentos-vitales-no-disponibles.pdf","title":"Infografía: Medicamentos Vitales No Disponibles – pasos y requisitos por modalidad","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.mincit.gov.co/mincomercioexterior/como-importar-a-colombia","title":"[Página web] ¿Cómo importar a Colombia? – pasos, vistos buenos y registro de importación en VUCE","description":"Ministerio de Comercio, Industria y Turismo (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.vuce.gov.co/servicios/registro-de-usuarios-de-vuce","title":"[Página web] Registro de usuarios de VUCE","description":"VUCE – MinCIT (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Desabastecimiento, enfermedades huérfanas y medicamentos de control especial', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: MVND como herramienta frente al desabastecimiento', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume cómo se relacionan los listados de desabastecimiento del INVIMA, el régimen MVND y las obligaciones de las EPS.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/desabastecimientos","title":"[Página web] Desabastecimientos de medicamentos – reporte de disponibilidad, listados mensuales en seguimiento","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cerlatam.com/normatividad/minsalud-circular-externa-027-de-2025-29-jul-2025/","title":"[Página web] Minsalud, Circular Externa 027 de 2025: llamado a las EPS para la importación de MVND","description":"CERLATAM (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Decreto 334 de 2022: reporte de no comercialización y lista de moléculas críticas', 'Clase 2 · Desabastecimiento', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la obligación de reportar en 30 días calendario, el análisis de casos del INVIMA y la lista de productos críticos que se nutre de los listados MVND de los últimos 5 años.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/sites/default/files/medicamentos-y-productos-biologicos/tecnico-medicamentos-2/Decreto%20No.%20334%20de%202022.pdf","title":"Decreto 334 de 2022 (arts. 18–20: reporte de no comercialización y gestión del desabastecimiento)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.fenalco.com.co/blog/juridico-2/notijuridico-092-el-invima-establecera-el-contenido-y-periodicidad-de-los-reportes-en-el-marco-de-la-gestion-preventiva-del-desabastecimiento-de-medicamentos-8241","title":"[Página web] Notijurídico 092: el INVIMA establecerá contenido y periodicidad de reportes para la gestión preventiva del desabastecimiento","description":"FENALCO (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Listados de abastecimiento y desabastecimiento en seguimiento', 'Clase 2 · Desabastecimiento', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los listados mensuales del INVIMA (monitorización, riesgo de desabastecimiento, desabastecido) y su uso para sustentar solicitudes MVND.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/desabastecimientos","title":"[Página web] Desabastecimientos de medicamentos – reporte de disponibilidad, listados mensuales en seguimiento","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/listado-de-abastecimiento-y-desbastecimiento-de-medicamentos-en-seguimiento-agosto-2026-1pdf","title":"Listado de abastecimiento y desabastecimiento de medicamentos en seguimiento – agosto 2026","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Obligaciones de las EPS: Circular 027 de 2025 y Auto 559 de 2025', 'Clase 2 · Desabastecimiento', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la conminación del MinSalud a las EPS para gestionar importación y compra de MVND y garantizar suministro continuo.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/circular_minsaludps_0027_2025.htm","title":"[Página web] Circular Externa 027 de 2025 – Conminación a las EPS para gestionar la importación y compra de MVND","description":"Normograma INVIMA (MinSalud) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.cerlatam.com/normatividad/minsalud-circular-externa-027-de-2025-29-jul-2025/","title":"[Página web] Minsalud, Circular Externa 027 de 2025: llamado a las EPS para la importación de MVND","description":"CERLATAM (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Medicamentos huérfanos frente a MVND', 'Clase 3 · Enfermedades huérfanas', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara las categorías de medicamento huérfano y MVND y las rutas de acceso: registro sanitario, autorización MVND o investigación clínica/uso compasivo.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: diferenciar los medicamentos huérfanos de los MVND y elegir la vía regulatoria correcta para pacientes con enfermedades raras.</p><p>Desarrollo. Una enfermedad huérfana es aquella crónicamente debilitante, grave, que amenaza la vida y tiene baja prevalencia (Ley 1392 de 2010, modificada por la Ley 1438 de 2011). El MinSalud adopta el listado oficial: la Resolución 023 de 2023 lo actualizó a la versión 4.0 y derogó la Resolución 5265 de 2018; en noviembre de 2025 se publicó un proyecto para la versión 5.0, que mantiene la numeración y aclara que el listado tiene fines epidemiológicos y no puede ser barrera para diagnóstico o tratamiento. El INVIMA aclara en sus preguntas frecuentes que los medicamentos para enfermedades huérfanas NO son lo mismo que los MVND, aunque pueden solicitarse como vitales no disponibles cuando cumplen los criterios del Decreto 481.</p><p>Rutas posibles para un medicamento huérfano: (1) registro sanitario ordinario (Decreto 677 de 1995, o Decreto 1782 de 2014 si es biológico), deseable cuando existe demanda sostenida; (2) autorización como MVND para paciente específico o para más de un paciente, cuando el producto no se comercializa en Colombia por baja rentabilidad y no tiene sustitutos; (3) acceso en el marco de investigación clínica o programas de uso compasivo aprobados, cuando el medicamento aún está en investigación (no aplica MVND, art. 4a). La decisión depende del estado de desarrollo del producto, del número de pacientes y de la estrategia del titular.</p><p>Ejemplo aplicado. Un laboratorio extranjero tiene una terapia de reemplazo enzimático aprobada por EMA y FDA para una enfermedad lisosomal incluida en el listado de enfermedades huérfanas. En Colombia hay 12 pacientes diagnosticados. Mientras prepara el dossier de registro, su representante local solicita autorizaciones MVND para más de un paciente, con certificado de producto farmacéutico tipo OMS, certificado de análisis por lote y justificación de cantidades basada en el registro de pacientes de las EPS. En paralelo, el QF regulatorio planea la presentación del registro sanitario, pues el INVIMA puede excluir el principio activo del listado cuando un titular demuestre capacidad de abastecer.</p><p>Riesgos a considerar: el uso prolongado de la vía MVND para productos con demanda estable puede ser cuestionado; las solicitudes sin soporte de diagnóstico confirmado (CIE-10 y pruebas confirmatorias) generan requerimientos, y los pacientes deben ser reportados en los sistemas de vigilancia de enfermedades huérfanas.</p><p>Puntos clave:<br>1. Huérfano no es sinónimo de MVND: son categorías distintas que pueden coincidir.<br>2. Si el producto está en investigación clínica, la vía es el ensayo o el uso compasivo, no MVND.<br>3. La vía MVND es un puente de acceso; la solución sostenible es el registro sanitario.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Listado oficial de enfermedades huérfanas y su uso regulatorio', 'Clase 3 · Enfermedades huérfanas', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la Resolución 023 de 2023 (versión 4.0 del listado, deroga la Res. 5265/2018) y el proyecto de versión 5.0, y cómo usarlos para sustentar solicitudes.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.medellin.gov.co/es/wp-content/uploads/2023/12/resolucion-no-023-de-2023.pdf","title":"Resolución 023 de 2023 – Actualiza el listado de enfermedades huérfanas-raras (versión 4.0)","description":"MinSalud (copia publicada por Alcaldía de Medellín) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://consultorsalud.com/pr-actualiza-la-lista-de-enfermedades-huerfanas/","title":"[Página web] Proyecto de resolución actualiza la lista de enfermedades huérfanas: versión 5.0","description":"ConsultorSalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Papel del Fondo Nacional de Estupefacientes en MVND de control especial', 'Clase 4 · Medicamentos de control especial', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los requisitos adicionales del FNE para importar MVND de control especial: inscripción, cupos, licencia/registro en VUCE con visto bueno del FNE.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://fne.minsalud.gov.co/PublishingImages/Home/Enlaces_de_interes/28072026/GUÍA DE DILIGENCIAMIENTO DE SOLICITUD DE IMPORTACIÓN FNE.pdf","title":"Guía de diligenciamiento de solicitud de licencia de importación ante la VUCE 2.0 – Fondo Nacional de Estupefacientes (abril 2024)","description":"UAE Fondo Nacional de Estupefacientes (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://consultorsalud.com/asi-seran-los-tramites-ante-fne-de-medicamentos/","title":"[Página web] Así serán los trámites ante la UAE–FNE de medicamentos de control especial (incluye inscripción para MVND)","description":"ConsultorSalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: opioide desabastecido para una red hospitalaria', 'Clase 4 · Medicamentos de control especial', 7, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resuelve un caso integrado de desabastecimiento de un medicamento de control especial usando la modalidad de más de un paciente.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: resolver un caso integrado de desabastecimiento que combina listado INVIMA, solicitud MVND y control especial.</p><p>Situación. En el listado de abastecimiento y desabastecimiento en seguimiento del INVIMA aparece como \"desabastecido\" un opioide inyectable de uso en anestesia. El titular reportó problemas de fabricación del API y estima seis meses de interrupción. Tres hospitales de una red pública informan que solo tienen existencias para dos semanas.</p><p>Paso 1 – Confirmar el estado. El QF consulta el registro sanitario (estado \"temporalmente no comercializado\"), el listado mensual del INVIMA y la comunicación del titular. Documenta que no hay otro registro con la misma concentración y forma farmacéutica. Revisa con anestesiología si existe alternativa terapéutica; si existe, el INVIMA puede considerar que el producto no es irremplazable.</p><p>Paso 2 – Verificar el listado de MVND. Si el principio activo ya fue declarado vital no disponible por la Sala Especializada (en situaciones de desabastecimiento el INVIMA ha incluido grupos completos, como ocurrió en 2020 con medicamentos para cuidado crítico), la red puede tramitar la importación de inmediato. Si no, presenta la solicitud con la evidencia de desabastecimiento.</p><p>Paso 3 – Elegir modalidad. Para abastecer a tres hospitales lo adecuado es \"más de un paciente\" (art. 10, tarifa 4002-25) a través de un distribuidor legalmente constituido, con certificado de venta libre o tipo OMS apostillado y traducido, certificado de existencia y representación legal y certificado de análisis del lote, más la justificación de la cantidad (consumo histórico x seis meses).</p><p>Paso 4 – Control especial. Al ser un medicamento de control especial, además de la autorización MVND del INVIMA se requiere intervención de la UAE Fondo Nacional de Estupefacientes: inscripción del importador, cupo y licencia o registro de importación en VUCE con visto bueno del FNE (Res. 1478 de 2006 modificada por la Res. 315 de 2020; guía FNE de abril de 2024). Si el producto es monopolio del Estado, la importación la realiza directamente el FNE y la red debe gestionarla con el Fondo Rotatorio de Estupefacientes del departamento.</p><p>Paso 5 – Postcomercialización. El importador conserva trazabilidad por lote, distribuye con libros oficiales de control, y las IPS reportan eventos adversos en VigiFlow.</p><p>Pregunta de cierre para el estudiante. ¿Qué pasa si el titular reanuda el suministro en el mes tres? Respuesta: el INVIMA puede excluir el producto del listado de MVND (art. 4, parágrafo 1) y las autorizaciones nuevas dejarían de proceder; las ya concedidas se ejecutan conforme a lo autorizado.</p><p>Puntos clave:<br>1. Desabastecimiento confirmado + ausencia de sustitutos = posible MVND.<br>2. Para medicamentos de control especial se suman los requisitos del FNE a los del INVIMA.<br>3. La justificación de cantidades debe atarse al tiempo estimado de interrupción.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Responsabilidades del importador, farmacovigilancia y caso integrador', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: la responsabilidad sanitaria sin registro sanitario', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume qué obligaciones conserva un producto exento de registro y quién responde por su calidad y seguridad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_0481_2004.htm","title":"[Página web] Decreto 481 de 2004 – Normas para incentivar la oferta de medicamentos vitales no disponibles (texto compilado)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Responsabilidades del importador y farmacovigilancia de MVND', 'Clase 2 · Postcomercialización', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las obligaciones de calidad, trazabilidad, reporte de eventos adversos (VigiFlow) y retiro de producto del importador de MVND.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: describir las responsabilidades del importador de MVND en farmacovigilancia, trazabilidad y calidad, considerando que estos productos no tienen registro sanitario en Colombia.</p><p>Desarrollo. El artículo 5 del Decreto 481 exime a los MVND del registro sanitario, pero no de la vigilancia sanitaria: el artículo 12 faculta al INVIMA a exigir reportes de las importaciones comerciales y a llevar el registro de autorizaciones, y el artículo 13 remite al régimen sancionatorio del Decreto 677 de 1995. La Resolución 2004009455 de 2004 asigna las obligaciones de reporte de seguridad a los titulares de registro sanitario y fabricantes; como en un MVND no hay titular de registro en Colombia, el INVIMA y el MinSalud trasladan en la práctica esa responsabilidad al importador/solicitante: la infografía oficial incluye entre los requisitos el compromiso de reporte a farmacovigilancia, y el importador debe tener un programa de farmacovigilancia que permita recibir, evaluar y reportar eventos adversos y fallas terapéuticas al Programa Nacional de Farmacovigilancia a través de VigiFlow.</p><p>Responsabilidades del importador: (1) calidad: comprar a fabricantes con BPM verificables, conservar certificados de análisis por lote y condiciones de transporte y almacenamiento; (2) trazabilidad: registro de cada lote importado, autorización MVND asociada, institución o paciente receptor y cantidades dispensadas; (3) farmacovigilancia: designar responsable, notificar eventos serios dentro de los plazos del Programa Nacional, gestionar señales y alertas del país de origen; (4) información al profesional: si el etiquetado viene del país de origen (art. 11), suministrar inserto o información traducida para uso seguro; (5) retiro de producto: tener procedimiento para retirar lotes ante alertas sanitarias nacionales o internacionales; (6) uso conforme a lo autorizado: no comercializar unidades de una autorización por paciente a terceros.</p><p>Ejemplo aplicado. Un operador importa un antineoplásico como MVND para más de un paciente. Una agencia europea publica un retiro de un lote por partículas. El responsable de farmacovigilancia cruza el lote con su registro de importaciones, identifica dos IPS receptoras, ordena cuarentena, informa al INVIMA y documenta la reconciliación de unidades. Paralelamente, revisa si hubo reportes de eventos adversos en VigiFlow relacionados con el lote.</p><p>Puntos clave:<br>1. Sin registro sanitario no hay titular: el importador asume la responsabilidad sanitaria.<br>2. Trazabilidad por lote y paciente/institución es indispensable para alertas y retiros.<br>3. Las IPS y el importador reportan eventos adversos en VigiFlow.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Programa Nacional de Farmacovigilancia: reportes y VigiFlow', 'Clase 2 · Postcomercialización', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica los lineamientos del INVIMA para reportar eventos adversos y fallas terapéuticas en VigiFlow y el contenido de reportes de la Res. 2004009455/2004.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/lineamientos-reporte-eventos-adversos-vigiflow-farmacovigilancia","title":"Circular sobre lineamientos para el reporte de eventos adversos a través de VigiFlow – Programa Nacional de Farmacovigilancia","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/sites/default/files/resolucion_2004009455_2004.pdf","title":"Resolución 2004009455 de 2004 – Contenido y periodicidad de reportes de farmacovigilancia (art. 146 Decreto 677/1995)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Etiquetado, sello de medicamento vital y reportes al INVIMA', 'Clase 2 · Postcomercialización', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el artículo 11 (etiquetado de origen y sello) y el artículo 12 (reportes de importaciones comerciales) y el régimen sancionatorio aplicable.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_0481_2004.htm","title":"[Página web] Decreto 481 de 2004 – Normas para incentivar la oferta de medicamentos vitales no disponibles (texto compilado)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/tramites_grupo_autorizaciones_licencias_vuce/GUIA_DE_DILIGENCIAMIENTO_DE_VISTO_BUENO_VUCE-INVIMA-enero_22012020.pdf","title":"Guía de diligenciamiento de intenciones de importación ante la VUCE 2.0 – Invima (v4.0, enero 2020)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso integrador: importación para 40 pacientes pediátricos desde la EPS', 'Clase 3 · Caso integrador', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Integra criterios, modalidad, expediente, VUCE, etiquetado y farmacovigilancia en un caso completo con rúbrica de evaluación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: integrar todo el curso resolviendo un caso de punta a punta, desde la identificación de la necesidad hasta la entrega y el seguimiento postcomercialización.</p><p>Caso. Una EPS con 40 pacientes de hipertensión pulmonar en niños requiere una formulación pediátrica oral que no tiene registro sanitario en Colombia. Por la Circular Externa 027 de 2025, el MinSalud conminó a las EPS a activar los mecanismos del Decreto 481 de 2004 y a garantizar suministro oportuno y continuo (Auto 559 de 2025 de la Corte Constitucional). La EPS designa como importador a un distribuidor mayorista.</p><p>Entregables que debe producir el QF regulatorio:<br>1. Concepto de procedencia MVND: verificación de no disponibilidad (base de registros INVIMA), ausencia de sustitutos (concepto clínico), producto no en investigación clínica; consulta del listado vigente de MVND y, si no aparece, solicitud de inclusión.<br>2. Selección de modalidad: más de un paciente (art. 10, tarifa 4002-25), importador legalmente constituido y autorizado para distribuir medicamentos.<br>3. Expediente: formato Word firmado y formato Excel de MVND (ATC, IUM si existe, concentración, forma farmacéutica, presentación, cantidad, lote, vencimiento, fabricante); certificado de venta libre o certificado de producto farmacéutico tipo OMS apostillado o consularizado, con traducción oficial; certificado de existencia y representación legal; certificado de análisis del lote; justificación de cantidad (40 pacientes x dosis/kg promedio x 6 meses + margen técnico explicado); soporte de pago.<br>4. Comercio exterior: tras la autorización, intención de importación/visto bueno en VUCE (tarifa 4003 por ítem) antes del arribo; registro de importación ante MinCIT cuando aplique; coordinación con la agencia de aduanas.<br>5. Etiquetado: aceptación del etiquetado de origen (art. 11) y sello \"medicamento vital\" para importaciones comerciales; material de información en español para cuidadores.<br>6. Postcomercialización: plan de farmacovigilancia (VigiFlow), trazabilidad por paciente y lote, reporte de importaciones al INVIMA según lo solicite (art. 12).<br>7. Plan de sostenibilidad: si la demanda es estable, recomendar al fabricante extranjero iniciar registro sanitario; advertir que el INVIMA puede excluir el producto del listado cuando un titular demuestre capacidad de abastecer.</p><p>Rúbrica de evaluación: coherencia de la modalidad elegida (20%), completitud del expediente (30%), cálculo y justificación de la cantidad (15%), secuencia correcta INVIMA–VUCE–aduana (15%), plan de farmacovigilancia y trazabilidad (20%).</p><p>Variante para discusión: si cinco pacientes nuevos aparecen después de la autorización, ¿se modifica la autorización o se radica una nueva? Discute con base en el principio de que la autorización ampara las cantidades justificadas y que cualquier incremento requiere nueva solicitud sustentada.</p><p>Puntos clave:<br>1. Un buen expediente MVND se construye sobre evidencia de no disponibilidad y no sustitución.<br>2. La secuencia regulatoria es: autorización INVIMA, luego VUCE, luego nacionalización.<br>3. La vía MVND es un puente; el registro sanitario es la solución de largo plazo.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Recursos de consulta permanente y canales del INVIMA', 'Clase 3 · Caso integrador', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe dónde consultar normatividad, listados, tarifas y la Oficina Virtual del INVIMA, y cómo mantenerse actualizado.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/medicamentos-vitales-no-disponibles","title":"[Página web] Medicamentos Vitales No Disponibles (normatividad, listados, formatos, requisitos y preguntas frecuentes)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/tramites-y-servicios/tarifas","title":"[Página web] Tarifas vigentes INVIMA","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://app.invima.gov.co/oficina-virtual/","title":"[Página web] Oficina Virtual INVIMA (radicación)","description":"INVIMA (ES)"}'::jsonb);

END
$curso$;
