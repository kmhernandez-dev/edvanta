/**
 * ============================================================
 *  InscripcionComunidad.jsx — Inscripción con encuesta y espacio del grupo
 *
 *  Va en la página de cada grupo de apoyo (/comunidades/:slug#inscripcion).
 *  La persona dice quién es, qué quiere encontrar y cómo prefiere
 *  aprender; si autoriza el tratamiento de datos sensibles, también qué
 *  le cuesta más y hace cuánto el diagnóstico. Al guardar ve su espacio:
 *  el paso para entrar por WhatsApp, las reglas, los artículos para
 *  empezar y, si le interesan, la guía y el curso del grupo.
 *
 *  Datos sensibles: las preguntas de salud solo aparecen al marcar la
 *  autorización expresa, y son opcionales (Ley 1581 de 2012).
 * ============================================================
 */

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Check, CheckCircle2, Lock, MessageCircle, Sparkles } from 'lucide-react';
import {
  DIFICULTADES, FORMATOS, INTERESES_COMUNIDAD, MAX_DIFICULTADES, ROLES_COMUNIDAD, TIEMPOS,
} from '../../data/encuestaComunidades';
import { waLink } from '../../config/links';
import { cortoDeComunidad } from '../../lib/comunidades/seo';
import {
  enviarInscripcion, inscripcionRecordada, olvidarInscripcion, recordarInscripcion, utmDeLaDireccion,
} from '../../lib/comunidades/inscripcion';
import { trackEvent } from '../../utils/analytics';

const PAISES = ['Colombia', 'México', 'Perú', 'Chile', 'Argentina', 'Ecuador', 'Venezuela', 'Bolivia', 'Guatemala', 'Costa Rica', 'Panamá', 'República Dominicana', 'España', 'Estados Unidos'];

const campo = 'mt-1 block min-h-11 w-full rounded-xl border border-edvanta-border bg-white px-3.5 text-[15px] text-edvanta-deep outline-none transition focus:border-edvanta-teal focus:ring-4 focus:ring-edvanta-teal/15';

