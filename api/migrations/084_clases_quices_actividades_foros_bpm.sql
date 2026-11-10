-- ============================================================
--  084_clases_quices_actividades_foros_bpm.sql — Curso de BPM completo
--
--  Generado por scripts/generar-migracion-bpm.mjs --publica a partir de
--  contenido/aula/bpm. No editar a mano.
--
--  Aprobado por la dirección académica: todos los cursos llevan quizzes,
--  actividades y foros. Las claves de los quizzes son las mismas que el
--  aula muestra al estudiante cuando envía.
--
--  Qué hace:
--   1. Actualiza los metadatos del curso, la nota mínima 70, 2 intentos
--      y la política 60/30/10.
--   2. Reemplaza el texto de las nueve clases por la versión completa,
--      conservando videos, enlaces y destacados.
--   3. Crea o actualiza PUBLICADOS tres quizzes (10 % cada uno), tres
--      actividades con rúbrica (20 % cada una) y tres foros con rúbrica
--      (3,34 + 3,33 + 3,33 %). No toca preguntas de quizzes con intentos
--      ni rúbricas o pesos de recursos con entregas o notas.
--   4. Si el curso ya está publicado, aprueba una versión nueva (077)
--      para que quien estudia vea las clases completas.
--   5. Si el curso, una unidad o una clase no está en la base, avisa y
--      se salta: nunca detiene el arranque del servidor.
-- ============================================================


DO $bpm$
DECLARE
  v_curso   BIGINT;
  v_unidad  BIGINT;
  v_clase   BIGINT;
  v_banco   BIGINT;
  v_pregunta BIGINT;
  v_eval    BIGINT;
  v_act     BIGINT;
  v_foro    BIGINT;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta'
     AND title = 'Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica'
     AND deleted_at IS NULL
   LIMIT 1;

  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso de BPM: aplica primero la migración 034. Se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió unidades o clases en el panel, no se fuerza nada.
  IF EXISTS (
    SELECT 1 FROM (VALUES
      ('De dónde salen las BPM', 'Qué son las BPM y qué problema resuelven'),
      ('De dónde salen las BPM', 'El marco normativo en Colombia'),
      ('De dónde salen las BPM', 'A quién obligan y qué certifica el INVIMA'),
      ('Las BPM en la planta', 'Personal, higiene y capacitación'),
      ('Las BPM en la planta', 'Instalaciones, áreas y equipos'),
      ('Las BPM en la planta', 'Documentación: lo que no está escrito no ocurrió'),
      ('Sostener el cumplimiento', 'Desviaciones, cambios y CAPA'),
      ('Sostener el cumplimiento', 'Autoinspección y gestión de riesgos'),
      ('Sostener el cumplimiento', 'Cómo se prepara una visita del INVIMA')
    ) AS e(unidad, clase)
     WHERE NOT EXISTS (
       SELECT 1 FROM aula_lessons l JOIN aula_modules m ON m.id = l.module_id
        WHERE l.course_id = v_curso AND m.course_id = v_curso AND l.deleted_at IS NULL AND m.deleted_at IS NULL
          AND m.title = e.unidad AND l.title = e.clase)
  ) THEN
    RAISE NOTICE 'BPM: sus unidades o clases no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET short_description = 'Curso para comprender, aplicar y sostener las Buenas Prácticas de Manufactura en una planta farmacéutica colombiana, con evidencia y criterio de inspección.',
         description_html = $bpm_html$
<p>Este curso forma a profesionales del sector farmacéutico para que comprendan por qué existen las Buenas Prácticas de Manufactura, cómo se traducen en personas, instalaciones, equipos y documentos, y cómo se sostienen con desviaciones, CAPA, riesgo y autoinspección.</p>
<p>No es un curso de definiciones para memorizar. Cada clase parte de un problema real, lo resuelve con evidencia y termina con una práctica de autoevaluación. Al final, la persona puede explicar una decisión de calidad, reconstruir un lote y responder un hallazgo de inspección con un plan verificable.</p>
<h3>Cómo está organizado</h3>
<ol>
  <li>De dónde salen las BPM: problema, norma y alcance de la certificación.</li>
  <li>Las BPM en la planta: personas, instalaciones, equipos y documentación.</li>
  <li>Sostener el cumplimiento: desviaciones, CAPA, riesgo, autoinspección y visita del INVIMA.</li>
</ol>
<p>Cada unidad tiene un quiz de cuatro preguntas, un foro y una actividad entregable. El curso se aprueba con 70/100 y se puede intentar dos veces cada quiz; se conserva la nota mayor.</p>
<h3>Resultados de aprendizaje del curso</h3>
<ul><li>Explicar por qué la calidad se construye en el proceso y no solo se verifica al final.</li><li>Ubicar los requisitos de BPM en la normativa colombiana y en las referencias internacionales.</li><li>Aplicar criterios de personal, instalaciones, equipos y documentación a situaciones de planta.</li><li>Gestionar desviaciones, cambios y CAPA con causa raíz y verificación de eficacia.</li><li>Priorizar riesgos y preparar evidencia para una visita de inspección.</li></ul>
<h3>Público</h3>
<p>Profesionales y estudiantes de últimos semestres de Química Farmacéutica, regentes de farmacia, directores técnicos, personal de aseguramiento y calidad, producción, validaciones y asuntos regulatorios. No se exige experiencia previa en planta, pero se espera familiaridad con un proceso de fabricación.</p>
<h3>Prerrequisitos</h3>
<p>Ninguno obligatorio. Se recomienda lectura básica de normas y manejo de conceptos de calidad. El curso no enseña a operar equipos ni sustituye la formación práctica de planta.</p>
<h3>Evaluación</h3>
<table>
  <caption>Distribución de la nota final</caption>
  <thead><tr><th scope="col">Componente</th><th scope="col">Peso</th><th scope="col">Elementos</th></tr></thead>
  <tbody>
    <tr><td>Actividades entregables</td><td>60 %</td><td>bpm-u1-act (20 %); bpm-u2-act (20 %); bpm-u3-act (20 %)</td></tr>
    <tr><td>Quizzes</td><td>30 %</td><td>bpm-u1-quiz (10 %); bpm-u2-quiz (10 %); bpm-u3-quiz (10 %)</td></tr>
    <tr><td>Foros</td><td>10 %</td><td>bpm-u1-foro (3.34 %); bpm-u2-foro (3.33 %); bpm-u3-foro (3.33 %)</td></tr>
    <tr><td><strong>Total</strong></td><td><strong>100 %</strong></td><td>Nota mínima de aprobación: 70/100.</td></tr>
  </tbody>
