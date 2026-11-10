-- ============================================================
--  083_clases_quices_actividades_foros_bpe.sql — Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales
--
--  Generado por scripts/paquete-aula.mjs bpe publica a partir de
--  contenido/aula/bpe. No editar a mano.
--
--  Aprobado por la dirección académica: todos los cursos llevan quizzes,
--  actividades y foros. Las claves de los quizzes son las mismas que el
--  aula muestra al estudiante cuando envía; las guías docentes quedan en
--  la versión privada.
--
--  Qué hace:
--   1. Actualiza los metadatos del curso, la nota mínima 70, 2 intentos
--      y la política 60/30/10.
--   2. Reemplaza el texto, los destacados y los enlaces de las clases por
--      la clase completa, con videos complementarios verificados y
--      enlaces a fuentes oficiales.
--   3. Crea PUBLICADOS los quizzes, las actividades con rúbrica y los
--      foros; si ya existían en borrador, los publica. No toca preguntas
--      de quizzes con intentos ni rúbricas o pesos de recursos con
--      entregas o notas.
--   4. Si el curso ya está publicado, aprueba una versión nueva (077)
--      para que quien estudia vea las clases completas.
--   5. Si el curso, una unidad o una clase no está en la base, avisa y
--      se salta: nunca detiene el arranque del servidor.
-- ============================================================

DO $bpe$
DECLARE
  v_curso    BIGINT;
  v_unidad   BIGINT;
  v_clase    BIGINT;
  v_banco    BIGINT;
  v_pregunta BIGINT;
  v_eval     BIGINT;
  v_act      BIGINT;
  v_foro     BIGINT;
  v_orden    INTEGER;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales. Se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió unidades o clases en el panel, no se fuerza nada.
  IF EXISTS (
    SELECT 1 FROM (VALUES
      ('Qué es una preparación magistral', 'Magistral, oficinal e industrial'),
      ('Qué es una preparación magistral', 'El marco normativo colombiano'),
      ('Qué es una preparación magistral', 'Qué no se puede preparar'),
      ('El establecimiento y el proceso', 'Áreas, equipos y condiciones'),
      ('El establecimiento y el proceso', 'Materias primas y agua'),
      ('El establecimiento y el proceso', 'La guía de elaboración y el etiquetado'),
      ('Calidad y seguridad del paciente', 'Controles de calidad posibles'),
      ('Calidad y seguridad del paciente', 'Estabilidad y fecha límite de uso'),
      ('Calidad y seguridad del paciente', 'Cuando algo sale mal: farmacovigilancia')
    ) AS e(unidad, clase)
     WHERE NOT EXISTS (
       SELECT 1 FROM aula_lessons l JOIN aula_modules m ON m.id = l.module_id
        WHERE l.course_id = v_curso AND m.course_id = v_curso AND l.deleted_at IS NULL AND m.deleted_at IS NULL
          AND m.title = e.unidad AND l.title = e.clase)
  ) THEN
    RAISE NOTICE 'BPE y preparaciones magistrales: sus unidades o clases no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET short_description = 'Curso para clasificar, elaborar, controlar y fechar preparaciones magistrales no estériles en Colombia con criterio técnico, trazabilidad y seguridad del paciente.',
         description_html = $bpe_html$
<p>Este curso forma a quienes elaboran o supervisan preparaciones magistrales no estériles en Colombia. Enseña a decidir si una solicitud es una preparación magistral, qué norma la regula y quién puede elaborarla; a organizar el área, los equipos, las materias primas, el agua y los documentos; y a controlar, fechar y vigilar lo elaborado.</p>
<p>Cada clase parte de un caso, lo resuelve con la norma vigente y termina con una práctica con solución comentada. Cuando un documento está en estado de proyecto, como el proyecto de circular del Invima de junio de 2026, se presenta como tal. Las preparaciones estériles, las nutriciones parenterales y las mezclas oncológicas se estudian en el curso de Central de Mezclas.</p>
<h3>Cómo está organizado</h3>
<ol>
  <li>Qué es una preparación magistral: la figura, su marco normativo y sus límites.</li>
  <li>El establecimiento y el proceso: área y equipos, materias primas y agua, guía de elaboración y etiqueta.</li>
  <li>Calidad y seguridad del paciente: controles posibles, fecha límite de uso y farmacovigilancia.</li>
</ol>
<h3>Cómo se evalúa</h3>
<ul>
  <li><strong>Una actividad por unidad</strong>, basada en un caso de estudio, con título, caso, instrucciones paso a paso y rúbrica.</li>
  <li><strong>Un proyecto integrador</strong>: un solo caso, la puesta en marcha del servicio de magistrales de una clínica, que se construye a lo largo del curso y se entrega en dos partes.</li>
  <li><strong>Un quiz por unidad</strong>, con cuatro preguntas ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar.</li>
  <li><strong>Foros:</strong> uno de bienvenida, sin nota, y un foro de interacción por unidad para argumentar sobre un caso.</li>
</ul>
<h3>Resultados de aprendizaje del curso</h3>
<ul><li>Clasificar una solicitud como preparación magistral u otra figura, con la definición del Decreto 2200 de 2005 modificado por el Decreto 2330 de 2006.</li><li>Ubicar cada pregunta de práctica en la norma que la responde y determinar la autorización que necesita cada establecimiento.</li><li>Verificar el área, los equipos, las materias primas y el agua con el instrumento de la Resolución 444 de 2008.</li><li>Redactar la guía de elaboración, el registro y la etiqueta de una preparación conforme a la Resolución 1403 de 2007.</li><li>Asignar la fecha límite de uso con la Tabla 4 del capítulo 795 de la USP o con datos de estabilidad aplicables.</li><li>Gestionar una sospecha de evento adverso o un problema de calidad: atención, contención, reporte en plazo e investigación.</li></ul>
<h3>Público</h3>
<p>Químicos farmacéuticos, tecnólogos en regencia de farmacia, directores técnicos de farmacias-droguerías, personal de servicios farmacéuticos de IPS y estudiantes de últimos semestres. No se requiere experiencia previa en elaboración.</p>
<h3>Prerrequisitos</h3>
<p>Ninguno obligatorio. Ayuda conocer el funcionamiento de un servicio farmacéutico. El curso no reemplaza el entrenamiento práctico supervisado ni habilita por sí solo para elaborar.</p>
<h3>Evaluación</h3>
<table>
  <caption>Distribución de la nota final</caption>
  <thead><tr><th scope="col">Componente</th><th scope="col">Peso</th><th scope="col">Elementos</th></tr></thead>
  <tbody>
    <tr><td>Actividades entregables</td><td>60 %</td><td>Actividad 1 (12 %); Actividad 2 (12 %); Actividad 3 (12 %); Proyecto integrador, entrega 1 (8 %); Proyecto integrador, entrega final (16 %)</td></tr>
    <tr><td>Quizzes</td><td>30 %</td><td>Quiz de la unidad 1 (10 %); Quiz de la unidad 2 (10 %); Quiz de la unidad 3 (10 %)</td></tr>
    <tr><td>Foros</td><td>10 %</td><td>Foro de interacción 1 (3.34 %); Foro de interacción 2 (3.33 %); Foro de interacción 3 (3.33 %)</td></tr>
    <tr><td><strong>Total</strong></td><td><strong>100 %</strong></td><td>Nota mínima de aprobación: 70/100.</td></tr>
  </tbody>
