/**
 * Subrayar y tomar notas sobre un artículo. Se guarda solo en este
 * navegador (localStorage): es una comodidad, no un dato de la persona.
 */
import { useCallback, useState } from 'react';

export default function StudyTools({ slug }) {
  const [highlights, setHighlights] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`hl_${slug}`) || '[]'); } catch { return []; }
  });
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`notes_${slug}`) || '[]'); } catch { return []; }
  });
  const [noteText, setNoteText] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);

  const toggleHighlight = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const text = sel.toString().trim();
    if (!text) return;
    const exists = highlights.find(h => h.text === text);
    let updated;
    if (exists) {
      updated = highlights.filter(h => h.text !== text);
    } else {
      updated = [...highlights, { text, date: new Date().toISOString() }];
    }
    setHighlights(updated);
    localStorage.setItem(`hl_${slug}`, JSON.stringify(updated));
    sel.removeAllRanges();
  }, [highlights, slug]);

  const addNote = () => {
    if (!noteText.trim()) return;
    const updated = [...notes, { text: noteText.trim(), date: new Date().toISOString() }];
    setNotes(updated);
    localStorage.setItem(`notes_${slug}`, JSON.stringify(updated));
    setNoteText('');
  };

  const removeNote = (i) => {
    const updated = notes.filter((_, idx) => idx !== i);
    setNotes(updated);
    localStorage.setItem(`notes_${slug}`, JSON.stringify(updated));
  };

  const removeHighlight = (i) => {
    const updated = highlights.filter((_, idx) => idx !== i);
    setHighlights(updated);
    localStorage.setItem(`hl_${slug}`, JSON.stringify(updated));
  };

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={toggleHighlight}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-edvanta-light hover:bg-edvanta-soft text-edvanta-blue text-xs font-semibold rounded-full border border-edvanta-border transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Subrayar selección
        </button>
        <button
          onClick={() => setShowHighlights(!showHighlights)}
          className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full border transition-colors ${
            showHighlights ? 'bg-edvanta-light text-edvanta-blue border-edvanta-blue/40' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          📌 Subrayado ({highlights.length})
        </button>
        <button
          onClick={() => setShowNotes(!showNotes)}
          className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full border transition-colors ${
            showNotes ? 'bg-teal-100 text-teal-700 border-teal-300' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          📝 Notas ({notes.length})
        </button>
      </div>

      {showHighlights && (
        <div className="mb-4 p-4 bg-amber-50 rounded-2xl border border-amber-200">
          <h3 className="text-sm font-bold text-edvanta-blue mb-2">Tus subrayados</h3>
          {highlights.length === 0 ? (
            <p className="text-xs text-amber-600">Selecciona texto en el artículo y haz clic en "Subrayar selección".</p>
          ) : (
            <ul className="space-y-2">
              {highlights.map((h, i) => (
                <li key={i} className="flex items-start justify-between gap-2 text-sm text-amber-900 bg-edvanta-light/50 rounded-lg p-2">
                  <span className="flex-1">"{h.text.substring(0, 150)}{h.text.length > 150 ? '...' : ''}"</span>
                  <button onClick={() => removeHighlight(i)} className="text-amber-400 hover:text-red-500 shrink-0 text-xs">✕</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {showNotes && (
        <div className="mb-4 p-4 bg-teal-50 rounded-2xl border border-teal-200">
          <h3 className="text-sm font-bold text-teal-800 mb-2">Tus notas de estudio</h3>
          <div className="flex gap-2 mb-3">
            <input
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addNote()}
              placeholder="Escribe una nota o apunte..."
              className="flex-1 rounded-xl border border-teal-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
            <button onClick={addNote} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition-colors">
              Guardar
            </button>
          </div>
          {notes.length === 0 ? (
            <p className="text-xs text-teal-600">Tus apuntes aparecerán aquí. Se guardan en tu navegador.</p>
          ) : (
            <ul className="space-y-2">
              {notes.map((n, i) => (
                <li key={i} className="flex items-start justify-between gap-2 text-sm text-teal-900 bg-white rounded-lg p-2.5 border border-teal-100">
                  <div className="flex-1">
                    <p>{n.text}</p>
                    <p className="text-[10px] text-teal-400 mt-1">{new Date(n.date).toLocaleString('es-CO')}</p>
                  </div>
                  <button onClick={() => removeNote(i)} className="text-teal-400 hover:text-red-500 shrink-0 text-xs">✕</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
