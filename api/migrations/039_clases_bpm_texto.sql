-- ============================================================
--  039_clases_bpm_texto.sql — Las nueve clases de BPM, escritas
--
--  Hasta ahora cada clase tenía un párrafo de apoyo. Esto lo
--  reemplaza por la clase completa en texto: la explicación que
--  daría el docente, con sus subtítulos, sus ejemplos y el cierre
--  que lleva a la actividad.
--
--  Se escribe en texto porque el video no existe. Una clase escrita
--  que se entiende vale más que un video que no se puede verificar.
--
--  Reemplaza el bloque de texto que ya estaba (sort_order 0), no
--  agrega otro: dos textos seguidos se leerían como repetición.
-- ============================================================

DO $$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
  r RECORD;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta'
     AND title = 'Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica'
     AND deleted_at IS NULL
   LIMIT 1;

  IF v_curso IS NULL THEN
    RAISE NOTICE 'El curso de BPM no existe: se omite.';
    RETURN;
  END IF;

  FOR r IN
    SELECT * FROM (VALUES

('Qué son las BPM y qué problema resuelven',
'<p>Empecemos por una idea incómoda: <strong>la calidad de un medicamento no se puede comprobar del todo analizando el producto terminado</strong>.</p>
<p>Piensa en un lote de un millón de tabletas. Al laboratorio de control llegan, digamos, veinte. Si esas veinte cumplen, el lote se libera. Pero esas veinte no saben nada de las 999.980 restantes. Si la mezcla no fue homogénea, si una tolva quedó con residuo del producto anterior, si el operario de turno saltó un paso porque iba tarde, nada de eso aparece necesariamente en la muestra.</p>
<p>Peor aún: hay atributos que el análisis <em>no puede</em> ver. La esterilidad es el ejemplo clásico. Para demostrar que un lote es estéril analizando el producto habría que analizarlo entero, y entonces no quedaría nada que vender. La esterilidad no se comprueba: se construye.</p>
<h3>De ahí nacen las BPM</h3>
<p>Las Buenas Prácticas de Manufactura desplazan el control hacia el proceso. En vez de preguntar «¿salió bien?» al final, preguntan «¿se hizo de una manera que no pudiera salir mal?» en cada paso.</p>
<p>Eso cambia todo. Si la calidad se construye durante el proceso, entonces importan cosas que antes parecían administrativas:</p>
<ul>
<li>Quién hizo cada cosa, y si estaba formado para hacerla.</li>
<li>Con qué equipo, y si ese equipo estaba calibrado.</li>
<li>Con qué materia prima, y de qué lote venía.</li>
<li>En qué condiciones de área, temperatura y limpieza.</li>
<li>Y sobre todo: <strong>si quedó escrito</strong>.</li>
</ul>
<h3>La frase que resume el oficio</h3>
<blockquote><p>Lo que no está escrito, no ocurrió.</p></blockquote>
<p>Suena burocrático hasta que entiendes por qué. Si un paciente reporta una reacción adversa dentro de dos años, la empresa tiene que poder reconstruir ese lote: qué materia prima entró, quién lo fabricó, qué equipos se usaron, si hubo alguna desviación. Sin registros, esa reconstrucción es imposible y el lote entero queda bajo sospecha.</p>
<h3>Lo que las BPM no son</h3>
<p>No son un manual de calidad opcional ni una certificación de marketing. Son <strong>requisito legal</strong> para fabricar medicamentos, y su incumplimiento puede cerrar una planta. Tampoco son lo mismo que el registro sanitario: las BPM dicen <em>cómo se fabrica</em>, el registro dice <em>qué producto tiene permiso de venderse</em>. Lo verás con detalle en las dos clases siguientes.</p>
<h3>Antes de seguir</h3>
<p>La actividad de esta clase te pide escribir por qué analizar el producto terminado no basta. Hazla con un ejemplo real que conozcas: un jarabe, una crema, una ampolla. El ejercicio no es repetir lo que acabas de leer, sino encontrarlo tú en un producto concreto.</p>'),

('El marco normativo en Colombia',
'<p>En Colombia las BPM se exigen por la <strong>Resolución 1160 de 2016</strong>, que adopta dos manuales: el de Buenas Prácticas de Manufactura y el de autoinspección. Esa resolución es la que cita el inspector cuando llega a una planta.</p>
<h3>De dónde viene</h3>
<p>La Resolución 1160 no se inventó en Colombia. Recoge el <strong>Informe 32 de la OMS</strong>, publicado en la Serie de Informes Técnicos 823 y actualizado después en la 986. Ese informe es la referencia internacional de la que descienden casi todas las BPM del mundo.</p>
<p>Eso tiene una consecuencia práctica muy útil: si entiendes el Informe 32, entiendes el 90 % de la norma colombiana. Y si algún día trabajas con una planta europea o con una auditoría PIC/S, el vocabulario es el mismo.</p>
<h3>La confusión más común</h3>
<p>Mucha gente mezcla dos normas que regulan cosas distintas:</p>
<ul>
<li><strong>Resolución 1160 de 2016</strong> — cómo se fabrica. Aplica a la planta, a sus áreas, a su personal y a sus procesos.</li>
<li><strong>Decreto 677 de 1995</strong> — qué permiso necesita el producto para venderse. Aplica al registro sanitario de cada medicamento.</li>
</ul>
<p>Una planta puede cumplir BPM impecablemente y vender un producto sin registro: eso es ilegal. Y un producto puede tener registro vigente fabricado en una planta que perdió su certificación: eso también es un problema. Son dos controles distintos sobre el mismo medicamento.</p>
<h3>Cómo leer la norma sin perderte</h3>
<p>La Resolución 1160 es larga. Un orden que funciona:</p>
<ol>
<li>Lee primero el <strong>articulado</strong> de la resolución, que es corto y dice a quién obliga y desde cuándo.</li>
<li>Después ve al <strong>manual de BPM</strong>, que es el anexo técnico y está organizado por capítulos: personal, instalaciones, equipos, documentación, producción, control de calidad.</li>
<li>Deja el <strong>manual de autoinspección</strong> para el final: es la lista con la que la planta se evalúa a sí misma, y se entiende mejor cuando ya sabes qué exige el manual anterior.</li>
</ol>
<h3>Una advertencia sobre las versiones</h3>
<p>Las normas sanitarias se modifican. Antes de citar un artículo en un documento de trabajo, comprueba en el portal del Ministerio de Salud o en el normograma del INVIMA que sigue vigente y que no lo modificó una resolución posterior. Citar una norma derogada en un expediente es un error que se nota.</p>
<h3>Antes de seguir</h3>
<p>La actividad te pide localizar el artículo que define a quién se le exige el certificado de BPM. Búscalo tú en el PDF: el ejercicio real es aprender a moverte dentro de una norma larga, porque eso es lo que vas a hacer el resto de tu carrera.</p>'),

('A quién obligan y qué certifica el INVIMA',
'<p>El certificado de BPM lo emite el <strong>INVIMA</strong> después de una visita a la planta. Pero hay un detalle que se malinterpreta constantemente y que conviene fijar desde ahora.</p>
<h3>Se certifica la línea, no la empresa</h3>
<p>La certificación no se otorga a «Laboratorios X». Se otorga a <strong>una línea de producción concreta de una planta concreta</strong>.</p>
<p>Por eso una misma empresa puede estar certificada para sólidos orales y no para inyectables. O tener certificada su planta de Bogotá y no la de Cali. O estar certificada para líquidos no estériles y haber perdido la certificación de estériles tras una visita.</p>
<p>Cuando alguien dice «ese laboratorio está certificado en BPM», la pregunta correcta es: <em>¿para qué línea?</em></p>
<h3>Por qué funciona así</h3>
<p>Porque los riesgos son distintos. Fabricar una tableta y fabricar una solución inyectable no se parecen en nada: cambian las áreas, el aire, el agua, la validación del proceso, la formación del personal y los controles. Certificar a la empresa entera por haber inspeccionado una línea sería certificar lo que no se vio.</p>
<h3>Qué mira el INVIMA en la visita</h3>
<p>La visita se apoya en el manual de autoinspección de la Resolución 1160. El inspector no viene a hacer preguntas de memoria: viene a <strong>pedir evidencia</strong>. La diferencia es importante.</p>
<ul>
<li>No pregunta «¿capacitan al personal?». Pide los registros de capacitación con fechas y firmas.</li>
<li>No pregunta «¿calibran los equipos?». Pide el programa de calibración y el certificado del último.</li>
<li>No pregunta «¿tienen procedimientos?». Pide el procedimiento, comprueba su versión vigente y luego mira si el operario lo está siguiendo.</li>
</ul>
<p>De ahí sale el principio que vas a oír toda tu vida profesional: <strong>lo que no se puede demostrar con un documento, para efectos de la inspección no existe</strong>.</p>
<h3>Qué pasa si hay hallazgos</h3>
<p>Casi toda visita deja hallazgos. Lo que decide el resultado es su gravedad y qué hace la planta con ellos. Un hallazgo crítico puede impedir la certificación; uno menor se responde con un plan de cumplimiento, con responsable y fecha. Lo que no se perdona es el hallazgo repetido: significa que el plan anterior no se cumplió.</p>
<h3>Antes de seguir</h3>
<p>La actividad te pide averiguar para qué líneas está certificada una planta que conozcas. Si no encuentras la información pública, anota qué te faltó: esa dificultad también es parte del aprendizaje, porque la transparencia regulatoria varía y saber dónde buscar es una competencia en sí misma.</p>'),

('Personal, higiene y capacitación',
'<p>La fuente de contaminación más frecuente en una planta farmacéutica no es el equipo ni el aire: <strong>somos nosotros</strong>.</p>
<p>Una persona desprende millones de partículas por minuto solo con moverse. Piel, cabello, saliva, fibras de ropa. En un área donde se fabrica un producto estéril, esa persona es el mayor riesgo del cuarto. Todo lo que las BPM exigen sobre personal sale de ahí.</p>
<h3>Vestimenta: qué evita cada prenda</h3>
<p>Las reglas de vestimenta parecen arbitrarias hasta que entiendes qué contiene cada una:</p>
<ul>
<li><strong>El gorro</strong> contiene el cabello y las partículas del cuero cabelludo, que es de las zonas que más desprende.</li>
<li><strong>El tapabocas</strong> contiene las gotas de saliva al hablar, que llevan carga microbiana.</li>
<li><strong>El overol de cuerpo entero</strong> contiene las fibras de la ropa de calle y las partículas de la piel.</li>
<li><strong>Las cubrezapatos</strong> impiden que el piso de afuera entre al área.</li>
<li><strong>Los guantes</strong> protegen el producto de tus manos, no tus manos del producto. Por eso se desinfectan y se cambian.</li>
</ul>
<p>Cuando alguien se baja el tapabocas para hablar por teléfono dentro de un área limpia, no está rompiendo una regla: está contaminando un producto.</p>
<h3>Capacitación documentada</h3>
<p>Las BPM no piden «que el personal sepa». Piden que se pueda <strong>demostrar</strong> que sabe. Eso significa:</p>
<ul>
<li>Un programa de formación, con contenidos definidos por cargo.</li>
<li>Registros de asistencia con fecha y firma.</li>
<li>Una evaluación que demuestre que el contenido se entendió.</li>
<li>Reentrenamiento periódico, y también cada vez que cambia un procedimiento.</li>
</ul>
<p>Una capacitación sin evaluación es una reunión. Para el inspector, no prueba nada.</p>
<h3>Salud e higiene</h3>
<p>Se exigen exámenes médicos de ingreso y periódicos, y un procedimiento claro para cuando alguien llega enfermo. Esto no es control sobre la persona: una infección respiratoria o una lesión abierta en la piel cambian la carga microbiana que esa persona aporta al área.</p>
<p>El punto delicado es cultural. Si reportar que estás enfermo te cuesta el día de trabajo, nadie reporta. La norma funciona solo si la empresa hace que reportar sea seguro.</p>
<h3>Circulación</h3>
<p>No todo el mundo entra a todas partes. El acceso se restringe por área y por función, y la entrada pasa por esclusas donde se cambia la vestimenta. El flujo está diseñado para que una persona no lleve, sobre su cuerpo, la contaminación de un área a otra.</p>
<h3>Antes de seguir</h3>
<p>La actividad te pide elegir tres reglas de vestimenta y explicar qué contaminación evita cada una. Si alguna no sabes qué evita, márcala: suele ser señal de que se copió de otro manual sin entenderla, y esas son las primeras que la gente se salta.</p>'),

('Instalaciones, áreas y equipos',
'<p>El diseño de una planta farmacéutica es una herramienta de calidad. No es arquitectura: es una decisión técnica sobre qué puede tocar qué.</p>
<h3>El problema que resuelve: la contaminación cruzada</h3>
<p>Si en la misma planta se fabrica un antibiótico y un analgésico, hay que garantizar que ni un microgramo del primero llegue al segundo. Un paciente alérgico a la penicilina puede reaccionar a trazas. Por eso ciertos productos —penicilínicos, cefalosporínicos, citostáticos, hormonas— exigen áreas dedicadas, no compartidas.</p>
<h3>Los tres flujos</h3>
<p>En una planta bien diseñada se trazan tres recorridos y se procura que no se crucen:</p>
<ul>
<li><strong>Personal</strong>: dónde entra, por dónde se cambia, a qué áreas accede.</li>
<li><strong>Materiales</strong>: por dónde entra la materia prima, dónde se despacha el producto.</li>
<li><strong>Residuos</strong>: por dónde sale lo que se descarta.</li>
</ul>
<p>Cada cruce entre dos flujos es un riesgo. Cuando el cruce no se puede evitar por limitaciones del edificio, se resuelve con un procedimiento: separación en el tiempo, limpieza entre un paso y otro, contenedores cerrados. Pero resolverlo con un procedimiento siempre es peor que resolverlo con el diseño, porque un procedimiento depende de que alguien lo cumpla.</p>
<h3>Presiones diferenciales y esclusas</h3>
<p>El aire se mueve de donde hay más presión a donde hay menos. Eso se usa a favor:</p>
<ul>
<li>En un área <strong>estéril</strong>, la presión es mayor que la del pasillo: si se abre una puerta, el aire sale y empuja los contaminantes hacia afuera.</li>
<li>En un área de <strong>producto peligroso</strong>, la presión es menor: si se abre una puerta, el aire entra y el polvo del citostático no escapa.</li>
</ul>
<p>Las esclusas son los cuartos intermedios donde esa diferencia se sostiene y donde se cambia la vestimenta. Si las dos puertas de una esclusa se abren a la vez, la esclusa deja de servir. Por eso muchas tienen enclavamiento.</p>
<h3>Equipos</h3>
<p>Un equipo no sirve porque funcione. Tiene que estar <strong>calificado</strong>: demostrar que está bien instalado, que opera dentro de sus parámetros y que rinde lo que debe. Eso es el DQ, IQ, OQ y PQ que verás a fondo en el curso de validaciones.</p>
<p>Además necesita mantenimiento preventivo programado, calibración de sus instrumentos críticos, y un procedimiento de limpieza validado entre productos. Un equipo bien calificado pero mal limpiado sigue siendo una vía de contaminación cruzada.</p>
<h3>Antes de seguir</h3>
<p>La actividad te pide dibujar el flujo de personal y el de materiales de un área que conozcas y marcar dónde se cruzan. Cada cruce que encuentres es un riesgo que alguien tuvo que resolver con un procedimiento: búscalo y mira si de verdad existe.</p>'),

('Documentación: lo que no está escrito no ocurrió',
'<p>Esta es la clase que más gente subestima y la que más hallazgos genera en una inspección.</p>
<h3>Por qué el documento es el producto</h3>
<p>Un lote de medicamento sale de la planta y se pierde de vista. Lo único que queda en la empresa es su <strong>expediente de lote</strong>. Si dentro de dos años hay que investigar ese lote, ese expediente es el lote: lo que no esté ahí, no se puede reconstruir.</p>
<p>De ahí que la documentación no sea el soporte del trabajo, sino parte del trabajo.</p>
<h3>Los documentos que vas a manejar</h3>
<ul>
<li><strong>Procedimientos normalizados (PNO o SOP)</strong>: cómo se hace cada cosa. Tienen versión, fecha de vigencia y aprobación.</li>
<li><strong>Fórmula maestra</strong>: la receta oficial del producto, con cantidades y proceso.</li>
<li><strong>Registro de fabricación de lote</strong>: lo que realmente pasó con <em>ese</em> lote, llenado durante el proceso.</li>
<li><strong>Especificaciones</strong>: qué debe cumplir cada materia prima, material y producto.</li>
<li><strong>Certificados de análisis</strong>: qué dio el control de calidad.</li>
</ul>
<h3>ALCOA+: cómo debe ser un dato</h3>
<p>El criterio con el que un inspector juzga un registro cabe en un acrónimo:</p>
<ul>
<li><strong>A</strong>tribuible: se sabe quién lo escribió.</li>
<li><strong>L</strong>egible: se puede leer, y lo seguirá siendo dentro de años.</li>
<li><strong>C</strong>ontemporáneo: se escribió cuando ocurrió, no al final del turno.</li>
<li><strong>O</strong>riginal: es el registro primero, no una transcripción.</li>
<li><strong>E</strong>xacto: refleja lo que pasó, incluso cuando lo que pasó fue un error.</li>
</ul>
<p>El «+» añade completo, consistente, perdurable y disponible.</p>
<h3>Los errores que cuestan caro</h3>
<p>Son casi siempre los mismos, y todos parecen inocentes:</p>
<ul>
<li><strong>Corrector o tachón que oculta.</strong> Un error se corrige con una línea que deje leer lo anterior, la corrección, la fecha y la firma. Tapar un dato es alterar un registro.</li>
<li><strong>Llenar al final del turno.</strong> Rompe el «contemporáneo». Y si el registro se llena de memoria, deja de ser exacto.</li>
<li><strong>Firmar por otro.</strong> Rompe el «atribuible» y, dependiendo del caso, es falsedad documental.</li>
<li><strong>Casillas en blanco.</strong> Si algo no aplica, se escribe «N/A». Un espacio vacío no se distingue de un paso olvidado.</li>
<li><strong>Usar lápiz.</strong> Permite borrar sin dejar rastro.</li>
</ul>
<h3>Registros electrónicos</h3>
<p>Si el registro es electrónico, aparecen requisitos nuevos: usuarios individuales (nada de una clave compartida por el turno), <em>audit trail</em> que registre quién cambió qué y cuándo, y copias de respaldo. Un sistema donde todos entran con el mismo usuario no cumple «atribuible», aunque sea moderno.</p>
<h3>Antes de seguir</h3>
<p>La actividad te pide señalar tres puntos de un registro donde se podría perder la integridad del dato. Piensa en el turno de la noche, en el operario nuevo y en el día en que se dañó la impresora: ahí es donde los sistemas documentales se rompen de verdad.</p>'),

('Desviaciones, cambios y CAPA',
'<p>Toda planta tiene desviaciones. Una planta que reporta cero desviaciones no es una planta perfecta: es una planta que no las está reportando, y eso es mucho peor.</p>
<h3>Qué es una desviación</h3>
<p>Cualquier apartamiento de lo establecido: un parámetro fuera de rango, un paso que se saltó, un resultado inesperado, un equipo que falló a mitad de proceso. Puede ser menor o crítica, pero todas se documentan.</p>
<h3>El circuito completo</h3>
<ol>
<li><strong>Detectar y contener.</strong> Lo primero no es investigar: es evitar que el producto afectado avance. Se identifica, se segrega, se detiene.</li>
<li><strong>Documentar.</strong> Qué pasó, cuándo, en qué lote, quién lo detectó.</li>
<li><strong>Evaluar el impacto.</strong> ¿Afecta a este lote? ¿A otros? ¿A lotes ya distribuidos?</li>
<li><strong>Investigar la causa raíz.</strong> La parte que más se hace mal.</li>
<li><strong>Definir acciones.</strong> Correctivas y preventivas.</li>
<li><strong>Verificar que sirvieron.</strong> Una acción que nadie comprueba no es una acción.</li>
</ol>
<h3>Causa raíz: el error típico</h3>
<p>«El operario se equivocó» casi nunca es una causa raíz. Es donde se detuvo la investigación.</p>
<p>Si preguntas por qué varias veces, normalmente aparece otra cosa: el procedimiento era ambiguo, el operario no había sido reentrenado tras el último cambio, el equipo no avisaba del error, la etiqueta de dos materias primas era casi idéntica. <strong>Esas sí son causas raíz, porque se pueden corregir.</strong> «Que tenga más cuidado» no corrige nada.</p>
<h3>Correctiva y preventiva no son lo mismo</h3>
<ul>
<li><strong>Correctiva</strong>: elimina la causa de lo que <em>ya pasó</em>. Reescribir el procedimiento ambiguo.</li>
<li><strong>Preventiva</strong>: evita que pase donde <em>todavía no ha pasado</em>. Revisar los otros procedimientos que tienen la misma ambigüedad.</li>
</ul>
<p>La mayoría de los sistemas de calidad son buenos en lo correctivo y flojos en lo preventivo, porque lo preventivo exige mirar donde aún no duele.</p>
<h3>Control de cambios</h3>
<p>Es el mecanismo que evita que una mejora bienintencionada rompa algo validado.</p>
<p>Cambiar un proveedor de excipiente, mover un equipo, actualizar un software, modificar un parámetro: todo eso pasa por una evaluación previa que responde qué impacto tiene sobre el producto, sobre la validación y sobre el registro sanitario. Un cambio que parecía menor puede obligar a revalidar un proceso o a tramitar una modificación ante el INVIMA.</p>
<h3>Antes de seguir</h3>
<p>La actividad te pide llevar una desviación hasta la causa raíz preguntando «por qué» cinco veces, y luego separar la acción correctiva de la preventiva. Si las dos te salen iguales, todavía no has separado lo que pasó de lo que podría pasar.</p>'),

('Autoinspección y gestión de riesgos',
'<p>La autoinspección es la auditoría que la planta se hace a sí misma, con el mismo instrumento que usará el inspector. La Resolución 1160 de 2016 trae su propio manual para eso.</p>
<h3>Para qué sirve de verdad</h3>
<p>No para prepararse una semana antes de la visita. Para encontrar los problemas <strong>cuando todavía se pueden arreglar sin consecuencias</strong>.</p>
<p>Una autoinspección honesta encuentra hallazgos. Si la tuya nunca encuentra nada, no estás auditando: estás firmando un papel. Y el inspector externo sí los va a encontrar, solo que entonces tendrán nombre de hallazgo oficial.</p>
<h3>Cómo se hace bien</h3>
<ul>
<li><strong>La hace alguien que no sea responsable del área.</strong> Nadie audita bien su propio trabajo.</li>
<li><strong>Se programa</strong>, con una frecuencia definida y cubriendo todas las áreas en un ciclo.</li>
<li><strong>Se pide evidencia</strong>, igual que el inspector: no se pregunta, se verifica.</li>
<li><strong>Se cierra</strong> con un plan de acción con responsable y fecha, y alguien comprueba después que se cumplió.</li>
</ul>
<h3>Gestión de riesgos: dónde poner el esfuerzo</h3>
<p>Una planta no puede tratarlo todo como igual de crítico. Si lo intenta, acaba dedicando el mismo tiempo a validar la limpieza de un tanque de producto estéril que a revisar el inventario de papelería, y ninguna de las dos se hace bien.</p>
<p>La <strong>ICH Q9</strong> propone un método sencillo de entender: para cada riesgo, se estiman dos cosas.</p>
<ul>
<li><strong>Gravedad</strong>: si ocurre, ¿cuánto daño hace al paciente?</li>
<li><strong>Probabilidad</strong>: ¿con qué frecuencia podría ocurrir?</li>
</ul>
<p>A veces se añade una tercera, la <strong>detectabilidad</strong>: si ocurre, ¿nos daríamos cuenta? Un riesgo poco probable pero indetectable puede ser más peligroso que uno frecuente que salta a la vista.</p>
<h3>El uso que cambia las decisiones</h3>
<p>Cuando priorizas por riesgo, las conversaciones cambian. Ya no se discute «hay que hacerlo todo» contra «no hay tiempo», sino <em>qué se hace primero y por qué</em>. Y esa justificación queda escrita, que es lo que permite defenderla ante un inspector o ante la propia dirección cuando pide recortar.</p>
<h3>Antes de seguir</h3>
<p>La actividad te pide ordenar tres procesos por riesgo usando gravedad y probabilidad. Lo valioso no es el orden que te salga, sino la justificación: un orden sin justificación es una opinión, y una opinión no se puede auditar.</p>'),

('Cómo se prepara una visita del INVIMA',
'<p>La idea con la que conviene cerrar este curso: <strong>una visita no se prepara. Se está preparado.</strong></p>
<p>Las plantas que corren la semana anterior a ordenar carpetas son exactamente las que tienen hallazgos, porque lo que se arregla en una semana es la apariencia, no el sistema.</p>
<h3>Qué pide el inspector</h3>
<p>Casi siempre lo mismo, y conviene que esté a mano:</p>
<ul>
<li>Organigrama y hojas de vida del personal clave.</li>
<li>Programa y registros de capacitación.</li>
<li>Planos de la planta con flujos y clasificación de áreas.</li>
<li>Programa de calibración y mantenimiento, con sus certificados.</li>
<li>Listado maestro de procedimientos, con versiones vigentes.</li>
<li>Expedientes de lote de los productos que elija.</li>
<li>Registro de desviaciones, cambios y CAPA, con su estado.</li>
<li>Informes de autoinspección y sus planes de acción.</li>
<li>Validaciones de proceso y de limpieza.</li>
</ul>
<h3>Cómo se comporta un buen anfitrión</h3>
<ul>
<li><strong>Responde lo que se pregunta.</strong> Hablar de más abre puertas que nadie había tocado.</li>
<li><strong>No improvisa.</strong> Si no sabe, dice que lo va a verificar y vuelve con el dato.</li>
<li><strong>No discute el hallazgo en el momento.</strong> Lo entiende, lo documenta y lo responde después por escrito.</li>
<li><strong>No esconde.</strong> Un documento que aparece tarde pesa más que el problema que ocultaba.</li>
</ul>
<h3>Los hallazgos que más se repiten</h3>
<ul>
<li>Registros llenados fuera de tiempo o con casillas en blanco.</li>
<li>Capacitaciones sin evaluación que demuestre comprensión.</li>
<li>Procedimientos vigentes que no coinciden con lo que hace el operario.</li>
<li>Desviaciones cerradas sin causa raíz real.</li>
<li>Acciones correctivas sin verificación de eficacia.</li>
<li><strong>Hallazgos repetidos de la visita anterior.</strong> Este es el más grave: significa que el plan de cumplimiento no se cumplió, y pone en duda todo lo demás que la planta prometa.</li>
</ul>
<h3>Después de la visita</h3>
<p>Los hallazgos se clasifican por gravedad y se responden con un plan de cumplimiento: qué se va a hacer, quién, para cuándo y cómo se demostrará. Un plan con fechas que nadie va a cumplir es peor que pedir más plazo, porque garantiza el hallazgo repetido de la próxima visita.</p>
<h3>Para cerrar el curso</h3>
<p>La actividad final te pide hacer una autoinspección de escritorio con cinco preguntas del manual y marcar cuáles no podrías demostrar con un documento. Esas son, exactamente, tus hallazgos. Y ese ejercicio —preguntarte qué podrías demostrar— es el resumen de todo lo que has visto en estas nueve clases.</p>')

    ) AS t(clase, html)
  LOOP
    SELECT l.id INTO v_clase
      FROM aula_lessons l
     WHERE l.course_id = v_curso AND l.title = r.clase AND l.deleted_at IS NULL
     LIMIT 1;

    IF v_clase IS NULL THEN
      RAISE NOTICE 'Clase no encontrada: %', r.clase;
      CONTINUE;
    END IF;

    -- Reemplaza el párrafo de apoyo por la clase completa.
    UPDATE aula_lesson_blocks
       SET data = jsonb_build_object('html', r.html), updated_at = NOW()
     WHERE lesson_id = v_clase AND type = 'texto' AND deleted_at IS NULL;
  END LOOP;

  RAISE NOTICE 'Las nueve clases de BPM quedaron escritas.';
END $$;
