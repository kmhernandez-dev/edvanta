import { hash, normalizar } from './estudiantes-1000-datos.mjs';

const parrafo = (...textos) => textos.filter(Boolean).join('\n\n');
const seccion = (titulo, ...bloques) => `## ${titulo}\n\n${bloques.filter(Boolean).join('\n\n')}`;
const subseccion = (titulo, ...bloques) => `### ${titulo}\n\n${bloques.filter(Boolean).join('\n\n')}`;
const lista = (items) => items.filter(Boolean).map((x) => `- ${x}`).join('\n');
const numerada = (items) => items.filter(Boolean).map((x, i) => `${i + 1}. ${x}`).join('\n');
const tabla = (cabeceras, filas) => [
  `| ${cabeceras.join(' | ')} |`,
  `| ${cabeceras.map(() => '---').join(' | ')} |`,
  ...filas.map((fila) => `| ${fila.map((x) => String(x ?? '').replace(/\|/g, '/')).join(' | ')} |`),
].join('\n');
const variar = (pool, semilla) => pool[hash(semilla) % pool.length];

const faq = (preguntas, titulo = 'Preguntas frecuentes') => seccion(
  titulo,
  preguntas.map(([q, a]) => subseccion(q, a)).join('\n\n'),
);

const ctaCurso = (p) => `> **Curso:** [${p.titulo}](${p.url}). Primera unidad gratis; certificado al completar el programa.`;
const ctaMateria = (p) => p.cursos[0]
  ? `> **Curso relacionado:** [${p.cursos[0].titulo}](${p.cursos[0].url}). Primera unidad gratis; complementa la materia.`
  : '> **Recursos relacionados:** revisa [/cursos](/cursos) y [/vademecum](/vademecum).';

const cierre = (p, tipo) => seccion(
  'Siguiente paso',
  tipo === 'materia'
    ? `Elige un tema de ${p.nombre}, estudia una sección y produce una nota con un ejemplo. Si necesitas práctica guiada, revisa los cursos enlazados.`
    : `Revisa la ficha de [${p.titulo}](${p.url}), elige una unidad y produce una evidencia antes de pasar a la siguiente.`,
  '> Contenido educativo para estudiantes. No indica dosis ni sustituye la práctica supervisada o la consulta.',
);

const clasesCurso = (p, cuantas, extra) => {
  const clases = (p.clases || []).filter((c) => c.titulo);
  if (!clases.length) return [];
  const inicio = hash(`${p.url}:${extra}`) % clases.length;
  return Array.from({ length: Math.min(cuantas, clases.length) }, (_, i) => clases[(inicio + i) % clases.length]);
};

const unidadDe = (p, titulo) => (p.unidades || []).find((u) => u.clases?.some((c) => c.titulo === titulo))?.nombre || 'Contenido del curso';

const tablaClases = (p, cuantas, extra) => {
  const clases = clasesCurso(p, cuantas, extra);
  return tabla(['Clase', 'Unidad', 'Qué repasar'], clases.map((c) => [
    c.titulo,
    unidadDe(p, c.titulo),
    `Puedes explicar “${c.titulo}” y dar un ejemplo propio.`,
  ]));
};

const tablaUnidades = (p) => tabla(
  ['Unidad', 'Clases', 'Primera clase'],
  (p.unidades || []).slice(0, 8).map((u) => [u.nombre, String(u.clases.length), u.clases[0]?.titulo || '']),
);

const recursosCurso = (p) => lista([
  `[Ficha del curso](${p.url})`,
  p.examenes?.[0] ? `[${p.examenes[0].titulo}](${p.examenes[0].ruta})` : '',
  p.articulosBlog?.temario ? `[Temario del curso](/articulos/${p.articulosBlog.temario.slug})` : '',
  p.articulosBlog?.['guia-de-estudio'] ? `[Guía de estudio](/articulos/${p.articulosBlog['guia-de-estudio'].slug})` : '',
]);

const tablaTemas = (p) => tabla(
  ['Tema', 'Qué estudiar', 'Recurso'],
  p.temas.map((tema, i) => [
    tema,
    `Explica ${tema.toLowerCase()} con tus palabras y un ejemplo.`,
    p.cursos[i % Math.max(1, p.cursos.length)] ? `[${p.cursos[i % p.cursos.length].titulo}](${p.cursos[i % p.cursos.length].url})` : '[Cursos](/cursos)',
  ]),
);

const recursosMateria = (p) => lista([
  ...p.cursos.slice(0, 4).map((c) => `[${c.titulo}](${c.url})`),
  ...p.examenes.slice(0, 3).map((e) => `[${e.titulo}](${e.ruta})`),
  ...p.monografias.slice(0, 4).map((m) => `[${m.nombre}](/vademecum/${m.slug})`),
  ...p.articulos.slice(0, 4).map((a) => `[${a.title}](/articulos/${a.slug})`),
]);

