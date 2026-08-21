/**
 * ============================================================
 *  FELIZ SIN TIROIDES — ECOSISTEMA DE LANDINGS
 *  Única fuente de verdad: checkouts, precios, lead magnets y FAQ.
 *  Los copy de cada landing viven en productLandings.js.
 * ============================================================
 */

// ─── Checkouts reales (Hotmart) ──────────────────────────────
export const CHECKOUTS = {
  coleccion: 'https://pay.hotmart.com/C99303085S',
  caidaCabello: 'https://go.hotmart.com/E107034444T?dp=1',
  insomnio: 'https://go.hotmart.com/A107036606X?dp=1',
  diarioHipo: 'https://pay.hotmart.com/B103582518G',
  diarioHiper: 'https://go.hotmart.com/E103583752B?dp=1',
  probioticos: 'https://go.hotmart.com/C107039605P?dp=1',
  hashimoto: 'https://go.hotmart.com/M107038625A?dp=1',
  autocuidado: 'https://pay.hotmart.com/E104236731U',
};

// ─── Precios locales (COP) — null = precio publicado en Hotmart ──
export const PRICES = {
  coleccion: { price: 79900, compare: 119900 },
  caidaCabello: { price: null, compare: null },
  insomnio: { price: null, compare: null },
  diarioHipo: { price: 24900, compare: 39900 },
  diarioHiper: { price: 24900, compare: 39900 },
  probioticos: { price: null, compare: null },
  hashimoto: { price: null, compare: null },
  autocuidado: { price: 49900, compare: 79900 },
};

// ─── Lead magnets (recursos gratuitos por landing) ───────────
export const LEAD_MAGNETS = {
  coleccion: {
    title: 'Checklist para organizar tu autocuidado tiroideo',
    cta: 'QUIERO EL CHECKLIST GRATIS',
    resource: 'checklist-autocuidado-tiroideo',
    summary: 'Medicamentos, horarios, suplementos, síntomas, exámenes y preguntas para consulta en una sola hoja.',
  },
  caidaCabello: {
    title: 'Checklist: 8 datos que conviene registrar cuando aparece caída del cabello',
    cta: 'ENVIARME EL CHECKLIST',
    resource: 'checklist-8-datos-caida-cabello',
    summary: 'Un formato sencillo para registrar los datos que tu equipo de salud agradecerá tener claros.',
  },
  insomnio: {
    title: 'Registro de sueño y síntomas tiroideos de 7 días',
    cta: 'QUIERO MI REGISTRO DE SUEÑO',
    resource: 'registro-sueno-7-dias',
    summary: 'Una página por noche para observar horarios, interrupciones, síntomas y sensaciones al despertar.',
  },
  diarioHipo: {
    title: 'Tracker emocional de 7 días',
    cta: 'QUIERO MI TRACKER GRATIS',
    resource: 'tracker-emocional-7-dias',
    summary: 'Una herramienta sencilla para nombrar, registrar y entender tus emociones durante una semana.',
  },
  diarioHiper: {
    title: 'Registro de emociones, energía y descanso',
    cta: 'QUIERO EMPEZAR MI REGISTRO',
    resource: 'registro-emociones-energia-descanso',
    summary: 'Pensado para el ritmo acelerado del hipertiroidismo: tres observaciones diarias en menos de 5 minutos.',
  },
  probioticos: {
    title: 'Checklist básico de hábitos para cuidar tu salud gastrointestinal',
    cta: 'QUIERO EL CHECKLIST',
    resource: 'checklist-habitos-gastrointestinales',
    summary: 'Hábitos simples, comidas y observaciones para entender mejor cómo responde tu sistema digestivo.',
  },
  hashimoto: {
    title: 'Plantilla para organizar comidas, síntomas y preguntas nutricionales',
    cta: 'QUIERO MI PLANTILLA GRATIS',
    resource: 'plantilla-comidas-sintomas-hashimoto',
    summary: 'Una semana planificable con espacio para comidas, síntomas y las preguntas que llevarás a consulta.',
  },
};