</table>
<p>Las actividades se reciben hasta 48 horas después de la fecha límite con una reducción de 10 puntos sobre 100. Después se requiere una justificación documentada y la aprobación del docente.</p>
<p>Cada quiz admite dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>
<p>La intervención inicial se publica antes del cierre de la unidad y las respuestas durante la semana siguiente. Se califica la calidad de la interacción, no el número de mensajes. Si el grupo es pequeño, cada foro indica una alternativa.</p>
<p>El curso se aprueba con una nota final igual o superior a 70/100, con las tres actividades de unidad y las dos entregas del proyecto presentadas, y al menos un intento en cada quiz. El foro de bienvenida no tiene nota.</p>
<p>Se permite usar herramientas de IA como apoyo de redacción u organización, declarándolo. No se aceptan como fuente normativa: cada cita se verifica en el normograma o en la fuente original, y el análisis debe ser propio.</p>$bpe_html$,
         objective = 'Que la persona pueda decidir con fundamento si una preparación magistral procede, elaborarla con evidencia trazable, asignarle una fecha límite de uso sustentada y responder de forma ordenada cuando algo sale mal.',
         learning_outcomes = ARRAY['Clasificar una solicitud como preparación magistral u otra figura, con la definición del Decreto 2200 de 2005 modificado por el Decreto 2330 de 2006.', 'Ubicar cada pregunta de práctica en la norma que la responde y determinar la autorización que necesita cada establecimiento.', 'Verificar el área, los equipos, las materias primas y el agua con el instrumento de la Resolución 444 de 2008.', 'Redactar la guía de elaboración, el registro y la etiqueta de una preparación conforme a la Resolución 1403 de 2007.', 'Asignar la fecha límite de uso con la Tabla 4 del capítulo 795 de la USP o con datos de estabilidad aplicables.', 'Gestionar una sospecha de evento adverso o un problema de calidad: atención, contención, reporte en plazo e investigación.']::text[],
         audience = 'Químicos farmacéuticos, tecnólogos en regencia de farmacia, directores técnicos de farmacias-droguerías, personal de servicios farmacéuticos de IPS y estudiantes de últimos semestres. No se requiere experiencia previa en elaboración.',
         prerequisites = 'Ninguno obligatorio. Ayuda conocer el funcionamiento de un servicio farmacéutico. El curso no reemplaza el entrenamiento práctico supervisado ni habilita por sí solo para elaborar.',
         duration_minutes = 1320,
         level = 'intermedio',
         category = 'Servicio farmacéutico',
         area = 'Calidad',
         tags = ARRAY['BPE', 'Preparaciones magistrales', 'Invima', 'Servicio farmacéutico', 'Calidad']::text[],
         passing_score = 70,
         max_attempts = 2,
         grade_policy = $bpe_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$bpe_json$::jsonb,
         updated_at = NOW()
   WHERE id = v_curso;


  -- ── Unidad 1 ─────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Qué es una preparación magistral' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Qué es una preparación magistral). Se salta.';
    RETURN;
  END IF;
  UPDATE aula_modules SET description = 'Qué distingue una preparación magistral de un medicamento con registro sanitario, qué normas la regulan en Colombia y dónde están sus límites.', updated_at = NOW() WHERE id = v_unidad;


  -- ── Unidad 2 ─────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'El establecimiento y el proceso' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (El establecimiento y el proceso). Se salta.';
    RETURN;
  END IF;
  UPDATE aula_modules SET description = 'Cómo se organizan el área, los equipos, las materias primas, el agua y los documentos para que cada preparación sea reproducible y trazable.', updated_at = NOW() WHERE id = v_unidad;


  -- ── Unidad 3 ─────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Calidad y seguridad del paciente' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Calidad y seguridad del paciente). Se salta.';
    RETURN;
  END IF;
  UPDATE aula_modules SET description = 'Qué controles son posibles, cómo se sustenta la fecha límite de uso y qué hacer cuando una preparación causa un problema.', updated_at = NOW() WHERE id = v_unidad;


  -- ── bpe-u1-l1 · Magistral, oficinal e industrial ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Qué es una preparación magistral' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Qué es una preparación magistral). Se salta.';
    RETURN;
  END IF;
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND module_id = v_unidad AND title = 'Magistral, oficinal e industrial' AND deleted_at IS NULL
   LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'No existe la clase Magistral, oficinal e industrial. Se salta.';
    RETURN;
  END IF;

  UPDATE aula_lessons
     SET subtitle = 'Clase 1 · Tres palabras, tres regímenes',
         duration_minutes = 65,
         completion_rule = 'manual',
         is_required = TRUE,
         updated_at = NOW()
   WHERE id = v_clase;

  -- El texto breve, los destacados y los enlaces anteriores se sustituyen
  -- por la clase completa y por enlaces verificados.
  DELETE FROM aula_lesson_blocks
   WHERE lesson_id = v_clase
     AND (type IN ('texto', 'destacado', 'enlace') OR (type = 'video' AND data->>'videoId' = 'QCGnnSDFgk0'));

  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, jsonb_build_object('html', $bpe_html$<article>
<p>Antes de pesar un solo gramo hay que saber qué se está haciendo ante la ley. Esta clase convierte la definición de preparación magistral en una prueba de tres preguntas. Si la clasificación falla, todo lo demás se aplica sobre la figura equivocada.</p>
<p><strong>Video complementario (opcional):</strong> «¿Qué es la formulación magistral? Farmacia Elena Manso», EFEsalud, 6:09 min, publicado el 12 de diciembre de 2025. Tramo recomendado: del minuto 3:10 al 5:40. Muestra el laboratorio de una farmacia española: suspensiones pediátricas a partir de tabletas, cremas con varios activos y cápsulas sin lactosa. Es contexto español; úsalo para ver el trabajo, no la regla colombiana. Revisamos su transcripción automática el 3 de noviembre de 2026.</p>
<h2>Resultados de aprendizaje</h2>
<ul><li>Aplicar la prueba de los tres elementos de la definición colombiana —prescripción para un paciente individual, intervención técnica y dispensación inmediata— para decidir si un producto es una preparación magistral.</li><li>Explicar por qué «preparado oficinal» no es una categoría de la normativa colombiana y qué riesgo trae usarlo como si lo fuera.</li><li>Diferenciar la preparación magistral del medicamento con registro sanitario y de otros procesos especiales, como el reempaque.</li></ul>
<h2>Prerrequisitos</h2>
<p>Ninguno. Ayuda saber qué es una prescripción médica.</p>
<h2>Caso de partida</h2>
<p>Un lunes, la directora técnica de una farmacia-droguería de Pereira recibe cuatro solicitudes. La primera es omeprazol en suspensión oral de 2 mg/mL para una bebé de nueve meses, con nombre, documento, peso, dosis y la nota del pediatra de que la niña no traga cápsulas. La segunda pide «fórmula triple despigmentante en crema, 30 g», sin componentes ni concentraciones. La tercera llega por WhatsApp: un gimnasio quiere 60 tubos con su logo de una crema de naproxeno con indometacina, sin receta, para vender a sus socios. La cuarta es de una clínica que le pide reempacar tabletas comerciales en dosis unitarias. Solo una puede aceptarse tal como llegó.</p>

<h3>Por qué la clasificación va primero</h3>
<p>En Colombia, el nombre de la figura decide el régimen. Un medicamento fabricado en serie necesita registro sanitario y una planta con Buenas Prácticas de Manufactura. Una preparación magistral no necesita registro, pero sí las condiciones esenciales y los protocolos de la Resolución 1403 de 2007 y, según quién la elabore, el certificado de Buenas Prácticas de Elaboración (BPE) del Invima. Llamar «magistral» a lo que no lo es termina en un medicamento sin registro; negarle la figura a una magistral legítima deja a un paciente sin tratamiento.</p>

<h3>La definición vigente, convertida en prueba</h3>
<p>El artículo 3 del Decreto 2200 de 2005, en el texto que le dio el Decreto 2330 de 2006 (compilado en el artículo 2.5.3.10.3 del Decreto 780 de 2016), define la preparación magistral como el preparado que atiende una prescripción médica de un paciente individual y requiere una intervención técnica de variada complejidad, y añade que debe ser de dispensación inmediata. De ahí salen tres preguntas que deben responderse «sí»:</p>
<ol>
  <li><strong>¿Hay prescripción para un paciente individual?</strong> De un profesional autorizado, con el paciente identificado y, en magistrales, cada componente con su cantidad (artículo 16, numeral 8).</li>
  <li><strong>¿Hace falta una intervención técnica?</strong> Pesar, triturar, levigar, disolver, mezclar o encapsular, por personal facultado en un establecimiento autorizado.</li>
  <li><strong>¿Se prepara para dispensarla ya, a ese paciente?</strong> No se elabora para inventario.</li>
</ol>
<p>El Manual de la Resolución 1403 (Título II, Capítulo III, numeral 2.1) añade el propósito: atender la necesidad individual de un paciente en relación con medicamentos que no se encuentran en el mercado nacional. La clase 3 explica cómo se lee cuando ya existe un producto registrado.</p>

<figure>
  <figcaption>Figura 1. Ruta de decisión. Basta un «no» para salir de la figura magistral.</figcaption>
  <ol>
    <li>¿Hay prescripción de un profesional autorizado? Si no → no se elabora.</li>
    <li>¿Identifica al paciente y cada componente con su cantidad? Si falta algo → se consulta al prescriptor.</li>
    <li>¿Exige una intervención técnica? Si no → es dispensación.</li>
    <li>¿Es para entregar a ese paciente, sin inventario previo? Si no → es producción anticipada.</li>
    <li>¿El establecimiento y la persona están autorizados para ese proceso y esa forma? Si no → se remite.</li>
  </ol>
</figure>

<h3>Ejemplo resuelto 1: las cuatro solicitudes del lunes</h3>
<table>
  <caption>Tabla 1. Clasificación de las solicitudes del caso</caption>
  <thead><tr><th scope="col">Solicitud</th><th scope="col">Elemento decisivo</th><th scope="col">Conclusión</th></tr></thead>
  <tbody>
    <tr><td>Omeprazol 2 mg/mL para la lactante</td><td>Los tres se cumplen: prescripción completa, intervención para obtener una suspensión, dispensación a esa paciente.</td><td>Magistral. Se acepta si el establecimiento está autorizado para líquidos orales no estériles.</td></tr>
    <tr><td>«Fórmula triple», 30 g</td><td>Faltan componentes y cantidades.</td><td>Todavía no: se llama al prescriptor.</td></tr>
    <tr><td>60 tubos para el gimnasio</td><td>No hay prescripción ni paciente; es para vender a terceros.</td><td>No es magistral: sería un medicamento en serie sin registro. Se rechaza.</td></tr>
    <tr><td>Reempaque para la clínica</td><td>No se elabora una fórmula: se reempaca un producto.</td><td>Es otro proceso especial, con sus propias reglas.</td></tr>
  </tbody>
</table>
<p>La decisión no depende de si la tarea «parece laboratorio». El gimnasio pide algo técnicamente sencillo y es la solicitud más grave.</p>

<h3>El medicamento industrial y lo «oficinal»</h3>
<p>El medicamento industrial se diseña antes de que exista el paciente: su fórmula, su proceso y su estabilidad se demuestran para obtener el registro sanitario (Decreto 677 de 1995), y el fabricante asigna una fecha de vencimiento. La magistral recorre el camino al revés: primero el paciente, después la preparación; y quien la elabora asigna una fecha límite de uso, que la USP distingue expresamente del vencimiento (preguntas frecuentes del capítulo 795, pregunta 57).</p>
<p>«Oficinal» no aparece en el Decreto 2200, el Decreto 2330, la Resolución 1403 ni la Resolución 444. Es una figura de otros sistemas: en España, el Real Decreto Legislativo 1/2015 (artículo 2, letra j) llama preparado oficinal al que está descrito en el Formulario Nacional y se entrega directamente a los pacientes de esa farmacia. En Colombia, lo que exime del registro es la preparación para un paciente individual. El proyecto de circular del Invima de junio de 2026, aún no expedido, lo dice como criterio: lo estandarizado y en serie, sin prescripción, ofrecido al público, es medicamento sin registro. La conclusión ya se deriva de la definición vigente.</p>

<h3>Ejemplo resuelto 2: la tentación del inventario</h3>
<p>Una farmacia recibe cada semana unas quince fórmulas iguales de crema de urea al 20 %, cada una para un paciente distinto. La regente propone preparar 30 tubos el lunes «para ganar tiempo».</p>
<ul>
  <li><strong>Elaborar cada fórmula cuando llega:</strong> cada preparación responde a su prescripción y se dispensa. El número de pacientes no cambia la figura.</li>
  <li><strong>Preparar 30 tubos antes:</strong> los tubos existen antes que las prescripciones; no hay dispensación inmediata. Si un paciente no llega, el tubo queda como un medicamento sin registro.</li>
</ul>
<p>Se puede planear el día —agrupar elaboraciones, alistar material, verificar materias primas—, pero cada preparación nace de una prescripción. Tampoco son magistrales el reempaque, el reenvase o la reconstitución según el inserto: el artículo 15 del Decreto 2200 los trata como procesos distintos, y la USP deja la reconstitución según rotulado fuera del capítulo 795 (pregunta 10).</p>

<h2>Segundo caso contrastado</h2>
<p>Un regente de Cúcuta vio el video de la farmacia española y propone elaborar sin receta una pomada de óxido de zinc y una solución de ácido salicílico «porque son fórmulas de farmacopea».</p>
<p><strong>Análisis.</strong> En España la figura existe porque una ley la crea y un formulario la delimita. En Colombia no hay una norma equivalente: sin prescripción individual no se cumple la definición del Decreto 2200. Que una fórmula sea de farmacopea describe su calidad técnica, no su régimen legal. Lo que sí puede hacer es elaborar esas fórmulas cuando lleguen prescritas para un paciente.</p>

<h2>Mapa de relaciones</h2>
<p>Lee el mapa de izquierda a derecha: cada fila declara una relación y explica por qué existe. Es la estructura que conecta los conceptos de la clase, no una lista de definiciones sueltas.</p>

<table>
  <caption>Mapa de relaciones de la clase</caption>
  <thead><tr><th scope="col">Concepto A</th><th scope="col">Relación</th><th scope="col">Concepto B</th><th scope="col">Por qué</th></tr></thead>
  <tbody>
    <tr><td>Preparación magistral</td><td>se define por</td><td>Prescripción para un paciente individual</td><td>La individualización la separa de la producción en serie.</td></tr>
    <tr><td>Preparación magistral</td><td>exige</td><td>Dispensación inmediata</td><td>Se elabora para entregarse, no para inventario.</td></tr>
    <tr><td>Preparación magistral</td><td>no requiere</td><td>Registro sanitario</td><td>Su control son las condiciones esenciales, los protocolos y, si aplica, el certificado BPE.</td></tr>
    <tr><td>Medicamento industrial</td><td>requiere</td><td>Registro sanitario</td><td>Se demuestra para el producto antes de que exista el paciente.</td></tr>
    <tr><td>«Preparado oficinal»</td><td>pertenece a</td><td>Otras legislaciones</td><td>No está en las normas colombianas del servicio farmacéutico.</td></tr>
  </tbody>
</table>

<h2>Errores frecuentes y cómo corregirlos</h2>
<ul><li>Definir la magistral por el tamaño del lote o porque «se hace a mano». Corrección: la definen la prescripción individual, la intervención técnica y la dispensación inmediata.</li><li>Usar «oficinal» como categoría colombiana para elaborar sin receta. Corrección: no está en la norma colombiana; sin prescripción, lo preparado para vender queda fuera de la figura.</li><li>Creer que «sin registro sanitario» significa «sin control». Corrección: hay condiciones esenciales, protocolos (Resolución 1403, artículo 10) y, según el caso, certificado BPE.</li><li>Aceptar una fórmula que solo dice «crema triple». Corrección: cada componente con su cantidad; se consulta al prescriptor.</li></ul>
<h2>Práctica de autoevaluación</h2>

<p>Clasifica cada situación como <strong>magistral</strong>, <strong>no es magistral</strong>, <strong>otro proceso</strong> o <strong>falta información</strong>, con el elemento que decide.</p>
<ol>
  <li>Cápsulas de 3 mg de un activo cuya presentación comercial mínima es de 10 mg, para un niño identificado.</li>
  <li>Una clínica pide reenvasar jarabe comercial en jeringas orales de dosis única.</li>
  <li>Una tienda naturista encarga 100 frascos de loción con ácido salicílico para su vitrina.</li>
  <li>Una fórmula pide «crema c. s. p. 50 g + ácido retinoico» sin concentración.</li>
</ol>
<details>
  <summary>Ver solución comentada</summary>
  
<ol>
  <li><strong>Magistral:</strong> prescripción individual, dosis inexistente que exige intervención y dispensación inmediata.</li>
  <li><strong>Otro proceso:</strong> reenvase en dosis unitaria; no se elabora una fórmula.</li>
  <li><strong>No es magistral:</strong> no hay prescripción ni paciente.</li>
  <li><strong>Falta información:</strong> sin concentración no hay fórmula completa (Decreto 2200, artículo 16, numeral 8).</li>
</ol>
</details>
<h2>Práctica adicional</h2>
<p>Redacta en un máximo de 100 palabras la respuesta escrita al gimnasio del caso: por qué no se atiende, con qué norma y qué alternativa ofreces.</p>
<details>
  <summary>Ver solución comentada</summary>
  <p><strong>Respuesta modelo.</strong> «Gracias por escribirnos. No podemos elaborar los 60 tubos: una preparación magistral solo se elabora a partir de la prescripción médica de un paciente individual y se dispensa a ese paciente (Decreto 2200 de 2005, artículo 3, modificado por el Decreto 2330 de 2006). Elaborar unidades para venta sería producir un medicamento sin registro sanitario. Si algún socio tiene una fórmula médica, con gusto la elaboramos para él.» Se valoran la negativa clara, el fundamento y la alternativa.</p>
</details>
<h2>Síntesis y puente</h2>
<p>Hay preparación magistral cuando concurren prescripción individual, intervención técnica y dispensación inmediata. «Oficinal» es una palabra de otras legislaciones, no una puerta para elaborar sin receta. La próxima clase ubica cada pregunta en su norma y muestra quién autoriza a cada establecimiento.</p>
<h2>Preguntas de transferencia</h2><p>Lleva lo aprendido a una situación distinta de la del caso. No hay una única respuesta: lo que cuenta es el razonamiento y la evidencia que uses.</p><ol><li>Una IPS quiere preparar cada mañana diez jeringas orales de jarabe «por si llegan pacientes». ¿Qué elemento falla y qué alternativa organizativa propondrías?</li></ol>
<h2>Referencias consultadas</h2>
<ol>
<li>Ministerio de la Protección Social. <em>Decreto 2200 de 2005 (texto con modificaciones)</em> (2005). Definición (artículo 3), procesos especiales (artículo 15) y prescripción (artículo 16). <a href="https://normograma.invima.gov.co/compilacion/docs/decreto_2200_2005.htm" target="_blank" rel="noopener noreferrer nofollow">https://normograma.invima.gov.co/compilacion/docs/decreto_2200_2005.htm</a>. Consultado: 2026-11-03.</li>
<li>Ministerio de la Protección Social. <em>Decreto 2330 de 2006</em> (2006). Texto vigente de la definición, con la dispensación inmediata. <a href="https://normograma.invima.gov.co/compilacion/docs/decreto_2330_2006.htm" target="_blank" rel="noopener noreferrer nofollow">https://normograma.invima.gov.co/compilacion/docs/decreto_2330_2006.htm</a>. Consultado: 2026-11-03.</li>
<li>Ministerio de la Protección Social. <em>Resolución 1403 de 2007 y su Manual de Condiciones Esenciales</em> (2007). Propósito de las magistrales (Manual, numeral 2.1). <a href="https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_1403_2007.htm" target="_blank" rel="noopener noreferrer nofollow">https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_1403_2007.htm</a>. Consultado: 2026-11-03.</li>
<li>Boletín Oficial del Estado, España. <em>Real Decreto Legislativo 1/2015 (versión consolidada)</em> (2015). Fórmula magistral y preparado oficinal en España (artículo 2), solo como comparación. <a href="https://www.boe.es/buscar/act.php?id=BOE-A-2015-8343" target="_blank" rel="noopener noreferrer nofollow">https://www.boe.es/buscar/act.php?id=BOE-A-2015-8343</a>. Consultado: 2026-11-03.</li>
<li>United States Pharmacopeia. <em>795 FAQs (1 de noviembre de 2023)</em> (2023). Vencimiento frente a fecha límite de uso (pregunta 57) y reconstitución (pregunta 10). <a href="https://pages.usp.org/rs/711-SXF-172/images/HQS%20-%20USP%20GC%20795%20FAQs.pdf" target="_blank" rel="noopener noreferrer nofollow">https://pages.usp.org/rs/711-SXF-172/images/HQS%20-%20USP%20GC%20795%20FAQs.pdf</a>. Consultado: 2026-11-03.</li>
</ol>
</article>$bpe_html$));


  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, $bpe_json${"source":"enlace","url":"https://www.youtube.com/watch?v=QCGnnSDFgk0","provider":"youtube","videoId":"QCGnnSDFgk0","title":"Complementario: ¿Qué es la formulación magistral? Farmacia Elena Manso","transcriptHtml":""}$bpe_json$::jsonb);


  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, $bpe_json${"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_2200_2005.htm","title":"Decreto 2200 de 2005 (texto con modificaciones)","description":"Normograma del Invima. Artículo 3 (definiciones) y artículo 16 (prescripción)."}$bpe_json$::jsonb);


  -- ── bpe-u1-l2 · El marco normativo colombiano ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Qué es una preparación magistral' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Qué es una preparación magistral). Se salta.';
    RETURN;
  END IF;
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND module_id = v_unidad AND title = 'El marco normativo colombiano' AND deleted_at IS NULL
   LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'No existe la clase El marco normativo colombiano. Se salta.';
    RETURN;
  END IF;

  UPDATE aula_lessons
     SET subtitle = 'Clase 2 · Qué norma responde qué pregunta',
         duration_minutes = 70,
         completion_rule = 'manual',
         is_required = TRUE,
         updated_at = NOW()
   WHERE id = v_clase;

  -- El texto breve, los destacados y los enlaces anteriores se sustituyen
  -- por la clase completa y por enlaces verificados.
  DELETE FROM aula_lesson_blocks
   WHERE lesson_id = v_clase
     AND (type IN ('texto', 'destacado', 'enlace'));

  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, jsonb_build_object('html', $bpe_html$<article>
<p>Las normas no se aprenden de memoria: se aprende a encontrarlas. Esta clase te da un mapa de cinco capas y un método para citar sin equivocarte, incluido qué hacer con un documento que circula como «la nueva norma» y todavía es un proyecto.</p>
<p><strong>Clase sin video principal.</strong> No encontramos un video vigente, verificable y ajustado a la norma colombiana que enseñe este tema mejor que el texto. La clase es completa sin video: trae dos ejemplos resueltos y una práctica adicional.</p>
<h2>Resultados de aprendizaje</h2>
<ul><li>Ubicar una pregunta de práctica —definición, condiciones, verificación, trámite o técnica— en la norma que la responde y citar el artículo o numeral.</li><li>Determinar qué autorización necesita un establecimiento según su tipo y el proceso que realiza.</li><li>Distinguir una norma vigente, una derogada y un proyecto, y citar cada una con su estado.</li></ul>
<h2>Prerrequisitos</h2>
<p>Clase 1: aplicar la prueba de los tres elementos.</p>
<h2>Caso de partida</h2>
<p>Una química farmacéutica abrirá una farmacia-droguería en Bucaramanga para elaborar cremas y lociones por prescripción. Su socio le dice: «Con la autorización de la Secretaría de Salud basta». Un consultor asegura: «Todo el que prepare necesita certificado BPE del Invima». Y un colega le reenvía un archivo titulado «Circular 1000-xxx-2026» con el mensaje: «Ya salió: el Invima no puede exigir nada más». Necesita saber cuál de las tres afirmaciones se sostiene.</p>

<h3>Cinco capas, cinco preguntas</h3>
<table>
  <caption>Tabla 1. Qué responde cada norma</caption>
  <thead><tr><th scope="col">Norma</th><th scope="col">Pregunta que responde</th><th scope="col">Dónde mirar</th></tr></thead>
  <tbody>
    <tr><td>Decreto 2200 de 2005, modificado por el Decreto 2330 de 2006</td><td>Qué es una magistral, qué hace cada establecimiento, quién lo dirige, qué lleva la prescripción.</td><td>Artículos 3, 11, 15, 16, 17 y 19.</td></tr>
    <tr><td>Resolución 1403 de 2007 y su Manual</td><td>Condiciones esenciales, protocolos, inspección y alcance de cada autorización.</td><td>Artículos 8, 10, 11, 22 y 23; Manual, Título II, Capítulo III, numeral 2.</td></tr>
    <tr><td>Resolución 444 de 2008</td><td>Con qué instrumento se verifican las BPE y cuánto dura el certificado.</td><td>Artículos 1 a 5 e instrumento con criterios Crítico, Mayor, Menor e Informativo.</td></tr>
    <tr><td>Decreto 335 de 2022</td><td>Cómo se tramita, renueva o amplía el certificado.</td><td>Artículos 2 a 13 y 17.</td></tr>
    <tr><td>Referencias técnicas</td><td>Con qué criterio técnico se escribe un protocolo.</td><td>Farmacopeas oficialmente adoptadas y estándares reconocidos, a los que remiten los artículos 11 y 25 de la Resolución 1403. Aquí se usa el capítulo 795 de la USP como referencia, no como norma colombiana.</td></tr>
  </tbody>
</table>

<h3>Quién autoriza qué</h3>
<ul>
  <li><strong>Farmacia-droguería:</strong> la autoriza la entidad territorial de salud para recepción y almacenamiento, dispensación y preparaciones magistrales (Decreto 2200, artículo 11, numeral 1; Resolución 1403, artículo 23, numeral 2). La dirige un químico farmacéutico; si solo elabora preparaciones no estériles de uso tópico, puede elaborarlas y dirigirla un tecnólogo en regencia de farmacia.</li>
  <li><strong>Droguería:</strong> no elabora preparaciones magistrales (Manual, apartado de la droguería).</li>
  <li><strong>Servicio farmacéutico de IPS:</strong> lo habilita la entidad territorial; si elabora magistrales o ajusta dosis, el Invima certifica sus BPE (artículos 22, numeral 3, y 23, numeral 3).</li>
  <li><strong>Quien elabora por cuenta de otro</strong> (Decreto 2200, artículo 11, parágrafo 5): certificado del Invima, dirección exclusiva de químico farmacéutico y responsabilidad solidaria con quien contrata. El decreto dice «Manufactura»; el parágrafo del artículo 8 de la Resolución 1403 aclara que se entiende «Elaboración».</li>
  <li><strong>Suministro a otros establecimientos o IPS:</strong> solo para pacientes determinados y con certificado BPE (Manual, numeral 2.5).</li>
</ul>

<h3>Ejemplo resuelto 1: las tres afirmaciones del caso</h3>
<p><strong>«Con la Secretaría basta».</strong> Parcialmente cierto. Si la farmacia elabora para sus propios pacientes, la autorización territorial cubre el proceso, con área especial, protocolos y registros. Si empieza a elaborar por contrato para una IPS, entra en el parágrafo 5 o en el numeral 2.5 y necesita certificado BPE.</p>
<p><strong>«Todo el que prepare necesita certificado».</strong> Generalización. Los artículos 22 y 23 asignan al Invima la certificación de servicios de IPS y de quienes elaboran por cuenta de otro; el Decreto 335 regula el trámite para quienes la «requieran». Como circulan lecturas distintas, lo prudente es consultar por escrito a la entidad territorial y al Invima con la descripción exacta de los procesos, y archivar la respuesta.</p>
<p><strong>«Ya salió la circular».</strong> Falso. Es un proyecto para comentarios: su número dice «1000-xxx-2026», la fecha «a los xxx días» y el periodo de participación «[X] de [X]». Además, su texto no dice que no pueda exigirse nada: dice que la actividad requiere certificado BPE y que no deben pedirse requisitos ajenos a las normas vigentes.</p>

<h3>Ejemplo resuelto 2: una remisión a una norma derogada</h3>
<p>El artículo 2 de la Resolución 444 remite el trámite al Decreto 549 de 2001. Una auditora escribe: «El trámite se rige por el Decreto 549». Para comprobarlo:</p>
<ol>
  <li>En el normograma, el artículo 17 del Decreto 335 de 2022 derogó el Decreto 549 desde el 30 de junio de 2022.</li>
  <li>El artículo 2, numeral 2.3, del Decreto 335 incluye a quienes elaboran preparaciones magistrales y requieren BPE.</li>
  <li>Cita corregida: «El trámite se rige por el Decreto 335 de 2022; la Resolución 444 de 2008 sigue siendo el instrumento de verificación».</li>
</ol>
<p>En la práctica: revisión de la solicitud en 15 días hábiles, visita en no más de 90 días calendario, conceptos «CUMPLE», «CUMPLE CONDICIONADO» o «NO CUMPLE» (artículos 4 a 6); el acto nombra procesos y formas farmacéuticas (artículo 9.2); lo nuevo exige ampliación (artículo 12.2); la renovación se radica al menos cinco días hábiles antes (artículo 11). El certificado BPE dura cinco años (Resolución 444, artículo 3).</p>

<figure>
  <figcaption>Figura 1. Método de cuatro pasos para una pregunta normativa.</figcaption>
  <ol>
    <li>Clasifica la pregunta: definición, condiciones, verificación, trámite o técnica.</li>
    <li>Abre la capa correcta de la Tabla 1 y localiza el artículo.</li>
    <li>Comprueba su estado: modificado, compilado, derogado o proyecto.</li>
    <li>Escribe la cita completa y su consecuencia práctica.</li>
  </ol>
</figure>

<h2>Segundo caso contrastado</h2>
<p>El servicio farmacéutico de una clínica de Cali, habilitado por la Secretaría, quiere elaborar suspensiones orales pediátricas y cree que la habilitación basta «porque todo queda en la clínica».</p>
<p><strong>Análisis.</strong> La habilitación cubre los procesos del servicio, salvo los que certifica el Invima (Resolución 1403, artículo 23, numeral 1). Elaborar magistrales en un servicio de IPS requiere certificado BPE (numeral 3, literal a). Si la clínica ya está certificada para sólidos, las suspensiones exigen ampliación (Decreto 335, artículo 12.2). La misma técnica pide autorizaciones distintas según quién la realiza.</p>

<h2>Mapa de relaciones</h2>
<p>Lee el mapa de izquierda a derecha: cada fila declara una relación y explica por qué existe. Es la estructura que conecta los conceptos de la clase, no una lista de definiciones sueltas.</p>

<table>
  <caption>Mapa de relaciones de la clase</caption>
  <thead><tr><th scope="col">Concepto A</th><th scope="col">Relación</th><th scope="col">Concepto B</th><th scope="col">Por qué</th></tr></thead>
  <tbody>
    <tr><td>Decreto 2200</td><td>define</td><td>Figura, establecimientos y prescripción</td><td>Es la norma base; el Decreto 2330 modificó la definición.</td></tr>
    <tr><td>Resolución 1403</td><td>desarrolla</td><td>Condiciones, protocolos y autorizaciones</td><td>Su Manual describe cómo se elabora y qué se controla.</td></tr>
    <tr><td>Resolución 444</td><td>verifica</td><td>Buenas Prácticas de Elaboración</td><td>Es el instrumento con criterios de impacto.</td></tr>
    <tr><td>Decreto 335</td><td>reemplaza a</td><td>Decreto 549 de 2001</td><td>Rige el trámite desde el 30 de junio de 2022.</td></tr>
    <tr><td>Tipo de establecimiento</td><td>determina</td><td>La autorización</td><td>La misma técnica exige permisos distintos según quién y para quién.</td></tr>
  </tbody>
</table>

<h2>Errores frecuentes y cómo corregirlos</h2>
<ul><li>Citar el Decreto 549 de 2001 como norma del trámite. Corrección: lo derogó el Decreto 335 de 2022.</li><li>Tomar un proyecto como norma vigente porque circula en PDF. Corrección: revisa número, fecha y estado; cítalo como proyecto.</li><li>Creer que una autorización sirve para cualquier proceso. Corrección: el certificado nombra procesos y formas; lo nuevo exige ampliación.</li><li>Citar la USP como norma colombiana. Corrección: es referencia técnica; la obligación viene de la Resolución 1403 y de la 444.</li></ul>
<h2>Práctica de autoevaluación</h2>

<p>Indica en qué norma y artículo o numeral buscarías cada respuesta.</p>
<ol>
  <li>¿Puede un tecnólogo en regencia elaborar un gel de uso tópico?</li>
  <li>¿Qué protocolos mínimos debe tener quien elabora magistrales?</li>
  <li>¿Cuánto dura el certificado BPE?</li>
  <li>¿Con cuánta anticipación se pide su renovación?</li>
</ol>
<details>
  <summary>Ver solución comentada</summary>
  
<ol>
  <li>Decreto 2200, artículo 11, numeral 1, y Manual de la Resolución 1403, numeral 2.1: sí, si es no estéril y tópico.</li>
  <li>Resolución 1403, artículo 10: once protocolos, desde la interpretación de la orden médica hasta el manejo de residuos.</li>
  <li>Resolución 444, artículo 3: cinco años, renovables.</li>
  <li>Decreto 335, artículo 11: al menos cinco días hábiles antes del vencimiento.</li>
</ol>
</details>
<h2>Práctica adicional</h2>

<p>Determina qué autorización necesita cada caso y cita el fundamento.</p>
<ol>
  <li>Farmacia-droguería de Tunja dirigida por un tecnólogo en regencia que elabora lociones para sus clientes.</li>
  <li>La misma farmacia firma un contrato para elaborar las cremas de los pacientes de una IPS.</li>
</ol>
<details>
  <summary>Ver solución comentada</summary>
  
<ol>
  <li>Autorización territorial (Resolución 1403, artículo 23, numeral 2), con área especial y protocolos; el tecnólogo puede elaborar y dirigir porque son no estériles tópicas (Decreto 2200, artículo 11, numeral 1).</li>
  <li>Al elaborar por cuenta de otro entra en el parágrafo 5 del artículo 11 y en el numeral 2.5 del Manual: certificado BPE y dirección exclusiva de químico farmacéutico. Ya no basta el tecnólogo como director.</li>
</ol>
</details>
<h2>Síntesis y puente</h2>
<p>El Decreto 2200 define, la Resolución 1403 desarrolla, la Resolución 444 verifica y el Decreto 335 tramita. Un proyecto se cita como proyecto y una remisión a una norma derogada se corrige. La próxima clase usa este mapa para trazar los límites de la figura.</p>
<h2>Preguntas de transferencia</h2><p>Lleva lo aprendido a una situación distinta de la del caso. No hay una única respuesta: lo que cuenta es el razonamiento y la evidencia que uses.</p><ol><li>Si el proyecto de circular de 2026 se expidiera, ¿qué verificarías antes de citarlo en un protocolo?</li></ol>
<h2>Referencias consultadas</h2>
<ol>
<li>Ministerio de la Protección Social. <em>Decreto 2200 de 2005 (texto con modificaciones)</em> (2005). Establecimientos, procesos y prescripción (artículos 11, 15 y 16; parágrafo 5 del artículo 11). <a href="https://normograma.invima.gov.co/compilacion/docs/decreto_2200_2005.htm" target="_blank" rel="noopener noreferrer nofollow">https://normograma.invima.gov.co/compilacion/docs/decreto_2200_2005.htm</a>. Consultado: 2026-11-03.</li>
<li>Ministerio de la Protección Social. <em>Resolución 1403 de 2007 y su Manual de Condiciones Esenciales</em> (2007). Artículo 8 (BPM entendidas como BPE), artículo 10, artículos 22 y 23 y numeral 2.5 del Manual. <a href="https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_1403_2007.htm" target="_blank" rel="noopener noreferrer nofollow">https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_1403_2007.htm</a>. Consultado: 2026-11-03.</li>
<li>Ministerio de la Protección Social. <em>Resolución 444 de 2008 (instrumento de verificación de BPE)</em> (2008). Instrumento, vigencia de cinco años y visitas (artículos 1 a 4). <a href="https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_0444_2008.htm" target="_blank" rel="noopener noreferrer nofollow">https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_0444_2008.htm</a>. Consultado: 2026-11-03.</li>
<li>Ministerio de Salud y Protección Social. <em>Decreto 335 de 2022 (certificados de buenas prácticas)</em> (2022). Ámbito, tiempos, conceptos, alcance, renovación, ampliación y derogatorias (artículos 2 a 17). <a href="https://normograma.invima.gov.co/compilacion/docs/decreto_0335_2022.htm" target="_blank" rel="noopener noreferrer nofollow">https://normograma.invima.gov.co/compilacion/docs/decreto_0335_2022.htm</a>. Consultado: 2026-11-03.</li>
<li>Invima. <em>Proyecto de circular sobre preparaciones magistrales (junio de 2026, no expedido)</em> (2026). Ejemplo de cómo citar un proyecto no vigente. <a href="https://www.invima.gov.co/biblioteca/download/145079" target="_blank" rel="noopener noreferrer nofollow">https://www.invima.gov.co/biblioteca/download/145079</a>. Consultado: 2026-11-03.</li>
</ol>
</article>$bpe_html$));


  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, $bpe_json${"url":"https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_1403_2007.htm","title":"Resolución 1403 de 2007 y su Manual","description":"Normograma del Invima. Artículos 8, 10, 22 y 23, y numeral 2 del Capítulo III del Manual."}$bpe_json$::jsonb);


  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, $bpe_json${"url":"https://normograma.invima.gov.co/compilacion/docs/decreto_0335_2022.htm","title":"Decreto 335 de 2022","description":"Trámite, renovación y ampliación del certificado de BPE."}$bpe_json$::jsonb);


  -- ── bpe-u1-l3 · Qué no se puede preparar ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Qué es una preparación magistral' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Qué es una preparación magistral). Se salta.';
    RETURN;
  END IF;
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND module_id = v_unidad AND title = 'Qué no se puede preparar' AND deleted_at IS NULL
   LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'No existe la clase Qué no se puede preparar. Se salta.';
    RETURN;
  END IF;

  UPDATE aula_lessons
     SET subtitle = 'Clase 3 · Límites de la figura, del personal y del lugar',
         duration_minutes = 70,
         completion_rule = 'manual',
         is_required = TRUE,
         updated_at = NOW()
   WHERE id = v_clase;

  -- El texto breve, los destacados y los enlaces anteriores se sustituyen
  -- por la clase completa y por enlaces verificados.
  DELETE FROM aula_lesson_blocks
   WHERE lesson_id = v_clase
     AND (type IN ('texto', 'destacado', 'enlace'));

  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, jsonb_build_object('html', $bpe_html$<article>
<p>Los límites protegen al paciente y a quien elabora. Esta clase separa los que la norma escribe de los que se repiten sin fuente, y termina con el límite exterior: productos que se venden como magistrales sin serlo.</p>
<p><strong>Clase sin video principal.</strong> No encontramos un video vigente, verificable y ajustado a la norma colombiana que enseñe este tema mejor que el texto. La clase es completa sin video: trae dos ejemplos resueltos y una práctica adicional.</p>
<h2>Resultados de aprendizaje</h2>
<ul><li>Explicar por qué la frase «no se puede preparar nada que tenga registro sanitario» no aparece así en la norma, y cómo se justifica una magistral cuando existe un producto registrado.</li><li>Identificar los límites explícitos: quién elabora qué, dónde no se elabora y qué exige una preparación estéril.</li><li>Redactar una respuesta técnica a una solicitud que no puede atenderse, con fundamento y alternativa.</li></ul>
<h2>Prerrequisitos</h2>
<p>Clases 1 y 2.</p>
<h2>Caso de partida</h2>
<p>Una farmacia-droguería de Barranquilla dirigida por un tecnólogo en regencia recibe tres fórmulas. La primera pide metformina 850 mg en cápsulas porque «sale más barata que las tabletas»; el paciente traga tabletas sin problema. La segunda pide minoxidil al 5 % en solución sin propilenglicol: el dermatólogo documenta dermatitis de contacto al propilenglicol de la solución comercial. La tercera es un colirio de ciclosporina al 0,05 %. El tecnólogo quiere atender las tres «porque todas tienen receta».</p>

<h3>Lo que la norma dice y lo que se repite</h3>
<p>Una versión anterior de este curso afirmaba que la Resolución 1403 prohíbe «copiar un medicamento con registro sanitario disponible». Esa frase no aparece así en la norma. Lo que dice el Manual (numeral 2.1) es el propósito: atender la necesidad individual de un paciente en relación con medicamentos que no se encuentran en el mercado nacional. La pregunta correcta no es «¿existe un registro de esta molécula?», sino «¿qué necesidad de este paciente no cubre lo disponible?».</p>
<p>El proyecto de circular del Invima de junio de 2026, no vigente, propone el mismo eje: no objetar una magistral solo porque la molécula tenga registro, y considerarla procedente cuando atiende una necesidad que el producto registrado no satisface. Ambas lecturas llevan a lo mismo: <strong>la necesidad individual debe quedar documentada</strong> —dosis que no existe, forma que el paciente puede usar, excipiente que no tolera, falta de disponibilidad comprobada.</p>

<h3>Ejemplo resuelto 1: las tres fórmulas</h3>
<table>
  <caption>Tabla 1. Análisis de las fórmulas del caso</caption>
  <thead><tr><th scope="col">Fórmula</th><th scope="col">Necesidad y competencia</th><th scope="col">Decisión</th></tr></thead>
  <tbody>
    <tr><td>Metformina en cápsulas</td><td>Misma dosis y vía del producto disponible, que el paciente usa. El precio, por sí solo, no es una necesidad farmacéutica. Además, no es tópica.</td><td>No se elabora; se informa al prescriptor. Con desabastecimiento documentado el análisis cambiaría, y la elaboraría un químico farmacéutico.</td></tr>
    <tr><td>Minoxidil sin propilenglicol</td><td>Intolerancia documentada a un excipiente; preparación no estéril de uso tópico.</td><td>Se elabora con fórmula validada, guía de elaboración y fecha límite de uso sustentada.</td></tr>
    <tr><td>Colirio de ciclosporina</td><td>Preparación estéril: la elabora un químico farmacéutico en áreas limpias.</td><td>Se remite a un servicio con certificado vigente para ese proceso y esa forma.</td></tr>
  </tbody>
</table>
<p>«Tiene receta» es el primer filtro, no el último. Después vienen la necesidad, la competencia, el área y el alcance de la autorización.</p>

<h3>Los límites que sí están escritos</h3>
<ul>
  <li><strong>Sin prescripción completa no se elabora.</strong> El instrumento de la Resolución 444 califica como críticos elaborar contra prescripción y que esta especifique cada componente con su cantidad (ítems 17.1.6 y 17.1.6.1).</li>
  <li><strong>El tecnólogo elabora solo lo no estéril de uso tópico.</strong> Nutriciones parenterales, mezclas oncológicas, preparaciones estériles, ajustes de dosis y radiofármacos son del químico farmacéutico (Manual, numeral 2.1).</li>
  <li><strong>La droguería no elabora</strong>, y el depósito de drogas solo recibe, almacena y, con químico farmacéutico, reenvasa (Decreto 2200, artículo 11, numeral 4).</li>
  <li><strong>Lo estéril exige áreas limpias:</strong> esclusas, aire filtrado, flujo laminar, grados de aire A a D, más de 20 cambios de aire por hora con filtros HEPA para B, C y D, y diferencial de presión registrado (Manual, numeral 2.1).</li>
  <li><strong>El certificado tiene alcance:</strong> procesos y formas que nombra el acto (Decreto 335, artículo 9.2).</li>
</ul>

<figure>
  <figcaption>Figura 1. Semáforo de admisión de una fórmula.</figcaption>
  <table>
    <caption>Condiciones del semáforo</caption>
    <thead><tr><th scope="col">Rojo: no se elabora</th><th scope="col">Amarillo: se actúa antes</th><th scope="col">Verde: se elabora</th></tr></thead>
    <tbody>
      <tr><td>Sin prescripción o sin paciente identificado.</td><td>Faltan componentes o cantidades: consulta al prescriptor.</td><td>Prescripción completa para un paciente.</td></tr>
      <tr><td>Producción para inventario o venta general.</td><td>Necesidad no escrita: se pide la justificación.</td><td>Necesidad individual documentada.</td></tr>
      <tr><td>Proceso o forma no autorizados para ese lugar o esa persona.</td><td>Falta información de compatibilidad o estabilidad.</td><td>Persona, área y autorización adecuadas.</td></tr>
    </tbody>
  </table>
</figure>

<h3>Ejemplo resuelto 2: responder sin cerrar la puerta</h3>
<blockquote><p>«Doctora: recibimos la fórmula de metformina 850 mg en cápsulas para el señor J. P. La presentación en tabletas de 850 mg está disponible y el paciente la usa, por lo que no identificamos una necesidad individual que la preparación magistral deba cubrir (Resolución 1403 de 2007, Manual, numeral 2.1). Si hay una razón clínica que no conocemos —intolerancia a un excipiente, dificultad para tragar—, le agradecemos indicarla y la evaluaremos.»</p></blockquote>
<p>Tiene cuatro partes: qué se recibió, por qué no se elabora, qué información cambiaría la decisión y una puerta abierta. Argumenta sin acusar.</p>

<h2>Segundo caso contrastado</h2>
<p>El 14 de mayo de 2026, el Invima alertó sobre tres productos presentados como magistrales y falsificados: bicarbonato de sodio 1 mEq/mL (lote 251023274); naproxeno, indometacina y vitamina E (lote 251023275), y una loción de ketoconazol, desonida y triclosán (lote 250921380). El establecimiento cuyo nombre aparecía, Tecnología Galénica de Colombia S.A.S., confirmó la falsificación y que desconocía su origen. Según el Invima, estos productos se ofrecen por redes sociales, páginas web, comercios y mensajería instantánea; recomendó suspender su uso y reportar cualquier evento adverso.</p>
<p><strong>Por qué es el límite exterior.</strong> Una magistral legítima tiene paciente, prescripción, establecimiento identificable y registro de elaboración. Un frasco con lote comprado por mensajería sin fórmula no tiene ninguna de esas garantías. La trazabilidad —qué se elaboró, para quién, con qué materia prima y quién firmó— es lo que distingue una magistral de una falsificación.</p>

<h2>Mapa de relaciones</h2>
<p>Lee el mapa de izquierda a derecha: cada fila declara una relación y explica por qué existe. Es la estructura que conecta los conceptos de la clase, no una lista de definiciones sueltas.</p>

<table>
  <caption>Mapa de relaciones de la clase</caption>
  <thead><tr><th scope="col">Concepto A</th><th scope="col">Relación</th><th scope="col">Concepto B</th><th scope="col">Por qué</th></tr></thead>
  <tbody>
    <tr><td>Necesidad individual documentada</td><td>justifica</td><td>La preparación magistral</td><td>Es el propósito de la figura (Manual, numeral 2.1).</td></tr>
    <tr><td>Producto disponible y adecuado</td><td>hace innecesaria</td><td>Una magistral equivalente</td><td>Si el paciente puede usarlo, no hay necesidad que cubrir.</td></tr>
    <tr><td>Tecnólogo en regencia</td><td>elabora solo</td><td>No estériles de uso tópico</td><td>Lo demás es del químico farmacéutico.</td></tr>
    <tr><td>Preparación estéril</td><td>exige</td><td>Áreas limpias y flujo laminar</td><td>El riesgo microbiológico no se controla en un área común.</td></tr>
    <tr><td>Producto sin paciente ni trazabilidad</td><td>no es</td><td>Una preparación magistral</td><td>Es un riesgo sanitario, como mostró la alerta de 2026.</td></tr>
  </tbody>
</table>

<h2>Errores frecuentes y cómo corregirlos</h2>
<ul><li>Repetir que «la norma prohíbe preparar moléculas con registro». Corrección: documenta la necesidad individual que lo disponible no cubre.</li><li>Aceptar una fórmula solo porque «tiene receta». Corrección: revisa también necesidad, competencia, área y autorización.</li><li>Que un tecnólogo elabore una preparación estéril o un ajuste de dosis. Corrección: corresponde a un químico farmacéutico, en las áreas que exige.</li><li>Citar el proyecto de circular como vigente. Corrección: preséntalo como proyecto y fundamenta en el Decreto 2200 y la Resolución 1403.</li></ul>
<h2>Práctica de autoevaluación</h2>

<p>Decide si cada fórmula se <strong>acepta</strong>, se <strong>acepta con condición</strong>, se <strong>remite</strong> o se <strong>rechaza</strong>.</p>
<ol>
  <li>Hidrocortisona 1 mg en papelillos para un lactante; la tableta comercial más pequeña es de 5 mg. Farmacia dirigida por químico farmacéutico.</li>
  <li>Crema de urea al 10 % igual a una comercial que el paciente usa sin problemas; quiere «una más grande».</li>
  <li>Gotas óticas estériles en una farmacia-droguería sin áreas limpias.</li>
  <li>Un spa pide 20 frascos de una loción «para la cabina».</li>
</ol>
<details>
  <summary>Ver solución comentada</summary>
  
<ol>
  <li><strong>Acepta:</strong> dosis inexistente, forma no estéril; la elabora el químico farmacéutico porque no es tópica.</li>
  <li><strong>Rechaza:</strong> el producto disponible cubre la necesidad; el tamaño no es una necesidad farmacéutica.</li>
  <li><strong>Remite:</strong> es estéril; exige áreas limpias, químico farmacéutico y certificado para ese proceso.</li>
  <li><strong>Rechaza:</strong> no hay paciente ni prescripción.</li>
</ol>
</details>
<h2>Práctica adicional</h2>
<p>Escribe la respuesta al oftalmólogo del colirio del caso, en máximo 100 palabras y con las cuatro partes del Ejemplo resuelto 2.</p>
<details>
  <summary>Ver solución comentada</summary>
  <p><strong>Respuesta modelo.</strong> «Doctor: recibimos la fórmula de colirio de ciclosporina al 0,05 % para la señora M. R. Es una preparación estéril; no contamos con áreas limpias ni autorización para ese proceso, que corresponde a un químico farmacéutico en un servicio certificado (Resolución 1403 de 2007, Manual, numeral 2.1). Para no retrasar el tratamiento, le sugerimos remitirla a un servicio con certificado BPE vigente para preparaciones estériles oftálmicas; con gusto le orientamos.» Se valoran la razón técnica, la alternativa y la continuidad del tratamiento.</p>
</details>
<h2>Síntesis y puente</h2>
<p>Lo que limita una magistral no es la existencia de un registro, sino la falta de una necesidad individual documentada, de competencia o de autorización, y la naturaleza del producto. La unidad 2 entra al establecimiento: áreas, equipos, materias primas, agua y documentos.</p>
<h2>Preguntas de transferencia</h2><p>Lleva lo aprendido a una situación distinta de la del caso. No hay una única respuesta: lo que cuenta es el razonamiento y la evidencia que uses.</p><ol><li>Un producto registrado entra en desabastecimiento. ¿Qué documentos archivarías para sustentar la magistral?</li></ol>
<h2>Referencias consultadas</h2>
<ol>
<li>Ministerio de la Protección Social. <em>Resolución 1403 de 2007 y su Manual de Condiciones Esenciales</em> (2007). Propósito, competencias del tecnólogo y requisitos de lo estéril (Manual, numeral 2.1). <a href="https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_1403_2007.htm" target="_blank" rel="noopener noreferrer nofollow">https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_1403_2007.htm</a>. Consultado: 2026-11-03.</li>
<li>Ministerio de la Protección Social. <em>Decreto 2200 de 2005 (texto con modificaciones)</em> (2005). Prescripción con componentes y cantidades (artículo 16) y establecimientos (artículo 11). <a href="https://normograma.invima.gov.co/compilacion/docs/decreto_2200_2005.htm" target="_blank" rel="noopener noreferrer nofollow">https://normograma.invima.gov.co/compilacion/docs/decreto_2200_2005.htm</a>. Consultado: 2026-11-03.</li>
<li>Ministerio de la Protección Social. <em>Resolución 444 de 2008 (instrumento de verificación de BPE)</em> (2008). Ítems críticos 17.1.6 y 17.1.6.1. <a href="https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_0444_2008.htm" target="_blank" rel="noopener noreferrer nofollow">https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_0444_2008.htm</a>. Consultado: 2026-11-03.</li>
<li>Invima. <em>Proyecto de circular sobre preparaciones magistrales (junio de 2026, no expedido)</em> (2026). Criterios propuestos, presentados como proyecto no vigente. <a href="https://www.invima.gov.co/biblioteca/download/145079" target="_blank" rel="noopener noreferrer nofollow">https://www.invima.gov.co/biblioteca/download/145079</a>. Consultado: 2026-11-03.</li>
<li>Invima. <em>Alerta sobre productos magistrales falsificados (14 de mayo de 2026)</em> (2026). Caso real de magistrales falsificados. <a href="https://www.invima.gov.co/blog/sala-de-prensa-13/invima-alerta-sobre-comercializacion-de-productos-magistrales-falsificados-que-representan-riesgo-para-la-salud-bicarbonato-de-sodio-naproxeno-y-ketoconazol-459" target="_blank" rel="noopener noreferrer nofollow">https://www.invima.gov.co/blog/sala-de-prensa-13/invima-alerta-sobre-comercializacion-de-productos-magistrales-falsificados-que-representan-riesgo-para-la-salud-bicarbonato-de-sodio-naproxeno-y-ketoconazol-459</a>. Consultado: 2026-11-03.</li>
</ol>
</article>$bpe_html$));


  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, $bpe_json${"url":"https://www.invima.gov.co/blog/sala-de-prensa-13/invima-alerta-sobre-comercializacion-de-productos-magistrales-falsificados-que-representan-riesgo-para-la-salud-bicarbonato-de-sodio-naproxeno-y-ketoconazol-459","title":"Alerta del Invima sobre magistrales falsificados (mayo de 2026)","description":"Productos, lotes y recomendaciones."}$bpe_json$::jsonb);


  -- ── bpe-u2-l1 · Áreas, equipos y condiciones ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'El establecimiento y el proceso' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (El establecimiento y el proceso). Se salta.';
    RETURN;
  END IF;
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND module_id = v_unidad AND title = 'Áreas, equipos y condiciones' AND deleted_at IS NULL
   LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'No existe la clase Áreas, equipos y condiciones. Se salta.';
    RETURN;
  END IF;

  UPDATE aula_lessons
     SET subtitle = 'Clase 4 · El lugar donde se construye la calidad',
         duration_minutes = 70,
         completion_rule = 'manual',
         is_required = TRUE,
         updated_at = NOW()
   WHERE id = v_clase;

  -- El texto breve, los destacados y los enlaces anteriores se sustituyen
  -- por la clase completa y por enlaces verificados.
  DELETE FROM aula_lesson_blocks
   WHERE lesson_id = v_clase
     AND (type IN ('texto', 'destacado', 'enlace'));

  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, jsonb_build_object('html', $bpe_html$<article>
<p>Un área bien diseñada evita errores antes de que alguien tenga que corregirlos. En esta clase recorrerás un área real con los ojos de un inspector: qué exige el Manual de la Resolución 1403, cómo lo verifica la Resolución 444 y qué hacer cuando un equipo o una nevera fallan.</p>
<p><strong>Clase sin video principal.</strong> No encontramos un video vigente, verificable y ajustado a la norma colombiana que enseñe este tema mejor que el texto. La clase es completa sin video: trae dos ejemplos resueltos y una práctica adicional.</p>
<h2>Resultados de aprendizaje</h2>
<ul><li>Verificar un área de elaboración no estéril con los ítems del instrumento de la Resolución 444 y clasificar cada hallazgo como Crítico, Mayor o Menor.</li><li>Definir qué se registra en la hoja de vida de un equipo crítico y qué hacer cuando su calibración está vencida.</li><li>Responder a una desviación de temperatura con una evaluación de impacto documentada.</li></ul>
<h2>Prerrequisitos</h2>
<p>Unidad 1. Saber qué procesos puede realizar el establecimiento.</p>
<h2>Caso de partida</h2>
<p>La química farmacéutica de una farmacia-droguería de Ibagué hace una autoinspección antes de una visita. Encuentra la balanza sobre un estante junto a una puerta que golpea al cerrarse; su etiqueta de calibración venció hace dos meses. La nevera de materias primas tiene un termómetro común, sin registro de máximas y mínimas. El baño abre directamente al área de preparación. El trapero del área de elaboración es el mismo de la zona de dispensación. Hay una grieta en el mesón junto al lavamanos y no hay registro de limpieza después de cada elaboración.</p>

<h3>Qué exige el Manual y cómo se verifica</h3>
<p>El Manual de la Resolución 1403 (Título II, Capítulo III, numeral 2.2.1) pide que la elaboración, el acondicionamiento, el etiquetado y el control se hagan en un área diferenciada «de elaboración», dentro del establecimiento y bajo supervisión del responsable técnico. Su diseño debe considerar las preparaciones y la tecnología; dimensiones que eviten confusión y contaminación; superficies lisas, impermeables, fáciles de limpiar e inertes; protección contra insectos; servicios públicos que funcionen; aire, luz, temperatura y humedad acordes con los productos; secciones separadas para materias primas, residuos y utensilios, y un espacio para documentos y consulta. El baño no puede tener acceso directo a la zona de preparación (numeral 2.2.2).</p>
<p>La dotación básica (numeral 2.3) incluye un soporte horizontal que evite vibraciones para las balanzas, armarios impermeables protegidos del polvo y de la luz, una nevera con termómetro de máxima y mínima para lo termolábil e instrumentos de temperatura y humedad cuando se requieran.</p>
<p>El instrumento de la Resolución 444 convierte esos requisitos en preguntas con criterio. Son <strong>críticos</strong>, entre otros, tener un área independiente para magistrales (17.1.1), contar con los elementos del numeral 2.3 (17.2.3), tener balanzas adecuadas y calibradas (17.2.4), la hoja de vida de cada equipo (7.2.9) y los instrumentos de temperatura de la cadena de frío (7.2.10). Son <strong>mayores</strong> las superficies sin grietas y fáciles de limpiar (17.1.9), la distribución sin contraflujos (17.1.8), los implementos de limpieza exclusivos por área (17.3.10) y la limpieza documentada después de cada operación (17.3.2.16).</p>

<figure>
  <figcaption>Figura 1. Flujo de una preparación en el área: siempre hacia adelante, sin cruces.</figcaption>
  <ol>
    <li>Recepción y cuarentena de materias primas.</li>
    <li>Almacenamiento aprobado (temperatura, luz y humedad controladas).</li>
    <li>Alistamiento: guía, materias primas y equipos verificados en la mesa.</li>
    <li>Pesada en la balanza verificada del día.</li>
    <li>Elaboración y controles en proceso.</li>
    <li>Envasado, etiquetado y control final.</li>
    <li>Dispensación. Los residuos salen por su propia ruta.</li>
  </ol>
</figure>

<h3>Ejemplo resuelto 1: la autoinspección de Ibagué</h3>
<table>
  <caption>Tabla 1. Hallazgos, ítem y acción</caption>
  <thead><tr><th scope="col">Hallazgo</th><th scope="col">Ítem y criterio</th><th scope="col">Acción</th></tr></thead>
  <tbody>
    <tr><td>Calibración de la balanza vencida</td><td>17.2.4, Crítico</td><td>Retirar de uso, calibrar y evaluar las pesadas desde la última verificación conforme.</td></tr>
    <tr><td>Balanza sobre estante con vibración</td><td>17.2.3 (numeral 2.3, literal a), Crítico</td><td>Ubicarla en un soporte horizontal estable, lejos de la puerta.</td></tr>
    <tr><td>Nevera sin máximas y mínimas</td><td>7.2.10 y 17.2.3, Crítico</td><td>Instalar termómetro de máxima y mínima y registrar a diario.</td></tr>
    <tr><td>Baño con acceso directo</td><td>Numeral 2.2.2 del Manual</td><td>Rediseñar el acceso: es una condición del área, no se corrige con limpieza.</td></tr>
    <tr><td>Trapero compartido</td><td>17.3.10, Mayor</td><td>Implementos exclusivos e identificados para el área.</td></tr>
    <tr><td>Grieta en el mesón</td><td>17.1.9, Mayor</td><td>Reparar o reemplazar la superficie.</td></tr>
    <tr><td>Sin registro de limpieza por operación</td><td>17.3.2.16, Mayor</td><td>Formato de limpieza después de cada elaboración, con firma.</td></tr>
  </tbody>
</table>
<p>La calibración vencida no prueba que las pesadas fueran malas, pero tampoco prueba que fueran buenas. Por eso se pide al proveedor el resultado «como se encontró» antes de ajustar: si estaba dentro de la tolerancia, se documenta y se cierra; si estaba fuera, se evalúan las preparaciones pesadas desde la última verificación conforme.</p>

<h3>La hoja de vida y la limpieza</h3>
<p>Según el ítem 7.2.9, la hoja de vida registra compra, proveedor, especificaciones técnicas, cuidados especiales, calibraciones, mantenimientos preventivos y correctivos, fechas y responsable. Se complementa con el cronograma de calibración (7.2.5), el rótulo con la vigencia (7.2.7), el registro de uso de los equipos críticos (7.2.3) y la identificación de los equipos fuera de uso (7.2.6).</p>
<p>Limpiar y desinfectar no son lo mismo: limpiar retira materia; desinfectar reduce la carga microbiana de una superficie. La USP pide limpiar las superficies del área no estéril al inicio y al final de cada turno en que se elabora, porque esta actividad genera partículas (preguntas frecuentes del capítulo 795, preguntas 31 y 32).</p>

<h3>Ejemplo resuelto 2: la nevera marcó 11 °C</h3>
<p>Un lunes, el termómetro de máxima y mínima de la nevera marca 11 °C como máxima del fin de semana. Adentro hay una suspensión acuosa sin conservante pendiente de entrega, una crema acuosa con conservante y una materia prima rotulada «conservar entre 2 y 8 °C». Las diapositivas de la USP definen refrigerador como 2–8 °C y temperatura ambiente controlada como 20–25 °C.</p>
<ol>
  <li><strong>Contener:</strong> identificar todo lo que había y ponerlo en cuarentena.</li>
  <li><strong>Caracterizar:</strong> el termómetro da la máxima, no la duración; se asume el peor caso.</li>
  <li><strong>Evaluar cada producto:</strong> la suspensión sin conservante tiene una fecha límite que depende de la refrigeración, y no hay datos que respalden la excursión: no se entrega y se elabora de nuevo. La crema con conservante admite conservación a temperatura ambiente controlada en la tabla de la USP, y 11 °C no supera ese rango: se libera con justificación escrita. La materia prima se consulta con el proveedor y se mantiene en cuarentena hasta tener respuesta.</li>
  <li><strong>Documentar:</strong> registrar la desviación (17.3.1.4, Crítico), buscar la causa —puerta, empaque, corte de energía— y definir una acción, por ejemplo una lectura en cada apertura y cierre de la jornada.</li>
</ol>

<h2>Segundo caso contrastado</h2>
<p>Otro establecimiento tiene un área impecable: mesones nuevos, balanza en mesa antivibratoria, nevera moderna. Pero no hay hojas de vida, el cronograma de calibración está en la memoria del director y la limpieza «se hace siempre». En la visita, el inspector registra hallazgos críticos y mayores.</p>
<p><strong>Contraste con Ibagué.</strong> Allá había fallas físicas visibles; aquí la falla es de evidencia. Ninguna de las dos se resuelve sola: la infraestructura sin registros no se puede demostrar, y los registros sin infraestructura documentan un riesgo. Lo que no está escrito no ocurrió ante una inspección.</p>

<h2>Mapa de relaciones</h2>
<p>Lee el mapa de izquierda a derecha: cada fila declara una relación y explica por qué existe. Es la estructura que conecta los conceptos de la clase, no una lista de definiciones sueltas.</p>

<table>
  <caption>Mapa de relaciones de la clase</caption>
  <thead><tr><th scope="col">Concepto A</th><th scope="col">Relación</th><th scope="col">Concepto B</th><th scope="col">Por qué</th></tr></thead>
  <tbody>
    <tr><td>Área diferenciada</td><td>previene</td><td>Confusión y contaminación cruzada</td><td>Separa la elaboración de la dispensación y de otros flujos.</td></tr>
    <tr><td>Balanza calibrada</td><td>sustenta</td><td>La dosis de cada preparación</td><td>Una pesada sin trazabilidad metrológica no se puede defender.</td></tr>
    <tr><td>Hoja de vida</td><td>documenta</td><td>La historia del equipo</td><td>Permite saber qué estaba bien y desde cuándo.</td></tr>
    <tr><td>Termómetro de máxima y mínima</td><td>detecta</td><td>Excursiones de temperatura</td><td>Sin él, una falla nocturna pasa inadvertida.</td></tr>
    <tr><td>Desviación documentada</td><td>conduce a</td><td>Una decisión por producto</td><td>No todo se desecha ni todo se libera: depende del producto.</td></tr>
  </tbody>
</table>

<h2>Errores frecuentes y cómo corregirlos</h2>
<ul><li>Seguir usando una balanza con calibración vencida «porque pesa bien». Corrección: retírala, calibra con resultado «como se encontró» y evalúa las pesadas desde la última verificación conforme.</li><li>Tratar todos los hallazgos como iguales. Corrección: usa el criterio del instrumento para priorizar lo crítico.</li><li>Medir la temperatura de la nevera sin registrar máximas y mínimas. Corrección: el valor del momento no muestra lo que pasó en la noche.</li><li>Desechar o liberar todo después de una excursión. Corrección: evalúa cada producto según su fecha límite y sus condiciones de conservación.</li></ul>
<h2>Práctica de autoevaluación</h2>

<p>Clasifica cada hallazgo con el ítem y el criterio del instrumento y propone una acción.</p>
<ol>
  <li>No hay hoja de vida del agitador magnético.</li>
  <li>El área de magistrales comparte mesón con el empaque de domicilios.</li>
  <li>La balanza tiene etiqueta de calibración vigente, pero no se sabe quién la calibró.</li>
  <li>Las tuberías del área no están identificadas.</li>
</ol>
<details>
  <summary>Ver solución comentada</summary>
  
<ol>
  <li>7.2.9, Crítico: abrir la hoja de vida con los datos disponibles y completar compra, especificaciones y mantenimientos.</li>
  <li>17.1.1, Crítico: el área de magistrales debe ser independiente y separada.</li>
  <li>7.2.5.1, Informativo: se documenta quién calibra; pide el certificado del proveedor y archívalo.</li>
  <li>17.1.11, Menor: identificar contenido y dirección de flujo.</li>
</ol>
</details>
<h2>Práctica adicional</h2>
<p>Diseña los campos de la hoja de vida de una balanza analítica. Incluye al menos ocho campos y explica para qué sirve cada uno ante una investigación.</p>
<details>
  <summary>Ver solución comentada</summary>
  <p>Identificación interna y ubicación; marca, modelo y serie; proveedor y fecha de compra; capacidad y legibilidad; cuidados especiales (nivelación, sitio sin corrientes ni vibraciones); cronograma y certificados de calibración con resultado «como se encontró» y «como se dejó»; verificaciones de rutina con pesas de referencia; mantenimientos preventivos y correctivos con fecha y responsable; estado actual (en uso o fuera de uso). Cada campo responde una pregunta de la investigación: qué equipo pesó, si estaba en condiciones y desde cuándo.</p>
</details>
<h2>Síntesis y puente</h2>
<p>El área y los equipos se verifican con el instrumento de la Resolución 444, que distingue lo crítico de lo menor. Una calibración vencida o una excursión de temperatura se resuelven con evidencia, no con suposiciones. La próxima clase sigue el recorrido: lo que entra al área, las materias primas y el agua.</p>
<h2>Preguntas de transferencia</h2><p>Lleva lo aprendido a una situación distinta de la del caso. No hay una única respuesta: lo que cuenta es el razonamiento y la evidencia que uses.</p><ol><li>Si la nevera de tu servicio no tiene alarma, ¿qué rutina mínima de registro propondrías y quién la firmaría?</li></ol>
<h2>Referencias consultadas</h2>
<ol>
<li>Ministerio de la Protección Social. <em>Resolución 1403 de 2007 y su Manual de Condiciones Esenciales</em> (2007). Sección de elaboración, locales anexos y dotación (Manual, numerales 2.2 y 2.3). <a href="https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_1403_2007.htm" target="_blank" rel="noopener noreferrer nofollow">https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_1403_2007.htm</a>. Consultado: 2026-11-03.</li>
<li>Ministerio de la Protección Social. <em>Resolución 444 de 2008 (instrumento de verificación de BPE)</em> (2008). Ítems 7.2 (equipos), 17.1 a 17.3 (elaboración) y sus criterios. <a href="https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_0444_2008.htm" target="_blank" rel="noopener noreferrer nofollow">https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_0444_2008.htm</a>. Consultado: 2026-11-03.</li>
<li>United States Pharmacopeia. <em>795 FAQs (1 de noviembre de 2023)</em> (2023). Limpieza frente a desinfección y frecuencia por turno (preguntas 31 y 32). <a href="https://pages.usp.org/rs/711-SXF-172/images/HQS%20-%20USP%20GC%20795%20FAQs.pdf" target="_blank" rel="noopener noreferrer nofollow">https://pages.usp.org/rs/711-SXF-172/images/HQS%20-%20USP%20GC%20795%20FAQs.pdf</a>. Consultado: 2026-11-03.</li>
<li>NABP y United States Pharmacopeia. <em>USP Compounding Webinar Handout (diapositivas USP, 14 de septiembre de 2023)</em> (2023). Rangos de refrigerador (2–8 °C) y temperatura ambiente controlada (20–25 °C). <a href="https://nabp.pharmacy/wp-content/uploads/2023/09/USP-Compounding-Webinar-Handout-September-14-2023.pdf" target="_blank" rel="noopener noreferrer nofollow">https://nabp.pharmacy/wp-content/uploads/2023/09/USP-Compounding-Webinar-Handout-September-14-2023.pdf</a>. Consultado: 2026-11-03.</li>
</ol>
</article>$bpe_html$));


  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, $bpe_json${"url":"https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_0444_2008.htm","title":"Resolución 444 de 2008: instrumento de verificación de BPE","description":"Revisa los capítulos 7 (dotación) y 17 (elaboración de preparaciones magistrales)."}$bpe_json$::jsonb);


  -- ── bpe-u2-l2 · Materias primas y agua ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'El establecimiento y el proceso' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (El establecimiento y el proceso). Se salta.';
    RETURN;
  END IF;
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND module_id = v_unidad AND title = 'Materias primas y agua' AND deleted_at IS NULL
   LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'No existe la clase Materias primas y agua. Se salta.';
    RETURN;
  END IF;

  UPDATE aula_lessons
     SET subtitle = 'Clase 5 · Lo que entra al área decide lo que sale',
         duration_minutes = 70,
         completion_rule = 'manual',
         is_required = TRUE,
         updated_at = NOW()
   WHERE id = v_clase;

  -- El texto breve, los destacados y los enlaces anteriores se sustituyen
  -- por la clase completa y por enlaces verificados.
  DELETE FROM aula_lesson_blocks
   WHERE lesson_id = v_clase
     AND (type IN ('texto', 'destacado', 'enlace'));

  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, jsonb_build_object('html', $bpe_html$<article>
<p>Ninguna técnica corrige una materia prima equivocada o un agua contaminada. Esta clase enseña a decidir en la puerta qué entra al área y con qué evidencia.</p>
<p><strong>Clase sin video principal.</strong> No encontramos un video vigente, verificable y ajustado a la norma colombiana que enseñe este tema mejor que el texto. La clase es completa sin video: trae dos ejemplos resueltos y una práctica adicional.</p>
<h2>Resultados de aprendizaje</h2>
<ul><li>Aplicar un protocolo de recepción de materias primas: identidad, certificado de análisis, rotulado, vencimiento, condiciones y cuarentena, con registro.</li><li>Elegir la calidad de agua según su función y explicar qué controles exige el instrumento cuando el establecimiento la trata.</li><li>Decidir sobre una materia prima no conforme y documentar la decisión.</li></ul>
<h2>Prerrequisitos</h2>
<p>Clase 4: flujo del área y documentación de desviaciones.</p>
<h2>Caso de partida</h2>
<p>Una farmacia-droguería de Neiva recibe 500 g de «urea USP» en una bolsa resellada y reetiquetada por un distribuidor. El certificado de análisis adjunto es del fabricante, pero de un lote distinto al de la etiqueta, y la etiqueta no indica vencimiento. Esa misma semana, el filtro del purificador de agua del área lleva un mes de atraso en su cambio, y un auxiliar propone usar agua de botellón para una solución oral.</p>

<h3>La materia prima es el primer control</h3>
<p>Antes de elaborar hay que verificar el rotulado, las condiciones de toxicidad y el vencimiento de las materias primas y de los productos con registro sanitario que se usen como fuente (Manual de la Resolución 1403, numeral 2.4.1). El artículo 10 exige un protocolo de recepción, almacenamiento, reempaque y distribución de materias primas y material de acondicionamiento, y el instrumento de la Resolución 444 califica como crítico que las materias primas estén aprobadas y claramente identificadas (17.3.5).</p>
<p>Un protocolo de recepción útil sigue cinco pasos:</p>
<figure>
  <figcaption>Figura 1. Protocolo de recepción. Ninguna materia prima pasa al almacenamiento aprobado sin el paso 5.</figcaption>
<ol>
  <li><strong>Documentos:</strong> pedido, factura y etiqueta coinciden en nombre, calidad (por ejemplo, USP o Ph. Eur.), lote, fabricante, vencimiento y condiciones de conservación.</li>
  <li><strong>Certificado de análisis del mismo lote</strong>, con especificaciones y resultados.</li>
  <li><strong>Inspección física:</strong> envase íntegro, cierre, rótulo legible y aspecto esperado.</li>
  <li><strong>Cuarentena</strong> identificada hasta la aprobación; luego almacenamiento en sus condiciones y rotación por vencimiento.</li>
  <li><strong>Registro</strong> de la aprobación o el rechazo, con firma y fecha.</li>
</ol>
</figure>
<p>Si se reempaca una materia prima, el nuevo envase necesita su propio rótulo con lote de origen, para no perder la trazabilidad.</p>

<h3>Ejemplo resuelto 1: la urea de Neiva</h3>
<table>
  <caption>Tabla 1. Evaluación de la recepción</caption>
  <thead><tr><th scope="col">Hallazgo</th><th scope="col">Por qué importa</th><th scope="col">Decisión</th></tr></thead>
  <tbody>
    <tr><td>Certificado de otro lote</td><td>No demuestra la calidad de lo recibido.</td><td>No conforme: pedir el certificado del lote recibido.</td></tr>
    <tr><td>Bolsa resellada y reetiquetada</td><td>Se pierde la cadena entre fabricante y envase.</td><td>Pedir la identificación de quien reempacó y su registro de reempaque.</td></tr>
    <tr><td>Sin vencimiento</td><td>No se puede asignar una fecha límite de uso segura.</td><td>No conforme hasta tener el dato.</td></tr>
  </tbody>
</table>
<p>Decisión: la urea queda en cuarentena rotulada como «no conforme» y se informa al proveedor. Si no llegan los documentos, se rechaza y se devuelve. No se usa «mientras tanto»: una preparación elaborada con ella heredaría un vacío de trazabilidad imposible de cerrar después.</p>

<h3>El agua: una materia prima que se olvida</h3>
<p>El agua cumple tres funciones distintas y cada una exige una calidad. Según la USP, cuando la fórmula lleva agua se usa agua purificada o de mejor calidad —por ejemplo, agua estéril para irrigación—, y para enjuagar equipos y utensilios se usa agua purificada, destilada o de ósmosis inversa; el agua destilada sirve como componente solo si cumple la monografía de agua purificada (preguntas frecuentes del capítulo 795, preguntas 37 a 42). La OMS dedica a este tema un anexo completo de buenas prácticas (TRS 1033, anexo 3).</p>
<p>Si el establecimiento obtiene su propia agua purificada, el instrumento de la Resolución 444 califica como críticos el mantenimiento periódico registrado del sistema y los controles de calidad del agua con periodicidad definida y registrada (capítulo 15).</p>

<h3>Ejemplo resuelto 2: tres usos del agua en una mañana</h3>
<table>
  <caption>Tabla 2. Qué agua usar</caption>
  <thead><tr><th scope="col">Uso</th><th scope="col">Agua adecuada</th><th scope="col">Por qué</th></tr></thead>
  <tbody>
    <tr><td>Vehículo de una solución oral</td><td>Agua purificada o de mejor calidad.</td><td>Es un componente que ingiere el paciente.</td></tr>
    <tr><td>Enjuague final del mortero</td><td>Agua purificada, destilada o de ósmosis inversa.</td><td>Evita dejar residuos en la siguiente preparación.</td></tr>
    <tr><td>Agua de botellón</td><td>No sustituye al agua purificada.</td><td>Es agua para consumo, sin evidencia de cumplir la monografía.</td></tr>
  </tbody>
</table>
<p>¿Y el purificador con el filtro atrasado? Con el mantenimiento vencido, la calidad del agua es desconocida: se suspende su uso como componente hasta cambiar el filtro y verificar el agua según el protocolo, y se documenta la desviación. Mientras tanto, la solución oral se elabora con agua purificada adquirida con certificado, no con agua de botellón.</p>

<h2>Segundo caso contrastado</h2>
<p>Para una suspensión oral de omeprazol, el servicio usa como fuente cápsulas comerciales con registro sanitario. El auxiliar pregunta si eso «evita» la recepción de materia prima.</p>
<p><strong>Análisis.</strong> No la evita: la cambia. El numeral 2.4.1 del Manual menciona tanto materias primas como productos con registro sanitario. Se verifica el registro, el lote, el vencimiento y la integridad del producto, y se anota el lote en el registro de elaboración. Además, el químico farmacéutico valida la fórmula considerando los excipientes del producto comercial, porque pueden afectar la preparación. La USP también acepta productos comerciales como componentes cuando están disponibles y son apropiados (pregunta 35).</p>

<h2>Mapa de relaciones</h2>
<p>Lee el mapa de izquierda a derecha: cada fila declara una relación y explica por qué existe. Es la estructura que conecta los conceptos de la clase, no una lista de definiciones sueltas.</p>

<table>
  <caption>Mapa de relaciones de la clase</caption>
  <thead><tr><th scope="col">Concepto A</th><th scope="col">Relación</th><th scope="col">Concepto B</th><th scope="col">Por qué</th></tr></thead>
  <tbody>
    <tr><td>Certificado de análisis</td><td>debe corresponder a</td><td>El lote recibido</td><td>Solo así demuestra la calidad de lo que entra.</td></tr>
    <tr><td>Cuarentena</td><td>separa</td><td>Lo no aprobado de lo aprobado</td><td>Evita que algo se use antes de decidir.</td></tr>
    <tr><td>Función del agua</td><td>determina</td><td>Su calidad</td><td>Componente, enjuague y lavado tienen exigencias distintas.</td></tr>
    <tr><td>Sistema de purificación</td><td>exige</td><td>Mantenimiento y control registrados</td><td>Son ítems críticos del capítulo 15 del instrumento.</td></tr>
    <tr><td>Lote de cada materia prima</td><td>sostiene</td><td>La trazabilidad de la preparación</td><td>Sin él no se puede investigar una queja.</td></tr>
  </tbody>
</table>

<h2>Errores frecuentes y cómo corregirlos</h2>
<ul><li>Aceptar un certificado de análisis de otro lote «porque es del mismo fabricante». Corrección: el certificado debe ser del lote recibido.</li><li>Usar una materia prima en cuarentena «mientras llegan los papeles». Corrección: lo no aprobado no entra a una preparación.</li><li>Usar agua de botellón como componente. Corrección: agua purificada o de mejor calidad, con evidencia.</li><li>No anotar el lote del producto comercial usado como fuente. Corrección: va en el registro de elaboración como cualquier materia prima.</li></ul>
<h2>Práctica de autoevaluación</h2>

<p>Decide si cada materia prima se <strong>aprueba</strong>, queda en <strong>cuarentena</strong> o se <strong>rechaza</strong>.</p>
<ol>
  <li>Ácido salicílico con certificado del mismo lote, envase íntegro, vence en 2028.</li>
  <li>Vaselina sin certificado de análisis; el proveedor promete enviarlo.</li>
  <li>Hidrocortisona con certificado del lote, pero el envase llegó roto y con polvo fuera.</li>
  <li>Base para crema con certificado y vencimiento vigente, rotulada «conservar en refrigeración», que llegó a temperatura ambiente tras dos días de transporte.</li>
</ol>
<details>
  <summary>Ver solución comentada</summary>
  
<ol>
  <li><strong>Aprueba:</strong> documentos y condición física conformes.</li>
  <li><strong>Cuarentena:</strong> sin certificado no hay evidencia; si no llega, se rechaza.</li>
  <li><strong>Rechaza:</strong> envase roto y posible contaminación; se informa al proveedor.</li>
  <li><strong>Cuarentena:</strong> se consulta al proveedor el efecto de la excursión antes de decidir.</li>
</ol>
</details>
<h2>Práctica adicional</h2>
<p>Redacta en máximo 90 palabras el registro de no conformidad de la urea del caso.</p>
<details>
  <summary>Ver solución comentada</summary>
  <p><strong>Modelo.</strong> «03/11/2026. Urea USP, 500 g, lote de etiqueta U-4471, distribuidor X. No conformidades: certificado de análisis de otro lote (U-4402); bolsa resellada sin identificación de quien reempacó; sin fecha de vencimiento. Decisión: cuarentena como no conforme; se solicitan certificado del lote, registro de reempaque y vencimiento. Plazo: cinco días hábiles; de lo contrario, rechazo y devolución. Responsable: QF A. G.» Datos simulados.</p>
</details>
<h2>Síntesis y puente</h2>
<p>Lo que entra al área decide lo que sale: materia prima con certificado del lote, cuarentena hasta aprobar y agua elegida por su función. La próxima clase convierte todo esto en documentos: la guía de elaboración, el registro y la etiqueta.</p>
<h2>Preguntas de transferencia</h2><p>Lleva lo aprendido a una situación distinta de la del caso. No hay una única respuesta: lo que cuenta es el razonamiento y la evidencia que uses.</p><ol><li>Tu proveedor de agua purificada cambia de marca. ¿Qué documentos pedirías antes de usarla como componente?</li></ol>
<h2>Referencias consultadas</h2>
<ol>
<li>Ministerio de la Protección Social. <em>Resolución 1403 de 2007 y su Manual de Condiciones Esenciales</em> (2007). Actividades previas (Manual, numeral 2.4.1) y protocolo de recepción y almacenamiento (artículo 10, numeral 10). <a href="https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_1403_2007.htm" target="_blank" rel="noopener noreferrer nofollow">https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_1403_2007.htm</a>. Consultado: 2026-11-03.</li>
<li>Ministerio de la Protección Social. <em>Resolución 444 de 2008 (instrumento de verificación de BPE)</em> (2008). Materias primas aprobadas (17.3.5) y sistema de tratamiento de aguas (capítulo 15). <a href="https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_0444_2008.htm" target="_blank" rel="noopener noreferrer nofollow">https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_0444_2008.htm</a>. Consultado: 2026-11-03.</li>
<li>United States Pharmacopeia. <em>795 FAQs (1 de noviembre de 2023)</em> (2023). Calidad del agua (preguntas 37 a 42) y productos comerciales como componentes (pregunta 35). <a href="https://pages.usp.org/rs/711-SXF-172/images/HQS%20-%20USP%20GC%20795%20FAQs.pdf" target="_blank" rel="noopener noreferrer nofollow">https://pages.usp.org/rs/711-SXF-172/images/HQS%20-%20USP%20GC%20795%20FAQs.pdf</a>. Consultado: 2026-11-03.</li>
<li>Organización Mundial de la Salud. <em>Good manufacturing practices: water for pharmaceutical use (TRS 1033, anexo 3)</em> (2021). Marco internacional de buenas prácticas para el agua de uso farmacéutico. <a href="https://www.who.int/publications/m/item/annex-3-trs-1033" target="_blank" rel="noopener noreferrer nofollow">https://www.who.int/publications/m/item/annex-3-trs-1033</a>. Consultado: 2026-11-03.</li>
</ol>
</article>$bpe_html$));


  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, $bpe_json${"url":"https://www.who.int/publications/m/item/annex-3-trs-1033","title":"OMS: buenas prácticas para el agua de uso farmacéutico (TRS 1033, anexo 3)","description":"Documento de referencia internacional (en inglés)."}$bpe_json$::jsonb);


  -- ── bpe-u2-l3 · La guía de elaboración y el etiquetado ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'El establecimiento y el proceso' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (El establecimiento y el proceso). Se salta.';
    RETURN;
  END IF;
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND module_id = v_unidad AND title = 'La guía de elaboración y el etiquetado' AND deleted_at IS NULL
   LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'No existe la clase La guía de elaboración y el etiquetado. Se salta.';
    RETURN;
  END IF;

  UPDATE aula_lessons
     SET subtitle = 'Clase 6 · Escribir para que otro pueda repetirlo',
         duration_minutes = 75,
         completion_rule = 'manual',
         is_required = TRUE,
         updated_at = NOW()
   WHERE id = v_clase;

  -- El texto breve, los destacados y los enlaces anteriores se sustituyen
  -- por la clase completa y por enlaces verificados.
  DELETE FROM aula_lesson_blocks
   WHERE lesson_id = v_clase
     AND (type IN ('texto', 'destacado', 'enlace'));

  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, jsonb_build_object('html', $bpe_html$<article>
<p>Una preparación bien hecha que no está escrita no se puede repetir ni defender. Esta clase separa dos documentos que suelen confundirse —la guía y el registro— y termina en la etiqueta, el único documento que viaja con el paciente.</p>
<p><strong>Clase sin video principal.</strong> No encontramos un video vigente, verificable y ajustado a la norma colombiana que enseñe este tema mejor que el texto. La clase es completa sin video: trae dos ejemplos resueltos y una práctica adicional.</p>
<h2>Resultados de aprendizaje</h2>
<ul><li>Redactar una guía de elaboración con componentes, cantidades, equipos, pasos, controles, envase y conservación.</li><li>Diligenciar el registro de elaboración de una preparación concreta, con cálculos, lotes, firmas y control final.</li><li>Diseñar y verificar una etiqueta con los datos que exigen el Manual de la Resolución 1403 y el Decreto 2200.</li></ul>
<h2>Prerrequisitos</h2>
<p>Clases 4 y 5.</p>
<h2>Caso de partida</h2>
<p>Una química farmacéutica revisa tres preparaciones del mes anterior. En la primera, el registro no anota el lote de la materia prima. En la segunda, la etiqueta dice «vence: 6 meses», sin fecha. La guía de la tercera dice «mezclar bien», sin método ni tiempo, y dos personas obtuvieron cremas de consistencia distinta con la misma fórmula.</p>

<h3>Dos documentos, dos preguntas</h3>
<p>La <strong>guía de elaboración</strong> responde «¿cómo se hace esta fórmula?»: es el protocolo de elaboración de cada preparación que exige el artículo 10, numeral 6, de la Resolución 1403, y que el instrumento de la Resolución 444 verifica como procedimiento escrito (17.3.2.7). El <strong>registro de elaboración</strong> responde «¿cómo se hizo esta preparación, para este paciente?»: el instrumento exige registros de cada preparación (17.3.6, Crítico) y el Manual pide registrar de forma clara y fidedigna todas las actuaciones (numeral 2.6). La USP usa la misma distinción —fórmula maestra y registro de elaboración— y aclara que no se necesita una fórmula maestra nueva por cada cantidad: la cantidad va en el registro (preguntas frecuentes del capítulo 795, pregunta 48).</p>
<p>El Manual (numeral 2.4) organiza el procedimiento en actividades previas, de elaboración y posteriores, y pide que cada procedimiento describa sus etapas en orden, «incluyendo los mecanismos de control y resolución de problemas».</p>

<table>
  <caption>Tabla 1. Contenido mínimo de cada documento</caption>
  <thead><tr><th scope="col">Guía de elaboración</th><th scope="col">Registro de elaboración</th></tr></thead>
  <tbody>
    <tr><td>Nombre, forma farmacéutica, vía y versión aprobada.</td><td>Número interno de la preparación y fecha y hora de inicio.</td></tr>
    <tr><td>Componentes con su calidad y cantidad por unidad de fórmula.</td><td>Paciente, prescriptor y prescripción vinculados.</td></tr>
    <tr><td>Cálculos y correcciones (pureza, sal o hidrato).</td><td>Cantidades calculadas y pesadas, con verificación de una segunda persona cuando sea posible.</td></tr>
    <tr><td>Equipos y utensilios.</td><td>Equipo usado (por ejemplo, balanza B-02).</td></tr>
    <tr><td>Pasos con parámetros: orden de adición, método, tiempo, temperatura.</td><td>Lote y vencimiento de cada materia prima.</td></tr>
    <tr><td>Controles en proceso y final, con criterios.</td><td>Resultados de los controles y desviaciones.</td></tr>
    <tr><td>Envase descrito con detalle suficiente para que otro lo elija.</td><td>Envase usado.</td></tr>
    <tr><td>Conservación y fecha límite de uso con su fundamento.</td><td>Fecha límite asignada.</td></tr>
    <tr><td>Referencias y aprobación del químico farmacéutico.</td><td>Quién elaboró, quién verificó y firma del responsable.</td></tr>
  </tbody>
</table>

<figure>
  <figcaption>Figura 1. Cadena de trazabilidad: cada eslabón remite al siguiente por un dato que no puede faltar.</figcaption>
  <ol>
    <li>Prescripción (paciente y prescriptor) → número interno asignado al recibirla.</li>
    <li>Número interno → registro de elaboración, con la versión de la guía usada.</li>
    <li>Registro → lote y vencimiento de cada materia prima, equipo usado y firmas.</li>
    <li>Registro → etiqueta con el mismo número interno y la fecha límite de uso.</li>
    <li>Etiqueta → dispensación y, ante una queja, regreso al registro en minutos.</li>
  </ol>
</figure>

<h3>Ejemplo resuelto 1: el cálculo que corrige la pureza</h3>
<p>Una fórmula pide crema de hidrocortisona al 1 %, 50 g. Se necesitan 0,500 g de hidrocortisona. El certificado de análisis del lote declara una valoración de 99,2 %. Si se pesan 0,500 g del polvo, solo 0,496 g son hidrocortisona. La cantidad a pesar es:</p>
<p><strong>0,500 g ÷ 0,992 = 0,504 g</strong></p>
<p>La guía debe decir cuándo se aplica la corrección y cómo; el registro, qué valoración se usó y quién verificó el cálculo. La misma lógica aplica cuando la fórmula se expresa como base y se dispone de una sal o un hidrato: el factor se calcula con las masas moleculares y se documenta. «Mezclar bien», en cambio, no es un paso: hay que escribir el método (por ejemplo, incorporación geométrica en mortero), el tiempo o el criterio de fin (sin grumos al extender una muestra en un vidrio) y quién lo comprueba.</p>

<h3>La etiqueta: el documento que viaja</h3>
<p>Para las preparaciones magistrales, el Manual de la Resolución 1403 (Título II, Capítulo II, numeral 5.1.1, literal f) pide que la etiqueta contenga la identificación y ubicación del paciente, los principios activos, la dilución final y el diluente cuando aplique, la dosis, la vía de administración, el número de lote interno cuando aplique, el nombre legible de quien prepara, fecha y hora, condiciones de almacenamiento y estabilidad cuando aplique, y la firma del químico farmacéutico responsable. El dispensador debe verificar que el rótulo tenga la información del paciente, de la preparación y la firma del responsable (Decreto 2200, artículo 19, numeral 2). El instrumento califica como críticos identificar la preparación según ese literal y revisar las etiquetas antes de entregar (17.3.7 y 17.3.8).</p>

<h3>Ejemplo resuelto 2: corregir la etiqueta de «vence: 6 meses»</h3>
<table>
  <caption>Tabla 2. Etiqueta antes y después</caption>
  <thead><tr><th scope="col">Dato</th><th scope="col">Antes</th><th scope="col">Después</th></tr></thead>
  <tbody>
    <tr><td>Paciente</td><td>«Sra. López»</td><td>Nombre completo y documento.</td></tr>
    <tr><td>Contenido</td><td>«Crema despigmentante»</td><td>Cada principio activo con su concentración y la cantidad total.</td></tr>
    <tr><td>Fecha límite</td><td>«Vence: 6 meses»</td><td>«Usar antes del 08/12/2026», calculada desde el inicio de la elaboración.</td></tr>
    <tr><td>Conservación</td><td>—</td><td>«Conservar entre 2 y 8 °C, protegido de la luz», si la guía lo exige.</td></tr>
    <tr><td>Trazabilidad</td><td>—</td><td>Número interno, fecha y hora, quién preparó y firma del químico farmacéutico.</td></tr>
  </tbody>
</table>
<p>«6 meses» no es una fecha: obliga al paciente a calcular desde un día que no conoce. Además, la duración debe sustentarse; cómo hacerlo es el tema de la clase 8.</p>

<h2>Segundo caso contrastado</h2>
<p>Un paciente llama porque su suspensión tiene mal sabor y sedimento. En un servicio, el número interno de la etiqueta lleva en diez minutos al registro: guía versión 3, lotes de cada componente, balanza usada, quién elaboró, quién verificó y resultado del control final. Con eso se decide si el problema es del producto, de la conservación o del uso, y si hay otros pacientes con el mismo lote de materia prima.</p>
<p><strong>Contraste.</strong> En el registro sin lote del caso de partida, la misma llamada no tiene respuesta: no se sabe qué materia prima se usó ni a quién más afecta. La diferencia entre las dos situaciones no es técnica, es documental.</p>

<h2>Mapa de relaciones</h2>
<p>Lee el mapa de izquierda a derecha: cada fila declara una relación y explica por qué existe. Es la estructura que conecta los conceptos de la clase, no una lista de definiciones sueltas.</p>

<table>
  <caption>Mapa de relaciones de la clase</caption>
  <thead><tr><th scope="col">Concepto A</th><th scope="col">Relación</th><th scope="col">Concepto B</th><th scope="col">Por qué</th></tr></thead>
  <tbody>
    <tr><td>Guía de elaboración</td><td>hace reproducible</td><td>La fórmula</td><td>Dos personas deben obtener lo mismo siguiéndola.</td></tr>
    <tr><td>Registro de elaboración</td><td>prueba</td><td>Lo que se hizo para un paciente</td><td>Es la evidencia de cada preparación (ítem 17.3.6, Crítico).</td></tr>
    <tr><td>Certificado de análisis</td><td>alimenta</td><td>El cálculo de cantidades</td><td>La valoración corrige la cantidad a pesar.</td></tr>
    <tr><td>Número interno</td><td>conecta</td><td>Etiqueta, registro y materias primas</td><td>Permite la trazabilidad inversa ante una queja.</td></tr>
    <tr><td>Etiqueta</td><td>informa</td><td>Al paciente y a quien administra</td><td>Es el único documento que viaja con la preparación.</td></tr>
  </tbody>
</table>

<h2>Errores frecuentes y cómo corregirlos</h2>
<ul><li>Confundir la guía con el registro. Corrección: la guía dice cómo se hace la fórmula; el registro, cómo se hizo esta preparación.</li><li>Escribir «mezclar bien» o «c. s.» sin método. Corrección: describe método, parámetros y criterio de fin.</li><li>Pesar la cantidad teórica sin corregir la pureza o la sal. Corrección: usa la valoración del certificado y documenta el cálculo.</li><li>Rotular «vence en X meses». Corrección: escribe la fecha límite de uso calculada desde el inicio de la elaboración.</li></ul>
<h2>Práctica de autoevaluación</h2>

<p>Resuelve.</p>
<ol>
  <li>Una fórmula pide ácido salicílico al 5 % en vaselina, 50 g. El certificado declara una valoración de 98,9 %. ¿Cuánto pesas?</li>
  <li>¿Qué dato del registro permitiría saber a qué otros pacientes afecta un lote de materia prima defectuoso?</li>
  <li>Una etiqueta no tiene la firma del químico farmacéutico. ¿Qué norma incumple y qué debe hacer el dispensador?</li>
</ol>
<details>
  <summary>Ver solución comentada</summary>
  
<ol>
  <li>2,500 g ÷ 0,989 = <strong>2,528 g</strong> de ácido salicílico; vaselina hasta 50 g.</li>
  <li>El lote de cada materia prima, vinculado al número interno de cada preparación: permite buscar todas las preparaciones con ese lote.</li>
  <li>El Manual de la Resolución 1403 (numeral 5.1.1, literal f) y el Decreto 2200 (artículo 19, numeral 2): el dispensador no la entrega hasta corregir la etiqueta.</li>
</ol>
</details>
<h2>Práctica adicional</h2>
<p>Reescribe el paso «mezclar bien» de una crema de hidrocortisona para que dos personas obtengan el mismo resultado. Máximo cinco pasos.</p>
<details>
  <summary>Ver solución comentada</summary>
  <ol><li>Pulverizar la hidrocortisona en mortero hasta polvo fino.</li><li>Incorporar una cantidad igual de base y triturar hasta homogeneidad.</li><li>Agregar base en porciones iguales a la mezcla (incorporación geométrica) hasta completar la cantidad.</li><li>Comprobar la homogeneidad extendiendo una muestra en un vidrio: sin grumos ni puntos.</li><li>Registrar la hora de fin y quién comprobó.</li></ol>
</details>
<h2>Síntesis y puente</h2>
<p>La guía hace reproducible la fórmula, el registro prueba cada preparación y la etiqueta acompaña al paciente. Los tres se conectan por el número interno. La unidad 3 pregunta si lo elaborado cumple: qué controles son posibles, cuánto dura y qué hacer cuando algo sale mal.</p>
<h2>Preguntas de transferencia</h2><p>Lleva lo aprendido a una situación distinta de la del caso. No hay una única respuesta: lo que cuenta es el razonamiento y la evidencia que uses.</p><ol><li>¿Qué información adicional pondrías en la etiqueta de una preparación que se entrega a domicilio y debe refrigerarse?</li></ol>
<h2>Referencias consultadas</h2>
<ol>
<li>Ministerio de la Protección Social. <em>Resolución 1403 de 2007 y su Manual de Condiciones Esenciales</em> (2007). Protocolo de elaboración (artículo 10, numeral 6), procedimiento y control (Manual, numerales 2.4 y 2.6) y etiqueta (numeral 5.1.1, literal f). <a href="https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_1403_2007.htm" target="_blank" rel="noopener noreferrer nofollow">https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_1403_2007.htm</a>. Consultado: 2026-11-03.</li>
<li>Ministerio de la Protección Social. <em>Decreto 2200 de 2005 (texto con modificaciones)</em> (2005). Verificación del rótulo por el dispensador (artículo 19, numeral 2). <a href="https://normograma.invima.gov.co/compilacion/docs/decreto_2200_2005.htm" target="_blank" rel="noopener noreferrer nofollow">https://normograma.invima.gov.co/compilacion/docs/decreto_2200_2005.htm</a>. Consultado: 2026-11-03.</li>
<li>Ministerio de la Protección Social. <em>Resolución 444 de 2008 (instrumento de verificación de BPE)</em> (2008). Procedimientos, registros, identificación y revisión de etiquetas (17.3.2.7, 17.3.6, 17.3.7 y 17.3.8). <a href="https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_0444_2008.htm" target="_blank" rel="noopener noreferrer nofollow">https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_0444_2008.htm</a>. Consultado: 2026-11-03.</li>
<li>United States Pharmacopeia. <em>795 FAQs (1 de noviembre de 2023)</em> (2023). Fórmula maestra y registro de elaboración (preguntas 48 y 49) y etiquetado (pregunta 50). <a href="https://pages.usp.org/rs/711-SXF-172/images/HQS%20-%20USP%20GC%20795%20FAQs.pdf" target="_blank" rel="noopener noreferrer nofollow">https://pages.usp.org/rs/711-SXF-172/images/HQS%20-%20USP%20GC%20795%20FAQs.pdf</a>. Consultado: 2026-11-03.</li>
</ol>
</article>$bpe_html$));


  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, $bpe_json${"url":"https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_1403_2007.htm","title":"Resolución 1403 de 2007: procedimiento y etiqueta","description":"Manual, Título II: numerales 2.4 y 2.6 del Capítulo III y literal f del numeral 5.1.1 del Capítulo II."}$bpe_json$::jsonb);


  -- ── bpe-u3-l1 · Controles de calidad posibles ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Calidad y seguridad del paciente' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Calidad y seguridad del paciente). Se salta.';
    RETURN;
  END IF;
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND module_id = v_unidad AND title = 'Controles de calidad posibles' AND deleted_at IS NULL
   LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'No existe la clase Controles de calidad posibles. Se salta.';
    RETURN;
  END IF;

  UPDATE aula_lessons
     SET subtitle = 'Clase 7 · Qué se puede comprobar en el servicio y qué no',
         duration_minutes = 70,
         completion_rule = 'manual',
         is_required = TRUE,
         updated_at = NOW()
   WHERE id = v_clase;

  -- El texto breve, los destacados y los enlaces anteriores se sustituyen
  -- por la clase completa y por enlaces verificados.
  DELETE FROM aula_lesson_blocks
   WHERE lesson_id = v_clase
     AND (type IN ('texto', 'destacado', 'enlace'));

  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, jsonb_build_object('html', $bpe_html$<article>
<p>En un servicio farmacéutico no se puede analizar cada preparación como en una planta industrial, pero tampoco se puede liberar «a ojo». Esta clase enseña a escoger controles que sí detecten los errores probables y a reconocer los que el servicio no puede ver.</p>
<p><strong>Clase sin video principal.</strong> No encontramos un video vigente, verificable y ajustado a la norma colombiana que enseñe este tema mejor que el texto. La clase es completa sin video: trae dos ejemplos resueltos y una práctica adicional.</p>
<h2>Resultados de aprendizaje</h2>
<ul><li>Diseñar un plan de controles en proceso y final para una preparación no estéril, según su forma farmacéutica.</li><li>Distinguir lo que un control visual o físico puede detectar de lo que solo detecta un análisis de laboratorio.</li><li>Decidir qué hacer con un resultado fuera de especificación y cómo investigarlo.</li></ul>
<h2>Prerrequisitos</h2>
<p>Unidad 2, en especial el registro de elaboración y la corrección por valoración.</p>
<h2>Caso de partida</h2>
<p>Un servicio farmacéutico de Pasto elabora cada semana cápsulas de un medicamento pediátrico, una crema y una suspensión oral. Su control final es «aspecto conforme». Un hospital que le compra por contrato pide enviar a un laboratorio externo una muestra de un lote interno de cápsulas: el resultado de valoración es 86 % de lo declarado. Las cápsulas se veían perfectas y el registro decía «conforme».</p>

<h3>Qué exige la norma</h3>
<p>El Manual de la Resolución 1403 pide verificar, en las actividades posteriores, el cumplimiento de las especificaciones técnicas de lo elaborado (numeral 2.4.3) y registrar de forma clara y fidedigna todas las actuaciones (numeral 2.6). El artículo 10 exige un protocolo de control físico-químico y microbiano. El instrumento de la Resolución 444 califica como críticos tener documentados los controles en proceso y la inspección final (17.3.1.3) y realizar y registrar la inspección de calidad de la preparación final (17.3.9 y 17.3.9.1).</p>

<h3>La escalera de controles</h3>
<figure>
  <figcaption>Figura 1. Cada escalón detecta errores que el anterior no ve. Los primeros se hacen siempre; los últimos, según el riesgo y la decisión técnica.</figcaption>
  <ol>
    <li><strong>Control documental:</strong> prescripción, cálculos y lotes verificados por una segunda persona antes de pesar.</li>
    <li><strong>Controles en proceso:</strong> pesadas registradas, orden de adición, homogeneidad de cada etapa.</li>
    <li><strong>Inspección final:</strong> aspecto, color, olor, separación de fases, grumos, partículas.</li>
    <li><strong>Pruebas físicas sencillas:</strong> peso o volumen neto, peso de cápsulas, pH cuando sea relevante, facilidad de resuspensión.</li>
    <li><strong>Análisis externo:</strong> valoración del principio activo, límites microbianos o eficacia del conservante.</li>
  </ol>
</figure>
<p>La inspección visual no detecta un error de cantidad de principio activo: una cápsula con 86 % se ve igual que una con 100 %. Por eso el control que protege contra ese error está al principio: verificar el cálculo y la pesada antes de mezclar. Cuando se hace una valoración y no existe una monografía oficial, la USP considera aceptable un intervalo de ±10 % de lo declarado, es decir, 90–110 % (preguntas frecuentes del capítulo 795, pregunta 19).</p>

<h3>Ejemplo resuelto 1: un plan de control para tres formas</h3>
<table>
  <caption>Tabla 1. Controles proporcionales a cada preparación</caption>
  <thead><tr><th scope="col">Preparación</th><th scope="col">En proceso</th><th scope="col">Final en el servicio</th><th scope="col">Externo, según riesgo</th></tr></thead>
  <tbody>
    <tr><td>Cápsulas pediátricas</td><td>Verificación del cálculo; mezcla geométrica; homogeneidad del polvo.</td><td>Aspecto; número de cápsulas; peso de cada cápsula frente al teórico, con el criterio del protocolo.</td><td>Valoración periódica o ante cambios de materia prima o de personal.</td></tr>
    <tr><td>Crema</td><td>Incorporación por etapas; ausencia de grumos.</td><td>Aspecto, homogeneidad en vidrio, peso neto, pH si la fórmula lo exige.</td><td>Límites microbianos si se quiere sustentar una fecha límite mayor.</td></tr>
    <tr><td>Suspensión oral</td><td>Humectación del polvo; volumen ajustado.</td><td>Aspecto, facilidad de resuspensión, volumen, pH si aplica.</td><td>Valoración y eficacia del conservante para extender la fecha límite.</td></tr>
  </tbody>
</table>
<p>Los criterios de aceptación de cada control se escriben en la guía de elaboración con su fuente (farmacopea o referencia técnica). Un control sin criterio no permite decidir.</p>
<p><strong>Cómo se hace el control de peso de las cápsulas.</strong> Se pesa el promedio de varias cápsulas vacías del mismo lote de cápsulas; luego se pesa cada cápsula llena, o la muestra que fije el protocolo; se resta el peso de la cápsula vacía y se compara el contenido con el teórico. Todos los pesos se anotan en el registro, no solo el promedio. Si una cápsula se sale del criterio, se revisa el llenado antes de entregar cualquiera.</p>

<h3>Ejemplo resuelto 2: el resultado de 86 %</h3>
<ol>
  <li><strong>Calificar el resultado:</strong> 86 % está fuera de 90–110 %: el lote interno no es conforme.</li>
  <li><strong>Contener:</strong> no se entregan las cápsulas restantes de ese lote; se identifica a qué pacientes se entregaron.</li>
  <li><strong>Proteger al paciente:</strong> se informa al prescriptor y se evalúa el riesgo de una dosis menor; si hay daño o sospecha de daño, se reporta (clase 9).</li>
  <li><strong>Investigar la causa con el registro:</strong> ¿se corrigió la valoración o la sal? ¿El cálculo tuvo segunda verificación? ¿La balanza estaba verificada? ¿La mezcla fue geométrica? ¿Hubo pérdidas al llenar?</li>
  <li><strong>Corregir y prevenir:</strong> en el caso de Pasto, el registro mostró que se usó la sal sin factor de corrección. Acción: incluir el factor en la guía, verificación obligatoria del cálculo por una segunda persona y valoración del siguiente lote.</li>
</ol>

<h2>Segundo caso contrastado</h2>
<p>Una crema de un servicio de Montería se veía perfecta: color uniforme, sin grumos, peso exacto. Un análisis externo, pedido por una queja de falta de efecto, mostró 70 % del principio activo. El registro reveló que la persona pesó la cantidad teórica de una sal sin corregir por su masa molecular.</p>
<p><strong>Contraste con Pasto.</strong> En los dos casos el control visual dijo «conforme» y estaba equivocado. La diferencia es cómo se descubrió: en Pasto, por un control planeado; en Montería, por una queja después de usar el producto. El control documental con segunda verificación habría detectado ambos errores antes de elaborar.</p>

<h2>Mapa de relaciones</h2>
<p>Lee el mapa de izquierda a derecha: cada fila declara una relación y explica por qué existe. Es la estructura que conecta los conceptos de la clase, no una lista de definiciones sueltas.</p>

<table>
  <caption>Mapa de relaciones de la clase</caption>
  <thead><tr><th scope="col">Concepto A</th><th scope="col">Relación</th><th scope="col">Concepto B</th><th scope="col">Por qué</th></tr></thead>
  <tbody>
    <tr><td>Verificación del cálculo</td><td>previene</td><td>Errores de dosis</td><td>Es el único control del servicio que ve ese error antes de elaborar.</td></tr>
    <tr><td>Inspección visual</td><td>detecta</td><td>Defectos de aspecto y homogeneidad</td><td>No detecta la cantidad de principio activo.</td></tr>
    <tr><td>Valoración externa</td><td>mide</td><td>El contenido real</td><td>Sin monografía, el intervalo aceptable es 90–110 %.</td></tr>
    <tr><td>Criterio de aceptación</td><td>convierte</td><td>Un control en una decisión</td><td>Sin criterio no hay «conforme».</td></tr>
    <tr><td>Resultado fuera de especificación</td><td>activa</td><td>Contención, aviso e investigación</td><td>Protege a los pacientes que ya recibieron el producto.</td></tr>
  </tbody>
</table>

<h2>Errores frecuentes y cómo corregirlos</h2>
<ul><li>Liberar solo con «aspecto conforme». Corrección: combina control documental, en proceso y final según la forma farmacéutica.</li><li>Creer que una preparación bonita tiene la dosis correcta. Corrección: el error de cantidad se previene verificando el cálculo y la pesada.</li><li>Hacer controles sin criterio escrito. Corrección: la guía define qué se mide, cómo y qué resultado es aceptable.</li><li>Tratar un resultado fuera de especificación como un dato aislado. Corrección: contén, informa, investiga la causa y corrige el proceso.</li></ul>
<h2>Práctica de autoevaluación</h2>

<p>Indica qué control detecta cada error, y si puede hacerse en el servicio.</p>
<ol>
  <li>Se olvidó corregir por la valoración del certificado.</li>
  <li>Una crema quedó con grumos de principio activo.</li>
  <li>Se llenaron 58 cápsulas cuando la fórmula pedía 60.</li>
  <li>El conservante de una suspensión no protege durante toda la fecha límite asignada.</li>
</ol>
<details>
  <summary>Ver solución comentada</summary>
  
<ol>
  <li>Verificación del cálculo por segunda persona (en el servicio, antes de pesar); la valoración externa lo confirmaría después.</li>
  <li>Inspección de homogeneidad en vidrio (en el servicio).</li>
  <li>Conteo y conciliación de unidades (en el servicio).</li>
  <li>Prueba de eficacia del conservante (externa, laboratorio).</li>
</ol>
</details>
<h2>Práctica adicional</h2>
<p>Escribe el criterio de aceptación de dos controles para una suspensión oral, con su fuente o con la indicación de dónde la tomarías.</p>
<details>
  <summary>Ver solución comentada</summary>
  <p>Ejemplo: «Aspecto: suspensión homogénea, sin aglomerados visibles tras agitar 10 segundos; fuente: guía de elaboración validada». «Volumen: volumen declarado en la etiqueta, medido con probeta calibrada; tolerancia según el protocolo basado en la farmacopea adoptada». Se valora que el criterio sea observable y tenga origen declarado; no se aceptan criterios inventados sin fuente.</p>
</details>
<h2>Síntesis y puente</h2>
<p>Los controles se escogen por el error que detectan. El visual no ve la dosis; la verificación del cálculo sí la protege. Un resultado fuera de especificación obliga a contener, avisar e investigar. La próxima clase responde la otra pregunta de calidad: cuánto tiempo sigue siendo buena la preparación.</p>
<h2>Preguntas de transferencia</h2><p>Lleva lo aprendido a una situación distinta de la del caso. No hay una única respuesta: lo que cuenta es el razonamiento y la evidencia que uses.</p><ol><li>¿Cada cuánto enviarías a valoración externa una preparación de alto riesgo que elaboras todas las semanas, y qué evento te haría enviarla antes?</li></ol>
<h2>Referencias consultadas</h2>
<ol>
<li>Ministerio de la Protección Social. <em>Resolución 1403 de 2007 y su Manual de Condiciones Esenciales</em> (2007). Actividades posteriores y control (Manual, numerales 2.4.3 y 2.6) y protocolo de control (artículo 10, numeral 8). <a href="https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_1403_2007.htm" target="_blank" rel="noopener noreferrer nofollow">https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_1403_2007.htm</a>. Consultado: 2026-11-03.</li>
<li>Ministerio de la Protección Social. <em>Resolución 444 de 2008 (instrumento de verificación de BPE)</em> (2008). Controles en proceso, inspección final y su registro (17.3.1.3, 17.3.9 y 17.3.9.1). <a href="https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_0444_2008.htm" target="_blank" rel="noopener noreferrer nofollow">https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_0444_2008.htm</a>. Consultado: 2026-11-03.</li>
<li>United States Pharmacopeia. <em>795 FAQs (1 de noviembre de 2023)</em> (2023). Intervalo de ±10 % para artículos sin monografía (pregunta 19). <a href="https://pages.usp.org/rs/711-SXF-172/images/HQS%20-%20USP%20GC%20795%20FAQs.pdf" target="_blank" rel="noopener noreferrer nofollow">https://pages.usp.org/rs/711-SXF-172/images/HQS%20-%20USP%20GC%20795%20FAQs.pdf</a>. Consultado: 2026-11-03.</li>
<li>United States Pharmacopeia. <em>USP General Chapter 795: Pharmaceutical Compounding, Nonsterile Preparations</em> (2023). Capítulo oficial desde el 1 de noviembre de 2023, referencia técnica del curso. <a href="https://www.usp.org/compounding/general-chapter-795" target="_blank" rel="noopener noreferrer nofollow">https://www.usp.org/compounding/general-chapter-795</a>. Consultado: 2026-11-03.</li>
</ol>
</article>$bpe_html$));


  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, $bpe_json${"url":"https://www.usp.org/compounding/general-chapter-795","title":"USP: capítulo general 795 (preparaciones no estériles)","description":"Página oficial del capítulo, sus preguntas frecuentes y su estado oficial (en inglés)."}$bpe_json$::jsonb);


  -- ── bpe-u3-l2 · Estabilidad y fecha límite de uso ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Calidad y seguridad del paciente' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Calidad y seguridad del paciente). Se salta.';
    RETURN;
  END IF;
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND module_id = v_unidad AND title = 'Estabilidad y fecha límite de uso' AND deleted_at IS NULL
   LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'No existe la clase Estabilidad y fecha límite de uso. Se salta.';
    RETURN;
  END IF;

  UPDATE aula_lessons
     SET subtitle = 'Clase 8 · Cuánto tiempo sigue siendo buena',
         duration_minutes = 75,
         completion_rule = 'manual',
         is_required = TRUE,
         updated_at = NOW()
   WHERE id = v_clase;

  -- El texto breve, los destacados y los enlaces anteriores se sustituyen
  -- por la clase completa y por enlaces verificados.
  DELETE FROM aula_lesson_blocks
   WHERE lesson_id = v_clase
     AND (type IN ('texto', 'destacado', 'enlace'));

  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, jsonb_build_object('html', $bpe_html$<article>
<p>Una preparación correcta el día que se elabora puede no serlo un mes después. Esta clase enseña a sustentar cuánto dura, con una regla de partida, sus excepciones y el cálculo de la fecha que va en la etiqueta.</p>
<p><strong>Clase sin video principal.</strong> No encontramos un video vigente, verificable y ajustado a la norma colombiana que enseñe este tema mejor que el texto. La clase es completa sin video: trae dos ejemplos resueltos y una práctica adicional.</p>
<h2>Resultados de aprendizaje</h2>
<ul><li>Diferenciar la fecha de vencimiento del fabricante de la fecha límite de uso de una preparación magistral.</li><li>Asignar la fecha límite de uso de una preparación no estéril con la Tabla 4 del capítulo 795 de la USP y expresarla como fecha calendario.</li><li>Decidir si un estudio de estabilidad publicado permite extender esa fecha.</li></ul>
<h2>Prerrequisitos</h2>
<p>Clase 6: guía, registro y etiqueta.</p>
<h2>Caso de partida</h2>
<p>En una farmacia-droguería de Villavicencio, todas las etiquetas dicen «vence: 6 meses» desde hace años. Una auditora encuentra una suspensión oral sin conservante con esa leyenda, una crema O/W con conservante con la misma, y una suspensión preparada a partir de tabletas comerciales a la que se le copió el vencimiento de las tabletas: 2028.</p>

<h3>Vencimiento y fecha límite de uso no son lo mismo</h3>
<p>La Resolución 1403 define la estabilidad como la aptitud de un principio activo o de un medicamento de mantener en el tiempo sus propiedades originales dentro de las especificaciones de identidad, concentración o potencia, calidad, pureza y apariencia física. El fabricante demuestra esa aptitud para su producto en su envase y asigna una fecha de vencimiento. Quien elabora una magistral asigna una <strong>fecha límite de uso</strong>: la fecha, u hora y fecha, después de la cual la preparación no debe usarse, contada desde el inicio de su elaboración (preguntas frecuentes del capítulo 795 de la USP, pregunta 57).</p>
<p>Por eso no se copia el vencimiento de las tabletas a una suspensión hecha con ellas: al triturarlas y dispersarlas se creó un producto nuevo, en otro medio y otro envase, para el cual el estudio del fabricante no dice nada.</p>
<p>En Colombia, la obligación de considerar la estabilidad aparece en el protocolo del artículo 10 de la Resolución 1403 (numeral 5) y en la etiqueta, que debe incluir condiciones de almacenamiento y estabilidad cuando aplique (Manual, numeral 5.1.1, literal f). El criterio técnico para fijar la fecha se toma de referencias como el capítulo 795 de la USP, oficial desde el 1 de noviembre de 2023.</p>

<h3>La regla de partida: Tabla 4 del capítulo 795</h3>
<table>
  <caption>Tabla 1. Fecha límite de uso sin monografía ni datos de estabilidad específicos (USP 795, Tabla 4)</caption>
  <thead><tr><th scope="col">Tipo de preparación</th><th scope="col">Conservación</th><th scope="col">Días</th></tr></thead>
  <tbody>
    <tr><td>Acuosa (actividad de agua ≥ 0,6) sin conservante: emulsiones, geles, cremas, soluciones, aerosoles, suspensiones</td><td>Refrigerador</td><td>14</td></tr>
    <tr><td>Acuosa con conservante</td><td>Ambiente controlado o refrigerador</td><td>35</td></tr>
    <tr><td>Líquido oral no acuoso (actividad de agua &lt; 0,6)</td><td>Ambiente controlado o refrigerador</td><td>90</td></tr>
    <tr><td>Otras formas no acuosas: cápsulas, tabletas, gránulos, polvos, tópicos no acuosos, supositorios, trociscos</td><td>Ambiente controlado o refrigerador</td><td>180</td></tr>
  </tbody>
</table>
<p>Tres notas de la propia tabla: se asigna una fecha más corta si la estabilidad física o química es menor; no hace falta medir la actividad de agua, que sirve de guía (pregunta 52); y la versión anterior del capítulo usaba 14 días para orales con agua, 30 para tópicos con agua y 6 meses para no acuosos. Si tu protocolo todavía dice «30 días para cremas», está desactualizado.</p>

<figure>
  <figcaption>Figura 1. Ruta para asignar la fecha límite de uso.</figcaption>
  <ol>
    <li>¿Existe una monografía oficial de esa preparación? Si sí → usa su fecha límite.</li>
    <li>¿Hay un estudio de estabilidad de la misma fórmula, con método indicador de estabilidad y el mismo material de envase? Si sí → puedes extender hasta un máximo de 180 días; si es acuosa, con prueba de eficacia del conservante.</li>
    <li>Si no → aplica la Tabla 4.</li>
    <li>En todos los casos: acorta si algún componente vence antes o si la estabilidad conocida es menor, y escribe la fecha calendario.</li>
  </ol>
</figure>

<h3>Ejemplo resuelto 1: cuatro etiquetas del 3 de noviembre de 2026</h3>
<table>
  <caption>Tabla 2. Asignación y cálculo de la fecha</caption>
  <thead><tr><th scope="col">Preparación</th><th scope="col">Categoría</th><th scope="col">Fecha en la etiqueta</th></tr></thead>
  <tbody>
    <tr><td>Suspensión oral sin conservante</td><td>Acuosa sin conservante, refrigerada: 14 días</td><td>Usar antes del 17/11/2026; conservar entre 2 y 8 °C.</td></tr>
    <tr><td>Crema O/W con conservante</td><td>Acuosa con conservante: 35 días</td><td>Usar antes del 08/12/2026.</td></tr>
    <tr><td>Cápsulas</td><td>No acuosa: 180 días</td><td>Usar antes del 02/05/2027, si ningún componente vence antes.</td></tr>
    <tr><td>Ungüento en vaselina</td><td>Tópico no acuoso: 180 días</td><td>Usar antes del 02/05/2027, con la misma condición.</td></tr>
  </tbody>
</table>
<p>Si la hidrocortisona de las cápsulas venciera en marzo de 2027, la fecha límite no podría superar ese vencimiento: se acorta.</p>

<h3>Ejemplo resuelto 2: ¿sirve el estudio publicado?</h3>
<p>Un artículo informa que una suspensión de cierto principio activo fue estable 60 días. La farmacia quiere asignar 60 días a su suspensión. Para extender más allá de la Tabla 4, la USP exige un estudio con método indicador de estabilidad para el principio activo, la misma formulación y el mismo material del envase; si es acuosa, además, prueba de eficacia del conservante; y el máximo es 180 días (preguntas 54 y 55). La farmacia revisa:</p>
<ul>
  <li>El estudio usó otro vehículo y otro envase: <strong>no se puede extrapolar</strong>.</li>
  <li>Si la fórmula y el envase fueran idénticos, el método fuera indicador de estabilidad y se hubiera probado el conservante, se podrían asignar 60 días, citando el estudio en la guía.</li>
</ul>
<p>Decisión: con otro vehículo, se aplica la Tabla 4 (35 días si tiene conservante, 14 si no) hasta tener datos de su propia fórmula.</p>

<h2>Segundo caso contrastado</h2>
<p>El proyecto de circular del Invima de junio de 2026, que no está vigente, propone que el plazo de uso se determine conforme a las farmacopeas oficialmente aceptadas y que se verifique por parámetros técnicos, no por número de unidades.</p>
<p><strong>Contraste con la práctica de Villavicencio.</strong> «Vence: 6 meses» para todo es lo contrario de un parámetro técnico: ignora si la preparación tiene agua, conservante o envase adecuado. Hoy, sin esperar ningún texto nuevo, el protocolo del artículo 10 y la etiqueta del Manual ya obligan a sustentar la estabilidad de lo que se elabora. La Tabla 4 da un punto de partida defendible.</p>

<h2>Mapa de relaciones</h2>
<p>Lee el mapa de izquierda a derecha: cada fila declara una relación y explica por qué existe. Es la estructura que conecta los conceptos de la clase, no una lista de definiciones sueltas.</p>

<table>
  <caption>Mapa de relaciones de la clase</caption>
  <thead><tr><th scope="col">Concepto A</th><th scope="col">Relación</th><th scope="col">Concepto B</th><th scope="col">Por qué</th></tr></thead>
  <tbody>
    <tr><td>Fecha de vencimiento</td><td>pertenece a</td><td>El producto del fabricante en su envase</td><td>Se demuestra para esa fórmula y ese envase.</td></tr>
    <tr><td>Fecha límite de uso</td><td>la asigna</td><td>Quien elabora</td><td>Se cuenta desde el inicio de la elaboración.</td></tr>
    <tr><td>Agua y conservante</td><td>definen</td><td>La categoría de la Tabla 4</td><td>El agua favorece la hidrólisis y el crecimiento microbiano.</td></tr>
    <tr><td>Estudio de estabilidad</td><td>permite extender</td><td>La fecha límite</td><td>Solo si es de la misma fórmula y envase, con método indicador.</td></tr>
    <tr><td>Vencimiento de un componente</td><td>acorta</td><td>La fecha límite</td><td>Ningún componente puede estar vencido durante el uso.</td></tr>
  </tbody>
</table>

<h2>Errores frecuentes y cómo corregirlos</h2>
<ul><li>Copiar el vencimiento del producto comercial usado como fuente. Corrección: la manipulación crea un producto nuevo; asigna una fecha límite propia.</li><li>Usar «6 meses» para todo. Corrección: clasifica la preparación con la Tabla 4.</li><li>Extrapolar un estudio de otra fórmula u otro envase. Corrección: solo aplica si fórmula, envase y método coinciden.</li><li>Escribir la duración en lugar de la fecha. Corrección: calcula la fecha calendario desde el inicio de la elaboración.</li></ul>
<h2>Práctica de autoevaluación</h2>

<p>Asigna la fecha límite de uso. Todas se empezaron a elaborar el 10/11/2026.</p>
<ol>
  <li>Gel acuoso sin conservante, refrigerado.</li>
  <li>Solución oral acuosa con conservante.</li>
  <li>Papelillos de un polvo, cuyo principio activo vence el 31/01/2027.</li>
  <li>Aceite oral (no acuoso).</li>
</ol>
<details>
  <summary>Ver solución comentada</summary>
  
<ol>
  <li>14 días: <strong>24/11/2026</strong>, conservar en refrigerador.</li>
  <li>35 días: <strong>15/12/2026</strong>.</li>
  <li>180 días serían el 09/05/2027, pero el principio activo vence antes: <strong>31/01/2027</strong>.</li>
  <li>90 días: <strong>08/02/2027</strong>.</li>
</ol>
</details>
<h2>Práctica adicional</h2>
<p>Redacta, en máximo 80 palabras, la justificación que pondrías en la guía de elaboración para la fecha límite de una crema O/W con conservante.</p>
<details>
  <summary>Ver solución comentada</summary>
  <p><strong>Modelo.</strong> «Fecha límite de uso: 35 días desde el inicio de la elaboración, conservada a temperatura ambiente controlada o en refrigerador. Fundamento: preparación acuosa con conservante, sin monografía ni estudio de estabilidad de esta fórmula (USP 795, Tabla 4). Se acorta si algún componente vence antes. Revisión: si se obtienen datos de estabilidad con método indicador y prueba del conservante.»</p>
</details>
<h2>Síntesis y puente</h2>
<p>La fecha límite de uso la asigna quien elabora, desde el inicio de la elaboración, con la Tabla 4 como regla de partida y datos propios para extenderla. La última clase cierra el ciclo: qué hacer cuando, a pesar de todo, algo sale mal.</p>
<h2>Preguntas de transferencia</h2><p>Lleva lo aprendido a una situación distinta de la del caso. No hay una única respuesta: lo que cuenta es el razonamiento y la evidencia que uses.</p><ol><li>Un paciente pide que su suspensión dure tres meses «para no volver». ¿Qué le responderías y qué alternativa organizativa ofrecerías?</li></ol>
<h2>Referencias consultadas</h2>
<ol>
<li>Ministerio de la Protección Social. <em>Resolución 1403 de 2007 y su Manual de Condiciones Esenciales</em> (2007). Definición de estabilidad, protocolo de estabilidad (artículo 10, numeral 5) y etiqueta (Manual, numeral 5.1.1, literal f). <a href="https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_1403_2007.htm" target="_blank" rel="noopener noreferrer nofollow">https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_1403_2007.htm</a>. Consultado: 2026-11-03.</li>
<li>NABP y United States Pharmacopeia. <em>USP Compounding Webinar Handout (diapositivas USP, 14 de septiembre de 2023)</em> (2023). Tabla 4 del capítulo 795 y comparación con la versión anterior (diapositivas de la USP). <a href="https://nabp.pharmacy/wp-content/uploads/2023/09/USP-Compounding-Webinar-Handout-September-14-2023.pdf" target="_blank" rel="noopener noreferrer nofollow">https://nabp.pharmacy/wp-content/uploads/2023/09/USP-Compounding-Webinar-Handout-September-14-2023.pdf</a>. Consultado: 2026-11-03.</li>
<li>United States Pharmacopeia. <em>795 FAQs (1 de noviembre de 2023)</em> (2023). Fecha límite frente a vencimiento (57), actividad de agua (52), extensión y conservantes (54 y 55). <a href="https://pages.usp.org/rs/711-SXF-172/images/HQS%20-%20USP%20GC%20795%20FAQs.pdf" target="_blank" rel="noopener noreferrer nofollow">https://pages.usp.org/rs/711-SXF-172/images/HQS%20-%20USP%20GC%20795%20FAQs.pdf</a>. Consultado: 2026-11-03.</li>
<li>United States Pharmacopeia. <em>USP General Chapter 795: Pharmaceutical Compounding, Nonsterile Preparations</em> (2023). Estado oficial del capítulo desde el 1 de noviembre de 2023. <a href="https://www.usp.org/compounding/general-chapter-795" target="_blank" rel="noopener noreferrer nofollow">https://www.usp.org/compounding/general-chapter-795</a>. Consultado: 2026-11-03.</li>
<li>Invima. <em>Proyecto de circular sobre preparaciones magistrales (junio de 2026, no expedido)</em> (2026). Criterio propuesto sobre el plazo de uso, presentado como proyecto no vigente. <a href="https://www.invima.gov.co/biblioteca/download/145079" target="_blank" rel="noopener noreferrer nofollow">https://www.invima.gov.co/biblioteca/download/145079</a>. Consultado: 2026-11-03.</li>
</ol>
</article>$bpe_html$));


  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 1, $bpe_json${"url":"https://pages.usp.org/rs/711-SXF-172/images/HQS%20-%20USP%20GC%20795%20FAQs.pdf","title":"USP: preguntas frecuentes del capítulo 795","description":"Preguntas 51 a 59 sobre la fecha límite de uso (en inglés)."}$bpe_json$::jsonb);


  -- ── bpe-u3-l3 · Cuando algo sale mal: farmacovigilancia ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Calidad y seguridad del paciente' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Calidad y seguridad del paciente). Se salta.';
    RETURN;
  END IF;
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND module_id = v_unidad AND title = 'Cuando algo sale mal: farmacovigilancia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'No existe la clase Cuando algo sale mal: farmacovigilancia. Se salta.';
    RETURN;
  END IF;

  UPDATE aula_lessons
     SET subtitle = 'Clase 9 · Atender, contener, reportar e investigar',
         duration_minutes = 70,
         completion_rule = 'manual',
         is_required = TRUE,
         updated_at = NOW()
   WHERE id = v_clase;

  -- El texto breve, los destacados y los enlaces anteriores se sustituyen
  -- por la clase completa y por enlaces verificados.
  DELETE FROM aula_lesson_blocks
   WHERE lesson_id = v_clase
     AND (type IN ('texto', 'destacado', 'enlace') OR (type = 'video' AND data->>'videoId' = '9dEGNB5MlsA'));

  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, jsonb_build_object('html', $bpe_html$<article>
<p>Una preparación magistral también puede causar daño o fallar. Lo que distingue a un servicio seguro no es que nunca ocurra, sino cómo responde: rápido con el paciente, ordenado con el producto, puntual con el reporte y honesto con la causa.</p>
<p><strong>Video complementario (opcional):</strong> «Capacitación Farmacovigilancia», Hospital Departamental de Villavicencio, 4:43 min, publicado el 8 de junio de 2022. Tramo recomendado: del minuto 2:13 al 4:39 (cómo diligenciar el formato de reporte). Atención: entre el minuto 0:53 y el 1:13 el video presenta lo «inesperado» como si fuera un criterio de gravedad; en esta clase verás que son dos ejes distintos. También describe el formato en papel de esa institución: hoy el Invima recibe reportes por VigiFlow. Revisamos su transcripción automática el 3 de noviembre de 2026.</p>
<h2>Resultados de aprendizaje</h2>
<ul><li>Distinguir un evento adverso, un problema relacionado con medicamentos y un problema de calidad, y decidir si un evento es serio.</li><li>Ejecutar la respuesta a una sospecha: atención del paciente, contención del lote interno, reporte en el plazo que corresponde e investigación.</li><li>Diligenciar un reporte con los datos mínimos que exige la norma, adaptado a una preparación magistral.</li></ul>
<h2>Prerrequisitos</h2>
<p>Unidades 1 y 2, en especial la trazabilidad del registro de elaboración.</p>
<h2>Caso de partida</h2>
<p>La madre de un niño de dos años llama a una farmacia-droguería de Popayán. La suspensión de omeprazol que recogió hace cinco días cambió de color y, después de la última dosis, el niño vomitó dos veces. Está tranquilo y comiendo. La farmacia elaboró esa semana otras tres suspensiones con el mismo lote de cápsulas fuente.</p>

<h3>Qué se vigila</h3>
<p>El Decreto 2200 define la farmacovigilancia como la ciencia y las actividades relacionadas con la detección, evaluación, entendimiento y prevención de los eventos adversos o de cualquier otro problema relacionado con medicamentos. La Resolución 1403 define los <strong>problemas relacionados con medicamentos</strong> (PRM) como sucesos indeseables asociados o sospechosos de estar asociados a una terapia, y los <strong>problemas relacionados con la utilización</strong> (PRUM) como sus causas prevenibles, incluidos los errores de medicación. En una magistral hay que mirar tres cosas a la vez: el paciente (¿hubo daño?), el producto (¿tiene un defecto?) y el proceso (¿hubo un error?).</p>

<h3>Serio no es lo mismo que inesperado</h3>
<p>La guía ICH E2A considera serio el evento que causa la muerte, pone en peligro la vida, requiere hospitalización o la prolonga, produce discapacidad persistente o significativa, o es una anomalía congénita; también los eventos médicamente importantes, según el juicio clínico. Inesperado, en cambio, es lo que por su naturaleza o intensidad no coincide con la información conocida del producto. Un evento puede ser serio y esperado, o no serio e inesperado: son dos preguntas distintas, y la de gravedad es la que define el plazo del reporte.</p>

<h3>Los plazos y el canal</h3>
<p>Según el Manual de la Resolución 1403, los reportes institucionales se envían al Invima y a la entidad territorial dentro de los cinco días siguientes al vencimiento del mes que se informa, y los eventos serios dentro de las 72 horas siguientes a su aparición (numeral 5.4). El director de un establecimiento minorista que sospeche un evento adverso lo reporta dentro de los primeros cinco días de cada mes, y los serios en 72 horas (numeral 5.5). El formato debe incluir, como mínimo, identificación del paciente, medicamento sospechoso y concomitantes, información del evento, diagnóstico y notificador. El Invima recibe hoy los reportes por VigiFlow, con lineamientos publicados para inscripción, capacitación y reporte.</p>
<p>Desde el 1 de marzo de 2025 rige además la Resolución 2024015321 de 2024 del Invima, que derogó la Resolución 2004009455 de 2004. Su artículo 16 alcanza a los establecimientos independientes de una IPS que elaboran preparaciones magistrales con certificado de BPE: reportan sus eventos al Invima por eReporting Industria, los serios dentro de los 15 días calendario siguientes al día en que los conocen y los no serios dentro de los 90, y su programa de farmacovigilancia sigue el anexo técnico de la Resolución 444 de 2008. Si ese establecimiento es una farmacia-droguería, conserva además sus obligaciones de minorista del Manual (numeral 5.5). Para el servicio farmacéutico de una IPS, la referencia sigue siendo el Manual (numeral 5.4).</p>
<p>El instrumento de la Resolución 444 califica como crítico contar con un programa de farmacovigilancia (14.2.2) y como mayores la responsabilidad asignada, los procedimientos de notificación, análisis y envío, el formato con los datos mínimos y la capacitación (14.2.1 a 14.2.8).</p>

<figure>
  <figcaption>Figura 1. Cuatro carriles que avanzan en paralelo ante una sospecha.</figcaption>
  <ol>
    <li><strong>Paciente:</strong> orientar a consulta o urgencias según los signos; informar al prescriptor.</li>
    <li><strong>Producto:</strong> pedir la devolución de lo que queda, poner en cuarentena el lote interno y localizar otras preparaciones con las mismas materias primas.</li>
    <li><strong>Reporte:</strong> definir si es serio; 72 horas si lo es, reporte periódico si no.</li>
    <li><strong>Investigación:</strong> reconstruir con el registro, encontrar la causa y definir acciones.</li>
  </ol>
</figure>

<h3>Ejemplo resuelto 1: la llamada de Popayán</h3>
<ul>
  <li><strong>Paciente:</strong> vómito dos veces, sin otros signos: no es serio con los criterios de ICH E2A, pero se orienta a la madre a suspender la suspensión, consultar al pediatra y acudir a urgencias si aparecen signos de alarma.</li>
  <li><strong>Producto:</strong> cambio de color = posible problema de calidad. Se pide devolver el frasco, se ponen en cuarentena las otras tres suspensiones del mismo lote de cápsulas y se revisa si se entregaron.</li>
  <li><strong>Reporte:</strong> evento no serio → como minorista, reporte en el periodo mensual (numeral 5.5); como elaboradora con certificado de BPE, además, reporte por eReporting Industria dentro de los 90 días calendario (Resolución 2024015321 de 2024). El problema de calidad se documenta y se informa por los canales del Invima. Si el niño hubiera requerido hospitalización, los plazos serían de 72 horas en el Manual y de 15 días calendario en la resolución.</li>
  <li><strong>Investigación:</strong> el registro muestra que la suspensión se conservó fuera de la nevera dos días antes de la entrega. Causa probable: excursión de temperatura. Acción: control de temperatura hasta la entrega e instrucción escrita a la familia.</li>
</ul>

<h3>Ejemplo resuelto 2: el reporte de una preparación sin registro sanitario</h3>
<p>Los formatos suelen pedir titular y número de registro sanitario. Una magistral no lo tiene. En su lugar se escribe: «preparación magistral», establecimiento que la elaboró, número interno, composición completa con concentraciones, fecha de elaboración y fecha límite de uso. Sin esos datos, el Invima no puede relacionar reportes ni detectar una señal, como ocurrió con los productos falsificados de mayo de 2026.</p>

<h2>Segundo caso contrastado</h2>
<p>En mayo de 2026 el Invima alertó sobre tres productos presentados como magistrales y falsificados, después de que el establecimiento cuyo nombre aparecía confirmara que no los había elaborado y que desconocía su trazabilidad. El Invima recomendó suspender su uso y reportar cualquier evento adverso por sus canales de farmacovigilancia.</p>
<p><strong>Contraste con Popayán.</strong> En Popayán, el número interno llevó en minutos al registro, al lote de cápsulas y a las otras tres suspensiones. Con un producto falsificado no hay registro que consultar: solo el reporte del paciente o del profesional permite reconstruir qué pasó. Por eso cada reporte bien hecho protege a pacientes que nunca conocerás.</p>

<h2>Mapa de relaciones</h2>
<p>Lee el mapa de izquierda a derecha: cada fila declara una relación y explica por qué existe. Es la estructura que conecta los conceptos de la clase, no una lista de definiciones sueltas.</p>

<table>
  <caption>Mapa de relaciones de la clase</caption>
  <thead><tr><th scope="col">Concepto A</th><th scope="col">Relación</th><th scope="col">Concepto B</th><th scope="col">Por qué</th></tr></thead>
  <tbody>
    <tr><td>Gravedad del evento</td><td>define</td><td>El plazo del reporte</td><td>Serio: 72 horas; no serio: reporte periódico.</td></tr>
    <tr><td>Inesperado</td><td>no equivale a</td><td>Serio</td><td>Uno se refiere a la información conocida; el otro, al daño.</td></tr>
    <tr><td>Número interno</td><td>permite</td><td>Contener y buscar otros pacientes</td><td>Conecta la queja con el registro y las materias primas.</td></tr>
    <tr><td>Problema de calidad</td><td>se gestiona junto con</td><td>El evento adverso</td><td>El producto y el paciente se atienden en paralelo.</td></tr>
    <tr><td>Reporte completo</td><td>alimenta</td><td>La detección de señales</td><td>Sin datos de la preparación, no se relacionan los casos.</td></tr>
  </tbody>
</table>

<h2>Errores frecuentes y cómo corregirlos</h2>
<ul><li>Esperar a «estar seguro» de la causa para reportar. Corrección: se reporta la sospecha, en el plazo que corresponde.</li><li>Confundir inesperado con serio. Corrección: la gravedad se define por el daño (criterios de ICH E2A).</li><li>Atender al paciente y olvidar el producto. Corrección: cuarentena del lote interno y búsqueda de otras preparaciones.</li><li>Dejar en blanco los campos de registro sanitario. Corrección: escribe «preparación magistral», establecimiento, número interno y composición.</li></ul>
<h2>Práctica de autoevaluación</h2>

<p>Para cada situación, indica si el evento es serio y el plazo de reporte.</p>
<ol>
  <li>Una paciente presenta eritema leve donde aplicó una crema magistral; no requiere tratamiento.</li>
  <li>Un niño es hospitalizado por sobredosificación de una suspensión con error de concentración.</li>
  <li>Un paciente nota un olor extraño en sus cápsulas, sin síntomas.</li>
</ol>
<details>
  <summary>Ver solución comentada</summary>
  
<ol>
  <li>No serio: reporte en el periodo mensual (numeral 5.4 o 5.5 del Manual).</li>
  <li>Serio (hospitalización): reporte dentro de las 72 horas; además, contención y comunicación inmediata con el prescriptor.</li>
  <li>No hay evento adverso, pero sí un posible problema de calidad: cuarentena, investigación y comunicación por los canales del Invima.</li>
</ol>
</details>
<h2>Práctica adicional</h2>
<p>Con los datos del caso de Popayán, enumera los campos mínimos del reporte y escribe qué pondrías en cada uno (datos simulados).</p>
<details>
  <summary>Ver solución comentada</summary>
  <ul><li>Paciente: iniciales, edad (2 años), sexo y peso.</li><li>Medicamento sospechoso: «preparación magistral, suspensión oral de omeprazol 2 mg/mL», establecimiento, número interno, dosis, vía, frecuencia, fecha de inicio y de suspensión; concomitantes, si los hay.</li><li>Evento: vómito dos veces tras la última dosis, cambio de color del producto, fecha de inicio, evolución favorable.</li><li>Diagnóstico de base y enfermedades concomitantes.</li><li>Notificador: profesión y contacto.</li></ul>
</details>
<h2>Síntesis y puente</h2>
<p>Ante una sospecha se avanza en cuatro carriles: paciente, producto, reporte e investigación. La gravedad define el plazo y la trazabilidad define qué tan rápido se contiene. Con esto cierras el ciclo del curso: clasificar, elaborar con evidencia, controlar, fechar y responder.</p>
<h2>Preguntas de transferencia</h2><p>Lleva lo aprendido a una situación distinta de la del caso. No hay una única respuesta: lo que cuenta es el razonamiento y la evidencia que uses.</p><ol><li>Si dos farmacias distintas reportan el mismo problema con preparaciones hechas con la misma materia prima, ¿qué dato del reporte permitiría al Invima relacionarlas?</li></ol>
<h2>Referencias consultadas</h2>
<ol>
<li>Ministerio de la Protección Social. <em>Resolución 1403 de 2007 y su Manual de Condiciones Esenciales</em> (2007). PRM y PRUM, programa institucional, formato, periodicidad y responsabilidad del minorista (Manual, numerales 5.2 a 5.5). <a href="https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_1403_2007.htm" target="_blank" rel="noopener noreferrer nofollow">https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_1403_2007.htm</a>. Consultado: 2026-11-03.</li>
<li>Ministerio de la Protección Social. <em>Decreto 2200 de 2005 (texto con modificaciones)</em> (2005). Definición de farmacovigilancia (artículo 3). <a href="https://normograma.invima.gov.co/compilacion/docs/decreto_2200_2005.htm" target="_blank" rel="noopener noreferrer nofollow">https://normograma.invima.gov.co/compilacion/docs/decreto_2200_2005.htm</a>. Consultado: 2026-11-03.</li>
<li>Ministerio de la Protección Social. <em>Resolución 444 de 2008 (instrumento de verificación de BPE)</em> (2008). Ítems de farmacovigilancia 14.2.1 a 14.2.10. <a href="https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_0444_2008.htm" target="_blank" rel="noopener noreferrer nofollow">https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_0444_2008.htm</a>. Consultado: 2026-11-03.</li>
<li>International Council for Harmonisation (ICH). <em>E2A: Clinical Safety Data Management, Definitions and Standards for Expedited Reporting (versión de 27 de octubre de 1994)</em> (1994). Criterios de evento serio y de reacción inesperada. <a href="https://database.ich.org/sites/default/files/E2A_Guideline.pdf" target="_blank" rel="noopener noreferrer nofollow">https://database.ich.org/sites/default/files/E2A_Guideline.pdf</a>. Consultado: 2026-11-03.</li>
<li>Invima. <em>Resolución 2024015321 de 2024 (reportes de eventos adversos y programas de farmacovigilancia; rige desde el 1 de marzo de 2025)</em> (2024). Plazos y canal de reporte de los establecimientos independientes que elaboran magistrales con certificado de BPE (artículos 8 y 16). <a href="https://normograma.invima.gov.co/compilacion/docs/resolucion_invima_15321_2024.htm" target="_blank" rel="noopener noreferrer nofollow">https://normograma.invima.gov.co/compilacion/docs/resolucion_invima_15321_2024.htm</a>. Consultado: 2026-11-06.</li>
</ol>
</article>$bpe_html$));


  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', 1, $bpe_json${"source":"enlace","url":"https://www.youtube.com/watch?v=9dEGNB5MlsA","provider":"youtube","videoId":"9dEGNB5MlsA","title":"Complementario: Capacitación Farmacovigilancia","transcriptHtml":""}$bpe_json$::jsonb);


  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', 2, $bpe_json${"url":"https://www.invima.gov.co/farmacovigilancia","title":"Invima: farmacovigilancia y acceso a VigiFlow","description":"Reporte para profesionales de la salud, formularios electrónicos e inscripción a la Red Nacional de Farmacovigilancia."}$bpe_json$::jsonb);


  -- ── Quiz bpe-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Qué es una preparación magistral' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Qué es una preparación magistral). Se salta.';
    RETURN;
  END IF;
  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = 'Evaluación de la Unidad 1 · La figura magistral y su marco' AND deleted_at IS NULL LIMIT 1;
  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Evaluación de la Unidad 1 · La figura magistral y su marco', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.')
    RETURNING id INTO v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = 'Evaluación de la Unidad 1 · La figura magistral y su marco' AND deleted_at IS NULL LIMIT 1;
  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, 'Evaluación de la Unidad 1 · La figura magistral y su marco', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.', TRUE, 70, 2,
       FALSE, FALSE, TRUE, 'publicado', 1, 10)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', 'Evaluación de la Unidad 1 · La figura magistral y su marco';
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.', is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 1, weight = 10, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bpe-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', '¿Cuál afirmación sobre el «preparado oficinal» es correcta en Colombia?', 25, 'En España el preparado oficinal está definido por ley y delimitado por un formulario nacional. En Colombia no existe esa figura en el Decreto 2200, el Decreto 2330, la Resolución 1403 ni la Resolución 444.', 'En España el preparado oficinal está definido por ley y delimitado por un formulario nacional. En Colombia no existe esa figura en el Decreto 2200, el Decreto 2330, la Resolución 1403 ni la Resolución 444.', $bpe_json${"external_id":"bpe-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_id":"bpe-u1-l1","outcome":"Explicar por qué «preparado oficinal» no es una categoría de la normativa colombiana.","source":"Decreto 2200 de 2005; Resolución 1403 de 2007; Real Decreto Legislativo 1/2015 (España), artículo 2."}$bpe_json$::jsonb)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = '¿Cuál afirmación sobre el «preparado oficinal» es correcta en Colombia?', points = 25, general_feedback = 'En España el preparado oficinal está definido por ley y delimitado por un formulario nacional. En Colombia no existe esa figura en el Decreto 2200, el Decreto 2330, la Resolución 1403 ni la Resolución 444.',
             explanation = 'En España el preparado oficinal está definido por ley y delimitado por un formulario nacional. En Colombia no existe esa figura en el Decreto 2200, el Decreto 2330, la Resolución 1403 ni la Resolución 444.', config = $bpe_json${"external_id":"bpe-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_id":"bpe-u1-l1","outcome":"Explicar por qué «preparado oficinal» no es una categoría de la normativa colombiana.","source":"Decreto 2200 de 2005; Resolución 1403 de 2007; Real Decreto Legislativo 1/2015 (España), artículo 2."}$bpe_json$::jsonb, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'Es una preparación descrita en una farmacopea oficial que puede elaborarse y venderse sin prescripción, porque su fórmula está estandarizada y su riesgo se considera bajo.', FALSE, 'Que una fórmula sea de farmacopea describe su calidad técnica, no su régimen legal. Ninguna norma colombiana permite elaborarla sin prescripción.', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'Las normas colombianas del servicio farmacéutico no definen esa figura; elaborar por anticipado para vender sin prescripción queda fuera de la preparación magistral.', TRUE, 'Correcto. La figura que exime del registro sanitario es la preparación para un paciente individual con dispensación inmediata.', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'Está definida en la Resolución 1403 de 2007 como preparación de venta libre.', FALSE, 'La Resolución 1403 no define esa figura. Revisa el apartado «El medicamento industrial y lo oficinal» de la clase 1.', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'Es lo mismo que una preparación magistral, solo que se elabora en mayor cantidad.', FALSE, 'La magistral no se define por la cantidad sino por la individualización; lo oficinal pertenece a otras legislaciones.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bpe-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', 'Una farmacia-droguería recibe 40 fórmulas iguales de crema de urea al 20 %, cada una para un paciente distinto e identificado, y elabora cada crema el día en que llega su fórmula. ¿Cómo se clasifica esta actividad?', 25, 'Los tres elementos se cumplen en cada caso: prescripción individual, intervención técnica y dispensación inmediata. La cantidad de pacientes no convierte la actividad en producción en serie mientras cada preparación nazca de su prescripción.', 'Los tres elementos se cumplen en cada caso: prescripción individual, intervención técnica y dispensación inmediata. La cantidad de pacientes no convierte la actividad en producción en serie mientras cada preparación nazca de su prescripción.', $bpe_json${"external_id":"bpe-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_id":"bpe-u1-l1","outcome":"Aplicar la prueba de los tres elementos de la definición de preparación magistral.","source":"Decreto 2200 de 2005, artículo 3, modificado por el Decreto 2330 de 2006."}$bpe_json$::jsonb)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = 'Una farmacia-droguería recibe 40 fórmulas iguales de crema de urea al 20 %, cada una para un paciente distinto e identificado, y elabora cada crema el día en que llega su fórmula. ¿Cómo se clasifica esta actividad?', points = 25, general_feedback = 'Los tres elementos se cumplen en cada caso: prescripción individual, intervención técnica y dispensación inmediata. La cantidad de pacientes no convierte la actividad en producción en serie mientras cada preparación nazca de su prescripción.',
             explanation = 'Los tres elementos se cumplen en cada caso: prescripción individual, intervención técnica y dispensación inmediata. La cantidad de pacientes no convierte la actividad en producción en serie mientras cada preparación nazca de su prescripción.', config = $bpe_json${"external_id":"bpe-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_id":"bpe-u1-l1","outcome":"Aplicar la prueba de los tres elementos de la definición de preparación magistral.","source":"Decreto 2200 de 2005, artículo 3, modificado por el Decreto 2330 de 2006."}$bpe_json$::jsonb, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'Como preparaciones magistrales: cada una responde a la prescripción de un paciente individual y se dispensa de inmediato.', TRUE, 'Correcto. La figura se define por la relación entre cada prescripción, cada preparación y cada paciente, no por el número de pacientes.', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'Como fabricación en serie que necesita registro sanitario, porque la misma fórmula se repite 40 veces en la semana y ese volumen ya corresponde a una producción.', FALSE, 'La repetición de la fórmula no elimina la individualización: cada crema nace de una prescripción. Repasa el Ejemplo resuelto 2 de la clase 1.', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'Como preparados oficinales, porque la fórmula es siempre la misma.', FALSE, 'La normativa colombiana del servicio farmacéutico no define el preparado oficinal; es una figura de otras legislaciones.', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'Como dispensación simple, porque una crema de urea no necesita intervención técnica.', FALSE, 'Pesar, incorporar y homogeneizar la urea en una base es una intervención técnica.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bpe-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', 'La Resolución 444 de 2008 remite el trámite del certificado BPE al Decreto 549 de 2001. Un servicio prepara hoy su solicitud. ¿Qué norma aplica al trámite?', 25, 'Antes de citar se revisa el estado de la norma. El Decreto 335 de 2022 derogó el Decreto 549 de 2001 y regula hoy la solicitud, la visita, los conceptos, la renovación y la ampliación.', 'Antes de citar se revisa el estado de la norma. El Decreto 335 de 2022 derogó el Decreto 549 de 2001 y regula hoy la solicitud, la visita, los conceptos, la renovación y la ampliación.', $bpe_json${"external_id":"bpe-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_id":"bpe-u1-l2","outcome":"Distinguir una norma vigente de una derogada al citar el trámite del certificado BPE.","source":"Resolución 444 de 2008, artículo 2; Decreto 335 de 2022, artículos 2 y 17."}$bpe_json$::jsonb)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = 'La Resolución 444 de 2008 remite el trámite del certificado BPE al Decreto 549 de 2001. Un servicio prepara hoy su solicitud. ¿Qué norma aplica al trámite?', points = 25, general_feedback = 'Antes de citar se revisa el estado de la norma. El Decreto 335 de 2022 derogó el Decreto 549 de 2001 y regula hoy la solicitud, la visita, los conceptos, la renovación y la ampliación.',
             explanation = 'Antes de citar se revisa el estado de la norma. El Decreto 335 de 2022 derogó el Decreto 549 de 2001 y regula hoy la solicitud, la visita, los conceptos, la renovación y la ampliación.', config = $bpe_json${"external_id":"bpe-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_id":"bpe-u1-l2","outcome":"Distinguir una norma vigente de una derogada al citar el trámite del certificado BPE.","source":"Resolución 444 de 2008, artículo 2; Decreto 335 de 2022, artículos 2 y 17."}$bpe_json$::jsonb, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'El Decreto 549 de 2001, porque la Resolución 444 lo nombra expresamente y una resolución especial prevalece sobre un decreto general posterior.', FALSE, 'Una remisión no revive una norma derogada. Revisa el artículo 17 del Decreto 335 de 2022.', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'Ninguna: sin el Decreto 549 el certificado ya no se tramita.', FALSE, 'El trámite sigue existiendo; cambió la norma que lo regula.', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'El Decreto 335 de 2022, que derogó el Decreto 549; la Resolución 444 sigue como instrumento de verificación.', TRUE, 'Correcto. El Decreto 335 rige el trámite y su artículo 2.3 incluye a quienes elaboran preparaciones magistrales y requieren BPE.', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'El proyecto de circular del Invima de junio de 2026.', FALSE, 'Es un proyecto publicado para comentarios y no regula el trámite del certificado.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bpe-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', 'Un tecnólogo en regencia de farmacia dirige una farmacia-droguería que elabora cremas y lociones y recibe una fórmula completa de un colirio para un paciente identificado. Tres colegas y un auxiliar opinan. Evalúa cuál propuesta está mejor fundamentada.', 25, 'El Manual de la Resolución 1403 (numeral 2.1) limita al tecnólogo a preparaciones no estériles de uso tópico y exige para lo estéril áreas limpias y flujo laminar; el certificado debe cubrir el proceso y la forma (Decreto 335, artículo 9.2).', 'El Manual de la Resolución 1403 (numeral 2.1) limita al tecnólogo a preparaciones no estériles de uso tópico y exige para lo estéril áreas limpias y flujo laminar; el certificado debe cubrir el proceso y la forma (Decreto 335, artículo 9.2).', $bpe_json${"external_id":"bpe-u1-q4","cognitive_level":"Evaluar","difficulty":"media","lesson_id":"bpe-u1-l3","outcome":"Evaluar propuestas de actuación frente a una fórmula que excede la competencia del establecimiento.","source":"Resolución 1403 de 2007, Manual, numeral 2.1; Decreto 2200 de 2005, artículo 11; Decreto 335 de 2022, artículo 9.2."}$bpe_json$::jsonb)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = 'Un tecnólogo en regencia de farmacia dirige una farmacia-droguería que elabora cremas y lociones y recibe una fórmula completa de un colirio para un paciente identificado. Tres colegas y un auxiliar opinan. Evalúa cuál propuesta está mejor fundamentada.', points = 25, general_feedback = 'El Manual de la Resolución 1403 (numeral 2.1) limita al tecnólogo a preparaciones no estériles de uso tópico y exige para lo estéril áreas limpias y flujo laminar; el certificado debe cubrir el proceso y la forma (Decreto 335, artículo 9.2).',
             explanation = 'El Manual de la Resolución 1403 (numeral 2.1) limita al tecnólogo a preparaciones no estériles de uso tópico y exige para lo estéril áreas limpias y flujo laminar; el certificado debe cubrir el proceso y la forma (Decreto 335, artículo 9.2).', config = $bpe_json${"external_id":"bpe-u1-q4","cognitive_level":"Evaluar","difficulty":"media","lesson_id":"bpe-u1-l3","outcome":"Evaluar propuestas de actuación frente a una fórmula que excede la competencia del establecimiento.","source":"Resolución 1403 de 2007, Manual, numeral 2.1; Decreto 2200 de 2005, artículo 11; Decreto 335 de 2022, artículo 9.2."}$bpe_json$::jsonb, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, '«Elabóralo: la fórmula está completa y el paciente está identificado; con eso se cumple la norma».', FALSE, 'La receta es el primer filtro, no el último. Un colirio es una preparación estéril: faltan la competencia, el área y la autorización.', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, '«Elabóralo en el área de cremas después de limpiarla y desinfectarla a fondo, con guantes estériles, tapabocas y material recién lavado; así se controla la contaminación».', FALSE, 'Lo estéril exige áreas limpias con esclusas, aire filtrado y flujo laminar (Manual, numeral 2.1); limpiar el área común no lo reemplaza.', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, '«No lo elabores: remite la fórmula a un servicio con químico farmacéutico, áreas limpias y certificado para esa preparación estéril, y avísale al prescriptor».', TRUE, 'Correcto. Es la propuesta mejor fundamentada: respeta el límite del tecnólogo, las condiciones de lo estéril y el alcance del certificado, y cuida la continuidad del tratamiento.', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, '«Elabóralo si el paciente firma un consentimiento informado, porque así asume el riesgo».', FALSE, 'El consentimiento no suple la competencia del personal ni las condiciones del área; trasladar el riesgo al paciente no es una decisión técnica.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz bpe-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'El establecimiento y el proceso' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (El establecimiento y el proceso). Se salta.';
    RETURN;
  END IF;
  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = 'Evaluación de la Unidad 2 · Área, materias primas y documentos' AND deleted_at IS NULL LIMIT 1;
  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Evaluación de la Unidad 2 · Área, materias primas y documentos', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.')
    RETURNING id INTO v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = 'Evaluación de la Unidad 2 · Área, materias primas y documentos' AND deleted_at IS NULL LIMIT 1;
  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, 'Evaluación de la Unidad 2 · Área, materias primas y documentos', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.', TRUE, 70, 2,
       FALSE, FALSE, TRUE, 'publicado', 2, 10)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', 'Evaluación de la Unidad 2 · Área, materias primas y documentos';
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.', is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 2, weight = 10, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bpe-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', '¿Por qué el agua de botellón no puede reemplazar al agua purificada como componente de una solución oral magistral?', 25, 'Cuando la fórmula lleva agua se usa agua purificada o de mejor calidad, con evidencia. El agua para consumo humano no demuestra cumplir esa monografía.', 'Cuando la fórmula lleva agua se usa agua purificada o de mejor calidad, con evidencia. El agua para consumo humano no demuestra cumplir esa monografía.', $bpe_json${"external_id":"bpe-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_id":"bpe-u2-l2","outcome":"Explicar por qué la calidad del agua depende de su función en la preparación.","source":"USP, preguntas frecuentes del capítulo 795 (39 a 42)."}$bpe_json$::jsonb)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = '¿Por qué el agua de botellón no puede reemplazar al agua purificada como componente de una solución oral magistral?', points = 25, general_feedback = 'Cuando la fórmula lleva agua se usa agua purificada o de mejor calidad, con evidencia. El agua para consumo humano no demuestra cumplir esa monografía.',
             explanation = 'Cuando la fórmula lleva agua se usa agua purificada o de mejor calidad, con evidencia. El agua para consumo humano no demuestra cumplir esa monografía.', config = $bpe_json${"external_id":"bpe-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_id":"bpe-u2-l2","outcome":"Explicar por qué la calidad del agua depende de su función en la preparación.","source":"USP, preguntas frecuentes del capítulo 795 (39 a 42)."}$bpe_json$::jsonb, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'Porque el agua para consumo humano no demuestra cumplir la monografía de agua purificada, que es la calidad mínima cuando la fórmula lleva agua.', TRUE, 'Correcto. La USP exige agua purificada o de mejor calidad cuando la fórmula incluye agua; el agua para consumo no aporta esa evidencia.', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'Porque el agua de botellón siempre está contaminada con microorganismos y no es apta ni siquiera para beber.', FALSE, 'No se trata de que sea mala para beber: es apta para consumo, pero no demuestra la calidad que exige un componente farmacéutico.', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'Porque el Invima prohíbe expresamente el agua de botellón en cualquier establecimiento farmacéutico y sanciona su presencia en el área de elaboración.', FALSE, 'No hay una prohibición así en las normas revisadas; el criterio es técnico: la calidad del agua según su función.', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'Porque cambia el sabor de la preparación.', FALSE, 'El sabor no es el problema central; lo es la evidencia de calidad del agua como componente.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bpe-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', 'Una crema de hidrocortisona al 1 %, 50 g, se elabora con un lote cuya valoración es 99,2 %. ¿Qué debe quedar en el registro?', 25, 'Cantidad a pesar = cantidad requerida ÷ valoración. El registro debe permitir reconstruir el cálculo: valoración del certificado, lote, equipo, cantidad pesada y verificación.', 'Cantidad a pesar = cantidad requerida ÷ valoración. El registro debe permitir reconstruir el cálculo: valoración del certificado, lote, equipo, cantidad pesada y verificación.', $bpe_json${"external_id":"bpe-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_id":"bpe-u2-l3","outcome":"Diligenciar el registro de elaboración con cálculos corregidos por pureza.","source":"Resolución 1403 de 2007, Manual, numeral 2.6; Resolución 444 de 2008, ítem 17.3.6."}$bpe_json$::jsonb)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = 'Una crema de hidrocortisona al 1 %, 50 g, se elabora con un lote cuya valoración es 99,2 %. ¿Qué debe quedar en el registro?', points = 25, general_feedback = 'Cantidad a pesar = cantidad requerida ÷ valoración. El registro debe permitir reconstruir el cálculo: valoración del certificado, lote, equipo, cantidad pesada y verificación.',
             explanation = 'Cantidad a pesar = cantidad requerida ÷ valoración. El registro debe permitir reconstruir el cálculo: valoración del certificado, lote, equipo, cantidad pesada y verificación.', config = $bpe_json${"external_id":"bpe-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_id":"bpe-u2-l3","outcome":"Diligenciar el registro de elaboración con cálculos corregidos por pureza.","source":"Resolución 1403 de 2007, Manual, numeral 2.6; Resolución 444 de 2008, ítem 17.3.6."}$bpe_json$::jsonb, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, '0,500 g pesados, porque la fórmula pide 1 % de 50 g.', FALSE, 'Así solo se aportan 0,496 g de hidrocortisona. Falta la corrección por valoración.', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, '0,504 g pesados (0,500 ÷ 0,992), con la valoración usada, el lote, la balanza y quién verificó el cálculo.', TRUE, 'Correcto. El registro documenta el cálculo, el dato de origen y la verificación.', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, '0,496 g pesados, porque la pureza es menor al 100 %.', FALSE, 'El ajuste va en el sentido contrario: hay que pesar más polvo, no menos.', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'Solo la cantidad final de crema obtenida, porque el cálculo de cada componente ya está escrito en la guía de elaboración aprobada.', FALSE, 'La guía dice cómo se calcula; el registro, qué se pesó en esta preparación y con qué lote.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bpe-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', 'El termómetro de máxima y mínima de la nevera marca 11 °C como máxima del fin de semana. Dentro hay una suspensión acuosa sin conservante, pendiente de entrega, cuya fecha límite se asignó suponiendo refrigeración. ¿Qué decisión es la más defendible?', 25, 'Cada producto se evalúa según la condición de conservación que sostiene su fecha límite. Para una preparación acuosa sin conservante, la tabla de la USP supone refrigeración; la excursión rompe esa condición.', 'Cada producto se evalúa según la condición de conservación que sostiene su fecha límite. Para una preparación acuosa sin conservante, la tabla de la USP supone refrigeración; la excursión rompe esa condición.', $bpe_json${"external_id":"bpe-u2-q3","cognitive_level":"Analizar","difficulty":"alta","lesson_id":"bpe-u2-l1","outcome":"Responder a una desviación de temperatura con una evaluación de impacto por producto.","source":"USP, capítulo 795, Tabla 4; Resolución 444 de 2008, ítem 17.3.1.4."}$bpe_json$::jsonb)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = 'El termómetro de máxima y mínima de la nevera marca 11 °C como máxima del fin de semana. Dentro hay una suspensión acuosa sin conservante, pendiente de entrega, cuya fecha límite se asignó suponiendo refrigeración. ¿Qué decisión es la más defendible?', points = 25, general_feedback = 'Cada producto se evalúa según la condición de conservación que sostiene su fecha límite. Para una preparación acuosa sin conservante, la tabla de la USP supone refrigeración; la excursión rompe esa condición.',
             explanation = 'Cada producto se evalúa según la condición de conservación que sostiene su fecha límite. Para una preparación acuosa sin conservante, la tabla de la USP supone refrigeración; la excursión rompe esa condición.', config = $bpe_json${"external_id":"bpe-u2-q3","cognitive_level":"Analizar","difficulty":"alta","lesson_id":"bpe-u2-l1","outcome":"Responder a una desviación de temperatura con una evaluación de impacto por producto.","source":"USP, capítulo 795, Tabla 4; Resolución 444 de 2008, ítem 17.3.1.4."}$bpe_json$::jsonb, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'Entregarla, porque 11 °C está por debajo de la temperatura ambiente.', FALSE, 'La fecha límite de esta preparación depende de la refrigeración (2–8 °C); no hay datos que respalden la excursión.', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'Entregarla con la recomendación de guardarla en la nevera en casa.', FALSE, 'La recomendación no corrige lo que ya ocurrió durante la excursión.', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'No entregarla, elaborarla de nuevo y documentar la desviación con su causa y la acción correctiva.', TRUE, 'Correcto. Sin datos de estabilidad para esa condición, la decisión prudente es no entregarla; la desviación se registra y se investiga.', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'Acortar su fecha límite de uso a la mitad para compensar la excursión, anotarlo en la etiqueta y entregarla con una explicación a la familia.', FALSE, 'Acortar la fecha sin datos es una suposición, no una evaluación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bpe-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', 'En una autoinspección se encuentra que la calibración de la balanza venció hace dos meses y que en ese tiempo se pesaron 40 preparaciones. Tres colegas y un auxiliar proponen qué hacer. Evalúa cuál propuesta está mejor fundamentada.', 25, 'Una calibración vencida no prueba que las pesadas fueran malas ni buenas. El resultado «como se encontró» permite decidir con evidencia si hay que evaluar o recuperar preparaciones.', 'Una calibración vencida no prueba que las pesadas fueran malas ni buenas. El resultado «como se encontró» permite decidir con evidencia si hay que evaluar o recuperar preparaciones.', $bpe_json${"external_id":"bpe-u2-q4","cognitive_level":"Evaluar","difficulty":"media","lesson_id":"bpe-u2-l1","outcome":"Evaluar propuestas frente a una calibración vencida de un equipo crítico.","source":"Resolución 444 de 2008, ítems 7.2.5, 7.2.9 y 17.2.4."}$bpe_json$::jsonb)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = 'En una autoinspección se encuentra que la calibración de la balanza venció hace dos meses y que en ese tiempo se pesaron 40 preparaciones. Tres colegas y un auxiliar proponen qué hacer. Evalúa cuál propuesta está mejor fundamentada.', points = 25, general_feedback = 'Una calibración vencida no prueba que las pesadas fueran malas ni buenas. El resultado «como se encontró» permite decidir con evidencia si hay que evaluar o recuperar preparaciones.',
             explanation = 'Una calibración vencida no prueba que las pesadas fueran malas ni buenas. El resultado «como se encontró» permite decidir con evidencia si hay que evaluar o recuperar preparaciones.', config = $bpe_json${"external_id":"bpe-u2-q4","cognitive_level":"Evaluar","difficulty":"media","lesson_id":"bpe-u2-l1","outcome":"Evaluar propuestas frente a una calibración vencida de un equipo crítico.","source":"Resolución 444 de 2008, ítems 7.2.5, 7.2.9 y 17.2.4."}$bpe_json$::jsonb, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, '«Sigue usándola: una balanza no se descalibra sola en dos meses y las preparaciones salieron bien».', FALSE, 'Puede que no se haya descalibrado, pero no hay evidencia de ello. La calibración vencida es un hallazgo crítico (17.2.4).', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, '«Retírala, calíbrala pidiendo el resultado “como se encontró” y, según ese resultado, evalúa las preparaciones pesadas desde la última verificación conforme».', TRUE, 'Correcto. Es la propuesta mejor fundamentada: decide con evidencia si hubo impacto y documenta la desviación.', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, '«Recupera de inmediato las 40 preparaciones entregadas, destrúyelas sin más análisis y notifica por precaución a todos los pacientes que su tratamiento pudo estar mal dosificado».', FALSE, 'Puede ser desproporcionado y alarmante sin datos: primero se determina si la balanza estaba fuera de tolerancia.', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, '«Actualiza la etiqueta de calibración con la fecha de hoy y sigue trabajando».', FALSE, 'Eso falsea un registro. La vigencia la da una calibración real, documentada en su certificado.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz bpe-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Calidad y seguridad del paciente' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Calidad y seguridad del paciente). Se salta.';
    RETURN;
  END IF;
  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = 'Evaluación de la Unidad 3 · Controles, fecha límite y farmacovigilancia' AND deleted_at IS NULL LIMIT 1;
  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Evaluación de la Unidad 3 · Controles, fecha límite y farmacovigilancia', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.')
    RETURNING id INTO v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = 'Evaluación de la Unidad 3 · Controles, fecha límite y farmacovigilancia' AND deleted_at IS NULL LIMIT 1;
  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, 'Evaluación de la Unidad 3 · Controles, fecha límite y farmacovigilancia', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.', TRUE, 70, 2,
       FALSE, FALSE, TRUE, 'publicado', 3, 10)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', 'Evaluación de la Unidad 3 · Controles, fecha límite y farmacovigilancia';
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.', is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 3, weight = 10, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bpe-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', '¿Qué diferencia la fecha límite de uso de una preparación magistral de la fecha de vencimiento de un medicamento industrial?', 25, 'El fabricante asigna el vencimiento de su producto con estudios propios; quien elabora asigna la fecha límite de uso de la preparación, contada desde el inicio de la elaboración.', 'El fabricante asigna el vencimiento de su producto con estudios propios; quien elabora asigna la fecha límite de uso de la preparación, contada desde el inicio de la elaboración.', $bpe_json${"external_id":"bpe-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_id":"bpe-u3-l2","outcome":"Diferenciar la fecha límite de uso de la fecha de vencimiento.","source":"USP, preguntas frecuentes del capítulo 795 (57); Resolución 1403 de 2007 (definición de estabilidad)."}$bpe_json$::jsonb)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = '¿Qué diferencia la fecha límite de uso de una preparación magistral de la fecha de vencimiento de un medicamento industrial?', points = 25, general_feedback = 'El fabricante asigna el vencimiento de su producto con estudios propios; quien elabora asigna la fecha límite de uso de la preparación, contada desde el inicio de la elaboración.',
             explanation = 'El fabricante asigna el vencimiento de su producto con estudios propios; quien elabora asigna la fecha límite de uso de la preparación, contada desde el inicio de la elaboración.', config = $bpe_json${"external_id":"bpe-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_id":"bpe-u3-l2","outcome":"Diferenciar la fecha límite de uso de la fecha de vencimiento.","source":"USP, preguntas frecuentes del capítulo 795 (57); Resolución 1403 de 2007 (definición de estabilidad)."}$bpe_json$::jsonb, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'La fecha límite de uso la asigna quien elabora y se cuenta desde el inicio de la elaboración; el vencimiento lo asigna el fabricante con estudios de su producto en su envase.', TRUE, 'Correcto. La manipulación crea un producto nuevo; por eso quien elabora asigna su propia fecha límite.', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'Son lo mismo con otro nombre: ambas las asigna el fabricante del principio activo y se copian en la etiqueta.', FALSE, 'No son lo mismo: el estudio del fabricante no dice nada sobre la preparación nueva.', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'La fecha límite de uso es siempre de seis meses para cualquier preparación, mientras que el vencimiento depende de cada medicamento industrial y de su registro sanitario ante el Invima.', FALSE, 'No hay un plazo único: depende del tipo de preparación (Tabla 4) o de datos de estabilidad aplicables.', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'La fecha límite de uso solo aplica a preparaciones estériles.', FALSE, 'También aplica a las no estériles; el capítulo 795 la define para ellas.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bpe-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', 'Una suspensión oral acuosa sin conservante, sin monografía ni estudio propio, se empezó a elaborar el 3 de noviembre de 2026. ¿Qué debe decir la etiqueta?', 25, 'La Tabla 4 asigna 14 días en refrigerador a las preparaciones acuosas sin conservante. La fecha se cuenta desde el inicio de la elaboración y se escribe como fecha calendario.', 'La Tabla 4 asigna 14 días en refrigerador a las preparaciones acuosas sin conservante. La fecha se cuenta desde el inicio de la elaboración y se escribe como fecha calendario.', $bpe_json${"external_id":"bpe-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_id":"bpe-u3-l2","outcome":"Asignar la fecha límite de uso con la Tabla 4 del capítulo 795.","source":"USP, capítulo 795, Tabla 4; preguntas frecuentes (57)."}$bpe_json$::jsonb)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = 'Una suspensión oral acuosa sin conservante, sin monografía ni estudio propio, se empezó a elaborar el 3 de noviembre de 2026. ¿Qué debe decir la etiqueta?', points = 25, general_feedback = 'La Tabla 4 asigna 14 días en refrigerador a las preparaciones acuosas sin conservante. La fecha se cuenta desde el inicio de la elaboración y se escribe como fecha calendario.',
             explanation = 'La Tabla 4 asigna 14 días en refrigerador a las preparaciones acuosas sin conservante. La fecha se cuenta desde el inicio de la elaboración y se escribe como fecha calendario.', config = $bpe_json${"external_id":"bpe-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_id":"bpe-u3-l2","outcome":"Asignar la fecha límite de uso con la Tabla 4 del capítulo 795.","source":"USP, capítulo 795, Tabla 4; preguntas frecuentes (57)."}$bpe_json$::jsonb, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, '«Vence: 6 meses».', FALSE, 'Es una duración sin sustento y no es una fecha.', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'La fecha de vencimiento de las tabletas comerciales usadas como fuente, porque el principio activo es el mismo.', FALSE, 'La manipulación creó un producto nuevo; el vencimiento del fabricante no aplica.', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, '«Usar antes del 17/11/2026; conservar entre 2 y 8 °C».', TRUE, 'Correcto. Acuosa sin conservante: 14 días en refrigerador, contados desde el inicio de la elaboración.', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, '«Usar antes del 08/12/2026» a temperatura ambiente.', FALSE, '35 días corresponden a preparaciones acuosas con conservante.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bpe-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', 'Un niño es hospitalizado por una sobredosificación atribuida a un error de concentración en una suspensión magistral elaborada por el servicio farmacéutico de una clínica. ¿Cuál es la respuesta correcta?', 25, 'Hospitalización = evento serio (ICH E2A). Para el servicio farmacéutico de una IPS, el Manual de la Resolución 1403 exige reportar los serios dentro de las 72 horas (numeral 5.4), además de contener e investigar. Si la hubiera elaborado un establecimiento independiente con certificado de BPE, también la reportaría por eReporting Industria dentro de los 15 días calendario (Resolución 2024015321 de 2024, artículo 16).', 'Hospitalización = evento serio (ICH E2A). Para el servicio farmacéutico de una IPS, el Manual de la Resolución 1403 exige reportar los serios dentro de las 72 horas (numeral 5.4), además de contener e investigar. Si la hubiera elaborado un establecimiento independiente con certificado de BPE, también la reportaría por eReporting Industria dentro de los 15 días calendario (Resolución 2024015321 de 2024, artículo 16).', $bpe_json${"external_id":"bpe-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_id":"bpe-u3-l3","outcome":"Decidir si un evento es serio y en qué plazo se reporta.","source":"Resolución 1403 de 2007, Manual, numeral 5.4; ICH E2A; Resolución 2024015321 de 2024 del Invima, artículo 16."}$bpe_json$::jsonb)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = 'Un niño es hospitalizado por una sobredosificación atribuida a un error de concentración en una suspensión magistral elaborada por el servicio farmacéutico de una clínica. ¿Cuál es la respuesta correcta?', points = 25, general_feedback = 'Hospitalización = evento serio (ICH E2A). Para el servicio farmacéutico de una IPS, el Manual de la Resolución 1403 exige reportar los serios dentro de las 72 horas (numeral 5.4), además de contener e investigar. Si la hubiera elaborado un establecimiento independiente con certificado de BPE, también la reportaría por eReporting Industria dentro de los 15 días calendario (Resolución 2024015321 de 2024, artículo 16).',
             explanation = 'Hospitalización = evento serio (ICH E2A). Para el servicio farmacéutico de una IPS, el Manual de la Resolución 1403 exige reportar los serios dentro de las 72 horas (numeral 5.4), además de contener e investigar. Si la hubiera elaborado un establecimiento independiente con certificado de BPE, también la reportaría por eReporting Industria dentro de los 15 días calendario (Resolución 2024015321 de 2024, artículo 16).', config = $bpe_json${"external_id":"bpe-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_id":"bpe-u3-l3","outcome":"Decidir si un evento es serio y en qué plazo se reporta.","source":"Resolución 1403 de 2007, Manual, numeral 5.4; ICH E2A; Resolución 2024015321 de 2024 del Invima, artículo 16."}$bpe_json$::jsonb, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'Es serio por la hospitalización: se reporta al Invima y a la entidad territorial dentro de las 72 horas, se contiene el lote interno y se investiga.', TRUE, 'Correcto. La hospitalización es un criterio de gravedad y el Manual fija 72 horas para los eventos serios.', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'Se reporta en los cinco días siguientes al cierre del mes, porque en el servicio farmacéutico todos los eventos se consolidan en el reporte mensual que se envía al Invima.', FALSE, 'Ese es el plazo para eventos no serios; los serios se reportan dentro de las 72 horas (numeral 5.4).', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'No se reporta, porque fue un error de elaboración y no una reacción del medicamento.', FALSE, 'Los errores de medicación también son objeto de farmacovigilancia (PRUM) y aquí hubo daño serio.', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, 'Se reporta solo si el evento era inesperado.', FALSE, 'Inesperado y serio son ejes distintos; la gravedad define el plazo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bpe-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', 'Un laboratorio externo informa que un lote interno de cápsulas tiene 86 % del contenido declarado y no existe monografía oficial de la preparación. Tres colegas y un auxiliar proponen qué hacer. Evalúa cuál propuesta está mejor fundamentada.', 25, 'Sin monografía, la USP acepta 90–110 % de lo declarado. Fuera de ese intervalo se contiene, se avisa, se investiga con el registro y se corrige la causa.', 'Sin monografía, la USP acepta 90–110 % de lo declarado. Fuera de ese intervalo se contiene, se avisa, se investiga con el registro y se corrige la causa.', $bpe_json${"external_id":"bpe-u3-q4","cognitive_level":"Evaluar","difficulty":"media","lesson_id":"bpe-u3-l1","outcome":"Evaluar propuestas frente a un resultado fuera de especificación.","source":"USP, preguntas frecuentes del capítulo 795 (19); Resolución 1403 de 2007, Manual, numeral 2.6."}$bpe_json$::jsonb)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = 'Un laboratorio externo informa que un lote interno de cápsulas tiene 86 % del contenido declarado y no existe monografía oficial de la preparación. Tres colegas y un auxiliar proponen qué hacer. Evalúa cuál propuesta está mejor fundamentada.', points = 25, general_feedback = 'Sin monografía, la USP acepta 90–110 % de lo declarado. Fuera de ese intervalo se contiene, se avisa, se investiga con el registro y se corrige la causa.',
             explanation = 'Sin monografía, la USP acepta 90–110 % de lo declarado. Fuera de ese intervalo se contiene, se avisa, se investiga con el registro y se corrige la causa.', config = $bpe_json${"external_id":"bpe-u3-q4","cognitive_level":"Evaluar","difficulty":"media","lesson_id":"bpe-u3-l1","outcome":"Evaluar propuestas frente a un resultado fuera de especificación.","source":"USP, preguntas frecuentes del capítulo 795 (19); Resolución 1403 de 2007, Manual, numeral 2.6."}$bpe_json$::jsonb, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, '«Acéptalo: las cápsulas se veían conformes en la inspección final y el resultado puede ser un error del laboratorio».', FALSE, 'La inspección visual no detecta la cantidad de principio activo; suponer un error analítico sin evidencia no es una evaluación.', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, '«Contén el lote, informa al prescriptor sobre los pacientes que lo recibieron, investiga la causa con el registro y corrige el proceso».', TRUE, 'Correcto. 86 % está fuera de 90–110 %: se protege al paciente, se contiene y se investiga.', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, '«Repite el análisis en otro laboratorio y, si el segundo resultado queda dentro de especificación, acepta el lote y archiva el primero como un error analítico».', FALSE, 'Repetir hasta «pasar» oculta el problema. Un resultado fuera de especificación se investiga.', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, '«Cambia la etiqueta para declarar 86 % y entrega lo que queda».', FALSE, 'La prescripción pide una dosis; cambiar la etiqueta no corrige la preparación ni el riesgo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad bpe-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Qué es una preparación magistral' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Qué es una preparación magistral). Se salta.';
    RETURN;
  END IF;
  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = 'Actividad 1 · Dictamen de admisión de cinco solicitudes' AND deleted_at IS NULL LIMIT 1;
  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
       extension_hint, support_html, teacher_guide_html, rubric, grading_method, allow_text, allow_link,
       allow_file, accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, 'Actividad 1 · Dictamen de admisión de cinco solicitudes', $bpe_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lee el caso completo y marca los datos de cada una de las cinco solicitudes.</li><li>Aplica a cada solicitud la ruta de decisión de la clase 1 y anota el elemento que decide el caso.</li><li>Busca en el normograma del Invima el artículo o numeral que sustenta cada decisión y anota la cita completa.</li><li>Completa una tabla con cinco columnas: solicitud, elemento decisivo, norma, decisión y quién elabora.</li><li>Redacta las dos respuestas escritas con las cuatro partes del Ejemplo resuelto 2 de la clase 3.</li><li>Enumera los registros que archivarías para la solicitud 1.</li><li>Revisa tu dictamen con la rúbrica, declara el uso de IA si lo hubo y súbelo al aula en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Clasificar cada solicitud con la prueba de los tres elementos.</li><li>Fundamentar cada decisión en la norma vigente, con artículo o numeral.</li><li>Comunicar por escrito una negativa o una remisión con alternativa.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 3 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 12 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar herramientas de IA para organizar ideas o revisar la redacción, y debes declararlo al final del dictamen. No se aceptan como fuente normativa: cada cita debe verificarse en el normograma. El análisis y las decisiones deben ser tuyos.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 12 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Clasificación de las solicitudes</td><td>25 %</td><td>Clasifica las cinco correctamente e identifica el elemento decisivo en cada una.</td><td>Clasifica cuatro correctamente con justificación suficiente.</td><td>Clasifica tres o justifica de forma general.</td><td>Clasifica dos o confunde figuras.</td><td>No clasifica o la clasificación no corresponde al caso.</td></tr>
  <tr><td>Fundamento normativo</td><td>25 %</td><td>Cita norma y artículo o numeral correctos en todas las decisiones y distingue proyecto de norma vigente.</td><td>Cita correctamente la mayoría con errores menores.</td><td>Cita normas pertinentes sin artículo o con imprecisiones.</td><td>Cita normas que no corresponden o cita el proyecto como vigente.</td><td>No cita normas.</td></tr>
  <tr><td>Decisión, competencia y alternativa</td><td>25 %</td><td>Decide con coherencia, asigna la elaboración a quien corresponde y ofrece alternativas reales.</td><td>Decide con coherencia y asigna la elaboración; alguna alternativa es débil.</td><td>Las decisiones son correctas pero sin alternativas o con errores de competencia.</td><td>Decisiones incoherentes con el análisis.</td><td>No hay decisiones.</td></tr>
  <tr><td>Comunicación profesional</td><td>15 %</td><td>Respuestas claras, respetuosas, con las cuatro partes y dentro del límite de palabras.</td><td>Respuestas claras con una parte débil.</td><td>Respuestas comprensibles pero incompletas o largas.</td><td>Respuestas confusas o con tono inadecuado.</td><td>No hay respuestas.</td></tr>
  <tr><td>Trazabilidad y fuentes</td><td>10 %</td><td>Lista completa de registros para la solicitud 1 y referencias verificables con fecha de consulta.</td><td>Lista suficiente y referencias con errores menores.</td><td>Lista incompleta o referencias imprecisas.</td><td>Lista mínima o sin referencias.</td><td>No hay lista ni referencias.</td></tr>
  </tbody>