const tablaRecursosMateria = (p) => tabla(
  ['Recurso', 'Tipo', 'Para qué'],
  [
    ...p.cursos.slice(0, 4).map((c) => [`[${c.titulo}](${c.url})`, 'Curso', 'Práctica guiada y evaluación.']),
    ...p.examenes.slice(0, 3).map((e) => [`[${e.titulo}](${e.ruta})`, 'Examen', 'Repaso con preguntas explicadas.']),
    ...p.monografias.slice(0, 3).map((m) => [`[${m.nombre}](${`/vademecum/${m.slug}`})`, 'Monografía', 'Consulta profesional revisada.']),
    ...p.articulos.slice(0, 3).map((a) => [`[${a.title}](${`/articulos/${a.slug}`})`, 'Artículo', 'Lectura de apoyo.']),
  ],
);

export function construirCursoPrepararParcial(p) {
  return parrafo(
    `# Cómo preparar el parcial de ${p.temaCorto}`,
    `El parcial de ${p.temaCorto} no se aprueba leyendo el temario una vez. Se aprueba cuando puedes explicar cada unidad, resolver un caso y justificar una decisión. Este plan usa las ${p.nClases} clases del curso [${p.titulo}](${p.url}) y los recursos relacionados.`,
    ctaCurso(p),
    seccion('Qué entra en el parcial', tablaUnidades(p), tablaClases(p, 12, 'parcial')),
    seccion('Plan de 10 días', tabla(['Día', 'Foco', 'Evidencia'], [
      ['1-2', 'Unidad 1 y vocabulario.', 'Mapa de conceptos.'],
      ['3-4', 'Unidades 2 y 3.', 'Dos casos resueltos.'],
      ['5-6', 'Unidades 4 y 5.', 'Tabla de comparación.'],
      ['7', 'Repaso de errores.', 'Lista de dudas.'],
      ['8', 'Examen o preguntas de práctica.', 'Puntaje y corrección.'],
      ['9', 'Caso integrador.', 'Decisión documentada.'],
      ['10', 'Repaso final y descanso.', 'Nota de una página.'],
    ])),
    seccion('Preguntas que debes poder responder', lista(clasesCurso(p, 8, 'preguntas-parcial').map((c) => `¿Qué problema resuelve “${c.titulo}” y qué evidencia usarías?`))),
    seccion('Recursos', recursosCurso(p)),
    faq([
      ['¿Necesito memorizar todo?', 'No. Necesitas explicar el criterio y aplicarlo. La memoria ayuda, pero sin casos no alcanza.'],
      ['¿El curso reemplaza la materia?', 'No. El curso complementa la materia con práctica y evaluación; la universidad define el programa oficial.'],
      ['¿Qué hago si me queda poco tiempo?', 'Prioriza las unidades con más peso, resuelve un caso por unidad y revisa las preguntas falladas.'],
    ]),
    cierre(p, 'curso'),
  );
}

export function construirCursoPreguntasExamen(p) {
  const clases = clasesCurso(p, 10, 'examen');
  const preguntas = clases.map((c, i) => [
    `¿Qué debes saber de “${c.titulo}”?`,
    `Pertenece a “${unidadDe(p, c.titulo)}”. Deberías poder explicar la idea central, dar un ejemplo y señalar un error frecuente. ${i % 2 === 0 ? 'Si no puedes, vuelve a la clase y escribe una pregunta concreta.' : 'Contrástalo con la monografía o el examen relacionado.'}`,
  ]);
  return parrafo(
    `# Preguntas de examen sobre ${p.temaCorto}, con respuestas`,
    `Diez preguntas construidas con las clases reales del curso [${p.titulo}](${p.url}). No son un examen oficial: son una forma de comprobar si puedes explicar y aplicar.`,
    ctaCurso(p),
    seccion('Preguntas y respuestas', preguntas.map(([q, a], i) => subseccion(`Pregunta ${i + 1}. ${q}`, a)).join('\n\n')),
    seccion('Cómo usar este repaso', numerada([
      'Responde sin mirar el material.',
      'Marca las preguntas que no puedas explicar.',
      'Vuelve a la clase exacta, no a todo el curso.',
      'Cierra con un caso propio y una duda para el foro.',
    ])),
    seccion('Recursos', recursosCurso(p)),
    faq([
      ['¿Estas son las preguntas del parcial?', 'No. Son preguntas de repaso basadas en las clases; el profesor define el examen real.'],
      ['¿Puedo usarlas para estudiar en grupo?', 'Sí. Cada persona responde una y el grupo corrige con la clase y la monografía.'],
      ['¿Qué hago si una respuesta no me convence?', 'Llévala al foro o a la clase; una duda concreta vale más que una respuesta memorizada.'],
    ]),
    cierre(p, 'curso'),
  );
}

