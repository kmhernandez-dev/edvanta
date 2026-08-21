import { useEffect, useRef, useState } from 'react';
import Icon from '../../Icon';
import { FORM_ENDPOINT, PRIVACY_POLICY_URL, FREE_RESOURCE_URL } from '../../../config/fst';
import { trackEvent } from '../../../utils/analytics';
import { trackLeadEvent } from '../../../lib/leadEvents';

const LEAD_SESSION_KEY = 'fst-lead-requested';

/**
 * Formulario de captación de 2 campos (nombre + correo).
 * - magnet: { name, slug, cta, note } (esquema fstLandings) o
 *           { title, resource, cta, summary } (esquema legacy).
 * - related: { name, url, cta } — transición comercial ética tras el registro
 */
export default function FstLandingLeadForm({ magnet, related, formId = 'lead', onSuccess }) {
  const title = magnet.title || magnet.name;
  const resource = magnet.resource || magnet.slug;
  const summary = magnet.summary || magnet.note;
  const cta = magnet.cta;
  const [form, setForm] = useState({ name: '', email: '', consent: false });
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const formRef = useRef(null);

  useEffect(() => {
    const node = formRef.current;
    if (!node || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        trackEvent('lead_form_view', { form: formId });
        observer.disconnect();
      }
    }, { threshold: 0.4 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [formId]);

  const submit = async (event) => {
    event.preventDefault();
    setStatus('sending');
    setMessage('');

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          consent: form.consent,
          interest: 'recursos-gratuitos',
          resource,
          source: 'fst_landing',
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.ok === false) {
        throw new Error(data.error || 'No pudimos completar el registro. Intenta de nuevo.');
      }

      setStatus('success');
      sessionStorage.setItem(LEAD_SESSION_KEY, '1');
      trackEvent('lead_form_submit', { form: formId, resource });
      trackEvent('free_resource_download', { resource });
      trackLeadEvent('free_guide_requested', {
        email: form.email,
        resourceSlug: resource,
        resourceName: title,
      });
      onSuccess?.();
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Ocurrió un error de conexión. Intenta de nuevo.');
    }
  };

  if (status === 'success') {
    return (
      <div ref={formRef} role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-left sm:p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white">
          <Icon name="checkCircle" className="h-6 w-6" />
        </span>
        <h3 className="mt-4 text-2xl font-semibold text-[#132e55]">Tu recurso está en camino.</h3>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Revisa <strong>{form.email}</strong> (incluida la carpeta de correo no deseado). Te enviamos el enlace de descarga al instante.
        </p>
        <a
          href={FREE_RESOURCE_URL}
          onClick={() => { trackEvent('free_resource_open', { form: formId }); }}
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#563a78] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#452b65]"
        >
          Abrir y descargar mi recurso ahora
          <Icon name="arrowRight" className="h-4 w-4" />
        </a>
        {related && (
          <div className="mt-6 rounded-xl border border-[#e5dceb] bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[#76539a]">Mientras lo recibes, esto puede ayudarte a dar el siguiente paso</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#132e55]">{related.name}</p>
            <a
              href={related.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { trackEvent('related_product_click', { product: related.name, form: formId }); }}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0A2540] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#123b5f]"
            >
              {related.cta}
              <Icon name="arrowRight" className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} className="rounded-2xl border border-[#e2d9eb] bg-white p-5 text-left shadow-lg shadow-[#0A2540]/5 sm:p-7">
      <label className="block text-sm font-medium text-[#132e55]">
        Nombre
        <input
          required
          autoComplete="name"
          value={form.name}
          onChange={event => setForm(f => ({ ...f, name: event.target.value }))}
          className="mt-1.5 min-h-12 w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-base font-normal text-gray-800 outline-none focus:border-[#74519b] focus:ring-2 focus:ring-[#d9c7ea]"
        />
      </label>
      <label className="mt-4 block text-sm font-medium text-[#132e55]">
        Correo electrónico
        <input
          required
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={event => setForm(f => ({ ...f, email: event.target.value }))}
          className="mt-1.5 min-h-12 w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-base font-normal text-gray-800 outline-none focus:border-[#74519b] focus:ring-2 focus:ring-[#d9c7ea]"
        />
      </label>

      <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg bg-[#faf8fc] p-3 text-xs leading-5 text-gray-600">
        <input
          required
          type="checkbox"
          checked={form.consent}
          onChange={event => setForm(f => ({ ...f, consent: event.target.checked }))}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#563a78] focus:ring-[#74519b]"
        />
        <span>
          Autorizo el tratamiento de mis datos para recibir el recurso solicitado y comunicaciones educativas de Feliz Sin Tiroides. Consulta la{' '}
          <a href={PRIVACY_POLICY_URL} className="font-semibold text-[#563a78] underline underline-offset-2">política de privacidad</a>.
        </span>
      </label>

      {message && <p role="alert" className="mt-3 text-sm text-red-700">{message}</p>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-5 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#563a78] px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#452b65] disabled:cursor-wait disabled:opacity-70"
      >
        {status === 'sending' ? 'Preparando tu recurso...' : cta}
        {status !== 'sending' && <Icon name="arrowRight" className="h-4 w-4" />}
      </button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-gray-500">
        <Icon name="lock" className="h-3.5 w-3.5" />
        Tus datos no se venden. Puedes darte de baja cuando quieras.
      </p>
    </form>
  );
}
