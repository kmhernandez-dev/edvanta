import { elegir, hash, limpiarCelda, normalizar } from './cursos-blogs-datos.mjs';

const parrafo = (...textos) => textos.filter(Boolean).join('\n\n');
const seccion = (titulo, ...bloques) => `## ${titulo}\n\n${bloques.filter(Boolean).join('\n\n')}`;
const subseccion = (titulo, ...bloques) => `### ${titulo}\n\n${bloques.filter(Boolean).join('\n\n')}`;
const lista = (items) => items.map((item) => `- ${item}`).join('\n');
const numerada = (items) => items.map((item, i) => `${i + 1}. ${item}`).join('\n');
const tabla = (cabeceras, filas) => [
  `| ${cabeceras.join(' | ')} |`,
  `| ${cabeceras.map(() => '---').join(' | ')} |`,
  ...filas.map((fila) => `| ${fila.map(limpiarCelda).join(' | ')} |`),
].join('\n');

const semilla = (p, angulo, extra = '') => `${p.url}:${angulo}:${extra}`;
const variar = (pool, p, angulo, extra = '') => elegir(pool, semilla(p, angulo, extra));

const sinPunto = (texto) => String(texto).replace(/\.$/, '');

const tiempoDeCurso = (p) => {
  if (p.horas) return `unas ${p.horas} horas`;
  return `${p.palabras.toLocaleString('es-CO')} palabras de contenido, además de videos, actividades y evaluaciones`;
};

const clasesUtiles = (p) => {
  const descartar = /^(bienvenida|introducción|introduccion|cierre|evaluación|evaluacion|repaso|resumen del curso)/i;
  const utiles = p.clases.filter((c) => c.titulo && !descartar.test(c.titulo));
  return utiles.length >= 4 ? utiles : p.clases;
};

const muestraClases = (p, cuantas, extra) => {
  const utiles = clasesUtiles(p);
  if (!utiles.length) return [];
  const inicio = hash(semilla(p, 'muestra', extra)) % utiles.length;
  const salto = Math.max(1, Math.floor(utiles.length / Math.max(1, cuantas)));
  const salida = [];
  for (let i = 0; i < utiles.length && salida.length < cuantas; i += 1) {
    salida.push(utiles[(inicio + i * salto) % utiles.length]);
  }
  return [...new Map(salida.map((c) => [c.titulo, c])).values()].slice(0, cuantas);
};

const unidadDe = (p, titulo) => p.unidades.find((u) => u.clases.some((c) => c.titulo === titulo))?.nombre || p.unidades[0]?.nombre || 'la primera unidad';

const detalleClases = (p, cuantas, extra, prompts) => {
  const clases = muestraClases(p, cuantas, extra);
  return clases.map((c, i) => {
    const unidad = unidadDe(p, c.titulo);
    const prompt = prompts[(hash(`${p.url}:${c.titulo}:${extra}`) + i) % prompts.length];
    return `- **${c.titulo}** (unidad “${unidad}”): ${prompt}`;
  }).join('\n');
};

const roles = (p, cuantos = 3, extra = '') => {
  const base = p.areaInfo.roles || [];
  const inicio = hash(semilla(p, 'roles', extra)) % Math.max(1, base.length);
  return Array.from({ length: Math.min(cuantos, base.length) }, (_, i) => base[(inicio + i) % base.length]);
};

const ctaCurso = (p, angulo) => variar([
  `> **Curso recomendado:** [${p.titulo}](${p.url}). La primera unidad es gratis y el certificado se obtiene al completar el curso. Consulta la ficha para el valor y la vigencia.`,
  `> **Para llevarlo a la práctica:** [${p.titulo}](${p.url}). Puedes empezar con la primera unidad gratis; el certificado llega al terminar el curso completo. La ficha tiene el valor actualizado.`,
  `> **Formación relacionada:** [${p.titulo}](${p.url}). Primera unidad gratis, certificado al completar y acceso desde el aula virtual. Revisa la ficha antes de inscribirte.`,
  `> **Curso de Edvanta:** [${p.titulo}](${p.url}). Empieza por la primera unidad sin costo y obtén el certificado cuando completes el programa. El valor vigente está en la ficha.`,
], p, angulo);

const cierre = (p, angulo, ctx) => {
  const hermanos = (ctx?.hermanos || []).filter((h) => h.slug !== ctx?.slugActual).slice(0, 3);
  const relacionadas = hermanos.length
    ? parrafo('También te puede servir:', lista(hermanos.map((h) => `[${h.tituloCorto}](${h.ruta})`)))
    : '';
  return seccion(
    'Siguiente paso',
    variar([
      `Si quieres estudiar ${p.tema} con una ruta ordenada, revisa la ficha de [${p.titulo}](${p.url}) y empieza por la primera unidad. Antes de inscribirte, confirma el valor, la vigencia y las condiciones del certificado en la página del curso.`,
      `La forma más rápida de saber si el curso encaja contigo es ver la primera unidad y el temario completo en [${p.titulo}](${p.url}). Allí están el nivel, la duración y las condiciones actuales.`,
      `Si tu objetivo es aplicar ${p.tema} en el trabajo, el siguiente paso es revisar [${p.titulo}](${p.url}), comparar el temario con tu necesidad y reservar un bloque fijo de estudio en la semana.`,
    ], p, angulo),
    relacionadas,
    p.esSalud
      ? '> Contenido educativo. No sustituye la valoración clínica ni indica dosis, cambios de tratamiento o decisiones que correspondan al equipo tratante.'
      : '> Contenido educativo sobre formación profesional. Verifica siempre los requisitos y las condiciones vigentes en la ficha del curso.',
  );
};

const contextoCurso = (p, angulo) => {
  const c = muestraClases(p, 3, `contexto-${angulo}`);
  const primera = p.unidades[0]?.nombre;
  const segunda = p.unidades[1]?.nombre;
  return variar([
    c[0] && c[1] && c[2]
      ? `El curso se juega en clases concretas como “${c[0].titulo}”, “${c[1].titulo}” y “${c[2].titulo}”. Ahí se ve si el aprendizaje queda en definiciones o se convierte en una decisión que puedes sostener.`
      : `El curso conecta ${primera || 'la primera unidad'} con tareas reales de ${p.areaInfo.etiqueta}.`,
    c[0] && c[1]
      ? `Dentro del temario, “${c[0].titulo}” y “${c[1].titulo}” son buenos ejemplos de lo que significa aplicar ${p.tema}: no basta con repetir el concepto, hay que resolver un caso.`
      : `Aplicar ${p.tema} exige resolver un caso, no repetir el concepto.`,
    c[0] && segunda
      ? `La ruta incluye “${c[0].titulo}” y conecta “${primera || 'la primera unidad'}” con “${segunda}”. Ese es el hilo que conviene seguir al estudiar.`
      : `La ruta conecta las unidades con situaciones de trabajo de ${p.areaInfo.etiqueta}.`,
  ], p, angulo, 'contexto-curso');
};

