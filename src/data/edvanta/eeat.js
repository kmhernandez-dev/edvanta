import { LINKEDIN_URL } from '../../config/links.js';

export const AUTORA_PERFIL = {
  slug: 'karla-hernandez',
  nombre: 'Karla Melissa Hernández Salcedo',
  nombreCorto: 'Karla Hernández',
  profesion: 'Química Farmacéutica Clínica',
  universidad: 'Universidad del Atlántico',
  ciudad: 'Barranquilla, Colombia',
  linkedin: LINKEDIN_URL,
  actualizado: '2026-11-07',
  resumen: 'Química Farmacéutica Clínica de la Universidad del Atlántico. Dirige la línea editorial y la revisión clínica de Edvanta.',
  bio: [
    'Karla Melissa Hernández Salcedo es química farmacéutica clínica, egresada de la Universidad del Atlántico. Su trabajo se centra en traducir información clínica, farmacológica y regulatoria a un lenguaje claro, sin perder precisión.',
    'En Edvanta dirige la línea editorial y la revisión clínica. En Feliz Sin Tiroides crea recursos para personas que viven con una condición tiroidea o después de una tiroidectomía. Su enfoque combina educación en salud, atención farmacéutica y uso seguro de medicamentos.',
  ],
  areas: [
    'Salud tiroidea y educación después de una tiroidectomía',
    'Uso seguro de levotiroxina e interacciones medicamentosas',
    'Atención farmacéutica y seguimiento farmacoterapéutico',
    'Conciliación y seguridad de la medicación',
    'Farmacovigilancia y reporte de reacciones adversas',
    'Gestión de calidad, auditoría e integridad de datos',
  ],
  criterios: [
    'Cada afirmación clínica se contrasta con una fuente primaria verificable.',
    'No se publican dosis, indicaciones o interacciones sin respaldo en ficha técnica o guía clínica.',
    'La experiencia personal no sustituye la evidencia ni la valoración individual.',
    'Los enlaces de afiliado se identifican y no condicionan la revisión clínica.',
    'Si un dato no se puede verificar, se deja fuera o se marca para revisión.',
  ],
  conflicto: 'Karla Hernández participa en Edvanta como autora, docente y revisora clínica. Los enlaces de afiliado a cursos de otras plataformas se identifican en el contenido; la revisión clínica no depende de ellos.',
};

