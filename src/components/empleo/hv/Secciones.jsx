/**
 * ============================================================
 *  hv/Secciones.jsx — Los cinco pasos del formulario
 *
 *  Datos · Perfil · Experiencia · Estudios · Habilidades
 *
 *  Cada paso muestra solo lo suyo. Los elementos que se repiten
 *  (cargos, estudios, idiomas…) se pliegan: abierto queda solo el
 *  que se está editando, así la pantalla no se llena de campos.
 * ============================================================
 */

import { useMemo, useState } from 'react';
import {
  ArrowDown, ArrowUp, Camera, Plus, Sparkles, Trash2, Wand2, X,
} from 'lucide-react';
import { Campo, Chip, claseArea, claseEntrada, Elemento, Logros, SelectorFecha } from './campos';
import {
  cargosSugeridos, redactarPerfil, sugerenciasDeHabilidades, sugerenciasDeLogros,
} from '../../../lib/cv/redaccion';

export const PASOS = [
  { id: 'datos', titulo: 'Datos', largo: 'Tus datos de contacto' },
  { id: 'perfil', titulo: 'Perfil', largo: 'Tu perfil profesional' },
  { id: 'experiencia', titulo: 'Experiencia', largo: 'Tu experiencia' },
  { id: 'estudios', titulo: 'Estudios', largo: 'Estudios y certificaciones' },
  { id: 'habilidades', titulo: 'Habilidades', largo: 'Habilidades e idiomas' },
];

/** ¿Qué tan completo está cada paso? (0 a 1) */
export function avancePorPaso(cv) {
  const lleno = (v) => Boolean(String(v || '').trim());
  return {
    datos: [cv.nombre, cv.titulo, cv.email, cv.telefono, cv.ciudad].filter(lleno).length / 5,
    perfil: lleno(cv.resumen) ? 1 : 0,
    experiencia: cv.experiencia.some((e) => lleno(e.cargo) && lleno(e.logros)) ? 1 : (cv.experiencia.length ? 0.5 : 0),
    estudios: cv.educacion.some((e) => lleno(e.titulo)) ? 1 : 0,
    habilidades: Math.min(1, cv.habilidades.length / 5),
  };
}