const introduccion = (p, angulo) => {
  const contexto = variar(p.areaInfo.contexto, p, angulo, 'intro');
  const puente = variar([
    `Este artículo no repite el curso: lo desarma para que veas qué contiene, cómo estudiarlo y qué puedes hacer con lo aprendido. El curso recomendado es [${p.titulo}](${p.url}), de Edvanta.`,
    `La guía se apoya en las ${p.nUnidades} unidades y ${p.nClases} clases de [${p.titulo}](${p.url}). Sirve para decidir con información y para estudiar con un plan, no para llenar una página con adjetivos.`,
    `Para escribirla se revisaron el temario, el nivel y el público declarados de [${p.titulo}](${p.url}). No hay precios inventados ni fechas que el curso no pueda sostener.`,
  ], p, angulo, 'puente');
  return parrafo(contexto, contextoCurso(p, angulo), puente);
};

const tablaUnidades = (p) => tabla(
  ['Unidad', 'Clases', 'Qué mirar primero'],
  p.unidades.slice(0, 8).map((u) => [
    u.nombre,
    String(u.clases.length),
    u.clases[Math.min(1, u.clases.length - 1)]?.titulo || u.nombre,
  ]),
);

const faq = (p, angulo, preguntas) => seccion(
  'Preguntas frecuentes',
  preguntas.map(([q, a]) => subseccion(q, a)).join('\n\n'),
);

const respuestaNivel = (p) => `El curso se declara de nivel ${p.nivel} y está dirigido a ${p.publico}. Si vienes de otra área, conviene revisar antes ${variar(p.areaInfo.antes, p, 'nivel')}.`;
const respuestaTiempo = (p) => `El contenido incluye ${p.nClases} clases en ${p.nUnidades} unidades. La ficha declara ${tiempoDeCurso(p)}. A tres sesiones por semana, la mayoría termina en cuatro a seis semanas, sin contar el repaso.`;
const respuestaCertificado = (p) => `El curso hace parte del aula virtual de Edvanta. La primera unidad es gratis y el certificado se obtiene al completar el programa. Las condiciones y el valor vigente están en [la ficha](${p.url}); no conviene guiarse por capturas o mensajes antiguos.`;
const respuestaUtilidad = (p) => `Sirve para ${sinPunto(p.areaInfo.aplica[hash(semilla(p, 'utilidad')) % p.areaInfo.aplica.length])}. No reemplaza la experiencia supervisada ni la formación de base, pero ordena el criterio y te da un lenguaje común con el equipo.`;

const PROMPTS_ESTUDIO = [
  'Antes de abrirla, escribe qué esperas resolver. Al terminar, responde en dos frases sin mirar el material.',
  'Convierte la clase en una pregunta propia y anota la respuesta con un ejemplo de tu trabajo.',
  'Haz un esquema de tres columnas: concepto, ejemplo y error frecuente.',
  'Explica la idea central a alguien que no conoce el tema y registra dónde te trabaste.',
  'Resume la clase en cinco líneas y añade una tarea que puedas hacer esta semana.',
  'Dibuja el proceso o la relación principal y marca el paso que más se falla.',
  'Escribe dos preguntas de evaluación sobre esta clase y respóndelas justificando cada opción.',
  'Busca una decisión concreta que puedas tomar mañana con lo que enseña esta clase.',
];
const PROMPTS_APLICACION = [
  'Identifica una tarea de tu puesto que se relacione con esta clase y describe cómo la harías distinto.',
  'Escribe un correo, una nota o una instrucción breve usando el criterio de la clase.',
  'Prepara un ejemplo de una frase para una entrevista o una evaluación de desempeño.',
  'Señala qué evidencia dejarías si aplicaras esta clase en un caso real.',
  'Explica qué riesgo se reduce cuando esta clase se aplica bien.',
  'Piensa en un caso donde esta clase no baste y anota a quién habría que consultar.',
  'Adapta la idea a un contexto con recursos limitados y registra qué cambiarías.',
  'Diseña una pregunta de verificación para comprobar que otra persona entendió la clase.',
];
const PROMPTS_ERRORES = [
  'El error típico es quedarse en la definición y no probar la idea con un caso. Corrígelo produciendo un ejemplo propio.',
  'Se falla cuando se copia el formato sin entender el criterio. Vuelve a la clase y escribe el porqué en una frase.',
  'El atajo peligroso es memorizar sin conectar con la tarea. Usa la clase para explicar una decisión concreta.',
  'Se omite la verificación porque “siempre se ha hecho así”. La clase ayuda a preguntar qué evidencia falta.',
  'El error aparece al cambiar de turno o de persona. Deja por escrito lo esencial para que otro pueda continuar.',
  'Se confunde rapidez con eficiencia. La clase propone una pausa de control antes de cerrar la tarea.',
  'Se ignoran las excepciones porque el caso habitual funciona. Anota una excepción y cómo la tratarías.',
  'El error se repite porque nadie lo documenta. Registra el hallazgo y una acción verificable.',
];
const PROMPTS_PLAN = [
  'Estudia la clase y produce una nota de cinco líneas con un ejemplo propio.',
  'Mira la clase, resume el concepto y escribe una pregunta para el foro.',
  'Trabaja la clase y aplica la idea a un caso real con datos anonimizados.',
  'Revisa la clase y prepara una lista de verificación de tres puntos.',
  'Estudia la clase y explica el concepto en un audio de dos minutos.',
  'Lee o mira la clase y redacta una decisión que tomarías con ese criterio.',
  'Repasa la clase y conecta su idea con la unidad anterior en un párrafo.',
  'Cierra la clase con una autoevaluación de tres preguntas y corrige lo fallado.',
];
const PROMPTS_FAQ = [
  'Lo que enseña esta clase se puede resumir en una decisión práctica que se explica en dos minutos.',
  'Esta clase aporta el criterio que hace falta para responder sin improvisar.',
  'La clase conecta el concepto con una tarea concreta y una evidencia verificable.',
  'Su utilidad se nota cuando aparece un caso que no encaja en el formato habitual.',
  'La clase ayuda a distinguir lo esencial de lo accesorio antes de actuar.',
  'El aprendizaje se comprueba cuando puedes explicar por qué una opción es mejor que otra.',
];