export function construirCursoGlosario(p) {
  const clases = clasesCurso(p, 16, 'glosario');
  return parrafo(
    `# Glosario de ${p.temaCorto}: términos y conceptos clave`,
    `El glosario no es una lista para memorizar: es un mapa para saber qué significa cada término dentro de una decisión. Estos son los conceptos que aparecen en las clases de [${p.titulo}](${p.url}).`,
    ctaCurso(p),
    seccion('Términos y conceptos', tabla(['Clase o término', 'Unidad', 'Qué debes poder explicar'], clases.map((c) => [
      c.titulo,
      unidadDe(p, c.titulo),
      `Su significado, un ejemplo y por qué importa en ${p.temaCorto}.`,
    ]))),
    seccion('Cómo estudiar el glosario', numerada([
      'Elige cinco términos y escríbelos sin mirar.',
      'Explica cada uno a alguien que no estudia farmacia.',
      'Busca un ejemplo en una clase o en un caso.',
      'Marca los que confundes y vuelve a ellos en 48 horas.',
    ])),
    seccion('Recursos', recursosCurso(p)),
    faq([
      ['¿Necesito definir todo textualmente?', 'No. Necesitas explicar el concepto con tus palabras y aplicarlo.'],
      ['¿Qué términos son más importantes?', 'Los que aparecen en las clases que más peso tienen en el examen y en la práctica.'],
      ['¿Puedo usar este glosario en un trabajo?', 'Sí, como punto de partida; cita la clase o la fuente original, no este resumen.'],
    ]),
    cierre(p, 'curso'),
  );
}

export function construirCursoRuta7(p) {
  const clases = clasesCurso(p, 14, 'ruta7');
  const dias = [0, 1, 2, 3, 4, 5, 6].map((dia) => {
    const grupo = clases.filter((_, i) => i % 7 === dia);
    return [
      `Día ${dia + 1}`,
      grupo.map((c) => `“${c.titulo}”`).join(', ') || 'Repaso de la unidad pendiente',
      'Nota de cinco líneas y una pregunta.',
    ];
  });
  return parrafo(
    `# 7 días para repasar ${p.temaCorto} antes del examen`,
    `Una semana alcanza si tienes un plan y no intentas leer todo el curso en un día. Esta ruta usa las clases reales de [${p.titulo}](${p.url}).`,
    ctaCurso(p),
    seccion('Plan de siete días', tabla(['Día', 'Clases o foco', 'Evidencia'], dias)),
    seccion('Reglas de la semana', lista([
      'Cada día termina con una evidencia, no con “ya leí”.',
      'Si no puedes explicar una clase, no avances a la siguiente.',
      'Reserva el último día para el caso integrador y el descanso.',
      'No estudies solo reconocimiento: practica recuperación activa.',
    ])),
    seccion('Recursos', recursosCurso(p)),
    faq([
      ['¿Puedo hacer la ruta en menos días?', 'Sí, pero reduce el número de clases por día y conserva el caso integrador.'],
      ['¿Qué hago si no entiendo una clase?', 'Vuelve a la clase anterior y busca la sección exacta en la monografía o el examen.'],
      ['¿Qué evidencia debo tener al final?', 'Una nota, un caso resuelto y una lista de dudas para el profesor o el foro.'],
    ]),
    cierre(p, 'curso'),
  );
}

export function construirCursoPracticas(p) {
  const roles = p.areaInfo?.roles || ['analista', 'asistente', 'coordinador'];
  return parrafo(
    `# ${p.temaCorto}: prácticas, primer empleo y portafolio`,
    `Un curso no reemplaza la experiencia, pero puede convertirte en un candidato que ya sabe hablar de procesos, evidencia y límites. Esta guía usa las clases de [${p.titulo}](${p.url}) para construir un portafolio pequeño.`,
    ctaCurso(p),
    seccion('Roles a los que apunta', tabla(['Rol', 'Qué demuestra el curso', 'Evidencia'], roles.slice(0, 4).map((rol) => [
      rol,
      `Formación en ${p.temaCorto} con clases y evaluación.`,
      'Nota, caso o lista de verificación.',
    ]))),
    seccion('Clases que más se notan en una entrevista', tablaClases(p, 10, 'empleo')),
    seccion('Portafolio de tres piezas', numerada([
      'Una nota de una página sobre un tema del curso.',
      'Un caso resuelto con decisión y evidencia.',
      'Una lista de verificación para una tarea real.',
    ])),
    seccion('Recursos', recursosCurso(p)),
    faq([
      ['¿El certificado basta para conseguir empleo?', 'No. Ayuda, pero la evidencia y la entrevista pesan más.'],
      ['¿Puedo usar casos del curso?', 'Sí, con datos anonimizados y explicando qué aprendiste.'],
      ['¿Qué hago si no tengo experiencia?', 'Convierte un trabajo académico o una actividad voluntaria en una evidencia bien contada.'],
    ]),
    cierre(p, 'curso'),
  );
}

