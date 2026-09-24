/**
 * ============================================================
 *  CvExpres.jsx — Hoja de vida en cuatro pasos
 *
 *  El camino corto: datos, experiencia, estudios y diseño. Cada
 *  paso trae ayudas para no quedarse mirando la hoja en blanco:
 *  títulos sugeridos, fechas por selector, logros de ejemplo del
 *  cargo, habilidades de un clic y un perfil redactado con lo que
 *  la persona ya escribió.
 *
 *  Es el mismo `cv` del editor completo: se puede saltar de uno a
 *  otro sin perder nada.
 * ============================================================
 */

import { useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowRight, Briefcase, Check, Copy, Download, GraduationCap, Lightbulb, Plus,
  Save, Sparkles, Trash2, Upload, User, Wand2, X,
} from 'lucide-react';
import { GaleriaPlantillas } from './plantillasUi';
import {
  anosDeExperiencia, cargosSugeridos, redactarPerfil, sugerenciasDeHabilidades, sugerenciasDeLogros, VERBOS,
} from '../../lib/cv/redaccion';

const PASOS = [
  { n: 1, titulo: 'Tus datos', minutos: '1 min', icono: User },
  { n: 2, titulo: 'Experiencia', minutos: '2 min', icono: Briefcase },
  { n: 3, titulo: 'Estudios y habilidades', minutos: '1 min', icono: GraduationCap },
  { n: 4, titulo: 'Diseño y descarga', minutos: '1 min', icono: Sparkles },
];

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const ANIOS = Array.from({ length: 45 }, (_, i) => String(new Date().getFullYear() - i));

const input = 'min-h-11 w-full rounded-xl border border-edvanta-border bg-white px-3.5 text-sm outline-none transition focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/15';
const etiqueta = 'mb-1 block text-sm font-bold text-edvanta-deep';