export function construirGuiaDeEstudio(p, angulo, ctx) {
  const unidades = p.unidades.slice(0, 6);
  const estudioPorUnidad = unidades.map((u) => {
    const clases = u.clases.slice(0, 2);
    return subseccion(
      u.nombre,
      `Empieza por ${clases[0] ? `“${clases[0].titulo}”` : 'la primera clase de la unidad'} y no avances hasta poder explicar su idea central. ${u.clases.length > 1 ? `Después continúa con “${u.clases[1].titulo}”.` : ''}`,
      `**Cómo comprobar la unidad:** escribe en una página qué problema resuelve, qué decisión permite tomar y qué evidencia dejarías. Si no puedes completar las tres columnas, vuelve a la clase que te resulte más abstracta.`,
    );
  }).join('\n\n');
  const señales = [
    `Puedes explicar la diferencia entre “${p.clases[0]?.titulo || p.temaCorto}” y “${p.clases[1]?.titulo || p.temaCorto}” con tus palabras.`,
    `Describes el proceso de la unidad “${p.unidades[0]?.nombre || 'inicial'}” sin mirar el material.`,
    'Resuelves las preguntas y sabes por qué las otras opciones no sirven.',
    'Encuentras un ejemplo de tu trabajo donde aplicar lo aprendido.',
    'Escribes una nota que otra persona podría usar sin tu ayuda.',
  ];
  return parrafo(
    `# ${angulo.titulo(p)}`,
    introduccion(p, angulo),
    ctaCurso(p, angulo),
    seccion(
      'El mapa del curso',
      `Antes de estudiar clase por clase, mira la estructura completa. El curso tiene ${p.nUnidades} unidades y ${p.nClases} clases; esta tabla te ayuda a decidir por dónde empezar y qué unidad necesita más tiempo.`,
      tablaUnidades(p),
      variar([
        `Si tu objetivo es entender el marco, empieza por la primera unidad y no la saltes. Si ya trabajas en ${p.areaInfo.etiqueta}, úsala como diagnóstico: marca las clases que podrías explicar hoy y las que no.`,
        `No estudies en el orden en que aparecen los videos por inercia. Lee la tabla, elige la unidad que responde a tu necesidad y vuelve al orden original cuando necesites contexto.`,
        `La estructura está pensada para construir criterio. Saltar la primera unidad puede funcionar si tienes experiencia, pero conviene comprobar que dominas el vocabulario que se usa después.`,
      ], p, angulo, 'mapa'),
    ),
    seccion('Cómo estudiar cada unidad', estudioPorUnidad),
    seccion(
      'Cómo estudiar cada clase',
      `Estas son clases reales del curso, con una tarea de estudio para cada una. Elige una, haz la tarea y recién entonces pasa a la siguiente.`,
      detalleClases(p, Math.min(12, Math.max(8, p.nClases)), 'estudio', PROMPTS_ESTUDIO),
    ),
    seccion(
      'Un plan de sesiones de 45 minutos',
      `Cada sesión debería terminar con algo producido. Este es un ejemplo con clases del curso:`,
      tabla(
        ['Sesión', 'Clase', 'Evidencia al terminar'],
        muestraClases(p, 8, 'sesiones').map((clase, i) => [
          `Sesión ${i + 1}`,
          clase.titulo,
          `Una nota de cinco líneas y un ejemplo de la unidad “${unidadDe(p, clase.titulo)}”.`,
        ]),
      ),
    ),
    seccion(
      'Cómo usar las evaluaciones y los foros',
      `El curso incluye ${p.evaluaciones} evaluaciones con ${p.preguntas} preguntas, ${p.actividades} actividades y ${p.foros} foros. Las evaluaciones no son un trámite: son la forma de descubrir qué concepto todavía no puedes explicar.`,
      `Lleva al foro una duda concreta y un intento de respuesta. Una pregunta como “no entiendo la unidad” recibe menos ayuda que “en esta clase entendí X, pero no sé cómo aplicarlo a Y”.`,
    ),
    seccion('Señales de que estás aprendiendo', lista(señales)),
    faq(p, angulo, [
      ['¿Necesito conocimientos previos?', respuestaNivel(p)],
      ['¿Cuánto tiempo requiere?', respuestaTiempo(p)],
      ['¿El certificado se obtiene al terminar?', respuestaCertificado(p)],
      ['¿Puedo estudiar mientras trabajo?', `Sí, si proteges sesiones cortas y las tratas como una cita. ${variar([
        'La constancia importa más que la duración de cada sesión.',
        'Tres bloques de 45 minutos por semana suelen bastar para avanzar sin perder el hilo.',
        'El error más común no es la falta de tiempo, sino estudiar sin un plan y sin fecha de cierre.',
      ], p, angulo, 'trabajo')}`],
    ]),
    cierre(p, angulo, ctx),
  );
}

export function construirParaQueSirve(p, angulo, ctx) {
  const rolesClave = roles(p, 4, 'sirve');
  const resultados = p.unidades.slice(0, 8).map((u) => [
    u.nombre,
    `Al terminarla puedes explicar ${u.clases[0]?.titulo ? `“${u.clases[0].titulo}”` : 'su idea central'} y aplicarla a un caso propio.`,
  ]);
  return parrafo(
    `# ${angulo.titulo(p)}`,
    introduccion(p, angulo),
    ctaCurso(p, angulo),
    seccion(
      'Qué problema resuelve',
      `El problema no es la falta de información: es la falta de un criterio para usarla. En ${p.tema} hay material disperso, opiniones contradictorias y procedimientos que nadie explica completos. El curso ordena ese material y lo conecta con tareas que sí aparecen en el trabajo.`,
      `La propuesta de [${p.titulo}](${p.url}) es que puedas ${sinPunto(p.areaInfo.aplica[hash(semilla(p, 'problema')) % p.areaInfo.aplica.length])}. Esa es la diferencia entre “ver el tema” y “poder hacer algo con el tema”.`,
    ),
    seccion(
      'Clase por clase: qué aprendes a hacer',
      detalleClases(p, Math.min(14, Math.max(8, p.nClases)), 'sirve', PROMPTS_APLICACION),
    ),
    seccion(
      'Resultado esperado por unidad',
      tabla(['Unidad', 'Al terminarla podrás'], resultados),
    ),
    seccion(
      'Dónde se usa en el trabajo',
      lista(rolesClave.map((rol, i) => `**${rol.charAt(0).toUpperCase() + rol.slice(1)}:** ${p.areaInfo.aplica[(hash(semilla(p, 'rol', i)) + i) % p.areaInfo.aplica.length]}`)),
      `La misma formación puede servir a un perfil técnico, a un coordinador y a alguien que atiende público. Cambia la profundidad, no el criterio central.`,
    ),
    seccion(
      'Qué no esperar del curso',
      lista([
        'Reemplazar la práctica supervisada o la experiencia en un puesto real.',
        'Convertirte en especialista sin estudio posterior y sin casos propios.',
        'Dar por aprobada una norma, un registro o un procedimiento que depende de una autoridad externa.',
        p.esSalud
          ? 'Indicarte dosis, cambios de tratamiento o decisiones clínicas: eso corresponde al equipo tratante.'
          : 'Resolver por sí solo un problema organizacional que requiere decisión de otras áreas.',
      ]),
    ),
    seccion(
      'Para quién es y para quién no',
      `Está pensado para ${p.publico} que necesitan una base ordenada o una actualización práctica. Funciona si ya tienes contacto con el tema y quieres estructurar lo que sabes, o si vienes de otra área y necesitas un punto de partida serio.`,
      `No es la mejor opción si buscas solo una definición para salir del paso ni si esperas un recetario sin contexto. El curso pide lectura, práctica y cierta capacidad de sostener un plan.`,
    ),
    faq(p, angulo, [
      ['¿Para qué sirve exactamente?', respuestaUtilidad(p)],
      ['¿Qué nivel tiene?', respuestaNivel(p)],
      ['¿Cuánto dura?', respuestaTiempo(p)],
      ['¿Entrega certificado?', respuestaCertificado(p)],
    ]),
    cierre(p, angulo, ctx),
  );
}