</table>
<p>Se aceptan hasta 48 horas después de la fecha límite con una reducción de 10 puntos sobre la nota de la actividad. Después de 48 horas se requiere justificación documentada y aprobación del docente.</p>
<p>Dos intentos por quiz. Se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>
<p>La intervención inicial se publica antes del cierre de la unidad. Las respuestas a compañeros pueden publicarse durante la semana siguiente. No se califica el número de mensajes, sino la calidad de la interacción.</p>
<p>Se permite el uso de herramientas de IA como apoyo de redacción, búsqueda u organización, con declaración explícita. No se acepta como fuente normativa ni como sustituto del análisis propio. El docente verifica la coherencia y la trazabilidad de las fuentes.</p>$bpm_html$,
         objective = 'Que la persona pueda reconocer si una planta cumple BPM, explicar la evidencia que lo demuestra y sostener una decisión de calidad ante una inspección, sin confundir el control del producto con el control del proceso.',
         learning_outcomes = ARRAY['Explicar por qué la calidad se construye en el proceso y no solo se verifica al final.', 'Ubicar los requisitos de BPM en la normativa colombiana y en las referencias internacionales.', 'Aplicar criterios de personal, instalaciones, equipos y documentación a situaciones de planta.', 'Gestionar desviaciones, cambios y CAPA con causa raíz y verificación de eficacia.', 'Priorizar riesgos y preparar evidencia para una visita de inspección.']::text[],
         audience = 'Profesionales y estudiantes de últimos semestres de Química Farmacéutica, regentes de farmacia, directores técnicos, personal de aseguramiento y calidad, producción, validaciones y asuntos regulatorios. No se exige experiencia previa en planta, pero se espera familiaridad con un proceso de fabricación.',
         prerequisites = 'Ninguno obligatorio. Se recomienda lectura básica de normas y manejo de conceptos de calidad. El curso no enseña a operar equipos ni sustituye la formación práctica de planta.',
         duration_minutes = 1080,
         level = 'intermedio',
         category = 'Calidad y manufactura',
         area = 'Calidad',
         tags = ARRAY['BPM', 'INVIMA', 'Calidad farmacéutica', 'Manufactura', 'Inspección']::text[],
         passing_score = 70,
         max_attempts = 2,
         grade_policy = '{"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}'::jsonb,
         publico = 'profesionales',
         updated_at = NOW()
   WHERE id = v_curso;


  -- ── bpm-u1-l1 · Qué son las BPM y qué problema resuelven ─────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'De dónde salen las BPM' AND deleted_at IS NULL
   LIMIT 1;

  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 del curso de BPM. Se salta.';
    RETURN;
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND module_id = v_unidad AND title = 'Qué son las BPM y qué problema resuelven' AND deleted_at IS NULL
   LIMIT 1;

  IF v_clase IS NULL THEN
    RAISE NOTICE 'No existe la clase Qué son las BPM y qué problema resuelven en la unidad 1. Se salta.';
    RETURN;
  END IF;

  UPDATE aula_lessons
     SET subtitle = 'Clase 1 · Introducción al curso',
         completion_rule = 'manual',
         duration_minutes = 70,
         is_required = TRUE,
         updated_at = NOW()
   WHERE id = v_clase;

  -- El texto viejo era un párrafo de apoyo. Se reemplaza por la clase
  -- completa; los videos, enlaces y destacados se conservan.
  DELETE FROM aula_lesson_blocks
   WHERE lesson_id = v_clase AND type = 'texto';

  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, jsonb_build_object('html', $bpm_html$<article class="aula-leccion" aria-labelledby="clase-bpm-u1-l1">
<p class="aula-leccion__intro">Esta clase instala la idea que sostiene todo el curso: la calidad de un medicamento se construye durante el proceso. Si esa idea queda clara, las demás clases dejan de ser una lista de requisitos y se vuelven decisiones con sentido.</p>
<p class="aula-leccion__video"><strong>Video complementario:</strong> Webinar: BPM en la industria farmacéutica · GW Certified · 53 min. Recurso complementario de consulta. Es un webinar largo: no es obligatorio verlo completo para comprender la clase. La explicación escrita que sigue es autosuficiente.</p>
<h2>Resultados de aprendizaje</h2>
<ul><li>Explicar con un ejemplo por qué una muestra del producto terminado no representa todo el lote.</li><li>Definir las BPM como un sistema de control del proceso, no como una inspección final.</li><li>Distinguir el control de calidad del aseguramiento de la calidad.</li></ul>
<h2>Prerrequisitos</h2>
<p>Ninguno. Conviene haber visto alguna vez una tabla de composición de un medicamento y saber qué es un lote.</p>
<h2>Caso de partida</h2>
<p>En una planta de Barranquilla se fabricó un jarabe pediátrico de amoxicilina. El lote pasó los análisis de aspecto, pH, contenido y uniformidad. Se liberó y se distribuyó. Tres semanas después, varias farmacias reportaron un olor anormal y un sedimento en el fondo del frasco. La investigación encontró que el conservante se había añadido después de enfriar el jarabe y que la mezcla final no fue homogénea. El análisis del producto terminado no podía ver ese error de proceso: la muestra analizada provenía de la parte superior del tanque.</p>

<h3>La ilusión del control final</h3>
<p>Cuando un lote de medicamento sale de la planta, el control de calidad analiza una muestra. Esa muestra es una fracción pequeña del lote. Si el lote tiene un millón de tabletas y se analizan veinte, las veinte no representan automáticamente a las 999.980 restantes. La muestra puede ser buena y el lote no.</p>
<p>El problema no es que el laboratorio analice mal. El problema es estadístico: si una falla está distribuida de forma heterogénea, una muestra pequeña puede no encontrarla. Y hay atributos que el análisis del producto terminado simply no puede demostrar, como la esterilidad de un lote completo o la ausencia de un residuo que solo aparece en una parte del tanque.</p>
<p>Por eso las Buenas Prácticas de Manufactura desplazan el foco: en lugar de preguntar al final «¿salió bien?», preguntan en cada paso «¿se hizo de una manera que no pudiera salir mal?». La calidad se construye, se verifica y se documenta durante el proceso.</p>

<h3>Qué son las BPM, en una frase</h3>
<p>Las BPM son el conjunto de requisitos y prácticas que aseguran que un medicamento se fabrica y controla de forma consistente, según normas de calidad apropiadas, y que cada lote es trazable hasta las materias primas, las personas, los equipos y las condiciones en que se produjo. No son un manual de marketing ni una certificación decorativa: son una exigencia legal para quien fabrica medicamentos.</p>
<p>Las BPM cubren, como mínimo, seis frentes: personal, instalaciones y equipos, documentación, producción, control de calidad y gestión de la calidad. Cada frente existe porque hay una forma concreta de perder la calidad si falla.</p>

<h3>Un ejemplo resuelto: qué probabilidad tiene la muestra de detectar el problema</h3>
<p>Supongamos un lote de 1.000.000 de unidades en el que el 0,1 % está defectuoso, es decir, 1.000 unidades. Se toma una muestra de 20 unidades al azar. Para simplificar, tratamos la muestra como si cada unidad se eligiera de forma independiente. La probabilidad de que una unidad sea buena es 0,999. La probabilidad de que las 20 sean buenas es:</p>
<p><strong>P(20 buenas) = 0,999<sup>20</sup> ≈ 0,9802</strong></p>
<p>Eso significa que la probabilidad de detectar al menos una unidad defectuosa es solo del <strong>1,98 %</strong>. En otras palabras, en 98 de cada 100 lotes con ese nivel de defecto, la muestra de 20 no encontraría nada. El cálculo no demuestra que el muestreo sea inútil; demuestra que el muestreo tiene límites y que no puede ser la única barrera.</p>
<p>Ahora cambiemos el escenario: si el defecto está concentrado en el fondo del tanque y la muestra se toma de la superficie, la probabilidad de detectarlo puede ser cero, aunque el lote tenga miles de unidades defectuosas. Esa es la diferencia entre un problema estadístico y un problema de proceso. Las BPM atacan el segundo.</p>

<h3>Control de calidad y aseguramiento de la calidad no son lo mismo</h3>
<p>El control de calidad analiza y decide sobre muestras y lotes. El aseguramiento de la calidad diseña el sistema para que el control tenga sentido: procedimientos, capacitación, calibración, validación, auditoría, gestión de desviaciones y mejora. Las BPM son el marco del aseguramiento; el control de calidad es una de sus herramientas, no su reemplazo.</p>

<table>
  <caption>Tabla 1. Dos formas de mirar la misma calidad</caption>
  <thead>
    <tr><th scope="col">Pregunta</th><th scope="col">Control final</th><th scope="col">BPM y aseguramiento</th></tr>
  </thead>
  <tbody>
    <tr><td>¿Cuándo actúa?</td><td>Al final del proceso, sobre una muestra.</td><td>En cada paso, sobre el proceso y sus registros.</td></tr>
    <tr><td>¿Qué puede detectar?</td><td>Lo que la muestra contiene y el método puede medir.</td><td>Condiciones, decisiones, errores y desviaciones que producen el defecto.</td></tr>
    <tr><td>¿Qué no puede detectar?</td><td>Defectos heterogéneos, atributos no medibles en la muestra, errores ya corregidos en el papel.</td><td>Nada por sí solo: necesita evidencia y verificación.</td></tr>
    <tr><td>¿Qué evita?</td><td>Liberar un lote que no cumple la especificación.</td><td>Producir un lote que no debería existir.</td></tr>
  </tbody>
</table>

<h3>Lo que las BPM no son</h3>
<ul>
  <li>No son un documento que se archiva para la visita. Son una forma de trabajar que se demuestra con registros.</li>
  <li>No son lo mismo que el registro sanitario. El registro dice qué producto puede venderse; las BPM dicen cómo se fabrica.</li>
  <li>No son una garantía automática de calidad. Son un sistema de control; si se convierte en papeleo, deja de controlar.</li>
</ul>

<h3>Por qué esta clase importa para tu trabajo</h3>
<p>Si trabajas en planta, en un servicio farmacéutico, en aseguramiento o en regulatorio, vas a tomar decisiones que afectan la calidad: aprobar una materia prima, liberar un lote, responder una desviación, preparar una visita. Las BPM te dan el criterio para decidir y, sobre todo, para explicar por qué decidiste así. Un criterio sin evidencia no se puede defender; una evidencia sin criterio se convierte en trámite.</p>


<h2>Mapa de relaciones</h2>
<p>Lee el mapa de izquierda a derecha: cada fila declara una relación y explica por qué existe. No es una lista de definiciones sueltas; es la estructura que conecta los conceptos de la clase.</p>

<table>
  <caption>Mapa de relaciones de la clase</caption>
  <thead><tr><th scope="col">Concepto A</th><th scope="col">Relación</th><th scope="col">Concepto B</th><th scope="col">Por qué</th></tr></thead>
  <tbody>
    <tr><td>Calidad del medicamento</td><td>se construye en</td><td>El proceso de fabricación</td><td>Porque el análisis de una muestra no representa todo el lote.</td></tr>
    <tr><td>Proceso controlado</td><td>se verifica mediante</td><td>Registros, calibración y capacitación</td><td>Sin evidencia, no se puede demostrar que el proceso ocurrió como estaba definido.</td></tr>
    <tr><td>BPM</td><td>se exigen por</td><td>Resolución 1160 de 2016</td><td>Es la norma colombiana que adopta los manuales de BPM y autoinspección.</td></tr>
    <tr><td>Registro sanitario</td><td>se diferencia de</td><td>Certificado de BPM</td><td>El primero autoriza el producto; el segundo demuestra que la fabricación cumple.</td></tr>
    <tr><td>Control de calidad</td><td>depende de</td><td>Aseguramiento de la calidad</td><td>El control analiza; el aseguramiento diseña el sistema que hace confiable ese análisis.</td></tr>
  </tbody>
</table>

<h2>Errores frecuentes y cómo corregirlos</h2>
<ul><li>Creer que un lote que pasó los análisis está automáticamente bien fabricado. Corrección: revisa también el proceso, los registros y las desviaciones.</li><li>Confundir BPM con registro sanitario. Corrección: separa las dos preguntas: ¿puedo vender este producto? y ¿puedo demostrar que lo fabriqué bien?</li><li>Pensar que la muestra de control representa siempre al lote. Corrección: pregunta cómo se tomó, de dónde y con qué tamaño; un muestreo mal diseñado no prueba nada.</li><li>Tratar la documentación como una tarea administrativa posterior. Corrección: el registro se llena cuando ocurre el hecho; si se llena después, pierde valor probatorio.</li></ul>
<h2>Práctica de autoevaluación</h2>

<p>Clasifica cada situación como un problema de <strong>control final</strong>, de <strong>proceso (BPM)</strong> o de <strong>ambos</strong>. Justifica en una frase.</p>
<ol>
  <li>El laboratorio analiza 10 tabletas de un lote de 500.000 y todas cumplen, pero el mezclador tenía residuo del producto anterior.</li>
  <li>Una farmacia recibe un lote con el inserto equivocado, aunque el producto a granel cumple la especificación.</li>
  <li>El operario firmó el registro de fabricación al final del turno, de memoria, y anotó una temperatura que no midió.</li>
  <li>El proveedor de una materia prima cambió el proceso sin avisar y el certificado de análisis sigue siendo válido para el lote anterior.</li>
</ol>
<details>
  <summary>Ver solución comentada</summary>
  
<ol>
  <li><strong>Proceso.</strong> El residuo del producto anterior es una falla de limpieza y de control de contaminación cruzada; la muestra puede no verla.</li>
  <li><strong>Ambos.</strong> El producto a granel puede cumplir, pero el inserto equivocado es un error de envasado y de control final; además exige evaluar el impacto en el lote.</li>
  <li><strong>Proceso y documentación.</strong> La temperatura no medida es un dato no atribuible ni contemporáneo; rompe la cadena de evidencia.</li>
  <li><strong>Proceso y proveedor.</strong> El certificado del lote anterior no cubre el cambio; hay que evaluar el cambio y la materia prima recibida.</li>
</ol>
</details>
<h2>Síntesis y puente</h2>
<p>La calidad se construye en el proceso y se demuestra con evidencia. En la próxima clase verás qué norma exige ese sistema en Colombia y cómo se relaciona con el registro sanitario, para que no confundas dos controles que actúan en momentos distintos.</p>

<h2>Referencias consultadas</h2>
<ol>
<li>Ministerio de Salud y Protección Social de Colombia. <em>Resolución 1160 de 2016</em> (2016). Adopta los manuales de Buenas Prácticas de Manufactura y de autoinspección que se citan en la clase. <a href="https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%201160%20de%202016.pdf" target="_blank" rel="noopener noreferrer nofollow">https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%201160%20de%202016.pdf</a>. Consultado: 2026-11-03.</li>
<li>Organización Mundial de la Salud. <em>WHO good manufacturing practices for pharmaceutical products: main principles (TRS 986, Annex 2)</em> (2014). Marco internacional de las BPM y de la lógica de control del proceso. <a href="https://www.who.int/publications/m/item/trs986-annex2" target="_blank" rel="noopener noreferrer nofollow">https://www.who.int/publications/m/item/trs986-annex2</a>. Consultado: 2026-11-03.</li>
<li>Ministerio de Salud de Colombia. <em>Decreto 677 de 1995</em> (1995). Diferencia el régimen del registro sanitario del sistema de fabricación. <a href="https://www.minsalud.gov.co/Normatividad_Nuevo/DECRETO%200677%20DE%201995.pdf" target="_blank" rel="noopener noreferrer nofollow">https://www.minsalud.gov.co/Normatividad_Nuevo/DECRETO%200677%20DE%201995.pdf</a>. Consultado: 2026-11-03.</li>
<li>International Council for Harmonisation. <em>ICH Q10: Pharmaceutical Quality System</em> (2008). Sostiene la idea de sistema de calidad y mejora continua que se desarrolla en las unidades 2 y 3. <a href="https://database.ich.org/sites/default/files/Q10%20Guideline.pdf" target="_blank" rel="noopener noreferrer nofollow">https://database.ich.org/sites/default/files/Q10%20Guideline.pdf</a>. Consultado: 2026-11-03.</li>
</ol>
</article>$bpm_html$));


  -- ── bpm-u1-l2 · El marco normativo en Colombia ─────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'De dónde salen las BPM' AND deleted_at IS NULL
   LIMIT 1;

  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 del curso de BPM. Se salta.';
    RETURN;
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND module_id = v_unidad AND title = 'El marco normativo en Colombia' AND deleted_at IS NULL
   LIMIT 1;

  IF v_clase IS NULL THEN
    RAISE NOTICE 'No existe la clase El marco normativo en Colombia en la unidad 1. Se salta.';
    RETURN;
  END IF;

  UPDATE aula_lessons
     SET subtitle = 'Clase 2 · Normativa y jerarquía',
         completion_rule = 'manual',
         duration_minutes = 65,
         is_required = TRUE,
         updated_at = NOW()
   WHERE id = v_clase;

  -- El texto viejo era un párrafo de apoyo. Se reemplaza por la clase
  -- completa; los videos, enlaces y destacados se conservan.
  DELETE FROM aula_lesson_blocks
   WHERE lesson_id = v_clase AND type = 'texto';

  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, jsonb_build_object('html', $bpm_html$<article class="aula-leccion" aria-labelledby="clase-bpm-u1-l2">
<p class="aula-leccion__intro">Una norma no se estudia de memoria: se aprende a ubicarla. Esta clase te da el mapa para saber qué documento abrir cuando aparece una pregunta de BPM y cómo citarlo sin equivocarte.</p>
<p class="aula-leccion__video"><strong>Sin video obligatorio.</strong> Esta clase se aprende con el texto y los recursos de lectura; no necesitas reproducir un video para comprenderla.</p>
<h2>Resultados de aprendizaje</h2>
<ul><li>Ubicar la Resolución 1160 de 2016 dentro del marco sanitario colombiano.</li><li>Distinguir qué regula la Resolución 1160 y qué regula el Decreto 677 de 1995.</li><li>Leer una norma larga por su articulado, su manual técnico y su manual de autoinspección.</li></ul>
<h2>Prerrequisitos</h2>
<p>Haber comprendido la diferencia entre construir la calidad y controlarla al final.</p>
<h2>Caso de partida</h2>
<p>En una auditoría interna, el jefe de producción dice: «Nosotros ya tenemos registro sanitario, así que no necesitamos certificado de BPM». El auditor le muestra que son dos requisitos distintos y que la planta no tiene certificación para la línea de inyectables. La discusión se resolvió leyendo la norma, no discutiendo opiniones.</p>

<h3>Una norma dentro de un sistema</h3>
<p>En Colombia, la fabricación de medicamentos se regula por un conjunto de normas que actúan en capas. La Ley 9 de 1979 establece el marco sanitario general. El Decreto 677 de 1995 regula el régimen de registros y licencias, el control de calidad y la vigilancia sanitaria de medicamentos. La Resolución 1160 de 2016 adopta los manuales de Buenas Prácticas de Manufactura y de autoinspección. Y debajo de esas capas están las referencias técnicas internacionales, como el Informe 32 de la OMS, que la propia resolución recoge.</p>
<p>Entender esa arquitectura evita dos errores frecuentes: citar una norma que no corresponde y creer que una certificación cubre más de lo que cubre.</p>

<h3>Qué regula cada documento</h3>
<table>
  <caption>Tabla 1. Normas que suelen confundirse</caption>
  <thead><tr><th scope="col">Documento</th><th scope="col">Qué regula</th><th scope="col">A quién obliga</th><th scope="col">Qué no resuelve</th></tr></thead>
  <tbody>
    <tr><td>Ley 9 de 1979</td><td>Marco sanitario general y medidas de control.</td><td>A las actividades que afectan la salud.</td><td>No detalla cómo fabricar un medicamento.</td></tr>
    <tr><td>Decreto 677 de 1995</td><td>Registro sanitario, licencias, control de calidad y vigilancia.</td><td>Titulares, fabricantes, importadores y comercializadores.</td><td>No es el manual técnico de BPM.</td></tr>
    <tr><td>Resolución 1160 de 2016</td><td>Manuales de BPM y de autoinspección.</td><td>Fabricantes de medicamentos y demás sujetos alcanzados por la norma.</td><td>No autoriza la venta de un producto.</td></tr>
    <tr><td>Informe 32 de la OMS</td><td>Principios internacionales de BPM.</td><td>Referencia técnica, no obligación directa.</td><td>No sustituye la norma colombiana.</td></tr>
  </tbody>
</table>

<h3>Cómo leer una norma larga sin perderte</h3>
<p>La Resolución 1160 tiene un articulado corto y dos anexos extensos. Un orden que funciona:</p>
<ol>
  <li><strong>Articulado.</strong> Responde a quién obliga, desde cuándo y qué adopta. Es la puerta de entrada.</li>
  <li><strong>Manual de BPM.</strong> Es el anexo técnico. Está organizado por capítulos: personal, instalaciones, equipos, documentación, producción, control de calidad.</li>
  <li><strong>Manual de autoinspección.</strong> Es la lista con la que la planta se evalúa. Se entiende mejor después de conocer el manual técnico.</li>
  <li><strong>Normas internacionales.</strong> Sirven para interpretar el sentido de un requisito y para anticipar cambios, pero no reemplazan la norma nacional.</li>
</ol>
<p>Cuando encuentres una pregunta concreta, no leas la norma completa: localiza el capítulo, identifica el requisito y busca la evidencia que lo demuestra. Ese es el trabajo real de un profesional de calidad.</p>

<h3>Ejemplo resuelto: ubicar un hallazgo</h3>
<p>Un inspector observa que el registro de capacitación de un operario no tiene evaluación de comprensión, solo la lista de asistencia. ¿Qué norma y qué capítulo deberías citar?</p>
<p><strong>Razonamiento:</strong> el hallazgo no es de registro sanitario; es de personal y de documentación. La respuesta se busca en el manual de BPM de la Resolución 1160, en el capítulo de personal, y se conecta con el requisito de capacitación documentada. La evidencia que falta no es «más carpetas», sino un registro que demuestre que el operario comprendió el procedimiento. La respuesta al hallazgo debe incluir la corrección, la causa raíz y la verificación de eficacia.</p>
<p>Si hubieras citado el Decreto 677, habrías respondido con la norma equivocada. Ese error es frecuente y resta credibilidad al plan de acción.</p>

<h3>El principio de jerarquía y el principio de especialidad</h3>
<p>Cuando dos normas parecen contradecirse, primero se aplica la de mayor jerarquía y, dentro de la misma jerarquía, la especial. Pero en la práctica casi nunca hay contradicción: hay normas que regulan cosas distintas. La Resolución 1160 no deroga el Decreto 677; lo complementa. Una planta necesita cumplir ambos.</p>
<p>También conviene distinguir «vigente» de «actualizado». Una norma puede seguir vigente y haber sido modificada por otra. Antes de citar un artículo en un expediente, verifica en el normograma del INVIMA o en el portal del Ministerio de Salud que la versión que tienes es la vigente.</p>

<h2>Segundo caso contrastado</h2>
<h3>Caso contrastado: dos empresas, dos errores distintos</h3>
<p><strong>Empresa A</strong> fabrica un medicamento con registro sanitario vigente, pero su planta no tiene certificación de BPM para la línea. El gerente cree que el registro es suficiente y rechaza la auditoría de un cliente. <strong>Empresa B</strong> tiene una planta certificada en BPM para sólidos orales, pero el producto que vende no tiene registro sanitario porque «el trámite está en curso». Los dos cometieron el mismo error de fondo: confundir dos controles que actúan en momentos distintos.</p>
<p>La empresa A puede vender un producto autorizado, pero no puede demostrar que lo fabrica bajo un sistema certificado. La empresa B puede demostrar que fabrica bien, pero no puede vender legalmente el producto. Ninguna de las dos está completa. La primera necesita cerrar la brecha de BPM; la segunda, la del registro. Si un cliente o un inspector pregunta, la respuesta correcta no es «tenemos uno de los dos», sino «tenemos este control y nos falta este otro, con este plan y esta fecha».</p>
<p>En una situación real, esa distinción también cambia la conversación con la dirección. Pedir presupuesto para una certificación de BPM no es lo mismo que pedir presupuesto para un registro sanitario: son áreas, tiempos y evidencias distintas. Un profesional que no distingue los dos controles pierde credibilidad cuando intenta explicar por qué la empresa no puede lanzar un producto aunque «la planta esté certificada».</p>
<h3>Cómo verificar la vigencia de una norma en la práctica</h3>
<p>Antes de citar una norma en un informe, haz tres comprobaciones: (1) busca el documento en el normograma del INVIMA o en el portal del Ministerio de Salud; (2) revisa si tiene una nota de modificación o una norma posterior que la sustituya; (3) confirma que el artículo que citas sigue vigente y que corresponde al tema. Si no puedes acceder a la fuente oficial, no inventes la cita: escribe «pendiente de verificación» en el borrador interno y resuélvelo antes de radicar.</p>
<p>Un caso frecuente es citar una norma de otro país como si fuera colombiana. Las guías de la OMS, ICH o PIC/S son referencias técnicas valiosas, pero la obligación legal en Colombia nace de la norma nacional que las adopta. Citar bien no es un adorno: es parte de la competencia regulatoria.</p>

<h2>Mapa de relaciones</h2>
<p>Lee el mapa de izquierda a derecha: cada fila declara una relación y explica por qué existe. No es una lista de definiciones sueltas; es la estructura que conecta los conceptos de la clase.</p>

<table>
  <caption>Mapa de relaciones normativas</caption>
  <thead><tr><th scope="col">Norma o documento</th><th scope="col">Se relaciona con</th><th scope="col">Tipo de relación</th><th scope="col">Consecuencia práctica</th></tr></thead>
  <tbody>
    <tr><td>Ley 9 de 1979</td><td>Decreto 677 de 1995 y Resolución 1160 de 2016</td><td>Marco general que se desarrolla</td><td>Da fundamento sanitario a las normas específicas.</td></tr>
    <tr><td>Resolución 1160 de 2016</td><td>Informe 32 de la OMS</td><td>Adopta y adapta</td><td>El vocabulario técnico es comparable con el internacional.</td></tr>
    <tr><td>Resolución 1160 de 2016</td><td>Decreto 677 de 1995</td><td>Complementa, no sustituye</td><td>Una planta necesita BPM y el producto necesita registro.</td></tr>
    <tr><td>Manual de autoinspección</td><td>Manual de BPM</td><td>Verifica el cumplimiento del primero</td><td>La autoinspección usa el mismo estándar que la inspección externa.</td></tr>
    <tr><td>Norma vigente</td><td>Norma modificada</td><td>Requiere verificación de versión</td><td>No cites un artículo sin comprobar su vigencia.</td></tr>
  </tbody>
</table>

<h2>Errores frecuentes y cómo corregirlos</h2>
<ul><li>Citar el Decreto 677 para un hallazgo de fabricación. Corrección: identifica primero si el problema es del producto (registro) o del proceso (BPM).</li><li>Leer la resolución completa sin un objetivo. Corrección: empieza por el articulado y localiza el capítulo que responde tu pregunta.</li><li>Usar una copia antigua de la norma. Corrección: verifica la versión en el normograma del INVIMA o en el portal del Ministerio.</li><li>Creer que una guía internacional es obligatoria en Colombia. Corrección: úsala como referencia técnica y cita la norma nacional que la adopta.</li></ul>
<h2>Práctica de autoevaluación</h2>

<p>Para cada situación, indica qué documento consultarías primero y por qué.</p>
<ol>
  <li>Necesitas saber si una planta puede fabricar un producto sin certificado de BPM.</li>
  <li>Necesitas saber qué información debe llevar el registro de fabricación de un lote.</li>
  <li>Necesitas saber si un cambio de excipiente exige modificar el registro sanitario.</li>
  <li>Necesitas saber cómo se programa una autoinspección.</li>
</ol>
<details>
  <summary>Ver solución comentada</summary>
  
<ol>
  <li>Resolución 1160 de 2016 y el Decreto 677 de 1995: el primero exige BPM; el segundo regula el registro del producto. La respuesta completa exige ambos.</li>
  <li>Manual de BPM de la Resolución 1160, capítulo de documentación y producción.</li>
  <li>Decreto 677 de 1995 y las normas de modificaciones del registro; además, el control de cambios de la empresa.</li>
  <li>Manual de autoinspección de la Resolución 1160.</li>
</ol>
</details>
<h2>Síntesis y puente</h2>
<p>Ya tienes el mapa normativo. En la próxima clase verás cómo se traduce en una certificación concreta: qué se certifica, con qué alcance y qué evidencia se espera. Esa distinción evita prometer más de lo que la planta puede demostrar.</p>

<h2>Referencias consultadas</h2>
<ol>
<li>Ministerio de Salud y Protección Social de Colombia. <em>Resolución 1160 de 2016</em> (2016). Articulado, manual de BPM y manual de autoinspección. <a href="https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%201160%20de%202016.pdf" target="_blank" rel="noopener noreferrer nofollow">https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%201160%20de%202016.pdf</a>. Consultado: 2026-11-03.</li>
<li>Ministerio de Salud de Colombia. <em>Decreto 677 de 1995</em> (1995). Régimen de registro sanitario y vigilancia. <a href="https://www.minsalud.gov.co/Normatividad_Nuevo/DECRETO%200677%20DE%201995.pdf" target="_blank" rel="noopener noreferrer nofollow">https://www.minsalud.gov.co/Normatividad_Nuevo/DECRETO%200677%20DE%201995.pdf</a>. Consultado: 2026-11-03.</li>
<li>Organización Mundial de la Salud. <em>WHO good manufacturing practices for pharmaceutical products: main principles (TRS 986, Annex 2)</em> (2014). Referencia técnica que inspira la norma colombiana. <a href="https://www.who.int/publications/m/item/trs986-annex2" target="_blank" rel="noopener noreferrer nofollow">https://www.who.int/publications/m/item/trs986-annex2</a>. Consultado: 2026-11-03.</li>
</ol>
</article>$bpm_html$));


  -- ── bpm-u1-l3 · A quién obligan y qué certifica el INVIMA ─────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'De dónde salen las BPM' AND deleted_at IS NULL
   LIMIT 1;

  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 del curso de BPM. Se salta.';
    RETURN;
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND module_id = v_unidad AND title = 'A quién obligan y qué certifica el INVIMA' AND deleted_at IS NULL
   LIMIT 1;

  IF v_clase IS NULL THEN
    RAISE NOTICE 'No existe la clase A quién obligan y qué certifica el INVIMA en la unidad 1. Se salta.';
    RETURN;
  END IF;

  UPDATE aula_lessons
     SET subtitle = 'Clase 3 · Alcance de la certificación',
         completion_rule = 'manual',
         duration_minutes = 65,
         is_required = TRUE,
         updated_at = NOW()
   WHERE id = v_clase;

  -- El texto viejo era un párrafo de apoyo. Se reemplaza por la clase
  -- completa; los videos, enlaces y destacados se conservan.
  DELETE FROM aula_lesson_blocks
   WHERE lesson_id = v_clase AND type = 'texto';

  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, jsonb_build_object('html', $bpm_html$<article class="aula-leccion" aria-labelledby="clase-bpm-u1-l3">
<p class="aula-leccion__intro">Una certificación no es un título de la empresa: es una declaración sobre un alcance concreto. Esta clase te enseña a leerla, a verificarla y a preparar la evidencia que la sostiene.</p>
<p class="aula-leccion__video"><strong>Sin video obligatorio.</strong> Esta clase se aprende con el texto y los recursos de lectura; no necesitas reproducir un video para comprenderla.</p>
<h2>Resultados de aprendizaje</h2>
<ul><li>Interpretar el alcance de un certificado de BPM por línea, área o grupo de productos.</li><li>Determinar qué evidencia debe existir para sostener una certificación.</li><li>Explicar la diferencia entre hallazgo crítico, mayor y menor en una visita.</li></ul>
<h2>Prerrequisitos</h2>
<p>Manejo del mapa normativo de la clase anterior.</p>
<h2>Caso de partida</h2>
<p>Una comercializadora presume ante un cliente que «su fabricante tiene BPM». Envía un certificado que cubre sólidos orales. El cliente pregunta si también puede fabricar una suspensión estéril. La respuesta correcta no es sí ni no: es «muéstrame el alcance del certificado y la línea».</p>

<h3>Se certifica un alcance, no una empresa</h3>
<p>La certificación de BPM se otorga después de una visita a una planta y cubre un alcance determinado: una línea, un área, un grupo de formas farmacéuticas o un proceso. Por eso una misma empresa puede estar certificada para sólidos orales y no para inyectables, o tener certificada una planta y no otra. Cuando alguien dice «estamos certificados», la pregunta profesional es: <em>¿para qué alcance y con qué vigencia?</em></p>
<p>La razón es técnica. Fabricar una tableta y fabricar una solución estéril no comparten los mismos riesgos: cambian las áreas, el aire, el agua, la validación, la formación y los controles. Certificar toda la empresa por haber inspeccionado una línea sería certificar lo que no se vio.</p>

<h3>Qué debe poder demostrar una planta</h3>
<p>El inspector no viene a escuchar promesas. Viene a pedir evidencia. La lógica es simple: si un requisito no se puede demostrar con un documento o una observación, para efectos de la inspección no existe. Los cuatro grupos de evidencia que más se piden son:</p>
<ul>
  <li><strong>Personas:</strong> hojas de vida, descripción de cargos, programa de capacitación, registros de asistencia y evaluación, exámenes médicos cuando aplican.</li>
  <li><strong>Instalaciones y equipos:</strong> planos, flujos, clasificación de áreas, presiones diferenciales, calibración y mantenimiento.</li>
  <li><strong>Documentación:</strong> procedimientos vigentes, fórmula maestra, registros de lote, especificaciones, certificados de análisis.</li>
  <li><strong>Control:</strong> desviaciones, cambios, CAPA, autoinspecciones, validaciones y tendencias de calidad.</li>
</ul>

<h3>Ejemplo resuelto: leer un certificado</h3>
<p>Un certificado dice: «Se certifica que la planta ubicada en la dirección X cumple con las Buenas Prácticas de Manufactura para la línea de fabricación de formas farmacéuticas sólidas no estériles». Un cliente pide cotización para un jarabe. ¿Sirve?</p>
<p><strong>Razonamiento:</strong> el alcance es «sólidas no estériles»; un jarabe es una forma líquida no estéril. Aunque la planta sea la misma, la línea y los procesos son distintos. La respuesta correcta es solicitar la certificación que cubra líquidos orales o verificar si el fabricante tiene otra línea certificada. No se puede extrapolar el alcance.</p>
<p>Si el certificado no indica el alcance con precisión, hay que pedir la resolución o el documento completo. Un PDF genérico sin alcance no es evidencia suficiente.</p>

<h3>Hallazgos: no todos pesan igual</h3>
<table>
  <caption>Tabla 1. Cómo se leen los hallazgos de una visita</caption>
  <thead><tr><th scope="col">Tipo</th><th scope="col">Qué significa</th><th scope="col">Ejemplo</th><th scope="col">Respuesta esperada</th></tr></thead>
  <tbody>
    <tr><td>Crítico</td><td>Afecta directamente la seguridad del paciente o invalida el sistema.</td><td>Falta de control de esterilidad en una línea estéril.</td><td>Contención, investigación y acción inmediata; puede impedir la certificación.</td></tr>
    <tr><td>Mayor</td><td>Incumplimiento importante que puede afectar la calidad si no se corrige.</td><td>Capacitación sin evaluación o calibración vencida en un equipo crítico.</td><td>Plan de acción con causa raíz y verificación de eficacia.</td></tr>
    <tr><td>Menor</td><td>Desviación documental o de práctica que no afecta directamente al producto.</td><td>Una firma incompleta en un registro.</td><td>Corrección y prevención; seguimiento en la próxima visita.</td></tr>
  </tbody>
</table>
<p>La clasificación exacta depende del marco del inspector y del contexto. Lo que no cambia es la lógica: un hallazgo repetido es más grave que uno nuevo, porque demuestra que el plan anterior no funcionó.</p>

<h3>Lo que la certificación no garantiza</h3>
<ul>
  <li>No garantiza que todos los lotes sean conformes: garantiza que el sistema y el alcance inspeccionados cumplen.</li>
  <li>No cubre productos o líneas fuera del alcance.</li>
  <li>No sustituye el registro sanitario ni las pruebas de liberación de cada lote.</li>
  <li>No es permanente: tiene vigencia y puede suspenderse o retirarse.</li>
</ul>

<h2>Segundo caso contrastado</h2>
<h3>Caso contrastado: el certificado que no decía el alcance</h3>
<p>Una empresa recibe de su fabricante un certificado de BPM en inglés, sin traducción, que dice «the facility complies with GMP». No indica producto, línea ni forma farmacéutica. El comprador lo archiva como prueba suficiente. Meses después, un cliente institucional pregunta por la certificación de la línea de óvulos vaginales y descubre que el certificado cubría solo tabletas. La empresa no puede demostrar el alcance porque nunca lo pidió.</p>
<p>La lección es doble. Primero, un certificado sin alcance no es evidencia suficiente: hay que pedir la resolución o el documento completo, con la línea, la forma farmacéutica, la planta y la vigencia. Segundo, si el documento está en otro idioma, se necesita una traducción oficial o, al menos, una traducción verificable para el uso interno; no se puede citar lo que no se entiende. En una auditoría, «el documento estaba en inglés» no es una justificación aceptable para no haber verificado el alcance.</p>
<h3>Lista de verificación para leer un certificado</h3>
<ol>
  <li>¿El nombre del titular y el de la planta coinciden con el fabricante real?</li>
  <li>¿La dirección de la planta coincide con la del registro sanitario o del contrato?</li>
  <li>¿El alcance indica línea, área o forma farmacéutica?</li>
  <li>¿La fecha de vigencia es actual y el documento es legible?</li>
  <li>¿Hay una resolución o un número de certificado que permita verificarlo?</li>
  <li>¿El documento está en español o tiene traducción oficial?</li>
</ol>
<p>Si alguna respuesta es «no», no se puede afirmar que el producto esté cubierto. La respuesta profesional no es rechazar de inmediato: es solicitar la evidencia que falta y dejar constancia de la solicitud. Esa trazabilidad también protege a quien compra.</p>

<h2>Mapa de relaciones</h2>
<p>Lee el mapa de izquierda a derecha: cada fila declara una relación y explica por qué existe. No es una lista de definiciones sueltas; es la estructura que conecta los conceptos de la clase.</p>

<table>
  <caption>Mapa de relaciones de la certificación</caption>
  <thead><tr><th scope="col">Elemento</th><th scope="col">Se relaciona con</th><th scope="col">Relación</th><th scope="col">Consecuencia</th></tr></thead>
  <tbody>
    <tr><td>Certificado de BPM</td><td>Línea, área o forma farmacéutica</td><td>Cubre un alcance delimitado</td><td>No se extrapola a otras líneas.</td></tr>
    <tr><td>Evidencia documental</td><td>Requisito</td><td>Demuestra cumplimiento</td><td>Sin evidencia, el requisito no existe para la inspección.</td></tr>
    <tr><td>Hallazgo</td><td>Gravedad</td><td>Determina la respuesta</td><td>Un hallazgo crítico puede impedir la certificación.</td></tr>
    <tr><td>Plan de cumplimiento</td><td>Causa raíz y verificación</td><td>Cierra el hallazgo</td><td>Sin verificación, el hallazgo se repite.</td></tr>
    <tr><td>Certificación</td><td>Registro sanitario</td><td>Complementa, no sustituye</td><td>El producto necesita ambos controles.</td></tr>
  </tbody>
</table>

<h2>Errores frecuentes y cómo corregirlos</h2>
<ul><li>Decir «la empresa tiene BPM» sin indicar el alcance. Corrección: cita la línea, la forma farmacéutica y la vigencia.</li><li>Aceptar un certificado sin verificar que corresponde al producto y al fabricante. Corrección: cruza titular, planta, dirección y alcance.</li><li>Responder un hallazgo con una promesa sin evidencia. Corrección: adjunta el registro, la corrección y la verificación.</li><li>Confundir la certificación con la liberación de cada lote. Corrección: separa el sistema (BPM) del lote (control de calidad).</li></ul>
<h2>Práctica de autoevaluación</h2>

<p>Una empresa te envía estos tres documentos para demostrar que puede fabricar un antibiótico inyectable. Indica qué falta y qué preguntarías.</p>
<ol>
  <li>Certificado de BPM de la planta para sólidos orales, vigente.</li>
  <li>Certificado de análisis del lote de la materia prima.</li>
  <li>Registro sanitario del producto en Colombia.</li>
</ol>
<details>
  <summary>Ver solución comentada</summary>
  
<p>Falta la evidencia de que la línea de inyectables esté cubierta por la certificación. El certificado de sólidos orales no se extrapola. También falta verificar que el fabricante del registro sea el mismo de la planta y que el certificado de análisis corresponda al lote y a la especificación del producto. Preguntarías: ¿tienen certificación vigente para la línea de estériles?, ¿pueden enviar el alcance completo y la resolución?, ¿el fabricante del registro es el mismo que fabrica el lote?, ¿el certificado de análisis incluye los ensayos de liberación aplicables?</p>
</details>
<h2>Síntesis y puente</h2>
<p>Ya sabes leer una certificación y distinguirla de otros controles. Con esto cierras la unidad 1: entiendes por qué las BPM existen, dónde están en la norma y qué alcance tienen. La unidad 2 baja al día a día de la planta: personas, instalaciones y documentos.</p>
<h2>Preguntas de transferencia</h2><p>Lleva lo aprendido a una situación distinta de la del caso. No hay una única respuesta; lo que se evalúa es el razonamiento y la evidencia que usas.</p><ol><li>Un proveedor te envía un certificado de BPM de otra planta del mismo grupo empresarial. ¿Qué verificas antes de aceptarlo para tu producto?</li><li>Un cliente te pide «una copia del certificado» sin indicar la línea. ¿Qué preguntas haces para acotar el alcance?</li><li>La certificación de una línea vence en dos meses y hay un lote en producción. ¿Qué riesgo evaluás y qué comunicás?</li><li>¿Cómo explicarías a un gerente comercial, sin tecnicismos, por qué no puede prometer que «toda la empresa está certificada»?</li></ol>
<h2>Referencias consultadas</h2>
<ol>
<li>Ministerio de Salud y Protección Social de Colombia. <em>Resolución 1160 de 2016</em> (2016). Requisitos de BPM y manual de autoinspección usados para leer el alcance y los hallazgos. <a href="https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%201160%20de%202016.pdf" target="_blank" rel="noopener noreferrer nofollow">https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%201160%20de%202016.pdf</a>. Consultado: 2026-11-03.</li>
<li>Ministerio de Salud de Colombia. <em>Decreto 677 de 1995</em> (1995). Diferencia el registro sanitario de la certificación de BPM. <a href="https://www.minsalud.gov.co/Normatividad_Nuevo/DECRETO%200677%20DE%201995.pdf" target="_blank" rel="noopener noreferrer nofollow">https://www.minsalud.gov.co/Normatividad_Nuevo/DECRETO%200677%20DE%201995.pdf</a>. Consultado: 2026-11-03.</li>
<li>Organización Mundial de la Salud. <em>WHO good manufacturing practices for pharmaceutical products: main principles (TRS 986, Annex 2)</em> (2014). Criterios de inspección y evidencia. <a href="https://www.who.int/publications/m/item/trs986-annex2" target="_blank" rel="noopener noreferrer nofollow">https://www.who.int/publications/m/item/trs986-annex2</a>. Consultado: 2026-11-03.</li>
</ol>
</article>$bpm_html$));


  -- ── bpm-u2-l1 · Personal, higiene y capacitación ─────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Las BPM en la planta' AND deleted_at IS NULL
   LIMIT 1;

  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 del curso de BPM. Se salta.';
    RETURN;
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND module_id = v_unidad AND title = 'Personal, higiene y capacitación' AND deleted_at IS NULL
   LIMIT 1;

  IF v_clase IS NULL THEN
    RAISE NOTICE 'No existe la clase Personal, higiene y capacitación en la unidad 2. Se salta.';
    RETURN;
  END IF;

  UPDATE aula_lessons
     SET subtitle = 'Clase 4 · Personas y contaminación',
         completion_rule = 'manual',
         duration_minutes = 75,
         is_required = TRUE,
         updated_at = NOW()
   WHERE id = v_clase;

  -- El texto viejo era un párrafo de apoyo. Se reemplaza por la clase
  -- completa; los videos, enlaces y destacados se conservan.
  DELETE FROM aula_lesson_blocks
   WHERE lesson_id = v_clase AND type = 'texto';

  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, jsonb_build_object('html', $bpm_html$<article class="aula-leccion" aria-labelledby="clase-bpm-u2-l1">
<p class="aula-leccion__intro">En una planta, el equipo más difícil de controlar no es una máquina: es la persona que la opera. Esta clase convierte las reglas de higiene y capacitación en decisiones comprensibles y verificables.</p>
<p class="aula-leccion__video"><strong>Video complementario:</strong> Curso-taller BPM-GMP en la industria farmacéutica, parte 1 · 61 min. Recurso complementario de consulta. Es un video largo; la clase escrita es autosuficiente y no exige verlo completo.</p>
<h2>Resultados de aprendizaje</h2>
<ul><li>Explicar cómo el personal se convierte en fuente de contaminación.</li><li>Ejecutar una secuencia de vestimenta y justificar cada prenda por el riesgo que controla.</li><li>Diseñar un registro de capacitación que demuestre comprensión, no solo asistencia.</li></ul>
<h2>Prerrequisitos</h2>
<p>Comprender la diferencia entre control del proceso y control final.</p>
<h2>Caso de partida</h2>
<p>Un operario de sólidos llega con tos y fiebre. El supervisor le pide quedarse porque «solo es un resfriado» y el turno está corto. El operario entra al área de dosificación, se baja el tapabocas para hablar con un compañero y manipula una tolva. Tres días después, el control microbiológico de superficies muestra un aumento en la zona.</p>

<h3>La persona como fuente de contaminación</h3>
<p>Una persona desprende partículas al moverse, al hablar y al respirar. La piel se descama, el cabello libera fibras, la saliva produce gotas y la ropa de calle aporta partículas. En un área limpia, esa carga puede ser mayor que la del aire filtrado. Por eso las BPM no tratan al personal como un detalle administrativo: lo tratan como una fuente de contaminación que debe controlarse.</p>
<p>El control tiene tres capas: lo que la persona hace (higiene y comportamiento), lo que la persona viste (barreras) y lo que la organización asegura (salud, formación y acceso). Si una capa falla, las otras dos tienen que compensar; si fallan dos, el producto queda expuesto.</p>

<h3>Vestimenta: cada prenda controla un riesgo</h3>
<table>
  <caption>Tabla 1. Qué controla cada prenda</caption>
  <thead><tr><th scope="col">Prenda</th><th scope="col">Riesgo que controla</th><th scope="col">Falla típica</th></tr></thead>
  <tbody>
    <tr><td>Gorro</td><td>Cabello y partículas del cuero cabelludo.</td><td>Dejarlo suelto o reutilizarlo en áreas sucias.</td></tr>
    <tr><td>Tapabocas</td><td>Gotas de saliva y microbiota de la boca y la nariz.</td><td>Bajarlo para hablar o reutilizarlo doblado en el bolsillo.</td></tr>
    <tr><td>Overol</td><td>Fibras de la ropa de calle y partículas de la piel.</td><td>Usar ropa de calle debajo o dejar aberturas.</td></tr>
    <tr><td>Cubrezapatos</td><td>Suciedad del piso exterior.</td><td>Pasar de un área a otra sin cambiarlos.</td></tr>
    <tr><td>Guantes</td><td>Contacto de las manos con el producto.</td><td>Desinfectar mal o tocar superficies no limpias.</td></tr>
  </tbody>
</table>
<p>La secuencia importa. Primero se retira la ropa de calle y los objetos personales; luego se colocan las prendas en un orden que evite que una prenda contaminada toque otra limpia. El orden exacto depende del área y del procedimiento aprobado, pero el principio es siempre el mismo: de lo más limpio a lo más sucio, sin cruzar.</p>

<h3>Ejemplo resuelto: vestimenta en un área estéril</h3>
<p>Un operario debe entrar a un área de llenado estéril. La secuencia documentada es: retirar joyas y objetos; lavarse las manos; colocarse el gorro; colocarse el tapabocas; colocarse el overol; colocarse los cubrezapatos; lavarse las manos con desinfectante; colocarse los guantes estériles; entrar por la esclusa. ¿Por qué el gorro y el tapabocas van antes que el overol?</p>
<p><strong>Razonamiento:</strong> porque el cabello y las gotas de saliva son fuentes de partículas que no deben caer sobre el overol ya colocado. Si el operario se coloca primero el overol y luego el gorro, las partículas del cabello pueden depositarse sobre una prenda que se supone limpia. El orden no es ritual: es una secuencia de control.</p>
<p>Si el operario toca el borde externo de los guantes al colocárselos, o se ajusta el tapabocas con la mano enguantada, la secuencia se rompe. Esos errores no se corrigen con más reglas: se corrigen con entrenamiento práctico y observación.</p>

<table>
  <caption>Tabla 2. Secuencia de vestimenta para un área estéril</caption>
  <thead><tr><th scope="col">Paso</th><th scope="col">Acción</th><th scope="col">Por qué</th><th scope="col">Resultado esperado</th><th scope="col">Cómo se comprueba</th><th scope="col">Error frecuente</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Retirar joyas, reloj y objetos personales.</td><td>Los objetos acumulan partículas y dificultan la higiene.</td><td>Sin objetos en manos, cuello y muñecas.</td><td>Observación antes de entrar.</td><td>Dejar una pulsera o un anillo.</td></tr>
    <tr><td>2</td><td>Lavarse las manos con jabón y secarlas.</td><td>Reduce la carga microbiana inicial.</td><td>Manos limpias y secas.</td><td>Verificación visual y registro.</td><td>Usar gel sobre manos sucias.</td></tr>
    <tr><td>3</td><td>Colocar el gorro.</td><td>Contiene el cabello y las partículas del cuero cabelludo.</td><td>Cabello cubierto por completo.</td><td>Revisión frente al espejo.</td><td>Dejar mechones fuera.</td></tr>
    <tr><td>4</td><td>Colocar el tapabocas.</td><td>Contiene gotas de saliva y microbiota.</td><td>Nariz y boca cubiertas.</td><td>Revisión visual y prueba de sellado.</td><td>Bajarlo para hablar.</td></tr>
    <tr><td>5</td><td>Colocar el overol.</td><td>Contiene fibras de la ropa de calle y piel.</td><td>Cuerpo cubierto sin aberturas.</td><td>Revisión de cierres y puños.</td><td>Dejar ropa de calle debajo.</td></tr>
    <tr><td>6</td><td>Colocar cubrezapatos.</td><td>Evita arrastrar suciedad del piso exterior.</td><td>Calzado cubierto.</td><td>Revisión visual.</td><td>Reutilizarlos en otra área.</td></tr>
    <tr><td>7</td><td>Desinfectar las manos y colocar guantes estériles.</td><td>Evita el contacto directo con el producto.</td><td>Guantes colocados sin tocar el exterior.</td><td>Observación y cambio si hay duda.</td><td>Tocar el borde externo.</td></tr>
    <tr><td>8</td><td>Entrar por la esclusa.</td><td>Mantiene la presión y evita el cruce de áreas.</td><td>Ingreso controlado y registrado.</td><td>Registro de acceso y presión.</td><td>Abrir ambas puertas.</td></tr>
  </tbody>
</table>

<h3>Capacitación que se puede demostrar</h3>
<p>La norma no pide que el personal «sepa». Pide que se pueda demostrar que comprendió y que aplica lo que aprendió. Un registro de asistencia prueba que la persona estuvo en una sala; no prueba que entendió. Un buen sistema de capacitación incluye:</p>
<ul>
  <li>Contenidos definidos por cargo y por área.</li>
  <li>Evaluación antes y después, con criterio de aprobación.</li>
  <li>Observación práctica en el puesto, cuando el riesgo lo exige.</li>
  <li>Reentrenamiento cuando cambia un procedimiento, un equipo o una norma.</li>
  <li>Registro de quién capacitó, cuándo, con qué material y con qué resultado.</li>
</ul>
<p>Una capacitación sin evaluación es una reunión. Una evaluación sin observación puede ser un examen de memoria. La combinación de ambas es lo que da evidencia.</p>

<h3>Salud, acceso y comportamiento</h3>
<p>Las BPM exigen exámenes médicos de ingreso y periódicos, y un procedimiento para cuando alguien está enfermo. El punto delicado es cultural: si reportar una infección cuesta el día de trabajo o una sanción, nadie reporta. La organización tiene que hacer que reportar sea seguro. Eso no es un beneficio: es parte del control de contaminación.</p>
<p>El acceso se restringe por área y por función. La entrada pasa por esclusas y cambios de vestimenta. El flujo se diseña para que una persona no transporte, sobre su cuerpo, la contaminación de un área a otra. Si el diseño no lo permite, el procedimiento debe compensarlo; pero un procedimiento depende de que alguien lo cumpla.</p>


<h2>Mapa de relaciones</h2>
<p>Lee el mapa de izquierda a derecha: cada fila declara una relación y explica por qué existe. No es una lista de definiciones sueltas; es la estructura que conecta los conceptos de la clase.</p>

<table>
  <caption>Mapa de relaciones del control de personas</caption>
  <thead><tr><th scope="col">Elemento</th><th scope="col">Relación</th><th scope="col">Resultado</th><th scope="col">Evidencia</th></tr></thead>
  <tbody>
    <tr><td>Higiene personal</td><td>reduce</td><td>Carga microbiana inicial</td><td>Procedimiento y observación.</td></tr>
    <tr><td>Vestimenta</td><td>contiene</td><td>Partículas y gotas</td><td>Secuencia documentada y supervisión.</td></tr>
    <tr><td>Capacitación</td><td>habilita</td><td>Ejecución correcta</td><td>Evaluación y observación en el puesto.</td></tr>
    <tr><td>Salud</td><td>previene</td><td>Presencia de personas infectadas</td><td>Exámenes y procedimiento de reporte.</td></tr>
    <tr><td>Acceso</td><td>limita</td><td>Circulación innecesaria</td><td>Esclusas, permisos y registros.</td></tr>
  </tbody>
</table>

<h2>Errores frecuentes y cómo corregirlos</h2>
<ul><li>Bajarse el tapabocas para hablar dentro del área. Corrección: salir del área o usar un medio que no rompa la barrera.</li><li>Reutilizar guantes entre tareas. Corrección: cambiar guantes y desinfectar manos según el procedimiento.</li><li>Firmar la asistencia a una capacitación sin evaluación. Corrección: agregar evaluación y observación práctica.</li><li>Ocultar una enfermedad por miedo a la sanción. Corrección: procedimiento de reporte sin represalias y reubicación temporal.</li></ul>
<h2>Práctica de autoevaluación</h2>

<p>Observa esta secuencia de ingreso a un área limpia y marca los errores:</p>
<ol>
  <li>El operario entra con el uniforme de calle y se coloca el overol encima.</li>
  <li>Se coloca el gorro después del overol.</li>
  <li>Se baja el tapabocas para saludar a un compañero.</li>
  <li>Se coloca los guantes sin lavarse las manos.</li>
  <li>Sale del área con los mismos cubrezapatos y entra a la zona de recepción.</li>
</ol>
<p>Explica qué riesgo controla cada paso y cómo lo corregirías.</p>
<details>
  <summary>Ver solución comentada</summary>
  
<ol>
  <li>El uniforme de calle debajo del overol aporta fibras y partículas. Debe retirarse o cubrirse según el procedimiento.</li>
  <li>El gorro debe ir antes que el overol para que el cabello no contamine la prenda limpia.</li>
  <li>Bajarse el tapabocas libera gotas. Debe salir del área o usar una alternativa aprobada.</li>
  <li>Los guantes no sustituyen la higiene de manos. Debe lavarse y secarse antes de colocarlos.</li>
  <li>Los cubrezapatos de un área no deben circular a otra. Debe cambiarlos o retirarlos según el flujo.</li>
</ol>
</details>
<h2>Síntesis y puente</h2>
<p>El control de personas se apoya en barreras, formación y cultura de reporte. En la próxima clase verás el otro gran frente: instalaciones, áreas y equipos, donde el diseño físico hace parte del control.</p>

<h2>Referencias consultadas</h2>
<ol>
<li>Ministerio de Salud y Protección Social de Colombia. <em>Resolución 1160 de 2016</em> (2016). Requisitos de personal, higiene, capacitación y acceso. <a href="https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%201160%20de%202016.pdf" target="_blank" rel="noopener noreferrer nofollow">https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%201160%20de%202016.pdf</a>. Consultado: 2026-11-03.</li>
<li>Organización Mundial de la Salud. <em>WHO good manufacturing practices for pharmaceutical products: main principles (TRS 986, Annex 2)</em> (2014). Principios de higiene, personal y capacitación. <a href="https://www.who.int/publications/m/item/trs986-annex2" target="_blank" rel="noopener noreferrer nofollow">https://www.who.int/publications/m/item/trs986-annex2</a>. Consultado: 2026-11-03.</li>
<li>International Council for Harmonisation. <em>ICH Q10: Pharmaceutical Quality System</em> (2008). Formación, competencia y gestión del conocimiento. <a href="https://database.ich.org/sites/default/files/Q10%20Guideline.pdf" target="_blank" rel="noopener noreferrer nofollow">https://database.ich.org/sites/default/files/Q10%20Guideline.pdf</a>. Consultado: 2026-11-03.</li>
</ol>
</article>$bpm_html$));


  -- ── bpm-u2-l2 · Instalaciones, áreas y equipos ─────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Las BPM en la planta' AND deleted_at IS NULL
   LIMIT 1;

  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 del curso de BPM. Se salta.';
    RETURN;
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND module_id = v_unidad AND title = 'Instalaciones, áreas y equipos' AND deleted_at IS NULL
   LIMIT 1;

  IF v_clase IS NULL THEN
    RAISE NOTICE 'No existe la clase Instalaciones, áreas y equipos en la unidad 2. Se salta.';
    RETURN;
  END IF;

  UPDATE aula_lessons
     SET subtitle = 'Clase 5 · Diseño y contaminación cruzada',
         completion_rule = 'manual',
         duration_minutes = 75,
         is_required = TRUE,
         updated_at = NOW()
   WHERE id = v_clase;

  -- El texto viejo era un párrafo de apoyo. Se reemplaza por la clase
  -- completa; los videos, enlaces y destacados se conservan.
  DELETE FROM aula_lesson_blocks
   WHERE lesson_id = v_clase AND type = 'texto';

  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, jsonb_build_object('html', $bpm_html$<article class="aula-leccion" aria-labelledby="clase-bpm-u2-l2">
<p class="aula-leccion__intro">El edificio también enseña. Un flujo bien diseñado reduce la necesidad de depender de que las personas recuerden una regla. Esta clase te enseña a mirar la planta como un sistema de barreras.</p>
<p class="aula-leccion__video"><strong>Sin video obligatorio.</strong> Esta clase se aprende con el texto y los recursos de lectura; no necesitas reproducir un video para comprenderla.</p>
<h2>Resultados de aprendizaje</h2>
<ul><li>Identificar cruces de flujos que producen contaminación cruzada.</li><li>Explicar el sentido de las presiones diferenciales y las esclusas.</li><li>Distinguir calificación, mantenimiento y limpieza de equipos.</li></ul>
<h2>Prerrequisitos</h2>
<p>Manejo de los conceptos de contaminación y control del proceso.</p>
<h2>Caso de partida</h2>
<p>Una planta comparte un área para fabricar un antibiótico betalactámico y un analgésico. Para ahorrar tiempo, el operario transporta una bandeja de tabletas de analgésico por el pasillo del área de betalactámicos. Al día siguiente, el control de residuos detecta trazas de penicilina en el área común. La investigación concluye que el flujo de materiales estaba cruzado.</p>

<h3>El problema que resuelve el diseño: la contaminación cruzada</h3>
<p>La contaminación cruzada ocurre cuando un producto, un residuo, un microorganismo o una partícula pasa de un lugar a otro donde no debería estar. En una planta puede viajar en el aire, en las manos, en la ropa, en los utensilios, en el agua o en el polvo. El diseño de la planta busca que esos viajes no ocurran; cuando no se puede evitar el contacto, se controla con barreras, presiones, limpieza y separación en el tiempo.</p>
<p>Hay productos que exigen áreas dedicadas: penicilínicos, cefalosporínicos, citostáticos, hormonas y otros de alta potencia. La razón es la seguridad del paciente: una traza puede producir una reacción grave en una persona alérgica. Compartir área no es solo un problema de limpieza; es un problema de riesgo.</p>

<h3>Los tres flujos que no deberían cruzarse</h3>
<ul>
  <li><strong>Personal:</strong> por dónde entra, dónde se cambia, a qué áreas accede.</li>
  <li><strong>Materiales:</strong> por dónde entra la materia prima, dónde se almacena, cómo llega al proceso y cómo sale el producto.</li>
  <li><strong>Residuos:</strong> por dónde sale lo que se descarta, sin volver a zonas limpias.</li>
</ul>
<p>Cada cruce es un riesgo. Si el edificio no permite separarlos, se compensa con procedimientos: horarios distintos, contenedores cerrados, limpieza entre pasos. Pero el procedimiento depende de que alguien lo cumpla; el diseño, no.</p>

<h3>Presiones diferenciales y esclusas</h3>
<p>El aire se mueve de mayor a menor presión. Eso se usa para empujar la contaminación hacia donde no afecta al producto:</p>
<ul>
  <li>En un área estéril, la presión suele ser mayor que la del pasillo: al abrir la puerta, el aire sale y no entra contaminación.</li>
  <li>En un área de producto peligroso, la presión suele ser menor: al abrir la puerta, el aire entra y el polvo no escapa.</li>
</ul>
<p>Las esclusas son cámaras intermedias que sostienen la diferencia y permiten cambiar de vestimenta. Si las dos puertas se abren a la vez, la esclusa deja de proteger. Por eso muchas tienen enclavamiento y monitoreo de presión.</p>

<table>
  <caption>Tabla 1. Lectura de una cascada de presiones</caption>
  <thead><tr><th scope="col">Zona</th><th scope="col">Presión relativa</th><th scope="col">Dirección del aire al abrir</th><th scope="col">Riesgo que controla</th></tr></thead>
  <tbody>
    <tr><td>Área estéril</td><td>Mayor que el pasillo</td><td>Del área al pasillo</td><td>Entrada de partículas y microorganismos.</td></tr>
    <tr><td>Pasillo limpio</td><td>Intermedia</td><td>Hacia la esclusa</td><td>Transferencia entre áreas.</td></tr>
    <tr><td>Área de sólidos</td><td>Menor que el pasillo</td><td>Del pasillo al área</td><td>Salida de polvo del producto.</td></tr>
    <tr><td>Área de citostáticos</td><td>Menor que el pasillo</td><td>Del pasillo al área</td><td>Salida de partículas peligrosas.</td></tr>
  </tbody>
</table>

<h3>Equipos: no basta con que funcionen</h3>
<p>Un equipo debe estar calificado: demostrar que está bien instalado, que opera dentro de sus parámetros y que rinde lo que debe. Eso se conoce como DQ, IQ, OQ y PQ (diseño, instalación, operación y desempeño). Además necesita mantenimiento preventivo, calibración de instrumentos críticos y limpieza validada entre productos. Un equipo calificado pero mal limpiado sigue siendo una vía de contaminación cruzada.</p>
<p>La calificación no es un trámite de una vez. Un cambio de componente, una reparación mayor o un cambio de uso pueden exigir recalificación. El control de cambios es el que decide cuándo.</p>

<h3>Ejemplo resuelto: el pasillo compartido</h3>
<p>En el caso inicial, el operario transportó analgésico por el pasillo de betalactámicos. ¿Cuál es la causa raíz y cuál la corrección?</p>
<p><strong>Razonamiento:</strong> la causa no es «el operario se equivocó». La causa es que el diseño permitía el cruce y el procedimiento no lo prohibía con una barrera física. La corrección inmediata es contener y limpiar; la correctiva es separar el flujo o establecer un procedimiento con ruta exclusiva, contenedores cerrados y verificación. La preventiva es revisar todos los flujos que comparten pasillos y evaluar el riesgo de contaminación cruzada.</p>
<p>Si solo se capacita al operario, el riesgo sigue ahí: otra persona, otro turno, otra prisa. La barrera de diseño es más robusta que la memoria.</p>

<h2>Segundo caso contrastado</h2>
<h3>Caso contrastado: separar sin obras civiles</h3>
<p>Una planta pequeña no puede construir un área dedicada para un producto de alto riesgo. La dirección pide «hacer lo posible» con el presupuesto actual. Una respuesta profesional no es decir «no se puede» ni «sigamos igual»: es evaluar el riesgo y definir barreras proporcionadas. Las opciones pueden ser:</p>
<ul>
  <li><strong>Separación en el tiempo:</strong> fabricar el producto de alto riesgo al final del turno, con limpieza validada y ventilación antes de volver al otro producto.</li>
  <li><strong>Contención en la fuente:</strong> usar equipos cerrados, campanas o sistemas de extracción localizada para evitar que el polvo se disperse.</li>
  <li><strong>Rutas exclusivas:</strong> definir un recorrido y un horario para materiales y residuos, con contenedores cerrados y señalización.</li>
  <li><strong>Monitoreo:</strong> medir residuos en superficies y aire después de la limpieza, para demostrar que la barrera funciona.</li>
</ul>
<p>Ninguna de estas medidas equivale a un área dedicada. Por eso deben acompañarse de una evaluación de riesgo que explique por qué se aceptan, qué queda pendiente y cuándo se revisará. El error es presentar una medida provisional como si eliminara el riesgo. La transparencia sobre el límite es parte de la competencia técnica.</p>
<h3>Cómo leer una presión diferencial sin un manómetro</h3>
<p>No siempre se tiene un instrumento a mano. Puedes inferir el sentido del flujo por el diseño: una puerta que abre hacia afuera en un área limpia sugiere presión positiva; una compuerta con extracción y filtro HEPA en un área de polvos sugiere presión negativa. Pero la inferencia no reemplaza la medición. Si necesitas afirmar que una presión cumple, pide el registro del instrumento, la fecha de calibración y el valor observado. Un diagrama sin medición es una hipótesis, no una evidencia.</p>

<h2>Mapa de relaciones</h2>
<p>Lee el mapa de izquierda a derecha: cada fila declara una relación y explica por qué existe. No es una lista de definiciones sueltas; es la estructura que conecta los conceptos de la clase.</p>

<table>
  <caption>Mapa de barreras contra la contaminación cruzada</caption>
  <thead><tr><th scope="col">Barrera</th><th scope="col">Actúa sobre</th><th scope="col">Relación</th><th scope="col">Límite</th></tr></thead>
  <tbody>
    <tr><td>Áreas dedicadas</td><td>Productos de alto riesgo</td><td>Separan físicamente</td><td>No siempre es posible por costo o espacio.</td></tr>
    <tr><td>Presión diferencial</td><td>Aire</td><td>Dirige el flujo</td><td>Depende de esclusas cerradas y monitoreo.</td></tr>
    <tr><td>Esclusas</td><td>Personas y materiales</td><td>Cambian de estado</td><td>Pierden función si ambas puertas se abren.</td></tr>
    <tr><td>Limpieza validada</td><td>Residuos</td><td>Reduce la carga</td><td>No sustituye la separación de productos incompatibles.</td></tr>
    <tr><td>Calificación</td><td>Equipos</td><td>Demuestra desempeño</td><td>No corrige un diseño inadecuado.</td></tr>
  </tbody>
</table>

<h2>Errores frecuentes y cómo corregirlos</h2>
<ul><li>Pensar que la limpieza reemplaza la separación de áreas para productos de alto riesgo. Corrección: primero elimina o separa el riesgo; la limpieza es una barrera adicional.</li><li>Abrir las dos puertas de una esclusa a la vez. Corrección: respeta el enclavamiento y verifica la presión antes de entrar.</li><li>Usar un equipo calificado sin verificar su limpieza entre productos. Corrección: cruza la calificación con la validación de limpieza.</li><li>Atribuir un cruce de flujos a un error humano sin revisar el diseño. Corrección: analiza la ruta, las barreras y el procedimiento antes de culpar a la persona.</li></ul>
<h2>Práctica de autoevaluación</h2>

<p>Una planta pequeña fabrica tres productos: un jarabe, una crema y un antibiótico en polvo. Solo tiene un pasillo central. Propón tres medidas para reducir la contaminación cruzada y ordénalas de mayor a menor robustez. Justifica.</p>
<details>
  <summary>Ver solución comentada</summary>
  
<p>Medidas posibles: (1) separar físicamente el antibiótico en un área dedicada con presión negativa y acceso controlado; (2) establecer rutas y horarios exclusivos para materiales y residuos, con contenedores cerrados; (3) validar la limpieza entre productos y monitorear residuos. El orden de robustez es: separación física, luego barreras de flujo y horario, luego limpieza y monitoreo. La limpieza es necesaria, pero no protege si el polvo del antibiótico se dispersa por el pasillo.</p>
</details>
<h2>Síntesis y puente</h2>
<p>El diseño físico reduce la dependencia de la memoria y de la buena voluntad. En la próxima clase verás cómo se documenta que todo esto ocurrió: la documentación es la memoria verificable de la planta.</p>

<h2>Referencias consultadas</h2>
<ol>
<li>Ministerio de Salud y Protección Social de Colombia. <em>Resolución 1160 de 2016</em> (2016). Requisitos de instalaciones, áreas, equipos y contaminación cruzada. <a href="https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%201160%20de%202016.pdf" target="_blank" rel="noopener noreferrer nofollow">https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%201160%20de%202016.pdf</a>. Consultado: 2026-11-03.</li>
<li>Organización Mundial de la Salud. <em>WHO good manufacturing practices for pharmaceutical products: main principles (TRS 986, Annex 2)</em> (2014). Principios de diseño, flujos y prevención de contaminación cruzada. <a href="https://www.who.int/publications/m/item/trs986-annex2" target="_blank" rel="noopener noreferrer nofollow">https://www.who.int/publications/m/item/trs986-annex2</a>. Consultado: 2026-11-03.</li>
<li>International Council for Harmonisation. <em>ICH Q9(R1): Quality Risk Management</em> (2023). Priorización de riesgos de contaminación cruzada. <a href="https://database.ich.org/sites/default/files/ICH_Q9%28R1%29_Guideline_Step4_2023_0126_0.pdf" target="_blank" rel="noopener noreferrer nofollow">https://database.ich.org/sites/default/files/ICH_Q9%28R1%29_Guideline_Step4_2023_0126_0.pdf</a>. Consultado: 2026-11-03.</li>
</ol>
</article>$bpm_html$));


  -- ── bpm-u2-l3 · Documentación: lo que no está escrito no ocurrió ─────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Las BPM en la planta' AND deleted_at IS NULL
   LIMIT 1;

  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 del curso de BPM. Se salta.';
    RETURN;
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND module_id = v_unidad AND title = 'Documentación: lo que no está escrito no ocurrió' AND deleted_at IS NULL
   LIMIT 1;

  IF v_clase IS NULL THEN
    RAISE NOTICE 'No existe la clase Documentación: lo que no está escrito no ocurrió en la unidad 2. Se salta.';
    RETURN;
  END IF;

  UPDATE aula_lessons
     SET subtitle = 'Clase 6 · Registros e integridad de datos',
         completion_rule = 'manual',
         duration_minutes = 75,
         is_required = TRUE,
         updated_at = NOW()
   WHERE id = v_clase;

  -- El texto viejo era un párrafo de apoyo. Se reemplaza por la clase
  -- completa; los videos, enlaces y destacados se conservan.
  DELETE FROM aula_lesson_blocks
   WHERE lesson_id = v_clase AND type = 'texto';

  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, jsonb_build_object('html', $bpm_html$<article class="aula-leccion" aria-labelledby="clase-bpm-u2-l3">
<p class="aula-leccion__intro">La documentación no es el soporte del trabajo: es parte del trabajo. Esta clase te enseña a producir registros que resistan una inspección y, sobre todo, que permitan reconstruir lo que pasó.</p>
<p class="aula-leccion__video"><strong>Sin video obligatorio.</strong> Esta clase se aprende con el texto y los recursos de lectura; no necesitas reproducir un video para comprenderla.</p>
<h2>Resultados de aprendizaje</h2>
<ul><li>Identificar los documentos esenciales de un lote y su función.</li><li>Aplicar los criterios ALCOA+ a un registro real.</li><li>Corregir un error documental sin borrar la evidencia original.</li></ul>
<h2>Prerrequisitos</h2>
<p>Haber visto personal, instalaciones y equipos.</p>
<h2>Caso de partida</h2>
<p>Un operario termina su turno a las 10 p. m. y se da cuenta de que no llenó el registro de temperatura del mezclador. Lo llena al día siguiente, de memoria, con los valores que «deberían» haber sido. El inspector encuentra que la letra es la misma, la tinta es la misma y la hora no coincide con el turno. El registro se convierte en un hallazgo de integridad de datos.</p>

<h3>El expediente de lote es el lote</h3>
<p>Cuando un lote sale de la planta, lo único que queda en la empresa es su expediente. Si dentro de dos años hay que investigar una reacción adversa, el expediente es la única forma de reconstruir qué materia prima entró, quién fabricó, qué equipos se usaron, qué condiciones había y si hubo desviaciones. Lo que no esté allí no se puede reconstruir.</p>
<p>Por eso la documentación se produce durante el proceso, no después. Un registro llenado al final del turno puede ser exacto en el mejor de los casos, pero no es contemporáneo; y si se llena de memoria, deja de ser exacto.</p>

<h3>Los documentos que sostienen un lote</h3>
<ul>
  <li><strong>Procedimientos normalizados de operación (PNO):</strong> cómo se hace cada tarea. Tienen versión, fecha de vigencia y aprobación.</li>
  <li><strong>Fórmula maestra:</strong> la receta oficial del producto, con cantidades y proceso.</li>
  <li><strong>Registro de fabricación de lote:</strong> lo que realmente ocurrió con ese lote, llenado durante el proceso.</li>
  <li><strong>Especificaciones:</strong> qué debe cumplir cada materia prima, material y producto.</li>
  <li><strong>Certificados de análisis:</strong> qué dio el control de calidad.</li>
  <li><strong>Registros de limpieza, calibración y mantenimiento:</strong> la evidencia de que el entorno estaba controlado.</li>
</ul>

<h3>ALCOA+: el criterio con el que se juzga un dato</h3>
<table>
  <caption>Tabla 1. ALCOA+ aplicado a un registro de fabricación</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Qué exige</th><th scope="col">Falla típica</th><th scope="col">Cómo se detecta</th></tr></thead>
  <tbody>
    <tr><td>Atribuible</td><td>Saber quién escribió el dato.</td><td>Firmar por otro o usar un usuario compartido.</td><td>Comparar firmas y accesos al sistema.</td></tr>
    <tr><td>Legible</td><td>Poder leerlo hoy y dentro de años.</td><td>Letra ilegible, tinta que se borra.</td><td>Revisión visual y conservación.</td></tr>
    <tr><td>Contemporáneo</td><td>Escribirlo cuando ocurrió.</td><td>Llenar al final del turno.</td><td>Comparar hora del registro con la del proceso.</td></tr>
    <tr><td>Original</td><td>Es el primer registro, no una copia.</td><td>Transcribir a otro cuaderno.</td><td>Buscar el documento primario.</td></tr>
    <tr><td>Exacto</td><td>Refleja lo que pasó, incluso el error.</td><td>Ocultar una desviación.</td><td>Contrastar con otras fuentes.</td></tr>
  </tbody>
</table>
<p>El «+» añade completo, consistente, perdurable y disponible. Un registro puede ser atribuible y exacto, pero si no está disponible cuando se necesita, no sirve para la investigación.</p>

<h3>Ejemplo resuelto: corregir sin borrar</h3>
<p>Un analista escribe «pH 6,8» pero el valor real fue «pH 6,3». ¿Cómo se corrige?</p>
<p><strong>Procedimiento correcto:</strong> se traza una línea simple sobre el valor erróneo, de modo que siga siendo legible; se escribe el valor correcto al lado; se añade la fecha, la hora, la firma y el motivo de la corrección. No se usa corrector, no se tacha hasta hacer ilegible el dato y no se arranca la página. La corrección debe permitir reconstruir qué se escribió, quién lo corrigió y por qué.</p>
<p>Si el registro es electrónico, la corrección se hace con una entrada de auditoría que conserve el valor anterior y el nuevo, el usuario, la fecha y el motivo. Un sistema que permite sobrescribir sin rastro no cumple integridad de datos, aunque tenga una interfaz moderna.</p>

<table>
  <caption>Tabla 2. Procedimiento para corregir un dato en un registro</caption>
  <thead><tr><th scope="col">Paso</th><th scope="col">Acción</th><th scope="col">Por qué</th><th scope="col">Resultado esperado</th><th scope="col">Cómo se comprueba</th><th scope="col">Error frecuente</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Detectar y detener la corrección automática.</td><td>Evita que el sistema borre el valor original.</td><td>Valor anterior visible.</td><td>Revisión de la pantalla o del papel.</td><td>Usar la tecla de borrar.</td></tr>
    <tr><td>2</td><td>Trazar una línea simple sobre el dato erróneo.</td><td>Conserva la legibilidad del original.</td><td>Dato anterior legible.</td><td>Revisión visual.</td><td>Usar corrector o tachar hasta ocultar.</td></tr>
    <tr><td>3</td><td>Escribir el valor correcto al lado.</td><td>Permite reconstruir la corrección.</td><td>Valor nuevo claro.</td><td>Lectura por otra persona.</td><td>Escribir encima sin espacio.</td></tr>
    <tr><td>4</td><td>Añadir fecha, hora, firma y motivo.</td><td>Hace la corrección atribuible y trazable.</td><td>Corrección identificable.</td><td>Revisión del registro y de la firma.</td><td>Firmar sin motivo o sin fecha.</td></tr>
    <tr><td>5</td><td>Registrar la corrección en el sistema de auditoría, si es electrónico.</td><td>Conserva el historial y el valor anterior.</td><td>Entrada de auditoría completa.</td><td>Consulta del historial.</td><td>Sobrescribir sin rastro.</td></tr>
  </tbody>
</table>

<h3>Documentos electrónicos: los mismos principios, más controles</h3>
<p>Un sistema electrónico debe tener usuarios individuales, control de acceso, registro de auditoría, copias de respaldo y protección contra cambios no autorizados. La clave compartida por turno es un clásico que rompe «atribuible»: si todos usan el mismo usuario, no se sabe quién hizo qué. La firma electrónica debe estar vinculada a la persona y no ser reutilizable por otros.</p>

<h2>Segundo caso contrastado</h2>
<h3>Caso contrastado: el sistema híbrido que nadie controla</h3>
<p>Una planta tiene un sistema electrónico para el registro de fabricación, pero conserva un cuaderno de papel para las observaciones del turno. El sistema electrónico no permite adjuntar el cuaderno, y el cuaderno no tiene firma por cada anotación. Cuando un inspector pregunta por una observación del turno, el operario muestra una hoja sin fecha ni autor. La planta responde que «el sistema es nuevo y el cuaderno es provisional». La respuesta no resuelve el problema: la evidencia sigue incompleta.</p>
<p>Los sistemas híbridos son frecuentes y no son un problema en sí mismos. El problema es que cada soporte tenga sus propias reglas y que la relación entre ambos no esté definida. Si el cuaderno es parte del registro, debe estar controlado, foliado, firmado y vinculado al lote. Si no lo es, no puede usarse para justificar una decisión. La transición a un sistema electrónico no elimina la obligación de integridad: la traslada al nuevo soporte.</p>
<h3>Preguntas para auditar un registro electrónico</h3>
<ol>
  <li>¿Cada usuario tiene una cuenta individual y una contraseña que no comparte?</li>
  <li>¿El sistema registra quién creó, modificó o eliminó un dato, con fecha y hora?</li>
  <li>¿Se conserva el valor anterior cuando alguien corrige?</li>
  <li>¿Hay copias de respaldo y un plan de recuperación?</li>
  <li>¿Los permisos impiden que un operario apruebe su propio registro?</li>
  <li>¿El sistema bloquea la modificación después de la liberación del lote?</li>
</ol>
<p>Si alguna respuesta es «no», el sistema no cumple integridad de datos, aunque tenga una interfaz moderna. La tecnología no sustituye el control; lo hace más fácil o más difícil.</p>

<h2>Mapa de relaciones</h2>
<p>Lee el mapa de izquierda a derecha: cada fila declara una relación y explica por qué existe. No es una lista de definiciones sueltas; es la estructura que conecta los conceptos de la clase.</p>

<table>
  <caption>Mapa del sistema documental</caption>
  <thead><tr><th scope="col">Documento</th><th scope="col">Responde a</th><th scope="col">Se relaciona con</th><th scope="col">Evidencia que aporta</th></tr></thead>
  <tbody>
    <tr><td>PNO</td><td>¿Cómo se hace?</td><td>Capacitación y ejecución</td><td>Versión vigente y firma de aprobación.</td></tr>
    <tr><td>Fórmula maestra</td><td>¿Qué contiene?</td><td>Registro de lote</td><td>Composición y proceso autorizado.</td></tr>
    <tr><td>Registro de lote</td><td>¿Qué pasó?</td><td>Desviaciones y liberación</td><td>Trazabilidad de materias primas, personas y equipos.</td></tr>
    <tr><td>Certificado de análisis</td><td>¿Cumple la especificación?</td><td>Liberación</td><td>Resultados de control de calidad.</td></tr>
    <tr><td>Registro de limpieza</td><td>¿Estaba limpio?</td><td>Contaminación cruzada</td><td>Validación y verificación.</td></tr>
  </tbody>
</table>

<h2>Errores frecuentes y cómo corregirlos</h2>
<ul><li>Usar corrector o tachar hasta que no se lea el dato original. Corrección: línea simple, valor nuevo, fecha, firma y motivo.</li><li>Llenar el registro al final del turno. Corrección: registra en el momento; si no se pudo, documenta la desviación y la razón.</li><li>Compartir un usuario electrónico. Corrección: usuarios individuales y control de acceso.</li><li>Firmar por un compañero. Corrección: cada persona firma lo que hizo; la falsedad documental tiene consecuencias legales.</li><li>Dejar casillas en blanco. Corrección: escribe «N/A» cuando no aplique, para distinguirlo de un paso olvidado.</li></ul>
<h2>Práctica de autoevaluación</h2>

<p>Recibes este registro de fabricación y debes decidir si es aceptable. Encuentra al menos cuatro problemas y propón la corrección.</p>
<ul>
  <li>La fecha y la hora están escritas con el mismo bolígrafo y la misma letra en todas las etapas del turno.</li>
  <li>Hay un valor de temperatura tachado con corrector y reemplazado por otro, sin firma.</li>
  <li>La firma del verificador es la misma que la del operario.</li>
  <li>Dos casillas de «observaciones» están vacías.</li>
  <li>El registro se guardó en una carpeta compartida con un usuario genérico.</li>
</ul>
<details>
  <summary>Ver solución comentada</summary>
  
<ol>
  <li>No es contemporáneo: parece llenado al final. Debe investigarse y corregirse con registros del proceso.</li>
  <li>El corrector oculta el dato original y no hay firma ni motivo. Es una falla de integridad; debe reconstruirse y documentarse.</li>
  <li>La firma del verificador debe ser de otra persona; si no, no hay verificación independiente.</li>
  <li>Las casillas vacías deben marcarse como «N/A» o completarse; un espacio vacío no se distingue de un olvido.</li>
  <li>El usuario genérico rompe la atribución. Debe haber usuarios individuales y registro de auditoría.</li>
</ol>
</details>
<h2>Síntesis y puente</h2>
<p>La documentación convierte el proceso en evidencia. Con esto cierras la unidad 2: personas, instalaciones y registros. La unidad 3 trata de lo que pasa cuando algo falla y de cómo se sostiene el cumplimiento en el tiempo.</p>
<h2>Preguntas de transferencia</h2><p>Lleva lo aprendido a una situación distinta de la del caso. No hay una única respuesta; lo que se evalúa es el razonamiento y la evidencia que usas.</p><ol><li>Un compañero te pide su usuario y contraseña para «no retrasar el registro». ¿Qué respondes y qué propones?</li><li>Encuentras un registro de limpieza sin la hora de ejecución. ¿Qué evidencia buscas para reconstruir el hecho?</li><li>Un proveedor de software te ofrece un módulo que permite borrar registros «solo para corregir errores». ¿Qué preguntas haces antes de aceptarlo?</li><li>¿Cómo verificarías que una corrección documental no ocultó el dato original?</li></ol>
<h2>Referencias consultadas</h2>
<ol>
<li>Ministerio de Salud y Protección Social de Colombia. <em>Resolución 1160 de 2016</em> (2016). Requisitos de documentación, registros y producción. <a href="https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%201160%20de%202016.pdf" target="_blank" rel="noopener noreferrer nofollow">https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%201160%20de%202016.pdf</a>. Consultado: 2026-11-03.</li>
<li>Organización Mundial de la Salud. <em>WHO good manufacturing practices for pharmaceutical products: main principles (TRS 986, Annex 2)</em> (2014). Principios de documentación y trazabilidad. <a href="https://www.who.int/publications/m/item/trs986-annex2" target="_blank" rel="noopener noreferrer nofollow">https://www.who.int/publications/m/item/trs986-annex2</a>. Consultado: 2026-11-03.</li>
<li>U.S. Food and Drug Administration. <em>Data Integrity and Compliance With Drug CGMP: Questions and Answers</em> (2018). Criterios de integridad de datos y registros electrónicos. <a href="https://www.fda.gov/media/119267/download" target="_blank" rel="noopener noreferrer nofollow">https://www.fda.gov/media/119267/download</a>. Consultado: 2026-11-03.</li>
</ol>
</article>$bpm_html$));


  -- ── bpm-u3-l1 · Desviaciones, cambios y CAPA ─────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Sostener el cumplimiento' AND deleted_at IS NULL
   LIMIT 1;

  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 del curso de BPM. Se salta.';
    RETURN;
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND module_id = v_unidad AND title = 'Desviaciones, cambios y CAPA' AND deleted_at IS NULL
   LIMIT 1;

  IF v_clase IS NULL THEN
    RAISE NOTICE 'No existe la clase Desviaciones, cambios y CAPA en la unidad 3. Se salta.';
    RETURN;
  END IF;

  UPDATE aula_lessons
     SET subtitle = 'Clase 7 · Cuando algo falla',
         completion_rule = 'manual',
         duration_minutes = 80,
         is_required = TRUE,
         updated_at = NOW()
   WHERE id = v_clase;

  -- El texto viejo era un párrafo de apoyo. Se reemplaza por la clase
  -- completa; los videos, enlaces y destacados se conservan.
  DELETE FROM aula_lesson_blocks
   WHERE lesson_id = v_clase AND type = 'texto';

  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, jsonb_build_object('html', $bpm_html$<article class="aula-leccion" aria-labelledby="clase-bpm-u3-l1">
<p class="aula-leccion__intro">Una planta que nunca reporta desviaciones no es una planta perfecta: es una planta que no está mirando. Esta clase te enseña a convertir un error en una mejora verificable, sin castigar el reporte.</p>
<p class="aula-leccion__video"><strong>Sin video obligatorio.</strong> Esta clase se aprende con el texto y los recursos de lectura; no necesitas reproducir un video para comprenderla.</p>
<h2>Resultados de aprendizaje</h2>
<ul><li>Clasificar una desviación y decidir la contención inmediata.</li><li>Investigar una causa raíz sin quedarse en el error humano.</li><li>Distinguir corrección, acción correctiva y acción preventiva.</li><li>Evaluar el impacto de un cambio antes de ejecutarlo.</li></ul>
<h2>Prerrequisitos</h2>
<p>Manejo de documentación e integridad de datos.</p>
<h2>Caso de partida</h2>
<p>En el envasado de un lote de cápsulas, el operario detecta que la etiqueta dice «10 mg» pero el producto es de «20 mg». El lote ya tiene 2.000 frascos etiquetados y 500 están en la zona de cuarentena. El supervisor quiere «corregir las etiquetas y seguir» para no perder el turno.</p>

<h3>Qué es una desviación</h3>
<p>Una desviación es cualquier apartamiento de lo establecido: un parámetro fuera de rango, un paso que se saltó, un resultado inesperado, un equipo que falló, un documento que no coincide con la práctica. Puede ser menor o crítica, pero todas se documentan. La gravedad depende del impacto potencial en la calidad, la seguridad del paciente y el cumplimiento regulatorio.</p>
<p>El primer error de muchas organizaciones no es la desviación: es el subreporte. Si reportar se castiga o se trata como una falla personal, las desviaciones se ocultan y el sistema pierde la oportunidad de corregirlas.</p>

<h3>El circuito completo</h3>
<ol>
  <li><strong>Detectar y contener.</strong> Lo primero no es investigar: es evitar que el producto afectado avance. Se identifica, se segrega, se detiene la línea y se protege al paciente.</li>
  <li><strong>Documentar.</strong> Qué pasó, cuándo, dónde, en qué lote, quién lo detectó y qué evidencia existe.</li>
  <li><strong>Evaluar el impacto.</strong> ¿Afecta este lote? ¿A otros lotes? ¿A producto ya distribuido? ¿Hay riesgo para el paciente?</li>
  <li><strong>Investigar la causa raíz.</strong> No la causa aparente; la causa que, si se corrige, evita que vuelva a pasar.</li>
  <li><strong>Definir acciones.</strong> Corrección, acción correctiva y acción preventiva.</li>
  <li><strong>Verificar la eficacia.</strong> Comprobar que la acción funcionó, con evidencia y seguimiento.</li>
  <li><strong>Cerrar y aprender.</strong> Actualizar procedimientos, capacitación y análisis de riesgos.</li>
</ol>

<h3>Causa raíz: el error más frecuente</h3>
<p>«El operario se equivocó» casi nunca es una causa raíz. Es donde se detuvo la investigación. Si preguntas «¿por qué?» varias veces, suelen aparecer causas del sistema: el procedimiento era ambiguo, la etiqueta de dos productos era casi idéntica, el equipo no advertía el error, el operario no había sido reentrenado tras el último cambio, la carga de trabajo impedía verificar.</p>
<p>Esas causas sí se pueden corregir. «Que tenga más cuidado» no corrige nada. La causa raíz debe ser verificable y accionable: si la acción propuesta es «capacitar», pregúntate si la capacitación elimina la causa o solo la hace menos probable.</p>

<table>
  <caption>Tabla 1. Corrección, correctiva y preventiva</caption>
  <thead><tr><th scope="col">Acción</th><th scope="col">Qué ataca</th><th scope="col">Ejemplo en el caso</th><th scope="col">Cómo se verifica</th></tr></thead>
  <tbody>
    <tr><td>Corrección</td><td>El efecto inmediato.</td><td>Separar y reetiquetar los frascos afectados.</td><td>Inspección del lote y reconciliación de unidades.</td></tr>
    <tr><td>Correctiva</td><td>La causa de lo que ya pasó.</td><td>Rediseñar la etiqueta para que no se confunda con la de 10 mg.</td><td>Prueba de lectura y revisión de la nueva etiqueta.</td></tr>
    <tr><td>Preventiva</td><td>La causa potencial en otros procesos.</td><td>Revisar todas las etiquetas de concentraciones similares.</td><td>Auditoría de etiquetas y ausencia de confusiones.</td></tr>
  </tbody>
</table>

<h3>Ejemplo resuelto: cinco porqués en el caso de la etiqueta</h3>
<p><strong>¿Por qué se etiquetó mal?</strong> Porque el operario tomó la etiqueta de 10 mg.</p>
<p><strong>¿Por qué la tomó?</strong> Porque las dos etiquetas estaban en el mismo estante y eran casi idénticas.</p>
<p><strong>¿Por qué estaban juntas?</strong> Porque el almacén las organiza por producto y no por concentración.</p>
<p><strong>¿Por qué no se detectó antes?</strong> Porque la verificación de etiqueta se hacía al final del turno, no en el momento de la aplicación.</p>
<p><strong>¿Por qué la verificación era al final?</strong> Porque el procedimiento no definía un punto de control en la línea.</p>
<p><strong>Causa raíz:</strong> el diseño del almacén y del punto de verificación permitía la confusión. <strong>Acciones:</strong> separar etiquetas por concentración, añadir verificación en línea, rediseñar el color y la tipografía, y revisar otros productos con riesgo similar. La capacitación ayuda, pero no es la única acción.</p>

<table>
  <caption>Tabla 2. Procedimiento de investigación de causa raíz</caption>
  <thead><tr><th scope="col">Paso</th><th scope="col">Acción</th><th scope="col">Por qué</th><th scope="col">Resultado esperado</th><th scope="col">Cómo se comprueba</th><th scope="col">Error frecuente</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Definir el problema con datos: qué, cuándo, dónde, cuánto.</td><td>Sin un problema preciso, la investigación se dispersa.</td><td>Enunciado verificable.</td><td>Otra persona puede repetir el enunciado.</td><td>Describir una opinión.</td></tr>
    <tr><td>2</td><td>Contener el producto o proceso afectado.</td><td>Evita que el riesgo avance mientras se investiga.</td><td>Lote segregado y línea detenida.</td><td>Registro de contención.</td><td>Investigar sin contener.</td></tr>
    <tr><td>3</td><td>Reunir evidencia: registros, entrevistas, equipo, materias primas.</td><td>La causa debe sostenerse en hechos.</td><td>Expediente de investigación.</td><td>Lista de evidencia y fechas.</td><td>Quedarse con la primera hipótesis.</td></tr>
    <tr><td>4</td><td>Aplicar cinco porqués o Ishikawa hasta una causa accionable.</td><td>Distingue la causa aparente de la causa del sistema.</td><td>Causa que se puede corregir y verificar.</td><td>La acción propuesta elimina la causa.</td><td>Concluir «error humano».</td></tr>
    <tr><td>5</td><td>Definir acción, responsable, fecha y verificación de eficacia.</td><td>Convierte la investigación en mejora.</td><td>Plan CAPA cerrado con evidencia.</td><td>Indicador y auditoría posterior.</td><td>Cerrar sin comprobar.</td></tr>
  </tbody>
</table>

<h3>Control de cambios</h3>
<p>Un cambio es cualquier modificación que pueda afectar la calidad, la validación o el registro sanitario: proveedor, equipo, proceso, software, instalación, etiqueta, especificación. El control de cambios evalúa el impacto antes de ejecutar, define las validaciones necesarias y documenta la aprobación. Un cambio que parece menor puede obligar a revalidar un proceso o a tramitar una modificación ante el INVIMA.</p>
<p>El control de cambios y la gestión de desviaciones se conectan: una acción correctiva puede generar un cambio; un cambio puede generar una desviación si no se evalúa bien. La trazabilidad entre ambos es parte del sistema de calidad.</p>

<h2>Segundo caso contrastado</h2>
<h3>Caso contrastado: la desviación que se cerró con una frase</h3>
<p>Una planta registra una desviación porque la humedad de un granulado quedó por encima del límite. El informe de cierre dice: «Se capacitó al operario para que ajuste el secado». No hay registro de la capacitación, no se revisó el equipo de secado y no se evaluó el impacto en el lote. Seis meses después, la misma desviación reaparece con otro operario. La causa no era el operario: era el sensor de humedad, que estaba descalibrado y marcaba un valor menor al real.</p>
<p>El caso muestra dos errores. Primero, la causa raíz se atribuyó a la persona sin investigar el equipo. Segundo, la acción se cerró sin verificación de eficacia. Una acción correctiva que no se comprueba es una intención, no un cierre. La verificación podría haber incluido la calibración del sensor, la revisión de lotes posteriores y una auditoría del registro de humedad. Sin esa comprobación, la planta no tenía forma de saber que la acción no funcionaba.</p>
<h3>Cómo distinguir una causa raíz de una causa aparente</h3>
<p>Hazte tres preguntas: ¿la causa explica por qué ocurrió y por qué no se detectó antes?, ¿si la elimino, el problema no puede volver por la misma vía?, ¿puedo verificarlo con evidencia? Si la respuesta a alguna es «no», probablemente sigues en la causa aparente. «El operario se distrajo» no explica por qué el sistema permitió que la distracción llegara al producto. «El sensor estaba descalibrado» sí explica el hecho y se puede corregir y verificar.</p>
<p>No se trata de buscar culpables. Se trata de encontrar el punto del sistema donde una acción produce un cambio duradero. Esa es la diferencia entre gestionar una desviación y archivar un formato.</p>

<h2>Mapa de relaciones</h2>
<p>Lee el mapa de izquierda a derecha: cada fila declara una relación y explica por qué existe. No es una lista de definiciones sueltas; es la estructura que conecta los conceptos de la clase.</p>

<table>
  <caption>Mapa del circuito de mejora</caption>
  <thead><tr><th scope="col">Etapa</th><th scope="col">Pregunta</th><th scope="col">Se conecta con</th><th scope="col">Evidencia</th></tr></thead>
  <tbody>
    <tr><td>Contención</td><td>¿Cómo evitamos que avance?</td><td>Cuarentena y comunicación</td><td>Registro de segregación.</td></tr>
    <tr><td>Investigación</td><td>¿Por qué ocurrió?</td><td>Causa raíz</td><td>Informe y evidencia.</td></tr>
    <tr><td>Correctiva</td><td>¿Cómo evitamos que vuelva?</td><td>Procedimiento, diseño o formación</td><td>Acción y verificación.</td></tr>
    <tr><td>Preventiva</td><td>¿Dónde más podría ocurrir?</td><td>Análisis de riesgos</td><td>Revisión de procesos similares.</td></tr>
    <tr><td>Control de cambios</td><td>¿Qué impacto tiene la mejora?</td><td>Validación y registro</td><td>Evaluación y aprobación.</td></tr>
  </tbody>
</table>

<h2>Errores frecuentes y cómo corregirlos</h2>
<ul><li>Cerrar la desviación con «capacitar al operario» sin investigar el sistema. Corrección: busca la causa que permitió el error y verifica la eficacia.</li><li>Reetiquetar el producto sin evaluar el impacto en el lote y en lo ya distribuido. Corrección: contiene, investiga y decide con evidencia.</li><li>Confundir corrección con acción correctiva. Corrección: separa el efecto inmediato de la causa.</li><li>Abrir un cambio sin evaluar validación ni registro sanitario. Corrección: usa el control de cambios y documenta el impacto.</li><li>No verificar si la acción funcionó. Corrección: define indicador, fecha y responsable de la verificación.</li></ul>
<h2>Práctica de autoevaluación</h2>

<p>Una mezcladora registra una velocidad de 120 rpm cuando el procedimiento indica 80 rpm. El lote ya se fabricó y está en cuarentena. El jefe de producción propone «liberarlo porque el análisis cumple». Responde:</p>
<ol>
  <li>¿Qué harías primero?</li>
  <li>¿Qué impacto evaluarías?</li>
  <li>¿Cuál sería una acción correctiva y cuál una preventiva?</li>
  <li>¿Cómo verificarías que la acción funcionó?</li>
</ol>
<details>
  <summary>Ver solución comentada</summary>
  
<ol>
  <li>Contener: mantener el lote en cuarentena y revisar si otros lotes usaron la misma velocidad.</li>
  <li>Impacto en la homogeneidad, la disolución, la seguridad y la eficacia; revisar el historial del equipo y la causa del cambio de velocidad.</li>
  <li>Correctiva: corregir la causa (por ejemplo, parámetro mal cargado o control del equipo). Preventiva: revisar otros productos con el mismo equipo y añadir una verificación.</li>
  <li>Con evidencia: parámetros del equipo, revisión de lotes posteriores, auditoría del procedimiento y ausencia de recurrencia.</li>
</ol>
</details>
<h2>Síntesis y puente</h2>
<p>Una desviación bien gestionada es una mejora; una ocultada es una bomba de tiempo. En la próxima clase verás cómo la autoinspección y la gestión de riesgos permiten encontrar problemas antes de que los encuentre el inspector.</p>

<h2>Referencias consultadas</h2>
<ol>
<li>Ministerio de Salud y Protección Social de Colombia. <em>Resolución 1160 de 2016</em> (2016). Requisitos de desviaciones, acciones correctivas y control de cambios. <a href="https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%201160%20de%202016.pdf" target="_blank" rel="noopener noreferrer nofollow">https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%201160%20de%202016.pdf</a>. Consultado: 2026-11-03.</li>
<li>International Council for Harmonisation. <em>ICH Q10: Pharmaceutical Quality System</em> (2008). Mejora continua, CAPA y gestión del cambio. <a href="https://database.ich.org/sites/default/files/Q10%20Guideline.pdf" target="_blank" rel="noopener noreferrer nofollow">https://database.ich.org/sites/default/files/Q10%20Guideline.pdf</a>. Consultado: 2026-11-03.</li>
<li>Organización Mundial de la Salud. <em>WHO good manufacturing practices for pharmaceutical products: main principles (TRS 986, Annex 2)</em> (2014). Principios de desviaciones y acciones correctivas. <a href="https://www.who.int/publications/m/item/trs986-annex2" target="_blank" rel="noopener noreferrer nofollow">https://www.who.int/publications/m/item/trs986-annex2</a>. Consultado: 2026-11-03.</li>
</ol>
</article>$bpm_html$));


  -- ── bpm-u3-l2 · Autoinspección y gestión de riesgos ─────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Sostener el cumplimiento' AND deleted_at IS NULL
   LIMIT 1;

  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 del curso de BPM. Se salta.';
    RETURN;
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND module_id = v_unidad AND title = 'Autoinspección y gestión de riesgos' AND deleted_at IS NULL
   LIMIT 1;

  IF v_clase IS NULL THEN
    RAISE NOTICE 'No existe la clase Autoinspección y gestión de riesgos en la unidad 3. Se salta.';
    RETURN;
  END IF;

  UPDATE aula_lessons
     SET subtitle = 'Clase 8 · Encontrar antes de que encuentren',
         completion_rule = 'manual',
         duration_minutes = 75,
         is_required = TRUE,
         updated_at = NOW()
   WHERE id = v_clase;

  -- El texto viejo era un párrafo de apoyo. Se reemplaza por la clase
  -- completa; los videos, enlaces y destacados se conservan.
  DELETE FROM aula_lesson_blocks
   WHERE lesson_id = v_clase AND type = 'texto';

  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, jsonb_build_object('html', $bpm_html$<article class="aula-leccion" aria-labelledby="clase-bpm-u3-l2">
<p class="aula-leccion__intro">La autoinspección es la auditoría que la planta se hace a sí misma. La gestión de riesgos es la brújula para decidir dónde poner el esfuerzo. Juntas convierten el cumplimiento en una práctica sostenible.</p>
<p class="aula-leccion__video"><strong>Sin video obligatorio.</strong> Esta clase se aprende con el texto y los recursos de lectura; no necesitas reproducir un video para comprenderla.</p>
<h2>Resultados de aprendizaje</h2>
<ul><li>Diseñar un programa de autoinspección con independencia y seguimiento.</li><li>Priorizar riesgos con gravedad, probabilidad y detectabilidad.</li><li>Justificar una decisión de priorización con evidencia.</li></ul>
<h2>Prerrequisitos</h2>
<p>Manejo de desviaciones y CAPA.</p>
<h2>Caso de partida</h2>
<p>Una planta hace su autoinspección anual. El informe dice: «Sin hallazgos». Dos meses después, el INVIMA encuentra cinco: registros incompletos, calibración vencida, capacitación sin evaluación, desviaciones cerradas sin causa raíz y un flujo cruzado. La dirección pregunta por qué la autoinspección no vio nada.</p>

<h3>Para qué sirve una autoinspección</h3>
<p>La autoinspección no sirve para prepararse la semana anterior a la visita. Sirve para encontrar los problemas cuando todavía se pueden corregir sin consecuencias. Una autoinspección honesta encuentra hallazgos. Si nunca encuentra nada, no está auditando: está firmando un papel.</p>
<p>La Resolución 1160 de 2016 incluye un manual de autoinspección. Ese manual es el mismo estándar que usará el inspector, lo que permite evaluar la planta con la misma vara antes de que llegue.</p>

<h3>Cómo se hace bien</h3>
<ul>
  <li><strong>Independencia:</strong> la hace alguien que no es responsable del área auditada. Nadie audita bien su propio trabajo.</li>
  <li><strong>Programación:</strong> frecuencia definida, cobertura de todas las áreas en un ciclo y criterios de priorización.</li>
  <li><strong>Evidencia:</strong> no se pregunta «¿lo hacen?»; se pide el registro y se observa la práctica.</li>
  <li><strong>Cierre:</strong> plan de acción con responsable, fecha y verificación de eficacia.</li>
  <li><strong>Competencia:</strong> el auditor debe conocer la norma y el proceso; no basta con ser del área de calidad.</li>
</ul>

<h3>Gestión de riesgos: dónde poner el esfuerzo</h3>
<p>Una planta no puede tratarlo todo como igual de crítico. La ICH Q9 propone un enfoque sistemático: identificar el riesgo, analizarlo, evaluarlo y controlarlo. Para priorizar se usan, como mínimo, dos dimensiones:</p>
<ul>
  <li><strong>Gravedad:</strong> si ocurre, ¿cuánto daño hace al paciente?</li>
  <li><strong>Probabilidad:</strong> ¿con qué frecuencia podría ocurrir?</li>
</ul>
<p>Con frecuencia se añade la <strong>detectabilidad</strong>: si ocurre, ¿nos daríamos cuenta? Un riesgo poco probable pero indetectable puede ser más peligroso que uno frecuente que salta a la vista. Algunas metodologías combinan las tres en un número de prioridad de riesgo (RPN = gravedad × probabilidad × detectabilidad), pero el número no sustituye la justificación.</p>

<table>
  <caption>Tabla 1. Matriz de priorización de tres procesos</caption>
  <thead><tr><th scope="col">Proceso</th><th scope="col">Gravedad (1–5)</th><th scope="col">Probabilidad (1–5)</th><th scope="col">Detectabilidad (1–5)</th><th scope="col">RPN</th><th scope="col">Decisión</th></tr></thead>
  <tbody>
    <tr><td>Limpieza de tanque de estériles</td><td>5</td><td>3</td><td>4</td><td>60</td><td>Prioridad alta: validar y monitorear.</td></tr>
    <tr><td>Calibración de balanza de sólidos</td><td>4</td><td>2</td><td>2</td><td>16</td><td>Prioridad media: programa y verificación.</td></tr>
    <tr><td>Inventario de papelería</td><td>1</td><td>4</td><td>1</td><td>4</td><td>Prioridad baja: control administrativo.</td></tr>
  </tbody>
</table>
<p>La escala es una convención de la empresa y debe estar documentada. Lo importante no es el número exacto, sino la coherencia: dos personas con la misma información deberían llegar a una priorización similar, y la decisión debe quedar escrita.</p>

<h3>Ejemplo resuelto: la autoinspección que no vio nada</h3>
<p>En el caso inicial, la autoinspección fue hecha por el mismo jefe de producción, con una lista de verificación que solo preguntaba «¿existe el documento?». No observó la práctica, no revisó registros y no entrevistó a los operarios. El resultado era predecible.</p>
<p><strong>Corrección:</strong> separar al auditor del área, usar evidencia, incluir observación en el puesto y revisar una muestra de registros. <strong>Preventiva:</strong> formar auditores internos, programar auditorías cruzadas y medir la calidad de los hallazgos. Una autoinspección que no encuentra nada debe ser una señal de alarma, no un motivo de celebración.</p>

<h2>Segundo caso contrastado</h2>
<h3>Caso contrastado: cómo se arma un programa anual de autoinspección</h3>
<p>Una planta de 120 personas quiere pasar de una autoinspección anual a un programa que cubra todos los procesos sin repetir esfuerzo. El equipo de calidad propone este ciclo de cuatro trimestres:</p>
<ol>
  <li><strong>Trimestre 1:</strong> sistemas de calidad y documentación (procedimientos, control de versiones, registros, CAPA).</li>
  <li><strong>Trimestre 2:</strong> producción y control de calidad (expedientes de lote, liberación, muestreo, estabilidad).</li>
  <li><strong>Trimestre 3:</strong> instalaciones, equipos y servicios críticos (agua, aire, vapor, calibración, mantenimiento).</li>
  <li><strong>Trimestre 4:</strong> personal, capacitación, higiene, seguridad y seguimiento de hallazgos anteriores.</li>
</ol>
<p>Cada trimestre tiene un auditor líder distinto, una muestra de registros, observación en el puesto y una reunión de cierre. Los hallazgos se clasifican por riesgo y se ingresan al sistema CAPA. Al final del año, la dirección revisa tendencias: hallazgos repetidos, tiempo de cierre, eficacia de las acciones y áreas con mayor riesgo. El programa no busca cubrir todo al mismo tiempo; busca que ninguna área quede fuera y que el esfuerzo se concentre donde el riesgo es mayor.</p>
<h3>Qué hace que una autoinspección sea creíble</h3>
<p>La credibilidad no viene del informe, sino del método. Una autoinspección creíble tiene auditor independiente, alcance definido, criterios explícitos, evidencia verificable y seguimiento. Si el auditor es el mismo jefe del área, si la lista solo pregunta por la existencia de documentos o si los hallazgos se cierran sin verificación, el ejercicio se convierte en una firma. El inspector externo no necesitará esforzarse para encontrar lo que la planta no quiso ver.</p>
<p>Un buen indicador de madurez no es «cero hallazgos», sino «hallazgos pertinentes, causas raíz reales y acciones verificadas». Una planta que encuentra y corrige es más confiable que una que presume de no tener problemas.</p>
<p>El programa también debe revisar a sus propios auditores: rotar los equipos, comparar criterios entre auditores y revisar una muestra de informes cerrados. Si dos auditores califican el mismo hallazgo de forma muy distinta, el problema puede estar en la lista de verificación o en la formación, no en el área auditada. Esa revisión convierte la autoinspección en un sistema que también aprende.</p>

<h2>Mapa de relaciones</h2>
<p>Lee el mapa de izquierda a derecha: cada fila declara una relación y explica por qué existe. No es una lista de definiciones sueltas; es la estructura que conecta los conceptos de la clase.</p>

<table>
  <caption>Mapa de la autoinspección basada en riesgo</caption>
  <thead><tr><th scope="col">Elemento</th><th scope="col">Se relaciona con</th><th scope="col">Relación</th><th scope="col">Resultado</th></tr></thead>
  <tbody>
    <tr><td>Programa de autoinspección</td><td>Riesgo</td><td>Prioriza áreas y frecuencia</td><td>Mayor cobertura donde más importa.</td></tr>
    <tr><td>Independencia</td><td>Objetividad</td><td>Reduce el sesgo</td><td>Hallazgos más creíbles.</td></tr>
    <tr><td>Evidencia</td><td>Registros y observación</td><td>Demuestra cumplimiento</td><td>Menos opiniones y más hechos.</td></tr>
    <tr><td>CAPA</td><td>Hallazgo</td><td>Cierra la brecha</td><td>Mejora verificable.</td></tr>
    <tr><td>Verificación de eficacia</td><td>Indicador</td><td>Comprueba el cierre</td><td>Evita la recurrencia.</td></tr>
  </tbody>
</table>

<h2>Errores frecuentes y cómo corregirlos</h2>
<ul><li>Hacer la autoinspección con la misma persona que dirige el área. Corrección: asigna un auditor independiente o cruzado.</li><li>Preguntar solo si existe el documento. Corrección: pide el registro, observa la práctica y verifica la coherencia.</li><li>Cerrar hallazgos con «capacitación» sin causa raíz. Corrección: analiza el sistema y verifica la eficacia.</li><li>Usar una matriz de riesgo sin justificar las escalas. Corrección: documenta los criterios y revisa la coherencia.</li><li>Celebrar «cero hallazgos». Corrección: investiga si el alcance y la evidencia fueron suficientes.</li></ul>
<h2>Práctica de autoevaluación</h2>

<p>Una planta tiene tres riesgos identificados. Con la matriz de la clase, priorízalos y justifica:</p>
<ol>
  <li>Un equipo crítico sin calibración vigente, con alta probabilidad de afectar la dosis.</li>
  <li>Un registro de limpieza que a veces se firma al final del turno.</li>
  <li>Un extintor vencido en la oficina administrativa.</li>
</ol>
<p>Asigna valores de gravedad, probabilidad y detectabilidad, calcula el RPN y explica si el orden coincide con tu intuición. Si no coincide, revisa los valores.</p>
<details>
  <summary>Ver solución comentada</summary>
  
<p>Una asignación posible: (1) gravedad 5, probabilidad 4, detectabilidad 4 → RPN 80; (2) gravedad 4, probabilidad 3, detectabilidad 2 → RPN 24; (3) gravedad 1, probabilidad 3, detectabilidad 2 → RPN 6. El orden es 1, 2, 3. La justificación importa más que el número: el equipo crítico afecta directamente la dosis; el registro de limpieza puede ocultar una contaminación; el extintor es un riesgo de otra naturaleza y debe atenderse por seguridad, pero no compite con el riesgo del producto.</p>
</details>
<h2>Síntesis y puente</h2>
<p>La autoinspección y el riesgo te dan un sistema de alerta temprana. En la última clase verás cómo se traduce todo esto en una visita del INVIMA: qué pide el inspector, cómo se responde un hallazgo y qué hace que una planta esté lista cualquier día.</p>
<h2>Preguntas de transferencia</h2><p>Lleva lo aprendido a una situación distinta de la del caso. No hay una única respuesta; lo que se evalúa es el razonamiento y la evidencia que usas.</p><ol><li>Tu autoinspección no encontró hallazgos durante dos años. ¿Qué revisarías primero: el alcance, la independencia o la evidencia?</li><li>Un área tiene muchos hallazgos menores y otro tiene uno crítico. ¿Cómo priorizas con la matriz de riesgo?</li><li>¿Cómo convencerías a la dirección de invertir en una acción preventiva que no evita una pérdida visible?</li><li>¿Qué indicador usarías para saber si el programa de autoinspección está madurando?</li></ol>
<h2>Referencias consultadas</h2>
<ol>
<li>Ministerio de Salud y Protección Social de Colombia. <em>Resolución 1160 de 2016</em> (2016). Manual de autoinspección y requisitos de calidad. <a href="https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%201160%20de%202016.pdf" target="_blank" rel="noopener noreferrer nofollow">https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%201160%20de%202016.pdf</a>. Consultado: 2026-11-03.</li>
<li>International Council for Harmonisation. <em>ICH Q9(R1): Quality Risk Management</em> (2023). Principios de gestión de riesgos y priorización. <a href="https://database.ich.org/sites/default/files/ICH_Q9%28R1%29_Guideline_Step4_2023_0126_0.pdf" target="_blank" rel="noopener noreferrer nofollow">https://database.ich.org/sites/default/files/ICH_Q9%28R1%29_Guideline_Step4_2023_0126_0.pdf</a>. Consultado: 2026-11-03.</li>
<li>Organización Mundial de la Salud. <em>WHO good manufacturing practices for pharmaceutical products: main principles (TRS 986, Annex 2)</em> (2014). Autoinspección y mejora continua. <a href="https://www.who.int/publications/m/item/trs986-annex2" target="_blank" rel="noopener noreferrer nofollow">https://www.who.int/publications/m/item/trs986-annex2</a>. Consultado: 2026-11-03.</li>
</ol>
</article>$bpm_html$));


  -- ── bpm-u3-l3 · Cómo se prepara una visita del INVIMA ─────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Sostener el cumplimiento' AND deleted_at IS NULL
   LIMIT 1;

  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 del curso de BPM. Se salta.';
    RETURN;
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND module_id = v_unidad AND title = 'Cómo se prepara una visita del INVIMA' AND deleted_at IS NULL
   LIMIT 1;

  IF v_clase IS NULL THEN
    RAISE NOTICE 'No existe la clase Cómo se prepara una visita del INVIMA en la unidad 3. Se salta.';
    RETURN;
  END IF;

  UPDATE aula_lessons
     SET subtitle = 'Clase 9 · Evidencia, hallazgos y plan de cumplimiento',
         completion_rule = 'manual',
         duration_minutes = 80,
         is_required = TRUE,
         updated_at = NOW()
   WHERE id = v_clase;

  -- El texto viejo era un párrafo de apoyo. Se reemplaza por la clase
  -- completa; los videos, enlaces y destacados se conservan.
  DELETE FROM aula_lesson_blocks
   WHERE lesson_id = v_clase AND type = 'texto';

  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, jsonb_build_object('html', $bpm_html$<article class="aula-leccion" aria-labelledby="clase-bpm-u3-l3">
<p class="aula-leccion__intro">Una visita no se prepara la semana anterior: se está preparado. Esta clase te enseña qué mira el inspector, cómo se responde y por qué la evidencia vale más que el discurso.</p>
<p class="aula-leccion__video"><strong>Sin video obligatorio.</strong> Esta clase se aprende con el texto y los recursos de lectura; no necesitas reproducir un video para comprenderla.</p>
<h2>Resultados de aprendizaje</h2>
<ul><li>Organizar la evidencia que se solicita en una visita de inspección.</li><li>Responder un hallazgo con causa raíz, acción y verificación.</li><li>Distinguir una preparación real de una preparación de apariencia.</li></ul>
<h2>Prerrequisitos</h2>
<p>Haber estudiado desviaciones, CAPA, autoinspección y riesgo.</p>
<h2>Caso de partida</h2>
<p>Faltan dos semanas para una visita de certificación. La dirección pide «ordenar las carpetas» y comprar carpetas nuevas. El jefe de calidad encuentra que hay tres procedimientos desactualizados, dos calibraciones vencidas y una desviación crítica cerrada sin verificación de eficacia. ¿Qué se puede arreglar en dos semanas y qué no?</p>

<h3>Qué busca el inspector</h3>
<p>El inspector no viene a comprobar si la planta tiene buenas intenciones. Viene a verificar que el sistema funciona y que la evidencia lo demuestra. La visita puede tener distintos alcances: certificación, seguimiento, inspección por un producto o investigación de una alerta. En todos los casos, la lógica es la misma: observar, preguntar, pedir evidencia y contrastar.</p>
<p>La preparación real consiste en que la planta pueda demostrar, en cualquier momento, que sus procesos están bajo control. La preparación de apariencia consiste en esconder lo que no se cumplió. La primera resiste; la segunda se cae con la primera pregunta.</p>

<h3>La evidencia que suele pedirse</h3>
<ul>
  <li>Organigrama, hojas de vida y descripción de cargos del personal clave.</li>
  <li>Programa y registros de capacitación, con evaluación.</li>
  <li>Planos, flujos, clasificación de áreas y presiones diferenciales.</li>
  <li>Programa de calibración y mantenimiento, con certificados vigentes.</li>
  <li>Listado maestro de procedimientos y versiones vigentes.</li>
  <li>Expedientes de lote de los productos que el inspector elija.</li>
  <li>Registro de desviaciones, cambios y CAPA, con estado y verificación.</li>
  <li>Autoinspecciones y planes de acción.</li>
  <li>Validaciones de proceso, limpieza y métodos, según aplique.</li>
</ul>

<h3>Cómo se responde un hallazgo</h3>
<p>Un hallazgo no se discute en el pasillo. Se escucha, se entiende, se documenta y se responde por escrito. Una respuesta completa incluye:</p>
<ol>
  <li><strong>Contención:</strong> qué se hizo de inmediato para proteger al paciente o al producto.</li>
  <li><strong>Investigación:</strong> evidencia revisada y causa raíz.</li>
  <li><strong>Acción correctiva:</strong> qué se cambió para eliminar la causa.</li>
  <li><strong>Acción preventiva:</strong> dónde más podría ocurrir y qué se hizo.</li>
  <li><strong>Verificación de eficacia:</strong> cómo se comprobó que funcionó, con fecha y responsable.</li>
  <li><strong>Impacto regulatorio:</strong> si el hallazgo afecta lotes distribuidos, registros o notificaciones.</li>
</ol>
<p>Una respuesta que solo dice «se capacitó al personal» es débil: no demuestra que la causa se eliminó. Una respuesta que promete fechas imposibles es peor: garantiza el hallazgo repetido.</p>

<table>
  <caption>Tabla 1. Qué se puede resolver en dos semanas y qué no</caption>
  <thead><tr><th scope="col">Situación</th><th scope="col">¿Se resuelve en dos semanas?</th><th scope="col">Qué hacer</th></tr></thead>
  <tbody>
    <tr><td>Procedimiento desactualizado</td><td>Sí, si el cambio es documental y se aprueba.</td><td>Actualizar, aprobar, capacitar y registrar.</td></tr>
    <tr><td>Calibración vencida</td><td>Sí, si el servicio está disponible.</td><td>Calibrar, evaluar el impacto de los lotes afectados y documentar.</td></tr>
    <tr><td>Desviación crítica sin verificación</td><td>No de forma honesta.</td><td>Reabrir, investigar, verificar y reportar el estado real.</td></tr>
    <tr><td>Falta de cultura de reporte</td><td>No.</td><td>Plan de cambio cultural con indicadores y liderazgo.</td></tr>
    <tr><td>Flujo cruzado por diseño</td><td>No, si requiere obra civil.</td><td>Medidas provisionales, evaluación de riesgo y plan de inversión.</td></tr>
  </tbody>
</table>

<h3>Ejemplo resuelto: una visita con tres hallazgos</h3>
<p>El inspector encuentra: (1) un registro de limpieza firmado al final del turno; (2) una calibración vencida en una balanza; (3) una acción correctiva cerrada sin verificación. La planta responde:</p>
<ul>
  <li><strong>Hallazgo 1:</strong> contención (revisar los lotes afectados), investigación (por qué se firmó al final), correctiva (cambio del registro y verificación en línea), preventiva (revisar otras áreas), eficacia (auditoría de registros durante tres meses).</li>
  <li><strong>Hallazgo 2:</strong> calibración inmediata, evaluación del impacto en los lotes fabricados con la balanza y ajuste del programa de calibración.</li>
  <li><strong>Hallazgo 3:</strong> reapertura de la CAPA, verificación con evidencia y actualización del procedimiento de cierre.</li>
</ul>
<p>La respuesta no promete que «nunca volverá a pasar». Demuestra qué se hizo, cómo se comprobó y qué queda pendiente. Esa honestidad es lo que sostiene la certificación.</p>

<h2>Segundo caso contrastado</h2>
<h3>Caso contrastado: el expediente de lote que no se podía reconstruir</h3>
<p>Durante una visita, el inspector elige un lote fabricado ocho meses antes y pide el expediente. La planta entrega la fórmula maestra, el registro de fabricación y el certificado de análisis, pero no encuentra el registro de limpieza del equipo ni la calibración de la balanza usada ese día. El jefe de calidad explica que esos documentos «están en otra carpeta». El inspector espera. Después de 40 minutos, la planta encuentra la calibración, pero no la limpieza. El hallazgo no es que la limpieza no se hizo: es que no se puede demostrar.</p>
<p>Un expediente debe estar organizado para reconstruir el lote sin depender de la memoria de una persona. La lista mínima incluye: orden de producción, fórmula maestra vigente, registro de fabricación, registros de limpieza y cambio de producto, calibración de instrumentos críticos, certificados de materias primas, resultados de control en proceso y liberación, y registro de desviaciones del lote. Si un documento no está en el expediente, debe haber una referencia clara a dónde encontrarlo. La trazabilidad no es un lujo: es la diferencia entre demostrar y suponer.</p>
<h3>Cómo preparar una sala de evidencia</h3>
<p>Una práctica útil es preparar una sala o carpeta digital con la evidencia de los últimos lotes, organizada por producto y por fecha. No se trata de una carpeta para la visita: se trata de la misma evidencia que se usa para investigar una queja o una alerta. Si la planta puede reconstruir un lote en menos de una hora, está preparada. Si necesita tres días, el problema no es la visita: es el sistema documental.</p>
<p>Antes de la visita, conviene hacer un simulacro: elegir un lote al azar, pedir el expediente y cronometrar cuánto tarda el equipo en reunir la evidencia. Ese ejercicio revela más que una presentación de PowerPoint y permite corregir antes de que el inspector haga la misma pregunta.</p>

<h2>Mapa de relaciones</h2>
<p>Lee el mapa de izquierda a derecha: cada fila declara una relación y explica por qué existe. No es una lista de definiciones sueltas; es la estructura que conecta los conceptos de la clase.</p>

<table>
  <caption>Mapa de una visita y su cierre</caption>
  <thead><tr><th scope="col">Fase</th><th scope="col">Pregunta</th><th scope="col">Evidencia</th><th scope="col">Riesgo si falla</th></tr></thead>
  <tbody>
    <tr><td>Preparación</td><td>¿Podemos demostrar lo que hacemos?</td><td>Expedientes, registros, validaciones</td><td>Hallazgos por falta de evidencia.</td></tr>
    <tr><td>Visita</td><td>¿Lo que observa el inspector coincide con el registro?</td><td>Observación y entrevistas</td><td>Inconsistencia entre práctica y documento.</td></tr>
    <tr><td>Respuesta</td><td>¿La causa raíz es real y la acción es verificable?</td><td>Informe CAPA</td><td>Hallazgo repetido.</td></tr>
    <tr><td>Cierre</td><td>¿La acción funcionó?</td><td>Indicador y auditoría</td><td>Recurrencia y pérdida de confianza.</td></tr>
  </tbody>
</table>

<h2>Errores frecuentes y cómo corregirlos</h2>
<ul><li>Preparar la visita ordenando carpetas en lugar de corregir el sistema. Corrección: empieza por la evidencia de los procesos críticos.</li><li>Discutir un hallazgo con el inspector en el momento. Corrección: escucha, documenta y responde por escrito.</li><li>Responder con «capacitación» sin causa raíz. Corrección: investiga el sistema y verifica la eficacia.</li><li>Prometer fechas que no se pueden cumplir. Corrección: negocia plazos realistas y documenta el avance.</li><li>Ocultar un documento o un lote. Corrección: la transparencia sostiene la confianza; ocultar agrava el hallazgo.</li></ul>
<h2>Práctica de autoevaluación</h2>

<p>Faltan 10 días para una visita. La planta tiene estos pendientes. Clasifícalos en «se puede cerrar antes», «se puede contener con plan» y «no se puede cerrar de forma honesta». Justifica.</p>
<ol>
  <li>Un PNO de limpieza con la versión anterior en el área.</li>
  <li>Una desviación crítica sin investigación de causa raíz.</li>
  <li>Una balanza sin calibrar desde hace un mes.</li>
  <li>Un programa de capacitación sin evaluación.</li>
  <li>Un flujo de residuos que cruza el pasillo limpio.</li>
</ol>
<details>
  <summary>Ver solución comentada</summary>
  
<ol>
  <li>Se puede cerrar: reemplazar la versión, capacitar y registrar.</li>
  <li>No se puede cerrar de forma honesta: requiere investigación y verificación; se contiene y se presenta un plan con avance real.</li>
  <li>Se puede cerrar: calibrar y evaluar el impacto de los lotes afectados.</li>
  <li>Se puede contener con plan: rediseñar la evaluación y aplicarla; no se improvoca una cultura de capacitación en 10 días.</li>
  <li>No se puede cerrar si requiere obra; se contiene con rutas y horarios y se presenta un plan de inversión.</li>
</ol>
</details>
<h2>Síntesis y puente</h2>
<p>Con esta clase cierras el curso. La idea que queda es simple: el cumplimiento no se actúa para la visita; se demuestra con evidencia todos los días. Si puedes reconstruir un lote, explicar una desviación y verificar una acción, estás listo para una inspección y, sobre todo, para proteger al paciente.</p>
<h2>Preguntas de transferencia</h2><p>Lleva lo aprendido a una situación distinta de la del caso. No hay una única respuesta; lo que se evalúa es el razonamiento y la evidencia que usas.</p><ol><li>El inspector pide un lote fabricado hace un año y el expediente está incompleto. ¿Qué buscas primero y qué comunicas?</li><li>Un hallazgo afecta lotes ya distribuidos. ¿Qué evaluación de impacto y qué comunicación activas?</li><li>La dirección quiere prometer al cliente que «no habrá más hallazgos». ¿Cómo respondes con evidencia y realismo?</li><li>¿Qué harías para que la preparación de la próxima visita no dependa de una semana de carpetas?</li></ol>
<h2>Referencias consultadas</h2>
<ol>
<li>Ministerio de Salud y Protección Social de Colombia. <em>Resolución 1160 de 2016</em> (2016). Requisitos de inspección, autoinspección y evidencia. <a href="https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%201160%20de%202016.pdf" target="_blank" rel="noopener noreferrer nofollow">https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%201160%20de%202016.pdf</a>. Consultado: 2026-11-03.</li>
<li>Organización Mundial de la Salud. <em>WHO good manufacturing practices for pharmaceutical products: main principles (TRS 986, Annex 2)</em> (2014). Criterios de inspección y sistemas de calidad. <a href="https://www.who.int/publications/m/item/trs986-annex2" target="_blank" rel="noopener noreferrer nofollow">https://www.who.int/publications/m/item/trs986-annex2</a>. Consultado: 2026-11-03.</li>
<li>International Council for Harmonisation. <em>ICH Q10: Pharmaceutical Quality System</em> (2008). Mejora continua y verificación de eficacia. <a href="https://database.ich.org/sites/default/files/Q10%20Guideline.pdf" target="_blank" rel="noopener noreferrer nofollow">https://database.ich.org/sites/default/files/Q10%20Guideline.pdf</a>. Consultado: 2026-11-03.</li>
</ol>
</article>$bpm_html$));


  -- ── Quiz bpm-u1-quiz ───────────────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'De dónde salen las BPM' AND deleted_at IS NULL
   LIMIT 1;

  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = 'Evaluación de la Unidad 1 · Fundamentos y normativa' AND deleted_at IS NULL
   LIMIT 1;

  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Evaluación de la Unidad 1 · Fundamentos y normativa', 'Cuatro preguntas de selección múltiple. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. Las respuestas correctas y la retroalimentación se muestran después de enviar.')
    RETURNING id INTO v_banco;
  ELSE
    UPDATE aula_question_banks
       SET description = 'Cuatro preguntas de selección múltiple. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. Las respuestas correctas y la retroalimentación se muestran después de enviar.', updated_at = NOW()
     WHERE id = v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = 'Evaluación de la Unidad 1 · Fundamentos y normativa' AND deleted_at IS NULL
   LIMIT 1;

  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score,
       max_attempts, shuffle_questions, shuffle_options, show_answers_after_submit,
       status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, 'Evaluación de la Unidad 1 · Fundamentos y normativa', 'Cuatro preguntas de selección múltiple. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. Las respuestas correctas y la retroalimentación se muestran después de enviar.', TRUE,
       70, 2, FALSE, FALSE, TRUE, 'publicado', 1, 10)
    RETURNING id INTO v_eval;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad,
           instructions_html = 'Cuatro preguntas de selección múltiple. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. Las respuestas correctas y la retroalimentación se muestran después de enviar.',
           is_required = TRUE,
           passing_score = 70,
           max_attempts = 2,
           show_answers_after_submit = TRUE,
           status = 'publicado',
           weight = 10,
           sort_order = 1,
           updated_at = NOW()
     WHERE id = v_eval;
  END IF;

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas.', 'Evaluación de la Unidad 1 · Fundamentos y normativa';
  ELSE

  DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


  SELECT id INTO v_pregunta FROM aula_questions
   WHERE bank_id = v_banco AND config->>'external_id' = 'bpm-u1-q1' AND deleted_at IS NULL
   LIMIT 1;

  IF v_pregunta IS NULL THEN
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', 'Un lote de 1.000.000 de tabletas tiene 1.000 unidades defectuosas distribuidas de forma heterogénea. Se analiza una muestra aleatoria de 20 unidades y todas cumplen. ¿Cuál es la conclusión más defendible?', 25, 'La muestra puede no detectar un defecto heterogéneo. Su resultado es evidencia, no una garantía universal. Las BPM controlan el proceso para reducir la probabilidad de que el defecto exista.', 'La muestra puede no detectar un defecto heterogéneo. Su resultado es evidencia, no una garantía universal. Las BPM controlan el proceso para reducir la probabilidad de que el defecto exista.', $bpm_json${"external_id":"bpm-u1-q1","cognitive_level":"Aplicar","difficulty":"media","lesson_id":"bpm-u1-l1","outcome":"Explicar por qué el control del producto terminado no basta."}$bpm_json$::jsonb)
    RETURNING id INTO v_pregunta;
  ELSE
    UPDATE aula_questions
       SET prompt_html = 'Un lote de 1.000.000 de tabletas tiene 1.000 unidades defectuosas distribuidas de forma heterogénea. Se analiza una muestra aleatoria de 20 unidades y todas cumplen. ¿Cuál es la conclusión más defendible?',
           points = 25,
           general_feedback = 'La muestra puede no detectar un defecto heterogéneo. Su resultado es evidencia, no una garantía universal. Las BPM controlan el proceso para reducir la probabilidad de que el defecto exista.',
           explanation = 'La muestra puede no detectar un defecto heterogéneo. Su resultado es evidencia, no una garantía universal. Las BPM controlan el proceso para reducir la probabilidad de que el defecto exista.',
           config = $bpm_json${"external_id":"bpm-u1-q1","cognitive_level":"Aplicar","difficulty":"media","lesson_id":"bpm-u1-l1","outcome":"Explicar por qué el control del producto terminado no basta."}$bpm_json$::jsonb,
           updated_at = NOW()
     WHERE id = v_pregunta;
  END IF;

  DELETE FROM aula_question_options WHERE question_id = v_pregunta;


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'El lote es conforme porque la muestra representativa cumplió.', FALSE, 'Una muestra de 20 no representa automáticamente a un millón, sobre todo si el defecto es heterogéneo. Repasa el ejemplo de probabilidad de la clase 1.', 0);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'La muestra reduce el riesgo, pero no demuestra por sí sola que todo el lote sea conforme.', TRUE, 'Correcto. El muestreo tiene límites estadísticos y no reemplaza el control del proceso.', 1);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'El lote debe rechazarse siempre que la muestra cumpla, porque el muestreo nunca sirve.', FALSE, 'El muestreo sí aporta información; lo que no hace es garantizar todo el lote. La clase explica sus límites, no su inutilidad.', 2);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'El resultado demuestra que el proceso fue homogéneo en las 999.980 unidades restantes.', FALSE, 'No se puede inferir homogeneidad de una muestra pequeña. La homogeneidad se controla en el proceso.', 3);


  INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
  VALUES (v_eval, v_pregunta, 0, 25);


  SELECT id INTO v_pregunta FROM aula_questions
   WHERE bank_id = v_banco AND config->>'external_id' = 'bpm-u1-q2' AND deleted_at IS NULL
   LIMIT 1;

  IF v_pregunta IS NULL THEN
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', '¿Cuál de las siguientes actividades corresponde al aseguramiento de la calidad y no solo al control de calidad?', 25, 'El control de calidad mide y decide sobre muestras; el aseguramiento diseña el sistema (calibración, capacitación, validación, auditoría) que hace que esas mediciones sean confiables.', 'El control de calidad mide y decide sobre muestras; el aseguramiento diseña el sistema (calibración, capacitación, validación, auditoría) que hace que esas mediciones sean confiables.', $bpm_json${"external_id":"bpm-u1-q2","cognitive_level":"Comprender","difficulty":"baja","lesson_id":"bpm-u1-l1","outcome":"Distinguir control de calidad de aseguramiento de la calidad."}$bpm_json$::jsonb)
    RETURNING id INTO v_pregunta;
  ELSE
    UPDATE aula_questions
       SET prompt_html = '¿Cuál de las siguientes actividades corresponde al aseguramiento de la calidad y no solo al control de calidad?',
           points = 25,
           general_feedback = 'El control de calidad mide y decide sobre muestras; el aseguramiento diseña el sistema (calibración, capacitación, validación, auditoría) que hace que esas mediciones sean confiables.',
           explanation = 'El control de calidad mide y decide sobre muestras; el aseguramiento diseña el sistema (calibración, capacitación, validación, auditoría) que hace que esas mediciones sean confiables.',
           config = $bpm_json${"external_id":"bpm-u1-q2","cognitive_level":"Comprender","difficulty":"baja","lesson_id":"bpm-u1-l1","outcome":"Distinguir control de calidad de aseguramiento de la calidad."}$bpm_json$::jsonb,
           updated_at = NOW()
     WHERE id = v_pregunta;
  END IF;

  DELETE FROM aula_question_options WHERE question_id = v_pregunta;


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Analizar el contenido de principio activo en una muestra del lote.', FALSE, 'Eso es control de calidad: una medición sobre una muestra.', 0);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Liberar un lote porque cumple la especificación.', FALSE, 'La liberación es una decisión de control de calidad; el aseguramiento diseña el sistema que la hace confiable.', 1);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Diseñar el programa de calibración y verificar que se cumple.', TRUE, 'Correcto. El aseguramiento diseña y sostiene el sistema que hace confiables las mediciones.', 2);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Registrar el pH de una solución durante el proceso.', FALSE, 'El registro es una actividad de control; el aseguramiento define cómo, cuándo y quién lo verifica.', 3);


  INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
  VALUES (v_eval, v_pregunta, 1, 25);


  SELECT id INTO v_pregunta FROM aula_questions
   WHERE bank_id = v_banco AND config->>'external_id' = 'bpm-u1-q3' AND deleted_at IS NULL
   LIMIT 1;

  IF v_pregunta IS NULL THEN
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', 'Una planta fabrica un medicamento con registro sanitario vigente, pero no tiene certificado de BPM para esa línea. ¿Cuál es la lectura correcta?', 25, 'La Resolución 1160 regula cómo se fabrica; el Decreto 677 regula el permiso del producto. Una planta necesita ambos controles.', 'La Resolución 1160 regula cómo se fabrica; el Decreto 677 regula el permiso del producto. Una planta necesita ambos controles.', $bpm_json${"external_id":"bpm-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_id":"bpm-u1-l2","outcome":"Distinguir qué regula la Resolución 1160 y qué regula el Decreto 677."}$bpm_json$::jsonb)
    RETURNING id INTO v_pregunta;
  ELSE
    UPDATE aula_questions
       SET prompt_html = 'Una planta fabrica un medicamento con registro sanitario vigente, pero no tiene certificado de BPM para esa línea. ¿Cuál es la lectura correcta?',
           points = 25,
           general_feedback = 'La Resolución 1160 regula cómo se fabrica; el Decreto 677 regula el permiso del producto. Una planta necesita ambos controles.',
           explanation = 'La Resolución 1160 regula cómo se fabrica; el Decreto 677 regula el permiso del producto. Una planta necesita ambos controles.',
           config = $bpm_json${"external_id":"bpm-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_id":"bpm-u1-l2","outcome":"Distinguir qué regula la Resolución 1160 y qué regula el Decreto 677."}$bpm_json$::jsonb,
           updated_at = NOW()
     WHERE id = v_pregunta;
  END IF;

  DELETE FROM aula_question_options WHERE question_id = v_pregunta;


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Está todo en orden: el registro sanitario cubre la fabricación.', FALSE, 'El registro autoriza el producto; no certifica la línea de fabricación. Repasa la tabla de normas de la clase 2.', 0);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Falta el control de BPM: el registro y la certificación son requisitos distintos y complementarios.', TRUE, 'Correcto. El producto puede tener registro y la planta no estar certificada para esa línea.', 1);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'La certificación de BPM reemplaza el registro sanitario.', FALSE, 'Son controles distintos: uno es del sistema de fabricación y el otro del producto.', 2);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'El Decreto 677 exige la certificación de BPM y la Resolución 1160 el registro.', FALSE, 'Están invertidos. La Resolución 1160 adopta los manuales de BPM; el Decreto 677 regula el registro.', 3);


  INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
  VALUES (v_eval, v_pregunta, 2, 25);


  SELECT id INTO v_pregunta FROM aula_questions
   WHERE bank_id = v_banco AND config->>'external_id' = 'bpm-u1-q4' AND deleted_at IS NULL
   LIMIT 1;

  IF v_pregunta IS NULL THEN
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', 'Un certificado de BPM cubre «formas farmacéuticas sólidas no estériles». La empresa quiere fabricar un jarabe en la misma planta. ¿Qué corresponde hacer?', 25, 'La certificación tiene un alcance. Si la línea o la forma farmacéutica no está cubierta, se necesita otra certificación o una ampliación.', 'La certificación tiene un alcance. Si la línea o la forma farmacéutica no está cubierta, se necesita otra certificación o una ampliación.', $bpm_json${"external_id":"bpm-u1-q4","cognitive_level":"Aplicar","difficulty":"media","lesson_id":"bpm-u1-l3","outcome":"Interpretar el alcance de una certificación de BPM."}$bpm_json$::jsonb)
    RETURNING id INTO v_pregunta;
  ELSE
    UPDATE aula_questions
       SET prompt_html = 'Un certificado de BPM cubre «formas farmacéuticas sólidas no estériles». La empresa quiere fabricar un jarabe en la misma planta. ¿Qué corresponde hacer?',
           points = 25,
           general_feedback = 'La certificación tiene un alcance. Si la línea o la forma farmacéutica no está cubierta, se necesita otra certificación o una ampliación.',
           explanation = 'La certificación tiene un alcance. Si la línea o la forma farmacéutica no está cubierta, se necesita otra certificación o una ampliación.',
           config = $bpm_json${"external_id":"bpm-u1-q4","cognitive_level":"Aplicar","difficulty":"media","lesson_id":"bpm-u1-l3","outcome":"Interpretar el alcance de una certificación de BPM."}$bpm_json$::jsonb,
           updated_at = NOW()
     WHERE id = v_pregunta;
  END IF;

  DELETE FROM aula_question_options WHERE question_id = v_pregunta;


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Usar el certificado actual, porque la planta ya está certificada.', FALSE, 'El alcance no cubre líquidos orales. La certificación es específica.', 0);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Verificar si existe otra certificación para líquidos orales o solicitar la ampliación del alcance.', TRUE, 'Correcto. El alcance del certificado delimita lo que se puede afirmar.', 1);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Asumir que el jarabe es equivalente a una tableta porque ambos son no estériles.', FALSE, 'La forma farmacéutica y el proceso son distintos; la equivalencia no se presume.', 2);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Pedir solo el certificado de análisis del jarabe y omitir la certificación.', FALSE, 'El análisis del producto no reemplaza la certificación de la línea.', 3);


  INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
  VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz bpm-u2-quiz ───────────────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Las BPM en la planta' AND deleted_at IS NULL
   LIMIT 1;

  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = 'Evaluación de la Unidad 2 · Personas, instalaciones y documentación' AND deleted_at IS NULL
   LIMIT 1;

  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Evaluación de la Unidad 2 · Personas, instalaciones y documentación', 'Cuatro preguntas de selección múltiple. Cada una vale 25 puntos. Dos intentos; se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
  ELSE
    UPDATE aula_question_banks
       SET description = 'Cuatro preguntas de selección múltiple. Cada una vale 25 puntos. Dos intentos; se conserva la nota mayor. La retroalimentación se muestra después de enviar.', updated_at = NOW()
     WHERE id = v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = 'Evaluación de la Unidad 2 · Personas, instalaciones y documentación' AND deleted_at IS NULL
   LIMIT 1;

  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score,
       max_attempts, shuffle_questions, shuffle_options, show_answers_after_submit,
       status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, 'Evaluación de la Unidad 2 · Personas, instalaciones y documentación', 'Cuatro preguntas de selección múltiple. Cada una vale 25 puntos. Dos intentos; se conserva la nota mayor. La retroalimentación se muestra después de enviar.', TRUE,
       70, 2, FALSE, FALSE, TRUE, 'publicado', 2, 10)
    RETURNING id INTO v_eval;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad,
           instructions_html = 'Cuatro preguntas de selección múltiple. Cada una vale 25 puntos. Dos intentos; se conserva la nota mayor. La retroalimentación se muestra después de enviar.',
           is_required = TRUE,
           passing_score = 70,
           max_attempts = 2,
           show_answers_after_submit = TRUE,
           status = 'publicado',
           weight = 10,
           sort_order = 2,
           updated_at = NOW()
     WHERE id = v_eval;
  END IF;

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas.', 'Evaluación de la Unidad 2 · Personas, instalaciones y documentación';
  ELSE

  DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


  SELECT id INTO v_pregunta FROM aula_questions
   WHERE bank_id = v_banco AND config->>'external_id' = 'bpm-u2-q1' AND deleted_at IS NULL
   LIMIT 1;

  IF v_pregunta IS NULL THEN
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', 'En un área limpia, un operario se coloca primero el overol y luego el gorro. ¿Cuál es el riesgo principal de ese orden?', 25, 'La secuencia de vestimenta se diseña para que lo más contaminante se contenga primero y no contamine las prendas limpias.', 'La secuencia de vestimenta se diseña para que lo más contaminante se contenga primero y no contamine las prendas limpias.', $bpm_json${"external_id":"bpm-u2-q1","cognitive_level":"Aplicar","difficulty":"media","lesson_id":"bpm-u2-l1","outcome":"Aplicar reglas de vestimenta y justificar su función."}$bpm_json$::jsonb)
    RETURNING id INTO v_pregunta;
  ELSE
    UPDATE aula_questions
       SET prompt_html = 'En un área limpia, un operario se coloca primero el overol y luego el gorro. ¿Cuál es el riesgo principal de ese orden?',
           points = 25,
           general_feedback = 'La secuencia de vestimenta se diseña para que lo más contaminante se contenga primero y no contamine las prendas limpias.',
           explanation = 'La secuencia de vestimenta se diseña para que lo más contaminante se contenga primero y no contamine las prendas limpias.',
           config = $bpm_json${"external_id":"bpm-u2-q1","cognitive_level":"Aplicar","difficulty":"media","lesson_id":"bpm-u2-l1","outcome":"Aplicar reglas de vestimenta y justificar su función."}$bpm_json$::jsonb,
           updated_at = NOW()
     WHERE id = v_pregunta;
  END IF;

  DELETE FROM aula_question_options WHERE question_id = v_pregunta;


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Ninguno: el orden de las prendas no afecta la contaminación.', FALSE, 'El orden importa porque las partículas del cabello pueden depositarse sobre una prenda que se supone limpia.', 0);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Que las partículas del cabello caigan sobre el overol ya colocado.', TRUE, 'Correcto. El gorro debe ir antes para contener el cabello antes de cubrir el cuerpo.', 1);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Que el overol se arrugue y pierda la barrera.', FALSE, 'El riesgo principal es la contaminación por partículas, no la estética ni las arrugas.', 2);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Que el gorro quede demasiado ajustado.', FALSE, 'La incomodidad no es el riesgo microbiológico central.', 3);


  INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
  VALUES (v_eval, v_pregunta, 0, 25);


  SELECT id INTO v_pregunta FROM aula_questions
   WHERE bank_id = v_banco AND config->>'external_id' = 'bpm-u2-q2' AND deleted_at IS NULL
   LIMIT 1;

  IF v_pregunta IS NULL THEN
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', '¿Cuál de estos conjuntos demuestra mejor que una capacitación fue eficaz?', 25, 'La evidencia de capacitación debe mostrar comprensión y aplicación, no solo asistencia.', 'La evidencia de capacitación debe mostrar comprensión y aplicación, no solo asistencia.', $bpm_json${"external_id":"bpm-u2-q2","cognitive_level":"Analizar","difficulty":"media","lesson_id":"bpm-u2-l1","outcome":"Diseñar evidencia de capacitación."}$bpm_json$::jsonb)
    RETURNING id INTO v_pregunta;
  ELSE
    UPDATE aula_questions
       SET prompt_html = '¿Cuál de estos conjuntos demuestra mejor que una capacitación fue eficaz?',
           points = 25,
           general_feedback = 'La evidencia de capacitación debe mostrar comprensión y aplicación, no solo asistencia.',
           explanation = 'La evidencia de capacitación debe mostrar comprensión y aplicación, no solo asistencia.',
           config = $bpm_json${"external_id":"bpm-u2-q2","cognitive_level":"Analizar","difficulty":"media","lesson_id":"bpm-u2-l1","outcome":"Diseñar evidencia de capacitación."}$bpm_json$::jsonb,
           updated_at = NOW()
     WHERE id = v_pregunta;
  END IF;

  DELETE FROM aula_question_options WHERE question_id = v_pregunta;


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Lista de asistencia firmada por todos los operarios.', FALSE, 'La asistencia prueba presencia, no comprensión.', 0);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Diapositivas del curso y correo de convocatoria.', FALSE, 'Son materiales, no evidencia de aprendizaje.', 1);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Evaluación con criterio de aprobación y observación práctica en el puesto.', TRUE, 'Correcto. La combinación de evaluación y observación demuestra comprensión y aplicación.', 2);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Certificado de participación emitido por el instructor.', FALSE, 'El certificado de participación no prueba que la persona sepa ejecutar la tarea.', 3);


  INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
  VALUES (v_eval, v_pregunta, 1, 25);


  SELECT id INTO v_pregunta FROM aula_questions
   WHERE bank_id = v_banco AND config->>'external_id' = 'bpm-u2-q3' AND deleted_at IS NULL
   LIMIT 1;

  IF v_pregunta IS NULL THEN
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', 'En un área de producto peligroso, la presión se mantiene menor que la del pasillo. ¿Qué se logra con eso?', 25, 'La presión negativa protege al exterior: el aire entra y el contaminante queda contenido.', 'La presión negativa protege al exterior: el aire entra y el contaminante queda contenido.', $bpm_json${"external_id":"bpm-u2-q3","cognitive_level":"Comprender","difficulty":"media","lesson_id":"bpm-u2-l2","outcome":"Interpretar presiones diferenciales y esclusas."}$bpm_json$::jsonb)
    RETURNING id INTO v_pregunta;
  ELSE
    UPDATE aula_questions
       SET prompt_html = 'En un área de producto peligroso, la presión se mantiene menor que la del pasillo. ¿Qué se logra con eso?',
           points = 25,
           general_feedback = 'La presión negativa protege al exterior: el aire entra y el contaminante queda contenido.',
           explanation = 'La presión negativa protege al exterior: el aire entra y el contaminante queda contenido.',
           config = $bpm_json${"external_id":"bpm-u2-q3","cognitive_level":"Comprender","difficulty":"media","lesson_id":"bpm-u2-l2","outcome":"Interpretar presiones diferenciales y esclusas."}$bpm_json$::jsonb,
           updated_at = NOW()
     WHERE id = v_pregunta;
  END IF;

  DELETE FROM aula_question_options WHERE question_id = v_pregunta;


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Que el aire del pasillo entre al área y el polvo peligroso no escape.', TRUE, 'Correcto. La presión negativa contiene el polvo dentro del área.', 0);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Que el aire del área salga al pasillo y arrastre el polvo.', FALSE, 'Eso sería presión positiva y dispersaría el riesgo.', 1);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Que la esclusa pueda tener ambas puertas abiertas.', FALSE, 'La esclusa debe mantener la diferencia; abrir ambas la anula.', 2);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Que no sea necesario limpiar el área.', FALSE, 'La presión no sustituye la limpieza ni la contención.', 3);


  INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
  VALUES (v_eval, v_pregunta, 2, 25);


  SELECT id INTO v_pregunta FROM aula_questions
   WHERE bank_id = v_banco AND config->>'external_id' = 'bpm-u2-q4' AND deleted_at IS NULL
   LIMIT 1;

  IF v_pregunta IS NULL THEN
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', 'Un analista se equivoca al escribir un resultado. ¿Cuál es la corrección aceptable?', 25, 'La corrección debe preservar el original, identificar al corrector y explicar el motivo.', 'La corrección debe preservar el original, identificar al corrector y explicar el motivo.', $bpm_json${"external_id":"bpm-u2-q4","cognitive_level":"Aplicar","difficulty":"baja","lesson_id":"bpm-u2-l3","outcome":"Aplicar ALCOA+ a una corrección documental."}$bpm_json$::jsonb)
    RETURNING id INTO v_pregunta;
  ELSE
    UPDATE aula_questions
       SET prompt_html = 'Un analista se equivoca al escribir un resultado. ¿Cuál es la corrección aceptable?',
           points = 25,
           general_feedback = 'La corrección debe preservar el original, identificar al corrector y explicar el motivo.',
           explanation = 'La corrección debe preservar el original, identificar al corrector y explicar el motivo.',
           config = $bpm_json${"external_id":"bpm-u2-q4","cognitive_level":"Aplicar","difficulty":"baja","lesson_id":"bpm-u2-l3","outcome":"Aplicar ALCOA+ a una corrección documental."}$bpm_json$::jsonb,
           updated_at = NOW()
     WHERE id = v_pregunta;
  END IF;

  DELETE FROM aula_question_options WHERE question_id = v_pregunta;


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Usar corrector y escribir el valor correcto encima.', FALSE, 'El corrector oculta el dato original y rompe la trazabilidad.', 0);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Tachar el valor, escribir el nuevo, y anotar fecha, firma y motivo.', TRUE, 'Correcto. La corrección deja ver el dato original y quién la hizo.', 1);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Arrancar la página y repetir el registro.', FALSE, 'Elimina evidencia y puede interpretarse como alteración.', 2);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Dejar el valor erróneo y explicarlo en una nota verbal.', FALSE, 'La nota verbal no queda en el registro y no es verificable.', 3);


  INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
  VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz bpm-u3-quiz ───────────────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Sostener el cumplimiento' AND deleted_at IS NULL
   LIMIT 1;

  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = 'Evaluación de la Unidad 3 · Sostener el cumplimiento' AND deleted_at IS NULL
   LIMIT 1;

  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Evaluación de la Unidad 3 · Sostener el cumplimiento', 'Cuatro preguntas de selección múltiple. Cada una vale 25 puntos. Dos intentos; se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
  ELSE
    UPDATE aula_question_banks
       SET description = 'Cuatro preguntas de selección múltiple. Cada una vale 25 puntos. Dos intentos; se conserva la nota mayor. La retroalimentación se muestra después de enviar.', updated_at = NOW()
     WHERE id = v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = 'Evaluación de la Unidad 3 · Sostener el cumplimiento' AND deleted_at IS NULL
   LIMIT 1;

  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score,
       max_attempts, shuffle_questions, shuffle_options, show_answers_after_submit,
       status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, 'Evaluación de la Unidad 3 · Sostener el cumplimiento', 'Cuatro preguntas de selección múltiple. Cada una vale 25 puntos. Dos intentos; se conserva la nota mayor. La retroalimentación se muestra después de enviar.', TRUE,
       70, 2, FALSE, FALSE, TRUE, 'publicado', 3, 10)
    RETURNING id INTO v_eval;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad,
           instructions_html = 'Cuatro preguntas de selección múltiple. Cada una vale 25 puntos. Dos intentos; se conserva la nota mayor. La retroalimentación se muestra después de enviar.',
           is_required = TRUE,
           passing_score = 70,
           max_attempts = 2,
           show_answers_after_submit = TRUE,
           status = 'publicado',
           weight = 10,
           sort_order = 3,
           updated_at = NOW()
     WHERE id = v_eval;
  END IF;

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas.', 'Evaluación de la Unidad 3 · Sostener el cumplimiento';
  ELSE

  DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


  SELECT id INTO v_pregunta FROM aula_questions
   WHERE bank_id = v_banco AND config->>'external_id' = 'bpm-u3-q1' AND deleted_at IS NULL
   LIMIT 1;

  IF v_pregunta IS NULL THEN
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', 'Tras detectar un lote con etiquetas equivocadas, la empresa separa el lote y reetiqueta los frascos. ¿Qué tipo de acción es esa?', 25, 'La corrección atiende el efecto inmediato; la acción correctiva elimina la causa; la preventiva evita que ocurra en otros procesos.', 'La corrección atiende el efecto inmediato; la acción correctiva elimina la causa; la preventiva evita que ocurra en otros procesos.', $bpm_json${"external_id":"bpm-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_id":"bpm-u3-l1","outcome":"Distinguir corrección, acción correctiva y preventiva."}$bpm_json$::jsonb)
    RETURNING id INTO v_pregunta;
  ELSE
    UPDATE aula_questions
       SET prompt_html = 'Tras detectar un lote con etiquetas equivocadas, la empresa separa el lote y reetiqueta los frascos. ¿Qué tipo de acción es esa?',
           points = 25,
           general_feedback = 'La corrección atiende el efecto inmediato; la acción correctiva elimina la causa; la preventiva evita que ocurra en otros procesos.',
           explanation = 'La corrección atiende el efecto inmediato; la acción correctiva elimina la causa; la preventiva evita que ocurra en otros procesos.',
           config = $bpm_json${"external_id":"bpm-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_id":"bpm-u3-l1","outcome":"Distinguir corrección, acción correctiva y preventiva."}$bpm_json$::jsonb,
           updated_at = NOW()
     WHERE id = v_pregunta;
  END IF;

  DELETE FROM aula_question_options WHERE question_id = v_pregunta;


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Acción preventiva, porque evita que vuelva a ocurrir.', FALSE, 'La preventiva actúa sobre causas potenciales en otros procesos; reetiquetar corrige el efecto actual.', 0);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Corrección, porque atiende el efecto inmediato.', TRUE, 'Correcto. La corrección resuelve el efecto; la correctiva elimina la causa.', 1);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Acción correctiva, porque elimina la causa raíz.', FALSE, 'Reetiquetar no elimina la causa que permitió la confusión.', 2);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Control de cambios, porque modifica el producto.', FALSE, 'El control de cambios evalúa modificaciones; aquí se está corrigiendo un lote.', 3);


  INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
  VALUES (v_eval, v_pregunta, 0, 25);


  SELECT id INTO v_pregunta FROM aula_questions
   WHERE bank_id = v_banco AND config->>'external_id' = 'bpm-u3-q2' AND deleted_at IS NULL
   LIMIT 1;

  IF v_pregunta IS NULL THEN
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', 'Una investigación concluye: «El operario se distrajo». ¿Por qué esa conclusión es insuficiente como causa raíz?', 25, '«Se distrajo» describe a la persona, no el sistema. La causa raíz debe explicar qué permitió el error y qué se puede corregir.', '«Se distrajo» describe a la persona, no el sistema. La causa raíz debe explicar qué permitió el error y qué se puede corregir.', $bpm_json${"external_id":"bpm-u3-q2","cognitive_level":"Analizar","difficulty":"media","lesson_id":"bpm-u3-l1","outcome":"Investigar causa raíz."}$bpm_json$::jsonb)
    RETURNING id INTO v_pregunta;
  ELSE
    UPDATE aula_questions
       SET prompt_html = 'Una investigación concluye: «El operario se distrajo». ¿Por qué esa conclusión es insuficiente como causa raíz?',
           points = 25,
           general_feedback = '«Se distrajo» describe a la persona, no el sistema. La causa raíz debe explicar qué permitió el error y qué se puede corregir.',
           explanation = '«Se distrajo» describe a la persona, no el sistema. La causa raíz debe explicar qué permitió el error y qué se puede corregir.',
           config = $bpm_json${"external_id":"bpm-u3-q2","cognitive_level":"Analizar","difficulty":"media","lesson_id":"bpm-u3-l1","outcome":"Investigar causa raíz."}$bpm_json$::jsonb,
           updated_at = NOW()
     WHERE id = v_pregunta;
  END IF;

  DELETE FROM aula_question_options WHERE question_id = v_pregunta;


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Porque no se puede demostrar que el operario se distrajo.', FALSE, 'Aunque se demostrara, seguiría siendo una causa personal que no explica el sistema que permitió el error.', 0);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Porque no permite identificar una causa corregible del sistema.', TRUE, 'Correcto. La causa raíz debe ser accionable y verificar que elimina la recurrencia.', 1);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Porque la causa raíz siempre es el equipo.', FALSE, 'No siempre; puede ser el procedimiento, el diseño, la formación o la organización.', 2);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Porque las desviaciones no requieren causa raíz.', FALSE, 'Toda desviación relevante requiere investigación y causa raíz.', 3);


  INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
  VALUES (v_eval, v_pregunta, 1, 25);


  SELECT id INTO v_pregunta FROM aula_questions
   WHERE bank_id = v_banco AND config->>'external_id' = 'bpm-u3-q3' AND deleted_at IS NULL
   LIMIT 1;

  IF v_pregunta IS NULL THEN
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', 'Un riesgo tiene gravedad 5, probabilidad 2 y detectabilidad 5. ¿Cómo se interpreta?', 25, 'La priorización combina gravedad, probabilidad y detectabilidad. Un riesgo grave, poco probable e indetectable puede ser crítico.', 'La priorización combina gravedad, probabilidad y detectabilidad. Un riesgo grave, poco probable e indetectable puede ser crítico.', $bpm_json${"external_id":"bpm-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_id":"bpm-u3-l2","outcome":"Priorizar riesgos con criterios explícitos."}$bpm_json$::jsonb)
    RETURNING id INTO v_pregunta;
  ELSE
    UPDATE aula_questions
       SET prompt_html = 'Un riesgo tiene gravedad 5, probabilidad 2 y detectabilidad 5. ¿Cómo se interpreta?',
           points = 25,
           general_feedback = 'La priorización combina gravedad, probabilidad y detectabilidad. Un riesgo grave, poco probable e indetectable puede ser crítico.',
           explanation = 'La priorización combina gravedad, probabilidad y detectabilidad. Un riesgo grave, poco probable e indetectable puede ser crítico.',
           config = $bpm_json${"external_id":"bpm-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_id":"bpm-u3-l2","outcome":"Priorizar riesgos con criterios explícitos."}$bpm_json$::jsonb,
           updated_at = NOW()
     WHERE id = v_pregunta;
  END IF;

  DELETE FROM aula_question_options WHERE question_id = v_pregunta;


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Es un riesgo bajo porque la probabilidad es baja.', FALSE, 'La gravedad y la detectabilidad son altas; el riesgo no es bajo.', 0);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Es un riesgo alto porque, aunque sea poco probable, el daño sería grave y difícil de detectar.', TRUE, 'Correcto. La baja detectabilidad aumenta la prioridad.', 1);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Es un riesgo nulo porque la detectabilidad es alta.', FALSE, 'Detectabilidad 5 significa difícil de detectar, no alta capacidad de detección.', 2);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'No se puede evaluar sin conocer el costo de la acción.', FALSE, 'El costo influye en la decisión, pero el riesgo se evalúa con gravedad, probabilidad y detectabilidad.', 3);


  INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
  VALUES (v_eval, v_pregunta, 2, 25);


  SELECT id INTO v_pregunta FROM aula_questions
   WHERE bank_id = v_banco AND config->>'external_id' = 'bpm-u3-q4' AND deleted_at IS NULL
   LIMIT 1;

  IF v_pregunta IS NULL THEN
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', 'El inspector encuentra una calibración vencida. ¿Cuál es la respuesta más completa?', 25, 'Una respuesta completa incluye contención, evaluación de impacto, acción correctiva, prevención y verificación.', 'Una respuesta completa incluye contención, evaluación de impacto, acción correctiva, prevención y verificación.', $bpm_json${"external_id":"bpm-u3-q4","cognitive_level":"Aplicar","difficulty":"media","lesson_id":"bpm-u3-l3","outcome":"Responder un hallazgo con evidencia."}$bpm_json$::jsonb)
    RETURNING id INTO v_pregunta;
  ELSE
    UPDATE aula_questions
       SET prompt_html = 'El inspector encuentra una calibración vencida. ¿Cuál es la respuesta más completa?',
           points = 25,
           general_feedback = 'Una respuesta completa incluye contención, evaluación de impacto, acción correctiva, prevención y verificación.',
           explanation = 'Una respuesta completa incluye contención, evaluación de impacto, acción correctiva, prevención y verificación.',
           config = $bpm_json${"external_id":"bpm-u3-q4","cognitive_level":"Aplicar","difficulty":"media","lesson_id":"bpm-u3-l3","outcome":"Responder un hallazgo con evidencia."}$bpm_json$::jsonb,
           updated_at = NOW()
     WHERE id = v_pregunta;
  END IF;

  DELETE FROM aula_question_options WHERE question_id = v_pregunta;


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Capacitar al personal para que no vuelva a pasar.', FALSE, 'La capacitación no demuestra que la causa se eliminó ni evalúa el impacto de los lotes.', 0);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Calibrar el equipo y archivar el certificado.', FALSE, 'Falta evaluar el impacto de los lotes fabricados y verificar la eficacia.', 1);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Calibrar, evaluar el impacto en los lotes, corregir el programa y verificar la eficacia.', TRUE, 'Correcto. La respuesta cubre contención, impacto, causa y verificación.', 2);


  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, 'Solicitar más plazo y no hacer nada hasta la próxima visita.', FALSE, 'La falta de acción inmediata agrava el hallazgo.', 3);


  INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
  VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad bpm-u1-act ──────────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'De dónde salen las BPM' AND deleted_at IS NULL
   LIMIT 1;

  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = 'Actividad 1 · Informe de encuadre normativo y de alcance' AND deleted_at IS NULL
   LIMIT 1;

  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, grading_method, weight)
    VALUES
      (v_curso, v_unidad, 'Actividad 1 · Informe de encuadre normativo y de alcance', $bpm_html$<h2>Caso de estudio</h2>
<p>Laboratorio Andino S.A.S. es una empresa colombiana que comercializa medicamentos fabricados por terceros. Recibe una visita de un cliente institucional. El cliente pide evidencia de BPM para un antibiótico inyectable. La empresa envía: (a) un certificado de BPM de la planta fabricante para sólidos orales no estériles, vigente; (b) el registro sanitario del producto en Colombia; (c) un certificado de análisis del lote de principio activo; (d) una carta del fabricante que dice «cumplimos BPM». El cliente pregunta si puede incluir el producto en su lista de compras.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>
<h2>Puntos a resolver</h2>
<ol><li>Identifica qué control regula cada documento enviado y qué pregunta responde.</li><li>Determina si la evidencia alcanza para afirmar que la línea del inyectable cumple BPM. Justifica.</li><li>Señala al menos tres documentos o verificaciones que faltan y explica por qué son necesarios.</li><li>Redacta una respuesta profesional al cliente: qué puedes afirmar, qué no y qué solicitas.</li><li>Concluye si recomendarías o no la compra y bajo qué condiciones.</li></ol>
<h2>Producto esperado</h2>
<p>Informe técnico de 2 a 3 páginas (800–1.200 palabras), con tabla de documentos, análisis y recomendación. Formato PDF o DOCX. No se exige portada ni video.</p>
<h2>Materiales, anexos y datos</h2>
<p>Los cuatro documentos descritos en el caso y la tabla de alcance que se incluye en la plantilla de la actividad. No se requieren documentos reales de empresas.</p>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 3 horas de trabajo individual.</li><li>Modalidad: Individual. No se permite trabajo en grupo para esta entrega.</li><li>Peso en el curso: 20 %.</li></ul>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 1160 de 2016, Decreto 677 de 1995 y OMS TRS 986, Anexo 2. Cita en formato APA 7 o IEEE. Si usas IA, declara para qué y verifica cada afirmación normativa.</p>
<h2>Uso de herramientas de IA</h2>
<p>Se permite el uso de IA como apoyo de redacción o búsqueda, con declaración explícita. No se acepta como fuente normativa ni como sustituto de la lectura de la norma.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 20 % del curso. Los pesos de los criterios suman 100 %.</p>
<table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Precisión conceptual y normativa</td><td>30 %</td><td>Distingue con exactitud los controles de producto, proceso y certificación; cita las normas correctas.</td><td>Distingue los controles con algún imprecisión menor.</td><td>Confunde controles o normas en puntos centrales.</td><td>Usa las normas de forma incorrecta.</td><td>No identifica los controles.</td></tr>
<tr><td>Análisis del alcance y de la evidencia</td><td>25 %</td><td>Determina con rigor qué cubre el certificado y qué falta, con consecuencias claras.</td><td>Identifica lo que falta con justificación suficiente.</td><td>Menciona faltantes sin explicar su relevancia.</td><td>No distingue el alcance.</td><td>No analiza la evidencia.</td></tr>
<tr><td>Aplicación al caso y recomendación</td><td>25 %</td><td>Recomienda con condiciones verificables y responde al cliente con precisión.</td><td>Recomienda de forma coherente con el análisis.</td><td>Recomienda sin conectar con la evidencia.</td><td>Recomienda de forma contradictoria.</td><td>No recomienda.</td></tr>
<tr><td>Organización y comunicación</td><td>10 %</td><td>Informe claro, estructurado, con tabla y conclusión; lenguaje profesional.</td><td>Informe ordenado y comprensible.</td><td>Estructura débil o lenguaje impreciso.</td><td>Texto desorganizado.</td><td>No presenta un informe.</td></tr>
<tr><td>Uso verificable de fuentes</td><td>10 %</td><td>Cita normas y fuentes pertinentes, con URL y fecha; distingue lo verificado de lo inferido.</td><td>Cita fuentes pertinentes con algún error menor.</td><td>Cita de forma incompleta.</td><td>No cita o cita fuentes irrelevantes.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>$bpm_html$, $bpm_json${
  "version": 1,
  "total": 100,
  "criteria": [
    {
      "id": "precision-conceptual-y-normativa",
      "name": "Precisión conceptual y normativa",
      "weight": 30,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Distingue con exactitud los controles de producto, proceso y certificación; cita las normas correctas."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Distingue los controles con algún imprecisión menor."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Confunde controles o normas en puntos centrales."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "Usa las normas de forma incorrecta."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No identifica los controles."
        }
      ]
    },
    {
      "id": "analisis-del-alcance-y-de-la-evidencia",
      "name": "Análisis del alcance y de la evidencia",
      "weight": 25,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Determina con rigor qué cubre el certificado y qué falta, con consecuencias claras."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Identifica lo que falta con justificación suficiente."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Menciona faltantes sin explicar su relevancia."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "No distingue el alcance."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No analiza la evidencia."
        }
      ]
    },
    {
      "id": "aplicacion-al-caso-y-recomendacion",
      "name": "Aplicación al caso y recomendación",
      "weight": 25,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Recomienda con condiciones verificables y responde al cliente con precisión."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Recomienda de forma coherente con el análisis."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Recomienda sin conectar con la evidencia."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "Recomienda de forma contradictoria."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No recomienda."
        }
      ]
    },
    {
      "id": "organizacion-y-comunicacion",
      "name": "Organización y comunicación",
      "weight": 10,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Informe claro, estructurado, con tabla y conclusión; lenguaje profesional."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Informe ordenado y comprensible."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Estructura débil o lenguaje impreciso."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "Texto desorganizado."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No presenta un informe."
        }
      ]
    },
    {
      "id": "uso-verificable-de-fuentes",
      "name": "Uso verificable de fuentes",
      "weight": 10,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Cita normas y fuentes pertinentes, con URL y fecha; distingue lo verificado de lo inferido."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Cita fuentes pertinentes con algún error menor."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Cita de forma incompleta."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "No cita o cita fuentes irrelevantes."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No hay fuentes."
        }
      ]
    }
  ]
}$bpm_json$::jsonb,
       TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 1, 'rubrica', 20)
    RETURNING id INTO v_act;
  ELSE
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', 'Actividad 1 · Informe de encuadre normativo y de alcance';
    ELSE
      UPDATE aula_activities
         SET rubric = $bpm_json${
  "version": 1,
  "total": 100,
  "criteria": [
    {
      "id": "precision-conceptual-y-normativa",
      "name": "Precisión conceptual y normativa",
      "weight": 30,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Distingue con exactitud los controles de producto, proceso y certificación; cita las normas correctas."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Distingue los controles con algún imprecisión menor."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Confunde controles o normas en puntos centrales."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "Usa las normas de forma incorrecta."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No identifica los controles."
        }
      ]
    },
    {
      "id": "analisis-del-alcance-y-de-la-evidencia",
      "name": "Análisis del alcance y de la evidencia",
      "weight": 25,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Determina con rigor qué cubre el certificado y qué falta, con consecuencias claras."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Identifica lo que falta con justificación suficiente."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Menciona faltantes sin explicar su relevancia."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "No distingue el alcance."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No analiza la evidencia."
        }
      ]
    },
    {
      "id": "aplicacion-al-caso-y-recomendacion",
      "name": "Aplicación al caso y recomendación",
      "weight": 25,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Recomienda con condiciones verificables y responde al cliente con precisión."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Recomienda de forma coherente con el análisis."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Recomienda sin conectar con la evidencia."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "Recomienda de forma contradictoria."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No recomienda."
        }
      ]
    },
    {
      "id": "organizacion-y-comunicacion",
      "name": "Organización y comunicación",
      "weight": 10,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Informe claro, estructurado, con tabla y conclusión; lenguaje profesional."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Informe ordenado y comprensible."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Estructura débil o lenguaje impreciso."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "Texto desorganizado."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No presenta un informe."
        }
      ]
    },
    {
      "id": "uso-verificable-de-fuentes",
      "name": "Uso verificable de fuentes",
      "weight": 10,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Cita normas y fuentes pertinentes, con URL y fecha; distingue lo verificado de lo inferido."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Cita fuentes pertinentes con algún error menor."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Cita de forma incompleta."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "No cita o cita fuentes irrelevantes."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No hay fuentes."
        }
      ]
    }
  ]
}$bpm_json$::jsonb, grading_method = 'rubrica', weight = 20
       WHERE id = v_act;
    END IF;
    UPDATE aula_activities
       SET module_id = v_unidad,
           instructions_html = $bpm_html$<h2>Caso de estudio</h2>
