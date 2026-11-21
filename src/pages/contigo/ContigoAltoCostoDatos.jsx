/**
 * ContigoAltoCostoDatos.jsx — /contigo/alto-costo/mis-datos?t=TOKEN
 *
 * El titular revisa sus datos, cambia sus autorizaciones o pide la
 * supresión con el enlace personal que recibió por correo. Retirar la
 * autorización de datos sensibles borra la condición, el medicamento y
 * la EPS. La de datos personales no se retira aquí: para eso está la
 * supresión.
 */
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, Trash2 } from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb } from '../../components/edvanta/ui';
import { ContigoSection } from '../../components/contigo/ContigoPieces';
import { CONDICIONES_ALTO_COSTO, FINALIDADES_ALTO_COSTO } from '../../data/edvanta/contigoAltoCosto';
import { apiUrl } from '../../config/api';
import { updatePageSeo } from '../../utils/seo';

const nombreCondicion = (slug) => CONDICIONES_ALTO_COSTO.find((c) => c.slug === slug)?.nombre || '—';

export default function ContigoAltoCostoDatos() {
  const [params] = useSearchParams();
  const token = params.get('t') || '';
  const [datos, setDatos] = useState(null);
  const [autorizaciones, setAutorizaciones] = useState({});
  const [estado, setEstado] = useState({ cargando: true, error: '', aviso: '', suprimido: false });

  useEffect(() => {
    updatePageSeo({
      title: 'Mis datos en Contigo Alto Costo | Edvanta',
      description: 'Revisa tus datos, cambia tus autorizaciones o pide la eliminación de tus datos en Contigo Alto Costo.',
      canonical: 'https://edvanta.co/contigo/alto-costo/mis-datos',
      robots: 'noindex,nofollow',
    });
  }, []);

  useEffect(() => {
    let vivo = true;
    fetch(apiUrl(`/api/contigo/alto-costo/mis-datos?t=${encodeURIComponent(token)}`))
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (!vivo) return;
        if (!ok || !d.ok) throw new Error(d.error || 'El enlace no es válido.');
        setDatos(d.datos);
        setAutorizaciones(d.datos.autorizaciones);
        setEstado({ cargando: false, error: '', aviso: '', suprimido: false });
      })
      .catch((e) => { if (vivo) setEstado({ cargando: false, error: e.message, aviso: '', suprimido: false }); });
    return () => { vivo = false; };
  }, [token]);

  async function guardar() {
    const r = await fetch(apiUrl('/api/contigo/alto-costo/mis-datos'), {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ t: token, autorizaciones }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || !d.ok) return setEstado((e) => ({ ...e, error: d.error || 'No pudimos guardar los cambios.', aviso: '' }));
    setDatos(d.datos);
    setAutorizaciones(d.datos.autorizaciones);
    return setEstado((e) => ({ ...e, error: '', aviso: 'Guardamos tus autorizaciones.' }));
  }

  async function suprimir() {
    // eslint-disable-next-line no-alert
    if (!window.confirm('¿Eliminar tus datos de Contigo Alto Costo? Esta acción no se puede deshacer.')) return;
    const r = await fetch(apiUrl('/api/contigo/alto-costo/suprimir'), {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ t: token }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || !d.ok) return setEstado((e) => ({ ...e, error: d.error || 'No pudimos eliminar tus datos.' }));
    setDatos(null);
    return setEstado({ cargando: false, error: '', aviso: '', suprimido: true });
  }

  return (
    <div className="contigo-page min-h-screen bg-white">
      <SiteHeader />
      <main>
        <ContigoSection tone="white">
          <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Edvanta Contigo', to: '/contigo' }, { label: 'Alto costo', to: '/contigo/alto-costo' }, { label: 'Mis datos' }]} className="mb-8" />
          <h1 className="font-display text-3xl font-extrabold text-edvanta-blue">Mis datos y autorizaciones</h1>

          {estado.cargando && <p className="mt-6 text-[var(--contigo-muted)]">Cargando…</p>}
          {estado.suprimido && <p className="mt-6 rounded-2xl bg-[var(--contigo-mint)] p-4 font-semibold text-edvanta-deep" role="status">Eliminamos tus datos. Gracias por haber sido parte del programa.</p>}
          {estado.error && <p className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800" role="alert">{estado.error}</p>}

          {datos && (
            <div className="mt-8 grid max-w-4xl gap-8 lg:grid-cols-2">
              <div className="rounded-3xl border border-[var(--contigo-border)] p-5">
                <h2 className="font-display text-lg font-extrabold text-edvanta-deep">Lo que guardamos</h2>
                <dl className="mt-4 space-y-2 text-sm">
                  {[
                    ['Nombre', datos.nombre], ['Correo', datos.email], ['Celular', datos.celular || '—'],
                    ['Departamento', datos.departamento || '—'], ['Me registré como', datos.rol],
                    ['Condición', datos.condicion ? nombreCondicion(datos.condicion) : '—'],
                    ['Medicamento', datos.medicamento || '—'], ['EPS', datos.eps || '—'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 border-b border-[var(--contigo-border)] pb-2">
                      <dt className="text-[var(--contigo-muted)]">{k}</dt><dd className="text-right font-semibold text-edvanta-deep">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="rounded-3xl border border-[var(--contigo-border)] p-5">
                <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-edvanta-deep">
                  <ShieldCheck className="h-5 w-5 text-[var(--contigo-primary)]" aria-hidden="true" /> Mis autorizaciones
                </h2>
                <div className="mt-4 space-y-3">
                  {FINALIDADES_ALTO_COSTO.filter((a) => a.slug !== 'datos_personales').map((a) => (
                    <label key={a.slug} className="flex cursor-pointer gap-3 text-sm leading-6">
                      <input type="checkbox" className="mt-1 h-4 w-4 accent-[var(--contigo-primary)]" checked={Boolean(autorizaciones[a.slug])} onChange={(e) => setAutorizaciones((p) => ({ ...p, [a.slug]: e.target.checked }))} />
                      <span><span className="block font-bold text-edvanta-deep">{a.titulo}</span><span className="text-[var(--contigo-muted)]">{a.texto}</span></span>
                    </label>
                  ))}
                </div>
                <p className="mt-3 text-xs leading-5 text-[var(--contigo-muted)]">Si retiras la autorización de datos sensibles, borraremos tu condición, tu medicamento y tu EPS.</p>
                <button type="button" onClick={guardar} className="mt-4 rounded-full bg-[var(--contigo-primary)] px-5 py-2.5 text-sm font-bold text-white hover:bg-[var(--contigo-primary-strong)]">Guardar cambios</button>
                {estado.aviso && <p className="mt-3 text-sm font-semibold text-[var(--contigo-primary)]" role="status">{estado.aviso}</p>}
              </div>
              <div className="lg:col-span-2">
                <button type="button" onClick={suprimir} className="inline-flex items-center gap-2 rounded-full border border-red-300 px-5 py-2.5 text-sm font-bold text-red-700 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" aria-hidden="true" /> Eliminar todos mis datos
                </button>
              </div>
            </div>
          )}
        </ContigoSection>
      </main>
      <SiteFooter />
    </div>
  );
}