export function construirTemario(p, angulo, ctx) {
  const bloquesUnidades = p.unidades.slice(0, 8).map((u) => {
    const primera = u.clases[0];
    const ultima = u.clases[u.clases.length - 1];
    return subseccion(
      u.nombre,
      `La unidad reúne ${u.clases.length} ${u.clases.length === 1 ? 'clase' : 'clases'} y abre con “${primera?.titulo || u.nombre}”${ultima && ultima !== primera ? `; cierra con “${ultima.titulo}”` : ''}. El objetivo es conectar esos temas con una tarea concreta de ${p.areaInfo.etiqueta}.`,
      lista(u.clases.map((c) => `**${c.titulo}.** ${c.subtitulo || `Punto de la unidad ${u.nombre}.`}`)),
      `Al terminar, deberías poder explicar la idea central de “${primera?.titulo || u.nombre}” y usarla en un ejemplo propio. Si no puedes, vuelve a la clase que te resulte más abstracta antes de seguir.`,
    );
  }).join('\n\n');
  return parrafo(
    `# ${angulo.titulo(p)}`,
    introduccion(p, angulo),
    ctaCurso(p, angulo),
    seccion(
      'Cómo se organiza el curso',
      `El temario se divide en ${p.nUnidades} unidades y ${p.nClases} clases. La estructura avanza de los fundamentos a la aplicación y cierra con evaluaciones y actividades. Esta es la vista general:`,
      tablaUnidades(p),
      `Antes de inscribirte, compara esta estructura con lo que necesitas resolver. Si tu problema está en una sola unidad, quizá no necesites recorrer todo; si necesitas criterio para tomar decisiones, el recorrido completo tiene más sentido.`,
    ),
    seccion('Unidad por unidad: qué se estudia', bloquesUnidades),
    seccion(
      'Cómo se evalúa',
      `El curso incluye ${p.evaluaciones} evaluaciones, ${p.preguntas} preguntas, ${p.actividades} actividades y ${p.foros} foros. Las evaluaciones no son un trámite: están para comprobar si puedes aplicar el criterio y no solo recordar una definición.`,
      lista([
        'Revisa el objetivo de cada evaluación antes de responder.',
        'Usa las preguntas falladas como mapa de repaso, no como sentencia.',
        'Aprovecha las actividades para producir algo que puedas llevar a tu trabajo.',
        'Participa en los foros con casos concretos y datos anonimizados.',
      ]),
    ),
    seccion(
      'Nivel, tiempo y ritmo',
      respuestaNivel(p),
      `La ficha declara ${tiempoDeCurso(p)}. Si estudias tres veces por semana, calcula entre cuatro y seis semanas para el recorrido completo, con una semana adicional de repaso.`,
    ),
    seccion(
      'Qué conviene repasar antes',
      lista(p.areaInfo.antes.map((x) => x.charAt(0).toUpperCase() + x.slice(1))),
    ),
    faq(p, angulo, [
      ['¿El temario está completo?', `Sí. El curso declara ${p.nClases} clases y ${p.nUnidades} unidades. En esta guía se muestran las unidades y una parte de las clases; la ficha oficial tiene el detalle actualizado.`],
      ['¿Puedo saltar unidades?', `Puedes hacerlo, pero el orden está pensado para construir criterio. Si decides saltar, asegúrate de dominar el vocabulario y los conceptos de la unidad anterior; de lo contrario, la aplicación se vuelve memorización.`],
      ['¿Hay evaluaciones?', `Sí: ${p.evaluaciones} evaluaciones con ${p.preguntas} preguntas, además de ${p.actividades} actividades y ${p.foros} foros.`],
      ['¿Cuánto tiempo requiere?', respuestaTiempo(p)],
    ]),
    cierre(p, angulo, ctx),
  );
}