export function construirCursoErrores(p) {
  const clases = clasesCurso(p, 12, 'errores');
  const errores = [
    ['Estudiar solo reconocimiento', 'Leer y subrayar sin recuperar de memoria.'],
    ['Saltar la primera unidad', 'Llegar a la aplicación sin el vocabulario.'],
    ['No resolver casos', 'Quedarse en la definición y no decidir.'],
    ['Ignorar las evaluaciones', 'No usar las preguntas para detectar vacíos.'],
    ['Memorizar sin contexto', 'Aprender listas sin saber cuándo aplican.'],
    ['No documentar', 'Producir evidencia que nadie más puede usar.'],
    ['Estudiar solo el día anterior', 'Concentrar todo sin repaso espaciado.'],
    ['No pedir ayuda', 'Guardar una duda hasta que se vuelve un bloqueo.'],
  ];
  return parrafo(
    `# Errores de estudiante al aprender ${p.temaCorto}`,
    `Estos son los errores que más se repiten en las clases de [${p.titulo}](${p.url}). No son fallas de inteligencia: son fallas de método.`,
    ctaCurso(p),
    seccion('Los errores y cómo corregirlos', errores.map(([error, texto], i) => subseccion(error, texto, `**En el curso:** revisa “${clases[i % Math.max(1, clases.length)]?.titulo || p.temaCorto}” y produce una evidencia concreta.`)).join('\n\n')),
    seccion('Lista de control antes del examen', lista([
      'Puedo explicar cada unidad sin leer.',
      'Resolví al menos un caso por unidad.',
      'Sé qué preguntas fallé y por qué.',
      'Tengo una nota que otra persona puede entender.',
    ])),
    seccion('Recursos', recursosCurso(p)),
    faq([
      ['¿El curso corrige estos errores?', 'No por sí solo; te da la práctica para detectarlos si haces las actividades.'],
      ['¿Cuál es el error más costoso?', 'Estudiar sin recuperación activa: parece que sabes, pero no puedes explicarlo.'],
      ['¿Cómo evito estudiar solo el día anterior?', 'Divide el temario en bloques y agenda repasos cortos desde el primer día.'],
    ]),
    cierre(p, 'curso'),
  );
}

export function construirCursoMapa(p) {
  const unidades = p.unidades || [];
  return parrafo(
    `# Mapa conceptual de ${p.temaCorto}: unidades y clases`,
    `Un mapa conceptual no es un dibujo bonito: es una forma de ver qué depende de qué. Este mapa usa la estructura real de [${p.titulo}](${p.url}).`,
    ctaCurso(p),
    seccion('Mapa de unidades', tablaUnidades(p)),
    seccion('Conexiones que debes poder explicar', lista(unidades.slice(0, 6).map((u, i) => `**${u.nombre} → ${unidades[i + 1]?.nombre || 'caso integrador'}:** qué concepto de la primera unidad necesitas para entender la segunda.`))),
    seccion('Clases que conectan el mapa', tablaClases(p, 12, 'mapa')),
    seccion('Recursos', recursosCurso(p)),
    faq([
      ['¿Cómo hago mi propio mapa?', 'Escribe las unidades en columnas y dibuja flechas solo cuando puedas explicar la relación.'],
      ['¿Sirve para todas las materias?', 'Sí, especialmente cuando hay muchos conceptos que se parecen.'],
      ['¿Debo memorizar el mapa?', 'No. Debes poder reconstruirlo y explicar por qué conectaste cada parte.'],
    ]),
    cierre(p, 'curso'),
  );
}

export function construirCursoVsMateria(p) {
  return parrafo(
    `# ${p.temaCorto}: curso online o materia universitaria`,
    `El curso [${p.titulo}](${p.url}) y una materia universitaria no compiten: responden preguntas distintas. La materia te da el marco académico; el curso puede darte práctica, casos y una evaluación concreta.`,
    ctaCurso(p),
    seccion('Comparación honesta', tabla(['Criterio', 'Materia universitaria', 'Curso de Edvanta'], [
      ['Propósito', 'Formación de base y créditos académicos.', 'Práctica aplicada y actualización.'],
      ['Evaluación', 'La define la universidad.', `${p.evaluaciones || 0} evaluaciones con preguntas explicadas.`],
      ['Ritmo', 'Calendario académico.', 'A tu ritmo, con primera unidad gratis.'],
      ['Certificado', 'Título o créditos.', 'Certificado al completar el curso.'],
      ['Alcance', 'Programa completo de la carrera.', `Tema específico: ${p.temaCorto}.`],
    ])),
    seccion('Cómo combinarlos', numerada([
      'Usa la materia para el marco y las fuentes oficiales.',
      'Usa el curso para practicar con casos y evaluaciones.',
      'Lleva al profesor una duda concreta y una evidencia.',
      'No uses el curso para reemplazar créditos ni prácticas.',
    ])),
    seccion('Recursos', recursosCurso(p)),
    faq([
      ['¿El curso da créditos universitarios?', 'No. Es formación profesional; los créditos los define la universidad.'],
      ['¿Puedo estudiar el curso antes de ver la materia?', 'Sí, pero contrasta el contenido con el programa oficial.'],
      ['¿Cuál eliges si tienes poco tiempo?', 'El curso si necesitas práctica específica; la materia si necesitas el programa completo.'],
    ]),
    cierre(p, 'curso'),
  );
}