<p>Laboratorio Andino S.A.S. es una empresa colombiana que comercializa medicamentos fabricados por terceros. Recibe una visita de un cliente institucional. El cliente pide evidencia de BPM para un antibiótico inyectable. La empresa envía: (a) un certificado de BPM de la planta fabricante para sólidos orales no estériles, vigente; (b) el registro sanitario del producto en Colombia; (c) un certificado de análisis del lote de principio activo; (d) una carta del fabricante que dice «cumplimos BPM». El cliente pregunta si puede incluir el producto en su lista de compras.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>
<h2>Puntos a resolver</h2>
<ol><li>Identifica qué control regula cada documento enviado y qué pregunta responde.</li><li>Determina si la evidencia alcanza para afirmar que la línea del inyectable cumple BPM. Justifica.</li><li>Señala al menos tres documentos o verificaciones que faltan y explica por qué son necesarios.</li><li>Redacta una respuesta profesional al cliente: qué puedes afirmar, qué no y qué solicitas.</li><li>Concluye si recomendarías o no la compra y bajo qué condiciones.</li></ol>
<h2>Producto esperado</h2>
<p>Informe técnico de 2 a 3 páginas (800–1.200 palabras), con tabla de documentos, análisis y recomendación. Formato PDF o DOCX. No se exige portada ni video.</p>
<h2>Materiales, anexos y datos</h2>
<p>Los cuatro documentos descritos en el caso y la tabla de alcance que se incluye en la plantilla de la actividad. No se requieren documentos reales de empresas.</p>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 3 horas de trabajo individual.</li><li>Modalidad: Individual. No se permite trabajo en grupo para esta entrega.</li><li>Peso en el curso: 20 %.</li></ul>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 1160 de 2016, Decreto 677 de 1995 y OMS TRS 986, Anexo 2. Cita en formato APA 7 o IEEE. Si usas IA, declara para qué y verifica cada afirmación normativa.</p>
<h2>Uso de herramientas de IA</h2>
<p>Se permite el uso de IA como apoyo de redacción o búsqueda, con declaración explícita. No se acepta como fuente normativa ni como sustituto de la lectura de la norma.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 20 % del curso. Los pesos de los criterios suman 100 %.</p>
<table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Precisión conceptual y normativa</td><td>30 %</td><td>Distingue con exactitud los controles de producto, proceso y certificación; cita las normas correctas.</td><td>Distingue los controles con algún imprecisión menor.</td><td>Confunde controles o normas en puntos centrales.</td><td>Usa las normas de forma incorrecta.</td><td>No identifica los controles.</td></tr>
<tr><td>Análisis del alcance y de la evidencia</td><td>25 %</td><td>Determina con rigor qué cubre el certificado y qué falta, con consecuencias claras.</td><td>Identifica lo que falta con justificación suficiente.</td><td>Menciona faltantes sin explicar su relevancia.</td><td>No distingue el alcance.</td><td>No analiza la evidencia.</td></tr>
<tr><td>Aplicación al caso y recomendación</td><td>25 %</td><td>Recomienda con condiciones verificables y responde al cliente con precisión.</td><td>Recomienda de forma coherente con el análisis.</td><td>Recomienda sin conectar con la evidencia.</td><td>Recomienda de forma contradictoria.</td><td>No recomienda.</td></tr>
<tr><td>Organización y comunicación</td><td>10 %</td><td>Informe claro, estructurado, con tabla y conclusión; lenguaje profesional.</td><td>Informe ordenado y comprensible.</td><td>Estructura débil o lenguaje impreciso.</td><td>Texto desorganizado.</td><td>No presenta un informe.</td></tr>
<tr><td>Uso verificable de fuentes</td><td>10 %</td><td>Cita normas y fuentes pertinentes, con URL y fecha; distingue lo verificado de lo inferido.</td><td>Cita fuentes pertinentes con algún error menor.</td><td>Cita de forma incompleta.</td><td>No cita o cita fuentes irrelevantes.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>$bpm_html$,
           allow_text = TRUE,
           allow_link = TRUE,
           allow_file = TRUE,
           accepted_extensions = ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[],
           max_file_mb = 20,
           max_points = 100,
           is_required = TRUE,
           status = 'publicado',
           sort_order = 1,
           updated_at = NOW()
     WHERE id = v_act;
  END IF;


  -- ── Actividad bpm-u2-act ──────────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Las BPM en la planta' AND deleted_at IS NULL
   LIMIT 1;

  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = 'Actividad 2 · Procedimiento de vestimenta y flujo para una línea de sólidos' AND deleted_at IS NULL
   LIMIT 1;

  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, grading_method, weight)
    VALUES
      (v_curso, v_unidad, 'Actividad 2 · Procedimiento de vestimenta y flujo para una línea de sólidos', $bpm_html$<h2>Caso de estudio</h2>
<p>Laboratorio Andino S.A.S. pondrá en marcha una nueva línea de tabletas en una planta con un pasillo central compartido con una línea de jarabes. El área de tabletas tiene una esclusa de personal y una recepción de materiales. La gerencia pide un procedimiento de vestimenta y un mapa de flujos antes de la primera producción. No hay presupuesto para obras civiles en esta fase.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>
<h2>Puntos a resolver</h2>
<ol><li>Diseña la secuencia de vestimenta para el área de tabletas, con al menos seis pasos y la justificación de cada uno.</li><li>Identifica qué prendas se cambian al entrar y al salir, y qué se hace con los objetos personales.</li><li>Dibuja o describe el flujo de personal y el de materiales, y marca al menos dos puntos de cruce.</li><li>Propón una medida para cada cruce: diseño, horario, contención o procedimiento.</li><li>Define tres verificaciones que hará el supervisor y el registro correspondiente.</li><li>Incluye un plan de entrenamiento y una forma de comprobar que se aprendió.</li></ol>
<h2>Producto esperado</h2>
<p>Procedimiento o instructivo de 3 a 4 páginas, con secuencia numerada, tabla de verificaciones y un diagrama de flujos (puede ser una tabla con flechas o un esquema). Formato PDF o DOCX.</p>
<h2>Materiales, anexos y datos</h2>
<p>Plano simplificado de la planta (pasillo central, esclusa, recepción, área de tabletas y área de jarabes) y tabla de verificación en blanco. No se requieren planos reales.</p>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 4 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 20 %.</li></ul>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 1160 de 2016 y OMS TRS 986, Anexo 2. Cita en APA 7 o IEEE. Declara el uso de IA si la usaste.</p>
<h2>Uso de herramientas de IA</h2>
<p>Permitida como apoyo de redacción, con declaración. Las decisiones técnicas deben estar justificadas con la norma y el caso.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 20 % del curso. Los pesos de los criterios suman 100 %.</p>
<table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Precisión técnica de la secuencia</td><td>30 %</td><td>La secuencia es completa, correcta y cada paso está justificado por el riesgo que controla.</td><td>La secuencia es correcta con justificaciones suficientes.</td><td>La secuencia tiene errores u omisiones relevantes.</td><td>La secuencia es incoherente.</td><td>No presenta secuencia.</td></tr>
<tr><td>Análisis de flujos y cruces</td><td>25 %</td><td>Identifica cruces reales y propone medidas proporcionadas y verificables.</td><td>Identifica cruces y propone medidas viables.</td><td>Menciona cruces sin analizarlos.</td><td>No identifica cruces.</td><td>No presenta flujos.</td></tr>
<tr><td>Verificaciones y registros</td><td>20 %</td><td>Define verificaciones observables, responsables y registros claros.</td><td>Define verificaciones y registros suficientes.</td><td>Define verificaciones vagas.</td><td>No define verificaciones.</td><td>No presenta verificaciones.</td></tr>
<tr><td>Organización y comunicación</td><td>15 %</td><td>Documento claro, con tabla, diagrama y lenguaje profesional.</td><td>Documento ordenado y comprensible.</td><td>Estructura débil.</td><td>Texto desorganizado.</td><td>No presenta documento.</td></tr>
<tr><td>Uso verificable de fuentes</td><td>10 %</td><td>Cita normas y fuentes pertinentes con URL y fecha; distingue lo verificado de lo propuesto.</td><td>Cita fuentes pertinentes con algún error menor.</td><td>Cita de forma incompleta.</td><td>No cita.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>$bpm_html$, $bpm_json${
  "version": 1,
  "total": 100,
  "criteria": [
    {
      "id": "precision-tecnica-de-la-secuencia",
      "name": "Precisión técnica de la secuencia",
      "weight": 30,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "La secuencia es completa, correcta y cada paso está justificado por el riesgo que controla."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "La secuencia es correcta con justificaciones suficientes."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "La secuencia tiene errores u omisiones relevantes."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "La secuencia es incoherente."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No presenta secuencia."
        }
      ]
    },
    {
      "id": "analisis-de-flujos-y-cruces",
      "name": "Análisis de flujos y cruces",
      "weight": 25,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Identifica cruces reales y propone medidas proporcionadas y verificables."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Identifica cruces y propone medidas viables."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Menciona cruces sin analizarlos."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "No identifica cruces."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No presenta flujos."
        }
      ]
    },
    {
      "id": "verificaciones-y-registros",
      "name": "Verificaciones y registros",
      "weight": 20,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Define verificaciones observables, responsables y registros claros."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Define verificaciones y registros suficientes."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Define verificaciones vagas."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "No define verificaciones."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No presenta verificaciones."
        }
      ]
    },
    {
      "id": "organizacion-y-comunicacion",
      "name": "Organización y comunicación",
      "weight": 15,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Documento claro, con tabla, diagrama y lenguaje profesional."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Documento ordenado y comprensible."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Estructura débil."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "Texto desorganizado."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No presenta documento."
        }
      ]
    },
    {
      "id": "uso-verificable-de-fuentes",
      "name": "Uso verificable de fuentes",
      "weight": 10,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Cita normas y fuentes pertinentes con URL y fecha; distingue lo verificado de lo propuesto."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Cita fuentes pertinentes con algún error menor."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Cita de forma incompleta."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "No cita."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No hay fuentes."
        }
      ]
    }
  ]
}$bpm_json$::jsonb,
       TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 2, 'rubrica', 20)
    RETURNING id INTO v_act;
  ELSE
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', 'Actividad 2 · Procedimiento de vestimenta y flujo para una línea de sólidos';
    ELSE
      UPDATE aula_activities
         SET rubric = $bpm_json${
  "version": 1,
  "total": 100,
  "criteria": [
    {
      "id": "precision-tecnica-de-la-secuencia",
      "name": "Precisión técnica de la secuencia",
      "weight": 30,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "La secuencia es completa, correcta y cada paso está justificado por el riesgo que controla."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "La secuencia es correcta con justificaciones suficientes."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "La secuencia tiene errores u omisiones relevantes."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "La secuencia es incoherente."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No presenta secuencia."
        }
      ]
    },
    {
      "id": "analisis-de-flujos-y-cruces",
      "name": "Análisis de flujos y cruces",
      "weight": 25,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Identifica cruces reales y propone medidas proporcionadas y verificables."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Identifica cruces y propone medidas viables."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Menciona cruces sin analizarlos."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "No identifica cruces."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No presenta flujos."
        }
      ]
    },
    {
      "id": "verificaciones-y-registros",
      "name": "Verificaciones y registros",
      "weight": 20,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Define verificaciones observables, responsables y registros claros."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Define verificaciones y registros suficientes."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Define verificaciones vagas."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "No define verificaciones."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No presenta verificaciones."
        }
      ]
    },
    {
      "id": "organizacion-y-comunicacion",
      "name": "Organización y comunicación",
      "weight": 15,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Documento claro, con tabla, diagrama y lenguaje profesional."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Documento ordenado y comprensible."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Estructura débil."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "Texto desorganizado."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No presenta documento."
        }
      ]
    },
    {
      "id": "uso-verificable-de-fuentes",
      "name": "Uso verificable de fuentes",
      "weight": 10,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Cita normas y fuentes pertinentes con URL y fecha; distingue lo verificado de lo propuesto."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Cita fuentes pertinentes con algún error menor."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Cita de forma incompleta."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "No cita."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No hay fuentes."
        }
      ]
    }
  ]
}$bpm_json$::jsonb, grading_method = 'rubrica', weight = 20
       WHERE id = v_act;
    END IF;
    UPDATE aula_activities
       SET module_id = v_unidad,
           instructions_html = $bpm_html$<h2>Caso de estudio</h2>