export function construirPlan30Dias(p, angulo, ctx) {
  const clases = clasesUtiles(p);
  const porSemana = [0, 1, 2, 3].map((semana) => clases.filter((_, i) => i % 4 === semana));
  const semanas = porSemana.map((listaClases, semana) => subseccion(
    `Semana ${semana + 1}`,
    `Trabaja estas clases en orden. Si no puedes explicar una, no pases a la siguiente sin repasarla.`,
    listaClases.map((c, i) => `- **${c.titulo}** (unidad “${unidadDe(p, c.titulo)}”): ${PROMPTS_PLAN[(hash(`${p.url}:${c.titulo}:plan`) + i) % PROMPTS_PLAN.length]}`).join('\n'),
    `**Entregable de la semana:** una nota de una página con los conceptos clave, un ejemplo y una pregunta que todavía no puedas responder.`,
  )).join('\n\n');
  return parrafo(
    `# ${angulo.titulo(p)}`,
    introduccion(p, angulo),
    ctaCurso(p, angulo),
    seccion(
      'Antes de empezar: un diagnóstico de 20 minutos',
      lista([
        `¿Puedes explicar “${p.unidades[0]?.clases[0]?.titulo || p.temaCorto}” sin mirar el material?`,
        `¿Qué unidad del temario —“${p.unidades[0]?.nombre || 'la primera'}” o “${p.unidades[1]?.nombre || 'la segunda'}”— te genera más dudas y por qué?`,
        '¿Cuántos bloques de 45 minutos puedo proteger por semana sin negociar con el cansancio?',
        `¿Qué evidencia de la clase “${p.unidades[0]?.clases[1]?.titulo || p.unidades[0]?.clases[0]?.titulo || p.temaCorto}” podrías mostrar hoy?`,
        `¿Quién podría revisar tu nota sobre “${p.unidades[1]?.clases[0]?.titulo || p.temaCorto}” y darte retroalimentación?`,
      ]),
    ),
    seccion('El plan, semana por semana', semanas),
    seccion(
      'Cómo medir el avance',
      tabla(
        ['Indicador', 'Cómo lo compruebas'],
        [
          ['Cobertura del temario', `Número de unidades trabajadas sobre ${p.nUnidades}.`],
          [`Explicas “${p.clases[0]?.titulo || p.temaCorto}”`, 'Sin mirar el material, en dos minutos.'],
          [`Produces un ejemplo de “${p.clases[1]?.titulo || p.temaCorto}”`, 'Con un caso propio y una decisión explícita.'],
          ['Evaluación', `Resuelves las ${p.preguntas} preguntas y justificas las respuestas.`],
          [`Documentas “${p.clases[2]?.titulo || p.temaCorto}”`, 'Con una nota que otra persona puede usar.'],
          ...p.areaInfo.indicadores.slice(0, 2).map((x) => [x.charAt(0).toUpperCase() + x.slice(1), 'Registra el dato al inicio y al final del mes.']),
        ],
      ),
    ),
    seccion(
      'Qué hacer si te atrasas',
      lista([
        `Si no entiendes “${p.clases[3]?.titulo || p.clases[0]?.titulo || p.temaCorto}”, vuelve a la unidad “${unidadDe(p, p.clases[3]?.titulo || p.clases[0]?.titulo || '')}” antes de seguir.`,
        `Si una semana se pierde, recupera primero “${p.unidades[0]?.nombre || 'la primera unidad'}”; deja las lecturas complementarias para después.`,
        'Reduce el alcance, no la frecuencia: sesiones de 20 minutos siguen siendo mejores que una semana en blanco.',
        `No reinicies el curso desde cero: retoma en la última clase de “${p.unidades[p.unidades.length - 1]?.nombre || 'la última unidad'}” que puedas explicar.`,
      ]),
    ),
    seccion(
      'Cómo convertir el plan en evidencia para tu hoja de vida',
      lista([
        `Describe el problema que elegiste y por qué era relevante para ${p.areaInfo.etiqueta}.`,
        `Explica cómo usaste “${p.clases[4]?.titulo || p.clases[0]?.titulo || p.temaCorto}” para resolverlo y qué evidencia produjiste.`,
        `Menciona las unidades “${p.unidades[0]?.nombre || ''}” y “${p.unidades[1]?.nombre || ''}”, sin exagerar el alcance.`,
        'Si el proyecto fue interno, presenta la versión anonimizada y respeta la confidencialidad.',
      ]),
    ),
    faq(p, angulo, [
      ['¿30 días es suficiente para el curso completo?', `Depende de tu ritmo. El plan está diseñado para cuatro semanas con tres sesiones semanales. Si el curso tiene ${p.nClases} clases, quizá necesites una semana adicional de repaso.`],
      ['¿Qué pasa si solo tengo dos días por semana?', 'Extiende el plan a seis u ocho semanas y conserva los entregables semanales. La estructura importa más que el calendario exacto.'],
      ['¿Necesito el certificado para aplicar lo aprendido?', 'No para practicar, pero sí puede ser útil como evidencia formal. El curso permite empezar por la primera unidad gratis y obtener el certificado al completarlo.'],
    ]),
    cierre(p, angulo, ctx),
  );
}

export function construirErrores(p, angulo, ctx) {
  const base = p.areaInfo.errores || [];
  const inicio = hash(semilla(p, 'errores')) % Math.max(1, base.length);
  const delArea = Array.from({ length: Math.min(4, base.length) }, (_, i) => base[(inicio + i) % base.length]);
  const clases = muestraClases(p, 16, 'errores');
  const c = (i) => clases[i % Math.max(1, clases.length)];
  const propios = [
    c(0) && c(1) ? `Estudiar “${c(0).titulo}” sin conectarla con “${c(1).titulo}”.` : '',
    p.unidades[0] ? `Memorizar los temas de “${p.unidades[0].nombre}” sin producir un ejemplo propio.` : '',
    c(2) && p.unidades[1] ? `Saltar “${c(2).titulo}” por parecer básica y llegar a “${p.unidades[1].nombre}” sin criterio.` : '',
    c(3) && c(4) ? `Confundir “${c(3).titulo}” con “${c(4).titulo}” y aplicar la regla equivocada.` : '',
    c(5) ? `Quedarse en la teoría de “${c(5).titulo}” y no probarla con un caso de la unidad “${unidadDe(p, c(5).titulo)}”.` : '',
    c(6) ? `No documentar lo que aprendiste en “${c(6).titulo}” y perder la evidencia para la evaluación.` : '',
  ].filter(Boolean);
  const errores = [...delArea, ...propios];
  const bloques = errores.map((error, i) => {
    const claseA = c(i * 2);
    const claseB = c(i * 2 + 1);
    return subseccion(
      error,
      variar([
        `Ocurre porque el trabajo diario premia la rapidez y castiga poco la falta de criterio. Al principio parece una solución; después se convierte en retrabajo, en un hallazgo o en una decisión que nadie puede explicar.`,
        `Casi nunca es mala intención. Es falta de un marco para decidir: no hay una pregunta previa, no se consulta la norma o no se documenta el porqué.`,
        `El error suele esconderse en la normalidad: se repite tanto que nadie lo cuestiona. Se detecta cuando cambia el turno, llega una auditoría o aparece un caso que no encaja.`,
      ], p, angulo, `error-${i}`),
      claseA ? `**Dónde se trabaja en el curso:** “${claseA.titulo}” (unidad “${unidadDe(p, claseA.titulo)}”)${claseB ? ` y “${claseB.titulo}”` : ''}. ${PROMPTS_ERRORES[(hash(`${p.url}:${error}`) + i) % PROMPTS_ERRORES.length]}` : '',
      `**Cómo corregirlo:** ${sinPunto(p.areaInfo.aplica[(i + 1) % p.areaInfo.aplica.length])}. Empieza con una acción pequeña y verificable.`,
    );
  }).join('\n\n');
  return parrafo(
    `# ${angulo.titulo(p)}`,
    introduccion(p, angulo),
    ctaCurso(p, angulo),
    seccion(
      'Los errores que más se repiten',
      `Estos son los tropiezos que aparecen una y otra vez cuando se estudia o se aplica ${p.tema}. No todos son técnicos: algunos son de método, de comunicación o de prisa.`,
      bloques,
    ),
    seccion(
      'Cómo detectarlos a tiempo',
      lista([
        '¿Puedo explicar qué decisión tomé y con qué criterio?',
        '¿La evidencia está registrada en el momento y en el lugar correcto?',
        '¿Estoy repitiendo un formato sin entender para qué sirve?',
        '¿Consulté la fuente oficial o solo mi memoria?',
        '¿Otra persona podría continuar mi trabajo con lo que dejé escrito?',
        '¿Estoy resolviendo la causa o solo el síntoma?',
      ]),
    ),
    seccion(
      'Qué no debes hacer sin supervisión',
      p.esSalud
        ? `Ninguna formación autoriza a cambiar dosis, suspender tratamientos o emitir diagnósticos fuera de tu competencia. Si el caso supera tu alcance, documenta lo observado y remite al equipo tratante.`
        : `Si el cambio afecta un registro sanitario, una validación, una liberación de producto o una decisión frente a una autoridad, no lo hagas por tu cuenta. Documenta la situación y escala a quien corresponda.`,
    ),
    faq(p, angulo, [
      ['¿El curso corrige estos errores?', `No los corrige por ti, pero te da el marco para detectarlos. Las ${p.nClases} clases del curso están diseñadas para que practiques el criterio antes de aplicarlo en un caso real.`],
      ['¿Cuál es el error más costoso?', 'El que se repite sin documentarse. Un error aislado se corrige; un error sistemático se convierte en cultura y es mucho más difícil de revertir.'],
      ['¿Cómo evitar el error si tengo prisa?', 'Reduce el alcance, no los controles. Es mejor entregar una parte bien documentada que un todo sin evidencia.'],
    ]),
    cierre(p, angulo, ctx),
  );
}