export const PAGINAS_EEAT = [
  {
    slug: 'politica-editorial',
    title: 'Política editorial | Edvanta',
    description: 'Cómo seleccionamos, escribimos, revisamos y actualizamos el contenido de Edvanta.',
    h1: 'Política editorial',
    eyebrow: 'Transparencia',
    lead: 'Qué publicamos, con qué fuentes, quién revisa y cómo corregimos.',
    actualizado: '2026-11-07',
    secciones: [
      {
        h: 'Para quién escribimos',
        p: 'Edvanta escribe para químicos farmacéuticos, otros profesionales de la salud, pacientes y cuidadores. El contenido es educativo: ayuda a entender, decidir con criterio y preparar una consulta, pero no sustituye la valoración de un profesional de salud.',
      },
      {
        h: 'Qué publicamos',
        p: 'Publicamos contenido que aporta algo que el lector no encuentra fácilmente en las primeras respuestas de Google: datos oficiales estructurados, registros sanitarios, herramientas, criterio clínico, curaduría de fuentes o experiencia profesional verificable.',
        lista: [
          'Artículos y guías con autoría, fecha de actualización y fuentes.',
          'Herramientas que explican su fórmula, sus límites y sus ejemplos.',
          'Fichas de cursos y recursos con criterio editorial, no copias del proveedor.',
          'Páginas de medicamentos con registros CUM, titulares y fuentes oficiales.',
          'Contenido de carrera y formación con fuentes y fecha de verificación.',
        ],
      },
      {
        h: 'Qué no publicamos',
        p: 'No publicamos contenido creado solo para posicionar, sin valor añadido, ni páginas que prometen resultados que no se pueden demostrar.',
        lista: [
          'Páginas doorway o variantes por ciudad o país sin diferencias reales de regulación, precio o disponibilidad.',
          'Contenido generado a escala sin revisión humana ni valor diferencial.',
          'Dosis, indicaciones, interacciones o referencias inventadas.',
          'Promesas de cura, resultados garantizados o lenguaje alarmista.',
          'Contenido de salud indexable sin revisión clínica.',
        ],
      },
      {
        h: 'Autoría y revisión',
        p: 'Cada página identifica a su autor y, cuando corresponde, a la persona que la revisó. Las páginas de salud y medicamentos no se indexan hasta que existan un revisor y una fecha de revisión. Si no hay revisión, la página lleva noindex.',
      },
      {
        h: 'Fuentes y verificación',
        p: 'Las afirmaciones clínicas se contrastan con fuentes primarias: ficha técnica INVIMA, EMA o FDA, guías clínicas y artículos indexados en PubMed. Los datos de registros sanitarios salen de datasets oficiales. Cada fuente se enlaza con su fecha de publicación y fecha de consulta cuando está disponible.',
      },
      {
        h: 'Uso de inteligencia artificial',
        p: 'La inteligencia artificial puede ayudar a buscar, ordenar o redactar borradores. No decide la verdad técnica, no inventa referencias y no sustituye la revisión de una química farmacéutica. Un borrador asistido por IA no se publica como contenido clínico sin revisión humana y sin contraste con la fuente primaria.',
      },
      {
        h: 'Correcciones y actualizaciones',
        p: 'Si encuentras un error, escríbenos con la URL, la afirmación y la fuente que la contradice. Corregimos, actualizamos la fecha y dejamos registro del cambio. No eliminamos una página para ocultar un error: la corregimos o la retiramos con una explicación.',
      },
      {
        h: 'Afiliados y conflictos de interés',
        p: 'Algunos enlaces a cursos de otras plataformas son de afiliado. Se identifican en el contenido. La revisión clínica y la selección editorial no dependen de una comisión. Las páginas comerciales no se presentan como evidencia científica.',
      },
      {
        h: 'Contacto',
        p: 'Para correcciones, sugerencias o solicitudes editoriales, usa la página de contacto. Para temas de salud individuales, consulta con tu equipo de salud.',
      },
    ],
    enlaces: [
      ['Política de revisión clínica', '/politica-de-revision-clinica'],
      ['Equipo editorial', '/equipo-editorial'],
      ['Fuentes y verificación', '/fuentes'],
      ['Metodología editorial', '/metodologia'],
      ['Autora y revisora', '/autores/karla-hernandez'],
    ],
  },
  {
    slug: 'politica-de-revision-clinica',
    title: 'Política de revisión clínica | Edvanta',
    description: 'Quién revisa el contenido clínico de Edvanta, qué se revisa, cómo y cada cuánto.',
    h1: 'Política de revisión clínica',
    eyebrow: 'Transparencia',
    lead: 'La revisión clínica es un requisito, no un sello decorativo.',
    actualizado: '2026-11-07',
    secciones: [
      {
        h: 'Quién revisa',
        p: 'La revisión clínica está a cargo de Karla Melissa Hernández Salcedo, química farmacéutica clínica de la Universidad del Atlántico. Su perfil, áreas de trabajo y criterios están publicados en la página de autora.',
      },
      {
        h: 'Qué se revisa',
        p: 'Se revisan las afirmaciones que pueden afectar una decisión de salud: indicaciones, dosis aprobadas, contraindicaciones, advertencias, embarazo y lactancia, interacciones, efectos adversos, señales de alarma y necesidad de seguimiento.',
        lista: [
          'Que la indicación corresponda a la ficha técnica o a una guía clínica.',
          'Que la dosis no se presente como una recomendación individual.',
          'Que las interacciones tengan mecanismo, gravedad y conducta.',
          'Que las señales de alarma no se minimicen.',
          'Que las fuentes sean primarias, verificables y estén fechadas.',
        ],
      },
      {
        h: 'Cómo se revisa',
        p: 'La revisión sigue una lista de verificación: se lee la fuente primaria, se compara la afirmación con el texto original, se identifican límites y poblaciones, se revisan los enlaces y se registra la fecha. Si un dato no se puede verificar, se elimina o se marca como pendiente.',
      },
      {
        h: 'Cuándo se revisa',
        p: 'Antes de publicar, al menos una vez al año y cuando cambia una guía, una ficha técnica o una norma relevante. También se revisa cuando una persona reporta un error o cuando la página se actualiza de forma sustancial.',
      },
      {
        h: 'Qué no es revisión clínica',
        p: 'Los contenidos de carrera, cursos, marketing, empleo y avisos legales tienen revisión editorial, pero no revisión clínica. Las herramientas que no hacen afirmaciones clínicas se revisan por su fórmula y sus límites, no como consejo médico.',
      },
      {
        h: 'Regla de indexación',
        p: 'Una página de salud o medicamentos solo se indexa si tiene revisor y fecha de revisión. Si falta uno de los dos, la página queda con noindex y no entra al sitemap. La regla no tiene excepciones por tráfico o por prisa comercial.',
      },
      {
        h: 'Cómo reportar un error',
        p: 'Envíanos la URL, la frase exacta y la fuente que la contradice. Revisaremos el caso, corregiremos si corresponde y actualizaremos la fecha. Si el error afecta una decisión clínica, la página se retira temporalmente hasta corregirla.',
      },
      {
        h: 'Límites',
        p: 'La revisión clínica no convierte el contenido en diagnóstico, prescripción ni tratamiento individual. Cada decisión debe tomarse con el equipo de salud que conoce el caso.',
      },
    ],
    enlaces: [
      ['Autora y revisora', '/autores/karla-hernandez'],
      ['Política editorial', '/politica-editorial'],
      ['Fuentes y verificación', '/fuentes'],
      ['Metodología editorial', '/metodologia'],
      ['Contacto', '/contacto'],
    ],
  },
  {
    slug: 'equipo-editorial',
    title: 'Equipo editorial | Edvanta',
    description: 'Quién dirige, escribe y revisa el contenido de Edvanta.',
    h1: 'Equipo editorial',
    eyebrow: 'Transparencia',
    lead: 'Roles claros para que la autoría y la revisión se puedan verificar.',
    actualizado: '2026-11-07',
    secciones: [
      {
        h: 'Dirección editorial y revisión clínica',
        p: 'Karla Melissa Hernández Salcedo, química farmacéutica clínica, dirige la línea editorial y la revisión clínica. Define los criterios de fuente, revisión y corrección, y firma las páginas de salud que cumplen el proceso.',
      },
      {
        h: 'Producción editorial',
        p: 'El equipo editorial de Edvanta investiga, organiza, redacta, revisa enlaces, prepara datos y cuida la publicación. Cuando una persona colabora de forma externa, se acredita en la página o en la ficha correspondiente.',
      },
      {
        h: 'Datos, tecnología y diseño',
        p: 'El equipo de datos y tecnología mantiene los datasets, las plantillas, los sitemaps y el control de calidad técnica. El diseño y la accesibilidad se revisan antes de publicar una página nueva.',
      },
      {
        h: 'Cómo se organiza el trabajo',
        p: 'Cada página sigue el mismo recorrido: brief, investigación, borrador, control automático, revisión clínica cuando aplica, corrección, publicación y medición. Ninguna página de salud se indexa sin la firma de la revisora.',
      },
      {
        h: 'Colaboradores',
        p: 'No publicamos perfiles, credenciales ni alianzas que no podamos verificar. Cuando existan colaboradores externos, aparecerán con su nombre, rol y conflicto de interés declarado.',
      },
      {
        h: 'Contacto',
        p: 'Para temas editoriales, correcciones o propuestas de colaboración, usa la página de contacto. Para temas de salud individuales, consulta con tu equipo de salud.',
      },
    ],
    enlaces: [
      ['Autora y revisora', '/autores/karla-hernandez'],
      ['Política editorial', '/politica-editorial'],
      ['Política de revisión clínica', '/politica-de-revision-clinica'],
      ['Fuentes y verificación', '/fuentes'],
      ['Contacto', '/contacto'],
    ],
  },
  {
    slug: 'fuentes',
    title: 'Fuentes y criterios de verificación | Edvanta',
    description: 'Qué fuentes usa Edvanta, cómo las verifica y cómo las cita.',
    h1: 'Fuentes y criterios de verificación',
    eyebrow: 'Transparencia',
    lead: 'Una afirmación sin fuente verificable no se publica como hecho.',
    actualizado: '2026-11-07',
    secciones: [
      {
        h: 'Jerarquía de fuentes',
        p: 'Para las afirmaciones clínicas y regulatorias usamos, en este orden: ficha técnica y actos regulatorios de INVIMA, EMA o FDA; guías clínicas de sociedades profesionales; artículos indexados en PubMed; datasets oficiales como el CUM del INVIMA; y fuentes terminológicas como la clasificación ATC de la OMS. Las fuentes secundarias solo se usan para contexto.',
      },
      {
        h: 'Cómo verificamos',
        p: 'Leemos la fuente primaria, comprobamos que la afirmación esté realmente allí, revisamos población, fecha, límites y conflictos de interés, y enlazamos la fuente. Si el dato no está en la fuente, no se publica.',
      },
      {
        h: 'Cómo citamos',
        p: 'Cada referencia incluye autor u organización, título, URL, fecha de publicación cuando existe y fecha de consulta. No inventamos referencias, no atribuimos frases a documentos que no las contienen y no usamos enlaces que no podamos verificar.',
      },
      {
        h: 'Qué no usamos como fuente primaria',
        p: 'No usamos Wikipedia, blogs comerciales, notas de prensa sin documento primario, resúmenes de IA ni páginas de venta como fuente de una afirmación clínica. Tampoco usamos una fuente secundaria para afirmar algo que la fuente primaria no sostiene.',
      },
      {
        h: 'Datos oficiales',
        p: 'Los registros sanitarios, titulares, formas farmacéuticas y estados del registro salen del CUM del INVIMA y de sus datasets públicos. Cada tabla indica la fecha de corte y la fuente. Si un registro no se puede verificar, se marca como pendiente y no se presenta como vigente.',
      },
      {
        h: 'Correcciones',
        p: 'Si una fuente cambia o un enlace deja de estar disponible, actualizamos la página y dejamos registro. Si encuentras un error, escríbenos con la URL y la fuente que lo contradice.',
      },
    ],
    enlaces: [
      ['Política editorial', '/politica-editorial'],
      ['Política de revisión clínica', '/politica-de-revision-clinica'],
      ['Metodología editorial', '/metodologia'],
      ['Autora y revisora', '/autores/karla-hernandez'],
      ['Contacto', '/contacto'],
    ],
  },
  {
    slug: 'metodologia',
    title: 'Metodología editorial | Edvanta',
    description: 'Cómo investigamos, escribimos, revisamos y actualizamos el contenido de Edvanta.',
    h1: 'Metodología editorial',
    eyebrow: 'Transparencia',
    lead: 'Un proceso repetible para que cada página sea útil, verificable y revisada.',
    actualizado: '2026-11-07',
    secciones: [
      {
        h: '1. Pregunta e intención',
        p: 'Antes de escribir, definimos qué pregunta responde la página, para quién y qué debe poder hacer la persona después de leerla. Si la página no aporta nada nuevo frente a las primeras respuestas de Google, no se crea.',
      },
      {
        h: '2. Investigación',
        p: 'Buscamos fuentes primarias y datos oficiales. No copiamos el contenido de las primeras posiciones. Cuando existe un dataset, lo descargamos, lo normalizamos y documentamos la fecha de corte.',
      },
      {
        h: '3. Redacción',
        p: 'Escribimos con estructura clara: respuesta directa al inicio, datos clave, desarrollo, límites, preguntas frecuentes y fuentes. Usamos tablas cuando ayudan a comparar y evitamos el relleno.',
      },
      {
        h: '4. Revisión clínica',
        p: 'Una química farmacéutica revisa las afirmaciones clínicas, la dosis, las interacciones, el embarazo y la lactancia, las advertencias y las fuentes. Si no hay revisión, la página no se indexa.',
      },
      {
        h: '5. Control de calidad',
        p: 'Antes de publicar verificamos campos obligatorios, fuentes, similitud con páginas hermanas, enlaces internos, schema, canonical y fecha. Una página incompleta se queda en noindex.',
      },
      {
        h: '6. Publicación y actualización',
        p: 'Cada página tiene fecha de publicación y de actualización. Revisamos el contenido al menos una vez al año y cuando cambia una guía, una norma o una ficha técnica. Las páginas sin impresiones se mejoran, se fusionan o se retiran.',
      },
      {
        h: '7. Uso de inteligencia artificial',
        p: 'La IA puede ayudar a buscar, ordenar o redactar borradores. No decide la verdad técnica, no inventa referencias y no sustituye la revisión humana. No generamos lotes de páginas para posicionar sin valor diferencial.',
      },
      {
        h: '8. Medición',
        p: 'Medimos indexación, impresiones, clics y keywords. Solo escalamos un lote si la mayoría de sus páginas se indexa y gana impresiones. Si no, corregimos o podamos antes de seguir.',
      },
    ],
    enlaces: [
      ['Política editorial', '/politica-editorial'],
      ['Política de revisión clínica', '/politica-de-revision-clinica'],
      ['Fuentes y verificación', '/fuentes'],
      ['Equipo editorial', '/equipo-editorial'],
      ['Autora y revisora', '/autores/karla-hernandez'],
    ],
  },
];

