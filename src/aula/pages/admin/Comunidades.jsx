/**
 * ============================================================
 *  Comunidades.jsx — Inscripciones y encuesta de los grupos de apoyo
 *
 *  Arriba, cuántas personas hay en cada grupo y cuántas llegaron esta
 *  semana. Al elegir un grupo (o todos), el resumen de la encuesta:
 *  quién llega, qué les cuesta más, qué quieren encontrar y cómo
 *  prefieren aprender. Eso dice qué temas, guías y cursos preparar.
 *
 *  Abajo, la lista de personas con su WhatsApp para darles el acceso.
 *  Cada inscripción pasa de «nueva» a «en el grupo» (o «baja») y puede
 *  llevar una nota. Las respuestas de salud solo existen si la persona
 *  autorizó datos sensibles; son confidenciales.
 * ============================================================
 */

import { useCallback, useEffect, useState } from 'react';
import { Download, Lock, Mail, MessageCircle } from 'lucide-react';
import { downloadFrom, get, post } from '../../api';
import { PageHeader } from '../../ui/Page';
import { Button } from '../../ui/Button';
import { useAsync } from '../../hooks';
import { COMUNIDADES } from '../../../data/comunidadesSalud';
import {
  DIFICULTADES, FORMATOS, INTERESES_COMUNIDAD, ROLES_COMUNIDAD, TIEMPOS, etiquetaDe,
} from '../../../data/encuestaComunidades';

const ESTADOS = { nueva: 'Nueva', en_grupo: 'En el grupo', baja: 'Baja' };
const FILTROS = [['nueva', 'Nuevas'], ['en_grupo', 'En el grupo'], ['baja', 'Bajas'], ['', 'Todas']];

