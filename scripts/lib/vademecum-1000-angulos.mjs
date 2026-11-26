import { hash, normalizar } from './vademecum-1000-datos.mjs';

const parrafo = (...textos) => textos.filter(Boolean).join('\n\n');
const seccion = (titulo, ...bloques) => `## ${titulo}\n\n${bloques.filter(Boolean).join('\n\n')}`;
const subseccion = (titulo, ...bloques) => `### ${titulo}\n\n${bloques.filter(Boolean).join('\n\n')}`;
const lista = (items) => items.filter(Boolean).map((item) => `- ${item}`).join('\n');
const numerada = (items) => items.filter(Boolean).map((item, i) => `${i + 1}. ${item}`).join('\n');
const tabla = (cabeceras, filas) => [
  `| ${cabeceras.join(' | ')} |`,
  `| ${cabeceras.map(() => '---').join(' | ')} |`,
  ...filas.map((fila) => `| ${fila.map((x) => String(x ?? '').replace(/\|/g, '/')).join(' | ')} |`),
].join('\n');
const pick = (pool, semilla) => pool[hash(semilla) % pool.length];

const ctaVademecum = (p) => `> **Monografía revisada:** [${p.nombre}](${p.urlVademecum}). Contenido clínico revisado por ${p.revisor || 'el equipo de Edvanta'}. Este artículo es una guía de estudio y no reproduce posologías ni reemplaza la consulta.`;
const ctaCurso = (p) => {
  const titulo = p.curso?.titulo || p.titulo;
  const url = p.curso?.url || p.url;
  return url
    ? `> **Curso:** [${titulo}](${url}). Primera unidad gratis; certificado al completar el programa.`
    : '> **Cursos relacionados:** revisa el catálogo en [/cursos](/cursos).';
};
const ctaComunidad = (p) => {
  const nombre = p.comunidad?.nombre || p.nombre;
  const url = p.comunidad?.ruta || p.url;
  return url
    ? `> **Comunidad de pacientes:** [${nombre}](${url}). Acceso por WhatsApp, con reglas y moderación. No es un consultorio.`
    : '> **Comunidades de pacientes:** revisa las comunidades disponibles en [/comunidades](/comunidades).';
};

const fichaVad = (p) => parrafo(
  tabla(
    ['Dato', 'Valor'],
    [
      ['Nombre', p.nombre],
      ['Grupo', p.grupoObj?.nombre || p.grupo],
      ['Clase', p.clase || 'No declarada'],
      ['Código ATC', p.atc || 'No declarado'],
      ['Revisión clínica', `${p.revisor || 'Equipo editorial'}${p.reviewedAt ? ` · ${p.reviewedAt}` : ''}`],
      ['Secciones de la monografía', String(p.seccionesTitulos.length)],
    ],
  ),
  p.relacionados?.length
    ? tabla(['Monografía relacionada', 'Clase', 'ATC'], p.relacionados.slice(0, 4).map((m) => [m.nombre, m.clase || '—', m.atc || '—']))
    : '',
);

const PREGUNTA_POR_SECCION = {
  'Farmacoquímica': '¿Qué estructura o propiedad explica su comportamiento?',
  'Farmacodinamia': '¿Qué mecanismo produce el efecto?',
  'Farmacocinética': '¿Cómo se absorbe, distribuye, metaboliza y elimina?',
  'Indicaciones': '¿En qué contextos clínicos se usa?',
  'Posología y administración': '¿Qué información debe leerse completa en la monografía?',
  'Contraindicaciones y advertencias': '¿Qué situaciones exigen precaución o derivación?',
  'Interacciones': '¿Con qué grupos conviene revisar antes de aconsejar?',
  'Reacciones adversas': '¿Qué señales debe reconocer y reportar el equipo?',
  'Embarazo, lactancia y fertilidad': '¿Qué apartado revisar antes de acompañar a una persona gestante?',
  'Evidencia clínica': '¿Qué estudios sostienen el uso y con qué límites?',
  'Situación regulatoria': '¿Qué registro o estado legal conviene verificar?',
  'Atención farmacéutica (modelo de Minnesota)': '¿Cómo se documenta el seguimiento y la intervención?',
  'Experiencia farmacoterapéutica': '¿Qué preguntas hacer al paciente sobre su experiencia?',
};

const preguntaDeSeccion = (titulo, semilla) => PREGUNTA_POR_SECCION[titulo]
  || pick([
    '¿Qué decisión profesional permite tomar esta sección?',
    '¿Qué dato de esta sección conviene llevar a una nota de estudio?',
    '¿Cómo se conecta esta sección con el curso?',
    '¿Qué límite debe quedar claro antes de explicarla?',
  ], semilla);

const tablaSecciones = (p) => tabla(
  ['Sección', 'Qué aprender', 'Pregunta guía'],
  p.seccionesTitulos.slice(0, 10).map((titulo, i) => [
    titulo,
    `El lugar de la monografía donde se desarrolla ${titulo.toLowerCase()}.`,
    preguntaDeSeccion(titulo, `${p.slug}:${i}`),
  ]),
);

const clasesDelCurso = (p, cuantas, extra) => {
  const clases = (p.curso?.clases || p.clases || []).filter((c) => c.titulo);
  if (!clases.length) return [];
  const url = p.curso?.url || p.url || 'curso';
  const inicio = hash(`${url}:${extra}`) % clases.length;
  return Array.from({ length: Math.min(cuantas, clases.length) }, (_, i) => clases[(inicio + i) % clases.length]);
};

const monografiasDelPerfil = (p, cuantas) => (p.monografias || []).slice(0, cuantas);

const bloqueRecursos = (p) => {
  const items = [];
  if (p.urlVademecum) items.push(`[Monografía de ${p.nombre}](${p.urlVademecum})`);
  if (p.urlGrupo) items.push(`[Grupo terapéutico](${p.urlGrupo})`);
  if (p.curso) items.push(`[${p.curso.titulo}](${p.curso.url})`);
  if (p.comunidad) items.push(`[Comunidad de ${p.comunidad.nombre}](${p.comunidad.ruta})`);
  if (p.articulosPaciente?.length) {
    items.push(`Artículos para pacientes: ${p.articulosPaciente.map((s) => `[/articulos/${s}](/articulos/${s})`).join(', ')}`);
  }
  return lista(items);
};

const cierre = (p, extra = '') => {
  const enlace = p.urlVademecum
    ? `[la monografía de ${p.nombre}](${p.urlVademecum})`
    : p.url
      ? `[${p.titulo || p.nombre}](${p.url})`
      : '[el catálogo de cursos](/cursos)';
  return seccion(
    'Siguiente paso',
    extra || `Lee ${enlace}, revisa el curso o la comunidad relacionada y lleva tus dudas concretas al equipo o al foro.`,
    '> Contenido educativo para profesionales. No indica dosis, no cambia tratamientos y no sustituye la valoración del equipo tratante.',
  );
};

const faq = (titulo, preguntas) => seccion(
  titulo,
  preguntas.map(([q, a]) => subseccion(q, a)).join('\n\n'),
);

const introVad = (p) => parrafo(
  `La monografía de **${p.nombre}** reúne la información clínica revisada de ${p.grupoObj?.nombre || p.grupo}: clase, mecanismo, farmacocinética, indicaciones, advertencias, interacciones, evidencia y atención farmacéutica. Este artículo no la repite: te enseña a estudiarla, a ubicar cada sección y a usarla con un curso y, cuando existe, con una comunidad de pacientes.`,
  pick([
    `El punto de partida es la monografía revisada por ${p.revisor || 'el equipo editorial'}. Allí está la información que un profesional necesita; aquí tienes el método para convertirla en criterio y en una práctica documentada.`,
    `No necesitas memorizar la monografía de ${p.nombre} de una vez. Necesitas saber qué pregunta responde cada sección, en qué orden estudiarla y cómo comprobar que puedes explicarla sin leerla.`,
    `La monografía es la fuente; el curso es la práctica guiada; la comunidad es el lugar donde esa información se convierte en educación, con límites claros y sin invasión de la consulta.`,
  ], `${p.slug}:intro`),
);

const cursoTexto = (p) => {
  const c = p.curso || p;
  return c?.url
    ? `El curso [${c.titulo}](${c.url}) tiene ${p.nUnidades ?? c.nUnidades ?? 0} unidades y ${p.nClases ?? c.nClases ?? 0} clases. Úsalo para practicar lo que la monografía explica: no para repetir definiciones, sino para resolver casos y documentar decisiones.`
    : 'No hay un curso específico vinculado a esta monografía en el catálogo actual. Puedes usar el catálogo [/cursos](/cursos) y el vademécum como fuentes complementarias.';
};

export function construirVadComoEstudiar(p) {
  const sesiones = p.seccionesTitulos.slice(0, 6);
  const clases = clasesDelCurso(p, 5, 'estudiar');
  return parrafo(
    `# Cómo estudiar ${p.nombre} con el vademécum de Edvanta`,
    introVad(p),
    ctaVademecum(p),
    fichaVad(p),
    seccion(
      'Qué contiene la monografía',
      `Antes de estudiar, mira el mapa. Cada sección responde una pregunta distinta y conviene leerlas en este orden:`,
      tablaSecciones(p),
      `La sección de posología y las advertencias se leen completas en la monografía. Este artículo no reproduce dosis ni indicaciones para evitar que un resumen se confunda con una prescripción.`,
    ),
    seccion(
      'Seis sesiones de estudio',
      tabla(
        ['Sesión', 'Qué leer', 'Tarea al terminar'],
        sesiones.map((s, i) => [
          `Sesión ${i + 1}`,
          s,
          `Escribir la pregunta que responde “${s}” y un ejemplo de cómo la usarías en una nota o en una conversación con el equipo.`,
        ]),
      ),
      `Si una sección te lleva más de una sesión, está bien. La meta es poder explicar el criterio, no marcar una casilla.`,
    ),
    seccion(
      'Cómo conectar la monografía con el curso',
      cursoTexto(p),
      clases.length
        ? tabla(
          ['Clase del curso', 'Cómo se conecta'],
          clases.map((c) => [c.titulo, `Úsala para practicar la sección “${preguntaDeSeccion(p.seccionesTitulos[0] || 'Farmacodinamia', c.titulo)}” con un caso del curso.`]),
        )
        : '',
      `Después de cada clase, vuelve a la monografía y escribe qué sección te ayudó a entender mejor el caso. Esa trazabilidad es la que se convierte en criterio.`,
    ),
    seccion(
      'Cómo usarla con una comunidad de pacientes',
      p.comunidad
        ? `La comunidad de [${p.comunidad.nombre}](${p.comunidad.ruta}) no es un consultorio. Puedes usar la monografía para preparar una explicación general, pero no para dar dosis, interpretar exámenes ni cambiar tratamientos. ${p.comunidad.noEs}`
        : 'Si acompañas una comunidad, usa la monografía para preparar una explicación general y deriva las preguntas clínicas al equipo tratante. No conviertas el grupo en un consultorio.',
      p.comunidad ? `Antes de una sesión, revisa las reglas de la comunidad: ${lista(p.comunidad.reglas || []).replace(/\n/g, ' ')}` : '',
    ),
    seccion(
      'Errores de estudio que conviene evitar',
      lista([
        'Leer la posología primero y creer que ya entiendes el medicamento.',
        'Memorizar marcas sin clase, mecanismo y grupo terapéutico.',
        'Estudiar la monografía sin abrir el curso ni practicar con un caso.',
        'Usar un resumen para responder una pregunta clínica que exige la monografía completa.',
        'Llevar a una comunidad una recomendación que corresponde al equipo tratante.',
      ]),
    ),
    faq('Preguntas frecuentes', [
      ['¿Necesito leer toda la monografía?', `Sí, si vas a usar la información en una conversación profesional. La monografía de ${p.nombre} está revisada y contiene las advertencias y la posología que un resumen no puede sustituir.`],
      ['¿Este artículo reemplaza la monografía?', 'No. Es una guía de estudio. La fuente clínica es la monografía enlazada.'],
      ['¿Puedo estudiar solo con el curso?', `El curso ayuda, pero no sustituye la lectura de la monografía. Úsalos juntos: el curso te da práctica y la monografía te da el detalle revisado.`],
      ['¿Puedo compartirlo en una comunidad?', 'Puedes compartir la guía y la monografía con profesionales. Para pacientes, usa los artículos y comunidades enlazados y evita dosis o cambios de tratamiento.'],
    ]),
    cierre(p),
  );
}

