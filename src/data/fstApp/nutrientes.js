/**
 * ============================================================
 *  nutrientes.js — Base de datos nutricional de NutriFST IA
 *
 *  Valores aproximados por porción habitual (fuente: tablas
 *  de composición de alimentos de referencia pública, valores
 *  redondeados). Se usan solo como estimación educativa.
 *
 *  Unidades: gramos (g) por porción indicada.
 * ============================================================
 */

export const nutrientDB = [
  { id: 'huevo', name: 'Huevo', aliases: ['huevo', 'huevos', 'huevo frito', 'huevo revuelto', 'huevo cocido'], portion: '1 unidad (50 g)', protein: 6, fiber: 0, vegetables: 0, fruits: 0, carbs: 0.6, fats: 5, kcal: 72, group: 'proteinas' },
  { id: 'pollo', name: 'Pollo', aliases: ['pollo', 'pechuga de pollo', 'pollo a la plancha', 'pollo asado', 'pollo sudado', 'pollo guisado'], portion: '100 g cocido', protein: 31, fiber: 0, vegetables: 0, fruits: 0, carbs: 0, fats: 3.6, kcal: 165, group: 'proteinas' },
  { id: 'res', name: 'Carne de res', aliases: ['carne de res', 'res', 'carne molida', 'carne asada', 'bistec', 'lomo', 'carne guisada'], portion: '100 g cocido', protein: 26, fiber: 0, vegetables: 0, fruits: 0, carbs: 0, fats: 15, kcal: 250, group: 'proteinas' },
  { id: 'cerdo', name: 'Cerdo', aliases: ['cerdo', 'carne de cerdo', 'lomo de cerdo', 'chuleta'], portion: '100 g cocido', protein: 27, fiber: 0, vegetables: 0, fruits: 0, carbs: 0, fats: 14, kcal: 242, group: 'proteinas' },
  { id: 'pescado', name: 'Pescado', aliases: ['pescado', 'tilapia', 'merluza', 'corvina', 'bagre', 'trucha', 'pescado blanco'], portion: '100 g cocido', protein: 24, fiber: 0, vegetables: 0, fruits: 0, carbs: 0, fats: 3, kcal: 128, group: 'proteinas' },
  { id: 'salmon', name: 'Salmón', aliases: ['salmon', 'salmón'], portion: '100 g cocido', protein: 25, fiber: 0, vegetables: 0, fruits: 0, carbs: 0, fats: 13, kcal: 208, group: 'proteinas' },
  { id: 'atun', name: 'Atún', aliases: ['atun', 'atún', 'atun en lata', 'atún enlatado'], portion: '100 g escurrido', protein: 25, fiber: 0, vegetables: 0, fruits: 0, carbs: 0, fats: 1, kcal: 116, group: 'proteinas' },
  { id: 'camaron', name: 'Camarón', aliases: ['camaron', 'camarón', 'langostino'], portion: '100 g cocido', protein: 24, fiber: 0, vegetables: 0, fruits: 0, carbs: 0.2, fats: 0.3, kcal: 99, group: 'proteinas' },
  { id: 'frijoles', name: 'Frijoles', aliases: ['frijoles', 'frijol', 'frijoles negros', 'frijoles rojos', 'habichuelas'], portion: '1/2 taza cocidos', protein: 7.5, fiber: 7.5, vegetables: 0, fruits: 0, carbs: 20, fats: 0.5, kcal: 113, group: 'proteinas' },
  { id: 'lentejas', name: 'Lentejas', aliases: ['lentejas', 'lenteja'], portion: '1/2 taza cocidas', protein: 9, fiber: 7.8, vegetables: 0, fruits: 0, carbs: 20, fats: 0.4, kcal: 115, group: 'proteinas' },
  { id: 'garbanzos', name: 'Garbanzos', aliases: ['garbanzos', 'garbanzo'], portion: '1/2 taza cocidos', protein: 7.3, fiber: 6.2, vegetables: 0, fruits: 0, carbs: 22, fats: 2.1, kcal: 134, group: 'proteinas' },
  { id: 'tofu', name: 'Tofu', aliases: ['tofu', 'tofu firme'], portion: '100 g', protein: 8, fiber: 0.3, vegetables: 0, fruits: 0, carbs: 1.9, fats: 4.8, kcal: 76, group: 'proteinas' },
  { id: 'arroz', name: 'Arroz', aliases: ['arroz', 'arroz blanco', 'arroz integral', 'arroz cocido'], portion: '1/2 taza cocido', protein: 2.2, fiber: 0.9, vegetables: 0, fruits: 0, carbs: 22, fats: 0.2, kcal: 102, group: 'cereales' },
  { id: 'pasta', name: 'Pasta', aliases: ['pasta', 'espagueti', 'fideos', 'tallarines', 'pasta cocida'], portion: '1 taza cocida', protein: 7, fiber: 2.5, vegetables: 0, fruits: 0, carbs: 43, fats: 1.3, kcal: 220, group: 'cereales' },
  { id: 'pan', name: 'Pan', aliases: ['pan', 'pan blanco', 'pan integral', 'pan tajado', 'pan de molde'], portion: '1 rebanada (30 g)', protein: 3, fiber: 1.2, vegetables: 0, fruits: 0, carbs: 15, fats: 1, kcal: 80, group: 'cereales' },
  { id: 'arepa', name: 'Arepa', aliases: ['arepa', 'arepas', 'arepa de maiz', 'arepa de queso'], portion: '1 unidad (100 g)', protein: 4, fiber: 2, vegetables: 0, fruits: 0, carbs: 40, fats: 3, kcal: 200, group: 'cereales' },
  { id: 'maiz', name: 'Maíz', aliases: ['maiz', 'maíz', 'mazorca', 'choclo', 'maiz tierno'], portion: '1 mazorca (90 g)', protein: 3, fiber: 2.4, vegetables: 0, fruits: 0, carbs: 17, fats: 1.4, kcal: 90, group: 'cereales' },
  { id: 'papa', name: 'Papa', aliases: ['papa', 'papas', 'patata', 'papa cocida', 'papa asada'], portion: '1 mediana (150 g)', protein: 3, fiber: 3, vegetables: 0, fruits: 0, carbs: 26, fats: 0.2, kcal: 116, group: 'cereales' },
  { id: 'yuca', name: 'Yuca', aliases: ['yuca', 'mandioca', 'casabe'], portion: '1/2 taza cocida', protein: 1, fiber: 1.5, vegetables: 0, fruits: 0, carbs: 30, fats: 0.2, kcal: 120, group: 'cereales' },
  { id: 'platano', name: 'Plátano maduro', aliases: ['platano', 'plátano', 'platano maduro', 'plátano maduro', 'patacones', 'tajadas'], portion: '1 unidad (100 g)', protein: 1.3, fiber: 2, vegetables: 0, fruits: 0, carbs: 27, fats: 0.2, kcal: 116, group: 'cereales' },
  { id: 'banano', name: 'Banano', aliases: ['banano', 'banana', 'guineo'], portion: '1 unidad (120 g)', protein: 1.3, fiber: 3, vegetables: 0, fruits: 1, carbs: 27, fats: 0.4, kcal: 105, group: 'frutas' },
  { id: 'avena', name: 'Avena', aliases: ['avena', 'harina de avena', 'avena en hojuelas'], portion: '1/2 taza seca (40 g)', protein: 6.5, fiber: 4, vegetables: 0, fruits: 0, carbs: 27, fats: 2.5, kcal: 150, group: 'cereales' },
  { id: 'quinua', name: 'Quinua', aliases: ['quinua', 'quinoa'], portion: '1/2 taza cocida', protein: 4.4, fiber: 2.6, vegetables: 0, fruits: 0, carbs: 20, fats: 1.8, kcal: 111, group: 'cereales' },
  { id: 'tomate', name: 'Tomate', aliases: ['tomate', 'tomates', 'tomate de arbol', 'tomate de árbol'], portion: '1 unidad (120 g)', protein: 1, fiber: 1.5, vegetables: 1, fruits: 0, carbs: 4.5, fats: 0.2, kcal: 22, group: 'verduras' },
  { id: 'cebolla', name: 'Cebolla', aliases: ['cebolla', 'cebollas', 'cebolla cabezona', 'cebolla larga', 'cebollin'], portion: '1/2 unidad (60 g)', protein: 0.7, fiber: 1, vegetables: 1, fruits: 0, carbs: 5.5, fats: 0.1, kcal: 24, group: 'verduras' },
  { id: 'ajo', name: 'Ajo', aliases: ['ajo', 'ajos'], portion: '1 diente (3 g)', protein: 0.2, fiber: 0.1, vegetables: 1, fruits: 0, carbs: 1, fats: 0, kcal: 4, group: 'verduras' },
  { id: 'pimenton', name: 'Pimentón', aliases: ['pimenton', 'pimentón', 'pimiento', 'pimientos', 'pimiento rojo', 'pimiento verde'], portion: '1/2 unidad (60 g)', protein: 0.5, fiber: 1.2, vegetables: 1, fruits: 0, carbs: 3.5, fats: 0.1, kcal: 15, group: 'verduras' },
  { id: 'zanahoria', name: 'Zanahoria', aliases: ['zanahoria', 'zanahorias'], portion: '1 unidad (60 g)', protein: 0.6, fiber: 1.7, vegetables: 1, fruits: 0, carbs: 5.5, fats: 0.1, kcal: 25, group: 'verduras' },
  { id: 'pepino', name: 'Pepino', aliases: ['pepino', 'pepinos'], portion: '1/2 unidad (100 g)', protein: 0.7, fiber: 0.5, vegetables: 1, fruits: 0, carbs: 3.6, fats: 0.1, kcal: 15, group: 'verduras' },
  { id: 'lechuga', name: 'Lechuga', aliases: ['lechuga', 'ensalada verde', 'hojas verdes'], portion: '1 taza (50 g)', protein: 0.6, fiber: 0.6, vegetables: 1, fruits: 0, carbs: 1.5, fats: 0.1, kcal: 8, group: 'verduras' },
  { id: 'espinaca', name: 'Espinaca', aliases: ['espinaca', 'espinacas'], portion: '1 taza cruda (30 g)', protein: 0.9, fiber: 0.7, vegetables: 1, fruits: 0, carbs: 1.1, fats: 0.1, kcal: 7, group: 'verduras' },
  { id: 'brocoli', name: 'Brócoli', aliases: ['brocoli', 'brócoli', 'brocoli cocido'], portion: '1/2 taza cocido', protein: 1.9, fiber: 2.6, vegetables: 1, fruits: 0, carbs: 5.6, fats: 0.3, kcal: 27, group: 'verduras' },
  { id: 'coliflor', name: 'Coliflor', aliases: ['coliflor'], portion: '1/2 taza cocida', protein: 1.1, fiber: 1.4, vegetables: 1, fruits: 0, carbs: 2.6, fats: 0.1, kcal: 14, group: 'verduras' },
  { id: 'repollo', name: 'Repollo', aliases: ['repollo', 'col', 'repollo morado'], portion: '1 taza rallado (70 g)', protein: 0.9, fiber: 1.7, vegetables: 1, fruits: 0, carbs: 3.9, fats: 0.1, kcal: 18, group: 'verduras' },
  { id: 'calabacin', name: 'Calabacín', aliases: ['calabacin', 'calabacín', 'zucchini'], portion: '1/2 unidad (100 g)', protein: 1.2, fiber: 1, vegetables: 1, fruits: 0, carbs: 3.1, fats: 0.3, kcal: 17, group: 'verduras' },
  { id: 'calabaza', name: 'Calabaza', aliases: ['calabaza', 'zapallo', 'ahuyama'], portion: '1/2 taza cocida', protein: 0.9, fiber: 2.5, vegetables: 1, fruits: 0, carbs: 8, fats: 0.1, kcal: 40, group: 'verduras' },
  { id: 'berenjena', name: 'Berenjena', aliases: ['berenjena'], portion: '1/2 taza cocida', protein: 0.4, fiber: 1.3, vegetables: 1, fruits: 0, carbs: 4.5, fats: 0.2, kcal: 20, group: 'verduras' },
  { id: 'remolacha', name: 'Remolacha', aliases: ['remolacha', 'betabel', 'betarraga'], portion: '1/2 taza cocida', protein: 1.1, fiber: 1.7, vegetables: 1, fruits: 0, carbs: 8.5, fats: 0.1, kcal: 37, group: 'verduras' },
  { id: 'champinones', name: 'Champiñones', aliases: ['champinones', 'champiñones', 'hongos', 'setas'], portion: '1/2 taza cocidos', protein: 1.7, fiber: 1, vegetables: 1, fruits: 0, carbs: 2.2, fats: 0.2, kcal: 14, group: 'verduras' },
  { id: 'habichuela', name: 'Habichuela', aliases: ['habichuela', 'ejotes', 'vainitas', 'judias verdes'], portion: '1/2 taza cocida', protein: 1.2, fiber: 2, vegetables: 1, fruits: 0, carbs: 4.9, fats: 0.2, kcal: 22, group: 'verduras' },
  { id: 'aguacate', name: 'Aguacate', aliases: ['aguacate', 'palta', 'avocado'], portion: '1/2 unidad (75 g)', protein: 1.5, fiber: 5, vegetables: 0, fruits: 0, carbs: 6, fats: 11, kcal: 120, group: 'grasas' },
  { id: 'aceite', name: 'Aceite', aliases: ['aceite', 'aceite de oliva', 'aceite de girasol', 'aceite vegetal'], portion: '1 cucharada (10 g)', protein: 0, fiber: 0, vegetables: 0, fruits: 0, carbs: 0, fats: 10, kcal: 90, group: 'grasas' },
  { id: 'nueces', name: 'Nueces', aliases: ['nueces', 'nuez', 'almendras', 'almendra', 'mani', 'maní', 'pistachos', 'avellanas', 'semillas'], portion: '1 puñado (30 g)', protein: 5, fiber: 2.5, vegetables: 0, fruits: 0, carbs: 5, fats: 15, kcal: 170, group: 'grasas' },
  { id: 'mantequilla', name: 'Mantequilla', aliases: ['mantequilla', 'margarina'], portion: '1 cucharada (10 g)', protein: 0.1, fiber: 0, vegetables: 0, fruits: 0, carbs: 0.1, fats: 8, kcal: 72, group: 'grasas' },
  { id: 'queso', name: 'Queso', aliases: ['queso', 'queso fresco', 'queso mozzarella', 'queso parmesano', 'queso campesino', 'queso doble crema'], portion: '1 porción (30 g)', protein: 7, fiber: 0, vegetables: 0, fruits: 0, carbs: 1, fats: 8, kcal: 100, group: 'lacteos' },
  { id: 'yogur', name: 'Yogur', aliases: ['yogur', 'yogurt', 'kumis', 'kefir'], portion: '1 vaso (200 g)', protein: 7, fiber: 0, vegetables: 0, fruits: 0, carbs: 12, fats: 4, kcal: 110, group: 'lacteos' },
  { id: 'leche', name: 'Leche', aliases: ['leche', 'leche entera', 'leche descremada', 'leche semidescremada'], portion: '1 vaso (200 ml)', protein: 6.6, fiber: 0, vegetables: 0, fruits: 0, carbs: 9.5, fats: 3.6, kcal: 100, group: 'lacteos' },
  { id: 'manzana', name: 'Manzana', aliases: ['manzana', 'manzanas'], portion: '1 unidad (180 g)', protein: 0.5, fiber: 4.4, vegetables: 0, fruits: 1, carbs: 25, fats: 0.2, kcal: 95, group: 'frutas' },
  { id: 'pera', name: 'Pera', aliases: ['pera', 'peras'], portion: '1 unidad (170 g)', protein: 0.6, fiber: 5.5, vegetables: 0, fruits: 1, carbs: 27, fats: 0.2, kcal: 100, group: 'frutas' },
  { id: 'naranja', name: 'Naranja', aliases: ['naranja', 'naranjas'], portion: '1 unidad (130 g)', protein: 1.3, fiber: 3.1, vegetables: 0, fruits: 1, carbs: 15, fats: 0.2, kcal: 62, group: 'frutas' },
  { id: 'mandarina', name: 'Mandarina', aliases: ['mandarina', 'mandarinas'], portion: '1 unidad (90 g)', protein: 0.7, fiber: 1.6, vegetables: 0, fruits: 1, carbs: 11, fats: 0.2, kcal: 47, group: 'frutas' },
  { id: 'fresa', name: 'Fresa', aliases: ['fresa', 'fresas', 'frutilla'], portion: '1/2 taza (75 g)', protein: 0.5, fiber: 1.5, vegetables: 0, fruits: 1, carbs: 5.5, fats: 0.2, kcal: 24, group: 'frutas' },
  { id: 'mora', name: 'Mora', aliases: ['mora', 'moras', 'zarzamora'], portion: '1/2 taza (75 g)', protein: 1, fiber: 4, vegetables: 0, fruits: 1, carbs: 7, fats: 0.3, kcal: 31, group: 'frutas' },
  { id: 'mango', name: 'Mango', aliases: ['mango', 'mangos'], portion: '1/2 unidad (100 g)', protein: 0.8, fiber: 1.6, vegetables: 0, fruits: 1, carbs: 15, fats: 0.4, kcal: 60, group: 'frutas' },
  { id: 'pina', name: 'Piña', aliases: ['pina', 'piña'], portion: '1 taza (150 g)', protein: 0.9, fiber: 2.3, vegetables: 0, fruits: 1, carbs: 19, fats: 0.2, kcal: 74, group: 'frutas' },
  { id: 'papaya', name: 'Papaya', aliases: ['papaya', 'lechosa'], portion: '1 taza (140 g)', protein: 0.7, fiber: 2.5, vegetables: 0, fruits: 1, carbs: 15, fats: 0.3, kcal: 60, group: 'frutas' },
  { id: 'sandia', name: 'Sandía', aliases: ['sandia', 'sandía', 'melon de agua'], portion: '1 taza (150 g)', protein: 0.9, fiber: 0.6, vegetables: 0, fruits: 1, carbs: 11, fats: 0.2, kcal: 46, group: 'frutas' },
  { id: 'melon', name: 'Melón', aliases: ['melon', 'melón'], portion: '1 taza (150 g)', protein: 1.1, fiber: 1.2, vegetables: 0, fruits: 1, carbs: 12, fats: 0.2, kcal: 50, group: 'frutas' },
  { id: 'uva', name: 'Uva', aliases: ['uva', 'uvas'], portion: '1/2 taza (75 g)', protein: 0.5, fiber: 0.7, vegetables: 0, fruits: 1, carbs: 13, fats: 0.1, kcal: 52, group: 'frutas' },
  { id: 'guayaba', name: 'Guayaba', aliases: ['guayaba', 'guayabas'], portion: '1 unidad (90 g)', protein: 2.2, fiber: 4.9, vegetables: 0, fruits: 1, carbs: 12, fats: 0.9, kcal: 60, group: 'frutas' },
  { id: 'granadilla', name: 'Granadilla', aliases: ['granadilla', 'maracuya', 'maracuyá', 'curuba'], portion: '1 unidad (60 g)', protein: 1.5, fiber: 6, vegetables: 0, fruits: 1, carbs: 8, fats: 0.4, kcal: 40, group: 'frutas' },
  { id: 'cafe', name: 'Café', aliases: ['cafe', 'café', 'tinto', 'espresso', 'americano'], portion: '1 taza (200 ml)', protein: 0.3, fiber: 0, vegetables: 0, fruits: 0, carbs: 0.5, fats: 0, kcal: 2, group: 'bebidas' },
  { id: 'te', name: 'Té', aliases: ['te', 'té', 'te verde', 'té verde', 'te negro', 'té negro', 'infusion'], portion: '1 taza (200 ml)', protein: 0, fiber: 0, vegetables: 0, fruits: 0, carbs: 0.5, fats: 0, kcal: 2, group: 'bebidas' },
  { id: 'jugo', name: 'Jugo', aliases: ['jugo', 'jugo natural', 'jugo de naranja', 'jugo de mora', 'jugo de mango'], portion: '1 vaso (200 ml)', protein: 0.8, fiber: 0.5, vegetables: 0, fruits: 1, carbs: 22, fats: 0.2, kcal: 90, group: 'bebidas' },
  { id: 'gaseosa', name: 'Gaseosa', aliases: ['gaseosa', 'soda', 'refresco', 'cola', 'bebida azucarada'], portion: '1 vaso (250 ml)', protein: 0, fiber: 0, vegetables: 0, fruits: 0, carbs: 26, fats: 0, kcal: 105, group: 'bebidas' },
  { id: 'chocolate', name: 'Chocolate', aliases: ['chocolate', 'chocolate oscuro', 'chocolate amargo', 'cacao', 'cocoa'], portion: '1 porción (30 g)', protein: 2, fiber: 2, vegetables: 0, fruits: 0, carbs: 15, fats: 9, kcal: 150, group: 'otros' },
  { id: 'miel', name: 'Miel', aliases: ['miel', 'azucar', 'azúcar', 'panela'], portion: '1 cucharada (15 g)', protein: 0, fiber: 0, vegetables: 0, fruits: 0, carbs: 12, fats: 0, kcal: 48, group: 'otros' },
  { id: 'empanada', name: 'Empanada', aliases: ['empanada', 'empanadas', 'pastel', 'arepa de huevo'], portion: '1 unidad (80 g)', protein: 5, fiber: 1.5, vegetables: 0, fruits: 0, carbs: 25, fats: 12, kcal: 230, group: 'otros' },
  { id: 'papas-fritas', name: 'Papas fritas', aliases: ['papas fritas', 'patacones', 'frituras', 'chips', 'snacks'], portion: '1 porción (100 g)', protein: 2.5, fiber: 2, vegetables: 0, fruits: 0, carbs: 30, fats: 15, kcal: 260, group: 'otros' },
  { id: 'pizza', name: 'Pizza', aliases: ['pizza', 'pizzas'], portion: '2 porciones (200 g)', protein: 20, fiber: 3, vegetables: 0, fruits: 0, carbs: 50, fats: 18, kcal: 450, group: 'otros' },
  { id: 'hamburguesa', name: 'Hamburguesa', aliases: ['hamburguesa', 'hamburguesas', 'burger'], portion: '1 unidad (200 g)', protein: 22, fiber: 2, vegetables: 0, fruits: 0, carbs: 35, fats: 20, kcal: 420, group: 'otros' },
  { id: 'sopa', name: 'Sopa', aliases: ['sopa', 'caldo', 'sancocho', 'crema de verduras'], portion: '1 plato (300 ml)', protein: 8, fiber: 3, vegetables: 1, fruits: 0, carbs: 20, fats: 4, kcal: 150, group: 'otros' },
  { id: 'ensalada', name: 'Ensalada', aliases: ['ensalada', 'ensalada verde', 'ensalada mixta'], portion: '1 plato (150 g)', protein: 2, fiber: 4, vegetables: 1, fruits: 0, carbs: 8, fats: 3, kcal: 60, group: 'verduras' },
  { id: 'arroz-con-pollo', name: 'Arroz con pollo', aliases: ['arroz con pollo'], portion: '1 plato (300 g)', protein: 25, fiber: 2, vegetables: 1, fruits: 0, carbs: 55, fats: 8, kcal: 400, group: 'otros' },
  { id: 'bandeja', name: 'Bandeja / plato fuerte', aliases: ['bandeja', 'plato fuerte', 'almuerzo completo', 'corrientazo'], portion: '1 plato (400 g)', protein: 30, fiber: 8, vegetables: 1, fruits: 0, carbs: 60, fats: 15, kcal: 520, group: 'otros' },
];

