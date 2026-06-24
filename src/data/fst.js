/**
 * ============================================================
 *  FELIZ SIN TIROIDES® — CONTENIDO DE LA PLATAFORMA
 *  Marca de Karla Hernández (Química Farmacéutica y paciente
 *  sobreviviente de cáncer de tiroides).
 *
 *  Todo es editable. Los precios están en COP y alimentan el
 *  carrito + Mercado Pago. Cambia textos, precios y enlaces.
 * ============================================================
 */

// ─── GUÍAS Y EBOOKS (se venden con carrito + Mercado Pago) ───
// ⚠️ PRECIOS DE EJEMPLO — edita 'price' y 'comparePrice' (en COP) con tus precios reales.
// 'hotmartUrl' se conserva solo como referencia (el botón usa Mercado Pago, no Hotmart).
export const ebooks = [
  {
    id: 'fst-coleccion-sana',
    name: 'Colección SANA TU TIROIDES desde 0',
    category: 'Colección · Feliz Sin Tiroides',
    description: 'El programa más completo: todo lo que necesitas para entender y cuidar tu tiroides paso a paso, desde cero. Tu mejor punto de partida.',
    price: 79900,
    comparePrice: 119900,
    cover: { emoji: '🦋', gradient: 'from-teal-500 to-blush-400' },
    tag: 'Colección completa',
    hotmartUrl: 'https://go.hotmart.com/C99303085S?dp=1',
    featured: true,
  },
  {
    id: 'fst-comer-hipotiroidismo',
    name: 'Aprende a Comer con Hipotiroidismo',
    category: 'Guía de alimentación · Feliz Sin Tiroides',
    description: 'Cómo alimentarte cuando tu tiroides funciona de menos: qué favorece y qué evita tu metabolismo, con orientación práctica.',
    price: 34900,
    comparePrice: 49900,
    cover: { emoji: '🍽️', gradient: 'from-teal-500 to-deepblue-700' },
    tag: 'Guía',
    hotmartUrl: 'https://go.hotmart.com/N100606654K?dp=1',
  },
  {
    id: 'fst-dieta-antiinflamatoria',
    name: 'Aprende a Comer con la Dieta Antiinflamatoria y Sana tu Tiroides',
    category: 'Guía de alimentación · Feliz Sin Tiroides',
    description: 'Una alimentación antiinflamatoria para apoyar tu tiroides y tu bienestar general, explicada de forma sencilla y aplicable.',
    price: 34900,
    comparePrice: 49900,
    cover: { emoji: '🥗', gradient: 'from-blush-400 to-teal-500' },
    tag: 'Guía',
    hotmartUrl: 'https://go.hotmart.com/O103583638M?dp=1',
  },
  {
    id: 'fst-comer-hipertiroidismo',
    name: 'Aprende a Comer para Sanar el Hipertiroidismo y Graves',
    category: 'Guía de alimentación · Feliz Sin Tiroides',
    description: 'Alimentación enfocada en hipertiroidismo y enfermedad de Graves, para acompañar tu tratamiento desde la mesa.',
    price: 34900,
    comparePrice: 49900,
    cover: { emoji: '🍵', gradient: 'from-teal-600 to-blush-400' },
    tag: 'Guía',
    hotmartUrl: 'https://go.hotmart.com/V100880105F?dp=1',
  },
  {
    id: 'fst-guia-ayunos',
    name: 'Guía completa de Ayunos',
    category: 'Guía · Feliz Sin Tiroides',
    description: 'Todo sobre el ayuno de forma segura y consciente: tipos, beneficios y cómo aplicarlo cuidando tu salud tiroidea.',
    price: 29900,
    comparePrice: 44900,
    cover: { emoji: '⏳', gradient: 'from-deepblue-700 to-teal-600' },
    tag: 'Guía',
    hotmartUrl: 'https://go.hotmart.com/I103583345S?dp=1',
  },
  {
    id: 'fst-yodoterapia',
    name: 'Guía práctica para la Yodoterapia I-131',
    category: 'Guía · Feliz Sin Tiroides',
    description: 'Acompañamiento práctico para entender y atravesar la yodoterapia con I-131: qué esperar, cuidados y dudas frecuentes.',
    price: 34900,
    comparePrice: 49900,
    cover: { emoji: '⚛️', gradient: 'from-teal-600 to-deepblue-800' },
    tag: 'Guía',
    hotmartUrl: 'https://go.hotmart.com/P100879796W?dp=1',
  },
  {
    id: 'fst-diario-hipotiroidismo',
    name: 'Diario de las Emociones para el Hipotiroidismo',
    category: 'Diario · Feliz Sin Tiroides',
    description: 'Una herramienta para registrar y gestionar tus emociones mientras vives con hipotiroidismo. Tu bienestar también es emocional.',
    price: 24900,
    comparePrice: 39900,
    cover: { emoji: '📔', gradient: 'from-blush-400 to-deepblue-700' },
    tag: 'Diario',
    hotmartUrl: 'https://go.hotmart.com/B103582518G?dp=1',
  },
  {
    id: 'fst-diario-hipertiroidismo',
    name: 'Diario de Manejo de Emociones en Hipertiroidismo',
    category: 'Diario · Feliz Sin Tiroides',
    description: 'Un espacio para acompañar tus emociones durante el hipertiroidismo, con ejercicios sencillos de manejo y registro.',
    price: 24900,
    comparePrice: 39900,
    cover: { emoji: '📓', gradient: 'from-blush-500 to-teal-600' },
    tag: 'Diario',
    hotmartUrl: 'https://go.hotmart.com/E103583752B?dp=1',
  },
  {
    // ⚠️ Producto sin nombre definido — edita 'name', 'description' y 'price' cuando lo tengas.
    id: 'fst-producto-pendiente',
    name: 'Nuevo recurso para tu tiroides (próximamente)',
    category: 'Recurso · Feliz Sin Tiroides',
    description: 'Un nuevo recurso para cuidar tu salud tiroidea. Pronto te contamos todos los detalles.',
    price: 29900,
    comparePrice: null,
    cover: { emoji: '📘', gradient: 'from-teal-500 to-blush-500' },
    tag: 'Nuevo',
    hotmartUrl: 'https://go.hotmart.com/E104236731U?dp=1',
  },
];