const UNIDAD_DE_DOSIS = /\b\d+(?:[.,]\d+)?\s?(mg|mcg|µg|ml|UI|mmol|mEq)\b/i;

export function construirVadPreguntas(p) {
  const mecanismo = UNIDAD_DE_DOSIS.test(String(p.mecanismo || '')) ? '' : String(p.mecanismo || '').trim();
  const preguntas = [
    ['¿Cuál es la clase farmacológica y el código ATC?', `La monografía clasifica ${p.nombre} como ${p.clase || 'un medicamento del grupo ' + (p.grupoObj?.nombre || p.grupo)} y registra el código ATC ${p.atc || 'en la ficha revisada'}. Esos dos datos son el punto de partida para ubicarlo en el grupo y compararlo con otras alternativas.`],
    ['¿Qué mecanismo explica su efecto?', mecanismo ? `La monografía describe este mecanismo: ${mecanismo}` : `La monografía desarrolla el mecanismo en la sección de farmacodinamia. Léela completa antes de resumirla.`],
    ['¿Qué sección responde cómo se absorbe y elimina?', 'La sección de farmacocinética. Allí se revisan absorción, distribución, metabolismo y eliminación; son los datos que explican por qué ciertas poblaciones requieren más vigilancia.'],
    ['¿Qué sección contiene las advertencias?', 'La sección de contraindicaciones y advertencias. Es la que debes leer completa antes de cualquier conversación profesional; este artículo no la resume en una lista de dosis.'],
    ['¿Dónde se estudian las interacciones?', 'En la sección de interacciones. No basta con memorizar una lista: hay que entender el mecanismo y el contexto del paciente.'],
    ['¿Cómo se estudian las reacciones adversas?', 'En la sección de reacciones adversas. La pregunta útil es qué señal debe reconocer el equipo, cómo se documenta y cuándo se deriva.'],
    ['¿Qué apartado revisar en embarazo y lactancia?', 'La sección de embarazo, lactancia y fertilidad. Es un tema que no se resuelve con una frase ni con una recomendación general.'],
    ['¿Qué evidencia sostiene el uso?', 'La sección de evidencia clínica. Allí están los estudios y sus límites; no los conviertas en una promesa de resultado.'],
    ['¿Qué información regulatoria revisar?', 'La sección de situación regulatoria. Sirve para verificar el estado del registro y no para reemplazar la consulta a la autoridad sanitaria.'],
    ['¿Cómo se aplica el modelo de Minnesota?', 'La sección de atención farmacéutica describe el proceso: evaluar la necesidad, identificar problemas, plantear un plan, documentar y hacer seguimiento.'],
    ['¿Qué preguntas hacer al paciente?', 'La sección de experiencia farmacoterapéutica propone preguntas abiertas sobre lo que vive, lo que entiende y lo que le preocupa. Ninguna sustituye la entrevista clínica.'],
    ['¿Qué debo evitar al explicar esta monografía?', 'Evita dar dosis, cambiar tratamientos, interpretar exámenes o prometer resultados. Explica el mapa de la monografía y deriva las decisiones al equipo tratante.'],
  ];
  return parrafo(
    `# Preguntas de estudio sobre ${p.nombre}, con respuestas`,
    introVad(p),
    ctaVademecum(p),
    seccion(
      'Cómo usar este cuestionario',
      `Las preguntas están ordenadas como la monografía. No buscan que memorices cifras: buscan que puedas ubicar la información y explicar por qué importa. Las respuestas remiten a la sección correspondiente y no reproducen posologías.`,
      lista([
        'Responde primero sin mirar la monografía.',
        'Marca las preguntas que no puedas explicar con tus palabras.',
        'Vuelve a la sección exacta, no a todo el documento.',
        'Cierra con una nota de una página y un ejemplo propio.',
      ]),
    ),
    seccion('Preguntas frecuentes', preguntas.map(([q, a], i) => subseccion(`Pregunta ${i + 1}. ${q}`, a)).join('\n\n')),
    seccion(
      'Cómo llevar estas preguntas al curso',
      cursoTexto(p),
      `Elige tres preguntas y conviértelas en un caso para el foro del curso. Un caso con una decisión y una evidencia vale más que diez definiciones copiadas.`,
    ),
    faq('Preguntas frecuentes', [
      ['¿Estas respuestas son consejo clínico?', 'No. Son preguntas de estudio basadas en la monografía revisada. La decisión clínica corresponde al equipo tratante.'],
      ['¿Puedo usar las preguntas en una evaluación?', 'Sí, como repaso. Si las usas en una evaluación, asegúrate de que las respuestas se contrasten con la monografía completa.'],
      ['¿Por qué no hay dosis en las respuestas?', 'Porque un artículo de estudio no debe convertirse en una prescripción. La posología revisada está en la monografía y se lee en contexto.'],
    ]),
    cierre(p),
  );
}

export function construirVadRuta30(p) {
  const semanas = [0, 1, 2, 3].map((semana) => {
    const secciones = p.seccionesTitulos.filter((_, i) => i % 4 === semana);
    return subseccion(
      `Semana ${semana + 1}`,
      secciones.length ? lista(secciones.map((s) => `**${s}:** ${preguntaDeSeccion(s, `${p.slug}:${semana}:${s}`)}`)) : 'Repasa las secciones anteriores y produce un ejemplo propio.',
      `**Entregable:** una nota de una página con la idea central, una duda y un ejemplo de aplicación.`,
    );
  }).join('\n\n');
  return parrafo(
    `# Plan de 30 días para estudiar ${p.nombre}`,
    introVad(p),
    ctaVademecum(p),
    seccion(
      'Antes de empezar: diagnóstico de 20 minutos',
      lista([
        `¿Puedo explicar qué es ${p.nombre} y a qué grupo pertenece sin mirar la monografía?`,
        '¿Qué sección me genera más dudas y por qué?',
        '¿Qué curso o clase puedo usar para practicar?',
        '¿Tengo una comunidad o un caso real donde aplicar lo aprendido?',
        '¿Qué evidencia podría producir en cuatro semanas?',
      ]),
    ),
    seccion('El plan, semana por semana', semanas),
    seccion(
      'Cómo medir el avance',
      tabla(
        ['Indicador', 'Cómo comprobarlo'],
        [
          ['Cobertura', `Secciones trabajadas sobre ${p.seccionesTitulos.length}.`],
          ['Comprensión', 'Puedes explicar clase, mecanismo y farmacocinética sin leer.'],
          ['Aplicación', 'Tienes un ejemplo propio por semana.'],
          ['Curso', 'Resuelves al menos una actividad o evaluación del curso.'],
          ['Comunidad', p.comunidad ? 'Puedes preparar una sesión educativa sin dar dosis.' : 'Puedes explicar el límite entre educación y consulta.'],
        ],
      ),
    ),
    seccion(
      'Cómo cerrar el mes con una acción educativa',
      p.comunidad
        ? `Prepara una sesión de 20 minutos para la comunidad de [${p.comunidad.nombre}](${p.comunidad.ruta}) con tres ideas generales, una pregunta abierta y una frase de derivación. No incluyas dosis ni cambios de tratamiento.`
        : `Prepara una nota o una charla breve para tu equipo con tres ideas generales, una pregunta abierta y una frase de derivación. No incluyas dosis ni cambios de tratamiento.`,
    ),
    faq('Preguntas frecuentes', [
      ['¿30 días alcanzan para dominar la monografía?', `Alcanzan para estudiarla con orden y producir evidencia. Dominarla requiere práctica y casos; usa el curso y la monografía como referencias permanentes.`],
      ['¿Qué pasa si me atraso?', 'Reduce el alcance, no la frecuencia. Retoma en la última sección que puedas explicar y conserva el entregable semanal.'],
      ['¿Necesito el curso?', 'No es obligatorio, pero ayuda a practicar. Si no tienes curso, usa un caso propio y la monografía.'],
    ]),
    cierre(p),
  );
}

export function construirVadComunidades(p) {
  return parrafo(
    `# Cómo hablar de ${p.nombre} en una comunidad de pacientes`,
    `La monografía de ${p.nombre} es material para profesionales. En una comunidad de pacientes, el objetivo no es convertir la monografía en una charla técnica ni en una receta: es ayudar a entender qué es el medicamento, por qué el equipo lo indica, qué preguntas conviene llevar a la consulta y cuándo pedir ayuda.`,
    ctaVademecum(p),
    ctaComunidad(p),
    seccion(
      'Qué puedes explicar y qué no',
      tabla(
        ['Sí puedes explicar', 'No debes hacerlo en la comunidad'],
        [
          ['Qué es el medicamento y a qué grupo pertenece.', 'Indicar dosis, horarios o cambios de tratamiento.'],
          ['Para qué se usa, en términos generales y sin prometer resultados.', 'Interpretar exámenes o decidir si el tratamiento funciona.'],
          ['Qué preguntas llevar a la consulta.', 'Suspender o reemplazar un medicamento.'],
          ['Qué sección de la monografía puede consultar un profesional.', 'Diagnosticar o resolver una urgencia por chat.'],
        ],
      ),
      `La monografía completa está en [${p.urlVademecum}](${p.urlVademecum}). Este artículo no reproduce posología ni advertencias específicas.`,
    ),
    seccion(
      'Guion de una sesión de 30 minutos',
      tabla(
        ['Momento', 'Qué hacer', 'Material'],
        [
          ['5 minutos', 'Presentar el objetivo y las reglas: educación, no consulta.', 'Reglas de la comunidad.'],
          ['10 minutos', 'Explicar qué es el medicamento con una frase sencilla y una pregunta abierta.', `Monografía de ${p.nombre} (solo para el profesional).`],
          ['10 minutos', 'Responder dudas generales y anotar las que necesitan consulta.', 'Hoja de preguntas.'],
          ['5 minutos', 'Cerrar con tres preguntas para la próxima cita y una frase de derivación.', 'Artículos para pacientes.'],
        ],
      ),
    ),
    seccion(
      'Preguntas que suelen aparecer',
      lista([
        '“¿Este medicamento me va a curar?” — Explica el objetivo general sin prometer resultados; la respuesta individual la da el equipo tratante.',
        '“¿Puedo cambiar la dosis?” — No. La dosis la decide el equipo que conoce el caso.',
        '“¿Qué hago si olvidé una toma?” — Remite al equipo o al prospecto; no improvises una conducta.',
        '“¿Puedo tomar hierbas o suplementos?” — Pide que lo consulten; las interacciones se revisan en la monografía y en la consulta.',
        '“¿Por qué me siento mal?” — Escucha, registra y deriva; no interpretes síntomas por chat.',
      ]),
    ),
    seccion('Recursos para la sesión', bloqueRecursos(p)),
    faq('Preguntas frecuentes', [
      ['¿Puedo compartir la monografía en el grupo?', 'La monografía es para profesionales. Comparte los artículos para pacientes y la comunidad; si compartes la monografía, aclara que no es una recomendación individual.'],
      ['¿Qué hago si alguien pide una dosis?', 'Responde que no puedes indicarla por chat y que esa decisión corresponde al equipo tratante. Ofrece ayuda para preparar la pregunta.'],
      ['¿Cómo cierro la sesión?', 'Con tres preguntas para la cita, una señal de alarma general y el enlace a la comunidad y a los artículos revisados.'],
    ]),
    cierre(p, 'Prepara la sesión con la monografía, el curso y las reglas de la comunidad. Si el caso es individual, deriva.'),
  );
}

const cursoUnidades = (p) => p.unidades?.length
  ? p.unidades.slice(0, 6).map((u) => [u.nombre, String(u.clases.length), u.clases[0]?.titulo || ''])
  : [['Contenido del curso', String(p.nClases || 0), 'Repasa el temario en la ficha.']];

const cursoTablaUnidades = (p) => tabla(['Unidad', 'Clases', 'Primera clase'], cursoUnidades(p));