const fecha = (iso) => {
  try {
    return new Date(iso).toLocaleString('es-CO', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return ''; }
};
const soloDigitos = (t) => String(t || '').replace(/[^\d]/g, '');
const primerNombre = (n) => String(n || '').trim().split(/\s+/)[0] || '';
const corto = (slug) => COMUNIDADES.find((c) => c.slug === slug)?.apoyo?.corto || slug;

/** Barras de un conteo, de mayor a menor. */
function Conteo({ titulo, datos = {}, lista, total }) {
  const filas = Object.entries(datos).sort((a, b) => b[1] - a[1]);
  return (
    <div className="rounded-[var(--aula-radius)] border border-[var(--aula-border)] bg-white p-4">
      <p className="text-sm font-bold text-[var(--aula-text)]">{titulo}</p>
      {!filas.length && <p className="mt-2 text-sm text-[var(--aula-muted)]">Aún sin respuestas.</p>}
      <ul className="mt-3 space-y-2">
        {filas.map(([k, n]) => (
          <li key={k}>
            <div className="flex justify-between gap-3 text-sm">
              <span className="text-[var(--aula-text)]">{lista ? etiquetaDe(lista, k) : k}</span>
              <span className="font-bold text-[var(--aula-muted)]">{n}</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-[var(--aula-neutral-soft)]">
              <div className="h-1.5 rounded-full bg-[var(--aula-secondary)]" style={{ width: `${total ? Math.round((n / total) * 100) : 0}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Fila({ i, onCambio }) {
  const [nota, setNota] = useState(i.notaInterna || '');
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState('');
  const difs = DIFICULTADES[i.comunidad] || [];

  const guardar = async (cambios) => {
    setOcupado(true);
    setError('');
    try {
      await post(`/admin/comunidades/inscripciones/${i.id}`, cambios);
      onCambio();
    } catch (err) {
      setError(err.message);
    } finally {
      setOcupado(false);
    }
  };

  const acceso = `https://wa.me/${soloDigitos(i.whatsapp)}?text=${encodeURIComponent(`Hola, ${primerNombre(i.nombre)}. Soy Karla, de Edvanta. Recibí tu inscripción al grupo de apoyo de ${corto(i.comunidad)}. Te comparto las reglas y el acceso:`)}`;
  const datos = [
    ['Quién es', etiquetaDe(ROLES_COMUNIDAD, i.rol)],
    ['Quiere encontrar', i.intereses.map((x) => etiquetaDe(INTERESES_COMUNIDAD, x)).join(', ')],
    ['Prefiere', i.formato && etiquetaDe(FORMATOS, i.formato)],
    ['País', [i.ciudad, i.pais].filter(Boolean).join(', ')],
    ['Llegó desde', [i.origen, i.utm?.source, i.utm?.campaign].filter(Boolean).join(' · ')],
    ['Novedades', i.aceptaNovedades ? 'Aceptó recibir correos' : 'Solo para el grupo'],
    ['Veces', i.veces > 1 ? `Se inscribió ${i.veces} veces` : null],
  ].filter(([, v]) => v);

  return (
    <li className="rounded-[var(--aula-radius)] border border-[var(--aula-border)] bg-white p-4">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-[#F0FAF9] px-2.5 py-1 font-bold text-[#0F7480]">Grupo de {i.grupo}</span>
        <span className={`rounded-full px-2.5 py-1 font-bold ${i.estado === 'nueva' ? 'bg-amber-50 text-amber-800' : i.estado === 'baja' ? 'bg-[var(--aula-neutral-soft)] text-[var(--aula-muted)]' : 'bg-sky-50 text-sky-800'}`}>{ESTADOS[i.estado]}</span>
        <span className="text-[var(--aula-muted)]">{fecha(i.fecha)}</span>
      </div>
      <p className="mt-2 text-base font-bold text-[var(--aula-text)]">{i.nombre}</p>
      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <a href={`mailto:${i.correo}`} className="inline-flex items-center gap-1 font-semibold text-[var(--aula-primary)] hover:underline">
          <Mail className="h-4 w-4" aria-hidden="true" />{i.correo}
        </a>
        {i.whatsapp && (
          <a href={acceso} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-[var(--aula-primary)] hover:underline">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />{i.whatsapp} · enviar acceso
          </a>
        )}
      </div>
      <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
        {datos.map(([k, v]) => (
          <div key={k}><dt className="inline font-semibold text-[var(--aula-text)]">{k}: </dt><dd className="inline text-[var(--aula-muted)]">{v}</dd></div>
        ))}
      </dl>
      {i.aceptaDatosSensibles && (i.tiempo || i.dificultades.length || i.pregunta) && (
        <div className="mt-3 rounded-[var(--aula-radius-sm)] bg-[var(--aula-neutral-soft)] p-3 text-sm">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--aula-muted)]"><Lock className="h-3.5 w-3.5" aria-hidden="true" />Datos de salud · confidenciales</p>
          {i.tiempo && <p className="mt-1"><b>Diagnóstico:</b> {etiquetaDe(TIEMPOS, i.tiempo)}</p>}
          {i.dificultades.length > 0 && <p className="mt-1"><b>Le cuesta:</b> {i.dificultades.map((d) => etiquetaDe(difs, d)).join(', ')}</p>}
          {i.pregunta && <p className="mt-1 whitespace-pre-wrap"><b>Pregunta:</b> {i.pregunta}</p>}
        </div>
      )}
      <label htmlFor={`nota-c-${i.id}`} className="mt-3 block text-xs font-bold text-[var(--aula-muted)]">Nota interna</label>
      <textarea id={`nota-c-${i.id}`} value={nota} onChange={(e) => setNota(e.target.value)} rows={2} maxLength={2000}
        className="mt-1 w-full resize-y rounded-[var(--aula-radius)] border border-[var(--aula-border)] p-2.5 text-sm outline-none focus:border-[var(--aula-secondary)]" />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {i.estado !== 'en_grupo' && <Button size="sm" variant="secondary" disabled={ocupado} onClick={() => guardar({ estado: 'en_grupo', notaInterna: nota })}>Ya está en el grupo</Button>}
        {i.estado !== 'baja' && <Button size="sm" variant="ghost" disabled={ocupado} onClick={() => guardar({ estado: 'baja', notaInterna: nota })}>Dar de baja</Button>}
        {i.estado === 'baja' && <Button size="sm" variant="ghost" disabled={ocupado} onClick={() => guardar({ estado: 'nueva', notaInterna: nota })}>Volver a abrir</Button>}
        {nota !== (i.notaInterna || '') && <Button size="sm" variant="ghost" disabled={ocupado} onClick={() => guardar({ notaInterna: nota })}>Guardar nota</Button>}
        {error && <span role="alert" className="text-xs font-semibold text-[var(--aula-danger)]">{error}</span>}
      </div>
    </li>
  );
}

export default function Comunidades() {
  const [comunidad, setComunidad] = useState('');
  const [estado, setEstado] = useState('nueva');
  const [pagina, setPagina] = useState(1);
  const [version, setVersion] = useState(0);
  const [descargando, setDescargando] = useState(false);

  const cargarResumen = useCallback(
    ({ signal }) => get(`/admin/comunidades/resumen?${new URLSearchParams({ comunidad })}`, { signal }),
    [comunidad, version],
  );
  const cargarLista = useCallback(
    ({ signal }) => get(`/admin/comunidades/inscripciones?${new URLSearchParams({ comunidad, estado, pagina })}`, { signal }),
    [comunidad, estado, pagina, version],
  );
  const resumen = useAsync(cargarResumen, [cargarResumen]);
  const lista = useAsync(cargarLista, [cargarLista]);
  useEffect(() => { setPagina(1); }, [comunidad, estado]);

  const recargar = () => setVersion((v) => v + 1);
  const descargar = async () => {
    setDescargando(true);
    try {
      await downloadFrom(`/admin/comunidades/inscripciones.csv${comunidad ? `?comunidad=${comunidad}` : ''}`, `grupos-de-apoyo${comunidad ? `-${comunidad}` : ''}.csv`);
    } finally { setDescargando(false); }
  };

  const r = resumen.data?.resumen;
  const difs = comunidad ? DIFICULTADES[comunidad] : null;
  const datos = lista.data;

  return (
    <>
      <PageHeader
        title="Grupos de apoyo"
        description="Inscripciones y encuesta de cada grupo: quién llega, qué le cuesta y qué quiere aprender. Da el acceso por WhatsApp y marca a quien ya entró."
        actions={<Button variant="secondary" icon={Download} disabled={descargando} onClick={descargar}>Descargar (CSV)</Button>}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => setComunidad('')} aria-pressed={!comunidad}
          className={`min-h-9 rounded-full px-3.5 text-sm font-bold transition ${!comunidad ? 'bg-[var(--aula-text)] text-white' : 'bg-white text-[var(--aula-muted)] ring-1 ring-[var(--aula-border)]'}`}>
          Todos {r && !comunidad ? `· ${r.total}` : ''}
        </button>
        {(resumen.data?.porGrupo || []).map((g) => (
          <button key={g.comunidad} type="button" onClick={() => setComunidad(g.comunidad)} aria-pressed={comunidad === g.comunidad}
            className={`min-h-9 rounded-full px-3.5 text-sm font-bold transition ${comunidad === g.comunidad ? 'bg-[var(--aula-text)] text-white' : 'bg-white text-[var(--aula-muted)] ring-1 ring-[var(--aula-border)]'}`}>
            {g.grupo} · {g.total}{g.semana > 0 && <span className="ml-1 text-[#0F7480]">+{g.semana}</span>}
          </button>
        ))}
      </div>

      {resumen.error && <p role="alert" className="rounded-[var(--aula-radius)] bg-red-50 p-4 text-sm font-semibold text-red-700">{resumen.error.message}</p>}
      {r && (
        <>
          <div className="grid gap-3 sm:grid-cols-4">
            {[
              ['Personas', r.total],
              ['Con WhatsApp', r.conWhatsapp],
              ['Aceptan correos', r.novedades],
              ['Respondieron salud', r.sensibles],
            ].map(([k, v]) => (
              <div key={k} className="rounded-[var(--aula-radius)] border border-[var(--aula-border)] bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-[var(--aula-muted)]">{k}</p>
                <p className="mt-1 text-2xl font-extrabold text-[var(--aula-text)]">{v}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <Conteo titulo="Quién llega" datos={r.rol} lista={ROLES_COMUNIDAD} total={r.total} />
            <Conteo titulo="Qué quieren encontrar" datos={r.intereses} lista={INTERESES_COMUNIDAD} total={r.total} />
            <Conteo titulo={difs ? 'Qué les cuesta más' : 'Qué les cuesta más (elige un grupo para ver los textos)'} datos={r.dificultades} lista={difs} total={r.sensibles} />
            <Conteo titulo="Cómo prefieren aprender" datos={r.formato} lista={FORMATOS} total={r.total} />
            <Conteo titulo="Hace cuánto el diagnóstico" datos={r.tiempo} lista={TIEMPOS} total={r.sensibles} />
          </div>
        </>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {FILTROS.map(([id, label]) => (
          <button key={id || 'todas'} type="button" onClick={() => setEstado(id)} aria-pressed={estado === id}
            className={`min-h-10 rounded-[var(--aula-radius)] px-4 text-sm font-bold transition ${estado === id ? 'bg-[var(--aula-primary)] text-white' : 'bg-[var(--aula-neutral-soft)] text-[var(--aula-muted)] hover:text-[var(--aula-text)]'}`}>
            {label}
            {id && datos?.porEstado?.[id] > 0 && <span className="ml-2 rounded-full bg-white/70 px-1.5 text-xs text-[var(--aula-text)]">{datos.porEstado[id]}</span>}
          </button>
        ))}
      </div>
      {lista.loading && !datos && <p className="mt-6 text-sm text-[var(--aula-muted)]">Cargando inscripciones…</p>}
      {lista.error && (
        <p role="alert" className="mt-6 rounded-[var(--aula-radius)] bg-red-50 p-4 text-sm font-semibold text-red-700">
          {lista.error.message} <button type="button" onClick={recargar} className="underline">Reintentar</button>
        </p>
      )}
      {datos && !datos.inscripciones.length && (
        <p className="mt-6 rounded-[var(--aula-radius)] bg-[var(--aula-neutral-soft)] p-6 text-sm text-[var(--aula-muted)]">
          No hay inscripciones con este filtro. Llegan desde la página de cada grupo (/comunidades) y desde la ficha del grupo en los artículos.
        </p>
      )}
      {datos?.inscripciones.length > 0 && (
        <>
          <ul className="mt-6 flex flex-col gap-4">
            {datos.inscripciones.map((i) => <Fila key={`${i.id}-${i.actualizada}`} i={i} onCambio={recargar} />)}
          </ul>
          <div className="mt-6 flex items-center gap-3">
            {pagina > 1 && <Button size="sm" variant="secondary" onClick={() => setPagina((p) => p - 1)}>Anteriores</Button>}
            {datos.hayMas && <Button size="sm" variant="secondary" onClick={() => setPagina((p) => p + 1)}>Siguientes</Button>}
          </div>
        </>
      )}
    </>
  );
}
