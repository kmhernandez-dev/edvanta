/**
 * ============================================================
 *  recetas.js — Recetario de NutriFST IA
 *
 *  Recetas simples, económicas y con ingredientes comunes en
 *  Latinoamérica. Cada receta declara sus ingredientes para
 *  poder generar menús y listas de compras.
 * ============================================================
 */

export const recipes = [
  {
    id: 'huevos-pericos',
    name: 'Huevos pericos',
    meal: 'desayuno',
    time: 10,
    cost: 'bajo',
    servings: 1,
    ingredients: [
      { name: 'huevo', amount: 2, unit: 'unidades' },
      { name: 'tomate', amount: 1, unit: 'unidad' },
      { name: 'cebolla', amount: 0.25, unit: 'unidad' },
      { name: 'aceite', amount: 1, unit: 'cucharada' },
    ],
    steps: ['Pica el tomate y la cebolla en cubos pequeños.', 'Calienta el aceite y sofríe la cebolla y el tomate hasta que suelten su jugo.', 'Bate los huevos, agrégalos y revuelve hasta que cuajen.', 'Sirve con arepa o pan integral.'],
    notes: 'Fuente rápida de proteína y verduras para empezar el día.',
  },
  {
    id: 'avena-frutas',
    name: 'Avena con frutas',
    meal: 'desayuno',
    time: 10,
    cost: 'bajo',
    servings: 1,
    ingredients: [
      { name: 'avena', amount: 0.5, unit: 'taza' },
      { name: 'leche', amount: 1, unit: 'taza' },
      { name: 'banano', amount: 1, unit: 'unidad' },
      { name: 'miel', amount: 1, unit: 'cucharadita' },
    ],
    steps: ['Cocina la avena con la leche a fuego medio, revolviendo, unos 5 minutos.', 'Sirve y agrega el banano en rodajas y la miel.'],
    notes: 'Puedes usar bebida vegetal sin yodo si estás en dieta baja en yodo.',
  },
  {
    id: 'arepa-huevo',
    name: 'Arepa con huevo',
    meal: 'desayuno',
    time: 15,
    cost: 'bajo',
    servings: 1,
    ingredients: [
      { name: 'arepa', amount: 1, unit: 'unidad' },
      { name: 'huevo', amount: 1, unit: 'unidad' },
      { name: 'aguacate', amount: 0.25, unit: 'unidad' },
    ],
    steps: ['Asa la arepa en una sartén o parrilla.', 'Prepara el huevo al gusto (revuelto, frito o cocido).', 'Sirve la arepa con el huevo y el aguacate.'],
    notes: 'Combinación clásica, completa y económica.',
  },
  {
    id: 'huevos-aguacate',
    name: 'Huevos con aguacate',
    meal: 'desayuno',
    time: 10,
    cost: 'bajo',
    servings: 1,
    ingredients: [
      { name: 'huevo', amount: 2, unit: 'unidades' },
      { name: 'aguacate', amount: 0.5, unit: 'unidad' },
      { name: 'pan', amount: 1, unit: 'rebanada' },
    ],
    steps: ['Cocina los huevos al gusto.', 'Tuesta el pan y aplasta el aguacate encima.', 'Acompaña con los huevos.'],
    notes: 'Proteína + grasa saludable + carbohidrato.',
  },
  {
    id: 'pollo-arroz-verduras',
    name: 'Pollo con arroz y verduras',
    meal: 'almuerzo',
    time: 30,
    cost: 'medio',
    servings: 2,
    ingredients: [
      { name: 'pollo', amount: 300, unit: 'g' },
      { name: 'arroz', amount: 1, unit: 'taza' },
      { name: 'zanahoria', amount: 1, unit: 'unidad' },
      { name: 'cebolla', amount: 0.5, unit: 'unidad' },
      { name: 'aceite', amount: 2, unit: 'cucharadas' },
      { name: 'ajo', amount: 1, unit: 'diente' },
    ],
    steps: ['Cocina el arroz con un poco de sal.', 'Corta el pollo en tiras y sazona con ajo.', 'Sofríe la cebolla y la zanahoria en el aceite, agrega el pollo y cocina hasta que esté dorado.', 'Sirve el pollo con el arroz y las verduras.'],
    notes: 'Plato completo: proteína, carbohidrato y verduras.',
  },
  {
    id: 'sopa-verduras',
    name: 'Sopa de verduras',
    meal: 'almuerzo',
    time: 35,
    cost: 'bajo',
    servings: 4,
    ingredients: [
      { name: 'zanahoria', amount: 2, unit: 'unidades' },
      { name: 'calabaza', amount: 1, unit: 'taza' },
      { name: 'papa', amount: 2, unit: 'unidades' },
      { name: 'cebolla', amount: 1, unit: 'unidad' },
      { name: 'ajo', amount: 2, unit: 'dientes' },
      { name: 'aceite', amount: 2, unit: 'cucharadas' },
    ],
    steps: ['Pica todas las verduras en cubos.', 'Sofríe la cebolla y el ajo en el aceite.', 'Agrega las verduras y cubre con agua; cocina 25 minutos hasta que estén blandas.', 'Sazona al gusto y sirve caliente.'],
    notes: 'Económica, rendidora y rica en fibra.',
  },
  {
    id: 'frijoles-arroz',
    name: 'Frijoles con arroz',
    meal: 'almuerzo',
    time: 40,
    cost: 'bajo',
    servings: 4,
    ingredients: [
      { name: 'frijoles', amount: 2, unit: 'tazas' },
      { name: 'arroz', amount: 2, unit: 'tazas' },
      { name: 'cebolla', amount: 1, unit: 'unidad' },
      { name: 'tomate', amount: 2, unit: 'unidades' },
      { name: 'aceite', amount: 2, unit: 'cucharadas' },
    ],
    steps: ['Si usas frijoles secos, remójalos la noche anterior y cocínalos hasta que estén blandos.', 'Sofríe la cebolla y el tomate para hacer el hogao.', 'Agrega el hogao a los frijoles y cocina 10 minutos más.', 'Sirve con arroz blanco.'],
    notes: 'Combinación clásica de proteína vegetal + carbohidrato.',
  },
  {
    id: 'pescado-verduras',
    name: 'Pescado a la plancha con verduras',
    meal: 'almuerzo',
    time: 25,
    cost: 'medio',
    servings: 2,
    ingredients: [
      { name: 'pescado', amount: 400, unit: 'g' },
      { name: 'brocoli', amount: 1, unit: 'taza' },
      { name: 'papa', amount: 2, unit: 'unidades' },
      { name: 'aceite', amount: 2, unit: 'cucharadas' },
      { name: 'ajo', amount: 1, unit: 'diente' },
    ],
    steps: ['Sazona el pescado con ajo y cocina a la plancha con un poco de aceite.', 'Cocina las papas en agua con sal y el brócoli al vapor.', 'Sirve el pescado con las papas y el brócoli.'],
    notes: 'Si estás en dieta baja en yodo, evita el pescado de mar y prefiere opciones de agua dulce según tu equipo.',
  },
  {
    id: 'ensalada-pollo',
    name: 'Ensalada de pollo',
    meal: 'cena',
    time: 20,
    cost: 'medio',
    servings: 2,
    ingredients: [
      { name: 'pollo', amount: 200, unit: 'g' },
      { name: 'lechuga', amount: 2, unit: 'tazas' },
      { name: 'tomate', amount: 1, unit: 'unidad' },
      { name: 'aguacate', amount: 0.5, unit: 'unidad' },
      { name: 'aceite', amount: 1, unit: 'cucharada' },
    ],
    steps: ['Cocina el pollo y desmenúzalo.', 'Lava y corta la lechuga y el tomate.', 'Mezcla todo con el aguacate y aliña con el aceite.'],
    notes: 'Cena ligera y completa.',
  },
  {
    id: 'omelette-verduras',
    name: 'Omelette de verduras',
    meal: 'cena',
    time: 15,
    cost: 'bajo',
    servings: 1,
    ingredients: [
      { name: 'huevo', amount: 2, unit: 'unidades' },
      { name: 'pimenton', amount: 0.5, unit: 'unidad' },
      { name: 'cebolla', amount: 0.25, unit: 'unidad' },
      { name: 'aceite', amount: 1, unit: 'cucharada' },
    ],
    steps: ['Pica el pimentón y la cebolla en cubos pequeños.', 'Sofríe las verduras en el aceite.', 'Bate los huevos, agrégalos y cocina como omelette.', 'Dobla y sirve.'],
    notes: 'Cena rápida con proteína y verduras.',
  },
  {
    id: 'crema-calabaza',
    name: 'Crema de calabaza',
    meal: 'cena',
    time: 25,
    cost: 'bajo',
    servings: 3,
    ingredients: [
      { name: 'calabaza', amount: 2, unit: 'tazas' },
      { name: 'cebolla', amount: 0.5, unit: 'unidad' },
      { name: 'ajo', amount: 1, unit: 'diente' },
      { name: 'aceite', amount: 1, unit: 'cucharada' },
    ],
    steps: ['Cocina la calabaza en agua hasta que esté blanda.', 'Sofríe la cebolla y el ajo en el aceite.', 'Licúa la calabaza con el sofrito y un poco del agua de cocción.', 'Calienta y sirve.'],
    notes: 'Suave, económica y reconfortante.',
  },
  {
    id: 'tortilla-papa',
    name: 'Tortilla de papa',
    meal: 'cena',
    time: 25,
    cost: 'bajo',
    servings: 2,
    ingredients: [
      { name: 'papa', amount: 2, unit: 'unidades' },
      { name: 'huevo', amount: 3, unit: 'unidades' },
      { name: 'cebolla', amount: 0.5, unit: 'unidad' },
      { name: 'aceite', amount: 2, unit: 'cucharadas' },
    ],
    steps: ['Cocina las papas en rodajas finas hasta que estén blandas.', 'Sofríe la cebolla y mezcla con las papas.', 'Bate los huevos, agrégalos y cocina a fuego bajo hasta que cuaje por ambos lados.'],
    notes: 'Clásica, rendidora y económica.',
  },
  {
    id: 'yogur-granola',
    name: 'Yogur con frutas y granola',
    meal: 'snack',
    time: 5,
    cost: 'medio',
    servings: 1,
    ingredients: [
      { name: 'yogur', amount: 1, unit: 'vaso' },
      { name: 'fresa', amount: 0.5, unit: 'taza' },
      { name: 'avena', amount: 2, unit: 'cucharadas' },
    ],
    steps: ['Sirve el yogur en un bowl.', 'Agrega las fresas en trozos y la avena por encima.'],
    notes: 'Snack rápido con proteína y fibra.',
  },
  {
    id: 'fruta-nueces',
    name: 'Fruta con nueces',
    meal: 'snack',
    time: 5,
    cost: 'bajo',
    servings: 1,
    ingredients: [
      { name: 'manzana', amount: 1, unit: 'unidad' },
      { name: 'nueces', amount: 1, unit: 'puñado' },
    ],
    steps: ['Lava y corta la manzana.', 'Acompaña con el puñado de nueces.'],
    notes: 'Snack simple con fibra y grasa saludable.',
  },
  {
    id: 'arepa-queso',
    name: 'Arepa con queso',
    meal: 'snack',
    time: 10,
    cost: 'bajo',
    servings: 1,
    ingredients: [
      { name: 'arepa', amount: 1, unit: 'unidad' },
      { name: 'queso', amount: 30, unit: 'g' },
    ],
    steps: ['Asa la arepa.', 'Rellena o acompaña con el queso.'],
    notes: 'Snack clásico y saciante.',
  },
  {
    id: 'pasta-tomate',
    name: 'Pasta con salsa de tomate',
    meal: 'almuerzo',
    time: 25,
    cost: 'bajo',
    servings: 2,
    ingredients: [
      { name: 'pasta', amount: 200, unit: 'g' },
      { name: 'tomate', amount: 3, unit: 'unidades' },
      { name: 'cebolla', amount: 0.5, unit: 'unidad' },
      { name: 'ajo', amount: 1, unit: 'diente' },
      { name: 'aceite', amount: 2, unit: 'cucharadas' },
    ],
    steps: ['Cocina la pasta al dente.', 'Sofríe la cebolla y el ajo, agrega el tomate picado y cocina 10 minutos.', 'Mezcla la pasta con la salsa y sirve.'],
    notes: 'Económica y rápida.',
  },
  {
    id: 'lentejas-arroz',
    name: 'Lentejas guisadas con arroz',
    meal: 'almuerzo',
    time: 35,
    cost: 'bajo',
    servings: 4,
    ingredients: [
      { name: 'lentejas', amount: 2, unit: 'tazas' },
      { name: 'arroz', amount: 2, unit: 'tazas' },
      { name: 'zanahoria', amount: 1, unit: 'unidad' },
      { name: 'cebolla', amount: 1, unit: 'unidad' },
      { name: 'tomate', amount: 1, unit: 'unidad' },
      { name: 'aceite', amount: 2, unit: 'cucharadas' },
    ],
    steps: ['Cocina las lentejas con la zanahoria en cubos hasta que estén blandas.', 'Sofríe la cebolla y el tomate y agrégalos a las lentejas.', 'Cocina 10 minutos más y sirve con arroz.'],
    notes: 'Alto en proteína vegetal y fibra.',
  },
  {
    id: 'salmon-horneado',
    name: 'Salmón al horno con verduras',
    meal: 'cena',
    time: 30,
    cost: 'alto',
    servings: 2,
    ingredients: [
      { name: 'salmon', amount: 300, unit: 'g' },
      { name: 'brocoli', amount: 1, unit: 'taza' },
      { name: 'zanahoria', amount: 1, unit: 'unidad' },
      { name: 'aceite', amount: 2, unit: 'cucharadas' },
      { name: 'ajo', amount: 1, unit: 'diente' },
    ],
    steps: ['Precalienta el horno a 200 °C.', 'Coloca el salmón y las verduras en una bandeja con aceite y ajo.', 'Hornea 20 minutos o hasta que el salmón esté listo.'],
    notes: 'Rico en omega-3. En dieta baja en yodo, evita el pescado de mar según tu equipo.',
  },
  {
    id: 'garbanzos-guisados',
    name: 'Garbanzos guisados',
    meal: 'almuerzo',
    time: 30,
    cost: 'bajo',
    servings: 4,
    ingredients: [
      { name: 'garbanzos', amount: 2, unit: 'tazas' },
      { name: 'tomate', amount: 2, unit: 'unidades' },
      { name: 'cebolla', amount: 1, unit: 'unidad' },
      { name: 'pimenton', amount: 1, unit: 'unidad' },
      { name: 'aceite', amount: 2, unit: 'cucharadas' },
    ],
    steps: ['Sofríe la cebolla, el pimentón y el tomate.', 'Agrega los garbanzos cocidos y un poco de agua.', 'Cocina 15 minutos y sirve.'],
    notes: 'Puedes acompañar con arroz o ensalada.',
  },
  {
    id: 'pollo-sudado',
    name: 'Pollo sudado',
    meal: 'almuerzo',
    time: 35,
    cost: 'medio',
    servings: 4,
    ingredients: [
      { name: 'pollo', amount: 600, unit: 'g' },
      { name: 'tomate', amount: 2, unit: 'unidades' },
      { name: 'cebolla', amount: 1, unit: 'unidad' },
      { name: 'pimenton', amount: 1, unit: 'unidad' },
      { name: 'ajo', amount: 2, unit: 'dientes' },
      { name: 'aceite', amount: 2, unit: 'cucharadas' },
    ],
    steps: ['Sofríe la cebolla, el pimentón, el tomate y el ajo.', 'Agrega el pollo y un poco de agua.', 'Tapa y cocina a fuego medio 25 minutos hasta que esté tierno.'],
    notes: 'Jugoso, rendidor y fácil de acompañar.',
  },
  {
    id: 'ensalada-frutas',
    name: 'Ensalada de frutas',
    meal: 'snack',
    time: 10,
    cost: 'bajo',
    servings: 2,
    ingredients: [
      { name: 'mango', amount: 0.5, unit: 'unidad' },
      { name: 'banano', amount: 1, unit: 'unidad' },
      { name: 'fresa', amount: 0.5, unit: 'taza' },
      { name: 'naranja', amount: 1, unit: 'unidad' },
    ],
    steps: ['Lava y corta todas las frutas en trozos.', 'Mezcla y sirve.'],
    notes: 'Vitamina C y fibra en un solo plato.',
  },
  {
    id: 'sopa-pollo',
    name: 'Sopa de pollo con verduras',
    meal: 'almuerzo',
    time: 40,
    cost: 'medio',
    servings: 4,
    ingredients: [
      { name: 'pollo', amount: 400, unit: 'g' },
      { name: 'papa', amount: 2, unit: 'unidades' },
      { name: 'zanahoria', amount: 1, unit: 'unidad' },
      { name: 'cebolla', amount: 1, unit: 'unidad' },
      { name: 'calabaza', amount: 1, unit: 'taza' },
      { name: 'ajo', amount: 1, unit: 'diente' },
    ],
    steps: ['Cocina el pollo en agua con cebolla y ajo.', 'Agrega las verduras en cubos y cocina 25 minutos.', 'Desmenuza el pollo, sazona y sirve.'],
    notes: 'Reconfortante y completa.',
  },
  {
    id: 'tostadas-aguacate',
    name: 'Tostadas con aguacate y huevo',
    meal: 'desayuno',
    time: 10,
    cost: 'medio',
    servings: 1,
    ingredients: [
      { name: 'pan', amount: 2, unit: 'rebanadas' },
      { name: 'aguacate', amount: 0.5, unit: 'unidad' },
      { name: 'huevo', amount: 1, unit: 'unidad' },
    ],
    steps: ['Tuesta el pan.', 'Aplasta el aguacate sobre las tostadas.', 'Agrega el huevo cocido o frito encima.'],
    notes: 'Desayuno completo y rápido.',
  },
  {
    id: 'arroz-integral-verduras',
    name: 'Arroz integral salteado con verduras',
    meal: 'cena',
    time: 30,
    cost: 'bajo',
    servings: 2,
    ingredients: [
      { name: 'arroz', amount: 1, unit: 'taza' },
      { name: 'zanahoria', amount: 1, unit: 'unidad' },
      { name: 'pimenton', amount: 1, unit: 'unidad' },
      { name: 'cebolla', amount: 0.5, unit: 'unidad' },
      { name: 'aceite', amount: 2, unit: 'cucharadas' },
      { name: 'huevo', amount: 1, unit: 'unidad' },
    ],
    steps: ['Cocina el arroz integral.', 'Sofríe las verduras en el aceite.', 'Agrega el arroz y el huevo, revuelve y cocina 3 minutos más.'],
    notes: 'Versión casera del arroz frito, con más fibra.',
  },
];