</table>
</details>$bpe_html$, $bpe_html$<h2>Caso de estudio</h2>
<p>Farmacia San Rafael es una farmacia-droguería ficticia de Manizales. La dirige una química farmacéutica y trabaja con un tecnólogo en regencia de farmacia; tiene área especial para preparaciones no estériles y no tiene áreas limpias. En una semana recibe cinco solicitudes: (1) omeprazol 2 mg/mL en suspensión oral, 100 mL, para una lactante de 8 kg, prescripción completa con justificación; (2) «crema triple despigmentante, 30 g», sin componentes ni concentraciones; (3) un spa pide 40 frascos con su marca de una loción de ketoconazol, desonida y triclosán, sin prescripción, «para la cabina»; (4) una clínica le propone por contrato reempacar en dosis unitarias tabletas comerciales para sus pacientes hospitalizados; (5) colirio de ciclosporina al 0,05 % para un paciente identificado.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$bpe_html$, $bpe_json$["Clasifica cada solicitud con la prueba de los tres elementos y explica qué elemento decide el caso.","Cita para cada decisión la norma y el artículo o numeral que la sustenta.","Decide para cada una si se acepta, se acepta con una condición, se remite o se rechaza.","Indica quién puede elaborar las solicitudes aceptadas en esta farmacia y por qué.","Redacta las respuestas escritas para dos solicitudes que no se atienden (máximo 120 palabras cada una).","Enumera los registros que archivarías para demostrar la decisión sobre la solicitud 1."]$bpe_json$::jsonb, 'Dictamen técnico con una tabla de clasificación de las cinco solicitudes, las dos respuestas escritas y la lista de registros.',
       '3 a 4 páginas (900 a 1.300 palabras), en PDF o DOCX', $bpe_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. Usa la ruta de decisión y el semáforo de las clases 1 y 3. No se requieren documentos reales de empresas ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 2200 de 2005 (modificado por el Decreto 2330 de 2006), Resolución 1403 de 2007 y su Manual, Resolución 444 de 2008 y Decreto 335 de 2022, en el normograma del Invima. Cita en APA 7 o en el formato «norma, artículo o numeral». El proyecto de circular de 2026, si lo usas, se cita como proyecto.</p>$bpe_html$, NULL, $bpe_json${"version":1,"total":100,"criteria":[{"id":"clasificacion-de-las-solicitudes","name":"Clasificación de las solicitudes","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Clasifica las cinco correctamente e identifica el elemento decisivo en cada una."},{"level":3,"label":"Logrado","description":"Clasifica cuatro correctamente con justificación suficiente."},{"level":2,"label":"En desarrollo","description":"Clasifica tres o justifica de forma general."},{"level":1,"label":"Inicial","description":"Clasifica dos o confunde figuras."},{"level":0,"label":"Sin evidencia","description":"No clasifica o la clasificación no corresponde al caso."}]},{"id":"fundamento-normativo","name":"Fundamento normativo","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cita norma y artículo o numeral correctos en todas las decisiones y distingue proyecto de norma vigente."},{"level":3,"label":"Logrado","description":"Cita correctamente la mayoría con errores menores."},{"level":2,"label":"En desarrollo","description":"Cita normas pertinentes sin artículo o con imprecisiones."},{"level":1,"label":"Inicial","description":"Cita normas que no corresponden o cita el proyecto como vigente."},{"level":0,"label":"Sin evidencia","description":"No cita normas."}]},{"id":"decision-competencia-y-alternativa","name":"Decisión, competencia y alternativa","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Decide con coherencia, asigna la elaboración a quien corresponde y ofrece alternativas reales."},{"level":3,"label":"Logrado","description":"Decide con coherencia y asigna la elaboración; alguna alternativa es débil."},{"level":2,"label":"En desarrollo","description":"Las decisiones son correctas pero sin alternativas o con errores de competencia."},{"level":1,"label":"Inicial","description":"Decisiones incoherentes con el análisis."},{"level":0,"label":"Sin evidencia","description":"No hay decisiones."}]},{"id":"comunicacion-profesional","name":"Comunicación profesional","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Respuestas claras, respetuosas, con las cuatro partes y dentro del límite de palabras."},{"level":3,"label":"Logrado","description":"Respuestas claras con una parte débil."},{"level":2,"label":"En desarrollo","description":"Respuestas comprensibles pero incompletas o largas."},{"level":1,"label":"Inicial","description":"Respuestas confusas o con tono inadecuado."},{"level":0,"label":"Sin evidencia","description":"No hay respuestas."}]},{"id":"trazabilidad-y-fuentes","name":"Trazabilidad y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Lista completa de registros para la solicitud 1 y referencias verificables con fecha de consulta."},{"level":3,"label":"Logrado","description":"Lista suficiente y referencias con errores menores."},{"level":2,"label":"En desarrollo","description":"Lista incompleta o referencias imprecisas."},{"level":1,"label":"Inicial","description":"Lista mínima o sin referencias."},{"level":0,"label":"Sin evidencia","description":"No hay lista ni referencias."}]}]}$bpe_json$::jsonb, 'rubrica', TRUE, TRUE,
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 1, 12)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET status = 'publicado', module_id = v_unidad, instructions_html = $bpe_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lee el caso completo y marca los datos de cada una de las cinco solicitudes.</li><li>Aplica a cada solicitud la ruta de decisión de la clase 1 y anota el elemento que decide el caso.</li><li>Busca en el normograma del Invima el artículo o numeral que sustenta cada decisión y anota la cita completa.</li><li>Completa una tabla con cinco columnas: solicitud, elemento decisivo, norma, decisión y quién elabora.</li><li>Redacta las dos respuestas escritas con las cuatro partes del Ejemplo resuelto 2 de la clase 3.</li><li>Enumera los registros que archivarías para la solicitud 1.</li><li>Revisa tu dictamen con la rúbrica, declara el uso de IA si lo hubo y súbelo al aula en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Clasificar cada solicitud con la prueba de los tres elementos.</li><li>Fundamentar cada decisión en la norma vigente, con artículo o numeral.</li><li>Comunicar por escrito una negativa o una remisión con alternativa.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 3 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 12 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar herramientas de IA para organizar ideas o revisar la redacción, y debes declararlo al final del dictamen. No se aceptan como fuente normativa: cada cita debe verificarse en el normograma. El análisis y las decisiones deben ser tuyos.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 12 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Clasificación de las solicitudes</td><td>25 %</td><td>Clasifica las cinco correctamente e identifica el elemento decisivo en cada una.</td><td>Clasifica cuatro correctamente con justificación suficiente.</td><td>Clasifica tres o justifica de forma general.</td><td>Clasifica dos o confunde figuras.</td><td>No clasifica o la clasificación no corresponde al caso.</td></tr>
  <tr><td>Fundamento normativo</td><td>25 %</td><td>Cita norma y artículo o numeral correctos en todas las decisiones y distingue proyecto de norma vigente.</td><td>Cita correctamente la mayoría con errores menores.</td><td>Cita normas pertinentes sin artículo o con imprecisiones.</td><td>Cita normas que no corresponden o cita el proyecto como vigente.</td><td>No cita normas.</td></tr>
  <tr><td>Decisión, competencia y alternativa</td><td>25 %</td><td>Decide con coherencia, asigna la elaboración a quien corresponde y ofrece alternativas reales.</td><td>Decide con coherencia y asigna la elaboración; alguna alternativa es débil.</td><td>Las decisiones son correctas pero sin alternativas o con errores de competencia.</td><td>Decisiones incoherentes con el análisis.</td><td>No hay decisiones.</td></tr>
  <tr><td>Comunicación profesional</td><td>15 %</td><td>Respuestas claras, respetuosas, con las cuatro partes y dentro del límite de palabras.</td><td>Respuestas claras con una parte débil.</td><td>Respuestas comprensibles pero incompletas o largas.</td><td>Respuestas confusas o con tono inadecuado.</td><td>No hay respuestas.</td></tr>
  <tr><td>Trazabilidad y fuentes</td><td>10 %</td><td>Lista completa de registros para la solicitud 1 y referencias verificables con fecha de consulta.</td><td>Lista suficiente y referencias con errores menores.</td><td>Lista incompleta o referencias imprecisas.</td><td>Lista mínima o sin referencias.</td><td>No hay lista ni referencias.</td></tr>
  </tbody>