const IconoBoton = ({ etiqueta, onClick, children, peligro = false }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={etiqueta}
    title={etiqueta}
    className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-edvanta-subtle transition hover:bg-edvanta-bg ${peligro ? 'hover:text-[#5E51A8]' : 'hover:text-edvanta-blue'}`}
  >
    {children}
  </button>
);

function Encabezado({ titulo, desc }) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-2xl font-extrabold tracking-tight text-edvanta-deep">{titulo}</h2>
      {desc && <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">{desc}</p>}
    </div>
  );
}

/* ── 1. Datos ─────────────────────────────────────────────── */

function PasoDatos({ cv, a, cargo, setCargo, fotoError, disenoConFoto }) {
  const cargos = useMemo(() => cargosSugeridos(), []);
  return (
    <>
      <Encabezado titulo="Tus datos de contacto" desc="Lo primero que lee un reclutador. Sin cédula, edad ni estado civil: no suman y ocupan espacio." />
      <div className="grid gap-5 sm:grid-cols-2">
        <Campo label="Nombre completo" className="sm:col-span-2">
          <input value={cv.nombre} onChange={(e) => a.setField('nombre', e.target.value)} className={claseEntrada} placeholder="Camila Rodríguez Peña" autoComplete="name" />
        </Campo>
        <Campo label="Título profesional" hint="Como quieres que te presenten: tu profesión o el cargo al que apuntas." className="sm:col-span-2">
          <input value={cv.titulo} onChange={(e) => a.setField('titulo', e.target.value)} className={claseEntrada} placeholder="Química farmacéutica — Control de calidad" list="hv-cargos" />
        </Campo>
        <Campo label="Correo">
          <input type="email" value={cv.email} onChange={(e) => a.setField('email', e.target.value)} className={claseEntrada} placeholder="nombre@correo.com" autoComplete="email" />
        </Campo>
        <Campo label="Teléfono">
          <input type="tel" value={cv.telefono} onChange={(e) => a.setField('telefono', e.target.value)} className={claseEntrada} placeholder="+57 300 123 4567" autoComplete="tel" />
        </Campo>
        <Campo label="Ciudad">
          <input value={cv.ciudad} onChange={(e) => a.setField('ciudad', e.target.value)} className={claseEntrada} placeholder="Barranquilla" autoComplete="address-level2" />
        </Campo>
        <Campo label="LinkedIn" hint="Opcional, pero suma puntos.">
          <input value={cv.linkedin} onChange={(e) => a.setField('linkedin', e.target.value)} className={claseEntrada} placeholder="linkedin.com/in/tu-nombre" />
        </Campo>
      </div>

      <div className="mt-7 rounded-2xl bg-edvanta-bg p-4 sm:p-5">
        <Campo label="¿A qué cargo te vas a postular?" hint="Con esto revisamos tus palabras clave y te sugerimos logros y habilidades. No sale en el PDF.">
          <input value={cargo} onChange={(e) => setCargo(e.target.value)} className={claseEntrada} placeholder="Analista de control de calidad" list="hv-cargos" />
        </Campo>
        <datalist id="hv-cargos">
          {cargos.map((c) => <option key={c.slug} value={c.cargo} />)}
        </datalist>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4 rounded-2xl border border-edvanta-border p-4 sm:p-5">
        <span className="relative inline-flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-edvanta-light text-edvanta-blue">
          {cv.foto ? <img src={cv.foto} alt="Tu foto" className="h-full w-full object-cover" /> : <Camera className="h-6 w-6" aria-hidden="true" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-edvanta-deep">Foto <span className="font-medium text-edvanta-subtle">(opcional)</span></p>
          <p className="text-xs leading-5 text-edvanta-muted">Solo la muestran los diseños Columna derecha, Barra lateral y Moderno.{disenoConFoto ? '' : ' El diseño que elegiste no lleva foto.'}</p>
          {fotoError && <p className="mt-1 text-xs font-semibold text-[#5E51A8]" role="alert">{fotoError}</p>}
        </div>
        <div className="flex gap-2">
          <label className="ed-btn ed-btn--secondary ed-btn--sm cursor-pointer">
            {cv.foto ? 'Cambiar' : 'Subir foto'}
            <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; a.subirFoto(f); }} />
          </label>
          {cv.foto && <button type="button" onClick={a.quitarFoto} className="ed-btn ed-btn--ghost ed-btn--sm">Quitar</button>}
        </div>
      </div>
    </>
  );
}

/* ── 2. Perfil ────────────────────────────────────────────── */

function PasoPerfil({ cv, a, cargoSlug, perfilIa }) {
  const palabras = String(cv.resumen || '').split(/\s+/).filter(Boolean).length;
  const escribir = () => {
    const t = redactarPerfil(cv, cargoSlug);
    if (t) a.setField('resumen', t);
  };
  const ayuda = palabras === 0 ? 'Entre 50 y 90 palabras es lo ideal.'
    : palabras < 40 ? `${palabras} palabras · un poco corto: suma tu especialidad o un logro.`
      : palabras > 110 ? `${palabras} palabras · largo: deja solo lo que importa para el cargo.`
        : `${palabras} palabras · buen largo.`;
  return (
    <>
      <Encabezado titulo="Tu perfil profesional" desc="Tres o cuatro líneas: quién eres, cuántos años llevas, en qué eres fuerte y un resultado. Escríbelo sin «yo»." />
      <textarea
        value={cv.resumen}
        onChange={(e) => a.setField('resumen', e.target.value)}
        rows={7}
        aria-label="Perfil profesional"
        placeholder="Química farmacéutica con 5 años de experiencia en control de calidad bajo BPM. Manejo de HPLC y validación de métodos analíticos…"
        className={claseArea}
      />
      <p className={`mt-1.5 text-xs ${palabras && (palabras < 40 || palabras > 110) ? 'font-semibold text-[#5E51A8]' : 'text-edvanta-subtle'}`}>{ayuda}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={escribir} className="ed-btn ed-btn--secondary ed-btn--sm">
          <Wand2 className="h-4 w-4" aria-hidden="true" /> {cv.resumen ? 'Volver a redactar con mis datos' : 'Redactarlo con mis datos'}
        </button>
      </div>
      {perfilIa && perfilIa !== cv.resumen && (
        <div className="mt-5 rounded-2xl border border-edvanta-violet/30 bg-edvanta-lilac/50 p-4">
          <p className="flex items-center gap-1.5 text-sm font-bold text-edvanta-deep"><Sparkles className="h-4 w-4 text-[#5E51A8]" aria-hidden="true" /> La IA te sugiere este perfil</p>
          <p className="mt-2 text-sm leading-6 text-edvanta-deep">{perfilIa}</p>
          <button type="button" onClick={() => a.setField('resumen', perfilIa)} className="ed-btn ed-btn--primary ed-btn--sm mt-3">Usar este perfil</button>
        </div>
      )}
    </>
  );
}

/* ── 3. Experiencia ───────────────────────────────────────── */

function PasoExperiencia({ cv, a, cargoSlug, abierto, setAbierto }) {
  const usados = cv.experiencia.flatMap((e) => String(e.logros || '').split('\n'));
  const sugerencias = useMemo(() => sugerenciasDeLogros(cargoSlug, usados), [cargoSlug, usados.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps
  const nuevo = () => setAbierto(a.addItem('experiencia'));
  return (
    <>
      <Encabezado titulo="Tu experiencia" desc="Empieza por el cargo más reciente. En cada uno, dos a cuatro logros con resultados: qué mejoraste y cuánto." />
      <div className="space-y-3">
        {cv.experiencia.map((e, i) => {
          const fechas = [e.inicio, e.fin || (e.inicio ? 'Actual' : '')].filter(Boolean).join(' – ');
          const actual = Boolean(e.inicio) && !e.fin;
          return (
            <Elemento
              key={e.id}
              titulo={e.cargo || 'Cargo sin nombre'}
              subtitulo={[e.empresa, fechas].filter(Boolean).join(' · ') || 'Toca para completar'}
              abierto={abierto === e.id}
              onAlternar={() => setAbierto(abierto === e.id ? null : e.id)}
              acciones={(
                <>
                  {i > 0 && <IconoBoton etiqueta="Subir" onClick={() => a.moveItem('experiencia', e.id, -1)}><ArrowUp className="h-4 w-4" /></IconoBoton>}
                  {i < cv.experiencia.length - 1 && <IconoBoton etiqueta="Bajar" onClick={() => a.moveItem('experiencia', e.id, 1)}><ArrowDown className="h-4 w-4" /></IconoBoton>}
                  <IconoBoton etiqueta="Eliminar cargo" peligro onClick={() => a.removeItem('experiencia', e.id)}><Trash2 className="h-4 w-4" /></IconoBoton>
                </>
              )}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo label="Cargo">
                  <input value={e.cargo} onChange={(ev) => a.patchItem('experiencia', e.id, 'cargo', ev.target.value)} className={claseEntrada} placeholder="Analista de control de calidad" />
                </Campo>
                <Campo label="Empresa">
                  <input value={e.empresa} onChange={(ev) => a.patchItem('experiencia', e.id, 'empresa', ev.target.value)} className={claseEntrada} placeholder="Laboratorios del Caribe S.A.S." />
                </Campo>
                <div>
                  <span className="mb-1.5 block text-sm font-bold text-edvanta-deep">Desde</span>
                  <SelectorFecha etiqueta="Desde" valor={e.inicio} onChange={(v) => a.patchItem('experiencia', e.id, 'inicio', v)} />
                </div>
                <div>
                  <span className="mb-1.5 flex items-center justify-between gap-2 text-sm font-bold text-edvanta-deep">
                    Hasta
                    <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-edvanta-muted">
                      <input
                        type="checkbox"
                        checked={actual}
                        onChange={(ev) => a.patchItem('experiencia', e.id, 'fin', ev.target.checked ? '' : String(new Date().getFullYear()))}
                        className="h-4 w-4 rounded border-edvanta-strong text-edvanta-blue focus:ring-edvanta-blue"
                      />
                      Trabajo aquí
                    </label>
                  </span>
                  <SelectorFecha etiqueta="Hasta" valor={e.fin} deshabilitado={actual} onChange={(v) => a.patchItem('experiencia', e.id, 'fin', v)} />
                </div>
              </div>
              <div className="mt-5">
                <Logros valor={e.logros} onChange={(v) => a.patchItem('experiencia', e.id, 'logros', v)} sugerencias={sugerencias} />
              </div>
            </Elemento>
          );
        })}
      </div>
      <button type="button" onClick={nuevo} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-edvanta-strong px-4 py-4 text-sm font-bold text-edvanta-blue transition hover:border-edvanta-blue hover:bg-edvanta-light/50">
        <Plus className="h-4 w-4" aria-hidden="true" /> {cv.experiencia.length ? 'Agregar otro cargo' : 'Agregar mi primer cargo'}
      </button>
      {!cv.experiencia.length && (
        <p className="mt-3 text-center text-xs leading-5 text-edvanta-subtle">¿Sin experiencia laboral? Agrega tus prácticas, el año rural o proyectos académicos como si fueran un cargo.</p>
      )}
    </>
  );
}

/* ── 4. Estudios ──────────────────────────────────────────── */

function ListaSimple({ items, campos, onPatch, onRemove, onAdd, textoAgregar, vacio }) {
  return (
    <>
      <div className="space-y-3">
        {items.map((it) => (
          <div key={it.id} className="flex items-start gap-2 rounded-2xl border border-edvanta-border bg-white p-3 sm:p-4">
            <div className="grid flex-1 gap-3 sm:grid-cols-[1.4fr_1.2fr_0.6fr]">
              {campos.map((c) => (
                <input
                  key={c.k}
                  value={it[c.k] || ''}
                  onChange={(e) => onPatch(it.id, c.k, e.target.value)}
                  placeholder={c.ph}
                  aria-label={c.label}
                  inputMode={c.k === 'anio' ? 'numeric' : undefined}
                  className={claseEntrada}
                />
              ))}
            </div>
            <IconoBoton etiqueta="Eliminar" peligro onClick={() => onRemove(it.id)}><X className="h-4 w-4" /></IconoBoton>
          </div>
        ))}
      </div>
      {!items.length && vacio && <p className="text-sm text-edvanta-subtle">{vacio}</p>}
      <button type="button" onClick={onAdd} className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue hover:underline">
        <Plus className="h-4 w-4" aria-hidden="true" /> {textoAgregar}
      </button>
    </>
  );
}

function PasoEstudios({ cv, a }) {
  return (
    <>
      <Encabezado titulo="Estudios y certificaciones" desc="Del título más alto al más básico. En certificaciones van los cursos que pide el cargo: BPM, farmacovigilancia, auditor ISO…" />
      <h3 className="mb-3 text-sm font-extrabold uppercase tracking-[.1em] text-edvanta-subtle">Formación</h3>
      <ListaSimple
        items={cv.educacion}
        campos={[{ k: 'titulo', ph: 'Química Farmacéutica', label: 'Título' }, { k: 'institucion', ph: 'Universidad del Atlántico', label: 'Institución' }, { k: 'anio', ph: '2018', label: 'Año' }]}
        onPatch={(id, k, v) => a.patchItem('educacion', id, k, v)}
        onRemove={(id) => a.removeItem('educacion', id)}
        onAdd={() => a.addItem('educacion')}
        textoAgregar="Agregar estudio"
        vacio="Aún no agregas estudios."
      />
      <h3 className="mb-3 mt-8 text-sm font-extrabold uppercase tracking-[.1em] text-edvanta-subtle">Certificaciones y cursos</h3>
      <ListaSimple
        items={cv.certificaciones}
        campos={[{ k: 'nombre', ph: 'Buenas Prácticas de Manufactura', label: 'Nombre' }, { k: 'institucion', ph: 'INVIMA', label: 'Entidad' }, { k: 'anio', ph: '2024', label: 'Año' }]}
        onPatch={(id, k, v) => a.patchItem('certificaciones', id, k, v)}
        onRemove={(id) => a.removeItem('certificaciones', id)}
        onAdd={() => a.addItem('certificaciones')}
        textoAgregar="Agregar certificación"
      />
    </>
  );
}

/* ── 5. Habilidades ───────────────────────────────────────── */

const NIVELES_IDIOMA = ['Nativo', 'C2', 'C1', 'B2', 'B1', 'A2', 'A1'];

function PasoHabilidades({ cv, a, cargoSlug }) {
  const [nueva, setNueva] = useState('');
  const sugeridas = useMemo(() => sugerenciasDeHabilidades(cargoSlug, cv.habilidades), [cargoSlug, cv.habilidades]);
  const agregar = () => { a.addSkill(nueva); setNueva(''); };
  return (
    <>
      <Encabezado titulo="Habilidades e idiomas" desc="Entre 6 y 12 habilidades técnicas, con el mismo nombre que usan las ofertas (BPM, HPLC, SAP, Power BI…)." />
      <div className="flex gap-2">
        <input
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); agregar(); } }}
          className={claseEntrada}
          placeholder="Escribe una habilidad y presiona Enter"
          aria-label="Nueva habilidad"
        />
        <button type="button" onClick={agregar} className="ed-btn ed-btn--secondary shrink-0">Agregar</button>
      </div>
      {cv.habilidades.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {cv.habilidades.map((h, i) => (
            <li key={`${h}-${i}`} className="inline-flex min-h-9 items-center gap-1 rounded-full bg-edvanta-light pl-3.5 pr-1 text-sm font-semibold text-edvanta-blue">
              {h}
              <button type="button" onClick={() => a.removeSkill(i)} aria-label={`Quitar ${h}`} className="inline-flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-white">
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {sugeridas.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-bold text-edvanta-subtle">{cargoSlug ? 'Sugeridas para tu cargo' : 'Sugeridas para el sector'} · toca para agregar</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {sugeridas.slice(0, 12).map((h) => <Chip key={h} onClick={() => a.addSkill(h)}><Plus className="h-3 w-3" aria-hidden="true" /> {h}</Chip>)}
          </div>
        </div>
      )}

      <h3 className="mb-3 mt-9 text-sm font-extrabold uppercase tracking-[.1em] text-edvanta-subtle">Idiomas</h3>
      <div className="space-y-2.5">
        {cv.idiomas.map((i) => (
          <div key={i.id} className="flex items-center gap-2">
            <input value={i.idioma} onChange={(e) => a.patchItem('idiomas', i.id, 'idioma', e.target.value)} className={claseEntrada} placeholder="Inglés" aria-label="Idioma" />
            <select value={NIVELES_IDIOMA.includes(i.nivel) ? i.nivel : (i.nivel ? '__otro' : '')} onChange={(e) => a.patchItem('idiomas', i.id, 'nivel', e.target.value === '__otro' ? i.nivel : e.target.value)} className={`${claseEntrada} w-36 shrink-0`} aria-label="Nivel">
              <option value="">Nivel</option>
              {NIVELES_IDIOMA.map((n) => <option key={n} value={n}>{n}</option>)}
              {i.nivel && !NIVELES_IDIOMA.includes(i.nivel) && <option value="__otro">{i.nivel}</option>}
            </select>
            <IconoBoton etiqueta="Quitar idioma" peligro onClick={() => a.removeItem('idiomas', i.id)}><X className="h-4 w-4" /></IconoBoton>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => a.addItem('idiomas')} className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue hover:underline">
        <Plus className="h-4 w-4" aria-hidden="true" /> Agregar idioma
      </button>

      <details className="mt-9 rounded-2xl border border-edvanta-border p-4" open={cv.referencias.length > 0}>
        <summary className="cursor-pointer text-sm font-bold text-edvanta-deep">Referencias <span className="font-medium text-edvanta-subtle">(opcional)</span></summary>
        <p className="mt-1.5 text-xs leading-5 text-edvanta-subtle">Si no las pones, los diseños dicen «disponibles a solicitud» o no las muestran. Pide permiso antes de incluir a alguien.</p>
        <div className="mt-3">
          <ListaSimple
            items={cv.referencias}
            campos={[{ k: 'nombre', ph: 'María Pérez', label: 'Nombre' }, { k: 'cargo', ph: 'Jefe de calidad', label: 'Cargo' }, { k: 'contacto', ph: '300 111 2222', label: 'Contacto' }]}
            onPatch={(id, k, v) => a.patchItem('referencias', id, k, v)}
            onRemove={(id) => a.removeItem('referencias', id)}
            onAdd={() => a.addItem('referencias')}
            textoAgregar="Agregar referencia"
          />
        </div>
      </details>
    </>
  );
}

export function SeccionActiva({ paso, ...props }) {
  if (paso === 'datos') return <PasoDatos {...props} />;
  if (paso === 'perfil') return <PasoPerfil {...props} />;
  if (paso === 'experiencia') return <PasoExperiencia {...props} />;
  if (paso === 'estudios') return <PasoEstudios {...props} />;
  return <PasoHabilidades {...props} />;
}