export const mealLabels = {
  desayuno: 'Desayuno',
  almuerzo: 'Almuerzo',
  cena: 'Cena',
  snack: 'Snack opcional',
};

export function recipesByMeal(meal) {
  return recipes.filter(recipe => recipe.meal === meal);
}

export function findRecipesWithIngredients(available, maxResults = 4) {
  const normalized = available
    .map(item => String(item).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim())
    .filter(Boolean);
  const scored = recipes.map(recipe => {
    const missing = recipe.ingredients.filter(ingredient => {
      const name = ingredient.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return !normalized.some(item => item.includes(name) || name.includes(item));
    });
    return { recipe, missing, score: recipe.ingredients.length - missing.length };
  });
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.missing.length - b.missing.length)
    .slice(0, maxResults);
}

export function buildShoppingList(menuItems) {
  const groups = {
    proteinas: { label: 'Proteínas', items: [] },
    verduras: { label: 'Verduras', items: [] },
    frutas: { label: 'Frutas', items: [] },
    cereales: { label: 'Cereales y tubérculos', items: [] },
    grasas: { label: 'Grasas', items: [] },
    despensa: { label: 'Despensa', items: [] },
    otros: { label: 'Otros', items: [] },
  };
  const groupOf = {
    huevo: 'proteinas', pollo: 'proteinas', res: 'proteinas', cerdo: 'proteinas', pescado: 'proteinas', salmon: 'proteinas', atun: 'proteinas', camaron: 'proteinas', frijoles: 'proteinas', lentejas: 'proteinas', garbanzos: 'proteinas', tofu: 'proteinas', queso: 'proteinas', yogur: 'lacteos',
    tomate: 'verduras', cebolla: 'verduras', ajo: 'verduras', pimenton: 'verduras', zanahoria: 'verduras', pepino: 'verduras', lechuga: 'verduras', espinaca: 'verduras', brocoli: 'verduras', coliflor: 'verduras', repollo: 'verduras', calabacin: 'verduras', calabaza: 'verduras', berenjena: 'verduras', remolacha: 'verduras', champinones: 'verduras', habichuela: 'verduras',
    manzana: 'frutas', pera: 'frutas', naranja: 'frutas', mandarina: 'frutas', fresa: 'frutas', mora: 'frutas', mango: 'frutas', pina: 'frutas', papaya: 'frutas', sandia: 'frutas', melon: 'frutas', uva: 'frutas', guayaba: 'frutas', granadilla: 'frutas', banano: 'frutas', platano: 'frutas',
    arroz: 'cereales', pasta: 'cereales', pan: 'cereales', arepa: 'cereales', maiz: 'cereales', papa: 'cereales', yuca: 'cereales', avena: 'cereales', quinua: 'cereales',
    aguacate: 'grasas', aceite: 'grasas', nueces: 'grasas', mantequilla: 'grasas',
    miel: 'despensa', sal: 'despensa', especias: 'despensa', cafe: 'despensa', te: 'despensa', leche: 'lacteos',
  };
  const seen = new Map();
  for (const recipe of menuItems) {
    for (const ingredient of recipe.ingredients) {
      const key = ingredient.name.toLowerCase();
      const group = groupOf[key] || 'otros';
      const target = group === 'lacteos' ? 'otros' : group;
      if (seen.has(key)) {
        const existing = seen.get(key);
        existing.amount += ingredient.amount;
        existing.recipes.push(recipe.name);
      } else {
        const entry = { name: ingredient.name, amount: ingredient.amount, unit: ingredient.unit, recipes: [recipe.name] };
        seen.set(key, entry);
        groups[target].items.push(entry);
      }
    }
  }
  return groups;
}