</table>
</details>$bpe_html$, case_html = $bpe_html$<h2>Caso de estudio</h2>
<p>Farmacia San Rafael es una farmacia-droguería ficticia de Manizales. La dirige una química farmacéutica y trabaja con un tecnólogo en regencia de farmacia; tiene área especial para preparaciones no estériles y no tiene áreas limpias. En una semana recibe cinco solicitudes: (1) omeprazol 2 mg/mL en suspensión oral, 100 mL, para una lactante de 8 kg, prescripción completa con justificación; (2) «crema triple despigmentante, 30 g», sin componentes ni concentraciones; (3) un spa pide 40 frascos con su marca de una loción de ketoconazol, desonida y triclosán, sin prescripción, «para la cabina»; (4) una clínica le propone por contrato reempacar en dosis unitarias tabletas comerciales para sus pacientes hospitalizados; (5) colirio de ciclosporina al 0,05 % para un paciente identificado.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$bpe_html$,
           points_to_solve = $bpe_json$["Clasifica cada solicitud con la prueba de los tres elementos y explica qué elemento decide el caso.","Cita para cada decisión la norma y el artículo o numeral que la sustenta.","Decide para cada una si se acepta, se acepta con una condición, se remite o se rechaza.","Indica quién puede elaborar las solicitudes aceptadas en esta farmacia y por qué.","Redacta las respuestas escritas para dos solicitudes que no se atienden (máximo 120 palabras cada una).","Enumera los registros que archivarías para demostrar la decisión sobre la solicitud 1."]$bpe_json$::jsonb, expected_product = 'Dictamen técnico con una tabla de clasificación de las cinco solicitudes, las dos respuestas escritas y la lista de registros.', extension_hint = '3 a 4 páginas (900 a 1.300 palabras), en PDF o DOCX',
           support_html = $bpe_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. Usa la ruta de decisión y el semáforo de las clases 1 y 3. No se requieren documentos reales de empresas ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 2200 de 2005 (modificado por el Decreto 2330 de 2006), Resolución 1403 de 2007 y su Manual, Resolución 444 de 2008 y Decreto 335 de 2022, en el normograma del Invima. Cita en APA 7 o en el formato «norma, artículo o numeral». El proyecto de circular de 2026, si lo usas, se cita como proyecto.</p>$bpe_html$, teacher_guide_html = teacher_guide_html, sort_order = 1, updated_at = NOW()
     WHERE id = v_act;
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', 'Actividad 1 · Dictamen de admisión de cinco solicitudes';
    ELSE
      UPDATE aula_activities
         SET rubric = $bpe_json${"version":1,"total":100,"criteria":[{"id":"clasificacion-de-las-solicitudes","name":"Clasificación de las solicitudes","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Clasifica las cinco correctamente e identifica el elemento decisivo en cada una."},{"level":3,"label":"Logrado","description":"Clasifica cuatro correctamente con justificación suficiente."},{"level":2,"label":"En desarrollo","description":"Clasifica tres o justifica de forma general."},{"level":1,"label":"Inicial","description":"Clasifica dos o confunde figuras."},{"level":0,"label":"Sin evidencia","description":"No clasifica o la clasificación no corresponde al caso."}]},{"id":"fundamento-normativo","name":"Fundamento normativo","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cita norma y artículo o numeral correctos en todas las decisiones y distingue proyecto de norma vigente."},{"level":3,"label":"Logrado","description":"Cita correctamente la mayoría con errores menores."},{"level":2,"label":"En desarrollo","description":"Cita normas pertinentes sin artículo o con imprecisiones."},{"level":1,"label":"Inicial","description":"Cita normas que no corresponden o cita el proyecto como vigente."},{"level":0,"label":"Sin evidencia","description":"No cita normas."}]},{"id":"decision-competencia-y-alternativa","name":"Decisión, competencia y alternativa","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Decide con coherencia, asigna la elaboración a quien corresponde y ofrece alternativas reales."},{"level":3,"label":"Logrado","description":"Decide con coherencia y asigna la elaboración; alguna alternativa es débil."},{"level":2,"label":"En desarrollo","description":"Las decisiones son correctas pero sin alternativas o con errores de competencia."},{"level":1,"label":"Inicial","description":"Decisiones incoherentes con el análisis."},{"level":0,"label":"Sin evidencia","description":"No hay decisiones."}]},{"id":"comunicacion-profesional","name":"Comunicación profesional","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Respuestas claras, respetuosas, con las cuatro partes y dentro del límite de palabras."},{"level":3,"label":"Logrado","description":"Respuestas claras con una parte débil."},{"level":2,"label":"En desarrollo","description":"Respuestas comprensibles pero incompletas o largas."},{"level":1,"label":"Inicial","description":"Respuestas confusas o con tono inadecuado."},{"level":0,"label":"Sin evidencia","description":"No hay respuestas."}]},{"id":"trazabilidad-y-fuentes","name":"Trazabilidad y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Lista completa de registros para la solicitud 1 y referencias verificables con fecha de consulta."},{"level":3,"label":"Logrado","description":"Lista suficiente y referencias con errores menores."},{"level":2,"label":"En desarrollo","description":"Lista incompleta o referencias imprecisas."},{"level":1,"label":"Inicial","description":"Lista mínima o sin referencias."},{"level":0,"label":"Sin evidencia","description":"No hay lista ni referencias."}]}]}$bpe_json$::jsonb, grading_method = 'rubrica', weight = 12,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Actividad bpe-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'El establecimiento y el proceso' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (El establecimiento y el proceso). Se salta.';
    RETURN;
  END IF;
  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = 'Actividad 2 · Guía, registro y etiqueta de una preparación' AND deleted_at IS NULL LIMIT 1;
  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
       extension_hint, support_html, teacher_guide_html, rubric, grading_method, allow_text, allow_link,
       allow_file, accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, 'Actividad 2 · Guía, registro y etiqueta de una preparación', $bpe_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar y crear.</p>