// ─── RECURSOS GRATIS (captación de leads) ────────────────────
// El botón apunta a LEAD_FORM_URL (configúralo en src/config/links.js)
export const recursosGratis = [
  { icon: 'clipboard', title: 'Checklist: cómo prepararte para tu consulta de tiroides' },
  { icon: 'checkCircle', title: 'Plantilla de seguimiento de síntomas y exámenes' },
  { icon: 'droplet', title: 'Mini guía: hábitos diarios para tu metabolismo' },
  { icon: 'bell', title: 'Recordatorio imprimible para tu levotiroxina' },
];

// ─── SERVICIOS / PROGRAMAS ───────────────────────────────────
export const servicios = [
  {
    id: 'mapa-inicial',
    name: 'Mapa Inicial de Salud Tiroidea y Metabólica',
    duration: 'Sesión inicial',
    icon: 'compass',
    featured: false,
    description: 'Una evaluación inicial para entender tu punto de partida: revisamos tus exámenes, síntomas, medicación y hábitos para trazar un plan claro.',
    includes: [
      'Revisión de tus exámenes recientes',
      'Identificación de banderas rojas',
      'Recomendaciones personalizadas',
      'Resumen escrito con tus próximos pasos',
    ],
  },
  {
    id: 'ordena-4-semanas',
    name: 'Ordena tu Salud Tiroidea y Metabólica',
    duration: 'Programa de 4 semanas',
    icon: 'leaf',
    featured: true,
    description: 'Programa práctico para poner orden en tu adherencia, tu alimentación y tus hábitos durante un mes de acompañamiento cercano.',
    includes: [
      'Plan de adherencia a tu medicación',
      'Guía de alimentación adaptada',
      'Seguimiento semanal de síntomas',
      'Material descargable y plantillas',
      'Acompañamiento por WhatsApp',
    ],
  },
  {
    id: 'renueva-8-semanas',
    name: 'Renueva tu Metabolismo y tu Energía',
    duration: 'Programa de 8 semanas',
    icon: 'sparkles',
    featured: false,
    description: 'Un acompañamiento más profundo para quienes quieren recuperar energía, mejorar hábitos y sostener los cambios en el tiempo.',
    includes: [
      'Todo lo del programa de 4 semanas',
      'Plan de energía y descanso',
      'Estrategias de movimiento realistas',
      'Revisión de avances quincenal',
      'Comunidad de apoyo',
    ],
  },
  {
    id: 'comunidad',
    name: 'Comunidad Feliz Sin Tiroides',
    duration: 'Membresía mensual',
    icon: 'users',
    featured: false,
    description: 'Un espacio mensual de educación y acompañamiento para no sentirte sola en el proceso, con contenido nuevo y resolución de dudas.',
    includes: [
      'Encuentros educativos mensuales',
      'Biblioteca de recursos',
      'Resolución de dudas frecuentes',
      'Comunidad de pacientes',
    ],
  },
];