<p>Laboratorio Andino S.A.S. pondrá en marcha una nueva línea de tabletas en una planta con un pasillo central compartido con una línea de jarabes. El área de tabletas tiene una esclusa de personal y una recepción de materiales. La gerencia pide un procedimiento de vestimenta y un mapa de flujos antes de la primera producción. No hay presupuesto para obras civiles en esta fase.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>
<h2>Puntos a resolver</h2>
<ol><li>Diseña la secuencia de vestimenta para el área de tabletas, con al menos seis pasos y la justificación de cada uno.</li><li>Identifica qué prendas se cambian al entrar y al salir, y qué se hace con los objetos personales.</li><li>Dibuja o describe el flujo de personal y el de materiales, y marca al menos dos puntos de cruce.</li><li>Propón una medida para cada cruce: diseño, horario, contención o procedimiento.</li><li>Define tres verificaciones que hará el supervisor y el registro correspondiente.</li><li>Incluye un plan de entrenamiento y una forma de comprobar que se aprendió.</li></ol>
<h2>Producto esperado</h2>
<p>Procedimiento o instructivo de 3 a 4 páginas, con secuencia numerada, tabla de verificaciones y un diagrama de flujos (puede ser una tabla con flechas o un esquema). Formato PDF o DOCX.</p>
<h2>Materiales, anexos y datos</h2>
<p>Plano simplificado de la planta (pasillo central, esclusa, recepción, área de tabletas y área de jarabes) y tabla de verificación en blanco. No se requieren planos reales.</p>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 4 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 20 %.</li></ul>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 1160 de 2016 y OMS TRS 986, Anexo 2. Cita en APA 7 o IEEE. Declara el uso de IA si la usaste.</p>
<h2>Uso de herramientas de IA</h2>
<p>Permitida como apoyo de redacción, con declaración. Las decisiones técnicas deben estar justificadas con la norma y el caso.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 20 % del curso. Los pesos de los criterios suman 100 %.</p>
<table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Precisión técnica de la secuencia</td><td>30 %</td><td>La secuencia es completa, correcta y cada paso está justificado por el riesgo que controla.</td><td>La secuencia es correcta con justificaciones suficientes.</td><td>La secuencia tiene errores u omisiones relevantes.</td><td>La secuencia es incoherente.</td><td>No presenta secuencia.</td></tr>
<tr><td>Análisis de flujos y cruces</td><td>25 %</td><td>Identifica cruces reales y propone medidas proporcionadas y verificables.</td><td>Identifica cruces y propone medidas viables.</td><td>Menciona cruces sin analizarlos.</td><td>No identifica cruces.</td><td>No presenta flujos.</td></tr>
<tr><td>Verificaciones y registros</td><td>20 %</td><td>Define verificaciones observables, responsables y registros claros.</td><td>Define verificaciones y registros suficientes.</td><td>Define verificaciones vagas.</td><td>No define verificaciones.</td><td>No presenta verificaciones.</td></tr>
<tr><td>Organización y comunicación</td><td>15 %</td><td>Documento claro, con tabla, diagrama y lenguaje profesional.</td><td>Documento ordenado y comprensible.</td><td>Estructura débil.</td><td>Texto desorganizado.</td><td>No presenta documento.</td></tr>
<tr><td>Uso verificable de fuentes</td><td>10 %</td><td>Cita normas y fuentes pertinentes con URL y fecha; distingue lo verificado de lo propuesto.</td><td>Cita fuentes pertinentes con algún error menor.</td><td>Cita de forma incompleta.</td><td>No cita.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>$bpm_html$,
           allow_text = TRUE,
           allow_link = TRUE,
           allow_file = TRUE,
           accepted_extensions = ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[],
           max_file_mb = 20,
           max_points = 100,
           is_required = TRUE,
           status = 'publicado',
           sort_order = 2,
           updated_at = NOW()
     WHERE id = v_act;
  END IF;


  -- ── Actividad bpm-u3-act ──────────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Sostener el cumplimiento' AND deleted_at IS NULL
   LIMIT 1;

  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = 'Actividad 3 · Auditoría interna simulada y plan CAPA' AND deleted_at IS NULL
   LIMIT 1;

  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, grading_method, weight)
    VALUES
      (v_curso, v_unidad, 'Actividad 3 · Auditoría interna simulada y plan CAPA', $bpm_html$<h2>Caso de estudio</h2>
<p>Laboratorio Andino S.A.S. realiza una auditoría interna de su línea de sólidos. El equipo auditor encontró: (1) un registro de limpieza firmado al final del turno en 3 de 10 lotes revisados; (2) una balanza con calibración vencida hace 45 días; (3) una desviación por humedad fuera de rango cerrada con la frase «se capacitó al operario»; (4) un procedimiento de etiquetado con versión 2.1 en el área y versión 2.3 en el sistema documental; (5) un flujo de residuos que pasa por el pasillo de materiales limpios. La dirección pide un plan que pueda presentarse al INVIMA en 30 días.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>
<h2>Puntos a resolver</h2>
<ol><li>Clasifica cada hallazgo como crítico, mayor o menor, y justifica con el impacto potencial.</li><li>Prioriza los hallazgos con una matriz de gravedad, probabilidad y detectabilidad.</li><li>Investiga una causa raíz para cada uno de los tres hallazgos de mayor riesgo.</li><li>Propón acciones de contención, correctivas y preventivas, con responsable y fecha.</li><li>Define un indicador y una forma de verificar la eficacia de cada acción.</li><li>Explica qué se puede cerrar en 30 días y qué requiere un plan de mayor plazo.</li></ol>
<h2>Producto esperado</h2>
<p>Matriz de auditoría y plan CAPA de 3 a 4 páginas, con tabla de hallazgos, matriz de riesgo, causas raíz, acciones, responsables, fechas e indicadores. Formato PDF o DOCX.</p>
<h2>Materiales, anexos y datos</h2>
<p>Lista de hallazgos, matriz de riesgo en blanco y formato de plan CAPA. No se requieren datos reales de empresas ni de pacientes.</p>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 4 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 20 %.</li></ul>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 1160 de 2016, ICH Q9(R1) e ICH Q10. Cita en APA 7 o IEEE. Declara el uso de IA si la usaste.</p>
<h2>Uso de herramientas de IA</h2>
<p>Permitida como apoyo de redacción y organización, con declaración. Las decisiones de clasificación y causa raíz deben estar justificadas.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 20 % del curso. Los pesos de los criterios suman 100 %.</p>
<table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Precisión en la clasificación</td><td>25 %</td><td>Clasifica los cinco hallazgos con criterios claros y coherentes con el impacto.</td><td>Clasifica correctamente con justificación suficiente.</td><td>Clasifica con errores u omisiones.</td><td>Clasificación incoherente.</td><td>No clasifica.</td></tr>
<tr><td>Análisis de causa raíz</td><td>25 %</td><td>Las causas son específicas, verificables y conectan con el sistema.</td><td>Causas pertinentes con justificación suficiente.</td><td>Causas superficiales o genéricas.</td><td>No investiga causas.</td><td>No presenta análisis.</td></tr>
<tr><td>Plan CAPA y verificación</td><td>20 %</td><td>Acciones completas, con responsable, fecha, indicador y verificación de eficacia.</td><td>Acciones viables con la mayoría de los elementos.</td><td>Acciones vagas o sin verificación.</td><td>Plan incompleto.</td><td>No presenta plan.</td></tr>
<tr><td>Priorización por riesgo</td><td>10 %</td><td>Aplica gravedad, probabilidad y detectabilidad de forma coherente y justifica el orden.</td><td>Prioriza con criterios claros.</td><td>Prioriza sin justificar.</td><td>No prioriza.</td><td>No presenta matriz.</td></tr>
<tr><td>Organización y comunicación</td><td>10 %</td><td>Documento claro, con tablas, jerarquía y lenguaje profesional.</td><td>Documento ordenado y comprensible.</td><td>Estructura débil.</td><td>Texto desorganizado.</td><td>No presenta documento.</td></tr>
<tr><td>Uso verificable de fuentes</td><td>10 %</td><td>Cita normas y fuentes pertinentes con URL y fecha; distingue lo verificado de lo propuesto.</td><td>Cita fuentes pertinentes con algún error menor.</td><td>Cita de forma incompleta.</td><td>No cita.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>$bpm_html$, $bpm_json${
  "version": 1,
  "total": 100,
  "criteria": [
    {
      "id": "precision-en-la-clasificacion",
      "name": "Precisión en la clasificación",
      "weight": 25,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Clasifica los cinco hallazgos con criterios claros y coherentes con el impacto."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Clasifica correctamente con justificación suficiente."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Clasifica con errores u omisiones."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "Clasificación incoherente."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No clasifica."
        }
      ]
    },
    {
      "id": "analisis-de-causa-raiz",
      "name": "Análisis de causa raíz",
      "weight": 25,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Las causas son específicas, verificables y conectan con el sistema."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Causas pertinentes con justificación suficiente."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Causas superficiales o genéricas."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "No investiga causas."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No presenta análisis."
        }
      ]
    },
    {
      "id": "plan-capa-y-verificacion",
      "name": "Plan CAPA y verificación",
      "weight": 20,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Acciones completas, con responsable, fecha, indicador y verificación de eficacia."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Acciones viables con la mayoría de los elementos."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Acciones vagas o sin verificación."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "Plan incompleto."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No presenta plan."
        }
      ]
    },
    {
      "id": "priorizacion-por-riesgo",
      "name": "Priorización por riesgo",
      "weight": 10,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Aplica gravedad, probabilidad y detectabilidad de forma coherente y justifica el orden."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Prioriza con criterios claros."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Prioriza sin justificar."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "No prioriza."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No presenta matriz."
        }
      ]
    },
    {
      "id": "organizacion-y-comunicacion",
      "name": "Organización y comunicación",
      "weight": 10,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Documento claro, con tablas, jerarquía y lenguaje profesional."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Documento ordenado y comprensible."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Estructura débil."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "Texto desorganizado."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No presenta documento."
        }
      ]
    },
    {
      "id": "uso-verificable-de-fuentes",
      "name": "Uso verificable de fuentes",
      "weight": 10,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Cita normas y fuentes pertinentes con URL y fecha; distingue lo verificado de lo propuesto."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Cita fuentes pertinentes con algún error menor."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Cita de forma incompleta."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "No cita."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No hay fuentes."
        }
      ]
    }
  ]
}$bpm_json$::jsonb,
       TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 3, 'rubrica', 20)
    RETURNING id INTO v_act;
  ELSE
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', 'Actividad 3 · Auditoría interna simulada y plan CAPA';
    ELSE
      UPDATE aula_activities
         SET rubric = $bpm_json${
  "version": 1,
  "total": 100,
  "criteria": [
    {
      "id": "precision-en-la-clasificacion",
      "name": "Precisión en la clasificación",
      "weight": 25,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Clasifica los cinco hallazgos con criterios claros y coherentes con el impacto."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Clasifica correctamente con justificación suficiente."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Clasifica con errores u omisiones."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "Clasificación incoherente."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No clasifica."
        }
      ]
    },
    {
      "id": "analisis-de-causa-raiz",
      "name": "Análisis de causa raíz",
      "weight": 25,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Las causas son específicas, verificables y conectan con el sistema."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Causas pertinentes con justificación suficiente."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Causas superficiales o genéricas."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "No investiga causas."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No presenta análisis."
        }
      ]
    },
    {
      "id": "plan-capa-y-verificacion",
      "name": "Plan CAPA y verificación",
      "weight": 20,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Acciones completas, con responsable, fecha, indicador y verificación de eficacia."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Acciones viables con la mayoría de los elementos."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Acciones vagas o sin verificación."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "Plan incompleto."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No presenta plan."
        }
      ]
    },
    {
      "id": "priorizacion-por-riesgo",
      "name": "Priorización por riesgo",
      "weight": 10,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Aplica gravedad, probabilidad y detectabilidad de forma coherente y justifica el orden."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Prioriza con criterios claros."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Prioriza sin justificar."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "No prioriza."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No presenta matriz."
        }
      ]
    },
    {
      "id": "organizacion-y-comunicacion",
      "name": "Organización y comunicación",
      "weight": 10,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Documento claro, con tablas, jerarquía y lenguaje profesional."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Documento ordenado y comprensible."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Estructura débil."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "Texto desorganizado."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No presenta documento."
        }
      ]
    },
    {
      "id": "uso-verificable-de-fuentes",
      "name": "Uso verificable de fuentes",
      "weight": 10,
      "levels": [
        {
          "level": 4,
          "label": "Destacado",
          "description": "Cita normas y fuentes pertinentes con URL y fecha; distingue lo verificado de lo propuesto."
        },
        {
          "level": 3,
          "label": "Logrado",
          "description": "Cita fuentes pertinentes con algún error menor."
        },
        {
          "level": 2,
          "label": "En desarrollo",
          "description": "Cita de forma incompleta."
        },
        {
          "level": 1,
          "label": "Inicial",
          "description": "No cita."
        },
        {
          "level": 0,
          "label": "Sin evidencia",
          "description": "No hay fuentes."
        }
      ]
    }
  ]
}$bpm_json$::jsonb, grading_method = 'rubrica', weight = 20
       WHERE id = v_act;
    END IF;
    UPDATE aula_activities
       SET module_id = v_unidad,
           instructions_html = $bpm_html$<h2>Caso de estudio</h2>