function Campo({ label, hint, children, requerido }) {
  return (
    <label className="block">
      <span className={etiqueta}>
        {label} {requerido && <span className="text-rose-600">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs leading-4 text-edvanta-muted">{hint}</span>}
    </label>
  );
}

function Chip({ children, onClick, tono = 'claro', titulo }) {
  const tonos = {
    claro: 'border-edvanta-border bg-white text-edvanta-deep hover:border-edvanta-blue/50 hover:text-edvanta-blue',
    activo: 'border-edvanta-blue bg-edvanta-blue text-white',
    suave: 'border-transparent bg-edvanta-light text-edvanta-blue hover:bg-edvanta-soft',
  };
  return (
    <button type="button" onClick={onClick} title={titulo} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${tonos[tono]}`}>
      {children}
    </button>
  );
}

/** Mes y año en dos selectores: evita formatos raros y se llena en dos clics. */
function SelectorFecha({ valor, onChange, permitirActual = false, actual = false, onActual }) {
  const [mes, anio] = (() => {
    const m = String(valor || '').trim().match(/^([A-Za-zÁÉÍÓÚáéíóú]{3,})\.?\s+((?:19|20)\d{2})$/);
    if (m) {
      const corto = m[1].slice(0, 3);
      return [MESES.find((x) => x.toLowerCase() === corto.toLowerCase()) || '', m[2]];
    }
    const soloAnio = String(valor || '').trim().match(/^((?:19|20)\d{2})$/);
    return soloAnio ? ['', soloAnio[1]] : ['', ''];
  })();

  const armar = (nuevoMes, nuevoAnio) => {
    if (!nuevoAnio) return onChange('');
    return onChange(nuevoMes ? `${nuevoMes} ${nuevoAnio}` : nuevoAnio);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select value={mes} onChange={(e) => armar(e.target.value, anio)} disabled={actual} className={`${input} w-24 disabled:opacity-50`} aria-label="Mes">
        <option value="">Mes</option>
        {MESES.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
      <select value={anio} onChange={(e) => armar(mes, e.target.value)} disabled={actual} className={`${input} w-28 disabled:opacity-50`} aria-label="Año">
        <option value="">Año</option>
        {ANIOS.map((a) => <option key={a} value={a}>{a}</option>)}
      </select>
      {permitirActual && (
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-edvanta-deep">
          <input type="checkbox" checked={actual} onChange={(e) => onActual(e.target.checked)} className="h-4 w-4 rounded border-edvanta-strong text-edvanta-blue focus:ring-edvanta-blue" />
          Trabajo aquí
        </label>
      )}
    </div>
  );
}

/** Logros como lista de frases: una por línea, con sugerencias del cargo. */
function Logros({ valor, onChange, sugerencias }) {
  const lineas = String(valor || '').split('\n');
  const items = lineas.length ? lineas : [''];
  const guardar = (nuevas) => onChange(nuevas.filter((l, i) => l.trim() || i === nuevas.length - 1).join('\n'));
  const cambiar = (i, texto) => guardar(items.map((l, j) => (j === i ? texto : l)));
  const quitar = (i) => guardar(items.filter((_, j) => j !== i));
  const agregar = (texto = '') => onChange([...items.filter((l) => l.trim()), texto].join('\n'));

  return (
    <div>
      <span className={etiqueta}>Logros <span className="font-normal text-edvanta-muted">(2 a 4 por cargo)</span></span>
      <div className="flex flex-col gap-2">
        {items.map((l, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-edvanta-teal" aria-hidden="true" />
            <textarea
              value={l}
              onChange={(e) => cambiar(i, e.target.value.replace(/\n/g, ' '))}
              rows={2}
              placeholder="Reduje 25 % el tiempo de liberación de lotes con un plan de muestreo."
              className="w-full rounded-xl border border-edvanta-border p-3 text-sm leading-6 outline-none transition focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/15"
            />
            {items.length > 1 && (
              <button type="button" onClick={() => quitar(i)} aria-label="Quitar logro" className="mt-2 rounded-lg p-1.5 text-edvanta-subtle transition hover:bg-rose-50 hover:text-rose-700">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <Chip onClick={() => agregar('')} tono="suave"><Plus className="h-3 w-3" aria-hidden="true" /> Agregar logro</Chip>
        {VERBOS.slice(0, 6).map((v) => (
          <Chip key={v} onClick={() => agregar(`${v} `)} titulo={`Empezar un logro con «${v}»`}>{v}…</Chip>
        ))}
      </div>

      {sugerencias.length > 0 && (
        <div className="mt-3 rounded-xl border border-edvanta-border bg-edvanta-bg p-3">
          <p className="flex items-center gap-1.5 text-xs font-bold text-edvanta-deep">
            <Lightbulb className="h-3.5 w-3.5 text-edvanta-blue" aria-hidden="true" /> Ejemplos para tu cargo (cámbialos por tus datos reales)
          </p>
          <div className="mt-2 flex flex-col gap-1.5">
            {sugerencias.slice(0, 3).map((s) => (
              <button key={s} type="button" onClick={() => agregar(s)} className="rounded-lg border border-edvanta-border bg-white px-3 py-2 text-left text-xs leading-5 text-edvanta-muted transition hover:border-edvanta-blue/40 hover:text-edvanta-deep">
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Componente principal ─────────────────────────────────── */

export default function CvExpres({
  cv, cargoObjetivo, setCargoObjetivo, plantillaId, setPlantillaId, acciones, vistaPrevia,
  fotoError, descargar, guardar, copiarTexto, academiaUser, onCrearCuenta, irAEditorCompleto, analysis,
}) {
  const [paso, setPaso] = useState(1);
  const cargos = useMemo(() => cargosSugeridos(), []);
  const anos = useMemo(() => anosDeExperiencia(cv.experiencia), [cv.experiencia]);
  const habilidadesSugeridas = useMemo(
    () => sugerenciasDeHabilidades(cargoObjetivo, cv.habilidades),
    [cargoObjetivo, cv.habilidades],
  );

  const listo = {
    1: Boolean(cv.nombre && cv.titulo && (cv.email || cv.telefono)),
    2: cv.experiencia.some((e) => e.cargo),
    3: cv.educacion.some((e) => e.titulo) || cv.habilidades.length >= 3,
    4: Boolean(cv.resumen),
  };
  const avance = Math.round((Object.values(listo).filter(Boolean).length / 4) * 100);

  const elegirTitulo = (c) => {
    acciones.setField('titulo', c.cargo);
    setCargoObjetivo(c.slug);
  };

  const escribirPerfil = () => {
    const texto = redactarPerfil(cv, cargoObjetivo);
    if (texto) acciones.setField('resumen', texto);
  };

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:items-start lg:gap-6">
      <div>
        {/* Encabezado con los pasos */}
        <div className="rounded-2xl border border-edvanta-border bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-blue">Modo rápido</p>
              <h3 className="mt-0.5 font-display text-xl font-extrabold text-edvanta-deep">Tu hoja de vida en 5 minutos</h3>
            </div>
            <div className="flex items-center gap-2">
              <Chip onClick={acciones.usarEjemplo} titulo="Llena todo con un ejemplo para ver cómo queda">
                <Sparkles className="h-3 w-3" aria-hidden="true" /> Ver un ejemplo
              </Chip>
              <Chip onClick={irAEditorCompleto} titulo="Editor por secciones, con revisión ATS">Editor completo</Chip>
            </div>
          </div>

          <ol className="mt-5 grid gap-2 sm:grid-cols-4">
            {PASOS.map((p) => {
              const activo = paso === p.n;
              const hecho = listo[p.n];
              return (
                <li key={p.n}>
                  <button
                    type="button"
                    onClick={() => setPaso(p.n)}
                    aria-current={activo ? 'step' : undefined}
                    className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition ${activo ? 'border-edvanta-blue bg-edvanta-light/60' : 'border-edvanta-border bg-white hover:border-edvanta-blue/40'}`}
                  >
                    <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold ${hecho ? 'bg-edvanta-mint text-edvanta-tealdark' : activo ? 'bg-edvanta-blue text-white' : 'bg-edvanta-bg text-edvanta-subtle'}`}>
                      {hecho ? <Check className="h-4 w-4" aria-hidden="true" /> : p.n}
                    </span>
                    <span className="min-w-0">
                      <span className={`block truncate text-[13px] font-bold ${activo ? 'text-edvanta-deep' : 'text-edvanta-muted'}`}>{p.titulo}</span>
                      <span className="block text-[11px] text-edvanta-subtle">{p.minutos}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-4 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-edvanta-bg">
              <div className="h-1.5 rounded-full bg-edvanta-teal transition-all duration-500" style={{ width: `${avance}%` }} />
            </div>
            <span className="text-xs font-bold text-edvanta-muted">{avance}% listo</span>
          </div>
        </div>

        {/* Paso 1 · Datos */}
        {paso === 1 && (
          <div className="mt-4 rounded-2xl border border-edvanta-border bg-white p-5">
            <h4 className="text-base font-extrabold text-edvanta-deep">¿Quién eres y cómo te contactan?</h4>
            <p className="mt-1 text-sm text-edvanta-muted">Es lo primero que lee el filtro automático y lo primero que necesita quien te va a llamar.</p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Campo label="Nombre completo" requerido>
                <input value={cv.nombre} onChange={(e) => acciones.setField('nombre', e.target.value)} placeholder="Ej. María Gómez Pérez" className={input} />
              </Campo>
              <Campo label="Título profesional" requerido hint="El cargo al que te postulas, tal como aparece en la oferta.">
                <input value={cv.titulo} onChange={(e) => acciones.setField('titulo', e.target.value)} placeholder="Ej. Química farmacéutica — Control de calidad" className={input} />
              </Campo>
              <Campo label="Correo" requerido>
                <input value={cv.email} onChange={(e) => acciones.setField('email', e.target.value)} placeholder="tu@correo.com" className={input} inputMode="email" />
              </Campo>
              <Campo label="Teléfono" requerido>
                <input value={cv.telefono} onChange={(e) => acciones.setField('telefono', e.target.value)} placeholder="+57 300 000 0000" className={input} inputMode="tel" />
              </Campo>
              <Campo label="Ciudad">
                <input value={cv.ciudad} onChange={(e) => acciones.setField('ciudad', e.target.value)} placeholder="Ej. Barranquilla" className={input} />
              </Campo>
              <Campo label="LinkedIn" hint="Opcional, pero los reclutadores lo consultan.">
                <input value={cv.linkedin} onChange={(e) => acciones.setField('linkedin', e.target.value)} placeholder="linkedin.com/in/tu-perfil" className={input} />
              </Campo>
            </div>

            <div className="mt-4">
              <p className="text-xs font-bold text-edvanta-deep">¿A qué cargo apuntas? Elígelo y te sugerimos logros y habilidades</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {cargos.slice(0, 8).map((c) => (
                  <Chip key={c.slug} onClick={() => elegirTitulo(c)} tono={cargoObjetivo === c.slug ? 'activo' : 'claro'}>{c.cargo}</Chip>
                ))}
              </div>
            </div>

            {/* Foto: solo la usan dos diseños */}
            <div className="mt-5 flex flex-wrap items-center gap-4 rounded-xl border border-edvanta-border bg-edvanta-bg p-4">
              {cv.foto
                ? <img src={cv.foto} alt="Tu foto" className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-white" />
                : <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-edvanta-subtle"><User className="h-6 w-6" aria-hidden="true" /></span>}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-edvanta-deep">Foto (opcional)</p>
                <p className="mt-0.5 text-xs leading-5 text-edvanta-muted">Solo la muestran los diseños «Ejecutiva» y «Azul con foto». En Colombia no es obligatoria.</p>
                {fotoError && <p className="mt-1 text-xs font-semibold text-rose-700" role="alert">{fotoError}</p>}
              </div>
              <div className="flex gap-2">
                <label className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-xl border border-edvanta-border bg-white px-3 text-xs font-bold text-edvanta-deep transition hover:border-edvanta-blue/40">
                  <input type="file" accept="image/*" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) acciones.subirFoto(f); }} />
                  <Upload className="h-3.5 w-3.5" aria-hidden="true" /> {cv.foto ? 'Cambiar' : 'Subir foto'}
                </label>
                {cv.foto && (
                  <button type="button" onClick={acciones.quitarFoto} className="inline-flex min-h-10 items-center rounded-xl border border-edvanta-border bg-white px-3 text-xs font-bold text-rose-700 transition hover:border-rose-300">Quitar</button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Paso 2 · Experiencia */}
        {paso === 2 && (
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-edvanta-border bg-white p-5">
              <h4 className="text-base font-extrabold text-edvanta-deep">¿Dónde has trabajado?</h4>
              <p className="mt-1 text-sm text-edvanta-muted">
                Empieza por el más reciente. En cada cargo escribe de 2 a 4 logros con un dato: porcentaje, tiempo, cantidad o dinero.
                {anos > 0 && <span className="font-semibold text-edvanta-deep"> Llevas {String(anos).replace('.', ',')} años sumados.</span>}
              </p>
            </div>

            {cv.experiencia.map((e, i) => (
              <div key={e.id} className="rounded-2xl border border-edvanta-border bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-edvanta-muted">Cargo {i + 1}</p>
                  <button type="button" onClick={() => acciones.removeItem('experiencia', e.id)} className="inline-flex items-center gap-1 text-xs font-bold text-edvanta-subtle transition hover:text-rose-700">
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Quitar
                  </button>
                </div>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <Campo label="Cargo" requerido>
                    <input value={e.cargo} onChange={(ev) => acciones.patchItem('experiencia', e.id, 'cargo', ev.target.value)} placeholder="Ej. Analista de control de calidad" className={input} />
                  </Campo>
                  <Campo label="Empresa">
                    <input value={e.empresa} onChange={(ev) => acciones.patchItem('experiencia', e.id, 'empresa', ev.target.value)} placeholder="Ej. Laboratorios del Caribe S.A.S." className={input} />
                  </Campo>
                  <Campo label="Desde">
                    <SelectorFecha valor={e.inicio} onChange={(v) => acciones.patchItem('experiencia', e.id, 'inicio', v)} />
                  </Campo>
                  <Campo label="Hasta">
                    <SelectorFecha
                      valor={e.fin}
                      onChange={(v) => acciones.patchItem('experiencia', e.id, 'fin', v)}
                      permitirActual
                      actual={!e.fin}
                      onActual={(marcado) => acciones.patchItem('experiencia', e.id, 'fin', marcado ? '' : `${MESES[new Date().getMonth()]} ${new Date().getFullYear()}`)}
                    />
                  </Campo>
                </div>
                <div className="mt-4">
                  <Logros
                    valor={e.logros}
                    onChange={(v) => acciones.patchItem('experiencia', e.id, 'logros', v)}
                    sugerencias={sugerenciasDeLogros(cargoObjetivo, String(e.logros || '').split('\n'))}
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => acciones.addItem('experiencia')}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-edvanta-strong bg-white px-4 py-4 text-sm font-bold text-edvanta-blue transition hover:border-edvanta-blue hover:bg-edvanta-light/40"
            >
              <Plus className="h-4 w-4" aria-hidden="true" /> {cv.experiencia.length ? 'Agregar otro cargo' : 'Agregar mi primer cargo'}
            </button>

            {!cv.experiencia.length && (
              <p className="rounded-xl border border-edvanta-border bg-edvanta-bg p-4 text-sm leading-6 text-edvanta-muted">
                ¿Todavía no has trabajado? Cuenta tus prácticas, tu trabajo de grado o el voluntariado: escribe el rol, el lugar y qué lograste.
              </p>
            )}
          </div>
        )}

        {/* Paso 3 · Estudios y habilidades */}
        {paso === 3 && (
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-edvanta-border bg-white p-5">
              <h4 className="text-base font-extrabold text-edvanta-deep">Estudios</h4>
              <div className="mt-4 space-y-3">
                {cv.educacion.map((e) => (
                  <div key={e.id} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_110px_auto]">
                    <input value={e.titulo} onChange={(ev) => acciones.patchItem('educacion', e.id, 'titulo', ev.target.value)} placeholder="Título (ej. Química farmacéutica)" className={input} />
                    <input value={e.institucion} onChange={(ev) => acciones.patchItem('educacion', e.id, 'institucion', ev.target.value)} placeholder="Institución" className={input} />
                    <select value={e.anio} onChange={(ev) => acciones.patchItem('educacion', e.id, 'anio', ev.target.value)} className={input} aria-label="Año">
                      <option value="">Año</option>
                      {ANIOS.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <button type="button" onClick={() => acciones.removeItem('educacion', e.id)} aria-label="Quitar estudio" className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-edvanta-subtle transition hover:bg-rose-50 hover:text-rose-700">
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => acciones.addItem('educacion')} className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue hover:underline">
                <Plus className="h-4 w-4" aria-hidden="true" /> Agregar estudio
              </button>
            </div>

            <div className="rounded-2xl border border-edvanta-border bg-white p-5">
              <h4 className="text-base font-extrabold text-edvanta-deep">Habilidades</h4>
              <p className="mt-1 text-sm text-edvanta-muted">Toca las que manejas. Apunta a 6–12; son las palabras que busca el filtro.</p>
              {cv.habilidades.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {cv.habilidades.map((h, i) => (
                    <span key={h} className="inline-flex items-center gap-1.5 rounded-full bg-edvanta-blue px-3 py-1.5 text-xs font-bold text-white">
                      {h}
                      <button type="button" onClick={() => acciones.removeSkill(i)} aria-label={`Quitar ${h}`} className="rounded-full p-0.5 hover:bg-white/20">
                        <X className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {habilidadesSugeridas.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-bold text-edvanta-muted">Sugeridas {cargoObjetivo ? 'para tu cargo' : 'del sector'}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {habilidadesSugeridas.map((h) => (
                      <Chip key={h} onClick={() => acciones.addSkill(h)} tono="suave"><Plus className="h-3 w-3" aria-hidden="true" /> {h}</Chip>
                    ))}
                  </div>
                </div>
              )}
              <form
                className="mt-3 flex gap-2"
                onSubmit={(ev) => { ev.preventDefault(); const v = ev.target.elements.hab.value; acciones.addSkill(v); ev.target.reset(); }}
              >
                <input name="hab" placeholder="Escribe otra habilidad y presiona Enter" className={input} />
                <button type="submit" className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-edvanta-deep px-4 text-sm font-bold text-white transition hover:bg-edvanta-blue">
                  <Plus className="h-4 w-4" aria-hidden="true" /> Agregar
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-edvanta-border bg-white p-5">
              <h4 className="text-base font-extrabold text-edvanta-deep">Idiomas</h4>
              <div className="mt-3 space-y-3">
                {cv.idiomas.map((i) => (
                  <div key={i.id} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                    <input value={i.idioma} onChange={(ev) => acciones.patchItem('idiomas', i.id, 'idioma', ev.target.value)} placeholder="Idioma (ej. Inglés)" className={input} />
                    <select value={i.nivel} onChange={(ev) => acciones.patchItem('idiomas', i.id, 'nivel', ev.target.value)} className={input} aria-label="Nivel">
                      <option value="">Nivel</option>
                      {['Básico', 'A2', 'B1', 'B2', 'C1', 'Avanzado', 'Nativo'].map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <button type="button" onClick={() => acciones.removeItem('idiomas', i.id)} aria-label="Quitar idioma" className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-edvanta-subtle transition hover:bg-rose-50 hover:text-rose-700">
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => acciones.addItem('idiomas')} className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue hover:underline">
                <Plus className="h-4 w-4" aria-hidden="true" /> Agregar idioma
              </button>
            </div>
          </div>
        )}

        {/* Paso 4 · Perfil, diseño y descarga */}
        {paso === 4 && (
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-edvanta-border bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-base font-extrabold text-edvanta-deep">Tu perfil profesional</h4>
                  <p className="mt-1 text-sm text-edvanta-muted">Tres o cuatro líneas al inicio de la hoja. Podemos escribirlas con lo que ya llenaste.</p>
                </div>
                <button type="button" onClick={escribirPerfil} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-edvanta-blue px-5 text-sm font-semibold text-white transition hover:bg-edvanta-bluedark">
                  <Wand2 className="h-4 w-4" aria-hidden="true" /> {cv.resumen ? 'Volver a escribirlo' : 'Escribir mi perfil'}
                </button>
              </div>
              <textarea
                value={cv.resumen}
                onChange={(e) => acciones.setField('resumen', e.target.value)}
                rows={4}
                placeholder="Química farmacéutica con 5 años de experiencia en control de calidad…"
                className="mt-3 w-full rounded-xl border border-edvanta-border p-3.5 text-sm leading-6 outline-none transition focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/15"
              />
              <p className="mt-1 text-xs text-edvanta-muted">Revísalo: debe sonar a ti y decir la verdad. Es una propuesta, no un texto definitivo.</p>
            </div>

            <div className="rounded-2xl border border-edvanta-border bg-white p-5">
              <h4 className="text-base font-extrabold text-edvanta-deep">Elige el diseño</h4>
              <p className="mt-1 text-sm text-edvanta-muted">Cada miniatura es tu hoja de vida real. Todos salen en PDF con texto seleccionable.</p>
              <GaleriaPlantillas
                className="mt-4"
                cv={cv}
                cargoLabel={cv.titulo}
                foto={cv.foto}
                valor={plantillaId}
                onElegir={setPlantillaId}
              />
            </div>

            <div className="rounded-2xl border border-edvanta-blue/30 bg-edvanta-light/40 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-base font-extrabold text-edvanta-deep">¿Lista para enviar?</p>
                  <p className="mt-0.5 text-sm text-edvanta-muted">
                    {analysis ? `Tu puntaje ATS es ${analysis.score}/100. ` : ''}
                    Descárgala y adjúntala tal cual: ya tiene el nombre de archivo ordenado.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => descargar(plantillaId)} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-edvanta-blue px-6 text-[15px] font-semibold text-white shadow-[0_6px_18px_rgba(8,46,134,.22)] transition hover:bg-edvanta-bluedark">
                    <Download className="h-4 w-4" aria-hidden="true" /> Descargar PDF
                  </button>
                  <button type="button" onClick={copiarTexto} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-edvanta-border bg-white px-5 text-sm font-semibold text-edvanta-deep transition hover:border-edvanta-blue/40">
                    <Copy className="h-4 w-4" aria-hidden="true" /> Copiar texto
                  </button>
                  <button type="button" onClick={academiaUser ? guardar : onCrearCuenta} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-edvanta-border bg-white px-5 text-sm font-semibold text-edvanta-deep transition hover:border-edvanta-blue/40">
                    <Save className="h-4 w-4" aria-hidden="true" /> {academiaUser ? 'Guardar' : 'Guardar en mi cuenta'}
                  </button>
                </div>
              </div>
              <button type="button" onClick={irAEditorCompleto} className="mt-3 text-sm font-bold text-edvanta-blue hover:underline">
                Ver la revisión ATS completa y afinar sección por sección
              </button>
            </div>
          </div>
        )}

        {/* Navegación */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setPaso((p) => Math.max(1, p - 1))}
            disabled={paso === 1}
            className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-edvanta-border bg-white px-5 text-sm font-semibold text-edvanta-deep transition hover:border-edvanta-blue/40 disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Atrás
          </button>
          {paso < 4 ? (
            <button
              type="button"
              onClick={() => setPaso((p) => Math.min(4, p + 1))}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-edvanta-blue px-6 text-[15px] font-semibold text-white shadow-[0_6px_18px_rgba(8,46,134,.22)] transition hover:bg-edvanta-bluedark"
            >
              Siguiente <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => descargar(plantillaId)}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-edvanta-blue px-6 text-[15px] font-semibold text-white shadow-[0_6px_18px_rgba(8,46,134,.22)] transition hover:bg-edvanta-bluedark"
            >
              <Download className="h-4 w-4" aria-hidden="true" /> Descargar mi hoja de vida
            </button>
          )}
        </div>
      </div>

      {/* Vista previa: la arma el componente padre para compartirla con el editor completo */}
      <div className="mt-6 lg:sticky lg:top-24 lg:mt-0">{vistaPrevia}</div>
    </div>
  );
}