// ─── ENFERMEDADES TIROIDEAS (educativo) ──────────────────────
export const enfermedades = [
  { icon: 'trendDown', name: 'Hipotiroidismo', desc: 'La tiroides produce pocas hormonas: fatiga, frío, aumento de peso y lentitud. El más frecuente.' },
  { icon: 'trendUp', name: 'Hipertiroidismo', desc: 'La tiroides produce hormonas en exceso: ansiedad, palpitaciones, pérdida de peso e insomnio.' },
  { icon: 'shield', name: 'Tiroiditis de Hashimoto', desc: 'Enfermedad autoinmune que ataca la tiroides; la causa más común de hipotiroidismo.' },
  { icon: 'circle', name: 'Nódulos tiroideos', desc: 'Bultos en la tiroides, casi siempre benignos, que requieren seguimiento adecuado.' },
  { icon: 'heart', name: 'Cáncer de tiroides', desc: 'En la mayoría de casos tiene muy buen pronóstico con tratamiento y seguimiento. La historia de Karla.' },
  { icon: 'scale', name: 'Salud metabólica', desc: 'Resistencia a la insulina, peso y energía: cómo se conectan con tu tiroides.' },
];

// ─── CURSOS RECOMENDADOS (Edutin, afiliados) ─────────────────
export const cursosFST = [
  { name: 'Nutrición', code: 'SH-9356',  url: 'https://edutin.com/sh-9356' },
  { name: 'Endocrinología', code: 'SH-20399', url: 'https://edutin.com/sh-20399' },
  { name: 'Diabetes', code: 'SH-20358', url: 'https://edutin.com/sh-20358' },
  { name: 'Farmacología clínica', code: 'SH-7429', url: 'https://edutin.com/sh-7429' },
  { name: 'Microbiota', code: 'SH-20359', url: 'https://edutin.com/sh-20359' },
  { name: 'Telesalud y telemedicina', code: 'SH-22313', url: 'https://edutin.com/sh-22313' },
  { name: 'Nutrición infantil', code: 'SH-9768', url: 'https://edutin.com/sh-9768' },
  { name: 'TCC para la ansiedad', code: 'SH-22466', url: 'https://edutin.com/sh-22466' },
];

// ─── TIENDA RECOMENDADA (Amazon, afiliados) ──────────────────
// ↓ Reemplaza cada 'url' por tu enlace de afiliado de Amazon.
export const tiendaAmazon = [
  { icon: 'pill', name: 'Pastilleros semanales', desc: 'Organiza tu levotiroxina y suplementos por días.', url: 'https://www.amazon.com/s?k=pastillero+semanal' },
  { icon: 'cube', name: 'Organizadores de medicamentos', desc: 'Mantén tu tratamiento ordenado y a la vista.', url: 'https://www.amazon.com/s?k=organizador+de+medicamentos' },
  { icon: 'droplet', name: 'Botellas de agua', desc: 'Hidratación con marcas de horario para tu día.', url: 'https://www.amazon.com/s?k=botella+de+agua+motivacional' },
  { icon: 'book', name: 'Libretas de seguimiento', desc: 'Registra síntomas, ánimo y exámenes.', url: 'https://www.amazon.com/s?k=libreta+de+seguimiento+salud' },
  { icon: 'scale', name: 'Básculas de cocina', desc: 'Para porciones y recetas amigas de tu metabolismo.', url: 'https://www.amazon.com/s?k=bascula+de+cocina+digital' },
];

// ─── TESTIMONIOS ──────────────────────────────────────────────
export const testimonios = [
  { name: 'Laura M.', role: 'Paciente con hipotiroidismo', text: 'Por fin entendí mis exámenes y dejé de tomar la levotiroxina de cualquier forma. Karla explica con un cariño que tranquiliza.' },
  { name: 'Andrea P.', role: 'Tiroiditis de Hashimoto', text: 'El programa de 4 semanas me ayudó a ordenar mis hábitos sin volverme loca. Recuperé energía y confianza.' },
  { name: 'Carolina R.', role: 'Sobreviviente de cáncer de tiroides', text: 'Sentir que alguien que vivió lo mismo te acompaña no tiene precio. Me sentí entendida en cada paso.' },
];
