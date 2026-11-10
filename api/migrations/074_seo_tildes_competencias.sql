-- ============================================================
--  074_seo_tildes_competencias.sql
--
--  19 descripciones de competencias se sembraron sin tildes
--  («Gestion», «Evaluacion», «Diseno»…). Se leen en la página de cada
--  competencia y en su descripción para buscadores. Se corrige solo la
--  ortografía, sin cambiar el sentido.
--
--  Cada UPDATE exige el texto anterior exacto: si alguien ya editó la
--  descripción desde la administración, no se toca. updated_at cambia
--  para que el sitemap avise a los buscadores.
-- ============================================================

UPDATE skills SET description = 'Gestión del cumplimiento regulatorio durante el ciclo de vida del producto.', updated_at = NOW()
 WHERE slug = 'asuntos-regulatorios' AND description = 'Gestion del cumplimiento regulatorio durante el ciclo de vida del producto.';

UPDATE skills SET description = 'Identificación y evaluación responsable de oportunidades profesionales.', updated_at = NOW()
 WHERE slug = 'busqueda-de-empleo' AND description = 'Identificacion y evaluacion responsable de oportunidades profesionales.';

UPDATE skills SET description = 'Calificación, seguimiento y gestión de riesgos de proveedores.', updated_at = NOW()
 WHERE slug = 'calidad-de-proveedores' AND description = 'Calificacion, seguimiento y gestion de riesgos de proveedores.';

UPDATE skills SET description = 'Evaluación, aprobación, implementación y cierre trazable de cambios.', updated_at = NOW()
 WHERE slug = 'control-de-cambios' AND description = 'Evaluacion, aprobacion, implementacion y cierre trazable de cambios.';

UPDATE skills SET description = 'Preparación y comunicación de evidencia durante procesos de selección.', updated_at = NOW()
 WHERE slug = 'entrevista-profesional' AND description = 'Preparacion y comunicacion de evidencia durante procesos de seleccion.';

UPDATE skills SET description = 'Análisis, organización y presentación de datos con hojas de cálculo.', updated_at = NOW()
 WHERE slug = 'excel' AND description = 'Analisis, organizacion y presentacion de datos con hojas de calculo.';

UPDATE skills SET description = 'Vigilancia y gestión del balance beneficio-riesgo de medicamentos.', updated_at = NOW()
 WHERE slug = 'farmacovigilancia' AND description = 'Vigilancia y gestion del balance beneficio-riesgo de medicamentos.';

UPDATE skills SET description = 'Gestión de impactos, recursos, residuos y cumplimiento ambiental.', updated_at = NOW()
 WHERE slug = 'gestion-ambiental' AND description = 'Gestion de impactos, recursos, residuos y cumplimiento ambiental.';

UPDATE skills SET description = 'Comunicación clara y verificable de experiencia, habilidades y logros.', updated_at = NOW()
 WHERE slug = 'hoja-de-vida-profesional' AND description = 'Comunicacion clara y verificable de experiencia, habilidades y logros.';

UPDATE skills SET description = 'Contexto del ciclo de vida, actores y operaciones de la industria farmacéutica.', updated_at = NOW()
 WHERE slug = 'industria-farmaceutica' AND description = 'Contexto del ciclo de vida, actores y operaciones de la industria farmaceutica.';

UPDATE skills SET description = 'Modelado, visualización y comunicación de datos con Power BI.', updated_at = NOW()
 WHERE slug = 'power-bi' AND description = 'Modelado, visualizacion y comunicacion de datos con Power BI.';

UPDATE skills SET description = 'Identificación y sostenimiento de mejoras medibles en procesos.', updated_at = NOW()
 WHERE slug = 'mejora-continua' AND description = 'Identificacion y sostenimiento de mejoras medibles en procesos.';

UPDATE skills SET description = 'Ejecución controlada de operaciones de fabricación farmacéutica.', updated_at = NOW()
 WHERE slug = 'produccion-farmaceutica' AND description = 'Ejecucion controlada de operaciones de fabricacion farmaceutica.';

UPDATE skills SET description = 'Identificación y control de riesgos para entornos de trabajo seguros.', updated_at = NOW()
 WHERE slug = 'seguridad-y-salud-en-el-trabajo' AND description = 'Identificacion y control de riesgos para entornos de trabajo seguros.';

UPDATE skills SET description = 'Gestión e investigación de resultados fuera de especificación o tendencia.', updated_at = NOW()
 WHERE slug = 'resultados-fuera-de-especificacion-oos-y-oot' AND description = 'Gestion e investigacion de resultados fuera de especificacion o tendencia.';

UPDATE skills SET description = 'Diseño, mantenimiento y mejora de un sistema de gestión de calidad.', updated_at = NOW()
 WHERE slug = 'sistemas-de-gestion-de-calidad' AND description = 'Diseno, mantenimiento y mejora de un sistema de gestion de calidad.';

UPDATE skills SET description = 'Reducción de desperdicios y mejora del flujo de valor.', updated_at = NOW()
 WHERE slug = 'lean' AND description = 'Reduccion de desperdicios y mejora del flujo de valor.';

UPDATE skills SET description = 'Intercambio científico y estrategia médica basada en evidencia.', updated_at = NOW()
 WHERE slug = 'medical-affairs' AND description = 'Intercambio cientifico y estrategia medica basada en evidencia.';

UPDATE skills SET description = 'Reducción de variabilidad y resolución de problemas basada en datos.', updated_at = NOW()
 WHERE slug = 'six-sigma' AND description = 'Reduccion de variabilidad y resolucion de problemas basada en datos.';
