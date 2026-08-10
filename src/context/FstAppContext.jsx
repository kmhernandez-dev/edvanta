/**
 * ============================================================
 *  FstAppContext.jsx — Estado global de la app Feliz Sin Tiroides
 *
 *  Fuente de datos: Supabase PostgreSQL (datos reales).
 *  Sin demo, sin perfiles ficticios, sin localStorage como DB.
 *  Cada consulta está protegida por RLS (user_id = auth.uid()).
 * ============================================================
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { requireSupabase } from '../lib/supabase';

const FstAppContext = createContext(null);

export const symptomOptions = [
  'Energía', 'Sueño', 'Ánimo', 'Estreñimiento', 'Palpitaciones',
  'Fatiga', 'Temperatura', 'Concentración', 'Caída de cabello', 'Otro',
];

export const conditionOptions = [
  'Hipotiroidismo', 'Tiroiditis de Hashimoto', 'Enfermedad de Graves',
  'Tiroidectomía total', 'Tiroidectomía parcial', 'Cáncer de tiroides',
  'Yodoterapia (radioyodo)', 'Otra condición', 'No estoy segura',
];

export const surgeryOptions = [
  'Tiroidectomía total', 'Tiroidectomía parcial', 'Sin cirugía', 'No estoy segura',
];

export const goalOptions = [
  'Equilibrada', 'Más energía', 'Mejor digestión', 'Mantener peso',
  'Reducir inflamación', 'Comer más saludable', 'Preparar consulta',
];

export const budgetOptions = ['bajo', 'medio', 'alto'];
export const cookTimeOptions = [15, 30, 60];

const emptyState = {
  profile: null,
  thyroidProfile: null,
  preferences: null,
  medications: [],
  medicationLogs: [],
  symptoms: [],
  symptomLogs: [],
  laboratoryResults: [],
  appointments: [],
  tasks: [],
  habits: [],
  habitLogs: [],
  questions: [],
  timeline: [],
  documents: [],
  notifications: [],
  consents: [],
  meals: [],
  weightLogs: [],
  chatHistory: [],
  activityLogs: [],
  menus: [],
  shoppingLists: [],
};

export function FstAppProvider({ children }) {
  const { user, profile } = useAuth();
  const [data, setData] = useState(emptyState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState('idle');

  const loadAll = useCallback(async () => {
    if (!user) {
      setData(emptyState);
      return;
    }
    const client = requireSupabase();
    setLoading(true);
    setError('');
    try {
      const simpleTables = [
        'thyroid_profile', 'user_preferences', 'medications', 'laboratory_results',
        'appointments', 'tasks', 'habits', 'habit_logs', 'questions_for_visit',
        'health_timeline', 'documents', 'notifications', 'consents', 'meals',
        'weight_logs', 'chat_history', 'activity_logs', 'menus', 'shopping_lists',
      ];
      // Cada tabla se carga de forma INDEPENDIENTE: si una falla, las demás
      // siguen funcionando (antes Promise.all atascaba toda la app).
      const loadTable = async (table, select = '*') => {
        const { data: rows, error: tableError } = await client
          .from(table)
          .select(select)
          .order('created_at', { ascending: false });
        if (tableError) {
          console.warn(`FstAppContext: no se pudo cargar ${table}:`, tableError.message);
          return [table, []];
        }
        return [table, rows || []];
      };
      const results = await Promise.all([
        ...simpleTables.map(table => loadTable(table)),
        loadTable('symptoms'),
        loadTable('symptom_logs', '*, symptoms(name)'),
        loadTable('medication_logs', '*, medications(medication_name)'),
      ]);
      const next = { ...emptyState, profile };
      for (const [table, rows] of results) {
        if (Array.isArray(rows)) next[table] = rows;
      }
      setData(next);
    } catch (err) {
      console.error('FstAppContext loadAll:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, profile]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const logActivity = useCallback(async (action, resourceType, metadata = null) => {
    if (!user) return;
    try {
      const client = requireSupabase();
      await client.rpc('log_activity', { p_action: action, p_resource: resourceType, p_metadata: metadata });
    } catch {
      // No bloquea la operación principal
    }
  }, [user]);

  const insert = useCallback(async (table, values) => {
    if (!user) return { error: 'Sin sesión' };
    const client = requireSupabase();
    const { data: row, error } = await client
      .from(table)
      .insert({ ...values, user_id: user.id })
      .select()
      .single();
    if (error) return { error: error.message };
    setData(current => ({ ...current, [table]: [row, ...(current[table] || [])] }));
    setSaveStatus('saved');
    return { data: row };
  }, [user]);

  const update = useCallback(async (table, id, values) => {
    if (!user) return { error: 'Sin sesión' };
    const client = requireSupabase();
    const { data: row, error } = await client
      .from(table)
      .update({ ...values, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) return { error: error.message };
    setData(current => ({
      ...current,
      [table]: (current[table] || []).map(item => item.id === id ? row : item),
    }));
    setSaveStatus('saved');
    return { data: row };
  }, [user]);

  const remove = useCallback(async (table, id) => {
    if (!user) return { error: 'Sin sesión' };
    const client = requireSupabase();
    const { error } = await client.from(table).delete().eq('id', id);
    if (error) return { error: error.message };
    setData(current => ({
      ...current,
      [table]: (current[table] || []).filter(item => item.id !== id),
    }));
    return { ok: true };
  }, [user]);

  const upsertPreferences = useCallback(async values => {
    if (!user) return { error: 'Sin sesión' };
    const client = requireSupabase();
    const { data: row, error } = await client
      .from('user_preferences')
      .upsert({ ...values, user_id: user.id }, { onConflict: 'user_id' })
      .select()
      .single();
    if (error) return { error: error.message };
    setData(current => ({ ...current, user_preferences: row }));
    setSaveStatus('saved');
    return { data: row };
  }, [user]);

  const upsertThyroidProfile = useCallback(async values => {
    if (!user) return { error: 'Sin sesión' };
    const client = requireSupabase();
    const { data: row, error } = await client
      .from('thyroid_profile')
      .upsert({ ...values, user_id: user.id }, { onConflict: 'user_id' })
      .select()
      .single();
    if (error) return { error: error.message };
    setData(current => ({ ...current, thyroid_profile: row }));
    setSaveStatus('saved');
    return { data: row };
  }, [user]);

  const completeOnboarding = useCallback(async () => {
    if (!user) return;
    const client = requireSupabase();
    await client.from('profiles').update({ onboarding_completed: true }).eq('id', user.id);
    await logActivity('onboarding_completed', 'profile');
  }, [user, logActivity]);

  const addChatMessage = useCallback(async (role, content, level = null, evidence = null) => {
    if (!user) return null;
    const client = requireSupabase();
    const { data: row, error } = await client
      .from('chat_history')
      .insert({ user_id: user.id, role, content, level, evidence })
      .select()
      .single();
    if (error) return null;
    setData(current => ({ ...current, chatHistory: [row, ...(current.chatHistory || [])] }));
    return row;
  }, [user]);

  const value = useMemo(() => ({
    data,
    loading,
    error,
    saveStatus,
    setSaveStatus,
    reload: loadAll,
    insert,
    update,
    remove,
    upsertPreferences,
    upsertThyroidProfile,
    completeOnboarding,
    addChatMessage,
    logActivity,
  }), [data, loading, error, saveStatus, loadAll, insert, update, remove, upsertPreferences, upsertThyroidProfile, completeOnboarding, addChatMessage, logActivity]);

  return <FstAppContext.Provider value={value}>{children}</FstAppContext.Provider>;
}

export function useFstApp() {
  const value = useContext(FstAppContext);
  if (!value) throw new Error('useFstApp requiere FstAppProvider');
  return value;
}