const tablaClasesCurso = (p, cuantas = 8) => {
  const clases = clasesDelCurso(p, cuantas, `clases-${p.url}`);
  return tabla(
    ['Clase', 'Unidad', 'Pregunta para el foro'],
    clases.map((c) => {
      const unidad = (p.unidades || []).find((u) => u.clases?.some((x) => x.titulo === c.titulo))?.nombre || 'Contenido del curso';
      return [c.titulo, unidad, `¿Cómo aplicarías “${c.titulo}” en un caso real?`];
    }),
  );
};

const fichaComunidad = (p) => tabla(
  ['Dato', 'Contenido'],
  [
    ['Para quién', p.apoyo?.para || p.nombre],
    ['Qué encuentras', (p.queEncuentras || []).slice(0, 3).join(' ') || 'Experiencias, preguntas y recursos educativos.'],
    ['Reglas', (p.reglas || []).slice(0, 3).join(' ') || 'No se comparten dosis ni datos clínicos.'],
    ['No es', p.noEs || 'No es un consultorio ni un servicio de urgencias.'],
  ],
);

const preguntasComunidad = (p) => {
  const propias = (p.apoyo?.preguntas || []).map(([q, a]) => `**${q}** ${a}`);
  return lista([
    ...propias,
    `**¿Qué es la comunidad de ${p.nombre}?** ${p.resumen}`,
    `**¿Qué recursos puedo usar?** El curso, las monografías para profesionales y los artículos para pacientes.`,
    `**¿Se comparten dosis?** No. La comunidad no ajusta tratamientos.`,
    `**¿Qué hago en una urgencia?** ${p.noEs || 'Buscar atención médica inmediata.'}`,
  ]);
};

const planComunidad = (p) => tabla(['Sesión', 'Objetivo', 'Recursos'], [
  ['1', 'Escuchar y ordenar preguntas.', 'Reglas y artículos para pacientes.'],
  ['2', 'Explicar un tema general sin dosis.', 'Curso y monografía para el profesional.'],
  ['3', 'Preparar la próxima cita.', 'Hoja de preguntas y artículo revisado.'],
  ['4', 'Evaluar y ajustar.', 'Retroalimentación de tres personas.'],
]);

const tablaArticulosComunidad = (p) => {
  const filas = [];
  for (const slug of (p.articulosValidos || []).slice(0, 4)) {
    filas.push([`[Artículo](/articulos/${slug})`, 'Lectura para pacientes', `[/articulos/${slug}]`]);
  }
  for (const m of (p.monografias || []).slice(0, 4)) {
    filas.push([`[${m.nombre}](/vademecum/${m.slug})`, 'Monografía para profesionales', 'No se usa para dar dosis en el grupo.']);
  }
  return filas.length ? tabla(['Recurso', 'Para quién', 'Cómo usarlo'], filas) : '';
};

const recursosCurso = (p) => lista([
  `[Ficha del curso](${p.url})`,
  p.monografias?.length ? `Vademécum: ${p.monografias.slice(0, 4).map((m) => `[${m.nombre}](/vademecum/${m.slug})`).join(', ')}` : '[Vademécum](/vademecum)',
  p.comunidad ? `[Comunidad de ${p.comunidad.nombre}](${p.comunidad.ruta})` : '[Comunidades de pacientes](/comunidades)',
  p.grupo ? `[Grupo terapéutico: ${p.grupo.nombre}](/vademecum/${p.grupo.slug})` : '',
]);

export function construirCursoConVademecum(p) {
  const clases = clasesDelCurso(p, 6, 'vademecum');
  return parrafo(
    `# ${p.temaCorto}: cómo estudiar el curso con el vademécum`,
    `El curso [${p.titulo}](${p.url}) tiene ${p.nUnidades} unidades y ${p.nClases} clases. El vademécum tiene monografías revisadas que pueden ayudarte a estudiar los temas con una fuente clínica ordenada. La clave no es estudiar dos veces lo mismo: es usar el curso para practicar y el vademécum para consultar el detalle revisado.`,
    ctaCurso(p),
    seccion(
      'Qué aporta cada recurso',
      tabla(
        ['Recurso', 'Para qué sirve', 'Cómo lo usas'],
        [
          ['Curso', 'Secuencia, actividades y evaluación.', 'Avanzas por unidades y produces evidencia.'],
          ['Vademécum', 'Monografías revisadas por grupo terapéutico.', 'Consultas la sección exacta y no lo usas como receta.'],
          ['Comunidad', 'Educación entre pares y acompañamiento.', 'Compartes recursos generales, no dosis ni diagnósticos.'],
        ],
      ),
    ),
    seccion('Mapa del curso', cursoTablaUnidades(p)),
    seccion('Clases y preguntas', tablaClasesCurso(p, 14)),
    seccion(
      'Cómo conectar cada unidad con el vademécum',
      p.monografias?.length
        ? tabla(
          ['Unidad del curso', 'Monografías relacionadas', 'Tarea'],
          cursoUnidades(p).map(([unidad], i) => [
            unidad,
            p.monografias.slice(i, i + 2).map((m) => `[${m.nombre}](/vademecum/${m.slug})`).join(', ') || '[Vademécum](/vademecum)',
            'Escribe una pregunta que la monografía responda y llévala al foro.',
          ]),
        )
        : `No hay monografías directamente vinculadas a este curso. Usa el [vademécum general](/vademecum) para consultar términos y el curso para la práctica.`,
    ),
    seccion(
      'Seis sesiones de estudio',
      tabla(
        ['Sesión', 'Clase o unidad', 'Evidencia'],
        clases.map((c, i) => [`Sesión ${i + 1}`, c.titulo, `Nota de cinco líneas y una pregunta para el foro.`]),
      ),
    ),
    seccion('Recursos', recursosCurso(p)),
    faq('Preguntas frecuentes', [
      ['¿El vademécum reemplaza el curso?', 'No. El curso te da práctica guiada; el vademécum te da la monografía revisada. Se complementan.'],
      ['¿Puedo estudiar solo las monografías?', 'Puedes, pero te faltará la práctica y la evaluación del curso. Si eliges esa ruta, produce tus propios casos y evidencias.'],
      ['¿Puedo usar el vademécum con pacientes?', 'Solo como material de consulta profesional. Para pacientes, usa los artículos y comunidades enlazados y evita dosis o cambios de tratamiento.'],
      ['¿Cómo sé qué monografía corresponde a cada clase?', 'Revisa los enlaces de la clase y el grupo terapéutico. Si no hay enlace directo, busca el grupo en /vademecum.'],
    ]),
    cierre(p),
  );
}

export function construirCursoConComunidad(p) {
  const comunidad = p.comunidad;
  return parrafo(
    `# ${p.temaCorto} y la comunidad de pacientes: cómo acompañar`,
    comunidad
      ? `La comunidad de [${comunidad.nombre}](${comunidad.ruta}) reúne a ${comunidad.apoyo?.para || 'personas con la condición y sus cuidadores'}. El curso te da formación; la comunidad te da un lugar donde esa formación se convierte en educación, sin invadir la consulta.`
      : `Este curso no tiene una comunidad específica vinculada. Puedes usar la formación para acompañar comunidades desde [/comunidades](/comunidades), con límites claros y sin convertir el grupo en un consultorio.`,
    ctaCurso(p),
    comunidad ? ctaComunidad(p) : '',
    seccion('Mapa de unidades del curso', cursoTablaUnidades(p), tablaClasesCurso(p, 12)),
    seccion(
      'Qué puede hacer el curso por la comunidad',
      lista([
        'Ordenar conceptos para explicar sin tecnicismos innecesarios.',
        'Preparar preguntas que las personas pueden llevar a su cita.',
        'Distinguir educación de consejo clínico individual.',
        'Documentar actividades y materiales para mejorar la próxima sesión.',
      ]),
    ),
    seccion(
      'Límites que no se negocian',
      lista([
        'No se indican dosis ni cambios de tratamiento por chat.',
        'No se interpretan exámenes ni se confirma un diagnóstico.',
        'No se comparten datos clínicos de otras personas.',
        'No se prometen curas, resultados ni testimonios inventados.',
        comunidad?.noEs ? `La comunidad lo dice claro: ${comunidad.noEs}` : 'Si hay una urgencia, se deriva a atención médica inmediata.',
      ]),
    ),
    seccion(
      'Guion de acompañamiento en cuatro pasos',
      numerada([
        'Escucha la pregunta y reformúlala en lenguaje claro.',
        'Responde solo lo general y señala qué parte necesita la consulta.',
        'Comparte un recurso revisado: artículo, guía o monografía para profesionales.',
        'Cierra con una pregunta para la cita y una frase de derivación.',
      ]),
    ),
    seccion('Recursos', recursosCurso(p)),
    faq('Preguntas frecuentes', [
      ['¿El curso me certifica para atender pacientes?', 'El curso es formación profesional; no reemplaza la habilitación legal ni la práctica supervisada.'],
      ['¿Puedo dar consultas en la comunidad?', 'No. La comunidad es un espacio educativo y de apoyo; las decisiones clínicas corresponden al equipo tratante.'],
      ['¿Qué hago si alguien comparte una captura de exámenes?', 'No la interpretes. Pide permiso para borrarla y orienta a la persona a llevarla a su cita.'],
      ['¿Cómo entro a la comunidad?', comunidad ? `Lee las reglas y entra desde [${comunidad.ruta}](${comunidad.ruta}).` : 'Revisa las comunidades disponibles en /comunidades.'],
    ]),
    cierre(p),
  );
}

export function construirCursoRuta30(p) {
  const unidades = p.unidades?.length ? p.unidades : [{ nombre: 'Contenido del curso', clases: [] }];
  const semanas = [0, 1, 2, 3].map((semana) => {
    const asignadas = unidades.filter((_, i) => i % 4 === semana);
    const listaUnidades = asignadas.length ? asignadas : [unidades[semana % unidades.length]];
    return subseccion(
      `Semana ${semana + 1}`,
      `Trabaja ${listaUnidades.map((u) => `“${u.nombre}”`).join(' y ')}.`,
      listaUnidades.flatMap((u) => u.clases.slice(0, 5)).map((c) => `**${c.titulo}:** estudia la clase y escribe una aplicación de una frase.`).join('\n'),
      `**Entregable:** una nota con un concepto, un ejemplo y una pregunta para la comunidad o el foro.`,
    );
  }).join('\n\n');
  return parrafo(
    `# Ruta de 30 días: ${p.temaCorto}, vademécum y comunidad`,
    `Esta ruta combina tres recursos reales: el curso [${p.titulo}](${p.url}), las monografías del vademécum y una comunidad de pacientes. No busca que hagas todo a la vez, sino que cada semana produzcas una evidencia.`,
    ctaCurso(p),
    seccion('Mapa de unidades', cursoTablaUnidades(p)),
    seccion(
      'Antes de empezar',
      lista([
        'Elige una unidad que puedas aplicar en tu trabajo o en una comunidad.',
        'Revisa si hay una monografía relacionada y qué sección te falta leer.',
        'Define una evidencia semanal: nota, pregunta, guion o lista de verificación.',
        'Protege tres bloques de 45 minutos por semana.',
      ]),
    ),
    seccion('El plan, semana por semana', semanas),
    seccion(
      'Cómo medir el avance',
      tabla(
        ['Indicador', 'Cómo comprobarlo'],
        [
          ['Cobertura', `Unidades trabajadas sobre ${p.nUnidades}.`],
          ['Comprensión', 'Puedes explicar cada unidad sin leer el material.'],
          ['Aplicación', 'Tienes un ejemplo propio por semana.'],
          ['Vademécum', 'Consultaste al menos una monografía y ubicaste la sección exacta.'],
          ['Comunidad', p.comunidad ? 'Preparaste una actividad educativa sin dar dosis.' : 'Definiste un límite claro entre educación y consulta.'],
        ],
      ),
    ),
    seccion('Recursos de la ruta', recursosCurso(p)),
    faq('Preguntas frecuentes', [
      ['¿Puedo hacer la ruta sin la comunidad?', 'Sí. Sustituye la actividad comunitaria por una nota para tu equipo o un caso del curso.'],
      ['¿Qué pasa si no tengo el curso completo?', 'Puedes empezar por la primera unidad gratis y usar la monografía como referencia.'],
      ['¿Cómo cierro el mes?', 'Con una nota de una página, un ejemplo y una pregunta que todavía no puedas responder. Esa pregunta es el siguiente paso.'],
    ]),
    cierre(p),
  );
}

