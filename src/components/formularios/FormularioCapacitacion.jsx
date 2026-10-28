import { useId, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, CheckSquare, MessageCircle } from 'lucide-react';
import { enviarSolicitud } from '../../lib/solicitudes';
import { waLink } from '../../config/links';
import { trackEvent } from '../../utils/analytics';
import {
  AREAS_CAPACITACION, MODALIDADES, PERFILES_CAPACITACION, TIPOS_DE_ORGANIZACION,
} from '../../data/edvanta/capacitacion';
import { PAQUETES, paquetePorSlug } from '../../data/edvanta/servicios';

const INPUT = 'mt-1.5 block w-full rounded-xl border border-edvanta-border bg-white px-3.5 py-2.5 text-[15px] text-edvanta-deep outline-none transition focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/15 aria-[invalid=true]:border-red-500';
const LABEL = 'block text-sm font-semibold text-edvanta-deep';
const CHECK = 'mt-0.5 h-4 w-4 shrink-0 accent-[#082E86]';

const MODALIDADES_FORM = [
  ...MODALIDADES.map((m) => ({ value: m.value, label: m.titulo })),
  { value: 'por-definir', label: 'Todavía no lo sabemos' },
];

function Campo({ id, label, opcional, error, children }) {
  return (
    <div>
      <label htmlFor={id} className={LABEL}>
        {label}
        {opcional && <span className="font-normal text-edvanta-muted"> (opcional)</span>}
      </label>
      {children}
      {error && <p id={`${id}-error`} className="mt-1 text-sm font-medium text-red-700">{error}</p>}
    </div>
  );
}

