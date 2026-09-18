/**
 * ============================================================
 *  vacantes.jsx — Publicar una vacante en el banco de la comunidad
 *
 *  Lo usan la landing de reclutamiento (/empresas/talento) y el
 *  centro de empleo (/empleo). Publica en /api/community/jobs y,
 *  si no hay conexión, guarda la oferta en este navegador para no
 *  perder lo escrito.
 * ============================================================
 */

import { useState } from 'react';
import { Send } from 'lucide-react';
import { apiUrl } from '../../config/api';

const VACIO = { cargo: '', empresa: '', ciudad: '', modalidad: 'Presencial', contacto: '', requisitos: '' };
const MODALIDADES = { presencial: 'onsite', hibrido: 'hybrid', híbrido: 'hybrid', remoto: 'remote' };

const GUARDADAS = 'edvanta_vacantes_comunidad';

function guardarLocal(oferta) {
  try {
    const previas = JSON.parse(localStorage.getItem(GUARDADAS) || '[]');
    localStorage.setItem(GUARDADAS, JSON.stringify([oferta, ...previas]));
  } catch { /* almacenamiento no disponible */ }
}

export default function PublicarVacanteForm({ onPublicada, compacto = false }) {
  const [form, setForm] = useState(VACIO);
  const [enviando, setEnviando] = useState(false);
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(false);

  const set = (k) => (e) => setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const enviar = async (event) => {
    event.preventDefault();
    if (!form.cargo.trim() || !form.contacto.trim()) {
      setOk(false);
      setMsg('Escribe al menos el cargo y el correo o enlace de contacto.');
      return;
    }
    setEnviando(true);
    setMsg('');

    const payload = {
      cargo: form.cargo.trim(),
      empresa: form.empresa.trim(),
      ciudad: form.ciudad.trim(),
      modalidad: MODALIDADES[form.modalidad.toLowerCase()] || 'onsite',
      requisitos: form.requisitos.trim(),
      contacto: form.contacto.trim(),
    };
    const nueva = {
      id: `comunidad-${Date.now()}`,
      cargo: payload.cargo,
      empresa: payload.empresa || 'Empresa de la comunidad',
      ciudad: payload.ciudad || 'Colombia',
      modalidad: form.modalidad,
      requisitos: payload.requisitos,
      contacto: payload.contacto,
      fuente: 'Comunidad Edvanta',
      fecha: new Date().toISOString().slice(0, 10),
    };

    try {
      const res = await fetch(apiUrl('/api/community/jobs'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 429) {
        guardarLocal(nueva);
        onPublicada?.(nueva);
        setOk(false);
        setMsg(`Límite de publicaciones alcanzado: ${data.error || 'intenta de nuevo en unos minutos.'} La guardamos en este navegador.`);
      } else if (res.ok && data.ok) {
        onPublicada?.(nueva);
        setForm(VACIO);
        setOk(true);
        setMsg('¡Gracias! Tu vacante quedó publicada en el banco y ya puede recibir postulaciones.');
      } else {
        throw new Error(data.error || 'fallo');
      }
    } catch {
      guardarLocal(nueva);
      onPublicada?.(nueva);
      setForm(VACIO);
      setOk(false);
      setMsg('Sin conexión: la vacante se guardó en este navegador y la sincronizaremos cuando vuelva la conexión.');
    }
    setEnviando(false);
  };

  const input = 'min-h-11 w-full rounded-xl border border-edvanta-border px-3.5 text-sm outline-none transition focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/15';
  const label = 'mb-1 block text-sm font-bold text-edvanta-deep';

  return (
    <form onSubmit={enviar} className={compacto ? '' : 'rounded-2xl border border-edvanta-border bg-white p-6 shadow-[0_1px_2px_rgba(23,34,59,.04)]'}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className={label}>Cargo *</span>
          <input value={form.cargo} onChange={set('cargo')} placeholder="Ej. Químico farmacéutico — asuntos regulatorios" className={input} />
        </label>
        <label className="block">
          <span className={label}>Empresa</span>
          <input value={form.empresa} onChange={set('empresa')} placeholder="Nombre de la empresa" className={input} />
        </label>
        <label className="block">
          <span className={label}>Ciudad</span>
          <input value={form.ciudad} onChange={set('ciudad')} placeholder="Ej. Barranquilla" className={input} />
        </label>
        <label className="block">
          <span className={label}>Modalidad</span>
          <select value={form.modalidad} onChange={set('modalidad')} className={input}>
            <option>Presencial</option>
            <option>Híbrido</option>
            <option>Remoto</option>
          </select>
        </label>
        <label className="block">
          <span className={label}>Contacto *</span>
          <input value={form.contacto} onChange={set('contacto')} placeholder="Correo, enlace de la oferta o WhatsApp" className={input} />
        </label>
        <label className="block sm:col-span-2">
          <span className={label}>Requisitos y condiciones</span>
          <textarea
            value={form.requisitos}
            onChange={set('requisitos')}
            rows={4}
            placeholder="Experiencia, funciones, salario y horario. Entre más claro, mejores postulaciones."
            className="w-full rounded-xl border border-edvanta-border p-3.5 text-sm outline-none transition focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/15"
          />
        </label>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={enviando}
          className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-edvanta-blue px-6 text-[15px] font-semibold text-white transition hover:bg-edvanta-bluedark disabled:opacity-60"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {enviando ? 'Publicando…' : 'Publicar la vacante'}
        </button>
        <p className="text-xs text-edvanta-muted">Es gratis. Se publica con la plantilla estándar del banco de vacantes.</p>
      </div>
      {msg && (
        <div className={`mt-4 rounded-xl border p-4 text-sm leading-6 ${ok ? 'border-edvanta-mint bg-edvanta-mint/40 text-edvanta-tealdark' : 'border-amber-200 bg-amber-50 text-amber-900'}`} role="status">
          {msg}
        </div>
      )}
    </form>
  );
}