export function construirCursoPreguntas(p) {
  const comunidad = p.comunidad;
  const primeras = p.monografias?.slice(0, 3) || [];
  const preguntas = [
    ['¿Qué incluye el curso?', `El curso [${p.titulo}](${p.url}) tiene ${p.nUnidades} unidades y ${p.nClases} clases, con ${p.evaluaciones || 0} evaluaciones y ${p.actividades || 0} actividades.`],
    ['¿Para quién es?', `Está dirigido a ${p.publico}. El nivel declarado es ${p.nivel}.`],
    ['¿Cuánto dura?', p.horas ? `La ficha declara unas ${p.horas} horas.` : `El contenido suma ${p.nClases} clases; revisa la ficha para la duración vigente.`],
    ['¿Cómo se complementa con el vademécum?', primeras.length ? `Puedes consultar ${primeras.map((m) => `[${m.nombre}](/vademecum/${m.slug})`).join(', ')} para el detalle revisado.` : 'Puedes consultar el [vademécum general](/vademecum) para términos y grupos terapéuticos.'],
    ['¿Tiene comunidad de pacientes?', comunidad ? `Sí: [${comunidad.nombre}](${comunidad.ruta}). Es un espacio educativo, no un consultorio.` : 'No tiene una comunidad específica; puedes revisar [/comunidades](/comunidades).'],
    ['¿Puedo usar el curso para dar consejos clínicos?', 'No. El curso es formación; las decisiones clínicas corresponden al equipo tratante y a tu competencia profesional.'],
    ['¿Puedo compartir el vademécum en la comunidad?', 'La monografía es para profesionales. Comparte artículos para pacientes y aclara que no es una recomendación individual.'],
    ['¿Cómo documento lo aprendido?', 'Con una nota, un caso, una lista de verificación o una actividad educativa. El certificado acompaña, pero no sustituye la evidencia.'],
    ['¿Puedo estudiar mientras trabajo?', 'Sí, con sesiones cortas y un entregable semanal. La constancia importa más que la duración.'],
    ['¿Qué hago si una persona pide una dosis?', 'No la indiques por chat. Ayuda a preparar la pregunta y deriva al equipo tratante.'],
    ['¿Cómo elijo una monografía?', 'Por el grupo terapéutico del curso y por la unidad que estés estudiando.'],
    ['¿Qué sigue después del curso?', 'Aplicar una unidad en un caso real, documentar el resultado y revisar la monografía correspondiente.'],
  ];
  return parrafo(
    `# Preguntas frecuentes: ${p.temaCorto}, vademécum y comunidad`,
    `Estas respuestas conectan el curso, el vademécum y las comunidades con las dudas que más aparecen antes de inscribirse o de usar los recursos.`,
    ctaCurso(p),
    seccion('Mapa de unidades y clases', cursoTablaUnidades(p), tablaClasesCurso(p, 14)),
    seccion('Preguntas frecuentes', preguntas.map(([q, a], i) => subseccion(`Pregunta ${i + 1}. ${q}`, a)).join('\n\n')),
    seccion('Recursos', recursosCurso(p)),
    cierre(p),
  );
}

export function construirCursoTaller(p) {
  return parrafo(
    `# Cómo preparar un taller educativo con ${p.temaCorto}`,
    `Un taller útil no es una clase magistral. Es una sesión corta con un objetivo, una actividad, una pregunta y una derivación clara. Este guion usa el curso, el vademécum y, si existe, la comunidad de pacientes.`,
    ctaCurso(p),
    seccion('Contenido del curso para el taller', cursoTablaUnidades(p), tablaClasesCurso(p, 12)),
    seccion(
      'Antes del taller',
      lista([
        'Define un solo objetivo educativo y escríbelo en una frase.',
        'Elige una unidad del curso y una sección de la monografía.',
        'Revisa las reglas de la comunidad y el límite entre educación y consulta.',
        'Prepara una actividad de 10 minutos y una hoja de preguntas.',
      ]),
    ),
    seccion(
      'Guion de 60 minutos',
      tabla(
        ['Momento', 'Actividad', 'Material'],
        [
          ['10 min', 'Bienvenida, objetivo y reglas.', 'Reglas de la comunidad.'],
          ['15 min', 'Explicación general con una pregunta abierta.', 'Nota de la unidad del curso.'],
          ['20 min', 'Actividad: ordenar preguntas para la cita o resolver un mito.', 'Hoja de trabajo.'],
          ['10 min', 'Cierre: tres ideas, una señal de alarma y derivación.', 'Artículos para pacientes.'],
          ['5 min', 'Evaluación breve: qué se llevan y qué falta.', 'Formulario de una pregunta.'],
        ],
      ),
    ),
    seccion(
      'Cómo usar el vademécum sin convertirlo en receta',
      p.monografias?.length
        ? `Puedes preparar la explicación con ${p.monografias.slice(0, 3).map((m) => `[${m.nombre}](/vademecum/${m.slug})`).join(', ')}. No leas la posología en voz alta ni respondas dosis: usa la monografía para entender el tema y deriva las decisiones.`
        : 'Usa el [vademécum](/vademecum) como referencia profesional. No leas posologías ni respondas dosis en el taller.',
    ),
    seccion(
      'Evaluación del taller',
      lista([
        '¿Se cumplió el objetivo en una frase?',
        '¿Las personas hicieron al menos una pregunta?',
        '¿Quedó claro qué deben consultar y con quién?',
        '¿El material usado era revisado y estaba enlazado?',
        '¿La próxima sesión tiene un objetivo distinto?',
      ]),
    ),
    seccion('Recursos', recursosCurso(p)),
    faq('Preguntas frecuentes', [
      ['¿Necesito ser profesional de salud para dar el taller?', 'Debes tener la formación y la competencia para el tema. Si no, invita a un profesional y limita tu rol a la organización.'],
      ['¿Puedo dar dosis en el taller?', 'No. El taller es educativo; las dosis se deciden en la consulta.'],
      ['¿Cómo mido el impacto?', 'Con una evaluación breve de comprensión y una acción concreta que las personas se lleven.'],
    ]),
    cierre(p),
  );
}

export function construirCursoEvidencia(p) {
  return parrafo(
    `# ${p.temaCorto}: cómo documentar lo aprendido`,
    `Terminar un curso no es evidencia suficiente. La evidencia es lo que puedes mostrar: una nota, un caso, una lista de verificación, una actividad educativa o una mejora documentada. Este artículo te ayuda a producirla sin exagerar resultados clínicos.`,
    ctaCurso(p),
    seccion('Unidades y evidencias', cursoTablaUnidades(p), tablaClasesCurso(p, 14)),
    seccion(
      'Qué evidencia sirve',
      tabla(
        ['Evidencia', 'Qué demuestra', 'Cómo la produces'],
        [
          ['Nota de estudio', 'Comprensión y criterio.', 'Una página con concepto, ejemplo y duda.'],
          ['Caso del curso', 'Aplicación.', 'Resuelve un caso y justifica cada decisión.'],
          ['Lista de verificación', 'Orden y seguridad.', 'Convierte una unidad en pasos verificables.'],
          ['Actividad comunitaria', 'Educación y comunicación.', 'Guion de 30 minutos con reglas y derivación.'],
          ['Consulta al vademécum', 'Uso de fuentes revisadas.', 'Cita la monografía y la sección exacta.'],
        ],
      ),
    ),
    seccion(
      'Un proyecto pequeño de tres semanas',
      numerada([
        'Elige una unidad y un problema real de tu trabajo o comunidad.',
        'Estudia la unidad y la monografía relacionada; escribe el criterio.',
        'Aplica una acción pequeña, registra el resultado y pide retroalimentación.',
      ]),
    ),
    seccion(
      'Cómo contarlo en una entrevista o evaluación',
      lista([
        'Empieza por el problema, no por el curso.',
        'Explica qué decisión tomaste y qué evidencia la sostiene.',
        'Menciona la monografía y la sección que consultaste.',
        'Distingue lo que aprendiste de lo que aún requiere supervisión.',
        'Evita prometer resultados clínicos que no puedes demostrar.',
      ]),
    ),
    seccion('Recursos', recursosCurso(p)),
    faq('Preguntas frecuentes', [
      ['¿El certificado es suficiente?', 'Es un requisito formal, no una prueba de aplicación. Acompáñalo con evidencia.'],
      ['¿Puedo usar un caso real?', 'Sí, con datos anonimizados y respeto por la confidencialidad.'],
      ['¿Qué hago si no tengo trabajo?', 'Usa un caso del curso, una actividad voluntaria o un proyecto pequeño con un colega.'],
    ]),
    cierre(p),
  );
}

const reglasComunidad = (p) => p.reglas?.length ? lista(p.reglas) : lista([
  'No se comparten dosis ni cambios de tratamiento.',
  'No se publican datos clínicos de otras personas.',
  'No se venden productos ni se prometen curas.',
]);

const recursosComunidad = (p) => lista([
  `[Comunidad de ${p.nombre}](${p.url})`,
  p.cursoPerfil ? `[${p.cursoPerfil.titulo}](${p.cursoPerfil.url})` : '[Cursos](/cursos)',
  p.monografias?.length ? `Vademécum: ${p.monografias.slice(0, 4).map((m) => `[${m.nombre}](/vademecum/${m.slug})`).join(', ')}` : '[Vademécum](/vademecum)',
  p.guia ? `[Guía: ${p.guia.nombre}](${p.guia.ruta})` : '',
  p.articulosValidos?.length ? `Artículos: ${p.articulosValidos.slice(0, 4).map((s) => `[/articulos/${s}](/articulos/${s})`).join(', ')}` : '',
]);

export function construirComunidadComoParticipar(p) {
  return parrafo(
    `# Comunidad de ${p.nombre}: cómo participar con seguridad`,
    p.intro?.length ? p.intro.join('\n\n') : p.resumen,
    `> **Comunidad:** [${p.nombre}](${p.url}). Acceso por WhatsApp, con reglas y moderación. No es un consultorio ni un servicio de urgencias.`,
    seccion('Ficha de la comunidad', fichaComunidad(p)),
    tablaArticulosComunidad(p) ? seccion('Artículos y monografías vinculadas', tablaArticulosComunidad(p)) : '',
    seccion('Preguntas de la comunidad', preguntasComunidad(p)),
    seccion('Plan de cuatro sesiones', planComunidad(p)),
    seccion(
      'Para quién es',
      lista(p.paraQuien || ['Personas con la condición', 'Familiares y cuidadores']),
    ),
    seccion('Qué puedes encontrar', lista(p.queEncuentras || ['Experiencias, preguntas y recursos educativos.'])),
    seccion('Reglas de participación', reglasComunidad(p), p.noEs ? `**Importante:** ${p.noEs}` : ''),
    seccion(
      'Cómo entrar',
      numerada([
        'Lee las reglas y verifica que la comunidad corresponde a tu situación.',
        'Escribe al enlace de la comunidad con una presentación breve.',
        'No compartas datos clínicos sensibles en el primer mensaje.',
        'Si tienes una urgencia, busca atención médica inmediata antes que el grupo.',
      ]),
    ),
    seccion('Recursos', recursosComunidad(p)),
    faq('Preguntas frecuentes', [
      ['¿Es gratis?', 'La comunidad es un espacio educativo de acceso por WhatsApp. No se venden productos dentro del grupo.'],
      ['¿Puedo pedir una dosis?', 'No. Las dosis y los cambios de tratamiento los decide el equipo tratante.'],
      ['¿Puedo compartir mi caso?', 'Puedes compartir experiencia, pero evita datos clínicos sensibles y capturas de exámenes.'],
      ['¿Qué hago en una urgencia?', p.noEs || 'Acude a urgencias o llama a los servicios de emergencia.'],
    ]),
    cierre(p, `Entra a [${p.nombre}](${p.url}) después de leer las reglas. Si tu pregunta es clínica, prepárala para tu cita.`),
  );
}