<p>Laboratorio Andino S.A.S. realiza una auditoría interna de su línea de sólidos. El equipo auditor encontró: (1) un registro de limpieza firmado al final del turno en 3 de 10 lotes revisados; (2) una balanza con calibración vencida hace 45 días; (3) una desviación por humedad fuera de rango cerrada con la frase «se capacitó al operario»; (4) un procedimiento de etiquetado con versión 2.1 en el área y versión 2.3 en el sistema documental; (5) un flujo de residuos que pasa por el pasillo de materiales limpios. La dirección pide un plan que pueda presentarse al INVIMA en 30 días.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>
<h2>Puntos a resolver</h2>
<ol><li>Clasifica cada hallazgo como crítico, mayor o menor, y justifica con el impacto potencial.</li><li>Prioriza los hallazgos con una matriz de gravedad, probabilidad y detectabilidad.</li><li>Investiga una causa raíz para cada uno de los tres hallazgos de mayor riesgo.</li><li>Propón acciones de contención, correctivas y preventivas, con responsable y fecha.</li><li>Define un indicador y una forma de verificar la eficacia de cada acción.</li><li>Explica qué se puede cerrar en 30 días y qué requiere un plan de mayor plazo.</li></ol>
<h2>Producto esperado</h2>
<p>Matriz de auditoría y plan CAPA de 3 a 4 páginas, con tabla de hallazgos, matriz de riesgo, causas raíz, acciones, responsables, fechas e indicadores. Formato PDF o DOCX.</p>
<h2>Materiales, anexos y datos</h2>
<p>Lista de hallazgos, matriz de riesgo en blanco y formato de plan CAPA. No se requieren datos reales de empresas ni de pacientes.</p>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 4 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 20 %.</li></ul>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 1160 de 2016, ICH Q9(R1) e ICH Q10. Cita en APA 7 o IEEE. Declara el uso de IA si la usaste.</p>
<h2>Uso de herramientas de IA</h2>
<p>Permitida como apoyo de redacción y organización, con declaración. Las decisiones de clasificación y causa raíz deben estar justificadas.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 20 % del curso. Los pesos de los criterios suman 100 %.</p>
<table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Precisión en la clasificación</td><td>25 %</td><td>Clasifica los cinco hallazgos con criterios claros y coherentes con el impacto.</td><td>Clasifica correctamente con justificación suficiente.</td><td>Clasifica con errores u omisiones.</td><td>Clasificación incoherente.</td><td>No clasifica.</td></tr>
<tr><td>Análisis de causa raíz</td><td>25 %</td><td>Las causas son específicas, verificables y conectan con el sistema.</td><td>Causas pertinentes con justificación suficiente.</td><td>Causas superficiales o genéricas.</td><td>No investiga causas.</td><td>No presenta análisis.</td></tr>
<tr><td>Plan CAPA y verificación</td><td>20 %</td><td>Acciones completas, con responsable, fecha, indicador y verificación de eficacia.</td><td>Acciones viables con la mayoría de los elementos.</td><td>Acciones vagas o sin verificación.</td><td>Plan incompleto.</td><td>No presenta plan.</td></tr>
<tr><td>Priorización por riesgo</td><td>10 %</td><td>Aplica gravedad, probabilidad y detectabilidad de forma coherente y justifica el orden.</td><td>Prioriza con criterios claros.</td><td>Prioriza sin justificar.</td><td>No prioriza.</td><td>No presenta matriz.</td></tr>
<tr><td>Organización y comunicación</td><td>10 %</td><td>Documento claro, con tablas, jerarquía y lenguaje profesional.</td><td>Documento ordenado y comprensible.</td><td>Estructura débil.</td><td>Texto desorganizado.</td><td>No presenta documento.</td></tr>
<tr><td>Uso verificable de fuentes</td><td>10 %</td><td>Cita normas y fuentes pertinentes con URL y fecha; distingue lo verificado de lo propuesto.</td><td>Cita fuentes pertinentes con algún error menor.</td><td>Cita de forma incompleta.</td><td>No cita.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>$bpm_html$,
           allow_text = TRUE,
           allow_link = TRUE,
           allow_file = TRUE,
           accepted_extensions = ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[],
           max_file_mb = 20,
           max_points = 100,
           is_required = TRUE,
           status = 'publicado',
           sort_order = 3,
           updated_at = NOW()
     WHERE id = v_act;
  END IF;


  -- ── Foro bpm-u1-foro ───────────────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'De dónde salen las BPM' AND deleted_at IS NULL
   LIMIT 1;

  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = 'Foro 1 · ¿Se certifica la empresa o la línea?' AND deleted_at IS NULL
   LIMIT 1;

  IF v_foro IS NULL THEN
    INSERT INTO aula_forums (course_id, module_id, scope, title, description, is_closed, allow_attachments, status, grading_method, weight, rubric, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Foro 1 · ¿Se certifica la empresa o la línea?', $bpm_html$<h2>Caso del foro</h2>
<p>Una comercializadora publica en su página web: «Contamos con certificación de BPM». El certificado que adjunta cubre únicamente sólidos orales de una planta ubicada en otro país. Un cliente quiere comprar un jarabe y otro quiere un inyectable. La comercializadora responde que «la planta está certificada, así que puede fabricar todo».</p>
<h2>Pregunta central</h2>
<p>¿Es aceptable esa respuesta? ¿Qué debería exigir un cliente antes de comprar un producto fabricado en una planta con certificación parcial?</p>
<h2>Preguntas de profundización</h2>
<ol><li>¿Qué riesgo concreto asume el cliente que compra un jarabe con un certificado de sólidos orales?</li><li>¿Cómo debería comunicarse el alcance de una certificación sin confundir al público?</li></ol>
<h2>Qué debes publicar</h2>
<p>Publica una intervención de 150 a 250 palabras. Incluye tu postura, un argumento técnico y una aplicación al caso. Después responde a dos compañeros con una comparación, una pregunta o una evidencia; no basta con «estoy de acuerdo».</p>
<ul><li>Extensión: 150–250 palabras para la intervención inicial; 60–120 palabras por respuesta.</li><li>Respuestas: Dos respuestas a compañeros, comparando ideas o aportando evidencia.</li><li>Peso en el curso: 3.34 %.</li></ul>
<h2>Normas de participación</h2>
<p>Respeta las ideas de los demás. No compartas datos de pacientes ni información confidencial de empresas. Cita la fuente cuando uses una norma o un dato. Si usas herramientas de IA, decláralo y verifica lo que aportan.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %).</p>
<table>
  <caption>Rúbrica del foro (pesos internos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Qué se observa</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta central y usa el caso de forma explícita.</td></tr>
<tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Distingue alcance, norma y riesgo con un argumento técnico verificable.</td></tr>
<tr><td>Interacción sustantiva</td><td>30 %</td><td>Responde a dos compañeros con comparación, pregunta o evidencia que aporta.</td></tr>
  </tbody>
</table>$bpm_html$, FALSE, FALSE, 'publicado', 'rubrica', 3.34, $bpm_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa el caso de forma explícita."},{"level":3,"label":"Logrado","description":"Responde la pregunta y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta."},{"level":0,"label":"Sin evidencia","description":"No responde."}]},{"id":"razonamiento","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Distingue conceptos, norma y riesgo con evidencia verificable."},{"level":3,"label":"Logrado","description":"Argumenta con una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Usa opiniones generales."},{"level":1,"label":"Inicial","description":"Afirma sin justificar."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Aporta comparación, pregunta o evidencia en dos respuestas."},{"level":3,"label":"Logrado","description":"Responde a dos compañeros con aportes pertinentes."},{"level":2,"label":"En desarrollo","description":"Responde a uno o de forma superficial."},{"level":1,"label":"Inicial","description":"Solo dice «de acuerdo»."},{"level":0,"label":"Sin evidencia","description":"No responde."}]}]}$bpm_json$::jsonb, 1)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET module_id = v_unidad,
           scope = 'modulo',
           description = $bpm_html$<h2>Caso del foro</h2>