const introMateria = (p) => parrafo(
  `${p.descripcion} En esta guía trabajamos ${p.temas.slice(0, 3).join(', ')} y los conectamos con cursos, exámenes y monografías reales cuando existen.`,
  p.cursos.length || p.examenes.length
    ? `La materia se complementa con ${p.cursos.length ? `${p.cursos.length} ${p.cursos.length === 1 ? 'curso' : 'cursos'}` : 'recursos'} y ${p.examenes.length ? `${p.examenes.length} ${p.examenes.length === 1 ? 'examen' : 'exámenes'}` : 'material de repaso'} de Edvanta. No son el programa oficial de tu universidad: son apoyo para estudiar y practicar.`
    : 'No hay un curso o examen específico para toda la materia; usamos los recursos generales de Edvanta y el vademécum como apoyo.',
);

export function construirMateriaQueEs(p) {
  return parrafo(
    `# Qué es ${p.nombre} y por qué importa en Química Farmacéutica`,
    introMateria(p),
    ctaMateria(p),
    seccion('Qué estudia', tablaTemas(p)),
    seccion('Por qué importa', lista([
      `Explica fenómenos que aparecen en otras materias y en la práctica profesional.`,
      `Te da vocabulario para leer literatura científica y fichas técnicas.`,
      `Conecta la teoría con decisiones de calidad, seguridad o atención al paciente.`,
      `Es una base para el examen y para las prácticas.`,
    ])),
    seccion('Guías de esta materia', lista([
      ['temario', 'Temario'], ['como-estudiar', 'Cómo estudiar'], ['preguntas-frecuentes', 'Preguntas frecuentes'],
      ['glosario', 'Glosario'], ['errores', 'Errores frecuentes'], ['examen', 'Examen'],
      ['recursos', 'Recursos'], ['salidas', 'Salidas'], ['plan-30-dias', 'Plan de 30 días'],
    ].map(([id, etiqueta]) => `[${etiqueta}](/articulos/materia-${p.slug}-${id})`))),
    seccion('Recursos reales', recursosMateria(p)),
    faq([
      ['¿Es una materia difícil?', 'Depende de la base y del método. Con temas claros y práctica espaciada se vuelve manejable.'],
      ['¿Necesito un curso para aprobarla?', 'No. El curso complementa; el programa oficial y el profesor son la referencia.'],
      ['¿Qué tema estudiar primero?', `Empieza por “${p.temas[0]}” y no avances sin poder explicarlo.`],
    ]),
    cierre(p, 'materia'),
  );
}

export function construirMateriaTemario(p) {
  return parrafo(
    `# Temario de ${p.nombre}: temas clave y recursos`,
    introMateria(p),
    ctaMateria(p),
    seccion('Temas clave', tablaTemas(p)),
    seccion('Cómo leer este temario', lista([
      'Marca los temas que ya puedes explicar y los que no.',
      'Elige un recurso por tema, no cinco.',
      'Produce una evidencia por tema: nota, mapa o caso.',
      'Vuelve al tema dos días después y comprueba si lo recuerdas.',
    ])),
    seccion('Recursos reales', tablaRecursosMateria(p)),
    faq([
      ['¿El temario es oficial?', 'No. Es una organización de estudio basada en temas estándar y recursos de Edvanta; el programa oficial lo define tu universidad.'],
      ['¿Puedo saltar temas?', 'Puedes, pero asegúrate de dominar los prerrequisitos.'],
      ['¿Cuántos temas debo estudiar por semana?', 'Dos o tres, con repaso; más cantidad sin evidencia no sirve.'],
    ]),
    cierre(p, 'materia'),
  );
}

