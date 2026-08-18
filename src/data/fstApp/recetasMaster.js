/**
 * ============================================================
 *  recetasMaster.js — Adaptador de las recetas maestras
 *
 *  Toma las 50 recetas verificadas de data/nutricion/
 *  (fst_recetas_master.json) y las transforma al formato que
 *  consume NutriFST IA (menús, "cocina con lo que tengo",
 *  listas de compras), conservando además flags de dieta y
 *  yodo para filtrar menús de forma más inteligente.
 *
 *  Fuente única de verdad: el JSON maestro. Aquí NO se inventan
 *  recetas; solo se adapta el formato.
 * ============================================================
 */

import master from '../../../data/nutricion/fst_recetas_master.json';

// La IA organiza los menús en 4 franjas. 'sopa' se sirve como cena.
const MEAL_MAP = { desayuno: 'desayuno', almuerzo: 'almuerzo', cena: 'cena', snack: 'snack', sopa: 'cena' };

// Convierte "1/3 taza", "1 unidad", "5 ml", "1 cda", "1 pizca" → { amount, unit }.
function parseMeasure(medida, cantidad) {
  const raw = String(medida || cantidad || '').trim();
  const match = raw.match(/^(\d+(?:\.\d+)?(?:\/\d+)?)\s*(.*)$/);
  if (match) {
    let amount = match[1];
    if (amount.includes('/')) {
      const [a, b] = amount.split('/').map(Number);
      amount = b ? a / b : Number(a);
    } else {
      amount = Number(amount);
    }
    amount = Math.round(amount * 100) / 100;
    return { amount: amount || 1, unit: (match[2] || 'porción').trim() || 'porción' };
  }
  return { amount: 1, unit: raw || 'porción' };
}

// Nombre simple para casar ingredientes: minúsculas, sin paréntesis ni acentos duplicados.
function simplifyName(ingrediente) {
  return String(ingrediente || '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Heurística de costo (el máster no lo declara): 'medio' si lleva proteína cara.
function inferCost(recipe) {
  const text = JSON.stringify(recipe.ingredientes || []).toLowerCase();
  if (/salm[oó]n|at[uú]n|camar|mariscos|lomo|solomillo|res\b/.test(text)) return 'medio';
  return 'bajo';
}

export const masterRecipes = (master.recetas || []).map(recipe => ({
  id: String(recipe.recipe_id || '').toLowerCase(),
  name: recipe.nombre,
  meal: MEAL_MAP[recipe.tipo_comida] || 'almuerzo',
  time: Number(recipe.tiempo_preparacion_min) || 20,
  cost: inferCost(recipe),
  servings: Number(recipe.porciones) || 1,
  ingredients: (recipe.ingredientes || []).map(item => ({
    name: simplifyName(item.ingrediente),
    ...parseMeasure(item.medida_casera, item.cantidad_g_ml),
  })),
  steps: recipe.preparacion || [],
  notes: recipe.clinical_rationale || recipe.descripcion || '',
  // Metadatos extra (verificados) para filtrado clínico de menús:
  kcal: Number(recipe.energia_estimada_kcal) || null,
  lowIodine: recipe.low_iodine_compatible === true,
  iodineRisk: recipe.iodine_risk || null,
  vegan: recipe.vegana === true,
  vegetarian: recipe.vegetariana === true,
  glutenFree: recipe.naturalmente_sin_gluten === true,
  levoInteraction: recipe.levothyroxine_interaction === true,
  source: 'master',
}));