export function construirAplicacion(p, angulo, ctx) {
  const rolesClave = roles(p, 3, 'aplicacion');
  const clases = muestraClases(p, 12, 'aplicacion');
  const tablaTareas = tabla(
    ['Clase', 'Tarea en el trabajo', 'Evidencia'],
    clases.map((c, i) => [
      c.titulo,
      PROMPTS_APLICACION[(hash(`${p.url}:${c.titulo}:aplica`) + i) % PROMPTS_APLICACION.length],
      `Nota, correo o registro de la unidad “${unidadDe(p, c.titulo)}”.`,
    ]),
  );
  const casos = rolesClave.map((rol, i) => {
    const clase = clases[(i * 3) % Math.max(1, clases.length)];
    return subseccion(
      rol.charAt(0).toUpperCase() + rol.slice(1),
      `En este rol, ${p.tema} aparece cuando ${variar([
        'hay que tomar una decisión con información incompleta y dejar registro de ella.',
        'una tarea se repite sin que nadie haya revisado si sigue teniendo sentido.',
        'el equipo necesita un criterio común para resolver un caso.',
        'una persona nueva debe entender el proceso sin depender de la memoria de alguien.',
      ], p, angulo, `rol-${i}`)}`,
      clase ? `**Clase que conviene aplicar primero:** “${clase.titulo}” (unidad “${unidadDe(p, clase.titulo)}”). ${PROMPTS_APLICACION[(hash(`${p.url}:${rol}:${clase.titulo}`) + i) % PROMPTS_APLICACION.length]}` : '',
      `${sinPunto(p.areaInfo.aplica[(hash(semilla(p, 'aplica', i)) + i) % p.areaInfo.aplica.length])}. El curso te ayuda a hacerlo con un lenguaje y una secuencia, no con intuición.`,
    );
  }).join('\n\n');
  const proyecto = [0, 1, 2].map((semana) => {
    const clase = clases[(hash(`${p.url}:proyecto:${semana}`) + semana) % Math.max(1, clases.length)];
    return `**Semana ${semana + 1}:** ${semana === 0 ? `elige una tarea de tu trabajo relacionada con ${p.tema} y escribe cómo la haces hoy.` : semana === 1 ? `estudia “${clase?.titulo || 'la clase elegida'}” y rediseña la tarea con el criterio aprendido.` : 'aplica el cambio, registra el resultado y pide retroalimentación a alguien que no haya participado.'}`;
  });
  return parrafo(
    `# ${angulo.titulo(p)}`,
    introduccion(p, angulo),
    ctaCurso(p, angulo),
    seccion(
      'De la clase a una tarea concreta',
      `El paso más difícil no es entender ${p.tema}: es decidir qué harás distinto el lunes. Usa esta tabla de clases reales para elegir una tarea pequeña y aplicarla con el marco del curso.`,
      tablaTareas,
    ),
    seccion('Un caso por rol', casos),
    seccion(
      'Cómo documentar el resultado',
      tabla(
        ['Evidencia', 'Qué registrar'],
        [
          ['Situación', 'El caso, la fecha y el contexto, sin datos personales innecesarios.'],
          ['Criterio', 'La unidad o clase del curso que usaste y por qué aplica.'],
          ['Acción', 'Lo que hiciste, con quién y en cuánto tiempo.'],
          ['Resultado', 'Qué cambió, qué se resolvió o qué quedó pendiente.'],
          ...p.areaInfo.indicadores.slice(0, 3).map((x) => [x.charAt(0).toUpperCase() + x.slice(1), 'Valor inicial, valor final y fuente del dato.']),
        ],
      ),
    ),
    seccion('Un proyecto pequeño de tres semanas', numerada(proyecto)),
    seccion(
      'Cómo contarlo en una entrevista o evaluación',
      tabla(
        ['Si te preguntan por…', 'Qué responder'],
        muestraClases(p, 4, 'entrevista').map((c) => [
          `“${c.titulo}”`,
          `Explica qué decisión tomaste en la unidad “${unidadDe(p, c.titulo)}”, qué evidencia dejaste y qué corregirías.`,
        ]),
      ),
    ),
    faq(p, angulo, [
      ['¿Necesito un puesto de trabajo para aplicar el curso?', 'No. Puedes usar un caso del propio curso, un ejercicio académico o una situación de voluntariado. Lo importante es que haya una decisión, una acción y una evidencia.'],
      ['¿Qué pasa si mi trabajo no me permite cambiar nada?', 'Puedes aplicar el criterio en la forma de documentar, preguntar o preparar una propuesta. No siempre se cambia el proceso; a veces se cambia la calidad de la conversación sobre el proceso.'],
      ['¿Cómo demuestro que aprendí?', 'Con evidencia producida: una nota, un análisis, una lista de verificación, una propuesta o un caso resuelto. El certificado acompaña, pero no sustituye la evidencia.'],
    ]),
    cierre(p, angulo, ctx),
  );
}