export function construirComunidadRecursos(p) {
  return parrafo(
    `# Recursos para la comunidad de ${p.nombre}: vademécum, curso y artículos`,
    `Esta guía reúne los recursos reales que pueden usarse en la comunidad de ${p.nombre}. No inventa materiales ni promete resultados: enlaza lo que existe y explica para qué sirve cada cosa.`,
    `> **Comunidad:** [${p.nombre}](${p.url}).`,
    seccion('Ficha de la comunidad', fichaComunidad(p)),
    tablaArticulosComunidad(p) ? seccion('Artículos y monografías vinculadas', tablaArticulosComunidad(p)) : '',
    seccion(
      'Mapa de recursos',
      tabla(
        ['Recurso', 'Para quién', 'Cómo usarlo'],
        [
          ['Comunidad', 'Pacientes y cuidadores', 'Educación entre pares, reglas y acompañamiento.'],
          ['Curso', 'Profesionales y líderes', 'Formación y práctica guiada.'],
          ['Vademécum', 'Profesionales', 'Monografías revisadas; no se usa para dar dosis en el grupo.'],
          ['Artículos', 'Pacientes y cuidadores', 'Lecturas claras y revisadas.'],
          ['Guía', 'Según el recurso', 'Profundización, si existe y está vigente.'],
        ],
      ),
    ),
    seccion('Recursos concretos', recursosComunidad(p)),
    seccion(
      'Cómo combinarlos en una semana',
      numerada([
        'Comparte un artículo para pacientes y una pregunta abierta.',
        'Estudia una unidad del curso relacionada.',
        'Consulta la monografía y anota una idea general, sin dosis.',
        'Cierra con una pregunta para la próxima cita.',
      ]),
    ),
    faq('Preguntas frecuentes', [
      ['¿El vademécum es para pacientes?', 'No. Es material profesional. Para pacientes usa los artículos y la comunidad.'],
      ['¿Puedo compartir el curso en el grupo?', 'Sí, como recurso de formación. Aclara que no reemplaza la consulta.'],
      ['¿Hay materiales descargables?', 'Revisa los enlaces de la comunidad y del curso; no se prometen materiales que no existan.'],
    ]),
    cierre(p),
  );
}

export function construirComunidadPreguntas(p) {
  const propias = (p.apoyo?.preguntas || []).map(([q, a]) => [q, a]);
  const preguntas = [
    ...propias,
    ['¿Qué es la comunidad?', p.resumen],
    ['¿Quién puede entrar?', `Está pensada para ${p.apoyo?.para || p.nombre} y sus cuidadores.`],
    ['¿Se comparten dosis?', 'No. La comunidad no ajusta dosis ni cambia tratamientos.'],
    ['¿Se comparten datos clínicos?', 'No se publican datos de otras personas ni capturas de exámenes sin permiso.'],
    ['¿Qué recursos hay?', 'Artículos, curso, vademécum para profesionales y, cuando existe, una guía.'],
    ['¿Qué hago en una urgencia?', p.noEs || 'Busca atención médica inmediata.'],
    ['¿Puedo promocionar productos?', 'No. No se vende nada dentro del grupo.'],
  ];
  return parrafo(
    `# Preguntas frecuentes de la comunidad de ${p.nombre}`,
    `Estas respuestas explican cómo funciona la comunidad, qué límites tiene y qué recursos puedes usar.`,
    `> **Comunidad:** [${p.nombre}](${p.url}).`,
    seccion('Ficha de la comunidad', fichaComunidad(p)),
    tablaArticulosComunidad(p) ? seccion('Artículos y monografías vinculadas', tablaArticulosComunidad(p)) : '',
    seccion('Preguntas frecuentes', preguntas.map(([q, a], i) => subseccion(`Pregunta ${i + 1}. ${q}`, a)).join('\n\n')),
    seccion('Recursos', recursosComunidad(p)),
    cierre(p),
  );
}

export function construirComunidadAcompanar(p) {
  return parrafo(
    `# Cómo acompañar a una persona con ${p.nombre} en la comunidad`,
    `Acompañar no es diagnosticar ni prescribir. Es escuchar, ordenar la información y ayudar a que la persona llegue mejor a su consulta. Esta guía es para profesionales, cuidadores y líderes de comunidad.`,
    `> **Comunidad:** [${p.nombre}](${p.url}).`,
    seccion('Ficha de la comunidad', fichaComunidad(p)),
    tablaArticulosComunidad(p) ? seccion('Artículos y monografías vinculadas', tablaArticulosComunidad(p)) : '',
    seccion('Preguntas de la comunidad', preguntasComunidad(p)),
    seccion('Plan de cuatro sesiones', planComunidad(p)),
    seccion(
      'Cuatro prácticas que ayudan',
      lista([
        'Escuchar sin interrumpir y preguntar qué es lo que más preocupa.',
        'Reformular la pregunta en lenguaje claro y confirmar que se entendió.',
        'Separar lo educativo de lo clínico y decir con claridad qué corresponde al equipo.',
        'Cerrar con una acción: una pregunta para la cita, un artículo o una señal de alarma.',
      ]),
    ),
    seccion(
      'Límites',
      lista([
        'No dar dosis ni horarios de medicamentos.',
        'No interpretar exámenes ni imágenes.',
        'No recomendar suspender o cambiar un tratamiento.',
        'No compartir datos de otras personas.',
        'No prometer curas ni resultados.',
      ]),
    ),
    seccion(
      'Cómo responder a una pregunta difícil',
      numerada([
        'Agradece la confianza y valida la emoción.',
        'Pregunta qué necesita: información, compañía o ayuda para preparar la cita.',
        'Responde solo lo general y señala el límite.',
        'Ofrece un recurso revisado y una frase de derivación.',
      ]),
    ),
    seccion('Recursos', recursosComunidad(p)),
    faq('Preguntas frecuentes', [
      ['¿Puedo acompañar si no soy profesional de salud?', 'Puedes acompañar desde la experiencia y la escucha. No des consejos clínicos ni interpretes exámenes.'],
      ['¿Qué hago si la persona está en crisis?', p.noEs || 'Activa los servicios de emergencia y no intentes resolver la crisis por chat.'],
      ['¿Cómo cuido mi propio desgaste?', 'Pon límites, turna el acompañamiento y busca apoyo en tu equipo.'],
    ]),
    cierre(p),
  );
}

export function construirComunidadTaller(p) {
  return parrafo(
    `# Taller educativo para la comunidad de ${p.nombre}`,
    `Un taller de 60 minutos puede ordenar dudas y mejorar la próxima consulta. Este guion usa la comunidad, el curso y el vademécum sin convertirlos en una consulta médica.`,
    `> **Comunidad:** [${p.nombre}](${p.url}).`,
    seccion('Ficha de la comunidad', fichaComunidad(p)),
    tablaArticulosComunidad(p) ? seccion('Artículos y monografías vinculadas', tablaArticulosComunidad(p)) : '',
    seccion('Preguntas de la comunidad', preguntasComunidad(p)),
    seccion('Plan de cuatro sesiones', planComunidad(p)),
    seccion(
      'Objetivo y materiales',
      lista([
        'Objetivo: que cada persona salga con tres preguntas para su cita.',
        'Materiales: hoja de preguntas, artículo para pacientes y reglas de la comunidad.',
        'No se usan dosis, capturas de exámenes ni testimonios inventados.',
      ]),
    ),
    seccion(
      'Guion',
      tabla(
        ['Momento', 'Actividad'],
        [
          ['10 min', 'Bienvenida, objetivo y reglas.'],
          ['15 min', 'Explicación general con una pregunta abierta.'],
          ['20 min', 'Actividad: ordenar tres preguntas para la cita.'],
          ['10 min', 'Cierre: señales de alarma y derivación.'],
          ['5 min', 'Evaluación: qué se llevan y qué falta.'],
        ],
      ),
    ),
    seccion('Recursos', recursosComunidad(p)),
    faq('Preguntas frecuentes', [
      ['¿Puedo dar el taller si no soy profesional?', 'Puedes organizar y facilitar, pero la explicación clínica debe hacerla un profesional competente.'],
      ['¿Puedo responder dosis?', 'No. El taller es educativo y no reemplaza la consulta.'],
      ['¿Cómo evalúo?', 'Con una pregunta de comprensión y una acción concreta para la cita.'],
    ]),
    cierre(p),
  );
}