<ol><li>Lee la prescripción y los datos simulados de los insumos.</li><li>Calcula la cantidad de hidrocortisona con la corrección por valoración y deja escrito quién verificó el cálculo.</li><li>Redacta la guía de elaboración con los elementos de la Tabla 1 de la clase 6; escribe cada paso con método, parámetros y criterio de fin.</li><li>Diligencia el registro de elaboración con los datos simulados, incluidos los controles en proceso y final.</li><li>Diseña la etiqueta con los datos del literal f del numeral 5.1.1 del Manual y escribe la fecha límite de uso como fecha calendario, con el supuesto que usaste.</li><li>Escribe dos riesgos de la preparación y cómo los controla tu guía.</li><li>Revisa tu documento con la rúbrica y súbelo al aula en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Redactar una guía de elaboración reproducible.</li><li>Diligenciar el registro de una preparación con cálculos corregidos y lotes.</li><li>Diseñar una etiqueta que cumpla el Manual de la Resolución 1403 y el Decreto 2200.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 4 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 12 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar IA para revisar redacción o estructura, declarándolo al final. No la uses para generar cálculos o datos que no verifiques: cada cifra debe poder reconstruirse a partir del caso.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 12 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Guía de elaboración reproducible</td><td>30 %</td><td>Completa, con pasos y parámetros que permitirían a otra persona obtener el mismo resultado.</td><td>Completa con algún paso poco preciso.</td><td>Faltan elementos o hay pasos ambiguos («mezclar bien»).</td><td>Lista de componentes sin procedimiento.</td><td>No hay guía.</td></tr>
  <tr><td>Cálculo y registro</td><td>25 %</td><td>Cálculo corregido correcto (0,504 g), registro completo con lotes, equipo, controles y firmas.</td><td>Cálculo correcto y registro con una omisión menor.</td><td>Cálculo sin corrección o registro incompleto.</td><td>Cálculo erróneo y registro mínimo.</td><td>No hay cálculo ni registro.</td></tr>
  <tr><td>Etiqueta conforme</td><td>20 %</td><td>Incluye todos los datos aplicables del literal f y una fecha límite expresada como fecha, con su supuesto.</td><td>Falta un dato menor.</td><td>Faltan datos de paciente, firma o fecha límite.</td><td>Etiqueta genérica sin trazabilidad.</td><td>No hay etiqueta.</td></tr>
  <tr><td>Análisis de riesgos</td><td>15 %</td><td>Dos riesgos pertinentes con controles concretos en la guía.</td><td>Dos riesgos con controles generales.</td><td>Un riesgo o controles vagos.</td><td>Riesgos no relacionados con la preparación.</td><td>No hay análisis.</td></tr>
  <tr><td>Fuentes y presentación</td><td>10 %</td><td>Citas correctas y documento ordenado, legible y profesional.</td><td>Citas con errores menores.</td><td>Citas incompletas o presentación desordenada.</td><td>Sin citas o difícil de leer.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$bpe_html$, $bpe_html$<h2>Caso de estudio</h2>