// ─── FAQ por producto (formato [pregunta, respuesta]) ────────
export const PRODUCT_FAQS = {
  coleccion: [
    ['¿Para quién es la Colección de la Tiroides?', 'Está pensada para personas que viven con una condición tiroidea (hipotiroidismo, hipertiroidismo, Hashimoto, tiroidectomía) y necesitan un punto de partida ordenado para entender su diagnóstico, su tratamiento y sus hábitos. No es un tratamiento ni sustituye la atención médica.'],
    ['¿En qué formato viene?', 'Es una colección digital descargable con guías, diarios, tablas y plantillas. Puedes leerla en computador, tablet o celular y volver a consultarla cuando lo necesites.'],
    ['¿Cómo la recibo?', 'La entrega se realiza a través de Hotmart. Después del pago recibes el acceso inmediato en la plataforma y por correo.'],
    ['¿Tengo acceso inmediato?', 'Sí. En cuanto Hotmart confirma el pago, la colección queda disponible para descargar de inmediato.'],
    ['¿La puedo consultar varias veces?', 'Sí, es tuya para siempre. Puedes volver a las tablas, guías y plantillas cada vez que surja una duda.'],
    ['¿Esto sustituye una consulta médica?', 'No. La Colección es un material educativo para comprender, organizar y preparar preguntas. Las decisiones de tratamiento siempre se toman con tu equipo de salud.'],
    ['¿Me sirve si no sé qué diagnóstico tengo?', 'La Colección parte de situaciones cotidianas del autocuidado tiroideo, sin requerir un diagnóstico específico. Si aún no tienes orientación clínica, búscala también con un profesional.'],
    ['¿Qué diferencia tiene frente a comprar una guía suelta?', 'La Colección reúne en un solo lugar las guías y herramientas que suelen comprarse por separado, con una ruta ordenada paso a paso. Si solo necesitas resolver un tema puntual, una guía individual puede ser suficiente.'],
  ],
  caidaCabello: [
    ['¿Para quién es este protocolo?', 'Para personas con una condición tiroidea que están observando caída del cabello y quieren dejar de reaccionar con angustia para empezar a registrar y organizar. No es un tratamiento médico contra la caída.'],
    ['¿En qué formato viene?', 'Es un protocolo digital en PDF, descargable e imprimible, con tablas de registro, checklist y hojas de preguntas para consulta.'],
    ['¿Cómo lo recibo?', 'Se entrega por Hotmart: al confirmar el pago recibes el acceso para descargarlo en tu cuenta.'],
    ['¿Esto detiene la caída del cabello?', 'No prometemos eso. La caída asociada a la tiroides depende de factores hormonales, nutricionales, emocionales y de tratamiento. Este recurso te ayuda a organizar lo que sí depende de ti: registro, hábitos de cuidado y comunicación con tu equipo.'],
    ['¿Me sirve si no tengo diagnóstico tiroideo?', 'La caída del cabello tiene muchas causas. Si no tienes diagnóstico y la caída es intensa o persistente, lo primero es la valoración médica. El protocolo puede ayudarte a llevar esa consulta mejor preparada.'],
    ['¿Esto sustituye al dermatólogo?', 'No. Es material educativo complementario. La evaluación del cuero cabelludo, las causas médicas y los tratamientos los define el equipo de salud.'],
    ['¿Qué diferencia tiene con otros recursos sobre el tema?', 'No es una lista genérica de remedios. Es un sistema de registro y organización que convierte la caída del cabello en información útil para conversar con profesionales.'],
    ['¿Qué hago si tengo dudas adicionales?', 'Escríbenos por WhatsApp: la orientación para elegir el recurso es educativa y sin costo.'],
  ],
  insomnio: [
    ['¿Para quién es esta guía?', 'Para personas con una condición tiroidea que quieren organizar su descanso sin más instrucciones sueltas: registrando, creando rutinas realistas y sabiendo cuándo pedir ayuda.'],
    ['¿En qué formato viene?', 'Guía digital en PDF con registro de sueño de 7 días, rutina nocturna paso a paso y señales que conviene conversar con el equipo de salud.'],
    ['¿Cómo la recibo?', 'Por Hotmart. Después del pago la tienes disponible para descargar de inmediato y consultarla cuando quieras.'],
    ['¿Esto promete que dormiré mejor?', 'No hacemos promesas clínicas. La guía ayuda a observar patrones, reducir la dispersión de consejos y llevar información organizada a tu consulta. El tratamiento del insomnio de base corresponde al equipo médico.'],
    ['¿Sirve para cualquier diagnóstico?', 'La guía no requiere un diagnóstico específico: se enfoca en hábitos de descanso y en reconocer cuándo conviene consultar. Si tu insomnio es intenso, primero valora tu situación con tu médico.'],
    ['¿Puedo usarla con mi medicamento?', 'La guía es educativa y no indica cambios de dosis. Registra tus horarios de medicación y suplementos para conversarlos con tu equipo.'],
    ['¿Qué relación tiene con los diarios de emociones?', 'El sueño, la energía y las emociones se conectan. Si además del sueño sientes que las emociones pesan, el diario emocional correspondiente puede complementar tu registro.'],
  ],
  diarioHipo: [
    ['¿Para quién es este diario?', 'Para personas con hipotiroidismo que viven con emociones intensas o cambiantes y quieren una herramienta para observarlas, nombrarlas y llevarlas mejor a consulta.'],
    ['¿En qué formato viene?', 'Diario digital imprimible con tracker de 7 días, preguntas de reflexión, espacio para energía y síntomas, y páginas para preparar consultas.'],
    ['¿Cómo lo recibo?', 'Después del pago en Hotmart queda disponible en tu cuenta para imprimir o usar digitalmente, las veces que necesites.'],
    ['¿Sirve si tomo levotiroxina?', 'Sí. El diario no interviene en tu medicación; puede ayudarte a observar si tus emociones cambian junto con tu energía, sueño o síntomas, lo cual es información valiosa para compartir con tu equipo.'],
    ['¿Esto reemplaza la terapia psicológica?', 'No. Es una herramienta de autocuidado y registro. La atención emocional profunda se define con profesionales de salud mental.'],
    ['¿Qué diferencia tiene con el diario para hipertiroidismo?', 'El diario de hipotiroidismo se enfoca en la lentitud, la fatiga y el aplanamiento emocional. El de hipertiroidismo está pensado para la aceleración y la ansiedad. Ambos comparten estructura, con registros adaptados a cada experiencia.'],
    ['¿Se puede usar durante el embarazo?', 'Si convives con hipotiroidismo y embarazo, el registro puede acompañarte, pero las emociones en ese período tienen un manejo médico propio. Comenta su uso con tu equipo.'],
  ],
  diarioHiper: [
    ['¿Para quién es este diario?', 'Para personas con hipertiroidismo o enfermedad de Graves que sienten la vida acelerada: ansiedad, inquietud, insomnio y emociones intensas. Este diario ofrece registro, orden y preparación de consultas.'],
    ['¿En qué formato viene?', 'Diario digital imprimible con registro de emociones, energía y descanso, ejercicios de autocuidado y páginas de preparación de consulta.'],
    ['¿Cómo lo recibo?', 'Por Hotmart. Una vez confirmado el pago, el diario queda en tu cuenta para usar las veces que quieras.'],
    ['¿Esto sustituye la atención médica o psiquiátrica?', 'No. El hipertiroidismo puede acompañarse de ansiedad significativa; el tratamiento lo dirige el equipo médico. El diario es un complemento educativo y de registro.'],
    ['¿Puedo usarlo si estoy en tratamiento?', 'Sí, es compatible con cualquier fase de tratamiento (medicamentos, yodo o cirugía). De hecho, registrar emociones, energía y descanso durante el tratamiento te ayuda a conversar mejor con tu endocrinólogo.'],
    ['¿Para qué me sirve el registro de energía?', 'Para observar si hay un patrón: horas de mayor energía, actividades que la desgastan y descanso real. Es información útil para hablar de autocuidado sin culpa.'],
    ['¿Se enfoca solo en emociones o también en la tiroides?', 'Conecta lo emocional con tu vida tiroidea: el diario tiene espacio para síntomas y preguntas para tu equipo.'],
  ],
  probioticos: [
    ['¿Para quién es la guía?', 'Para personas que usan o quieren usar probióticos y necesitan entender qué son, cómo elegir uno y qué preguntar antes de comprar.'],
    ['¿En qué formato viene?', 'Guía digital en PDF con conceptos claros, criterios de lectura de etiquetas, checklist de hábitos y preguntas para consulta.'],
    ['¿Cómo la recibo?', 'Por Hotmart: acceso inmediato tras el pago, para consultar en cualquier dispositivo.'],
    ['¿Recomienda un probiótico específico?', 'No. No promovemos marcas. La guía enseña a evaluar cepas, presentaciones y datos de calidad para que la decisión la tomes con tu equipo de salud.'],
    ['¿Esto sustituye a un gastroenterólogo?', 'No. La guía es educativa. Los problemas digestivos importantes y las condiciones de fondo requieren valoración profesional.'],
    ['¿Me sirve si tengo Hashimoto?', 'La relación microbiota-tiroides es un tema en investigación. La guía trata el uso responsable de probióticos en general, sin afirmar un efecto sobre la autoinmunidad.'],
    ['¿Puedo tomarlos con levotiroxina?', 'Los probióticos suelen no interferir, pero la práctica prudente es separar horarios y consultarlo con tu farmacéutico o médico. La guía incluye estas pautas.'],
  ],
  hashimoto: [
    ['¿Para quién es esta guía?', 'Para personas con tiroiditis de Hashimoto que quieren organizar su alimentación con criterio: entender qué patrones se recomiendan, cuáles son modas y cómo llevar la cuenta de lo que prueban.'],
    ['¿Qué incluye?', 'Fundamentos de nutrición en Hashimoto, ideas de comidas variadas, plantilla de planificación, registro de síntomas y preguntas nutricionales para consulta.'],
    ['¿Es una dieta restrictiva?', 'No. No promovemos eliminación de grupos alimentarios ni detox. El enfoque es variado, sostenible y sin culpa.'],
    ['¿Cómo lo recibo?', 'Digital por Hotmart. Al confirmar el pago queda disponible en tu cuenta para descargar y consultar.'],
    ['¿Esto reemplaza a un nutricionista?', 'No. La guía educa y organiza. Un nutricionista que conozca tu historia clínica puede personalizar el plan según tu contexto y tus exámenes.'],
    ['¿Me sirve si también tengo celiaquía u otra condición?', 'Si conviven varias condiciones, la personalización es clave. La guía te da la estructura, pero los cambios relevantes deben conversarse con tu equipo.'],
    ['¿El gluten empeora Hashimoto?', 'Es un tema activamente investigado, sin consenso para todos. La guía no impone restricción de gluten; te explica cómo observarte y conversarlo con tu equipo.'],
    ['¿Qué diferencia frente a otros libros de nutrición?', 'No prometemos "reparar la tiroides con comida". La guía se enfoca en organización y decisiones reales dentro de tu tratamiento.'],
  ],
};
