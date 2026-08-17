/**
 * ============================================================
 *  admin/RetosAdmin.jsx — Gestión de retos (Admin Academia)
 *  Crear/editar retos y sus 7 días sin tocar código.
 *  Valida URLs de YouTube antes de guardar.
 * ============================================================
 */

import { useCallback, useEffect, useState } from 'react';
import { GOALS, LEVELS, BODY_AREAS, TRAINING_TYPES, EQUIPMENT_OPTIONS } from '../../lib/retos';

const EMPTY_CHALLENGE = {
  title: '', slug: '', tagline: '', description: '', cover_image: '',
  primary_goal: 'maintain_wellbeing', category: '', instructor: '', level: 'beginner',
  equipment: '', average_duration: '', status: 'draft', start_date: '', end_date: '',
  evergreen: true, featured: false, sort_order: 0,
};

const EMPTY_DAY = {
  day_number: 1, title: '', description: '', youtube_url: '', instructor: '',
  duration_minutes: '', difficulty: '', equipment: '', body_area: '', training_type: '',
  low_impact: false, beginner_friendly: false, nutrition_challenge: '', educational_note: '', status: 'draft',
};

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-0.5 block text-[11px] font-semibold text-gray-500">{label}</label>
      {children}
    </div>
  );
}

const inputClass = 'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200';

