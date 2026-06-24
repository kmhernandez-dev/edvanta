import { createContext, useContext, useEffect, useMemo, useReducer, useState, useCallback } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'bpkh_cart_v1';

// ─── Reducer ──────────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find(i => i.id === action.product.id);
      if (existing) {
        return state.map(i =>
          i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...state, {
        id: action.product.id,
        name: action.product.name,
        price: action.product.price,
        category: action.product.category,
        qty: 1,
      }];
    }
    case 'REMOVE':
      return state.filter(i => i.id !== action.id);
    case 'INCREMENT':
      return state.map(i => i.id === action.id ? { ...i, qty: i.qty + 1 } : i);
    case 'DECREMENT':
      return state
        .map(i => i.id === action.id ? { ...i, qty: i.qty - 1 } : i)
        .filter(i => i.qty > 0);
    case 'CLEAR':
      return [];
    case 'HYDRATE':
      return action.items;
    default:
      return state;
  }
}

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, loadInitial);
  const [isOpen, setIsOpen]   = useState(false);
  const [lastAdded, setLastAdded] = useState(null); // for toast

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch { /* ignore quota errors */ }
  }, [items]);

  const addItem = useCallback((product) => {
    dispatch({ type: 'ADD', product });
    setLastAdded({ name: product.name, at: Date.now() });
  }, []);

  const removeItem  = useCallback((id) => dispatch({ type: 'REMOVE', id }), []);
  const increment   = useCallback((id) => dispatch({ type: 'INCREMENT', id }), []);
  const decrement   = useCallback((id) => dispatch({ type: 'DECREMENT', id }), []);
  const clearCart   = useCallback(() => dispatch({ type: 'CLEAR' }), []);
  const openCart    = useCallback(() => setIsOpen(true), []);
  const closeCart   = useCallback(() => setIsOpen(false), []);

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);

  const value = {
    items, count, total,
    isOpen, lastAdded,
    addItem, removeItem, increment, decrement, clearCart,
    openCart, closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
