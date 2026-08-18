/**
 * ============================================================
 *  nutrifst.js — Motor de conocimiento de NutriFST IA
 *
 *  Motor local basado en reglas y base de conocimiento
 *  controlada. No usa LLM externo: respuestas deterministas,
 *  seguras y con evidencia real verificable.
 *
 *  Seguridad clínica (3 niveles):
 *    verde   → información educativa general
 *    amarillo→ situaciones que requieren revisión profesional
 *    rojo    → la IA no da instrucciones clínicas (bloqueado)
 * ============================================================
 */

import { findFood, unknownFoodResponse } from '../../data/fstApp/alimentos.js';
import { getEvidence } from '../../data/fstApp/evidence.js';
import { findNutrient, estimatePlate, plateFeedback } from '../../data/fstApp/nutrientes.js';
import { recipes, findRecipesWithIngredients, buildShoppingList, mealLabels } from '../../data/fstApp/recetas.js';

export const uid = prefix => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const normalize = value => String(value || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim();

const RED_PATTERNS = [
  /cambi[oa]r?\s+(la\s+|mi\s+|el\s+|tu\s+|su\s+)?dosis/i,
  /aument[oa]r?\s+(la\s+|mi\s+|el\s+|tu\s+|su\s+)?dosis/i,
  /baj[oa]r?\s+(la\s+|mi\s+|el\s+|tu\s+|su\s+)?dosis/i,
  /reducir\s+(la\s+|mi\s+|el\s+|tu\s+|su\s+)?dosis/i,
  /suspender|dejar\s+de\s+tomar|dejar\s+la\s+levotiroxina|dejar\s+mi\s+levotiroxina/i,
  /omitir\s+(la\s+|mi\s+)?dosis/i,
  /diagnostic[oa]r|qu[eé]\s+enfermedad\s+tengo|es\s+cancer|tengo\s+cancer|qu[eé]\s+condici[oó]n\s+tengo/i,
  /emergencia|urgencia|hospital|ambulancia/i,
  /dificultad\s+para\s+respirar|no\s+puedo\s+respirar/i,
  /dolor\s+en\s+el\s+pecho|dolor\s+de\s+pecho/i,
  /desmay[oa]|perd[ií]\s+el\s+conocimiento/i,
  /convulsion|convulsión/i,
  /sangrado|sangrando/i,
  /fiebre\s+alta|fiebre\s+de\s+\d+/i,
  /tsh\s+(alta|baja|elevada|normal|alterada)|t4\s+(alta|baja)|t3\s+(alta|baja)/i,
  /tratar\s+(el|la|mi)\s+(hipotiroidismo|hipertiroidismo|hashimoto|graves)/i,
  /medicamento\s+para|recomi[eé]ndame\s+un\s+medicamento|qu[eé]\s+medicamento\s+me\s+recomiendas|qu[eé]\s+medicamento/i,
  /inyecta|pastilla\s+para\s+la\s+tiroides\s+que\s+no\s+sea/i,
];

const YELLOW_PATTERNS = [
  /palpitaciones|coraz[oó]n\s+acelerado|taquicardia/i,
  /ansiedad|angustia|p[áa]nico/i,
  /insomnio|no\s+puedo\s+dormir|mal\s+dormir/i,
  /estre[nñ]imiento|constipaci[oó]n/i,
  /diarrea/i,
  /hinchaz[oó]n|inflamaci[oó]n\s+abdominal/i,
  /hormigueo|entumecimiento/i,
  /ca[ií]da\s+de\s+cabello|se\s+me\s+cae\s+el\s+cabello/i,
  /fatiga|cansancio|agotamiento/i,
  /niebla\s+mental|concentraci[oó]n/i,
  /cambios\s+de\s+peso|sub[ií]\s+de\s+peso|baj[eé]\s+de\s+peso/i,
  /calambres|dolor\s+muscular/i,
  /intolerancia\s+al\s+fr[ií]o|intolerancia\s+al\s+calor/i,
  /temblor/i,
  /sue[nñ]o\s+excesivo|somnolencia/i,
  /dosis\s+olvidada|olvid[eé]\s+mi\s+dosis|olvid[eé]\s+tomar/i,
  /interacci[oó]n|interfiere|puedo\s+tomar\s+juntos/i,
  /suplemento|vitamina|mineral|calcio|hierro|zinc|selenio|biotina|magnesio/i,
  /embarazo|embarazada|amantando|amamantando/i,
  /cirug[ií]a|operaci[oó]n|yodoterapia|radioyodo/i,
];

const MENU_PATTERNS = [
  /men[uú]|plan\s+de\s+comidas|qu[eé]\s+puedo\s+desayunar|qu[eé]\s+puedo\s+almorzar|qu[eé]\s+puedo\s+cenar|semana\s+de\s+comidas/i,
];

const COOK_PATTERNS = [
  /cocina\s+con\s+lo\s+que\s+tengo|qu[eé]\s+puedo\s+cocinar|con\s+lo\s+que\s+tengo|ingredientes\s+disponibles|qu[eé]\s+me\s+preparo|qu[eé]\s+hago\s+con/i,
];

const EAT_PATTERNS = [
  /puedo\s+comer|puedo\s+tomar|es\s+seguro\s+comer|puedo\s+consumir|me\s+conviene\s+comer|qu[eé]\s+tal\s+es\s+el|qu[eé]\s+tal\s+es\s+la|analiza\s+el\s+alimento|qu[eé]\s+piensas\s+de/i,
];

const PLATE_PATTERNS = [
  /analiza\s+este\s+plato|analiza\s+mi\s+plato|qu[eé]\s+tiene\s+mi\s+plato|analiza\s+mi\s+comida|qu[eé]\s+com[ií]|registra\s+mi\s+comida/i,
];

const SUPPLEMENT_PATTERNS = [
  /suplemento|vitamina|mineral|etiqueta\s+de\s+suplemento|analiza\s+esta\s+etiqueta|analiza\s+este\s+suplemento/i,
];

const SYMPTOM_PATTERNS = [
  /s[ií]ntoma|patr[oó]n|tendencia|energ[ií]a|sue[nñ]o|estre[nñ]imiento|concentraci[oó]n|palpitaciones|ansiedad|hinchaz[oó]n|hormigueo|emocional/i,
];

const GREETING_PATTERNS = [
  /^hola|^buenos\s+d[ií]as|^buenas\s+tardes|^buenas\s+noches|^hey|^qu[eé]\s+tal/i,
];

const THANKS_PATTERNS = [
  /gracias|muchas\s+gracias|excelente|perfecto|genial/i,
];

const HELP_PATTERNS = [
  /qu[eé]\s+puedes\s+hacer|ayuda|qu[eé]\s+me\s+recomiendas\s+preguntar|qu[eé]\s+funciones\s+tienes|qu[eé]\s+es\s+nutrifst/i,
];

const LOW_IODINE_PATTERNS = [
  /dieta\s+baja\s+en\s+yodo|yodoterapia|radioyodo|baja\s+en\s+yodo/i,
];

const LEVO_PATTERNS = [
  /levotiroxina|tiroides|tiroidectom[ií]a|hashimoto|graves|hipotiroidismo|hipertiroidismo/i,
];

const TIME_PATTERNS = [
  /horario|hora\s+de\s+tomar|cu[áa]ndo\s+tomar|ayunas|desayuno\s+y\s+medicamento/i,
];

const CAFE_PATTERNS = [
  /caf[eé]|tinto|espresso|capuchino/i,
];

const CALCIO_PATTERNS = [
  /calcio|leche|l[áa]cteos|queso|yogur/i,
];

const HIERRO_PATTERNS = [
  /hierro|ferroso|anemia/i,
];

const BIOTINA_PATTERNS = [
  /biotina|ex[áa]menes\s+de\s+tiroides|pruebas\s+de\s+tiroides|laboratorio/i,
];

const YODO_PATTERNS = [
  /yodo|algas|kelp|sal\s+yodada/i,
];

const MEDICATION_RECOMMENDATION_PATTERNS = [
  /medicamento\s+para|recomi[eé]ndame\s+un\s+medicamento|qu[eé]\s+medicamento\s+me\s+recomiendas|qu[eé]\s+medicamento|inyecta|pastilla\s+para\s+la\s+tiroides\s+que\s+no\s+sea/i,
];

const YODO_SUPPLEMENT_PATTERNS = [
  /puedo\s+tomar\s+yodo|tomar\s+suplemento\s+de\s+yodo|suplemento\s+de\s+yodo|gotas\s+de\s+yodo|lugol|yoduro|puedo\s+tomar\s+kelp|puedo\s+tomar\s+algas/i,
];

const SOYA_PATTERNS = [
  /soya|soja|tofu|tempeh/i,
];

const FIBRA_PATTERNS = [
  /fibra|avena|salvado|integral/i,
];

const EMERGENCY_PATTERNS = [
  /emergencia|urgencia|ambulancia|dificultad\s+para\s+respirar|dolor\s+en\s+el\s+pecho|dolor\s+de\s+pecho|desmay|convulsion|sangrado|fiebre\s+alta/i,
];

const DOSIS_PATTERNS = [
  /dosis|mcg|microgramos|mg|miligramos|aumentar|disminuir|suspender|dejar\s+de\s+tomar|omitir/i,
];

const DIAGNOSTIC_PATTERNS = [
  /diagnostic|qu[eé]\s+enfermedad\s+tengo|es\s+cancer|tengo\s+cancer|qu[eé]\s+condici[oó]n\s+tengo/i,
];

const LAB_PATTERNS = [
  /tsh|t4|t3|tiroglobulina|anticuerpos|laboratorio|ex[áa]menes/i,
];

const PREGNANCY_PATTERNS = [
  /embarazo|embarazada|amantando|amamantando|lactancia/i,
];

function buildResponse({ brief, meaning, actions, medication, evidence, level = 'verde', redNote = null }) {
  return {
    level,
    brief,
    meaning,
    actions,
    medication,
    evidence: getEvidence(evidence),
    redNote,
  };
}

function redResponse(query) {
  return buildResponse({
    level: 'rojo',
    brief: 'Esto es algo que debes conversar con tu equipo de salud, no algo que yo pueda indicar.',
    meaning: 'Cambiar dosis, suspender medicamentos, diagnosticar o tratar alteraciones de laboratorio son decisiones clínicas que solo corresponden a tu profesional tratante.',
    actions: [
      'Escribe la pregunta exacta que quieres hacerle a tu profesional.',
      'Lleva tus exámenes, el frasco del medicamento y tus registros a la consulta.',
      'Si es una emergencia (dolor de pecho, dificultad para respirar, desmayo), busca atención inmediata.',
    ],
    medication: 'No modifiques, suspendas ni cambies la dosis de ningún medicamento por indicación de una aplicación.',
    evidence: ['ata-hipotiroidismo-2014'],
    redNote: 'Consulta con tu profesional de salud. Esta herramienta no da instrucciones clínicas.',
  });
}

function emergencyResponse() {
  return buildResponse({
    level: 'rojo',
    brief: 'Si estás ante una emergencia, busca atención médica inmediata.',
    meaning: 'Los síntomas como dolor de pecho, dificultad para respirar, desmayo o convulsiones requieren evaluación urgente, no una respuesta de una aplicación.',
    actions: [
      'Llama a tu línea de emergencias local o acude al servicio de urgencias más cercano.',
      'Si alguien te acompaña, pídele que se quede contigo.',
      'Lleva la lista de tus medicamentos si es posible.',
    ],
    medication: 'No esperes a consultar una aplicación si hay signos de emergencia.',
    evidence: [],
    redNote: 'Emergencia: busca atención médica inmediata.',
  });
}

function greetingResponse() {
  return buildResponse({
    level: 'verde',
    brief: '¡Hola! Soy NutriFST, tu asistente de alimentación y hábitos para vivir con una condición tiroidea.',
    meaning: 'Puedo ayudarte con preguntas sobre alimentos, interacciones con levotiroxina, menús, suplementos y organización de tus registros.',
    actions: [
      'Pregúntame: "¿Puedo comer esto?" y escribe el alimento.',
      'Pídeme: "Hazme un menú para esta semana".',
      'Dime: "Cocina con lo que tengo" y lista tus ingredientes.',
      'Pregúntame por un suplemento o una etiqueta.',
    ],
    medication: 'Recuerda: no doy indicaciones clínicas ni cambios de dosis. Para eso está tu equipo de salud.',
    evidence: [],
  });
}

function helpResponse() {
  return buildResponse({
    level: 'verde',
    brief: 'Puedo ayudarte con alimentación, interacciones y organización de tu tratamiento.',
    meaning: 'Soy un asistente educativo basado en una base de conocimiento controlada. No diagnostico ni modifico tratamientos.',
    actions: [
      '¿Puedo comer café? → reviso el alimento y su relación con la levotiroxina.',
      'Hazme un menú → genero desayuno, almuerzo, cena y snack.',
      'Cocina con lo que tengo: pollo, arroz, huevo → propongo recetas con esos ingredientes.',
      'Analiza esta etiqueta → reviso suplementos y sus consideraciones.',
      'Registra mi comida → estimo proteína, fibra, vegetales y más.',
    ],
    medication: 'Nunca te diré que cambies dosis ni que suspendas medicamentos.',
    evidence: [],
  });
}

function thanksResponse() {
  return buildResponse({
    level: 'verde',
    brief: '¡Con gusto! Aquí estoy para lo que necesites.',
    meaning: 'Puedes seguir preguntándome sobre alimentos, menús, suplementos o tus registros.',
    actions: [
      'Pregúntame por un alimento o bebida.',
      'Pídeme un menú o una lista de compras.',
      'Registra tu comida o un síntoma desde el menú.',
    ],
    medication: '',
    evidence: [],
  });
}

function foodResponse(query, profile) {
  const food = findFood(query) || unknownFoodResponse(query);
  const lowIodine = profile?.lowIodineMode === true;
  const actions = [...food.tips];
  if (lowIodine && food.lowIodine) {
    actions.unshift(`Dieta baja en yodo: ${food.lowIodine}`);
  }
  return buildResponse({
    level: food.levo.level,
    brief: food.general,
    meaning: food.levo.text,
    actions,
    medication: food.levo.text,
    evidence: food.evidence,
  });
}

function menuResponse(query, profile) {
  const goal = profile?.nutritionGoal || 'equilibrada';
  const country = profile?.country || 'Colombia';
  const budget = profile?.budget || 'medio';
  const preferences = profile?.foodPreferences || [];
  const restrictions = profile?.restrictions || [];
  const time = profile?.cookTime || 30;
  const people = profile?.people || 1;

  const mealPool = {
    desayuno: recipes.filter(r => r.meal === 'desayuno'),
    almuerzo: recipes.filter(r => r.meal === 'almuerzo'),
    cena: recipes.filter(r => r.meal === 'cena'),
    snack: recipes.filter(r => r.meal === 'snack'),
  };

  const pick = (pool, avoid = []) => {
    let candidates = pool.filter(r => !avoid.includes(r.id));
    if (profile?.lowIodineMode) candidates = candidates.filter(r => r.lowIodine !== false);
    const byBudget = budget === 'bajo' ? candidates.filter(r => r.cost === 'bajo') : candidates;
    const byTime = time <= 20 ? byBudget.filter(r => r.time <= 20) : byBudget;
    const pool2 = (byTime.length ? byTime : byBudget.length ? byBudget : candidates);
    return pool2[Math.floor(Math.random() * pool2.length)];
  };

  const menu = {
    desayuno: pick(mealPool.desayuno),
    almuerzo: pick(mealPool.almuerzo),
    cena: pick(mealPool.cena),
    snack: pick(mealPool.snack),
  };

  const lines = [
    `Aquí tienes un menú para ${people} persona(s), pensado para un presupuesto ${budget === 'bajo' ? 'económico' : budget === 'alto' ? 'amplio' : 'medio'} y con ${time} minutos o menos por comida:`,
    '',
    `Desayuno: ${menu.desayuno.name} (${menu.desayuno.time} min)`,
    `Almuerzo: ${menu.almuerzo.name} (${menu.almuerzo.time} min)`,
    `Cena: ${menu.cena.name} (${menu.cena.time} min)`,
    `Snack opcional: ${menu.snack.name}`,
    '',
    'Cada comida tiene su botón "Cambiar esta comida" para ajustarla a tu gusto, presupuesto o ingredientes.',
  ];

  return {
    ...buildResponse({
      level: 'verde',
      brief: lines.join('\n'),
      meaning: 'El menú se genera con recetas de mi recetario según tu objetivo, país, presupuesto y tiempo disponible.',
      actions: [
        'Usa "Cambiar esta comida" para pedir una opción más económica, más rápida o con otros ingredientes.',
        'Genera la lista de compras desde el menú.',
        'Ajusta tu perfil (presupuesto, tiempo, personas) para menús más precisos.',
      ],
      medication: 'Las recetas no interfieren con la levotiroxina; recuerda separar la toma del medicamento de las comidas según tu indicación.',
      evidence: [],
    }),
    menu,
  };
}

function cookResponse(query) {
  const ingredients = query
    .replace(/cocinar\s+con\s+lo\s+que\s+tengo|qu[eé]\s+puedo\s+cocinar|con\s+lo\s+que\s+tengo|ingredientes\s+disponibles/gi, '')
    .split(/[,;y\n]+/)
    .map(item => item.trim())
    .filter(Boolean)
    .slice(0, 12);
  const results = findRecipesWithIngredients(ingredients);
  if (!results.length) {
    return buildResponse({
      level: 'verde',
      brief: 'No encontré recetas con esos ingredientes en mi recetario.',
      meaning: 'Puedo buscar con ingredientes más comunes: huevo, pollo, arroz, tomate, cebolla, papa, frijoles, aguacate, etc.',
      actions: [
        'Escribe los ingredientes separados por comas, por ejemplo: "pollo, arroz, huevo, tomate y aguacate".',
        'Pídeme un menú semanal y lo genero con mi recetario.',
      ],
      medication: '',
      evidence: [],
    });
  }
  const lines = [
    `Con lo que tienes, te propongo ${results.length} opción(es):`,
    '',
    ...results.map((item, index) => `${index + 1}. ${item.recipe.name} (${item.recipe.time} min) — usa ${item.recipe.ingredients.length - item.missing.length} de tus ingredientes${item.missing.length ? `; te faltaría: ${item.missing.map(m => m.name).join(', ')}` : ''}`),
    '',
    'Elige una y te muestro la preparación completa.',
  ];
  return {
    ...buildResponse({
      level: 'verde',
      brief: lines.join('\n'),
      meaning: 'Las opciones priorizan las recetas que usan más de tus ingredientes disponibles.',
      actions: [
        'Pide la preparación de cualquiera de estas recetas.',
        'Si te falta un ingrediente, puedo sugerir un sustituto.',
      ],
      medication: '',
      evidence: [],
    }),
    recipes: results.map(item => item.recipe),
  };
}

function plateResponse(query) {
  const items = query
    .replace(/analiza\s+este\s+plato|analiza\s+mi\s+plato|qu[eé]\s+tiene\s+mi\s+plato|analiza\s+mi\s+comida|qu[eé]\s+com[ií]|registra\s+mi\s+comida/gi, '')
    .split(/[,;y\n]+/)
    .map(item => item.trim())
    .filter(Boolean)
    .map(item => {
      const match = item.match(/^(\d+)\s*(x|porciones?|unidades?)?\s*(.+)$/i);
      if (match) return { name: match[3].trim(), amount: Number(match[1]) };
      return { name: item, amount: 1 };
    })
    .slice(0, 12);
  const estimate = estimatePlate(items);
  const feedback = plateFeedback(estimate);
  const { totals } = estimate;
  const lines = [
    'Estimación aproximada de tu plato:',
    '',
    `Proteína: ~${Math.round(totals.protein)} g`,
    `Fibra: ~${Math.round(totals.fiber)} g`,
    `Carbohidratos: ~${Math.round(totals.carbs)} g`,
    `Grasas: ~${Math.round(totals.fats)} g`,
    `Energía: ~${Math.round(totals.kcal)} kcal`,
    totals.vegetables >= 1 ? `Vegetales: sí (${Math.round(totals.vegetables)} porción(es))` : 'Vegetales: no detectados',
    totals.fruits >= 1 ? `Frutas: sí (${Math.round(totals.fruits)} porción(es))` : 'Frutas: no detectadas',
    '',
    `Algo positivo de tu plato: ${feedback.positives[0]}`,
    `Algo que podrías complementar: ${feedback.complements[0] || 'Está bastante completo.'}`,
  ];
  return {
    ...buildResponse({
      level: 'verde',
      brief: lines.join('\n'),
      meaning: 'Estos valores son estimaciones educativas basadas en porciones habituales, no un análisis nutricional exacto.',
      actions: [
        'Corrige los alimentos o cantidades si algo no coincide.',
        'Registra la comida en tu diario para ver tu progreso semanal.',
      ],
      medication: '',
      evidence: [],
    }),
    estimate,
  };
}

function supplementResponse(query) {
  const normalized = normalize(query);
  const found = [];
  const supplementMap = [
    { key: 'calcio', name: 'Calcio', food: 'calcio-suplemento' },
    { key: 'hierro', name: 'Hierro', food: 'hierro-suplemento' },
    { key: 'zinc', name: 'Zinc', food: 'zinc-suplemento' },
    { key: 'selenio', name: 'Selenio', food: 'selenio-suplemento' },
    { key: 'biotina', name: 'Biotina', food: 'biotina-suplemento' },
    { key: 'magnesio', name: 'Magnesio', food: 'magnesio-suplemento' },
    { key: 'vitamina d', name: 'Vitamina D', food: 'vitamina-d' },
    { key: 'vitamina c', name: 'Vitamina C', food: 'multivitaminico' },
    { key: 'omega', name: 'Omega-3', food: 'omega3' },
    { key: 'probiotico', name: 'Probióticos', food: 'probióticos' },
    { key: 'yodo', name: 'Yodo', food: 'yodo-suplemento' },
    { key: 'multivitaminico', name: 'Multivitamínico', food: 'multivitaminico' },
    { key: 'complejo b', name: 'Complejo B', food: 'multivitaminico' },
    { key: 'vitamina b12', name: 'Vitamina B12', food: 'multivitaminico' },
    { key: 'colageno', name: 'Colágeno', food: 'multivitaminico' },
  ];
  for (const item of supplementMap) {
    if (normalized.includes(item.key)) {
      const food = findFood(item.food);
      if (food) found.push({ ...food, matchedName: item.name });
    }
  }
  if (!found.length) {
    return buildResponse({
      level: 'verde',
      brief: 'No identifiqué un suplemento específico en tu pregunta.',
      meaning: 'Puedo revisar calcio, hierro, zinc, selenio, biotina, magnesio, vitamina D, omega-3, probióticos, yodo y multivitamínicos.',
      actions: [
        'Escribe el nombre del suplemento, por ejemplo: "¿el calcio interfiere con mi levotiroxina?"',
        'Si tienes una etiqueta, escribe los componentes principales.',
      ],
      medication: '',
      evidence: [],
    });
  }
  const lines = found.map(item => `• ${item.matchedName}: ${item.levo.text}`).join('\n');
  return buildResponse({
    level: found.some(item => item.levo.level === 'rojo') ? 'rojo' : found.some(item => item.levo.level === 'amarillo') ? 'amarillo' : 'verde',
    brief: `Revisé ${found.length === 1 ? 'el suplemento' : 'los suplementos'} que mencionaste:\n\n${lines}`,
    meaning: 'Estas consideraciones son educativas. No recomiendo iniciar, suspender ni cambiar suplementos automáticamente.',
    actions: [
      'Lleva el frasco o la etiqueta a tu consulta.',
      'Registra el suplemento en tu perfil para revisar interacciones con tu horario.',
      'Si estás en dieta baja en yodo, revisa la etiqueta: busca yodo, algas o kelp.',
    ],
    medication: 'Separa los suplementos minerales de la levotiroxina según la indicación de tu profesional.',
    evidence: found.flatMap(item => item.evidence),
  });
}

function symptomResponse(profile) {
  const symptoms = profile?.symptoms || [];
  if (symptoms.length < 2) {
    return buildResponse({
      level: 'verde',
      brief: 'Aún no tengo suficientes registros para observar una tendencia.',
      meaning: 'Con dos o más registros del mismo síntoma puedo mostrarte cómo cambia su intensidad con el tiempo.',
      actions: [
        'Registra tus síntomas desde el menú "+" o desde la sección Síntomas.',
        'Registra al menos 3–4 días para ver un patrón inicial.',
      ],
      medication: '',
      evidence: [],
    });
  }
  const byName = {};
  for (const item of symptoms) {
    if (!byName[item.name]) byName[item.name] = [];
    byName[item.name].push(item);
  }
  const lines = [];
  for (const [name, items] of Object.entries(byName)) {
    const sorted = items.sort((a, b) => String(a.date).localeCompare(String(b.date)));
    const first = Number(sorted[0].intensity);
    const last = Number(sorted[sorted.length - 1].intensity);
    const trend = last < first ? 'disminuyó' : last > first ? 'aumentó' : 'se mantuvo';
    lines.push(`• ${name}: ${trend} (de ${first}/10 a ${last}/10 en ${sorted.length} registro(s))`);
  }
  return buildResponse({
    level: 'verde',
    brief: `Tendencia observada en tus registros:\n\n${lines.join('\n')}`,
    meaning: 'Una asociación observada no significa necesariamente que una variable sea la causa de la otra. Estos datos sirven para conversar con tu equipo de salud.',
    actions: [
      'Lleva esta tendencia a tu próxima consulta.',
      'Sigue registrando para ver si el patrón se mantiene.',
      'Si algún síntoma es intenso (7/10 o más) o persistente, coméntalo con tu profesional.',
    ],
    medication: 'No atribuyas cambios de síntomas automáticamente a tu medicamento: hay muchos factores posibles.',
    evidence: [],
  });
}

function interactionResponse(profile) {
  const meds = profile?.medications || [];
  const supplements = profile?.supplements || [];
  const levoTime = profile?.levoTime || '';
  const all = [...meds, ...supplements];
  if (!all.length) {
    return buildResponse({
      level: 'verde',
      brief: 'Aún no tienes medicamentos o suplementos registrados para revisar interacciones.',
      meaning: 'Registra tu levotiroxina, su horario y tus suplementos para que pueda revisar posibles interferencias.',
      actions: [
        'Registra tu levotiroxina con su horario habitual.',
        'Agrega los suplementos que tomas.',
        'Vuelve a preguntarme por interacciones cuando esté completo.',
      ],
      medication: '',
      evidence: [],
    });
  }
  const lines = [];
  const mineralSupplements = all.filter(item => /calcio|hierro|zinc|magnesio|multivitam/i.test(item.name));
  if (levoTime && mineralSupplements.length) {
    lines.push(`Tomas levotiroxina a las ${levoTime} y tienes ${mineralSupplements.length} suplemento(s) mineral(es) registrado(s). Los minerales pueden reducir la absorción de levotiroxina si se toman muy cerca.`);
  }
  if (all.some(item => /biotina/i.test(item.name))) {
    lines.push('Tienes biotina registrada: puede interferir con las pruebas de laboratorio de función tiroidea. Pregunta a tu profesional cuántos días antes de los exámenes debes suspenderla.');
  }
  if (all.some(item => /yodo|kelp|algas/i.test(item.name))) {
    lines.push('Tienes un suplemento con yodo registrado: la suplementación con yodo sin indicación puede ser perjudicial. Conversa su uso con tu endocrinólogo.');
  }
  if (!lines.length) {
    lines.push('No detecté interferencias evidentes entre tus registros actuales. Recuerda que la regla general es separar la levotiroxina de alimentos, bebidas y suplementos según la indicación de tu profesional.');
  }
  return buildResponse({
    level: 'amarillo',
    brief: lines.join('\n\n'),
    meaning: 'Esta revisión es educativa y se basa en tus registros. No reemplaza la evaluación de tu profesional.',
    actions: [
      'Lleva esta revisión a tu consulta.',
      'Mantén actualizados tus horarios y suplementos.',
      'Nunca cambies dosis ni horarios por esta revisión: conversa primero con tu equipo.',
    ],
    medication: 'No modifiques dosis ni horarios por esta revisión.',
    evidence: ['absorcion-levotiroxina-2017', 'calcio-levotiroxina-2000', 'hierro-levotiroxina-1992', 'biotina-2016'],
  });
}

function lowIodineResponse() {
  return buildResponse({
    level: 'amarillo',
    brief: 'La dieta baja en yodo es temporal y debe realizarse siguiendo las indicaciones del equipo tratante.',
    meaning: 'Se usa antes de la yodoterapia o de un rastreo, para que la tiroides o el tejido tiroideo capten mejor el yodo radiactivo. No es una dieta para hacer por cuenta propia.',
    actions: [
      'Activa el modo "Preparación para radioyodo" solo si tu equipo de salud te lo indicó.',
      'Evita: algas, mariscos, pescados de mar, sal yodada, lácteos (según indicación), yemas de huevo (según indicación) y suplementos con yodo.',
      'Usa sal sin yodo y revisa etiquetas de procesados.',
      'Pregunta a tu equipo cuánto tiempo debe durar la dieta y qué alimentos específicos debes evitar.',
    ],
    medication: 'No suspendas levotiroxina por la dieta baja en yodo: sigue la indicación de tu equipo sobre cuándo y cómo ajustarla.',
    evidence: ['dieta-baja-yodo-2010', 'ata-tiroides-2015'],
  });
}

function timeResponse(profile) {
  const levoTime = profile?.levoTime || '';
  const lines = [
    'El horario de la levotiroxina es una decisión de tu equipo de salud. La práctica habitual es tomarla en ayunas, con agua, y esperar antes de comer o tomar otras bebidas.',
    '',
    levoTime ? `Tienes registrado el horario de las ${levoTime}.` : 'Registra tu horario habitual en "Registrar mi levotiroxina" para ver tu línea de tiempo.',
    '',
    'Alimentos y bebidas que conviene separar de la toma (según la indicación de tu profesional): café, té, lácteos, soya, suplementos de calcio, hierro y zinc, y comidas muy ricas en fibra.',
  ];
  return buildResponse({
    level: 'amarillo',
    brief: lines.join('\n'),
    meaning: 'La absorción de levotiroxina puede verse afectada por alimentos, bebidas y otros productos tomados muy cerca de la dosis.',
    actions: [
      'Conversa con tu profesional el horario exacto que debes seguir.',
      'Usa el registro de levotiroxina para marcar tu toma diaria.',
      'Si olvidas una dosis, pregunta a tu profesional qué hacer: no la dupliques por tu cuenta.',
    ],
    medication: 'No cambies tu horario por esta información: confírmalo con tu equipo.',
    evidence: ['horario-levotiroxina-2010', 'absorcion-levotiroxina-2017', 'cafe-levotiroxina-2008'],
  });
}

function cafeResponse() {
  return buildResponse({
    level: 'amarillo',
    brief: 'El café puede reducir la absorción de levotiroxina si se toman muy cerca.',
    meaning: 'Un estudio observó menor absorción de levotiroxina cuando se tomaba con café. La práctica habitual es separar la toma del medicamento del café.',
    actions: [
      'Toma la levotiroxina con agua, en ayunas y según tu horario indicado.',
      'Espera el tiempo que te indique tu profesional antes del café (habitualmente 30–60 minutos).',
      'Si tomas hierro o calcio, separa también el café de esos suplementos.',
    ],
    medication: 'No cambies tu horario por esta información: confírmalo con tu equipo.',
    evidence: ['cafe-levotiroxina-2008', 'absorcion-levotiroxina-2017'],
  });
}

function calcioResponse() {
  return buildResponse({
    level: 'amarillo',
    brief: 'El calcio (alimentos o suplementos) puede reducir la absorción de levotiroxina si se toman juntos.',
    meaning: 'Un ensayo mostró que el carbonato de calcio tomado junto con levotiroxina reducía su absorción. La práctica habitual es separarlos por varias horas.',
    actions: [
      'Separa los lácteos y suplementos de calcio de la toma de levotiroxina.',
      'Si tomas calcio por indicación (por ejemplo, tras una tiroidectomía), respeta el horario que te dio tu equipo.',
      'No suspendas el calcio por tu cuenta: es esencial después de ciertas cirugías.',
    ],
    medication: 'No suspendas ni cambies dosis de calcio por esta información.',
    evidence: ['calcio-levotiroxina-2000', 'absorcion-levotiroxina-2017'],
  });
}

function hierroResponse() {
  return buildResponse({
    level: 'amarillo',
    brief: 'El hierro puede reducir la absorción de levotiroxina si se toman juntos.',
    meaning: 'Un estudio observó menor eficacia de la levotiroxina al administrarla junto con sulfato ferroso. La práctica habitual es separarlos por varias horas.',
    actions: [
      'Separa el hierro de la levotiroxina según la indicación de tu profesional.',
      'No tomes hierro por tu cuenta: el exceso también tiene riesgos.',
      'Conversa tus niveles de ferritina con tu equipo.',
    ],
    medication: 'No inicies ni suspendas hierro por esta información.',
    evidence: ['hierro-levotiroxina-1992', 'absorcion-levotiroxina-2017'],
  });
}

function biotinaResponse() {
  return buildResponse({
    level: 'amarillo',
    brief: 'La biotina en dosis altas puede interferir con las pruebas de laboratorio de función tiroidea.',
    meaning: 'La biotina puede producir resultados engañosos en los exámenes de tiroides. La práctica habitual es suspenderla unos días antes, según la indicación del laboratorio o del profesional.',
    actions: [
      'Informa a tu profesional si tomas biotina.',
      'Pregunta cuántos días antes de los exámenes debes suspenderla.',
      'Revisa etiquetas de suplementos para cabello y uñas: muchos contienen biotina.',
    ],
    medication: 'No suspendas biotina por tu cuenta sin saber cuándo tienes exámenes.',
    evidence: ['biotina-2016'],
  });
}

function yodoResponse() {
  return buildResponse({
    level: 'amarillo',
    brief: 'El yodo es esencial, pero el exceso puede ser perjudicial en personas con enfermedad tiroidea.',
    meaning: 'Las algas y algunos suplementos pueden aportar cantidades muy altas de yodo. La suplementación sin indicación no se recomienda.',
    actions: [
      'No tomes suplementos de yodo sin indicación expresa de tu equipo.',
      'Revisa etiquetas de multivitamínicos: muchos contienen yodo.',
      'En dieta baja en yodo, suspende todo suplemento con yodo según la indicación de tu equipo.',
    ],
    medication: 'No inicies yodo por tu cuenta.',
    evidence: ['yodo-2009', 'dieta-baja-yodo-2010'],
  });
}

function yodoSuplementoResponse() {
  return buildResponse({
    level: 'rojo',
    brief: 'No tomes suplementos de yodo sin indicación expresa de tu equipo de salud.',
    meaning: 'El yodo en exceso puede alterar la función tiroidea, especialmente en personas con enfermedad tiroidea autoinmune o antecedentes de cáncer de tiroides.',
    actions: [
      'Conversa con tu endocrinólogo antes de iniciar o continuar cualquier suplemento con yodo.',
      'Revisa etiquetas: algas, kelp, gotas de yodo y multivitamínicos pueden contener yodo.',
      'Si estás en dieta baja en yodo, suspende todo suplemento con yodo según la indicación de tu equipo.',
    ],
    medication: 'Nunca inicies yodo por tu cuenta: verifícalo con tu profesional.',
    evidence: ['yodo-2009', 'dieta-baja-yodo-2010'],
  });
}

function soyaResponse() {
  return buildResponse({
    level: 'amarillo',
    brief: 'La soya puede afectar la absorción de levotiroxina en algunas personas.',
    meaning: 'Se han reportado casos de mayor necesidad de dosis con consumo regular de soya. La práctica habitual es mantener un consumo consistente y separado de la toma.',
    actions: [
      'Mantén un consumo de soya consistente de un día a otro.',
      'Separa la soya de la toma de levotiroxina.',
      'Conversa con tu profesional si hay cambios en tus exámenes.',
    ],
    medication: 'No suspendas la soya por tu cuenta: conversa los cambios con tu equipo.',
    evidence: ['soya-levotiroxina-2001', 'absorcion-levotiroxina-2017'],
  });
}

function fibraResponse() {
  return buildResponse({
    level: 'amarillo',
    brief: 'Las dietas muy ricas en fibra pueden reducir la absorción de levotiroxina en algunas personas.',
    meaning: 'Un estudio observó menor biodisponibilidad de levotiroxina con dietas enriquecidas en fibra. La práctica habitual es mantener una ingesta estable y separada de la toma.',
    actions: [
      'Mantén tu consumo de fibra estable de un día a otro.',
      'Separa los suplementos de fibra (psyllium) de la levotiroxina.',
      'Conversa con tu profesional si cambias mucho tu ingesta de fibra.',
    ],
    medication: 'No elimines la fibra de tu dieta por esta información.',
    evidence: ['fibra-levotiroxina-1996', 'absorcion-levotiroxina-2017'],
  });
}

function pregnancyResponse() {
  return buildResponse({
    level: 'amarillo',
    brief: 'El embarazo y la lactancia requieren seguimiento cercano de la función tiroidea.',
    meaning: 'Las necesidades de hormona tiroidea pueden cambiar durante el embarazo. Solo tu equipo de salud puede indicar ajustes.',
    actions: [
      'Informa a tu profesional lo antes posible si estás embarazada o planeas estarlo.',
      'No cambies dosis por tu cuenta.',
      'Lleva tus registros y exámenes a cada control.',
    ],
    medication: 'Nunca ajustes tu dosis por información de una aplicación.',
    evidence: ['ata-hipotiroidismo-2014'],
  });
}

function levoGeneralResponse() {
  return buildResponse({
    level: 'verde',
    brief: 'La levotiroxina es el reemplazo de la hormona tiroidea que tu cuerpo necesita.',
    meaning: 'Su absorción puede verse afectada por alimentos, bebidas, otros medicamentos y suplementos tomados muy cerca de la dosis. La práctica habitual es tomarla en ayunas, con agua, y separarla de otros productos.',
    actions: [
      'Registra tu levotiroxina con su horario en "Registrar mi levotiroxina".',
      'Revisa las interacciones con tus alimentos y suplementos habituales.',
      'Lleva tus dudas de horario a tu consulta.',
    ],
    medication: 'No cambies dosis ni horarios por esta información: confírmalo con tu equipo.',
    evidence: ['ata-hipotiroidismo-2014', 'absorcion-levotiroxina-2017'],
  });
}

export function analyzeQuestion(query, profile = {}) {
  const normalized = normalize(query);
  if (!normalized) return greetingResponse();

  if (EMERGENCY_PATTERNS.some(pattern => pattern.test(normalized))) return emergencyResponse();
  if (DOSIS_PATTERNS.some(pattern => pattern.test(normalized)) && RED_PATTERNS.some(pattern => pattern.test(normalized))) return redResponse(query);
  if (DIAGNOSTIC_PATTERNS.some(pattern => pattern.test(normalized))) return redResponse(query);
  if (MEDICATION_RECOMMENDATION_PATTERNS.some(pattern => pattern.test(normalized))) return redResponse(query);
  if (LAB_PATTERNS.some(pattern => pattern.test(normalized)) && /tratar|bajar|subir|normalizar|corregir|medicar|recomienda|qu[eé]\s+hago|qu[eé]\s+debo/i.test(normalized)) return redResponse(query);

  if (GREETING_PATTERNS.some(pattern => pattern.test(normalized))) return greetingResponse();
  if (THANKS_PATTERNS.some(pattern => pattern.test(normalized))) return thanksResponse();
  if (HELP_PATTERNS.some(pattern => pattern.test(normalized))) return helpResponse();

  if (PREGNANCY_PATTERNS.some(pattern => pattern.test(normalized))) return pregnancyResponse();
  if (LOW_IODINE_PATTERNS.some(pattern => pattern.test(normalized))) return lowIodineResponse();
  if (YODO_SUPPLEMENT_PATTERNS.some(pattern => pattern.test(normalized))) return yodoSuplementoResponse();
  if (BIOTINA_PATTERNS.some(pattern => pattern.test(normalized))) return biotinaResponse();
  if (YODO_PATTERNS.some(pattern => pattern.test(normalized))) return yodoResponse();
  if (SOYA_PATTERNS.some(pattern => pattern.test(normalized))) return soyaResponse();
  if (FIBRA_PATTERNS.some(pattern => pattern.test(normalized))) return fibraResponse();
  if (CAFE_PATTERNS.some(pattern => pattern.test(normalized))) return cafeResponse();
  if (CALCIO_PATTERNS.some(pattern => pattern.test(normalized))) return calcioResponse();
  if (HIERRO_PATTERNS.some(pattern => pattern.test(normalized))) return hierroResponse();
  if (TIME_PATTERNS.some(pattern => pattern.test(normalized))) return timeResponse(profile);
  if (SYMPTOM_PATTERNS.some(pattern => pattern.test(normalized)) && /tendencia|patr[oó]n|s[ií]ntomas\s+registrados|mis\s+s[ií]ntomas/i.test(normalized)) return symptomResponse(profile);
  if (SUPPLEMENT_PATTERNS.some(pattern => pattern.test(normalized))) return supplementResponse(query);
  if (MENU_PATTERNS.some(pattern => pattern.test(normalized))) return menuResponse(query, profile);
  if (COOK_PATTERNS.some(pattern => pattern.test(normalized))) return cookResponse(query);
  if (PLATE_PATTERNS.some(pattern => pattern.test(normalized))) return plateResponse(query);
  if (EAT_PATTERNS.some(pattern => pattern.test(normalized))) return foodResponse(query, profile);
  if (LEVO_PATTERNS.some(pattern => pattern.test(normalized))) return levoGeneralResponse();

  const food = findFood(query);
  if (food) return foodResponse(query, profile);

  return buildResponse({
    level: 'verde',
    brief: 'No estoy seguro de haber entendido tu pregunta.',
    meaning: 'Puedo ayudarte con alimentos, interacciones con levotiroxina, menús, suplementos, síntomas y organización de tu tratamiento.',
    actions: [
      'Prueba con: "¿Puedo comer café?"',
      'Prueba con: "Hazme un menú para esta semana"',
      'Prueba con: "Cocina con lo que tengo: pollo, arroz, huevo"',
      'Prueba con: "Analiza este plato: arroz, pollo, ensalada"',
    ],
    medication: '',
    evidence: [],
  });
}

export function checkInteractions(profile) {
  const meds = profile?.medications || [];
  const supplements = profile?.supplements || [];
  const levoTime = profile?.levoTime || '';
  const all = [...meds, ...supplements];
  const findings = [];
  const mineralNames = ['calcio', 'hierro', 'zinc', 'magnesio', 'multivitam'];
  const minerals = all.filter(item => mineralNames.some(name => item.name.toLowerCase().includes(name)));
  if (levoTime && minerals.length) {
    findings.push({
      level: 'amarillo',
      title: 'Minerales cerca de la levotiroxina',
      text: `Tomas levotiroxina a las ${levoTime} y tienes registrado: ${minerals.map(item => item.name).join(', ')}. Los minerales pueden reducir la absorción de levotiroxina si se toman muy cerca. Sepáralos según la indicación de tu profesional.`,
      evidence: ['calcio-levotiroxina-2000', 'hierro-levotiroxina-1992', 'absorcion-levotiroxina-2017'],
    });
  }
  if (all.some(item => /biotina/i.test(item.name))) {
    findings.push({
      level: 'amarillo',
      title: 'Biotina y exámenes',
      text: 'Tienes biotina registrada: puede interferir con las pruebas de laboratorio de función tiroidea. Pregunta a tu profesional cuántos días antes de los exámenes debes suspenderla.',
      evidence: ['biotina-2016'],
    });
  }
  if (all.some(item => /yodo|kelp|algas/i.test(item.name))) {
    findings.push({
      level: 'rojo',
      title: 'Suplemento con yodo',
      text: 'Tienes un suplemento con yodo registrado. La suplementación con yodo sin indicación puede ser perjudicial. Conversa su uso con tu endocrinólogo antes de continuar.',
      evidence: ['yodo-2009'],
    });
  }
  if (profile?.lowIodineMode && all.some(item => /yodo|kelp|algas|multivitam/i.test(item.name))) {
    findings.push({
      level: 'rojo',
      title: 'Yodo en dieta baja en yodo',
      text: 'Estás en modo de preparación para radioyodo y tienes suplementos que pueden contener yodo. Suspéndelos según la indicación de tu equipo tratante.',
      evidence: ['dieta-baja-yodo-2010'],
    });
  }
  return findings;
}

export function buildWeeklyMenu(profile = {}) {
  const budget = profile?.budget || 'medio';
  const time = profile?.cookTime || 30;
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const mealPool = {
    desayuno: recipes.filter(r => r.meal === 'desayuno'),
    almuerzo: recipes.filter(r => r.meal === 'almuerzo'),
    cena: recipes.filter(r => r.meal === 'cena'),
    snack: recipes.filter(r => r.meal === 'snack'),
  };
  const pick = (pool, used) => {
    let candidates = pool.filter(r => !used.has(r.id));
    if (profile?.lowIodineMode) candidates = candidates.filter(r => r.lowIodine !== false);
    const byBudget = budget === 'bajo' ? candidates.filter(r => r.cost === 'bajo') : candidates;
    const byTime = time <= 20 ? byBudget.filter(r => r.time <= 20) : byBudget;
    const pool2 = (byTime.length ? byTime : byBudget.length ? byBudget : candidates);
    const chosen = pool2[Math.floor(Math.random() * pool2.length)] || pool[0];
    used.add(chosen.id);
    return chosen;
  };
  const used = new Set();
  return days.map(day => ({
    day,
    desayuno: pick(mealPool.desayuno, used),
    almuerzo: pick(mealPool.almuerzo, used),
    cena: pick(mealPool.cena, used),
    snack: pick(mealPool.snack, used),
  }));
}

export function replaceMeal(menu, dayIndex, meal, option) {
  const current = menu[dayIndex][meal];
  const pool = recipes.filter(r => r.meal === meal && r.id !== current.id);
  let candidates = pool;
  if (option === 'economica') candidates = pool.filter(r => r.cost === 'bajo');
  if (option === 'rapida') candidates = pool.filter(r => r.time <= 15);
  if (option === 'otros-ingredientes') candidates = pool;
  if (option === 'no-tengo') candidates = pool;
  if (option === 'no-me-gusta') candidates = pool;
  const chosen = candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : pool[0];
  const next = menu.map((day, index) => index === dayIndex ? { ...day, [meal]: chosen } : day);
  return { menu: next, replaced: chosen };
}

export function buildConsultationReport(profile) {
  const symptoms = profile?.symptoms || [];
  const medications = profile?.medications || [];
  const supplements = profile?.supplements || [];
  const meals = profile?.meals || [];
  const levoLog = profile?.levoLog || [];
  const interactions = checkInteractions(profile);
  const questions = profile?.questions || [];

  const last7 = symptoms.filter(item => {
    const days = (Date.now() - new Date(item.date).getTime()) / 86400000;
    return days <= 7;
  });
  const last30 = symptoms.filter(item => {
    const days = (Date.now() - new Date(item.date).getTime()) / 86400000;
    return days <= 30;
  });

  return {
    generatedAt: new Date().toISOString(),
    profile: {
      name: profile?.name || '',
      country: profile?.country || '',
      condition: profile?.condition || '',
      surgery: profile?.surgery || '',
      levoTime: profile?.levoTime || '',
    },
    medications,
    supplements,
    levoLog: levoLog.slice(-14),
    meals: meals.slice(-14),
    symptoms: {
      last7: last7.length,
      last30: last30.length,
      recent: symptoms.slice(-10),
    },
    interactions,
    questions,
    summary: {
      symptomCount7: last7.length,
      symptomCount30: last30.length,
      medicationCount: medications.length,
      supplementCount: supplements.length,
      mealCount: meals.length,
      levoLogCount: levoLog.length,
    },
  };
}

export { buildShoppingList, mealLabels, estimatePlate, plateFeedback, findNutrient };
