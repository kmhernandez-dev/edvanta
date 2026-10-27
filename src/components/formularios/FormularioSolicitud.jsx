/**
 * ============================================================
 *  FormularioSolicitud.jsx — Un formulario, tres usos
 *
 *   · interes    — «avísenme cuando abra» (curso o ruta sin fecha)
 *   · propuesta  — una institución que quiere una propuesta
 *   · contacto   — una pregunta general
 *
 *  Pide lo mínimo para poder responder. No pregunta por diagnósticos
 *  ni tratamientos, y en las páginas de pacientes lo advierte. La
 *  autorización para responder es obligatoria; la de recibir novedades
 *  va aparte y es opcional.
 *
 *  Solo dice «recibido» cuando el servidor guardó la solicitud. Si
 *  falla, lo dice y ofrece WhatsApp con el mensaje ya escrito.
 * ============================================================
 */

import { useId, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { enviarSolicitud } from '../../lib/solicitudes';
import { waLink } from '../../config/links';
import { trackEvent } from '../../utils/analytics';

const ROLES = {
  auxiliar: 'Auxiliar de farmacia',
  regente: 'Regente de farmacia',
  quimico: 'Químico farmacéutico',
  otro_profesional: 'Otro profesional de la salud',
  estudiante: 'Estudiante',
  paciente: 'Paciente',
  cuidador: 'Cuidador o familiar',
  otro: 'Otro',
};

const TIPOS_DE_INSTITUCION = {
  hospital: 'Hospital o clínica',
  ips: 'IPS',
  eps: 'EPS',
  laboratorio: 'Laboratorio farmacéutico',
  distribuidora: 'Distribuidora o droguería',
  empresa: 'Otra empresa',
  otra: 'Otra institución',
};

const INPUT = 'mt-1.5 block w-full rounded-xl border border-edvanta-border bg-white px-3.5 py-2.5 text-[15px] text-edvanta-deep outline-none transition focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/15 aria-[invalid=true]:border-red-500';
const LABEL = 'block text-sm font-semibold text-edvanta-deep';

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

/**
 * @param tipo        'interes' | 'propuesta' | 'contacto'
 * @param referencia  identificador de lo que se pide (producto, ruta, paquete)
 * @param roles       claves de ROLES que se ofrecen (interés y contacto)
 * @param paquetes    [{ slug, nombre }] para elegir en una propuesta
 * @param pacientes   true en páginas para pacientes: advierte no escribir datos de salud
 * @param exito       texto que se muestra al guardar
 * @param boton       texto del botón
 * @param resumenWa   qué se pide, para armar el mensaje de WhatsApp si algo falla
 */
export default function FormularioSolicitud({
  tipo,
  referencia = null,
  roles = [],
  paquetes = [],
  pacientes = false,
  exito,
  boton = 'Enviar',
  resumenWa = '',
}) {
  const uid = useId();
  const { pathname } = useLocation();
  const form = useRef(null);
  const [datos, setDatos] = useState({
    nombre: '', correo: '', whatsapp: '', rol: '', institucion: '', tipoInstitucion: '',
    cargo: '', paquete: referencia || '', mensaje: '', aceptaTratamiento: false, aceptaNovedades: false, sitioWeb: '',
  });
  const [estado, setEstado] = useState('editando'); // editando | enviando | listo
  const [error, setError] = useState(null);
  const [campo, setCampo] = useState(null);

  const id = (n) => `${uid}-${n}`;
  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setDatos((d) => ({ ...d, [name]: type === 'checkbox' ? checked : value }));
    if (campo === name) { setCampo(null); setError(null); }
  };
  const marca = (n) => (campo === n ? { 'aria-invalid': true, 'aria-describedby': `${id(n)}-error` } : {});

  const enviar = async (e) => {
    e.preventDefault();
    setEstado('enviando');
    setError(null);
    setCampo(null);
    const r = await enviarSolicitud({
      tipo,
      referencia: tipo === 'propuesta' ? (datos.paquete || null) : referencia,
      nombre: datos.nombre,
      correo: datos.correo,
      whatsapp: datos.whatsapp || null,
      rol: datos.rol || null,
      institucion: datos.institucion || null,
      tipoInstitucion: datos.tipoInstitucion || null,
      cargo: datos.cargo || null,
      mensaje: datos.mensaje || null,
      aceptaTratamiento: datos.aceptaTratamiento,
      aceptaNovedades: datos.aceptaNovedades,
      origen: pathname,
      sitioWeb: datos.sitioWeb,
    });
    if (r.ok) {
      setEstado('listo');
      trackEvent('solicitud_enviada', { tipo, referencia: referencia || datos.paquete || null });
      return;
    }
    setEstado('editando');
    setError(r.error);
    setCampo(r.campo);
    if (r.campo) form.current?.querySelector(`[name="${r.campo}"]`)?.focus();
  };

  const mensajeWa = [
    'Hola, equipo Edvanta.',
    resumenWa || 'Quiero hacerles una consulta.',
    datos.nombre && `Mi nombre es ${datos.nombre}.`,
    datos.institucion && `Institución: ${datos.institucion}.`,
  ].filter(Boolean).join(' ');

  if (estado === 'listo') {
    return (
      <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <p className="flex items-center gap-2 text-lg font-bold text-emerald-900">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          Recibimos tu solicitud
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-emerald-900">
          {exito || 'Te responderemos al correo que escribiste.'} Lo enviaste a nombre de {datos.nombre}, {datos.correo}.
        </p>
      </div>
    );
  }

  return (
    <form ref={form} onSubmit={enviar} className="space-y-4">
      {pacientes && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
          No escribas aquí información sobre tu salud, tu diagnóstico ni tu tratamiento. Solo necesitamos
          saber cómo avisarte.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo id={id('nombre')} label="Tu nombre" error={campo === 'nombre' && error}>
          <input id={id('nombre')} name="nombre" required maxLength={120} autoComplete="name"
            value={datos.nombre} onChange={cambiar} className={INPUT} {...marca('nombre')} />
        </Campo>
        <Campo id={id('correo')} label="Correo" error={campo === 'correo' && error}>
          <input id={id('correo')} name="correo" type="email" required maxLength={254} autoComplete="email"
            value={datos.correo} onChange={cambiar} className={INPUT} {...marca('correo')} />
        </Campo>
      </div>

      {tipo === 'propuesta' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo id={id('institucion')} label="Institución o empresa" error={campo === 'institucion' && error}>
            <input id={id('institucion')} name="institucion" required maxLength={160} autoComplete="organization"
              value={datos.institucion} onChange={cambiar} className={INPUT} {...marca('institucion')} />
          </Campo>
          <Campo id={id('tipoInstitucion')} label="Tipo de institución" opcional>
            <select id={id('tipoInstitucion')} name="tipoInstitucion" value={datos.tipoInstitucion} onChange={cambiar} className={INPUT}>
              <option value="">Elige una opción</option>
              {Object.entries(TIPOS_DE_INSTITUCION).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </Campo>
          <Campo id={id('cargo')} label="Tu cargo" opcional>
            <input id={id('cargo')} name="cargo" maxLength={120} autoComplete="organization-title"
              value={datos.cargo} onChange={cambiar} className={INPUT} />
          </Campo>
          {paquetes.length > 0 && (
            <Campo id={id('paquete')} label="Qué les interesa" opcional>
              <select id={id('paquete')} name="paquete" value={datos.paquete} onChange={cambiar} className={INPUT}>
                <option value="">Aún no lo sé</option>
                {paquetes.map((p) => <option key={p.slug} value={p.slug}>{p.nombre}</option>)}
              </select>
            </Campo>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {roles.length > 0 && (
          <Campo id={id('rol')} label={pacientes ? 'Eres' : 'Tu rol'} opcional error={campo === 'rol' && error}>
            <select id={id('rol')} name="rol" value={datos.rol} onChange={cambiar} className={INPUT} {...marca('rol')}>
              <option value="">Elige una opción</option>
              {roles.map((r) => <option key={r} value={r}>{ROLES[r]}</option>)}
            </select>
          </Campo>
        )}
        <Campo id={id('whatsapp')} label="WhatsApp" opcional error={campo === 'whatsapp' && error}>
          <input id={id('whatsapp')} name="whatsapp" type="tel" maxLength={40} autoComplete="tel"
            value={datos.whatsapp} onChange={cambiar} className={INPUT} {...marca('whatsapp')} />
        </Campo>
      </div>

      {(tipo === 'propuesta' || tipo === 'contacto') && (
        <Campo
          id={id('mensaje')}
          label={tipo === 'propuesta' ? 'Cuéntanos qué necesitan' : 'Tu mensaje'}
          opcional={tipo === 'propuesta'}
          error={campo === 'mensaje' && error}
        >
          <textarea id={id('mensaje')} name="mensaje" rows={4} maxLength={1500} required={tipo === 'contacto'}
            value={datos.mensaje} onChange={cambiar} className={INPUT} {...marca('mensaje')}
            placeholder={tipo === 'propuesta' ? 'Población, temas, número de personas, fechas que tengan en mente…' : ''} />
        </Campo>
      )}

      {/* Campo trampa para robots: invisible y fuera del orden de tabulación. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id('sitioWeb')}>No llenar</label>
        <input id={id('sitioWeb')} name="sitioWeb" tabIndex={-1} autoComplete="off" value={datos.sitioWeb} onChange={cambiar} />
      </div>

      <div className="space-y-2.5 rounded-xl bg-edvanta-bg p-4">
        <label className="flex items-start gap-3 text-sm leading-relaxed text-edvanta-deep">
          <input type="checkbox" name="aceptaTratamiento" required checked={datos.aceptaTratamiento} onChange={cambiar}
            className="mt-1 h-4 w-4 shrink-0 accent-[#082E86]" {...marca('aceptaTratamiento')} />
          <span>
            Autorizo a Edvanta a usar estos datos para responder esta solicitud, según la{' '}
            <Link to="/tratamiento-de-datos" className="font-semibold text-edvanta-blue underline">política de tratamiento de datos</Link>.
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm leading-relaxed text-edvanta-muted">
          <input type="checkbox" name="aceptaNovedades" checked={datos.aceptaNovedades} onChange={cambiar}
            className="mt-1 h-4 w-4 shrink-0 accent-[#082E86]" />
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

      <button
        type="submit"
        disabled={estado === 'enviando'}
        className="ed-btn ed-btn--primary w-full sm:w-auto"
      >
        {estado === 'enviando' ? 'Enviando…' : boton}
      </button>
    </form>
  );
}