function Chip({ activo, onClick, children, deshabilitado = false, tipo = 'checkbox' }) {
  return (
    <button
      type="button"
      role={tipo}
      aria-checked={activo}
      disabled={deshabilitado && !activo}
      onClick={onClick}
      className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-left text-sm font-semibold transition ${
        activo
          ? 'border-edvanta-blue bg-edvanta-blue text-white shadow-[0_8px_18px_-12px_rgba(8,46,134,.9)]'
          : 'border-edvanta-border bg-white text-edvanta-deep hover:border-edvanta-teal/60 hover:bg-edvanta-mint/40 disabled:cursor-not-allowed disabled:opacity-45'
      }`}
    >
      {activo && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
      {children}
    </button>
  );
}

function Pregunta({ n, titulo, ayuda, children }) {
  return (
    <fieldset className="border-t border-edvanta-border pt-5 first:border-t-0 first:pt-0">
      <legend className="flex items-baseline gap-2 font-display text-base font-bold text-edvanta-deep">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-edvanta-mint text-xs font-extrabold text-edvanta-tealdark">{n}</span>
        {titulo}
      </legend>
      {ayuda && <p className="mt-1 pl-8 text-sm text-edvanta-muted">{ayuda}</p>}
      <div className="mt-3 flex flex-wrap gap-2 pl-8">{children}</div>
    </fieldset>
  );
}

/** El espacio de la persona inscrita: el siguiente paso y lo que tiene para empezar. */
function EspacioGrupo({ comunidad, nombre, intereses = [], relacionados = [], onOtra }) {
  const corto = cortoDeComunidad(comunidad);
  const primer = String(nombre || '').trim().split(/\s+/)[0] || '';
  const entrar = waLink(`Hola Karla, soy ${primer}. Me inscribí en el grupo de apoyo de ${corto} en edvanta.co y quiero entrar. ¿Me compartes las reglas?`);
  const quiereAprender = intereses.includes('cursos') || intereses.includes('guias');
  const guia = comunidad.guia?.publico === 'pacientes' ? comunidad.guia : null;

  return (
    <div className="overflow-hidden rounded-[28px] border border-edvanta-teal/30 bg-white shadow-[0_30px_70px_-40px_rgba(3,29,92,.55)]">
      <div className="bg-gradient-to-br from-edvanta-mint/70 via-white to-white p-6 sm:p-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark ring-1 ring-edvanta-teal/25">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Inscripción lista
        </p>
        <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight text-edvanta-deep sm:text-3xl">
          {primer ? `${primer}, este es tu espacio en el grupo de apoyo de ${corto}` : `Tu espacio en el grupo de apoyo de ${corto}`}
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-7 text-edvanta-ink/80">
          Falta un paso: escribir por WhatsApp para entrar al grupo. Con tus respuestas preparamos los temas, los artículos y las charlas.
        </p>
        <a
          href={entrar}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('community_join_clicked', { enfermedad: comunidad.slug, origen: 'espacio', destino: 'whatsapp' })}
          className="ed-btn ed-btn--whatsapp ed-btn--lg mt-5"
        >
          <MessageCircle aria-hidden="true" />
          Entrar al grupo por WhatsApp
        </a>
      </div>

      <div className="grid gap-4 border-t border-edvanta-border p-6 sm:grid-cols-2 sm:p-8">
        <a href="#reglas" className="group rounded-2xl border border-edvanta-border p-4 transition hover:border-edvanta-teal/50">
          <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">Antes de entrar</p>
          <p className="mt-1 font-display text-base font-bold text-edvanta-deep group-hover:text-edvanta-blue">Lee las reglas del grupo</p>
          <p className="mt-1 text-sm leading-6 text-edvanta-muted">Sin dosis por chat, con privacidad y sin reemplazar la consulta.</p>
        </a>
        {relacionados.length > 0 && (
          <div className="rounded-2xl border border-edvanta-border p-4">
            <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">Para empezar hoy</p>
            <ul className="mt-2 space-y-1.5">
              {relacionados.slice(0, 3).map((a) => (
                <li key={a.slug}>
                  <Link to={`/articulos/${a.slug}`} className="inline-flex items-start gap-1.5 text-sm font-semibold leading-6 text-edvanta-blue hover:underline">
                    <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {(quiereAprender || guia) && (guia || comunidad.curso) && (
          <div className="rounded-2xl border border-edvanta-blue/15 bg-edvanta-light/60 p-4 sm:col-span-2">
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.12em] text-edvanta-blue">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Para aprender a fondo
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              {guia && (
                <Link to={guia.ruta} onClick={() => trackEvent('guide_clicked', { enfermedad: comunidad.slug, origen: 'espacio', tipo: 'paciente' })} className="ed-btn ed-btn--primary ed-btn--sm">
                  Guía: {guia.nombre}
                </Link>
              )}
              {comunidad.curso && (
                <Link to={comunidad.curso.ruta} onClick={() => trackEvent('course_clicked', { enfermedad: comunidad.slug, origen: 'espacio', curso: comunidad.curso.ruta })} className={`ed-btn ed-btn--sm ${guia ? 'ed-btn--outline' : 'ed-btn--primary'}`}>
                  <BookOpen aria-hidden="true" />
                  Curso: {comunidad.curso.nombre}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
      <p className="border-t border-edvanta-border px-6 py-3 text-xs text-edvanta-muted sm:px-8">
        ¿Quieres inscribir a otra persona?{' '}
        <button type="button" onClick={onOtra} className="font-semibold text-edvanta-blue underline underline-offset-2">Abrir el formulario de nuevo</button>
      </p>
    </div>
  );
}

export default function InscripcionComunidad({ comunidad, relacionados = [] }) {
  const corto = cortoDeComunidad(comunidad);
  const dificultades = DIFICULTADES[comunidad.slug] || [];
  const rolInicial = useMemo(() => {
    try {
      const r = new URLSearchParams(window.location.search).get('rol');
      return ROLES_COMUNIDAD.some(([k]) => k === r) ? r : '';
    } catch { return ''; }
  }, []);

  const [recordada, setRecordada] = useState(null);
  const [hecho, setHecho] = useState(null);
  const [f, setF] = useState({
    rol: rolInicial, intereses: [], formato: '', tiempo: '', dificultades: [], pregunta: '',
    nombre: '', correo: '', whatsapp: '', pais: 'Colombia', sitioWeb: '',
    aceptaTratamiento: false, aceptaDatosSensibles: false, aceptaNovedades: false,
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState({ texto: '', campo: null });

  useEffect(() => { setRecordada(inscripcionRecordada(comunidad.slug)); }, [comunidad.slug]);

  const poner = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const alternar = (k, id, max = Infinity) => setF((x) => {
    const tiene = x[k].includes(id);
    if (!tiene && x[k].length >= max) return x;
    return { ...x, [k]: tiene ? x[k].filter((y) => y !== id) : [...x[k], id] };
  });

  const enviar = async (e) => {
    e.preventDefault();
    if (!f.rol) { setError({ texto: 'Cuéntanos quién eres para preparar el grupo.', campo: 'rol' }); return; }
    if (!f.aceptaTratamiento) { setError({ texto: 'Para inscribirte necesitamos tu autorización para usar estos datos.', campo: 'aceptaTratamiento' }); return; }
    setEnviando(true);
    setError({ texto: '', campo: null });
    const sensibles = f.aceptaDatosSensibles;
    const r = await enviarInscripcion(comunidad.slug, {
      nombre: f.nombre,
      correo: f.correo,
      whatsapp: f.whatsapp || undefined,
      pais: f.pais || undefined,
      rol: f.rol,
      intereses: f.intereses,
      formato: f.formato || undefined,
      aceptaDatosSensibles: sensibles,
      tiempo: sensibles ? f.tiempo || undefined : undefined,
      dificultades: sensibles ? f.dificultades : [],
      pregunta: sensibles ? f.pregunta || undefined : undefined,
      aceptaTratamiento: true,
      aceptaNovedades: f.aceptaNovedades,
      sitioWeb: f.sitioWeb || undefined,
      origen: typeof window !== 'undefined' ? window.location.pathname : undefined,
      ...utmDeLaDireccion(),
    });
    setEnviando(false);
    if (!r.ok) { setError({ texto: r.error, campo: r.campo }); return; }
    trackEvent('community_signup', {
      enfermedad: comunidad.slug, rol: f.rol, intereses: f.intereses.join(','), formato: f.formato || '', sensibles, novedades: f.aceptaNovedades,
    });
    recordarInscripcion(comunidad.slug, f.nombre);
    setHecho({ nombre: f.nombre, intereses: f.intereses });
  };

  const otra = () => {
    olvidarInscripcion(comunidad.slug);
    setRecordada(null);
    setHecho(null);
    setF((x) => ({ ...x, nombre: '', correo: '', whatsapp: '', pregunta: '', dificultades: [], tiempo: '' }));
  };

  return (
    <section id="inscripcion" className="scroll-mt-24 border-b border-edvanta-border bg-gradient-to-b from-white to-edvanta-bg/60">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {hecho || recordada ? (
          <EspacioGrupo
            comunidad={comunidad}
            nombre={(hecho || recordada).nombre}
            intereses={hecho?.intereses || []}
            relacionados={relacionados}
            onOtra={otra}
          />
        ) : (
          <div className="overflow-hidden rounded-[28px] border border-edvanta-border bg-white shadow-[0_30px_70px_-44px_rgba(3,29,92,.5)]">
            <div className="bg-[linear-gradient(135deg,#031D5C_0%,#082E86_62%,#0A3AA6_100%)] p-6 text-white sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-[#AFC0E3]">Inscripción gratis · 1 minuto</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold leading-tight sm:text-3xl">Inscríbete al grupo de apoyo de {corto}</h2>
              <p className="mt-2 max-w-2xl text-[15px] leading-7 text-white/85">
                Cuéntanos quién eres y qué quieres encontrar. Con tus respuestas preparamos los temas del grupo y te damos el acceso por WhatsApp.
              </p>
            </div>

            <form onSubmit={enviar} noValidate className="space-y-6 p-6 sm:p-8">
              <div className="space-y-5">
                <Pregunta n="1" titulo="¿Quién eres?">
                  {ROLES_COMUNIDAD.map(([id, t]) => (
                    <Chip key={id} tipo="radio" activo={f.rol === id} onClick={() => poner('rol', id)}>{t}</Chip>
                  ))}
                </Pregunta>
                <Pregunta n="2" titulo="¿Qué te gustaría encontrar en el grupo?" ayuda="Elige todas las que quieras.">
                  {INTERESES_COMUNIDAD.map(([id, t]) => (
                    <Chip key={id} activo={f.intereses.includes(id)} onClick={() => alternar('intereses', id)}>{t}</Chip>
                  ))}
                </Pregunta>
                <Pregunta n="3" titulo="¿Cómo prefieres aprender?">
                  {FORMATOS.map(([id, t]) => (
                    <Chip key={id} tipo="radio" activo={f.formato === id} onClick={() => poner('formato', f.formato === id ? '' : id)}>{t}</Chip>
                  ))}
                </Pregunta>
              </div>

              <div className="rounded-2xl border border-edvanta-teal/25 bg-edvanta-mint/30 p-4 sm:p-5">
                <label className="flex cursor-pointer gap-3 text-sm leading-6 text-edvanta-ink/85">
                  <input type="checkbox" checked={f.aceptaDatosSensibles} onChange={(e) => poner('aceptaDatosSensibles', e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[#0F7480]" />
                  <span>
                    <span className="inline-flex items-center gap-1.5 font-bold text-edvanta-deep"><Lock className="h-3.5 w-3.5" aria-hidden="true" />Quiero responder también preguntas de salud (opcional)</span>
                    <br />
                    Autorizo de forma expresa el tratamiento de mis respuestas sobre salud para organizar los temas del grupo. Son datos sensibles: no estoy obligado a responderlas, no se comparten con nadie y puedo pedir que se borren.
                  </span>
                </label>
                {f.aceptaDatosSensibles && (
                  <div className="mt-5 space-y-5">
                    <Pregunta n="4" titulo="¿Hace cuánto el diagnóstico? (tuyo o de la persona que cuidas)">
                      {TIEMPOS.map(([id, t]) => (
                        <Chip key={id} tipo="radio" activo={f.tiempo === id} onClick={() => poner('tiempo', f.tiempo === id ? '' : id)}>{t}</Chip>
                      ))}
                    </Pregunta>
                    {dificultades.length > 0 && (
                      <Pregunta n="5" titulo="¿Qué te cuesta más hoy?" ayuda={`Hasta ${MAX_DIFICULTADES}: así sabemos por dónde empezar.`}>
                        {dificultades.map(([id, t]) => (
                          <Chip key={id} activo={f.dificultades.includes(id)} deshabilitado={f.dificultades.length >= MAX_DIFICULTADES}
                            onClick={() => alternar('dificultades', id, MAX_DIFICULTADES)}>{t}</Chip>
                        ))}
                      </Pregunta>
                    )}
                    <label className="block pl-8 text-sm font-semibold text-edvanta-deep">
                      ¿Qué pregunta te gustaría que respondiéramos en el grupo? (opcional)
                      <textarea value={f.pregunta} onChange={(e) => poner('pregunta', e.target.value)} maxLength={500} rows={2}
                        className={`${campo} min-h-20 resize-y py-2.5`} placeholder="Sin datos de otras personas ni resultados de exámenes." />
                    </label>
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-edvanta-deep">Tu nombre
                  <input required autoComplete="given-name" value={f.nombre} onChange={(e) => poner('nombre', e.target.value)} maxLength={120} className={campo} aria-invalid={error.campo === 'nombre'} />
                </label>
                <label className="text-sm font-semibold text-edvanta-deep">Tu correo
                  <input required type="email" autoComplete="email" value={f.correo} onChange={(e) => poner('correo', e.target.value)} className={campo} aria-invalid={error.campo === 'correo'} />
                </label>
                <label className="text-sm font-semibold text-edvanta-deep">Tu WhatsApp <span className="font-normal text-edvanta-muted">(para darte el acceso)</span>
                  <input type="tel" autoComplete="tel" value={f.whatsapp} onChange={(e) => poner('whatsapp', e.target.value)} maxLength={40} placeholder="+57 300 000 0000" className={campo} aria-invalid={error.campo === 'whatsapp'} />
                </label>
                <label className="text-sm font-semibold text-edvanta-deep">País
                  <input list="paises-grupo" value={f.pais} onChange={(e) => poner('pais', e.target.value)} maxLength={80} className={campo} />
                  <datalist id="paises-grupo">{PAISES.map((p) => <option key={p} value={p} />)}</datalist>
                </label>
              </div>
              {/* Campo trampa: las personas no lo ven; los robots lo llenan. */}
              <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.sitioWeb} onChange={(e) => poner('sitioWeb', e.target.value)} className="absolute -left-[9999px] h-0 w-0 opacity-0" />

              <div className="space-y-2.5 text-sm leading-6 text-edvanta-ink/85">
                <label className="flex cursor-pointer gap-3">
                  <input type="checkbox" checked={f.aceptaTratamiento} onChange={(e) => poner('aceptaTratamiento', e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[#082E86]" aria-invalid={error.campo === 'aceptaTratamiento'} />
                  <span>Autorizo a Edvanta a usar mis datos para inscribirme en el grupo de apoyo de {corto} y darme el acceso, según la <Link to="/tratamiento-de-datos" className="font-semibold text-edvanta-blue underline">política de tratamiento de datos</Link>.</span>
                </label>
                <label className="flex cursor-pointer gap-3">
                  <input type="checkbox" checked={f.aceptaNovedades} onChange={(e) => poner('aceptaNovedades', e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[#082E86]" />
                  <span>Quiero recibir por correo artículos, guías y cursos sobre {corto}. (Opcional)</span>
                </label>
              </div>

              {error.texto && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error.texto}</p>}

              <div className="flex flex-wrap items-center gap-4">
                <button type="submit" disabled={enviando} className="ed-btn ed-btn--primary ed-btn--lg">
                  {enviando ? 'Guardando…' : 'Inscribirme gratis'}
                  {!enviando && <ArrowRight aria-hidden="true" />}
                </button>
                <p className="text-xs leading-5 text-edvanta-muted">Gratis. Dentro del grupo no se vende nada.<br />No reemplaza la consulta ni el tratamiento.</p>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
