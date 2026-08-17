import { useState } from 'react';
import Icon from '../Icon';
import { FORM_ENDPOINT, PRIVACY_POLICY_URL } from '../../config/fst';
import { getAttribution, trackEvent } from '../../utils/analytics';
import { trackLeadEvent } from '../../lib/leadEvents';

const interestOptions = [
  ['tiroides', 'Tiroides y endocrinología'],
  ['farmacologia', 'Farmacología'],
  ['nutricion', 'Nutrición'],
  ['autocuidado', 'Autocuidado y bienestar'],
  ['profesional', 'Soy profesional de la salud'],
];

export default function FstAcademyLeadForm() {
  const [form, setForm] = useState({ name: '', email: '', interest: '' });
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const update = (field, value) => setForm(current => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setStatus('sending');
    setMessage('');

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...form,
          consent: true,
          resource: 'academy-aviso-cursos',
          source: 'fst_academy',
          ...getAttribution(),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.ok === false) {
        throw new Error(data.error || 'No pudimos completar el registro. Intenta de nuevo.');
      }

      setStatus('success');
      trackEvent('lead_form_submit', { interest: form.interest, form: 'academy_aviso' });
      trackLeadEvent('academy_lead_created', {
        email: form.email,
        resourceSlug: 'academy-aviso-cursos',
        resourceName: 'Aviso de nuevos cursos',
        source: 'fst_academy',
      });
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Ocurrió un error de conexión. Intenta de nuevo.');
    }
  };

  if (status === 'success') {
    return (
      <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-left">
        <Icon name="checkCircle" className="h-7 w-7 text-emerald-700" />
        <h3 className="mt-2 text-lg font-semibold text-deepblue-900">Listo, te avisaremos</h3>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Te escribiremos a <strong>{form.email}</strong> cuando haya nuevos cursos en Feliz Sin Tiroides Academy.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-white/20 bg-white/5 p-5 text-left">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium text-white">
          Nombre
          <input
            required
            autoComplete="name"
            value={form.name}
            onChange={event => update('name', event.target.value)}
            className="mt-1.5 min-h-11 w-full rounded-md border border-white/25 bg-white/10 px-3 py-2.5 text-base font-normal text-white outline-none placeholder:text-white/40 focus:border-[#d8c5e8] focus:ring-2 focus:ring-[#d8c5e8]/30"
          />
        </label>
        <label className="text-sm font-medium text-white">
          Correo electrónico
          <input
            required
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={event => update('email', event.target.value)}
            className="mt-1.5 min-h-11 w-full rounded-md border border-white/25 bg-white/10 px-3 py-2.5 text-base font-normal text-white outline-none placeholder:text-white/40 focus:border-[#d8c5e8] focus:ring-2 focus:ring-[#d8c5e8]/30"
          />
        </label>
        <label className="text-sm font-medium text-white sm:col-span-2">
          Interés principal
          <select
            required
            value={form.interest}
            onChange={event => update('interest', event.target.value)}
            className="mt-1.5 min-h-11 w-full rounded-md border border-white/25 bg-white/10 px-3 py-2.5 text-base font-normal text-white outline-none focus:border-[#d8c5e8] focus:ring-2 focus:ring-[#d8c5e8]/30"
          >
            <option value="" className="text-gray-800">Selecciona una opción</option>
            {interestOptions.map(([value, label]) => <option key={value} value={value} className="text-gray-800">{label}</option>)}
          </select>
        </label>
      </div>

      <p className="mt-3 text-xs leading-5 text-white/60">
        Al enviar autorizas el tratamiento de tus datos para recibir avisos educativos. Consulta la{' '}
        <a href={PRIVACY_POLICY_URL} className="font-semibold text-[#d8c5e8] underline underline-offset-2">política de privacidad</a>.
      </p>

      {message && <p role="alert" className="mt-3 text-sm text-rose-300">{message}</p>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-[#132e55] transition-colors hover:bg-[#f2ebf7] disabled:cursor-wait disabled:opacity-70"
      >
        {status === 'sending' ? 'Guardando...' : 'Avísame de nuevos cursos'}
        {status !== 'sending' && <Icon name="arrowRight" className="h-4 w-4" />}
      </button>
    </form>
  );
}