export function construirHub(hub, contexto) {
  const { grupos, comunidades, cursos } = contexto;
  if (hub.slug === 'mapa-vademecum-cursos-comunidades') {
    return parrafo(
      `# ${hub.title}`,
      `Edvanta tiene tres recursos que se complementan: **${grupos.length} grupos terapéuticos y 152 monografías revisadas** en el vademécum, **${cursos.length} cursos del Aula** y **${comunidades.length} comunidades de pacientes**. Este mapa explica qué es cada uno y cómo se conectan sin confundir educación con consulta.`,
      seccion('Vademécum', tabla(['Grupo', 'Monografías', 'Curso relacionado'], grupos.map((g) => [g.nombre, String(g.monografias.length), g.curso ? `[${g.curso.temaCorto}](${g.curso.url})` : '[Cursos](/cursos)']))),
      seccion('Cursos', tabla(['Curso', 'Nivel', 'Comunidad'], cursos.map((c) => [c.temaCorto, c.nivel, c.comunidad ? c.comunidad.nombre : '—']))),
      seccion('Comunidades', tabla(['Comunidad', 'Curso', 'Monografías'], comunidades.map((c) => [c.nombre, c.cursoPerfil ? c.cursoPerfil.temaCorto : '—', String(c.monografias.length)]))),
      seccion('Cómo se conectan', lista([
        'La monografía es la fuente clínica revisada para profesionales.',
        'El curso es la práctica guiada y la evaluación.',
        'La comunidad es el espacio de educación entre pares, con reglas.',
        'Los artículos traducen el contenido a preguntas y rutas de estudio.',
      ])),
      cierre({ urlVademecum: '/vademecum' }),
    );
  }
  if (hub.slug === 'como-usar-vademecum-con-cursos') {
    return parrafo(
      `# ${hub.title}`,
      `El vademécum no se estudia aparte del curso. Se usa para responder preguntas concretas que el curso plantea. Este método sirve para cualquier curso del Aula y cualquier monografía revisada.`,
      seccion('El método en cinco pasos', numerada([
        'Elige una unidad del curso y escribe la pregunta que quieres resolver.',
        'Busca el grupo terapéutico en el vademécum.',
        'Lee la sección que responde la pregunta, no todo el documento.',
        'Vuelve al curso y aplica el criterio en una actividad o caso.',
        'Documenta la evidencia y la duda que queda.',
      ])),
      seccion('Qué no hacer', lista([
        'Leer posologías para responder preguntas de la comunidad.',
        'Sustituir la monografía por un resumen.',
        'Usar el vademécum como recetario.',
        'Saltar la evaluación del curso.',
      ])),
      seccion('Ejemplo de una semana', tabla(['Día', 'Tarea', 'Evidencia'], [
        ['Lunes', 'Elegir la unidad y la pregunta.', 'Pregunta escrita.'],
        ['Martes', 'Leer la sección de la monografía.', 'Nota de cinco líneas.'],
        ['Miércoles', 'Ver la clase y hacer la actividad.', 'Actividad enviada.'],
        ['Jueves', 'Aplicar la idea a un caso propio.', 'Ejemplo anotado.'],
        ['Viernes', 'Pedir retroalimentación y ajustar.', 'Comentario recibido.'],
      ])),
      seccion('Recursos', lista([`[Vademécum](/vademecum)`, `[Cursos](/cursos)`, `[Comunidades](/comunidades)`])),
      cierre({ urlVademecum: '/vademecum' }),
    );
  }
  if (hub.slug === 'ruta-lideres-comunidades-pacientes') {
    return parrafo(
      `# ${hub.title}`,
      `Un líder de comunidad no reemplaza al equipo de salud. Su valor está en escuchar, ordenar preguntas, compartir recursos revisados y derivar. Esta ruta de cuatro semanas usa los cursos, el vademécum y las comunidades reales.`,
      seccion('Semana 1: escuchar y delimitar', lista([
        'Lee las reglas de la comunidad que acompañas.',
        'Identifica las tres preguntas más frecuentes.',
        'Escribe qué preguntas no puedes responder y a quién derivar.',
      ])),
      seccion('Semana 2: estudiar una unidad', lista([
        'Elige un curso relacionado y estudia una unidad.',
        'Consulta una monografía y ubica la sección que responde una duda.',
        'Produce una nota de una página.',
      ])),
      seccion('Semana 3: preparar una actividad', lista([
        'Diseña un taller de 30 minutos con una actividad.',
        'Revisa que no haya dosis ni promesas.',
        'Comparte un artículo para pacientes.',
      ])),
      seccion('Semana 4: medir y mejorar', lista([
        'Pide retroalimentación a tres personas.',
        'Registra qué funcionó y qué cambiarías.',
        'Define la próxima sesión con un objetivo distinto.',
      ])),
      seccion('Checklist semanal del líder', tabla(['Pregunta', 'Sí', 'No'], [
        ['¿Leí las reglas de la comunidad?', '', ''],
        ['¿Identifiqué una pregunta frecuente?', '', ''],
        ['¿Estudié una unidad del curso?', '', ''],
        ['¿Consulté una monografía y cité la sección?', '', ''],
        ['¿Produje una evidencia?', '', ''],
      ])),
      seccion('Recursos', lista([`[Cursos](/cursos)`, `[Vademécum](/vademecum)`, `[Comunidades](/comunidades)`])),
      cierre({ urlVademecum: '/vademecum' }),
    );
  }
  if (hub.slug === 'taller-educativo-vademecum-curso-comunidad') {
    return parrafo(
      `# ${hub.title}`,
      `Este guion sirve para cualquier tema de los cursos y las comunidades. La regla es simple: un objetivo, una actividad, una fuente revisada y una derivación.`,
      seccion('Antes del taller', lista([
        'Elige un objetivo educativo en una frase.',
        'Selecciona una unidad del curso y una sección de la monografía.',
        'Revisa las reglas de la comunidad.',
        'Prepara una hoja de preguntas y un artículo para pacientes.',
      ])),
      seccion('Guion de 60 minutos', tabla(['Momento', 'Actividad'], [
        ['10 min', 'Bienvenida, objetivo y reglas.'],
        ['15 min', 'Explicación general.'],
        ['20 min', 'Actividad práctica.'],
        ['10 min', 'Cierre y derivación.'],
        ['5 min', 'Evaluación breve.'],
      ])),
      seccion('Materiales y roles', tabla(['Material', 'Quién lo usa', 'Para qué'], [
        ['Hoja de preguntas', 'Participantes', 'Preparar la cita.'],
        ['Artículo para pacientes', 'Facilitador', 'Lectura común.'],
        ['Monografía', 'Profesional', 'Preparar la explicación, sin dosis.'],
        ['Reglas de la comunidad', 'Todos', 'Cuidar la privacidad y los límites.'],
      ])),
      seccion('Evaluación', lista([
        '¿Se cumplió el objetivo?',
        '¿Las personas hicieron preguntas?',
        '¿Quedó claro qué corresponde a la consulta?',
        '¿El material era revisado?',
      ])),
      seccion('Recursos', lista([`[Cursos](/cursos)`, `[Vademécum](/vademecum)`, `[Comunidades](/comunidades)`])),
      cierre({ urlVademecum: '/vademecum' }),
    );
  }
  if (hub.slug === 'preguntas-vademecum-cursos-comunidades') {
    const preguntas = [
      ['¿El vademécum es para pacientes?', 'No. Es material profesional revisado. Para pacientes están los artículos y las comunidades.'],
      ['¿Puedo usar el vademécum para dar dosis?', 'No. La posología se lee completa en la monografía y se aplica en contexto clínico.'],
      ['¿Los cursos certifican para atender pacientes?', 'No. Son formación profesional; no reemplazan la habilitación ni la práctica supervisada.'],
      ['¿Las comunidades son consultorios?', 'No. Son espacios educativos y de apoyo con reglas; las urgencias se derivan.'],
      ['¿Puedo compartir capturas de exámenes?', 'No. Evita datos clínicos sensibles y capturas de otras personas.'],
      ['¿Cómo elijo un curso?', 'Por el tema, el nivel y la comunidad que quieres acompañar.'],
      ['¿Cómo elijo una monografía?', 'Por el grupo terapéutico y la unidad del curso.'],
      ['¿Qué es una comunidad de pacientes?', 'Un grupo de apoyo con reglas, moderación y recursos educativos.'],
      ['¿Puedo promocionar productos?', 'No. No se vende nada dentro de las comunidades.'],
      ['¿Cómo reporto una urgencia?', 'Acude a urgencias o llama a los servicios de emergencia; no esperes respuesta del grupo.'],
    ];
    return parrafo(
      `# ${hub.title}`,
      hub.description,
      seccion('Preguntas frecuentes', preguntas.map(([q, a], i) => subseccion(`Pregunta ${i + 1}. ${q}`, a)).join('\n\n')),
      seccion('Recursos', lista([`[Cursos](/cursos)`, `[Vademécum](/vademecum)`, `[Comunidades](/comunidades)`])),
      cierre({ urlVademecum: '/vademecum' }),
    );
  }
  if (hub.slug === 'evidencia-aprendizaje-vademecum-cursos') {
    return parrafo(
      `# ${hub.title}`,
      `La evidencia de aprendizaje no es una captura de pantalla del certificado. Es una producción propia que muestra criterio, aplicación y límites.`,
      seccion('Indicadores', tabla(['Indicador', 'Cómo se comprueba'], [
        ['Cobertura', 'Unidades y monografías trabajadas.'],
        ['Comprensión', 'Explicas sin leer.'],
        ['Aplicación', 'Un ejemplo propio por semana.'],
        ['Documentación', 'Una nota que otra persona puede usar.'],
        ['Límites', 'Sabes qué no te corresponde decidir.'],
      ])),
      seccion('Proyecto pequeño', numerada([
        'Elige un problema real y una unidad del curso.',
        'Consulta la monografía y escribe el criterio.',
        'Aplica una acción pequeña y registra el resultado.',
        'Pide retroalimentación y ajusta.',
      ])),
      seccion('Plantilla de portafolio', tabla(['Apartado', 'Qué escribir'], [
        ['Situación', 'El problema, el contexto y la fecha.'],
        ['Fuente', 'Curso, unidad y sección de la monografía consultada.'],
        ['Decisión', 'Qué hiciste y por qué.'],
        ['Evidencia', 'Nota, lista, actividad o registro.'],
        ['Límite', 'Qué no te correspondía decidir.'],
      ])),
      seccion('Recursos', lista([`[Cursos](/cursos)`, `[Vademécum](/vademecum)`, `[Comunidades](/comunidades)`])),
      cierre({ urlVademecum: '/vademecum' }),
    );
  }
  return parrafo(
    `# ${hub.title}`,
    `Las comunidades de pacientes necesitan reglas claras de privacidad, moderación y derivación. Esta guía resume lo que no se negocia.`,
    seccion('Reglas mínimas', lista([
      'No compartir datos clínicos de otras personas.',
      'No publicar capturas de exámenes sin permiso.',
      'No dar dosis ni cambios de tratamiento.',
      'No prometer curas ni vender productos.',
      'Derivar urgencias a los servicios de salud.',
    ])),
    seccion('Moderación', lista([
      'Responder en público a las dudas educativas y en privado a las que exponen datos.',
      'Borrar datos sensibles y explicar por qué.',
      'Escalar amenazas o crisis a un profesional.',
      'Registrar incidentes sin identificar a las personas.',
    ])),
    seccion('Si alguien comparte datos sensibles', numerada([
      'Pausa la conversación y no reenvíes el mensaje.',
      'Pide a la persona que borre la captura o el dato.',
      'Explica por qué: privacidad, respeto y seguridad.',
      'Ofrece ayuda para preparar la pregunta sin exponer el dato.',
      'Registra el incidente sin identificar a la persona.',
    ])),
    seccion('Recursos', lista([`[Comunidades](/comunidades)`, `[Artículos](/articulos)`, `[Cursos](/cursos)`])),
    cierre({ urlVademecum: '/vademecum' }),
  );
}

const UNIDAD_DOSIS = /\b\d+(?:[.,]\d+)?\s?(mg|mcg|µg|ml|UI|mmol|mEq)\b/i;
const UNIDAD_DOSIS_GLOBAL = /\b\d+(?:[.,]\d+)?\s?(mg|mcg|µg|ml|UI|mmol|mEq)\b/gi;

const limpiarTextoDosis = (texto) => String(texto || '')
  .split(/(?<=\.)\s+/)
  .filter((frase) => !UNIDAD_DOSIS.test(frase))
  .join(' ')
  .trim();

const sustituirDosis = (texto) => String(texto || '').replace(UNIDAD_DOSIS_GLOBAL, 'dosis revisada');

const renderBloque = (bloque) => {
  if (typeof bloque === 'string') return limpiarTextoDosis(bloque);
  if (bloque?.lista) {
    const items = bloque.lista.map(limpiarTextoDosis).filter((x) => x && !UNIDAD_DOSIS.test(x));
    return items.length ? lista(items) : '';
  }
  if (bloque?.tabla) {
    const filas = (bloque.tabla.filas || [])
      .filter((fila) => !fila.some((celda) => UNIDAD_DOSIS.test(String(celda))))
      .map((fila) => fila.map(limpiarTextoDosis));
    return filas.length ? tabla((bloque.tabla.columnas || []).map(sustituirDosis), filas) : '';
  }
  return '';
};

const buscarSeccion = (p, ids = []) => (p.secciones || []).find((s) => ids.includes(s.id)
  || ids.some((id) => String(s.titulo || '').toLowerCase().includes(String(id).replaceAll('-', ' '))));

const renderSeccion = (p, ids, max = 3) => {
  const s = buscarSeccion(p, ids);
  if (!s) return '';
  return (s.bloques || []).map(renderBloque).filter(Boolean).slice(0, max).join('\n\n');
};

const notaDosis = '> Las cifras de dosis se omiten a propósito en este artículo. La posología completa y revisada está en la monografía enlazada y se interpreta en contexto clínico.';

const resumenMonografia = (p) => {
  const mecanismo = limpiarTextoDosis(p.mecanismo || '');
  return seccion(
    'Resumen de la monografía',
    limpiarTextoDosis(p.resumen || p.resumenCorto || 'La monografía revisada desarrolla el tema en sus secciones.'),
    mecanismo ? `**Mecanismo descrito en la monografía:** ${mecanismo}` : '',
    tabla(['Marcas', 'Vías'], [[(p.marcas || []).join(', ') || 'No declaradas', (p.vias || []).join(', ') || 'No declaradas']]),
  );
};

const introFarmacologia = (p) => parrafo(
  `La monografía de ${p.nombre} permite estudiar tres preguntas en orden: qué es, cómo actúa y cómo se mueve por el organismo. Este artículo reúne las secciones de farmacoquímica, farmacodinamia y farmacocinética, con las cifras de dosis omitidas y la referencia a la monografía revisada.`,
  `**Clase:** ${p.clase || 'no declarada'} · **Código ATC:** ${p.atc || 'no declarado'} · **Grupo:** ${p.grupoObj?.nombre || p.grupo}. ${limpiarTextoDosis(p.mecanismo || '') || 'El mecanismo se desarrolla en la sección de farmacodinamia.'}`,
);

