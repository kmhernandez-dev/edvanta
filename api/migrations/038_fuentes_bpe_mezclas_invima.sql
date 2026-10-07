-- ============================================================
--  038_fuentes_bpe_mezclas_invima.sql
--
--  Cierra los tres cursos que faltaban: BPE y preparaciones
--  magistrales, Central de mezclas, y Asuntos regulatorios ante
--  INVIMA. Cada clase gana documento oficial, norma aplicable con
--  lectura complementaria, y actividad.
--
--  Todas las URL comprobadas una por una: responden 200 siguiendo
--  redirecciones. Las que fallaron se sustituyeron por la fuente
--  equivalente que sí responde (por ejemplo, la guía de la FDA sobre
--  procesos asépticos se enlaza por su página de guidance y no por
--  el PDF directo, que devolvía 404).
-- ============================================================

DO $$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
  r RECORD;
BEGIN
  FOR r IN
    SELECT * FROM (VALUES

      -- ══ BPE y preparaciones magistrales ═══════════════════
      ('Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales',
       'Magistral, oficinal e industrial',
       'Decreto 2200 de 2005 · Servicio farmacéutico',
       'https://www.minsalud.gov.co/Normatividad_Nuevo/DECRETO%202200%20DE%202005.pdf',
       'La norma que define qué es el servicio farmacéutico y dónde encajan las preparaciones magistrales.',
       'Decreto 2200 de 2005, desarrollado por la Resolución 1403 de 2007.',
       'USP, capítulo 795, la referencia internacional para preparaciones no estériles: <a href="https://www.usp.org/compounding/general-chapter-795">usp.org</a>',
       'Escribe una definición propia de magistral, oficinal e industrial sin copiar la norma, y pon un ejemplo de cada una. Si no distingues dos de ellas, vuelve al decreto.'),

      ('Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales',
       'El marco normativo colombiano',
       'Resolución 1403 de 2007 · Modelo de Gestión del Servicio Farmacéutico',
       'https://www.minsalud.gov.co/Normatividad_Nuevo/RESOLUCION%201403%20DE%202007.pdf',
       'El desarrollo operativo del Decreto 2200: condiciones, procesos y responsabilidades.',
       'Resolución 1403 de 2007. Es la norma a la que volver ante cualquier duda de qué está permitido.',
       'Decreto 2200 de 2005, el marco del que depende: <a href="https://www.minsalud.gov.co/Normatividad_Nuevo/DECRETO%202200%20DE%202005.pdf">minsalud.gov.co</a>',
       'Localiza en la Resolución 1403 el capítulo de preparaciones magistrales y anota tres condiciones que debe cumplir el establecimiento. Cita el numeral de cada una.'),

      ('Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales',
       'Qué no se puede preparar',
       'FDA · Human Drug Compounding: leyes y políticas',
       'https://www.fda.gov/drugs/human-drug-compounding/compounding-laws-and-policies',
       'Cómo otro sistema regulatorio traza el límite entre preparar y fabricar. Útil para entender el porqué del límite colombiano.',
       'En Colombia el límite lo fija la Resolución 1403 de 2007: no se copia un medicamento con registro sanitario disponible.',
       'USP 795, sobre el alcance de la preparación no estéril: <a href="https://www.usp.org/compounding/general-chapter-795">usp.org</a>',
       'Un médico pide una preparación magistral que equivale a un medicamento comercial disponible. Escribe la respuesta que darías, citando la norma y ofreciendo una alternativa.'),

      ('Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales',
       'Áreas, equipos y condiciones',
       'USP · Capítulo 795, preparaciones no estériles',
       'https://www.usp.org/compounding/general-chapter-795',
       'Requisitos de área, equipos, personal y controles para preparaciones no estériles.',
       'USP 795 como referencia técnica; la exigencia legal en Colombia viene de la Resolución 1403 de 2007.',
       'Resolución 1403 de 2007, capítulo de condiciones del establecimiento: <a href="https://www.minsalud.gov.co/Normatividad_Nuevo/RESOLUCION%201403%20DE%202007.pdf">minsalud.gov.co</a>',
       'Haz la lista de equipos mínimos de un área de preparación magistral y anota, para cada uno, cada cuánto se calibra y quién lo registra. Marca los que no sabrías responder.'),

      ('Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales',
       'Materias primas y agua',
       'OMS · Informe 32, Anexo 2 (materiales y agua)',
       'https://www.who.int/publications/m/item/trs986-annex2',
       'Por qué el agua se trata como materia prima crítica y qué exige cada grado de calidad.',
       'Informe 32 de la OMS. En el servicio farmacéutico aplica la Resolución 1403 de 2007.',
       'USP 795, sobre selección de ingredientes: <a href="https://www.usp.org/compounding/general-chapter-795">usp.org</a>',
       'Toma una preparación sencilla y escribe de dónde viene cada ingrediente, qué certificado llega con él y qué agua usarías. Si para algún ingrediente no hay certificado, anota qué harías.'),

      ('Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales',
       'La guía de elaboración y el etiquetado',
       'Resolución 1403 de 2007 · Registro y rotulado',
       'https://www.minsalud.gov.co/Normatividad_Nuevo/RESOLUCION%201403%20DE%202007.pdf',
       'Qué debe quedar escrito de cada preparación y qué debe decir la etiqueta.',
       'Resolución 1403 de 2007. Sin ese registro, una preparación no es trazable.',
       'USP 795, sección de documentación y etiquetado: <a href="https://www.usp.org/compounding/general-chapter-795">usp.org</a>',
       'Diseña la etiqueta de una preparación magistral con todos los datos exigidos. Luego tápate la fórmula y comprueba si, solo con la etiqueta, podrías saber qué contiene y hasta cuándo sirve.'),

      ('Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales',
       'Controles de calidad posibles',
       'USP · Capítulo 795, controles de calidad',
       'https://www.usp.org/compounding/general-chapter-795',
       'Qué controles son viables en un servicio farmacéutico y cuándo hay que recurrir a un laboratorio externo.',
       'USP 795. La obligación de controlar viene de la Resolución 1403 de 2007.',
       'Portal de compounding de la USP, con los tres capítulos relacionados: <a href="https://www.usp.org/compounding">usp.org/compounding</a>',
       'Para tres formas farmacéuticas distintas, escribe qué control harías en el propio servicio y cuál mandarías fuera. Justifica el corte entre una cosa y la otra.'),

      ('Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales',
       'Estabilidad y fecha límite de uso',
       'USP · Capítulo 795, beyond-use date',
       'https://www.usp.org/compounding/general-chapter-795',
       'Cómo se sustenta una fecha límite de uso y por qué no se puede copiar la del producto comercial.',
       'USP 795 para el criterio técnico; la Resolución 1403 de 2007 para la obligación de declararla.',
       'OMS, Informe 32, sobre estudios de estabilidad: <a href="https://www.who.int/publications/m/item/trs986-annex2">who.int</a>',
       'Explica en cinco renglones por qué la fecha de vencimiento del principio activo comercial no sirve como fecha límite de uso de tu preparación. Usa un ejemplo concreto.'),

      ('Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales',
       'Cuando algo sale mal: farmacovigilancia',
       'INVIMA · Farmacovigilancia',
       'https://www.invima.gov.co/farmacovigilancia',
       'Cómo se reporta en Colombia una sospecha de reacción adversa o un defecto de calidad.',
       'Programa Nacional de Farmacovigilancia del INVIMA, exigido por la Resolución 1403 de 2007.',
       'OPS, sobre farmacovigilancia en la región: <a href="https://www.paho.org/es/temas/farmacovigilancia">paho.org</a>',
       'Redacta el reporte de una sospecha de reacción adversa ficticia con todos los datos que pide el formato. Anota qué dato te costó más conseguir: suele ser el que falta en la vida real.'),

      -- ══ Central de mezclas ════════════════════════════════
      ('Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad',
       'El riesgo que se está conteniendo',
       'USP · Capítulo 797, preparaciones estériles',
       'https://www.usp.org/compounding/general-chapter-797',
       'El capítulo que ordena toda la práctica estéril por niveles de riesgo. Lee el alcance y las definiciones.',
       'USP 797 como referencia internacional; en Colombia la Resolución 1403 de 2007.',
       'Resolución 1403 de 2007, capítulo de preparaciones estériles: <a href="https://www.minsalud.gov.co/Normatividad_Nuevo/RESOLUCION%201403%20DE%202007.pdf">minsalud.gov.co</a>',
       'Escribe qué barreras del cuerpo se salta un medicamento intravenoso y qué consecuencia tiene eso para quien lo prepara. Tres renglones.'),

      ('Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad',
       'Normativa aplicable',
       'Resolución 1403 de 2007 · Preparaciones estériles',
       'https://www.minsalud.gov.co/Normatividad_Nuevo/RESOLUCION%201403%20DE%202007.pdf',
       'La norma colombiana que regula la central de mezclas: condiciones, personal y procesos.',
       'Resolución 1403 de 2007, que desarrolla el Decreto 2200 de 2005.',
       'USP 797, para contrastar con el estándar internacional: <a href="https://www.usp.org/compounding/general-chapter-797">usp.org</a>',
       'Compara un requisito de la Resolución 1403 con el equivalente en USP 797 y anota en qué se diferencian. Si uno es más exigente, di cuál y por qué crees que es así.'),

      ('Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad',
       'Niveles de riesgo de una preparación',
       'USP · Capítulo 797, categorías de preparación',
       'https://www.usp.org/compounding/general-chapter-797',
       'Cómo se clasifica el riesgo según manipulaciones, envase de partida y tiempo hasta la administración.',
       'USP 797. La clasificación determina el área, los controles y la fecha límite de uso.',
       'Portal de compounding de la USP: <a href="https://www.usp.org/compounding">usp.org/compounding</a>',
       'Clasifica tres mezclas distintas por nivel de riesgo y justifica cada una con los tres criterios. La que te cueste clasificar es la que más atención necesita en la práctica.'),

      ('Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad',
       'Clasificación de áreas limpias',
       'UE · Anexo 1, fabricación de medicamentos estériles',
       'https://health.ec.europa.eu/system/files/2022-08/20220825_gmp-an1_en_0.pdf',
       'La revisión de 2022 del Anexo 1: clasificación de áreas, estrategia de control de contaminación y monitoreo.',
       'Anexo 1 de las BPM europeas, referencia técnica. En Colombia, la Resolución 1403 de 2007.',
       'PIC/S Anexo 1, el mismo texto adoptado por el esquema PIC/S: <a href="https://picscheme.org/docview/6611">picscheme.org</a>',
       'Explica por qué se trabaja en ISO 5 dentro de un ambiente ISO 7 y no al revés. Luego di qué pasaría si las presiones diferenciales se invirtieran.'),

      ('Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad',
       'Cabinas de seguridad y flujo laminar',
       'FDA · Sterile Drug Products Produced by Aseptic Processing',
       'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/sterile-drug-products-produced-aseptic-processing-current-good-manufacturing-practice',
       'Cómo se diseña y se opera el aire que protege la preparación. Capítulos de instalaciones y flujo unidireccional.',
       'Guía de la FDA sobre procesamiento aséptico, complementaria al Anexo 1 europeo.',
       'Anexo 1 de la UE, sección de tecnologías de barrera: <a href="https://health.ec.europa.eu/system/files/2022-08/20220825_gmp-an1_en_0.pdf">health.ec.europa.eu</a>',
       'Explica la diferencia entre una cabina de flujo laminar y una de seguridad biológica, y di cuál usarías para un citostático y por qué. La respuesta protege a una persona distinta en cada caso.'),

      ('Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad',
       'Técnica aséptica y su validación',
       'FDA · Procesamiento aséptico (simulación con medio de cultivo)',
       'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/sterile-drug-products-produced-aseptic-processing-current-good-manufacturing-practice',
       'Qué es un media fill, con qué frecuencia se hace y qué significa que falle.',
       'Guía de la FDA. USP 797 exige la validación periódica de quien prepara.',
       'USP 797, evaluación del personal: <a href="https://www.usp.org/compounding/general-chapter-797">usp.org</a>',
       'Un media fill sale positivo. Escribe los pasos que seguirías, en orden, y qué pasa con las preparaciones hechas desde el último media fill válido.'),

      ('Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad',
       'Controles ambientales y de personal',
       'UE · Anexo 1, monitoreo ambiental',
       'https://health.ec.europa.eu/system/files/2022-08/20220825_gmp-an1_en_0.pdf',
       'Qué se monitorea, con qué frecuencia y qué hacer cuando un resultado se sale de límite.',
       'Anexo 1 de las BPM europeas. En Colombia, la Resolución 1403 de 2007.',
       'USP 797, monitoreo ambiental y de superficies: <a href="https://www.usp.org/compounding/general-chapter-797">usp.org</a>',
       'Diseña el plan de monitoreo de una semana para una central pequeña: qué se mide, dónde y cuándo. Luego di qué harías si la huella de un guante sale positiva un viernes.'),

      ('Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad',
       'Estabilidad, trazabilidad y documentación',
       'USP · Capítulo 797, fecha límite de uso',
       'https://www.usp.org/compounding/general-chapter-797',
       'Cómo se asigna la fecha límite de uso en preparaciones estériles, donde el margen de error es menor.',
       'USP 797. La trazabilidad la exige la Resolución 1403 de 2007.',
       'Resolución 1403 de 2007: <a href="https://www.minsalud.gov.co/Normatividad_Nuevo/RESOLUCION%201403%20DE%202007.pdf">minsalud.gov.co</a>',
       'Reconstruye una preparación a partir de su registro: qué lotes entraron, quién preparó, quién verificó y para qué paciente. Si falta un dato, esa es una preparación que no podrías defender.'),

      ('Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad',
       'Mezclas oncológicas y seguridad de quien prepara',
       'OMS · Informe 32, Anexo 2 (productos peligrosos)',
       'https://www.who.int/publications/m/item/trs986-annex2',
       'Contención, protección y manejo de residuos cuando el producto es peligroso para quien lo manipula.',
       'Informe 32 de la OMS y Resolución 1403 de 2007.',
       'Portal de compounding de la USP, donde vive el capítulo de medicamentos peligrosos: <a href="https://www.usp.org/compounding">usp.org/compounding</a>',
       'Escribe el procedimiento de un derrame de citostático en cuatro pasos. Empieza por lo primero que harías y termina por el registro. Lo primero casi nunca es limpiar.'),

      -- ══ Asuntos regulatorios ante INVIMA ══════════════════
      ('Asuntos Regulatorios Sanitarios ante INVIMA',
       'Qué es el INVIMA y qué vigila',
       'INVIMA · Portal institucional',
       'https://www.invima.gov.co/',
       'La autoridad sanitaria colombiana: qué productos vigila y qué trámites ofrece.',
       'INVIMA, establecido por la Ley 100 de 1993 y reglamentado por el Decreto 677 de 1995.',
       'OMS, sobre sistemas regulatorios y precalificación: <a href="https://extranet.who.int/prequal/">extranet.who.int/prequal</a>',
       'Recorre el portal y anota cinco trámites distintos que ofrece. Para cada uno, di qué tipo de producto cubre. Es el mapa que vas a usar todo el curso.'),

      ('Asuntos Regulatorios Sanitarios ante INVIMA',
       'Cómo se clasifica un producto',
       'Decreto 677 de 1995 · Ámbito de aplicación',
       'https://www.minsalud.gov.co/Normatividad_Nuevo/DECRETO%200677%20DE%201995.pdf',
       'Qué es medicamento y qué no, y por qué de esa definición depende todo el trámite.',
       'Decreto 677 de 1995. Clasificar mal un producto puede costar meses de trámite.',
       'EMA, para comparar cómo clasifica otro sistema: <a href="https://www.ema.europa.eu/en/human-regulatory-overview/research-development/compliance-research-development/good-manufacturing-practice">ema.europa.eu</a>',
       'Toma tres productos reales de una droguería y clasifícalos: medicamento, fitoterapéutico, suplemento o cosmético. Di qué dato del envase te permitió decidir.'),

      ('Asuntos Regulatorios Sanitarios ante INVIMA',
       'El Decreto 677 de 1995 y sus actualizaciones',
       'Decreto 677 de 1995 · Régimen de registros sanitarios',
       'https://www.minsalud.gov.co/Normatividad_Nuevo/DECRETO%200677%20DE%201995.pdf',
       'La estructura completa de la norma: títulos, capítulos y dónde buscar cada cosa.',
       'Decreto 677 de 1995, con sus modificaciones posteriores.',
       'Resolución 1160 de 2016, sobre las BPM que exige el registro: <a href="https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%201160%20de%202016.pdf">minsalud.gov.co</a>',
       'Haz un índice de una página del Decreto 677: qué resuelve cada título. Guárdalo, porque es a lo que vas a volver cada vez que surja una duda.'),

      ('Asuntos Regulatorios Sanitarios ante INVIMA',
       'Qué lleva el expediente',
       'Decreto 677 de 1995 · Requisitos del registro sanitario',
       'https://www.minsalud.gov.co/Normatividad_Nuevo/DECRETO%200677%20DE%201995.pdf',
       'Documentación legal, técnica y de calidad que exige el expediente.',
       'Decreto 677 de 1995. El certificado de BPM del fabricante se rige por la Resolución 1160 de 2016.',
       'OMS, precalificación, para ver qué pide un dossier internacional: <a href="https://extranet.who.int/prequal/">extranet.who.int/prequal</a>',
       'Arma la lista de verificación de un expediente y marca qué documento depende de un tercero (fabricante, laboratorio, traductor). Esos son los que marcan el calendario real.'),

      ('Asuntos Regulatorios Sanitarios ante INVIMA',
       'Evaluación farmacológica y farmacéutica',
       'Decreto 677 de 1995 · Evaluaciones',
       'https://www.minsalud.gov.co/Normatividad_Nuevo/DECRETO%200677%20DE%201995.pdf',
       'Las dos evaluaciones, qué mira cada una y cuándo aplica cada cual.',
       'Decreto 677 de 1995. La farmacológica mira el principio activo; la farmacéutica, la calidad del producto propuesto.',
       'EMA, procedimientos de evaluación: <a href="https://www.ema.europa.eu/en/human-regulatory-overview/research-development/compliance-research-development/good-manufacturing-practice">ema.europa.eu</a>',
       'Para un principio activo nuevo en Colombia y para uno ya conocido, di qué evaluación aplica a cada uno y por qué. Confundirlas es radicar un trámite incompleto.'),

      ('Asuntos Regulatorios Sanitarios ante INVIMA',
       'Requerimientos y cómo responderlos',
       'INVIMA · Trámites y servicios',
       'https://www.invima.gov.co/',
       'Dónde se consulta el estado de un trámite y cómo se radica una respuesta.',
       'Decreto 677 de 1995 y los actos administrativos del INVIMA fijan los plazos.',
       'Resolución 1160 de 2016: <a href="https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%201160%20de%202016.pdf">minsalud.gov.co</a>',
       'Escribe la respuesta a un requerimiento ficticio: una sola página, con la pregunta citada, la respuesta y la referencia al documento del expediente donde está la prueba.'),

      ('Asuntos Regulatorios Sanitarios ante INVIMA',
       'Modificaciones y renovaciones',
       'Decreto 677 de 1995 · Modificaciones al registro',
       'https://www.minsalud.gov.co/Normatividad_Nuevo/DECRETO%200677%20DE%201995.pdf',
       'Qué cambios exigen aprobación previa, cuáles solo aviso, y cuándo vence el registro.',
       'Decreto 677 de 1995, capítulo de modificaciones y renovaciones.',
       'EMA, sobre variaciones post-autorización: <a href="https://www.ema.europa.eu/en/human-regulatory-overview/post-authorisation/pharmacovigilance-post-authorisation">ema.europa.eu</a>',
       'Haz dos columnas: cambios que requieren aprobación previa y cambios que solo requieren aviso. Pon tres ejemplos en cada una. El error caro es poner uno en la columna equivocada.'),

      ('Asuntos Regulatorios Sanitarios ante INVIMA',
       'Farmacovigilancia y poscomercialización',
       'INVIMA · Programa Nacional de Farmacovigilancia',
       'https://www.invima.gov.co/farmacovigilancia',
       'Las obligaciones que empiezan cuando se obtiene el registro, no cuando se pide.',
       'Programa Nacional de Farmacovigilancia del INVIMA.',
       'OMS, farmacovigilancia: <a href="https://www.who.int/teams/regulation-prequalification/regulation-and-safety/pharmacovigilance">who.int</a>',
       'Describe qué haría el titular de un registro ante una señal de seguridad: desde que llega el primer reporte hasta la decisión. Marca en qué punto entra el INVIMA.'),

      ('Asuntos Regulatorios Sanitarios ante INVIMA',
       'Publicidad, visitas y sanciones',
       'Decreto 677 de 1995 · Publicidad y régimen sancionatorio',
       'https://www.minsalud.gov.co/Normatividad_Nuevo/DECRETO%200677%20DE%201995.pdf',
       'Qué se puede afirmar de un producto, cómo se verifica y qué consecuencias tiene incumplir.',
       'Decreto 677 de 1995, títulos de publicidad y de sanciones.',
       'INVIMA, portal institucional, donde se publican las medidas sanitarias: <a href="https://www.invima.gov.co/">invima.gov.co</a>',
       'Busca una pieza publicitaria real de un medicamento y señala qué afirmaciones tendrían que estar respaldadas en el registro. Si alguna no lo estaría, ya encontraste el problema.')

    ) AS t(curso, clase, doc_titulo, doc_url, doc_desc, norma, lectura, actividad)
  LOOP
    SELECT l.id INTO v_clase
      FROM aula_lessons l
      JOIN aula_courses c ON c.id = l.course_id
     WHERE c.title = r.curso AND c.kind = 'edvanta' AND c.deleted_at IS NULL
       AND l.title = r.clase AND l.deleted_at IS NULL
     LIMIT 1;

    IF v_clase IS NULL THEN
      RAISE NOTICE 'Clase no encontrada: % / %', r.curso, r.clase;
      CONTINUE;
    END IF;

    IF EXISTS (SELECT 1 FROM aula_lesson_blocks b
                WHERE b.lesson_id = v_clase AND b.type = 'enlace' AND b.deleted_at IS NULL) THEN
      CONTINUE;
    END IF;

    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES
      (v_clase, 'enlace', 1, jsonb_build_object(
        'url', r.doc_url, 'title', r.doc_titulo, 'description', r.doc_desc)),
      (v_clase, 'destacado', 2, jsonb_build_object(
        'tone', 'info', 'title', 'Norma aplicable',
        'html', '<p>' || r.norma || '</p><p><strong>Lectura complementaria:</strong> ' || r.lectura || '</p>')),
      (v_clase, 'destacado', 3, jsonb_build_object(
        'tone', 'consejo', 'title', 'Actividad',
        'html', '<p>' || r.actividad || '</p>'));
  END LOOP;

  RAISE NOTICE 'BPE, Central de mezclas y Asuntos regulatorios enriquecidos.';
END $$;
