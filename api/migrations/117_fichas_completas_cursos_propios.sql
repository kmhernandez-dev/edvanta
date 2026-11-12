-- ============================================================
--  117_fichas_completas_cursos_propios.sql
--
--  Cuatro cursos propios tenían la ficha más corta del sitio (unas 330
--  palabras): sin descripción, sin público, sin requisitos y sin lista de
--  lo que se aprende. Aquí se completan con lo que ya enseña su temario
--  publicado (las mismas unidades y clases), sin prometer nada nuevo.
--
--  Solo llena lo que está vacío: si alguien ya escribió un campo desde el
--  editor del aula, se respeta. No toca el temario ni las evaluaciones.
-- ============================================================

DO $fichas$
DECLARE
  v_id BIGINT;
BEGIN
  -- ── Central de Mezclas ─────────────────────────────────────
  SELECT id INTO v_id FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_id IS NOT NULL THEN
    UPDATE aula_courses SET
      description_html = CASE WHEN COALESCE(description_html, '') = '' THEN $d$
<p>Una central de mezclas prepara medicamentos estériles para pacientes concretos: nutriciones parenterales, mezclas intravenosas y mezclas oncológicas. Un error de técnica, de cálculo o de ambiente puede llegar directo a la sangre de un paciente, y por eso cada requisito existe por una razón.</p>
<p>Este curso explica qué riesgo se está conteniendo, qué norma aplica y cómo se clasifica el riesgo de cada preparación. Recorre las áreas limpias, las cabinas de seguridad y de flujo laminar, y la técnica aséptica y su validación. Cierra con la gestión de la calidad de la central: controles ambientales y de personal, estabilidad, trazabilidad y documentación, y la seguridad de quien prepara mezclas oncológicas.</p>
<p>La idea central: entender qué protege cada requisito y qué pasa cuando uno falla, para sostener la central en el día a día y no solo en la visita de inspección.</p>
$d$ ELSE description_html END,
      audience = CASE WHEN COALESCE(audience, '') = '' THEN 'Químicos farmacéuticos y regentes de servicios farmacéuticos hospitalarios, personal de centrales de mezclas y de preparaciones magistrales estériles, y estudiantes de últimos semestres de Química Farmacéutica.' ELSE audience END,
      prerequisites = CASE WHEN COALESCE(prerequisites, '') = '' THEN 'Se recomienda conocer las bases del servicio farmacéutico. El curso no reemplaza el entrenamiento práctico ni la calificación del personal en técnica aséptica.' ELSE prerequisites END,
      learning_outcomes = CASE WHEN COALESCE(array_length(learning_outcomes, 1), 0) = 0 THEN ARRAY[
        'Explicar por qué una preparación estéril tiene riesgos distintos y qué norma aplica.',
        'Clasificar el nivel de riesgo de una preparación.',
        'Relacionar la clasificación de áreas limpias, las cabinas y el flujo laminar con la protección del producto.',
        'Reconocer los elementos de la técnica aséptica y de su validación.',
        'Organizar los controles ambientales y de personal, la estabilidad y la trazabilidad de la central.',
        'Aplicar medidas de seguridad para quien prepara mezclas oncológicas.'
      ]::text[] ELSE learning_outcomes END,
      updated_at = NOW()
     WHERE id = v_id;
  END IF;

  -- ── Validaciones y Calificaciones ──────────────────────────
  SELECT id INTO v_id FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Validaciones y Calificaciones en la Industria Farmacéutica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_id IS NOT NULL THEN
    UPDATE aula_courses SET
      description_html = CASE WHEN COALESCE(description_html, '') = '' THEN $d$
<p>Calificar y validar no es lo mismo, y confundirlos es uno de los errores más frecuentes en una planta o un laboratorio. Los equipos, las instalaciones y los sistemas se califican; los procesos, la limpieza y los métodos analíticos se validan. Las dos actividades sostienen la confianza en que cada lote de medicamento es igual al anterior.</p>
<p>El curso parte de esa diferencia, de dónde viene la exigencia y del enfoque de ciclo de vida con su Plan Maestro de Validación. Después recorre la calificación de equipos e instalaciones (DQ, IQ, OQ y PQ), los sistemas críticos de agua, aire y vapor, y cómo se manejan los protocolos, las desviaciones y la recalificación. Termina con la validación de procesos, de limpieza y de métodos analíticos.</p>
<p>El objetivo es que distingas qué se califica y qué se valida, y que sepas leer y sostener un protocolo.</p>
$d$ ELSE description_html END,
      audience = CASE WHEN COALESCE(audience, '') = '' THEN 'Profesionales de aseguramiento y control de calidad, validaciones, producción, ingeniería y mantenimiento en la industria farmacéutica, y estudiantes de últimos semestres de Química Farmacéutica.' ELSE audience END,
      prerequisites = CASE WHEN COALESCE(prerequisites, '') = '' THEN 'Se recomienda conocer las Buenas Prácticas de Manufactura. El curso no reemplaza la formación práctica en los equipos de cada planta.' ELSE prerequisites END,
      learning_outcomes = CASE WHEN COALESCE(array_length(learning_outcomes, 1), 0) = 0 THEN ARRAY[
        'Distinguir qué se califica y qué se valida, y de dónde viene cada exigencia.',
        'Explicar el enfoque de ciclo de vida y el papel del Plan Maestro de Validación.',
        'Describir las etapas DQ, IQ, OQ y PQ de la calificación de un equipo.',
        'Reconocer los sistemas críticos de agua, aire y vapor y sus controles.',
        'Manejar protocolos, desviaciones y recalificaciones.',
        'Explicar la validación de procesos, de limpieza y de métodos analíticos.'
      ]::text[] ELSE learning_outcomes END,
      updated_at = NOW()
     WHERE id = v_id;
  END IF;

  -- ── Asuntos Regulatorios Sanitarios ante INVIMA ────────────
  SELECT id INTO v_id FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Asuntos Regulatorios Sanitarios ante INVIMA' AND deleted_at IS NULL
   LIMIT 1;
  IF v_id IS NOT NULL THEN
    UPDATE aula_courses SET
      description_html = CASE WHEN COALESCE(description_html, '') = '' THEN $d$
