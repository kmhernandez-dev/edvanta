/**
 * ============================================================
 *  AdminDesign.jsx — Edvanta Design  ·  /admin/design
 *
 *  Un solo panel para los cursos de Edvanta, que viven en dos
 *  sitios distintos y hasta ahora se administraban por separado:
 *
 *   · Curado  → el contenido es de otra plataforma (Coursera,
 *               Udemy, Edutin, YouTube). Se guarda el enlace y la
 *               portada. Publicar es pegar una URL.
 *   · Propio  → el contenido vive en el Aula: unidades, clases,
 *               video y texto de apoyo debajo.
 *
 *  Por eso el formulario cambia según el tipo: pedirle unidades a
 *  un curso curado no tiene sentido, y pedirle una URL de afiliado
 *  a uno propio tampoco.
 *
 *  Protegido con ADMIN_TOKEN, igual que el resto de los paneles.
 * ============================================================
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpenCheck, ExternalLink, GraduationCap, Image as ImageIcon, Layers, Link2,
  Plus, RefreshCw, Search, Trash2, Video, X,
} from 'lucide-react';
import { apiUrl } from '../config/api';
import { updatePageSeo } from '../utils/seo';

const TOKEN_KEY = 'edvanta_admin_token';
const NIVELES = [['', 'Sin nivel'], ['basico', 'Básico'], ['intermedio', 'Intermedio'], ['avanzado', 'Avanzado']];
const PROVEEDORES = ['youtube', 'edutin', 'coursera', 'udemy', 'otro'];

/* ── Piezas ───────────────────────────────────────────────── */

function Campo({ label, hint, children, requerido = false }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">
        {label} {requerido && <span className="text-rose-600">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1 text-xs leading-5 text-slate-500">{hint}</p>}
    </label>
  );
}

const entrada = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20';

function Portada({ url }) {
  if (!url) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50">
        <ImageIcon className="h-6 w-6 text-slate-400" aria-hidden="true" />
      </div>
    );
  }
  return (
    <img
      src={url}
      alt=""
      className="aspect-video w-full rounded-lg border border-slate-200 object-cover"
      onError={(e) => { e.currentTarget.style.opacity = '0.25'; }}
    />
  );
}

/* ── Formulario de curso curado ───────────────────────────── */