<p>Eres la persona responsable técnica de la Farmacia San Rafael (ficticia). Llega una prescripción completa para la paciente simulada R. M. P., documento 00000000: crema de hidrocortisona al 1 %, 50 g, aplicar dos veces al día. Datos simulados de los insumos: hidrocortisona lote HC-2611, valoración 99,2 %, vence 05/2028; base para crema O/W con conservante, lote BC-118, vence 02/2027; balanza B-02 con calibración vigente hasta 03/2027; envase de 50 g en polipropileno blanco opaco con tapa rosca. La elaboración inicia el 03/11/2026 a las 10:00.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$bpe_html$, $bpe_json$["Redacta la guía de elaboración de la crema con todos los elementos de la Tabla 1 de la clase 6.","Calcula la cantidad de hidrocortisona a pesar con la corrección por valoración y muestra el cálculo.","Diligencia el registro de elaboración de esta preparación con los datos simulados, incluidos controles en proceso y final.","Diseña la etiqueta con los datos del literal f del numeral 5.1.1 del Manual y una fecha límite de uso provisional, explicando qué supuesto usaste (se profundiza en la unidad 3).","Señala dos riesgos de la preparación y cómo los controla tu guía."]$bpe_json$::jsonb, 'Documento con la guía de elaboración, el registro diligenciado, la etiqueta y la nota de riesgos.',
       '3 a 5 páginas, en PDF o DOCX (la etiqueta puede ir como imagen o tabla)', $bpe_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. Puedes usar como estructura las Tablas 1 y 2 de la clase 6. No se requieren formatos de empresas reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 1403 de 2007 y su Manual (artículo 10 y numerales 2.4, 2.6 y 5.1.1), Decreto 2200 de 2005 (artículo 19), Resolución 444 de 2008 (capítulo 17) y, como referencia técnica, el capítulo 795 de la USP y sus preguntas frecuentes. Cita en APA 7.</p>$bpe_html$, NULL, $bpe_json${"version":1,"total":100,"criteria":[{"id":"guia-de-elaboracion-reproducible","name":"Guía de elaboración reproducible","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Completa, con pasos y parámetros que permitirían a otra persona obtener el mismo resultado."},{"level":3,"label":"Logrado","description":"Completa con algún paso poco preciso."},{"level":2,"label":"En desarrollo","description":"Faltan elementos o hay pasos ambiguos («mezclar bien»)."},{"level":1,"label":"Inicial","description":"Lista de componentes sin procedimiento."},{"level":0,"label":"Sin evidencia","description":"No hay guía."}]},{"id":"calculo-y-registro","name":"Cálculo y registro","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cálculo corregido correcto (0,504 g), registro completo con lotes, equipo, controles y firmas."},{"level":3,"label":"Logrado","description":"Cálculo correcto y registro con una omisión menor."},{"level":2,"label":"En desarrollo","description":"Cálculo sin corrección o registro incompleto."},{"level":1,"label":"Inicial","description":"Cálculo erróneo y registro mínimo."},{"level":0,"label":"Sin evidencia","description":"No hay cálculo ni registro."}]},{"id":"etiqueta-conforme","name":"Etiqueta conforme","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Incluye todos los datos aplicables del literal f y una fecha límite expresada como fecha, con su supuesto."},{"level":3,"label":"Logrado","description":"Falta un dato menor."},{"level":2,"label":"En desarrollo","description":"Faltan datos de paciente, firma o fecha límite."},{"level":1,"label":"Inicial","description":"Etiqueta genérica sin trazabilidad."},{"level":0,"label":"Sin evidencia","description":"No hay etiqueta."}]},{"id":"analisis-de-riesgos","name":"Análisis de riesgos","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Dos riesgos pertinentes con controles concretos en la guía."},{"level":3,"label":"Logrado","description":"Dos riesgos con controles generales."},{"level":2,"label":"En desarrollo","description":"Un riesgo o controles vagos."},{"level":1,"label":"Inicial","description":"Riesgos no relacionados con la preparación."},{"level":0,"label":"Sin evidencia","description":"No hay análisis."}]},{"id":"fuentes-y-presentacion","name":"Fuentes y presentación","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Citas correctas y documento ordenado, legible y profesional."},{"level":3,"label":"Logrado","description":"Citas con errores menores."},{"level":2,"label":"En desarrollo","description":"Citas incompletas o presentación desordenada."},{"level":1,"label":"Inicial","description":"Sin citas o difícil de leer."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$bpe_json$::jsonb, 'rubrica', TRUE, TRUE,
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 2, 12)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET status = 'publicado', module_id = v_unidad, instructions_html = $bpe_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar y crear.</p>
<ol><li>Lee la prescripción y los datos simulados de los insumos.</li><li>Calcula la cantidad de hidrocortisona con la corrección por valoración y deja escrito quién verificó el cálculo.</li><li>Redacta la guía de elaboración con los elementos de la Tabla 1 de la clase 6; escribe cada paso con método, parámetros y criterio de fin.</li><li>Diligencia el registro de elaboración con los datos simulados, incluidos los controles en proceso y final.</li><li>Diseña la etiqueta con los datos del literal f del numeral 5.1.1 del Manual y escribe la fecha límite de uso como fecha calendario, con el supuesto que usaste.</li><li>Escribe dos riesgos de la preparación y cómo los controla tu guía.</li><li>Revisa tu documento con la rúbrica y súbelo al aula en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Redactar una guía de elaboración reproducible.</li><li>Diligenciar el registro de una preparación con cálculos corregidos y lotes.</li><li>Diseñar una etiqueta que cumpla el Manual de la Resolución 1403 y el Decreto 2200.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 4 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 12 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar IA para revisar redacción o estructura, declarándolo al final. No la uses para generar cálculos o datos que no verifiques: cada cifra debe poder reconstruirse a partir del caso.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 12 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Guía de elaboración reproducible</td><td>30 %</td><td>Completa, con pasos y parámetros que permitirían a otra persona obtener el mismo resultado.</td><td>Completa con algún paso poco preciso.</td><td>Faltan elementos o hay pasos ambiguos («mezclar bien»).</td><td>Lista de componentes sin procedimiento.</td><td>No hay guía.</td></tr>
  <tr><td>Cálculo y registro</td><td>25 %</td><td>Cálculo corregido correcto (0,504 g), registro completo con lotes, equipo, controles y firmas.</td><td>Cálculo correcto y registro con una omisión menor.</td><td>Cálculo sin corrección o registro incompleto.</td><td>Cálculo erróneo y registro mínimo.</td><td>No hay cálculo ni registro.</td></tr>
  <tr><td>Etiqueta conforme</td><td>20 %</td><td>Incluye todos los datos aplicables del literal f y una fecha límite expresada como fecha, con su supuesto.</td><td>Falta un dato menor.</td><td>Faltan datos de paciente, firma o fecha límite.</td><td>Etiqueta genérica sin trazabilidad.</td><td>No hay etiqueta.</td></tr>
  <tr><td>Análisis de riesgos</td><td>15 %</td><td>Dos riesgos pertinentes con controles concretos en la guía.</td><td>Dos riesgos con controles generales.</td><td>Un riesgo o controles vagos.</td><td>Riesgos no relacionados con la preparación.</td><td>No hay análisis.</td></tr>
  <tr><td>Fuentes y presentación</td><td>10 %</td><td>Citas correctas y documento ordenado, legible y profesional.</td><td>Citas con errores menores.</td><td>Citas incompletas o presentación desordenada.</td><td>Sin citas o difícil de leer.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$bpe_html$, case_html = $bpe_html$<h2>Caso de estudio</h2>
