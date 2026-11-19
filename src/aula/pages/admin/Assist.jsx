/**
 * Edvanta Assist (/aula/admin/assist): atender a cada persona y vender.
 *
 *   Bandeja   el trabajo del día, ordenado por dinero en juego.
 *   Personas  buscar por correo o nombre (con cuenta o sin ella).
 *   Ficha     la persona completa y qué hacer ahora, con un clic a
 *             WhatsApp o al correo que corresponde.
 *   Ventas    embudo, ingresos y lo que recupera la venta automática.
 *
 * Todo sale de /api/aula/admin/assist (api/lib/aula/assist.js).
 */
import { useMemo, useState } from 'react';
import { Link, Outlet, useSearchParams } from 'react-router-dom';
import {
  Award, BadgeCheck, ClipboardCheck, Clock, CreditCard, GraduationCap, Hourglass, Inbox, KeyRound,
  Mail, MessageCircle, Percent, Search, Send, StickyNote, TrendingUp, UserPlus, Users, Wallet,
} from 'lucide-react';
import { get, post } from '../../api';
import { useAsync } from '../../hooks';
import { Badge, StatusBadge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { TextArea } from '../../ui/Form';
import { Card, PageHeader, ProgressBar, StatCard } from '../../ui/Page';
import { EmptyState, ErrorState, LoadingBlock } from '../../ui/States';
import { SearchInput } from '../../ui/Table';
import { Segmented, TabNav } from '../../ui/Tabs';
import { useToast } from '../../ui/Toast';

/* ── Formatos ─────────────────────────────────────────────────── */

const cop = (n) => `$${Math.round(Number(n) || 0).toLocaleString('es-CO')}`;
const fecha = (iso) => (iso ? new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Bogota' }) : '—');
const fechaHora = (iso) => (iso ? new Date(iso).toLocaleString('es-CO', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone: 'America/Bogota' }) : '—');
function hace(iso) {
  if (!iso) return '—';
  const min = Math.round((Date.now() - new Date(iso)) / 60000);
  if (min < 60) return `hace ${Math.max(1, min)} min`;
  const h = Math.round(min / 60);
  if (h < 48) return `hace ${h} h`;
  return `hace ${Math.round(h / 24)} días`;
}
const fichaDe = (correo) => `/aula/admin/assist/persona?correo=${encodeURIComponent(correo)}`;

const PLANTILLAS = {
  'inscripcion-curso': 'Inscripción confirmada',
  'bienvenida-curso': 'Bienvenida al curso',
  'recordatorio-curso': 'Recordatorio (no empezó)',
  'certificado-por-vencer': 'Descuento por vencer',
  'certificado-pagado': 'Pago aprobado',
  'pago-pendiente': 'Pago sin terminar',
  'curso-completado': 'Curso terminado: certificado',
  'reactivacion-curso': 'Reactivación',
  novedades: 'Novedades del mes',
};
const nombrePlantilla = (p) => PLANTILLAS[p] || (p?.startsWith('registro-') ? `Registro (${p.slice(9)})` : p);
const TEMPERATURA = { caliente: 'danger', tibio: 'warning', frio: 'neutral' };
const PRIORIDAD = { alta: { tone: 'danger', label: 'Prioridad alta' }, media: { tone: 'warning', label: 'Prioridad media' }, baja: { tone: 'neutral', label: 'Opcional' } };

function WhatsAppButton({ url, label = 'WhatsApp', size = 'sm' }) {
  if (!url) return null;
  return <Button variant="secondary" size={size} icon={MessageCircle} href={url} target="_blank" rel="noopener noreferrer">{label}</Button>;
}

/* ── Marco con pestañas ───────────────────────────────────────── */

export default function AssistLayout() {
  return (
    <div>
      <PageHeader
        eyebrow="Edvanta Assist"
        title="Atención y ventas"
        description="Cada persona en un solo lugar: qué hizo, qué compró y qué conviene hacer ahora. La bandeja pone primero lo que tiene dinero en juego."
      />
      <TabNav
        label="Secciones de Assist"
        items={[
          { to: '/aula/admin/assist', label: 'Bandeja', icon: Inbox, end: true },
          { to: '/aula/admin/assist/personas', label: 'Personas', icon: Users, match: /\/assist\/persona/ },
          { to: '/aula/admin/assist/ventas', label: 'Ventas', icon: TrendingUp },
        ]}
      />
      <div className="mt-6"><Outlet /></div>
    </div>
  );
}

/* ── Bandeja ──────────────────────────────────────────────────── */

const GRUPOS = [
  { clave: 'pagosSinTerminar', titulo: 'Pagos sin terminar', icono: CreditCard, tono: 'danger',
    ayuda: 'Empezaron a pagar el certificado hace más de 2 horas y no terminaron. El correo automático sale solo; si no responden, escríbeles.' },
  { clave: 'terminaronSinCertificado', titulo: 'Terminaron sin certificado', icono: Award, tono: 'warning',
    ayuda: 'Completaron un curso con certificado de pago y aún no lo tienen. Es la venta más fácil del día.' },
  { clave: 'solicitudesNuevas', titulo: 'Solicitudes nuevas', icono: Inbox, tono: 'primary',
    ayuda: 'Formularios de la web sin atender, de la más caliente a la más fría.' },
  { clave: 'inactivos', titulo: 'Estudiantes quietos', icono: Hourglass, tono: 'neutral',
    ayuda: 'Van a mitad de curso y llevan 7 días o más sin entrar. Primero quienes están más cerca de terminar.' },
  { clave: 'invitadosSinEntrar', titulo: 'Invitaciones sin abrir', icono: UserPlus, tono: 'neutral',
    ayuda: 'Tienen cuenta creada hace 3 días o más y nunca han entrado. Reenvíales el enlace desde su ficha.' },
];

export function AssistBandeja() {
  const bandeja = useAsync(({ signal }) => get('/admin/assist/bandeja', { signal }), []);
  const b = bandeja.data;
  if (bandeja.loading && !b) return <LoadingBlock rows={4} label="Armando la bandeja" />;
  if (bandeja.error) return <ErrorState error={bandeja.error} onRetry={bandeja.reload} />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {GRUPOS.map((g) => (
          <StatCard key={g.clave} label={g.titulo} value={b.grupos[g.clave].total} icon={g.icono}
            tone={b.grupos[g.clave].total ? (g.tono === 'neutral' ? 'primary' : g.tono) : 'neutral'} />
        ))}
        <StatCard label="Entregas por revisar" value={b.entregasPorRevisar} icon={ClipboardCheck}
          hint="Se revisan en Docencia" to="/aula/docente" />
      </div>

      {GRUPOS.map((g) => {
        const grupo = b.grupos[g.clave];
        return (
          <Card key={g.clave} title={`${g.titulo} · ${grupo.total}`} description={g.ayuda} bodyClassName="p-0">
            {grupo.items.length === 0 ? (
              <p className="px-5 py-6 text-sm text-[var(--aula-muted)]">Nada pendiente aquí. 🎉</p>
            ) : (
              <ul className="divide-y divide-[var(--aula-border)]">
                {grupo.items.map((it) => (
                  <li key={`${it.correo}-${it.courseId || it.solicitudId || ''}`} className="flex flex-wrap items-center gap-3 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-[var(--aula-text)]">{it.nombre || it.correo}</p>
                      <p className="truncate text-sm text-[var(--aula-muted)]">{it.correo} · {it.detalle}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {it.temperatura && <Badge tone={TEMPERATURA[it.temperatura] || 'neutral'}>{it.temperatura}</Badge>}
                      {it.recordado && <Badge tone="info">Correo enviado</Badge>}
                      {it.ofrecido && <Badge tone="info">Oferta enviada</Badge>}
                      <span className="text-xs text-[var(--aula-muted)]">{hace(it.fecha)}</span>
                      {it.whatsapp && <WhatsAppButton url={`https://wa.me/${it.whatsapp}`} />}
                      <Button variant="soft" size="sm" to={fichaDe(it.correo)}>Abrir ficha</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        );
      })}
    </div>
  );
}

/* ── Personas (búsqueda) ──────────────────────────────────────── */

export function AssistPersonas() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const resultado = useAsync(
    ({ signal }) => (q.trim().length >= 2 ? get(`/admin/assist/buscar?q=${encodeURIComponent(q.trim())}`, { signal }) : Promise.resolve({ items: [] })),
    [q],
  );
  const items = resultado.data?.items || [];

  return (
    <div className="space-y-4">
      <SearchInput
        value={q}
        onChange={(v) => setParams(v ? { q: v } : {})}
        label="Buscar persona"
        placeholder="Correo o nombre (mínimo 2 letras)…"
        className="max-w-xl"
      />
      {resultado.error && <ErrorState error={resultado.error} onRetry={resultado.reload} />}
      {q.trim().length < 2 ? (
        <EmptyState icon={Search} title="Busca a cualquier persona" description="Con cuenta en el aula o solo con una solicitud de la web. Escribe parte del correo o del nombre." />
      ) : resultado.loading && !resultado.data ? (
        <LoadingBlock rows={3} label="Buscando" />
      ) : items.length === 0 ? (
        <EmptyState icon={Search} title="Sin resultados" description={`Nadie coincide con «${q}».`} />
      ) : (
        <Card bodyClassName="p-0">
          <ul className="divide-y divide-[var(--aula-border)]">
            {items.map((p) => (
              <li key={p.correo}>
                <Link to={fichaDe(p.correo)} className="flex flex-wrap items-center gap-3 px-5 py-3 hover:bg-[var(--aula-surface-muted)]">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{p.nombre}</p>
                    <p className="truncate text-sm text-[var(--aula-muted)]">{p.correo}</p>
                  </div>
                  {p.cuenta
                    ? <StatusBadge kind="user" status={p.cuenta.estado} />
                    : <Badge tone="accent">Sin cuenta</Badge>}
                  {p.cuenta && <Badge>{p.cuenta.cursos} {p.cuenta.cursos === 1 ? 'curso' : 'cursos'}</Badge>}
                  {p.solicitudes > 0 && <Badge tone="info">{p.solicitudes} {p.solicitudes === 1 ? 'solicitud' : 'solicitudes'}</Badge>}
                  {p.temperatura && <Badge tone={TEMPERATURA[p.temperatura] || 'neutral'}>{p.temperatura}</Badge>}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

/* ── Ficha de una persona ─────────────────────────────────────── */

const OPERACIONES = {
  'enlace-acceso': { ruta: '/admin/assist/persona/enlace-acceso', etiqueta: 'Enviar enlace de acceso', icono: KeyRound, ok: 'Enlace de acceso enviado.' },
  'recordatorio-pago': { ruta: '/admin/assist/persona/recordatorio-pago', etiqueta: 'Enviar recordatorio de pago', icono: Send, ok: 'Recordatorio de pago enviado.' },
  'oferta-certificado': { ruta: '/admin/assist/persona/oferta-certificado', etiqueta: 'Enviar oferta del certificado', icono: Send, ok: 'Oferta del certificado enviada.' },
};

export function AssistPersona() {
  const [params] = useSearchParams();
  const correo = (params.get('correo') || '').trim().toLowerCase();
  const toast = useToast();
  const ficha = useAsync(({ signal }) => get(`/admin/assist/persona?correo=${encodeURIComponent(correo)}`, { signal }), [correo]);
  const [enviando, setEnviando] = useState(null);
  const [nota, setNota] = useState('');
  const [guardando, setGuardando] = useState(false);
  const p = ficha.data;

  const operar = async (accion) => {
    const op = OPERACIONES[accion.operacion];
    setEnviando(accion.clave);
    try {
      const r = await post(op.ruta, { correo, ...(accion.courseId ? { courseId: accion.courseId } : {}) });
      if (r?.enviado === false) toast.error('La acción quedó registrada, pero el correo no salió. Revisa la configuración de correo.');
      else toast.success(op.ok);
      ficha.reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setEnviando(null);
    }
  };

  const guardarNota = async (e) => {
    e.preventDefault();
    if (!nota.trim()) return;
    setGuardando(true);
    try {
      const n = await post('/admin/assist/persona/notas', { correo, nota: nota.trim() });
      ficha.setData((d) => ({ ...d, notas: [n, ...d.notas] }));
      setNota('');
      toast.success('Nota guardada.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setGuardando(false);
    }
  };

  if (!correo) return <EmptyState icon={Search} title="Falta el correo" description="Abre la ficha desde la bandeja o desde la búsqueda." action={<Button to="/aula/admin/assist/personas">Buscar persona</Button>} />;
  if (ficha.loading && !p) return <LoadingBlock rows={5} label="Cargando la ficha" />;
  if (ficha.error) return <ErrorState error={ficha.error} onRetry={ficha.reload} />;

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-xl font-extrabold text-[var(--aula-primary)]">{p.nombre}</h2>
            <p className="text-sm text-[var(--aula-muted)]">{p.correo}{p.whatsapp ? ` · +${p.whatsapp}` : ''}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {p.cuenta ? <StatusBadge kind="user" status={p.cuenta.estado} /> : <Badge tone="accent">Sin cuenta en el aula</Badge>}
              {p.cuenta?.empresa && <Badge>{p.cuenta.empresa}</Badge>}
              {p.cuenta?.segmento && p.cuenta.segmento !== 'sin_clasificar' && <Badge tone="info">{p.cuenta.segmento}</Badge>}
              {(p.cuenta?.etiquetas || []).map((t) => <Badge key={t}>{t}</Badge>)}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {p.whatsapp && <WhatsAppButton url={`https://wa.me/${p.whatsapp}`} label="Escribir por WhatsApp" size="md" />}
            <Button variant="secondary" icon={Mail} href={`mailto:${p.correo}`}>Correo</Button>
          </div>
        </div>
        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <Dato titulo="Cuenta creada" valor={p.cuenta ? fecha(p.cuenta.creada) : '—'} />
          <Dato titulo="Última entrada" valor={p.cuenta?.ultimaEntrada ? hace(p.cuenta.ultimaEntrada) : 'Nunca'} />
          <Dato titulo="Ha pagado" valor={`${cop(p.valor.pagado)} COP`} />
          <Dato titulo="Certificados emitidos" valor={p.valor.certificados} />
        </dl>
      </Card>

      <Card title="Qué hacer ahora" description="Ordenado por prioridad. Cada acción dice por qué aparece.">
        {p.acciones.length === 0 ? (
          <p className="text-sm text-[var(--aula-muted)]">Nada pendiente con esta persona.</p>
        ) : (
          <ul className="space-y-3">
            {p.acciones.map((a) => {
              const op = a.operacion && OPERACIONES[a.operacion];
              return (
                <li key={a.clave} className="flex flex-wrap items-start gap-3 rounded-[var(--aula-radius)] border border-[var(--aula-border)] p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={PRIORIDAD[a.prioridad].tone}>{PRIORIDAD[a.prioridad].label}</Badge>
                      <p className="font-semibold">{a.titulo}</p>
                    </div>
                    <p className="mt-1 text-sm text-[var(--aula-muted)]">{a.detalle}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {op && (
                      <Button size="sm" icon={op.icono} loading={enviando === a.clave} onClick={() => operar(a)}>
                        {op.etiqueta}
                      </Button>
                    )}
                    <WhatsAppButton url={a.whatsapp} label="WhatsApp con mensaje" />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {!p.whatsapp && p.acciones.length > 0 && (
          <p className="mt-3 text-xs text-[var(--aula-muted)]">No tenemos su WhatsApp: no dejó número en ningún formulario.</p>
        )}
      </Card>

      <Card title={`Cursos · ${p.cursos.length}`} bodyClassName="p-0">
        {p.cursos.length === 0 ? (
          <p className="px-5 py-6 text-sm text-[var(--aula-muted)]">{p.cuenta ? 'No se ha inscrito en ningún curso.' : 'Aún no tiene cuenta en el aula.'}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-[var(--aula-surface-muted)] text-left text-xs uppercase tracking-wide text-[var(--aula-muted)]">
                <tr><th className="px-5 py-3">Curso</th><th className="px-3 py-3">Estado</th><th className="px-3 py-3 w-40">Avance</th><th className="px-3 py-3">Último acceso</th><th className="px-5 py-3">Certificado</th></tr>
              </thead>
              <tbody className="divide-y divide-[var(--aula-border)]">
                {p.cursos.map((c) => (
                  <tr key={c.matriculaId}>
                    <td className="px-5 py-3">
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--aula-primary)] hover:underline">{c.titulo}</a>
                      <p className="text-xs text-[var(--aula-muted)]">Inscripción {fecha(c.inscrito)}{c.institucional ? ' · por su institución' : ''}{c.retirado ? ' · retirado' : ''}</p>
                    </td>
                    <td className="px-3 py-3"><StatusBadge kind="enrollment" status={c.estado} /></td>
                    <td className="px-3 py-3"><div className="flex items-center gap-2"><ProgressBar value={c.avance} label={`Avance en ${c.titulo}`} size="sm" /><span className="whitespace-nowrap tabular-nums text-xs">{c.avance} %</span></div></td>
                    <td className="px-3 py-3 text-[var(--aula-muted)]">{c.ultimoAcceso ? hace(c.ultimoAcceso) : 'Sin abrir'}</td>
                    <td className="px-5 py-3"><EstadoCertificado c={c} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title={`Pagos · ${p.pagos.length}`}>
          {p.pagos.length === 0 ? <p className="text-sm text-[var(--aula-muted)]">Sin pagos.</p> : (
            <ul className="space-y-2 text-sm">
              {p.pagos.map((x) => (
                <li key={x.id} className="flex flex-wrap items-center justify-between gap-2">
                  <span className="min-w-0 flex-1 truncate">{x.curso}</span>
                  <Badge tone={x.estado === 'aprobado' ? 'success' : x.estado === 'pendiente' ? 'warning' : 'neutral'}>{x.estado}</Badge>
                  <span className="tabular-nums">{x.monto ? `${cop(x.monto)} ${x.moneda}` : '—'}</span>
                  <span className="w-full text-xs text-[var(--aula-muted)]">{x.medio === 'admin' ? 'Registrado a mano' : 'Mercado Pago'} · {fechaHora(x.aprobado || x.creado)}{x.nota ? ` · ${x.nota}` : ''}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title={`Solicitudes de la web · ${p.solicitudes.length}`}>
          {p.solicitudes.length === 0 ? <p className="text-sm text-[var(--aula-muted)]">No ha llenado formularios.</p> : (
            <ul className="space-y-3 text-sm">
              {p.solicitudes.map((s) => (
                <li key={s.id}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{s.tipo}{s.referencia ? ` · ${s.referencia}` : ''}</span>
                    <Badge tone={s.estado === 'nueva' ? 'warning' : s.estado === 'cerrada' ? 'neutral' : 'info'}>{s.estado.replace('_', ' ')}</Badge>
                    {s.temperatura && <Badge tone={TEMPERATURA[s.temperatura] || 'neutral'}>{s.temperatura}</Badge>}
                  </div>
                  <p className="text-xs text-[var(--aula-muted)]">{fechaHora(s.creada)}{s.origen ? ` · ${s.origen}` : ''}{s.utmSource ? ` · ${s.utmSource}` : ''}{s.institucion ? ` · ${s.institucion}` : ''}</p>
                  {s.mensaje && <p className="mt-1 whitespace-pre-line text-[var(--aula-text)]">{s.mensaje}</p>}
                  {s.siguienteAccion && <p className="mt-1 text-xs text-[var(--aula-secondary)]">Sugerido: {s.siguienteAccion}</p>}
                </li>
              ))}
            </ul>
          )}
          {p.solicitudes.some((s) => s.estado === 'nueva') && (
            <p className="mt-4 text-xs text-[var(--aula-muted)]">Para cambiar el estado de una solicitud, usa <Link className="text-[var(--aula-primary)] underline" to="/aula/admin/solicitudes">Solicitudes</Link>.</p>
          )}
        </Card>

        <Card title={`Correos que recibió · ${p.correos.length}`}>
          {p.correos.length === 0 ? <p className="text-sm text-[var(--aula-muted)]">Ningún correo automático todavía.</p> : (
            <ul className="space-y-2 text-sm">
              {p.correos.map((c) => (
                <li key={`${c.plantilla}-${c.clave}-${c.fecha}`} className="flex flex-wrap items-center justify-between gap-2">
                  <span>{nombrePlantilla(c.plantilla)}</span>
                  <span className="text-xs text-[var(--aula-muted)]">{c.enviado ? fechaHora(c.fecha) : 'no salió'}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Notas del equipo" description="Solo las ve la administración.">
          <form onSubmit={guardarNota} className="space-y-2">
            <TextArea label="Nueva nota" rows={3} value={nota} maxLength={2000} onChange={(e) => setNota(e.target.value)} placeholder="Qué hablaron, qué quedó pendiente…" />
            <Button type="submit" size="sm" icon={StickyNote} loading={guardando} disabled={!nota.trim()}>Guardar nota</Button>
          </form>
          {p.notas.length > 0 && (
            <ul className="mt-4 space-y-3 border-t border-[var(--aula-border)] pt-4 text-sm">
              {p.notas.map((n) => (
                <li key={n.id}>
                  <p className="whitespace-pre-line">{n.nota}</p>
                  <p className="text-xs text-[var(--aula-muted)]">{n.autor || 'Equipo'} · {fechaHora(n.fecha)}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

function Dato({ titulo, valor }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-[var(--aula-muted)]">{titulo}</dt>
      <dd className="mt-0.5 font-semibold tabular-nums">{valor}</dd>
    </div>
  );
}

function EstadoCertificado({ c }) {
  const x = c.certificado;
  if (x.estado === 'emitido') return <span className="inline-flex items-center gap-1 text-[var(--aula-success)]"><BadgeCheck className="h-4 w-4" aria-hidden="true" />Emitido {x.codigo ? `· ${x.codigo}` : ''}</span>;
  if (!x.conCosto) return <span className="text-[var(--aula-muted)]">{c.institucional ? 'Lo cubre su institución' : 'Sin costo'}</span>;
  if (x.pagado) return <Badge tone="success">Pagado</Badge>;
  return (
    <span className="text-[var(--aula-muted)]">
      Sin pagar{x.precioHoy ? ` · hoy ${cop(x.precioHoy)}` : ''}
      {x.descuentoVence && <span className="block text-xs">descuento hasta {fecha(x.descuentoVence)}</span>}
    </span>
  );
}

/* ── Ventas ───────────────────────────────────────────────────── */

const PERIODOS = [
  { value: 7, label: '7 días' },
  { value: 30, label: '30 días' },
  { value: 90, label: '90 días' },
];

export function AssistVentas() {
  const [dias, setDias] = useState(30);
  const ventas = useAsync(({ signal }) => get(`/admin/assist/ventas?dias=${dias}`, { signal }), [dias]);
  const v = ventas.data;
  const pct = (x) => (x === null || x === undefined ? '—' : `${x} %`);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented label="Periodo" value={dias} onChange={setDias} options={PERIODOS} />
        {v && <p className="text-xs text-[var(--aula-muted)]">Del {fecha(v.desde)} al {fecha(v.hasta)} · hora de Colombia</p>}
      </div>
      {ventas.error && <ErrorState error={ventas.error} onRetry={ventas.reload} />}
      {ventas.loading && !v && <LoadingBlock rows={4} label="Calculando ventas" />}
      {v && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Ingresos (COP)" value={cop(v.totales.ingresosCop)} icon={Wallet} tone="success"
              hint={v.totales.ticketPromedioCop ? `Ticket promedio ${cop(v.totales.ticketPromedioCop)}` : 'Certificados pagados'} />
            <StatCard label="Certificados pagados" value={v.totales.pagosAprobados} icon={Award} tone="primary"
              hint={`${v.totales.pagosIniciados} personas empezaron a pagar`} />
            <StatCard label="Inscripciones" value={v.totales.inscripciones} icon={GraduationCap}
              hint={`${v.totales.inscripcionesPropias} por su cuenta · ${v.totales.terminados} terminaron`} />
            <StatCard label="Cuentas nuevas" value={v.totales.cuentas} icon={Users}
              hint={`${v.totales.solicitudes} solicitudes de la web`} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="De inscripción a pago" value={pct(v.conversion.inscripcionAPago)} icon={Percent}
              hint="Pagos ÷ inscripciones por su cuenta" />
            <StatCard label="De terminar a pagar" value={pct(v.conversion.terminadoAPago)} icon={Percent}
              hint="Pagos ÷ cursos terminados" />
            <StatCard label="Pagos que se completan" value={pct(v.conversion.inicioDePagoAPago)} icon={Clock}
              hint="Pagos aprobados ÷ pagos iniciados" />
          </div>

          <Card title="Inscripciones por día" description="Pasa el cursor sobre una barra para ver ese día: inscripciones, pagos e ingresos.">
            <BarrasDiarias serie={v.serie} />
          </Card>

          <div className="space-y-6">
            <Card title="Por curso" description="Los cursos con ventas o inscripciones en el periodo." bodyClassName="p-0">
              {v.porCurso.length === 0 ? <p className="px-5 py-6 text-sm text-[var(--aula-muted)]">Sin movimiento en el periodo.</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[var(--aula-surface-muted)] text-left text-xs uppercase tracking-wide text-[var(--aula-muted)]">
                      <tr><th className="px-5 py-3">Curso</th><th className="px-3 py-3 text-right">Inscr.</th><th className="px-3 py-3 text-right">Terminaron</th><th className="px-3 py-3 text-right">Pagos</th><th className="px-5 py-3 text-right">Ingresos</th></tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--aula-border)]">
                      {v.porCurso.map((c) => (
                        <tr key={c.id}>
                          <td className="px-5 py-2.5">{c.titulo}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums">{c.inscripciones}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums">{c.terminados}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums">{c.pagos}</td>
                          <td className="px-5 py-2.5 text-right tabular-nums">{cop(c.ingresos)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card title="La venta automática" description="Pagos aprobados que llegaron después de un correo automático del mismo curso. Un pago puede contar en más de un correo.">
                {v.recuperadas.length === 0 ? <p className="text-sm text-[var(--aula-muted)]">Aún no hay pagos después de un correo en este periodo.</p> : (
                  <ul className="space-y-2 text-sm">
                    {v.recuperadas.map((r) => (
                      <li key={r.plantilla} className="flex items-center justify-between gap-2">
                        <span>{nombrePlantilla(r.plantilla)}</span>
                        <span className="tabular-nums">{r.pagos} {r.pagos === 1 ? 'pago' : 'pagos'} · {cop(r.total)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
              <Card title="Correos automáticos enviados">
                {v.correos.length === 0 ? <p className="text-sm text-[var(--aula-muted)]">Ninguno en el periodo.</p> : (
                  <ul className="space-y-2 text-sm">
                    {v.correos.map((c) => (
                      <li key={c.plantilla} className="flex items-center justify-between gap-2">
                        <span>{nombrePlantilla(c.plantilla)}</span>
                        <span className="tabular-nums">{c.enviados.toLocaleString('es-CO')}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Barras de una sola serie (inscripciones por día). Un solo color de
 * marca; pagos e ingresos van en el detalle de cada día, no en un segundo
 * eje. Debajo, la misma información como tabla.
 */
function BarrasDiarias({ serie }) {
  const [activo, setActivo] = useState(null);
  const max = useMemo(() => Math.max(1, ...serie.map((d) => d.inscripciones)), [serie]);
  const total = serie.reduce((s, d) => s + d.inscripciones, 0);
  const etiquetaDia = (dia) => new Date(`${dia}T12:00:00-05:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', timeZone: 'America/Bogota' });
  const d = activo !== null ? serie[activo] : null;

  return (
    <div>
      <div className="mb-2 flex min-h-[2.5rem] flex-wrap items-baseline gap-x-4 gap-y-1 text-sm" aria-live="polite">
        {d ? (
          <>
            <span className="font-semibold">{etiquetaDia(d.dia)}</span>
            <span><span className="tabular-nums font-semibold">{d.inscripciones}</span> {d.inscripciones === 1 ? 'inscripción' : 'inscripciones'}</span>
            <span><span className="tabular-nums font-semibold">{d.pagos}</span> {d.pagos === 1 ? 'pago' : 'pagos'}</span>
            <span><span className="tabular-nums font-semibold">{cop(d.ingresos)}</span> COP</span>
            <span className="text-[var(--aula-muted)]">{d.cuentas} {d.cuentas === 1 ? 'cuenta nueva' : 'cuentas nuevas'}</span>
          </>
        ) : (
          <span className="text-[var(--aula-muted)]">{total.toLocaleString('es-CO')} inscripciones en el periodo · máximo {max} en un día</span>
        )}
      </div>
      <div className="relative h-48 border-b border-[var(--aula-border-strong)]" onMouseLeave={() => setActivo(null)}>
        {/* Guías recesivas a la mitad y al tope. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 border-t border-dashed border-[var(--aula-border)]" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-dashed border-[var(--aula-border)]" aria-hidden="true" />
        <span className="pointer-events-none absolute -top-2 right-0 bg-[var(--aula-surface)] pl-1 text-[10px] tabular-nums text-[var(--aula-muted)]" aria-hidden="true">{max}</span>
        <div className="flex h-full items-end" role="list" aria-label="Inscripciones por día">
          {serie.map((x, i) => (
            <button
              key={x.dia}
              type="button"
              role="listitem"
              aria-label={`${etiquetaDia(x.dia)}: ${x.inscripciones} ${x.inscripciones === 1 ? 'inscripción' : 'inscripciones'}, ${x.pagos} ${x.pagos === 1 ? 'pago' : 'pagos'}`}
              onMouseEnter={() => setActivo(i)}
              onFocus={() => setActivo(i)}
              onBlur={() => setActivo(null)}
              className="group flex h-full flex-1 items-end justify-center px-[1px] focus:outline-none focus-visible:bg-[var(--aula-primary-soft)]"
            >
              <span
                className={`block w-full max-w-[14px] rounded-t-[4px] transition-opacity ${activo === null || activo === i ? 'opacity-100' : 'opacity-40'}`}
                style={{ height: `${x.inscripciones ? Math.max(2, (x.inscripciones / max) * 100) : 0}%`, background: 'var(--aula-primary)' }}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-[var(--aula-muted)]" aria-hidden="true">
        <span>{etiquetaDia(serie[0].dia)}</span>
        <span>{etiquetaDia(serie[serie.length - 1].dia)}</span>
      </div>
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer font-semibold text-[var(--aula-primary)]">Ver como tabla</summary>
        <div className="mt-2 max-h-72 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[var(--aula-surface-muted)] text-left text-xs uppercase tracking-wide text-[var(--aula-muted)]">
              <tr><th className="px-3 py-2">Día</th><th className="px-3 py-2 text-right">Cuentas</th><th className="px-3 py-2 text-right">Inscripciones</th><th className="px-3 py-2 text-right">Pagos</th><th className="px-3 py-2 text-right">Ingresos</th></tr>
            </thead>
            <tbody className="divide-y divide-[var(--aula-border)]">
              {[...serie].reverse().map((x) => (
                <tr key={x.dia}>
                  <td className="px-3 py-1.5">{etiquetaDia(x.dia)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{x.cuentas}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{x.inscripciones}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{x.pagos}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{cop(x.ingresos)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
