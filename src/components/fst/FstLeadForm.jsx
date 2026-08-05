import { useEffect, useRef, useState } from 'react';
import Icon from '../Icon';
import { FORM_ENDPOINT, FREE_RESOURCE_URL, PRIVACY_POLICY_URL, THANK_YOU_PAGE_URL } from '../../config/fst';
import { getAttribution, trackEvent } from '../../utils/analytics';

const interestOptions = [
  ['hipotiroidismo', 'Hipotiroidismo'],
  ['tiroidectomia', 'Vivir sin tiroides / tiroidectomía'],
  ['cancer-tiroides', 'Cáncer de tiroides'],
  ['levotiroxina', 'Levotiroxina e interacciones'],
  ['alimentacion', 'Alimentación y bienestar'],
  ['examenes', 'Exámenes y seguimiento'],
  ['yodoterapia', 'Yodoterapia I-131'],
  ['bienestar', 'Bienestar emocional y organización'],
];

export default function FstLeadForm({ selectedInterest = '', recommendation = '', compact = false }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    country: '',
    interest: selectedInterest,
    whatsapp: '',
    consent: false,
  });
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [started, setStarted] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (selectedInterest) {
      setForm(current => ({ ...current, interest: selectedInterest }));
    }
  }, [selectedInterest]);

  useEffect(() => {
    const node = formRef.current;
    if (!node || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        trackEvent('lead_form_view', { form: 'checklist_levotiroxina' });
        observer.disconnect();
      }
    }, { threshold: 0.4 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const update = (field, value) => setForm(current => ({ ...current, [field]: value }));

  const markStarted = () => {
    if (started) return;
    setStarted(true);
    trackEvent('lead_form_start', { form: 'checklist_levotiroxina' });
  };

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
          recommendation,
          resource: 'guia-como-tomar-levotiroxina',
          ...getAttribution(),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.ok === false) {
        throw new Error(data.error || 'No pudimos completar el registro. Intenta de nuevo.');
      }

      setStatus('success');
      trackEvent('lead_form_submit', { interest: form.interest, form: 'checklist_levotiroxina' });
      trackEvent('free_resource_download', { resource: 'checklist_levotiroxina' });
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Ocurrió un error de conexión. Intenta de nuevo.');
    }
  };

  if (status === 'success') {
    return (
      <div ref={formRef} role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-left">
        <Icon name="checkCircle" className="h-8 w-8 text-emerald-700" />
        <h3 className="mt-3 text-xl font-semibold text-deepblue-900">Tu recurso está listo</h3>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Ábrelo ahora para leerlo y descargar el PDF al instante. También enviamos el acceso a <strong>{form.email}</strong>; revisa la carpeta de correo no deseado si no lo encuentras.
        </p>
        <a
          href={THANK_YOU_PAGE_URL || FREE_RESOURCE_URL}
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#563a78] px-5 py-3 text-sm font-semibold text-white hover:bg-[#452b65]"
        >
          Abrir y descargar mi PDF gratis
          <Icon name="arrowRight" className="h-4 w-4" />
        </a>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      onFocusCapture={markStarted}
      className={`rounded-lg border border-[#e2d9eb] bg-white text-left shadow-sm ${compact ? 'p-4' : 'p-5 sm:p-6'}`}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-deepblue-900">
          Nombre
          <input
            required
            autoComplete="name"
            value={form.name}
            onChange={event => update('name', event.target.value)}
            className="mt-1.5 min-h-11 w-full rounded-md border border-gray-300 px-3 py-2.5 text-base font-normal text-gray-800 outline-none focus:border-[#74519b] focus:ring-2 focus:ring-[#d9c7ea]"
          />
        </label>
        <label className="text-sm font-medium text-deepblue-900">
          Correo electrónico
          <input
            required
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={event => update('email', event.target.value)}
            className="mt-1.5 min-h-11 w-full rounded-md border border-gray-300 px-3 py-2.5 text-base font-normal text-gray-800 outline-none focus:border-[#74519b] focus:ring-2 focus:ring-[#d9c7ea]"
          />
        </label>
        <label className="text-sm font-medium text-deepblue-900">
          País
          <input
            required
            autoComplete="country-name"
            value={form.country}
            onChange={event => update('country', event.target.value)}
            className="mt-1.5 min-h-11 w-full rounded-md border border-gray-300 px-3 py-2.5 text-base font-normal text-gray-800 outline-none focus:border-[#74519b] focus:ring-2 focus:ring-[#d9c7ea]"
          />
        </label>
        <label className="text-sm font-medium text-deepblue-900">
          Principal interés
          <select
            required
            value={form.interest}
            onChange={event => update('interest', event.target.value)}
            className="mt-1.5 min-h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-base font-normal text-gray-800 outline-none focus:border-[#74519b] focus:ring-2 focus:ring-[#d9c7ea]"
          >
            <option value="">Selecciona una opción</option>
            {interestOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-deepblue-900 sm:col-span-2">
          WhatsApp <span className="font-normal text-gray-500">(opcional)</span>
          <input
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="Incluye el código de país"
            value={form.whatsapp}
            onChange={event => update('whatsapp', event.target.value)}
            className="mt-1.5 min-h-11 w-full rounded-md border border-gray-300 px-3 py-2.5 text-base font-normal text-gray-800 outline-none focus:border-[#74519b] focus:ring-2 focus:ring-[#d9c7ea]"
          />
        </label>
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-md bg-[#faf8fc] p-3 text-sm leading-5 text-gray-600">
        <input
          required
          type="checkbox"
          checked={form.consent}
          onChange={event => update('consent', event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-[#563a78] focus:ring-[#74519b]"
        />
        <span>
          He leído y autorizo el tratamiento de mis datos para recibir el recurso solicitado y comunicaciones educativas de Feliz Sin Tiroides. Consulta la{' '}
          <a href={PRIVACY_POLICY_URL} className="font-semibold text-[#563a78] underline underline-offset-2">política de privacidad</a>.
        </span>
      </label>

      {message && <p role="alert" className="mt-3 text-sm text-red-700">{message}</p>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-[#563a78] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#452b65] disabled:cursor-wait disabled:opacity-70"
      >
        {status === 'sending' ? 'Preparando tu recurso...' : 'Recibir mi guía gratuita'}
        {status !== 'sending' && <Icon name="arrowRight" className="h-4 w-4" />}
      </button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-gray-500">
        <Icon name="lock" className="h-3.5 w-3.5" />
        Tus datos no se venden. Puedes darte de baja cuando quieras.
      </p>
    </form>
  );
}
