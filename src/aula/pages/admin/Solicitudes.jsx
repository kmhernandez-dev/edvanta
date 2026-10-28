/**
 * ============================================================
 *  Solicitudes.jsx — Lo que la gente pide por la web
 *
 *  Registros de interés (curso en vivo, rutas para pacientes,
 *  escuelas en desarrollo), solicitudes de propuesta de instituciones
 *  y mensajes de contacto. Lo nuevo va primero.
 *
 *  Cada solicitud se puede mover a «en conversación» o «cerrada» y
 *  llevar una nota interna. No se borra: queda el registro de qué se
 *  pidió y cuándo se atendió, y cada cambio va a la bitácora.
 * ============================================================
 */

import { useCallback, useEffect, useState } from 'react';
import { Mail, MessageCircle } from 'lucide-react';
import { get, post } from '../../api';
import { PageHeader } from '../../ui/Page';
import { Button } from '../../ui/Button';
import { useAsync } from '../../hooks';

const FILTROS = [
  { id: 'nueva', label: 'Nuevas' },
  { id: 'en_conversacion', label: 'En conversación' },
  { id: 'cerrada', label: 'Cerradas' },
  { id: '', label: 'Todas' },
];

const TIPOS = {
  interes: 'Registro de interés',
  propuesta: 'Propuesta institucional',
  contacto: 'Contacto',
};

const ESTADOS = {
  nueva: 'Nueva',
  en_conversacion: 'En conversación',
  cerrada: 'Cerrada',
};

