-- ============================================================
--  043_cursos_asuntos_regulatorios.sql — La línea Regulatoria
--
--  Diez cursos de asuntos regulatorios ante el INVIMA, con su
--  estructura completa: cinco unidades cada uno, 333 clases en total, y en cada clase el
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

-- ─── 1. Curso de Asuntos Regulatorios Farmacéuticos en Colombia (33 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Asuntos Regulatorios Farmacéuticos en Colombia' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Asuntos Regulatorios Farmacéuticos en Colombia', 'Panorama integral de los asuntos regulatorios farmacéuticos en Colombia: autoridades, marco normativo vigente, categorías de producto, ciclo de vida, publicidad, precios, farmacovigilancia y convergencia internacional. Prepara al Químico Farmacéutico para entender el sistema y diseñar estrategias regulatorias antes de especializarse en trámites específicos ante INVIMA.', '<p>Panorama integral de los asuntos regulatorios farmacéuticos en Colombia: autoridades, marco normativo vigente, categorías de producto, ciclo de vida, publicidad, precios, farmacovigilancia y convergencia internacional. Prepara al Químico Farmacéutico para entender el sistema y diseñar estrategias regulatorias antes de especializarse en trámites específicos ante INVIMA.</p><h3>Objetivo general</h3><p>Que el Químico Farmacéutico comprenda la función regulatoria y el sistema sanitario colombiano, identifique el régimen aplicable a cada categoría de producto y su ciclo de vida, y formule estrategias e inteligencia regulatoria alineadas con la normativa vigente y la armonización internacional.</p><h3>A quién va dirigido</h3><p>Químicos Farmacéuticos y estudiantes de último año de Química Farmacéutica en Colombia, y profesionales de calidad, mercadeo, comercio exterior y áreas técnicas que interactúan con INVIMA.</p><h3>Contexto normativo</h3><p>Colombia — normativa INVIMA / MinSalud</p>',
          'Asuntos regulatorios', 'intermedio', 'Que el Químico Farmacéutico comprenda la función regulatoria y el sistema sanitario colombiano, identifique el régimen aplicable a cada categoría de producto y su ciclo de vida, y formule estrategias e inteligencia regulatoria alineadas con la normativa vigente y la armonización internacional.', 'Químicos Farmacéuticos y estudiantes de último año de Química Farmacéutica en Colombia, y profesionales de calidad, mercadeo, comercio exterior y áreas técnicas que interactúan con INVIMA.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Fundamentos de los asuntos regulatorios y rol del Químico Farmacéutico', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: el mapa de los asuntos regulatorios en Colombia', 'Clase 1 · Introducción al curso', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante conoce la estructura del curso y una visión general de autoridades, normas, categorías de producto y ciclo de vida regulatorio.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.unbosque.edu.co/sites/default/files/2025-07/Diplomado%20en%20Asuntos%20regulatorios%20sobre%20medicamentos%20biologicos%20y%20de%20sintesis%20quimica.pdf","title":"Diplomado en Asuntos regulatorios sobre medicamentos biológicos y de síntesis química (contenidos y módulos)","description":"Universidad El Bosque (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/blog/sala-de-prensa-13/el-invima-lidera-la-transformacion-regulatoria-en-el-xiii-congreso-nacional-de-ciencias-farmaceutica-157","title":"[Página web] El Invima lidera la transformación regulatoria en el XIII Congreso Nacional de Ciencias Farmacéuticas","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, '¿Qué son los asuntos regulatorios y por qué existen?', 'Clase 2 · La función regulatoria y el profesional de asuntos regulatorios', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Comprende la razón de ser de la función regulatoria, sus objetivos y su relación con calidad, mercadeo y negocio.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: comprender qué es la función de asuntos regulatorios (AR) en la industria farmacéutica colombiana y por qué existe.</p><p>Desarrollo: Los asuntos regulatorios son la disciplina que conecta a la empresa con la autoridad sanitaria. Su razón de ser es que ningún medicamento, biológico, fitoterapéutico, dispositivo médico o cosmético puede fabricarse, importarse o comercializarse en Colombia sin el permiso sanitario que corresponde a su categoría (registro sanitario, permiso de comercialización o notificación sanitaria obligatoria). La base legal parte de la Ley 9 de 1979 (Código Sanitario Nacional), que somete a vigilancia y control los productos que afectan la salud, y se desarrolla en reglamentos técnicos como el Decreto 677 de 1995 para medicamentos.</p><p>El área de AR cumple cuatro funciones: (1) obtener los permisos sanitarios antes del lanzamiento; (2) mantenerlos vigentes durante toda la vida del producto (renovaciones, modificaciones, notificaciones de desabastecimiento según el Decreto 334 de 2022); (3) asegurar que la información que la empresa comunica, como etiquetas, insertos y publicidad, coincida con lo aprobado; y (4) vigilar el entorno normativo para anticipar cambios (inteligencia regulatoria). Por eso AR trabaja de forma transversal con calidad, producción, desarrollo, mercadeo, comercio exterior y farmacovigilancia. Un error regulatorio, como un registro vencido, una modificación no notificada o una pieza publicitaria con una indicación no aprobada, puede traducirse en medidas sanitarias de seguridad, sanciones, retiro de producto del mercado y pérdida de confianza de pacientes y profesionales.</p><p>Ejemplo aplicado: un laboratorio quiere lanzar un genérico de losartán 50 mg. AR verifica que el principio activo esté incluido en las Normas Farmacológicas, define la documentación técnica (fabricante con certificado de BPM, estabilidad y, si aplica, bioequivalencia), radica la solicitud de registro sanitario ante INVIMA, responde los autos de requerimiento y, una vez aprobado, revisa que el material de empaque y la comunicación comercial reflejen exactamente el registro. Después mantiene el registro al día: hoy la vigencia de los registros de medicamentos es indefinida (Decreto 1474 de 2023), así que su tarea es gestionar modificaciones, reportes de no comercialización y retiro, y renovar solo los productos que aún tienen vigencia temporal, como los fitoterapéuticos.</p><p>Puntos clave:<br>1. AR es la función que obtiene y mantiene la licencia para operar de cada producto; sin ella no hay venta legal.<br>2. Su trabajo abarca todo el ciclo de vida: desarrollo, registro, cambios posteriores, renovación y retiro.<br>3. Es un área transversal: traduce la norma a decisiones de calidad, mercadeo y negocio.</p><p>Nota de actualización normativa (oct. 2026): el Decreto 1474 de 2023 modificó el art. 16 del Decreto 677 de 1995 y dio vigencia indefinida a los registros sanitarios de medicamentos (síntesis química, biológicos, homeopáticos y gases medicinales), incluidos los vigentes a esa fecha; el INVIMA archiva las solicitudes de renovación de estos productos. La renovación con radicación mínima de un mes antes del vencimiento (Decreto 334 de 2022, art. 4) se conserva como antecedente y aplica hoy a productos que mantienen vigencia temporal, como los fitoterapéuticos (Decreto 1156 de 2018, 10 años renovables). Lo que sigue exigiendo control continuo es la gestión del registro: modificaciones, notificación de no comercialización (30 días) y aviso de retiro definitivo (6 meses).</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Rol, competencias y responsabilidades del QF en asuntos regulatorios', 'Clase 2 · La función regulatoria y el profesional de asuntos regulatorios', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Identifica perfiles de cargo (analista, coordinador, director técnico de AR), competencias técnicas y responsabilidades legales del QF frente a INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.unbosque.edu.co/sites/default/files/2025-07/Diplomado%20en%20Asuntos%20regulatorios%20sobre%20medicamentos%20biologicos%20y%20de%20sintesis%20quimica.pdf","title":"Diplomado en Asuntos regulatorios sobre medicamentos biológicos y de síntesis química (contenidos y módulos)","description":"Universidad El Bosque (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Ciencia regulatoria y tendencias de transformación del INVIMA', 'Clase 3 · Ciencia regulatoria y transformación del INVIMA', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el concepto de ciencia regulatoria y las iniciativas recientes de INVIMA (gestión de represamiento, digitalización, enfoque de riesgo).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preview/145148","title":"Congreso de Investigación Sanitaria y Ensayos Clínicos: ciencia regulatoria en Colombia (programa 2026)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.raps.org/resource/latin-america-roundup-invima-touts-reform-effort.html","title":"[Página web] Latin America Roundup: INVIMA touts reform effort (2025)","description":"Regulatory Affairs Professionals Society (RAPS) (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: diseño del mapa funcional de un departamento de asuntos regulatorios', 'Clase 3 · Ciencia regulatoria y transformación del INVIMA', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica los conceptos de la unidad construyendo inventario, calendario de vencimientos, flujos e indicadores de un área de AR.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar los conceptos de la unidad diseñando el mapa funcional de un departamento de asuntos regulatorios en un laboratorio colombiano.</p><p>Desarrollo: Un departamento de AR típico se organiza por portafolio (síntesis química, biológicos, fitoterapéuticos/suplementos, dispositivos y cosméticos) o por proceso (nuevos registros, mantenimiento/ciclo de vida, publicidad y etiquetado, inteligencia regulatoria). En ambos modelos hay un responsable que firma ante INVIMA, normalmente un químico farmacéutico, y analistas que preparan expedientes, hacen seguimiento a radicados y responden requerimientos. Los insumos llegan de calidad (certificados de BPM, especificaciones, estabilidad), de desarrollo (formulación, bioequivalencia), de mercadeo (piezas publicitarias, nuevos lanzamientos) y de la casa matriz cuando el producto es importado.</p><p>Caso práctico: Laboratorio Andino S.A.S. tiene 40 registros sanitarios de medicamentos de síntesis, 3 biológicos y 10 suplementos dietarios. Mercadeo planea dos lanzamientos al año. Pasos sugeridos para el mapa:<br>1. Inventario: construir una matriz con número de registro, titular, fabricante, fecha de vencimiento, modalidad y condición de venta. La fuente es el expediente de cada producto y la consulta pública de registros de INVIMA.<br>2. Calendario: marcar vencimientos de certificados (BPM, CPP), compromisos de estabilidad, plazos de modificaciones y, para productos con vigencia temporal como los fitoterapéuticos, renovaciones con alertas a 12, 6 y 2 meses.<br>3. Flujos: definir quién aprueba cambios (control de cambios de calidad, evaluación regulatoria y clasificación de la modificación) y quién revisa piezas publicitarias antes de publicarlas, dado que la publicidad está sujeta a control posterior.<br>4. Indicadores: tiempo promedio de respuesta a requerimientos, registros vencidos (meta cero) y piezas publicitarias observadas.<br>5. Inteligencia: asignar un responsable que revise semanalmente actas de la Comisión Revisora, proyectos normativos de MinSalud y alertas sanitarias.<br>6. Capacidad: estimar la carga anual (renovaciones del año, modificaciones esperadas, lanzamientos y piezas publicitarias) y compararla con las horas disponibles del equipo para justificar recursos ante la gerencia.</p><p>Entregable: un organigrama del área, la matriz de inventario con semáforo de vencimientos y una tabla RACI que indique quién es responsable, quién aprueba, a quién se consulta y a quién se informa en cada proceso.</p><p>Puntos clave:<br>1. Un buen departamento de AR se diseña desde el inventario de registros y su calendario de vencimientos.<br>2. El QF responsable articula calidad, mercadeo y la autoridad; necesita flujos de aprobación claros.<br>3. Medir tiempos y vencimientos convierte a AR de un área reactiva en una estratégica.</p><p>Nota de actualización normativa (oct. 2026): el Decreto 1474 de 2023 modificó el art. 16 del Decreto 677 de 1995 y dio vigencia indefinida a los registros sanitarios de medicamentos (síntesis química, biológicos, homeopáticos y gases medicinales), incluidos los vigentes a esa fecha; el INVIMA archiva las solicitudes de renovación de estos productos. La renovación con radicación mínima de un mes antes del vencimiento (Decreto 334 de 2022, art. 4) se conserva como antecedente y aplica hoy a productos que mantienen vigencia temporal, como los fitoterapéuticos (Decreto 1156 de 2018, 10 años renovables). Lo que sigue exigiendo control continuo es la gestión del registro: modificaciones, notificación de no comercialización (30 días) y aviso de retiro definitivo (6 meses).</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Sistema sanitario y autoridades regulatorias', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: quién regula qué en Colombia', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la arquitectura del sistema de vigilancia sanitaria y las competencias de cada autoridad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://invima.gov.co/el-instituto/cooperacion-internacional","title":"[Página web] Cooperación internacional – El Instituto (ARNr nivel IV OPS, ICH, reconocimiento entre ARNr)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Ministerio de Salud y Ley Estatutaria 1751 de 2015: rector de la política farmacéutica', 'Clase 2 · MinSalud, INVIMA y la Comisión Revisora', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el papel de MinSalud como regulador y el mandato de la Ley 1751 de 2015 sobre política farmacéutica, transparencia de registros y precios.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.funcionpublica.gov.co/eva/gestornormativo/norma_pdf.php?i=60733","title":"Ley 1751 de 2015 – Ley Estatutaria de Salud (texto, incl. art. 23 política farmacéutica y precios)","description":"Función Pública – Gestor Normativo (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.saludcapital.gov.co:443/Documents/Decreto_780-2016.pdf","title":"Decreto 780 de 2016 – Decreto Único Reglamentario del Sector Salud y Protección Social","description":"Secretaría Distrital de Salud de Bogotá (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'INVIMA: naturaleza, funciones, direcciones y servicios', 'Clase 2 · MinSalud, INVIMA y la Comisión Revisora', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la estructura y funciones de INVIMA como agencia sanitaria nacional (registros, BPM, inspección, vigilancia, alertas) a partir de sus informes de gestión.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preview/123839","title":"Acta de Informe de Gestión INVIMA 2015-2018 (Dirección General)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/preview/129159","title":"Informe de rendición de cuentas INVIMA vigencia 2022","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'La Comisión Revisora y sus salas especializadas (incluida la Sala Especializada de Medicamentos)', 'Clase 2 · MinSalud, INVIMA y la Comisión Revisora', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Comprende la función de la Comisión Revisora y de sus salas (medicamentos, fitoterapéuticos y suplementos, homeopáticos, dispositivos) en la evaluación farmacológica y en la emisión de conceptos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/sala-especializada-fitoterapicos-homeopaticos-suplementos","title":"[Página web] Sala Especializada de Medicamentos Fitoterapéuticos, Homeopáticos y Suplementos Dietarios (normas, formatos, listados y actas)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/preview/128696","title":"Acta conjunta Comisión Revisora No. 01 de 2013 (inclusión en Norma Farmacológica 23.1 y suplementos)","description":"INVIMA – Comisión Revisora (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Secretarías de salud, Supersalud y SIC en la vigilancia de productos farmacéuticos', 'Clase 3 · Autoridades territoriales, SIC y posición internacional del INVIMA', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Distingue las competencias de las entidades territoriales de salud, Supersalud y la SIC frente a las de INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: describir el papel de las entidades territoriales de salud y de la Superintendencia de Industria y Comercio (SIC) dentro del sistema regulatorio de productos farmacéuticos.</p><p>Desarrollo: En Colombia la vigilancia sanitaria está distribuida. El Ministerio de Salud y Protección Social formula la política y expide la regulación. El INVIMA otorga los registros sanitarios, certifica buenas prácticas de manufactura y vigila a fabricantes e importadores. Las secretarías de salud departamentales y distritales (entidades territoriales de salud) ejercen inspección, vigilancia y control en el canal de distribución y dispensación: droguerías, farmacias-droguerías, depósitos y servicios farmacéuticos. Verifican condiciones de almacenamiento, productos sin registro o vencidos y medicamentos de control especial. También alimentan la farmacovigilancia como nodos de la Red Nacional. La Superintendencia Nacional de Salud vigila a los actores del sistema de salud (EPS, IPS) y la SIC protege al consumidor, la libre competencia y la propiedad industrial (marcas y patentes). La SIC también es destinataria de lineamientos sobre información y publicidad, como la Resolución 1896 de 2023.</p><p>Ejemplo aplicado: un QF de AR recibe la noticia de que una secretaría de salud decomisó en una droguería unidades de un producto de su empresa con etiqueta diferente a la aprobada. El análisis regulatorio debe establecer si se trata de un lote anterior a una modificación aprobada por INVIMA (y si el agotamiento de existencias estaba permitido), de una falsificación (en cuyo caso se coordina con INVIMA una alerta sanitaria) o de un incumplimiento propio que exige una acción correctiva. La competencia sobre el establecimiento es de la secretaría, mientras que la competencia sobre el registro sanitario y el fabricante es de INVIMA. El QF debe documentar la trazabilidad del lote (fecha de fabricación, fecha de aprobación de la modificación y distribución) y responder por escrito a la autoridad que actuó, dentro de los términos del procedimiento sancionatorio.</p><p>Puntos clave:<br>1. INVIMA regula el producto y al fabricante o importador; las secretarías de salud vigilan la cadena de distribución y dispensación.<br>2. La SIC actúa en protección al consumidor, competencia y propiedad industrial; Supersalud vigila a los actores del aseguramiento y la prestación.<br>3. Identificar qué autoridad es competente es el primer paso para responder bien a cualquier actuación sanitaria.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'INVIMA como Autoridad Reguladora Nacional de Referencia Regional (nivel IV OPS)', 'Clase 3 · Autoridades territoriales, SIC y posición internacional del INVIMA', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe qué significa la certificación de INVIMA como ARN de referencia regional nivel IV de la OPS y sus implicaciones para el reconocimiento entre autoridades.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://invima.gov.co/el-instituto/cooperacion-internacional","title":"[Página web] Cooperación internacional – El Instituto (ARNr nivel IV OPS, ICH, reconocimiento entre ARNr)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/preview/127489","title":"Resolución 2010020509 de 2010 – Comité Asesor interno (recomendación de auditoría OPS/OMS para certificación como ARN de referencia)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/biblioteca/preview/123844","title":"Acta de Informe de Gestión INVIMA 2007-2011 (reconocimiento OPS como autoridad de referencia regional)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: búsqueda de un concepto de la Comisión Revisora para soportar un trámite', 'Clase 3 · Autoridades territoriales, SIC y posición internacional del INVIMA', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la búsqueda de antecedentes en actas de salas especializadas y listados de INVIMA para sustentar una solicitud.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/sala-especializada-fitoterapicos-homeopaticos-suplementos","title":"[Página web] Sala Especializada de Medicamentos Fitoterapéuticos, Homeopáticos y Suplementos Dietarios (normas, formatos, listados y actas)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/preview/124792","title":"Acta No. 02 de 2009 Sala Especializada de Dispositivos Médicos y Productos Varios (clasificación de productos)","description":"INVIMA – Comisión Revisora (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Marco normativo y categorías de productos', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: pirámide normativa sanitaria', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la jerarquía normativa (Constitución, leyes, decretos, resoluciones, circulares, normas CAN) aplicable a productos farmacéuticos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.saludcapital.gov.co:443/Documents/Decreto_780-2016.pdf","title":"Decreto 780 de 2016 – Decreto Único Reglamentario del Sector Salud y Protección Social","description":"Secretaría Distrital de Salud de Bogotá (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Ley 9 de 1979, Decreto 677 de 1995 y Decreto 780 de 2016', 'Clase 2 · Normas marco de los medicamentos', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el Código Sanitario Nacional como base legal, el Decreto 677 como reglamento técnico de registros sanitarios de medicamentos y el alcance del Decreto Único Reglamentario 780 de 2016.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.saludcapital.gov.co:443/Documents/Decreto_780-2016.pdf","title":"Decreto 780 de 2016 – Decreto Único Reglamentario del Sector Salud y Protección Social","description":"Secretaría Distrital de Salud de Bogotá (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.freyrsolutions.com/es/what-is-the-process-for-registering-a-pharmaceutical-product-with-invima","title":"[Página web] Proceso para registrar un producto farmacéutico ante el INVIMA","description":"Freyr Solutions (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Decreto 334 de 2022 y su modificación por el Decreto 1474 de 2023', 'Clase 2 · Normas marco de los medicamentos', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta qué cambió el Decreto 334 (renovación automática —hoy sustituida por la vigencia indefinida del Decreto 1474 de 2023—, clasificación de modificaciones, información y publicidad, desabastecimiento) y los ajustes de plazos del Decreto 1474 de 2023.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.funcionpublica.gov.co/eva/gestornormativo/norma_pdf.php?i=219130","title":"Decreto 334 de 2022 – renovación, modificación y suspensión de registros sanitarios, información y publicidad, desabastecimiento","description":"Función Pública – Gestor Normativo (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://consultorsalud.com/aplaza-guias-de-registro-sanitario/","title":"[Página web] Se aplaza la vigencia para la emisión de guías de registro sanitario (contexto Decreto 334/2022)","description":"Consultorsalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Normas Farmacológicas: qué son y cómo se consultan', 'Clase 2 · Normas marco de los medicamentos', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Comprende la función de las Normas Farmacológicas como listado de principios activos e indicaciones aceptadas y su relación con la evaluación farmacológica.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preview/128696","title":"Acta conjunta Comisión Revisora No. 01 de 2013 (inclusión en Norma Farmacológica 23.1 y suplementos)","description":"INVIMA – Comisión Revisora (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Medicamentos de síntesis química y biológicos (Decreto 1782 de 2014)', 'Clase 3 · Categorías de productos y su régimen sanitario', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara el régimen de los medicamentos de síntesis y de los biológicos, incluidas las tres rutas de evaluación del Decreto 1782 de 2014.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1782_2014.htm","title":"[Página web] Decreto 1782 de 2014 – evaluación farmacológica y farmacéutica de medicamentos biológicos (tres rutas)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://consultorsalud.com/decreto-1782-de-2014-medicamentos-biotecnologicos/","title":"[Página web] Decreto 1782 de 2014 – Medicamentos Biotecnológicos (análisis)","description":"Consultorsalud (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/biblioteca/preview/126615","title":"Terapias avanzadas: una mirada desde el contexto Colombia (INVIMA, 2016)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Fitoterapéuticos, homeopáticos y suplementos dietarios', 'Clase 3 · Categorías de productos y su régimen sanitario', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Diferencia los regímenes de fitoterapéuticos (Decreto 2266 de 2004), homeopáticos (Decreto 3554 de 2004 y Decreto 1861 de 2006) y suplementos dietarios (Decreto 3249 de 2006).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/sala-especializada-fitoterapicos-homeopaticos-suplementos","title":"[Página web] Sala Especializada de Medicamentos Fitoterapéuticos, Homeopáticos y Suplementos Dietarios (normas, formatos, listados y actas)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_2266_2004.htm","title":"[Página web] Decreto 2266 de 2004 – productos fitoterapéuticos","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_sala_especializada_fitoterapicos_homeopaticos_suplementos/Decreto3249de2006.pdf","title":"Decreto 3249 de 2006 – suplementos dietarios","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Dispositivos médicos (Decreto 4725 de 2005) y cosméticos (régimen andino de NSO)', 'Clase 3 · Categorías de productos y su régimen sanitario', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la clasificación por riesgo de dispositivos médicos (I, IIa, IIb, III) y el régimen andino de notificación sanitaria obligatoria (NSO) de cosméticos (Decisión 516 de la CAN, que según lo conocido fue sustituida por la Decisión 833 de 2018; Edvanta debe confirmar el texto vigente antes de publicar).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_4725_2005.htm","title":"[Página web] Decreto 4725 de 2005 – registros sanitarios, permiso de comercialización y vigilancia sanitaria de dispositivos médicos","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/sites/default/files/medicamentos-productos-biologicos/DECISION%20516.pdf","title":"Decisión 516 – Armonización de legislaciones en materia de productos cosméticos (CAN)","description":"INVIMA / Comunidad Andina (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/sites/default/files/medicamentos-productos-biologicos/Resolucion-2161-CAN-disposiciones-NSO-cosmeticos.pdf","title":"Resolución 2161 SGCAN – documentación para reconocimiento del código de NSO de cosméticos","description":"INVIMA / Comunidad Andina (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: clasificación de productos frontera ante INVIMA', 'Clase 4 · Productos frontera', 7, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica criterios de definición para clasificar productos limítrofes (medicamento vs. suplemento, dispositivo vs. medicamento, cosmético vs. medicamento) y define el permiso requerido.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preview/124792","title":"Acta No. 02 de 2009 Sala Especializada de Dispositivos Médicos y Productos Varios (clasificación de productos)","description":"INVIMA – Comisión Revisora (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/preview/128696","title":"Acta conjunta Comisión Revisora No. 01 de 2013 (inclusión en Norma Farmacológica 23.1 y suplementos)","description":"INVIMA – Comisión Revisora (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Ciclo de vida regulatorio, publicidad, precios y farmacovigilancia', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: obligaciones regulatorias después del registro', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume las obligaciones que acompañan al producto en el mercado: mantenimiento del registro, información y publicidad, precios y seguridad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/sites/default/files/medicamentos-y-productos-biologicos/tecnico-medicamentos-2/Decreto%20No.%20334%20de%202022.pdf","title":"Decreto No. 334 de 2022 (publicado por INVIMA)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Etapas del ciclo de vida: desarrollo, registro, mantenimiento, desabastecimiento y retiro', 'Clase 2 · Ciclo de vida regulatorio del producto', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las etapas regulatorias del producto y las obligaciones de notificación de no comercialización temporal (30 días) y retiro definitivo (6 meses de aviso).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.funcionpublica.gov.co/eva/gestornormativo/norma_pdf.php?i=219130","title":"Decreto 334 de 2022 – renovación, modificación y suspensión de registros sanitarios, información y publicidad, desabastecimiento","description":"Función Pública – Gestor Normativo (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: línea de tiempo regulatoria de un medicamento genérico', 'Clase 2 · Ciclo de vida regulatorio del producto', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la planeación de hitos regulatorios (registro, modificaciones, renovación, notificaciones) para un producto real.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.funcionpublica.gov.co/eva/gestornormativo/norma_pdf.php?i=219130","title":"Decreto 334 de 2022 – renovación, modificación y suspensión de registros sanitarios, información y publicidad, desabastecimiento","description":"Función Pública – Gestor Normativo (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Información y publicidad de medicamentos: Resolución 1896 de 2023', 'Clase 3 · Publicidad y regulación de precios', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Comprende los principios y límites de la publicidad de medicamentos y fitoterapéuticos (prescripción vs. venta libre, canales digitales, control posterior).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://consultorsalud.com/aj-publicidad-de-medicamentos-resolucion-1896-2023/","title":"[Página web] Resolución 1896 de 2023: lineamientos para publicidad de medicamentos","description":"Consultorsalud (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://consultorsalud.com/comercializacion-medicamentos-canales-digitales/","title":"[Página web] Comercialización de medicamentos en canales digitales: ¿qué debe saber? (Res. 1896 de 2023)","description":"Consultorsalud (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minproteccion_4320_2004.htm","title":"[Página web] Resolución 4320 de 2004 – publicidad de medicamentos y fitoterapéuticos de venta libre (DEROGADA por Res. 1896 de 2023)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Regulación de precios: Comisión Nacional de Precios de Medicamentos y Dispositivos Médicos', 'Clase 3 · Publicidad y regulación de precios', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la conformación y función de la CNPMDM, el régimen de control directo, el precio de referencia internacional y la metodología para medicamentos nuevos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normas.cra.gov.co/gestor/docs/circular_cnpmd_0003_2013.htm","title":"[Página web] Circular 03 de 2013 CNPMD – metodología de control directo de precios (DEROGADA por Circular 18 de 2024)","description":"Gestor normativo CRA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Programa Nacional de Farmacovigilancia y Red Nacional', 'Clase 4 · Farmacovigilancia: visión general', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la organización de la farmacovigilancia en Colombia (INVIMA, Red Nacional, titulares de registro) y los tipos de eventos a reportar.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/sites/default/files/FarmaseguridadVol5N1.pdf","title":"Boletín FarmaSeguridad Vol. 5 N.º 1 (2016) – Programa Nacional de Farmacovigilancia","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/sites/default/files/Infograf%C3%ADa%2BGeneral%2BVigiFlow.pdf","title":"Infografía general VigiFlow","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: reporte de un evento adverso en la plataforma de INVIMA', 'Clase 4 · Farmacovigilancia: visión general', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta el diligenciamiento de un reporte de evento adverso (reportante, paciente, medicamento, evento) en la plataforma de farmacovigilancia.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Armonización internacional, estrategia e inteligencia regulatoria', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: Colombia en el contexto regulatorio global', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume por qué la convergencia regulatoria internacional cambia la forma de planear trámites en Colombia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://invima.gov.co/el-instituto/cooperacion-internacional","title":"[Página web] Cooperación internacional – El Instituto (ARNr nivel IV OPS, ICH, reconocimiento entre ARNr)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'ICH y PIC/S: armonización técnica e inspecciones', 'Clase 2 · Armonización y dependencia regulatoria', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara el alcance de ICH (guías técnicas, CTD) y PIC/S (inspecciones BPM) y la situación de INVIMA en cada uno.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.pharmabiz.net/wp-content/uploads/2017/12/Ingreso-Invima-observador-ICH-FINAL.pdf","title":"Colombia''s INVIMA gains observer status at the ICH (2017)","description":"Pharmabiz (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://invima.gov.co/el-instituto/cooperacion-internacional","title":"[Página web] Cooperación internacional – El Instituto (ARNr nivel IV OPS, ICH, reconocimiento entre ARNr)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://picscheme.org/en/about-regulatory-environment-other-organisations","title":"[Página web] PIC/S – Other Organisations (cooperación PIC/S con ICH, ICMRA y otras)","description":"PIC/S (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'OPS, Red PARF y reliance (dependencia regulatoria)', 'Clase 2 · Armonización y dependencia regulatoria', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los principios de reliance de la OPS y las recomendaciones de la Red PARF, y cómo se aplican a decisiones regulatorias en la región.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://paho.org/sites/default/files/pandrh-maria-luz-pombo-principios-de-reliance_0.pdf","title":"Principios para una efectiva utilización de decisiones de autoridades regulatorias de otras jurisdicciones (reliance)","description":"OPS/OMS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://paho.org/sites/default/files/2024-09/xi-cparf-conclusiones-recomendaciones-2024-08-23-espanol0.pdf","title":"XI Conferencia Red PARF – Conclusiones y adopción de recomendaciones (2024)","description":"OPS – Red PARF (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.argentina.gob.ar/sites/default/files/1000-man08-00_manual_de_buenas_practicas_de_reliance.pdf","title":"Manual de buenas prácticas de reliance (ANMAT)","description":"ANMAT – Argentina (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Estrategia regulatoria: del portafolio al plan de lanzamiento', 'Clase 3 · Estrategia e inteligencia regulatoria', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Comprende cómo se construye una estrategia regulatoria (clasificación, ruta, evidencia, tiempos, riesgos) alineada al negocio.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.freyrsolutions.com/es/what-is-the-process-for-registering-a-pharmaceutical-product-with-invima","title":"[Página web] Proceso para registrar un producto farmacéutico ante el INVIMA","description":"Freyr Solutions (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.raps.org/resource/latin-america-roundup-invima-touts-reform-effort.html","title":"[Página web] Latin America Roundup: INVIMA touts reform effort (2025)","description":"Regulatory Affairs Professionals Society (RAPS) (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Inteligencia regulatoria: fuentes, vigilancia normativa y análisis', 'Clase 3 · Estrategia e inteligencia regulatoria', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las fuentes y el método de la inteligencia regulatoria para anticipar cambios normativos y criterios de INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: interpretar qué es la inteligencia regulatoria y cómo se organiza un sistema de vigilancia normativa en un área de AR en Colombia.</p><p>Desarrollo: La inteligencia regulatoria consiste en recolectar, analizar y comunicar información sobre normas, criterios de la autoridad y tendencias internacionales para tomar decisiones. Tiene tres capas. (1) Normativa: decretos y resoluciones de MinSalud (incluidos los proyectos en consulta pública), circulares de la Comisión Nacional de Precios de Medicamentos y Dispositivos Médicos, normas CAN y guías de INVIMA; la fuente práctica es el normograma de INVIMA. (2) Criterio técnico: actas de las salas especializadas de la Comisión Revisora (por ejemplo, la Sala Especializada de Medicamentos), conceptos de INVIMA, listados de plantas aceptadas o declaraciones aprobadas para suplementos y alertas sanitarias. (3) Internacional: guías ICH, decisiones de autoridades de referencia (EMA, FDA, ANVISA, COFEPRIS) y recomendaciones OPS/Red PARF, útiles para anticipar lo que INVIMA adoptará y para estrategias de reliance.</p><p>Ejemplo aplicado: la empresa evalúa lanzar un suplemento dietario con un ingrediente nuevo. Inteligencia regulatoria revisa el listado vigente de nuevos ingredientes aceptados por la Sala Especializada de Productos Fitoterapéuticos y Suplementos Dietarios. Si no está, busca en las actas antecedentes de negación (por ejemplo, ingredientes con efectos farmacológicos, como ocurrió con el resveratrol en 2013). Con eso recomienda presentar primero una consulta a la sala o cambiar la categoría del producto. El resultado es una nota de una página con riesgo, plazo estimado y alternativa.</p><p>Método recomendado: definir una lista de fuentes con frecuencia de revisión (semanal para actas y alertas, mensual para proyectos normativos, trimestral para guías internacionales); registrar cada hallazgo en una matriz con fecha, fuente, productos afectados, impacto (alto, medio o bajo) y acción; y comunicar los hallazgos en un boletín interno a calidad, mercadeo y gerencia. Participar en consultas públicas de MinSalud e INVIMA, directamente o a través de gremios como ANDI, AFIDRO o ASINFAR, convierte la inteligencia en incidencia regulatoria.</p><p>Puntos clave:<br>1. La inteligencia regulatoria combina normas, criterios de la autoridad y tendencias internacionales.<br>2. Las actas de la Comisión Revisora y el normograma de INVIMA son las fuentes más valiosas del día a día.<br>3. Su producto final es una recomendación accionable para el negocio, no una lista de normas.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso integrador: estrategia regulatoria para el lanzamiento de un biosimilar en Colombia', 'Clase 3 · Estrategia e inteligencia regulatoria', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta un plan regulatorio completo (clasificación, ruta del Decreto 1782, evaluación farmacológica, BPM/reliance, precio, publicidad y farmacovigilancia).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: ejecutar un plan de estrategia regulatoria para el lanzamiento de un medicamento en Colombia, integrando los temas del curso.</p><p>Desarrollo: Una estrategia regulatoria responde cinco preguntas: ¿qué es el producto (categoría y régimen)?, ¿qué ruta y evidencia exige la autoridad?, ¿cuánto tarda y cuánto cuesta?, ¿qué condiciones de mercado vienen con la aprobación (precio, publicidad, farmacovigilancia)? y ¿qué riesgos existen y cómo se mitigan?</p><p>Caso práctico: una compañía multinacional quiere introducir en Colombia un biosimilar de un anticuerpo monoclonal ya aprobado por la EMA.<br>1. Clasificación: es un medicamento biológico, regido por el Decreto 677 de 1995 y por el Decreto 1782 de 2014 para la evaluación farmacológica y farmacéutica.<br>2. Ruta: elegir entre expediente completo, comparabilidad o ruta abreviada de comparabilidad. La elección depende de la evidencia disponible y de la experiencia con el producto de referencia.<br>3. Evaluación farmacológica: solicitar el concepto de la Sala Especializada de la Comisión Revisora para la inclusión o indicación. Conviene revisar actas previas sobre la molécula.<br>4. Calidad: verificar el estatus de BPM del fabricante. Explorar si los acuerdos de reconocimiento entre autoridades de referencia regional o los mecanismos de reliance que INVIMA aplique pueden facilitar la certificación.<br>5. Mercado: anticipar el régimen de precios. Si la molécula está en control directo, el precio máximo lo fija la CNPMDM; para medicamentos nuevos aplica la Circular 16 de 2023, que usa el valor terapéutico evaluado por el IETS. Planear también la publicidad, que para medicamentos de prescripción solo puede dirigirse a profesionales (Res. 1896 de 2023), y el plan de gestión de riesgos y farmacovigilancia.<br>6. Cronograma y riesgos: construir un diagrama de Gantt con radicación, requerimientos, concepto de sala y expedición del registro. Como riesgos, considerar la acumulación de trámites en INVIMA, los cambios normativos en curso y los requerimientos de comparabilidad.<br>7. Entregable: un documento de estrategia de dos páginas con la recomendación de ruta, el cronograma, el presupuesto de tasas y estudios, los supuestos y un plan B (por ejemplo, la ruta de expediente completo si la comparabilidad es objetada).</p><p>Puntos clave:<br>1. La estrategia regulatoria empieza por la clasificación correcta del producto y la ruta de evaluación.<br>2. Integra calidad, evidencia clínica, precio, publicidad y farmacovigilancia en un solo plan.<br>3. Debe actualizarse con inteligencia regulatoria a medida que cambian las normas y los criterios de INVIMA.</p>"}'::jsonb);

END
$curso$;

-- ─── 2. Curso de Registro Sanitario de Medicamentos ante el INVIMA (35 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Registro Sanitario de Medicamentos ante el INVIMA' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Registro Sanitario de Medicamentos ante el INVIMA', 'Curso práctico para obtener el registro sanitario nuevo de medicamentos en Colombia: concepto, vigencia, modalidades, clasificación del producto y evaluaciones farmacológica, farmacéutica y legal.', '<p>Curso práctico para obtener el registro sanitario nuevo de medicamentos en Colombia: concepto, vigencia, modalidades, clasificación del producto y evaluaciones farmacológica, farmacéutica y legal. Cubre requisitos para síntesis química, biológicos, fitoterapéuticos y homeopáticos, certificados BPM y CPP, tarifas, tiempos, radicación en línea, actos administrativos y CUM, con casos reales del INVIMA.</p><h3>Objetivo general</h3><p>Que el químico farmacéutico planee, prepare y radique una solicitud de registro sanitario nuevo de medicamento ante el INVIMA, eligiendo la ruta de evaluación y la modalidad correctas, reuniendo los requisitos del tipo de producto e interpretando los actos administrativos resultantes.</p><h3>A quién va dirigido</h3><p>Químicos farmacéuticos y profesionales de asuntos regulatorios, calidad y dirección técnica de laboratorios, importadores y titulares de registros en Colombia.</p><h3>Contexto normativo</h3><p>Colombia — normativa INVIMA / MinSalud</p>',
          'Asuntos regulatorios', 'intermedio', 'Que el químico farmacéutico planee, prepare y radique una solicitud de registro sanitario nuevo de medicamento ante el INVIMA, eligiendo la ruta de evaluación y la modalidad correctas, reuniendo los requisitos del tipo de producto e interpretando los actos administrativos resultantes.', 'Químicos farmacéuticos y profesionales de asuntos regulatorios, calidad y dirección técnica de laboratorios, importadores y titulares de registros en Colombia.',
          1440, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Fundamentos del registro sanitario de medicamentos en Colombia', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: el registro sanitario como puerta de entrada al mercado', 'Clase 1 · Introducción al curso', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Comprende el alcance del curso, el papel del QF de asuntos regulatorios y la ruta completa desde la solicitud hasta la resolución y el CUM.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preview/144211","title":"[Página web] Organigrama interrelación actores – Módulo 2: Autorización de comercialización (2026)","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://consultorsalud.com/invima-tramito-9000-registros-sanitarios-2022","title":"[Página web] INVIMA gestionó más de 9.000 trámites asociados a registros sanitarios de medicamentos","description":"Consultorsalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, '¿Qué es el registro sanitario y cuándo se exige?', 'Clase 2 · Concepto, marco normativo y vigencia', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Define el registro sanitario como acto administrativo que autoriza fabricar, importar, envasar y comercializar un medicamento, y reconoce las actividades que lo requieren.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/decreto_677_1995pdf-1","title":"[Página web] Decreto número 677 de 1995 sobre régimen de registros, licencias y vigilancia sanitaria de medicamentos, cosméticos y productos de aseo","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_2510_2003.htm","title":"[Página web] Decreto 2510 de 2003 – Por el cual se modifica el artículo 13 del Decreto 677 de 1995","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.saludcapital.gov.co:443/Normo/jur/decreto_677_de_1995.pdf","title":"Decreto 677 de 1995 (texto completo)","description":"Secretaría Distrital de Salud de Bogotá – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Mapa normativo vigente: Decreto 677/1995 y sus reformas', 'Clase 2 · Concepto, marco normativo y vigencia', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ubica cada norma en el ciclo de vida del registro: 677/1995 (régimen general y registro nuevo), 2086/2010, 2106/2019 (vía unificada), 1782/2014 (biológicos), 334/2022 y 1474/2023 (renovación, modificación, vigencia).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preview/144211","title":"[Página web] Organigrama interrelación actores – Módulo 2: Autorización de comercialización (2026)","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_0334_2022.htm","title":"[Página web] Decreto 334 de 2022 – Renovación, modificación y suspensión de registros sanitarios de medicamentos","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.lafm.com.co/sociedad/crisis-medicamentos-colombia-invima-salud-407074","title":"[Página web] Gobierno propone nuevo modelo para agilizar los registros sanitarios de medicamentos en Colombia (ago. 2026)","description":"La FM (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Vigencia del registro sanitario: de 10 años a vigencia indefinida', 'Clase 2 · Concepto, marco normativo y vigencia', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la evolución de la vigencia (10 años, 5 años con el Decreto 2086/2010 y vigencia indefinida con el Decreto 1474/2023) y sus excepciones, como los fitoterapéuticos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_2086_2010.htm","title":"[Página web] Decreto 2086 de 2010 – Procedimiento acelerado de evaluación de solicitudes de registro sanitario por razones de interés público o salud pública","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Modalidades: fabricar y vender, importar y vender, importar, envasar y vender y otras', 'Clase 3 · Modalidades del registro y actores', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las modalidades del art. 14 del Decreto 677/1995 (incluidas importar, semielaborar y vender; semielaborar y vender) y la modalidad fabricar y exportar.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=P8mbmy2SM2E","provider":"youtube","videoId":"P8mbmy2SM2E","title":"QUE TIPO DE REGISTRO INVIMA NECESITAS ?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.saludcapital.gov.co:443/Normo/jur/decreto_677_de_1995.pdf","title":"Decreto 677 de 1995 (texto completo)","description":"Secretaría Distrital de Salud de Bogotá – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_2510_2003.htm","title":"[Página web] Decreto 2510 de 2003 – Por el cual se modifica el artículo 13 del Decreto 677 de 1995","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Actores del registro: titular, fabricante, importador, envasador y acondicionador', 'Clase 3 · Modalidades del registro y actores', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Diferencia las responsabilidades de cada actor que figura en el registro sanitario y cómo se reflejan en la resolución.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://webservice.invima.gov.co/registros/pdf/16669292_2024048209.pdf","title":"Resolución INVIMA 2024048209 – Por la cual se concede un Registro Sanitario (ejemplo real, modalidad importar y vender)","description":"INVIMA – Consulta de registros (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/sites/default/files/medicamentos-y-productos-biologicos/tecnico-medicamentos-2/Decreto%20No.%20334%20de%202022.pdf","title":"Decreto No. 334 de 2022 (PDF oficial)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: identificar modalidad y actores en una resolución real', 'Clase 3 · Modalidades del registro y actores', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica los conceptos a una resolución de concesión del INVIMA para identificar modalidad, titular, fabricante extranjero, importador y vida útil.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://webservice.invima.gov.co/registros/pdf/16669292_2024048209.pdf","title":"Resolución INVIMA 2024048209 – Por la cual se concede un Registro Sanitario (ejemplo real, modalidad importar y vender)","description":"INVIMA – Consulta de registros (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Clasificación del medicamento y evaluaciones farmacológica, farmacéutica y legal', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: ¿qué evalúa el INVIMA y quién lo evalúa?', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la diferencia entre medicamentos nuevos e incluidos en Normas Farmacológicas y las tres evaluaciones que aplica el INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/sala-especializada-medicamentos-sintesis","title":"[Página web] Sala Especializada de Medicamentos de Síntesis Química y Biológica – Comisión Revisora","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Medicamento nuevo vs. medicamento incluido en Normas Farmacológicas', 'Clase 2 · Medicamentos nuevos, Normas Farmacológicas y evaluaciones', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara ambas categorías (arts. 19, 20, 25 y 26 del Decreto 677/1995) y aprende a consultar el compendio de Normas Farmacológicas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.saludcapital.gov.co:443/Normo/jur/decreto_677_de_1995.pdf","title":"Decreto 677 de 1995 (texto completo)","description":"Secretaría Distrital de Salud de Bogotá – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/sala-especializada-medicamentos-sintesis","title":"[Página web] Sala Especializada de Medicamentos de Síntesis Química y Biológica – Comisión Revisora","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Evaluación farmacológica y la Sala Especializada (SEMPB)', 'Clase 2 · Medicamentos nuevos, Normas Farmacológicas y evaluaciones', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta qué analiza la evaluación farmacológica (eficacia, seguridad, dosificación, indicaciones, condiciones de comercialización), los plazos y cómo leer las actas de la Comisión Revisora.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/sala-especializada-medicamentos-sintesis","title":"[Página web] Sala Especializada de Medicamentos de Síntesis Química y Biológica – Comisión Revisora","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.saludcapital.gov.co:443/Normo/jur/decreto_677_de_1995.pdf","title":"Decreto 677 de 1995 (texto completo)","description":"Secretaría Distrital de Salud de Bogotá – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_2086_2010.htm","title":"[Página web] Decreto 2086 de 2010 – Procedimiento acelerado de evaluación de solicitudes de registro sanitario por razones de interés público o salud pública","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Evaluación farmacéutica y evaluación legal', 'Clase 2 · Medicamentos nuevos, Normas Farmacológicas y evaluaciones', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los documentos y criterios de la evaluación farmacéutica (capacidad del fabricante y calidad del producto) y de la evaluación legal (arts. 21–24 del Decreto 677/1995).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.saludcapital.gov.co:443/Normo/jur/decreto_677_de_1995.pdf","title":"Decreto 677 de 1995 (texto completo)","description":"Secretaría Distrital de Salud de Bogotá – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www1.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=9751","title":"[Página web] Decreto 677 de 1995 - Gestor Normativo - Función Pública","description":"Función Pública – Gestor Normativo (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Solicitud unificada de evaluación farmacológica y registro sanitario nuevo', 'Clase 3 · Vía unificada del Decreto 2106 de 2019', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la vía unificada que integra las tres evaluaciones con plazo no mayor a 180 días y la estructura CTD de los formatos de solicitud del INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.asuntoslegales.com.co/analisis/viviana-aguirre-vargas-2943274/registro-sanitario-de-medicamentos-en-180-dias-2943273","title":"[Página web] ¿Registro sanitario de medicamentos en 180 días? (análisis del Decreto 2106 de 2019)","description":"Asuntos Legales – Lloreda Camacho & Co. (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/sites/default/files/medicamentos-y-productos-biologicos/tecnico-medicamentos-2/FM166.pdf","title":"ASS-RSA-FM166 Formato de presentación de solicitud unificada de evaluación farmacológica y registro sanitario nuevo (Decreto 2106 de 2019)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/biblioteca/preview/144211","title":"[Página web] Organigrama interrelación actores – Módulo 2: Autorización de comercialización (2026)","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: ruta de una molécula nueva vs. un genérico en Normas Farmacológicas', 'Clase 3 · Vía unificada del Decreto 2106 de 2019', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica los criterios de clasificación para definir la ruta de evaluación de dos productos y planear su expediente.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: decidir, a partir de la información de un producto, si la solicitud de registro sanitario debe tramitarse como medicamento nuevo (con evaluación farmacológica) o como medicamento incluido en Normas Farmacológicas, y planear la ruta ante el INVIMA.</p><p>Desarrollo: el Decreto 677 de 1995 distingue dos clases de medicamentos (art. 19). Los incluidos en Normas Farmacológicas —el compendio que publica el INVIMA y que se actualiza periódicamente— solo requieren evaluación farmacéutica y evaluación legal (art. 20 y 25). Los medicamentos nuevos (nueva molécula, nueva asociación, nueva indicación, nueva forma farmacéutica o concentración no aprobada, nueva vía de administración) requieren además la evaluación farmacológica (arts. 26 a 28), que conceptúa la Sala Especializada de Medicamentos y Productos Biológicos (SEMPB) de la Comisión Revisora sobre eficacia, seguridad, dosificación, indicaciones, contraindicaciones y condiciones de comercialización. Con el Decreto 2106 de 2019 (antitrámites) se habilitó una vía unificada en la que las tres evaluaciones se solicitan de manera simultánea, con un plazo de evaluación no mayor a 180 días, usando formatos de solicitud unificada con estructura CTD (por ejemplo, el formato ASS-RSA-FM166 para antivenenos).</p><p>Ejemplo aplicado. Caso A: un laboratorio nacional quiere registrar losartán potásico 50 mg tabletas recubiertas, fabricado en su propia planta con BPM vigente. El principio activo, la concentración, la forma farmacéutica y las indicaciones ya figuran en Normas Farmacológicas, por lo que la ruta es evaluación farmacéutica + legal, modalidad fabricar y vender. El QF debe verificar el ítem de Normas Farmacológicas, reunir la documentación farmacéutica (fórmula cuali-cuantitativa, proceso de fabricación, especificaciones, métodos analíticos validados, estabilidad) y la legal (certificado de existencia y representación, marca ante la SIC, pago de tarifa), y verificar si aplica algún requisito adicional (por ejemplo, bioequivalencia según la lista vigente de principios activos que la exigen). Caso B: una multinacional quiere introducir una molécula aprobada por FDA y EMA que no está en Normas Farmacológicas. Es un medicamento nuevo: debe presentar información preclínica y clínica, plan de gestión de riesgo y, si es importado, certificados BPM y CPP. Si opta por la vía unificada, radica la solicitud con los módulos CTD completos; si opta por la vía secuencial, primero obtiene el concepto favorable de la SEMPB (acta publicada) y luego radica la evaluación farmacéutica y legal. Tras la aprobación, la molécula se incluye en Normas Farmacológicas.</p><p>Errores frecuentes: suponer que un cambio de concentración o de forma farmacéutica no convierte al producto en \"nuevo\"; no revisar las actas recientes de la SEMPB; presentar documentación sin la estructura exigida por el formato.</p><p>Puntos clave:<br>1. Normas Farmacológicas = evaluación farmacéutica + legal; medicamento nuevo = farmacológica + farmacéutica + legal.<br>2. La SEMPB de la Comisión Revisora emite el concepto farmacológico y sus actas son la mejor fuente de precedentes.<br>3. La vía unificada del Decreto 2106 de 2019 permite radicar las tres evaluaciones a la vez; planee el expediente CTD completo desde el inicio.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Requisitos según el tipo de medicamento', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: un registro, varios regímenes', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume qué norma aplica a cada tipo de producto: síntesis química (Decreto 677/1995), biológicos (Decreto 1782/2014), fitoterapéuticos (Decreto 1156/2018) y homeopáticos (Decreto 3554/2004).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preview/144211","title":"[Página web] Organigrama interrelación actores – Módulo 2: Autorización de comercialización (2026)","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Requisitos del expediente de síntesis química', 'Clase 2 · Medicamentos de síntesis química', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Identifica la información técnica y legal exigida para un medicamento de síntesis química y su organización por módulos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/sites/default/files/medicamentos-y-productos-biologicos/tecnico-medicamentos-2/FM166.pdf","title":"ASS-RSA-FM166 Formato de presentación de solicitud unificada de evaluación farmacológica y registro sanitario nuevo (Decreto 2106 de 2019)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.saludcapital.gov.co:443/Normo/jur/decreto_677_de_1995.pdf","title":"Decreto 677 de 1995 (texto completo)","description":"Secretaría Distrital de Salud de Bogotá – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: lista de verificación para un genérico fabricado por terceros', 'Clase 2 · Medicamentos de síntesis química', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta una lista de verificación completa para radicar el registro de un genérico en Normas Farmacológicas fabricado bajo contrato.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: armar la lista de verificación de un expediente para solicitar el registro sanitario nuevo de un medicamento genérico de síntesis química incluido en Normas Farmacológicas.</p><p>Desarrollo: para un medicamento de síntesis química en Normas Farmacológicas, el Decreto 677 de 1995 exige evaluación farmacéutica (arts. 21 a 23) y evaluación legal (art. 24). La evaluación farmacéutica analiza la capacidad técnica del fabricante y la calidad del producto; la legal verifica la identidad del titular, del fabricante y del importador, la marca y el pago. El INVIMA puede requerir información adicional por una sola vez; si el interesado no responde en el término, se configura el desistimiento.</p><p>Ejemplo aplicado: el laboratorio \"Farmalab S.A.S.\" (ejemplo ficticio) desea registrar metformina clorhidrato 850 mg tabletas, fabricadas por un tercero nacional (maquila). Lista de verificación:<br>- Legal: formulario de solicitud diligenciado; certificado de existencia y representación legal del titular y del fabricante; poder si actúa un apoderado; certificado de marca o solicitud ante la SIC; contrato de fabricación por terceros; comprobante de pago de la tarifa vigente; autorización de notificación electrónica.<br>- Técnico del fabricante: certificado de Buenas Prácticas de Manufactura vigente expedido por el INVIMA para el área y forma farmacéutica (tabletas no betalactámicas).<br>- Farmacéutico del producto: fórmula cuali-cuantitativa por unidad y por lote; especificaciones del principio activo y excipientes con su farmacopea de referencia; proveedor del principio activo con certificado de análisis; descripción del proceso de fabricación y controles en proceso; especificaciones del producto terminado; métodos analíticos y su validación cuando no son farmacopeicos; estudios de estabilidad que soporten la vida útil y condiciones de almacenamiento propuestas; material de envase y presentaciones comerciales; proyectos de etiquetas, empaques e inserto según las normas de etiquetado; perfiles de disolución y, si el principio activo está en la lista que exige bioequivalencia, el estudio correspondiente.<br>- Modalidad: fabricar y vender (con posibilidad de exportar).<br>Una vez radicado en la plataforma de trámites en línea, el QF hace seguimiento del radicado, atiende el requerimiento (auto) si llega, y al recibir la resolución de concesión verifica que coincidan nombre, composición, presentaciones, vida útil y fabricante.</p><p>Puntos clave:<br>1. En genéricos de Normas Farmacológicas, el peso del expediente está en la calidad: BPM del fabricante, especificaciones, validación y estabilidad.<br>2. Fabricar por terceros exige soportar la relación contractual y las BPM del fabricante real.<br>3. Una lista de verificación previa a la radicación reduce requerimientos y tiempos.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Rutas de evaluación de biológicos: expediente completo, comparabilidad y abreviada', 'Clase 3 · Medicamentos biológicos (Decreto 1782 de 2014)', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara las tres rutas del Decreto 1782/2014, la información común exigida (proceso, identidad, potencia, pureza, inmunogenicidad, plan de gestión de riesgo) y los requisitos de BPM y lotes.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=Cq2diDJQSgo","provider":"youtube","videoId":"Cq2diDJQSgo","title":"¿Qué son los Medicamentos Biológicos y Biosimilares?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1782_2014.htm","title":"[Página web] Decreto 1782 de 2014 – Requisitos y procedimiento para las evaluaciones farmacológica y farmacéutica de los medicamentos biológicos","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/biblioteca/preview/126906","title":"[Página web] Decreto 1782 de 2014 (ficha y documento en biblioteca INVIMA)","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Biosimilares en Colombia: contexto y productos aprobados por comparabilidad', 'Clase 3 · Medicamentos biológicos (Decreto 1782 de 2014)', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el contexto regulatorio de los biosimilares y analiza el listado INVIMA de biológicos aprobados por rutas de comparabilidad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=xA6CEMEQVpQ","provider":"youtube","videoId":"xA6CEMEQVpQ","title":"¿Qué es un medicamento biológico biosimilar? Tu Farmacéutico Informa - #Biosimilares","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=NBxhZYo_RJM","provider":"youtube","videoId":"NBxhZYo_RJM","title":"Arquitectura regulatoria para ampliar competencia en biológicos y biosimilares","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/sites/default/files/medicamentos-y-productos-biologicos/tecnico-medicamentos-2/Decreto_1782_de_2014.pdf","title":"Listado de medicamentos biológicos por las rutas de comparabilidad – Decreto 1782 de 2014 (corte 31 de diciembre de 2024)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: elegir la ruta para un anticuerpo monoclonal biosimilar', 'Clase 3 · Medicamentos biológicos (Decreto 1782 de 2014)', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica los criterios del Decreto 1782/2014 para seleccionar la ruta de evaluación y planear el expediente de un biosimilar.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1782_2014.htm","title":"[Página web] Decreto 1782 de 2014 – Requisitos y procedimiento para las evaluaciones farmacológica y farmacéutica de los medicamentos biológicos","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/sites/default/files/medicamentos-y-productos-biologicos/tecnico-medicamentos-2/Decreto_1782_de_2014.pdf","title":"Listado de medicamentos biológicos por las rutas de comparabilidad – Decreto 1782 de 2014 (corte 31 de diciembre de 2024)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Registro sanitario de productos fitoterapéuticos (Decreto 1156 de 2018)', 'Clase 4 · Fitoterapéuticos y homeopáticos (nivel general)', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la clasificación PFM, PFT y PFTI, el listado de plantas medicinales, las modalidades, la vigencia de 10 años y el registro automático con revisión posterior.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_1156_2018.htm","title":"[Página web] Decreto 1156 de 2018 – Régimen de registro sanitario de productos fitoterapéuticos","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_homeopaticos_fitoterapeuticos_NEW/Decreto_1156_de_2018.pdf","title":"Decreto 1156 de 2018","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Registro sanitario de medicamentos homeopáticos (Decreto 3554 de 2004)', 'Clase 4 · Fitoterapéuticos y homeopáticos (nivel general)', 7, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el régimen de registro de homeopáticos simples, complejos y magistrales y su relación con el Decreto 334/2022 para renovaciones y modificaciones.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/decreto-3554-2004-medicamentos-homeopaticos","title":"[Página web] Decreto 3554 de 2004: Régimen de Registro Sanitario y Control de Medicamentos Homeopáticos","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_0334_2022.htm","title":"[Página web] Decreto 334 de 2022 – Renovación, modificación y suspensión de registros sanitarios de medicamentos","description":"Normograma INVIMA (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Certificaciones, tarifas, tiempos y trámite en línea', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: preparar la radicación', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume los insumos previos a la radicación: certificados del fabricante, situación regulatoria en origen, pago de la tarifa y acceso a la plataforma.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/tramites-y-servicios/tramites-en-linea","title":"[Página web] Trámites en línea – Sistema de Trámites en Línea INVIMA","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Certificado de Buenas Prácticas de Manufactura del fabricante', 'Clase 2 · Certificado BPM y CPP para importados', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la exigencia de BPM vigentes del fabricante nacional o extranjero durante el trámite y la vigencia del registro, y la responsabilidad del solicitante sobre su vigencia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/concepto_invima_16021519_2016.htm","title":"[Página web] Concepto INVIMA 16021519 de 2016 – Certificado de BPM para registro sanitario de medicamentos importados","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_2086_2010.htm","title":"[Página web] Decreto 2086 de 2010 – Procedimiento acelerado de evaluación de solicitudes de registro sanitario por razones de interés público o salud pública","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Certificado de Producto Farmacéutico (CPP) y certificado de venta libre', 'Clase 2 · Certificado BPM y CPP para importados', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el CPP tipo OMS, quién lo emite, qué demuestra y cómo se usa en solicitudes de medicamentos importados.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.aemps.gob.es/comercio-exterior/certificado-de-producto-farmaceutico","title":"[Página web] Certificado de producto farmacéutico (modelo OMS)","description":"AEMPS (España) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://prais.paho.org/?p=17458","title":"[Página web] Proyecto de la Red PARF en CPF / PANDRH''s CPP Project","description":"OPS – PRAIS (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Tarifas del INVIMA y pago del trámite', 'Clase 3 · Tarifas y tiempos INVIMA', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el sistema tarifario del INVIMA (manual tarifario vigente y sus actualizaciones) y el procedimiento de pago previo a la radicación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=fAi2kiawL0g","provider":"youtube","videoId":"fAi2kiawL0g","title":"Tutorial para generación de recibo de pago en oficina bancaria (INVIMA)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_invima_29573_2025.htm","title":"[Página web] Resolución 2025029573 de 2025 – Modifica parcialmente la Resolución 20240057944 de 2024 de tarifas del INVIMA","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/tramites_tarifas/MEDICAMENTOS.pdf","title":"Instructivo Manual Tarifario – Actualización extraordinaria abril 2020 (Medicamentos)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Tiempos de ley e indicadores de desempeño del INVIMA', 'Clase 3 · Tarifas y tiempos INVIMA', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los tiempos de ley con los tiempos reales publicados por el INVIMA y estima plazos realistas para un proyecto de registro.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/tiempos-tramites-registros-sanitarios","title":"[Página web] Tiempos de trámites de registros sanitarios – Dirección de Medicamentos y Productos Biológicos","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/tiempos-a-corte-de-31-de-agosto-de-2026-xlsx","title":"[Página web] Informe de tiempos a corte de 31 de agosto de 2026 (hoja de cálculo)","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.pharmabiz.net/wp-content/uploads/2018/10/Tiempos-de-Evaluacion-Farmaceutica2018INVIMA.pdf","title":"Tiempos de evaluación farmacéutica INVIMA (2018)","description":"Pharmabiz / INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Sistema de Trámites en Línea e INVIMA a un clic', 'Clase 4 · Trámite en la plataforma de trámites en línea', 5, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Reconoce las plataformas del INVIMA para radicar registros nuevos de medicamentos, la creación de usuario y la asignación del IUM al expedir el registro.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=TfuYCgUzPO0","provider":"youtube","videoId":"TfuYCgUzPO0","title":"Ya se encuentra disponible la plataforma Invima a un clic para nuevos registros de medicamentos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/tramites-y-servicios/tramites-en-linea","title":"[Página web] Trámites en línea – Sistema de Trámites en Línea INVIMA","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/circular_invima_10798_2017.htm","title":"[Página web] Circular 10798 de 2017 INVIMA – Asignación del IUM con la plataforma INVIMA a un Clic","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: radicación paso a paso de un registro sanitario nuevo', 'Clase 4 · Trámite en la plataforma de trámites en línea', 6, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta, sobre un caso simulado, la radicación en línea de una solicitud de registro sanitario nuevo, desde el pago hasta el número de radicado y su seguimiento.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=kMhjktRya9w","provider":"youtube","videoId":"kMhjktRya9w","title":"Capacitación - Trámite de Registro Sanitario de Medicamentos en Invima a un clic","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://enlinea.invima.gov.co/rs/login/loginUsuario.jsp","title":"[Página web] Sistema de Trámites en Línea INVIMA – ingreso de usuarios","description":"INVIMA (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Actos administrativos, CUM y casos integradores', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: del radicado al producto en el mercado', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume qué ocurre después de radicar: requerimientos, decisión, firmeza del acto, asignación del CUM y consulta pública del registro.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://consultorsalud.com/invima-tramito-9000-registros-sanitarios-2022","title":"[Página web] INVIMA gestionó más de 9.000 trámites asociados a registros sanitarios de medicamentos","description":"Consultorsalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'La resolución de concesión del registro sanitario', 'Clase 2 · Actos administrativos del registro', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la estructura de una resolución de concesión (antecedentes, consideraciones, resuelve, datos del registro, vida útil, recursos y ejecutoria) con un ejemplo real.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://webservice.invima.gov.co/registros/pdf/16669292_2024048209.pdf","title":"Resolución INVIMA 2024048209 – Por la cual se concede un Registro Sanitario (ejemplo real, modalidad importar y vender)","description":"INVIMA – Consulta de registros (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Requerimientos, negación, desistimiento y recurso de reposición', 'Clase 2 · Actos administrativos del registro', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Diferencia los actos que pueden emitirse durante el trámite y los recursos que proceden, con plazos según la Ley 1437 de 2011.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: reconocer los actos administrativos que el INVIMA puede emitir durante y al final del trámite de registro sanitario nuevo (auto de requerimiento, concesión, negación, desistimiento) y los recursos que proceden.</p><p>Desarrollo: el trámite de registro sanitario es una actuación administrativa regida por el Decreto 677 de 1995 y por el Código de Procedimiento Administrativo y de lo Contencioso Administrativo (Ley 1437 de 2011). Durante la evaluación, el INVIMA puede emitir un auto de requerimiento solicitando información faltante o aclaraciones; la regla general es que se requiere una sola vez y el interesado debe responder en el término indicado. Si no responde, la solicitud se entiende desistida y se archiva mediante acto motivado. Al terminar la evaluación, el INVIMA decide de fondo con una resolución: de concesión (otorga el registro, asigna el número tipo \"INVIMA AAAAM-000000\" y aprueba composición, presentaciones, vida útil, etiquetas e inserto) o de negación (expone los motivos técnicos, farmacológicos o legales por los que el producto no cumple). En medicamentos nuevos, si la SEMPB emite concepto desfavorable, el INVIMA niega la solicitud. Contra las resoluciones procede el recurso de reposición ante el mismo funcionario que la expidió, dentro de los diez días hábiles siguientes a la notificación, como lo indica el propio acto. El acto queda en firme (ejecutoriado) cuando no se interponen recursos o estos se resuelven.</p><p>Ejemplo aplicado: un titular solicita registro para un jarabe pediátrico importado. El INVIMA emite auto pidiendo (a) estudios de estabilidad en zona climática IVb y (b) CPP vigente apostillado. El titular entrega la estabilidad pero no el CPP, por lo que la resolución niega el registro por incumplimiento de la evaluación legal. El QF analiza la resolución, verifica si el CPP fue efectivamente aportado en otro folio y, si es así, interpone recurso de reposición dentro de los 10 días hábiles, citando el folio. Si el documento no existía, la estrategia correcta es radicar una nueva solicitud completa, porque el recurso no es el espacio para subsanar requisitos no presentados.</p><p>Puntos clave:<br>1. Auto de requerimiento: se responde completo y dentro del término; no responder genera desistimiento.<br>2. La resolución (concesión o negación) es el acto definitivo; contra ella procede reposición en 10 días hábiles.<br>3. Lea cada acto con una matriz: qué decide, por qué, qué recurso procede, plazo y responsable interno.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'CUM: concepto, estructura y uso en el sistema de salud', 'Clase 3 · Código Único de Medicamentos (CUM)', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el CUM como código asignado por el INVIMA por presentación comercial, su número trazador (expediente + consecutivo) y su uso obligatorio en reportes y precios.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minproteccion_0255_2007.htm","title":"[Página web] Resolución 255 de 2007 – Por la cual se adopta el Código Único Nacional de Medicamentos, CUM","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/circular_invima_0420_2006.htm","title":"[Página web] Circular 420 de 2006 INVIMA – Validación información base de datos (estructura del CUM)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www2.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VP/FS/abece-resolucion-1479-2015.pdf","title":"ABECÉ – Preguntas frecuentes – Resolución 1479 de 2015 (uso del CUM publicado por INVIMA)","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: consulta de registro sanitario y CUM', 'Clase 3 · Código Único de Medicamentos (CUM)', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la consulta pública de un registro sanitario y sus CUM e identifica la información clave del producto.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=KZPPF2OII8w","provider":"youtube","videoId":"KZPPF2OII8w","title":"consulta registro sanitario Invima","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www2.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VP/FS/abece-resolucion-1479-2015.pdf","title":"ABECÉ – Preguntas frecuentes – Resolución 1479 de 2015 (uso del CUM publicado por INVIMA)","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso integrador: medicamento de síntesis química importado de liberación prolongada', 'Clase 4 · Casos integradores de solicitud de registro', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Integra clasificación, modalidad, BPM, CPP, expediente, radicación y resolución en un caso completo de producto importado.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: integrar todo lo aprendido en la planeación de una solicitud de registro sanitario nuevo para un medicamento de síntesis química importado.</p><p>Desarrollo y ejemplo aplicado: una empresa colombiana (titular e importador) quiere comercializar un antihipertensivo en tabletas de liberación prolongada fabricado en la India, cuyo principio activo ya está en Normas Farmacológicas pero en tableta de liberación inmediata. Pasos de análisis:<br>1. Clasificación: una forma farmacéutica de liberación modificada no incluida en Normas Farmacológicas convierte el producto en \"nuevo\" para esa forma; requiere evaluación farmacológica por la SEMPB, además de la farmacéutica y la legal. Revise las actas de la SEMPB y considere la vía unificada del Decreto 2106 de 2019.<br>2. Modalidad: importar y vender (si el producto llega terminado y empacado) o importar, envasar y vender (si se envasa en Colombia). Defina también si habrá acondicionador secundario local.<br>3. Requisitos del fabricante extranjero: certificado de BPM vigente del fabricante emitido por la autoridad sanitaria del país de origen o certificación del INVIMA según la regla vigente para el país y tipo de producto; traducción oficial y apostilla cuando aplique. El concepto INVIMA 16021519 de 2016 recuerda que el interesado debe gestionar con antelación la vigencia de estos certificados.<br>4. Situación regulatoria en origen: Certificado de Producto Farmacéutico tipo OMS (o certificado de venta libre, según el caso) que demuestre la autorización en el país de fabricación o de referencia.<br>5. Calidad: módulo 3 CTD con información del IFA y del producto terminado, validaciones, estabilidad en zona climática IVb, perfiles de disolución comparativos y, si aplica, bioequivalencia.<br>6. Seguridad y eficacia: resúmenes y estudios clínicos que sustenten la liberación prolongada, plan de gestión de riesgo.<br>7. Legal: existencia y representación del titular/importador, poder, marca ante la SIC, pago de la tarifa vigente.<br>8. Radicación: plataforma de trámites en línea; seguimiento del radicado y del cronograma de la SEMPB.<br>9. Resultado: resolución de concesión con número de registro, modalidad, fabricante, importador, vida útil y presentaciones; posteriormente se asignan los CUM por presentación comercial. Un ejemplo real comparable es la Resolución 2024048209, que concedió un registro en modalidad importar y vender para tabletas de liberación prolongada fabricadas en la India.</p><p>Puntos clave:<br>1. Primero clasifique (nuevo vs Normas Farmacológicas) y luego elija modalidad: ambas decisiones definen todo el expediente.<br>2. Para importados, BPM del fabricante y CPP/CVL son los documentos críticos de tiempo: gestiónelos primero.<br>3. Verifique la resolución final contra lo solicitado antes de que quede en firme.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso integrador: fitoterapéutico nacional y homeopático importado', 'Clase 4 · Casos integradores de solicitud de registro', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara las rutas de registro de un fitoterapéutico y un homeopático frente a un medicamento de síntesis química.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: comparar el trámite de registro sanitario de un producto fitoterapéutico y de un medicamento homeopático con el de un medicamento de síntesis química, identificando la norma aplicable y las diferencias de ruta.</p><p>Desarrollo: los fitoterapéuticos se rigen por el Decreto 1156 de 2018, que derogó la mayor parte del Decreto 2266 de 2004. Clasifica los productos en preparaciones farmacéuticas con base en plantas medicinales (PFM), productos fitoterapéuticos de uso tradicional (PFT) y productos fitoterapéuticos de uso tradicional importados (PFTI). Las modalidades son fabricar y vender (incluye exportar), importar y vender, importar, acondicionar y vender, y fabricar y exportar. La planta debe estar en el listado de plantas medicinales aceptadas con fines terapéuticos; si no lo está, primero se solicita su inclusión (concepto en tres meses). Para PFM el INVIMA hace evaluación farmacéutica y legal y decide en 30 días hábiles; para PFT y PFTI con planta en el listado el registro es automático con revisión posterior. Con el Decreto 1474 de 2023, los registros de homeopáticos pasaron a vigencia indefinida (confirmar en el acto administrativo de cada producto). Los homeopáticos se rigen por el Decreto 3554 de 2004 (régimen de registro sanitario y control de medicamentos homeopáticos), que distingue homeopáticos simples, complejos y magistrales; su registro se basa principalmente en evaluación farmacéutica y legal, con la cepa homeopática y la farmacopea homeopática de referencia como ejes de calidad, y desde el Decreto 334 de 2022 su renovación y modificaciones siguen las reglas comunes con los medicamentos de síntesis química y biológicos.</p><p>Ejemplo aplicado: una empresa quiere lanzar (a) un jarabe de hiedra (Hedera helix) fabricado en Colombia y (b) un complejo homeopático importado de Alemania. Para (a), el QF verifica que la especie y la parte usada estén en el listado, determina si es PFM (forma farmacéutica con especificaciones y estudios de calidad) o PFT, arma la documentación farmacéutica (identificación botánica, marcadores, especificaciones, estabilidad) y la legal, y radica con modalidad fabricar y vender. Para (b), arma la documentación de cepas, diluciones y método de preparación según farmacopea homeopática, el certificado de BPM del fabricante y el certificado de venta libre del país de origen, y radica con modalidad importar y vender.</p><p>Puntos clave:<br>1. Fitoterapéuticos: Decreto 1156 de 2018; homeopáticos: Decreto 3554 de 2004; no se aplican los requisitos de síntesis química sin adaptar.<br>2. El listado de plantas medicinales es el filtro inicial para fitoterapéuticos.<br>3. La vigencia y la ruta (automática o evaluada) dependen del tipo de producto: confírmelas en la norma antes de planear tiempos.</p>"}'::jsonb);

END
$curso$;

-- ─── 3. Curso de Renovación de Registros Sanitarios de Medicamentos (32 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Renovación de Registros Sanitarios de Medicamentos' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Renovación de Registros Sanitarios de Medicamentos', 'Curso práctico sobre la vigencia del registro sanitario de medicamentos en Colombia: del régimen de renovación del Decreto 677 de 1995 y la renovación automática del Decreto 334 de 2022, a la vigencia indefinida del Decreto 1474 de 2023.', '<p>Curso práctico sobre la vigencia del registro sanitario de medicamentos en Colombia: del régimen de renovación del Decreto 677 de 1995 y la renovación automática del Decreto 334 de 2022, a la vigencia indefinida del Decreto 1474 de 2023. Aborda los requisitos que aún aplican (fitoterapéuticos y transición de biológicos), la actualización continua del registro, la no comercialización, el retiro y el agotamiento, y la planificación del portafolio con tarifas INVIMA.</p><h3>Objetivo general</h3><p>Que el estudiante gestione la vigencia y la actualización de los registros sanitarios de un portafolio farmacéutico ante el INVIMA, aplicando el régimen vigente (Decretos 334 de 2022 y 1474 de 2023, Decreto 1156 de 2018 para fitoterapéuticos) para evitar pérdidas de vigencia, suspensiones y desabastecimientos.</p><h3>A quién va dirigido</h3><p>Químicos Farmacéuticos, profesionales de asuntos regulatorios, directores técnicos y equipos de calidad, abastecimiento y mercadeo de laboratorios, importadores y titulares de registros sanitarios en Colombia.</p><h3>Contexto normativo</h3><p>Colombia — normativa INVIMA / MinSalud</p>',
          'Asuntos regulatorios', 'intermedio', 'Que el estudiante gestione la vigencia y la actualización de los registros sanitarios de un portafolio farmacéutico ante el INVIMA, aplicando el régimen vigente (Decretos 334 de 2022 y 1474 de 2023, Decreto 1156 de 2018 para fitoterapéuticos) para evitar pérdidas de vigencia, suspensiones y desabastecimientos.', 'Químicos Farmacéuticos, profesionales de asuntos regulatorios, directores técnicos y equipos de calidad, abastecimiento y mercadeo de laboratorios, importadores y titulares de registros sanitarios en Colombia.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Vigencia del registro sanitario: de la renovación quinquenal a la vigencia indefinida', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: por qué la renovación cambió de naturaleza', 'Clase 1 · Introducción al curso', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Presenta el recorrido del curso y el giro normativo: del registro de cinco años con renovación a la vigencia indefinida de los medicamentos (Decreto 1474 de 2023) y a la gestión continua del registro.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=kMhjktRya9w","provider":"youtube","videoId":"kMhjktRya9w","title":"Capacitación - Trámite de Registro Sanitario de Medicamentos en Invima a un clic","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/archivosExternos/doc_invima_0005_2023.pdf","title":"Opinión Jurídica Nº 107: Novedades en el registro sanitario de los medicamentos. Decreto 1474 de 2023","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.bluradio.com/nacion/medicamentos-con-registro-sanitario-del-invima-tendran-vigencia-indefinida-ya-no-sera-de-cinco-anos-rg10","title":"[Página web] Medicamentos con registro sanitario del Invima tendrán vigencia indefinida: ya no será de cinco años","description":"Blu Radio (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Decreto 677 de 1995 y Decreto 2086 de 2010: vigencia de cinco años y renovación anticipada', 'Clase 2 · Evolución del régimen de vigencia y renovación', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el régimen clásico: vigencia de cinco años, radicación de la renovación con al menos tres meses de antelación y trámite como solicitud nueva si se radicaba tarde.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_0677_1995.htm","title":"[Página web] Decreto 677 de 1995 (compilación con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_2086_2010.htm","title":"[Página web] Decreto 2086 de 2010 – procedimiento acelerado y vigencia de registros","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://consultorsalud.com/wp-content/uploads/2021/07/MODIFICACION-677-Y-DEROGATORIA-843-DE-2016.pdf","title":"Decreto 843 de 2016 – modificación del Decreto 677 (renovaciones y modificaciones)","description":"ConsultorSalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Decreto 334 de 2022: renovación automática y control posterior en 8 meses', 'Clase 2 · Evolución del régimen de vigencia y renovación', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la renovación automática del Decreto 334 de 2022: radicación con no menos de un mes de antelación, acto a más tardar el día de vencimiento y revisión posterior basada en riesgo en máximo ocho meses.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=itqYKOk_Z80","provider":"youtube","videoId":"itqYKOk_Z80","title":"Guías para el Decreto 334 de 2022","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_0334_2022.htm","title":"[Página web] Decreto 334 de 2022 (compilación Normograma INVIMA)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/sites/default/files/medicamentos-y-productos-biologicos/tecnico-medicamentos-2/Decreto%20No.%20334%20de%202022.pdf","title":"Decreto No. 334 de 2022 (PDF publicado por INVIMA)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Decreto 1474 de 2023: vigencia indefinida y sus límites', 'Clase 2 · Evolución del régimen de vigencia y renovación', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Explica que desde el 8 de septiembre de 2023 los registros de medicamentos tienen vigencia indefinida, que los vigentes a esa fecha la adquirieron y que el INVIMA conserva sus facultades de inspección, vigilancia y control.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.saludyfarmacos.org/boletin-farmacos/boletines/nov202303/19_co","title":"[Página web] Colombia. Medicamentos con registro sanitario indefinido y otros cambios clave en el Invima","description":"Salud y Fármacos (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.fenalco.com.co/blog/juridico-2/notijuridico-136-minsalud-modifica-aspectos-administrativos-para-prevenir-y-mitigar-el-desabastecimiento-de-medicamentos-2122","title":"[Página web] Notijurídico 136 – MinSalud modifica aspectos administrativos para prevenir y mitigar el desabastecimiento de medicamentos","description":"Fenalco (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Medicamentos con vigencia indefinida vs. fitoterapéuticos con vigencia de diez años', 'Clase 3 · Alcance por tipo de producto', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara el régimen de síntesis química, biológicos, homeopáticos y gases medicinales (vigencia indefinida) con el de fitoterapéuticos, que conservan diez años renovables según el Decreto 1156 de 2018.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_1156_2018.htm","title":"[Página web] Decreto 1156 de 2018 – régimen de registro sanitario de productos fitoterapéuticos","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/archivosExternos/doc_invima_0005_2023.pdf","title":"Opinión Jurídica Nº 107: Novedades en el registro sanitario de los medicamentos. Decreto 1474 de 2023","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: interpretar el estado de un registro en la consulta del INVIMA', 'Clase 3 · Alcance por tipo de producto', 5, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica la consulta pública de registros para identificar fecha de expedición, vigencia, estado y modalidad de un registro y decidir qué trámite corresponde.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=2QIjvbquMKY","provider":"youtube","videoId":"2QIjvbquMKY","title":"Consultar Registro INVIMA Colombia","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/resoluci_c3_b3n_no_2025002473__del_23_de_enero_de_2025_13pdf","title":"Resolución 2025002473 (23 ene 2025): archivo de solicitudes relacionadas con renovaciones de registros sanitarios","description":"INVIMA (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Requisitos de renovación y transición por tipo de producto', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: requisitos de renovación y régimen de transición', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume los requisitos documentales de renovación que se exigían y que aún se exigen, y cómo se resolvieron las renovaciones en trámite tras la vigencia indefinida.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_0334_2022.htm","title":"[Página web] Decreto 334 de 2022 (compilación Normograma INVIMA)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/circular_invima_0019_2023.htm","title":"[Página web] Circular 19 de 2023 – registros sanitarios de medicamentos biológicos tras el Decreto 1474 de 2023","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Síntesis química y gases medicinales: requisitos de la renovación automática', 'Clase 2 · Requisitos documentales por tipo de producto', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los requisitos del artículo 3 del Decreto 334 de 2022 (formato del INVIMA, BPM vigente, CVL o CPP vigente, documentación actualizada) y la prohibición de incluir modificaciones en la renovación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_0334_2022.htm","title":"[Página web] Decreto 334 de 2022 (compilación Normograma INVIMA)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/sites/default/files/medicamentos-y-productos-biologicos/tecnico-medicamentos-2/Decreto%20No.%20334%20de%202022.pdf","title":"Decreto No. 334 de 2022 (PDF publicado por INVIMA)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/MET/2016-03-11-cuadro-respuestas-proyecto-normativo-renovaciones-modificaciones-registrossanitarios-medicamentos.pdf","title":"Cuadro de respuestas al proyecto normativo de renovaciones y modificaciones de registros sanitarios de medicamentos (2016)","description":"MinSalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Biológicos: Circular 19 de 2023, renovaciones en trámite y migración normativa', 'Clase 2 · Requisitos documentales por tipo de producto', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta cómo las renovaciones de biológicos en trámite pasaron a ser modificaciones conservando turno y tarifa, y la obligación de migración normativa para productos aprobados con el Decreto 677 sin evaluación bajo el Decreto 1782 de 2014.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/circular_invima_0019_2023.htm","title":"[Página web] Circular 19 de 2023 – registros sanitarios de medicamentos biológicos tras el Decreto 1474 de 2023","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/compilacion/docs/resolucion_minsaludps_0553_2017.htm","title":"[Página web] Resolución 553 de 2017 – Guía de evaluación de la inmunogenicidad de medicamentos biológicos","description":"Normograma INVIMA / MinSalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Fitoterapéuticos: renovación automática y no automática (Decreto 1156 de 2018)', 'Clase 2 · Requisitos documentales por tipo de producto', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara las condiciones de la renovación automática (art. 27: listado de plantas, información mantenida, estabilidad de dos lotes industriales, BPM, CVL para importados) con la ruta no automática (art. 29).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_1156_2018.htm","title":"[Página web] Decreto 1156 de 2018 – régimen de registro sanitario de productos fitoterapéuticos","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: renovación de un fitoterapéutico importado', 'Clase 3 · Casos prácticos de requisitos', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la preparación del expediente de renovación de un fitoterapéutico importado, verificando CVL, BPM y estabilidad antes del vencimiento.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_1156_2018.htm","title":"[Página web] Decreto 1156 de 2018 – régimen de registro sanitario de productos fitoterapéuticos","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/el-instituto/acceso-a-mercados-internacionales/importaciones","title":"[Página web] Importaciones – Acceso a Mercados Internacionales","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: biológico aprobado bajo el Decreto 677 que debe migrar', 'Clase 3 · Casos prácticos de requisitos', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica la Circular 19 de 2023 para planear la modificación por migración normativa de un biológico, incluida la tarifa del manual tarifario.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/circular_invima_0019_2023.htm","title":"[Página web] Circular 19 de 2023 – registros sanitarios de medicamentos biológicos tras el Decreto 1474 de 2023","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/resoluci_c3_b3n_no_2025002473__del_23_de_enero_de_2025_13pdf","title":"Resolución 2025002473 (23 ene 2025): archivo de solicitudes relacionadas con renovaciones de registros sanitarios","description":"INVIMA (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Actualización de la información técnica: estabilidad, BPM, insertos y CPP', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: el registro indefinido exige actualización continua', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume por qué, sin renovación periódica, la actualización de estabilidad, BPM, insertos y certificados de importación se hace mediante modificaciones y está sujeta a control posterior.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=itqYKOk_Z80","provider":"youtube","videoId":"itqYKOk_Z80","title":"Guías para el Decreto 334 de 2022","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/archivosExternos/doc_invima_0005_2023.pdf","title":"Opinión Jurídica Nº 107: Novedades en el registro sanitario de los medicamentos. Decreto 1474 de 2023","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Vigilancia posterior basada en riesgo y obligación de mantener las condiciones aprobadas', 'Clase 2 · Actualizaciones de calidad, seguridad y eficacia', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el capítulo de revisión y control posterior del Decreto 334 de 2022 y la cláusula del Decreto 1474 de 2023 que permite al INVIMA actuar ante incumplimientos o riesgos de farmacovigilancia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_0334_2022.htm","title":"[Página web] Decreto 334 de 2022 (compilación Normograma INVIMA)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Cambios de calidad: estabilidad y vida útil, fabricante y BPM', 'Clase 2 · Actualizaciones de calidad, seguridad y eficacia', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica la guía de modificaciones de calidad de síntesis química y gases medicinales para clasificar cambios de vida útil, fabricante y BPM por nivel de riesgo y reunir sus soportes.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/sites/default/files/formatos/ASS-RSA-GU82-GUIA_%20PARA_REALIZAR_MODIFICACIONES_A_LOS_REGISTROS_SANITARIOS_CON_IMPACTO_EN_LA_CALIDAD_DE_MEDICAMENTOS__SINTESIS_QUIMICA_GASES_MED.pdf","title":"ASS-RSA-GU82 Guía para realizar modificaciones a los registros sanitarios con impacto en la calidad de medicamentos de síntesis química y gases medicinales","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/preview/90045","title":"[Página web] ASS-RSA-GU81 Guía de presentación de solicitudes de modificaciones de calidad – medicamentos homeopáticos","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Cambios de seguridad y eficacia: actualización de insertos e información para prescribir', 'Clase 2 · Actualizaciones de calidad, seguridad y eficacia', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las cuatro categorías de cambios de la guía ASS-RSA-GU79 (administrativos de etiquetado, información de etiquetado, urgentes de seguridad y de seguridad y eficacia) y sus plazos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_sala_especializada_medicamentos_sintesis/ASS-RSA-GU79_1.pdf","title":"ASS-RSA-GU79 Guía para la presentación de modificaciones de seguridad y eficacia – síntesis química y gases medicinales","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Importados: CPP o CVL y BPM del fabricante extranjero', 'Clase 3 · Importados, modificaciones simultáneas y tendencias', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Explica qué es el Certificado de Producto Farmacéutico modelo OMS, cómo lo emite la autoridad de origen y cómo mantenerlo vigente para respaldar registros de importación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.aemps.gob.es/comercio-exterior/certificado-de-producto-farmaceutico","title":"[Página web] Certificado de producto farmacéutico (modelo OMS)","description":"AEMPS (España) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/el-instituto/acceso-a-mercados-internacionales/importaciones","title":"[Página web] Importaciones – Acceso a Mercados Internacionales","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: renovación con modificaciones simultáneas', 'Clase 3 · Importados, modificaciones simultáneas y tendencias', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resuelve un caso en que coinciden cambio de fabricante, ampliación de vida útil y actualización de inserto, comparando el manejo bajo el Decreto 334 y bajo la vigencia indefinida.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: resolver cómo se gestionaba una renovación con cambios simultáneos bajo el Decreto 334 de 2022 y cómo se gestiona hoy, con registros de vigencia indefinida, la necesidad de actualizar varios aspectos de un registro al mismo tiempo.</p><p>Desarrollo: el parágrafo 2 del artículo 3 del Decreto 334 de 2022 estableció que la solicitud de renovación no podía incluir modificaciones: estas debían radicarse en un escrito separado. La lógica era que la renovación automática se basaba en que la información del registro estaba al día y en la presentación del certificado de BPM y del Certificado de Venta Libre o de Producto Farmacéutico vigentes, mientras que cada cambio debía seguir su propia ruta de riesgo (sin impacto, menor, moderado o mayor). Con el Decreto 1474 de 2023 la vigencia de los registros de medicamentos es indefinida, así que ya no hay renovación a la que \"pegar\" cambios: la actualización se hace por modificaciones. El mismo decreto permite agrupar cambios de riesgo moderado o mayor, pagando la tarifa que determine el INVIMA, y la guía de homeopáticos (ASS-RSA-GU81) admite hasta seis cambios moderados o mayores en un solo acto administrativo. En los registros fitoterapéuticos, que siguen con vigencia de diez años (Decreto 1156 de 2018), sí persiste la renovación, y sus cambios se planifican antes del vencimiento para que la información esté aprobada al renovar.</p><p>Ejemplo aplicado: un laboratorio titular de un antihipertensivo de síntesis química, con registro que en 2022 estaba próximo a vencer, necesitaba al mismo tiempo (a) cambiar el fabricante del principio activo, (b) ampliar la vida útil de 24 a 36 meses y (c) actualizar el inserto con nuevas advertencias. Bajo el Decreto 334 radicaba la renovación automática (con un mes de antelación como mínimo, BPM y CPP vigentes) y, por separado, las modificaciones: la de calidad (fabricante y estabilidad) por la ruta de riesgo correspondiente y la de seguridad (inserto) según la guía ASS-RSA-GU79. Hoy, el mismo laboratorio no renueva: arma un paquete de modificaciones, verifica qué cambios son agrupables por nivel de riesgo, documenta estabilidad natural en lotes industriales o piloto, adjunta el certificado de BPM del nuevo fabricante y presenta artes e inserto modificando solo los textos afectados por el cambio.</p><p>Puntos clave:<br>1. Renovación y modificación siempre fueron trámites separados; hoy la vía para actualizar un registro de medicamento es la modificación.<br>2. Agrupar cambios del mismo nivel de riesgo reduce trámites y costos, pero cada cambio conserva sus requisitos técnicos.<br>3. En fitoterapéuticos, apruebe las modificaciones antes de la renovación para no comprometer la renovación automática.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Proyecto de decreto 2026: nuevas rutas de modificación (IA, IA-IN, IB, II, URG)', 'Clase 3 · Importados, modificaciones simultáneas y tendencias', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara el esquema vigente de riesgo con el proyecto de decreto en consulta en 2026 (rutas de riesgo, reliance, control posterior con muestreo y reingreso tras no comercialización).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://consultorsalud.com/wp-content/uploads/2026/08/15072026-Proyecto-modificacion-decreto-334-VFconsulta-publica20260715105655_20260804083707.pdf","title":"Proyecto de decreto 2026 que modifica el Capítulo III y los arts. 9 y 27 del Decreto 334 de 2022 (consulta pública)","description":"MinSalud vía ConsultorSalud (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Pérdida de vigencia, no comercialización, retiro y agotamiento de existencias', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: cómo un registro deja de producir efectos', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume las vías por las que un registro deja de amparar un producto: vencimiento sin renovación, pérdida de fuerza ejecutoria, cancelación y suspensión.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.fenalco.com.co/blog/juridico-2/notijuridico-136-minsalud-modifica-aspectos-administrativos-para-prevenir-y-mitigar-el-desabastecimiento-de-medicamentos-2122","title":"[Página web] Notijurídico 136 – MinSalud modifica aspectos administrativos para prevenir y mitigar el desabastecimiento de medicamentos","description":"Fenalco (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/resoluci_c3_b3n_n_2025048380_del_30_de_septiembre_de_2025pdf","title":"Resolución 2025048380 (30 sep 2025): archivo de solicitudes de registros sanitarios con pérdida de ejecutoriedad","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Vencimiento sin renovación y radicación extemporánea', 'Clase 2 · Consecuencias jurídicas', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las consecuencias de radicar tarde o no renovar: improcedencia del trámite, nueva solicitud, prohibición de fabricar o importar (Decreto 334 de 2022, art. 23; Decreto 1156 de 2018, art. 39).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_0334_2022.htm","title":"[Página web] Decreto 334 de 2022 (compilación Normograma INVIMA)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_1156_2018.htm","title":"[Página web] Decreto 1156 de 2018 – régimen de registro sanitario de productos fitoterapéuticos","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_0677_1995.htm","title":"[Página web] Decreto 677 de 1995 (compilación con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Agotamiento de existencias', 'Clase 2 · Consecuencias jurídicas', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe cuándo procede el agotamiento de existencias hasta el fin de la vida útil aprobada y la disposición del material de envase y empaque.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/sites/default/files/medicamentos-productos-biologicos/ASS-RSA-GU76%20Gu%C3%ADa%20para%20autorizaci%C3%B3n%20de%20Agotamiento.pdf","title":"ASS-RSA-GU76 Guía para autorización de agotamiento","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_0334_2022.htm","title":"[Página web] Decreto 334 de 2022 (compilación Normograma INVIMA)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Pérdida de fuerza ejecutoria, archivo y cancelación', 'Clase 2 · Consecuencias jurídicas', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la pérdida de ejecutoriedad (art. 91 de la Ley 1437 de 2011) aplicada por el INVIMA a registros cuyos titulares deciden no comercializar, y la cancelación prevista por el Decreto 1474 de 2023.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/resoluci_c3_b3n_n_2025048380_del_30_de_septiembre_de_2025pdf","title":"Resolución 2025048380 (30 sep 2025): archivo de solicitudes de registros sanitarios con pérdida de ejecutoriedad","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/preview/145882","title":"Resolución 2026056487 (17 sep 2026): archivo de solicitudes de registros sanitarios con pérdida de ejecutoriedad","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'No comercialización temporal y reingreso (Guía ASS-RSA-GU75)', 'Clase 3 · No comercialización y casos', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica el reporte de no comercialización en 30 días calendario, los plazos de 12 + 12 meses (máximo 24) y el aviso de reingreso con modificaciones al día.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/MET/20250710-mesa-trabajo-industria-farmaceutica.pdf","title":"Mesa de trabajo industria farmacéutica (10/07/2025): no comercialización y reportes de la industria","description":"MinSalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Retiro definitivo con seis meses de antelación', 'Clase 3 · No comercialización y casos', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta el procedimiento de retiro definitivo: aviso escrito al INVIMA con seis meses, soporte de existencias y solicitud de pérdida de fuerza ejecutoria.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.saludyfarmacos.org/boletin-farmacos/boletines/nov202303/19_co","title":"[Página web] Colombia. Medicamentos con registro sanitario indefinido y otros cambios clave en el Invima","description":"Salud y Fármacos (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: renovación extemporánea', 'Clase 3 · No comercialización y casos', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resuelve un caso de registro próximo a vencer con documentos soporte vencidos y decide entre renovación, nueva solicitud y agotamiento.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar las reglas de radicación oportuna y las consecuencias del vencimiento sin renovación a un caso de renovación extemporánea, distinguiendo el régimen histórico de medicamentos y el vigente de fitoterapéuticos.</p><p>Desarrollo: el artículo 17 del Decreto 677 de 1995 exigía radicar la renovación con al menos tres meses de anticipación al vencimiento; si no se presentaba en el término previsto, se tramitaba como nueva solicitud de registro sanitario. El Decreto 334 de 2022 redujo la antelación a no menos de un mes, hizo automática la renovación y dispuso que, radicada fuera de ese plazo, \"su trámite no procederá\", de modo que el titular debía iniciar un registro nuevo. Si el registro vencía sin solicitud de renovación, el producto no podía fabricarse ni importarse, aunque las existencias en el país podían agotarse hasta la vida útil aprobada, sin reutilizar el material de envase, que debía disponerse. Desde el 8 de septiembre de 2023 (Decreto 1474) los registros de medicamentos vigentes a esa fecha pasaron a vigencia indefinida; un registro ya vencido antes de esa fecha no \"revive\". En productos fitoterapéuticos la vigencia es de diez años renovables (Decreto 1156 de 2018, art. 14) y, según el artículo 39, si el registro vence sin solicitud de renovación el producto no puede fabricarse ni importarse, y el INVIMA puede permitir la venta de existencias hasta el fin de su vida útil.</p><p>Ejemplo aplicado: una empresa titular de un fitoterapéutico importado (extracto de valeriana) descubre, en la revisión trimestral del portafolio, que el registro vence en tres semanas y que el Certificado de Venta Libre del país de origen está vencido. Pasos: 1) verificar en la consulta de registros del INVIMA la fecha de firmeza y vencimiento; 2) revisar si cumple las condiciones de renovación automática del artículo 27 (listado de plantas, información aprobada mantenida, estabilidad de dos lotes industriales, BPM vigente y CVL vigente para importados); 3) si falta el CVL, evaluar la ruta no automática (art. 29) y radicar sin demora; 4) si el registro vence, detener importaciones, inventariar existencias, gestionar el agotamiento y la disposición del material de empaque, y preparar una nueva solicitud de registro.</p><p>Puntos clave:<br>1. La oportunidad de radicación es un requisito de procedencia: radicar tarde equivale a empezar de cero.<br>2. Vencido el registro, se detienen fabricación e importación; las existencias solo se agotan dentro de su vida útil.<br>3. La semaforización de documentos soporte (CVL, CPP, BPM) es tan importante como la de la fecha de vencimiento.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Planificación del portafolio, semaforización y tarifas INVIMA', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: gestión regulatoria del portafolio', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume cómo pasar de la reacción ante vencimientos a la planificación anual de vigencias, obligaciones y presupuesto de trámites.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=TfuYCgUzPO0","provider":"youtube","videoId":"TfuYCgUzPO0","title":"Ya se encuentra disponible la plataforma Invima a un clic para nuevos registros de medicamentos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/MET/20250710-mesa-trabajo-industria-farmaceutica.pdf","title":"Mesa de trabajo industria farmacéutica (10/07/2025): no comercialización y reportes de la industria","description":"MinSalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Inventario regulatorio del portafolio', 'Clase 2 · Herramientas de planificación', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Construye la matriz de registros con vigencia, estado, fabricantes, BPM, CPP/CVL, vida útil, inserto y trámites en curso.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: construir el inventario regulatorio del portafolio como base para gestionar vigencias, obligaciones posteriores y actualizaciones de los registros sanitarios.</p><p>Desarrollo: con la vigencia indefinida de los registros de medicamentos (Decreto 1474 de 2023) la \"fecha de vencimiento\" deja de ser el único dato crítico. El portafolio debe mostrar qué registros conservan vencimiento (fitoterapéuticos, con diez años renovables según el Decreto 1156 de 2018), cuáles son indefinidos y qué obligaciones mantienen viva su ejecutoriedad: mantener las condiciones aprobadas, reportar la no comercialización temporal en máximo 30 días, avisar el retiro definitivo con seis meses de antelación, tramitar las modificaciones y, en biológicos aprobados con el Decreto 677 sin evaluación bajo el Decreto 1782 de 2014, la modificación por migración normativa exigida por la Circular 19 de 2023. El inventario es una matriz por registro con campos mínimos: número de registro y expediente, titular, fabricante(s) y país, modalidad (fabricar y vender, importar y vender, etc.), tipo de producto (síntesis química, biológico, homeopático, gas medicinal, fitoterapéutico), vigencia (fecha o \"indefinida\"), estado en la base del INVIMA (vigente, temporalmente no comercializado, suspendido, con pérdida de fuerza ejecutoria), vencimiento del certificado BPM de cada planta, vencimiento del CPP o CVL para importados, vida útil aprobada y estado de los estudios de estabilidad en curso, versión vigente del inserto y modificaciones en trámite con su número de radicado.</p><p>Ejemplo aplicado: una compañía con 40 registros consulta cada número en la base de registros del INVIMA y en sus expedientes, y descubre que 3 registros figuran vigentes pero el producto no se vende hace más de un año sin reporte de no comercialización; 2 importados dependen de un CPP que vence en cuatro meses; 1 biológico aprobado en 2012 no ha pasado por la migración normativa; y 2 fitoterapéuticos vencen en 2027. Con esta foto, el área regulatoria prioriza: reportar las no comercializaciones (o decidir el retiro definitivo y solicitar la pérdida de fuerza ejecutoria), pedir los nuevos CPP al fabricante, radicar la migración del biológico y programar las renovaciones de los fitoterapéuticos.</p><p>Puntos clave:<br>1. El inventario regulatorio incluye documentos soporte y obligaciones, no solo fechas de vencimiento.<br>2. El estado comercial real debe coincidir con el estado del registro ante el INVIMA.<br>3. Actualice la matriz con cada acto administrativo y con cada vencimiento documental.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Semaforización de vencimientos y obligaciones', 'Clase 2 · Herramientas de planificación', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Diseña un semáforo con hitos y márgenes para fitoterapéuticos, documentos de terceros, no comercialización, retiros y estabilidad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: diseñar un semáforo de vencimientos y obligaciones que anticipe los trámites ante el INVIMA y evite pérdidas de vigencia, suspensiones o desabastecimientos.</p><p>Desarrollo: el semáforo traduce el inventario regulatorio en alertas. Se definen hitos por tipo de evento y se les asigna un color según el tiempo restante frente al tiempo que toma preparar el trámite. Hitos sugeridos: (1) vencimiento del registro sanitario de fitoterapéuticos: verde a más de 12 meses, amarillo entre 12 y 6 meses (recopilar estabilidad de dos lotes industriales, BPM y CVL), rojo a menos de 6 meses; (2) vencimiento del CPP/CVL y del certificado BPM de cada fabricante: amarillo a 9 meses, rojo a 4 meses, ya que su obtención depende de terceros en el exterior; (3) no comercialización temporal: alerta inmediata al detectarla para reportar dentro de 30 días calendario; amarillo al mes 11 de la notificación (la ampliación se pide con al menos un mes de anticipación) y rojo al acercarse al tope de 24 meses; (4) retiro definitivo: hito a los 6 meses previos a la salida para informar al INVIMA y solicitar la pérdida de fuerza ejecutoria, con soporte de inventario suficiente; (5) estabilidad: cortes del estudio \"ongoing\" para sustentar o ampliar la vida útil; (6) modificaciones de seguridad (inserto) pendientes antes de reingresos al mercado; (7) tarifas: revisar cada resolución tarifaria del INVIMA (en 2026, la Resolución 2026058314 modificó parcialmente la Resolución 2025067543) antes de presupuestar.</p><p>Ejemplo aplicado: en una hoja de cálculo se crea una columna \"días restantes\" para cada hito y un formato condicional (verde, amarillo, rojo) con responsables y fechas de comité. En la reunión mensual con mercadeo y supply chain se revisan los rojos: un CPP por vencer de un antibiótico importado activa la solicitud al fabricante; un fitoterapéutico a 5 meses del vencimiento activa el armado del expediente de renovación automática; un faltante de API que detendrá ventas por más de 30 días activa el reporte de no comercialización.</p><p>Puntos clave:<br>1. El color se define por el tiempo de preparación del trámite, no solo por la fecha.<br>2. Los documentos de terceros (CPP, CVL, BPM extranjeras) requieren los márgenes más amplios.<br>3. El semáforo debe tener un dueño, una frecuencia de revisión y conexión con comercial y abastecimiento.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Tarifas INVIMA: cómo leer la resolución tarifaria', 'Clase 2 · Herramientas de planificación', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la estructura de tarifas del INVIMA en UVB, los códigos de medicamentos, las tarifas diferenciales y los cambios de 2026 (Resolución 2026058314, que modifica la Resolución 2025067543).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://consultorsalud.com/?p=343455","title":"[Página web] Tarifas Invima 2026 cambian con la Resolución 2026058314 para alimentos, medicamentos y cosméticos","description":"ConsultorSalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: registro de importado con CPP próximo a vencer', 'Clase 3 · Casos integradores', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica el inventario y el semáforo a un importado cuyo CPP vence, coordinando con el fabricante extranjero y evaluando la modificación necesaria.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.aemps.gob.es/comercio-exterior/certificado-de-producto-farmaceutico","title":"[Página web] Certificado de producto farmacéutico (modelo OMS)","description":"AEMPS (España) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/el-instituto/acceso-a-mercados-internacionales/importaciones","title":"[Página web] Importaciones – Acceso a Mercados Internacionales","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso integrador: plan anual de gestión de vigencias', 'Clase 3 · Casos integradores', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Elabora un plan anual por trimestres para un portafolio mixto que combina migración de biológico, renovación de fitoterapéutico, actualización de CPP y decisiones de retiro.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: integrar lo aprendido en un plan anual de gestión de vigencias y actualizaciones para un portafolio mixto (síntesis química nacional, importados con CPP, un biológico y un fitoterapéutico).</p><p>Desarrollo: el plan anual combina tres insumos: el inventario regulatorio, el semáforo de hitos y el presupuesto de tarifas INVIMA. Se ordena por trimestres. Trimestre 1: depuración del portafolio (decidir qué productos se mantienen, cuáles pasan a \"temporalmente no comercializado\" y cuáles se retiran con aviso de seis meses y solicitud de pérdida de fuerza ejecutoria) y revisión de la resolución tarifaria vigente. Trimestre 2: actualización documental de importados (nuevos CPP o CVL y certificados de BPM de fabricantes extranjeros) y radicación de modificaciones de calidad agrupables por nivel de riesgo. Trimestre 3: actualización de insertos e información para prescribir con la información de seguridad nueva (ruta de la guía ASS-RSA-GU79) y preparación de renovaciones de fitoterapéuticos que vencen al año siguiente. Trimestre 4: auditoría interna de coherencia entre expediente, producto comercializado y estado en la base del INVIMA, en previsión del control posterior basado en riesgo.</p><p>Ejemplo aplicado: la empresa \"Laboratorio Andino\" (caso didáctico) tiene 12 registros. Un importado de origen europeo tiene un CPP que vence en mayo; el biológico, aprobado bajo el Decreto 677, aún no ha presentado la modificación por migración normativa que exige la Circular 19 de 2023; el fitoterapéutico vence en marzo del año siguiente; y dos genéricos llevan 14 meses sin venderse. El plan asigna: solicitud del CPP en enero, radicación de la migración del biológico en el primer trimestre con su tarifa, renovación del fitoterapéutico preparada desde el tercer trimestre (con estabilidad de dos lotes industriales y BPM vigente), y para los genéricos, decisión de comité entre reingreso (con modificaciones al día antes de reingresar) o retiro definitivo con aviso de seis meses.</p><p>Puntos clave:<br>1. Un plan anual convierte obligaciones dispersas en un cronograma con responsables y presupuesto.<br>2. La vigencia indefinida desplaza el esfuerzo de la renovación hacia la actualización continua del registro.<br>3. Revise el plan cuando cambie la norma: en 2026 está en consulta un proyecto que modifica el régimen de modificaciones del Decreto 334 de 2022.</p>"}'::jsonb);

END
$curso$;

-- ─── 4. Curso de Modificaciones al Registro Sanitario de Medicamentos (35 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Modificaciones al Registro Sanitario de Medicamentos' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Modificaciones al Registro Sanitario de Medicamentos', 'Curso práctico sobre la gestión de cambios post-aprobación de medicamentos en Colombia bajo el Decreto 334 de 2022 (modificado por los Decretos 322 y 1474 de 2023) y las guías e instructivos INVIMA vigentes.', '<p>Curso práctico sobre la gestión de cambios post-aprobación de medicamentos en Colombia bajo el Decreto 334 de 2022 (modificado por los Decretos 322 y 1474 de 2023) y las guías e instructivos INVIMA vigentes. Cubre la clasificación por riesgo, las modificaciones administrativo-legales, de calidad y de seguridad y eficacia, los biológicos, el control de cambios (ICH Q10/Q12), la agrupación de trámites y las tarifas, con casos prácticos de trámites reales.</p><h3>Objetivo general</h3><p>Que el participante clasifique, documente y radique correctamente ante el INVIMA las modificaciones al registro sanitario de medicamentos de síntesis química y biológicos, integrándolas al control de cambios del sistema de calidad y planeando su agrupación, costo y cronograma.</p><h3>A quién va dirigido</h3><p>Químicos farmacéuticos y profesionales de asuntos regulatorios, aseguramiento de calidad, farmacovigilancia y dirección técnica de laboratorios, importadores y titulares de registros sanitarios en Colombia.</p><h3>Contexto normativo</h3><p>Colombia — normativa INVIMA / MinSalud</p>',
          'Asuntos regulatorios', 'intermedio', 'Que el participante clasifique, documente y radique correctamente ante el INVIMA las modificaciones al registro sanitario de medicamentos de síntesis química y biológicos, integrándolas al control de cambios del sistema de calidad y planeando su agrupación, costo y cronograma.', 'Químicos farmacéuticos y profesionales de asuntos regulatorios, aseguramiento de calidad, farmacovigilancia y dirección técnica de laboratorios, importadores y titulares de registros sanitarios en Colombia.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Fundamentos y marco normativo de las modificaciones al registro sanitario', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: ¿por qué un registro sanitario aprobado sigue cambiando?', 'Clase 1 · Introducción al curso', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume el alcance del curso y el papel del QF de asuntos regulatorios en la gestión de cambios post-aprobación ante el INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=kMhjktRya9w","provider":"youtube","videoId":"kMhjktRya9w","title":"Capacitación – Trámite de Registro Sanitario de Medicamentos en Invima a un clic","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cms.law/en/col/publication/cambios-importantes-en-los-tramites-de-renovacion-modificacion-suspension-y-publicidad-de-medicamentos","title":"[Página web] Cambios importantes en los trámites de renovación, modificación, suspensión y publicidad de medicamentos","description":"CMS Rodríguez-Azuero (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Decreto 334 de 2022 y sus modificaciones (Decretos 322 y 1474 de 2023)', 'Clase 2 · Evolución normativa: del Decreto 677 de 1995 al Decreto 334 de 2022', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Identifica cómo el Decreto 334 de 2022 sustituyó el régimen de modificaciones del art. 18 del Decreto 677 de 1995 y qué cambiaron los Decretos 322 y 1474 de 2023.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_0334_2022.htm","title":"[Página web] Decreto 334 de 2022 – Compilación Jurídica del Invima (texto vigente con modificaciones)","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/sites/default/files/medicamentos-y-productos-biologicos/tecnico-medicamentos-2/DECRETO%20322%20DE%202023.pdf","title":"Decreto 322 de 2023 (modifica arts. 6, 19, 23, 25, 28 y 29 del Decreto 334 de 2022)","description":"INVIMA / MinSalud (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/archivosExternos/doc_invima_0002_2023.pdf","title":"Boletín Opinión Jurídica N.º 104 (abr. 2023): Decreto 322 de 2023 y plazo de guías","description":"INVIMA – Oficina Asesora Jurídica (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Vigencia indefinida y su efecto sobre la gestión de cambios', 'Clase 2 · Evolución normativa: del Decreto 677 de 1995 al Decreto 334 de 2022', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta cómo la vigencia indefinida introducida por el Decreto 1474 de 2023 traslada el control al ciclo de vida y a las modificaciones.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/archivosExternos/doc_invima_0005_2023.pdf","title":"Boletín Opinión Jurídica N.º 107 (oct. 2023): novedades del registro sanitario – Decreto 1474 de 2023","description":"INVIMA – Oficina Asesora Jurídica (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.asuntoslegales.com.co/analisis/luz-helena-vargas-3212671/los-registros-sanitarios-de-medicamentos-cambian-su-vigencia-a-indefinidos-3712998","title":"[Página web] Los registros sanitarios de medicamentos cambian su vigencia a indefinidos (Decreto 1474 de 2023)","description":"Asuntos Legales (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Las tres familias: administrativo-legales, calidad y seguridad/eficacia', 'Clase 3 · Clasificación de las modificaciones (art. 5 del Decreto 334 de 2022)', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las tres familias de modificaciones del art. 5 y los niveles de riesgo de calidad (sin impacto, menor, moderado, mayor).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_0334_2022.htm","title":"[Página web] Decreto 334 de 2022 – Compilación Jurídica del Invima (texto vigente con modificaciones)","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=219130","title":"[Página web] Decreto 334 de 2022 – Gestor Normativo","description":"Función Pública (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Vías de trámite y plazos (art. 8): notificación, automática y aprobación previa', 'Clase 3 · Clasificación de las modificaciones (art. 5 del Decreto 334 de 2022)', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara las vías de trámite y los plazos de respuesta del INVIMA según el nivel de riesgo, incluida la regla del requerimiento único.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_0334_2022.htm","title":"[Página web] Decreto 334 de 2022 – Compilación Jurídica del Invima (texto vigente con modificaciones)","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cms.law/en/col/publication/cambios-importantes-en-los-tramites-de-renovacion-modificacion-suspension-y-publicidad-de-medicamentos","title":"[Página web] Cambios importantes en los trámites de renovación, modificación, suspensión y publicidad de medicamentos","description":"CMS Rodríguez-Azuero (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Guías INVIMA de modificaciones vigentes y cómo usarlas', 'Clase 4 · Caso práctico: clasificar antes de radicar', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Reconoce el conjunto de guías e instructivos INVIMA por tipo de producto y familia de cambio, y su actualización en 2026.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.cerlatam.com/normatividad/invima-proyecto-de-resolucion-19-mayo-2026/","title":"[Página web] INVIMA, Proyecto de Resolución 19-may-2026: adopción de guías individuales de modificaciones por tipo de medicamento","description":"CERLATAM (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/preview/145507","title":"ACOM-INS80 v1 – Instructivo para la presentación de modificaciones de seguridad y eficacia (síntesis química y gases medicinales), jun. 2026","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/biblioteca/preview/127094","title":"Guía para presentar modificaciones administrativo-legales de medicamentos de síntesis química, radiofármacos, gases medicinales, biológicos y homeopáticos (Decreto 334/2022 mod. Decreto 1474/2023)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: árbol de decisión para clasificar un paquete de cambios', 'Clase 4 · Caso práctico: clasificar antes de radicar', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica el árbol de decisión del Decreto 334 de 2022 a un paquete real de cambios y define cuántos trámites radicar.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar el árbol de decisión del Decreto 334 de 2022 para clasificar un cambio real antes de radicarlo ante el INVIMA.</p><p>Desarrollo: la primera pregunta que debe hacerse el profesional de asuntos regulatorios no es \"¿qué formulario lleno?\", sino \"¿qué información del registro sanitario cambia y sobre qué atributo impacta?\". El artículo 5 del Decreto 334 de 2022 (modificado por los Decretos 322 y 1474 de 2023) agrupa las modificaciones en tres familias: (1) administrativo-legales, que cambian datos del acto administrativo sin tocar calidad, seguridad ni eficacia; (2) de calidad, clasificadas en sin impacto, riesgo menor, riesgo moderado y riesgo mayor; y (3) de seguridad y eficacia, que incluyen cambios administrativos del etiquetado, cambios en la información del etiquetado, cambios urgentes de seguridad y cambios en la información de seguridad y eficacia. El artículo 8 asigna a cada clase su vía: sin impacto (se documenta en el sistema de calidad, sin comunicación previa); notificación de novedad (se implementa y se informa, a más tardar un año después); modificación automática (el INVIMA expide el acto en aproximadamente un mes y revisa después); y aprobación previa (moderado 1–3 meses; mayor 3–6 meses; etiquetado hasta 5 meses; seguridad y eficacia hasta 10 meses). El INVIMA puede requerir información una sola vez y el titular tiene un mes, prorrogable, para responder.</p><p>El árbol práctico es: ¿el cambio altera el producto hasta el punto de constituir un medicamento nuevo (nueva concentración, nueva forma farmacéutica)? Si sí, corresponde un nuevo registro (Anexo 2 de las guías de calidad). Si no, ¿afecta calidad? Busque el cambio en la tabla de la guía ASS-RSA-GU82 (síntesis química) o ASS-RSA-GU49 / ACOM-INS85 (biológicos) y tome el nivel indicado y sus condiciones; si no cumple las condiciones, el nivel sube. ¿Afecta información clínica o del inserto? Vaya a la guía ASS-RSA-GU79 / ACOM-INS80. ¿Solo cambian nombres, titulares o roles? Vaya a la guía administrativo-legal. Si el cambio no aparece listado, se consulta previamente al INVIMA.</p><p>Ejemplo aplicado: un laboratorio nacional quiere (a) reducir el límite superior de una impureza en la especificación del producto terminado, (b) incluir un nuevo acondicionador secundario y (c) agregar una reacción adversa al inserto. (a) Estrechar una especificación es típicamente un cambio de riesgo menor; (b) la inclusión de acondicionador secundario se trata como modificación menor/automática o administrativa según la guía aplicable; (c) es un cambio en la información del etiquetado que requiere aprobación previa (hasta 5 meses). Como las guías prohíben mezclar en un mismo trámite cambios de calidad con cambios de seguridad/eficacia o legales, el titular debe radicar al menos dos solicitudes, y puede agrupar los cambios de calidad relacionados asumiendo el nivel de riesgo más alto del grupo.</p><p>Puntos clave:<br>1. Clasifique primero por familia (legal, calidad, seguridad/eficacia) y luego por nivel de riesgo según la guía INVIMA vigente.<br>2. Las condiciones de cada cambio en la guía son obligatorias: si no se cumplen, el cambio se reclasifica a un nivel superior.<br>3. No se mezclan familias en un mismo trámite; sí se pueden agrupar cambios relacionados de la misma familia, asumiendo el mayor riesgo y su tarifa.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Modificaciones administrativo-legales', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a las modificaciones administrativo-legales', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume qué cambios no afectan calidad, seguridad ni eficacia pero sí el contenido del acto administrativo del registro.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preview/127094","title":"Guía para presentar modificaciones administrativo-legales de medicamentos de síntesis química, radiofármacos, gases medicinales, biológicos y homeopáticos (Decreto 334/2022 mod. Decreto 1474/2023)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Cambio de titular y cesión de registros sanitarios', 'Clase 2 · Titularidad, razón social y roles', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe requisitos y documentos para la cesión o traspaso de titularidad de un registro sanitario.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preview/127094","title":"Guía para presentar modificaciones administrativo-legales de medicamentos de síntesis química, radiofármacos, gases medicinales, biológicos y homeopáticos (Decreto 334/2022 mod. Decreto 1474/2023)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_0334_2022.htm","title":"[Página web] Decreto 334 de 2022 – Compilación Jurídica del Invima (texto vigente con modificaciones)","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Cambios de razón social, dirección e inclusión/exclusión de fabricantes, importadores y acondicionadores', 'Clase 2 · Titularidad, razón social y roles', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Distingue los cambios de nombre, domicilio o roles que son administrativo-legales de los que son de calidad (p. ej., traslado de planta o nuevo fabricante).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preview/127094","title":"Guía para presentar modificaciones administrativo-legales de medicamentos de síntesis química, radiofármacos, gases medicinales, biológicos y homeopáticos (Decreto 334/2022 mod. Decreto 1474/2023)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://consultorsalud.com/wp-content/uploads/2026/05/Gu_C3_ADa_20para_20realizar_20modificaciones_20a_20los_20RS.pdf","title":"ASS-RSA-GU82 v2 – Guía para realizar modificaciones a los registros sanitarios con impacto en la calidad de medicamentos de síntesis química, gases medicinales y radiofármacos","description":"INVIMA (copia difundida por ConsultorSalud) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Agrupación de cambios legales, un solo pago y agotamiento de existencias', 'Clase 3 · Caso práctico de trámite administrativo-legal', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las reglas de agrupación de la guía administrativo-legal y la gestión del agotamiento de existencias de etiquetas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preview/127094","title":"Guía para presentar modificaciones administrativo-legales de medicamentos de síntesis química, radiofármacos, gases medicinales, biológicos y homeopáticos (Decreto 334/2022 mod. Decreto 1474/2023)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/archivosExternos/doc_invima_0005_2023.pdf","title":"Boletín Opinión Jurídica N.º 107 (oct. 2023): novedades del registro sanitario – Decreto 1474 de 2023","description":"INVIMA – Oficina Asesora Jurídica (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: cesión de titularidad con inclusión de importador', 'Clase 3 · Caso práctico de trámite administrativo-legal', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta paso a paso una solicitud combinada de cesión e inclusión de importador ante el INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: ejecutar paso a paso una modificación administrativo-legal combinada (cesión de titularidad e inclusión de importador) aplicando la guía INVIMA de modificaciones administrativo-legales.</p><p>Desarrollo: las modificaciones administrativo-legales cambian información del acto administrativo del registro sanitario sin afectar calidad, seguridad o eficacia. La guía INVIMA para medicamentos de síntesis química, radiofármacos, gases medicinales, biológicos y homeopáticos (Decreto 334 de 2022 modificado por el Decreto 1474 de 2023) las considera de bajo riesgo y las tramita como notificación o con aprobación previa, según el cambio. Incluye: cambio de nombre o razón social de titular, fabricante, importador, exportador, envasador o acondicionador; cesión o traspaso de titularidad; inclusión o exclusión de importadores u otros roles; y actualización de dirección o nomenclatura (no traslado de planta, que es un cambio de calidad). La guía permite solicitar varios cambios en un solo trámite con un único pago de tarifa, siempre que todos estén listados en la guía.</p><p>Ejemplo aplicado: la empresa A (titular) vende a la empresa B los derechos de un antihipertensivo fabricado en India. B, a su vez, quiere que su filial C actúe como importador. Paso 1: verificar que no exista un trámite de calidad o de seguridad/eficacia en curso que pueda verse afectado y revisar el estado del registro en la consulta de registros sanitarios. Paso 2: reunir la documentación: formulario de modificaciones diligenciado, recibo de pago de la tarifa vigente, documento de cesión firmado por cedente y cesionario, certificados de existencia y representación legal (o equivalentes extranjeros apostillados/legalizados y traducidos), poder si actúa apoderado, y para el nuevo importador los documentos que acrediten su existencia y, cuando aplique, contrato con el titular. Paso 3: radicar un solo trámite administrativo-legal que contenga la cesión y la inclusión del importador, describiendo cada cambio por separado. Paso 4: planear el agotamiento de existencias de producto con etiquetas antiguas conforme a la guía de agotamiento de existencias (ASS-RSA-GU76). Paso 5: tras el acto administrativo, actualizar artes (cambio administrativo de etiquetado) y el expediente interno; si solo cambia el nombre del titular en el arte, esto se gestiona por la vía de seguridad y eficacia como \"cambio administrativo del etiquetado\", que no se puede agrupar con otras categorías.</p><p>Errores frecuentes: incluir en el mismo trámite un cambio de fabricante (que es de calidad, riesgo mayor), no aportar documentos extranjeros debidamente legalizados o confundir cambio de dirección con traslado de instalaciones.</p><p>Puntos clave:<br>1. Cesión, razón social, roles e importadores son administrativo-legales; el cambio o adición de fabricante del producto terminado es de calidad.<br>2. Varios cambios legales listados pueden radicarse juntos con un solo pago; no se mezclan con cambios de calidad.<br>3. Planee artes y agotamiento de existencias desde el inicio para no detener la comercialización.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Modificaciones de calidad (farmacéuticas) en medicamentos de síntesis química', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a las modificaciones con impacto en la calidad', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la estructura de la guía ASS-RSA-GU82 y los cinco niveles: sin impacto, menor por notificación, menor automática, moderada y mayor.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://consultorsalud.com/wp-content/uploads/2026/05/Gu_C3_ADa_20para_20realizar_20modificaciones_20a_20los_20RS.pdf","title":"ASS-RSA-GU82 v2 – Guía para realizar modificaciones a los registros sanitarios con impacto en la calidad de medicamentos de síntesis química, gases medicinales y radiofármacos","description":"INVIMA (copia difundida por ConsultorSalud) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/sites/default/files/formatos/ASS-RSA-GU82-GUIA_%20PARA_REALIZAR_MODIFICACIONES_A_LOS_REGISTROS_SANITARIOS_CON_IMPACTO_EN_LA_CALIDAD_DE_MEDICAMENTOS__SINTESIS_QUIMICA_GASES_MED.pdf","title":"ASS-RSA-GU82 – Guía modificaciones con impacto en la calidad (síntesis química y gases medicinales) – sitio INVIMA","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Cambios de fórmula y de proceso de manufactura', 'Clase 2 · Fórmula, proceso y sitio de fabricación', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta cómo se clasifican cambios en excipientes, tamaño de lote, parámetros y controles de proceso, y cuándo exigen validación o comparabilidad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=WzV6MHqi8gc","provider":"youtube","videoId":"WzV6MHqi8gc","title":"DIGIPRiS: Modificaciones mayores al Registro Sanitario de medicamentos (COFEPRIS, México)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://consultorsalud.com/wp-content/uploads/2026/05/Gu_C3_ADa_20para_20realizar_20modificaciones_20a_20los_20RS.pdf","title":"ASS-RSA-GU82 v2 – Guía para realizar modificaciones a los registros sanitarios con impacto en la calidad de medicamentos de síntesis química, gases medicinales y radiofármacos","description":"INVIMA (copia difundida por ConsultorSalud) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Cambios de sitio de fabricación y de modalidad del registro', 'Clase 2 · Fórmula, proceso y sitio de fabricación', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara la clasificación de adición o reemplazo de fabricante y los cambios de modalidad (fabricar y vender, importar y vender, fabricar y exportar).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://consultorsalud.com/wp-content/uploads/2026/05/Gu_C3_ADa_20para_20realizar_20modificaciones_20a_20los_20RS.pdf","title":"ASS-RSA-GU82 v2 – Guía para realizar modificaciones a los registros sanitarios con impacto en la calidad de medicamentos de síntesis química, gases medicinales y radiofármacos","description":"INVIMA (copia difundida por ConsultorSalud) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_0334_2022.htm","title":"[Página web] Decreto 334 de 2022 – Compilación Jurídica del Invima (texto vigente con modificaciones)","description":"INVIMA – Normograma (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Material de envase y presentaciones comerciales', 'Clase 3 · Envase, vida útil y especificaciones', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe cómo se clasifican cambios de envase primario, secundario y presentaciones, y la evidencia requerida.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://consultorsalud.com/wp-content/uploads/2026/05/Gu_C3_ADa_20para_20realizar_20modificaciones_20a_20los_20RS.pdf","title":"ASS-RSA-GU82 v2 – Guía para realizar modificaciones a los registros sanitarios con impacto en la calidad de medicamentos de síntesis química, gases medicinales y radiofármacos","description":"INVIMA (copia difundida por ConsultorSalud) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/sites/default/files/formatos/ASS-RSA-GU82-GUIA_%20PARA_REALIZAR_MODIFICACIONES_A_LOS_REGISTROS_SANITARIOS_CON_IMPACTO_EN_LA_CALIDAD_DE_MEDICAMENTOS__SINTESIS_QUIMICA_GASES_MED.pdf","title":"ASS-RSA-GU82 – Guía modificaciones con impacto en la calidad (síntesis química y gases medicinales) – sitio INVIMA","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Vida útil, condiciones de almacenamiento y especificaciones/métodos', 'Clase 3 · Envase, vida útil y especificaciones', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los requisitos de estabilidad para ampliar vida útil y la clasificación de estrechar o ampliar especificaciones y cambiar métodos analíticos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=WzV6MHqi8gc","provider":"youtube","videoId":"WzV6MHqi8gc","title":"DIGIPRiS: Modificaciones mayores al Registro Sanitario de medicamentos (COFEPRIS, México)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://consultorsalud.com/wp-content/uploads/2026/05/Gu_C3_ADa_20para_20realizar_20modificaciones_20a_20los_20RS.pdf","title":"ASS-RSA-GU82 v2 – Guía para realizar modificaciones a los registros sanitarios con impacto en la calidad de medicamentos de síntesis química, gases medicinales y radiofármacos","description":"INVIMA (copia difundida por ConsultorSalud) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Agrupación de cambios de calidad y cambios que exigen nuevo registro', 'Clase 4 · Caso práctico de modificación de calidad', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica las reglas de agrupación (nivel y tarifa del mayor riesgo) e identifica los cambios del Anexo 2 que requieren nuevo registro.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://consultorsalud.com/wp-content/uploads/2026/05/Gu_C3_ADa_20para_20realizar_20modificaciones_20a_20los_20RS.pdf","title":"ASS-RSA-GU82 v2 – Guía para realizar modificaciones a los registros sanitarios con impacto en la calidad de medicamentos de síntesis química, gases medicinales y radiofármacos","description":"INVIMA (copia difundida por ConsultorSalud) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/archivosExternos/doc_invima_0005_2023.pdf","title":"Boletín Opinión Jurídica N.º 107 (oct. 2023): novedades del registro sanitario – Decreto 1474 de 2023","description":"INVIMA – Oficina Asesora Jurídica (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: adición de un fabricante alterno de producto terminado', 'Clase 4 · Caso práctico de modificación de calidad', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Prepara el expediente de una modificación mayor de calidad por inclusión de un nuevo sitio de fabricación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: preparar la solicitud de una modificación de calidad de riesgo mayor: adición de un sitio de fabricación alterno de producto terminado para un medicamento de síntesis química.</p><p>Desarrollo: según la guía ASS-RSA-GU82 (versión 2, mayo de 2026), adicionar o reemplazar el fabricante del producto terminado se clasifica como modificación mayor, que requiere aprobación previa; el Decreto 334 de 2022 fija al INVIMA un plazo de 3 a 6 meses desde la radicación, con un único requerimiento posible (respuesta en un mes, prorrogable). Los cambios de modalidad del registro también están clasificados: pasar a \"fabricar y exportar\" es moderado, mientras que pasar a \"fabricar y vender\" o \"importar y vender\" es mayor.</p><p>Ejemplo aplicado: un titular fabrica tabletas de metformina 850 mg en Bogotá y quiere agregar un fabricante contratado en Medellín para asegurar abastecimiento. Paso 1 – Control de cambios interno: abrir el cambio en el sistema de calidad (ICH Q10), evaluar riesgo, definir plan de validación y estrategia regulatoria. Paso 2 – Requisitos del nuevo sitio: certificado de Buenas Prácticas de Manufactura vigente para la forma farmacéutica; contrato de fabricación entre titular y fabricante. Paso 3 – Paquete técnico: fórmula cuali-cuantitativa idéntica, descripción del proceso y controles en el nuevo sitio, validación del proceso (o protocolo y compromiso según la guía), registros de lotes, certificados de análisis comparativos, perfiles de disolución comparativos entre sitios cuando aplique y estudios de estabilidad (con compromiso de estabilidad natural en curso). Paso 4 – Agrupación: si simultáneamente se ajusta un parámetro de proceso relacionado, puede agruparse en la misma solicitud, que tomará el nivel y la tarifa del cambio de mayor riesgo; no deben incluirse cambios de inserto o legales. Paso 5 – Radicación y seguimiento: radicar con el formulario de modificaciones y el pago de la tarifa vigente del Manual Tarifario; atender el requerimiento dentro del plazo. Paso 6 – Implementación: solo tras la ejecutoria del acto administrativo se libera producto del nuevo sitio; actualizar etiquetas si el fabricante aparece en ellas y gestionar agotamiento de existencias.</p><p>Considere que la Resolución 2026025611 (plan de contingencia, vigente 12 meses desde mayo de 2026) prioriza trámites como transferencias de fabricante y riesgos de abastecimiento, lo cual debe argumentarse en la carta de presentación si aplica.</p><p>Puntos clave:<br>1. Nuevo fabricante de producto terminado = modificación mayor con aprobación previa (3–6 meses).<br>2. El expediente se apoya en BPM, contrato, validación, comparabilidad analítica y estabilidad.<br>3. Ningún lote del nuevo sitio se comercializa antes de la ejecutoria del acto de aprobación.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Modificaciones de seguridad y eficacia (farmacológicas) y modificaciones de biológicos', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a las modificaciones de seguridad y eficacia y de biológicos', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume las cuatro categorías de seguridad y eficacia y las particularidades de los cambios en productos biológicos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_sala_especializada_medicamentos_sintesis/ASS-RSA-GU79_1.pdf","title":"ASS-RSA-GU79 – Guía para la presentación de modificaciones de seguridad y eficacia al registro sanitario (síntesis química y gases medicinales)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/preview/145507","title":"ACOM-INS80 v1 – Instructivo para la presentación de modificaciones de seguridad y eficacia (síntesis química y gases medicinales), jun. 2026","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Cambios en la información del etiquetado y cambios urgentes de seguridad', 'Clase 2 · Indicaciones, posología, contraindicaciones e información para prescribir', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Distingue cuándo una nueva reacción adversa, advertencia o contraindicación es cambio de etiquetado (5 meses) o cambio urgente (acuerdo previo y 8 meses).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_sala_especializada_medicamentos_sintesis/ASS-RSA-GU79_1.pdf","title":"ASS-RSA-GU79 – Guía para la presentación de modificaciones de seguridad y eficacia al registro sanitario (síntesis química y gases medicinales)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/preview/145507","title":"ACOM-INS80 v1 – Instructivo para la presentación de modificaciones de seguridad y eficacia (síntesis química y gases medicinales), jun. 2026","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Nuevas indicaciones, posología, grupo etario, vía de administración y condición de venta', 'Clase 2 · Indicaciones, posología, contraindicaciones e información para prescribir', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los requisitos y evidencia clínica para cambios de seguridad y eficacia que requieren aprobación previa (hasta 10 meses).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preview/145507","title":"ACOM-INS80 v1 – Instructivo para la presentación de modificaciones de seguridad y eficacia (síntesis química y gases medicinales), jun. 2026","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normativa.colpensiones.gov.co/colpensiones/compilacion/docs/resolucion_invima_25611_2026.htm","title":"[Página web] Resolución INVIMA 2026025611 de 2026 – Plan de Contingencia para la racionalización, simplificación y automatización de registros sanitarios y modificaciones","description":"Compilación normativa (Colpensiones) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Modificaciones de calidad en biológicos (GU49 / ACOM-INS85)', 'Clase 3 · Modificaciones de medicamentos biológicos', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la clasificación de cambios de calidad en biológicos: procesos, bancos celulares, estándares, materias primas y sitios.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=-xY8swFb0A0","provider":"youtube","videoId":"-xY8swFb0A0","title":"Medicamentos biológicos y biotecnológicos, incluidas vacunas. MCRS (modificaciones a las condiciones del registro sanitario)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/preview/145499","title":"ACOM-INS85 v1 – Instructivo para solicitud de modificaciones de productos biológicos, jun. 2026","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/biblioteca/preview/144808","title":"ASS-RSA-GU49 – Guía para solicitud de modificaciones de productos biológicos (calidad)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Seguridad y eficacia en biológicos y referentes internacionales (OMS TRS 1011)', 'Clase 3 · Modificaciones de medicamentos biológicos', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara la guía INVIMA de seguridad y eficacia de biológicos con las directrices OMS y el panorama latinoamericano.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.who.int/publications/m/item/approved-biotherapeutics-a3-trs-no-1011","title":"[Página web] Guidelines on procedures and data requirements for changes to approved biotherapeutic products, Annex 3, TRS No 1011","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Casos simulados de cambios en biotecnológicos', 'Clase 3 · Modificaciones de medicamentos biológicos', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica las categorías de riesgo a casos simulados de cambios de calidad en productos bioterapéuticos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6863427/","title":"[Página web] Quality changes to approved biotherapeutic product: simulated case studies on reporting categories & supporting data requirements","description":"NCBI PMC (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://efpia.eu/media/413202/post-approval-changes-for-biologics-in-latin-american-markets.pdf","title":"Post-approval Changes for Biologics in Latin American Markets","description":"EFPIA (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: señal de farmacovigilancia que exige cambio urgente de inserto', 'Clase 4 · Caso práctico de seguridad y eficacia', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la gestión de un cambio urgente de seguridad y su posterior solicitud formal ante el INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: gestionar un cambio urgente de seguridad y la posterior actualización del inserto e información para prescribir siguiendo la guía ASS-RSA-GU79 y el instructivo ACOM-INS80.</p><p>Desarrollo: el Decreto 334 de 2022 y la guía de seguridad y eficacia distinguen cuatro categorías: (1) cambios administrativos del etiquetado (p. ej., actualizar el código QR), que se implementan de inmediato por notificación o modificación automática y no se agrupan con las demás; (2) cambios en la información del etiquetado (nuevas reacciones adversas, advertencias, interacciones o contraindicaciones), que requieren aprobación previa con plazo de hasta 5 meses; (3) cambios urgentes por razones de seguridad, que se implementan tras acuerdo previo con el INVIMA y notificación, con radicación de la solicitud de aprobación dentro del mes siguiente e implementación completa en máximo 8 meses; y (4) cambios en la información de seguridad y eficacia (indicaciones, población, vía, dosis, condición de venta), con aprobación previa en hasta 10 meses.</p><p>Ejemplo aplicado: el área de farmacovigilancia de un titular recibe una comunicación de la agencia de referencia y del innovador sobre casos de hepatotoxicidad grave asociados a un principio activo. Paso 1: el comité de seguridad evalúa la señal y decide que se requiere una advertencia y una contraindicación nuevas de forma urgente. Paso 2: se contacta al INVIMA (Grupo de Farmacovigilancia / Dirección de Medicamentos) para acordar la implementación del cambio urgente. Paso 3: se notifica con el formato específico y se actualizan inserto e información para prescribir. Paso 4: dentro del mes siguiente se radica la solicitud de aprobación con carta de justificación, formato diligenciado, recibo de pago, poder o representación legal, textos propuestos en control de cambios (texto actual vs. propuesto), soporte (informes periódicos de seguridad, comunicaciones de agencias, literatura) y resumen de experto; el instructivo recomienda PDF con búsqueda por palabra. Paso 5: se planea la implementación en empaques en un plazo no mayor a 8 meses y la comunicación a profesionales de la salud. Paso 6: si el innovador además añade una nueva indicación, esta va en un trámite distinto de \"seguridad y eficacia\" (hasta 10 meses), no en el urgente.</p><p>Puntos clave:<br>1. Un cambio urgente de seguridad exige acuerdo previo con el INVIMA, notificación y solicitud formal dentro del mes siguiente.<br>2. Adiciones de reacciones adversas o contraindicaciones no urgentes requieren aprobación previa (hasta 5 meses).<br>3. Indicaciones, posología, población o vía son \"seguridad y eficacia\" (hasta 10 meses) y se soportan con evidencia clínica.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: solicitud de nueva indicación y ajuste de posología', 'Clase 4 · Caso práctico de seguridad y eficacia', 7, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la preparación del expediente de una modificación de seguridad y eficacia (nueva indicación) con plazo de hasta 10 meses.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_sala_especializada_medicamentos_sintesis/ASS-RSA-GU79_1.pdf","title":"ASS-RSA-GU79 – Guía para la presentación de modificaciones de seguridad y eficacia al registro sanitario (síntesis química y gases medicinales)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/preview/145507","title":"ACOM-INS80 v1 – Instructivo para la presentación de modificaciones de seguridad y eficacia (síntesis química y gases medicinales), jun. 2026","description":"INVIMA (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Gestión estratégica del ciclo de vida: control de cambios, unificación de trámites y tarifas', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la gestión de cambios en el ciclo de vida del producto', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume cómo se articulan el sistema de calidad, la estrategia regulatoria y la planeación de trámites.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=zCkpmVdvA9Q","provider":"youtube","videoId":"zCkpmVdvA9Q","title":"ICH Q12 Product Lifecycle Management","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ema.europa.eu/en/ich-q12-technical-regulatory-considerations-pharmaceutical-product-lifecycle-management-scientific-guideline","title":"[Página web] ICH Q12 Technical and regulatory considerations for pharmaceutical product lifecycle management – Scientific guideline","description":"EMA (EN) · mismo documento, versión en inglés del sitio"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Control de cambios en el sistema de calidad farmacéutico (ICH Q10)', 'Clase 2 · Control de cambios interno e ICH Q12', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las etapas del control de cambios interno y cómo debe alimentar la evaluación regulatoria del cambio.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=YxPAoagpfh0","provider":"youtube","videoId":"YxPAoagpfh0","title":"Webinar: Gestión eficiente del control de cambios en la Industria Farmacéutica","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=tZCciaCNSIw","provider":"youtube","videoId":"tZCciaCNSIw","title":"ICH Q10 Explained: What It Means for Your Pharma QMS","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 3, '{"source":"enlace","url":"https://www.youtube.com/watch?v=_EVoSqFg8zI","provider":"youtube","videoId":"_EVoSqFg8zI","title":"Change Control in pharmaceutical Industry","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'ICH Q12: condiciones establecidas, PACMP y PLCM', 'Clase 2 · Control de cambios interno e ICH Q12', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las herramientas de ICH Q12 y su correspondencia con los niveles de modificación colombianos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=6joAz9pEjpE","provider":"youtube","videoId":"6joAz9pEjpE","title":"ICH Q12 Explained: Established Conditions, Post-Approval Changes, Pharma and Combination Products","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ema.europa.eu/en/documents/scientific-guideline/ich-guideline-q12-technical-and-regulatory-considerations-pharmaceutical-product-lifecycle-management-step-5-annexes_en.pdf","title":"ICH guideline Q12 – Annexes (Step 5, EMA/CHMP/ICH/831751/2017)","description":"EMA / ICH (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.tga.gov.au/sites/default/files/2025-03/session-4-post-approval-change-management-ich-q12-tools-and-enablers.pdf","title":"ICH Q12: Tools and enablers (Session 4 – Post-approval change management)","description":"TGA Australia (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Tendencias: reliance, plan de contingencia 2026 y proyecto de reforma del Capítulo III', 'Clase 2 · Control de cambios interno e ICH Q12', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara el régimen vigente con las rutas propuestas en el proyecto de decreto de 2026 y con el marco europeo de variaciones.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://consultorsalud.com/wp-content/uploads/2026/08/15072026-Proyecto-modificacion-decreto-334-VFconsulta-publica20260715105655_20260804083707.pdf","title":"Proyecto de decreto 2026 que modifica el Capítulo III del Decreto 334 de 2022 (rutas 0, IA, IA-IN, IB, II, URG) – consulta pública","description":"MinSalud (difundido por ConsultorSalud) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normativa.colpensiones.gov.co/colpensiones/compilacion/docs/resolucion_invima_25611_2026.htm","title":"[Página web] Resolución INVIMA 2026025611 de 2026 – Plan de Contingencia para la racionalización, simplificación y automatización de registros sanitarios y modificaciones","description":"Compilación normativa (Colpensiones) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.ema.europa.eu/en/guidance-application-amended-variations-regulation-1-january-2025","title":"[Página web] Guidance on the application of the revised variations framework (Reglamento UE 2024/1701)","description":"EMA (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Unificación y agrupación de trámites', 'Clase 3 · Unificación de trámites y tarifas', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica las reglas de agrupación del Decreto 334/1474 y de las guías, y la tramitación conjunta de la Resolución 2026025611.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normativa.colpensiones.gov.co/colpensiones/compilacion/docs/resolucion_invima_25611_2026.htm","title":"[Página web] Resolución INVIMA 2026025611 de 2026 – Plan de Contingencia para la racionalización, simplificación y automatización de registros sanitarios y modificaciones","description":"Compilación normativa (Colpensiones) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://intranet.invima.gov.co/biblioteca/preview/145208","title":"Resolución 2026025611 (texto con Anexo Técnico) – Plan de Contingencia DMPB","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/archivosExternos/doc_invima_0005_2023.pdf","title":"Boletín Opinión Jurídica N.º 107 (oct. 2023): novedades del registro sanitario – Decreto 1474 de 2023","description":"INVIMA – Oficina Asesora Jurídica (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Tarifas INVIMA aplicables a modificaciones', 'Clase 3 · Unificación de trámites y tarifas', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el Manual Tarifario vigente (UVB) y la lógica de códigos y tarifas diferenciales para modificaciones.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/blog/sala-de-prensa-13/el-invima-realiza-actualizacion-extraordinaria-de-su-manual-tarifario-2026-611","title":"[Página web] El Invima realiza actualización extraordinaria de su Manual Tarifario 2026","description":"INVIMA – Sala de prensa (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://consultorsalud.com/?p=343455","title":"[Página web] Tarifas Invima 2026 cambian con la Resolución 2026058314","description":"ConsultorSalud (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/tramites_tarifas/MEDICAMENTOS.pdf","title":"Instructivo Manual Tarifario – Actualización extraordinaria abril 2020 (medicamentos; referencia histórica de códigos 8417–8426)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso integrador: plan de cambios post-adquisición de un producto', 'Clase 4 · Caso práctico integrador', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Diseña la estrategia, secuencia, agrupación y presupuesto de un paquete de siete cambios post-aprobación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: integrar todo el curso en un plan de cambios post-aprobación que combine control de cambios interno, clasificación regulatoria, agrupación de trámites, tarifas y cronograma.</p><p>Desarrollo: en la práctica, los cambios llegan en paquete. Un buen plan regulatorio parte del control de cambios del sistema de calidad (ICH Q10) y aplica la lógica de ciclo de vida de ICH Q12: identificar qué elementos del dossier son \"condiciones establecidas\" cuyo cambio debe comunicarse a la autoridad y cuáles se gestionan solo internamente. En Colombia esto se traduce en los niveles del Decreto 334 de 2022: sin impacto (solo documentación interna), notificación de novedad, modificación automática y aprobación previa. Las reglas de agrupación del Decreto 1474 de 2023 y de las guías permiten reunir cambios de calidad relacionados en una solicitud con el nivel y la tarifa más altos; la Resolución 2026025611 (plan de contingencia) además permite procesar conjuntamente trámites relacionados de un mismo solicitante.</p><p>Caso integrador: una compañía adquiere un analgésico de síntesis química y en los próximos 12 meses necesita: (1) cesión de titularidad a su favor; (2) cambio de razón social del importador; (3) traslado de fabricación a un nuevo fabricante de producto terminado; (4) cambio del material de envase primario de blíster PVC a PVC/PVDC; (5) ampliación de vida útil de 24 a 36 meses con estabilidad a largo plazo; (6) inclusión de una nueva interacción en el inserto; (7) actualización del código QR del empaque.</p><p>Propuesta de solución: Trámite 1 (administrativo-legal): (1)+(2) juntos, un solo pago. Trámite 2 (calidad, mayor): (3)+(4) si están técnicamente relacionados (el nuevo sitio usa el nuevo material), clasificado como mayor, plazo de 3 a 6 meses; la vida útil (5) se radica después, con datos de estabilidad del producto del nuevo sitio y envase, para no invalidar la evidencia. Trámite 3 (seguridad y eficacia – información del etiquetado): (6), hasta 5 meses. Trámite 4 (cambio administrativo del etiquetado): (7), por notificación o modificación automática, sin agrupar con otros. Secuencia: primero la cesión (para que el nuevo titular radique los demás), luego en paralelo calidad y etiquetado, y al final los artes consolidados. Presupuesto: consultar el Manual Tarifario vigente (Resolución 2025067543 modificada por las Resoluciones 2026033499 y 2026058314, expresado en UVB) y considerar tarifas diferenciales si la empresa es micro o pequeña. Riesgos: requerimientos (un mes para responder), agotamiento de existencias y posible cambio normativo, pues en 2026 se publicó para consulta un proyecto de decreto que reorganizaría las modificaciones en rutas 0, IA, IA-IN, IB, II y URG; mientras no se expida, rige el Decreto 334 de 2022 modificado.</p><p>Puntos clave:<br>1. Diseñe la estrategia desde el control de cambios interno y clasifique cada cambio con la guía vigente.<br>2. Agrupe solo cambios de la misma familia y técnicamente relacionados; secuencie los dependientes.<br>3. Verifique siempre tarifas, guías y normas vigentes al momento de radicar.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: protocolo de gestión de cambios post-aprobación (PACMP) y su traducción al trámite INVIMA', 'Clase 4 · Caso práctico integrador', 7, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica las herramientas de ICH Q12 para planear un cambio futuro y definir cómo se presentaría bajo el Decreto 334 de 2022.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://qbdworks.com/wp-content/uploads/2021/05/Q12-Technical-and-Regulatory-Considerations-for-Pharmaceutical-Product-Lifecycle-Management-Core-Guideline-Guidance-for-Industry.pdf","title":"Q12 Technical and Regulatory Considerations for Pharmaceutical Product Lifecycle Management – Core Guideline, Guidance for Industry","description":"FDA / ICH (copia QbDWorks) (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.tga.gov.au/sites/default/files/2025-03/session-4-post-approval-change-management-ich-q12-tools-and-enablers.pdf","title":"ICH Q12: Tools and enablers (Session 4 – Post-approval change management)","description":"TGA Australia (EN)"}'::jsonb);

END
$curso$;

-- ─── 5. Curso de Elaboración de Dossiers Farmacéuticos (31 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Elaboración de Dossiers Farmacéuticos' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Elaboración de Dossiers Farmacéuticos', 'Curso práctico para estructurar, redactar y controlar dossiers de registro de medicamentos según el Documento Técnico Común (CTD) de ICH (M4, M4Q, M4S, M4E). Se trabaja el contexto colombiano: el formato vigente del INVIMA y la reforma en curso hacia el CTD obligatorio. Se profundiza en el Módulo 3 de Calidad y en el armado de dossiers de genéricos.', '<p>Curso práctico para estructurar, redactar y controlar dossiers de registro de medicamentos según el Documento Técnico Común (CTD) de ICH (M4, M4Q, M4S, M4E). Se trabaja el contexto colombiano: el formato vigente del INVIMA y la reforma en curso hacia el CTD obligatorio. Se profundiza en el Módulo 3 de Calidad y en el armado de dossiers de genéricos.</p><h3>Objetivo general</h3><p>Que el químico farmacéutico sea capaz de armar, revisar y gestionar electrónicamente un dossier de medicamento de síntesis química (especialmente genérico) con estructura CTD, coherente entre módulos y alineado con los requisitos del INVIMA y de las autoridades de referencia de Latam.</p><h3>A quién va dirigido</h3><p>Químicos farmacéuticos y profesionales de asuntos regulatorios, aseguramiento de calidad, desarrollo galénico y control de calidad de laboratorios farmacéuticos e importadores en Colombia.</p><h3>Contexto normativo</h3><p>Colombia — normativa INVIMA / MinSalud</p>',
          'Asuntos regulatorios', 'intermedio', 'Que el químico farmacéutico sea capaz de armar, revisar y gestionar electrónicamente un dossier de medicamento de síntesis química (especialmente genérico) con estructura CTD, coherente entre módulos y alineado con los requisitos del INVIMA y de las autoridades de referencia de Latam.', 'Químicos farmacéuticos y profesionales de asuntos regulatorios, aseguramiento de calidad, desarrollo galénico y control de calidad de laboratorios farmacéuticos e importadores en Colombia.',
          1440, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Fundamentos del Documento Técnico Común (CTD) y su situación en Colombia y Latam', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: qué es un dossier farmacéutico y por qué hablar de CTD', 'Clase 1 · Introducción al curso', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante resume el propósito del curso, qué es un dossier de registro y cómo el CTD organiza la información de calidad, seguridad y eficacia en cinco módulos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=AAkV42tNlL8","provider":"youtube","videoId":"AAkV42tNlL8","title":"Sensibilización para la Implementación del CTD (Documentos informativos de medicamentos)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=d1WUlAdWxNg","provider":"youtube","videoId":"d1WUlAdWxNg","title":"A Short Guide to the ICH CTD (Common Technical Document)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://simplerqms.com/common-technical-document/","title":"[Página web] Common Technical Document (CTD): Definition, Modules, and ICH M4 Guidelines","description":"SimplerQMS (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'ICH y la familia M4: M4, M4Q, M4S y M4E', 'Clase 2 · El CTD de ICH: familia de guías M4', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el origen del CTD en ICH, el alcance de cada guía M4 y qué módulo regula cada una (incluida la revisión en curso M4Q(R2)).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://database.ich.org/sites/default/files/M4_R4__Guideline.pdf","title":"ICH M4(R4) Organisation of the Common Technical Document for the Registration of Pharmaceuticals for Human Use","description":"ICH (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://database.ich.org/sites/default/files/M4Q_R1_Guideline.pdf","title":"ICH M4Q(R1) The Common Technical Document for the Registration of Pharmaceuticals for Human Use: Quality","description":"ICH (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://database.ich.org/sites/default/files/M4E_R2__Guideline.pdf","title":"ICH M4E(R2) Revision of M4E Guideline on Enhancing the Format and Structure of Benefit-Risk Information","description":"ICH (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Estructura, numeración y granularidad del CTD', 'Clase 2 · El CTD de ICH: familia de guías M4', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la numeración de secciones del CTD, el concepto de granularidad y las reglas generales de paginación y presentación de documentos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=wjotGRmfGiI","provider":"youtube","videoId":"wjotGRmfGiI","title":"Common Technical Document CTD","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://database.ich.org/sites/default/files/M4_Q&As_R3_Q&As.pdf","title":"M4 Implementation Working Group Questions & Answers (R3) – CTD General","description":"ICH (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://database.ich.org/sites/default/files/M4_R4__Presentation.pdf","title":"CTD: Revisions to the M4 Granularity Document (presentación ICH)","description":"ICH (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Marco colombiano vigente: formato propio INVIMA frente al CTD', 'Clase 3 · El CTD en Colombia y Latinoamérica', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara el expediente actual del INVIMA (evaluación farmacéutica, legal y farmacológica bajo el Decreto 677 de 1995 y el Decreto 334 de 2022 para renovaciones y modificaciones) con la estructura CTD de ICH.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_0334_2022.htm","title":"[Página web] Decreto 334 de 2022 – Compilación Jurídica del Invima (renovación, modificación y suspensión de registros sanitarios)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://repositorio.unbosque.edu.co/items/c6a04e74-985e-4f27-8ffb-8ba7d5528d20/full","title":"[Página web] Desafíos en la implementación de un Documento Técnico Común de acuerdo con los lineamientos de la ICH M4Q (2022)","description":"Universidad El Bosque (Colombia) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/autorizacion-de-comercializacion-registros","title":"[Página web] Autorización de comercialización (Registros Sanitarios) – Medicamentos","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Hacia el CTD obligatorio: reforma en curso, reliance e ICH en Latam', 'Clase 3 · El CTD en Colombia y Latinoamérica', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el estado de la reforma (borrador de decreto Minsalud 2025 y proyectos INVIMA 2026 sobre CTD y reliance), el rol del INVIMA como observador ICH desde 2017 y la experiencia de COFEPRIS y ANVISA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://consultorsalud.com/minsalud-registro-sanitario-indefinido-ctd/","title":"[Página web] Minsalud propone registro sanitario indefinido y nuevo modelo técnico para medicamentos de síntesis química","description":"Consultorsalud (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.asuntoslegales.com.co/analisis/andrea-pieschacon-2807422/el-ctd-common-technical-document-clave-para-el-nuevo-registro-sanitario-de-medicamentos-en-colombia-4471135","title":"[Página web] El CTD (Common Technical Document): clave para el nuevo registro sanitario de medicamentos en Colombia","description":"Asuntos Legales (La República) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://consultorsalud.com/registros-medicamentos-invima-farma/","title":"[Página web] Registros de medicamentos ante el Invima: qué cambia con el Documento Técnico Común y qué debe ajustar la industria farmacéutica","description":"Consultorsalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: mapear un expediente INVIMA de un genérico a la estructura CTD', 'Clase 3 · El CTD en Colombia y Latinoamérica', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta el mapeo de los documentos de un expediente real de registro de un genérico al índice CTD, identificando brechas documentales.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://repositorio.unbosque.edu.co/bitstreams/01c48f25-fe7a-46c7-96f5-381952240605/download","title":"Desafíos en la implementación de un Documento Técnico Común de acuerdo con los lineamientos de la ICH M4Q (texto completo)","description":"Universidad El Bosque (Colombia) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://observatorios.invima.gov.co/biblioteca/preview/145269","title":"Proyecto de resolución INVIMA: lineamientos para el uso de decisiones regulatorias de otras jurisdicciones (reliance) – cita la circular sobre formato CTD","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.pharmabiz.net/wp-content/uploads/2017/12/Ingreso-Invima-observador-ICH-FINAL.pdf","title":"El Invima es aceptado como nuevo observador del ICH (comunicado, 30-nov-2017)","description":"INVIMA (vía Pharmabiz) (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Módulo 1 regional (Colombia) y Módulo 2: resúmenes', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: el Módulo 1 regional y los resúmenes del Módulo 2', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la función del Módulo 1 como parte regional no armonizada y del Módulo 2 como puente entre los datos y el evaluador.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=ab6wcxdik9g","provider":"youtube","videoId":"ab6wcxdik9g","title":"CTD (Common Technical Document) Module 1","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://database.ich.org/sites/default/files/M4_R4__Guideline.pdf","title":"ICH M4(R4) Organisation of the Common Technical Document for the Registration of Pharmaceuticals for Human Use","description":"ICH (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Documentación legal para el INVIMA: titular, fabricante, BPM, poderes y legalización', 'Clase 2 · Módulo 1: documentación legal y administrativa colombiana', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los documentos legales que soportan el expediente (existencia y representación, poder, certificado de BPM, contratos de fabricación, autorización de marca, CPP/CVL para importados) y los requisitos de legalización o apostilla.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/normatividad_normatividad_interna/Gu_C3_ADa_20Adtvo_20Legal_20ASS-RSA-GU73_20VoBo_20DMTS_20MinSalud_2.pdf","title":"Guía para presentar modificaciones administrativo-legales de medicamentos de síntesis química, radiofármacos, gases medicinales, biológicos y homeopáticos (Decreto 334/2022 mod. 1474/2023)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://app.invima.gov.co/oficina-virtual/atencion-al-ciudadano/knowledgebase.php?article=36","title":"[Página web] Guías de la Dirección de Medicamentos (Oficina virtual INVIMA)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_0334_2022.htm","title":"[Página web] Decreto 334 de 2022 – Compilación Jurídica del Invima (renovación, modificación y suspensión de registros sanitarios)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Información regional de producto y formatos del INVIMA en el Módulo 1', 'Clase 2 · Módulo 1: documentación legal y administrativa colombiana', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta cómo ordenar formularios, pagos, etiquetas, inserto y datos de codificación (CUM/IUM) dentro de un Módulo 1 coherente con los Módulos 3 y 5.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: identificar qué información de producto y qué formatos regionales componen la parte no legal del Módulo 1 cuando se presenta un medicamento de síntesis química ante el INVIMA, y cómo se ordenan dentro de un expediente con estructura CTD.</p><p>Desarrollo: el Módulo 1 es la única parte del CTD que no está armonizada por ICH; cada autoridad define su contenido. En Colombia, mientras la reforma que haría obligatorio el CTD sigue en trámite (borrador de decreto del Ministerio de Salud publicado para consulta en noviembre de 2025 y proyectos del INVIMA de 2026), el expediente se presenta con la estructura de evaluación farmacéutica, legal y farmacológica derivada del Decreto 677 de 1995. Aun así, conviene organizar desde ya un \"Módulo 1 Colombia\" que agrupe, además de los documentos legales, la información regional de producto: (1.1) índice general del expediente y carta de presentación; (1.2) formulario de solicitud vigente del INVIMA debidamente diligenciado y comprobante de pago de la tarifa según el manual tarifario de la Dirección de Medicamentos; (1.3) información de producto: textos de etiquetas y empaques, inserto o información para prescribir, y artes en la versión que se someterá a aprobación; (1.4) información sobre los expertos o responsables técnicos (director técnico, químico farmacéutico que firma); (1.5) información específica del tipo de solicitud: por ejemplo, para un genérico, la declaración de que el principio activo está incluido en normas farmacológicas y la justificación del medicamento de referencia; (1.6) datos para codificación, como la información requerida para el Código Único de Medicamentos (CUM) y el Identificador Único de Medicamentos (IUM). El detalle del contenido de etiquetas e insertos se trabaja en el curso de Etiquetado e Insertos; aquí el foco es la ubicación, la coherencia y la trazabilidad de esos documentos dentro del dossier.</p><p>Ejemplo aplicado: una empresa prepara la solicitud de registro sanitario de losartán potásico 50 mg tabletas recubiertas, fabricación nacional. El equipo regulatorio arma la carpeta M1 con el formulario de solicitud, el recibo de pago, los proyectos de etiqueta (blíster y plegadiza), el inserto y una matriz de coherencia que cruza nombre del producto, concentración, forma farmacéutica, condiciones de almacenamiento y vida útil contra lo declarado en 3.2.P.1 (composición), 3.2.P.7 (envase) y 3.2.P.8 (estabilidad). La matriz detecta que la etiqueta dice \"Almacenar a temperatura inferior a 30 °C\" mientras el estudio de estabilidad se condujo en zona IVb (30 °C/75 % HR) con conclusión de \"no almacenar a más de 30 °C\"; se armoniza la frase antes de radicar, evitando un requerimiento.</p><p>Puntos clave:<br>1. El Módulo 1 es regional: en Colombia aún se rige por el formato propio del INVIMA, pero ordenarlo al estilo CTD facilita la transición y la reutilización del dossier en otros países.<br>2. La información de producto (etiquetas, inserto, condiciones de almacenamiento, vida útil) debe ser idéntica a lo que soportan los Módulos 3 y 5.<br>3. Usa siempre la versión vigente de los formularios y tarifas del INVIMA y deja evidencia de la versión utilizada.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Quality Overall Summary (QOS, sección 2.3)', 'Clase 3 · Módulo 2: resúmenes de calidad, no clínicos y clínicos', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la estructura del QOS, su relación uno a uno con el Módulo 3 y los errores típicos de redacción.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://database.ich.org/sites/default/files/M4Q_R1_Guideline.pdf","title":"ICH M4Q(R1) The Common Technical Document for the Registration of Pharmaceuticals for Human Use: Quality","description":"ICH (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://gmp-compliance.org/files/guidemgr/TRS986annex6.pdf","title":"OMS TRS 986 Anexo 6: Guidelines on submission of documentation for a multisource (generic) finished pharmaceutical product: quality part","description":"OMS (copia ECA/gmp-compliance.org) (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://database.ich.org/sites/default/files/M4Q_Q&As_R1_Q&As.pdf","title":"Common Technical Document – Quality Questions and Answers / Location Issues (M4Q Q&A R1)","description":"ICH (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Resúmenes y visiones generales no clínicas y clínicas (2.4–2.7)', 'Clase 3 · Módulo 2: resúmenes de calidad, no clínicos y clínicos', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara el contenido de 2.4/2.6 (no clínico) y 2.5/2.7 (clínico) en un medicamento nuevo frente a un genérico.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://database.ich.org/sites/default/files/M4S_R2_Guideline.pdf","title":"ICH M4S(R2) CTD Safety: Nonclinical Overview and Nonclinical Summaries of Module 2 – Organisation of Module 4","description":"ICH (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://database.ich.org/sites/default/files/M4E_R2__Guideline.pdf","title":"ICH M4E(R2) Revision of M4E Guideline on Enhancing the Format and Structure of Benefit-Risk Information","description":"ICH (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://database.ich.org/sites/default/files/The_M4_Efficacy_Questions___Answers__R4_.pdf","title":"M4E Implementation Working Group Questions & Answers (R4)","description":"ICH (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: redactar el QOS de un genérico a partir del Módulo 3', 'Clase 3 · Módulo 2: resúmenes de calidad, no clínicos y clínicos', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la redacción de secciones clave del QOS (2.3.S.4, 2.3.P.2, 2.3.P.5 y 2.3.P.8) de un genérico usando datos del Módulo 3.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.who.int/publications/m/item/annex-4-trs-970","title":"[Página web] TRS 970 – Annex 4: Guidelines on submission of documentation for a multisource (generic) finished pharmaceutical product for the WHO Prequalification of Medicines Programme: quality part","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.usp-pqm.org/sites/default/files/field/image/ctd-and-be-g-kaddu.pdf","title":"Common Technical Document (CTD) – preparación de dossiers de genéricos y deficiencias frecuentes (USP PQM, G. Kaddu)","description":"USP – Promoting the Quality of Medicines (EN)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Módulo 3 Calidad I: el principio activo (3.2.S) y los archivos maestros', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: el Módulo 3 y la sección 3.2.S', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la arquitectura del Módulo 3 y los siete bloques de la sección 3.2.S del principio activo.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: comprender qué es el Módulo 3 del CTD, por qué es el núcleo técnico del dossier de un genérico y cómo se organiza la sección 3.2.S dedicada al principio activo (API).</p><p>Desarrollo: según ICH M4Q(R1), el Módulo 3 contiene la información de Calidad (química, fabricación y controles, CMC) del principio activo (3.2.S), del producto terminado (3.2.P), apéndices (3.2.A, para instalaciones, evaluación de seguridad de agentes adventicios y excipientes nuevos), información regional (3.2.R) y referencias bibliográficas (3.3). En un medicamento genérico de síntesis química, los Módulos 4 y 5 suelen reducirse a referencias bibliográficas y al estudio de bioequivalencia o a la justificación de bioexención, de modo que la mayor parte de la evaluación técnica del INVIMA recae en la información de calidad. Por eso los errores del Módulo 3 son la principal causa de requerimientos.</p><p>La sección 3.2.S se divide en siete bloques: 3.2.S.1 información general (nomenclatura, estructura, propiedades); 3.2.S.2 fabricación (fabricante, descripción del proceso, control de materiales, controles de pasos críticos, validación, desarrollo del proceso); 3.2.S.3 caracterización (elucidación estructural, impurezas); 3.2.S.4 control del principio activo (especificaciones, métodos, validación, análisis de lotes, justificación de especificaciones); 3.2.S.5 estándares de referencia; 3.2.S.6 sistema de envase-cierre; y 3.2.S.7 estabilidad. El fabricante del medicamento rara vez fabrica el API; por eso esta sección se construye con información del proveedor, que puede entregarse completa, mediante un archivo maestro (DMF/ASMF) con parte abierta y parte cerrada, o mediante un certificado de idoneidad de la Farmacopea Europea (CEP), según lo que acepte la autoridad.</p><p>Ejemplo aplicado: para un registro de metformina 850 mg tabletas ante el INVIMA, el fabricante colombiano recibe del proveedor indio un paquete técnico del API. El regulatorio debe verificar que el paquete cubra los siete bloques de 3.2.S, que el certificado de análisis del proveedor y el del fabricante del producto (análisis de confirmación) usen la misma monografía farmacopeica vigente, que existan datos de estabilidad del API que respalden el periodo de reanálisis declarado y que la ruta de síntesis permita evaluar impurezas potenciales, incluidas las nitrosaminas.</p><p>Puntos clave:<br>1. El Módulo 3 es el corazón del dossier de un genérico: allí se concentran la mayoría de las observaciones de evaluación farmacéutica.<br>2. 3.2.S tiene siete bloques fijos; cualquier sección no aplicable debe declararse como \"no aplica\" con justificación, no omitirse.<br>3. La calidad de 3.2.S depende de la gestión del proveedor del API: acuerdos de calidad, cartas de acceso y control de cambios.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Secciones 3.2.S.1 a 3.2.S.7: del nombre a la estabilidad del API', 'Clase 2 · Contenido de 3.2.S y opciones de presentación del API', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el contenido exigido en cada bloque de 3.2.S según ICH M4Q, con ejemplos de un API de síntesis química.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=vcxhsKsPrSc","provider":"youtube","videoId":"vcxhsKsPrSc","title":"ICH CTD Quality Part – CMC Module 3 Drug Substance (Raaj PharmaeLearning)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://database.ich.org/sites/default/files/M4Q_R1_Guideline.pdf","title":"ICH M4Q(R1) The Common Technical Document for the Registration of Pharmaceuticals for Human Use: Quality","description":"ICH (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.hhs.gov/guidance/sites/default/files/hhs-guidance-documents/FDA/M4--The-CTD----Quality.pdf","title":"FDA – M4: The CTD – Quality","description":"FDA / HHS (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'DMF, ASMF y CEP: parte abierta, parte cerrada y carta de acceso', 'Clase 2 · Contenido de 3.2.S y opciones de presentación del API', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara las vías para presentar información del API (dossier completo, DMF/ASMF, CEP) y cómo gestionarlas ante el INVIMA y otras autoridades.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=NpOwJ5ro2E4","provider":"youtube","videoId":"NpOwJ5ro2E4","title":"Questions and Answers on Drug Master Files (DMFs) and Drug Substances Part I","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.registrarcorp.com/es/blog/drugs/drug-master-files/drug-master-file-dmf/","title":"[Página web] Drug Master File (DMF) – blog en español","description":"Registrar Corp (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.registrarcorp.com/es/blog/drugs/drug-master-files/global-drug-master-files/","title":"[Página web] Global Drug Master Files (DMF/ASMF en distintas jurisdicciones)","description":"Registrar Corp (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Impurezas, solventes residuales y nitrosaminas en 3.2.S.3 y 3.2.S.4', 'Clase 2 · Contenido de 3.2.S y opciones de presentación del API', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los umbrales de reporte, identificación y calificación de ICH Q3A y cómo documentar impurezas y riesgo de nitrosaminas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=hCcC-QutVuk","provider":"youtube","videoId":"hCcC-QutVuk","title":"GDF2026 – Factors that Can Facilitate Assessment of Type II Drug Master Files (DMFs)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://database.ich.org/sites/default/files/Q3A(R2)%20Guideline.pdf","title":"ICH Q3A(R2) Impurities in New Drug Substances","description":"ICH (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://database.ich.org/sites/default/files/Q6A_Guideline.pdf","title":"ICH Q6A Specifications: Test Procedures and Acceptance Criteria for New Drug Substances and New Drug Products: Chemical Substances","description":"ICH (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: evaluar el paquete técnico de un proveedor de API y completar 3.2.S', 'Clase 3 · Caso práctico de la unidad', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la revisión de un paquete de proveedor (DMF parte abierta, CoA, estabilidad) e identifica brechas antes de radicar ante el INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://gmp-compliance.org/files/guidemgr/TRS986annex6.pdf","title":"OMS TRS 986 Anexo 6: Guidelines on submission of documentation for a multisource (generic) finished pharmaceutical product: quality part","description":"OMS (copia ECA/gmp-compliance.org) (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.usp-pqm.org/sites/default/files/field/image/ctd-and-be-g-kaddu.pdf","title":"Common Technical Document (CTD) – preparación de dossiers de genéricos y deficiencias frecuentes (USP PQM, G. Kaddu)","description":"USP – Promoting the Quality of Medicines (EN)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Módulo 3 Calidad II: el producto terminado (3.2.P)', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: la narrativa del producto terminado en 3.2.P', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume cómo 3.2.P conecta descripción, desarrollo, fabricación, control, envase y estabilidad del medicamento.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: resumir el contenido de la sección 3.2.P del CTD (producto terminado) y la lógica que conecta desarrollo, fabricación, controles y estabilidad en un dossier de medicamento genérico.</p><p>Desarrollo: la sección 3.2.P de ICH M4Q(R1) cuenta una historia coherente sobre el producto: qué es (3.2.P.1 descripción y composición), por qué se formuló así (3.2.P.2 desarrollo farmacéutico, guiado por ICH Q8(R2)), cómo se fabrica (3.2.P.3 fabricantes, fórmula del lote, descripción del proceso y controles, controles de pasos críticos e intermedios, validación del proceso), cómo se controlan los excipientes (3.2.P.4), cómo se controla el producto terminado (3.2.P.5 especificaciones según ICH Q6A, procedimientos analíticos, validación, análisis de lotes, caracterización de impurezas y justificación de especificaciones), qué estándares de referencia se usan (3.2.P.6), en qué envase se presenta (3.2.P.7) y cuánto tiempo y en qué condiciones permanece estable (3.2.P.8). Cada bloque debe ser coherente con los demás: la fórmula de 3.2.P.1 debe coincidir con la fórmula maestra de 3.2.P.3; el envase de 3.2.P.7 con el de los lotes de estabilidad de 3.2.P.8; y las especificaciones de liberación y vida útil de 3.2.P.5 con los resultados de estabilidad.</p><p>Para un genérico, el desarrollo farmacéutico se centra en demostrar similitud con el medicamento de referencia: selección de excipientes, perfiles de disolución comparativos, justificación de sobrellenados o excesos, compatibilidad fármaco-excipiente y relación con el lote usado en el estudio de bioequivalencia. En Colombia, la estabilidad se rige por la Resolución 3157 de 2018 (guía de estabilidad de medicamentos de síntesis química), que fija las condiciones para la zona climática IVb.</p><p>Ejemplo aplicado: una empresa somete atorvastatina 20 mg tabletas recubiertas. En la evaluación, el INVIMA observa que el lote biológico del estudio de bioequivalencia se fabricó a escala piloto con un proveedor de lactosa distinto al declarado en 3.2.P.4 y que no hay discusión en 3.2.P.2 sobre ese cambio. La empresa debe responder con datos de disolución comparativa y justificación. Si 3.2.P.2 hubiera incluido una tabla de trazabilidad de lotes (desarrollo, biolote, validación, estabilidad), el requerimiento se habría evitado.</p><p>Puntos clave:<br>1. 3.2.P es una narrativa integrada: desarrollo → fabricación → control → envase → estabilidad.<br>2. En genéricos, el desarrollo farmacéutico debe enlazar la formulación con el medicamento de referencia y con el lote de bioequivalencia.<br>3. La coherencia numérica entre secciones (fórmula, tamaño de lote, especificaciones, vida útil) se revisa sistemáticamente antes de radicar.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, '3.2.P.1 y 3.2.P.2: composición y desarrollo farmacéutico según ICH Q8(R2)', 'Clase 2 · Desarrollo farmacéutico y fabricación', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los elementos del desarrollo farmacéutico (perfil objetivo de calidad, atributos críticos, selección de excipientes, disolución comparativa) aplicados a un genérico.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=Nd_HyGy5CwM","provider":"youtube","videoId":"Nd_HyGy5CwM","title":"The Strategic Blueprint: Mastering the CTD Module 3 for Drug Approval","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://database.ich.org/sites/default/files/Q8_R2_Guideline.pdf","title":"ICH Q8(R2) Pharmaceutical Development","description":"ICH (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://database.ich.org/sites/default/files/Q8_Q9_Q10_Q&As_R4_Q&As_0.pdf","title":"Quality Implementation Working Group on Q8, Q9 and Q10 – Questions & Answers (R4)","description":"ICH (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, '3.2.P.3: fabricantes, fórmula del lote, proceso, controles y validación', 'Clase 2 · Desarrollo farmacéutico y fabricación', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe la información de fabricación exigida: fórmula maestra, diagrama de flujo, controles en proceso, pasos críticos y validación del proceso.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://database.ich.org/sites/default/files/M4Q_R1_Guideline.pdf","title":"ICH M4Q(R1) The Common Technical Document for the Registration of Pharmaceuticals for Human Use: Quality","description":"ICH (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.who.int/publications/m/item/annex-4-trs-970","title":"[Página web] TRS 970 – Annex 4: Guidelines on submission of documentation for a multisource (generic) finished pharmaceutical product for the WHO Prequalification of Medicines Programme: quality part","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, '3.2.P.4–3.2.P.5: excipientes, especificaciones ICH Q6A y métodos analíticos', 'Clase 3 · Controles, especificaciones, métodos y estabilidad', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta cómo fijar y justificar especificaciones (liberación y vida útil) y cómo documentar la validación o verificación de métodos (ICH Q2(R2)).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://database.ich.org/sites/default/files/Q6A_Guideline.pdf","title":"ICH Q6A Specifications: Test Procedures and Acceptance Criteria for New Drug Substances and New Drug Products: Chemical Substances","description":"ICH (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.qbdgroup.com/blog/ich-q2r2-validation-of-analytical-procedures-an-overview-of-the-revised-guideline/","title":"[Página web] ICH Q2(R2) Validation of Analytical Procedures: An Overview of the Revised Guideline","description":"QbD Group (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://database.ich.org/sites/default/files/Q2(R1)%20Guideline.pdf","title":"ICH Q2(R1) Validation of Analytical Procedures: Text and Methodology (versión histórica; reemplazada por Q2(R2))","description":"ICH (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, '3.2.P.7–3.2.P.8: envase y estabilidad (Res. 3157 de 2018 y zona IVb)', 'Clase 3 · Controles, especificaciones, métodos y estabilidad', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe cómo presentar el sistema de envase-cierre y el resumen, protocolo, compromisos y datos de estabilidad conforme a la guía colombiana.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=dEBlmADVsXQ","provider":"youtube","videoId":"dEBlmADVsXQ","title":"Herramientas estadísticas para analizar la estabilidad de medicamentos y fármacos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_autorizacion_de_comercializacion_registros/Preguntas_20y_20respuestas_20Res._203157_20de_202018_20-_20Abril_202024_20V.6.pdf","title":"Documento de preguntas y respuestas – Resolución 3157 de 2018 (Guía de estabilidad de medicamentos de síntesis química), v. abril 2024","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://database.ich.org/sites/default/files/Q1A(R2)%20Step4.pdf","title":"ICH Q1A(R2) Stability Testing of New Drug Substances and Products (Step 4)","description":"ICH (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: armar la sección 3.2.P de una tableta genérica', 'Clase 3 · Controles, especificaciones, métodos y estabilidad', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta el ensamble de 3.2.P de un genérico, verificando la coherencia entre fórmula, proceso, especificaciones, envase y estabilidad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://gmp-compliance.org/files/guidemgr/TRS986annex6.pdf","title":"OMS TRS 986 Anexo 6: Guidelines on submission of documentation for a multisource (generic) finished pharmaceutical product: quality part","description":"OMS (copia ECA/gmp-compliance.org) (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.usp-pqm.org/sites/default/files/field/image/ctd-and-be-g-kaddu.pdf","title":"Common Technical Document (CTD) – preparación de dossiers de genéricos y deficiencias frecuentes (USP PQM, G. Kaddu)","description":"USP – Promoting the Quality of Medicines (EN)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Módulos 4 y 5, eCTD y control de calidad del dossier', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: completar, digitalizar y asegurar la calidad del dossier', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume el papel de los Módulos 4 y 5, el eCTD como formato electrónico y la importancia de un control de calidad previo a la radicación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=zMtHOf1bGZc","provider":"youtube","videoId":"zMtHOf1bGZc","title":"What is Common Technical Document or CTD?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://simplerqms.com/common-technical-document/","title":"[Página web] Common Technical Document (CTD): Definition, Modules, and ICH M4 Guidelines","description":"SimplerQMS (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Estructura de los Módulos 4 y 5 y diferencias entre medicamentos nuevos y genéricos', 'Clase 2 · Módulos 4 y 5: información no clínica y clínica', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara qué estudios no clínicos y clínicos se presentan para un medicamento nuevo frente a un genérico (bibliografía, bioequivalencia en 5.3.1.2 o bioexención).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://database.ich.org/sites/default/files/M4S_R2_Guideline.pdf","title":"ICH M4S(R2) CTD Safety: Nonclinical Overview and Nonclinical Summaries of Module 2 – Organisation of Module 4","description":"ICH (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://database.ich.org/sites/default/files/M4E_R2__Guideline.pdf","title":"ICH M4E(R2) Revision of M4E Guideline on Enhancing the Format and Structure of Benefit-Risk Information","description":"ICH (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://database.ich.org/sites/default/files/M4S_Q&As_R2_Q&As.pdf","title":"M4S Implementation Working Group Questions & Answers (R2)","description":"ICH (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Información farmacológica para el INVIMA y su ubicación en los Módulos 2 y 5', 'Clase 2 · Módulos 4 y 5: información no clínica y clínica', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta cómo se relaciona la evaluación farmacológica del INVIMA (formatos para nueva asociación, forma farmacéutica o concentración) con los resúmenes y estudios clínicos del CTD.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/ass-rsa-fm080_1pdf","title":"[Página web] Formato de evaluación farmacológica para nueva asociación, nueva forma farmacéutica y nueva concentración de medicamentos de síntesis","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://database.ich.org/sites/default/files/M4E_R2__Guideline.pdf","title":"ICH M4E(R2) Revision of M4E Guideline on Enhancing the Format and Structure of Benefit-Risk Information","description":"ICH (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'eCTD: especificaciones ICH M2/M8, backbone XML y ciclo de vida', 'Clase 3 · eCTD y gestión electrónica del dossier', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los componentes del eCTD (v3.2.2 y v4.0), las operaciones de ciclo de vida y su adopción en las autoridades de referencia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=O3dfvksT4TM","provider":"youtube","videoId":"O3dfvksT4TM","title":"Introduction to Electronic Common Technical Document [eCTD] – Institute of Pharmaceutical Management","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ema.europa.eu/en/ich-m8-electronic-common-technical-document-ectd-v40-draft-ich-implementation-guide-v20-scientific-guideline","title":"[Página web] ICH M8 Electronic common technical document (eCTD) v4.0 – ICH implementation guide","description":"EMA (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://intuitionlabs.ai/articles/ich-m8-ectd-v4-specification","title":"[Página web] A Guide to the ICH M8 eCTD v4.0 Submission Specification","description":"IntuitionLabs (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Gestión electrónica del dossier ''eCTD-ready'' en Colombia', 'Clase 3 · eCTD y gestión electrónica del dossier', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica criterios de estructura de carpetas, formato PDF, control de versiones y matriz de ciclo de vida a un dossier que se radica ante el INVIMA y otros países.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar buenas prácticas de gestión electrónica del dossier (estructura de carpetas, formatos PDF, control de versiones y ciclo de vida) aunque la autoridad todavía no exija eCTD.</p><p>Desarrollo: el eCTD es la versión electrónica del CTD definida por ICH (especificación M2 para v3.2.2 y M8 para v4.0): combina la estructura de carpetas del CTD con un archivo XML (backbone) que describe cada documento y su operación de ciclo de vida (nuevo, reemplazo, adición, eliminación). El INVIMA radica hoy expedientes por sus plataformas en línea y no exige eCTD; sin embargo, una empresa que prepara dossiers para varios países de Latam obtiene grandes beneficios si gestiona sus documentos con criterios \"eCTD-ready\": (a) una carpeta por sección CTD con nombres de archivo cortos y normalizados (por ejemplo m3-2-p-5-1-especificaciones.pdf); (b) un documento por nivel de granularidad definido en el Anexo de granularidad de ICH M4; (c) PDF con texto buscable, fuentes incrustadas, marcadores, sin protección por contraseña y con hipervínculos internos; (d) control de versiones con identificador, fecha, autor y aprobación (enlazado al sistema de gestión de calidad); (e) una matriz maestra que registre qué versión de cada documento se presentó a cada autoridad y en qué radicado; y (f) un registro de ciclo de vida que muestre qué documento reemplazó a cuál después de modificaciones o respuestas a requerimientos. La custodia y archivo formal de trámites se trabaja en el curso de Gestión Documental; aquí el foco es la arquitectura del dossier.</p><p>Ejemplo aplicado: un laboratorio colombiano registra amlodipino 5 mg ante el INVIMA y, seis meses después, lo somete en Perú y Ecuador. Como su dossier maestro estaba organizado en carpetas CTD con PDF buscables, solo debe reemplazar el Módulo 1 regional y adaptar 3.2.R. Cuando el INVIMA aprueba luego un cambio de fabricante del API, la matriz maestra indica qué secciones (3.2.S completo, 3.2.P.5.4 análisis de lotes, 3.2.P.8 estabilidad) deben actualizarse en cada país, evitando que un expediente quede desactualizado.</p><p>Puntos clave:<br>1. Organizar el dossier con estructura y granularidad CTD desde hoy facilita la futura obligatoriedad del CTD/eCTD y el uso de mecanismos de reliance.<br>2. La calidad técnica del PDF (texto buscable, marcadores, hipervínculos) es parte de la calidad del dossier.<br>3. Una matriz maestra de versiones por país y radicado es la herramienta clave para gestionar el ciclo de vida.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Errores frecuentes en dossiers y su sección CTD de origen', 'Clase 4 · Errores frecuentes, control de calidad y caso integrador', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las deficiencias más comunes observadas por autoridades y programas de precalificación y cómo prevenirlas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: interpretar los errores más frecuentes en los dossiers de medicamentos y relacionarlos con las secciones del CTD en las que se originan, para prevenir requerimientos del INVIMA.</p><p>Desarrollo: las autoridades y programas de precalificación coinciden en un patrón de deficiencias. En el Módulo 1 y la parte legal: certificados de BPM o de producto farmacéutico vencidos o sin legalizar/apostillar, poderes incompletos, discrepancias en nombres y direcciones de fabricantes entre documentos y contratos de fabricación sin firma. En el Módulo 2: resúmenes de calidad (QOS) que no coinciden con los datos del Módulo 3 o que se limitan a copiar índices. En 3.2.S: carta de acceso al DMF ausente, versión del DMF distinta a la citada, ausencia de evaluación de impurezas genotóxicas y nitrosaminas, periodo de reanálisis del API sin datos de estabilidad. En 3.2.P: desarrollo farmacéutico débil (sin perfiles de disolución comparativos ni justificación de excipientes), fórmula maestra o registros de lote no aportados, validación del proceso sin protocolo o sin lotes industriales, especificaciones sin justificación según ICH Q6A, métodos sin validación completa o sin verificación de métodos farmacopeicos, y estudios de estabilidad que no siguen la Resolución 3157 de 2018 (condiciones de zona IVb, número de lotes, envase idéntico al comercial). En el Módulo 5: medicamento comparador inadecuado en bioequivalencia o lote biológico no representativo. Finalmente, errores transversales: traducciones incompletas, documentos ilegibles, falta de firmas y control de versiones.</p><p>Ejemplo aplicado: un dossier de ibuprofeno 400 mg tabletas recibe un auto de requerimiento del INVIMA con cuatro observaciones: el certificado de BPM del fabricante del API está vencido; la especificación de disolución de 3.2.P.5.1 (Q=75 % a 45 min) no coincide con la de los estudios de estabilidad (Q=80 % a 30 min); el estudio de estabilidad a largo plazo se realizó a 25 °C/60 % HR; y no hay validación del método de sustancias relacionadas. Al mapear cada observación a su sección CTD, el equipo descubre que tres de ellas se habrían detectado con una lista de verificación de coherencia cruzada antes de radicar.</p><p>Puntos clave:<br>1. La mayoría de los requerimientos nacen de documentos vencidos, incoherencias entre secciones o justificaciones ausentes, no de falta de ciencia.<br>2. Cada error tiene una sección CTD \"dueña\"; clasificarlos así permite asignar responsables y prevenir su repetición.<br>3. Una revisión de calidad del dossier (QC) con lista de verificación y revisión cruzada es más barata que responder un requerimiento.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Control de calidad del dossier antes de radicar', 'Clase 4 · Errores frecuentes, control de calidad y caso integrador', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica un procedimiento de QC del dossier: revisión documental, coherencia cruzada, vigencias legales y aprobación final.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.usp-pqm.org/sites/default/files/field/image/ctd-and-be-g-kaddu.pdf","title":"Common Technical Document (CTD) – preparación de dossiers de genéricos y deficiencias frecuentes (USP PQM, G. Kaddu)","description":"USP – Promoting the Quality of Medicines (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://database.ich.org/sites/default/files/M4_Q&As_R3_Q&As.pdf","title":"M4 Implementation Working Group Questions & Answers (R3) – CTD General","description":"ICH (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.redjurista.com/Compilaciones2018/tablas_ProyectosNormas/2026/05/19/pr_invima_0007aj_2026.pdf","title":"Proyecto de resolución INVIMA 2026 ''Por medio de la cual se adoptan las guías individuales por tipo de medicamento''","description":"INVIMA (vía Redjurista) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso integrador: armado completo del dossier de un genérico', 'Clase 4 · Errores frecuentes, control de calidad y caso integrador', 7, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta el armado de un dossier completo (Módulos 1–5) para un genérico de síntesis química, aplicando QC y preparando la radicación ante el INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=kji9KLldhwQ","provider":"youtube","videoId":"kji9KLldhwQ","title":"DIGEMID – Tutorial Registro Sanitario para productos farmacéuticos y dispositivos médicos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.who.int/publications/m/item/annex-4-trs-970","title":"[Página web] TRS 970 – Annex 4: Guidelines on submission of documentation for a multisource (generic) finished pharmaceutical product for the WHO Prequalification of Medicines Programme: quality part","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://consultorsalud.com.mx/wp-content/uploads/2025/10/GUIA_CTD-MH_24092025__002_.pdf","title":"COFEPRIS – Guía para estructurar el expediente conforme al Documento Técnico Común (CTD) (Reconocimiento de Medicamento Huérfano), v1.0 sept. 2025","description":"COFEPRIS (vía Consultorsalud México) (ES)"}'::jsonb);

END
$curso$;

-- ─── 6. Curso de Respuesta a Requerimientos del INVIMA (33 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Respuesta a Requerimientos del INVIMA' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Respuesta a Requerimientos del INVIMA', 'Curso práctico para responder con éxito los autos de requerimiento del INVIMA en trámites de medicamentos. Cubre el marco procesal (CPACA, Ley 1755 de 2015, Decreto 677 de 1995 y Decreto 334 de 2022), la lectura de actas de la Sala Especializada de la Comisión Revisora, la construcción de respuestas técnicas punto por punto y los medios de defensa ante una negación.', '<p>Curso práctico para responder con éxito los autos de requerimiento del INVIMA en trámites de medicamentos. Cubre el marco procesal (CPACA, Ley 1755 de 2015, Decreto 677 de 1995 y Decreto 334 de 2022), la lectura de actas de la Sala Especializada de la Comisión Revisora, la construcción de respuestas técnicas punto por punto y los medios de defensa ante una negación.</p><h3>Objetivo general</h3><p>Que el químico farmacéutico analice un auto de requerimiento del INVIMA, gestione sus plazos y construya una respuesta técnica completa, trazable y oportuna, y que sepa actuar ante el desistimiento, el abandono o la negación del trámite.</p><h3>A quién va dirigido</h3><p>Químicos farmacéuticos y profesionales de asuntos regulatorios, calidad y dirección técnica de laboratorios fabricantes, importadores y titulares de registros sanitarios en Colombia.</p><h3>Contexto normativo</h3><p>Colombia — normativa INVIMA / MinSalud</p>',
          'Asuntos regulatorios', 'intermedio', 'Que el químico farmacéutico analice un auto de requerimiento del INVIMA, gestione sus plazos y construya una respuesta técnica completa, trazable y oportuna, y que sepa actuar ante el desistimiento, el abandono o la negación del trámite.', 'Químicos farmacéuticos y profesionales de asuntos regulatorios, calidad y dirección técnica de laboratorios fabricantes, importadores y titulares de registros sanitarios en Colombia.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. El auto de requerimiento en el procedimiento administrativo', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: qué es un auto de requerimiento y por qué define el resultado del trámite', 'Clase 1 · Introducción al curso', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Comprende el lugar del auto de requerimiento en el trámite de registro sanitario y el recorrido del curso desde la notificación hasta los recursos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=kMhjktRya9w","provider":"youtube","videoId":"kMhjktRya9w","title":"Capacitación - Trámite de Registro Sanitario de Medicamentos en Invima a un clic","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://es.investinbogota.org/wp-content/uploads/2025/12/ABC-13_RegistrosSanitarios-1.pdf","title":"ABC Registros Sanitarios (#13) – trámite, auto de requerimiento, abandono y desistimiento","description":"Invest in Bogotá (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'La solicitud ante el INVIMA como derecho de petición: CPACA y Ley 1755 de 2015', 'Clase 2 · Procedimiento administrativo y derecho de petición', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Reconoce que los trámites sanitarios son peticiones regidas por la norma especial y, de forma supletoria, por el CPACA y la Ley 1755.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.unidadvictimas.gov.co/wp-content/uploads/Documentos/ley/Ley_1755_2015.pdf","title":"Ley 1755 de 2015 – Derecho fundamental de petición (texto: arts. 17 y 18)","description":"Unidad para las Víctimas (texto oficial de la ley) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=65334","title":"[Página web] Ley 1755 de 2015 – Gestor Normativo","description":"Función Pública (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/concepto_invima_0001260_2020.htm","title":"[Página web] Concepto INVIMA 1260 de 2020 – Desistimiento de solicitudes de registro sanitario","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Peticiones incompletas, desistimiento tácito y desistimiento expreso', 'Clase 2 · Procedimiento administrativo y derecho de petición', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los arts. 17 y 18 de la Ley 1755 de 2015 y su aplicación por el INVIMA: plazo de un mes, prórroga, archivo y recurso de reposición.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.unidadvictimas.gov.co/wp-content/uploads/Documentos/ley/Ley_1755_2015.pdf","title":"Ley 1755 de 2015 – Derecho fundamental de petición (texto: arts. 17 y 18)","description":"Unidad para las Víctimas (texto oficial de la ley) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/compilacion/docs/concepto_invima_16041670_2016.htm","title":"[Página web] Concepto INVIMA 16041670 de 2016 – Requerimientos, plazos, desistimiento y abandono","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/concepto_invima_0001260_2020.htm","title":"[Página web] Concepto INVIMA 1260 de 2020 – Desistimiento de solicitudes de registro sanitario","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Actos de trámite y actos definitivos: auto, resolución y firmeza', 'Clase 2 · Procedimiento administrativo y derecho de petición', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Distingue el auto de requerimiento (acto de trámite, sin recursos) de las resoluciones que deciden de fondo y pueden recurrirse.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=ZsOMJUhM_2A","provider":"youtube","videoId":"ZsOMJUhM_2A","title":"Código de Procedimiento Administrativo y de lo Contencioso Administrativo","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.gerencie.com/recursos-que-proceden-contra-los-actos-administrativos.html","title":"[Página web] Recursos contra los actos administrativos: reposición, apelación y queja","description":"Gerencie.com (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://lector.ramajudicial.gov.co/SIBD/VIDEOTECA/Publicaciones/00000000/51188/Anexos/CPACA%20Ley%201437%20Actualizada%202019.pdf","title":"CPACA – Ley 1437 de 2011 actualizada (2019)","description":"Rama Judicial (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Plazos del Decreto 677 de 1995: evaluación farmacéutica, normas farmacológicas, medicamentos nuevos e importados', 'Clase 3 · Plazos para responder según el tipo de trámite', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Identifica los plazos de respuesta del Decreto 677 (30, 60 y 40 días hábiles según el trámite) y la consecuencia de no responder (abandono).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_bioequivalencia/decreto_677_1995.pdf","title":"Decreto 677 de 1995 – Régimen de registros sanitarios (copia publicada por INVIMA)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://minsalud.gov.co/Normatividad_Nuevo/DECRETO%200677%20DE%201995.pdf","title":"Decreto 0677 de 1995","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/compilacion/docs/concepto_invima_16041670_2016.htm","title":"[Página web] Concepto INVIMA 16041670 de 2016 – Requerimientos, plazos, desistimiento y abandono","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Decreto 334 de 2022: requerimiento único, plazo de un mes, prórroga y desistimiento en renovaciones y modificaciones', 'Clase 3 · Plazos para responder según el tipo de trámite', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Comprende el régimen vigente de requerimientos en renovaciones y modificaciones y su relación con el Decreto 677.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_0334_2022.htm","title":"[Página web] Decreto 334 de 2022 – Renovación, modificación y suspensión de registros sanitarios","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=219130","title":"[Página web] Decreto 334 de 2022 – Gestor Normativo","description":"Función Pública (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: calcular el vencimiento de un auto y solicitar la prórroga', 'Clase 3 · Plazos para responder según el tipo de trámite', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Calcula el vencimiento de un auto notificado y redacta una solicitud de prórroga oportuna y motivada.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/atencion-al-ciudadano/preguntas-frecuentes","title":"[Página web] Preguntas frecuentes INVIMA (prórroga de respuesta a auto, notificación, consulta de estado de trámite)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/compilacion/docs/concepto_invima_16041670_2016.htm","title":"[Página web] Concepto INVIMA 16041670 de 2016 – Requerimientos, plazos, desistimiento y abandono","description":"Normograma INVIMA (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Tipos de requerimientos y lectura de actas de la Comisión Revisora', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: requerimientos legales, farmacéuticos y farmacológicos', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume los tres componentes de la evaluación y quién formula cada tipo de requerimiento, incluida la Sala Especializada de la Comisión Revisora.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/acta_no_07_de_2025_sempb_segunda_partepdf","title":"Acta No. 07 de 2025 – Comisión Revisora, Sala Especializada de Medicamentos y Productos Biológicos (segunda parte)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_bioequivalencia/decreto_677_1995.pdf","title":"Decreto 677 de 1995 – Régimen de registros sanitarios (copia publicada por INVIMA)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Requerimientos legales: poderes, certificados, apostilla, CPP y coherencia documental', 'Clase 2 · Clasificación de los requerimientos', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Identifica los requerimientos legales más frecuentes y cómo subsanarlos con documentos vigentes y coherentes.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: identificar los requerimientos de orden legal que el INVIMA formula durante la evaluación de un trámite de medicamentos y saber cómo subsanarlos sin reabrir la evaluación técnica.</p><p>Desarrollo: la evaluación de una solicitud de registro sanitario, renovación o modificación tiene tres componentes: legal, farmacéutico y, cuando aplica, farmacológico. El componente legal verifica que el solicitante y los documentos cumplan las condiciones jurídicas del trámite. Los requerimientos legales más frecuentes son: (1) poder o representación: el apoderado no acredita facultades suficientes, el poder no está vigente o no coincide con el titular registrado; (2) certificado de existencia y representación legal desactualizado o con objeto social que no cubre la actividad; (3) documentos emitidos en el exterior sin apostilla o legalización, o sin traducción oficial al español; (4) certificado de producto farmacéutico (CPP) o de venta libre vencido, sin firma o con datos que no coinciden (nombre, concentración, forma farmacéutica, fabricante); (5) contratos de fabricación o autorizaciones del titular al importador que no identifican el producto; (6) inconsistencias de marca o nombre comercial; (7) diferencias entre el formulario, el comprobante de pago (tarifa y código del trámite) y la documentación anexa; (8) certificado de Buenas Prácticas de Manufactura (BPM) del fabricante no vigente o que no cubre la forma farmacéutica.</p><p>La clave de la respuesta legal es la coherencia: los mismos datos (titular, fabricante, dirección de planta, nombre del producto, concentración) deben repetirse sin variación en todos los documentos. Un error frecuente es corregir un documento y dejar otro con el dato antiguo, lo que genera una negación por inconsistencia, ya que el INVIMA, por regla general, requiere una sola vez.</p><p>Ejemplo aplicado: en una solicitud de registro de un medicamento importado (Decreto 677 de 1995, art. 31) el auto señala que el CPP no coincide con la dirección del fabricante declarada y que el poder fue otorgado por una persona sin facultades. La respuesta debe incluir: nuevo CPP apostillado y traducido con la dirección correcta, o certificación del fabricante y de la autoridad del país de origen que explique el cambio de nomenclatura; poder otorgado por el representante legal con certificado de existencia vigente que lo acredite; y una tabla de concordancia que muestre que el dato corregido coincide en formulario, CPP, certificado BPM y etiquetas. Todo debe radicarse dentro del plazo del auto (40 días hábiles en importados, según el art. 31 del Decreto 677).</p><p>Puntos clave:<br>1. El requerimiento legal se responde con documentos vigentes, apostillados y traducidos, no con explicaciones.<br>2. Verifique la coherencia de datos en todo el expediente antes de radicar: una sola discrepancia puede llevar a la negación.<br>3. Revise vigencias (CPP, BPM, certificado de existencia y poder) con margen suficiente para que no venzan durante la evaluación.</p><p>Nota de actualización normativa (oct. 2026): el Decreto 1474 de 2023 modificó el art. 16 del Decreto 677 de 1995 y dio vigencia indefinida a los registros sanitarios de medicamentos (síntesis química, biológicos, homeopáticos y gases medicinales), incluidos los vigentes a esa fecha; el INVIMA archiva las solicitudes de renovación de estos productos. La renovación con radicación mínima de un mes antes del vencimiento (Decreto 334 de 2022, art. 4) se conserva como antecedente y aplica hoy a productos que mantienen vigencia temporal, como los fitoterapéuticos (Decreto 1156 de 2018, 10 años renovables). Lo que sigue exigiendo control continuo es la gestión del registro: modificaciones, notificación de no comercialización (30 días) y aviso de retiro definitivo (6 meses).</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Requerimientos de evaluación farmacéutica: calidad, fabricación, estabilidad y etiquetas', 'Clase 2 · Clasificación de los requerimientos', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Reconoce los requerimientos que surgen en la evaluación farmacéutica y su relación con la información de fabricación y lotes piloto.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://consultorsalud.com/?p=282915","title":"[Página web] Invima anuncia el procedimiento de evaluación farmacéutica de registros sanitarios nuevos con visita (Circular DG 100-0003-2024)","description":"ConsultorSalud (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_bioequivalencia/decreto_677_1995.pdf","title":"Decreto 677 de 1995 – Régimen de registros sanitarios (copia publicada por INVIMA)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Requerimientos farmacológicos de la Sala Especializada de Medicamentos y Productos Biológicos', 'Clase 2 · Clasificación de los requerimientos', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los requerimientos de eficacia, seguridad, inserto e información para prescribir que formula la Sala.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_bioequivalencia/Acta_20No._2010_20de_202015_20SEMPB.pdf","title":"Acta No. 10 de 2015 SEMPB – Sesión ordinaria (ejemplos de conceptos y requerimientos)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Estructura de un acta: orden del día, ficha del producto, solicitud y concepto', 'Clase 3 · Lectura y análisis de actas de la Sala Especializada', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe cómo está organizada un acta de la SEMPB y dónde ubicar la información relevante para un expediente.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_bioequivalencia/Acta_20No._2010_20de_202015_20SEMPB.pdf","title":"Acta No. 10 de 2015 SEMPB – Sesión ordinaria (ejemplos de conceptos y requerimientos)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/acta_no_07_de_2025_sempb_segunda_partepdf","title":"Acta No. 07 de 2025 – Comisión Revisora, Sala Especializada de Medicamentos y Productos Biológicos (segunda parte)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/biblioteca/acta_20no_2014_20de_202014_20sempb_201_20de_20septiembrepdf-1","title":"Acta No. 14 de 2014 – Sala Especializada de Medicamentos y Productos Biológicos","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Del concepto de la Sala al acto administrativo: aprobar, negar, aplazar o requerir', 'Clase 3 · Lectura y análisis de actas de la Sala Especializada', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el alcance de cada tipo de concepto y cómo se traduce en un auto o resolución de la Dirección de Medicamentos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: interpretar el tipo de concepto que emite la Sala Especializada de Medicamentos y Productos Biológicos (SEMPB) de la Comisión Revisora y traducirlo en acciones concretas para el titular.</p><p>Desarrollo: cada caso que estudia la Sala se publica en un acta con una ficha (expediente, radicado, interesado, composición, forma farmacéutica, indicaciones, contraindicaciones, posología, condición de venta), la solicitud del interesado y el bloque \"CONCEPTO\". Allí la Sala puede: (1) recomendar aprobar, a veces con condiciones (por ejemplo, ajustar indicaciones, incluir advertencias en el inserto o presentar informes periódicos de farmacovigilancia); (2) recomendar negar, explicando la razón técnica (falta de evidencia de eficacia, perfil de seguridad desfavorable, ausencia de bioequivalencia, asociación sin racionalidad); (3) aplazar hasta contar con información adicional; o (4) requerir al interesado para que allegue estudios, aclaraciones o ajustes. El concepto de la Sala es una recomendación técnica: la decisión administrativa (auto o resolución) la toma la Dirección de Medicamentos y Productos Biológicos con base en él.</p><p>Leer bien un concepto exige separar tres capas: lo que la Sala aprueba, lo que condiciona y lo que requiere. Una recomendación de aprobación \"con modificaciones\" obliga a ajustar inserto, información para prescribir o indicaciones antes de que salga la resolución. Un requerimiento debe descomponerse en ítems verificables (por ejemplo: \"allegar estudio clínico de mayor duración\", \"presentar información preclínica del principio activo\", \"justificar la dosis en población pediátrica\"). Cada ítem se convierte en una fila de la matriz de respuesta, con su responsable y su fuente de evidencia.</p><p>Ejemplo aplicado: en el Acta 10 de 2015, ante una nueva indicación, la Sala concluye que el único estudio pivotal es de corta duración y requiere estudios de mayor duración y la información preclínica. El equipo regulatorio debe: identificar si la casa matriz tiene esos estudios; si no existen, valorar si conviene restringir la indicación solicitada (respuesta parcial con propuesta alternativa), desistir de esa indicación o asumir una negación y presentar luego una nueva solicitud con la evidencia completa.</p><p>Puntos clave:<br>1. El concepto de la Sala recomienda; el acto administrativo decide. Responda siempre al auto que lo traslada.<br>2. Descomponga el concepto en \"aprobado / condicionado / requerido\" antes de planear la respuesta.<br>3. Si la evidencia pedida no existe, la estrategia puede ser acotar la solicitud o desistir, no responder con argumentos sin datos.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: analizar un concepto de la Sala y extraer la lista de requerimientos', 'Clase 3 · Lectura y análisis de actas de la Sala Especializada', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Analiza un concepto real de un acta y lo convierte en una lista de requerimientos verificables con responsables.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/acta_no_07_de_2025_sempb_segunda_partepdf","title":"Acta No. 07 de 2025 – Comisión Revisora, Sala Especializada de Medicamentos y Productos Biológicos (segunda parte)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_bioequivalencia/Acta_20No._2010_20de_202015_20SEMPB.pdf","title":"Acta No. 10 de 2015 SEMPB – Sesión ordinaria (ejemplos de conceptos y requerimientos)","description":"INVIMA (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Estrategia y estructura de la respuesta técnica', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: la respuesta como última oportunidad antes de la decisión', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume los criterios de una respuesta eficaz (completa, trazable, coherente y oportuna) y el método de trabajo de la unidad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: presentar la lógica de una respuesta técnica eficaz a un auto del INVIMA y el recorrido de la unidad.</p><p>Desarrollo: el INVIMA, por regla general, formula un único requerimiento en cada trámite (Decreto 677 de 1995 para registros nuevos, normas farmacológicas e importados; Decreto 334 de 2022 para renovaciones y modificaciones). Por eso la respuesta es la última oportunidad de convencer al evaluador antes de la decisión de fondo: si queda un punto sin atender, el resultado probable es la negación. Una buena respuesta tiene cuatro rasgos: es completa (atiende cada punto del auto, sin omisiones), trazable (cada afirmación remite a un anexo identificado), coherente (los datos coinciden en todo el expediente) y oportuna (se radica dentro del plazo, con prórroga solicitada a tiempo si hace falta).</p><p>En esta unidad se trabaja el método en tres pasos: (1) diagnóstico del auto y plan de trabajo, con responsables internos, fabricante, casa matriz y laboratorios externos; (2) construcción de la matriz de respuesta punto por punto, que transcribe literalmente cada requerimiento y asocia la respuesta, la evidencia y la ubicación del anexo; y (3) soporte documental y justificación científica, apoyados en farmacopeas oficiales, guías del Ministerio de Salud (por ejemplo, las resoluciones de estabilidad y de bioequivalencia) y guías ICH u OMS cuando la norma colombiana remite a ellas.</p><p>Ejemplo aplicado: un auto de modificación de registro (cambio de fabricante del principio activo) pide perfiles de impurezas comparativos, estabilidad del producto con el nuevo IFA y la certificación de BPM del nuevo fabricante. La respuesta exitosa no se limita a adjuntar documentos: incluye una carta remisoria, la matriz que relaciona cada requerimiento con su anexo, un resumen técnico que explica por qué el cambio no afecta la calidad y una tabla de concordancia de datos.</p><p>Puntos clave:<br>1. La respuesta al auto es, en la práctica, la última oportunidad antes de la decisión de fondo.<br>2. Completa, trazable, coherente y oportuna: los cuatro criterios de calidad.<br>3. La matriz punto por punto es la columna vertebral de la respuesta.</p><p>Nota de actualización normativa (oct. 2026): el Decreto 1474 de 2023 modificó el art. 16 del Decreto 677 de 1995 y dio vigencia indefinida a los registros sanitarios de medicamentos (síntesis química, biológicos, homeopáticos y gases medicinales), incluidos los vigentes a esa fecha; el INVIMA archiva las solicitudes de renovación de estos productos. La renovación con radicación mínima de un mes antes del vencimiento (Decreto 334 de 2022, art. 4) se conserva como antecedente y aplica hoy a productos que mantienen vigencia temporal, como los fitoterapéuticos (Decreto 1156 de 2018, 10 años renovables). Lo que sigue exigiendo control continuo es la gestión del registro: modificaciones, notificación de no comercialización (30 días) y aviso de retiro definitivo (6 meses).</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Diagnóstico del auto y plan de trabajo con fabricante y casa matriz', 'Clase 2 · Planeación de la respuesta', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica un método para clasificar los requerimientos, asignar responsables y decidir a tiempo sobre la prórroga.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: diagnosticar un auto de requerimiento y convertirlo en un plan de trabajo con fechas, responsables y riesgos.</p><p>Desarrollo: al recibir la notificación del auto, el primer paso es registrar la fecha de notificación y calcular el vencimiento según la norma del trámite: un mes, prorrogable por un término igual si se pide antes de que venza, en renovaciones y modificaciones (Decreto 334 de 2022) y en general en peticiones incompletas (Ley 1755 de 2015, art. 17); 60 días hábiles en registros nuevos y de normas farmacológicas, y 40 días hábiles en importados, según el Decreto 677 de 1995. Verifique siempre el plazo que indica el propio auto. Luego se clasifica cada punto: legal, farmacéutico (calidad, estabilidad, métodos, especificaciones, etiquetas), farmacológico (eficacia, seguridad, inserto, información para prescribir) o de bioequivalencia. Para cada punto se define si la información ya existe en la compañía, si hay que pedirla al fabricante o a la casa matriz, o si hay que generarla (un nuevo análisis o un estudio).</p><p>El plan de trabajo incluye: cronograma inverso desde la fecha límite (reserve al menos una semana para revisión de calidad y radicación); responsables por punto; solicitudes formales al fabricante con fecha de entrega; un análisis de riesgos (puntos que no podrán cumplirse a tiempo) y la decisión temprana sobre la prórroga. Si un punto exige un estudio imposible de completar dentro del plazo, se evalúan alternativas: responder con datos parciales y un compromiso (solo si la norma lo admite), acotar la solicitud o desistir y volver a presentar después.</p><p>Ejemplo aplicado: auto notificado el 1 de octubre en una modificación de vida útil (Decreto 334). Vence el 1 de noviembre. El fabricante informa que el punto de estabilidad a 24 meses estará el 20 de noviembre. Antes del 1 de noviembre se radica la solicitud de prórroga (hasta un mes adicional), con una carta firmada por el titular que explica el motivo; con ella el nuevo vencimiento es el 1 de diciembre.</p><p>Puntos clave:<br>1. Calcule el vencimiento el mismo día de la notificación y regístrelo en un control de plazos.<br>2. Clasifique cada requerimiento por naturaleza y por origen de la información.<br>3. Decida sobre la prórroga con anticipación: después del vencimiento ya no se puede pedir.</p><p>Nota de actualización normativa (oct. 2026): el Decreto 1474 de 2023 modificó el art. 16 del Decreto 677 de 1995 y dio vigencia indefinida a los registros sanitarios de medicamentos (síntesis química, biológicos, homeopáticos y gases medicinales), incluidos los vigentes a esa fecha; el INVIMA archiva las solicitudes de renovación de estos productos. La renovación con radicación mínima de un mes antes del vencimiento (Decreto 334 de 2022, art. 4) se conserva como antecedente y aplica hoy a productos que mantienen vigencia temporal, como los fitoterapéuticos (Decreto 1156 de 2018, 10 años renovables). Lo que sigue exigiendo control continuo es la gestión del registro: modificaciones, notificación de no comercialización (30 días) y aviso de retiro definitivo (6 meses).</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'La matriz de respuesta punto por punto', 'Clase 2 · Planeación de la respuesta', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Construye una matriz que transcribe cada requerimiento y lo vincula con la respuesta, la evidencia y su ubicación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: construir una matriz de respuesta punto por punto que facilite la evaluación y evite omisiones.</p><p>Desarrollo: la matriz es una tabla que acompaña la carta de respuesta y organiza toda la información. Columnas recomendadas: (1) número del requerimiento, en el mismo orden del auto; (2) transcripción literal del requerimiento; (3) respuesta concreta y breve (qué se hizo, qué se corrige, qué se aclara); (4) evidencia de soporte (nombre del documento, versión, fecha); (5) ubicación en el expediente (anexo, folio o ruta del archivo digital); (6) observaciones (por ejemplo, documentos que reemplazan a otros ya radicados). Cuando un requerimiento tiene varias partes (\"allegar…, justificar… y ajustar…\"), se divide en subpuntos (3a, 3b, 3c) para que ninguna parte quede sin respuesta.</p><p>Reglas de redacción: responder en el orden del auto; usar el mismo vocabulario del evaluador; no discutir sin evidencia; declarar con claridad cuando un documento sustituye a uno anterior; y, si no se acoge una solicitud, justificarlo técnicamente con referencias. Evite las respuestas genéricas (\"se adjunta la información solicitada\"), que obligan al evaluador a buscar y aumentan el riesgo de negación.</p><p>Ejemplo aplicado: un auto de evaluación farmacéutica tiene cinco puntos: especificaciones del producto terminado, validación del método de valoración, estabilidad, material de envase y artes de etiqueta. La fila 2 de la matriz diría: \"Requerimiento 2: Allegar la validación del método analítico de valoración indicando tamaño de lote y datos de potencia. Respuesta: se allega el informe de validación VAL-045 v2 (linealidad, exactitud, precisión, especificidad, robustez), ejecutado con el lote piloto L-123 de 100.000 tabletas; se incluyen los datos de potencia del estándar de referencia. Evidencia: Anexo 2, folios 15-62\". La matriz se firma y se coloca al inicio de la respuesta, después de la carta remisoria.</p><p>Puntos clave:<br>1. Una fila por requerimiento (y subfila por cada parte) en el orden exacto del auto.<br>2. Cada respuesta remite a un anexo identificable: documento, versión y ubicación.<br>3. Nunca deje un punto sin respuesta; si no se acoge, justifique técnicamente.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Soporte documental: firmas, versiones, apostilla, traducción y concordancia', 'Clase 3 · Soporte documental y justificación científica', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Prepara anexos verificables y una tabla de concordancia que demuestre coherencia en todo el expediente.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: preparar el soporte documental de la respuesta con trazabilidad, vigencia y formalidades que el INVIMA exige.</p><p>Desarrollo: el soporte documental es la evidencia que convierte la respuesta en verificable. Requisitos prácticos: (1) documentos completos, legibles, firmados por la persona responsable (director técnico, jefe de control de calidad, responsable de aseguramiento) y con fecha; (2) control de versiones: si se sustituye un documento ya radicado, se identifica la versión nueva y se indica expresamente qué reemplaza; (3) documentos emitidos en el exterior con apostilla o legalización cuando la norma lo exige y traducción al español; (4) coherencia de datos entre formulario, certificados, especificaciones, etiquetas e inserto; (5) organización: carta remisoria, matriz punto por punto, anexos numerados y, en radicación electrónica, archivos con nombres descriptivos y en el formato aceptado por la plataforma.</p><p>Conviene también incluir una tabla de concordancia (nombre del producto, concentración, forma farmacéutica, fabricante, dirección, presentaciones comerciales, vida útil y condiciones de almacenamiento) que muestre que todos los documentos coinciden tras la corrección. Esto anticipa la verificación cruzada que hace el evaluador y reduce el riesgo de que una corrección introduzca una nueva inconsistencia.</p><p>Ejemplo aplicado: en una renovación (Decreto 334 de 2022) el auto requiere actualizar el certificado BPM del fabricante extranjero y ajustar las etiquetas a la vida útil aprobada. El soporte incluye: certificado BPM vigente apostillado y traducido; artes de etiqueta en versión nueva, con control de cambios que resalte la modificación; declaración del titular de que el resto de la información no cambia; y la tabla de concordancia. La carta remisoria cita el número de radicado y el número del auto.</p><p>Puntos clave:<br>1. Firmas, fechas y versiones: sin ellas el documento no es evidencia.<br>2. Apostilla y traducción oficial en documentos del exterior cuando la norma lo exija.<br>3. Use una tabla de concordancia para demostrar coherencia en todo el expediente.</p><p>Nota de actualización normativa (oct. 2026): el Decreto 1474 de 2023 modificó el art. 16 del Decreto 677 de 1995 y dio vigencia indefinida a los registros sanitarios de medicamentos (síntesis química, biológicos, homeopáticos y gases medicinales), incluidos los vigentes a esa fecha; el INVIMA archiva las solicitudes de renovación de estos productos. La renovación con radicación mínima de un mes antes del vencimiento (Decreto 334 de 2022, art. 4) se conserva como antecedente y aplica hoy a productos que mantienen vigencia temporal, como los fitoterapéuticos (Decreto 1156 de 2018, 10 años renovables). Lo que sigue exigiendo control continuo es la gestión del registro: modificaciones, notificación de no comercialización (30 días) y aviso de retiro definitivo (6 meses).</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Justificación científica: farmacopeas, guías del Ministerio de Salud e ICH/OMS', 'Clase 3 · Soporte documental y justificación científica', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Sustenta técnicamente las respuestas con las guías colombianas de estabilidad y bioequivalencia y las referencias que estas adoptan.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_3157_2018.htm","title":"[Página web] Resolución 3157 de 2018 – Guía para estudios de estabilidad de medicamentos de síntesis química","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/resolucion-1124-2016-guia-biodisponibilidad-bioequivalencia","title":"[Página web] Resolución 1124 de 2016: Guía para estudios de Biodisponibilidad y Bioequivalencia de medicamentos","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: redactar la respuesta a un auto de evaluación farmacéutica', 'Clase 3 · Soporte documental y justificación científica', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta paso a paso la respuesta completa a un auto con cuatro requerimientos de calidad y etiquetado.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: redactar, paso a paso, la respuesta a un auto de evaluación farmacéutica de un registro sanitario nuevo.</p><p>Desarrollo (caso): un laboratorio nacional radica la solicitud de registro sanitario de un medicamento incluido en normas farmacológicas (tabletas de 500 mg). El INVIMA notifica un auto con cuatro requerimientos: (1) allegar especificaciones del producto terminado que incluyan disolución y sustancias relacionadas con límites justificados según farmacopea oficial; (2) presentar la validación del método de cuantificación por HPLC; (3) completar el estudio de estabilidad de largo plazo en condiciones de zona climática IVb (30 °C/75 % HR) conforme a la Resolución 3157 de 2018; (4) ajustar las etiquetas para incluir la condición de venta y el número de lote. Plazo: 60 días hábiles desde la notificación, según el art. 25 del Decreto 677 de 1995 (verificar el plazo indicado en el auto).</p><p>Paso 1, plan: control de plazos con la fecha límite; responsables por punto (control de calidad para los puntos 1 y 2, desarrollo para el 3, mercadeo y diseño para el 4); revisión jurídica de la carta. Paso 2, matriz: transcribir cada requerimiento y dividir el 1 en 1a (disolución) y 1b (sustancias relacionadas). Paso 3, evidencia: especificaciones versión 2 con referencia a la monografía de la farmacopea; informe de validación con todos los parámetros; protocolo e informe de estabilidad con los tres lotes, tiempos 0, 3, 6, 9 y 12 meses y propuesta de vida útil coherente con los datos; nuevos artes de etiqueta. Paso 4, justificación: si se propone una vida útil de 24 meses con 12 meses de datos, justificar con la extrapolación que permita la guía y con un compromiso de continuar el estudio. Paso 5, carta remisoria: referencia al radicado y al auto, listado de anexos y firma del representante o apoderado. Paso 6, control final: verificar que todos los datos coincidan y radicar antes del vencimiento, conservando el soporte de radicación.</p><p>Resultado esperado: una respuesta autosuficiente en la que el evaluador encuentra cada evidencia en menos de un minuto.</p><p>Puntos clave:<br>1. Plan, matriz, evidencia, justificación, carta y control final: seis pasos reproducibles.<br>2. La propuesta de vida útil debe ser coherente con los datos y con la guía de estabilidad aplicable.<br>3. Conserve el número y la fecha de radicación de la respuesta como prueba de oportunidad.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Requerimientos frecuentes por tema técnico', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: dónde se concentran los requerimientos del INVIMA', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume los temas técnicos que generan más requerimientos: estabilidad, especificaciones, métodos, bioequivalencia e insertos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.freyrsolutions.com/es/blog/freyr-3d-series-esenciales-latam-registro-sanitario-de-medicamentos-en-colombia-claves-para-obtener-tu-aprobacion-ante-invima","title":"[Página web] Registro sanitario de medicamentos en Colombia: claves para obtener tu aprobación ante INVIMA","description":"Freyr Solutions (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://consultorsalud.com/?p=282915","title":"[Página web] Invima anuncia el procedimiento de evaluación farmacéutica de registros sanitarios nuevos con visita (Circular DG 100-0003-2024)","description":"ConsultorSalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Estabilidad: zona climática IVb, lotes, tiempos y vida útil', 'Clase 2 · Requerimientos de calidad', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los requisitos de las guías de estabilidad (síntesis química y biológicos) y responde requerimientos sobre vida útil.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_3157_2018.htm","title":"[Página web] Resolución 3157 de 2018 – Guía para estudios de estabilidad de medicamentos de síntesis química","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_3690_2016.htm","title":"[Página web] Resolución 3690 de 2016 – Guía de Estabilidad de Medicamentos Biológicos","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Especificaciones y métodos analíticos: justificación de límites y validación', 'Clase 2 · Requerimientos de calidad', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Responde requerimientos sobre especificaciones del IFA y del producto terminado y sobre la validación de métodos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: responder requerimientos sobre especificaciones de calidad y métodos analíticos del principio activo y del producto terminado.</p><p>Desarrollo: los requerimientos de especificaciones suelen apuntar a: pruebas faltantes (disolución, uniformidad de unidades de dosificación, sustancias relacionadas, contenido de agua, pruebas microbiológicas); límites sin justificación o más laxos que la farmacopea; diferencias entre las especificaciones de liberación y las de estabilidad sin explicación; y especificaciones del principio activo que no cubren impurezas propias de la ruta de síntesis del fabricante. Los requerimientos de métodos piden la referencia farmacopeica vigente o, para métodos propios, la validación completa: especificidad (incluida la demostración de que el método indica estabilidad), linealidad, exactitud, precisión (repetibilidad e intermedia), límites de detección y cuantificación para impurezas, rango y robustez. Si se adopta un método farmacopeico, no se exige validación completa, pero sí la verificación de su idoneidad en las condiciones del laboratorio.</p><p>Estrategia de respuesta: (1) presentar la tabla de especificaciones actualizada con columnas de prueba, método, límite y justificación (farmacopea, datos de lotes, guía aplicable); (2) adjuntar certificados de análisis de lotes que demuestren que los límites se cumplen; (3) para cada método propio, anexar el protocolo y el informe de validación firmados; (4) explicar cualquier diferencia entre el método del fabricante del IFA y el del fabricante del producto terminado; (5) asegurar que las especificaciones del producto terminado sean las mismas en el expediente, en el estudio de estabilidad y en la documentación de calidad.</p><p>Ejemplo aplicado: en una solicitud de registro de una suspensión oral, el auto observa que no se incluyó el recuento microbiano ni la valoración del conservante y que el método de valoración no está validado. La respuesta incluye especificaciones versión 2 con límites microbiológicos según farmacopea y un ensayo de contenido del conservante, informe de validación del método HPLC con demostración de especificidad frente a productos de degradación forzada y certificados de tres lotes.</p><p>Puntos clave:<br>1. Cada límite de especificación requiere una justificación (farmacopea, datos de lotes o guía).<br>2. Los métodos propios necesitan validación completa; los farmacopeicos, verificación de idoneidad.<br>3. Mantenga las mismas especificaciones en el expediente, en la estabilidad y en los certificados de análisis.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Bioequivalencia: listado de moléculas, producto de referencia y formato de presentación', 'Clase 3 · Requerimientos de bioequivalencia e información al usuario', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Identifica cuándo se exige bioequivalencia y cómo responder requerimientos sobre el estudio, el comparador y la bioexención.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/resolucion-1124-2016-guia-biodisponibilidad-bioequivalencia","title":"[Página web] Resolución 1124 de 2016: Guía para estudios de Biodisponibilidad y Bioequivalencia de medicamentos","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/bioequivalencia","title":"[Página web] Bioequivalencia – Medicamentos y Productos Biológicos (normas, formatos ASS-RSA, listados de moléculas)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_bioequivalencia/Circular_20100-0418-17-Indicaciones-sobre-la-resolucion-1124-de-2016.pdf","title":"Circular 100-0418-17 – Indicaciones sobre la Resolución 1124 de 2016","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Insertos e información para prescribir: ajustes solicitados por la Sala', 'Clase 3 · Requerimientos de bioequivalencia e información al usuario', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los requerimientos sobre inserto e información para prescribir y cómo presentar las versiones ajustadas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_bioequivalencia/Acta_20No._2010_20de_202015_20SEMPB.pdf","title":"Acta No. 10 de 2015 SEMPB – Sesión ordinaria (ejemplos de conceptos y requerimientos)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: auto combinado de estabilidad y bioequivalencia en un genérico', 'Clase 3 · Requerimientos de bioequivalencia e información al usuario', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Diseña la estrategia de respuesta a un auto con requerimientos críticos y decide entre responder, acotar o desistir.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: resolver de forma integrada un auto que combina requerimientos de estabilidad y de bioequivalencia en un medicamento genérico.</p><p>Desarrollo (caso): un titular solicita registro sanitario para un genérico en tabletas de liberación inmediata cuyo principio activo figura en el listado del INVIMA de moléculas con exigencia de estudios de bioequivalencia. El auto requiere: (1) estudio de estabilidad de largo plazo de tres lotes en condiciones de zona IVb, con al menos los tiempos que exige la Resolución 3157 de 2018, y la justificación de la vida útil propuesta de 36 meses; (2) estudio de bioequivalencia frente al producto de referencia definido por el INVIMA, realizado en un centro certificado o aceptado, conforme a la Resolución 1124 de 2016; (3) perfiles de disolución comparativos de las concentraciones no estudiadas in vivo, si se solicita bioexención de concentraciones adicionales.</p><p>Análisis: el punto 2 es crítico; si el estudio no existe, no puede generarse dentro del plazo del auto. Opciones: (a) si existe un estudio de la casa matriz con el producto de referencia aceptado en Colombia, presentarlo con el formato del INVIMA para estudios de biodisponibilidad y bioequivalencia, el informe completo y la validación bioanalítica; (b) si el producto de referencia usado no es el aceptado, justificar la equivalencia del comparador con información sobre su origen, o asumir que la respuesta será insuficiente; (c) si no hay estudio, evaluar el desistimiento y volver a presentar la solicitud cuando se disponga de él, lo que evita una negación en el historial del producto.</p><p>Respuesta tipo para el punto 1: si solo hay 24 meses de datos, ajustar la vida útil a 24 meses y presentar el compromiso de continuar el estudio; una vez completados los 36 meses, solicitar la ampliación de vida útil como modificación (Decreto 334 de 2022). Para el punto 3: perfiles en tres medios de pH, con el factor f2 calculado o la justificación de disolución muy rápida.</p><p>Puntos clave:<br>1. Identifique primero el punto que no se puede cumplir en el plazo: define la estrategia completa.<br>2. Ajustar la solicitud (vida útil, concentraciones) suele ser mejor que defender lo que no está soportado.<br>3. Desistir antes de una negación puede ser una decisión regulatoria válida.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Notificación, radicación, negaciones y recursos', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: de la notificación a la firmeza del acto', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume la fase final del trámite: notificación, radicación de la respuesta, decisión y medios de defensa.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: presentar la fase final del procedimiento (notificación, radicación de la respuesta, decisión y medios de defensa) y el recorrido de la unidad.</p><p>Desarrollo: un trámite ante el INVIMA es un procedimiento administrativo regido por las normas sanitarias especiales (Decreto 677 de 1995, Decreto 334 de 2022) y, de forma supletoria, por el CPACA (Ley 1437 de 2011) y la Ley 1755 de 2015. En esta unidad se estudia: cómo se notifican los autos y las resoluciones (personal, por aviso o por medios electrónicos cuando el interesado lo ha aceptado, según el art. 56 del CPACA modificado por la Ley 2080 de 2021); cómo radicar la respuesta y seguir el trámite en las herramientas en línea del INVIMA; qué ocurre si no hay respuesta (desistimiento tácito o declaratoria de abandono, contra la que solo procede reposición); y qué hacer si la decisión es negativa: recurso de reposición y, cuando procede, apelación, dentro de los diez días hábiles siguientes a la notificación (art. 76 del CPACA); o, de forma excepcional, revocatoria directa (arts. 93 a 97).</p><p>Distinguir el tipo de acto es esencial: contra los autos de trámite (como el auto de requerimiento) no proceden recursos, porque no deciden de fondo. Los recursos proceden contra actos definitivos (resolución que niega, que declara el desistimiento o abandono) y el propio acto debe indicar cuáles proceden, ante quién y en qué plazo. Leer con cuidado la parte resolutiva evita perder oportunidades de defensa.</p><p>Ejemplo aplicado: una resolución que niega una modificación por falta de soporte de estabilidad se notifica electrónicamente el día 3. El titular dispone de diez días hábiles para presentar recurso de reposición con nuevos argumentos y pruebas; si no lo hace, el acto queda en firme y solo podrá presentar una nueva solicitud.</p><p>Puntos clave:<br>1. Identifique la fecha y el medio de notificación: desde allí corren los plazos.<br>2. El auto de requerimiento no admite recursos; las resoluciones definitivas sí.<br>3. Reposición y apelación: diez días hábiles desde la notificación; revisar siempre lo que indica el acto.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Notificación de autos y resoluciones: personal, por aviso y electrónica', 'Clase 2 · Notificación y radicación', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las formas de notificación, la autorización de notificación electrónica y su efecto en el cómputo de plazos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/atencion-al-ciudadano/preguntas-frecuentes","title":"[Página web] Preguntas frecuentes INVIMA (prórroga de respuesta a auto, notificación, consulta de estado de trámite)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://lector.ramajudicial.gov.co/SIBD/VIDEOTECA/Publicaciones/00000000/51188/Anexos/CPACA%20Ley%201437%20Actualizada%202019.pdf","title":"CPACA – Ley 1437 de 2011 actualizada (2019)","description":"Rama Judicial (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Radicación de la respuesta y seguimiento del trámite en línea', 'Clase 2 · Notificación y radicación', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica el procedimiento para radicar la respuesta al auto y consultar el estado del trámite en las herramientas del INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=Qx-uC-Zgt44","provider":"youtube","videoId":"Qx-uC-Zgt44","title":"Capacitación - Trámite de Registro Sanitario de Medicamentos (segunda sesión)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/tramites-y-servicios/oficina-virtual","title":"[Página web] Oficina Virtual – Trámites y Servicios INVIMA","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://consultorsalud.com/invima-agiliza-oficina-virtual-tramites/","title":"[Página web] Invima agiliza revisión de trámites desde su plataforma","description":"ConsultorSalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Recursos de reposición y apelación: procedencia, plazo y contenido', 'Clase 3 · Negaciones y medios de defensa', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Comprende cuándo proceden los recursos, el plazo de diez días hábiles y los requisitos de un recurso bien sustentado.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=Q9UrkYC1ONk","provider":"youtube","videoId":"Q9UrkYC1ONk","title":"RECURSOS / reposición / apelación / Código de Procedimiento Administrativo / Leyes 1437 y 2080","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=gHsgQBPMu5M","provider":"youtube","videoId":"gHsgQBPMu5M","title":"¿Qué actos se pueden recurrir mediante recurso de reposición?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.gerencie.com/recursos-que-proceden-contra-los-actos-administrativos.html","title":"[Página web] Recursos contra los actos administrativos: reposición, apelación y queja","description":"Gerencie.com (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Revocatoria directa y alternativas: nueva solicitud o desistimiento', 'Clase 3 · Negaciones y medios de defensa', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara la revocatoria directa con los recursos y con la presentación de una nueva solicitud.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.gerencie.com/causales-de-revocatoria-directa-de-los-actos-administrativos.html","title":"[Página web] Revocatoria directa de los actos administrativos: causales, término y modelo","description":"Gerencie.com (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/concepto_invima_2058982_2018.htm","title":"[Página web] Concepto INVIMA 2058982 de 2018 – Trámites en curso, requerimiento, negación y abandono","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/concepto_invima_0001260_2020.htm","title":"[Página web] Concepto INVIMA 1260 de 2020 – Desistimiento de solicitudes de registro sanitario","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: recurso de reposición contra una negación por bioequivalencia', 'Clase 4 · Casos integradores', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta el análisis de viabilidad y redacta un recurso de reposición con argumentos y pruebas pertinentes.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: preparar un recurso de reposición contra una resolución del INVIMA que niega un registro sanitario por deficiencias en el estudio de bioequivalencia.</p><p>Desarrollo (caso): el INVIMA niega el registro de un genérico porque, según el concepto técnico, el estudio de bioequivalencia no demostró que el intervalo de confianza del 90 % de la Cmax estuviera dentro de los límites de aceptación y porque el producto de referencia utilizado no era el definido para Colombia. La resolución se notifica por medio electrónico el 6 de octubre y señala que procede el recurso de reposición dentro de los diez días hábiles siguientes.</p><p>Paso 1, análisis de viabilidad: revisar si la negación se basa en un error de lectura (por ejemplo, el evaluador tomó un análisis preliminar y no el definitivo, o el intervalo calculado es otro en el informe final) o en una deficiencia real. Si la deficiencia es real (el estudio falló), el recurso tiene pocas probabilidades y conviene preparar una nueva solicitud con un nuevo estudio. Paso 2, argumentos: si hubo error, señalar con precisión el folio del informe con los resultados correctos; si el comparador fue cuestionado, demostrar con documentos (factura, certificado de origen, lote, fabricante) que corresponde al producto de referencia aceptado o a uno equivalente según los criterios de la Resolución 1124 de 2016. Paso 3, pruebas: el recurso puede acompañarse de pruebas que soporten los argumentos (art. 77 del CPACA); deben ser pertinentes y no reemplazar información que debió presentarse en la solicitud. Paso 4, forma: escrito dirigido al funcionario que expidió el acto, con identificación del recurrente o apoderado, número de la resolución y del expediente, fundamentos de hecho y de derecho, solicitud concreta (revocar la resolución y conceder el registro) y anexos. Paso 5, radicación: dentro de los diez días hábiles; verificar la fecha final contando solo días hábiles.</p><p>Puntos clave:<br>1. Un recurso prospera cuando demuestra un error del acto, no cuando intenta completar un expediente deficiente.<br>2. El plazo de diez días hábiles es perentorio: calcúlelo desde la notificación.<br>3. Si la deficiencia es real, una nueva solicitud bien soportada suele ser la mejor vía.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: desistimiento en una modificación (Decreto 334) y plan de recuperación', 'Clase 4 · Casos integradores', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Analiza las consecuencias del desistimiento y diseña acciones de recuperación y prevención.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: analizar las consecuencias de no responder a tiempo un requerimiento en una modificación de registro sanitario y diseñar la estrategia de recuperación.</p><p>Desarrollo (caso): un titular solicitó la modificación de su registro para incluir un nuevo fabricante del principio activo. El INVIMA notificó un auto de requerimiento conforme al Decreto 334 de 2022, que concede un mes para allegar la información y permite una prórroga por un término igual solo si se pide antes del vencimiento. El área regulatoria no registró la fecha de notificación electrónica, el plazo venció y el INVIMA declaró el desistimiento de la solicitud mediante acto motivado.</p><p>Consecuencias: el trámite se archiva; la tarifa pagada no se devuelve (según los conceptos jurídicos del INVIMA sobre desistimiento); el registro sigue vigente en sus condiciones aprobadas, pero el nuevo fabricante no está autorizado, por lo que no se puede usar ese principio activo. Contra el acto que declara el desistimiento procede únicamente el recurso de reposición (Ley 1755 de 2015, art. 17), útil solo si se demuestra que el plazo no había vencido (por ejemplo, error en el cómputo o en la notificación) o que la respuesta sí se radicó a tiempo.</p><p>Estrategia de recuperación: (1) verificar la fecha y el medio de notificación y el cómputo del plazo; si hay error, interponer reposición dentro de los diez días hábiles con la prueba correspondiente; (2) si el desistimiento es correcto, presentar una nueva solicitud de modificación con la información completa desde el inicio, incluidos los puntos que el auto había pedido; (3) revisar el impacto en el abastecimiento y planear con producción; (4) corregir la causa raíz: buzón institucional para notificaciones, control de plazos con alertas, responsable suplente y política de pedir la prórroga de forma preventiva cuando la información dependa de terceros.</p><p>Puntos clave:<br>1. El desistimiento archiva el trámite y no devuelve la tarifa; el registro conserva sus condiciones aprobadas.<br>2. Contra el acto de desistimiento solo procede reposición: úsela solo si hay error demostrable.<br>3. Las notificaciones electrónicas exigen un buzón vigilado y un control de plazos con alertas.</p>"}'::jsonb);

END
$curso$;

-- ─── 7. Curso de Etiquetado e Insertos de Medicamentos (33 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Etiquetado e Insertos de Medicamentos' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Etiquetado e Insertos de Medicamentos', 'Curso práctico sobre los requisitos de rotulado de envases primarios y secundarios, insertos e información para prescribir (IPP) de medicamentos en Colombia, según el Decreto 677 de 1995, la Resolución 243710 de 1999, el Decreto 334 de 2022 y los lineamientos vigentes del INVIMA.', '<p>Curso práctico sobre los requisitos de rotulado de envases primarios y secundarios, insertos e información para prescribir (IPP) de medicamentos en Colombia, según el Decreto 677 de 1995, la Resolución 243710 de 1999, el Decreto 334 de 2022 y los lineamientos vigentes del INVIMA. Incluye regímenes especiales, reetiquetado de importados, prevención de errores de medicación (LASA) y gestión de artes con control de cambios.</p><h3>Objetivo general</h3><p>Que el químico farmacéutico sea capaz de elaborar, revisar y gestionar ante el INVIMA las etiquetas, los empaques, los insertos y la IPP de medicamentos conforme a la normativa colombiana vigente y a criterios de seguridad del paciente.</p><h3>A quién va dirigido</h3><p>Químicos farmacéuticos y profesionales de asuntos regulatorios, aseguramiento de calidad, mercadeo farmacéutico y diseño de material de empaque de laboratorios, importadores y titulares de registros sanitarios en Colombia.</p><h3>Contexto normativo</h3><p>Colombia — normativa INVIMA / MinSalud</p>',
          'Asuntos regulatorios', 'intermedio', 'Que el químico farmacéutico sea capaz de elaborar, revisar y gestionar ante el INVIMA las etiquetas, los empaques, los insertos y la IPP de medicamentos conforme a la normativa colombiana vigente y a criterios de seguridad del paciente.', 'Químicos farmacéuticos y profesionales de asuntos regulatorios, aseguramiento de calidad, mercadeo farmacéutico y diseño de material de empaque de laboratorios, importadores y titulares de registros sanitarios en Colombia.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Fundamentos y marco normativo del etiquetado de medicamentos en Colombia', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: el etiquetado como parte del registro sanitario', 'Clase 1 · Introducción al curso', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Comprende el alcance del curso y por qué etiquetas, empaques, insertos e IPP son parte integral del medicamento aprobado por el INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=3NBzha9wYas","provider":"youtube","videoId":"3NBzha9wYas","title":"Etiquetas de los medicamentos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/compilacion/docs/concepto_invima_2044669_2019.htm","title":"[Página web] Concepto INVIMA 2044669 de 2019 – Leyenda ''USO INSTITUCIONAL'' y aprobación de etiquetas","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Decreto 677 de 1995: envases y etiquetas (arts. 70-74) y su vigencia', 'Clase 2 · Marco normativo de envases, etiquetas y rótulos', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los requisitos de envases y etiquetas del Decreto 677 e identifica qué disposiciones siguen vigentes y cuáles fueron derogadas (art. 73 y literal l del art. 72).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.saludcapital.gov.co:443/Normo/jur/decreto_677_de_1995.pdf","title":"Decreto 677 de 1995 (texto completo)","description":"Secretaría Distrital de Salud de Bogotá (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/compilacion/docs/concepto_invima_2022775_2018.htm","title":"[Página web] Concepto INVIMA 2022775 de 2018 – Etiquetado tras la derogatoria del art. 73 del Decreto 677/1995 (arts. 72 y 74)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://minsalud.gov.co/Normatividad_Nuevo/DECRETO 0677 DE 1995.pdf","title":"Decreto 0677 de 1995 (Ministerio de Salud)","description":"MinSalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Resolución INVIMA 243710 de 1999: bocetos, artes finales, stickers y agotamiento', 'Clase 2 · Marco normativo de envases, etiquetas y rótulos', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las reglas para presentar artes, modificar etiquetas, usar stickers y solicitar el agotamiento de existencias.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/resolucion_invima_ri243710.htm","title":"[Página web] Resolución INVIMA 243710 de 1999 – Etiquetas, empaques, stickers y agotamiento de existencias","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/preview/127346","title":"Resolución No. 243710 de 1999 (documento INVIMA)","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Decreto 334 de 2022: clasificación de las modificaciones de etiquetado', 'Clase 2 · Marco normativo de envases, etiquetas y rótulos', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los cuatro tipos de cambio de etiquetado (administrativos, de información, urgentes por seguridad y de seguridad y eficacia) con sus procedimientos y plazos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=itqYKOk_Z80","provider":"youtube","videoId":"itqYKOk_Z80","title":"Guías para el Decreto 334 de 2022","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_0334_2022.htm","title":"[Página web] Decreto 334 de 2022 – Renovación, modificación, información y publicidad de medicamentos","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://consultorsalud.com/renovacion-auto-registro-sanitario-d334","title":"[Página web] Cambia el registro sanitario de medicamentos en Colombia y la forma de publicitarlos – Decreto 334 de 2022","description":"ConsultorSalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Envase primario vs. empaque secundario: qué información va en cada uno', 'Clase 3 · Contenido mínimo de las etiquetas', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Diferencia el envase primario del secundario y define la información mínima de cada uno según su tamaño y su función.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: diferenciar el envase primario del empaque secundario y saber qué información debe ir en cada uno según la normativa colombiana y la práctica regulatoria del INVIMA.</p><p>Desarrollo: El envase primario es el que está en contacto directo con el medicamento: blíster, frasco, ampolla, vial, tubo, sachet o jeringa prellenada. El empaque secundario (plegadiza, caja) contiene uno o varios envases primarios y, junto con el inserto, completa la presentación comercial. El Decreto 677 de 1995 trata los envases como parte del medicamento: el INVIMA aprueba los envases, se prohíbe dispensar en un envase distinto al aprobado (art. 70, citado en el Concepto INVIMA 2044669 de 2019) y el contenido de las etiquetas requiere aprobación previa (art. 72).</p><p>En la práctica, el empaque secundario lleva la información completa del art. 72: nombre del producto y denominación genérica, composición por unidad posológica, forma farmacéutica, vía de administración, contenido, fabricante (y titular o importador), número de registro sanitario, lote, fecha de vencimiento, condiciones de almacenamiento, condición de venta y leyendas obligatorias como \"Manténgase fuera del alcance de los niños\". El envase primario, por su tamaño, suele llevar un contenido reducido, pero nunca puede omitir los datos que permiten identificar y usar el producto con seguridad: nombre y concentración, vía, lote y vencimiento. Cuando el producto no tiene empaque secundario (por ejemplo, un frasco vendido solo), la etiqueta del envase primario debe llevar toda la información exigida. En ampollas y viales pequeños, el criterio de seguridad manda: concentración claramente expresada (por ejemplo, mg/mL y total por envase) y vía de administración destacada.</p><p>Ejemplo aplicado a un trámite INVIMA: un laboratorio solicita el registro sanitario de una amoxicilina 500 mg cápsulas en caja x 30 con blíster. Con la solicitud radica los artes de la caja y del blíster (Resolución 243710 de 1999, art. 1). El revisor regulatorio verifica que el blíster muestre en cada alveolo o en cada tira el nombre, la concentración, el lote y el vencimiento (troquelado o impreso en línea), y que la caja contenga todos los datos del art. 72 y la leyenda de venta bajo fórmula médica. Si el INVIMA hace observaciones, el titular tiene 30 días desde la notificación para enviar la etiqueta o el empaque corregido.</p><p>Puntos clave:<br>1. Envase primario y empaque secundario forman parte del medicamento: solo pueden usarse los aprobados por el INVIMA.<br>2. El empaque secundario concentra la información completa; el primario debe conservar como mínimo la identificación, la concentración, el lote y el vencimiento.<br>3. Los datos variables (lote y vencimiento) se planifican desde el diseño del arte: dejar el área libre para codificación es parte de la aprobación.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Datos y leyendas obligatorias del art. 72 del Decreto 677', 'Clase 3 · Contenido mínimo de las etiquetas', 5, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los datos obligatorios de la etiqueta (nombre, composición, registro sanitario, lote, vencimiento, almacenamiento y condición de venta) y la leyenda ''Manténgase fuera del alcance de los niños''.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=0pk37IQGGAM","provider":"youtube","videoId":"0pk37IQGGAM","title":"[Resumen] NOM-072-SSA1-2012 sobre etiquetado de medicamentos (Puntos clave)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/compilacion/docs/concepto_invima_2022775_2018.htm","title":"[Página web] Concepto INVIMA 2022775 de 2018 – Etiquetado tras la derogatoria del art. 73 del Decreto 677/1995 (arts. 72 y 74)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: revisión del arte de una caja para un nuevo registro sanitario', 'Clase 3 · Contenido mínimo de las etiquetas', 6, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica el checklist normativo a un arte de caja y blíster para una solicitud de registro ante el INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=9UmN6KOGRPM","provider":"youtube","videoId":"9UmN6KOGRPM","title":"Vigilancia y dictamen sanitario en materia de etiquetado de productos terminados, medicamentos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/compilacion/docs/resolucion_invima_ri243710.htm","title":"[Página web] Resolución INVIMA 243710 de 1999 – Etiquetas, empaques, stickers y agotamiento de existencias","description":"Normograma INVIMA (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Leyendas obligatorias y regímenes especiales de etiquetado', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción: cómo cambia el arte según la condición de venta, el destino, la naturaleza y el origen', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume las variables que modifican el contenido de la etiqueta y los errores frecuentes por normas derogadas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: presentar la unidad sobre leyendas obligatorias y regímenes especiales de etiquetado, y explicar por qué un mismo arte cambia según la categoría del producto.</p><p>Desarrollo: Más allá del contenido mínimo del artículo 72 del Decreto 677 de 1995, el etiquetado de un medicamento en Colombia depende de cuatro variables: su condición de venta (venta libre o bajo fórmula médica), su destino (comercial, institucional o muestra médica), su naturaleza (síntesis química, biológico o fitoterapéutico) y su origen (fabricación nacional o importado). Cada variable añade o restringe información. Por ejemplo, un producto de venta bajo fórmula no puede mostrar indicaciones en la etiqueta, pero sí la posología, las advertencias y las contraindicaciones (Concepto INVIMA 2022775 de 2018). Un producto de uso institucional debe llevar una leyenda que indique esa condición sin tapar información aprobada (Concepto 863 de 2020). Un fitoterapéutico tradicional debe usar la fórmula \"este producto tradicionalmente ha sido utilizado para...\" (Decreto 2266 de 2004, art. 45).</p><p>En esta unidad también se corrige un error frecuente. Muchos manuales internos siguen exigiendo la franja violeta y las leyendas de control especial \"por el art. 73 del Decreto 677\". Según el INVIMA, ese artículo fue derogado expresamente por el Decreto 843 de 2016, al igual que el literal l) del art. 72 (franja verde de esenciales). La identificación de los medicamentos de control especial debe revisarse a la luz de la Resolución 1478 de 2006, que define la franja violeta como su característica identificatoria, y de la Resolución 315 de 2020, que actualiza los listados, siempre confirmando con el INVIMA y el Fondo Nacional de Estupefacientes antes de modificar artes.</p><p>Ejemplo aplicado a un trámite INVIMA: un titular importa un analgésico de venta libre y quiere comercializar también una presentación de uso institucional para una EPS. Necesita dos artes: el comercial, con la condición de venta libre, la posología y las indicaciones permitidas, y el institucional, con la leyenda de exclusividad. Si el producto es importado y conserva la etiqueta del país de origen, debe incluir en español el importador, la composición, las condiciones de almacenamiento y el registro sanitario (art. 74), por ejemplo mediante un sticker aprobado.</p><p>Puntos clave:<br>1. El arte se construye a partir de la condición de venta, el destino, la naturaleza del producto y su origen.<br>2. Antes de aplicar una leyenda \"de memoria\", verifique su vigencia: hay artículos del Decreto 677 derogados.<br>3. Cada variante de destino (comercial, institucional o muestra médica) es un arte distinto que debe estar amparado por el registro sanitario.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, '''Venta bajo fórmula médica'' vs. venta libre y uso institucional', 'Clase 2 · Leyendas según la condición de venta y el destino', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la condición de venta en la etiqueta, la prohibición de indicaciones en productos bajo fórmula y la leyenda obligatoria de uso institucional.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/concepto_invima_0000863_2020.htm","title":"[Página web] Concepto INVIMA 863 de 2020 – Medicamentos de uso institucional: etiquetas y leyenda","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/compilacion/docs/concepto_invima_2044669_2019.htm","title":"[Página web] Concepto INVIMA 2044669 de 2019 – Leyenda ''USO INSTITUCIONAL'' y aprobación de etiquetas","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/compilacion/docs/concepto_invima_2022775_2018.htm","title":"[Página web] Concepto INVIMA 2022775 de 2018 – Etiquetado tras la derogatoria del art. 73 del Decreto 677/1995 (arts. 72 y 74)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Muestra médica y nombre genérico en la etiqueta', 'Clase 2 · Leyendas según la condición de venta y el destino', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Identifica los requisitos del arte de muestra médica y la obligación vigente del nombre genérico junto a la marca.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: identificar los requisitos de la leyenda de muestra médica y del nombre genérico en las etiquetas, y verificar su vigencia.</p><p>Desarrollo: Muestra médica. Las muestras médicas son presentaciones que el titular entrega gratuitamente a los profesionales de la salud. El Decreto 677 de 1995 (art. 72) exige que su etiqueta las identifique como muestra médica y prohíba su venta. La redacción habitual es \"Muestra médica – Prohibida su venta\"; confirme la redacción exacta en el texto vigente del decreto y en la resolución de su registro. Por eso la muestra médica tiene un arte propio, distinto del comercial. El instructivo INVIMA ACOM-INS80 de 2026 indica que basta un diseño de envase y empaque para la presentación comercial y uno para la muestra médica de cada producto. Además, la Resolución 1478 de 2006 prohíbe distribuir muestras de medicamentos con franja violeta (control especial).</p><p>Nombre genérico. El parágrafo 5 del artículo 72 exige que los medicamentos comercializados con nombre de marca muestren también su nombre genérico y que, cuando se trate de medicamentos esenciales, este tenga el mismo tamaño que la marca. El Concepto INVIMA 27 de 2025 confirmó que esta obligación sigue vigente pese a la desaparición del POS. El concepto de medicamento esencial se interpreta hoy con referencia a la Resolución 2366 de 2023 sobre tecnologías financiadas con la UPC. En cambio, el literal l) del mismo artículo, que exigía una franja verde para los esenciales, fue derogado por el Decreto 843 de 2016.</p><p>Ejemplo aplicado a un trámite INVIMA: un titular solicita modificar el registro de su metformina 850 mg para incluir una presentación de muestra médica x 10 tabletas. Radica el arte comercial vigente como referencia y el nuevo arte de muestra médica con la leyenda correspondiente y el mismo contenido técnico. Como la metformina está financiada con la UPC, verifica que el nombre genérico tenga el mismo tamaño que la marca en ambos artes.</p><p>Puntos clave:<br>1. La muestra médica es una presentación con arte propio y leyenda que prohíbe su venta.<br>2. El nombre genérico es obligatorio junto a la marca y, para los medicamentos esenciales, debe tener el mismo tamaño (vigente según el Concepto 27 de 2025).<br>3. No exija la franja verde de esenciales: ese literal está derogado.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Medicamentos de control especial: franja violeta y situación normativa actual', 'Clase 3 · Control especial y venta libre (OTC)', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Analiza la identificación de los medicamentos de control especial tras la derogatoria del art. 73 del Decreto 677 y el marco de las Resoluciones 1478/2006 y 315/2020.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=WSdhFKW00GI","provider":"youtube","videoId":"WSdhFKW00GI","title":"Medicamentos de control especial y venta libre","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_1478_2006.htm","title":"[Página web] Resolución 1478 de 2006 – Sustancias sometidas a fiscalización y medicamentos de control especial","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/compilacion/docs/concepto_invima_2022775_2018.htm","title":"[Página web] Concepto INVIMA 2022775 de 2018 – Etiquetado tras la derogatoria del art. 73 del Decreto 677/1995 (arts. 72 y 74)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Medicamentos de venta libre: criterios de clasificación y etiqueta orientada al usuario', 'Clase 3 · Control especial y venta libre (OTC)', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Comprende los criterios de la Resolución 886 de 2004 y cómo la etiqueta OTC debe permitir el autocuidado seguro.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=qzVy725Hm58","provider":"youtube","videoId":"qzVy725Hm58","title":"Siguiendo la etiqueta de información de los medicamentos para el dolor sin receta (OTC)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://invima.gov.co/biblioteca/resolucion-00886-2004-clasificacion-medicamentos-venta-libre","title":"[Página web] Resolución 00886 de 2004: Criterios para la clasificación de medicamentos de venta libre","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Medicamentos biológicos: etiquetado, inserto y gestión del riesgo', 'Clase 4 · Biológicos, fitoterapéuticos e importados', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las particularidades de los biológicos (nomenclatura MB/MBT, plan de gestión de riesgo y guía de modificaciones GU044) que impactan su etiquetado.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_1782_2014.htm","title":"[Página web] Decreto 1782 de 2014 – Evaluación farmacológica y farmacéutica de medicamentos biológicos","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/sites/default/files/medicamentos-y-productos-biologicos/tecnico-medicamentos-2/ASS-RSA-GU044.pdf","title":"ASS-RSA-GU044 Guía de modificaciones de seguridad y eficacia para medicamentos biológicos (v3)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Productos fitoterapéuticos: requisitos de etiqueta del Decreto 2266 de 2004', 'Clase 4 · Biológicos, fitoterapéuticos e importados', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los requisitos de etiqueta de las preparaciones con base en plantas y de los fitoterapéuticos tradicionales, incluidas las leyendas obligatorias.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_homeopaticos_fitoterapeuticos_NEW/DECRETO_2266_DE_2004.PDF","title":"Decreto 2266 de 2004 – Registros sanitarios de productos fitoterapéuticos (arts. 42-48 envases y etiquetas)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: sticker y reetiquetado de un medicamento importado', 'Clase 4 · Biológicos, fitoterapéuticos e importados', 7, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la revisión de un sticker en español para un producto importado conforme al art. 74 del Decreto 677 y la Resolución 243710.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar los requisitos de etiquetado de medicamentos importados y el uso de stickers o reetiquetado en Colombia.</p><p>Desarrollo: El artículo 74 del Decreto 677 de 1995 permite que los medicamentos importados usen las etiquetas del país de origen, siempre que incluyan en español, como mínimo, el nombre del importador, la composición, las condiciones de almacenamiento y el número de registro sanitario colombiano (Concepto INVIMA 2022775 de 2018). En la práctica, esa información se agrega mediante un sticker o etiqueta adhesiva que forma parte del arte aprobado. La Resolución INVIMA 243710 de 1999 exige que etiquetas, empaques y stickers estén ubicados de forma visible y legible para el público (art. 4) y que el sticker sea permanente cuando se usa para informar al consumidor un cambio del registro. También excluye su uso en casos como reformulación, vida útil vencida o cambio de nombre o marca (art. 3). Recuerde además que en productos de venta bajo fórmula la etiqueta no debe mostrar indicaciones, aunque la etiqueta de origen las tenga.</p><p>Buenas prácticas para el sticker: no debe tapar información aprobada como el lote, el vencimiento, la concentración o las advertencias. Debe usar material y adhesivo resistentes que no se desprendan en la cadena de frío o con la humedad. Su colocación debe hacerse en condiciones de Buenas Prácticas (en el sitio autorizado y con registros de la operación de reacondicionamiento) y cada lote debe tener conciliación de stickers emitidos, usados y destruidos.</p><p>Ejemplo aplicado a un trámite INVIMA: una empresa importa un antibiótico inyectable fabricado en la India con la caja en inglés. En la solicitud de registro presenta el arte original y el arte del sticker en español, con el importador, la composición, las condiciones de almacenamiento y el registro sanitario, e indica dónde se colocará. Si el INVIMA hace observaciones, tiene 30 días para allegar la etiqueta corregida (Resolución 243710, art. 1). Durante la importación, el área de Calidad verifica en recepción que cada unidad tenga el sticker correcto antes de liberarla.</p><p>Puntos clave:<br>1. Los datos mínimos en español de un importado son el importador, la composición, el almacenamiento y el registro sanitario.<br>2. El sticker es parte del arte aprobado: no puede ocultar información crítica y debe ser permanente.<br>3. El reetiquetado es una operación controlada, con trazabilidad y conciliación por lote.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Inserto, información para prescribir (IPP) e información de seguridad', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción: inserto, IPP y su relación con el registro sanitario', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume qué son el inserto y la IPP, quién los aprueba y qué marco los regula hoy (Circular DG-1000-016-2025, GU044, GU079 e IN56).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: introducir la información farmacológica que acompaña al medicamento (el inserto para el paciente y la Información para Prescribir, IPP) y su relación con el registro sanitario.</p><p>Desarrollo: El inserto es el documento que se incluye dentro del empaque y está dirigido al paciente o cuidador. La IPP es el documento técnico dirigido al profesional que prescribe. Ambos deben reflejar exactamente lo aprobado por el INVIMA en el registro sanitario y en las actas de la Sala Especializada de Medicamentos de la Comisión Revisora (Circular INVIMA 58 de 2018). No pueden ampliar indicaciones, eliminar restricciones de edad ni cambiar la línea de tratamiento.</p><p>En los últimos años el INVIMA actualizó el marco. La Circular Externa DG-1000-016-2025 fija cómo presentar y evaluar modificaciones de seguridad o eficacia en insertos e IPP. Las guías ASS-RSA-GU044 (biológicos) y ASS-RSA-GU079 (síntesis química y gases medicinales) clasifican esos cambios. El instructivo ASS-RSA-IN56, versión 2 de 2026, orienta la estructura y el lenguaje de los insertos y la IPP. Además, el Decreto 334 de 2022 clasificó las modificaciones de etiquetado en cuatro tipos: cambios administrativos de etiquetado, cambios en la información de etiquetado, cambios urgentes por seguridad y cambios de seguridad y eficacia, cada uno con su propio procedimiento y plazo.</p><p>La unidad recorre tres bloques: la estructura de la IPP, el inserto para el paciente con lenguaje comprensible y la gestión de la información de seguridad a lo largo del ciclo de vida.</p><p>Ejemplo aplicado a un trámite INVIMA: un titular recibe un comunicado de la FDA que añade una reacción adversa grave al principio activo de su producto. Debe radicar ante el INVIMA un cambio en la información de etiquetado, que requiere aprobación previa con un plazo de resolución de hasta cinco meses según el Decreto 334. Para ello indica la agencia de referencia con la que alinea la información (art. 27 del Decreto 677) y diligencia el formato del ASS-RSA-IN56. Una vez aprobado, actualiza el inserto, la IPP y, si aplica, el código QR, cuya página web debe mostrar la misma información aprobada.</p><p>Puntos clave:<br>1. El inserto y la IPP son una extensión del registro sanitario: solo contienen información aprobada.<br>2. El tipo de cambio (administrativo, de información, urgente o de seguridad y eficacia) determina el procedimiento y el plazo.<br>3. Por coherencia, cualquier cambio en el inserto se refleja también en la IPP, en los artes y en los medios digitales (QR).</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Estructura de la IPP según el instructivo ASS-RSA-IN56', 'Clase 2 · Información para prescribir (IPP)', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las secciones obligatorias de la IPP y los criterios de redacción de las reacciones adversas y de la información de seguridad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preview/144766","title":"ASS-RSA-IN56 Lineamientos para la elaboración de insertos para usuario e información para prescribir (IPP) – v2 (2026)","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/ass-rsa-in056pdf","title":"[Página web] ASS-RSA-IN056 – página de descarga de lineamientos y formatos","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Coherencia con el registro, las actas de la Comisión Revisora y las agencias de referencia', 'Clase 2 · Información para prescribir (IPP)', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las reglas de la Circular 58 de 2018 y la Circular DG-1000-016-2025 sobre lo que puede y no puede modificarse en insertos e IPP.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/circular_invima_0058_2018.htm","title":"[Página web] Circular INVIMA 58 de 2018 – Lineamientos de presentación de información farmacológica (insertos e IPP)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/blog/sala-de-prensa-13/el-invima-emite-nuevos-lineamientos-para-la-actualizacion-de-informacion-farmacologica-sobre-seguridad-y-eficacia-de-los-medicamentos-370","title":"[Página web] El Invima emite nuevos lineamientos para la actualización de información farmacológica sobre seguridad y eficacia (Circular DG-1000-016-2025)","description":"INVIMA – Sala de prensa (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/biblioteca/preview/123479","title":"Comisión Revisora SEMPB – Acta No. 33 de 2013 (evaluación de insertos e IPP)","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Estructura del inserto en preguntas y respuestas', 'Clase 3 · Inserto para el paciente', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica la estructura del inserto para paciente propuesta por el IN56 (para qué sirve, cuándo no usarlo, cuidados, cómo usarlo y qué problemas puede causar).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preview/144766","title":"ASS-RSA-IN56 Lineamientos para la elaboración de insertos para usuario e información para prescribir (IPP) – v2 (2026)","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Lenguaje para pacientes y legibilidad del inserto', 'Clase 3 · Inserto para el paciente', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica criterios de lenguaje claro, equilibrio entre beneficios y riesgos y formato (Arial de 8 puntos o más, negrillas) en la redacción de insertos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=HlL2F7XY5EY","provider":"youtube","videoId":"HlL2F7XY5EY","title":"Seguridad en el manejo de la medicación","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/preview/144766","title":"ASS-RSA-IN56 Lineamientos para la elaboración de insertos para usuario e información para prescribir (IPP) – v2 (2026)","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Tipos de modificación de seguridad y eficacia (GU079, GU044 y ACOM-INS80)', 'Clase 4 · Gestión de la información de seguridad', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los cuatro tipos de cambio de etiquetado y los documentos soporte exigidos para síntesis química y biológicos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_sala_especializada_medicamentos_sintesis/ASS-RSA-GU79_1.pdf","title":"ASS-RSA-GU79 Guía para la presentación de modificaciones de seguridad y eficacia – síntesis química y gases medicinales","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/sites/default/files/medicamentos-y-productos-biologicos/tecnico-medicamentos-2/ASS-RSA-GU044.pdf","title":"ASS-RSA-GU044 Guía de modificaciones de seguridad y eficacia para medicamentos biológicos (v3)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/biblioteca/preview/145507","title":"ACOM-INS80 Instructivo para la presentación de modificaciones de seguridad y eficacia – síntesis química y gases medicinales (v1, 2026)","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: actualización del inserto y la IPP por una nueva alerta de seguridad', 'Clase 4 · Gestión de la información de seguridad', 6, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta el trámite de actualización de insertos e IPP ante el INVIMA a partir de una comunicación de seguridad de una agencia de referencia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=HWwefOq2Cn0","provider":"youtube","videoId":"HWwefOq2Cn0","title":"Educación en medicación segura: errores de medicación. Reacciones adversas medicamentosas","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/blog/sala-de-prensa-13/el-invima-emite-nuevos-lineamientos-para-la-actualizacion-de-informacion-farmacologica-sobre-seguridad-y-eficacia-de-los-medicamentos-370","title":"[Página web] El Invima emite nuevos lineamientos para la actualización de información farmacológica sobre seguridad y eficacia (Circular DG-1000-016-2025)","description":"INVIMA – Sala de prensa (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_sala_especializada_medicamentos_sintesis/ASS-RSA-GU79_1.pdf","title":"ASS-RSA-GU79 Guía para la presentación de modificaciones de seguridad y eficacia – síntesis química y gases medicinales","description":"INVIMA (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Diseño, legibilidad y prevención de errores de medicación', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción: el etiquetado como barrera de seguridad del paciente', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume por qué el diseño del empaque influye en los errores de medicación y qué estrategias proponen la OMS y el ISMP.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: comprender por qué el diseño del etiquetado es una herramienta de seguridad del paciente y no solo un requisito legal o un elemento de marca.</p><p>Desarrollo: Una etiqueta puede cumplir todos los requisitos del Decreto 677 de 1995 y aun así inducir errores de medicación. La OMS, en su reto mundial \"Medicación sin daño\", identifica los medicamentos de aspecto o nombre parecido (LASA) como una causa frecuente de daño prevenible, y en 2023 publicó la guía técnica \"Medication safety for look-alike, sound-alike medicines\". El ISMP-España, en su boletín nº 52 de 2023, propone estrategias para reguladores, fabricantes, instituciones, profesionales y pacientes: letras mayúsculas resaltadas (tall man), diferenciación de colores y envases, códigos de barras, prescripción por denominación común y alertas electrónicas.</p><p>Para el químico farmacéutico de asuntos regulatorios, esto se traduce en criterios de revisión de artes: jerarquía visual (el nombre genérico y la concentración deben ser lo más legible), contraste suficiente, tipografía de tamaño adecuado (el instructivo ASS-RSA-IN56 recomienda Arial de al menos 8 puntos para insertos e IPP), diferenciación clara entre concentraciones de una misma línea y ausencia de elementos gráficos que confundan. La unidad cierra con la frontera entre información y publicidad: lo que se imprime en el empaque y en el inserto es información aprobada, mientras que la publicidad tiene su propio régimen (Decreto 334 de 2022 y Resolución 1896 de 2023).</p><p>Ejemplo aplicado a un trámite INVIMA: un laboratorio comercializa una línea de enalapril de 5 y 20 mg con cajas idénticas que solo difieren en el número. Tras un reporte de farmacovigilancia por confusión de concentraciones, decide diferenciar el color por concentración y resaltar la cifra. Como se trata de un cambio de diseño del arte, debe gestionarlo ante el INVIMA según la Resolución 243710 de 1999 y la clasificación de cambios administrativos de etiquetado del Decreto 334 (notificación o aprobación previa según la guía aplicable), conservando sin cambios los textos aprobados.</p><p>Puntos clave:<br>1. Cumplir la norma no basta: el arte también debe prevenir confusiones de nombre, concentración y vía.<br>2. Las estrategias LASA de la OMS y el ISMP son aplicables al diseño del empaque desde la etapa de desarrollo.<br>3. Los cambios de diseño motivados por seguridad también son cambios regulatorios y deben tramitarse.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Qué son los medicamentos LASA y cómo generan errores', 'Clase 2 · Medicamentos LASA (de aspecto o nombre parecido)', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los tipos de similitud LASA (marca-marca, marca-genérico, genérico-genérico y apariencia del envase) y su impacto en cada etapa del uso.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.who.int/publications/i/item/9789240058897","title":"[Página web] Medication safety for look-alike, sound-alike medicines (2023)","description":"Organización Mundial de la Salud (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://seguridaddelpaciente.sanidad.gob.es/informacion/publicaciones/2023/docs/Boletin_52_Noviembre_2023.pdf","title":"Boletín ISMP-España nº 52: Prevención de errores de medicación causados por la similitud del nombre o de la apariencia de los medicamentos","description":"Ministerio de Sanidad (España) / ISMP-España (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.salud.cdmx.gob.mx/storage/app/media/2018-2024/medicamentos/FICHAS%20TECNICAS/BOLETINES%20USO%20RACIONAL%20MEDICAMENTOS/2018/Boletin%201%202018%20LASA.pdf","title":"Boletín CIM 2018-1: Errores de medicación con medicamentos L.A.S.A.","description":"Secretaría de Salud CDMX (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Estrategias de prevención aplicadas al diseño del empaque', 'Clase 2 · Medicamentos LASA (de aspecto o nombre parecido)', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica estrategias como las letras mayúsculas resaltadas (tall man), la diferenciación cromática, el código de barras y la evaluación de nombres de marca en el diseño de artes.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://gruposdetrabajo.sefh.es/infografias/backend/pdfs/isoapariencia_errores_medicacion.pdf","title":"Infografía: Similitud del nombre, envase o etiquetado de medicamentos (LASA)","description":"SEFH – Grupos de trabajo (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://seguridaddelpaciente.sanidad.gob.es/informacion/publicaciones/2023/docs/Boletin_52_Noviembre_2023.pdf","title":"Boletín ISMP-España nº 52: Prevención de errores de medicación causados por la similitud del nombre o de la apariencia de los medicamentos","description":"Ministerio de Sanidad (España) / ISMP-España (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://repository.unad.edu.co/handle/10596/82381","title":"[Página web] Errores de dispensación asociados a medicamentos LASA en el ámbito ambulatorio y estrategias de prevención (UNAD, 2026)","description":"Universidad Nacional Abierta y a Distancia – UNAD (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Legibilidad, jerarquía visual y diseño seguro del arte', 'Clase 3 · Legibilidad y frontera con la publicidad', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica criterios de tipografía, contraste, expresión de la concentración y destaque de la vía de administración en la revisión de artes.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar criterios de legibilidad, jerarquía visual y diseño seguro en la revisión de artes de medicamentos.</p><p>Desarrollo: El Decreto 677 de 1995 exige que el contenido esté presente, y la Resolución 243710 de 1999 exige que las leyendas sean visibles y legibles. Ninguna norma colombiana fija una tipografía única para las cajas, pero sí existen referencias técnicas útiles. El instructivo INVIMA ASS-RSA-IN56 recomienda para insertos e IPP el idioma español, la fuente Arial con un tamaño mínimo de 8 puntos y negrillas para los títulos y las preguntas. La OMS y el ISMP-España aportan criterios para prevenir errores por similitud.</p><p>Criterios prácticos de revisión:<br>(1) Jerarquía: en la cara principal deben destacar la denominación genérica, la concentración y la forma farmacéutica. La marca no debe opacarlas.<br>(2) Concentración inequívoca: escriba 0,5 mg y nunca .5 mg; evite ceros finales (5 mg y no 5,0 mg); en inyectables exprese la concentración total y por mL.<br>(3) Diferenciación dentro de la línea: use colores o bloques distintos por concentración y evite cajas casi idénticas.<br>(4) Contraste: texto oscuro sobre fondo claro; no imprima información crítica sobre fondos metalizados o degradados.<br>(5) Abreviaturas: evite abreviaturas propensas a error (por ejemplo, \"U\" por unidades o \"µg\" mal impreso).<br>(6) Vía de administración destacada en productos de alto riesgo (por ejemplo, \"Solo para uso intravenoso\" o \"Diluir antes de usar\").<br>(7) Letras mayúsculas resaltadas (tall man) en nombres con riesgo LASA documentado.<br>(8) Espacio para la codificación de lote y vencimiento legible, y código de barras que permita la verificación en la dispensación.</p><p>Ejemplo aplicado a un trámite INVIMA: en la revisión de un nuevo arte de heparina sódica en viales de 5.000 y 25.000 UI/5 mL, el revisor exige escribir \"UI\" completo, diferenciar ambas concentraciones con color y bloque, mostrar la cantidad por mL y por vial y destacar la vía. Como son cambios de diseño, el arte se presenta ante el INVIMA con la identificación de colores que exige la Resolución 243710.</p><p>Puntos clave:<br>1. La legibilidad es un requisito sanitario, no una preferencia estética.<br>2. Concentración, vía y nombre genérico son la información crítica que nunca debe competir visualmente con la marca.<br>3. Documente los criterios de diseño seguro en una guía interna de artes para toda la línea de productos.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Publicidad vs. información: Decreto 334 de 2022 y Resolución 1896 de 2023 (visión breve)', 'Clase 3 · Legibilidad y frontera con la publicidad', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara la información no publicitaria, la publicidad de venta libre y la de venta bajo fórmula, y las restricciones en empaques y canales digitales.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/resolucion_minsaludps_1896_2023.htm","title":"[Página web] Resolución 1896 de 2023 – Información no publicitaria, promoción, publicidad y comercialización de medicamentos","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://consultorsalud.com/renovacion-auto-registro-sanitario-d334","title":"[Página web] Cambia el registro sanitario de medicamentos en Colombia y la forma de publicitarlos – Decreto 334 de 2022","description":"ConsultorSalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: rediseño de una línea de productos con riesgo de confusión de concentraciones', 'Clase 4 · Caso práctico de seguridad', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta el análisis LASA de una línea de productos y define los cambios de arte y su clasificación regulatoria.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.who.int/publications/i/item/9789240058897","title":"[Página web] Medication safety for look-alike, sound-alike medicines (2023)","description":"Organización Mundial de la Salud (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://gruposdetrabajo.sefh.es/infografias/backend/pdfs/isoapariencia_errores_medicacion.pdf","title":"Infografía: Similitud del nombre, envase o etiquetado de medicamentos (LASA)","description":"SEFH – Grupos de trabajo (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/compilacion/docs/resolucion_invima_ri243710.htm","title":"[Página web] Resolución INVIMA 243710 de 1999 – Etiquetas, empaques, stickers y agotamiento de existencias","description":"Normograma INVIMA (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Aprobación de artes y control de cambios del material de empaque', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción: ciclo de vida del material de empaque', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume las etapas de creación, aprobación, implementación y cambio de artes y el marco normativo que las rige.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: presentar la gestión del ciclo de vida del material de empaque, desde el primer boceto hasta la implementación de cambios y el agotamiento de existencias.</p><p>Desarrollo: El material de empaque (etiquetas, plegadizas, blísteres, insertos) es material crítico. Un error de impresión puede generar un retiro de producto o una alerta sanitaria. Por eso la industria trabaja con un flujo controlado. Primero se redacta el texto regulatorio a partir del registro sanitario. Luego el área de diseño elabora el arte, que revisan Asuntos Regulatorios, Calidad, Mercadeo y Producción. Se aprueba formalmente, se presenta al INVIMA cuando corresponde y se libera al proveedor de material de empaque. Por último, se verifica la prueba de color o el primer impreso antes de usarlo.</p><p>En el plano normativo, la Resolución INVIMA 243710 de 1999 exige presentar bocetos o artes finales con la solicitud de registro o modificación, identificando los colores. Exige también nuevos artes cuando cambia el contenido o el diseño, y limita el tamaño de \"Distribuido por\" y \"Comercializado por\" frente a \"Fabricado por\". Además, permite autorizar el agotamiento de empaques hasta por seis meses e informar al consumidor mediante sticker permanente cuando el cambio lo exige, excepto en casos como reformulación, vida útil vencida o cambio de nombre o marca. El Decreto 334 de 2022 y las guías del INVIMA (ASS-RSA-GU079, ASS-RSA-GU044 y el instructivo ACOM-INS80 de 2026) definen qué cambios de artes son administrativos (notificación o modificación automática) y cuáles requieren aprobación previa.</p><p>Ejemplo aplicado a un trámite INVIMA: una empresa cambia de importador. Debe solicitar la modificación del registro sanitario y actualizar los artes. Si tiene inventario de cajas impresas, puede pedir autorización de agotamiento con sticker que informe el nuevo importador, siempre que el cambio no esté entre las exclusiones de la Resolución 243710.</p><p>Puntos clave:<br>1. Un arte es un documento controlado: tiene versión, aprobaciones y trazabilidad hasta el registro sanitario.<br>2. Todo cambio de contenido o diseño requiere evaluar su clasificación regulatoria antes de imprimir.<br>3. El agotamiento de existencias y el uso de stickers son excepciones autorizables, no derechos automáticos. Planifique los cambios con tiempo para evitar desabastecimiento o destrucción innecesaria de material.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Procedimiento interno de elaboración y aprobación de artes', 'Clase 2 · Flujo de aprobación y control de cambios', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta un flujo controlado de seis etapas, desde el texto maestro hasta la liberación del impreso.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: ejecutar un flujo interno de elaboración y aprobación de artes de material de empaque que garantice la conformidad con el registro sanitario.</p><p>Desarrollo: Un procedimiento robusto (SOP) de artes suele tener seis etapas.<br>(1) Solicitud: se abre una orden de cambio o creación de arte con su justificación (nuevo registro, modificación, seguridad, cambio de proveedor).<br>(2) Texto regulatorio: Asuntos Regulatorios elabora el \"texto maestro\" a partir de la resolución del registro sanitario, las actas de la Comisión Revisora y los artículos 72 y 74 del Decreto 677 de 1995 (o los artículos 44 y 45 del Decreto 2266 de 2004 para fitoterapéuticos).<br>(3) Diseño: el diseñador aplica el texto maestro sin alterarlo, respetando las dimensiones técnicas del material (plano mecánico o dieline), las zonas de codificación de lote y vencimiento, el troquel, el código de barras y el Braille, si la empresa lo usa voluntariamente.<br>(4) Revisión cruzada: Regulatorios verifica el texto palabra por palabra frente al texto maestro (idealmente con herramientas de comparación de PDF). Calidad revisa la codificación, Producción revisa la compatibilidad con las líneas de empaque y Mercadeo revisa la marca.<br>(5) Aprobación y trámite: se firma el arte con versión y fecha. Si el cambio lo requiere, se radica ante el INVIMA según la clasificación del Decreto 334 de 2022 y la guía aplicable, y el arte no se libera hasta tener la autorización o la notificación correspondiente.<br>(6) Implementación: el proveedor imprime, se aprueba la prueba de color o el primer lote impreso, y se define el punto de corte de inventario (fecha o lote de implementación), con gestión de obsoletos o solicitud de agotamiento (Resolución 243710 de 1999).</p><p>Ejemplo aplicado a un trámite INVIMA: tras aprobarse por resolución la inclusión de una nueva contraindicación, el área regulatoria actualiza el texto maestro del inserto y de la IPP. Abre control de cambios para el inserto (versión 04 a 05), lo envía a diseño, compara el PDF resultante con el texto maestro, consigue las firmas, define que los lotes fabricados desde el 1 de marzo usarán la nueva versión y registra la trazabilidad en el expediente del producto.</p><p>Puntos clave:<br>1. El texto maestro es la única fuente válida; el diseño nunca redacta contenido regulatorio.<br>2. La revisión debe ser multidisciplinaria y dejar evidencia (firmas, versión y comparación).<br>3. La implementación se define por lote o fecha de corte y queda documentada para inspecciones.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Clasificación regulatoria del cambio, notificación y agotamiento de existencias', 'Clase 2 · Flujo de aprobación y control de cambios', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta cuándo un cambio de arte es administrativo (notificación o modificación automática) y cuándo requiere aprobación previa, y cuándo puede solicitarse agotamiento.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preview/145507","title":"ACOM-INS80 Instructivo para la presentación de modificaciones de seguridad y eficacia – síntesis química y gases medicinales (v1, 2026)","description":"INVIMA – Biblioteca (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_sala_especializada_medicamentos_sintesis/ASS-RSA-GU79_1.pdf","title":"ASS-RSA-GU79 Guía para la presentación de modificaciones de seguridad y eficacia – síntesis química y gases medicinales","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/compilacion/docs/resolucion_invima_ri243710.htm","title":"[Página web] Resolución INVIMA 243710 de 1999 – Etiquetas, empaques, stickers y agotamiento de existencias","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico integral: revisión de caja, blíster, muestra médica e inserto', 'Clase 3 · Casos prácticos de revisión de artes', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica un checklist integral para detectar y clasificar los errores en un juego completo de artes antes de su aprobación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar una lista de verificación integral para revisar el arte de una caja, un blíster y un inserto antes de su aprobación.</p><p>Desarrollo: Caso. Usted es químico farmacéutico de Asuntos Regulatorios y recibe para aprobación el arte de \"Losartán potásico 50 mg tabletas recubiertas, caja x 30\", venta bajo fórmula médica, fabricado en Colombia, con una presentación comercial y otra de muestra médica. Al revisarlo encuentra lo siguiente.<br>(a) En la cara principal, la marca ocupa el 60 % del área y el nombre genérico aparece en letra pequeña bajo la marca.<br>(b) En un lateral aparece \"Indicado para la hipertensión arterial\".<br>(c) El número de registro sanitario no coincide con el de la resolución vigente.<br>(d) \"Distribuido por\" está en un tamaño mayor que \"Fabricado por\".<br>(e) Falta la leyenda \"Manténgase fuera del alcance de los niños\".<br>(f) El blíster tiene el nombre, pero no hay espacio para la codificación de lote y vencimiento.<br>(g) El arte de la muestra médica es idéntico al comercial.<br>(h) El inserto usa la expresión \"bien tolerado\" y omite qué hacer si se olvida una dosis.</p><p>Análisis:<br>(a) El parágrafo 5 del art. 72 del Decreto 677 sigue vigente (Concepto INVIMA 27 de 2025): debe figurar el nombre genérico, con el mismo tamaño que la marca si es un medicamento esencial. Verifique la condición del producto.<br>(b) Los medicamentos de venta bajo fórmula no pueden mostrar indicaciones en la etiqueta (Concepto 2022775 de 2018): se elimina.<br>(c) Es un error crítico: se corrige frente a la resolución vigente.<br>(d) Incumple el art. 2 de la Resolución 243710 de 1999.<br>(e) Es una leyenda obligatoria del art. 72: se agrega.<br>(f) Sin lote y vencimiento en el primario se pierde la trazabilidad y el uso seguro: se rediseña.<br>(g) La muestra médica requiere su propio diseño con la leyenda que la identifica y prohíbe su venta (el instructivo ACOM-INS80 contempla un diseño para la presentación comercial y otro para la muestra médica).<br>(h) El ASS-RSA-IN56 prohíbe expresiones generales de tolerabilidad y exige la pregunta sobre dosis olvidadas o sobredosis.</p><p>Ejemplo aplicado a un trámite INVIMA: tras las correcciones, el titular presenta el arte corregido en el trámite correspondiente (nuevo registro, o modificación si el registro ya está vigente) y conserva el acta de revisión interna como evidencia.</p><p>Puntos clave:<br>1. Revise siempre contra la resolución vigente del registro, no contra versiones anteriores del arte.<br>2. Clasifique los hallazgos en críticos (registro, concentración, leyendas obligatorias) y menores (estéticos).<br>3. Use una lista de verificación estandarizada por tipo de material: caja, primario, inserto e IPP.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: implementación de un cambio de seguridad en todos los materiales', 'Clase 3 · Casos prácticos de revisión de artes', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la cadena completa de un cambio aprobado (resolución, texto maestro, artes, QR, punto de corte e inventario).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/sites/default/files/medicamentos-y-productos-biologicos/tecnico-medicamentos-2/ASS-RSA-GU044.pdf","title":"ASS-RSA-GU044 Guía de modificaciones de seguridad y eficacia para medicamentos biológicos (v3)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/blog/sala-de-prensa-13/el-invima-emite-nuevos-lineamientos-para-la-actualizacion-de-informacion-farmacologica-sobre-seguridad-y-eficacia-de-los-medicamentos-370","title":"[Página web] El Invima emite nuevos lineamientos para la actualización de información farmacológica sobre seguridad y eficacia (Circular DG-1000-016-2025)","description":"INVIMA – Sala de prensa (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_0334_2022.htm","title":"[Página web] Decreto 334 de 2022 – Renovación, modificación, información y publicidad de medicamentos","description":"Normograma INVIMA (ES)"}'::jsonb);

END
$curso$;

-- ─── 8. Curso de Estudios de Estabilidad para el Registro de Medicamentos (33 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Estudios de Estabilidad para el Registro de Medicamentos' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Estudios de Estabilidad para el Registro de Medicamentos', 'Curso práctico sobre el diseño, la ejecución, la evaluación y la presentación ante el INVIMA de los estudios de estabilidad de medicamentos de síntesis química y biológicos. Integra la Resolución 3157 de 2018 (modificada por las Resoluciones 1839 de 2020 y 0525 de 2025), la Resolución 3690 de 2016, las guías ICH Q1A(R2)–Q1E y Q5C, la nueva guía consolidada ICH Q1 y la guía OMS…', '<p>Curso práctico sobre el diseño, la ejecución, la evaluación y la presentación ante el INVIMA de los estudios de estabilidad de medicamentos de síntesis química y biológicos. Integra la Resolución 3157 de 2018 (modificada por las Resoluciones 1839 de 2020 y 0525 de 2025), la Resolución 3690 de 2016, las guías ICH Q1A(R2)–Q1E y Q5C, la nueva guía consolidada ICH Q1 y la guía OMS TRS 1010 Anexo 10, con énfasis en la zona climática IVb.</p><h3>Objetivo general</h3><p>Capacitar al químico farmacéutico para diseñar protocolos de estabilidad conformes a la normativa colombiana y a las guías internacionales, evaluar estadísticamente los datos para asignar la vida útil, y presentar y defender la información de estabilidad en los trámites de registro, renovación y modificación ante el INVIMA.</p><h3>A quién va dirigido</h3><p>Químicos farmacéuticos y profesionales de asuntos regulatorios, control de calidad, desarrollo galénico y aseguramiento de calidad de laboratorios fabricantes, importadores y titulares de registros sanitarios en Colombia.</p><h3>Contexto normativo</h3><p>Colombia — normativa INVIMA / MinSalud</p>',
          'Asuntos regulatorios', 'intermedio', 'Capacitar al químico farmacéutico para diseñar protocolos de estabilidad conformes a la normativa colombiana y a las guías internacionales, evaluar estadísticamente los datos para asignar la vida útil, y presentar y defender la información de estabilidad en los trámites de registro, renovación y modificación ante el INVIMA.', 'Químicos farmacéuticos y profesionales de asuntos regulatorios, control de calidad, desarrollo galénico y aseguramiento de calidad de laboratorios fabricantes, importadores y titulares de registros sanitarios en Colombia.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Fundamentos y marco normativo de la estabilidad', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: por qué la estabilidad define la calidad de un medicamento', 'Clase 1 · Introducción al curso', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante comprende el propósito de los estudios de estabilidad, su relación con la vida útil y las condiciones de almacenamiento, y la ruta del curso.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=cUavJv3-nG8","provider":"youtube","videoId":"cUavJv3-nG8","title":"Todo lo que debe saber de los Estudios de Estabilidad","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=Ldj_Eqb2a9k","provider":"youtube","videoId":"Ldj_Eqb2a9k","title":"Estabilidad de Medicamentos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Resolución 3157 de 2018 y sus modificaciones (Resoluciones 1839 de 2020 y 0525 de 2025)', 'Clase 2 · Marco normativo colombiano', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante describe el objeto, el ámbito y la estructura de la guía de estabilidad de síntesis química, su entrada en efectos el 1 de abril de 2024 y el cambio introducido en 2025 para traslados de planta.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_3157_2018.htm","title":"[Página web] Resolución 3157 de 2018 – Guía para el desarrollo y presentación de los estudios de estabilidad de medicamentos de síntesis química (texto compilado con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_1839_2020.htm","title":"[Página web] Resolución 1839 de 2020 – Modifica los artículos 3 y 7 de la Resolución 3157 de 2018 (efectos desde el 1 de abril de 2024)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/DIJ/resolucion-0525-de-2025.pdf","title":"Resolución 0525 de 2025 – Modifica los numerales 3.8 y 3.8.1 del Anexo Técnico de la Resolución 3157 de 2018","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Resolución 3690 de 2016: guía de estabilidad de medicamentos biológicos', 'Clase 2 · Marco normativo colombiano', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante identifica los requisitos particulares de estabilidad para biológicos en Colombia: lotes de IFA y producto, estabilidad natural, cadena de frío y estudios de reconstituidos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_3690_2016.htm","title":"[Página web] Resolución 3690 de 2016 – Guía de Estabilidad de Medicamentos Biológicos","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://consultorsalud.com/guia-de-estabilidad-de-medicamentos-biologicos-resolucion-3690-de-2016/","title":"[Página web] Guía de Estabilidad de Medicamentos Biológicos – Resolución 3690 de 2016","description":"ConsultorSalud (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/MET/respuesta-comentarios-guia-estabilidad-de-medicamentos-biologicos.pdf","title":"Respuesta a comentarios – Guía de estabilidad de medicamentos biológicos","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Preguntas y respuestas del INVIMA sobre la Resolución 3157 de 2018', 'Clase 2 · Marco normativo colombiano', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante interpreta los criterios oficiales del INVIMA para la transición, las renovaciones, las modificaciones, los productos importados y la información del IFA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preguntas_20y_20respuestas_20res_203157_20de_202018_20-_20abril_202024_20v6_14pdf","title":"Preguntas y respuestas Resolución 3157 de 2018 – Abril 2024 V.6","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://consultorsalud.com/plazos-para-medicamentos-de-sintesis-quimica/","title":"[Página web] Se amplían los plazos para los estudios de estabilidad de medicamentos de síntesis química","description":"ConsultorSalud (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/MET/rta-comentarios-consulta-publica-nal-estebilidad.pdf","title":"Respuesta a comentarios de la consulta pública de la guía de estabilidad (síntesis química)","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Guías ICH Q1A(R2) a Q1E y Q5C', 'Clase 3 · Marco internacional de referencia', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante describe el alcance de cada guía ICH de estabilidad (Q1A(R2) general, Q1B fotoestabilidad, Q1C nuevas formas, Q1D diseños reducidos, Q1E evaluación de datos, Q5C biotecnológicos) y cómo se usan como soporte en Colombia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=GMuRFKpWDXE","provider":"youtube","videoId":"GMuRFKpWDXE","title":"Curso ICH – Clase 03: Guía ICH Q1A(R2): Pruebas de Estabilidad para Nuevos Fármacos y Productos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ema.europa.eu/en/ich-q1a-r2-stability-testing-new-drug-substances-drug-products-scientific-guideline","title":"[Página web] ICH Q1A (R2) Stability testing of new drug substances and drug products – Scientific guideline","description":"EMA (EN) · mismo documento, versión en inglés del sitio"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.ema.europa.eu/en/documents/scientific-guideline/quality-biotechnological-products-stability-testing-biotechnological/biological-products_en.pdf","title":"Quality of Biotechnological Products: Stability Testing of Biotechnological/Biological Products (ICH Q5C)","description":"EMA / ICH (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'OMS TRS 1010 Anexo 10 y la revisión consolidada ICH Q1', 'Clase 3 · Marco internacional de referencia', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante compara la guía OMS de estabilidad con ICH y conoce el estado de la nueva guía consolidada ICH Q1 (Step 2 en abril de 2025, adopción Step 4 prevista para noviembre de 2026) que integra Q1A–Q1F y Q5C.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.who.int/publications/m/item/trs1010-annex10","title":"[Página web] TRS 1010 – Annex 10: WHO guidelines on stability testing of active pharmaceutical ingredients and finished pharmaceutical products","description":"Organización Mundial de la Salud (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://database.ich.org/sites/default/files/ICH52_Q1_EWG_WorkPlan_2026_0318.pdf","title":"ICH Q1 EWG Work Plan (marzo 2026) – revisión consolidada Q1/Q5C","description":"ICH (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://gmpinsiders.com/ich-q1-draft-guideline-released-april-2025/","title":"[Página web] ICH Q1 Draft Guideline Released for Comment: Consolidated Stability Framework Moves Forward","description":"GMP Insiders (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: identificar la norma de estabilidad aplicable a un trámite INVIMA', 'Clase 3 · Marco internacional de referencia', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante determina, para distintos productos y trámites, qué norma colombiana y qué guías internacionales aplican y qué condición climática se exige.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: identificar, para un trámite concreto ante el INVIMA, qué norma de estabilidad aplica, qué versión está vigente y qué guías internacionales pueden usarse como soporte técnico.</p><p>Desarrollo: el primer error que genera requerimientos en estabilidad no es técnico sino normativo: presentar el estudio con la guía equivocada. En Colombia conviven dos instrumentos principales. Para medicamentos de síntesis química rige la Resolución 3157 de 2018 del Ministerio de Salud, que expidió la \"Guía para el desarrollo y presentación de los estudios de estabilidad de medicamentos de síntesis química\". Su entrada en efectos fue aplazada por la Resolución 1839 de 2020 hasta el 1 de abril de 2024, y la Resolución 0525 de 2025 (28 de marzo de 2025) modificó los numerales 3.8 y 3.8.1 del anexo para permitir, en traslados de planta sin cambio de proceso ni equipos y con principio activo estable, presentar datos acelerados y de largo plazo de al menos 3 meses, con el compromiso de entregar los resultados de 6 meses y los datos hasta completar la vida útil. Esta misma resolución dejó al INVIMA la actualización de la guía con visto bueno del Ministerio. Para medicamentos biológicos aplica la Resolución 3690 de 2016 (Guía de Estabilidad de Medicamentos Biológicos), vigente desde el 19 de agosto de 2017. Los gases medicinales se rigen por la Resolución 1497 de 2023, y la Resolución 2514 de 1995 quedó circunscrita a productos fitoterapéuticos, según el artículo 6 de la 3157.</p><p>El procedimiento recomendado es: 1) clasificar el producto (síntesis química, biológico, fitoterapéutico, gas medicinal); 2) clasificar el trámite (registro nuevo, renovación o modificación que afecte la estabilidad); 3) consultar el texto compilado en el normograma del INVIMA para ver notas de vigencia; 4) revisar el documento de preguntas y respuestas del INVIMA (versión 6, abril de 2024) para resolver casos de transición; 5) identificar las guías ICH u OMS que se citarán como soporte (Q1A(R2), Q1B, Q1D, Q1E, Q5C, TRS 1010 Anexo 10).</p><p>Ejemplo aplicado: una empresa importa tabletas de losartán fabricadas en India y solicita la renovación del registro sanitario. Al ser un medicamento de síntesis química, aplica la Resolución 3157 de 2018 (art. 2 incluye renovaciones). Los estudios deben demostrar estabilidad en la condición de zona IVb (30 °C ± 2 °C / 75 % HR ± 5 % HR) o justificar técnica y experimentalmente otra condición. Si el fabricante solo tiene datos a 25 °C/60 % HR (zona II), el expediente quedará expuesto a requerimiento. En cambio, si se tratara de una insulina, la referencia sería la Resolución 3690 de 2016 y la guía ICH Q5C.</p><p>Puntos clave:<br>1. Síntesis química: Resolución 3157 de 2018, con modificaciones de las Resoluciones 1839 de 2020 y 0525 de 2025; biológicos: Resolución 3690 de 2016.<br>2. Siempre verifique el texto compilado y las notas de vigencia en el normograma del INVIMA antes de radicar.<br>3. Las guías ICH y OMS son soporte técnico, pero el requisito exigible es el de la norma colombiana (en particular la condición de zona IVb).</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Zonas climáticas y tipos de estudios de estabilidad', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: condiciones de almacenamiento y tipos de estudio', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante resume cómo la zona climática determina las condiciones de los estudios y qué tipos de estudio componen un programa de estabilidad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=Ldj_Eqb2a9k","provider":"youtube","videoId":"Ldj_Eqb2a9k","title":"Estabilidad de Medicamentos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Zonas climáticas de la OMS/ICH y la zona IVb de Colombia', 'Clase 2 · Zonas climáticas y Colombia', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante describe las zonas climáticas I a IVb y explica por qué en Colombia el largo plazo se realiza a 30 °C ± 2 °C / 75 % HR ± 5 % HR.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=lpAaammAdYM","provider":"youtube","videoId":"lpAaammAdYM","title":"Cámaras Climáticas en Estudios de Estabilidad de Medicamentos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://extranet.who.int/prequal/sites/default/files/document_files/TRS1010_Annex10.pdf","title":"Stability testing of active pharmaceutical ingredients and finished pharmaceutical products (WHO TRS 1010, Annex 10, 2018)","description":"OMS – Precalificación (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_3157_2018.htm","title":"[Página web] Resolución 3157 de 2018 – Guía para el desarrollo y presentación de los estudios de estabilidad de medicamentos de síntesis química (texto compilado con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Temperatura cinética media, cámaras climáticas y excursiones', 'Clase 2 · Zonas climáticas y Colombia', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante interpreta el concepto de temperatura cinética media y su uso para evaluar el almacenamiento y las excursiones de temperatura en la cadena de distribución.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=lpAaammAdYM","provider":"youtube","videoId":"lpAaammAdYM","title":"Cámaras Climáticas en Estudios de Estabilidad de Medicamentos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://revistas.udea.edu.co/index.php/vitae/article/view/455","title":"[Página web] La temperatura cinética media en los estudios de estabilidad a largo plazo y almacenamiento de los medicamentos (Vitae, 2004)","description":"Universidad de Antioquia – Revista Vitae (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Estudios de largo plazo, acelerados e intermedios', 'Clase 3 · Tipos de estudios', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante compara condiciones, duración mínima y puntos de muestreo de los estudios de largo plazo, acelerados e intermedios, y cuándo se activa el intermedio.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=GMuRFKpWDXE","provider":"youtube","videoId":"GMuRFKpWDXE","title":"Curso ICH – Clase 03: Guía ICH Q1A(R2): Pruebas de Estabilidad para Nuevos Fármacos y Productos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ema.europa.eu/en/ich-q1a-r2-stability-testing-new-drug-substances-drug-products-scientific-guideline","title":"[Página web] ICH Q1A (R2) Stability testing of new drug substances and drug products – Scientific guideline","description":"EMA (EN) · mismo documento, versión en inglés del sitio"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_3157_2018.htm","title":"[Página web] Resolución 3157 de 2018 – Guía para el desarrollo y presentación de los estudios de estabilidad de medicamentos de síntesis química (texto compilado con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Fotoestabilidad (ICH Q1B)', 'Clase 3 · Tipos de estudios', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante describe el diseño de un estudio de fotoestabilidad confirmatorio (exposición mínima, fuentes de luz, muestras expuestas, en envase y controles oscuros) y su impacto en el rotulado.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=ms2y6hUj2HU","provider":"youtube","videoId":"ms2y6hUj2HU","title":"ICH Q1B: Complete Guide to Photostability Testing","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_3157_2018.htm","title":"[Página web] Resolución 3157 de 2018 – Guía para el desarrollo y presentación de los estudios de estabilidad de medicamentos de síntesis química (texto compilado con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Estabilidad en uso, ciclos térmicos y envases semipermeables', 'Clase 3 · Tipos de estudios', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante explica cuándo se requieren estudios en uso (multidosis, reconstituidos, diluidos), ciclos de congelación-descongelación o calentamiento-enfriamiento y estudios de pérdida de agua.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://bibliotecadigital.udea.edu.co/dspace/bitstream/10495/34302/1/RendonLaura_2018_EstabilidadMedicamentos1Uso.pdf","title":"Estabilidad de medicamentos en uso (trabajo de grado, Rendón L., 2018)","description":"Universidad de Antioquia – Biblioteca Digital (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_3157_2018.htm","title":"[Página web] Resolución 3157 de 2018 – Guía para el desarrollo y presentación de los estudios de estabilidad de medicamentos de síntesis química (texto compilado con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.minsa.gob.pa/sites/default/files/publicacion-general/decreto_197_estudios_de_estabilidad_0.pdf","title":"Decreto 197 – Estudios de estabilidad (Panamá)","description":"MINSA Panamá (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: producto importado con estudios en zona II', 'Clase 3 · Tipos de estudios', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante define la estrategia de estabilidad para registrar en Colombia un producto cuyo fabricante solo tiene datos a 25 °C/60 % HR.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: definir las condiciones de almacenamiento y el plan de estudios que exige el INVIMA para un producto importado cuyo fabricante diseñó el programa de estabilidad para la zona climática II.</p><p>Desarrollo: la OMS clasifica a Colombia en la zona climática IVb (caliente y muy húmeda). Por eso la Resolución 3157 de 2018 pide que los estudios de largo plazo se realicen a 30 °C ± 2 °C y 75 % HR ± 5 % HR, aunque el numeral 3.8.7 permite condiciones distintas si se justifican técnica y experimentalmente. Muchos fabricantes europeos o norteamericanos solo tienen datos a 25 °C/60 % HR (zona II) y acelerados a 40 °C/75 % HR. El regulador debe decidir si esa información permite asegurar la calidad del producto en el mercado colombiano.</p><p>Paso a paso para el caso:<br>1. Solicitar al fabricante el informe completo de estabilidad: lotes (mínimo tres primarios, o dos si el IFA es estable), tamaño de lote, sistema de envase, especificaciones, métodos indicadores de estabilidad y resultados por punto de muestreo.<br>2. Verificar si existe estudio a 30 °C/75 % HR. Si no existe, solicitar que se inicie un estudio en zona IVb y evaluar si el acelerado (40 °C/75 % HR, 6 meses) mostró cambio significativo. Recuerde que los acelerados son soporte provisional y los de largo plazo son definitivos.<br>3. Revisar el envase: un blíster PVC simple ofrece poca barrera a la humedad; en zona IVb suele ser preferible PVC/PVDC, Alu/Alu o frasco de HDPE con desecante. Un cambio de envase para Colombia es un cambio que exige datos propios.<br>4. Proponer la vida útil y la leyenda de almacenamiento (\"Almacenar a temperatura no mayor de 30 °C\") coherentes con los datos disponibles; si los datos son parciales, solicitar una vida útil más corta y presentar compromiso de estabilidad.<br>5. Documentar el razonamiento en el resumen de estabilidad y anexar el protocolo del estudio en curso.</p><p>Ejemplo aplicado: una suspensión oral de amoxicilina con datos de 24 meses a 25 °C/60 % HR y 6 meses a 40 °C/75 % HR sin cambio significativo. El titular presenta además 6 meses a 30 °C/75 % HR en tres lotes piloto. La estrategia es solicitar una vida útil inicial respaldada por los datos a 30 °C/75 % HR, con estudio de estabilidad en uso del producto reconstituido, y comprometerse a completar los 24 meses en zona IVb antes de extender la vida útil por modificación.</p><p>Puntos clave:<br>1. La condición de referencia en Colombia es 30 °C/75 % HR; datos de zona II por sí solos son una causa frecuente de requerimiento.<br>2. El envase primario es parte de la solución: más barrera puede hacer viable el producto en zona IVb.<br>3. Si los datos son incompletos, conviene una vida útil conservadora con compromiso de estabilidad en lugar de una extrapolación sin sustento.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Diseño del protocolo y métodos indicadores de estabilidad', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: del diseño al método analítico', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante resume los componentes de un protocolo de estabilidad y el papel de la degradación forzada y los métodos indicadores.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=cUavJv3-nG8","provider":"youtube","videoId":"cUavJv3-nG8","title":"Todo lo que debe saber de los Estudios de Estabilidad","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Lotes, envases, frecuencias, parámetros y especificaciones', 'Clase 2 · Diseño del protocolo', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante aplica los requisitos de selección de lotes, sistema de envase-cierre, orientación de muestras, frecuencias y atributos a evaluar según la forma farmacéutica.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=PZnwGa9Yj3g","provider":"youtube","videoId":"PZnwGa9Yj3g","title":"[Resumen] NOM-073-SSA1-2015 sobre estabilidad de fármacos","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_3157_2018.htm","title":"[Página web] Resolución 3157 de 2018 – Guía para el desarrollo y presentación de los estudios de estabilidad de medicamentos de síntesis química (texto compilado con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://extranet.who.int/prequal/sites/default/files/document_files/TRS1010_Annex10.pdf","title":"Stability testing of active pharmaceutical ingredients and finished pharmaceutical products (WHO TRS 1010, Annex 10, 2018)","description":"OMS – Precalificación (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Diseños reducidos: bracketing y matrixing (ICH Q1D)', 'Clase 2 · Diseño del protocolo', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante interpreta cuándo y cómo aplicar diseños de extremos y de matrices, sus supuestos y sus limitaciones para la asignación de vida útil.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=jsJtInFEU1M","provider":"youtube","videoId":"jsJtInFEU1M","title":"Curso ICH – Clase 06: Guía ICH Q1D: Diseños de Bracketing y Matrixing para Pruebas de Estabilidad","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.hhs.gov/guidance/sites/default/files/hhs-guidance-documents/FDA/Q1D-Bracketing-and-Matrixing-Designs-for-Stability-Testing-of-New-Drug-Substances-and-Products.pdf","title":"Q1D Bracketing and Matrixing Designs for Stability Testing of New Drug Substances and Products","description":"FDA / ICH (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Estudios de estrés y degradación forzada', 'Clase 3 · Degradación forzada y métodos indicadores (visión breve)', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante describe las condiciones de estrés (calor, humedad, oxidación, fotólisis, hidrólisis a distintos pH) y para qué sirven en el registro.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://rcfba.fcfar.unesp.br/index.php/ojs/article/view/729","title":"[Página web] Forced degradation studies to identify organic impurities in pharmaceuticals: a Brazilian perspective","description":"Revista de Ciências Farmacêuticas Básica e Aplicada (UNESP) (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.arlok.com/news/forced-degradation-stability-indicating-methods","title":"[Página web] Importance of Forced Degradation In Stability-Indicating Methods","description":"Arlok (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_3157_2018.htm","title":"[Página web] Resolución 3157 de 2018 – Guía para el desarrollo y presentación de los estudios de estabilidad de medicamentos de síntesis química (texto compilado con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Métodos analíticos indicadores de estabilidad', 'Clase 3 · Degradación forzada y métodos indicadores (visión breve)', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante interpreta qué hace que un método sea indicador de estabilidad (especificidad, pureza de pico, balance de masas) y qué evidencia de validación espera el INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.arlok.com/news/forced-degradation-stability-indicating-methods","title":"[Página web] Importance of Forced Degradation In Stability-Indicating Methods","description":"Arlok (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.eag.com/wp-content/uploads/2017/07/ICH-Stability-Requirements_EAG-Laboratories.pdf","title":"ICH Stability Requirements (resumen técnico)","description":"EAG Laboratories (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: redactar el protocolo de estabilidad de tabletas recubiertas', 'Clase 4 · Caso práctico de protocolo', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante elabora el protocolo de estabilidad de un producto sólido oral para registro sanitario ante el INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: redactar los elementos esenciales de un protocolo de estabilidad para un producto de síntesis química que se registrará ante el INVIMA.</p><p>Desarrollo: el protocolo es el documento que, aprobado antes de iniciar el estudio, define qué se estudia, cómo y con qué criterios. El INVIMA lo revisa junto con los resultados, y las inconsistencias entre protocolo e informe son motivo frecuente de requerimiento. Un protocolo conforme a la Resolución 3157 de 2018 y a ICH Q1A(R2) debe contener:<br>1. Identificación del producto: nombre, forma farmacéutica, concentraciones, fórmula cualicuantitativa y fabricante del IFA y del producto terminado.<br>2. Lotes: al menos tres lotes primarios (dos si el IFA es conocido como estable), de la misma formulación y sistema de envase propuesto para comercialización, fabricados a escala piloto como mínimo, con número, tamaño y fecha de fabricación.<br>3. Sistema de envase-cierre: material del envase primario y orientación de las muestras (por ejemplo, frascos de líquidos en posición invertida o horizontal para evaluar el contacto con el cierre).<br>4. Condiciones: largo plazo 30 °C ± 2 °C / 75 % HR ± 5 % HR; acelerado 40 °C ± 2 °C / 75 % HR ± 5 % HR por 6 meses; intermedia cuando haya cambio significativo en el acelerado.<br>5. Frecuencias: largo plazo cada 3 meses el primer año, cada 6 meses el segundo y luego anual (0, 3, 6, 9, 12, 18, 24, 36 meses); acelerado al menos 0, 3 y 6 meses; intermedia al menos cuatro puntos en 12 meses.<br>6. Parámetros y especificaciones: aspecto, valoración, productos de degradación, disolución, humedad, pH, uniformidad o límites microbianos según la forma farmacéutica, con métodos indicadores de estabilidad validados.<br>7. Diseño reducido, si aplica: bracketing o matrixing justificado según ICH Q1D.<br>8. Estudios complementarios: fotoestabilidad en un lote (ICH Q1B), estabilidad en uso para multidosis o reconstituidos, ciclos térmicos cuando la forma farmacéutica lo requiera.<br>9. Criterios de evaluación: definición de cambio significativo, método estadístico (ICH Q1E) y manejo de resultados fuera de especificación.</p><p>Ejemplo aplicado: tabletas recubiertas de metformina 850 mg en blíster PVC/PVDC-aluminio. Se estudian tres lotes piloto (100.000 tabletas cada uno), a 30 °C/75 % HR (0, 3, 6, 9, 12, 18, 24 meses) y 40 °C/75 % HR (0, 3, 6 meses). Parámetros: aspecto, valoración, sustancias relacionadas, disolución y humedad. Fotoestabilidad sobre un lote, expuesto fuera y dentro del envase. Vida útil propuesta: 24 meses, evaluada con regresión y límite de confianza de una cola del 95 %.</p><p>Puntos clave:<br>1. El protocolo se aprueba antes del estudio y el informe debe seguirlo sin desviaciones no justificadas.<br>2. Lotes, envase y condiciones deben ser representativos de lo que se comercializará en Colombia.<br>3. Los criterios estadísticos y de cambio significativo se definen por adelantado, no después de ver los datos.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Evaluación estadística y asignación de vida útil', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: de los datos a la vida útil', 'Clase 1 · Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante resume el proceso para transformar los resultados de estabilidad en una vida útil y unas condiciones de almacenamiento.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=SP3EgoPC1yA","provider":"youtube","videoId":"SP3EgoPC1yA","title":"Estadística para estudios de estabilidad de medicamentos (1 de 3)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Cambio significativo y árbol de decisión de ICH Q1E', 'Clase 2 · Evaluación estadística (ICH Q1E)', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante interpreta la definición de cambio significativo de la Resolución 3157 de 2018 y el árbol de decisión de ICH Q1E para decidir si procede la extrapolación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=61XnUHQYSSU","provider":"youtube","videoId":"61XnUHQYSSU","title":"Interpreting Stability Regression per ICH Q1E","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.hhs.gov/guidance/sites/default/files/hhs-guidance-documents/FDA/Q1E-Evaluation-of-Stability-Data.pdf","title":"Guidance for Industry: Q1E Evaluation of Stability Data","description":"FDA / ICH (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_3157_2018.htm","title":"[Página web] Resolución 3157 de 2018 – Guía para el desarrollo y presentación de los estudios de estabilidad de medicamentos de síntesis química (texto compilado con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Regresión, combinación de lotes y extrapolación', 'Clase 2 · Evaluación estadística (ICH Q1E)', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante aplica regresión lineal con límite de confianza del 95 %, la prueba de combinación de lotes (p &gt; 0,25) y los límites de extrapolación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=BdwtndzLDlU","provider":"youtube","videoId":"BdwtndzLDlU","title":"Estadística para estudios de estabilidad de medicamentos (2 de 3)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=zmGfCUxjJis","provider":"youtube","videoId":"zmGfCUxjJis","title":"Extrapolation and Regression Study in Stability Analysis ICH Q1E","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.hhs.gov/guidance/sites/default/files/hhs-guidance-documents/FDA/Q1E-Evaluation-of-Stability-Data.pdf","title":"Guidance for Industry: Q1E Evaluation of Stability Data","description":"FDA / ICH (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Vida útil provisional y definitiva; condiciones de almacenamiento en la etiqueta', 'Clase 3 · Asignación de vida útil', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante distingue vida útil provisional (soportada en acelerados y extrapolación) y definitiva (datos reales de largo plazo) y la traduce en leyendas de almacenamiento.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_3157_2018.htm","title":"[Página web] Resolución 3157 de 2018 – Guía para el desarrollo y presentación de los estudios de estabilidad de medicamentos de síntesis química (texto compilado con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://extranet.who.int/prequal/sites/default/files/document_files/TRS1010_Annex10.pdf","title":"Stability testing of active pharmaceutical ingredients and finished pharmaceutical products (WHO TRS 1010, Annex 10, 2018)","description":"OMS – Precalificación (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso práctico: calcular la vida útil con datos de tres lotes', 'Clase 3 · Asignación de vida útil', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante ejecuta el análisis estadístico de datos reales simulados y propone vida útil, leyenda y compromiso de estabilidad.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar los principios de ICH Q1E y de la Resolución 3157 de 2018 para proponer la vida útil de un producto a partir de datos de tres lotes.</p><p>Desarrollo: la vida útil se asigna como el tiempo en que el límite de confianza de una cola del 95 % de la curva de regresión del atributo crítico (por ejemplo, la valoración, que disminuye) cruza el criterio de aceptación. Si el atributo puede aumentar o disminuir se usan límites de dos colas. Antes de combinar los lotes se prueba la igualdad de pendientes e interceptos (análisis de covarianza) con un nivel de significancia de 0,25; si p &gt; 0,25, los datos pueden agruparse y se obtiene una sola vida útil con mayor precisión. Si no pueden combinarse, la vida útil se basa en el lote con el menor tiempo estimado (peor caso). La extrapolación más allá del periodo observado es limitada y debe justificarse; ICH Q1E permite, para productos a temperatura ambiente sin cambio significativo en el acelerado y con datos susceptibles de análisis estadístico, proponer hasta el doble del periodo de largo plazo cubierto, sin superar 12 meses por encima de él. Si hubo cambio significativo en el acelerado, la vida útil se basa solo en los datos de largo plazo y la extrapolación no procede, como recoge el numeral 3.8.1 de la guía colombiana.</p><p>Ejemplo aplicado: cápsulas de omeprazol, especificación de valoración 90,0 %–110,0 %. Datos a 30 °C/75 % HR de tres lotes a 0, 3, 6, 9 y 12 meses; la valoración baja de 100,5 % a 98,2 % en promedio, sin cambio significativo a 40 °C/75 % HR. Los productos de degradación aumentan, pero se mantienen lejos del límite. Paso 1: graficar cada lote y verificar linealidad. Paso 2: análisis de covarianza: p de pendientes = 0,41 y p de interceptos = 0,33, por lo que se combinan. Paso 3: la regresión combinada con límite inferior de confianza del 95 % cruza 90,0 % hacia el mes 40. Paso 4: aplicar el límite de extrapolación: con 12 meses observados, la propuesta máxima es 24 meses. Paso 5: también se evalúa el atributo que se agota primero (impurezas) y se elige el menor resultado. Paso 6: se solicita vida útil de 24 meses con la leyenda \"Almacenar a temperatura no mayor de 30 °C. Protéjase de la humedad\", y se presenta compromiso de continuar el estudio hasta 24 meses y reportarlo.</p><p>Puntos clave:<br>1. Use el límite de confianza del 95 % y no la línea de regresión promedio para fijar la vida útil.<br>2. Combine lotes solo si la prueba estadística lo permite (p &gt; 0,25); si no, aplique el lote de peor caso.<br>3. La extrapolación es la excepción: documente por qué procede y respete los límites de ICH Q1E y de la guía nacional.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Estabilidad de biológicos: ICH Q5C y Resolución 3690 de 2016', 'Clase 4 · Particularidades de los biológicos', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante compara los requisitos de estabilidad de biológicos (potencia, agregados, cadena de frío, estabilidad natural, salidas accidentales de temperatura) con los de síntesis química.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.ema.europa.eu/en/documents/scientific-guideline/quality-biotechnological-products-stability-testing-biotechnological/biological-products_en.pdf","title":"Quality of Biotechnological Products: Stability Testing of Biotechnological/Biological Products (ICH Q5C)","description":"EMA / ICH (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_3690_2016.htm","title":"[Página web] Resolución 3690 de 2016 – Guía de Estabilidad de Medicamentos Biológicos","description":"Normograma INVIMA (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Ciclo de vida, dossier y requerimientos INVIMA', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: la estabilidad después de la aprobación', 'Clase 1 · Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante resume las obligaciones de estabilidad posteriores al registro y cómo se presentan y defienden ante el INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preguntas_20y_20respuestas_20res_203157_20de_202018_20-_20abril_202024_20v6_14pdf","title":"Preguntas y respuestas Resolución 3157 de 2018 – Abril 2024 V.6","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Compromisos de estabilidad posaprobación', 'Clase 2 · Compromisos y estabilidad on-going', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante describe cuándo se presenta un compromiso de estabilidad, qué contiene y cómo se cumple y reporta.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_3157_2018.htm","title":"[Página web] Resolución 3157 de 2018 – Guía para el desarrollo y presentación de los estudios de estabilidad de medicamentos de síntesis química (texto compilado con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ema.europa.eu/en/ich-q1a-r2-stability-testing-new-drug-substances-drug-products-scientific-guideline","title":"[Página web] ICH Q1A (R2) Stability testing of new drug substances and drug products – Scientific guideline","description":"EMA (EN) · mismo documento, versión en inglés del sitio"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Programa on-going y cambios que requieren nuevos datos de estabilidad', 'Clase 2 · Compromisos y estabilidad on-going', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante interpreta el programa de aseguramiento continuo (un lote por año) y qué cambios exigen estudios, incluida la flexibilidad de la Resolución 0525 de 2025 para traslados de planta.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_3157_2018.htm","title":"[Página web] Resolución 3157 de 2018 – Guía para el desarrollo y presentación de los estudios de estabilidad de medicamentos de síntesis química (texto compilado con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/DIJ/resolucion-0525-de-2025.pdf","title":"Resolución 0525 de 2025 – Modifica los numerales 3.8 y 3.8.1 del Anexo Técnico de la Resolución 3157 de 2018","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/biblioteca/preguntas_20y_20respuestas_20res_203157_20de_202018_20-_20abril_202024_20v6_14pdf","title":"Preguntas y respuestas Resolución 3157 de 2018 – Abril 2024 V.6","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Presentación de la información de estabilidad en el dossier', 'Clase 3 · Presentación en el dossier y requerimientos', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante aplica la estructura de presentación de los datos de estabilidad del IFA y del producto terminado (secciones de estabilidad del CTD: resumen, protocolo, compromisos y datos) conforme a la guía nacional.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_3157_2018.htm","title":"[Página web] Resolución 3157 de 2018 – Guía para el desarrollo y presentación de los estudios de estabilidad de medicamentos de síntesis química (texto compilado con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://extranet.who.int/prequal/sites/default/files/document_files/TRS1010_Annex10.pdf","title":"Stability testing of active pharmaceutical ingredients and finished pharmaceutical products (WHO TRS 1010, Annex 10, 2018)","description":"OMS – Precalificación (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/biblioteca/preguntas_20y_20respuestas_20res_203157_20de_202018_20-_20abril_202024_20v6_14pdf","title":"Preguntas y respuestas Resolución 3157 de 2018 – Abril 2024 V.6","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Requerimientos INVIMA frecuentes en estabilidad', 'Clase 3 · Presentación en el dossier y requerimientos', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante identifica las causas más comunes de requerimientos de estabilidad y cómo prevenirlas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: reconocer los requerimientos más frecuentes del INVIMA sobre estabilidad y preparar el expediente para prevenirlos.</p><p>Desarrollo: el análisis de la Resolución 3157 de 2018, su documento de preguntas y respuestas y la experiencia de los evaluadores permite agrupar los requerimientos en siete familias:<br>1. Condición climática: estudios solo a 25 °C/60 % HR sin justificación técnica y experimental para Colombia (zona IVb, 30 °C/75 % HR).<br>2. Lotes insuficientes o no representativos: menos de tres lotes primarios (o dos para IFA estable sin justificación), lotes de laboratorio o con formulación o envase diferente al que se comercializará.<br>3. Envase: estudio realizado en un envase distinto al solicitado, o falta de datos de pérdida de agua en productos acuosos en envases semipermeables.<br>4. Métodos analíticos: ausencia de demostración de que el método es indicador de estabilidad (degradación forzada) o de su validación.<br>5. Información incompleta: informe sin protocolo, sin certificados de análisis por punto, sin cromatogramas representativos, sin registro de condiciones de las cámaras o sin firmas.<br>6. Vida útil no sustentada: extrapolación sin análisis estadístico, vida útil mayor que los datos, o cambio significativo en el acelerado sin estudio intermedio.<br>7. Estudios complementarios faltantes: fotoestabilidad, estabilidad en uso de reconstituidos o multidosis, datos de estabilidad del IFA del fabricante (art. 5 de la Resolución 3157).</p><p>Ejemplo aplicado: el INVIMA requiere a un titular de una solución oftálmica multidosis en frasco de LDPE: \"Allegar estudio de estabilidad en uso que soporte el periodo después de abierto declarado en la etiqueta y datos de pérdida de peso a baja humedad relativa\". La respuesta debe incluir el protocolo y el informe del estudio en uso (al menos dos lotes, simulación de uso real, puntos inicial, intermedios y final, incluyendo eficacia del conservante si aplica) y el estudio de pérdida de agua conforme al numeral 3.8.3 (cambio significativo: 5 % de pérdida tras 3 meses a 40 °C y no más de 25 % HR, o su equivalente calculado). Si el estudio no está terminado, se propone un periodo de uso más corto con el compromiso de completar el estudio.</p><p>Puntos clave:<br>1. La mayoría de requerimientos de estabilidad se previenen con una lista de chequeo antes de radicar.<br>2. Coherencia: lote, envase, fórmula y fabricante del estudio deben coincidir con lo solicitado en el registro.<br>3. Responda con evidencia completa (protocolo, informe, datos crudos, análisis estadístico), no solo con una carta explicativa.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso integrador: respuesta a un auto de requerimiento de estabilidad', 'Clase 4 · Casos prácticos integradores', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante estructura la respuesta técnica a un auto del INVIMA que cuestiona vida útil, fotoestabilidad, método indicador y diseño del estudio.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: integrar lo aprendido para resolver un requerimiento complejo de estabilidad en una solicitud de registro sanitario nuevo.</p><p>Desarrollo del caso: un laboratorio nacional radica la solicitud de registro de una solución inyectable de ondansetrón 2 mg/mL en ampollas de vidrio tipo I, protegida de la luz. Presenta tres lotes piloto con 6 meses a 30 °C/75 % HR y 6 meses a 40 °C/75 % HR, y solicita una vida útil de 36 meses. El INVIMA emite auto con cuatro requerimientos: 1) justificar la vida útil solicitada; 2) allegar el estudio de fotoestabilidad; 3) demostrar que el método de valoración es indicador de estabilidad; 4) aclarar por qué la ampolla no se estudió en la orientación más desfavorable.</p><p>Resolución paso a paso:<br>1. Vida útil: con 6 meses de largo plazo, aunque no hay cambio significativo en el acelerado, la extrapolación permitida por ICH Q1E no alcanza 36 meses. Se recalcula con regresión y límite de confianza del 95 %; se propone una vida útil provisional de 12 meses y un compromiso de estabilidad para completar 36 meses en los tres lotes y en los tres primeros lotes industriales, con solicitud posterior de ampliación por modificación.<br>2. Fotoestabilidad: se ejecuta según ICH Q1B sobre un lote, con exposición a no menos de 1,2 millones de lux·hora y 200 W·h/m² de ultravioleta cercano, expuesto directamente, en ampolla y en el estuche secundario. Si la degradación solo se controla con el estuche, la etiqueta debe decir \"Conservar en su empaque original para protegerlo de la luz\".<br>3. Método indicador de estabilidad: se anexa el estudio de degradación forzada (ácido, base, oxidación, calor y luz) con pureza de pico y balance de masas, y la validación de especificidad.<br>4. Orientación: para ampollas de vidrio selladas la interacción con el cierre no aplica; se justifica técnicamente. Si fuera un vial con tapón, se habría estudiado en posición invertida.</p><p>Se arma la respuesta con carta, tabla de correspondencia requerimiento–evidencia, protocolos, informes firmados y análisis estadístico, dentro del plazo concedido.</p><p>Puntos clave:<br>1. Responda cada numeral del auto con evidencia trazable y una tabla de correspondencia.<br>2. Una vida útil más corta con compromiso es preferible a una negación por falta de soporte.<br>3. Fotoestabilidad y método indicador son requisitos de diseño, no anexos opcionales.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso integrador: renovación con datos on-going y cambio de planta', 'Clase 4 · Casos prácticos integradores', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante prepara el componente de estabilidad de una renovación y de una modificación por traslado de planta conforme a la Resolución 0525 de 2025.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: preparar el componente de estabilidad de una renovación de registro sanitario y de una modificación por cambio de planta, usando los datos del programa on-going.</p><p>Desarrollo: la Resolución 3157 de 2018 incluye en su ámbito a los titulares que renuevan el registro y a quienes modifican el registro por cambios que afectan la estabilidad. Además exige un programa de aseguramiento continuo de la estabilidad (on-going): al menos un lote de producción por año, por concentración y tipo de envase, con investigación de resultados fuera de especificación y de tendencias atípicas. En la renovación, esos datos son la mejor evidencia de que la vida útil aprobada sigue siendo válida.</p><p>Caso A, renovación: tabletas de atorvastatina 20 y 40 mg en blíster Alu/Alu, vida útil aprobada de 24 meses. El titular tiene cinco lotes on-going completos a 30 °C/75 % HR. Pasos: 1) consolidar los datos en tablas por lote y atributo; 2) graficar tendencias y verificar que ningún lote se acerque al límite de especificación; 3) documentar las investigaciones de resultados atípicos; 4) confirmar que fórmula, fabricante, proceso y envase no han cambiado (si cambiaron, revisar si se tramitó la modificación); 5) presentar el resumen firmado por el responsable técnico. Si un lote mostró una tendencia en impurezas cercana al límite, se analiza la causa y se considera reducir la vida útil.</p><p>Caso B, cambio de planta: el fabricante traslada la producción a una nueva sede sin cambiar proceso ni equipos y el principio activo es conocido como estable. Gracias a la Resolución 0525 de 2025, puede presentar estudios acelerados y de largo plazo de al menos 3 meses en lugar de 6, siempre que no haya cambios significativos, entregar al INVIMA los resultados a 6 meses cuando los obtenga y continuar entregando datos hasta completar la vida útil, incluidos resultados fuera de especificación. Este beneficio aplica a fabricantes con certificación de BPM otorgada por el INVIMA y no aplica a un cambio de fabricante.</p><p>Puntos clave:<br>1. El programa on-going no es solo una obligación de BPM: es el soporte de la renovación y de la vigilancia de la vida útil.<br>2. Antes de cualquier cambio (fórmula, proceso, planta, envase, fabricante de IFA), evalúe su impacto en la estabilidad y el trámite que corresponde.<br>3. La flexibilidad de la Resolución 0525 de 2025 es específica para traslado de planta con IFA estable; no la extienda a otros cambios.</p>"}'::jsonb);

END
$curso$;

-- ─── 9. Curso de Bioequivalencia y Requisitos Regulatorios en Colombia (34 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Bioequivalencia y Requisitos Regulatorios en Colombia' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Bioequivalencia y Requisitos Regulatorios en Colombia', 'Curso práctico sobre biodisponibilidad, bioequivalencia e intercambiabilidad de medicamentos de síntesis química en Colombia. Recorre la Resolución 1124 de 2016 y sus actualizaciones (Res. 662 de 2022 y listados del INVIMA vigentes a 2026), las guías de la OMS, ICH, FDA y EMA, el diseño de estudios, las bioexenciones BCS y la presentación de estudios al INVIMA.', '<p>Curso práctico sobre biodisponibilidad, bioequivalencia e intercambiabilidad de medicamentos de síntesis química en Colombia. Recorre la Resolución 1124 de 2016 y sus actualizaciones (Res. 662 de 2022 y listados del INVIMA vigentes a 2026), las guías de la OMS, ICH, FDA y EMA, el diseño de estudios, las bioexenciones BCS y la presentación de estudios al INVIMA.</p><h3>Objetivo general</h3><p>Que el químico farmacéutico determine cuándo un medicamento requiere estudio de bioequivalencia o bioexención, interprete el diseño y los resultados de un estudio y prepare y defienda ante el INVIMA la documentación de BD/BE conforme a la normativa vigente.</p><h3>A quién va dirigido</h3><p>Químicos farmacéuticos y profesionales de asuntos regulatorios, desarrollo galénico, aseguramiento de calidad e investigación clínica de laboratorios fabricantes e importadores en Colombia.</p><h3>Contexto normativo</h3><p>Colombia — normativa INVIMA / MinSalud</p>',
          'Asuntos regulatorios', 'intermedio', 'Que el químico farmacéutico determine cuándo un medicamento requiere estudio de bioequivalencia o bioexención, interprete el diseño y los resultados de un estudio y prepare y defienda ante el INVIMA la documentación de BD/BE conforme a la normativa vigente.', 'Químicos farmacéuticos y profesionales de asuntos regulatorios, desarrollo galénico, aseguramiento de calidad e investigación clínica de laboratorios fabricantes e importadores en Colombia.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. Fundamentos de biodisponibilidad, bioequivalencia e intercambiabilidad', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: por qué la bioequivalencia importa en Colombia', 'Clase 1 · Clase 1 – Introducción al curso', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>El estudiante conoce el propósito del curso, el papel de la BE en la calidad de los genéricos y la ruta de aprendizaje hasta la presentación de estudios al INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/MET/abece-biodisponiblidad-bioequivalencia.pdf","title":"ABECÉ de la guía de Biodisponibilidad (BD) y Bioequivalencia (BE)","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.saludcapital.gov.co/CTDLab/Publicaciones/2024/Abece_bioequivalencia.pdf","title":"Biodisponibilidad y Bioequivalencia: preguntas frecuentes (INVIMA)","description":"INVIMA (alojado en Secretaría Distrital de Salud de Bogotá) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Biodisponibilidad y bioequivalencia: definiciones y bases farmacocinéticas', 'Clase 2 · Conceptos esenciales', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Diferencia biodisponibilidad absoluta y relativa, y entiende la bioequivalencia como ausencia de diferencias significativas en velocidad y magnitud de absorción.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_bioequivalencia/Anexotecnico1resolucion11242016Guiadebiodisponibi.pdf","title":"Anexo técnico 1 Res. 1124 de 2016: Guía de Biodisponibilidad y Bioequivalencia de productos farmacéuticos","description":"INVIMA / MinSalud (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_bioequivalencia/Series-Red-PARF-8-span.pdf","title":"Red PARF Documento Técnico N.º 8: Marco para la ejecución de los requisitos de equivalencia para los productos farmacéuticos","description":"OPS / Red PARF (alojado por INVIMA) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Equivalencia farmacéutica, equivalencia terapéutica e intercambiabilidad', 'Clase 2 · Conceptos esenciales', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara alternativas farmacéuticas, equivalentes farmacéuticos y equivalentes terapéuticos, y comprende cuándo un multifuente es intercambiable según la OMS.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.who.int/publications/m/item/annex-6-trs-1003","title":"[Página web] TRS 1003 – Annex 6: Multisource (generic) pharmaceutical products: guidelines on registration requirements to establish interchangeability","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cdn.who.int/media/docs/default-source/medicines/norms-and-standards/guidelines/regulatory-standards/trs1052_annex8.pdf","title":"TRS 1052 – Annex 8: Multisource (generic) pharmaceutical products (republicación 2024 del TRS 1003 Anexo 6)","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_bioequivalencia/Series-Red-PARF-8-span.pdf","title":"Red PARF Documento Técnico N.º 8: Marco para la ejecución de los requisitos de equivalencia para los productos farmacéuticos","description":"OPS / Red PARF (alojado por INVIMA) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Medicamento de referencia y comparador: cómo se define y dónde se consulta', 'Clase 2 · Conceptos esenciales', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Identifica qué es el producto de referencia, cómo lo establece el INVIMA en sus listados y cómo consultar los medicamentos con BE aprobada.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/listado-de-medicamentos-con-aprobacion-de-estudios-de-bioequivalencia-enero-2026","title":"Listado de medicamentos con aprobación de estudios de bioequivalencia – enero 2026","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"http://apps.who.int/iris/bitstream/handle/10665/176954/9789240693968_eng.pdf?sequence=1&isAllowed=y#page=199&zoom=auto,-344,680","title":"WHO Guidance on selection of comparator pharmaceutical products (2015)","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/bioequivalencia","title":"[Página web] Bioequivalencia: normatividad, listados, formatos y certificación","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: ¿mi producto requiere estudio de bioequivalencia?', 'Clase 3 · Casos prácticos introductorios', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica el listado vigente de moléculas con exigencia de BE para decidir si un producto del portafolio debe presentar estudio o bioexención.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/listado-de-moleculas-con-exigencia-de-estudios-de-bioequivalencia-_septiembre-2026pdf","title":"Listado de moléculas con exigencia de estudios de bioequivalencia – septiembre 2026","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_bioequivalencia/P-Anexo-tecnico-2-Resolucion-1124-de-2016-Listado.pdf","title":"Anexo técnico 2 Res. 1124 de 2016: Listado de principios activos que deben presentar estudios de BE","description":"INVIMA / MinSalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: selección y soporte documental del comparador', 'Clase 3 · Casos prácticos introductorios', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la selección y documentación del producto de referencia para un estudio que se presentará al INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: que el estudiante seleccione y documente correctamente el producto de referencia (comparador) de un estudio de bioequivalencia que se presentará al INVIMA.</p><p>Desarrollo: el producto de referencia es aquel con el que se compara el medicamento multifuente; por regla general es el innovador que desarrolló la investigación clínica y cuya eficacia y seguridad están demostradas. La Resolución 1124 de 2016 (Anexo técnico 2, actualizado por el INVIMA según el artículo 12 modificado por la Resolución 662 de 2022) asocia a cada principio activo de la lista un comparador de referencia. Cuando ese producto no se comercializa en Colombia, el interesado puede adquirirlo en otro mercado e importarlo siguiendo el procedimiento del INVIMA, y debe poder demostrar su origen (factura, lote, vencimiento, titular de la autorización y país de compra). La OMS recomienda elegir el comparador del mercado del innovador o de un mercado bien regulado, y publica una lista internacional de comparadores; la Red PARF (Documento Técnico 8) propone escenarios para países donde el innovador no está disponible.</p><p>Errores frecuentes que generan requerimientos: usar como referencia otro genérico nacional; no identificar el titular y el país de compra del comparador; usar una concentración o forma farmacéutica distinta sin justificación; no adjuntar el certificado de análisis o los soportes de compra; y presentar un comparador con fecha de vencimiento anterior a la realización del estudio.</p><p>Ejemplo aplicado: un laboratorio nacional va a renovar el registro de tabletas de levetiracetam 500 mg (molécula del listado). Revisa el listado vigente de moléculas con exigencia de BE (septiembre 2026) y confirma el comparador indicado. Como el producto innovador no se vende en el país, compra unidades en un mercado de referencia, guarda la factura y la trazabilidad del lote, gestiona el ingreso como suministro para estudio (formato ASS-RSA-FM104 si el estudio se hace en Colombia) y documenta en el informe del estudio la identificación completa del comparador. Si el estudio se hizo en el exterior, verifica que el comparador usado allí coincida con el exigido por el INVIMA; si no coincide, debe justificarlo técnicamente o el estudio podría no ser aceptado.</p><p>Puntos clave:<br>1. El comparador debe ser el exigido en el listado vigente del INVIMA, en general el innovador; nunca otro genérico.<br>2. Documente siempre el origen: titular, país de compra, lote, vencimiento y certificado de análisis.<br>3. Verifique la correspondencia del comparador antes de iniciar el estudio, no después: es la causa más costosa de rechazo.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Marco regulatorio colombiano de BD/BE', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: normas e instituciones de la BE en Colombia', 'Clase 1 · Clase 1 – Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume las normas vigentes (Decreto 677/1995, Res. 1124/2016, Res. 662/2022, Res. 2378/2008) y el rol del MinSalud y del INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/bioequivalencia","title":"[Página web] Bioequivalencia: normatividad, listados, formatos y certificación","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Resolución 1124 de 2016: estructura, alcance y anexos técnicos', 'Clase 2 · Resolución 1124 de 2016 y sus actualizaciones', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el alcance de la Res. 1124 de 2016, sus tres anexos técnicos (guía BD/BE, listado de principios activos, guía de inspección) y el régimen de certificados aceptados.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/resolucion_minsaludps_1124_2016.htm","title":"[Página web] Resolución 1124 de 2016 (texto compilado con notas de vigencia)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_bioequivalencia/Invima.pdf","title":"Bioequivalencia en Colombia: Resolución 1124 de 2016 (presentación evento iberoamericano)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/MET/abece-biodisponiblidad-bioequivalencia.pdf","title":"ABECÉ de la guía de Biodisponibilidad (BD) y Bioequivalencia (BE)","description":"Ministerio de Salud y Protección Social (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Resolución 662 de 2022: qué cambió', 'Clase 2 · Resolución 1124 de 2016 y sus actualizaciones', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara la versión original de la Res. 1124 con las modificaciones de la Res. 662 de 2022: ámbito, agencias aceptadas, aprobación de protocolos y publicación anual del listado.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/resolucion_minsaludps_0662_2022.htm","title":"[Página web] Resolución 662 de 2022 (modifica las Resoluciones 1124 de 2016 y 3619 de 2013)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://consultorsalud.com/?p=185380","title":"[Página web] Cambiarán los requisitos para realizar estudios de Biodisponibilidad y Bioequivalencia en Colombia","description":"Consultorsalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Listados vigentes: moléculas con exigencia de BE, clasificación BCS y estrecho margen terapéutico', 'Clase 2 · Resolución 1124 de 2016 y sus actualizaciones', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los listados más recientes del INVIMA (moléculas septiembre 2026, BCS diciembre 2025, NTI julio 2024) y sabe cómo hacerles seguimiento.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/listado-de-moleculas-con-exigencia-de-estudios-de-bioequivalencia-_septiembre-2026pdf","title":"Listado de moléculas con exigencia de estudios de bioequivalencia – septiembre 2026","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/listado_-bcs_diciembre_2025","title":"Listado BCS – diciembre 2025 (clasificación biofarmacéutica de principios activos del Anexo técnico 2)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_sala_especializada_medicamentos_sintesis/propuesta_actualizaci_C3_B3n_listado_de_estrecho_margen_terap_C3_A9utico_v._julio_2024_-_copia.pdf","title":"Listado de principios activos de estrecho margen terapéutico – julio 2024","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Resolución 2378 de 2008: Buenas Prácticas Clínicas', 'Clase 3 · Buenas Prácticas Clínicas y certificación de centros', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe las obligaciones de BPC para instituciones que investigan con medicamentos, la certificación por el INVIMA y el papel de los comités de ética.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_2378_2008.htm","title":"[Página web] Resolución 2378 de 2008: Buenas Prácticas Clínicas para instituciones que conducen investigación con medicamentos en humanos","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/medicamentos-de-sintesis-quimica-y-biologica/licenciamiento-auditorias-y-certificaciones/certificaciones-en-buenas-practicas","title":"[Página web] Procesos de certificación en Buenas Prácticas Clínicas – Medicamentos","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Certificación en Buenas Prácticas de BD/BE de centros clínicos y analíticos', 'Clase 3 · Buenas Prácticas Clínicas y certificación de centros', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el proceso de certificación de centros de BD/BE ante el INVIMA (vigencia de tres años), sus requisitos y la guía de inspección.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_bioequivalencia/ASS-AYC-GU009.pdf","title":"ASS-AYC-GU009 Guía para la solicitud de certificación en Buenas Prácticas de BD y BE","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_bioequivalencia/Anexotecnico3Resolucion1124de2016GuiadeinspeccionBD.pdf","title":"Anexo técnico 3 Res. 1124 de 2016: Guía de inspección de centros de BD/BE","description":"INVIMA / MinSalud (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_bioequivalencia/Listado_20de_20centros_20certificados_20en_20BD_20y_20BE_20v._20Septiembre_202023_20_1_.pdf","title":"Listado de centros que han solicitado certificación en BD y BE (septiembre 2023)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: renovación de un registro que exige estudio de BE', 'Clase 3 · Buenas Prácticas Clínicas y certificación de centros', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica la Res. 1124 de 2016 y la Circular 175 de 2017 para planear la renovación de un registro con molécula del listado.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/circular_invima_0175_2017.htm","title":"[Página web] Circular 175 de 2017: Implementación Resolución 1124 de 2016 (renovaciones que requieren BD/BE)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normograma.invima.gov.co/compilacion/docs/resolucion_minsaludps_0662_2022.htm","title":"[Página web] Resolución 662 de 2022 (modifica las Resoluciones 1124 de 2016 y 3619 de 2013)","description":"Normograma INVIMA (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Referentes internacionales y diseño de estudios de BE', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: armonización internacional de la BE', 'Clase 1 · Clase 1 – Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume cómo la OMS, la ICH, la FDA y la EMA orientan los criterios que adopta el INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://extranet.who.int/prequal/medicines/bioequivalence","title":"[Página web] Bioequivalence – WHO Prequalification of Medicines (guías, comparadores, formatos)","description":"OMS – Precalificación (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'OMS: TRS 1003 Anexo 6 y su republicación en TRS 1052 Anexo 8', 'Clase 2 · Guías de referencia', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta la guía de la OMS sobre requisitos de registro para establecer intercambiabilidad, base del Anexo técnico 1 colombiano.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.who.int/publications/m/item/annex-6-trs-1003","title":"[Página web] TRS 1003 – Annex 6: Multisource (generic) pharmaceutical products: guidelines on registration requirements to establish interchangeability","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cdn.who.int/media/docs/default-source/medicines/norms-and-standards/guidelines/regulatory-standards/trs1052_annex8.pdf","title":"TRS 1052 – Annex 8: Multisource (generic) pharmaceutical products (republicación 2024 del TRS 1003 Anexo 6)","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'ICH M13A: bioequivalencia de formas sólidas orales de liberación inmediata', 'Clase 2 · Guías de referencia', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los requisitos armonizados de ICH M13A (2024): diseño, condiciones en ayuno y con alimentos, muestreo y criterios de aceptación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://database.ich.org/sites/default/files/ICH_M13A_Step4_Final_Guideline_2024_0723.pdf","title":"ICH M13A: Bioequivalence for Immediate-Release Solid Oral Dosage Forms (Step 4, 23 julio 2024)","description":"ICH (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.ema.europa.eu/en/documents/scientific-guideline/ich-m13a-guideline-bioequivalence-immediate-release-solid-oral-dosage-forms-questions-answers_en.pdf","title":"ICH M13A Guideline on bioequivalence for immediate-release solid oral dosage forms: Questions and answers","description":"EMA (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.fda.gov/media/184559/download","title":"M13A: Bioequivalence for Immediate-Release Solid Oral Dosage Forms – Implementing the Final Guidance (webinar SBIA)","description":"FDA (EN) · misma dirección, corregido el «www.»"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Guías de la EMA y la FDA: similitudes y diferencias', 'Clase 2 · Guías de referencia', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara la guía de BE de la EMA y la guía de enfoques estadísticos de la FDA (final, mayo 2026) frente a la norma colombiana.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://ema.europa.eu/en/documents/scientific-guideline/guideline-investigation-bioequivalence-rev1_en.pdf","title":"Guideline on the Investigation of Bioequivalence (CPMP/EWP/QWP/1401/98 Rev. 1/Corr)","description":"EMA (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.fda.gov/regulatory-information/search-fda-guidance-documents/statistical-approaches-establishing-bioequivalence","title":"[Página web] Statistical Approaches to Establishing Bioequivalence (guía final, mayo 2026)","description":"FDA (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Diseño cruzado 2x2, población, lavado y muestreo', 'Clase 3 · Diseño de estudios de bioequivalencia', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el diseño estándar de BE: aleatorización, voluntarios sanos, número mínimo de sujetos, periodo de lavado y tiempos de muestreo.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_bioequivalencia/Anexotecnico1resolucion11242016Guiadebiodisponibi.pdf","title":"Anexo técnico 1 Res. 1124 de 2016: Guía de Biodisponibilidad y Bioequivalencia de productos farmacéuticos","description":"INVIMA / MinSalud (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://dnfd.minsa.gob.pa/sites/default/files/2026-02/Estudios%20de%20Bioequivalencia%20In%20Vivo_Seminario%20Taller_21y22OCT2025.pdf","title":"Estudios de Bioequivalencia In Vivo – Seminario Taller (octubre 2025)","description":"Dirección Nacional de Farmacia y Drogas, MINSA Panamá (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Parámetros AUC y Cmax, intervalo de confianza 90 % y criterio 80–125 %', 'Clase 3 · Diseño de estudios de bioequivalencia', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el análisis estadístico de la BE y aplica el criterio de aceptación sobre la razón de medias geométricas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: interpretar los parámetros farmacocinéticos y el análisis estadístico con el que se concluye la bioequivalencia.</p><p>Desarrollo: en un estudio de BE de dosis única se miden concentraciones plasmáticas del principio activo a lo largo del tiempo y se calculan, para cada voluntario y cada periodo, los parámetros primarios: AUC0-t (área bajo la curva hasta el último tiempo con concentración cuantificable, refleja la cantidad absorbida), AUC0-inf (extrapolada a infinito) y Cmax (concentración máxima, refleja la velocidad de absorción). Tmax, t1/2 y la constante de eliminación son parámetros de apoyo. Los datos de AUC y Cmax se transforman a logaritmo natural y se analizan con un ANOVA que incluye los factores secuencia, sujeto dentro de secuencia, periodo y formulación. Del ANOVA se obtiene la razón de medias geométricas (Test/Referencia) y su intervalo de confianza del 90 %, equivalente a aplicar dos pruebas unilaterales al 5 % (procedimiento TOST de Schuirmann). Se concluye bioequivalencia cuando el IC90 % de la razón queda completamente dentro de 80,00–125,00 % para AUC y Cmax, que es el criterio del Anexo técnico 1 de la Resolución 1124 de 2016, de la OMS, de ICH M13A y de las guías de la EMA y la FDA. Para estrecho margen terapéutico el intervalo se estrecha a 90,00–111,11 %, y para fármacos altamente variables puede ampliarse solo el de Cmax con un diseño replicado.</p><p>El tamaño de muestra (mínimo 12 sujetos evaluables) depende del coeficiente de variación intrasujeto, de la razón esperada y de la potencia (80–90 %). Los datos no pueden excluirse por criterios estadísticos solamente; los criterios de exclusión (vómito, concentraciones predosis, muestras perdidas) deben estar en el protocolo.</p><p>Ejemplo aplicado: en un informe de BE de metformina 850 mg presentado con la solicitud de registro sanitario, el resultado para Cmax es 96,4 % (IC90 %: 88,1–105,5 %) y para AUC0-t 101,2 % (IC90 %: 95,3–107,4 %). Ambos intervalos están dentro de 80,00–125,00 %: el evaluador del INVIMA concluye BE. Si el IC90 % de Cmax hubiera sido 83,0–127,0 %, la prueba fallaría aunque la razón puntual estuviera cerca de 100 %.</p><p>Puntos clave:<br>1. La decisión se toma con el IC90 % de la razón de medias geométricas, no con la razón puntual ni con un valor p de diferencia.<br>2. AUC y Cmax son los parámetros primarios; ambos deben cumplir.<br>3. El análisis, los factores del ANOVA y el manejo de datos deben estar predefinidos en el protocolo.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Fármacos altamente variables y diseños replicados', 'Clase 4 · Situaciones especiales', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Comprende cuándo un fármaco es altamente variable y cómo se amplía el intervalo de Cmax mediante diseños replicados.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://ema.europa.eu/en/documents/scientific-guideline/guideline-investigation-bioequivalence-rev1_en.pdf","title":"Guideline on the Investigation of Bioequivalence (CPMP/EWP/QWP/1401/98 Rev. 1/Corr)","description":"EMA (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_bioequivalencia/Anexotecnico1resolucion11242016Guiadebiodisponibi.pdf","title":"Anexo técnico 1 Res. 1124 de 2016: Guía de Biodisponibilidad y Bioequivalencia de productos farmacéuticos","description":"INVIMA / MinSalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Medicamentos de estrecho margen terapéutico', 'Clase 4 · Situaciones especiales', 7, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los criterios más estrictos (90,00–111,11 %) y consulta el listado de principios activos NTI del INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_sala_especializada_medicamentos_sintesis/propuesta_actualizaci_C3_B3n_listado_de_estrecho_margen_terap_C3_A9utico_v._julio_2024_-_copia.pdf","title":"Listado de principios activos de estrecho margen terapéutico – julio 2024","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://ema.europa.eu/en/documents/scientific-guideline/guideline-investigation-bioequivalence-rev1_en.pdf","title":"Guideline on the Investigation of Bioequivalence (CPMP/EWP/QWP/1401/98 Rev. 1/Corr)","description":"EMA (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: planear el protocolo de un fármaco altamente variable y de uno NTI', 'Clase 4 · Situaciones especiales', 8, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta las decisiones de diseño, criterio de aceptación y aprobación de protocolo para dos casos con riesgos distintos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar los criterios de fármacos altamente variables (HVD) y de estrecho margen terapéutico (NTI) al planear el protocolo de un estudio que se presentará al INVIMA.</p><p>Desarrollo: un fármaco se considera altamente variable cuando su coeficiente de variación intrasujeto de Cmax es superior al 30 %. Con un diseño 2x2 convencional, esa variabilidad obliga a reclutar muchos voluntarios para que el IC90 % quepa en 80–125 %. Por eso el Anexo técnico 1 de la Resolución 1124 de 2016 y la guía de la EMA permiten, si se planea desde el protocolo, usar un diseño replicado (parcial de tres periodos, TRR/RTR/RRT, o completo de cuatro periodos, TRTR/RTRT) para estimar la variabilidad del producto de referencia y ampliar solo el intervalo de Cmax, hasta un máximo de 69,84–143,19 %; AUC sigue en 80,00–125,00 % y la razón puntual de Cmax debe quedar entre 80 y 125 %. COFEPRIS aplica el mismo enfoque. La FDA usa un enfoque distinto (RSABE) con su propio cálculo, y ICH M13A no trata aún HVD ni NTI: lo hará la guía M13C. En cambio, para un fármaco de estrecho margen terapéutico (lista del INVIMA de julio de 2024: warfarina, digoxina, fenitoína, carbamazepina, tacrolimus, metotrexato, entre otros) el intervalo se estrecha a 90,00–111,11 % para AUC y, cuando sea relevante, para Cmax, y no se admite ampliación.</p><p>Ejemplo aplicado: un laboratorio planea en Colombia un estudio de BE de un fármaco con CV intrasujeto de Cmax publicado cercano al 40 %. Diseña un estudio replicado parcial de tres periodos, justifica en el protocolo la variabilidad con literatura, predefine el método de ampliación y el tamaño de muestra, lo somete al comité de ética de la institución certificada y luego al INVIMA para aprobación del protocolo (Res. 662 de 2022, formato ASS-RSA-FM077 y guía ASS-RSA-GU061). Si el CV observado del producto de referencia resultara menor al 30 %, se aplican los límites convencionales. Para un segundo producto, tacrolimus, el equipo descarta cualquier ampliación y calcula el tamaño de muestra contra 90,00–111,11 %.</p><p>Puntos clave:<br>1. La ampliación por alta variabilidad aplica solo a Cmax, requiere diseño replicado y debe estar declarada en el protocolo antes del estudio.<br>2. Los fármacos NTI usan 90,00–111,11 % y nunca admiten ampliación.<br>3. Verifique siempre en el listado vigente del INVIMA si la molécula es NTI antes de calcular el tamaño de muestra.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Bioexenciones y perfiles de disolución', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: cuándo la disolución puede sustituir un estudio in vivo', 'Clase 1 · Clase 1 – Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume el concepto de bioexención y los tipos aceptados por el INVIMA: BCS, concentraciones adicionales y formas farmacéuticas exentas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_bioequivalencia/Espana-2.pdf","title":"Bio-exenciones basadas en el Sistema de Clasificación Biofarmacéutico (A. García Arieta, AEMPS – Bogotá 2016)","description":"AEMPS (alojado por INVIMA) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'BCS: solubilidad, permeabilidad y las cuatro clases', 'Clase 2 · Sistema de Clasificación Biofarmacéutica (ICH M9)', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los criterios de alta solubilidad y alta permeabilidad y usa el listado BCS del INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.ema.europa.eu/en/ich-m9-biopharmaceutics-classification-system-based-biowaivers-scientific-guideline","title":"[Página web] ICH M9 on biopharmaceutics classification system based biowaivers – Scientific guideline","description":"EMA (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://extranet.who.int/prequal/sites/default/files/document_files/trs1052_annex7.pdf","title":"TRS 1052 – Annex 7: WHO guideline on Biopharmaceutics Classification System-based biowaivers (2024)","description":"OMS (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/biblioteca/listado_-bcs_diciembre_2025","title":"Listado BCS – diciembre 2025 (clasificación biofarmacéutica de principios activos del Anexo técnico 2)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Requisitos de bioexención para clases I y III: excipientes y disolución', 'Clase 2 · Sistema de Clasificación Biofarmacéutica (ICH M9)', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara los requisitos de clase I y III según ICH M9 y el Anexo técnico 1, incluido el manejo de excipientes críticos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.ema.europa.eu/en/documents/scientific-guideline/ich-m9-biopharmaceutics-classification-system-based-biowaivers-step-5_en.pdf","title":"ICH M9 guideline on biopharmaceutics classification system-based biowaivers (EMA/CHMP/ICH/493213/2018)","description":"EMA / ICH (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_bioequivalencia/Espana-2.pdf","title":"Bio-exenciones basadas en el Sistema de Clasificación Biofarmacéutico (A. García Arieta, AEMPS – Bogotá 2016)","description":"AEMPS (alojado por INVIMA) (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Bioexención de concentraciones adicionales por proporcionalidad', 'Clase 2 · Sistema de Clasificación Biofarmacéutica (ICH M9)', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las condiciones para eximir concentraciones adicionales: mismo fabricante, proporcionalidad de fórmula y similitud de perfiles.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://extranet.who.int/prequal/sites/default/files/document_files/Additional_Strength_Biowaiver_Guideline_May2021.pdf","title":"PQT/MED annotations for additional strength biowaiver applications (mayo 2021)","description":"OMS – Precalificación (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_bioequivalencia/Anexotecnico1resolucion11242016Guiadebiodisponibi.pdf","title":"Anexo técnico 1 Res. 1124 de 2016: Guía de Biodisponibilidad y Bioequivalencia de productos farmacéuticos","description":"INVIMA / MinSalud (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Perfiles de disolución comparativos y factor de similitud f2', 'Clase 3 · Perfiles de disolución y casos', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Calcula e interpreta f2 respetando las condiciones de uso exigidas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: calcular e interpretar el factor de similitud f2 para comparar perfiles de disolución en bioexenciones y en cambios posaprobación.</p><p>Desarrollo: el perfil de disolución describe el porcentaje de principio activo disuelto en varios tiempos. Para comparar el producto de prueba (T) con el de referencia (R) se usa f2 = 50 × log10 {[1 + (1/n) Σ (Rt − Tt)²]^-0,5 × 100}, donde n es el número de tiempos de muestreo. Un f2 de 100 indica perfiles idénticos; un f2 de 50 corresponde a una diferencia promedio de aproximadamente 10 % en cada punto. Se considera que los perfiles son similares cuando f2 ≥ 50. Condiciones habituales de uso (OMS, EMA, ICH M9 y Anexo técnico 1 de la Res. 1124 de 2016): al menos 12 unidades por producto; mismos tiempos y condiciones para T y R; un mínimo de tres tiempos (sin contar el cero); máximo un punto después de que ambos productos alcancen 85 % disuelto; coeficiente de variación no mayor de 20 % en los primeros puntos y de 10 % en los demás. Si ambos productos disuelven ≥ 85 % en 15 minutos, se consideran similares sin calcular f2. Para bioexenciones BCS los ensayos se hacen en tres medios de pH 1,2, 4,5 y 6,8 (aparato de paletas a 50 rpm o canastillas a 100 rpm, 900 mL o menos).</p><p>Ejemplo aplicado: para una bioexención de una tableta clase I del listado BCS del INVIMA, los perfiles a pH 6,8 dan, a 10, 15, 20 y 30 minutos, R = 62, 78, 88, 95 % y T = 58, 74, 86, 94 %. Las diferencias son 4, 4, 2 y 1; la suma de cuadrados es 37 y su promedio 9,25. f2 = 50 × log10(100/√10,25) ≈ 50 × log10(31,2) ≈ 74,7. Como f2 ≥ 50, los perfiles son similares en ese medio; deben repetirse los cálculos en los otros dos pH. Ese resultado se presenta en el formato ASS-RSA-FM079 junto con el método, los equipos calibrados y los lotes usados.</p><p>Puntos clave:<br>1. f2 ≥ 50 indica similitud; no se calcula si ambos productos disuelven ≥ 85 % en 15 minutos.<br>2. Respete las condiciones de cálculo (12 unidades, ≥ 3 puntos, un solo punto después de 85 %, límites de CV) o el resultado no será aceptado.<br>3. En bioexenciones BCS la comparación se hace en pH 1,2, 4,5 y 6,8.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: solicitud de bioexención BCS ante el INVIMA', 'Clase 3 · Perfiles de disolución y casos', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la preparación completa de una bioexención BCS para la renovación de un producto clase I.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: preparar paso a paso una solicitud de bioexención basada en el Sistema de Clasificación Biofarmacéutica (BCS) para un producto de la lista del INVIMA.</p><p>Desarrollo: la bioexención permite sustituir el estudio in vivo por pruebas in vitro cuando el riesgo de no ser bioequivalente es bajo. Según ICH M9, la OMS (TRS 1052 Anexo 7) y el Anexo técnico 1 de la Resolución 1124 de 2016, aplica a formas sólidas orales de liberación inmediata con acción sistémica. Requisitos: (1) principio activo de alta solubilidad (la dosis más alta se disuelve en 250 mL o menos en el rango de pH 1,2–6,8 a 37 °C) y, para clase I, alta permeabilidad (absorción ≥ 85 %); (2) no ser de estrecho margen terapéutico; (3) excipientes: en clase I no deben afectar la absorción; en clase III deben ser cualitativamente iguales y cuantitativamente muy similares a los del comparador; (4) disolución: clase I muy rápida (≥ 85 % en 15 min) o rápida (≥ 85 % en 30 min) con f2 ≥ 50; clase III siempre muy rápida. No aplica a formas bucales o sublinguales ni a liberación modificada.</p><p>Ejemplo aplicado: un titular debe renovar el registro de tabletas de un antihipertensivo clasificado como clase I en el listado BCS del INVIMA (diciembre 2025). Pasos: 1) confirmar que la molécula está en el listado de exigencia (septiembre 2026) y su clase BCS; 2) verificar que no está en la lista de estrecho margen terapéutico (julio 2024); 3) comparar la fórmula cualicuantitativa con la del comparador y justificar excipientes críticos (sorbitol, manitol, laurilsulfato de sodio, polisorbato 80); 4) hacer los perfiles de disolución comparativos en los tres medios, con el lote del comparador correctamente documentado, en un laboratorio con capacidad técnica (la Resolución 662 de 2022 permite a laboratorios de control de calidad realizar BE in vitro); 5) calcular f2 si corresponde; 6) diligenciar el formato ASS-RSA-FM079 con la guía ASS-RSA-GU052 y radicarlo con la renovación. Si la molécula fuera clase II o IV, la bioexención BCS no procede y se requiere estudio in vivo.</p><p>Puntos clave:<br>1. La bioexención BCS solo aplica a clases I y III, en liberación inmediata oral y nunca a NTI.<br>2. En clase III los excipientes deben ser prácticamente iguales a los del comparador y la disolución muy rápida.<br>3. La clasificación válida es la del listado BCS vigente del INVIMA; si no figura, el solicitante debe demostrar solubilidad y permeabilidad.</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Presentación de estudios al INVIMA y requerimientos', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: el estudio de BE dentro del trámite sanitario', 'Clase 1 · Clase 1 – Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume en qué trámites se presenta el estudio (registro nuevo, renovación, modificación) y qué formatos usa el INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/bioequivalencia","title":"[Página web] Bioequivalencia: normatividad, listados, formatos y certificación","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Presentación de estudios de BD/BE: formato ASS-RSA-FM079 y guía ASS-RSA-GU052', 'Clase 2 · Formatos y procedimientos', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta cómo diligenciar el formato de presentación de estudios y qué soportes deben acompañarlo.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/ass-rsa-gu052pdf","title":"ASS-RSA-GU052 Guía para el diligenciamiento del formato de presentación de estudios de BD y BE","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/ass-rsa-fm079docx","title":"[Página web] ASS-RSA-FM079 Formato de presentación de estudios de BD y BE","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Aprobación de protocolos in vivo en Colombia y enmiendas', 'Clase 2 · Formatos y procedimientos', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica el procedimiento de aprobación de protocolos ante el INVIMA, con concepto previo del comité de ética, y la gestión de enmiendas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/ass-rsa-gu061pdf-1","title":"ASS-RSA-GU061 Guía para la presentación de protocolos y enmiendas de estudios de BD/BE","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/ass-rsa-fm077docx","title":"[Página web] ASS-RSA-FM077 Formato de presentación de protocolos de BD/BE","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/compilacion/docs/resolucion_minsaludps_0662_2022.htm","title":"[Página web] Resolución 662 de 2022 (modifica las Resoluciones 1124 de 2016 y 3619 de 2013)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Requerimientos y deficiencias frecuentes en estudios de BE', 'Clase 3 · Requerimientos y casos integradores', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Identifica las deficiencias más comunes en protocolos e informes de BE y cómo prevenirlas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://extranet.who.int/prequal/sites/default/files/document_files/Frequent-Deficiencies_BE-Protocols_April2025_0.pdf","title":"Frequent deficiencies in bioequivalence study protocols (abril 2025)","description":"OMS – Precalificación (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_bioequivalencia/CIRCULAR-No-1000-133-18.pdf","title":"Circular 1000-133-18: conclusiones de mesa de trabajo sobre la Resolución 1124 de 2016","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: respuesta a un requerimiento del INVIMA sobre un estudio de BE', 'Clase 3 · Requerimientos y casos integradores', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la respuesta estructurada a un auto de requerimiento con soportes trazables.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: analizar y responder un requerimiento del INVIMA relacionado con un estudio de bioequivalencia, dentro del plazo y con soportes completos.</p><p>Desarrollo: cuando el evaluador encuentra deficiencias en un estudio de BD/BE presentado con una solicitud de registro, renovación o modificación, emite un auto de requerimiento. El titular debe responder punto por punto y en el plazo otorgado; si no responde o la respuesta es insuficiente, la solicitud puede negarse o entenderse desistida. Los requerimientos más frecuentes, coherentes con las deficiencias que reporta la OMS en protocolos e informes, son: comparador no identificado o distinto al exigido; centro sin certificación en Buenas Prácticas de BD/BE o sin reconocimiento de una de las agencias aceptadas (Res. 1124 art. 5 modificado por Res. 662 de 2022); validación bioanalítica incompleta o sin reanálisis de muestras incurridas (ISR); tiempos de muestreo insuficientes alrededor de Tmax o que no cubren el AUC; exclusión de sujetos no prevista en el protocolo; falta de justificación del tamaño de muestra; ampliación de límites para HVD no declarada a priori; falta de la versión en español o de traducciones oficiales; y discrepancias entre la fórmula del lote del estudio y la fórmula que se registra.</p><p>Ejemplo aplicado: en la renovación de un medicamento con carbamazepina, el INVIMA requiere: (a) soporte de la certificación del centro clínico extranjero; (b) informe de validación del método bioanalítico; (c) justificación de que se aplicó el intervalo de estrecho margen terapéutico. El equipo regulatorio arma una matriz requerimiento–respuesta–soporte: adjunta el certificado de la agencia reconocida, el informe de validación con selectividad, linealidad, exactitud, precisión, estabilidad e ISR, y demuestra que el IC90 % de AUC fue 93,2–104,8 %, dentro de 90,00–111,11 %. Además confirma que el lote del estudio tiene la misma fórmula y el mismo proceso que el producto comercial. Si el estudio no cumplía el intervalo NTI, la respuesta honesta es reconocerlo y planear un nuevo estudio, pues no hay manera documental de subsanarlo.</p><p>Puntos clave:<br>1. Responda cada numeral del auto con evidencia trazable, no con explicaciones generales.<br>2. Verifique antes de radicar los errores típicos: comparador, certificación del centro, validación bioanalítica y criterios predefinidos.<br>3. Controle el plazo de respuesta: vencido, la solicitud se pierde.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso integrador: expediente de BE para un registro sanitario nuevo', 'Clase 3 · Requerimientos y casos integradores', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Integra listado, comparador, diseño, bioexención de concentraciones y formatos en el expediente de un genérico nuevo.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: integrar todo el curso en el expediente de bioequivalencia de un registro sanitario nuevo de un medicamento genérico ante el INVIMA.</p><p>Desarrollo: para un medicamento de síntesis química cuyo principio activo y forma farmacéutica están en el listado vigente de exigencia de BE, el estudio (o la bioexención) se presenta junto con la solicitud de registro sanitario. La ruta es: 1) verificar en el listado más reciente publicado por el INVIMA (al menos cada diciembre, art. 12 de la Res. 1124 modificado por la Res. 662 de 2022) la molécula, la forma farmacéutica y el comparador; 2) decidir la estrategia: estudio in vivo (en Colombia, con protocolo aprobado por el INVIMA previo concepto del comité de ética, o en el exterior en un centro certificado o reconocido por FDA, EMA, Health Canada, PMDA, Swissmedic, TGA, MHRA, OMS, una agencia de referencia nivel IV de OPS o el propio INVIMA) o bioexención BCS o por proporcionalidad de concentraciones; 3) asegurar que el lote del estudio sea representativo de la producción (lote piloto o industrial, misma fórmula y proceso); 4) compilar el informe: protocolo y enmiendas, aprobación ética, datos clínicos, validación bioanalítica, informe bioanalítico, análisis farmacocinético y estadístico, certificados del centro y del comparador; 5) diligenciar el formato ASS-RSA-FM079 siguiendo la guía ASS-RSA-GU052 e incluir el estudio en el dossier (módulo 5 del CTD si se usa ese formato).</p><p>Ejemplo aplicado: una empresa quiere registrar amlodipino 5 y 10 mg tabletas. El estudio in vivo se hizo con la concentración de 10 mg en un centro de la India certificado por la OMS, con resultado de IC90 % dentro de 80–125 % para AUC y Cmax. Para 5 mg solicita bioexención por concentración adicional: misma fábrica y proceso, composición proporcional y perfiles de disolución similares (f2 ≥ 50) entre 5 y 10 mg. Antes de radicar, el equipo confirma que el comparador usado en la India es el exigido por el INVIMA, que el certificado del centro estaba vigente a la fecha del estudio y que hay traducción al español de los apartados requeridos.</p><p>Puntos clave:<br>1. Empiece por el listado vigente y el comparador: definen todo el diseño.<br>2. Un estudio extranjero sirve si el centro está certificado o reconocido por una de las agencias que acepta el INVIMA.<br>3. Las concentraciones adicionales pueden eximirse si hay proporcionalidad de fórmula y similitud de perfiles de disolución.</p>"}'::jsonb);

END
$curso$;

-- ─── 10. Curso de Gestión Documental de Trámites ante el INVIMA (34 clases) ───
DO $curso$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  -- Si ya está, no se duplica.
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = 'Curso de Gestión Documental de Trámites ante el INVIMA' AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, level,
     objective, audience, duration_minutes, author_name, status, modality)
  VALUES ('edvanta', 'Curso de Gestión Documental de Trámites ante el INVIMA', 'Curso práctico para gestionar el ciclo documental de los trámites sanitarios en Colombia: Oficina Virtual del INVIMA, tarifas y pagos, consulta de expedientes y bases públicas, documentos legales, apostilla y traducción.', '<p>Curso práctico para gestionar el ciclo documental de los trámites sanitarios en Colombia: Oficina Virtual del INVIMA, tarifas y pagos, consulta de expedientes y bases públicas, documentos legales, apostilla y traducción. Incluye organización del expediente, control de versiones, matriz de vencimientos, indicadores, herramientas digitales y derechos de petición, con casos aplicados a trámites reales.</p><h3>Objetivo general</h3><p>Que el estudiante gestione de forma trazable, oportuna y sin rechazos la documentación de los trámites de medicamentos ante el INVIMA, desde la obtención y legalización de documentos hasta la radicación, el seguimiento, el archivo y el control de vencimientos del portafolio.</p><h3>A quién va dirigido</h3><p>Químicos farmacéuticos, analistas y coordinadores de asuntos regulatorios, auxiliares de registros sanitarios y profesionales de calidad de laboratorios, importadores y titulares de registros en Colombia.</p><h3>Contexto normativo</h3><p>Colombia — normativa INVIMA / MinSalud</p>',
          'Asuntos regulatorios', 'intermedio', 'Que el estudiante gestione de forma trazable, oportuna y sin rechazos la documentación de los trámites de medicamentos ante el INVIMA, desde la obtención y legalización de documentos hasta la radicación, el seguimiento, el archivo y el control de vencimientos del portafolio.', 'Químicos farmacéuticos, analistas y coordinadores de asuntos regulatorios, auxiliares de registros sanitarios y profesionales de calidad de laboratorios, importadores y titulares de registros en Colombia.',
          1200, 'Edvanta', 'borrador', 'asincronica')
  RETURNING id INTO v_curso;

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 1. El área regulatoria como gestor documental y la plataforma de trámites del INVIMA', 0)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción al curso: el área regulatoria como gestor documental', 'Clase 1 · Clase 1 – Introducción al curso', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Comprende el rol del área regulatoria como custodio del ciclo documental de los registros sanitarios y el recorrido del curso: plataforma INVIMA, bases públicas, documentos legales, archivo e indicadores.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/tramites-y-servicios/tramites-en-linea","title":"[Página web] Trámites en línea - INVIMA","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/normatividad-medicamentos","title":"[Página web] Normatividad aplicable a Medicamentos y Productos Biológicos - INVIMA","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Ecosistema digital del INVIMA: Oficina Virtual, Sistema de Trámites en Línea e InvimÁgil', 'Clase 2 · Oficina Virtual y trámites en línea', 1, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Identifica los canales digitales del INVIMA para radicar, pagar y consultar trámites y para qué sirve cada uno.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=aj4yo-wb0lg","provider":"youtube","videoId":"aj4yo-wb0lg","title":"Tutorial 4 - Realizar trámites en Invima a un clic","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/tramites-y-servicios/oficina-virtual","title":"[Página web] Oficina Virtual - Trámites y Servicios - INVIMA","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/tramites-y-servicios/tramites-en-linea","title":"[Página web] Trámites en línea - INVIMA","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Registro de usuario y radicación automática (cambios de julio de 2026)', 'Clase 2 · Oficina Virtual y trámites en línea', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe cómo registrarse y radicar en la Oficina Virtual tras la eliminación de la Intención de Solicitud y la generación automática del radicado al cargar documentos y pagar.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=kMhjktRya9w","provider":"youtube","videoId":"kMhjktRya9w","title":"Capacitación - Trámite de Registro Sanitario de Medicamentos en Invima a un clic","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/preview/145164","title":"Nueva radicación automática en la Oficina Virtual del Invima (julio 2026)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/biblioteca/guia-orientadora-nuevas-funcionalidades-oficina-virtualpdf","title":"Guía orientadora nuevas funcionalidades Oficina Virtual (2026)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Tarifas vigentes del INVIMA: manual tarifario 2026 y UVB', 'Clase 3 · Tarifas y pagos', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el manual tarifario y las resoluciones vigentes (Res. 2025067543 modificada por las Res. 2026033499 y 2026058314) para identificar el código y el valor de un trámite.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/tramites-y-servicios/tarifas","title":"[Página web] Tarifas - Trámites - INVIMA (manual tarifario y resoluciones vigentes)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://consultorsalud.com/?p=343455","title":"[Página web] Tarifas Invima 2026 cambian con la Resolución 2026058314 para alimentos, medicamentos y cosméticos","description":"ConsultorSalud (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/biblioteca/manual_tarifario_ayuda-al-usurio_2026-v5xlsx","title":"[Página web] Manual tarifario 2026 - ayuda al usuario (XLSX)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Pago de tarifas: PSE, recibo bancario, devoluciones y errores frecuentes', 'Clase 3 · Tarifas y pagos', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta el pago de un trámite y conoce qué hacer ante un pago errado o un trámite rechazado (devolución y nuevo pago).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=fAi2kiawL0g","provider":"youtube","videoId":"fAi2kiawL0g","title":"Tutorial recibo de pago en oficina bancaria - INVIMA","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/circular-1000-004-2026_ajuste-boton-de-pagopdf","title":"Circular 1000-004-2026 - ajuste botón de pago sin radicado","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/atencion-al-ciudadano/preguntas-frecuentes","title":"[Página web] Preguntas frecuentes - Atención al ciudadano INVIMA","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: preparar y radicar una solicitud en la Oficina Virtual sin rechazos', 'Clase 4 · Caso práctico de radicación', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica el instructivo de verificación del INVIMA para revisar coherencia entre formulario, tarifa, pago y soportes antes de radicar un trámite de medicamentos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/biblioteca/preview/145165","title":"Instructivo de verificación de trámites radicados en la Oficina Virtual del Invima","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/tramites-y-servicios/requisitos-tramites","title":"[Página web] Requisitos Trámites - Trámites y Servicios - INVIMA","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/tramites_tramites_en_linea/Recomendaciones_20para_20el_20ingreso_20de_20datos_20Tramites_20en_20Linea_2023032021.pdf","title":"Recomendaciones para el ingreso de datos en Trámites en Línea","description":"INVIMA (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 2. Seguimiento de trámites, notificaciones y bases de datos públicas del INVIMA', 1)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: información pública del INVIMA para la gestión regulatoria', 'Clase 1 · Clase 1 – Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume qué información publica el INVIMA sobre trámites, actos administrativos y productos y cómo usarla en la gestión diaria.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/tramites-y-servicios/consultas-registros-documentos-asociados","title":"[Página web] Consultas, registros y documentos asociados - INVIMA (radicaciones, resoluciones por notificar, notificación por aviso)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://invima.gov.co/consulta-registros-sanitarios","title":"[Página web] Consulta Registros Sanitarios (básica, avanzada e InvimÁgil)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Consulta de estado de trámites, radicaciones y resoluciones por notificar', 'Clase 2 · Seguimiento del trámite y notificación', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta consultas del estado de un trámite y de las listas de radicaciones, certificaciones por entregar y resoluciones pendientes de notificación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/tramites-y-servicios/consultas-registros-documentos-asociados","title":"[Página web] Consultas, registros y documentos asociados - INVIMA (radicaciones, resoluciones por notificar, notificación por aviso)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/atencion-al-ciudadano/preguntas-frecuentes","title":"[Página web] Preguntas frecuentes - Atención al ciudadano INVIMA","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/tiempos-tramites-registros-sanitarios","title":"[Página web] Tiempo en los trámites de registros sanitarios - DMPB INVIMA (informes e indicadores)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Notificación de actos administrativos: electrónica, personal, por autorizado y por aviso', 'Clase 2 · Seguimiento del trámite y notificación', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta las modalidades de notificación de autos y resoluciones y cómo autorizar a un tercero para notificarse.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/atencion-al-ciudadano/preguntas-frecuentes","title":"[Página web] Preguntas frecuentes - Atención al ciudadano INVIMA","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/tramites-y-servicios/consultas-registros-documentos-asociados","title":"[Página web] Consultas, registros y documentos asociados - INVIMA (radicaciones, resoluciones por notificar, notificación por aviso)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Consulta de registros sanitarios: básica, avanzada e InvimÁgil', 'Clase 3 · Bases de datos públicas de productos', 3, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta búsquedas de registros sanitarios por número, titular o principio activo e interpreta estado y vigencia.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=2QIjvbquMKY","provider":"youtube","videoId":"2QIjvbquMKY","title":"Consultar Registro INVIMA Colombia","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://invima.gov.co/consulta-registros-sanitarios","title":"[Página web] Consulta Registros Sanitarios (básica, avanzada e InvimÁgil)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'CUM, IUM y datos abiertos del INVIMA', 'Clase 3 · Bases de datos públicas de productos', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe el Código Único de Medicamentos, el Identificador Único de Medicamentos (SIDAM) y los conjuntos de datos abiertos de CUM vigentes, vencidos y en renovación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/normograma/compilacion/docs/circular_invima_0420_2006.htm","title":"[Página web] Circular 420 de 2006 INVIMA - Código Único de Medicamentos (CUM)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/preview/90884","title":"Instructivo para la solicitud del Identificador Único de Medicamentos (IUM) en SIDAM","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/biblioteca/preview/131678","title":"Plan de Apertura, Mejora y Uso de Datos Abiertos del Invima (conjuntos CUM vigentes, vencidos, en trámite de renovación)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Verificación y descarga de documentos emitidos por el INVIMA y firma digital', 'Clase 3 · Bases de datos públicas de productos', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica las herramientas del INVIMA para descargar resoluciones y certificaciones y validar su firma digital y apostilla.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/atencion-al-ciudadano/consulta-y-descarga-de-documentos-emitidos-por-el-invima","title":"[Página web] Consulta y descarga de documentos emitidos por el Invima","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/tramites-y-servicios/consulta-verificacion-documentos","title":"[Página web] Consulta y Verificación de Documentos - INVIMA","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: auditoría documental de un portafolio con bases públicas del INVIMA', 'Clase 4 · Caso práctico de vigilancia del portafolio', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta un diagnóstico del estado de los registros de un portafolio cruzando consultas de registros, CUM y resoluciones descargadas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://invima.gov.co/consulta-registros-sanitarios","title":"[Página web] Consulta Registros Sanitarios (básica, avanzada e InvimÁgil)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/biblioteca/preview/131678","title":"Plan de Apertura, Mejora y Uso de Datos Abiertos del Invima (conjuntos CUM vigentes, vencidos, en trámite de renovación)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.invima.gov.co/atencion-al-ciudadano/consulta-y-descarga-de-documentos-emitidos-por-el-invima","title":"[Página web] Consulta y descarga de documentos emitidos por el Invima","description":"INVIMA (ES)"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 3. Documentos legales, apostilla, legalización y traducción oficial', 2)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: documentos legales en los trámites sanitarios', 'Clase 1 · Clase 1 – Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume qué documentos legales y certificados soportan los trámites (Decreto 334 de 2022, Decreto 335 de 2022) y por qué su vigencia es crítica.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_0334_2022.htm","title":"[Página web] Decreto 334 de 2022 - renovación, modificación y suspensión de registros sanitarios (con modificaciones Dec. 322 y 1474 de 2023)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/preguntas-frecuentes-medicamentos","title":"[Página web] Preguntas frecuentes sobre medicamentos - INVIMA (documentos BPM extranjeros, listado CUM)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Certificado de existencia y representación legal: obtención electrónica y verificación en RUES', 'Clase 2 · Documentos legales del titular y del solicitante', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe cómo obtener el certificado electrónico de Cámara de Comercio, su validez jurídica y su verificación con código en RUES.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://mail.cccartagena.org.co/sites/default/files/media/preguntas/prf_Certificados-Electronicos_0.pdf","title":"Certificados electrónicos de las Cámaras de Comercio: validez y verificación en RUES","description":"Cámara de Comercio de Cartagena (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Poderes y cartas de autorización para trámites ante el INVIMA', 'Clase 2 · Documentos legales del titular y del solicitante', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Redacta poderes especiales y cartas de autorización con objeto y facultades correctas para radicar, notificarse y recurrir.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: identificar cuándo se necesita un poder o una carta de autorización en los trámites ante el INVIMA y redactarlos sin errores que generen requerimientos o rechazos.</p><p>Desarrollo: en los trámites sanitarios actúan tres figuras. El titular del registro sanitario es la persona natural o jurídica a cuyo nombre se expide el registro. El apoderado es quien actúa en nombre del titular ante el INVIMA; el Decreto 334 de 2022 permite expresamente que la solicitud de renovación o modificación la radique el titular o su apoderado. Si el apoderado es abogado, el poder especial se otorga conforme a las reglas generales (Código General del Proceso); si el titular es extranjero, el poder otorgado en el exterior debe apostillarse o legalizarse y, si no está en castellano, acompañarse de traducción oficial. El INVIMA, por ejemplo, exige poder \"debidamente consularizado\" (si aplica) para la aceptación de certificados BPM extranjeros según el Decreto 335 de 2022. La carta de autorización es un documento más simple: el titular autoriza a un tercero para una actuación concreta (por ejemplo, notificarse de un acto administrativo o retirar un documento). Según las preguntas frecuentes del INVIMA, la carta para notificación debe estar firmada e indicar el radicado y la persona autorizada, y no requiere autenticación notarial.</p><p>Elementos mínimos de un poder especial para trámites sanitarios: identificación completa del poderdante (razón social, NIT, representante legal y documento que acredita su calidad, normalmente el certificado de existencia y representación legal vigente); identificación del apoderado (nombre, cédula y, si es abogado, tarjeta profesional); objeto preciso (por ejemplo, \"solicitar la renovación y las modificaciones del registro sanitario INVIMA XXXX, notificarse, interponer recursos, desistir y recibir\"); facultades expresas (las facultades de recibir, desistir y sustituir deben señalarse); vigencia o término; firma y, cuando aplique, presentación personal o apostilla.</p><p>Ejemplo aplicado: un laboratorio de la India es titular de un registro sanitario y su importador colombiano gestiona la renovación. El área regulatoria del importador debe pedir un poder del titular extranjero, firmado por quien acredite facultades, apostillado en la India (país parte de la Convención de La Haya), con traducción oficial al castellano cuya firma de traductor se reconozca ante notario. Además, el dossier debe incluir la carta de autorización de uso de la información técnica si el importador actúa como solicitante distinto del fabricante. Un poder sin la facultad de \"notificarse\" obliga a esperar la notificación por aviso, lo que retrasa la respuesta a autos.</p><p>Puntos clave:<br>1. Distinga titular, apoderado y autorizado: cada uno tiene facultades diferentes y el INVIMA verifica la coherencia entre formulario, poder y certificado de existencia y representación.<br>2. Redacte poderes con objeto y facultades expresas (radicar, notificarse, recurrir, desistir, recibir) y controle su vigencia en la matriz documental.<br>3. Documentos otorgados en el exterior requieren apostilla o legalización y traducción oficial; prevea esos tiempos en el cronograma del trámite.</p><p>Nota de actualización normativa (oct. 2026): el Decreto 1474 de 2023 modificó el art. 16 del Decreto 677 de 1995 y dio vigencia indefinida a los registros sanitarios de medicamentos (síntesis química, biológicos, homeopáticos y gases medicinales), incluidos los vigentes a esa fecha; el INVIMA archiva las solicitudes de renovación de estos productos. La renovación con radicación mínima de un mes antes del vencimiento (Decreto 334 de 2022, art. 4) se conserva como antecedente y aplica hoy a productos que mantienen vigencia temporal, como los fitoterapéuticos (Decreto 1156 de 2018, 10 años renovables). Lo que sigue exigiendo control continuo es la gestión del registro: modificaciones, notificación de no comercialización (30 días) y aviso de retiro definitivo (6 meses).</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Certificado de Producto Farmacéutico (CPP) tipo OMS y Certificado de Venta Libre', 'Clase 3 · Certificados técnico-legales del exterior', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara el CPP del esquema OMS y el CVL, quién los emite y cómo se usan en la renovación de registros con vigencia temporal (p. ej. fitoterapéuticos) y en modificaciones (Decreto 334 de 2022, art. 3).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.aemps.gob.es/comercio-exterior/certificado-de-producto-farmaceutico","title":"[Página web] Certificado de producto farmacéutico | AEMPS","description":"AEMPS (España) (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://prais.paho.org/?p=17458","title":"[Página web] Proyecto de la Red PARF en CPF / PANDRH''s CPP Project","description":"OPS/PRAIS (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_0334_2022.htm","title":"[Página web] Decreto 334 de 2022 - renovación, modificación y suspensión de registros sanitarios (con modificaciones Dec. 322 y 1474 de 2023)","description":"Normograma INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Certificados BPM y aceptación de certificados extranjeros (Decreto 335 de 2022)', 'Clase 3 · Certificados técnico-legales del exterior', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los documentos exigidos para aceptar certificados BPM extranjeros: poder, certificado de existencia y representación, pago y certificado con traducción oficial y consularización.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.invima.gov.co/invima_website/static/attachments/medicamentos_certificaciones_de_fabricacion_bpl_bpm/Decreto_20No._20335_20de_202022.pdf","title":"Decreto 335 de 2022 - certificados de buenas prácticas (BPM, BPL, BPE)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/preguntas-frecuentes-medicamentos","title":"[Página web] Preguntas frecuentes sobre medicamentos - INVIMA (documentos BPM extranjeros, listado CUM)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Apostilla y legalización: Convención de La Haya y Resolución 1959 de 2020', 'Clase 4 · Apostilla, legalización y traducción oficial', 5, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara apostilla y legalización según el país de destino o de origen y ejecuta la solicitud en línea ante la Cancillería.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=tzVeGykjokE","provider":"youtube","videoId":"tzVeGykjokE","title":"En la Cancillería existen dos tipos de documentos para apostillar en línea. Te contamos la diferencia","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cancilleria.gov.co/normograma/compilacion/docs/resolucion_minrelaciones_1959_2020.htm","title":"[Página web] Resolución 1959 de 2020 MinRelaciones - disposiciones en materia de apostillas y legalizaciones","description":"Cancillería de Colombia (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.cancilleria.gov.co/sites/default/files/FOTOS2020/guia_apostilla-legalizacion_ciudadano_0.pdf","title":"Guía de Usuario: Solicitar trámite de Apostilla / Legalización","description":"Cancillería de Colombia (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Traducción oficial y apostilla de documentos traducidos', 'Clase 4 · Apostilla, legalización y traducción oficial', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta el papel del traductor oficial y el reconocimiento notarial de su firma antes de apostillar (art. 6, Res. 1959 de 2020).</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://cancilleria.gov.co/node/23023","title":"[Página web] ¿Cómo se apostilla un documento extranjero traducido en Colombia?","description":"Cancillería de Colombia (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://cancilleria.gov.co/normograma/compilacion/docs/resolucion_minrelaciones_1959_2020.htm","title":"[Página web] Resolución 1959 de 2020 MinRelaciones - disposiciones en materia de apostillas y legalizaciones","description":"Cancillería de Colombia (ES)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.cancilleria.gov.co/sala-de-prensa/noticias/tiene-planeado-salir-del-pais-es-posible-que-tenga-que-apostillar-o-legalizar-documentos-la-cancilleria-le-permite-hacerlo-en-linea-aqui-le-contamos-como","title":"[Página web] La Cancillería le permite apostillar o legalizar en línea (incluye CVL y notificación sanitaria INVIMA)","description":"Cancillería de Colombia (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: legalizar el paquete documental de un fabricante extranjero', 'Clase 4 · Apostilla, legalización y traducción oficial', 7, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la planificación de la cadena de apostilla o legalización, traducción y control de vigencias para un trámite de renovación.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: planificar y ejecutar la cadena completa de legalización de un paquete documental de un fabricante extranjero para un trámite de registro sanitario o renovación ante el INVIMA.</p><p>Desarrollo: el caso parte de una empresa colombiana que importará un medicamento fabricado en Alemania y otro fabricado en un país que no es parte de la Convención de La Haya de 1961. El área regulatoria debe reunir: (1) Certificado de Producto Farmacéutico (CPP) tipo OMS o Certificado de Venta Libre emitido por la autoridad del país de referencia; (2) certificado BPM del fabricante, o el trámite de aceptación de certificados BPM extranjeros según el Decreto 335 de 2022; (3) poder del titular extranjero a favor del apoderado en Colombia; (4) carta de autorización del fabricante cuando titular y fabricante son distintos; (5) certificado de existencia y representación legal del solicitante colombiano, descargado de la Cámara de Comercio y verificable en RUES.</p><p>Paso 1, diagnóstico por país: verificar si el país emisor es parte de la Convención de La Haya. Para Alemania basta la apostilla otorgada por la autoridad competente alemana. Para el país no parte se requiere legalización: firma reconocida por la cancillería del país emisor, luego por el consulado de Colombia en ese país y finalmente por la Cancillería colombiana, según la cadena descrita en la Resolución 1959 de 2020.</p><p>Paso 2, traducción oficial: los documentos en idioma extranjero se traducen por traductor oficial en Colombia. Según el artículo 6 de la Resolución 1959 de 2020, si la traducción debe surtir efectos en el exterior o apostillarse, la firma del traductor se reconoce ante notario y la Cancillería apostilla la firma del notario, no el contenido de la traducción. Para el INVIMA basta normalmente con la traducción oficial del documento ya apostillado o legalizado.</p><p>Paso 3, control de vigencias: el CPP y el certificado BPM tienen fecha de expedición y vigencia; el Decreto 334 de 2022 exige certificados vigentes para la renovación. Registre fechas en la matriz de vencimientos y no inicie la cadena demasiado pronto ni demasiado tarde.</p><p>Paso 4, cronograma: estime tiempos realistas (emisión del CPP, apostilla en origen, envío físico o electrónico, traducción, revisión interna) y súmelos al plazo legal: la renovación debe radicarse con antelación no menor a un mes del vencimiento (art. 4, Decreto 334 de 2022).</p><p>Paso 5, radicación: con la Oficina Virtual (radicación automática desde julio de 2026) los documentos se cargan en PDF, uno por campo de requisito, sin hipervínculos. El INVIMA no revisa antes de generar el radicado; un documento sin apostilla puede generar rechazo o requerimiento y la pérdida del pago.</p><p>Puntos clave:<br>1. Primero determine apostilla o legalización según el país emisor; la cadena de legalización es más larga y debe iniciarse antes.<br>2. La traducción oficial y el reconocimiento de firma del traductor tienen reglas propias (Resolución 1959 de 2020, art. 6).<br>3. Integre vigencias de CPP, BPM y poder en la matriz de vencimientos y en el checklist previo a la radicación.</p><p>Nota de actualización normativa (oct. 2026): el Decreto 1474 de 2023 modificó el art. 16 del Decreto 677 de 1995 y dio vigencia indefinida a los registros sanitarios de medicamentos (síntesis química, biológicos, homeopáticos y gases medicinales), incluidos los vigentes a esa fecha; el INVIMA archiva las solicitudes de renovación de estos productos. La renovación con radicación mínima de un mes antes del vencimiento (Decreto 334 de 2022, art. 4) se conserva como antecedente y aplica hoy a productos que mantienen vigencia temporal, como los fitoterapéuticos (Decreto 1156 de 2018, 10 años renovables). Lo que sigue exigiendo control continuo es la gestión del registro: modificaciones, notificación de no comercialización (30 días) y aviso de retiro definitivo (6 meses).</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 4. Organización del expediente regulatorio, archivo y control de vencimientos', 3)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: del archivo de papel al expediente regulatorio gestionado', 'Clase 1 · Clase 1 – Introducción a la unidad', 0, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume los principios archivísticos aplicables al expediente regulatorio y su relación con la trazabilidad ante el INVIMA.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=gDCpeTabN-I","provider":"youtube","videoId":"gDCpeTabN-I","title":"Tablas de Retención Documental - Contexto General","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://normas.cra.gov.co/gestor/docs/ley_0594_2000.htm","title":"[Página web] Ley 594 de 2000 - Ley General de Archivos","description":"Gestor normativo CRA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Ley 594 de 2000 aplicada al área regulatoria', 'Clase 2 · Archivo y tablas de retención', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta los conceptos de la Ley General de Archivos (ciclo vital, conservación, documentos electrónicos) y su uso como buena práctica en una empresa farmacéutica privada.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://normas.cra.gov.co/gestor/docs/ley_0594_2000.htm","title":"[Página web] Ley 594 de 2000 - Ley General de Archivos","description":"Gestor normativo CRA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Tablas de retención documental (TRD) para series regulatorias', 'Clase 2 · Archivo y tablas de retención', 2, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica la metodología de TRD para definir series, tiempos de retención y disposición final de los documentos regulatorios.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=mdnfCLlK4FE","provider":"youtube","videoId":"mdnfCLlK4FE","title":"¿Qué es una Tabla de Retención Documental (TRD)?","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=J7ELGjWe_Ug","provider":"youtube","videoId":"J7ELGjWe_Ug","title":"Elaboración, aprobación, evaluación y convalidación de Tablas de Retención Documental - TRD","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.funcionpublica.gov.co/eva/red/publicaciones/curso-sobre-metodologias-construccion-tablas-retencion-documental","title":"[Página web] Curso sobre metodologías de construcción de tablas de retención documental","description":"Función Pública - EVA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Control de versiones de dossiers y expedientes', 'Clase 3 · Control de versiones y vencimientos', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Aplica un sistema de codificación, versión, estado e historial para que lo radicado coincida con lo aprobado.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: aplicar un sistema de control de versiones a los dossiers y expedientes regulatorios para garantizar que lo radicado ante el INVIMA coincida con lo aprobado y con la documentación interna vigente.</p><p>Desarrollo: un dossier regulatorio cambia durante toda la vida del producto: respuestas a autos, modificaciones (Decreto 334 de 2022 clasifica cambios y permite agruparlos), renovaciones y actualizaciones de estabilidad, fabricante o etiquetas. Sin control de versiones aparecen errores típicos: radicar un inserto desactualizado, responder un auto con una especificación que ya cambió o no poder demostrar qué se presentó en una fecha determinada.</p><p>Elementos de un buen control de versiones: (1) codificación única del documento (producto–módulo–tipo–consecutivo, por ejemplo RLX-M3-ESP-001); (2) número de versión mayor y menor (1.0 aprobado, 1.1 borrador de cambio, 2.0 nueva versión aprobada); (3) estado del documento: borrador, en revisión, aprobado internamente, radicado, aprobado por INVIMA, obsoleto; (4) historial de cambios con fecha, autor, motivo y número de radicado o resolución asociada; (5) congelamiento: el paquete radicado se guarda como copia inalterable (PDF con fecha, preferiblemente con hash o firma digital) en la carpeta del expediente; (6) trazabilidad cruzada con el sistema de control de cambios de calidad.</p><p>Reglas prácticas: nunca sobrescribir un archivo aprobado; nombrar archivos con convención fija (CODIGO_vX.Y_AAAAMMDD_estado.pdf); mantener una única \"versión maestra vigente\" por producto; vincular cada versión con el acto administrativo que la aprobó; y restringir permisos de edición en el gestor documental.</p><p>Ejemplo aplicado: el INVIMA emite un auto sobre la especificación de un producto en trámite de modificación. El área regulatoria localiza en el expediente la versión 2.1 radicada (radicado XXXX), prepara la 2.2 con el ajuste solicitado, documenta en el historial \"Respuesta auto, radicado XXXX\", la aprueba con Calidad y la radica. Cuando llega la resolución, la 2.2 pasa a \"aprobada por INVIMA\" y la 2.0 queda \"obsoleta\", pero se conserva por el tiempo definido en la tabla de retención interna.</p><p>Puntos clave:<br>1. Cada documento del dossier debe tener código, versión, estado e historial vinculado a radicados y resoluciones.<br>2. Lo radicado se congela como evidencia inalterable; las nuevas versiones nunca sobrescriben las anteriores.<br>3. Control de versiones regulatorio y control de cambios de calidad deben estar sincronizados.</p><p>Nota de actualización normativa (oct. 2026): el Decreto 1474 de 2023 modificó el art. 16 del Decreto 677 de 1995 y dio vigencia indefinida a los registros sanitarios de medicamentos (síntesis química, biológicos, homeopáticos y gases medicinales), incluidos los vigentes a esa fecha; el INVIMA archiva las solicitudes de renovación de estos productos. La renovación con radicación mínima de un mes antes del vencimiento (Decreto 334 de 2022, art. 4) se conserva como antecedente y aplica hoy a productos que mantienen vigencia temporal, como los fitoterapéuticos (Decreto 1156 de 2018, 10 años renovables). Lo que sigue exigiendo control continuo es la gestión del registro: modificaciones, notificación de no comercialización (30 días) y aviso de retiro definitivo (6 meses).</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Matriz y semáforo de vencimientos del portafolio', 'Clase 3 · Control de versiones y vencimientos', 4, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Diseña una matriz con fechas límite (certificados, modificaciones y renovaciones de productos con vigencia temporal) (art. 4, Decreto 334 de 2022) y vencimientos de documentos soporte con semáforo.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: diseñar una matriz con semáforo de vencimientos del portafolio que anticipe renovaciones, certificados y documentos legales por vencer.</p><p>Desarrollo: el riesgo más costoso del área regulatoria es perder un registro por vencimiento. El Decreto 334 de 2022 (art. 4) establece que la renovación debe radicarse con una antelación no menor a un mes de la fecha de vencimiento; si se radica fuera de ese término no procede y hay que solicitar un registro nuevo. Por eso la matriz no debe controlar solo la fecha de vencimiento, sino la fecha límite de radicación y la fecha recomendada de inicio de preparación.</p><p>Columnas mínimas de la matriz: producto; número de registro sanitario; titular; fabricante; CUM; modalidad; fecha de expedición; fecha de vencimiento (tomada de la resolución y validada en la consulta de registros del INVIMA); fecha límite legal de radicación (vencimiento menos un mes); fecha interna de inicio (por ejemplo, vencimiento menos 12 meses para productos importados con cadena de apostilla); estado del trámite y número de radicado; vencimiento de documentos soporte (CPP, certificado BPM, poder, certificado de existencia y representación); responsable; observaciones.</p><p>Reglas de semáforo sugeridas: rojo, menos de 3 meses para la fecha límite de radicación sin radicado; naranja, entre 3 y 6 meses; amarillo, entre 6 y 12 meses; verde, más de 12 meses o renovación ya radicada. En Excel se implementa con una columna de días restantes (fecha límite menos HOY()) y formato condicional. Según el INVIMA, si la renovación se radicó a tiempo, el registro sigue vigente mientras no haya pronunciamiento, por lo que la matriz debe guardar el número de radicado como evidencia.</p><p>Ejemplo aplicado: un portafolio de 40 registros se cruza con los conjuntos de datos abiertos del CUM (vigentes, vencidos, en trámite de renovación). Se detectan dos productos en rojo cuyo CPP vence antes de la fecha límite: se solicita un CPP nuevo de inmediato y se programa la traducción oficial.</p><p>Puntos clave:<br>1. Controle la fecha límite legal de radicación (al menos un mes antes del vencimiento), no solo la fecha de vencimiento.<br>2. Incluya los vencimientos de documentos soporte: un CPP o BPM vencido bloquea la renovación.<br>3. Valide la matriz periódicamente contra las bases públicas del INVIMA y conserve los radicados como evidencia.</p><p>Nota de actualización normativa (oct. 2026): el Decreto 1474 de 2023 modificó el art. 16 del Decreto 677 de 1995 y dio vigencia indefinida a los registros sanitarios de medicamentos (síntesis química, biológicos, homeopáticos y gases medicinales), incluidos los vigentes a esa fecha; el INVIMA archiva las solicitudes de renovación de estos productos. La renovación con radicación mínima de un mes antes del vencimiento (Decreto 334 de 2022, art. 4) se conserva como antecedente y aplica hoy a productos que mantienen vigencia temporal, como los fitoterapéuticos (Decreto 1156 de 2018, 10 años renovables). Lo que sigue exigiendo control continuo es la gestión del registro: modificaciones, notificación de no comercialización (30 días) y aviso de retiro definitivo (6 meses).</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: organizar el expediente y el tablero de control de un portafolio de 25 registros', 'Clase 4 · Caso práctico de organización documental', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta inventario, estructura de carpetas, TRD interna, matriz de vencimientos e indicadores sobre un portafolio simulado.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: construir paso a paso el tablero de control documental de un portafolio real a partir de fuentes públicas del INVIMA y de los expedientes internos.</p><p>Desarrollo del caso: usted asume la coordinación regulatoria de una empresa con 25 registros sanitarios (medicamentos de síntesis química importados y nacionales) y recibe un archivo desordenado: carpetas en correo, PDFs sin nombre estandarizado y un Excel desactualizado.</p><p>Paso 1, inventario: liste cada registro con su número y descargue las resoluciones desde \"Consulta y descarga de documentos emitidos por el Invima\" (documentos generales con firma digital). Verifique estado y vigencia en la Consulta de Registros Sanitarios (básica o avanzada) y en los listados CUM de datos abiertos.</p><p>Paso 2, estructura del expediente: cree por producto una carpeta con subcarpetas fijas: 01 Legal (poderes, certificados de existencia y representación, cartas de autorización); 02 Certificados (CPP, BPM, CVL, con apostilla y traducción); 03 Técnico (dossier por módulos CTD); 04 Actos administrativos (resoluciones, autos, respuestas, radicados); 05 Etiquetas e insertos aprobados; 06 Correspondencia y derechos de petición.</p><p>Paso 3, tabla de retención interna: defina para cada serie el tiempo en archivo de gestión, archivo central y disposición final, inspirándose en la Ley 594 de 2000 y en la metodología de TRD del Archivo General de la Nación, aunque como empresa privada su adopción es una buena práctica y no una obligación legal directa (salvo que la empresa cumpla funciones públicas).</p><p>Paso 4, matriz de vencimientos: aplique el semáforo de la subclase anterior, con fecha límite de radicación de renovaciones (art. 4, Decreto 334 de 2022) y vencimientos de documentos soporte.</p><p>Paso 5, indicadores: calcule porcentaje de registros con expediente completo, número de registros en rojo, porcentaje de trámites radicados sin rechazo y tiempo promedio de respuesta a autos.</p><p>Paso 6, presentación a la gerencia: un informe de una página con hallazgos (por ejemplo, tres registros sin CPP vigente, un poder vencido) y plan de acción con responsables.</p><p>Puntos clave:<br>1. Las bases públicas del INVIMA son la fuente de verdad para validar estado y vigencia; el archivo interno debe coincidir con ellas.<br>2. Una estructura de carpetas fija y una tabla de retención interna hacen auditable el expediente.<br>3. Matriz de vencimientos e indicadores convierten el archivo en una herramienta de gestión.</p><p>Nota de actualización normativa (oct. 2026): el Decreto 1474 de 2023 modificó el art. 16 del Decreto 677 de 1995 y dio vigencia indefinida a los registros sanitarios de medicamentos (síntesis química, biológicos, homeopáticos y gases medicinales), incluidos los vigentes a esa fecha; el INVIMA archiva las solicitudes de renovación de estos productos. La renovación con radicación mínima de un mes antes del vencimiento (Decreto 334 de 2022, art. 4) se conserva como antecedente y aplica hoy a productos que mantienen vigencia temporal, como los fitoterapéuticos (Decreto 1156 de 2018, 10 años renovables). Lo que sigue exigiendo control continuo es la gestión del registro: modificaciones, notificación de no comercialización (30 días) y aviso de retiro definitivo (6 meses).</p>"}'::jsonb);

  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, 'Unidad 5. Herramientas digitales, indicadores y derechos de petición', 4)
  RETURNING id INTO v_unidad;
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Introducción a la unidad: gestión regulatoria basada en datos', 'Clase 1 · Clase 1 – Introducción a la unidad', 0, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Resume cómo herramientas digitales e indicadores convierten la gestión documental en un proceso medible y cómo el derecho de petición complementa el seguimiento.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.freyrsolutions.com/blog/regulatory-information-management-system-rims-in-pharma-explained-the-regulatory-backbone-for-faster-trusted-decisions","title":"[Página web] Regulatory Information Management System (RIMS) in Pharma Explained","description":"Freyr Solutions (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Sistemas RIM y gestores documentales', 'Clase 2 · Herramientas digitales', 1, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Compara un sistema RIM, un gestor documental y una hoja de cálculo para el control del portafolio regulatorio.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.freyrsolutions.com/blog/regulatory-information-management-system-rims-in-pharma-explained-the-regulatory-backbone-for-faster-trusted-decisions","title":"[Página web] Regulatory Information Management System (RIMS) in Pharma Explained","description":"Freyr Solutions (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.veeva.com/blog/ge-healthcare-seven-kpis-to-measure-rim/","title":"[Página web] GE HealthCare: Seven KPIs to Measure RIM","description":"Veeva (EN)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Excel para el área regulatoria', 'Clase 2 · Herramientas digitales', 2, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Construye una base de datos regulatoria en Excel con validaciones, fórmulas de fecha, semáforo y tablas dinámicas.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: usar Excel (u hojas de cálculo equivalentes) como herramienta de gestión documental regulatoria cuando la empresa no cuenta con un sistema RIM.</p><p>Desarrollo: en muchas compañías farmacéuticas colombianas medianas el control regulatorio vive en hojas de cálculo. Bien diseñadas, pueden ser robustas. Recomendaciones: (1) una hoja maestra de productos con una fila por registro sanitario y una clave única (número de registro); (2) hojas relacionadas para trámites (radicado, tipo, fecha de radicación, estado, autos, fecha de respuesta, resolución), documentos soporte (tipo, emisor, fecha de expedición, vencimiento, apostilla y traducción) y tarifas pagadas (código de tarifa, valor en UVB y en pesos, referencia de pago); (3) listas desplegables con validación de datos para estados y tipos de trámite, evitando texto libre; (4) fórmulas de fecha: fecha límite de radicación de renovación =FECHA.MES(vencimiento;-1), días restantes =fecha_límite-HOY(); (5) formato condicional para el semáforo; (6) BUSCARX o INDICE/COINCIDIR para traer datos de la hoja maestra; (7) tablas dinámicas para indicadores (trámites por estado, autos por producto, tiempo medio de respuesta); (8) importación de los conjuntos de datos abiertos del CUM del INVIMA para cruzar con la hoja maestra y detectar diferencias.</p><p>Buenas prácticas de integridad: proteger celdas con fórmulas, mantener un único archivo maestro en una ubicación compartida con control de acceso, registrar fecha y responsable de cada actualización, guardar copias periódicas y documentar el instructivo de uso. El Excel no reemplaza el archivo de los documentos: debe enlazar con la ruta del expediente digital y revisarse al menos una vez al mes frente a las consultas públicas del INVIMA.</p><p>Ejemplo aplicado: después de pagar una renovación en la Oficina Virtual del INVIMA, el analista registra en la hoja de trámites el radicado generado automáticamente, el código de tarifa del manual tarifario vigente y el valor pagado. La tabla dinámica muestra al cierre del mes cuántos trámites quedaron radicados, cuántos tienen autos pendientes y su antigüedad.</p><p>Puntos clave:<br>1. Estructure el Excel como base de datos relacional: hoja maestra más hojas de trámites, documentos y pagos.<br>2. Use validación de datos, fórmulas de fecha y formato condicional para el semáforo de vencimientos.<br>3. Cruce periódicamente con los datos abiertos del INVIMA y proteja la integridad del archivo.</p><p>Nota de actualización normativa (oct. 2026): el Decreto 1474 de 2023 modificó el art. 16 del Decreto 677 de 1995 y dio vigencia indefinida a los registros sanitarios de medicamentos (síntesis química, biológicos, homeopáticos y gases medicinales), incluidos los vigentes a esa fecha; el INVIMA archiva las solicitudes de renovación de estos productos. La renovación con radicación mínima de un mes antes del vencimiento (Decreto 334 de 2022, art. 4) se conserva como antecedente y aplica hoy a productos que mantienen vigencia temporal, como los fitoterapéuticos (Decreto 1156 de 2018, 10 años renovables). Lo que sigue exigiendo control continuo es la gestión del registro: modificaciones, notificación de no comercialización (30 días) y aviso de retiro definitivo (6 meses).</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Indicadores de gestión regulatoria', 'Clase 3 · Indicadores del área regulatoria', 3, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Interpreta indicadores de desempeño propios (rechazos, autos, tiempos, vencimientos) y los publicados por el INVIMA sobre tiempos de trámite.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, '{"url":"https://www.raps.org/resource/seven-kpis-to-measure-regulatory-information-manag.html","title":"[Página web] Seven KPIs to measure regulatory information management","description":"RAPS (EN)"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, '{"url":"https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/tiempos-tramites-registros-sanitarios","title":"[Página web] Tiempo en los trámites de registros sanitarios - DMPB INVIMA (informes e indicadores)","description":"INVIMA (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Derecho de petición y solicitudes de información (Ley 1755 de 2015)', 'Clase 4 · Derechos de petición y caso integrador', 4, 'video')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Describe los tipos de petición, sus términos de respuesta (15, 10 y 30 días hábiles) y las reglas de prórroga.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, '{"source":"enlace","url":"https://www.youtube.com/watch?v=c1VBwIZLbH8","provider":"youtube","videoId":"c1VBwIZLbH8","title":"Video del ABC del Derecho de Petición","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 2, '{"source":"enlace","url":"https://www.youtube.com/watch?v=TV2ORZn7Yhw","provider":"youtube","videoId":"TV2ORZn7Yhw","title":"#PGN Guía Completa: Ley 1755 de 2015 (Derecho de Petición)","transcriptHtml":""}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 3, '{"url":"https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=65334","title":"[Página web] Ley 1755 de 2015 - Gestor Normativo - Función Pública","description":"Función Pública (ES)"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso: redactar un derecho de petición de información ante el INVIMA', 'Clase 4 · Derechos de petición y caso integrador', 5, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Ejecuta la redacción, radicación y seguimiento de una petición sobre el estado de un trámite con plazos excedidos.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: redactar y radicar un derecho de petición de información ante el INVIMA y hacer seguimiento a sus términos.</p><p>Desarrollo: el derecho de petición (artículo 23 de la Constitución, regulado por la Ley 1755 de 2015, que sustituyó el título correspondiente de la Ley 1437 de 2011) permite solicitar información, documentos, copias o consultas a las autoridades. Los términos generales son: 15 días hábiles para peticiones en general; 10 días hábiles para solicitudes de documentos e información; 30 días hábiles para consultas sobre materias a cargo de la entidad. Si la autoridad no puede responder a tiempo, debe informarlo antes del vencimiento, indicar los motivos y el plazo, que no puede exceder el doble del inicialmente previsto.</p><p>Usos típicos en el área regulatoria: solicitar copia de un expediente o de una resolución, consultar el criterio del INVIMA sobre la clasificación de un cambio, pedir información sobre el estado de un trámite con plazos vencidos o solicitar aclaración sobre la aplicación de una tarifa. Ojo: el derecho de petición no reemplaza los recursos (reposición) contra un acto administrativo ni la respuesta a un auto, que tienen sus propios términos.</p><p>Estructura de la petición: (1) destinatario (INVIMA, dirección o dependencia competente); (2) identificación del peticionario (razón social, NIT, representante o apoderado, dirección y correo electrónico para notificaciones); (3) objeto claro y numerado; (4) razones en que se fundamenta; (5) relación de documentos anexos; (6) firma. Radíquela por los canales oficiales de atención al ciudadano del INVIMA y conserve el número de radicado.</p><p>Ejemplo aplicado: una empresa radicó una modificación hace varios meses y no ha recibido pronunciamiento. El área regulatoria presenta un derecho de petición solicitando información sobre el estado del trámite, el número de autos emitidos y la fecha estimada de decisión. Registra el radicado en su matriz, calcula 10 días hábiles para la respuesta y, si no llega, documenta el silencio para escalar ante la entidad.</p><p>Puntos clave:<br>1. Conozca los términos de la Ley 1755 de 2015: 15, 10 y 30 días hábiles según el tipo de petición.<br>2. Redacte peticiones concretas, numeradas y con correo para notificación; guarde el radicado.<br>3. No confunda derecho de petición con recursos o respuestas a autos, que tienen términos y efectos propios.</p>"}'::jsonb);
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule)
  VALUES (v_curso, v_unidad, 'Caso integrador: gestión documental completa de una renovación con modificación', 'Clase 4 · Derechos de petición y caso integrador', 6, 'manual')
  RETURNING id INTO v_clase;
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, '{"html":"<p>Integra consulta de bases públicas, documentos legales, apostilla, tarifas, radicación, seguimiento, archivo e indicadores en un caso completo.</p>"}'::jsonb);
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 1, '{"html":"<p>Objetivo: integrar todas las competencias del curso en un caso que simula la gestión documental de un trámite completo ante el INVIMA.</p><p>Planteamiento del caso: la empresa colombiana \"Laboratorio Andino S.A.S.\" es importadora y apoderada del titular extranjero de un antibiótico fabricado en un país parte de la Convención de La Haya. El registro sanitario vence en ocho meses y, en paralelo, se requiere una modificación de fabricante del principio activo.</p><p>Tareas del estudiante:<br>1. Diagnóstico: verificar en la Consulta de Registros Sanitarios y en los datos abiertos del CUM la vigencia, el titular y las presentaciones aprobadas. Descargar la última resolución desde el servicio de consulta y descarga de documentos del INVIMA.<br>2. Lista documental: armar la lista de requisitos de renovación según el Decreto 334 de 2022 (formato de solicitud, certificado BPM vigente, CVL o CPP vigente, traducción al castellano cuando aplique) y los documentos legales (poder del titular, certificado de existencia y representación legal del solicitante, cartas de autorización).<br>3. Cadena de apostilla y traducción: definir qué documentos se apostillan en origen, cuáles requieren traducción oficial y el tiempo estimado de cada paso.<br>4. Cronograma: calcular la fecha límite legal de radicación (al menos un mes antes del vencimiento) y una fecha interna con margen; evaluar si conviene agrupar cambios conforme a las modificaciones introducidas por el Decreto 1474 de 2023.<br>5. Tarifa y pago: identificar en el manual tarifario vigente (tarifas 2026 expresadas en UVB, Resolución 2025067543 y sus modificaciones) el código aplicable, prever el pago dentro del plazo de la Oficina Virtual y recordar que un pago asociado a un trámite rechazado no se reutiliza.<br>6. Radicación: aplicar el checklist del instructivo de verificación (PDF, sin hipervínculos, coherencia entre formulario, pago y soportes, firmas).<br>7. Seguimiento: registrar el radicado en la matriz, monitorear autos y notificaciones, preparar un derecho de petición modelo por si los términos se exceden.<br>8. Archivo: congelar la versión radicada, actualizar el control de versiones y clasificar los documentos según la tabla de retención interna.<br>9. Indicadores: reportar a la gerencia tiempo de preparación, rechazos y autos recibidos.</p><p>Entregables: cronograma, checklist diligenciado, matriz actualizada y memorando de una página.</p><p>Puntos clave:<br>1. La gestión documental regulatoria es una cadena: un eslabón débil (un poder vencido, un PDF con enlaces, una tarifa errada) puede costar el registro.<br>2. Las herramientas públicas del INVIMA y la Cancillería permiten verificar casi todo antes de radicar.<br>3. Archivo, versiones, matriz e indicadores convierten el trámite individual en un sistema gestionable.</p><p>Nota de actualización normativa (oct. 2026): el Decreto 1474 de 2023 modificó el art. 16 del Decreto 677 de 1995 y dio vigencia indefinida a los registros sanitarios de medicamentos (síntesis química, biológicos, homeopáticos y gases medicinales), incluidos los vigentes a esa fecha; el INVIMA archiva las solicitudes de renovación de estos productos. La renovación con radicación mínima de un mes antes del vencimiento (Decreto 334 de 2022, art. 4) se conserva como antecedente y aplica hoy a productos que mantienen vigencia temporal, como los fitoterapéuticos (Decreto 1156 de 2018, 10 años renovables). Lo que sigue exigiendo control continuo es la gestión del registro: modificaciones, notificación de no comercialización (30 días) y aviso de retiro definitivo (6 meses).</p>"}'::jsonb);

END
$curso$;