<p>Eres la persona responsable técnica de la Farmacia San Rafael (ficticia). Llega una prescripción completa para la paciente simulada R. M. P., documento 00000000: crema de hidrocortisona al 1 %, 50 g, aplicar dos veces al día. Datos simulados de los insumos: hidrocortisona lote HC-2611, valoración 99,2 %, vence 05/2028; base para crema O/W con conservante, lote BC-118, vence 02/2027; balanza B-02 con calibración vigente hasta 03/2027; envase de 50 g en polipropileno blanco opaco con tapa rosca. La elaboración inicia el 03/11/2026 a las 10:00.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$bpe_html$,
           points_to_solve = $bpe_json$["Redacta la guía de elaboración de la crema con todos los elementos de la Tabla 1 de la clase 6.","Calcula la cantidad de hidrocortisona a pesar con la corrección por valoración y muestra el cálculo.","Diligencia el registro de elaboración de esta preparación con los datos simulados, incluidos controles en proceso y final.","Diseña la etiqueta con los datos del literal f del numeral 5.1.1 del Manual y una fecha límite de uso provisional, explicando qué supuesto usaste (se profundiza en la unidad 3).","Señala dos riesgos de la preparación y cómo los controla tu guía."]$bpe_json$::jsonb, expected_product = 'Documento con la guía de elaboración, el registro diligenciado, la etiqueta y la nota de riesgos.', extension_hint = '3 a 5 páginas, en PDF o DOCX (la etiqueta puede ir como imagen o tabla)',
           support_html = $bpe_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. Puedes usar como estructura las Tablas 1 y 2 de la clase 6. No se requieren formatos de empresas reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 1403 de 2007 y su Manual (artículo 10 y numerales 2.4, 2.6 y 5.1.1), Decreto 2200 de 2005 (artículo 19), Resolución 444 de 2008 (capítulo 17) y, como referencia técnica, el capítulo 795 de la USP y sus preguntas frecuentes. Cita en APA 7.</p>$bpe_html$, teacher_guide_html = teacher_guide_html, sort_order = 2, updated_at = NOW()
     WHERE id = v_act;
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', 'Actividad 2 · Guía, registro y etiqueta de una preparación';
    ELSE
      UPDATE aula_activities
         SET rubric = $bpe_json${"version":1,"total":100,"criteria":[{"id":"guia-de-elaboracion-reproducible","name":"Guía de elaboración reproducible","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Completa, con pasos y parámetros que permitirían a otra persona obtener el mismo resultado."},{"level":3,"label":"Logrado","description":"Completa con algún paso poco preciso."},{"level":2,"label":"En desarrollo","description":"Faltan elementos o hay pasos ambiguos («mezclar bien»)."},{"level":1,"label":"Inicial","description":"Lista de componentes sin procedimiento."},{"level":0,"label":"Sin evidencia","description":"No hay guía."}]},{"id":"calculo-y-registro","name":"Cálculo y registro","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cálculo corregido correcto (0,504 g), registro completo con lotes, equipo, controles y firmas."},{"level":3,"label":"Logrado","description":"Cálculo correcto y registro con una omisión menor."},{"level":2,"label":"En desarrollo","description":"Cálculo sin corrección o registro incompleto."},{"level":1,"label":"Inicial","description":"Cálculo erróneo y registro mínimo."},{"level":0,"label":"Sin evidencia","description":"No hay cálculo ni registro."}]},{"id":"etiqueta-conforme","name":"Etiqueta conforme","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Incluye todos los datos aplicables del literal f y una fecha límite expresada como fecha, con su supuesto."},{"level":3,"label":"Logrado","description":"Falta un dato menor."},{"level":2,"label":"En desarrollo","description":"Faltan datos de paciente, firma o fecha límite."},{"level":1,"label":"Inicial","description":"Etiqueta genérica sin trazabilidad."},{"level":0,"label":"Sin evidencia","description":"No hay etiqueta."}]},{"id":"analisis-de-riesgos","name":"Análisis de riesgos","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Dos riesgos pertinentes con controles concretos en la guía."},{"level":3,"label":"Logrado","description":"Dos riesgos con controles generales."},{"level":2,"label":"En desarrollo","description":"Un riesgo o controles vagos."},{"level":1,"label":"Inicial","description":"Riesgos no relacionados con la preparación."},{"level":0,"label":"Sin evidencia","description":"No hay análisis."}]},{"id":"fuentes-y-presentacion","name":"Fuentes y presentación","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Citas correctas y documento ordenado, legible y profesional."},{"level":3,"label":"Logrado","description":"Citas con errores menores."},{"level":2,"label":"En desarrollo","description":"Citas incompletas o presentación desordenada."},{"level":1,"label":"Inicial","description":"Sin citas o difícil de leer."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$bpe_json$::jsonb, grading_method = 'rubrica', weight = 12,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Actividad bpe-u3-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Calidad y seguridad del paciente' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Calidad y seguridad del paciente). Se salta.';
    RETURN;
  END IF;
  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = 'Actividad 3 · Plan de calidad y respuesta a una queja' AND deleted_at IS NULL LIMIT 1;
  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
       extension_hint, support_html, teacher_guide_html, rubric, grading_method, allow_text, allow_link,
       allow_file, accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, 'Actividad 3 · Plan de calidad y respuesta a una queja', $bpe_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> analizar y evaluar.</p>
<ol><li>Lee el caso y ordena los hechos en una línea de tiempo del 10 al 13 de noviembre.</li><li>Diseña el plan de controles de la suspensión, con criterio y fuente para cada control.</li><li>Asigna la fecha límite de uso con la Tabla 4 y escribe cómo debió aparecer en la etiqueta.</li><li>Decide si el evento es serio con los criterios de ICH E2A y define el plazo del reporte.</li><li>Describe la respuesta en los cuatro carriles: paciente, producto (incluidas SR-1110-01 y 02), reporte e investigación.</li><li>Diligencia el reporte con los datos mínimos del Manual, adaptado a una preparación magistral.</li><li>Identifica la causa más probable y propone dos acciones correctivas y una preventiva, cada una con su indicador.</li><li>Revisa el informe con la rúbrica y súbelo al aula en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Diseñar los controles y la fecha límite de uso de una preparación.</li><li>Gestionar una queja con evento adverso: contención, reporte e investigación.</li><li>Proponer acciones correctivas verificables.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 4 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 12 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar IA para organizar ideas o revisar redacción, declarándolo al final. Los plazos, criterios y fechas deben verificarse en las fuentes; el análisis y las decisiones deben ser tuyos.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 12 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Plan de controles</td><td>20 %</td><td>Controles en proceso y finales pertinentes, con criterio y fuente para cada uno.</td><td>Controles pertinentes con algún criterio sin fuente.</td><td>Controles generales sin criterios.</td><td>Solo inspección visual.</td><td>No hay plan.</td></tr>
  <tr><td>Fecha límite de uso</td><td>20 %</td><td>14 días en refrigerador, «usar antes del 24/11/2026», con justificación y relación con la excursión.</td><td>Categoría correcta con un error menor de cálculo o de redacción.</td><td>Categoría equivocada pero razonada.</td><td>Duración genérica o vencimiento del fabricante.</td><td>No asigna fecha.</td></tr>
  <tr><td>Respuesta en cuatro carriles</td><td>25 %</td><td>Paciente, producto (incluidas SR-1110-01 y 02), reporte con gravedad y plazo correctos, e investigación.</td><td>Cuatro carriles con una omisión menor.</td><td>Tres carriles o plazos imprecisos.</td><td>Solo atiende al paciente o solo reporta.</td><td>No hay respuesta.</td></tr>
  <tr><td>Reporte diligenciado</td><td>15 %</td><td>Todos los datos mínimos, adaptados a la magistral (establecimiento, número interno, composición).</td><td>Falta un dato menor.</td><td>Faltan datos de la preparación.</td><td>Reporte genérico.</td><td>No hay reporte.</td></tr>
  <tr><td>Causa y acciones</td><td>20 %</td><td>Causa sustentada en el registro y acciones verificables con indicador.</td><td>Causa correcta y acciones razonables sin verificación.</td><td>Causa supuesta sin evidencia.</td><td>Acciones genéricas («capacitar»).</td><td>No hay análisis.</td></tr>
  </tbody>
</table>
</details>$bpe_html$, $bpe_html$<h2>Caso de estudio</h2>
<p>La Farmacia San Rafael (ficticia) elabora una suspensión oral de omeprazol 2 mg/mL a partir de cápsulas comerciales, en vehículo acuoso sin conservante, envase ámbar de 100 mL. Datos simulados: el 10/11/2026 a las 9:00 se elaboró el número interno SR-1110-03 para el paciente simulado T. G., 3 años, 14 kg, 7 mg una vez al día. El 13/11/2026 la madre llama: la suspensión cambió de color, el niño vomitó una vez y está bien. El registro muestra que el frasco estuvo en el mesón de entregas desde el 10 hasta el 12 de noviembre porque la nevera estaba llena. Con el mismo lote de cápsulas se elaboraron SR-1110-01 y SR-1110-02, ya entregadas.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$bpe_html$, $bpe_json$["Diseña el plan de controles en proceso y final de esta suspensión, con criterio y fuente para cada control.","Asigna y justifica la fecha límite de uso que debió tener SR-1110-03 y escribe cómo debió aparecer en la etiqueta.","Describe la respuesta a la llamada en los cuatro carriles, incluida la decisión sobre la gravedad y el plazo del reporte.","Diligencia el reporte con los datos mínimos del Manual de la Resolución 1403, adaptado a una preparación magistral.","Identifica la causa más probable y propone dos acciones correctivas y una preventiva, con cómo verificarías su eficacia."]$bpe_json$::jsonb, 'Informe técnico con el plan de controles, la fecha límite justificada, el plan de respuesta, el reporte diligenciado y las acciones.',
       '4 a 5 páginas (1.200 a 1.600 palabras), en PDF o DOCX', $bpe_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. Puedes usar la Tabla 1 de la clase 7, la Tabla 1 de la clase 8 y la Figura 1 de la clase 9. No uses datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 1403 de 2007 y su Manual (numerales 2.4, 2.6, 5.1.1 y 5.2 a 5.5), Resolución 444 de 2008, capítulo 795 de la USP (Tabla 4 y preguntas frecuentes) e ICH E2A. Cita en APA 7.</p>$bpe_html$, NULL, $bpe_json${"version":1,"total":100,"criteria":[{"id":"plan-de-controles","name":"Plan de controles","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Controles en proceso y finales pertinentes, con criterio y fuente para cada uno."},{"level":3,"label":"Logrado","description":"Controles pertinentes con algún criterio sin fuente."},{"level":2,"label":"En desarrollo","description":"Controles generales sin criterios."},{"level":1,"label":"Inicial","description":"Solo inspección visual."},{"level":0,"label":"Sin evidencia","description":"No hay plan."}]},{"id":"fecha-limite-de-uso","name":"Fecha límite de uso","weight":20,"levels":[{"level":4,"label":"Destacado","description":"14 días en refrigerador, «usar antes del 24/11/2026», con justificación y relación con la excursión."},{"level":3,"label":"Logrado","description":"Categoría correcta con un error menor de cálculo o de redacción."},{"level":2,"label":"En desarrollo","description":"Categoría equivocada pero razonada."},{"level":1,"label":"Inicial","description":"Duración genérica o vencimiento del fabricante."},{"level":0,"label":"Sin evidencia","description":"No asigna fecha."}]},{"id":"respuesta-en-cuatro-carriles","name":"Respuesta en cuatro carriles","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Paciente, producto (incluidas SR-1110-01 y 02), reporte con gravedad y plazo correctos, e investigación."},{"level":3,"label":"Logrado","description":"Cuatro carriles con una omisión menor."},{"level":2,"label":"En desarrollo","description":"Tres carriles o plazos imprecisos."},{"level":1,"label":"Inicial","description":"Solo atiende al paciente o solo reporta."},{"level":0,"label":"Sin evidencia","description":"No hay respuesta."}]},{"id":"reporte-diligenciado","name":"Reporte diligenciado","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Todos los datos mínimos, adaptados a la magistral (establecimiento, número interno, composición)."},{"level":3,"label":"Logrado","description":"Falta un dato menor."},{"level":2,"label":"En desarrollo","description":"Faltan datos de la preparación."},{"level":1,"label":"Inicial","description":"Reporte genérico."},{"level":0,"label":"Sin evidencia","description":"No hay reporte."}]},{"id":"causa-y-acciones","name":"Causa y acciones","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Causa sustentada en el registro y acciones verificables con indicador."},{"level":3,"label":"Logrado","description":"Causa correcta y acciones razonables sin verificación."},{"level":2,"label":"En desarrollo","description":"Causa supuesta sin evidencia."},{"level":1,"label":"Inicial","description":"Acciones genéricas («capacitar»)."},{"level":0,"label":"Sin evidencia","description":"No hay análisis."}]}]}$bpe_json$::jsonb, 'rubrica', TRUE, TRUE,
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 3, 12)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET status = 'publicado', module_id = v_unidad, instructions_html = $bpe_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> analizar y evaluar.</p>
<ol><li>Lee el caso y ordena los hechos en una línea de tiempo del 10 al 13 de noviembre.</li><li>Diseña el plan de controles de la suspensión, con criterio y fuente para cada control.</li><li>Asigna la fecha límite de uso con la Tabla 4 y escribe cómo debió aparecer en la etiqueta.</li><li>Decide si el evento es serio con los criterios de ICH E2A y define el plazo del reporte.</li><li>Describe la respuesta en los cuatro carriles: paciente, producto (incluidas SR-1110-01 y 02), reporte e investigación.</li><li>Diligencia el reporte con los datos mínimos del Manual, adaptado a una preparación magistral.</li><li>Identifica la causa más probable y propone dos acciones correctivas y una preventiva, cada una con su indicador.</li><li>Revisa el informe con la rúbrica y súbelo al aula en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Diseñar los controles y la fecha límite de uso de una preparación.</li><li>Gestionar una queja con evento adverso: contención, reporte e investigación.</li><li>Proponer acciones correctivas verificables.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 4 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 12 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar IA para organizar ideas o revisar redacción, declarándolo al final. Los plazos, criterios y fechas deben verificarse en las fuentes; el análisis y las decisiones deben ser tuyos.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 12 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Plan de controles</td><td>20 %</td><td>Controles en proceso y finales pertinentes, con criterio y fuente para cada uno.</td><td>Controles pertinentes con algún criterio sin fuente.</td><td>Controles generales sin criterios.</td><td>Solo inspección visual.</td><td>No hay plan.</td></tr>
  <tr><td>Fecha límite de uso</td><td>20 %</td><td>14 días en refrigerador, «usar antes del 24/11/2026», con justificación y relación con la excursión.</td><td>Categoría correcta con un error menor de cálculo o de redacción.</td><td>Categoría equivocada pero razonada.</td><td>Duración genérica o vencimiento del fabricante.</td><td>No asigna fecha.</td></tr>
  <tr><td>Respuesta en cuatro carriles</td><td>25 %</td><td>Paciente, producto (incluidas SR-1110-01 y 02), reporte con gravedad y plazo correctos, e investigación.</td><td>Cuatro carriles con una omisión menor.</td><td>Tres carriles o plazos imprecisos.</td><td>Solo atiende al paciente o solo reporta.</td><td>No hay respuesta.</td></tr>
  <tr><td>Reporte diligenciado</td><td>15 %</td><td>Todos los datos mínimos, adaptados a la magistral (establecimiento, número interno, composición).</td><td>Falta un dato menor.</td><td>Faltan datos de la preparación.</td><td>Reporte genérico.</td><td>No hay reporte.</td></tr>
  <tr><td>Causa y acciones</td><td>20 %</td><td>Causa sustentada en el registro y acciones verificables con indicador.</td><td>Causa correcta y acciones razonables sin verificación.</td><td>Causa supuesta sin evidencia.</td><td>Acciones genéricas («capacitar»).</td><td>No hay análisis.</td></tr>
  </tbody>
</table>
</details>$bpe_html$, case_html = $bpe_html$<h2>Caso de estudio</h2>
<p>La Farmacia San Rafael (ficticia) elabora una suspensión oral de omeprazol 2 mg/mL a partir de cápsulas comerciales, en vehículo acuoso sin conservante, envase ámbar de 100 mL. Datos simulados: el 10/11/2026 a las 9:00 se elaboró el número interno SR-1110-03 para el paciente simulado T. G., 3 años, 14 kg, 7 mg una vez al día. El 13/11/2026 la madre llama: la suspensión cambió de color, el niño vomitó una vez y está bien. El registro muestra que el frasco estuvo en el mesón de entregas desde el 10 hasta el 12 de noviembre porque la nevera estaba llena. Con el mismo lote de cápsulas se elaboraron SR-1110-01 y SR-1110-02, ya entregadas.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$bpe_html$,
           points_to_solve = $bpe_json$["Diseña el plan de controles en proceso y final de esta suspensión, con criterio y fuente para cada control.","Asigna y justifica la fecha límite de uso que debió tener SR-1110-03 y escribe cómo debió aparecer en la etiqueta.","Describe la respuesta a la llamada en los cuatro carriles, incluida la decisión sobre la gravedad y el plazo del reporte.","Diligencia el reporte con los datos mínimos del Manual de la Resolución 1403, adaptado a una preparación magistral.","Identifica la causa más probable y propone dos acciones correctivas y una preventiva, con cómo verificarías su eficacia."]$bpe_json$::jsonb, expected_product = 'Informe técnico con el plan de controles, la fecha límite justificada, el plan de respuesta, el reporte diligenciado y las acciones.', extension_hint = '4 a 5 páginas (1.200 a 1.600 palabras), en PDF o DOCX',
           support_html = $bpe_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. Puedes usar la Tabla 1 de la clase 7, la Tabla 1 de la clase 8 y la Figura 1 de la clase 9. No uses datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 1403 de 2007 y su Manual (numerales 2.4, 2.6, 5.1.1 y 5.2 a 5.5), Resolución 444 de 2008, capítulo 795 de la USP (Tabla 4 y preguntas frecuentes) e ICH E2A. Cita en APA 7.</p>$bpe_html$, teacher_guide_html = teacher_guide_html, sort_order = 3, updated_at = NOW()
     WHERE id = v_act;
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', 'Actividad 3 · Plan de calidad y respuesta a una queja';
    ELSE
      UPDATE aula_activities
         SET rubric = $bpe_json${"version":1,"total":100,"criteria":[{"id":"plan-de-controles","name":"Plan de controles","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Controles en proceso y finales pertinentes, con criterio y fuente para cada uno."},{"level":3,"label":"Logrado","description":"Controles pertinentes con algún criterio sin fuente."},{"level":2,"label":"En desarrollo","description":"Controles generales sin criterios."},{"level":1,"label":"Inicial","description":"Solo inspección visual."},{"level":0,"label":"Sin evidencia","description":"No hay plan."}]},{"id":"fecha-limite-de-uso","name":"Fecha límite de uso","weight":20,"levels":[{"level":4,"label":"Destacado","description":"14 días en refrigerador, «usar antes del 24/11/2026», con justificación y relación con la excursión."},{"level":3,"label":"Logrado","description":"Categoría correcta con un error menor de cálculo o de redacción."},{"level":2,"label":"En desarrollo","description":"Categoría equivocada pero razonada."},{"level":1,"label":"Inicial","description":"Duración genérica o vencimiento del fabricante."},{"level":0,"label":"Sin evidencia","description":"No asigna fecha."}]},{"id":"respuesta-en-cuatro-carriles","name":"Respuesta en cuatro carriles","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Paciente, producto (incluidas SR-1110-01 y 02), reporte con gravedad y plazo correctos, e investigación."},{"level":3,"label":"Logrado","description":"Cuatro carriles con una omisión menor."},{"level":2,"label":"En desarrollo","description":"Tres carriles o plazos imprecisos."},{"level":1,"label":"Inicial","description":"Solo atiende al paciente o solo reporta."},{"level":0,"label":"Sin evidencia","description":"No hay respuesta."}]},{"id":"reporte-diligenciado","name":"Reporte diligenciado","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Todos los datos mínimos, adaptados a la magistral (establecimiento, número interno, composición)."},{"level":3,"label":"Logrado","description":"Falta un dato menor."},{"level":2,"label":"En desarrollo","description":"Faltan datos de la preparación."},{"level":1,"label":"Inicial","description":"Reporte genérico."},{"level":0,"label":"Sin evidencia","description":"No hay reporte."}]},{"id":"causa-y-acciones","name":"Causa y acciones","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Causa sustentada en el registro y acciones verificables con indicador."},{"level":3,"label":"Logrado","description":"Causa correcta y acciones razonables sin verificación."},{"level":2,"label":"En desarrollo","description":"Causa supuesta sin evidencia."},{"level":1,"label":"Inicial","description":"Acciones genéricas («capacitar»)."},{"level":0,"label":"Sin evidencia","description":"No hay análisis."}]}]}$bpe_json$::jsonb, grading_method = 'rubrica', weight = 12,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Actividad bpe-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'El establecimiento y el proceso' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (El establecimiento y el proceso). Se salta.';
    RETURN;
  END IF;
  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = 'Proyecto integrador · Entrega 1: alcance, área y proceso de la Clínica Montesol' AND deleted_at IS NULL LIMIT 1;
  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
       extension_hint, support_html, teacher_guide_html, rubric, grading_method, allow_text, allow_link,
       allow_file, accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, 'Proyecto integrador · Entrega 1: alcance, área y proceso de la Clínica Montesol', $bpe_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso completo y haz una lista de los datos que vas a necesitar en cada fase.</li><li>Fase 1: decide qué fórmulas elaborará el servicio, cuáles no y por qué; identifica la autorización que necesita y cita los artículos.</li><li>Fase 1: escribe la política de admisión de fórmulas con el semáforo de la clase 3 y asigna quién elabora cada una de las cinco.</li><li>Fase 2: dibuja el plano funcional del área (puede ser a mano o en una herramienta sencilla) con el flujo de la figura de la clase 4 y señala qué cambia respecto del punto de partida.</li><li>Fase 2: lista la dotación mínima y abre la hoja de vida de la balanza con los campos del ítem 7.2.9.</li><li>Fase 2: redacta el protocolo de recepción de materias primas y la decisión sobre el agua del purificador.</li><li>Fase 2: elige una de las cinco fórmulas y escribe su guía de elaboración, un registro diligenciado con datos simulados y su etiqueta.</li><li>Revisa tu entrega con la rúbrica y súbela al aula en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (alcance y marco).</strong> Qué elaborará el servicio y qué no; qué autorización necesita y con qué norma; qué procesos y formas farmacéuticas pedirá en el certificado; política de admisión de fórmulas y quién elabora cada una.</li>
  <li><strong>Fase 2 · Unidad 2 (establecimiento y proceso).</strong> Plano funcional del área y su flujo; dotación con hojas de vida y calibración; protocolo de recepción de materias primas y uso del agua; una guía de elaboración completa, con registro y etiqueta, para una de las cinco fórmulas.</li>
  <li><strong>Fase 3 · Unidad 3 (calidad y seguridad).</strong> Plan de controles por forma farmacéutica; fecha límite de uso sustentada para las cinco fórmulas; procedimiento de farmacovigilancia y quejas; autoinspección con el instrumento de la Resolución 444 y plan para cerrar las brechas.</li>
</ol>
<p>La entrega 1 reúne las fases 1 y 2. La entrega final integra las tres fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Delimitar el alcance de un servicio de magistrales y la autorización que necesita.</li><li>Diseñar el área, la dotación y los protocolos de entrada de materias primas y agua.</li><li>Redactar una guía de elaboración con su registro y su etiqueta.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 6 horas de trabajo individual, repartidas en las unidades 1 y 2.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 8 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar IA para organizar, resumir tus notas o revisar la redacción, y debes declararlo en un anexo con el uso que le diste. No se acepta como fuente normativa ni para inventar datos del caso: cada cita se verifica en la fuente original y cada decisión debe estar argumentada por ti.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 8 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Alcance y fundamento normativo</td><td>25 %</td><td>Alcance claro y justificado; autorización, procesos y formas correctos con citas precisas.</td><td>Alcance correcto con alguna cita imprecisa.</td><td>Alcance general o autorización incompleta.</td><td>Alcance confuso o norma equivocada.</td><td>No hay alcance.</td></tr>
  <tr><td>Diseño del área y dotación</td><td>25 %</td><td>Plano con flujo sin cruces, cambios necesarios identificados y hoja de vida completa.</td><td>Plano y dotación adecuados con omisiones menores.</td><td>Plano sin flujo o dotación incompleta.</td><td>Elementos sueltos sin relación con el caso.</td><td>No hay diseño.</td></tr>
  <tr><td>Materias primas y agua</td><td>20 %</td><td>Protocolo de cinco pasos aplicable y decisión sobre el agua bien fundamentada.</td><td>Protocolo correcto con un paso débil.</td><td>Protocolo genérico o decisión sobre el agua sin fundamento.</td><td>Lista sin procedimiento.</td><td>No hay protocolo.</td></tr>
  <tr><td>Guía, registro y etiqueta</td><td>20 %</td><td>Documentos completos, reproducibles y coherentes entre sí, con cálculo corregido.</td><td>Completos con una omisión menor.</td><td>Falta uno de los tres documentos o hay pasos ambiguos.</td><td>Documentos mínimos.</td><td>No hay documentos.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Documento ordenado, profesional y con citas verificables.</td><td>Ordenado con errores menores de cita.</td><td>Desordenado o con citas incompletas.</td><td>Difícil de seguir y sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$bpe_html$, $bpe_html$<h2>Caso de estudio</h2>
<p>La Clínica Montesol (ficticia) es una IPS de mediana complejidad de Pereira con servicio farmacéutico habilitado. Quiere empezar a elaborar preparaciones magistrales no estériles para pacientes pediátricos hospitalizados y ambulatorios, y la gerencia pidió tener en seis meses el expediente para solicitar el certificado de Buenas Prácticas de Elaboración al Invima. Punto de partida (datos simulados): un área disponible de 18 m² junto a la farmacia, con un baño contiguo; una nevera doméstica sin termómetro de máxima y mínima; una balanza analítica sin hoja de vida; un purificador de ósmosis inversa sin registros de mantenimiento; una química farmacéutica directora técnica, un tecnólogo en regencia de farmacia y dos auxiliares. Las cinco fórmulas que más se piden son: omeprazol 2 mg/mL en suspensión oral, hidroclorotiazida 2 mg/mL en suspensión oral, cápsulas de hidrocortisona 1 mg, crema de urea al 10 % y vaselina salicilada al 5 %. Tú eres la persona que la directora técnica encargó del proyecto. En esta entrega construyes las fases 1 y 2.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$bpe_html$, $bpe_json$["Alcance del servicio: fórmulas que sí y que no, con su justificación.","Autorización necesaria, procesos y formas farmacéuticas a certificar, con citas.","Política de admisión de fórmulas y asignación de quién elabora.","Plano funcional, dotación y hoja de vida de la balanza.","Protocolo de recepción de materias primas y decisión sobre el agua.","Guía de elaboración, registro y etiqueta de una fórmula."]$bpe_json$::jsonb, 'Documento de avance del proyecto con las fases 1 y 2, el plano funcional y los anexos de la fórmula elegida.',
       '6 a 9 páginas más anexos, en PDF o DOCX', $bpe_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. Usa como plantillas las tablas y figuras de las clases 1 a 6. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 2200 de 2005 (modificado por el Decreto 2330 de 2006), Resolución 1403 de 2007 y su Manual, Resolución 444 de 2008, Decreto 335 de 2022, capítulo 795 de la USP y sus preguntas frecuentes, OMS TRS 1033 (anexo 3) e ICH E2A. Cita en APA 7 o en el formato «norma, artículo o numeral».</p>$bpe_html$, NULL, $bpe_json${"version":1,"total":100,"criteria":[{"id":"alcance-y-fundamento-normativo","name":"Alcance y fundamento normativo","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Alcance claro y justificado; autorización, procesos y formas correctos con citas precisas."},{"level":3,"label":"Logrado","description":"Alcance correcto con alguna cita imprecisa."},{"level":2,"label":"En desarrollo","description":"Alcance general o autorización incompleta."},{"level":1,"label":"Inicial","description":"Alcance confuso o norma equivocada."},{"level":0,"label":"Sin evidencia","description":"No hay alcance."}]},{"id":"diseno-del-area-y-dotacion","name":"Diseño del área y dotación","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Plano con flujo sin cruces, cambios necesarios identificados y hoja de vida completa."},{"level":3,"label":"Logrado","description":"Plano y dotación adecuados con omisiones menores."},{"level":2,"label":"En desarrollo","description":"Plano sin flujo o dotación incompleta."},{"level":1,"label":"Inicial","description":"Elementos sueltos sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay diseño."}]},{"id":"materias-primas-y-agua","name":"Materias primas y agua","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Protocolo de cinco pasos aplicable y decisión sobre el agua bien fundamentada."},{"level":3,"label":"Logrado","description":"Protocolo correcto con un paso débil."},{"level":2,"label":"En desarrollo","description":"Protocolo genérico o decisión sobre el agua sin fundamento."},{"level":1,"label":"Inicial","description":"Lista sin procedimiento."},{"level":0,"label":"Sin evidencia","description":"No hay protocolo."}]},{"id":"guia-registro-y-etiqueta","name":"Guía, registro y etiqueta","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Documentos completos, reproducibles y coherentes entre sí, con cálculo corregido."},{"level":3,"label":"Logrado","description":"Completos con una omisión menor."},{"level":2,"label":"En desarrollo","description":"Falta uno de los tres documentos o hay pasos ambiguos."},{"level":1,"label":"Inicial","description":"Documentos mínimos."},{"level":0,"label":"Sin evidencia","description":"No hay documentos."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Documento ordenado, profesional y con citas verificables."},{"level":3,"label":"Logrado","description":"Ordenado con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Desordenado o con citas incompletas."},{"level":1,"label":"Inicial","description":"Difícil de seguir y sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$bpe_json$::jsonb, 'rubrica', TRUE, TRUE,
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 12, 8)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET status = 'publicado', module_id = v_unidad, instructions_html = $bpe_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso completo y haz una lista de los datos que vas a necesitar en cada fase.</li><li>Fase 1: decide qué fórmulas elaborará el servicio, cuáles no y por qué; identifica la autorización que necesita y cita los artículos.</li><li>Fase 1: escribe la política de admisión de fórmulas con el semáforo de la clase 3 y asigna quién elabora cada una de las cinco.</li><li>Fase 2: dibuja el plano funcional del área (puede ser a mano o en una herramienta sencilla) con el flujo de la figura de la clase 4 y señala qué cambia respecto del punto de partida.</li><li>Fase 2: lista la dotación mínima y abre la hoja de vida de la balanza con los campos del ítem 7.2.9.</li><li>Fase 2: redacta el protocolo de recepción de materias primas y la decisión sobre el agua del purificador.</li><li>Fase 2: elige una de las cinco fórmulas y escribe su guía de elaboración, un registro diligenciado con datos simulados y su etiqueta.</li><li>Revisa tu entrega con la rúbrica y súbela al aula en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (alcance y marco).</strong> Qué elaborará el servicio y qué no; qué autorización necesita y con qué norma; qué procesos y formas farmacéuticas pedirá en el certificado; política de admisión de fórmulas y quién elabora cada una.</li>
  <li><strong>Fase 2 · Unidad 2 (establecimiento y proceso).</strong> Plano funcional del área y su flujo; dotación con hojas de vida y calibración; protocolo de recepción de materias primas y uso del agua; una guía de elaboración completa, con registro y etiqueta, para una de las cinco fórmulas.</li>
  <li><strong>Fase 3 · Unidad 3 (calidad y seguridad).</strong> Plan de controles por forma farmacéutica; fecha límite de uso sustentada para las cinco fórmulas; procedimiento de farmacovigilancia y quejas; autoinspección con el instrumento de la Resolución 444 y plan para cerrar las brechas.</li>
</ol>
<p>La entrega 1 reúne las fases 1 y 2. La entrega final integra las tres fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Delimitar el alcance de un servicio de magistrales y la autorización que necesita.</li><li>Diseñar el área, la dotación y los protocolos de entrada de materias primas y agua.</li><li>Redactar una guía de elaboración con su registro y su etiqueta.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 6 horas de trabajo individual, repartidas en las unidades 1 y 2.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 8 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar IA para organizar, resumir tus notas o revisar la redacción, y debes declararlo en un anexo con el uso que le diste. No se acepta como fuente normativa ni para inventar datos del caso: cada cita se verifica en la fuente original y cada decisión debe estar argumentada por ti.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 8 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Alcance y fundamento normativo</td><td>25 %</td><td>Alcance claro y justificado; autorización, procesos y formas correctos con citas precisas.</td><td>Alcance correcto con alguna cita imprecisa.</td><td>Alcance general o autorización incompleta.</td><td>Alcance confuso o norma equivocada.</td><td>No hay alcance.</td></tr>
  <tr><td>Diseño del área y dotación</td><td>25 %</td><td>Plano con flujo sin cruces, cambios necesarios identificados y hoja de vida completa.</td><td>Plano y dotación adecuados con omisiones menores.</td><td>Plano sin flujo o dotación incompleta.</td><td>Elementos sueltos sin relación con el caso.</td><td>No hay diseño.</td></tr>
  <tr><td>Materias primas y agua</td><td>20 %</td><td>Protocolo de cinco pasos aplicable y decisión sobre el agua bien fundamentada.</td><td>Protocolo correcto con un paso débil.</td><td>Protocolo genérico o decisión sobre el agua sin fundamento.</td><td>Lista sin procedimiento.</td><td>No hay protocolo.</td></tr>
  <tr><td>Guía, registro y etiqueta</td><td>20 %</td><td>Documentos completos, reproducibles y coherentes entre sí, con cálculo corregido.</td><td>Completos con una omisión menor.</td><td>Falta uno de los tres documentos o hay pasos ambiguos.</td><td>Documentos mínimos.</td><td>No hay documentos.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Documento ordenado, profesional y con citas verificables.</td><td>Ordenado con errores menores de cita.</td><td>Desordenado o con citas incompletas.</td><td>Difícil de seguir y sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$bpe_html$, case_html = $bpe_html$<h2>Caso de estudio</h2>
<p>La Clínica Montesol (ficticia) es una IPS de mediana complejidad de Pereira con servicio farmacéutico habilitado. Quiere empezar a elaborar preparaciones magistrales no estériles para pacientes pediátricos hospitalizados y ambulatorios, y la gerencia pidió tener en seis meses el expediente para solicitar el certificado de Buenas Prácticas de Elaboración al Invima. Punto de partida (datos simulados): un área disponible de 18 m² junto a la farmacia, con un baño contiguo; una nevera doméstica sin termómetro de máxima y mínima; una balanza analítica sin hoja de vida; un purificador de ósmosis inversa sin registros de mantenimiento; una química farmacéutica directora técnica, un tecnólogo en regencia de farmacia y dos auxiliares. Las cinco fórmulas que más se piden son: omeprazol 2 mg/mL en suspensión oral, hidroclorotiazida 2 mg/mL en suspensión oral, cápsulas de hidrocortisona 1 mg, crema de urea al 10 % y vaselina salicilada al 5 %. Tú eres la persona que la directora técnica encargó del proyecto. En esta entrega construyes las fases 1 y 2.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$bpe_html$,
           points_to_solve = $bpe_json$["Alcance del servicio: fórmulas que sí y que no, con su justificación.","Autorización necesaria, procesos y formas farmacéuticas a certificar, con citas.","Política de admisión de fórmulas y asignación de quién elabora.","Plano funcional, dotación y hoja de vida de la balanza.","Protocolo de recepción de materias primas y decisión sobre el agua.","Guía de elaboración, registro y etiqueta de una fórmula."]$bpe_json$::jsonb, expected_product = 'Documento de avance del proyecto con las fases 1 y 2, el plano funcional y los anexos de la fórmula elegida.', extension_hint = '6 a 9 páginas más anexos, en PDF o DOCX',
           support_html = $bpe_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. Usa como plantillas las tablas y figuras de las clases 1 a 6. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 2200 de 2005 (modificado por el Decreto 2330 de 2006), Resolución 1403 de 2007 y su Manual, Resolución 444 de 2008, Decreto 335 de 2022, capítulo 795 de la USP y sus preguntas frecuentes, OMS TRS 1033 (anexo 3) e ICH E2A. Cita en APA 7 o en el formato «norma, artículo o numeral».</p>$bpe_html$, teacher_guide_html = teacher_guide_html, sort_order = 12, updated_at = NOW()
     WHERE id = v_act;
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', 'Proyecto integrador · Entrega 1: alcance, área y proceso de la Clínica Montesol';
    ELSE
      UPDATE aula_activities
         SET rubric = $bpe_json${"version":1,"total":100,"criteria":[{"id":"alcance-y-fundamento-normativo","name":"Alcance y fundamento normativo","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Alcance claro y justificado; autorización, procesos y formas correctos con citas precisas."},{"level":3,"label":"Logrado","description":"Alcance correcto con alguna cita imprecisa."},{"level":2,"label":"En desarrollo","description":"Alcance general o autorización incompleta."},{"level":1,"label":"Inicial","description":"Alcance confuso o norma equivocada."},{"level":0,"label":"Sin evidencia","description":"No hay alcance."}]},{"id":"diseno-del-area-y-dotacion","name":"Diseño del área y dotación","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Plano con flujo sin cruces, cambios necesarios identificados y hoja de vida completa."},{"level":3,"label":"Logrado","description":"Plano y dotación adecuados con omisiones menores."},{"level":2,"label":"En desarrollo","description":"Plano sin flujo o dotación incompleta."},{"level":1,"label":"Inicial","description":"Elementos sueltos sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay diseño."}]},{"id":"materias-primas-y-agua","name":"Materias primas y agua","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Protocolo de cinco pasos aplicable y decisión sobre el agua bien fundamentada."},{"level":3,"label":"Logrado","description":"Protocolo correcto con un paso débil."},{"level":2,"label":"En desarrollo","description":"Protocolo genérico o decisión sobre el agua sin fundamento."},{"level":1,"label":"Inicial","description":"Lista sin procedimiento."},{"level":0,"label":"Sin evidencia","description":"No hay protocolo."}]},{"id":"guia-registro-y-etiqueta","name":"Guía, registro y etiqueta","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Documentos completos, reproducibles y coherentes entre sí, con cálculo corregido."},{"level":3,"label":"Logrado","description":"Completos con una omisión menor."},{"level":2,"label":"En desarrollo","description":"Falta uno de los tres documentos o hay pasos ambiguos."},{"level":1,"label":"Inicial","description":"Documentos mínimos."},{"level":0,"label":"Sin evidencia","description":"No hay documentos."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Documento ordenado, profesional y con citas verificables."},{"level":3,"label":"Logrado","description":"Ordenado con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Desordenado o con citas incompletas."},{"level":1,"label":"Inicial","description":"Difícil de seguir y sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$bpe_json$::jsonb, grading_method = 'rubrica', weight = 8,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Actividad bpe-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Calidad y seguridad del paciente' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Calidad y seguridad del paciente). Se salta.';
    RETURN;
  END IF;
  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = 'Proyecto integrador · Entrega final: expediente BPE de la Clínica Montesol' AND deleted_at IS NULL LIMIT 1;
  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
       extension_hint, support_html, teacher_guide_html, rubric, grading_method, allow_text, allow_link,
       allow_file, accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, 'Proyecto integrador · Entrega final: expediente BPE de la Clínica Montesol', $bpe_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> analizar, evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 y 2; deja una tabla de cambios (qué se corrigió y por qué).</li><li>Fase 3: diseña el plan de controles en proceso y finales para cada forma farmacéutica, con criterio y fuente.</li><li>Fase 3: asigna y sustenta la fecha límite de uso de las cinco fórmulas con la Tabla 4 del capítulo 795 de la USP y escribe cómo aparecerá en cada etiqueta.</li><li>Fase 3: escribe el procedimiento de farmacovigilancia y quejas con los cuatro carriles y los plazos del Manual.</li><li>Fase 3: aplica una autoinspección con al menos 20 ítems críticos o mayores del instrumento de la Resolución 444 y califica cada uno.</li><li>Prioriza las brechas encontradas y propone un plan de seis meses con responsables, fechas e indicadores.</li><li>Escribe un resumen ejecutivo de una página para la gerencia: qué está listo, qué falta y qué se necesita para pedir la visita.</li><li>Revisa el expediente con la rúbrica y súbelo al aula en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (alcance y marco).</strong> Qué elaborará el servicio y qué no; qué autorización necesita y con qué norma; qué procesos y formas farmacéuticas pedirá en el certificado; política de admisión de fórmulas y quién elabora cada una.</li>
  <li><strong>Fase 2 · Unidad 2 (establecimiento y proceso).</strong> Plano funcional del área y su flujo; dotación con hojas de vida y calibración; protocolo de recepción de materias primas y uso del agua; una guía de elaboración completa, con registro y etiqueta, para una de las cinco fórmulas.</li>
  <li><strong>Fase 3 · Unidad 3 (calidad y seguridad).</strong> Plan de controles por forma farmacéutica; fecha límite de uso sustentada para las cinco fórmulas; procedimiento de farmacovigilancia y quejas; autoinspección con el instrumento de la Resolución 444 y plan para cerrar las brechas.</li>
</ol>
<p>La entrega 1 reúne las fases 1 y 2. La entrega final integra las tres fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Integrar las fases del proyecto en un expediente coherente y corregido.</li><li>Evaluar el servicio con el instrumento de la Resolución 444 y priorizar brechas.</li><li>Diseñar los controles, las fechas límite de uso y la respuesta a eventos adversos.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 8 horas de trabajo individual en la unidad 3.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 16 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar IA para organizar, resumir tus notas o revisar la redacción, y debes declararlo en un anexo con el uso que le diste. No se acepta como fuente normativa ni para inventar datos del caso: cada cita se verifica en la fuente original y cada decisión debe estar argumentada por ti.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 16 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Integración y mejora a partir de la retroalimentación</td><td>15 %</td><td>Integra las tres fases con coherencia y documenta cada corrección.</td><td>Integra las fases y corrige lo principal.</td><td>Corrige poco o integra de forma desordenada.</td><td>Repite la entrega 1 sin cambios.</td><td>No hay integración.</td></tr>
  <tr><td>Controles y fecha límite de uso</td><td>25 %</td><td>Controles pertinentes con criterio y fuente; las cinco fechas límite correctas y bien redactadas.</td><td>Controles y fechas correctos con errores menores.</td><td>Controles generales o alguna fecha mal categorizada.</td><td>Solo inspección visual o fechas genéricas.</td><td>No hay plan.</td></tr>
  <tr><td>Farmacovigilancia y quejas</td><td>15 %</td><td>Procedimiento con cuatro carriles, plazos correctos y adaptado a magistrales.</td><td>Procedimiento correcto con una omisión menor.</td><td>Procedimiento incompleto o plazos imprecisos.</td><td>Texto genérico.</td><td>No hay procedimiento.</td></tr>
  <tr><td>Autoinspección y plan de brechas</td><td>25 %</td><td>Al menos 20 ítems bien calificados, brechas priorizadas por criterio y plan con responsables e indicadores.</td><td>Autoinspección adecuada y plan razonable.</td><td>Pocos ítems o plan sin prioridades.</td><td>Lista de deseos sin método.</td><td>No hay autoinspección.</td></tr>
  <tr><td>Resumen ejecutivo y comunicación</td><td>10 %</td><td>Resumen claro para una gerencia, con decisiones y recursos concretos.</td><td>Resumen claro con algún vacío.</td><td>Resumen técnico difícil de usar.</td><td>Resumen confuso.</td><td>No hay resumen.</td></tr>
  <tr><td>Fuentes y trazabilidad</td><td>10 %</td><td>Citas verificables con artículo o numeral y declaración de IA cuando aplica.</td><td>Citas correctas con errores menores.</td><td>Citas incompletas.</td><td>Sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$bpe_html$, $bpe_html$<h2>Caso de estudio</h2>
<p>La Clínica Montesol (ficticia) es una IPS de mediana complejidad de Pereira con servicio farmacéutico habilitado. Quiere empezar a elaborar preparaciones magistrales no estériles para pacientes pediátricos hospitalizados y ambulatorios, y la gerencia pidió tener en seis meses el expediente para solicitar el certificado de Buenas Prácticas de Elaboración al Invima. Punto de partida (datos simulados): un área disponible de 18 m² junto a la farmacia, con un baño contiguo; una nevera doméstica sin termómetro de máxima y mínima; una balanza analítica sin hoja de vida; un purificador de ósmosis inversa sin registros de mantenimiento; una química farmacéutica directora técnica, un tecnólogo en regencia de farmacia y dos auxiliares. Las cinco fórmulas que más se piden son: omeprazol 2 mg/mL en suspensión oral, hidroclorotiazida 2 mg/mL en suspensión oral, cápsulas de hidrocortisona 1 mg, crema de urea al 10 % y vaselina salicilada al 5 %. Tú eres la persona que la directora técnica encargó del proyecto. En esta entrega terminas la fase 3 e integras todo el proyecto en el expediente que la directora técnica presentará a la gerencia.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$bpe_html$, $bpe_json$["Fases 1 y 2 corregidas, con tabla de cambios.","Plan de controles por forma farmacéutica.","Fecha límite de uso de las cinco fórmulas, con fundamento y redacción para la etiqueta.","Procedimiento de farmacovigilancia y quejas.","Autoinspección con el instrumento de la Resolución 444 y plan de cierre de brechas.","Resumen ejecutivo para la gerencia."]$bpe_json$::jsonb, 'Expediente BPE de la Clínica Montesol: resumen ejecutivo, fases 1 a 3, autoinspección y plan de cierre de brechas.',
       '12 a 18 páginas más anexos, en PDF o DOCX', $bpe_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega 1 con la retroalimentación del docente, los datos simulados del caso y las tablas y figuras de las clases 7 a 9.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 2200 de 2005 (modificado por el Decreto 2330 de 2006), Resolución 1403 de 2007 y su Manual, Resolución 444 de 2008, Decreto 335 de 2022, capítulo 795 de la USP y sus preguntas frecuentes, OMS TRS 1033 (anexo 3) e ICH E2A. Cita en APA 7 o en el formato «norma, artículo o numeral».</p>$bpe_html$, NULL, $bpe_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora-a-partir-de-la-retroalimentacion","name":"Integración y mejora a partir de la retroalimentación","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las tres fases con coherencia y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra las fases y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Corrige poco o integra de forma desordenada."},{"level":1,"label":"Inicial","description":"Repite la entrega 1 sin cambios."},{"level":0,"label":"Sin evidencia","description":"No hay integración."}]},{"id":"controles-y-fecha-limite-de-uso","name":"Controles y fecha límite de uso","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Controles pertinentes con criterio y fuente; las cinco fechas límite correctas y bien redactadas."},{"level":3,"label":"Logrado","description":"Controles y fechas correctos con errores menores."},{"level":2,"label":"En desarrollo","description":"Controles generales o alguna fecha mal categorizada."},{"level":1,"label":"Inicial","description":"Solo inspección visual o fechas genéricas."},{"level":0,"label":"Sin evidencia","description":"No hay plan."}]},{"id":"farmacovigilancia-y-quejas","name":"Farmacovigilancia y quejas","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Procedimiento con cuatro carriles, plazos correctos y adaptado a magistrales."},{"level":3,"label":"Logrado","description":"Procedimiento correcto con una omisión menor."},{"level":2,"label":"En desarrollo","description":"Procedimiento incompleto o plazos imprecisos."},{"level":1,"label":"Inicial","description":"Texto genérico."},{"level":0,"label":"Sin evidencia","description":"No hay procedimiento."}]},{"id":"autoinspeccion-y-plan-de-brechas","name":"Autoinspección y plan de brechas","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Al menos 20 ítems bien calificados, brechas priorizadas por criterio y plan con responsables e indicadores."},{"level":3,"label":"Logrado","description":"Autoinspección adecuada y plan razonable."},{"level":2,"label":"En desarrollo","description":"Pocos ítems o plan sin prioridades."},{"level":1,"label":"Inicial","description":"Lista de deseos sin método."},{"level":0,"label":"Sin evidencia","description":"No hay autoinspección."}]},{"id":"resumen-ejecutivo-y-comunicacion","name":"Resumen ejecutivo y comunicación","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Resumen claro para una gerencia, con decisiones y recursos concretos."},{"level":3,"label":"Logrado","description":"Resumen claro con algún vacío."},{"level":2,"label":"En desarrollo","description":"Resumen técnico difícil de usar."},{"level":1,"label":"Inicial","description":"Resumen confuso."},{"level":0,"label":"Sin evidencia","description":"No hay resumen."}]},{"id":"fuentes-y-trazabilidad","name":"Fuentes y trazabilidad","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Citas verificables con artículo o numeral y declaración de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Citas correctas con errores menores."},{"level":2,"label":"En desarrollo","description":"Citas incompletas."},{"level":1,"label":"Inicial","description":"Sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$bpe_json$::jsonb, 'rubrica', TRUE, TRUE,
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 13, 16)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET status = 'publicado', module_id = v_unidad, instructions_html = $bpe_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> analizar, evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 y 2; deja una tabla de cambios (qué se corrigió y por qué).</li><li>Fase 3: diseña el plan de controles en proceso y finales para cada forma farmacéutica, con criterio y fuente.</li><li>Fase 3: asigna y sustenta la fecha límite de uso de las cinco fórmulas con la Tabla 4 del capítulo 795 de la USP y escribe cómo aparecerá en cada etiqueta.</li><li>Fase 3: escribe el procedimiento de farmacovigilancia y quejas con los cuatro carriles y los plazos del Manual.</li><li>Fase 3: aplica una autoinspección con al menos 20 ítems críticos o mayores del instrumento de la Resolución 444 y califica cada uno.</li><li>Prioriza las brechas encontradas y propone un plan de seis meses con responsables, fechas e indicadores.</li><li>Escribe un resumen ejecutivo de una página para la gerencia: qué está listo, qué falta y qué se necesita para pedir la visita.</li><li>Revisa el expediente con la rúbrica y súbelo al aula en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (alcance y marco).</strong> Qué elaborará el servicio y qué no; qué autorización necesita y con qué norma; qué procesos y formas farmacéuticas pedirá en el certificado; política de admisión de fórmulas y quién elabora cada una.</li>
  <li><strong>Fase 2 · Unidad 2 (establecimiento y proceso).</strong> Plano funcional del área y su flujo; dotación con hojas de vida y calibración; protocolo de recepción de materias primas y uso del agua; una guía de elaboración completa, con registro y etiqueta, para una de las cinco fórmulas.</li>
  <li><strong>Fase 3 · Unidad 3 (calidad y seguridad).</strong> Plan de controles por forma farmacéutica; fecha límite de uso sustentada para las cinco fórmulas; procedimiento de farmacovigilancia y quejas; autoinspección con el instrumento de la Resolución 444 y plan para cerrar las brechas.</li>