export function construirFaq(p, angulo, ctx) {
  const unidades = p.unidades.slice(0, 7);
  const clases = muestraClases(p, 10, 'faq');
  const preguntasUnidad = unidades.map((u, i) => {
    const muestra = u.clases.slice(0, 4).map((c) => `“${c.titulo}”`).join(', ');
    const extra = u.clases.length > 4 ? ' y otras clases de aplicación.' : '.';
    return [
      `¿Qué incluye la unidad “${u.nombre}”?`,
      `Reúne ${u.clases.length} clases: ${muestra}${extra} ${PROMPTS_FAQ[(hash(`${p.url}:${u.nombre}`) + i) % PROMPTS_FAQ.length]} Al terminarla deberías poder explicar la idea central y aplicarla a un caso propio.`,
    ];
  });
  const preguntasClase = clases.slice(0, 10).map((c, i) => [
    `¿Cómo se estudia la clase “${c.titulo}”?`,
    `Pertenece a la unidad “${unidadDe(p, c.titulo)}”. ${PROMPTS_FAQ[(hash(`${p.url}:${c.titulo}:faq`) + i) % PROMPTS_FAQ.length]} Una forma de comprobarlo es escribir un ejemplo propio y explicarlo sin mirar el material.`,
  ]);
  const primera = p.unidades[0]?.clases[0]?.titulo;
  const segundaUnidad = p.unidades[1]?.nombre;
  const preguntasCurso = [
    ['¿Qué es exactamente este curso?', `Es [${p.titulo}](${p.url}), un curso del aula virtual de Edvanta con ${p.nUnidades} unidades y ${p.nClases} clases. Trabaja ${p.areaInfo.etiqueta} con un enfoque aplicado y ${p.evaluaciones} evaluaciones.`],
    ['¿Cuál es la primera clase y por qué importa?', primera ? `La primera clase es “${primera}”. No es un trámite: allí se construye el vocabulario y el criterio que se usan en el resto del curso.` : 'La primera clase construye el vocabulario y el criterio que se usan en el resto del curso.'],
    ['¿Cómo se relacionan las unidades?', segundaUnidad ? `La primera unidad construye el marco; “${segundaUnidad}” lo lleva a una aplicación concreta. Si saltas la primera, la segunda se vuelve memorización sin contexto.` : 'Las unidades avanzan del marco a la aplicación. Saltarse la primera suele volver la segunda una memorización sin contexto.'],
    ['¿Cuánto tiempo necesita una persona promedio?', respuestaTiempo(p)],
    ['¿Qué nivel exige?', respuestaNivel(p)],
    ['¿Entrega certificado?', respuestaCertificado(p)],
    ['¿Cómo se evalúa el curso?', `Con ${p.evaluaciones} evaluaciones y ${p.preguntas} preguntas, además de ${p.actividades} actividades y ${p.foros} foros. No son un adorno: están para comprobar si puedes aplicar el criterio.`],
  ];
  const preguntasCruce = [];
  if (clases[0] && clases[1]) {
    preguntasCruce.push([
      `¿Qué relación hay entre “${clases[0].titulo}” y “${clases[1].titulo}”?`,
      `La primera pertenece a “${unidadDe(p, clases[0].titulo)}” y la segunda a “${unidadDe(p, clases[1].titulo)}”. No son temas aislados: una construye el criterio que la otra aplica. Si estudias solo la segunda, puedes repetir el procedimiento sin entender cuándo no corresponde.`,
    ]);
  }
  if (clases[2] && clases[3]) {
    preguntasCruce.push([
      `¿Qué diferencia hay entre “${clases[2].titulo}” y “${clases[3].titulo}”?`,
      `“${clases[2].titulo}” se trabaja en “${unidadDe(p, clases[2].titulo)}”; “${clases[3].titulo}”, en “${unidadDe(p, clases[3].titulo)}”. La diferencia práctica está en la decisión que habilita cada una y en la evidencia que deja.`,
    ]);
  }
  if (clases[4]) {
    preguntasCruce.push([
      `¿Qué evidencia deja la clase “${clases[4].titulo}”?`,
      `Deberías poder producir una nota, un ejemplo o una lista de verificación relacionada con “${unidadDe(p, clases[4].titulo)}”. Si solo recuerdas el título, todavía no hay evidencia de aprendizaje.`,
    ]);
  }
  if (segundaUnidad && primera) {
    preguntasCruce.push([
      `¿Qué conviene repasar antes de “${segundaUnidad}”?`,
      `Antes de entrar en “${segundaUnidad}”, asegúrate de poder explicar “${primera}” y de haber producido un ejemplo propio de la primera unidad. Ese repaso evita que la segunda se convierta en una lista de términos.`,
    ]);
  }
  if (clases[5]) {
    preguntasCruce.push([
      `¿Qué error evita la clase “${clases[5].titulo}”?`,
      `Evita una decisión tomada por costumbre sin revisar el criterio. ${PROMPTS_FAQ[(hash(`${p.url}:${clases[5].titulo}:error`) + 2) % PROMPTS_FAQ.length]} La clase te obliga a justificar lo que haces, no solo a ejecutarlo.`,
    ]);
  }
  return parrafo(
    `# Dudas frecuentes sobre ${p.temaCorto}`,
    introduccion(p, angulo),
    ctaCurso(p, angulo),
    seccion(
      'Preguntas frecuentes',
      `Estas respuestas se apoyan en la información visible de [${p.titulo}](${p.url}) y en el temario real. No hay promesas de marketing ni datos que la ficha no pueda sostener.`,
      [...preguntasCurso, ...preguntasUnidad, ...preguntasClase, ...preguntasCruce].map(([q, a]) => subseccion(q, a)).join('\n\n'),
    ),
    seccion(
      'Cómo elegir entre varias opciones',
      tabla(
        ['Criterio', 'Pregunta que debes hacerte'],
        [
          ['Temario', '¿Cubre las tareas que necesitas resolver o solo los conceptos generales?'],
          ['Práctica', '¿Hay actividades, casos o evaluaciones que te obliguen a aplicar?'],
          ['Nivel', `¿El curso se declara ${p.nivel} y coincide con tu punto de partida?`],
          ['Evaluación', `¿Tiene ${p.evaluaciones} evaluaciones y ${p.preguntas} preguntas, o solo videos?`],
          ['Certificado', '¿Qué condiciones pide y quién lo emite?'],
          ['Acceso', '¿Puedes empezar gratis, cuánto dura el acceso y cómo se paga?'],
        ],
      ),
    ),
    seccion(
      'Qué revisar antes de inscribirte',
      lista([
        'La ficha oficial, no una captura de pantalla o un mensaje reenviado.',
        'El temario completo y el nivel declarado.',
        'Las condiciones del certificado y el valor vigente.',
        'El tiempo real que puedes sostener cada semana.',
        `Si el curso te pide ${p.areaInfo.antes[0]}, confirma que lo tienes o que estás dispuesto a repasarlo.`,
      ]),
    ),
    cierre(p, angulo, ctx),
  );
}