const fecha = (iso) => {
  try {
    return new Date(iso).toLocaleString('es-CO', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch { return ''; }
};

const soloDigitos = (t) => String(t || '').replace(/[^\d]/g, '');

function Fila({ s, onCambio }) {
  const [nota, setNota] = useState(s.notaInterna || '');
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState('');

  const guardar = async (cambios) => {
    setOcupado(true);
    setError('');
    try {
      await post(`/admin/solicitudes/${s.id}`, cambios);
      onCambio();
    } catch (err) {
      setError(err.message);
    } finally {
      setOcupado(false);
    }
  };

  const datos = [
    ['Qué pidió', s.referencia],
    ['Rol', s.rolTexto],
    ['Institución', [s.institucion, s.tipoInstitucionTexto].filter(Boolean).join(' · ')],
    ['Cargo', s.cargo],
    ['Áreas de interés', (s.areas || []).join(', ')],
    ['Perfiles', (s.perfiles || []).join(', ')],
    ['Participantes', s.participantes],
    ['Modalidad', s.modalidadTexto],
    ['Ubicación', [s.ciudad, s.pais].filter(Boolean).join(', ')],
    ['Fecha tentativa', s.fechaTentativa],
    ['Página', s.origen],
    ['Novedades', s.aceptaNovedades ? 'Aceptó recibir novedades' : 'Solo para responder esta solicitud'],
  ].filter(([, v]) => v);

  return (
    <li className="rounded-[var(--aula-radius)] border border-[var(--aula-border)] bg-white p-4">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-[var(--aula-neutral-soft)] px-2.5 py-1 font-bold text-[var(--aula-muted)]">{TIPOS[s.tipo]}</span>
        <span className={`rounded-full px-2.5 py-1 font-bold ${s.estado === 'nueva' ? 'bg-amber-50 text-amber-800' : s.estado === 'cerrada' ? 'bg-[var(--aula-neutral-soft)] text-[var(--aula-muted)]' : 'bg-sky-50 text-sky-800'}`}>
          {ESTADOS[s.estado]}
        </span>
        <span className="text-[var(--aula-muted)]">{fecha(s.fecha)}</span>
      </div>

      <p className="mt-2 text-base font-bold text-[var(--aula-text)]">{s.nombre}</p>
      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <a href={`mailto:${s.correo}`} className="inline-flex items-center gap-1 font-semibold text-[var(--aula-primary)] hover:underline">
          <Mail className="h-4 w-4" aria-hidden="true" />{s.correo}
        </a>
        {s.whatsapp && (
          <a href={`https://wa.me/${soloDigitos(s.whatsapp)}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-[var(--aula-primary)] hover:underline">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />{s.whatsapp}
          </a>
        )}
      </div>

      <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
        {datos.map(([k, v]) => (
          <div key={k}>
            <dt className="inline font-semibold text-[var(--aula-text)]">{k}: </dt>
            <dd className="inline text-[var(--aula-muted)]">{v}</dd>
          </div>
        ))}
      </dl>

      {s.resultadoEsperado && (
        <div className="mt-3 rounded-[var(--aula-radius-sm)] bg-[var(--aula-neutral-soft)] p-3">
          <p className="text-xs font-bold text-[var(--aula-muted)]">Necesidad o resultado esperado</p>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[var(--aula-text)]">{s.resultadoEsperado}</p>
        </div>
      )}

      {s.mensaje && (
        <p className="mt-3 whitespace-pre-wrap rounded-[var(--aula-radius-sm)] bg-[var(--aula-neutral-soft)] p-3 text-sm leading-6 text-[var(--aula-text)]">
          {s.mensaje}
        </p>
      )}

      <label htmlFor={`nota-${s.id}`} className="mt-3 block text-xs font-bold text-[var(--aula-muted)]">Nota interna</label>
      <textarea
        id={`nota-${s.id}`}
        value={nota}
        onChange={(e) => setNota(e.target.value)}
        rows={2}
        maxLength={2000}
        placeholder="Qué se habló, qué falta…"
        className="mt-1 w-full resize-y rounded-[var(--aula-radius)] border border-[var(--aula-border)] p-2.5 text-sm outline-none focus:border-[var(--aula-secondary)]"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {s.estado !== 'en_conversacion' && (
          <Button size="sm" variant="secondary" disabled={ocupado} onClick={() => guardar({ estado: 'en_conversacion', notaInterna: nota })}>
            En conversación
          </Button>
        )}
        {s.estado !== 'cerrada' && (
          <Button size="sm" variant="secondary" disabled={ocupado} onClick={() => guardar({ estado: 'cerrada', notaInterna: nota })}>
            Cerrar
          </Button>
        )}
        {s.estado === 'cerrada' && (
          <Button size="sm" variant="ghost" disabled={ocupado} onClick={() => guardar({ estado: 'nueva', notaInterna: nota })}>
            Volver a abrir
          </Button>
        )}
        {nota !== (s.notaInterna || '') && (
          <Button size="sm" variant="ghost" disabled={ocupado} onClick={() => guardar({ notaInterna: nota })}>
            Guardar nota
          </Button>
        )}
        {error && <span role="alert" className="text-xs font-semibold text-[var(--aula-danger)]">{error}</span>}
      </div>
    </li>
  );
}

export default function Solicitudes() {
  const [estado, setEstado] = useState('nueva');
  const [pagina, setPagina] = useState(1);
  const [version, setVersion] = useState(0);

  const cargar = useCallback(
    ({ signal }) => get(`/admin/solicitudes?estado=${estado}&pagina=${pagina}`, { signal }),
    // `version` fuerza la recarga después de cada cambio.
    [estado, pagina, version],
  );
  const lista = useAsync(cargar, [cargar]);

  useEffect(() => { setPagina(1); }, [estado]);

  const recargar = () => setVersion((v) => v + 1);
  const datos = lista.data;

  return (
    <>
      <PageHeader
        title="Solicitudes"
        description="Registros de interés, propuestas para instituciones y mensajes que llegan por la web. Lo nuevo va primero."
      />
      <div className="flex flex-wrap items-center gap-2">
        {FILTROS.map((f) => (
          <button
            key={f.id || 'todas'}
            type="button"
            onClick={() => setEstado(f.id)}
            aria-pressed={estado === f.id}
            className={`min-h-10 rounded-[var(--aula-radius)] px-4 text-sm font-bold transition ${
              estado === f.id
                ? 'bg-[var(--aula-primary)] text-white'
                : 'bg-[var(--aula-neutral-soft)] text-[var(--aula-muted)] hover:text-[var(--aula-text)]'
            }`}
          >
            {f.label}
            {f.id && datos?.porEstado?.[f.id] > 0 && (
              <span className={`ml-2 rounded-full px-1.5 text-xs ${f.id === 'nueva' ? 'bg-amber-400 text-amber-950' : 'bg-white/70 text-[var(--aula-text)]'}`}>
                {datos.porEstado[f.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {lista.loading && !datos && <p className="mt-8 text-sm text-[var(--aula-muted)]">Cargando solicitudes…</p>}
      {lista.error && (
        <p role="alert" className="mt-8 rounded-[var(--aula-radius)] bg-red-50 p-4 text-sm font-semibold text-red-700">
          {lista.error.message}{' '}
          <button type="button" onClick={recargar} className="underline">Reintentar</button>
        </p>
      )}

      {datos && !datos.solicitudes.length && (
        <p className="mt-8 rounded-[var(--aula-radius)] bg-[var(--aula-neutral-soft)] p-6 text-sm text-[var(--aula-muted)]">
          {estado === 'nueva'
            ? 'No hay solicitudes nuevas. Cuando alguien registre su interés o pida una propuesta, aparecerá aquí.'
            : 'No hay solicitudes con este filtro.'}
        </p>
      )}

      {datos?.solicitudes.length > 0 && (
        <>
          <ul className="mt-6 flex flex-col gap-4">
            {datos.solicitudes.map((s) => <Fila key={`${s.id}-${s.actualizada}`} s={s} onCambio={recargar} />)}
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