function FormCurado({ api, onListo, onCancelar }) {
  const [f, setF] = useState({
    title: '', provider: 'youtube', original_url: '', image_url: '', short_description: '',
    category: '', level: '', duration: '', instructor: '', affiliate_url: '', active: true,
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const guardar = async (e) => {
    e.preventDefault();
    setError(''); setGuardando(true);
    try {
      await api('/api/admin/design/curated', { method: 'POST', body: JSON.stringify(f) });
      onListo();
    } catch (err) { setError(err.message); }
    setGuardando(false);
  };

  return (
    <form onSubmit={guardar} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Campo label="Título del curso" requerido>
            <input className={entrada} value={f.title} onChange={set('title')} required />
          </Campo>
        </div>
        <Campo label="Plataforma" requerido>
          <select className={entrada} value={f.provider} onChange={set('provider')}>
            {PROVEEDORES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </Campo>
        <Campo label="Nivel">
          <select className={entrada} value={f.level} onChange={set('level')}>
            {NIVELES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </Campo>
        <div className="sm:col-span-2">
          <Campo label="Enlace del curso" hint="A dónde llega quien lo quiera tomar." requerido>
            <input className={entrada} type="url" value={f.original_url} onChange={set('original_url')} placeholder="https://..." required />
          </Campo>
        </div>
        <div className="sm:col-span-2">
          <Campo label="Portada (URL de la imagen)" hint="Se ve en las tarjetas del catálogo. Formato 16:9.">
            <input className={entrada} type="url" value={f.image_url} onChange={set('image_url')} placeholder="https://..." />
          </Campo>
        </div>
        {f.image_url && <div className="sm:col-span-2"><Portada url={f.image_url} /></div>}
        <div className="sm:col-span-2">
          <Campo label="Descripción breve">
            <textarea className={entrada} rows={3} value={f.short_description} onChange={set('short_description')} />
          </Campo>
        </div>
        <Campo label="Categoría"><input className={entrada} value={f.category} onChange={set('category')} /></Campo>
        <Campo label="Duración" hint="Por ejemplo: 3 semanas."><input className={entrada} value={f.duration} onChange={set('duration')} /></Campo>
        <Campo label="Instructor"><input className={entrada} value={f.instructor} onChange={set('instructor')} /></Campo>
        <Campo label="Enlace de afiliado" hint="Opcional. Si lo pones, se usa en vez del enlace normal.">
          <input className={entrada} type="url" value={f.affiliate_url} onChange={set('affiliate_url')} />
        </Campo>
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <input type="checkbox" checked={f.active} onChange={set('active')} className="h-4 w-4 rounded border-slate-300" />
        Visible en el catálogo
      </label>

      {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={guardando} className="min-h-11 rounded-lg bg-teal-600 px-5 text-sm font-bold text-white transition hover:bg-teal-700 disabled:opacity-60">
          {guardando ? 'Guardando…' : 'Guardar curso curado'}
        </button>
        <button type="button" onClick={onCancelar} className="min-h-11 rounded-lg border border-slate-300 px-5 text-sm font-bold text-slate-700">Cancelar</button>
      </div>
    </form>
  );
}

/* ── Formulario de curso propio (unidades y clases) ───────── */

const claseVacia = () => ({ title: '', videoUrl: '', description: '', minutes: '' });
const unidadVacia = (n) => ({ title: `Unidad ${n}`, description: '', lessons: [claseVacia()] });

function FormPropio({ api, onListo, onCancelar }) {
  const [f, setF] = useState({
    title: '', short_description: '', cover_url: '', category: '', level: '',
    author_name: '', objective: '',
  });
  const [unidades, setUnidades] = useState([unidadVacia(1), unidadVacia(2), unidadVacia(3)]);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const cambiarUnidad = (iu, campo, valor) => setUnidades((us) => us.map((u, i) => (i === iu ? { ...u, [campo]: valor } : u)));
  const cambiarClase = (iu, ic, campo, valor) => setUnidades((us) => us.map((u, i) => (
    i !== iu ? u : { ...u, lessons: u.lessons.map((l, j) => (j === ic ? { ...l, [campo]: valor } : l)) }
  )));
  const agregarClase = (iu) => setUnidades((us) => us.map((u, i) => (i === iu ? { ...u, lessons: [...u.lessons, claseVacia()] } : u)));
  const quitarClase = (iu, ic) => setUnidades((us) => us.map((u, i) => (
    i !== iu ? u : { ...u, lessons: u.lessons.filter((_, j) => j !== ic) }
  )));

  const totalClases = unidades.reduce((n, u) => n + u.lessons.length, 0);

  const guardar = async (e) => {
    e.preventDefault();
    setError(''); setGuardando(true);
    try {
      const d = await api('/api/admin/design/structured', {
        method: 'POST',
        body: JSON.stringify({ ...f, units: unidades }),
      });
      onListo(d.data);
    } catch (err) { setError(err.message); }
    setGuardando(false);
  };

  return (
    <form onSubmit={guardar} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Campo label="Título del curso" requerido>
            <input className={entrada} value={f.title} onChange={set('title')} required />
          </Campo>
        </div>
        <div className="sm:col-span-2">
          <Campo label="Portada (URL de la imagen)" hint="Formato 16:9.">
            <input className={entrada} type="url" value={f.cover_url} onChange={set('cover_url')} placeholder="https://..." />
          </Campo>
        </div>
        {f.cover_url && <div className="sm:col-span-2"><Portada url={f.cover_url} /></div>}
        <div className="sm:col-span-2">
          <Campo label="Descripción breve">
            <textarea className={entrada} rows={2} value={f.short_description} onChange={set('short_description')} />
          </Campo>
        </div>
        <Campo label="Categoría"><input className={entrada} value={f.category} onChange={set('category')} /></Campo>
        <Campo label="Nivel">
          <select className={entrada} value={f.level} onChange={set('level')}>
            {NIVELES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </Campo>
        <Campo label="Autor"><input className={entrada} value={f.author_name} onChange={set('author_name')} /></Campo>
        <Campo label="Objetivo"><input className={entrada} value={f.objective} onChange={set('objective')} /></Campo>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-600">
            <Layers className="h-4 w-4" aria-hidden="true" /> Unidades ({unidades.length}) · {totalClases} clases
          </h3>
          <button type="button" onClick={() => setUnidades((u) => [...u, unidadVacia(u.length + 1)])}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-xs font-bold text-slate-700 hover:border-teal-400">
            <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Unidad
          </button>
        </div>

        <div className="mt-4 space-y-5">
          {unidades.map((u, iu) => (
            <div key={iu} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="flex items-start gap-3">
                <span className="mt-2 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-xs font-bold text-white">{iu + 1}</span>
                <div className="flex-1">
                  <input className={entrada} value={u.title} onChange={(e) => cambiarUnidad(iu, 'title', e.target.value)} placeholder="Título de la unidad" required />
                </div>
                {unidades.length > 1 && (
                  <button type="button" onClick={() => setUnidades((us) => us.filter((_, i) => i !== iu))}
                    aria-label={`Quitar unidad ${iu + 1}`} className="mt-1.5 rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600">
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-3 pl-10">
                {u.lessons.map((l, ic) => (
                  <div key={ic} className="rounded-lg border border-slate-200 bg-white p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">{iu + 1}.{ic + 1}</span>
                      <input className={`${entrada} flex-1`} value={l.title} onChange={(e) => cambiarClase(iu, ic, 'title', e.target.value)} placeholder="Título de la clase" required />
                      {u.lessons.length > 1 && (
                        <button type="button" onClick={() => quitarClase(iu, ic)} aria-label={`Quitar clase ${iu + 1}.${ic + 1}`}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600">
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_7rem]">
                      <div className="relative">
                        <Video className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                        <input className={`${entrada} pl-9`} type="url" value={l.videoUrl}
                          onChange={(e) => cambiarClase(iu, ic, 'videoUrl', e.target.value)}
                          placeholder="URL de YouTube o Vimeo" />
                      </div>
                      <input className={entrada} type="number" min="0" value={l.minutes}
                        onChange={(e) => cambiarClase(iu, ic, 'minutes', e.target.value)} placeholder="minutos" aria-label="Duración en minutos" />
                    </div>
                    <textarea className={`${entrada} mt-2`} rows={3} value={l.description}
                      onChange={(e) => cambiarClase(iu, ic, 'description', e.target.value)}
                      placeholder="Texto de apoyo: va debajo del video, en la misma clase." />
                  </div>
                ))}
                <button type="button" onClick={() => agregarClase(iu)}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 text-xs font-bold text-slate-600 hover:border-teal-400 hover:text-teal-700">
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Clase
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={guardando} className="min-h-11 rounded-lg bg-teal-600 px-5 text-sm font-bold text-white transition hover:bg-teal-700 disabled:opacity-60">
          {guardando ? 'Creando…' : `Crear curso (${unidades.length} unidades, ${totalClases} clases)`}
        </button>
        <button type="button" onClick={onCancelar} className="min-h-11 rounded-lg border border-slate-300 px-5 text-sm font-bold text-slate-700">Cancelar</button>
      </div>
      <p className="text-xs leading-5 text-slate-500">
        El curso se crea en borrador. Para publicarlo, revisarlo o agregarle más bloques, se abre en el Aula.
      </p>
    </form>
  );
}

/* ── Importar el catálogo del repositorio ─────────────────── */

/**
 * Trae a la base los cursos que viven como datos en el repositorio.
 *
 * Existe porque el importador ya estaba escrito pero solo se podía
 * llamar con curl y el token a mano, así que nunca se llamó: la página
 * /cursos/edutin llevaba meses vacía con 101 cursos esperando, y el
 * filtro de competencias no ofrecía nada porque ningún curso estaba
 * enlazado a ninguna.
 */
function ImportarCatalogo({ api, onListo }) {
  const [estado, setEstado] = useState('listo');
  const [reporte, setReporte] = useState(null);
  const [error, setError] = useState('');

  const importar = async () => {
    setEstado('corriendo'); setError(''); setReporte(null);
    try {
      const d = await api('/api/admin/import-courses', { method: 'POST', body: '{}' });
      setReporte(d.report);
      setEstado('listo');
      onListo?.();
    } catch (e) {
      setError(e.message);
      setEstado('listo');
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-sm font-bold text-slate-900">Importar el catálogo del repositorio</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">
        Trae a la base los cursos de Edutin, Coursera y Udemy que están como
        datos en el código, con sus enlaces de afiliado y sus competencias.
        Se puede repetir: los que ya estén se actualizan, no se duplican.
      </p>
      <button
        type="button"
        onClick={importar}
        disabled={estado === 'corriendo'}
        className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
      >
        <RefreshCw className={`h-4 w-4 ${estado === 'corriendo' ? 'animate-spin' : ''}`} aria-hidden="true" />
        {estado === 'corriendo' ? 'Importando… puede tardar un minuto' : 'Importar ahora'}
      </button>
      {error && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p>}
      {reporte && (
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 px-3 py-2">
            <dt className="text-xs text-slate-500">Cursos de Edutin</dt>
            <dd className="font-bold text-slate-900">
              {reporte.edvanta?.created ?? 0} nuevos · {reporte.edvanta?.updated ?? 0} actualizados
            </dd>
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-2">
            <dt className="text-xs text-slate-500">Coursera y Udemy</dt>
            <dd className="font-bold text-slate-900">
              {reporte.external?.created ?? 0} nuevos · {reporte.external?.updated ?? 0} actualizados
            </dd>
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-2">
            <dt className="text-xs text-slate-500">Competencias enlazadas</dt>
            <dd className="font-bold text-slate-900">{reporte.graph?.skillMappings ?? 0}</dd>
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-2">
            <dt className="text-xs text-slate-500">Recomendaciones por carrera</dt>
            <dd className="font-bold text-slate-900">{reporte.graph?.editorialRecommendations ?? 0}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}

/* ── Pegar los videos de un curso ya creado ───────────────── */

/**
 * Lista todas las clases de un curso propio con su campo de video.
 *
 * Existe porque la alternativa era abrir el editor del Aula clase por
 * clase: con cinco cursos de nueve clases son 45 visitas.
 */
function PanelVideos({ api, cursoId, onCerrar }) {
  const [curso, setCurso] = useState(null);
  const [urls, setUrls] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [hecho, setHecho] = useState('');

  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        const d = await api(`/api/admin/design/structured/${cursoId}`);
        if (!vivo) return;
        setCurso(d.data);
        const inicial = {};
        for (const fila of d.data.estructura) {
          if (fila.clase_id) inicial[fila.clase_id] = fila.video_url || '';
        }
        setUrls(inicial);
      } catch (e) { if (vivo) setError(e.message); }
    })();
    return () => { vivo = false; };
  }, [api, cursoId]);

  const guardar = async () => {
    setError(''); setHecho(''); setGuardando(true);
    try {
      const videos = Object.entries(urls).map(([lessonId, url]) => ({ lessonId: Number(lessonId), url }));
      const d = await api(`/api/admin/design/structured/${cursoId}/videos`, {
        method: 'PUT', body: JSON.stringify({ videos }),
      });
      setHecho(`${d.data.puestos} clases con video${d.data.quitados ? `, ${d.data.quitados} sin video` : ''}.`);
    } catch (e) { setError(e.message); }
    setGuardando(false);
  };

  if (error && !curso) return <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p>;
  if (!curso) return <p className="text-sm text-slate-500">Cargando el curso…</p>;

  // Las clases llegan planas; se agrupan por unidad para leerlas en orden.
  const unidades = [];
  for (const f of curso.estructura) {
    if (!f.clase_id) continue;
    let u = unidades.find((x) => x.id === f.modulo_id);
    if (!u) { u = { id: f.modulo_id, titulo: f.unidad, clases: [] }; unidades.push(u); }
    u.clases.push(f);
  }
  const conVideo = Object.values(urls).filter(Boolean).length;
  const total = Object.keys(urls).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{curso.title}</h2>
          <p className="text-sm text-slate-600">{conVideo} de {total} clases tienen video.</p>
        </div>
        <button type="button" onClick={onCerrar} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700">Volver</button>
      </div>

      <div className="mt-5 space-y-5">
        {unidades.map((u, iu) => (
          <div key={u.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-teal-600 text-xs font-bold text-white">{iu + 1}</span>
              {u.titulo}
            </h3>
            <div className="mt-3 space-y-2">
              {u.clases.map((c) => (
                <div key={c.clase_id} className="rounded-lg border border-slate-200 bg-white p-3">
                  <p className="text-sm font-semibold text-slate-800">{c.clase}</p>
                  <div className="relative mt-2">
                    <Video className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${urls[c.clase_id] ? 'text-teal-600' : 'text-slate-400'}`} aria-hidden="true" />
                    <input
                      className={`${entrada} pl-9`}
                      type="url"
                      value={urls[c.clase_id] ?? ''}
                      onChange={(e) => setUrls((p) => ({ ...p, [c.clase_id]: e.target.value }))}
                      placeholder="https://www.youtube.com/watch?v=…"
                      aria-label={`Video de la clase ${c.clase}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {error && <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p>}
      {hecho && <p className="mt-4 rounded-lg bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-800">Guardado: {hecho}</p>}

      <div className="sticky bottom-0 mt-5 flex gap-3 border-t border-slate-200 bg-white py-4">
        <button type="button" onClick={guardar} disabled={guardando}
          className="min-h-11 rounded-lg bg-teal-600 px-5 text-sm font-bold text-white hover:bg-teal-700 disabled:opacity-60">
          {guardando ? 'Guardando…' : 'Guardar los videos'}
        </button>
        <a href={`/aula/admin/cursos/${cursoId}/vista-previa`} target="_blank" rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-5 text-sm font-bold text-slate-700">
          Ver cómo queda
        </a>
      </div>
      <p className="text-xs leading-5 text-slate-500">
        Dejar un campo vacío quita el video de esa clase; el texto de apoyo se conserva.
      </p>
    </div>
  );
}

/* ── Panel ────────────────────────────────────────────────── */

export default function AdminDesign() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [dentro, setDentro] = useState(!!token);
  const [cursos, setCursos] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [q, setQ] = useState('');
  const [filtro, setFiltro] = useState('');
  const [creando, setCreando] = useState(null);
  const [videosDe, setVideosDe] = useState(null);
  const [aviso, setAviso] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => updatePageSeo({
    title: 'Edvanta Design | Edvanta',
    description: 'Panel para administrar los cursos de Edvanta.',
    canonical: 'https://edvanta.co/admin/design',
    robots: 'noindex,nofollow',
  }), []);

  const api = useCallback(async (path, options = {}) => {
    const res = await fetch(apiUrl(path), {
      ...options,
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token, ...options.headers },
    });
    if (res.status === 403 || res.status === 401) {
      setDentro(false); setToken(''); localStorage.removeItem(TOKEN_KEY);
      throw new Error('El token no es válido.');
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) throw new Error(data.error || 'No fue posible completar la operación.');
    return data;
  }, [token]);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const [lista, res] = await Promise.all([
        api(`/api/admin/design/courses?${new URLSearchParams({ ...(q ? { q } : {}), ...(filtro ? { tipo: filtro } : {}) })}`),
        api('/api/admin/design/summary'),
      ]);
      setCursos(lista.data || []);
      setResumen(res);
    } catch (e) { setAviso(e.message); }
    setCargando(false);
  }, [api, q, filtro]);

  useEffect(() => { if (dentro) cargar(); }, [dentro, cargar]);

  const totales = useMemo(() => ({
    propios: cursos.filter((c) => c.tipo === 'propio').length,
    curados: cursos.filter((c) => c.tipo === 'curado').length,
    sinPortada: cursos.filter((c) => !c.image_url).length,
  }), [cursos]);

  if (!dentro) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const t = e.target.token.value.trim();
            if (!t) return;
            localStorage.setItem(TOKEN_KEY, t); setToken(t); setDentro(true);
          }}
          className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        >
          <h1 className="text-lg font-bold text-slate-900">Edvanta Design</h1>
          <p className="mt-1 text-sm text-slate-600">Escribe el token de administración.</p>
          <input name="token" type="password" placeholder="ADMIN_TOKEN" autoComplete="current-password"
            className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-200" />
          <button type="submit" className="mt-3 w-full rounded-xl bg-teal-600 py-2.5 text-sm font-bold text-white hover:bg-teal-700">Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-bold">Edvanta Design</h1>
            <p className="mt-0.5 text-sm text-slate-300">Los cursos de Edvanta: los curados y los propios.</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <Link to="/admin-paneles" className="text-slate-300 hover:text-white">Paneles</Link>
            <a href="/aula/admin/cursos" className="text-slate-300 hover:text-white">Aula</a>
            <button type="button" onClick={() => { setDentro(false); setToken(''); localStorage.removeItem(TOKEN_KEY); }}
              className="text-slate-400 hover:text-white">Cerrar sesión</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {resumen && (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-2xl font-bold text-slate-900">{totales.curados}</p>
              <p className="text-sm text-slate-600">Cursos curados</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-2xl font-bold text-slate-900">{totales.propios}</p>
              <p className="text-sm text-slate-600">Cursos propios (Aula)</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-2xl font-bold text-slate-900">{totales.sinPortada}</p>
              <p className="text-sm text-slate-600">Sin portada</p>
            </div>
          </div>
        )}

        {!creando && !videosDe && (
          <div className="mt-6">
            <ImportarCatalogo api={api} onListo={cargar} />
          </div>
        )}

        {!creando && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => setCreando('propio')}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-teal-600 px-4 text-sm font-bold text-white hover:bg-teal-700">
              <GraduationCap className="h-4 w-4" aria-hidden="true" /> Curso propio (Aula)
            </button>
            <button type="button" onClick={() => setCreando('curado')}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 hover:border-teal-400">
              <Link2 className="h-4 w-4" aria-hidden="true" /> Curso curado (enlace)
            </button>
            <div className="relative ml-auto">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar curso…" aria-label="Buscar curso"
                className="min-h-11 w-56 rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-teal-500" />
            </div>
            <select value={filtro} onChange={(e) => setFiltro(e.target.value)} aria-label="Filtrar por tipo"
              className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm">
              <option value="">Todos</option>
              <option value="propio">Propios</option>
              <option value="curado">Curados</option>
            </select>
          </div>
        )}

        {aviso && (
          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">{aviso}</p>
        )}

        {creando && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
              {creando === 'propio'
                ? <><GraduationCap className="h-5 w-5 text-teal-600" aria-hidden="true" /> Curso propio</>
                : <><Link2 className="h-5 w-5 text-teal-600" aria-hidden="true" /> Curso curado</>}
            </h2>
            {creando === 'propio'
              ? <FormPropio api={api} onCancelar={() => setCreando(null)}
                  onListo={(d) => { setCreando(null); setAviso(`Curso creado: ${d.title} (${d.unidades} unidades, ${d.clases} clases). Está en borrador en el Aula.`); cargar(); }} />
              : <FormCurado api={api} onCancelar={() => setCreando(null)}
                  onListo={() => { setCreando(null); setAviso('Curso curado guardado.'); cargar(); }} />}
          </section>
        )}

        {videosDe && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <PanelVideos api={api} cursoId={videosDe} onCerrar={() => { setVideosDe(null); cargar(); }} />
          </section>
        )}

        <section className="mt-6" hidden={Boolean(videosDe)}>
          {cargando && <p className="text-sm text-slate-500">Cargando…</p>}
          {!cargando && !cursos.length && (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm font-semibold text-slate-500">
              No hay cursos con ese filtro.
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cursos.map((c) => (
              <article key={`${c.tipo}-${c.id}`} className="flex flex-col rounded-xl border border-slate-200 bg-white p-3">
                <Portada url={c.image_url} />
                <div className="mt-3 flex items-start justify-between gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${c.tipo === 'propio' ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-600'}`}>
                    {c.tipo === 'propio' ? 'Propio' : c.provider}
                  </span>
                  {c.tipo === 'propio'
                    ? <span className="text-[10px] font-bold text-slate-500">{c.unidades} u · {c.clases} clases</span>
                    : <span className={`text-[10px] font-bold ${c.active ? 'text-teal-700' : 'text-slate-400'}`}>{c.active ? 'Visible' : 'Oculto'}</span>}
                </div>
                <h3 className="mt-1.5 flex-1 text-sm font-bold leading-snug text-slate-900">{c.title}</h3>
                <div className="mt-3 flex items-center gap-3 text-xs font-bold">
                  {c.tipo === 'propio' ? (
                    <>
                      <button type="button" onClick={() => setVideosDe(c.id)}
                        className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900">
                        <Video className="h-3.5 w-3.5" aria-hidden="true" /> Pegar videos
                      </button>
                      <a href={`/aula/admin/cursos/${c.id}`} className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800">
                        <BookOpenCheck className="h-3.5 w-3.5" aria-hidden="true" /> Aula
                      </a>
                    </>
                  ) : (
                    <>
                      <Link to={`/cursos/${c.slug}`} className="text-teal-700 hover:text-teal-900">Ver ficha</Link>
                      {c.original_url && (
                        <a href={c.original_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800">
                          Origen <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        </a>
                      )}
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