export function construirMateriaComoEstudiar(p) {
  return parrafo(
    `# Cómo estudiar ${p.nombre}: método y plan`,
    introMateria(p),
    ctaMateria(p),
    seccion('Método en seis pasos', numerada([
      `Lee el tema “${p.temas[0]}” y escribe qué esperas resolver.`,
      'Explica el concepto en voz alta sin mirar.',
      'Busca un ejemplo o un caso real.',
      'Resuelve una pregunta o ejercicio.',
      'Anota la duda que queda y llévala a clase o al foro.',
      'Repasa a los 3 días y a la semana.',
    ])),
    seccion('Plan semanal', tabla(['Día', 'Tema', 'Evidencia'], p.temas.map((tema, i) => [
      `Día ${i + 1}`,
      tema,
      i % 2 === 0 ? 'Nota de cinco líneas.' : 'Pregunta o ejercicio resuelto.',
    ]))),
    seccion('Recursos reales', recursosMateria(p)),
    faq([
      ['¿Cuánto tiempo necesita?', 'Depende de la base; tres sesiones de 45 minutos por semana son un buen punto de partida.'],
      ['¿Es mejor estudiar solo o en grupo?', 'Alterna: solo para recuperar, en grupo para explicar y corregir.'],
      ['¿Qué hago si me atraso?', 'Reduce el número de temas, no la frecuencia de estudio.'],
    ]),
    cierre(p, 'materia'),
  );
}

export function construirMateriaFaq(p) {
  const preguntas = [
    ['¿Qué es y para qué sirve?', p.descripcion],
    ['¿Qué temas son los más importantes?', `Empieza por ${p.temas.slice(0, 3).join(', ')}; son la base de los demás.`],
    ['¿Es difícil aprobarla?', 'Con un método de recuperación activa y práctica, es manejable. El error es estudiar solo leyendo.'],
    ['¿Necesito memorizar definiciones?', 'Necesitas explicar y aplicar; la definición textual sirve menos que un ejemplo propio.'],
    ['¿Qué recursos tengo?', p.cursos.length || p.examenes.length ? 'Cursos, exámenes, monografías y artículos enlazados en esta guía.' : 'Cursos, vademécum y artículos de Edvanta.'],
    ['¿Cómo se relaciona con otras materias?', `Se conecta con farmacología, tecnología, calidad o atención según el tema; usa el mapa de la materia.`],
    ['¿Puedo estudiar con el curso?', 'Sí, como complemento. El curso no reemplaza el programa oficial.'],
    ['¿Cómo preparo el examen?', 'Resuelve preguntas, explica sin mirar y revisa los errores; no releas todo.'],
    ['¿Qué salidas tiene?', `Roles como ${p.roles.slice(0, 3).join(', ')}.`],
    ['¿Dónde encuentro más recursos?', 'En /recursos-para-estudiantes-de-quimica-farmaceutica, /cursos, /vademecum y /examenes.'],
  ];
  return parrafo(
    `# Preguntas frecuentes de ${p.nombre}`,
    introMateria(p),
    ctaMateria(p),
    seccion('Preguntas frecuentes', preguntas.map(([q, a], i) => subseccion(`Pregunta ${i + 1}. ${q}`, a)).join('\n\n')),
    seccion('Recursos reales', recursosMateria(p)),
    cierre(p, 'materia'),
  );
}

export function construirMateriaGlosario(p) {
  return parrafo(
    `# Glosario de ${p.nombre}: conceptos que debes dominar`,
    introMateria(p),
    ctaMateria(p),
    seccion('Conceptos y preguntas guía', tabla(['Concepto', 'Pregunta que debes responder', 'Recurso'], p.temas.map((tema, i) => [
      tema,
      `¿Qué significa, qué ejemplo lo ilustra y qué error se comete al aplicarlo?`,
      p.cursos[i % Math.max(1, p.cursos.length)] ? `[${p.cursos[i % p.cursos.length].titulo}](${p.cursos[i % p.cursos.length].url})` : '[Cursos](/cursos)',
    ]))),
    seccion('Cómo usarlo', numerada([
      'Elige tres conceptos y explícalos sin mirar.',
      'Escribe un ejemplo de cada uno.',
      'Marca los que confundes y repásalos en 48 horas.',
      'Lleva al profesor una duda concreta, no una lista de definiciones.',
    ])),
    seccion('Recursos reales', recursosMateria(p)),
    faq([
      ['¿Debo memorizar cada definición?', 'No. Debes poder explicar y aplicar.'],
      ['¿Qué hago si dos conceptos se parecen?', 'Haz una tabla de diferencias con un ejemplo para cada uno.'],
      ['¿El glosario cubre todo el examen?', 'No. Es una base; el programa oficial tiene más detalle.'],
    ]),
    cierre(p, 'materia'),
  );
}

