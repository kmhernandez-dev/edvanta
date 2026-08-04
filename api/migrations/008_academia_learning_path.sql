-- Ruta pedagógica, actividades prácticas y acceso con proveedores externos.
-- El contenido clínico es educativo y utiliza casos ficticios; no almacena datos de salud.

ALTER TABLE academia_users ADD COLUMN IF NOT EXISTS google_sub TEXT;
ALTER TABLE academia_users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE academia_users ADD COLUMN IF NOT EXISTS auth_provider TEXT NOT NULL DEFAULT 'email';
ALTER TABLE academia_users ALTER COLUMN password_hash DROP NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_academia_users_google_sub
  ON academia_users(google_sub) WHERE google_sub IS NOT NULL;

ALTER TABLE academia_lessons ADD COLUMN IF NOT EXISTS content JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE TABLE IF NOT EXISTS academia_activities (
  id          BIGSERIAL PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  course_id   BIGINT NOT NULL REFERENCES academia_courses(id) ON DELETE CASCADE,
  lesson_id   BIGINT NOT NULL REFERENCES academia_lessons(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  content     JSONB NOT NULL DEFAULT '{}'::jsonb,
  answer_key  JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS academia_activity_submissions (
  activity_id BIGINT NOT NULL REFERENCES academia_activities(id) ON DELETE CASCADE,
  user_id     BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  answers     JSONB NOT NULL DEFAULT '{}'::jsonb,
  score       INTEGER NOT NULL DEFAULT 0,
  total       INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (activity_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_academia_activities_lesson
  ON academia_activities(lesson_id, sort_order) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_academia_activity_submissions_user
  ON academia_activity_submissions(user_id, completed_at DESC);

UPDATE academia_lessons SET content = $content$
{
  "estimated_reading_min": 6,
  "objectives": [
    "Reconocer el propósito y los límites educativos del curso.",
    "Organizar una rutina breve para aprender con video, texto y práctica.",
    "Formular preguntas claras para conversar con el equipo de salud."
  ],
  "intro": "Esta ruta te ayuda a comprender mejor el cuidado tiroideo y a participar de forma informada en tus decisiones. No sustituye una valoración clínica ni modifica tratamientos.",
  "sections": [
    {
      "title": "Una ruta para comprender, no para autodiagnosticar",
      "paragraphs": [
        "El autocuidado responsable comienza al distinguir educación de atención clínica. Aquí aprenderás conceptos, hábitos de organización y preguntas útiles; el diagnóstico, la interpretación individual y los cambios de tratamiento corresponden al profesional tratante.",
        "Los síntomas tiroideos pueden parecerse a los de muchas otras condiciones. Por eso una clase o una lista de síntomas nunca reemplaza la historia clínica, el examen físico y las pruebas solicitadas para cada persona."
      ]
    },
    {
      "title": "Cómo estudiar cada clase",
      "paragraphs": ["Usa una secuencia corta: mira el video, lee la explicación, identifica una idea nueva y aplícala al caso ficticio de la actividad."],
      "bullets": [
        "Antes: escribe qué crees saber y una pregunta que quieras resolver.",
        "Durante: pausa para anotar términos, relaciones y dudas.",
        "Después: resume la clase en tres frases y completa la práctica disponible.",
        "Consulta: lleva tus preguntas a un médico o químico farmacéutico cuando involucren diagnóstico, dosis o efectos adversos."
      ]
    },
    {
      "title": "Tu cuaderno de autocuidado",
      "paragraphs": ["Puedes llevar un registro de preguntas, fechas de controles, instrucciones recibidas y temas por confirmar. Evita publicar en comentarios nombres completos, resultados de laboratorio, diagnósticos, números de identificación u otros datos sensibles."],
      "callout": "Meta de aprendizaje: terminar el curso con una conversación mejor preparada, no con decisiones clínicas tomadas en solitario."
    }
  ],
  "diagram": {
    "title": "Ciclo de aprendizaje seguro",
    "type": "flow",
    "steps": [
      {"label": "Observar", "detail": "Activa lo que ya sabes"},
      {"label": "Comprender", "detail": "Video y lectura"},
      {"label": "Aplicar", "detail": "Caso ficticio"},
      {"label": "Consultar", "detail": "Pregunta al profesional"}
    ]
  },
  "key_takeaways": [
    "Aprender sobre la tiroides ayuda a hacer mejores preguntas.",
    "La información general no define un diagnóstico individual.",
    "La constancia y el registro de indicaciones fortalecen el autocuidado."
  ],
  "reflection": "¿Qué pregunta concreta te gustaría poder formular mejor al terminar esta ruta?",
  "sources": [
    {"label": "MedlinePlus: pruebas de la tiroides", "url": "https://medlineplus.gov/spanish/thyroidtests.html"}
  ]
}
$content$::jsonb
WHERE video_url LIKE 'https://youtu.be/RAUzM80hCO8%';

UPDATE academia_lessons SET content = $content$
{
  "estimated_reading_min": 9,
  "objectives": [
    "Ubicar la tiroides y describir su función general.",
    "Explicar de manera sencilla el eje hipotálamo-hipófisis-tiroides.",
    "Relacionar las hormonas tiroideas con funciones corporales sin convertir síntomas en diagnósticos."
  ],
  "intro": "La tiroides es una glándula pequeña situada en la parte anterior del cuello. Produce hormonas que participan en la regulación del uso de energía y en el funcionamiento coordinado de distintos órganos.",
  "sections": [
    {
      "title": "Una glándula pequeña con una red amplia",
      "paragraphs": [
        "La tiroides fabrica principalmente tiroxina (T4) y una cantidad menor de triyodotironina (T3). En distintos tejidos, parte de la T4 puede convertirse en T3, una forma con actividad biológica importante.",
        "Las hormonas tiroideas se relacionan con el metabolismo, la temperatura corporal, la frecuencia cardiaca, la digestión, la función muscular, el desarrollo cerebral y otros procesos. Esto explica por qué una alteración puede sentirse de formas variadas, pero no significa que un síntoma aislado identifique la causa."
      ]
    },
    {
      "title": "El eje que regula la producción",
      "paragraphs": ["El hipotálamo y la hipófisis coordinan la señal. De forma simplificada, la hipófisis produce TSH, que estimula a la tiroides para fabricar hormonas. Cuando circula suficiente hormona, la señal tiende a ajustarse mediante retroalimentación."],
      "bullets": [
        "TSH: señal producida por la hipófisis.",
        "T4 y T3: hormonas producidas o activadas dentro del sistema tiroideo.",
        "Retroalimentación: mecanismo de ajuste que ayuda a mantener el equilibrio."
      ]
    },
    {
      "title": "Por qué los síntomas no bastan",
      "paragraphs": ["Cansancio, cambios de peso, palpitaciones, estreñimiento, ansiedad o intolerancia al frío o al calor pueden aparecer en problemas tiroideos, pero también en muchas otras situaciones. La evaluación combina contexto clínico y pruebas."],
      "callout": "Comprender la función de la tiroides sirve para interpretar conversaciones médicas, no para confirmar por cuenta propia una enfermedad."
    }
  ],
  "diagram": {
    "title": "Eje hipotálamo-hipófisis-tiroides",
    "type": "cycle",
    "steps": [
      {"label": "Hipotálamo", "detail": "Inicia la señal"},
      {"label": "Hipófisis", "detail": "Libera TSH"},
      {"label": "Tiroides", "detail": "Produce T4 y T3"},
      {"label": "Tejidos", "detail": "Usan la señal hormonal"}
    ]
  },
  "key_takeaways": [
    "La TSH es una señal de la hipófisis, no una hormona producida por la tiroides.",
    "T4 y T3 participan en múltiples funciones del organismo.",
    "Un síntoma aislado no demuestra una alteración tiroidea."
  ],
  "reflection": "¿Cómo explicarías el eje tiroideo en menos de un minuto usando tus propias palabras?",
  "sources": [
    {"label": "American Thyroid Association: pruebas de función tiroidea", "url": "https://www.thyroid.org/thyroid-function-tests/"},
    {"label": "MedlinePlus: pruebas de la tiroides", "url": "https://medlineplus.gov/thyroidtests.html"}
  ]
}
$content$::jsonb
WHERE video_url LIKE 'https://youtu.be/wXWsqg5C9Bo%';

UPDATE academia_lessons SET content = $content$
{
  "estimated_reading_min": 9,
  "objectives": [
    "Diferenciar los conceptos generales de hipotiroidismo e hipertiroidismo.",
    "Reconocer que sus manifestaciones son variables y no específicas.",
    "Identificar cuándo una situación requiere atención profesional o urgente."
  ],
  "intro": "Hipotiroidismo e hipertiroidismo describen estados diferentes de disponibilidad o efecto de hormonas tiroideas. Son conceptos opuestos, pero su presentación real depende de la causa, la intensidad, el tiempo de evolución y el contexto de cada persona.",
  "sections": [
    {
      "title": "Dos direcciones, muchas posibles causas",
      "paragraphs": [
        "En el hipotiroidismo el organismo dispone de menos hormona tiroidea de la necesaria. En el hipertiroidismo hay una producción o acción excesiva. Las causas, pruebas y tratamientos no son iguales y deben determinarse clínicamente.",
        "Pensar en una balanza ayuda a comprender el concepto, pero la evaluación no se reduce a contar síntomas."
      ]
    },
    {
      "title": "Patrones que orientan, no que diagnostican",
      "bullets": [
        "En hipotiroidismo pueden aparecer cansancio, sensación de frío, estreñimiento, piel seca o lentitud; no todas las personas los presentan.",
        "En hipertiroidismo pueden aparecer palpitaciones, temblor, calor, sudoración, pérdida de peso o inquietud; también son manifestaciones inespecíficas.",
        "Medicamentos, embarazo, enfermedades no tiroideas y otras condiciones pueden modificar síntomas o resultados."
      ]
    },
    {
      "title": "Cuándo buscar ayuda",
      "paragraphs": ["Los controles programados permiten revisar síntomas, pruebas y tratamiento. Busca atención urgente ante dificultad respiratoria, dolor intenso en el pecho, desmayo, confusión marcada o deterioro rápido; no esperes a una clase ni a un comentario en internet."],
      "callout": "No suspendas ni ajustes medicamentos tiroideos por comparar tus síntomas con una lista."
    }
  ],
  "diagram": {
    "title": "Comparación conceptual",
    "type": "compare",
    "steps": [
      {"label": "Menor disponibilidad", "detail": "Hipotiroidismo: el sistema funciona con menos señal hormonal"},
      {"label": "Equilibrio clínico", "detail": "La meta se individualiza con seguimiento"},
      {"label": "Mayor disponibilidad", "detail": "Hipertiroidismo: existe exceso de producción o acción"}
    ]
  },
  "key_takeaways": [
    "Hipo e hipertiroidismo no son diagnósticos que se confirmen por síntomas.",
    "La causa importa para decidir el manejo.",
    "Los signos graves requieren atención inmediata."
  ],
  "reflection": "¿Qué diferencia existe entre reconocer un patrón y confirmar un diagnóstico?",
  "sources": [
    {"label": "American Thyroid Association: hipotiroidismo", "url": "https://www.thyroid.org/hypothyroidism/"},
    {"label": "American Thyroid Association: hipertiroidismo", "url": "https://www.thyroid.org/hyperthyroidism/"}
  ]
}
$content$::jsonb
WHERE video_url LIKE 'https://youtu.be/xGT7xSUJsKo%';

UPDATE academia_lessons SET content = $content$
{
  "estimated_reading_min": 10,
  "objectives": [
    "Explicar qué información general aportan TSH, T4 libre, T3 y anticuerpos.",
    "Reconocer por qué un resultado se interpreta con contexto y rangos del laboratorio.",
    "Preparar un registro ordenado para la consulta."
  ],
  "intro": "Las pruebas tiroideas son piezas de un rompecabezas. Ningún valor debe leerse de forma aislada: el profesional integra síntomas, antecedentes, medicamentos, examen físico, método del laboratorio y evolución.",
  "sections": [
    {
      "title": "Las pruebas más frecuentes",
      "bullets": [
        "TSH: suele ser una prueba inicial para evaluar la señal de la hipófisis hacia la tiroides.",
        "T4 libre: estima la fracción de tiroxina disponible y se interpreta junto con TSH.",
        "T3: puede ser útil en situaciones seleccionadas, especialmente al estudiar exceso hormonal.",
        "Anticuerpos tiroideos: ayudan a investigar algunas causas autoinmunes; su presencia no define por sí sola síntomas ni tratamiento."
      ]
    },
    {
      "title": "El contexto cambia la lectura",
      "paragraphs": [
        "Los intervalos de referencia pueden variar entre laboratorios. Embarazo, edad, enfermedad aguda, medicamentos y suplementos pueden influir en la interpretación.",
        "La biotina presente en algunos suplementos puede interferir con ciertos inmunoensayos. Informa todo lo que consumes y sigue las instrucciones del laboratorio o del profesional; no suspendas productos indicados sin consultarlo."
      ]
    },
    {
      "title": "Organiza, no interpretes en solitario",
      "paragraphs": ["Lleva fecha, nombre de la prueba, resultado, unidad, intervalo de referencia y cambios recientes de medicamentos o suplementos. Esta estructura permite comparar tendencias con mayor claridad."],
      "callout": "Un número fuera del rango no explica por sí solo cómo te sientes ni determina automáticamente una dosis."
    }
  ],
  "diagram": {
    "title": "Ruta de interpretación responsable",
    "type": "flow",
    "steps": [
      {"label": "Resultado", "detail": "Valor, unidad y rango"},
      {"label": "Contexto", "detail": "Síntomas, embarazo, fármacos"},
      {"label": "Tendencia", "detail": "Comparación temporal válida"},
      {"label": "Decisión clínica", "detail": "Profesional tratante"}
    ]
  },
  "key_takeaways": [
    "TSH y T4 libre suelen interpretarse en conjunto.",
    "Unidades y rangos pertenecen al informe específico.",
    "Informar medicamentos y suplementos mejora la interpretación."
  ],
  "reflection": "¿Qué cinco datos deberías conservar junto a cada resultado de laboratorio?",
  "sources": [
    {"label": "American Thyroid Association: pruebas de función tiroidea", "url": "https://www.thyroid.org/thyroid-function-tests/"},
    {"label": "MedlinePlus: pruebas de la tiroides", "url": "https://medlineplus.gov/thyroidtests.html"}
  ]
}
$content$::jsonb
WHERE video_url LIKE 'https://youtu.be/AtqzSmGyCSI%';

UPDATE academia_lessons SET content = $content$
{
  "estimated_reading_min": 9,
  "objectives": [
    "Describir una rutina consistente para usar levotiroxina según la indicación recibida.",
    "Identificar errores frecuentes que pueden alterar su absorción.",
    "Preparar preguntas seguras ante olvidos, cambios de marca o síntomas."
  ],
  "intro": "La levotiroxina reemplaza la hormona T4 cuando ha sido prescrita. Su efecto depende de tomar la dosis indicada de forma consistente y de realizar los controles definidos por el equipo tratante.",
  "sections": [
    {
      "title": "Cinco pasos para una rutina consistente",
      "bullets": [
        "Confirma la dosis, presentación y horario que aparecen en tu fórmula.",
        "Tómala con agua y de la misma manera cada día.",
        "Cuando se indica en la mañana, habitualmente se usa en ayunas, entre 30 y 60 minutos antes del desayuno; sigue tu instrucción individual.",
        "Separa los productos que interfieren con la absorción según la orientación profesional.",
        "Registra controles y consulta antes de cambiar dosis, marca, horario o forma de uso."
      ]
    },
    {
      "title": "Consistencia antes que improvisación",
      "paragraphs": ["Un cambio de rutina puede modificar cuánto medicamento se absorbe. Si tu equipo propone una toma nocturna u otro esquema, confirma el intervalo respecto a alimentos y mantenlo de forma estable."],
      "callout": "Ante una dosis olvidada, no dupliques automáticamente. Consulta las instrucciones de tu prescriptor o químico farmacéutico."
    },
    {
      "title": "Seguimiento y comunicación",
      "paragraphs": ["La respuesta se valora con el tiempo, los síntomas y las pruebas. Informa embarazo o planes de embarazo, cambios de medicamentos, suplementos, problemas de adherencia y cualquier reacción relevante."],
      "bullets": [
        "Usa una alarma o pastillero si te ayuda, sin exponer el medicamento a humedad o calor.",
        "Conserva una lista actualizada de productos y horarios.",
        "No compartas levotiroxina ni la uses para perder peso."
      ]
    }
  ],
  "diagram": {
    "title": "Rutina diaria de referencia",
    "type": "flow",
    "steps": [
      {"label": "Verificar", "detail": "Dosis y presentación indicadas"},
      {"label": "Tomar", "detail": "Con agua y de forma consistente"},
      {"label": "Esperar", "detail": "Respeta el intervalo indicado"},
      {"label": "Registrar", "detail": "Adherencia, dudas y controles"}
    ]
  },
  "key_takeaways": [
    "La regularidad reduce variaciones evitables.",
    "Alimentos, suplementos y medicamentos pueden cambiar la absorción.",
    "Los cambios de dosis corresponden al profesional tratante."
  ],
  "reflection": "¿Qué parte de una rutina de medicación conviene dejar por escrito para evitar confusiones?",
  "sources": [
    {"label": "FDA: información de prescripción de levotiroxina", "url": "https://www.accessdata.fda.gov/drugsatfda_docs/label/2023/021116s027lbl.pdf"},
    {"label": "MedlinePlus: levotiroxina", "url": "https://medlineplus.gov/druginfo/meds/a682461.html"}
  ]
}
$content$::jsonb
WHERE video_url LIKE 'https://youtu.be/BMzKMCmNcT0%';

UPDATE academia_lessons SET content = $content$
{
  "estimated_reading_min": 10,
  "objectives": [
    "Reconocer interacciones frecuentes que pueden reducir la absorción de levotiroxina.",
    "Diseñar un horario ficticio que separe productos incompatibles.",
    "Saber qué información llevar al médico o químico farmacéutico."
  ],
  "intro": "Una interacción no siempre significa que dos productos estén prohibidos. A veces se maneja separando horarios, ajustando el seguimiento o eligiendo otra estrategia. Esa decisión debe individualizarse.",
  "sections": [
    {
      "title": "Productos que merecen revisión",
      "paragraphs": ["Calcio, hierro, algunos antiácidos y otros medicamentos pueden unirse a la levotiroxina o modificar su absorción. La información de prescripción suele recomendar separar por al menos cuatro horas varios de estos productos, pero tu equipo debe confirmar qué aplica a tu caso."],
      "bullets": [
        "Suplementos con calcio o hierro.",
        "Antiácidos que contienen aluminio o magnesio.",
        "Algunos secuestradores de ácidos biliares y fijadores de fosfato.",
        "Cambios importantes en consumo de fibra, soya, café o alimentación habitual."
      ]
    },
    {
      "title": "Haz visible tu horario completo",
      "paragraphs": ["Anota medicamentos formulados, productos de venta libre, vitaminas, minerales, bebidas y suplementos. Incluye la hora real de uso. Esta vista completa permite detectar solapamientos que una lista sin horarios oculta."],
      "callout": "Natural no significa libre de interacciones. Informa también productos herbales y suplementos."
    },
    {
      "title": "Qué hacer ante un cambio",
      "paragraphs": ["Si inicias o suspendes un producto, cambia tu alimentación de forma importante o tienes dificultades para mantener el intervalo indicado, consulta. Puede ser necesario adaptar la rutina o programar controles, no improvisar la dosis."],
      "bullets": [
        "No suspendas un tratamiento necesario solo por leer una posible interacción.",
        "Pregunta qué intervalo debes conservar y durante cuánto tiempo.",
        "Confirma si el cambio requiere seguimiento de laboratorio."
      ]
    }
  ],
  "diagram": {
    "title": "De la toma al efecto",
    "type": "flow",
    "steps": [
      {"label": "Horario", "detail": "Momento consistente"},
      {"label": "Absorción", "detail": "Puede cambiar por productos o alimentos"},
      {"label": "Disponibilidad", "detail": "Cantidad que llega al organismo"},
      {"label": "Seguimiento", "detail": "Síntomas, adherencia y pruebas"}
    ]
  },
  "key_takeaways": [
    "El horario completo importa tanto como la lista de productos.",
    "Varias interacciones se manejan con separación y seguimiento profesional.",
    "No se compensa una interacción aumentando la dosis por cuenta propia."
  ],
  "reflection": "¿Cómo presentarías tu horario de medicamentos para que un profesional pueda revisarlo en dos minutos?",
  "sources": [
    {"label": "FDA: información de prescripción de levotiroxina", "url": "https://www.accessdata.fda.gov/drugsatfda_docs/label/2023/021116s027lbl.pdf"},
    {"label": "MedlinePlus: levotiroxina", "url": "https://medlineplus.gov/druginfo/meds/a682461.html"}
  ]
}
$content$::jsonb
WHERE video_url LIKE 'https://youtu.be/qt0EwrSIe-c%';

UPDATE academia_lessons SET content = $content$
{
  "estimated_reading_min": 10,
  "objectives": [
    "Explicar el propósito general de los medicamentos antitiroideos.",
    "Reconocer controles y señales que deben comunicarse de inmediato.",
    "Evitar decisiones inseguras ante efectos adversos o una dosis olvidada."
  ],
  "intro": "Los antitiroideos reducen la producción de hormona tiroidea y se utilizan en determinadas causas de hipertiroidismo. El medicamento, la dosis, la duración y el seguimiento dependen de la situación clínica.",
  "sections": [
    {
      "title": "Qué hacen y por qué requieren seguimiento",
      "paragraphs": ["Medicamentos como metimazol y propiltiouracilo interfieren con la síntesis de hormonas tiroideas. No corrigen de inmediato toda manifestación y pueden requerir ajustes basados en evolución clínica y pruebas."],
      "bullets": [
        "Tómalos exactamente según la fórmula.",
        "Asiste a los controles y laboratorios solicitados.",
        "Informa embarazo, lactancia, enfermedad hepática y todos los medicamentos que usas.",
        "No cambies entre medicamentos ni suspendas el tratamiento sin orientación."
      ]
    },
    {
      "title": "Señales que no deben esperar",
      "paragraphs": ["Fiebre o dolor de garganta durante el uso de un antitiroideo pueden relacionarse con una disminución grave de glóbulos blancos y requieren contacto médico inmediato. Color amarillo en piel u ojos, orina oscura, picazón intensa, dolor abdominal persistente o cansancio marcado también ameritan valoración urgente."],
      "callout": "No publiques estas señales esperando una respuesta del curso. Sigue las instrucciones de alarma entregadas por tu equipo y busca atención."
    },
    {
      "title": "Preguntas útiles para el control",
      "bullets": [
        "¿Qué síntomas debo reportar el mismo día?",
        "¿Qué pruebas necesito y en qué fecha?",
        "¿Qué hago si olvido una dosis o vomito después de tomarla?",
        "¿Qué cambios de medicamentos o suplementos debo informar?"
      ]
    }
  ],
  "diagram": {
    "title": "Uso seguro de un antitiroideo",
    "type": "cycle",
    "steps": [
      {"label": "Usar", "detail": "Dosis y horario formulados"},
      {"label": "Observar", "detail": "Respuesta y señales de alarma"},
      {"label": "Controlar", "detail": "Consulta y laboratorios"},
      {"label": "Ajustar", "detail": "Solo con el profesional"}
    ]
  },
  "key_takeaways": [
    "Los antitiroideos necesitan vigilancia clínica y de laboratorio.",
    "Fiebre o dolor de garganta requieren comunicación inmediata.",
    "Embarazo y problemas hepáticos deben informarse sin demora."
  ],
  "reflection": "¿Qué información de seguridad debe quedar visible al iniciar un medicamento nuevo?",
  "sources": [
    {"label": "MedlinePlus: metimazol", "url": "https://medlineplus.gov/druginfo/meds/a682464.html"},
    {"label": "American Thyroid Association: hipertiroidismo", "url": "https://www.thyroid.org/hyperthyroidism/"}
  ]
}
$content$::jsonb
WHERE video_url LIKE 'https://youtu.be/a1rAY7Fuo-I%';

UPDATE academia_lessons SET content = $content$
{
  "estimated_reading_min": 8,
  "objectives": [
    "Integrar conceptos, medicamentos, seguimiento y señales de alarma en un plan educativo.",
    "Diferenciar decisiones personales seguras de decisiones clínicas.",
    "Construir una lista breve de preguntas para el próximo control."
  ],
  "intro": "Autocuidarse no significa asumir en solitario el papel del equipo de salud. Significa observar, registrar, seguir indicaciones, comunicar cambios y pedir ayuda en el momento adecuado.",
  "sections": [
    {
      "title": "Tu tablero de autocuidado",
      "paragraphs": ["Organiza la información en cuatro bloques: tratamiento actual, rutina real, controles pendientes y preguntas. Revisa el tablero antes de cada consulta y actualízalo cuando recibas una nueva indicación."],
      "bullets": [
        "Tratamiento: nombre, presentación, dosis indicada y propósito.",
        "Rutina: hora habitual, relación con alimentos y otros productos.",
        "Seguimiento: próximas citas, pruebas y señales que debes vigilar.",
        "Preguntas: dudas priorizadas de mayor a menor urgencia."
      ]
    },
    {
      "title": "Semáforo de decisiones",
      "paragraphs": ["Clasificar decisiones evita dos extremos: ignorar un cambio importante o modificar el tratamiento sin acompañamiento."],
      "bullets": [
        "Verde: organizar recordatorios, anotar preguntas y asistir a controles.",
        "Amarillo: consultar cambios de horario, suplementos, olvidos repetidos o síntomas nuevos.",
        "Rojo: buscar atención urgente ante señales graves o las alertas específicas entregadas por el profesional."
      ]
    },
    {
      "title": "Cierra el ciclo con una conversación",
      "paragraphs": ["Resume qué cambió, desde cuándo, qué productos usas y qué necesitas decidir. Una pregunta concreta como “¿debo separar este suplemento de mi medicamento y por cuánto tiempo?” suele ser más útil que una descripción desordenada."],
      "callout": "Tu plan final debe ayudarte a comunicarte mejor, nunca a reemplazar una consulta o a ajustar dosis."
    }
  ],
  "diagram": {
    "title": "Plan de autocuidado compartido",
    "type": "cycle",
    "steps": [
      {"label": "Seguir", "detail": "Indicaciones acordadas"},
      {"label": "Registrar", "detail": "Rutina y cambios relevantes"},
      {"label": "Preguntar", "detail": "Dudas concretas"},
      {"label": "Revisar", "detail": "Decisiones con el equipo"}
    ]
  },
  "key_takeaways": [
    "El autocuidado seguro combina autonomía y acompañamiento profesional.",
    "Una lista corta y ordenada mejora la consulta.",
    "Las señales de alarma deben tener una ruta de acción definida."
  ],
  "reflection": "Escribe tres preguntas prioritarias que llevarías a una consulta educativa, sin incluir datos clínicos personales en la plataforma.",
  "sources": [
    {"label": "MedlinePlus: pruebas de la tiroides", "url": "https://medlineplus.gov/thyroidtests.html"},
    {"label": "American Thyroid Association: información para pacientes", "url": "https://www.thyroid.org/patient-thyroid-information/"}
  ]
}
$content$::jsonb
WHERE video_url LIKE 'https://youtu.be/OZlLNr5semI%';

-- Actividad 1: mapa funcional (clase 2).
WITH target AS (
  SELECT c.id AS course_id, l.id AS lesson_id
  FROM academia_courses c
  JOIN academia_modules m ON m.course_id = c.id
  JOIN academia_lessons l ON l.module_id = m.id
  WHERE c.slug = 'autocuidado-de-la-tiroides' AND l.video_url LIKE 'https://youtu.be/wXWsqg5C9Bo%'
)
INSERT INTO academia_activities (slug, course_id, lesson_id, title, description, content, answer_key, sort_order, is_published)
SELECT 'mapa-del-eje-tiroideo', course_id, lesson_id,
  'Actividad 1: construye el mapa del eje tiroideo',
  'Aplica la relación entre hipófisis, TSH, tiroides y hormonas a un caso completamente ficticio.',
  $activity${
    "estimated_min": 8,
    "case_title": "Caso ficticio: el mapa incompleto de Laura",
    "case_text": "Laura está preparando una exposición y mezcló las funciones de la hipófisis y la tiroides. Ayúdala a ordenar el mapa sin interpretar resultados personales.",
    "questions": [
      {"id": "q1", "prompt": "¿Qué estructura libera TSH?", "options": [{"value": "a", "label": "La hipófisis"}, {"value": "b", "label": "La glándula tiroides"}, {"value": "c", "label": "Los músculos"}]},
      {"id": "q2", "prompt": "¿Cuál opción describe mejor el papel de la TSH?", "options": [{"value": "a", "label": "Transporta calcio"}, {"value": "b", "label": "Estimula a la tiroides para producir hormonas"}, {"value": "c", "label": "Confirma un diagnóstico por sí sola"}]},
      {"id": "q3", "prompt": "¿Por qué un síntoma aislado no confirma una alteración tiroidea?", "options": [{"value": "a", "label": "Porque muchos síntomas tienen causas diferentes"}, {"value": "b", "label": "Porque la tiroides no influye en el cuerpo"}, {"value": "c", "label": "Porque las pruebas nunca son necesarias"}]}
    ]
  }$activity$::jsonb,
  $answers${
    "q1": {"answer": "a", "explanation": "La hipófisis libera TSH como señal hacia la tiroides."},
    "q2": {"answer": "b", "explanation": "La TSH estimula la producción tiroidea y se interpreta dentro del eje completo."},
    "q3": {"answer": "a", "explanation": "Las manifestaciones tiroideas son inespecíficas y deben evaluarse con contexto y pruebas."}
  }$answers$::jsonb, 1, true
FROM target
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description,
  content = EXCLUDED.content, answer_key = EXCLUDED.answer_key, is_published = true, updated_at = NOW();

-- Actividad 2: lectura responsable de un informe ficticio (clase 4).
WITH target AS (
  SELECT c.id AS course_id, l.id AS lesson_id
  FROM academia_courses c
  JOIN academia_modules m ON m.course_id = c.id
  JOIN academia_lessons l ON l.module_id = m.id
  WHERE c.slug = 'autocuidado-de-la-tiroides' AND l.video_url LIKE 'https://youtu.be/AtqzSmGyCSI%'
)
INSERT INTO academia_activities (slug, course_id, lesson_id, title, description, content, answer_key, sort_order, is_published)
SELECT 'organiza-un-informe-tiroideo', course_id, lesson_id,
  'Actividad 2: organiza un informe tiroideo',
  'Practica cómo preparar un resultado ficticio para una conversación clínica sin diagnosticar ni elegir tratamientos.',
  $activity${
    "estimated_min": 10,
    "case_title": "Caso ficticio: un informe sin contexto",
    "case_text": "Andrés recibió un informe simulado con TSH, T4 libre, unidades y rangos. Quiere compararlo con una imagen de internet y cambiar su tratamiento. Ayúdalo a elegir pasos seguros.",
    "questions": [
      {"id": "q1", "prompt": "¿Qué información debe conservar junto a cada resultado?", "options": [{"value": "a", "label": "Solo el número"}, {"value": "b", "label": "Valor, unidad, rango, fecha y laboratorio"}, {"value": "c", "label": "Una captura sin identificación de la prueba"}]},
      {"id": "q2", "prompt": "¿Qué debe hacer con medicamentos y suplementos?", "options": [{"value": "a", "label": "Informarlos al profesional, incluida la biotina"}, {"value": "b", "label": "Ocultarlos para no influir"}, {"value": "c", "label": "Suspenderlos todos antes de preguntar"}]},
      {"id": "q3", "prompt": "¿Cuál es la decisión más segura ante un resultado fuera de rango?", "options": [{"value": "a", "label": "Duplicar la dosis"}, {"value": "b", "label": "Copiar el tratamiento de otra persona"}, {"value": "c", "label": "Revisar contexto y tendencia con el profesional tratante"}]}
    ]
  }$activity$::jsonb,
  $answers${
    "q1": {"answer": "b", "explanation": "Las unidades y el intervalo de referencia son parte inseparable del resultado."},
    "q2": {"answer": "a", "explanation": "Medicamentos y suplementos pueden cambiar la interpretación o interferir con pruebas."},
    "q3": {"answer": "c", "explanation": "Un resultado se integra con el contexto; no autoriza ajustes autónomos."}
  }$answers$::jsonb, 2, true
FROM target
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description,
  content = EXCLUDED.content, answer_key = EXCLUDED.answer_key, is_published = true, updated_at = NOW();

-- Actividad 3: horarios e interacciones (clase 6).
WITH target AS (
  SELECT c.id AS course_id, l.id AS lesson_id
  FROM academia_courses c
  JOIN academia_modules m ON m.course_id = c.id
  JOIN academia_lessons l ON l.module_id = m.id
  WHERE c.slug = 'autocuidado-de-la-tiroides' AND l.video_url LIKE 'https://youtu.be/qt0EwrSIe-c%'
)
INSERT INTO academia_activities (slug, course_id, lesson_id, title, description, content, answer_key, sort_order, is_published)
SELECT 'disena-un-horario-seguro', course_id, lesson_id,
  'Actividad 3: diseña un horario seguro',
  'Detecta interacciones en una rutina ficticia y prepara preguntas para el químico farmacéutico.',
  $activity${
    "estimated_min": 10,
    "case_title": "Caso ficticio: la mañana de Sara",
    "case_text": "Sara toma su levotiroxina formulada con café, desayuno y un suplemento de calcio a la misma hora. No quiere modificar dosis; necesita organizar preguntas y un horario para revisión profesional.",
    "questions": [
      {"id": "q1", "prompt": "¿Cuál es el primer paso responsable?", "options": [{"value": "a", "label": "Aumentar la dosis"}, {"value": "b", "label": "Registrar productos y horas reales"}, {"value": "c", "label": "Suspender el calcio definitivamente"}]},
      {"id": "q2", "prompt": "¿Qué interacción merece confirmar?", "options": [{"value": "a", "label": "La coincidencia con calcio, alimentos y café"}, {"value": "b", "label": "El color del vaso"}, {"value": "c", "label": "El día de la semana"}]},
      {"id": "q3", "prompt": "¿Qué pregunta es más útil?", "options": [{"value": "a", "label": "¿Puedo tomar el doble para compensar?"}, {"value": "b", "label": "¿Qué intervalo debo mantener entre levotiroxina, desayuno y calcio?"}, {"value": "c", "label": "¿Puedo copiar el horario de otra persona?"}]}
    ]
  }$activity$::jsonb,
  $answers${
    "q1": {"answer": "b", "explanation": "Un horario real y completo permite revisar interacciones sin improvisar."},
    "q2": {"answer": "a", "explanation": "Calcio, alimentos y café pueden modificar la absorción y deben revisarse."},
    "q3": {"answer": "b", "explanation": "La pregunta busca una instrucción individual clara sin proponer cambios de dosis."}
  }$answers$::jsonb, 3, true
FROM target
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description,
  content = EXCLUDED.content, answer_key = EXCLUDED.answer_key, is_published = true, updated_at = NOW();

-- Actividad 4: decisiones de autocuidado (clase 8).
WITH target AS (
  SELECT c.id AS course_id, l.id AS lesson_id
  FROM academia_courses c
  JOIN academia_modules m ON m.course_id = c.id
  JOIN academia_lessons l ON l.module_id = m.id
  WHERE c.slug = 'autocuidado-de-la-tiroides' AND l.video_url LIKE 'https://youtu.be/OZlLNr5semI%'
)
INSERT INTO academia_activities (slug, course_id, lesson_id, title, description, content, answer_key, sort_order, is_published)
SELECT 'semáforo-de-autocuidado', course_id, lesson_id,
  'Actividad 4: semáforo de autocuidado',
  'Clasifica decisiones ficticias y cierra el curso con un plan de comunicación seguro.',
  $activity${
    "estimated_min": 10,
    "case_title": "Caso ficticio: decisiones antes del control",
    "case_text": "Camila organiza su próxima consulta. Tiene recordatorios pendientes, una duda sobre un suplemento y observa en un familiar dolor intenso en el pecho y dificultad para respirar.",
    "questions": [
      {"id": "q1", "prompt": "Organizar una alarma y anotar preguntas corresponde a:", "options": [{"value": "a", "label": "Acción verde de autocuidado"}, {"value": "b", "label": "Cambio de tratamiento"}, {"value": "c", "label": "Emergencia"}]},
      {"id": "q2", "prompt": "Una duda sobre un suplemento y el horario del medicamento corresponde a:", "options": [{"value": "a", "label": "Ignorarla"}, {"value": "b", "label": "Consulta amarilla con el profesional"}, {"value": "c", "label": "Duplicar la dosis"}]},
      {"id": "q3", "prompt": "Dolor intenso en el pecho y dificultad para respirar requieren:", "options": [{"value": "a", "label": "Esperar el próximo video"}, {"value": "b", "label": "Publicar un comentario"}, {"value": "c", "label": "Atención urgente"}]},
      {"id": "q4", "prompt": "¿Cuál es un buen cierre para la consulta?", "options": [{"value": "a", "label": "Confirmar por escrito próximos pasos y señales de alarma"}, {"value": "b", "label": "Elegir una dosis sin indicación"}, {"value": "c", "label": "Ocultar los productos de venta libre"}]}
    ]
  }$activity$::jsonb,
  $answers${
    "q1": {"answer": "a", "explanation": "Organizar adherencia y preguntas es una acción autónoma segura."},
    "q2": {"answer": "b", "explanation": "Las posibles interacciones se revisan con el equipo, sin cambios improvisados."},
    "q3": {"answer": "c", "explanation": "Estas señales requieren atención urgente y no deben esperar una respuesta en línea."},
    "q4": {"answer": "a", "explanation": "Confirmar el plan reduce errores y deja clara la ruta de seguimiento."}
  }$answers$::jsonb, 4, true
FROM target
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description,
  content = EXCLUDED.content, answer_key = EXCLUDED.answer_key, is_published = true, updated_at = NOW();