export default function FormularioCapacitacion({
  areaInicial = null,
  paqueteInicial = null,
  boton = 'Solicitar propuesta',
}) {
  const uid = useId();
  const { pathname } = useLocation();
  const form = useRef(null);
  const areaList = useRef(null);
  const [datos, setDatos] = useState({
    institucion: '',
    tipoInstitucion: '',
    nombre: '',
    cargo: '',
    correo: '',
    whatsapp: '',
    pais: 'Colombia',
    ciudad: '',
    paquete: paqueteInicial || '',
    participantes: '',
    modalidad: '',
    resultadoEsperado: '',
    fechaTentativa: '',
    aceptaTratamiento: false,
    aceptaNovedades: false,
    sitioWeb: '',
  });
  const [areas, setAreas] = useState(() => (areaInicial ? [areaInicial] : []));
  const [sinArea, setSinArea] = useState(false);
  const [perfiles, setPerfiles] = useState([]);
  const [estado, setEstado] = useState('editando');
  const [error, setError] = useState(null);
  const [campo, setCampo] = useState(null);

  const id = (n) => `${uid}-${n}`;
  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setDatos((d) => ({ ...d, [name]: type === 'checkbox' ? checked : value }));
    if (campo === name) { setCampo(null); setError(null); }
  };
  const alternar = (lista, setLista, valor) => {
    setLista((actual) => (actual.includes(valor) ? actual.filter((v) => v !== valor) : [...actual, valor]));
    if (lista === areas) setSinArea(false);
    if (campo === 'areas' || campo === 'perfiles') { setCampo(null); setError(null); }
  };
  const marca = (n) => (campo === n ? { 'aria-invalid': true, 'aria-describedby': `${id(n)}-error` } : {});

  const areasElegidas = useMemo(
    () => AREAS_CAPACITACION.filter((a) => areas.includes(a.slug)),
    [areas],
  );
  const paqueteElegido = paquetePorSlug(datos.paquete);
  const referencia = datos.paquete || areas[0] || null;

  const enviar = async (e) => {
    e.preventDefault();
    setError(null);
    setCampo(null);

    if (!areas.length && !datos.paquete && !sinArea) {
      setError('Marca al menos un área, elige un paquete o indícanos que prefieres que te orientemos.');
      setCampo('areas');
      areaList.current?.focus();
      return;
    }
    if (!perfiles.length) {
      setError('Selecciona al menos un perfil que recibiría la capacitación.');
      setCampo('perfiles');
      form.current?.querySelector('[data-perfiles]')?.focus();
      return;
    }

    setEstado('enviando');
    const r = await enviarSolicitud({
      tipo: 'propuesta',
      referencia,
      nombre: datos.nombre,
      correo: datos.correo,
      whatsapp: datos.whatsapp || null,
      institucion: datos.institucion,
      tipoInstitucion: datos.tipoInstitucion,
      cargo: datos.cargo,
      areas: areasElegidas.map((a) => a.nombre),
      perfiles,
      participantes: datos.participantes || null,
      modalidad: datos.modalidad || null,
      resultadoEsperado: datos.resultadoEsperado,
      pais: datos.pais,
      ciudad: datos.ciudad,
      fechaTentativa: datos.fechaTentativa || null,
      mensaje: null,
      aceptaTratamiento: datos.aceptaTratamiento,
      aceptaNovedades: datos.aceptaNovedades,
      origen: pathname,
      sitioWeb: datos.sitioWeb,
    });

    if (r.ok) {
      setEstado('listo');
      trackEvent('solicitud_enviada', { tipo: 'propuesta', referencia, areas: areas.length, paquete: datos.paquete || null });
      return;
    }
    setEstado('editando');
    setError(r.error);
    setCampo(r.campo);
    if (r.campo === 'areas') areaList.current?.focus();
    else if (r.campo === 'perfiles') form.current?.querySelector('[data-perfiles]')?.focus();
    else if (r.campo) form.current?.querySelector(`[name="${r.campo}"]`)?.focus();
  };

  const mensajeWa = [
    'Hola, equipo Edvanta.',
    'Quiero solicitar una propuesta de capacitación para una organización.',
    datos.institucion && `Organización: ${datos.institucion}.`,
    areasElegidas.length > 0 && `Áreas de interés: ${areasElegidas.map((a) => a.nombre).join(', ')}.`,
    paqueteElegido && `Paquete de interés: ${paqueteElegido.nombre}.`,
    datos.nombre && `Contacto: ${datos.nombre}${datos.cargo ? `, ${datos.cargo}` : ''}.`,
  ].filter(Boolean).join(' ');

  if (estado === 'listo') {
    return (
      <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <p className="flex items-center gap-2 text-lg font-bold text-emerald-900">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          Recibimos tu solicitud
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-emerald-900">
          Gracias, {datos.nombre}. Revisaremos la información de {datos.institucion} y te escribiremos a {datos.correo} para coordinar la primera conversación.
        </p>
        {(areasElegidas.length > 0 || paqueteElegido) && (
          <div className="mt-4 rounded-xl bg-white/70 p-4 text-sm leading-6 text-emerald-950">
            <p className="font-bold">Lo que registramos</p>
            {paqueteElegido && <p>Paquete: {paqueteElegido.nombre}</p>}
            {areasElegidas.length > 0 && <p>Áreas: {areasElegidas.map((a) => a.nombre).join(', ')}</p>}
          </div>
        )}
      </div>
    );
  }

  return (
    <form ref={form} onSubmit={enviar} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo id={id('institucion')} label="Nombre de la organización" error={campo === 'institucion' && error}>
          <input id={id('institucion')} name="institucion" required maxLength={160} autoComplete="organization"
            value={datos.institucion} onChange={cambiar} className={INPUT} {...marca('institucion')} />
        </Campo>
        <Campo id={id('tipoInstitucion')} label="Tipo de organización" error={campo === 'tipoInstitucion' && error}>
          <select id={id('tipoInstitucion')} name="tipoInstitucion" required value={datos.tipoInstitucion} onChange={cambiar} className={INPUT} {...marca('tipoInstitucion')}>
            <option value="">Elige una opción</option>
            {TIPOS_DE_ORGANIZACION.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </Campo>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo id={id('nombre')} label="Nombre de la persona de contacto" error={campo === 'nombre' && error}>
          <input id={id('nombre')} name="nombre" required maxLength={120} autoComplete="name"
            value={datos.nombre} onChange={cambiar} className={INPUT} {...marca('nombre')} />
        </Campo>
        <Campo id={id('cargo')} label="Cargo" error={campo === 'cargo' && error}>
          <input id={id('cargo')} name="cargo" required maxLength={120} autoComplete="organization-title"
            value={datos.cargo} onChange={cambiar} className={INPUT} {...marca('cargo')} />
        </Campo>
        <Campo id={id('correo')} label="Correo electrónico" error={campo === 'correo' && error}>
          <input id={id('correo')} name="correo" type="email" required maxLength={254} autoComplete="email"
            value={datos.correo} onChange={cambiar} className={INPUT} {...marca('correo')} />
        </Campo>
        <Campo id={id('whatsapp')} label="Teléfono o WhatsApp" opcional error={campo === 'whatsapp' && error}>
          <input id={id('whatsapp')} name="whatsapp" type="tel" maxLength={40} autoComplete="tel"
            value={datos.whatsapp} onChange={cambiar} className={INPUT} {...marca('whatsapp')} />
        </Campo>
        <Campo id={id('pais')} label="País" error={campo === 'pais' && error}>
          <input id={id('pais')} name="pais" required maxLength={80} autoComplete="country-name"
            value={datos.pais} onChange={cambiar} className={INPUT} {...marca('pais')} />
        </Campo>
        <Campo id={id('ciudad')} label="Ciudad" error={campo === 'ciudad' && error}>
          <input id={id('ciudad')} name="ciudad" required maxLength={80} autoComplete="address-level2"
            value={datos.ciudad} onChange={cambiar} className={INPUT} {...marca('ciudad')} />
        </Campo>
      </div>

      <Campo id={id('paquete')} label="Paquete de interés" opcional>
        <select id={id('paquete')} name="paquete" value={datos.paquete} onChange={cambiar} className={INPUT}>
          <option value="">Quiero una propuesta a medida</option>
          {PAQUETES.map((p) => <option key={p.slug} value={p.slug}>{p.nombre} · {p.lema}</option>)}
        </select>
      </Campo>

      <fieldset
        id="areas-capacitacion"
        ref={areaList}
        tabIndex={-1}
        aria-describedby={id('areas-ayuda')}
        className="scroll-mt-28 rounded-2xl border border-edvanta-border bg-edvanta-bg/60 p-4 sm:p-5"
      >
        <legend className="px-1 text-base font-bold text-edvanta-deep">
          Áreas de interés <span className="font-normal text-edvanta-muted">(puedes marcar varias)</span>
        </legend>
        <p id={id('areas-ayuda')} className="mt-1 text-sm leading-6 text-edvanta-muted">
          Una misma propuesta puede combinar perfiles y áreas. Si no sabes cuál elegir, marca las que se acerquen a la necesidad y lo afinamos en la conversación.
        </p>
        <div className="mt-4 grid max-h-80 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
          {AREAS_CAPACITACION.map((a) => (
            <label key={a.slug} className="flex cursor-pointer items-start gap-2.5 rounded-xl bg-white px-3 py-2.5 text-sm leading-5 text-edvanta-deep ring-1 ring-inset ring-edvanta-border transition hover:ring-edvanta-blue/40">
              <input type="checkbox" checked={areas.includes(a.slug)} onChange={() => alternar(areas, setAreas, a.slug)} className={CHECK} />
              <span>{a.nombre}</span>
            </label>
          ))}
        </div>
        <label className="mt-3 flex cursor-pointer items-start gap-2.5 rounded-xl bg-white px-3 py-2.5 text-sm leading-5 text-edvanta-deep ring-1 ring-inset ring-edvanta-border">
          <input
            type="checkbox"
            checked={sinArea}
            onChange={() => {
              setSinArea((v) => !v);
              setAreas([]);
              setCampo(null);
              setError(null);
            }}
            className={CHECK}
          />
          <span>Todavía no lo sé. Prefiero que me orienten en la conversación.</span>
        </label>
        {areasElegidas.length > 0 && (
          <p className="mt-3 text-xs font-semibold text-edvanta-tealdark">
            {areasElegidas.length} {areasElegidas.length === 1 ? 'área seleccionada' : 'áreas seleccionadas'}.
          </p>
        )}
      </fieldset>

      <fieldset
        data-perfiles
        tabIndex={-1}
        aria-describedby={id('perfiles-ayuda')}
        className="scroll-mt-28 rounded-2xl border border-edvanta-border bg-white p-4 sm:p-5"
      >
        <legend className="px-1 text-base font-bold text-edvanta-deep">
          Perfiles que recibirían la capacitación <span className="font-normal text-edvanta-muted">(puedes marcar varios)</span>
        </legend>
        <p id={id('perfiles-ayuda')} className="mt-1 text-sm leading-6 text-edvanta-muted">
          Sirve para ajustar el nivel de responsabilidad y los ejemplos de cada grupo.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {PERFILES_CAPACITACION.map((p) => (
            <label key={p} className="flex cursor-pointer items-start gap-2.5 rounded-xl px-3 py-2 text-sm leading-5 text-edvanta-deep transition hover:bg-edvanta-bg">
              <input type="checkbox" checked={perfiles.includes(p)} onChange={() => alternar(perfiles, setPerfiles, p)} className={CHECK} />
              <span>{p}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo id={id('participantes')} label="Número aproximado de participantes" opcional error={campo === 'participantes' && error}>
          <input id={id('participantes')} name="participantes" type="number" min="1" max="10000" inputMode="numeric"
            value={datos.participantes} onChange={cambiar} className={INPUT} {...marca('participantes')} placeholder="Por ejemplo, 25" />
        </Campo>
        <Campo id={id('modalidad')} label="Modalidad preferida" opcional error={campo === 'modalidad' && error}>
          <select id={id('modalidad')} name="modalidad" value={datos.modalidad} onChange={cambiar} className={INPUT} {...marca('modalidad')}>
            <option value="">Elige una opción</option>
            {MODALIDADES_FORM.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </Campo>
      </div>

      <Campo id={id('resultadoEsperado')} label="Necesidad o resultado esperado" error={campo === 'resultadoEsperado' && error}>
        <textarea id={id('resultadoEsperado')} name="resultadoEsperado" rows={4} required maxLength={1500}
          value={datos.resultadoEsperado} onChange={cambiar} className={INPUT} {...marca('resultadoEsperado')}
          placeholder="Qué necesita el equipo, qué situaciones quiere resolver o qué espera que cambie después de la formación." />
      </Campo>

      <Campo id={id('fechaTentativa')} label="Fecha tentativa" opcional error={campo === 'fechaTentativa' && error}>
        <input id={id('fechaTentativa')} name="fechaTentativa" type="date" value={datos.fechaTentativa} onChange={cambiar} className={INPUT} />
      </Campo>

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id('sitioWeb')}>No llenar</label>
        <input id={id('sitioWeb')} name="sitioWeb" tabIndex={-1} autoComplete="off" value={datos.sitioWeb} onChange={cambiar} />
      </div>

      <div className="space-y-2.5 rounded-xl bg-edvanta-bg p-4">
        <label className="flex items-start gap-3 text-sm leading-relaxed text-edvanta-deep">
          <input type="checkbox" name="aceptaTratamiento" required checked={datos.aceptaTratamiento} onChange={cambiar}
            className={CHECK} {...marca('aceptaTratamiento')} />
          <span>
            Autorizo a Edvanta a usar estos datos para responder esta solicitud, según la{' '}
            <Link to="/tratamiento-de-datos" className="font-semibold text-edvanta-blue underline">política de tratamiento de datos</Link>.
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm leading-relaxed text-edvanta-muted">
          <input type="checkbox" name="aceptaNovedades" checked={datos.aceptaNovedades} onChange={cambiar} className={CHECK} />
          <span>Además, quiero recibir por correo novedades de cursos y recursos de Edvanta. (Opcional)</span>
        </label>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-semibold">{error}</p>
          {!campo && (
            <a href={waLink(mensajeWa)} target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 font-semibold text-red-900 underline">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Escribirnos por WhatsApp
            </a>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" disabled={estado === 'enviando'} className="ed-btn ed-btn--primary w-full sm:w-auto">
          <CheckSquare aria-hidden="true" />
          {estado === 'enviando' ? 'Enviando…' : boton}
        </button>
        <p className="text-xs leading-5 text-edvanta-muted">
          No publicamos precios ni duración porque dependen del alcance. Te enviamos la propuesta por escrito antes de decidir.
        </p>
      </div>
    </form>
  );
}