</ol>
<p>La entrega 1 reúne las fases 1 y 2. La entrega final integra las tres fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Integrar las fases del proyecto en un expediente coherente y corregido.</li><li>Evaluar el servicio con el instrumento de la Resolución 444 y priorizar brechas.</li><li>Diseñar los controles, las fechas límite de uso y la respuesta a eventos adversos.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 8 horas de trabajo individual en la unidad 3.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 16 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar IA para organizar, resumir tus notas o revisar la redacción, y debes declararlo en un anexo con el uso que le diste. No se acepta como fuente normativa ni para inventar datos del caso: cada cita se verifica en la fuente original y cada decisión debe estar argumentada por ti.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 16 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Integración y mejora a partir de la retroalimentación</td><td>15 %</td><td>Integra las tres fases con coherencia y documenta cada corrección.</td><td>Integra las fases y corrige lo principal.</td><td>Corrige poco o integra de forma desordenada.</td><td>Repite la entrega 1 sin cambios.</td><td>No hay integración.</td></tr>
  <tr><td>Controles y fecha límite de uso</td><td>25 %</td><td>Controles pertinentes con criterio y fuente; las cinco fechas límite correctas y bien redactadas.</td><td>Controles y fechas correctos con errores menores.</td><td>Controles generales o alguna fecha mal categorizada.</td><td>Solo inspección visual o fechas genéricas.</td><td>No hay plan.</td></tr>
  <tr><td>Farmacovigilancia y quejas</td><td>15 %</td><td>Procedimiento con cuatro carriles, plazos correctos y adaptado a magistrales.</td><td>Procedimiento correcto con una omisión menor.</td><td>Procedimiento incompleto o plazos imprecisos.</td><td>Texto genérico.</td><td>No hay procedimiento.</td></tr>
  <tr><td>Autoinspección y plan de brechas</td><td>25 %</td><td>Al menos 20 ítems bien calificados, brechas priorizadas por criterio y plan con responsables e indicadores.</td><td>Autoinspección adecuada y plan razonable.</td><td>Pocos ítems o plan sin prioridades.</td><td>Lista de deseos sin método.</td><td>No hay autoinspección.</td></tr>
  <tr><td>Resumen ejecutivo y comunicación</td><td>10 %</td><td>Resumen claro para una gerencia, con decisiones y recursos concretos.</td><td>Resumen claro con algún vacío.</td><td>Resumen técnico difícil de usar.</td><td>Resumen confuso.</td><td>No hay resumen.</td></tr>
  <tr><td>Fuentes y trazabilidad</td><td>10 %</td><td>Citas verificables con artículo o numeral y declaración de IA cuando aplica.</td><td>Citas correctas con errores menores.</td><td>Citas incompletas.</td><td>Sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$bpe_html$, case_html = $bpe_html$<h2>Caso de estudio</h2>
<p>La Clínica Montesol (ficticia) es una IPS de mediana complejidad de Pereira con servicio farmacéutico habilitado. Quiere empezar a elaborar preparaciones magistrales no estériles para pacientes pediátricos hospitalizados y ambulatorios, y la gerencia pidió tener en seis meses el expediente para solicitar el certificado de Buenas Prácticas de Elaboración al Invima. Punto de partida (datos simulados): un área disponible de 18 m² junto a la farmacia, con un baño contiguo; una nevera doméstica sin termómetro de máxima y mínima; una balanza analítica sin hoja de vida; un purificador de ósmosis inversa sin registros de mantenimiento; una química farmacéutica directora técnica, un tecnólogo en regencia de farmacia y dos auxiliares. Las cinco fórmulas que más se piden son: omeprazol 2 mg/mL en suspensión oral, hidroclorotiazida 2 mg/mL en suspensión oral, cápsulas de hidrocortisona 1 mg, crema de urea al 10 % y vaselina salicilada al 5 %. Tú eres la persona que la directora técnica encargó del proyecto. En esta entrega terminas la fase 3 e integras todo el proyecto en el expediente que la directora técnica presentará a la gerencia.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$bpe_html$,
           points_to_solve = $bpe_json$["Fases 1 y 2 corregidas, con tabla de cambios.","Plan de controles por forma farmacéutica.","Fecha límite de uso de las cinco fórmulas, con fundamento y redacción para la etiqueta.","Procedimiento de farmacovigilancia y quejas.","Autoinspección con el instrumento de la Resolución 444 y plan de cierre de brechas.","Resumen ejecutivo para la gerencia."]$bpe_json$::jsonb, expected_product = 'Expediente BPE de la Clínica Montesol: resumen ejecutivo, fases 1 a 3, autoinspección y plan de cierre de brechas.', extension_hint = '12 a 18 páginas más anexos, en PDF o DOCX',
           support_html = $bpe_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega 1 con la retroalimentación del docente, los datos simulados del caso y las tablas y figuras de las clases 7 a 9.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 2200 de 2005 (modificado por el Decreto 2330 de 2006), Resolución 1403 de 2007 y su Manual, Resolución 444 de 2008, Decreto 335 de 2022, capítulo 795 de la USP y sus preguntas frecuentes, OMS TRS 1033 (anexo 3) e ICH E2A. Cita en APA 7 o en el formato «norma, artículo o numeral».</p>$bpe_html$, teacher_guide_html = teacher_guide_html, sort_order = 13, updated_at = NOW()
     WHERE id = v_act;
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', 'Proyecto integrador · Entrega final: expediente BPE de la Clínica Montesol';
    ELSE
      UPDATE aula_activities
         SET rubric = $bpe_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora-a-partir-de-la-retroalimentacion","name":"Integración y mejora a partir de la retroalimentación","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las tres fases con coherencia y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra las fases y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Corrige poco o integra de forma desordenada."},{"level":1,"label":"Inicial","description":"Repite la entrega 1 sin cambios."},{"level":0,"label":"Sin evidencia","description":"No hay integración."}]},{"id":"controles-y-fecha-limite-de-uso","name":"Controles y fecha límite de uso","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Controles pertinentes con criterio y fuente; las cinco fechas límite correctas y bien redactadas."},{"level":3,"label":"Logrado","description":"Controles y fechas correctos con errores menores."},{"level":2,"label":"En desarrollo","description":"Controles generales o alguna fecha mal categorizada."},{"level":1,"label":"Inicial","description":"Solo inspección visual o fechas genéricas."},{"level":0,"label":"Sin evidencia","description":"No hay plan."}]},{"id":"farmacovigilancia-y-quejas","name":"Farmacovigilancia y quejas","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Procedimiento con cuatro carriles, plazos correctos y adaptado a magistrales."},{"level":3,"label":"Logrado","description":"Procedimiento correcto con una omisión menor."},{"level":2,"label":"En desarrollo","description":"Procedimiento incompleto o plazos imprecisos."},{"level":1,"label":"Inicial","description":"Texto genérico."},{"level":0,"label":"Sin evidencia","description":"No hay procedimiento."}]},{"id":"autoinspeccion-y-plan-de-brechas","name":"Autoinspección y plan de brechas","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Al menos 20 ítems bien calificados, brechas priorizadas por criterio y plan con responsables e indicadores."},{"level":3,"label":"Logrado","description":"Autoinspección adecuada y plan razonable."},{"level":2,"label":"En desarrollo","description":"Pocos ítems o plan sin prioridades."},{"level":1,"label":"Inicial","description":"Lista de deseos sin método."},{"level":0,"label":"Sin evidencia","description":"No hay autoinspección."}]},{"id":"resumen-ejecutivo-y-comunicacion","name":"Resumen ejecutivo y comunicación","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Resumen claro para una gerencia, con decisiones y recursos concretos."},{"level":3,"label":"Logrado","description":"Resumen claro con algún vacío."},{"level":2,"label":"En desarrollo","description":"Resumen técnico difícil de usar."},{"level":1,"label":"Inicial","description":"Resumen confuso."},{"level":0,"label":"Sin evidencia","description":"No hay resumen."}]},{"id":"fuentes-y-trazabilidad","name":"Fuentes y trazabilidad","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Citas verificables con artículo o numeral y declaración de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Citas correctas con errores menores."},{"level":2,"label":"En desarrollo","description":"Citas incompletas."},{"level":1,"label":"Inicial","description":"Sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$bpe_json$::jsonb, grading_method = 'rubrica', weight = 16,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Foro bpe-foro-bienvenida (bienvenida) ───────────────────────────
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con las magistrales' AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, NULL, 'curso', 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con las magistrales', 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.', $bpe_html$<h2>Para empezar</h2>
<p>Piensa en una situación que hayas vivido o presenciado —en una farmacia, en un servicio o como paciente o familiar— en la que alguien necesitó una dosis, una forma farmacéutica o un vehículo que no existía en el mercado. Cuéntala en tres o cuatro líneas, sin nombres ni datos que permitan identificar a nadie.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$bpe_html$,
       '¿Desde dónde llegas a este curso y qué decisión sobre preparaciones magistrales te gustaría poder tomar con seguridad al terminarlo?', ARRAY['¿Qué norma o documento has oído mencionar cuando se habla de magistrales en Colombia?', '¿Qué te preocupa más hoy: la norma, la técnica de elaboración o el control de calidad?']::text[], $bpe_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de establecimiento donde trabajas o estudias; cuenta tu caso breve y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su caso.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$bpe_html$,
       $bpe_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las preguntas clínicas sobre pacientes concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, un caso breve y una expectativa.</p>
$bpe_html$, 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.', 'formativa', NULL, NULL, FALSE, FALSE, 'publicado', 0)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = NULL, scope = 'curso', purpose = 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.', description = $bpe_html$<h2>Para empezar</h2>
<p>Piensa en una situación que hayas vivido o presenciado —en una farmacia, en un servicio o como paciente o familiar— en la que alguien necesitó una dosis, una forma farmacéutica o un vehículo que no existía en el mercado. Cuéntala en tres o cuatro líneas, sin nombres ni datos que permitan identificar a nadie.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$bpe_html$,
           central_question = '¿Desde dónde llegas a este curso y qué decisión sobre preparaciones magistrales te gustaría poder tomar con seguridad al terminarlo?', guiding_questions = ARRAY['¿Qué norma o documento has oído mencionar cuando se habla de magistrales en Colombia?', '¿Qué te preocupa más hoy: la norma, la técnica de elaboración o el control de calidad?']::text[],
           participation_html = $bpe_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de establecimiento donde trabajas o estudias; cuenta tu caso breve y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su caso.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$bpe_html$, rules_html = $bpe_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las preguntas clínicas sobre pacientes concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, un caso breve y una expectativa.</p>
$bpe_html$,
           no_participants_alternative = 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.', sort_order = 0, updated_at = NOW()
     WHERE id = v_foro;
  END IF;


  -- ── Foro bpe-u1-foro ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Qué es una preparación magistral' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Qué es una preparación magistral). Se salta.';
    RETURN;
  END IF;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = 'Foro de interacción 1 · Hay un producto registrado: ¿se puede o no se puede?' AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', 'Foro de interacción 1 · Hay un producto registrado: ¿se puede o no se puede?', 'Argumentar cuándo una preparación magistral está justificada aunque exista un producto registrado con la misma molécula, y qué evidencia debe quedar archivada.', $bpe_html$<h2>Caso del foro</h2>
<p>Una pediatra prescribe hidroclorotiazida en suspensión oral de 2 mg/mL para un lactante de 4 kg, con una dosis de 4 mg al día. Existe un producto registrado en tabletas de 25 mg. En la farmacia, un químico farmacéutico dice: «No se puede: la molécula tiene registro sanitario». Otra colega responde: «Sí se puede: la tableta no permite dar esa dosis a un lactante». Un tercero comparte el proyecto de circular del Invima de 2026 «para cerrar la discusión».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$bpe_html$, '¿Cuándo está justificada una preparación magistral aunque exista un medicamento registrado con el mismo principio activo, y qué evidencia debe quedar archivada para demostrarlo ante una inspección?', ARRAY['¿Qué cambia en tu análisis si el producto registrado está en desabastecimiento documentado?', '¿Cómo citarías el proyecto de circular de 2026 sin presentarlo como norma vigente?', '¿Qué harías si la fórmula pidiera la misma dosis y la misma forma del producto registrado y la única razón fuera el precio?']::text[],
       $bpe_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento normativo citado con artículo o numeral y la evidencia concreta que archivarías. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 3.34 %.</li></ul>$bpe_html$, $bpe_html$<h2>Normas de participación</h2>
<p>Discute argumentos, no personas. No compartas datos de pacientes reales ni documentos internos de empresas. Cita la fuente de cada norma o dato. Si usas herramientas de IA, decláralo y verifica cada cita en el normograma.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento normativo con evidencia (40 %) e interacción sustantiva (30 %). No se califica el número de mensajes.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica del foro (los pesos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta central y usa los datos del caso (dosis, peso, forma disponible).</td><td>Responde la pregunta central y menciona el caso.</td><td>Responde de forma general, con poca relación con el caso.</td><td>Se aleja de la pregunta central.</td><td>No hay intervención o no responde.</td></tr>
  <tr><td>Razonamiento normativo con evidencia</td><td>40 %</td><td>Distingue norma vigente y proyecto, cita artículo o numeral y propone la evidencia que archivaría.</td><td>Cita una norma pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita el proyecto como vigente.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$bpe_html$, 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a las dos posturas del caso —la del colega que dice que no y la de la colega que dice que sí—, con una evidencia distinta para cada una. Se valora con la misma rúbrica.', 'rubrica', 3.34, $bpe_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos del caso (dosis, peso, forma disponible)."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-normativo-con-evidencia","name":"Razonamiento normativo con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Distingue norma vigente y proyecto, cita artículo o numeral y propone la evidencia que archivaría."},{"level":3,"label":"Logrado","description":"Cita una norma pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita el proyecto como vigente."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$bpe_json$::jsonb,
       FALSE, FALSE, 'publicado', 1)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = v_unidad, scope = 'modulo', purpose = 'Argumentar cuándo una preparación magistral está justificada aunque exista un producto registrado con la misma molécula, y qué evidencia debe quedar archivada.', description = $bpe_html$<h2>Caso del foro</h2>
<p>Una pediatra prescribe hidroclorotiazida en suspensión oral de 2 mg/mL para un lactante de 4 kg, con una dosis de 4 mg al día. Existe un producto registrado en tabletas de 25 mg. En la farmacia, un químico farmacéutico dice: «No se puede: la molécula tiene registro sanitario». Otra colega responde: «Sí se puede: la tableta no permite dar esa dosis a un lactante». Un tercero comparte el proyecto de circular del Invima de 2026 «para cerrar la discusión».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$bpe_html$,
           central_question = '¿Cuándo está justificada una preparación magistral aunque exista un medicamento registrado con el mismo principio activo, y qué evidencia debe quedar archivada para demostrarlo ante una inspección?', guiding_questions = ARRAY['¿Qué cambia en tu análisis si el producto registrado está en desabastecimiento documentado?', '¿Cómo citarías el proyecto de circular de 2026 sin presentarlo como norma vigente?', '¿Qué harías si la fórmula pidiera la misma dosis y la misma forma del producto registrado y la única razón fuera el precio?']::text[], participation_html = $bpe_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento normativo citado con artículo o numeral y la evidencia concreta que archivarías. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 3.34 %.</li></ul>$bpe_html$,
           rules_html = $bpe_html$<h2>Normas de participación</h2>
<p>Discute argumentos, no personas. No compartas datos de pacientes reales ni documentos internos de empresas. Cita la fuente de cada norma o dato. Si usas herramientas de IA, decláralo y verifica cada cita en el normograma.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento normativo con evidencia (40 %) e interacción sustantiva (30 %). No se califica el número de mensajes.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica del foro (los pesos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta central y usa los datos del caso (dosis, peso, forma disponible).</td><td>Responde la pregunta central y menciona el caso.</td><td>Responde de forma general, con poca relación con el caso.</td><td>Se aleja de la pregunta central.</td><td>No hay intervención o no responde.</td></tr>
  <tr><td>Razonamiento normativo con evidencia</td><td>40 %</td><td>Distingue norma vigente y proyecto, cita artículo o numeral y propone la evidencia que archivaría.</td><td>Cita una norma pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita el proyecto como vigente.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$bpe_html$, no_participants_alternative = 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a las dos posturas del caso —la del colega que dice que no y la de la colega que dice que sí—, con una evidencia distinta para cada una. Se valora con la misma rúbrica.', sort_order = 1, updated_at = NOW()
     WHERE id = v_foro;
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', 'Foro de interacción 1 · Hay un producto registrado: ¿se puede o no se puede?';
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = 3.34, rubric = $bpe_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos del caso (dosis, peso, forma disponible)."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-normativo-con-evidencia","name":"Razonamiento normativo con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Distingue norma vigente y proyecto, cita artículo o numeral y propone la evidencia que archivaría."},{"level":3,"label":"Logrado","description":"Cita una norma pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita el proyecto como vigente."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$bpe_json$::jsonb
       WHERE id = v_foro;
    END IF;
  END IF;


  -- ── Foro bpe-u2-foro ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'El establecimiento y el proceso' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (El establecimiento y el proceso). Se salta.';
    RETURN;
  END IF;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = 'Foro de interacción 2 · ¿Registro o papeleo?' AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', 'Foro de interacción 2 · ¿Registro o papeleo?', 'Distinguir los datos que deben registrarse en el momento de los que pueden simplificarse, sin perder la trazabilidad.', $bpe_html$<h2>Caso del foro</h2>
<p>En una farmacia-droguería con mucha demanda, el equipo dice que diligenciar el registro de elaboración toma diez minutos por preparación. La propuesta del administrador es elaborar durante el día y llenar todos los registros al final de la jornada «con la guía al lado». La química farmacéutica duda: en la última semana hubo dos preparaciones con el mismo número interno.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$bpe_html$, '¿Qué datos del registro de elaboración deben anotarse en el momento en que ocurren, cuáles pueden simplificarse con plantillas o herramientas, y qué riesgo concreto introduce llenarlos al final del día?', ARRAY['¿Qué dato, si falta, haría imposible una investigación como la que exigió la alerta del Invima de mayo de 2026?', '¿Puede la guía de elaboración reemplazar al registro? Argumenta con el instrumento de la Resolución 444.', '¿Cómo demostrarías ante una inspección que tus registros se diligenciaron cuando ocurrieron los hechos?']::text[],
       $bpe_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial que clasifique al menos seis datos del registro en «en el momento» o «simplificable», con una razón para cada uno, y que nombre el riesgo principal de la propuesta. Después responde a dos compañeros con una comparación, una pregunta o una evidencia nueva.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 3.33 %.</li></ul>$bpe_html$, $bpe_html$<h2>Normas de participación</h2>
<p>Discute argumentos, no personas. No compartas formatos internos de empresas reales ni datos de pacientes. Cita la fuente de cada norma. Si usas IA, decláralo y verifica lo que afirma.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %). No se califica el número de mensajes.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica del foro (los pesos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Clasifica seis o más datos y nombra el riesgo de la propuesta con base en el caso.</td><td>Clasifica cuatro o cinco datos y menciona el riesgo.</td><td>Clasifica pocos datos o responde de forma general.</td><td>Se aleja de la pregunta central.</td><td>No hay intervención.</td></tr>
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Relaciona cada decisión con la trazabilidad y cita el instrumento o el Manual con precisión.</td><td>Da razones técnicas correctas con alguna cita.</td><td>Argumenta con opiniones generales.</td><td>Afirma sin justificar.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas sin contenido.</td><td>No responde ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$bpe_html$, 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, diseña una versión simplificada del registro (máximo diez campos) y explica qué riesgo controla cada campo.', 'rubrica', 3.33, $bpe_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Clasifica seis o más datos y nombra el riesgo de la propuesta con base en el caso."},{"level":3,"label":"Logrado","description":"Clasifica cuatro o cinco datos y menciona el riesgo."},{"level":2,"label":"En desarrollo","description":"Clasifica pocos datos o responde de forma general."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Relaciona cada decisión con la trazabilidad y cita el instrumento o el Manual con precisión."},{"level":3,"label":"Logrado","description":"Da razones técnicas correctas con alguna cita."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones generales."},{"level":1,"label":"Inicial","description":"Afirma sin justificar."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde ni usa la alternativa."}]}]}$bpe_json$::jsonb,
       FALSE, FALSE, 'publicado', 2)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = v_unidad, scope = 'modulo', purpose = 'Distinguir los datos que deben registrarse en el momento de los que pueden simplificarse, sin perder la trazabilidad.', description = $bpe_html$<h2>Caso del foro</h2>
<p>En una farmacia-droguería con mucha demanda, el equipo dice que diligenciar el registro de elaboración toma diez minutos por preparación. La propuesta del administrador es elaborar durante el día y llenar todos los registros al final de la jornada «con la guía al lado». La química farmacéutica duda: en la última semana hubo dos preparaciones con el mismo número interno.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$bpe_html$,
           central_question = '¿Qué datos del registro de elaboración deben anotarse en el momento en que ocurren, cuáles pueden simplificarse con plantillas o herramientas, y qué riesgo concreto introduce llenarlos al final del día?', guiding_questions = ARRAY['¿Qué dato, si falta, haría imposible una investigación como la que exigió la alerta del Invima de mayo de 2026?', '¿Puede la guía de elaboración reemplazar al registro? Argumenta con el instrumento de la Resolución 444.', '¿Cómo demostrarías ante una inspección que tus registros se diligenciaron cuando ocurrieron los hechos?']::text[], participation_html = $bpe_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial que clasifique al menos seis datos del registro en «en el momento» o «simplificable», con una razón para cada uno, y que nombre el riesgo principal de la propuesta. Después responde a dos compañeros con una comparación, una pregunta o una evidencia nueva.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 3.33 %.</li></ul>$bpe_html$,
           rules_html = $bpe_html$<h2>Normas de participación</h2>
<p>Discute argumentos, no personas. No compartas formatos internos de empresas reales ni datos de pacientes. Cita la fuente de cada norma. Si usas IA, decláralo y verifica lo que afirma.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %). No se califica el número de mensajes.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica del foro (los pesos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Clasifica seis o más datos y nombra el riesgo de la propuesta con base en el caso.</td><td>Clasifica cuatro o cinco datos y menciona el riesgo.</td><td>Clasifica pocos datos o responde de forma general.</td><td>Se aleja de la pregunta central.</td><td>No hay intervención.</td></tr>
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Relaciona cada decisión con la trazabilidad y cita el instrumento o el Manual con precisión.</td><td>Da razones técnicas correctas con alguna cita.</td><td>Argumenta con opiniones generales.</td><td>Afirma sin justificar.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas sin contenido.</td><td>No responde ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$bpe_html$, no_participants_alternative = 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, diseña una versión simplificada del registro (máximo diez campos) y explica qué riesgo controla cada campo.', sort_order = 2, updated_at = NOW()
     WHERE id = v_foro;
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', 'Foro de interacción 2 · ¿Registro o papeleo?';
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = 3.33, rubric = $bpe_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Clasifica seis o más datos y nombra el riesgo de la propuesta con base en el caso."},{"level":3,"label":"Logrado","description":"Clasifica cuatro o cinco datos y menciona el riesgo."},{"level":2,"label":"En desarrollo","description":"Clasifica pocos datos o responde de forma general."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Relaciona cada decisión con la trazabilidad y cita el instrumento o el Manual con precisión."},{"level":3,"label":"Logrado","description":"Da razones técnicas correctas con alguna cita."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones generales."},{"level":1,"label":"Inicial","description":"Afirma sin justificar."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde ni usa la alternativa."}]}]}$bpe_json$::jsonb
       WHERE id = v_foro;
    END IF;
  END IF;


  -- ── Foro bpe-u3-foro ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Calidad y seguridad del paciente' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Calidad y seguridad del paciente). Se salta.';
    RETURN;
  END IF;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = 'Foro de interacción 3 · ¿Quién avisa, cuándo y a quién?' AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', 'Foro de interacción 3 · ¿Quién avisa, cuándo y a quién?', 'Decidir cómo responder a una sospecha de evento adverso con una preparación magistral, equilibrando la atención del paciente, la contención y el reporte.', $bpe_html$<h2>Caso del foro</h2>
<p>Una dermatóloga llama a la farmacia que elabora sus fórmulas: tres pacientes que usan la misma crema despigmentante presentaron irritación intensa en la última semana; uno de ellos consultó por urgencias y salió el mismo día con tratamiento. El dueño de la farmacia propone «esperar a ver si llegan más casos antes de reportar, para no alarmar». La química farmacéutica revisa los registros: las tres cremas se elaboraron con un lote nuevo de base.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$bpe_html$, '¿Qué debe hacer la farmacia en las próximas 72 horas con los pacientes, con el producto y con el reporte, y por qué esperar más casos no es una opción defendible?', ARRAY['¿Alguno de los tres casos es serio según los criterios de la clase? Argumenta.', '¿Qué información del registro de elaboración sería decisiva para la investigación?', '¿Cómo comunicarías la situación a la dermatóloga y a los pacientes sin alarmar ni minimizar?']::text[],
       $bpe_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con un plan de cuatro carriles (paciente, producto, reporte e investigación), una decisión sobre la gravedad con su fundamento y la respuesta a la propuesta del dueño. Después responde a dos compañeros con una comparación, una pregunta o una evidencia nueva.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 3.33 %.</li></ul>$bpe_html$, $bpe_html$<h2>Normas de participación</h2>
<p>No compartas datos de pacientes reales ni casos de tu trabajo con información identificable. Cita la norma o la guía que uses. Si usas IA, decláralo y verifica los plazos en la norma que aplica a la farmacia (Manual de la Resolución 1403 o Resolución 2024015321 de 2024 del Invima).</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %). No se califica el número de mensajes.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica del foro (los pesos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Plan completo en cuatro carriles, ajustado a los datos del caso y a la propuesta del dueño.</td><td>Plan con tres carriles bien desarrollados.</td><td>Plan general con poca relación con el caso.</td><td>Se aleja de la pregunta.</td><td>No hay intervención.</td></tr>
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Decide la gravedad con criterios explícitos, cita el plazo de la norma que aplica a la farmacia y propone una investigación basada en el registro.</td><td>Decide con un criterio correcto y alguna cita.</td><td>Argumenta con opiniones o plazos imprecisos.</td><td>Acepta esperar más casos o confunde inesperado con serio.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas sin contenido.</td><td>No responde ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$bpe_html$, 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, redacta el mensaje a la dermatóloga y el reporte con los datos mínimos del Manual (datos simulados).', 'rubrica', 3.33, $bpe_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Plan completo en cuatro carriles, ajustado a los datos del caso y a la propuesta del dueño."},{"level":3,"label":"Logrado","description":"Plan con tres carriles bien desarrollados."},{"level":2,"label":"En desarrollo","description":"Plan general con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta."},{"level":0,"label":"Sin evidencia","description":"No hay intervención."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Decide la gravedad con criterios explícitos, cita el plazo de la norma que aplica a la farmacia y propone una investigación basada en el registro."},{"level":3,"label":"Logrado","description":"Decide con un criterio correcto y alguna cita."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o plazos imprecisos."},{"level":1,"label":"Inicial","description":"Acepta esperar más casos o confunde inesperado con serio."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde ni usa la alternativa."}]}]}$bpe_json$::jsonb,
       FALSE, FALSE, 'publicado', 3)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = v_unidad, scope = 'modulo', purpose = 'Decidir cómo responder a una sospecha de evento adverso con una preparación magistral, equilibrando la atención del paciente, la contención y el reporte.', description = $bpe_html$<h2>Caso del foro</h2>
<p>Una dermatóloga llama a la farmacia que elabora sus fórmulas: tres pacientes que usan la misma crema despigmentante presentaron irritación intensa en la última semana; uno de ellos consultó por urgencias y salió el mismo día con tratamiento. El dueño de la farmacia propone «esperar a ver si llegan más casos antes de reportar, para no alarmar». La química farmacéutica revisa los registros: las tres cremas se elaboraron con un lote nuevo de base.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$bpe_html$,
           central_question = '¿Qué debe hacer la farmacia en las próximas 72 horas con los pacientes, con el producto y con el reporte, y por qué esperar más casos no es una opción defendible?', guiding_questions = ARRAY['¿Alguno de los tres casos es serio según los criterios de la clase? Argumenta.', '¿Qué información del registro de elaboración sería decisiva para la investigación?', '¿Cómo comunicarías la situación a la dermatóloga y a los pacientes sin alarmar ni minimizar?']::text[], participation_html = $bpe_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con un plan de cuatro carriles (paciente, producto, reporte e investigación), una decisión sobre la gravedad con su fundamento y la respuesta a la propuesta del dueño. Después responde a dos compañeros con una comparación, una pregunta o una evidencia nueva.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 3.33 %.</li></ul>$bpe_html$,
           rules_html = $bpe_html$<h2>Normas de participación</h2>
<p>No compartas datos de pacientes reales ni casos de tu trabajo con información identificable. Cita la norma o la guía que uses. Si usas IA, decláralo y verifica los plazos en la norma que aplica a la farmacia (Manual de la Resolución 1403 o Resolución 2024015321 de 2024 del Invima).</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %). No se califica el número de mensajes.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica del foro (los pesos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Plan completo en cuatro carriles, ajustado a los datos del caso y a la propuesta del dueño.</td><td>Plan con tres carriles bien desarrollados.</td><td>Plan general con poca relación con el caso.</td><td>Se aleja de la pregunta.</td><td>No hay intervención.</td></tr>
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Decide la gravedad con criterios explícitos, cita el plazo de la norma que aplica a la farmacia y propone una investigación basada en el registro.</td><td>Decide con un criterio correcto y alguna cita.</td><td>Argumenta con opiniones o plazos imprecisos.</td><td>Acepta esperar más casos o confunde inesperado con serio.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas sin contenido.</td><td>No responde ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$bpe_html$, no_participants_alternative = 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, redacta el mensaje a la dermatóloga y el reporte con los datos mínimos del Manual (datos simulados).', sort_order = 3, updated_at = NOW()
     WHERE id = v_foro;
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', 'Foro de interacción 3 · ¿Quién avisa, cuándo y a quién?';
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = 3.33, rubric = $bpe_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Plan completo en cuatro carriles, ajustado a los datos del caso y a la propuesta del dueño."},{"level":3,"label":"Logrado","description":"Plan con tres carriles bien desarrollados."},{"level":2,"label":"En desarrollo","description":"Plan general con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta."},{"level":0,"label":"Sin evidencia","description":"No hay intervención."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Decide la gravedad con criterios explícitos, cita el plazo de la norma que aplica a la farmacia y propone una investigación basada en el registro."},{"level":3,"label":"Logrado","description":"Decide con un criterio correcto y alguna cita."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o plazos imprecisos."},{"level":1,"label":"Inicial","description":"Acepta esperar más casos o confunde inesperado con serio."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde ni usa la alternativa."}]}]}$bpe_json$::jsonb
       WHERE id = v_foro;
    END IF;
  END IF;


  -- Ya publicado: se aprueba la versión nueva con las clases completas.
  -- Si todavía no tiene su primera versión, esa primera publicación ya
  -- las incluye.
  INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
  SELECT v_curso, 'Dirección académica de Edvanta', 'Clases completas, quizzes, actividades y foros (10-nov-2026).'
   WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);


  RAISE NOTICE 'BPE y preparaciones magistrales: % clases, % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$bpe$;