<p>Una comercializadora publica en su página web: «Contamos con certificación de BPM». El certificado que adjunta cubre únicamente sólidos orales de una planta ubicada en otro país. Un cliente quiere comprar un jarabe y otro quiere un inyectable. La comercializadora responde que «la planta está certificada, así que puede fabricar todo».</p>
<h2>Pregunta central</h2>
<p>¿Es aceptable esa respuesta? ¿Qué debería exigir un cliente antes de comprar un producto fabricado en una planta con certificación parcial?</p>
<h2>Preguntas de profundización</h2>
<ol><li>¿Qué riesgo concreto asume el cliente que compra un jarabe con un certificado de sólidos orales?</li><li>¿Cómo debería comunicarse el alcance de una certificación sin confundir al público?</li></ol>
<h2>Qué debes publicar</h2>
<p>Publica una intervención de 150 a 250 palabras. Incluye tu postura, un argumento técnico y una aplicación al caso. Después responde a dos compañeros con una comparación, una pregunta o una evidencia; no basta con «estoy de acuerdo».</p>
<ul><li>Extensión: 150–250 palabras para la intervención inicial; 60–120 palabras por respuesta.</li><li>Respuestas: Dos respuestas a compañeros, comparando ideas o aportando evidencia.</li><li>Peso en el curso: 3.34 %.</li></ul>
<h2>Normas de participación</h2>
<p>Respeta las ideas de los demás. No compartas datos de pacientes ni información confidencial de empresas. Cita la fuente cuando uses una norma o un dato. Si usas herramientas de IA, decláralo y verifica lo que aportan.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %).</p>
<table>
  <caption>Rúbrica del foro (pesos internos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Qué se observa</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta central y usa el caso de forma explícita.</td></tr>
<tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Distingue alcance, norma y riesgo con un argumento técnico verificable.</td></tr>
<tr><td>Interacción sustantiva</td><td>30 %</td><td>Responde a dos compañeros con comparación, pregunta o evidencia que aporta.</td></tr>
  </tbody>
</table>$bpm_html$,
           is_closed = FALSE,
           allow_attachments = FALSE,
           status = 'publicado',
           sort_order = 1,
           updated_at = NOW()
     WHERE id = v_foro;
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', 'Foro 1 · ¿Se certifica la empresa o la línea?';
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = 3.34, rubric = $bpm_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa el caso de forma explícita."},{"level":3,"label":"Logrado","description":"Responde la pregunta y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta."},{"level":0,"label":"Sin evidencia","description":"No responde."}]},{"id":"razonamiento","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Distingue conceptos, norma y riesgo con evidencia verificable."},{"level":3,"label":"Logrado","description":"Argumenta con una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Usa opiniones generales."},{"level":1,"label":"Inicial","description":"Afirma sin justificar."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Aporta comparación, pregunta o evidencia en dos respuestas."},{"level":3,"label":"Logrado","description":"Responde a dos compañeros con aportes pertinentes."},{"level":2,"label":"En desarrollo","description":"Responde a uno o de forma superficial."},{"level":1,"label":"Inicial","description":"Solo dice «de acuerdo»."},{"level":0,"label":"Sin evidencia","description":"No responde."}]}]}$bpm_json$::jsonb
       WHERE id = v_foro;
    END IF;
  END IF;


  -- ── Foro bpm-u2-foro ───────────────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Las BPM en la planta' AND deleted_at IS NULL
   LIMIT 1;

  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = 'Foro 2 · El costo de reportar un error' AND deleted_at IS NULL
   LIMIT 1;

  IF v_foro IS NULL THEN
    INSERT INTO aula_forums (course_id, module_id, scope, title, description, is_closed, allow_attachments, status, grading_method, weight, rubric, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Foro 2 · El costo de reportar un error', $bpm_html$<h2>Caso del foro</h2>
<p>En una planta, un operario detecta que olvidó añadir un excipiente a un lote. Si lo reporta, el lote se retrasa, se investiga y probablemente recibe una sanción económica. Si no lo reporta, el lote puede salir al mercado y el error quizá no se detecte. El supervisor le dice: «Piénsalo, todos cometemos errores».</p>
<h2>Pregunta central</h2>
<p>¿Qué debería hacer el operario y qué debería cambiar la empresa para que reportar sea la decisión natural?</p>
<h2>Preguntas de profundización</h2>
<ol><li>¿Qué consecuencia tiene para el paciente no reportar el error?</li><li>¿Qué evidencia demuestra que un sistema de reporte funciona?</li></ol>
<h2>Qué debes publicar</h2>
<p>Intervención de 150 a 250 palabras con postura, argumento técnico y aplicación al caso. Responde a dos compañeros con comparación, pregunta o evidencia.</p>
<ul><li>Extensión: 150–250 palabras; respuestas de 60–120 palabras.</li><li>Respuestas: Dos respuestas sustantivas a compañeros.</li><li>Peso en el curso: 3.33 %.</li></ul>
<h2>Normas de participación</h2>
<p>No se comparten datos de pacientes ni información confidencial. Respeta las opiniones. Cita la norma o la fuente cuando la uses.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %).</p>
<table>
  <caption>Rúbrica del foro (pesos internos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Qué se observa</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta y usa el caso con precisión.</td></tr>
<tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Conecta reporte, causa raíz y seguridad del paciente con un argumento verificable.</td></tr>
<tr><td>Interacción sustantiva</td><td>30 %</td><td>Aporta comparación, pregunta o evidencia en dos respuestas.</td></tr>
  </tbody>
</table>$bpm_html$, FALSE, FALSE, 'publicado', 'rubrica', 3.33, $bpm_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa el caso de forma explícita."},{"level":3,"label":"Logrado","description":"Responde la pregunta y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta."},{"level":0,"label":"Sin evidencia","description":"No responde."}]},{"id":"razonamiento","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Distingue conceptos, norma y riesgo con evidencia verificable."},{"level":3,"label":"Logrado","description":"Argumenta con una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Usa opiniones generales."},{"level":1,"label":"Inicial","description":"Afirma sin justificar."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Aporta comparación, pregunta o evidencia en dos respuestas."},{"level":3,"label":"Logrado","description":"Responde a dos compañeros con aportes pertinentes."},{"level":2,"label":"En desarrollo","description":"Responde a uno o de forma superficial."},{"level":1,"label":"Inicial","description":"Solo dice «de acuerdo»."},{"level":0,"label":"Sin evidencia","description":"No responde."}]}]}$bpm_json$::jsonb, 2)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET module_id = v_unidad,
           scope = 'modulo',
           description = $bpm_html$<h2>Caso del foro</h2>