export function construirVadFarmacologia(p) {
  const farmacoquimica = renderSeccion(p, ['farmacoquimica', 'farmacoquímica'], 2);
  const farmacodinamia = renderSeccion(p, ['farmacodinamia'], 3);
  const farmacocinetica = renderSeccion(p, ['farmacocinetica', 'farmacocinética'], 2);
  return parrafo(
    `# Farmacología de ${p.nombre}: mecanismo, farmacocinética y evidencia`,
    introFarmacologia(p),
    ctaVademecum(p),
    resumenMonografia(p),
    seccion('Ficha y diferencias', fichaVad(p), `Dentro de ${p.grupoObj?.nombre || p.grupo}, ${p.nombre} se distingue por su clase (${p.clase || 'no declarada'}) y su código ATC (${p.atc || 'no declarado'}). Monografías relacionadas: ${p.relacionados.map((m) => m.nombre).join(', ') || 'consulta el grupo completo'}.`),
    seccion('Farmacoquímica y farmacodinamia',
      farmacoquimica || 'La monografía desarrolla la estructura y las propiedades en la sección de farmacoquímica.',
      farmacodinamia || 'La monografía desarrolla el mecanismo en la sección de farmacodinamia.',
      notaDosis,
    ),
    seccion('Farmacocinética',
      farmacocinetica || 'La monografía describe absorción, distribución, metabolismo y eliminación en la sección de farmacocinética.',
      'Estudia esta sección con una pregunta: ¿qué población necesita más vigilancia y por qué? La respuesta está en la monografía, no en un resumen.',
    ),
    seccion('Cómo estudiar estas secciones',
      numerada([
        `Explica qué es ${p.nombre} y a qué clase pertenece sin mirar.`,
        'Dibuja el mecanismo en tres pasos.',
        'Dibuja el recorrido farmacocinético y marca el órgano de eliminación.',
        'Escribe una pregunta que harías al equipo tratante.',
        'Conecta el mecanismo con una clase del curso.',
        'Cierra con una nota de una página y una duda.',
      ]),
    ),
    seccion('Conexión con el curso',
      cursoTexto(p),
      clasesDelCurso(p, 4, 'farmacologia').length
        ? tabla(['Clase del curso', 'Pregunta para llevar'], clasesDelCurso(p, 4, 'farmacologia').map((c) => [c.titulo, `¿Cómo se relaciona “${c.titulo}” con el mecanismo de ${p.nombre}?`]))
        : '',
    ),
    faq('Preguntas frecuentes', [
      ['¿Por qué no hay dosis?', 'Porque este artículo es una guía de estudio. La posología revisada está en la monografía y se aplica en contexto clínico.'],
      ['¿Qué sección leer primero?', 'Farmacoquímica, farmacodinamia y farmacocinética, en ese orden.'],
      ['¿Esto reemplaza la monografía?', 'No. La monografía completa es la fuente clínica; este texto organiza el estudio.'],
      ['¿Puedo usarlo en una comunidad?', 'Puedes usar la explicación general, sin dosis ni cambios de tratamiento.'],
    ]),
    cierre(p),
  );
}

export function construirVadSeguridad(p) {
  const advertencias = renderSeccion(p, ['contraindicaciones-y-advertencias', 'contraindicaciones', 'advertencias'], 3);
  const interacciones = renderSeccion(p, ['interacciones'], 2);
  const reacciones = renderSeccion(p, ['reacciones-adversas', 'reacciones adversas'], 2);
  const embarazo = renderSeccion(p, ['embarazo-y-lactancia', 'embarazo-lactancia-fertilidad', 'embarazo', 'lactancia'], 2);
  return parrafo(
    `# Seguridad de ${p.nombre}: advertencias, interacciones y reacciones adversas`,
    `La seguridad de ${p.nombre} no se estudia con una lista de prohibiciones: se estudia entendiendo qué situaciones exigen precaución, qué interacciones importan y qué señales deben reconocerse. Este artículo reúne esas secciones de la monografía revisada, sin reproducir cifras de dosis.`,
    ctaVademecum(p),
    resumenMonografia(p),
    seccion('Ficha y diferencias', fichaVad(p), `La seguridad de ${p.nombre} se lee junto a su clase (${p.clase || 'no declarada'}) y su código ATC (${p.atc || 'no declarado'}). Compara las advertencias con las de ${p.relacionados.map((m) => m.nombre).slice(0, 3).join(', ') || 'el resto del grupo'}.`),
    seccion('Advertencias y contraindicaciones',
      advertencias || 'La monografía desarrolla las advertencias en la sección de contraindicaciones y advertencias.',
      notaDosis,
    ),
    seccion('Interacciones',
      interacciones || 'La monografía desarrolla las interacciones en su sección específica.',
      'No memorices una lista suelta: pregúntate qué mecanismo explica la interacción y qué paciente tiene mayor riesgo.',
    ),
    seccion('Reacciones adversas',
      reacciones || 'La monografía describe las reacciones adversas en su sección específica.',
      'Distingue lo esperado de lo que obliga a consultar. La monografía y el equipo tratante son la referencia.',
    ),
    seccion('Embarazo, lactancia y fertilidad',
      embarazo || 'La monografía dedica una sección a embarazo, lactancia y fertilidad. Léela completa antes de acompañar a una persona gestante.',
    ),
    seccion('Cómo documentar una señal de seguridad',
      lista([
        'Describe la señal con fecha, contexto y medicamento implicado.',
        'No cambies el tratamiento por tu cuenta.',
        'Consulta la sección de interacciones y advertencias de la monografía.',
        'Deriva al equipo tratante y registra la conducta.',
        'Si corresponde, revisa el reporte de eventos adversos.',
      ]),
    ),
    faq('Preguntas frecuentes', [
      ['¿Puedo suspender el medicamento si hay una reacción?', 'No por tu cuenta. Documenta, consulta y deriva; la decisión corresponde al equipo tratante.'],
      ['¿Qué interacción es la más importante?', 'La que afecta al paciente que tienes delante. Revisa mecanismo, contexto y monografía.'],
      ['¿Por qué no hay dosis?', 'Porque este artículo no es una prescripción. La posología revisada está en la monografía.'],
    ]),
    cierre(p),
  );
}

export function construirVadAtencion(p) {
  const indicaciones = renderSeccion(p, ['indicaciones'], 2);
  const evidencia = renderSeccion(p, ['evidencia-clinica', 'evidencia clínica', 'evidencia'], 3);
  const regulatoria = renderSeccion(p, ['situacion-regulatoria', 'situación regulatoria', 'regulacion', 'regulación'], 2);
  const atencion = renderSeccion(p, ['atencion-farmaceutica', 'atención farmacéutica'], 3);
  const experiencia = renderSeccion(p, ['experiencia-farmacoterapeutica', 'experiencia farmacoterapéutica'], 2);
  return parrafo(
    `# Atención farmacéutica con ${p.nombre}: evidencia, regulación y seguimiento`,
    `La monografía de ${p.nombre} no termina en la farmacología: incluye indicaciones, evidencia, situación regulatoria y un proceso de atención farmacéutica. Este artículo te ayuda a estudiar esa parte y a convertirla en seguimiento documentado.`,
    ctaVademecum(p),
    resumenMonografia(p),
    seccion('Ficha y diferencias', fichaVad(p), `La atención farmacéutica de ${p.nombre} se apoya en su clase (${p.clase || 'no declarada'}), su código ATC (${p.atc || 'no declarado'}) y su lugar dentro del grupo.`),
    seccion('Indicaciones y contexto',
      indicaciones || 'La monografía desarrolla las indicaciones en su sección específica.',
      notaDosis,
    ),
    seccion('Evidencia clínica',
      evidencia || 'La monografía resume la evidencia en su sección específica. Léela con sus límites.',
    ),
    seccion('Situación regulatoria',
      regulatoria || 'La monografía registra la situación regulatoria en su sección específica. Verifica siempre la fuente oficial.',
    ),
    seccion('Atención farmacéutica',
      atencion || 'La monografía describe el proceso de atención farmacéutica con el modelo de Minnesota.',
    ),
    seccion('Experiencia farmacoterapéutica',
      experiencia || 'La monografía propone preguntas para conocer la experiencia del paciente con el tratamiento.',
    ),
    seccion('Cómo convertir la monografía en seguimiento',
      numerada([
        'Evalúa la necesidad y el contexto del paciente.',
        'Identifica problemas relacionados con medicamentos sin improvisar dosis.',
        'Plantea un plan y compártelo con el equipo.',
        'Documenta la intervención y la respuesta.',
        'Programa el siguiente control.',
      ]),
    ),
    faq('Preguntas frecuentes', [
      ['¿La evidencia garantiza un resultado?', 'No. La evidencia orienta; el resultado individual depende del contexto y del equipo tratante.'],
      ['¿Qué reviso de la situación regulatoria?', 'El estado del registro y la fuente oficial; la monografía no reemplaza la consulta a la autoridad.'],
      ['¿Puedo usar esto para una comunidad?', 'Sí, como base profesional. En la comunidad no des dosis ni interpretes casos individuales.'],
    ]),
    cierre(p),
  );
}

export function construirVadParaComunidades(p) {
  const mecanismo = renderSeccion(p, ['farmacodinamia'], 1);
  const indicaciones = renderSeccion(p, ['indicaciones'], 1);
  return parrafo(
    `# Cómo explicar ${p.nombre} en una comunidad de pacientes`,
    `La monografía de ${p.nombre} es material para profesionales. En una comunidad, el objetivo no es convertirla en una charla técnica ni en una receta: es ayudar a entender qué es el medicamento, por qué el equipo lo indica y qué preguntas llevar a la consulta.`,
    ctaVademecum(p),
    ctaComunidad(p),
    resumenMonografia(p),
    seccion('Ficha y diferencias', fichaVad(p), `Para una comunidad, lo importante es explicar qué es ${p.nombre}, a qué clase pertenece (${p.clase || 'no declarada'}) y qué preguntas debe llevar la persona a su cita.`),
    seccion('Qué puedes explicar',
      mecanismo || `La monografía describe el mecanismo de ${p.nombre} en la sección de farmacodinamia.`,
      indicaciones || `La monografía describe las indicaciones de ${p.nombre} en su sección específica.`,
      notaDosis,
    ),
    seccion('Qué no debes hacer', lista([
      'No indicar dosis, horarios ni cambios de tratamiento.',
      'No interpretar exámenes ni confirmar diagnósticos.',
      'No suspender ni reemplazar medicamentos.',
      'No prometer curas ni resultados.',
      'No compartir datos clínicos de otras personas.',
    ])),
    seccion('Guion de una sesión de 30 minutos', tabla(['Momento', 'Qué hacer'], [
      ['5 min', 'Objetivo y reglas: educación, no consulta.'],
      ['10 min', 'Explicar qué es y para qué se usa, en lenguaje claro.'],
      ['10 min', 'Responder dudas generales y anotar las que necesitan consulta.'],
      ['5 min', 'Cerrar con tres preguntas para la cita y una frase de derivación.'],
    ])),
    seccion('Recursos', bloqueRecursos(p)),
    faq('Preguntas frecuentes', [
      ['¿Puedo compartir la monografía?', 'Es material profesional. Comparte los artículos para pacientes y aclara que no es una recomendación individual.'],
      ['¿Qué hago si piden una dosis?', 'No la indiques por chat. Ayuda a preparar la pregunta y deriva al equipo tratante.'],
      ['¿Puedo usar el nombre comercial?', 'Puedes mencionarlo si ayuda a reconocer el medicamento, pero aclara que la decisión es del equipo.'],
    ]),
    cierre(p),
  );
}

export const CONSTRUCTORES_VADEMECUM = {
  farmacologia: construirVadFarmacologia,
  seguridad: construirVadSeguridad,
  'atencion-farmaceutica': construirVadAtencion,
  'para-comunidades': construirVadParaComunidades,
};

const monografiaDeClase = (p, i) => (p.monografias?.length ? p.monografias[i % p.monografias.length] : null);

const tablaCursoVademecum = (p, n = 14) => tabla(
  ['Clase', 'Unidad', 'Monografía o recurso', 'Pregunta de estudio'],
  clasesDelCurso(p, n, 'datos-vademecum').map((c, i) => {
    const m = monografiaDeClase(p, i);
    const unidad = (p.unidades || []).find((u) => u.clases?.some((x) => x.titulo === c.titulo))?.nombre || 'Contenido del curso';
    return [
      c.titulo,
      unidad,
      m ? `[${m.nombre}](/vademecum/${m.slug})` : '[Vademécum](/vademecum)',
      `¿Qué sección del recurso responde una duda de “${c.titulo}”?`,
    ];
  }),
);