export function construirMateriaErrores(p) {
  const errores = [
    ['Estudiar solo leyendo', 'Confundes familiaridad con comprensión.'],
    ['Memorizar sin ejemplo', 'No puedes aplicar el concepto.'],
    ['Saltar prerrequisitos', 'Avanzas sin la base y todo se vuelve frágil.'],
    ['No resolver ejercicios', 'El examen pide aplicación, no reconocimiento.'],
    ['Estudiar sin repaso', 'Olvidas lo aprendido en pocos días.'],
    ['No pedir ayuda', 'Una duda pequeña se convierte en un bloqueo.'],
    ['Usar un solo recurso', 'Te faltan perspectivas y ejemplos.'],
    ['No documentar', 'No puedes demostrar lo que aprendiste.'],
  ];
  return parrafo(
    `# Errores frecuentes al estudiar ${p.nombre}`,
    introMateria(p),
    ctaMateria(p),
    seccion('Los errores y su corrección', errores.map(([error, texto], i) => subseccion(error, texto, `**Tema relacionado:** ${p.temas[i % p.temas.length]}. Producir un ejemplo y una pregunta.`)).join('\n\n')),
    seccion('Lista de control', lista([
      'Puedo explicar cada tema sin mirar.',
      'Tengo un ejemplo por tema.',
      'Resolví al menos una pregunta por tema.',
      'Sé qué temas necesitan repaso.',
    ])),
    seccion('Recursos reales', recursosMateria(p)),
    faq([
      ['¿El curso corrige estos errores?', 'Te da práctica, pero la corrección depende de que hagas las actividades.'],
      ['¿Cuál es el error más común?', 'Estudiar sin recuperación activa: parece que sabes, pero no puedes explicarlo.'],
      ['¿Cómo evito estudiar solo el día anterior?', 'Agenda repasos cortos desde el primer día.'],
    ]),
    cierre(p, 'materia'),
  );
}

export function construirMateriaExamen(p) {
  return parrafo(
    `# Cómo preparar el examen de ${p.nombre}`,
    introMateria(p),
    ctaMateria(p),
    seccion('Qué suele evaluarse', tabla(['Tema', 'Pregunta típica'], p.temas.map((tema) => [
      tema,
      `Explica ${tema.toLowerCase()}, da un ejemplo y señala un error frecuente.`,
    ]))),
    seccion('Plan de 10 días', tabla(['Día', 'Foco', 'Evidencia'], [
      ['1-3', 'Temas 1 y 2.', 'Nota y ejemplo.'],
      ['4-6', 'Temas 3 y 4.', 'Preguntas resueltas.'],
      ['7-8', 'Temas 5 y 6.', 'Caso o mapa.'],
      ['9', 'Examen de práctica.', 'Puntaje y corrección.'],
      ['10', 'Repaso de errores.', 'Lista de dudas.'],
    ])),
    seccion('Exámenes y recursos', lista([
      ...p.examenes.map((e) => `[${e.titulo}](${e.ruta})`),
      ...p.cursos.slice(0, 3).map((c) => `[${c.titulo}](${c.url})`),
      ...p.monografias.slice(0, 2).map((m) => `[${m.nombre}](/vademecum/${m.slug})`),
    ])),
    faq([
      ['¿Los exámenes de Edvanta son oficiales?', 'No. Son práctica con preguntas explicadas; el examen real lo define tu universidad.'],
      ['¿Cómo uso las preguntas falladas?', 'Vuelve al tema exacto y explica por qué la opción correcta lo es.'],
      ['¿Qué hago el día anterior?', 'Repasa errores y descansa; no intentes aprender todo de nuevo.'],
    ]),
    cierre(p, 'materia'),
  );
}

export function construirMateriaRecursos(p) {
  return parrafo(
    `# Recursos para estudiar ${p.nombre}: cursos, exámenes y vademécum`,
    introMateria(p),
    ctaMateria(p),
    seccion('Mapa de recursos', tablaRecursosMateria(p)),
    seccion('Cómo elegir', lista([
      'Si necesitas base: empieza por un curso o una guía.',
      'Si necesitas practicar: usa un examen o preguntas.',
      'Si necesitas detalle profesional: consulta la monografía.',
      'Si necesitas lenguaje claro: usa un artículo.',
    ])),
    seccion('Enlaces', recursosMateria(p)),
    faq([
      ['¿Todos los recursos son gratis?', 'El contenido es gratuito; algunos certificados tienen costo. Revisa la ficha de cada curso.'],
      ['¿Puedo usar el vademécum en la materia?', 'Sí, como consulta profesional; no lo uses para dar dosis ni recomendaciones clínicas.'],
      ['¿Qué recurso elijo si tengo poco tiempo?', 'Un curso corto o un examen de práctica, según lo que necesites.'],
    ]),
    cierre(p, 'materia'),
  );
}