export function construirComparativa(p, angulo, ctx) {
  const unidades = p.unidades.slice(0, 8);
  const plan = unidades.map((u) => {
    const clases = u.clases.slice(0, 4).map((c) => `“${c.titulo}”`).join(', ');
    return [
      u.nombre,
      clases || `Los temas de ${u.nombre.toLowerCase()}`,
      `Busca una fuente oficial y una guía práctica sobre ${u.nombre.toLowerCase()}.`,
      'Una nota con un ejemplo y una duda.',
    ];
  });
  const clases = clasesUtiles(p);
  const semanas = [0, 1, 2, 3].map((semana) => {
    const lista = clases.filter((_, i) => i % 4 === semana);
    return subseccion(
      `Semana ${semana + 1}`,
      lista.length
        ? lista.map((c, i) => `- **${c.titulo}** (unidad “${unidadDe(p, c.titulo)}”): ${PROMPTS_ESTUDIO[(hash(`${p.url}:${c.titulo}:solo`) + i) % PROMPTS_ESTUDIO.length]}`).join('\n')
        : 'Repasa las clases anteriores y produce un ejemplo propio por unidad.',
      `**Evidencia:** una nota con lo que entendiste, lo que no pudiste resolver y la fuente que consultarías para cerrar el vacío.`,
    );
  }).join('\n\n');
  return parrafo(
    `# ${angulo.titulo(p)}`,
    `Aprender ${p.tema} por tu cuenta es posible. También es posible hacer un curso y no aprender nada si solo ves videos sin practicar. La pregunta no es “curso sí o no”, sino qué estructura necesitas para pasar de la información a la aplicación.`,
    variar([
      `Este artículo compara las dos rutas con el temario real de ${p.titulo}: ${p.nUnidades} unidades, ${p.nClases} clases y ${p.evaluaciones} evaluaciones.`,
      `La comparación se apoya en lo que el curso declara: nivel ${p.nivel}, ${p.nClases} clases y ${p.evaluaciones} evaluaciones. Con esos datos puedes decidir si necesitas la estructura completa o solo una parte.`,
      `Antes de elegir, mira el temario de [${p.titulo}](${p.url}) y pregúntate qué harías con él si estudiaras solo. Esa respuesta te dice si el curso te aporta orden, práctica o ambas cosas.`,
    ], p, angulo, 'intro-comparativa'),
    ctaCurso(p, angulo),
    seccion(
      'Lo que cubre el curso y lo que tendrías que buscar por tu cuenta',
      `Si estudias solo, el temario del curso sirve como mapa para no omitir temas. Esta tabla traduce cada unidad a una búsqueda concreta y a una evidencia.`,
      tabla(
        ['Unidad', 'Clases del curso', 'Qué buscar por tu cuenta', 'Evidencia'],
        plan,
      ),
    ),
    seccion(
      'Un plan de autoaprendizaje de cuatro semanas',
      `Así se vería un mes de estudio sin curso, usando las clases reales como referencia.`,
      semanas,
    ),
    seccion(
      'Los límites del autoaprendizaje en este tema',
      lista([
        `**Cobertura:** sin el temario, es fácil omitir “${p.unidades[0]?.nombre || 'la primera unidad'}” o “${p.unidades[1]?.nombre || 'la segunda'}”.`,
        `**Corrección:** puedes escribir un ejemplo de “${p.clases[0]?.titulo || p.temaCorto}”, pero nadie te dice si es correcto hasta que lo contrastas.`,
        `**Práctica:** “${p.clases[1]?.titulo || p.temaCorto}” parece comprensible en un video y se vuelve difícil cuando tienes que aplicarla a un caso.`,
        `**Constancia:** sin fechas ni evaluación, es fácil abandonar en la semana en que el trabajo se complica.`,
      ]),
    ),
    seccion(
      'Qué cambia con el curso',
      tabla(
        ['Componente del curso', 'Qué resuelve'],
        [
          [`“${p.clases[2]?.titulo || p.temaCorto}”`, 'Te obliga a producir una aplicación, no solo a ver el video.'],
          [`“${p.clases[3]?.titulo || p.temaCorto}”`, 'Conecta la unidad con una tarea y una evidencia.'],
          [`${p.evaluaciones} evaluaciones y ${p.preguntas} preguntas`, 'Comprueban si puedes justificar una decisión.'],
          [`${p.actividades} actividades y ${p.foros} foros`, 'Te enfrentan a casos y a la mirada de otras personas.'],
          ['Certificado', 'Deja una evidencia formal al completar el programa.'],
        ],
      ),
    ),
    seccion(
      'Una decisión según tu objetivo',
      `Si tu necesidad está en “${p.unidades[0]?.nombre || 'la primera unidad'}”, quizá baste con una fuente oficial y una clase específica. Si necesitas recorrer “${p.unidades[1]?.nombre || 'la segunda unidad'}” y “${p.unidades[2]?.nombre || 'la tercera'}”, el curso completo ahorra tiempo de ensayo y error.`,
      `La decisión no es permanente. Puedes empezar por la primera unidad gratis, comparar el método con tu forma de estudiar y decidir después si continúas.`,
    ),
    faq(p, angulo, [
      ['¿Un curso garantiza que aprenda?', 'No. Garantiza una estructura y una evaluación, pero el aprendizaje depende de tu práctica. El curso ofrece el mapa y las actividades; tú pones los casos y la constancia.'],
      ['¿Puedo combinar el curso con autoaprendizaje?', 'Es lo ideal. Usa el temario como columna vertebral y complementa con fuentes oficiales. Así evitas tanto la dispersión como la dependencia del curso.'],
      ['¿Cuándo no vale la pena un curso?', 'Cuando ya dominas el tema, cuando solo necesitas una definición puntual o cuando no tienes tiempo para practicar. En esos casos, una fuente oficial y un proyecto pequeño pueden ser suficientes.'],
    ]),
    cierre(p, angulo, ctx),
  );
}

export const CONSTRUCTORES = {
  'guia-de-estudio': construirGuiaDeEstudio,
  'para-que-sirve': construirParaQueSirve,
  temario: construirTemario,
  'plan-30-dias': construirPlan30Dias,
  errores: construirErrores,
  aplicacion: construirAplicacion,
  faq: construirFaq,
  comparativa: construirComparativa,
};

export function construirCuerpo(p, angulo, ctx) {
  const constructor = CONSTRUCTORES[angulo.id];
  if (!constructor) throw new Error(`Ángulo sin constructor: ${angulo.id}`);
  return constructor(p, angulo, ctx).replace(/\n{3,}/g, '\n\n').trim();
}

export function contarCaracteres(texto) {
  return String(texto).length;
}

export function palabrasDe(texto) {
  return normalizar(texto).split(/\s+/).filter(Boolean).length;
}
