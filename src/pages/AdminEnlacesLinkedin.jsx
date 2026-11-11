/**
 * ============================================================
 *  AdminEnlacesLinkedin.jsx — /admin/enlaces-linkedin
 *
 *  Generador de enlaces para las publicaciones de LinkedIn: eliges la
 *  página (/unete/…), el área y el nombre de la publicación, y sale el
 *  enlace listo para pegar. El nombre de la publicación viaja como
 *  utm_campaign: así el CRM dice qué publicación trajo a cada persona.
 * ============================================================
 */

import { useEffect, useMemo, useState } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { UNETE, enlaceDeCampana } from '../data/embudoLinkedin';
import { updatePageSeo } from '../utils/seo';

const NOMBRES = {
  profesionales: 'Profesionales (cursos y guías)', cursos: 'Cursos gratis', guias: 'Guías', pacientes: 'Pacientes', instituciones: 'Instituciones', asesorias: 'Asesorías',
};

function Copiar({ texto }) {
  const [hecho, setHecho] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => { try { await navigator.clipboard.writeText(texto); setHecho(true); setTimeout(() => setHecho(false), 1600); } catch { /* sin portapapeles */ } }}
      className="ed-btn ed-btn--secondary ed-btn--sm"
    >
      {hecho ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      {hecho ? 'Copiado' : 'Copiar'}
    </button>
  );
}

export default function AdminEnlacesLinkedin() {
  const [publico, setPublico] = useState('cursos');
  const [area, setArea] = useState('calidad');
  const [campana, setCampana] = useState('');
  useEffect(() => updatePageSeo({ title: 'Enlaces para LinkedIn | Edvanta', description: 'Generador de enlaces de campaña.', canonical: 'https://edvanta.co/admin/enlaces-linkedin', robots: 'noindex,nofollow' }), []);

  const conf = UNETE[publico];
  const areaValida = conf.areas.some((a) => a.clave === area) ? area : '';
  const enlace = useMemo(() => enlaceDeCampana({ publico, area: areaValida, campana }), [publico, areaValida, campana]);
  const campo = 'mt-1.5 h-11 w-full rounded-[10px] border border-edvanta-border bg-white px-3 text-[15px] text-edvanta-deep outline-none focus:border-edvanta-teal focus:ring-4 focus:ring-edvanta-teal/15';

  return (
    <main className="min-h-screen bg-edvanta-bg px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-edvanta-tealdark">Embudo · LinkedIn</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-edvanta-deep">Enlaces para tus publicaciones</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-7 text-edvanta-muted">Publica en LinkedIn, pide que comenten y responde con este enlace. Cada registro llega al CRM con la publicación que lo trajo.</p>

        <section className="mt-8 rounded-[20px] border border-edvanta-border bg-white p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-[13px] font-semibold text-edvanta-deep">Página
              <select value={publico} onChange={(e) => setPublico(e.target.value)} className={campo}>
                {Object.keys(UNETE).map((k) => <option key={k} value={k}>{NOMBRES[k]}</option>)}
              </select>
            </label>
            <label className="block text-[13px] font-semibold text-edvanta-deep">Área (opcional)
              <select value={areaValida} onChange={(e) => setArea(e.target.value)} className={campo}>
                <option value="">Sin área marcada</option>
                {conf.areas.map((a) => <option key={a.clave} value={a.clave}>{a.nombre}</option>)}
              </select>
            </label>
            <label className="block text-[13px] font-semibold text-edvanta-deep">Nombre de la publicación
              <input value={campana} onChange={(e) => setCampana(e.target.value)} placeholder="post calidad 12 nov" className={campo} />
            </label>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-[14px] bg-edvanta-bg p-4">
            <code className="min-w-0 flex-1 break-all text-[13px] text-edvanta-deep">{enlace}</code>
            <Copiar texto={enlace} />
            <a href={enlace} target="_blank" rel="noopener noreferrer" className="ed-btn ed-btn--ghost ed-btn--sm"><ExternalLink className="h-4 w-4" aria-hidden="true" /> Abrir</a>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-xl font-bold text-edvanta-deep">Enlaces listos por página</h2>
          <div className="mt-4 space-y-3">
            {Object.keys(UNETE).map((k) => {
              const url = enlaceDeCampana({ publico: k });
              return (
                <div key={k} className="flex flex-wrap items-center gap-3 rounded-[14px] border border-edvanta-border bg-white p-4">
                  <span className="w-48 shrink-0 text-[14px] font-semibold text-edvanta-deep">{NOMBRES[k]}</span>
                  <code className="min-w-0 flex-1 break-all text-[13px] text-edvanta-muted">{url}</code>
                  <Copiar texto={url} />
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
