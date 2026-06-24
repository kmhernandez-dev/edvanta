import { useState } from 'react';
import { apiUrl } from '../config/api';

/**
 * Formulario de captación de correos para los recursos gratis.
 * Envía los datos al endpoint /api/lead-capture (Resend).
 */
export default function LeadForm({ buttonText = 'Quiero los recursos gratis' }) {
  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | success | error
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setState('sending');
    try {
      const res = await fetch(apiUrl('/api/lead-capture'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setState('success');
      } else {
        setError(data.error || 'No se pudo registrar. Intenta de nuevo.');
        setState('error');
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
      setState('error');
    }
  };

  if (state === 'success') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl border border-teal-200 shadow-sm p-6 text-center">
        <div className="text-4xl mb-2">✅</div>
        <h3 className="font-semibold text-deepblue-900 mb-1">¡Listo! Revisa tu correo 📬</h3>
        <p className="text-sm text-gray-500">Te enviamos tus recursos gratis a <strong>{email}</strong>. Si no lo ves, revisa la carpeta de spam.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white rounded-2xl border border-sand-200 shadow-sm p-5 text-left">
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Tu nombre (opcional)"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-4 py-2.5 text-sm border border-sand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
        />
        <input
          type="email"
          required
          placeholder="Tu mejor correo"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-2.5 text-sm border border-sand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={state === 'sending'}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors disabled:opacity-70 disabled:cursor-wait"
        >
          {state === 'sending' ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Enviando...
            </>
          ) : buttonText}
        </button>
        <p className="text-[11px] text-gray-400 text-center">Sin spam. Puedes darte de baja cuando quieras.</p>
      </div>
    </form>
  );
}