export function construirMateriaSalidas(p) {
  return parrafo(
    `# Salidas profesionales de ${p.nombre}: roles y primer empleo`,
    introMateria(p),
    ctaMateria(p),
    seccion('Roles relacionados', tabla(['Rol', 'Qué se espera', 'Cómo prepararte'], p.roles.slice(0, 4).map((rol) => [
      rol,
      `Aplicar ${p.nombre.toLowerCase()} en tareas reales.`,
      'Curso, práctica y evidencia.',
    ]))),
    seccion('Competencias que se evalúan', lista([
      'Criterio para resolver problemas, no solo memoria.',
      'Comunicación clara con personas de otras áreas.',
      'Uso de fuentes y documentación.',
      'Reconocer los límites de tu competencia.',
    ])),
    seccion('Portafolio y entrevista', numerada([
      'Elige un tema y produce una nota de una página.',
      'Resuelve un caso y documenta la decisión.',
      'Prepara una respuesta de dos minutos sobre lo que aprendiste.',
      'Menciona el curso y la materia, sin exagerar.',
    ])),
    seccion('Recursos reales', recursosMateria(p)),
    faq([
      ['¿Necesito un título para estos roles?', 'Cada rol tiene requisitos legales; revisa la normativa y la oferta real.'],
      ['¿El curso garantiza empleo?', 'No. Ayuda a prepararte; el empleo depende de muchos factores.'],
      ['¿Qué evidencia puedo mostrar?', 'Notas, casos, mapas, listas de verificación y actividades.'],
    ]),
    cierre(p, 'materia'),
  );
}

export function construirMateriaPlan30(p) {
  return parrafo(
    `# Plan de 30 días para estudiar ${p.nombre}`,
    introMateria(p),
    ctaMateria(p),
    seccion('Plan semanal', tabla(['Semana', 'Temas', 'Recurso', 'Entregable'], [
      ['1', p.temas.slice(0, 2).join(' · '), p.cursos[0] ? `[${p.cursos[0].titulo}](${p.cursos[0].url})` : '[Cursos](/cursos)', 'Nota y mapa.'],
      ['2', p.temas.slice(2, 4).join(' · '), p.examenes[0] ? `[${p.examenes[0].titulo}](${p.examenes[0].ruta})` : '[Exámenes](/examenes)', 'Dos ejemplos propios.'],
      ['3', p.temas.slice(4, 6).join(' · '), p.monografias[0] ? `[${p.monografias[0].nombre}](/vademecum/${p.monografias[0].slug})` : '[Vademécum](/vademecum)', 'Preguntas resueltas.'],
      ['4', 'Repaso y caso integrador', '[Cursos](/cursos)', 'Nota final y dudas.'],
    ])),
    seccion('Cómo medir el avance', lista([
      'Puedes explicar cada tema sin mirar.',
      'Tienes un ejemplo por tema.',
      'Resolviste al menos una pregunta por tema.',
      'Sabes qué temas necesitan repaso.',
    ])),
    seccion('Recursos reales', recursosMateria(p)),
    faq([
      ['¿30 días alcanzan?', 'Para una base y evidencia, sí; para dominar todo, necesitas práctica adicional.'],
      ['¿Qué hago si me atraso?', 'Reduce el alcance, no la frecuencia.'],
      ['¿Cómo cierro el mes?', 'Con una nota, un ejemplo y una duda que todavía no puedas responder.'],
    ]),
    cierre(p, 'materia'),
  );
}

export const CONSTRUCTORES_CURSO = {
  'preparar-parcial': construirCursoPrepararParcial,
  'preguntas-examen': construirCursoPreguntasExamen,
  glosario: construirCursoGlosario,
  'ruta-7-dias': construirCursoRuta7,
  'practicas-empleo': construirCursoPracticas,
  'errores-estudiante': construirCursoErrores,
  'mapa-conceptual': construirCursoMapa,
  'curso-vs-materia': construirCursoVsMateria,
};

export const CONSTRUCTORES_MATERIA = {
  'que-es': construirMateriaQueEs,
  temario: construirMateriaTemario,
  'como-estudiar': construirMateriaComoEstudiar,
  'preguntas-frecuentes': construirMateriaFaq,
  glosario: construirMateriaGlosario,
  errores: construirMateriaErrores,
  examen: construirMateriaExamen,
  recursos: construirMateriaRecursos,
  salidas: construirMateriaSalidas,
  'plan-30-dias': construirMateriaPlan30,
};

export function construirCuerpo(tipo, perfil, angulo) {
  const fn = tipo === 'curso-estudiante' ? CONSTRUCTORES_CURSO[angulo.id] : CONSTRUCTORES_MATERIA[angulo.id];
  if (!fn) throw new Error(`Ángulo sin constructor: ${tipo}/${angulo.id}`);
  return fn(perfil);
}

export function contarPalabras(texto) {
  return normalizar(texto).split(/\s+/).filter(Boolean).length;
}