<p>Un producto farmacéutico recorre un camino largo ante el INVIMA: se clasifica, se arma su expediente, se evalúa, se responden requerimientos y, después de obtener el registro sanitario, se mantiene con modificaciones, renovaciones, farmacovigilancia y control de su publicidad. Perderse en ese camino cuesta meses.</p>
<p>El curso empieza por el sistema sanitario colombiano: qué es el INVIMA y qué vigila, cómo se clasifica un producto y el Decreto 677 de 1995 con sus actualizaciones. Sigue con el registro sanitario paso a paso: qué lleva el expediente, la evaluación farmacológica y farmacéutica, y cómo responder los requerimientos. Termina con lo que viene después del registro: modificaciones y renovaciones, farmacovigilancia y poscomercialización, publicidad, visitas y sanciones.</p>
<p>El objetivo es que puedas armar y sostener un expediente de registro sanitario sin perderte en el camino.</p>
$d$ ELSE description_html END,
      audience = CASE WHEN COALESCE(audience, '') = '' THEN 'Químicos farmacéuticos y profesionales que trabajan o quieren trabajar en asuntos regulatorios, calidad o dirección técnica, y estudiantes de últimos semestres de Química Farmacéutica.' ELSE audience END,
      prerequisites = CASE WHEN COALESCE(prerequisites, '') = '' THEN 'Ninguno obligatorio. Ayuda conocer las bases de la calidad farmacéutica. Las normas cambian: el curso enseña a consultarlas en su fuente oficial.' ELSE prerequisites END,
      learning_outcomes = CASE WHEN COALESCE(array_length(learning_outcomes, 1), 0) = 0 THEN ARRAY[
        'Explicar qué vigila el INVIMA y cómo se clasifica un producto.',
        'Ubicar el Decreto 677 de 1995 y sus actualizaciones en el trámite de un medicamento.',
        'Identificar qué lleva un expediente de registro sanitario.',
        'Distinguir la evaluación farmacológica de la farmacéutica.',
        'Preparar la respuesta a un requerimiento del INVIMA.',
        'Planear lo que sigue al registro: modificaciones, renovaciones, farmacovigilancia y publicidad.'
      ]::text[] ELSE learning_outcomes END,
      updated_at = NOW()
     WHERE id = v_id;
  END IF;

  -- ── Autocuidado de la tiroides ─────────────────────────────
  SELECT id INTO v_id FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Autocuidado de la tiroides' AND deleted_at IS NULL
   LIMIT 1;
  IF v_id IS NOT NULL THEN
    UPDATE aula_courses SET
      description_html = CASE WHEN COALESCE(description_html, '') = '' THEN $d$
<p>Vivir con una enfermedad de la tiroides implica entender exámenes, tomar bien un medicamento todos los días y saber cuándo consultar. Este curso está pensado para pacientes y familias que quieren llegar a la consulta con mejores preguntas y entender su tratamiento, sin reemplazar al equipo de salud.</p>
<p>Explica qué es la tiroides y para qué sirve, las diferencias entre hipotiroidismo e hipertiroidismo, y qué miden los exámenes tiroideos (TSH, T4, T3 y anticuerpos). Después se centra en los medicamentos: cinco pasos para tomar la levotiroxina correctamente, sus interacciones con horarios, alimentos y suplementos, y el uso seguro de los antitiroideos con sus controles y riesgos. Cierra con una clase práctica de autocuidado.</p>
<p>Es información educativa: las decisiones sobre el tratamiento se toman con el médico tratante.</p>
$d$ ELSE description_html END,
      audience = CASE WHEN COALESCE(audience, '') = '' THEN 'Personas con hipotiroidismo, hipertiroidismo o en estudio por la tiroides, sus familias y cuidadores. También sirve a auxiliares y regentes de farmacia que orientan a estos pacientes.' ELSE audience END,
      prerequisites = CASE WHEN COALESCE(prerequisites, '') = '' THEN 'Ninguno. No reemplaza la consulta médica ni cambia las indicaciones de tu tratamiento.' ELSE prerequisites END,
      learning_outcomes = CASE WHEN COALESCE(array_length(learning_outcomes, 1), 0) = 0 THEN ARRAY[
        'Explicar qué es la tiroides y para qué sirve.',
        'Distinguir el hipotiroidismo del hipertiroidismo.',
        'Entender qué miden la TSH, la T4, la T3 y los anticuerpos tiroideos.',
        'Seguir los pasos para tomar la levotiroxina correctamente.',
        'Reconocer interacciones de la levotiroxina con horarios, alimentos y suplementos.',
        'Llegar a la consulta con preguntas claras sobre el tratamiento.'
      ]::text[] ELSE learning_outcomes END,
      updated_at = NOW()
     WHERE id = v_id;
  END IF;
END $fichas$;