export default function RetosAdmin({ api }) {
  const [challenges, setChallenges] = useState([]);
  const [selected, setSelected] = useState(null);
  const [days, setDays] = useState([]);
  const [form, setForm] = useState(EMPTY_CHALLENGE);
  const [dayForm, setDayForm] = useState(EMPTY_DAY);
  const [editingDay, setEditingDay] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadChallenges = useCallback(async () => {
    try {
      const data = await api('/api/admin/academia/retos');
      setChallenges(data.challenges || []);
    } catch (e) { setError(e.message); }
  }, [api]);

  const loadDays = useCallback(async challengeId => {
    try {
      const data = await api(`/api/admin/academia/retos/${challengeId}/days`);
      setDays(data.days || []);
    } catch (e) { setError(e.message); }
  }, [api]);

  useEffect(() => { loadChallenges(); }, [loadChallenges]);

  const selectChallenge = challenge => {
    setSelected(challenge);
    setForm(challenge);
    setEditingDay(null);
    setDayForm(EMPTY_DAY);
    loadDays(challenge.id);
  };

  const saveChallenge = async event => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (selected) {
        await api(`/api/admin/academia/retos/${selected.id}`, { method: 'PUT', body: JSON.stringify(form) });
      } else {
        await api('/api/admin/academia/retos', { method: 'POST', body: JSON.stringify(form) });
      }
      await loadChallenges();
      setSelected(null);
      setForm(EMPTY_CHALLENGE);
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  const saveDay = async event => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingDay) {
        await api(`/api/admin/academia/retos/days/${editingDay.id}`, { method: 'PUT', body: JSON.stringify(dayForm) });
      } else {
        await api(`/api/admin/academia/retos/${selected.id}/days`, { method: 'POST', body: JSON.stringify(dayForm) });
      }
      await loadDays(selected.id);
      setEditingDay(null);
      setDayForm(EMPTY_DAY);
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  const duplicateDay = async day => {
    try {
      await api(`/api/admin/academia/retos/days/${day.id}/duplicate`, { method: 'POST' });
      await loadDays(selected.id);
    } catch (e) { setError(e.message); }
  };

  const deleteDay = async day => {
    if (!window.confirm(`¿Eliminar el día ${day.day_number}?`)) return;
    try {
      await api(`/api/admin/academia/retos/days/${day.id}`, { method: 'DELETE' });
      await loadDays(selected.id);
    } catch (e) { setError(e.message); }
  };

  const toggleDayStatus = async day => {
    try {
      await api(`/api/admin/academia/retos/days/${day.id}`, { method: 'PUT', body: JSON.stringify({ ...day, status: day.status === 'published' ? 'draft' : 'published' }) });
      await loadDays(selected.id);
    } catch (e) { setError(e.message); }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Lista de retos */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-navy-950">Retos ({challenges.length})</h2>
          <button
            type="button"
            onClick={() => { setSelected(null); setForm(EMPTY_CHALLENGE); setDays([]); setEditingDay(null); }}
            className="text-xs font-medium text-teal-600 hover:underline"
          >
            + Nuevo reto
          </button>
        </div>
        <div className="max-h-[60vh] space-y-1 overflow-y-auto">
          {challenges.map(challenge => (
            <button
              key={challenge.id}
              type="button"
              onClick={() => selectChallenge(challenge)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${selected?.id === challenge.id ? 'bg-teal-50 font-medium text-teal-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate">{challenge.title}</span>
                <span className="flex shrink-0 items-center gap-1.5">
                  {challenge.evergreen && <span className="rounded-full bg-[#f2ebf7] px-1.5 py-0.5 text-[9px] font-bold text-[#563a78]">evergreen</span>}
                  <span className={`h-2 w-2 rounded-full ${challenge.status === 'published' ? 'bg-green-400' : 'bg-gray-300'}`} />
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-gray-400">{challenge.day_count || 0} días · {challenge.member_count || 0} inscritas</p>
            </button>
          ))}
        </div>
      </div>

      {/* Formulario reto + días */}
      <div className="space-y-4 lg:col-span-2">
        {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <form onSubmit={saveChallenge} className="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="mb-3 text-sm font-bold text-navy-950">{selected ? `Editar reto: ${selected.title}` : 'Crear reto'}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Título *"><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputClass} /></Field>
            <Field label="Slug *"><input required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className={inputClass} placeholder="pilates-princess" /></Field>
            <div className="sm:col-span-2">
              <Field label="Tagline"><input value={form.tagline || ''} onChange={e => setForm({ ...form, tagline: e.target.value })} className={inputClass} /></Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Descripción"><textarea rows={2} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} /></Field>
            </div>
            <Field label="Portada (URL)"><input value={form.cover_image || ''} onChange={e => setForm({ ...form, cover_image: e.target.value })} className={inputClass} /></Field>
            <Field label="Instructora"><input value={form.instructor || ''} onChange={e => setForm({ ...form, instructor: e.target.value })} className={inputClass} /></Field>
            <Field label="Objetivo principal">
              <select value={form.primary_goal} onChange={e => setForm({ ...form, primary_goal: e.target.value })} className={inputClass}>
                {GOALS.map(goal => <option key={goal.id} value={goal.id}>{goal.label}</option>)}
              </select>
            </Field>
            <Field label="Categoría"><input value={form.category || ''} onChange={e => setForm({ ...form, category: e.target.value })} className={inputClass} placeholder="Pilates, Glúteos..." /></Field>
            <Field label="Nivel">
              <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} className={inputClass}>
                {LEVELS.map(level => <option key={level.id} value={level.id}>{level.label}</option>)}
              </select>
            </Field>
            <Field label="Equipamiento">
              <select value={form.equipment || ''} onChange={e => setForm({ ...form, equipment: e.target.value })} className={inputClass}>
                <option value="">—</option>
                {EQUIPMENT_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </Field>
            <Field label="Duración media"><input value={form.average_duration || ''} onChange={e => setForm({ ...form, average_duration: e.target.value })} className={inputClass} placeholder="20–30 min" /></Field>
            <Field label="Estado">
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={inputClass}>
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
                <option value="archived">Archivado</option>
              </select>
            </Field>
            <Field label="Inicio (semanal)"><input type="date" value={form.start_date || ''} onChange={e => setForm({ ...form, start_date: e.target.value })} className={inputClass} /></Field>
            <Field label="Fin (semanal)"><input type="date" value={form.end_date || ''} onChange={e => setForm({ ...form, end_date: e.target.value })} className={inputClass} /></Field>
            <Field label="Orden"><input type="number" value={form.sort_order || 0} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} className={inputClass} /></Field>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={form.evergreen} onChange={e => setForm({ ...form, evergreen: e.target.checked })} className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                Evergreen (inicia cualquier día)
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                Destacado (reto de la semana)
              </label>
            </div>
            <button type="submit" disabled={saving} className="rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-50">
              {saving ? 'Guardando...' : selected ? 'Guardar reto' : 'Crear reto'}
            </button>
          </div>
        </form>

        {/* Días */}
        {selected && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="mb-3 text-sm font-bold text-navy-950">Días del reto ({days.length})</h3>
            <div className="mb-4 space-y-2">
              {days.map(day => (
                <div key={day.id} className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-700">Día {day.day_number} · {day.title}</p>
                    <p className="truncate text-gray-400">
                      {day.youtube_video_id ? `Video: ${day.youtube_video_id}` : 'Sin video'} · {day.status === 'published' ? 'Publicado' : 'Borrador'}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button type="button" onClick={() => { setEditingDay(day); setDayForm(day); }} className="rounded-md px-2 py-1 text-teal-600 hover:bg-teal-50">editar</button>
                    <button type="button" onClick={() => duplicateDay(day)} className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100">duplicar</button>
                    <button type="button" onClick={() => toggleDayStatus(day)} className={`rounded-md px-2 py-1 ${day.status === 'published' ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`}>
                      {day.status === 'published' ? 'despublicar' : 'publicar'}
                    </button>
                    <button type="button" onClick={() => deleteDay(day)} className="rounded-md px-2 py-1 text-red-500 hover:bg-red-50">eliminar</button>
                  </div>
                </div>
              ))}
              {days.length === 0 && <p className="py-4 text-center text-xs text-gray-400">Aún no hay días. Crea el Día 1.</p>}
            </div>

            <form onSubmit={saveDay} className="border-t border-gray-100 pt-4">
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                {editingDay ? `Editar Día ${editingDay.day_number}` : 'Nuevo día'}
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Número de día *">
                  <input required type="number" min={1} max={30} value={dayForm.day_number} onChange={e => setDayForm({ ...dayForm, day_number: Number(e.target.value) })} className={inputClass} />
                </Field>
                <Field label="Título *"><input required value={dayForm.title} onChange={e => setDayForm({ ...dayForm, title: e.target.value })} className={inputClass} /></Field>
                <div className="sm:col-span-2">
                  <Field label="URL de YouTube (watch?v= o youtu.be/)">
                    <input value={dayForm.youtube_url || ''} onChange={e => setDayForm({ ...dayForm, youtube_url: e.target.value })} className={inputClass} placeholder="https://www.youtube.com/watch?v=..." />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Descripción"><textarea rows={2} value={dayForm.description || ''} onChange={e => setDayForm({ ...dayForm, description: e.target.value })} className={`${inputClass} resize-none`} /></Field>
                </div>
                <Field label="Instructora"><input value={dayForm.instructor || ''} onChange={e => setDayForm({ ...dayForm, instructor: e.target.value })} className={inputClass} /></Field>
                <Field label="Duración (minutos)"><input type="number" min={0} value={dayForm.duration_minutes || ''} onChange={e => setDayForm({ ...dayForm, duration_minutes: e.target.value === '' ? null : Number(e.target.value) })} className={inputClass} /></Field>
                <Field label="Dificultad">
                  <select value={dayForm.difficulty || ''} onChange={e => setDayForm({ ...dayForm, difficulty: e.target.value })} className={inputClass}>
                    <option value="">—</option>
                    {LEVELS.map(level => <option key={level.id} value={level.id}>{level.label}</option>)}
                  </select>
                </Field>
                <Field label="Equipamiento">
                  <select value={dayForm.equipment || ''} onChange={e => setDayForm({ ...dayForm, equipment: e.target.value })} className={inputClass}>
                    <option value="">—</option>
                    {EQUIPMENT_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                </Field>
                <Field label="Zona corporal">
                  <select value={dayForm.body_area || ''} onChange={e => setDayForm({ ...dayForm, body_area: e.target.value })} className={inputClass}>
                    <option value="">—</option>
                    {BODY_AREAS.map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                </Field>
                <Field label="Tipo de entrenamiento">
                  <select value={dayForm.training_type || ''} onChange={e => setDayForm({ ...dayForm, training_type: e.target.value })} className={inputClass}>
                    <option value="">—</option>
                    {TRAINING_TYPES.map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Microreto nutricional (editable)"><input value={dayForm.nutrition_challenge || ''} onChange={e => setDayForm({ ...dayForm, nutrition_challenge: e.target.value })} className={inputClass} placeholder="Ej: incluye una fuente de proteína en una comida principal" /></Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Nota educativa"><textarea rows={2} value={dayForm.educational_note || ''} onChange={e => setDayForm({ ...dayForm, educational_note: e.target.value })} className={`${inputClass} resize-none`} /></Field>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-4">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                    <input type="checkbox" checked={dayForm.low_impact} onChange={e => setDayForm({ ...dayForm, low_impact: e.target.checked })} className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                    Low impact
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                    <input type="checkbox" checked={dayForm.beginner_friendly} onChange={e => setDayForm({ ...dayForm, beginner_friendly: e.target.checked })} className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                    Beginner friendly
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                    <input type="checkbox" checked={dayForm.status === 'published'} onChange={e => setDayForm({ ...dayForm, status: e.target.checked ? 'published' : 'draft' })} className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                    Publicado
                  </label>
                </div>
                <div className="flex gap-2">
                  {editingDay && (
                    <button type="button" onClick={() => { setEditingDay(null); setDayForm(EMPTY_DAY); }} className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                      Cancelar
                    </button>
                  )}
                  <button type="submit" disabled={saving} className="rounded-full bg-[#563a78] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#452b65] disabled:opacity-50">
                    {saving ? 'Guardando...' : editingDay ? 'Guardar día' : 'Crear día'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