export function construirCursoConVademecumDatos(p) {
  return parrafo(
    `# ${p.temaCorto}: cómo estudiar el curso con el vademécum`,
    `El curso [${p.titulo}](${p.url}) tiene ${p.nUnidades} unidades y ${p.nClases} clases. Esta guía conecta cada clase con una monografía revisada o con el vademécum general, para que estudies con una fuente clínica y no con resúmenes sueltos.`,
    ctaCurso(p),
    seccion('Mapa de unidades', cursoTablaUnidades(p)),
    seccion('Clase por clase', tablaCursoVademecum(p, 14)),
    seccion('Cómo estudiar la tabla', numerada([
      'Elige una clase y escribe la pregunta que quieres resolver.',
      'Abre la monografía enlazada y ubica la sección exacta.',
      'Vuelve a la clase y aplica el criterio en una actividad.',
      'Documenta la evidencia y la duda que queda.',
    ])),
    seccion('Recursos', recursosCurso(p)),
    faq('Preguntas frecuentes', [
      ['¿Todas las clases tienen monografía?', 'No. Cuando no hay una monografía específica, la tabla enlaza el vademécum general y el grupo terapéutico.'],
      ['¿El vademécum reemplaza el curso?', 'No. El curso da práctica y evaluación; el vademécum da la monografía revisada.'],
      ['¿Puedo dar dosis con esta guía?', 'No. La posología se lee completa en la monografía y se aplica en contexto clínico.'],
    ]),
    cierre(p),
  );
}

const tablaCursoComunidad = (p, n = 12) => tabla(
  ['Clase', 'Uso con la comunidad', 'Límite'],
  clasesDelCurso(p, n, 'datos-comunidad').map((c) => [
    c.titulo,
    `Explicar una idea general de “${c.titulo}” con un ejemplo y una pregunta abierta.`,
    'No indicar dosis, no interpretar exámenes y no cambiar tratamientos.',
  ]),
);

export function construirCursoConComunidadDatos(p) {
  const comunidad = p.comunidad;
  return parrafo(
    `# ${p.temaCorto} y la comunidad de pacientes: cómo acompañar`,
    comunidad
      ? `La comunidad de [${comunidad.nombre}](${comunidad.ruta}) reúne a ${comunidad.apoyo?.para || 'personas con la condición y sus cuidadores'}. El curso te da formación; esta guía traduce cada clase en una acción educativa con límites claros.`
      : `Este curso no tiene una comunidad específica. Puedes usar sus clases para acompañar comunidades desde [/comunidades](/comunidades), con reglas y derivación.`,
    ctaCurso(p),
    comunidad ? ctaComunidad(p) : '',
    seccion('Clase por clase en la comunidad', tablaCursoComunidad(p, 12)),
    comunidad ? seccion('Reglas de la comunidad', reglasComunidad(comunidad), comunidad.noEs ? `**Importante:** ${comunidad.noEs}` : '') : seccion('Reglas mínimas', lista([
      'No se comparten dosis ni cambios de tratamiento.',
      'No se publican datos clínicos de otras personas.',
      'No se prometen curas ni se venden productos.',
      'Las urgencias se derivan a los servicios de salud.',
    ])),
    seccion('Recursos', recursosCurso(p)),
    faq('Preguntas frecuentes', [
      ['¿El curso me habilita para atender pacientes?', 'No. Es formación profesional; no reemplaza la habilitación ni la práctica supervisada.'],
      ['¿Puedo responder dudas clínicas en el grupo?', 'Solo educación general. Las decisiones individuales corresponden al equipo tratante.'],
      ['¿Qué hago con una captura de exámenes?', 'No la interpretes; pide que se borre y orienta a la persona a su cita.'],
    ]),
    cierre(p),
  );
}

const semanasCurso = (p) => {
  const clases = clasesDelCurso(p, 16, 'datos-ruta');
  return [0, 1, 2, 3].map((semana) => {
    const listaClases = clases.filter((_, i) => i % 4 === semana);
    return subseccion(`Semana ${semana + 1}`, listaClases.map((c, i) => `**${c.titulo}:** estudiar y aplicar una idea; entregar una nota de cinco líneas.`).join('\n'));
  }).join('\n\n');
};

export function construirCursoRutaDatos(p) {
  return parrafo(
    `# Ruta de 30 días: ${p.temaCorto}, vademécum y comunidad`,
    `Plan de cuatro semanas con las clases reales de [${p.titulo}](${p.url}), una monografía cuando exista y una acción educativa final.`,
    ctaCurso(p),
    seccion('Mapa de unidades', cursoTablaUnidades(p)),
    seccion('Plan por semana', semanasCurso(p)),
    seccion('Entregables', tabla(['Semana', 'Entregable', 'Evidencia'], [
      ['1', 'Nota de la primera unidad.', 'Concepto, ejemplo y duda.'],
      ['2', 'Consulta al vademécum.', 'Sección citada.'],
      ['3', 'Actividad educativa.', 'Guion de 20 minutos.'],
      ['4', 'Evaluación y ajuste.', 'Retroalimentación de una persona.'],
    ])),
    seccion('Recursos', recursosCurso(p)),
    faq('Preguntas frecuentes', [
      ['¿Puedo hacer la ruta sin comunidad?', 'Sí. Sustituye la actividad por una nota para tu equipo.'],
      ['¿Qué pasa si me atraso?', 'Reduce el alcance, no la frecuencia; retoma en la última clase que puedas explicar.'],
      ['¿Cómo cierro el mes?', 'Con una nota, un ejemplo y una pregunta que todavía no puedas responder.'],
    ]),
    cierre(p),
  );
}

export function construirCursoPreguntasDatos(p) {
  const clases = clasesDelCurso(p, 10, 'datos-faq');
  const preguntas = clases.map((c, i) => [
    `¿Qué enseña “${c.titulo}”?`,
    `Pertenece a la unidad “${(p.unidades || []).find((u) => u.clases?.some((x) => x.titulo === c.titulo))?.nombre || 'Contenido del curso'}”. ${i % 2 === 0 ? 'Úsala para explicar una idea general y producir un ejemplo propio.' : 'Conéctala con una monografía del vademécum y lleva una duda al foro.'}`,
  ]);
  const extra = [
    ['¿Qué incluye el curso?', `${p.nUnidades} unidades, ${p.nClases} clases, ${p.evaluaciones || 0} evaluaciones y ${p.actividades || 0} actividades.`],
    ['¿Tiene vademécum?', p.monografias?.length ? `Sí: ${p.monografias.slice(0, 3).map((m) => `[${m.nombre}](/vademecum/${m.slug})`).join(', ')}.` : 'Puedes usar el [vademécum general](/vademecum).'],
    ['¿Tiene comunidad?', p.comunidad ? `Sí: [${p.comunidad.nombre}](${p.comunidad.ruta}).` : 'No tiene una comunidad específica; revisa [/comunidades](/comunidades).'],
    ['¿Puedo dar dosis?', 'No. La posología se lee completa en la monografía y se aplica en contexto clínico.'],
  ];
  return parrafo(
    `# Preguntas frecuentes: ${p.temaCorto}, vademécum y comunidad`,
    `Respuestas basadas en las clases reales del curso, las monografías disponibles y la comunidad relacionada.`,
    ctaCurso(p),
    seccion('Mapa de unidades', cursoTablaUnidades(p)),
    seccion('Preguntas frecuentes', [...preguntas, ...extra].map(([q, a], i) => subseccion(`Pregunta ${i + 1}. ${q}`, a)).join('\n\n')),
    seccion('Recursos', recursosCurso(p)),
    cierre(p),
  );
}

export function construirCursoTallerDatos(p) {
  const clases = clasesDelCurso(p, 12, 'datos-taller');
  return parrafo(
    `# Cómo preparar un taller educativo con ${p.temaCorto}`,
    `Taller de 60 minutos construido con clases reales de [${p.titulo}](${p.url}), una monografía y una actividad de cierre.`,
    ctaCurso(p),
    seccion('Contenido del curso para el taller', cursoTablaUnidades(p)),
    seccion('Guion con clases reales', tabla(['Momento', 'Clase o contenido', 'Actividad'], [
      ['10 min', 'Bienvenida y objetivo.', 'Escribir una pregunta.'],
      ...clases.slice(0, 8).map((c, i) => [`${i + 1}. 5 min`, c.titulo, i % 2 === 0 ? 'Explicar una idea general.' : 'Responder una duda y derivar la decisión.']),
      ['10 min', 'Cierre.', 'Tres preguntas para la cita.'],
    ])),
    seccion('Materiales', tabla(['Material', 'Para qué'], [
      ['Hoja de preguntas', 'Preparar la cita.'],
      ['Monografía', 'Preparar la explicación, sin dosis.'],
      ['Reglas de la comunidad', 'Cuidar la privacidad.'],
    ])),
    seccion('Recursos', recursosCurso(p)),
    faq('Preguntas frecuentes', [
      ['¿Puedo dar dosis en el taller?', 'No. El taller es educativo; las dosis se deciden en la consulta.'],
      ['¿Necesito ser profesional?', 'La explicación clínica debe hacerla un profesional competente.'],
      ['¿Cómo evalúo?', 'Con una pregunta de comprensión y una acción concreta para la cita.'],
    ]),
    cierre(p),
  );
}

export function construirCursoEvidenciaDatos(p) {
  const clases = clasesDelCurso(p, 12, 'datos-evidencia');
  return parrafo(
    `# ${p.temaCorto}: cómo documentar lo aprendido`,
    `La evidencia se produce clase por clase. Esta tabla convierte las clases reales de [${p.titulo}](${p.url}) en evidencias verificables, sin exagerar resultados clínicos.`,
    ctaCurso(p),
    seccion('Unidades del curso', cursoTablaUnidades(p)),
    seccion('Clase, evidencia e indicador', tabla(['Clase', 'Evidencia', 'Indicador'], clases.map((c, i) => [
      c.titulo,
      i % 3 === 0 ? 'Nota de una página.' : i % 3 === 1 ? 'Lista de verificación.' : 'Caso resuelto con justificación.',
      i % 3 === 0 ? 'Puedes explicar sin leer.' : i % 3 === 1 ? 'Otra persona puede usarla.' : 'Decisión documentada.',
    ]))),
    seccion('Proyecto de tres semanas', numerada([
      'Elige una clase y un problema real.',
      'Estudia la clase y la monografía relacionada.',
      'Aplica una acción pequeña, registra el resultado y pide retroalimentación.',
    ])),
    seccion('Recursos', recursosCurso(p)),
    faq('Preguntas frecuentes', [
      ['¿El certificado es suficiente?', 'No. Acompáñalo con evidencia de aplicación.'],
      ['¿Puedo usar un caso real?', 'Sí, con datos anonimizados.'],
      ['¿Qué hago si no tengo trabajo?', 'Usa un caso del curso o una actividad voluntaria.'],
    ]),
    cierre(p),
  );
}

export const CONSTRUCTORES_CURSO = {
  'con-vademecum': construirCursoConVademecumDatos,
  'con-comunidad': construirCursoConComunidadDatos,
  'ruta-30-dias': construirCursoRutaDatos,
  preguntas: construirCursoPreguntasDatos,
  taller: construirCursoTallerDatos,
  evidencia: construirCursoEvidenciaDatos,
};

export const CONSTRUCTORES_COMUNIDAD = {
  'como-participar': construirComunidadComoParticipar,
  recursos: construirComunidadRecursos,
  preguntas: construirComunidadPreguntas,
  acompanar: construirComunidadAcompanar,
  taller: construirComunidadTaller,
};

export function construirCuerpo(tipo, perfil, angulo, contexto) {
  if (tipo === 'vademecum') {
    const fn = CONSTRUCTORES_VADEMECUM[angulo.id];
    if (!fn) throw new Error(`Ángulo de vademécum sin constructor: ${angulo.id}`);
    return fn(perfil);
  }
  if (tipo === 'curso') {
    const fn = CONSTRUCTORES_CURSO[angulo.id];
    if (!fn) throw new Error(`Ángulo de curso sin constructor: ${angulo.id}`);
    return fn(perfil);
  }
  if (tipo === 'comunidad') {
    const fn = CONSTRUCTORES_COMUNIDAD[angulo.id];
    if (!fn) throw new Error(`Ángulo de comunidad sin constructor: ${angulo.id}`);
    return fn(perfil);
  }
  return construirHub(perfil, contexto);
}

export function palabrasDe(texto) {
  return normalizar(texto).split(/\s+/).filter(Boolean).length;
}