<p>En una planta, un operario detecta que olvidó añadir un excipiente a un lote. Si lo reporta, el lote se retrasa, se investiga y probablemente recibe una sanción económica. Si no lo reporta, el lote puede salir al mercado y el error quizá no se detecte. El supervisor le dice: «Piénsalo, todos cometemos errores».</p>
<h2>Pregunta central</h2>
<p>¿Qué debería hacer el operario y qué debería cambiar la empresa para que reportar sea la decisión natural?</p>
<h2>Preguntas de profundización</h2>
<ol><li>¿Qué consecuencia tiene para el paciente no reportar el error?</li><li>¿Qué evidencia demuestra que un sistema de reporte funciona?</li></ol>
<h2>Qué debes publicar</h2>
<p>Intervención de 150 a 250 palabras con postura, argumento técnico y aplicación al caso. Responde a dos compañeros con comparación, pregunta o evidencia.</p>
<ul><li>Extensión: 150–250 palabras; respuestas de 60–120 palabras.</li><li>Respuestas: Dos respuestas sustantivas a compañeros.</li><li>Peso en el curso: 3.33 %.</li></ul>
<h2>Normas de participación</h2>
<p>No se comparten datos de pacientes ni información confidencial. Respeta las opiniones. Cita la norma o la fuente cuando la uses.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %).</p>
<table>
  <caption>Rúbrica del foro (pesos internos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Qué se observa</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta y usa el caso con precisión.</td></tr>
<tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Conecta reporte, causa raíz y seguridad del paciente con un argumento verificable.</td></tr>
<tr><td>Interacción sustantiva</td><td>30 %</td><td>Aporta comparación, pregunta o evidencia en dos respuestas.</td></tr>
  </tbody>
</table>$bpm_html$,
           is_closed = FALSE,
           allow_attachments = FALSE,
           status = 'publicado',
           sort_order = 2,
           updated_at = NOW()
     WHERE id = v_foro;
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', 'Foro 2 · El costo de reportar un error';
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = 3.33, rubric = $bpm_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa el caso de forma explícita."},{"level":3,"label":"Logrado","description":"Responde la pregunta y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta."},{"level":0,"label":"Sin evidencia","description":"No responde."}]},{"id":"razonamiento","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Distingue conceptos, norma y riesgo con evidencia verificable."},{"level":3,"label":"Logrado","description":"Argumenta con una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Usa opiniones generales."},{"level":1,"label":"Inicial","description":"Afirma sin justificar."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Aporta comparación, pregunta o evidencia en dos respuestas."},{"level":3,"label":"Logrado","description":"Responde a dos compañeros con aportes pertinentes."},{"level":2,"label":"En desarrollo","description":"Responde a uno o de forma superficial."},{"level":1,"label":"Inicial","description":"Solo dice «de acuerdo»."},{"level":0,"label":"Sin evidencia","description":"No responde."}]}]}$bpm_json$::jsonb
       WHERE id = v_foro;
    END IF;
  END IF;


  -- ── Foro bpm-u3-foro ───────────────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Sostener el cumplimiento' AND deleted_at IS NULL
   LIMIT 1;

  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = 'Foro 3 · Cero desviaciones: ¿señal de calidad o de ceguera?' AND deleted_at IS NULL
   LIMIT 1;

  IF v_foro IS NULL THEN
    INSERT INTO aula_forums (course_id, module_id, scope, title, description, is_closed, allow_attachments, status, grading_method, weight, rubric, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Foro 3 · Cero desviaciones: ¿señal de calidad o de ceguera?', $bpm_html$<h2>Caso del foro</h2>
<p>Dos plantas compiten por un contrato. La planta A reporta 120 desviaciones al año y cerró el 95 % con causa raíz verificada. La planta B reporta 3 desviaciones al año y presume de «excelencia». El cliente debe elegir. El gerente de la planta B dice: «Menos desviaciones significa mejor calidad».</p>
<h2>Pregunta central</h2>
<p>¿Cuál planta ofrece más confianza y qué indicadores debería mirar el cliente além del número de desviaciones?</p>
<h2>Preguntas de profundización</h2>
<ol><li>¿Qué podría explicar que una planta reporte muy pocas desviaciones?</li><li>¿Qué indicadores mostrarían que el sistema de calidad funciona de verdad?</li></ol>
<h2>Qué debes publicar</h2>
<p>Intervención de 150 a 250 palabras con postura, argumento y aplicación al caso. Responde a dos compañeros con comparación, pregunta o evidencia.</p>
<ul><li>Extensión: 150–250 palabras; respuestas de 60–120 palabras.</li><li>Respuestas: Dos respuestas sustantivas a compañeros.</li><li>Peso en el curso: 3.33 %.</li></ul>
<h2>Normas de participación</h2>
<p>No compartas datos confidenciales. Respeta las opiniones. Cita la fuente cuando uses una norma o un dato.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %).</p>
<table>
  <caption>Rúbrica del foro (pesos internos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Qué se observa</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta y usa el caso con precisión.</td></tr>
<tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Distingue reporte, calidad y cultura con argumentos verificables.</td></tr>
<tr><td>Interacción sustantiva</td><td>30 %</td><td>Aporta comparación, pregunta o evidencia en dos respuestas.</td></tr>
  </tbody>
</table>$bpm_html$, FALSE, FALSE, 'publicado', 'rubrica', 3.33, $bpm_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa el caso de forma explícita."},{"level":3,"label":"Logrado","description":"Responde la pregunta y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta."},{"level":0,"label":"Sin evidencia","description":"No responde."}]},{"id":"razonamiento","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Distingue conceptos, norma y riesgo con evidencia verificable."},{"level":3,"label":"Logrado","description":"Argumenta con una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Usa opiniones generales."},{"level":1,"label":"Inicial","description":"Afirma sin justificar."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Aporta comparación, pregunta o evidencia en dos respuestas."},{"level":3,"label":"Logrado","description":"Responde a dos compañeros con aportes pertinentes."},{"level":2,"label":"En desarrollo","description":"Responde a uno o de forma superficial."},{"level":1,"label":"Inicial","description":"Solo dice «de acuerdo»."},{"level":0,"label":"Sin evidencia","description":"No responde."}]}]}$bpm_json$::jsonb, 3)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET module_id = v_unidad,
           scope = 'modulo',
           description = $bpm_html$<h2>Caso del foro</h2>