const nutrientAliasIndex = (() => {
  const index = new Map();
  for (const item of nutrientDB) {
    for (const alias of [item.name, ...item.aliases]) {
      index.set(alias.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''), item);
    }
  }
  return index;
})();

export function findNutrient(query) {
  const normalized = String(query || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
  if (!normalized) return null;
  if (nutrientAliasIndex.has(normalized)) return nutrientAliasIndex.get(normalized);
  for (const [alias, item] of nutrientAliasIndex.entries()) {
    if (alias.includes(normalized) || normalized.includes(alias)) return item;
  }
  return null;
}

export function estimatePlate(items) {
  const totals = { protein: 0, fiber: 0, vegetables: 0, fruits: 0, carbs: 0, fats: 0, kcal: 0, matched: 0, unmatched: 0 };
  const details = [];
  for (const item of items) {
    const nutrient = findNutrient(item.name);
    if (!nutrient) {
      totals.unmatched += 1;
      details.push({ ...item, nutrient: null });
      continue;
    }
    const factor = Math.max(0.25, Math.min(3, Number(item.amount) || 1));
    totals.matched += 1;
    totals.protein += nutrient.protein * factor;
    totals.fiber += nutrient.fiber * factor;
    totals.vegetables += nutrient.vegetables * factor;
    totals.fruits += nutrient.fruits * factor;
    totals.carbs += nutrient.carbs * factor;
    totals.fats += nutrient.fats * factor;
    totals.kcal += nutrient.kcal * factor;
    details.push({ ...item, nutrient, factor });
  }
  return { totals, details };
}

export function plateFeedback(estimate) {
  const { totals } = estimate;
  const positives = [];
  const complements = [];
  if (totals.protein >= 15) positives.push('Tiene una buena cantidad de proteína, que ayuda a la saciedad y al mantenimiento muscular.');
  else if (totals.protein > 0) complements.push('Podrías sumar una fuente de proteína (huevo, pollo, pescado, legumbres o queso) para completar el plato.');
  if (totals.vegetables >= 1) positives.push('Incluye verduras, que aportan fibra, vitaminas y volumen con pocas calorías.');
  else if (totals.matched > 0) complements.push('Agregar verduras (tomate, lechuga, zanahoria, brócoli) haría el plato más completo.');
  if (totals.fruits >= 1) positives.push('Incluye fruta, una buena fuente de vitaminas y fibra.');
  if (totals.fiber >= 5) positives.push('El contenido de fibra es bueno, lo que favorece la salud digestiva.');
  else if (totals.fiber > 0 && totals.fiber < 5) complements.push('Podrías sumar fibra con legumbres, avena, frutas o verduras.');
  if (totals.fats > 0 && totals.fats <= 15) positives.push('Las grasas del plato están en un rango razonable.');
  if (totals.fats > 20) complements.push('El plato tiene bastantes grasas; podrías equilibrarlo con más verduras y porciones moderadas.');
  if (totals.kcal > 0 && totals.kcal < 350) complements.push('Es un plato ligero; si te quedas con hambre, suma proteína o un acompañamiento integral.');
  if (totals.matched === 0) {
    positives.push('Registraste tu comida, que es el primer paso para observar patrones.');
    complements.push('Completa los alimentos con cantidades aproximadas para ver el desglose.');
  }
  if (positives.length === 0) positives.push('Registrar lo que comes te ayuda a conversar mejor con tu equipo de salud.');
  return { positives, complements };
}