<p>Dos plantas compiten por un contrato. La planta A reporta 120 desviaciones al año y cerró el 95 % con causa raíz verificada. La planta B reporta 3 desviaciones al año y presume de «excelencia». El cliente debe elegir. El gerente de la planta B dice: «Menos desviaciones significa mejor calidad».</p>
<h2>Pregunta central</h2>
<p>¿Cuál planta ofrece más confianza y qué indicadores debería mirar el cliente além del número de desviaciones?</p>
<h2>Preguntas de profundización</h2>
<ol><li>¿Qué podría explicar que una planta reporte muy pocas desviaciones?</li><li>¿Qué indicadores mostrarían que el sistema de calidad funciona de verdad?</li></ol>
<h2>Qué debes publicar</h2>
<p>Intervención de 150 a 250 palabras con postura, argumento y aplicación al caso. Responde a dos compañeros con comparación, pregunta o evidencia.</p>
<ul><li>Extensión: 150–250 palabras; respuestas de 60–120 palabras.</li><li>Respuestas: Dos respuestas sustantivas a compañeros.</li><li>Peso en el curso: 3.33 %.</li></ul>
<h2>Normas de participación</h2>
<p>No compartas datos confidenciales. Respeta las opiniones. Cita la fuente cuando uses una norma o un dato.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %).</p>
<table>
  <caption>Rúbrica del foro (pesos internos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Qué se observa</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta y usa el caso con precisión.</td></tr>
<tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Distingue reporte, calidad y cultura con argumentos verificables.</td></tr>
<tr><td>Interacción sustantiva</td><td>30 %</td><td>Aporta comparación, pregunta o evidencia en dos respuestas.</td></tr>
  </tbody>
</table>$bpm_html$,
           is_closed = FALSE,
           allow_attachments = FALSE,
           status = 'publicado',
           sort_order = 3,
           updated_at = NOW()
     WHERE id = v_foro;
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', 'Foro 3 · Cero desviaciones: ¿señal de calidad o de ceguera?';
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = 3.33, rubric = $bpm_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa el caso de forma explícita."},{"level":3,"label":"Logrado","description":"Responde la pregunta y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta."},{"level":0,"label":"Sin evidencia","description":"No responde."}]},{"id":"razonamiento","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Distingue conceptos, norma y riesgo con evidencia verificable."},{"level":3,"label":"Logrado","description":"Argumenta con una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Usa opiniones generales."},{"level":1,"label":"Inicial","description":"Afirma sin justificar."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Aporta comparación, pregunta o evidencia en dos respuestas."},{"level":3,"label":"Logrado","description":"Responde a dos compañeros con aportes pertinentes."},{"level":2,"label":"En desarrollo","description":"Responde a uno o de forma superficial."},{"level":1,"label":"Inicial","description":"Solo dice «de acuerdo»."},{"level":0,"label":"Sin evidencia","description":"No responde."}]}]}$bpm_json$::jsonb
       WHERE id = v_foro;
    END IF;
  END IF;


  -- Ya publicado: se aprueba la versión nueva con las clases completas.
  -- Si todavía no tiene su primera versión, esa primera publicación ya
  -- las incluye.
  INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
  SELECT v_curso, 'Dirección académica de Edvanta', 'Clases completas, quizzes, actividades y foros (10-nov-2026).'
   WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);


  RAISE NOTICE 'Curso de BPM actualizado: % clases, % quizzes, % actividades y % foros.',
    (SELECT COUNT(*) FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$bpm$;
