/**
 * ============================================================
 *  EditorHojaDeVida.jsx — La herramienta de hoja de vida
 *
 *  Vive sola en /hoja-de-vida/crear, con su propia barra. Tres
 *  momentos:
 *   1. Inicio: subir la hoja anterior (PDF o Word) o empezar de cero.
 *   2. Lectura: el archivo se lee en el navegador y, si la IA está
 *      configurada en el servidor, la IA ordena los datos y califica.
 *      Sin IA (o si falla) se usa el lector local: nunca se bloquea.
 *   3. Editor: cinco pasos cortos a la izquierda y, a la derecha, el
 *      PDF real con el diseño elegido y el puntaje ATS en vivo.
 *
 *  El borrador se guarda en el navegador; con sesión, también en la
 *  cuenta (PUT /api/cv, igual que antes).
 * ============================================================
 */

import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Check, ClipboardCopy, Cloud, Download, Eye, LayoutTemplate, Loader2, PenLine, RotateCcw, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AcademiaLoginModal from '../AcademiaLoginModal';
import { apiUrl } from '../../config/api';
import { DISENO_PREDETERMINADO, normalizarEstilo, plantillaPorId } from '../../lib/cv/catalogo';
import { downloadCvPdf } from '../../lib/cv/pdf';
import { ejemploCv } from '../../lib/cv/ejemplo';
import { huellaCv } from '../../lib/cv/vistaPrevia';
import {
  esErrorDeLectura, iaDisponible, lecturaLocal, leerArchivoCv, revisarConIa, revisionDelEditor, slugDeCargo, textoPlano,
} from '../../lib/cv/revision';
import { trackEvent } from '../../utils/analytics';
import { GaleriaPlantillas, VistaPreviaCv } from './plantillasUi';
import { PantallaInicio, PantallaLeyendo } from './hv/Inicio';
import { avancePorPaso, PASOS, SeccionActiva } from './hv/Secciones';
import { PanelRevision, ResumenRevision } from './hv/Revision';

export const CV_VACIO = {
  nombre: '', titulo: '', email: '', telefono: '', ciudad: '', linkedin: '',
  resumen: '', experiencia: [], educacion: [], habilidades: [], certificaciones: [], idiomas: [], referencias: [],
  foto: '',
};
const LISTAS = ['experiencia', 'educacion', 'certificaciones', 'idiomas', 'referencias'];
const BORRADOR = 'edvanta_cv_borrador';

let contador = 0;
const uid = () => `x-${Date.now()}-${++contador}`;
const conIds = (cv) => ({
  ...CV_VACIO,
  ...cv,
  habilidades: Array.isArray(cv.habilidades) ? cv.habilidades.filter((h) => typeof h === 'string') : [],
  ...Object.fromEntries(LISTAS.map((k) => [k, (Array.isArray(cv[k]) ? cv[k] : []).map((x) => ({ ...x, id: uid() }))])),
});
const sinIds = (cv) => ({ ...cv, ...Object.fromEntries(LISTAS.map((k) => [k, cv[k].map(({ id, ...resto }) => resto)])) });
const tieneContenido = (cv) => Boolean(cv.nombre || cv.resumen || cv.experiencia.length || cv.habilidades.length || cv.educacion.length);

/** Foto cuadrada de 400 px en JPEG: liviana para el PDF. */
const procesarFoto = (file) => new Promise((resolve, reject) => {
  if (!file || !String(file.type || '').startsWith('image/')) { reject(new Error('formato')); return; }
  const lector = new FileReader();
  lector.onerror = () => reject(new Error('lectura'));
  lector.onload = () => {
    const img = new Image();
    img.onerror = () => reject(new Error('imagen'));
    img.onload = () => {
      const lado = 400;
      const min = Math.min(img.width, img.height);
      const canvas = document.createElement('canvas');
      canvas.width = lado;
      canvas.height = lado;
      canvas.getContext('2d').drawImage(img, (img.width - min) / 2, (img.height - min) / 2, min, min, 0, 0, lado, lado);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.src = lector.result;
  };
  lector.readAsDataURL(file);
});

/** Lo que el navegador midió del archivo, para la revisión con IA. */
const senalesDe = (meta) => ({
  origen: 'archivo', tipo: meta?.tipo, paginas: meta?.paginas, columnas: meta?.columnas, imagenes: meta?.imagenes, escaneado: Boolean(meta?.escaneado),
});

export default function EditorHojaDeVida({ disenoInicial = '' }) {
  const { user, academiaApi, academiaUser, academiaToken, exchangeSupabaseForAcademia } = useAuth();
  const [etapa, setEtapa] = useState('inicio'); // inicio | leyendo | editor
  const [cv, setCv] = useState(CV_VACIO);
  const [cargo, setCargo] = useState('');
  const [plantillaId, setPlantillaId] = useState(normalizarEstilo(disenoInicial || DISENO_PREDETERMINADO));
  const [paso, setPaso] = useState(0);
  const [abierto, setAbierto] = useState(null);
  const [vistaMovil, setVistaMovil] = useState('editar');
  const [panel, setPanel] = useState(null); // null | 'revision' | 'disenos'
  const [errorInicio, setErrorInicio] = useState('');
  const [lectura, setLectura] = useState({ archivo: '', paso: 0, conIa: false });
  const [aviso, setAviso] = useState('');
  const [fotoError, setFotoError] = useState('');
  const [iaLista, setIaLista] = useState(false);
  const [ia, setIa] = useState({ analisis: null, huella: '', cargando: false, error: '' });
  const [importada, setImportada] = useState(null); // { local, ia, sugerencias }
  const [guardado, setGuardado] = useState(''); // '' | guardando | cuenta | local | error
  const [loginAbierto, setLoginAbierto] = useState(false);
  const [descargando, setDescargando] = useState(false);
  const sucio = useRef(false);
  const cancelarLectura = useRef(null);
  const formulario = useRef(null);

  // ── Al abrir: borrador del navegador, IA disponible, sesión ──
  useEffect(() => {
    try {
      const g = JSON.parse(localStorage.getItem(BORRADOR) || 'null');
      if (g?.cv && tieneContenido({ ...CV_VACIO, ...g.cv })) {
        setCv(conIds(g.cv));
        if (g.cargo) setCargo(slugDeCargo(g.cargo) ? g.cargo : String(g.cargo).replace(/-/g, ' '));
        if (g.plantilla && !disenoInicial) setPlantillaId(normalizarEstilo(g.plantilla));
        setEtapa('editor');
      }
    } catch { /* borrador ilegible */ }
    iaDisponible().then(setIaLista);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user || academiaUser || academiaToken) return;
    exchangeSupabaseForAcademia().catch(() => {});
  }, [user, academiaUser, academiaToken, exchangeSupabaseForAcademia]);

  // Con sesión, la hoja guardada en la cuenta manda sobre el borrador.
  useEffect(() => {
    if (!academiaUser || !academiaToken) return undefined;
    let vivo = true;
    fetch(apiUrl('/api/cv'), { headers: { Authorization: `Bearer ${academiaToken}` } })
      .then((r) => (r.ok ? r.json() : { cv: null }))
      .then((d) => {
        if (!vivo || !d.cv || sucio.current) return;
        setCv(conIds(d.cv));
        setEtapa('editor');
        setGuardado('cuenta');
      })
      .catch(() => {});
    return () => { vivo = false; };
  }, [academiaUser, academiaToken]);

  // ── Guardado automático ──
  useEffect(() => {
    if (etapa !== 'editor' || !tieneContenido(cv)) return undefined;
    const id = setTimeout(() => {
      try {
        localStorage.setItem(BORRADOR, JSON.stringify({ cv: sinIds(cv), cargo, plantilla: plantillaId }));
        if (!academiaUser) setGuardado('local');
      } catch { /* almacenamiento bloqueado */ }
    }, 700);
    return () => clearTimeout(id);
  }, [cv, cargo, plantillaId, etapa, academiaUser]);

  useEffect(() => {
    if (!academiaUser || !academiaToken || !sucio.current || !tieneContenido(cv)) return undefined;
    setGuardado('guardando');
    const id = setTimeout(async () => {
      try {
        const d = await academiaApi('/api/cv', { method: 'PUT', body: JSON.stringify(sinIds(cv)) });
        setGuardado(d.ok ? 'cuenta' : 'error');
        if (d.ok) sucio.current = false;
      } catch { setGuardado('error'); }
    }, 1500);
    return () => clearTimeout(id);
  }, [cv, academiaUser, academiaToken, academiaApi]);

  // ── Cambios ──
  const tocar = () => { sucio.current = true; };
  const PLANTILLAS_NUEVAS = {
    experiencia: () => ({ id: uid(), cargo: '', empresa: '', inicio: '', fin: '', logros: '' }),
    educacion: () => ({ id: uid(), titulo: '', institucion: '', anio: '' }),
    certificaciones: () => ({ id: uid(), nombre: '', institucion: '', anio: '' }),
    idiomas: () => ({ id: uid(), idioma: '', nivel: '' }),
    referencias: () => ({ id: uid(), nombre: '', cargo: '', contacto: '' }),
  };
  const a = {
    setField: (k, v) => { tocar(); setCv((p) => ({ ...p, [k]: v })); },
    addItem: (k) => {
      tocar();
      const nuevo = PLANTILLAS_NUEVAS[k]();
      setCv((p) => ({ ...p, [k]: [...p[k], nuevo] }));
      return nuevo.id;
    },
    removeItem: (k, id) => { tocar(); setCv((p) => ({ ...p, [k]: p[k].filter((x) => x.id !== id) })); },
    patchItem: (k, id, campo, v) => { tocar(); setCv((p) => ({ ...p, [k]: p[k].map((x) => (x.id === id ? { ...x, [campo]: v } : x)) })); },
    moveItem: (k, id, dir) => {
      tocar();
      setCv((p) => {
        const arr = [...p[k]];
        const i = arr.findIndex((x) => x.id === id);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= arr.length) return p;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        return { ...p, [k]: arr };
      });
    },
    addSkill: (s) => {
      const h = String(s || '').trim();
      if (!h) return;
      tocar();
      setCv((p) => (p.habilidades.some((x) => x.toLowerCase() === h.toLowerCase()) ? p : { ...p, habilidades: [...p.habilidades, h] }));
    },
    removeSkill: (i) => { tocar(); setCv((p) => ({ ...p, habilidades: p.habilidades.filter((_, j) => j !== i) })); },
    subirFoto: async (file) => {
      setFotoError('');
      if (!file) return;
      try {
        const foto = await procesarFoto(file);
        tocar();
        setCv((p) => ({ ...p, foto }));
        if (!plantillaPorId(plantillaId)?.foto) setAviso('Foto lista. Para verla, elige un diseño con foto: Columna derecha, Barra lateral o Moderno.');
      } catch { setFotoError('No pudimos leer esa imagen. Usa JPG o PNG.'); }
    },
    quitarFoto: () => { tocar(); setCv((p) => ({ ...p, foto: '' })); },
  };

  // ── Subir la hoja de vida anterior ──
  const subirArchivo = async (file) => {
    setErrorInicio('');
    const control = new AbortController();
    cancelarLectura.current = control;
    setLectura({ archivo: file.name, paso: 0, conIa: false });
    setEtapa('leyendo');
    trackEvent('cv_archivo_subido', { tipo: /\.docx$/i.test(file.name) ? 'docx' : 'pdf' });

    let leido;
    try {
      leido = await leerArchivoCv(file);
    } catch (e) {
      setEtapa('inicio');
      setErrorInicio(esErrorDeLectura(e) ? e.message : 'No pudimos leer este archivo. Prueba guardándolo de nuevo como PDF.');
      return;
    }
    if (control.signal.aborted) return;
    if (leido.meta.escaneado) {
      setEtapa('inicio');
      setErrorInicio('Tu archivo parece una imagen escaneada: no tiene texto que se pueda leer (tampoco lo leen los filtros ATS). Empieza desde cero o sube la versión original en Word.');
      return;
    }
    const local = lecturaLocal(leido.texto, leido.meta, cargo);
    let resultado = null;
    if (await iaDisponible()) {
      setLectura((l) => ({ ...l, paso: 1, conIa: true }));
      try {
        resultado = await revisarConIa({
          texto: leido.texto, cargo, senales: senalesDe(leido.meta), extraer: true, token: academiaToken, signal: control.signal,
        });
      } catch (e) {
        if (control.signal.aborted) return;
        setAviso(e.codigo === 'limite' ? 'Llegaste al límite de revisiones con IA por ahora: usamos la lectura rápida. Revisa que todo haya quedado en su lugar.' : 'La IA no respondió a tiempo: usamos la lectura rápida. Revisa que todo haya quedado en su lugar.');
      }
    }
    if (control.signal.aborted) return;
    setLectura((l) => ({ ...l, paso: 3 }));
    const datos = resultado?.cv || local.cv;
    tocar();
    setCv((p) => conIds({ ...CV_VACIO, ...datos, foto: p.foto }));
    const cargoDetectado = resultado?.analisis?.cargo || (typeof local.analisis.cargo === 'object' ? local.analisis.cargo?.nombre : '');
    if (!cargo && cargoDetectado) setCargo(cargoDetectado);
    setImportada({ local: local.analisis.puntaje, ia: resultado ? resultado.analisis.puntaje : null, sugerencias: resultado?.analisis || null });
    if (resultado) setAviso((v) => v || `Leímos tu hoja de vida con IA: tenía ${resultado.analisis.puntaje} de 100. Ya está en el diseño nuevo; revisa cada paso y mira qué mejorar en la revisión.`);
    else setAviso((v) => v || `Leímos tu hoja de vida: tenía ${local.analisis.puntaje} de 100. Ya está en el diseño nuevo; revisa cada paso y completa lo que haya quedado vacío.`);
    trackEvent('cv_importado', { ia: Boolean(resultado) });
    setPaso(0);
    setEtapa('editor');
  };

  const cancelar = () => {
    cancelarLectura.current?.abort();
    setEtapa('inicio');
  };

  const desdeCero = () => { setEtapa('editor'); setPaso(0); };
  const conEjemplo = () => {
    tocar();
    setCv(conIds(ejemploCv()));
    setCargo('Analista de control de calidad');
    setAviso('Este es un ejemplo. Cambia los datos por los tuyos o usa «Empezar de nuevo» para dejar todo en blanco.');
    setEtapa('editor');
  };
  const empezarDeNuevo = () => {
    if (tieneContenido(cv) && !window.confirm('¿Borrar la hoja de vida de este navegador y empezar de nuevo?')) return;
    try { localStorage.removeItem(BORRADOR); } catch { /* nada */ }
    setCv(CV_VACIO);
    setCargo('');
    setImportada(null);
    setIa({ analisis: null, huella: '', cargando: false, error: '' });
    setAviso('');
    setGuardado('');
    sucio.current = false;
    setEtapa('inicio');
  };

  // ── Revisión ──
  const cvDiferido = useDeferredValue(cv);
  const cargoSlug = useMemo(() => slugDeCargo(cargo), [cargo]);
  const local = useMemo(() => (tieneContenido(cvDiferido) ? revisionDelEditor(cvDiferido, cargo) : null), [cvDiferido, cargo]);
  const huella = useMemo(() => `${huellaCv(cv, '', null)}|${cargo}`, [cv, cargo]);
  const iaVigente = ia.analisis && ia.huella === huella;
  const sugerenciasIa = ia.analisis || importada?.sugerencias || null;
  const analisis = useMemo(() => {
    const base = iaVigente ? ia.analisis : local;
    if (!base) return null;
    if (!sugerenciasIa || base === sugerenciasIa) return base;
    // Las sugerencias de la IA (frases y perfil) se quedan aunque el puntaje sea el local.
    return {
      ...base,
      reescrituras: sugerenciasIa.reescrituras?.length ? sugerenciasIa.reescrituras : base.reescrituras,
      perfilSugerido: sugerenciasIa.perfilSugerido || base.perfilSugerido,
    };
  }, [iaVigente, ia.analisis, local, sugerenciasIa]);
  const antes = importada ? (iaVigente && importada.ia != null ? importada.ia : importada.local) : null;

  const revisarAhora = async () => {
    setIa((s) => ({ ...s, cargando: true, error: '' }));
    const h = huella;
    try {
      const r = await revisarConIa({
        texto: textoPlano(sinIds(cv)), cargo, token: academiaToken,
        senales: { origen: 'editor', disenoAts: Boolean(plantillaPorId(plantillaId)?.ats), paginas: 1 },
      });
      setIa({ analisis: r.analisis, huella: h, cargando: false, error: '' });
      trackEvent('cv_revision_ia', { puntaje: r.analisis.puntaje });
    } catch (e) {
      setIa((s) => ({ ...s, cargando: false, error: e.message }));
    }
  };

  // ── Descarga ──
  const descargar = async () => {
    setDescargando(true);
    trackEvent('cv_download_pdf', { style: plantillaId });
    try { await downloadCvPdf(sinIds(cv), '', plantillaId, { foto: cv.foto }); }
    catch { setAviso('No pudimos generar el PDF en este navegador. Prueba con Chrome o Edge actualizados.'); }
    finally { setDescargando(false); }
  };
  const copiarTexto = async () => {
    try {
      await navigator.clipboard.writeText(textoPlano(sinIds(cv)));
      setAviso('Copiamos tu hoja de vida como texto: pégala en el portal de empleo o en LinkedIn.');
    } catch { setAviso('Este navegador no dejó copiar el texto.'); }
  };

  const irAPaso = (i) => {
    setPaso(i);
    setVistaMovil('editar');
    formulario.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const avance = avancePorPaso(cv);
  const diseno = plantillaPorId(plantillaId);

  /* ── Barra superior ── */
  const estadoGuardado = {
    guardando: <><Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> Guardando…</>,
    cuenta: <><Cloud className="h-3.5 w-3.5" aria-hidden="true" /> Guardada en tu cuenta</>,
    local: <><Check className="h-3.5 w-3.5" aria-hidden="true" /> Guardada en este navegador</>,
    error: <>No se pudo guardar en tu cuenta</>,
  }[guardado];

  const barra = (
    <header className="sticky top-0 z-40 border-b border-edvanta-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 sm:px-6">
        <Link to="/hoja-de-vida" className="inline-flex items-center gap-2 rounded-lg py-2 pr-2 text-sm font-bold text-edvanta-deep transition hover:text-edvanta-blue">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <img src="/img/logo-edvanta.png" alt="Edvanta" width="931" height="512" className="h-8 w-auto" />
        </Link>
        <span className="hidden h-6 w-px bg-edvanta-border sm:block" aria-hidden="true" />
        <span className="hidden font-display text-[15px] font-extrabold text-edvanta-deep sm:block">Hoja de vida</span>
        {etapa === 'editor' && estadoGuardado && (
          <span className="hidden items-center gap-1.5 text-xs font-semibold text-edvanta-subtle md:inline-flex" role="status">{estadoGuardado}</span>
        )}
        <div className="ml-auto flex items-center gap-2">
          {etapa === 'editor' && !academiaUser && (
            <button type="button" onClick={() => setLoginAbierto(true)} className="ed-btn ed-btn--ghost ed-btn--sm hidden md:inline-flex">Guardar en mi cuenta</button>
          )}
          {etapa === 'editor' && (
            <button type="button" onClick={descargar} disabled={descargando || !tieneContenido(cv)} className="ed-btn ed-btn--primary ed-btn--sm">
              {descargando ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}
              <span className="hidden sm:inline">Descargar PDF</span><span className="sm:hidden">PDF</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );

  if (etapa === 'inicio') {
    return (
      <div className="min-h-screen ds-surface-diagonal">
        {barra}
        <PantallaInicio onArchivo={subirArchivo} onDesdeCero={desdeCero} onEjemplo={conEjemplo} error={errorInicio} iaLista={iaLista} />
        <AcademiaLoginModal isOpen={loginAbierto} onClose={() => setLoginAbierto(false)} />
      </div>
    );
  }
  if (etapa === 'leyendo') {
    return (
      <div className="min-h-screen ds-surface-diagonal">
        {barra}
        <PantallaLeyendo archivo={lectura.archivo} conIa={lectura.conIa} paso={lectura.paso} onCancelar={cancelar} />
      </div>
    );
  }

  const pasoActual = PASOS[paso];

  return (
    <div className="min-h-screen bg-edvanta-bg pb-24 lg:pb-0">
      {barra}

      <div className="mx-auto grid max-w-[1440px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-8 lg:py-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
        {/* ── Formulario ── */}
        <div ref={formulario} className={`min-w-0 scroll-mt-20 ${vistaMovil === 'ver' ? 'hidden lg:block' : ''}`}>
          <nav aria-label="Pasos de la hoja de vida" className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
            <ol className="flex min-w-max gap-1.5 rounded-2xl bg-white p-1.5 shadow-[var(--ds-sh-xs)] ring-1 ring-edvanta-border sm:min-w-0">
              {PASOS.map((p, i) => {
                const hecho = avance[p.id] >= 1;
                const activo = i === paso;
                return (
                  <li key={p.id} className="flex-1">
                    <button
                      type="button"
                      onClick={() => irAPaso(i)}
                      aria-current={activo ? 'step' : undefined}
                      className={`flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-bold transition ${activo ? 'bg-edvanta-blue text-white shadow-[var(--ds-sh-btn)]' : 'text-edvanta-muted hover:bg-edvanta-bg hover:text-edvanta-deep'}`}
                    >
                      <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${activo ? 'bg-white/20' : hecho ? 'bg-edvanta-mint text-edvanta-tealdark' : 'bg-edvanta-bg text-edvanta-subtle'}`}>
                        {hecho && !activo ? <Check className="h-3 w-3" aria-hidden="true" /> : i + 1}
                      </span>
                      {p.titulo}
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          {aviso && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-edvanta-teal/30 bg-edvanta-mint/60 px-4 py-3 text-sm leading-6 text-edvanta-deep" role="status">
              <span className="flex-1">{aviso}</span>
              <button type="button" onClick={() => setAviso('')} aria-label="Cerrar aviso" className="rounded-lg p-1 text-edvanta-tealdark hover:bg-white/60"><X className="h-4 w-4" aria-hidden="true" /></button>
            </div>
          )}

          <section className="mt-4 rounded-[var(--ds-r-lg)] bg-white p-5 shadow-[var(--ds-sh-sm)] ring-1 ring-edvanta-border sm:p-8" aria-label={pasoActual.largo}>
            <SeccionActiva
              paso={pasoActual.id}
              cv={cv}
              a={a}
              cargo={cargo}
              setCargo={(v) => { tocar(); setCargo(v); }}
              cargoSlug={cargoSlug}
              fotoError={fotoError}
              disenoConFoto={Boolean(diseno?.foto)}
              perfilIa={sugerenciasIa?.perfilSugerido || ''}
              abierto={abierto}
              setAbierto={setAbierto}
            />
            <div className="mt-8 flex items-center justify-between gap-3 border-t border-edvanta-border pt-5">
              {paso > 0
                ? <button type="button" onClick={() => irAPaso(paso - 1)} className="ed-btn ed-btn--ghost"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> {PASOS[paso - 1].titulo}</button>
                : <button type="button" onClick={empezarDeNuevo} className="ed-btn ed-btn--ghost"><RotateCcw className="h-4 w-4" aria-hidden="true" /> Empezar de nuevo</button>}
              {paso < PASOS.length - 1
                ? <button type="button" onClick={() => irAPaso(paso + 1)} className="ed-btn ed-btn--primary">Siguiente: {PASOS[paso + 1].titulo} <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
                : <button type="button" onClick={() => setPanel('disenos')} className="ed-btn ed-btn--primary"><LayoutTemplate className="h-4 w-4" aria-hidden="true" /> Elegir diseño y descargar</button>}
            </div>
          </section>
        </div>

        {/* ── Vista previa ── */}
        <aside className={`min-w-0 ${vistaMovil === 'editar' ? 'hidden lg:block' : ''}`} aria-label="Vista previa y revisión">
          <div className="space-y-4 lg:sticky lg:top-[5.5rem]">
            <ResumenRevision analisis={analisis} antes={antes} cargando={ia.cargando} onAbrir={() => setPanel('revision')} />
            <div className="rounded-[var(--ds-r-lg)] bg-white p-3 shadow-[var(--ds-sh-sm)] ring-1 ring-edvanta-border">
              <div className="mb-3 flex items-center justify-between gap-2 px-1">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[.12em] text-edvanta-subtle">Diseño</p>
                  <p className="truncate text-sm font-extrabold text-edvanta-deep">{diseno?.nombre}</p>
                </div>
                <button type="button" onClick={() => setPanel('disenos')} className="ed-btn ed-btn--secondary ed-btn--sm"><LayoutTemplate className="h-4 w-4" aria-hidden="true" /> Cambiar</button>
              </div>
              <div className="max-h-[calc(100vh-17rem)] overflow-auto rounded-xl bg-edvanta-bg p-2 lg:max-h-[calc(100vh-19rem)]">
                <VistaPreviaCv cv={sinIds(cv)} estilo={plantillaId} foto={cv.foto} ancho={500} etiqueta={false} />
              </div>
              <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                <button type="button" onClick={descargar} disabled={descargando || !tieneContenido(cv)} className="ed-btn ed-btn--primary">
                  {descargando ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />} Descargar PDF
                </button>
                <button type="button" onClick={copiarTexto} className="ed-btn ed-btn--secondary" title="Copiar como texto para portales de empleo">
                  <ClipboardCopy className="h-4 w-4" aria-hidden="true" /><span className="sr-only sm:not-sr-only">Copiar texto</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Barra inferior en el celular ── */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-edvanta-border bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-2 gap-1.5 rounded-2xl bg-edvanta-bg p-1">
          {[['editar', 'Editar', PenLine], ['ver', 'Ver mi hoja', Eye]].map(([id, texto, Icono]) => (
            <button
              key={id}
              type="button"
              onClick={() => { setVistaMovil(id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              aria-pressed={vistaMovil === id}
              className={`flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-bold transition ${vistaMovil === id ? 'bg-white text-edvanta-blue shadow-[var(--ds-sh-xs)]' : 'text-edvanta-muted'}`}
            >
              <Icono className="h-4 w-4" aria-hidden="true" /> {texto}
            </button>
          ))}
        </div>
      </div>

      {/* ── Paneles ── */}
      {panel === 'revision' && (
        <Cajon titulo="Revisión de tu hoja de vida" onCerrar={() => setPanel(null)}>
          <PanelRevision
            analisis={analisis}
            antes={antes}
            iaLista={iaLista}
            revisandoIa={ia.cargando}
            errorIa={ia.error}
            desactualizada={Boolean(ia.analisis) && !iaVigente}
            onRevisarIa={revisarAhora}
            onAgregarHabilidad={a.addSkill}
            onUsarPerfil={(t) => { a.setField('resumen', t); setPanel(null); irAPaso(1); }}
            habilidades={cv.habilidades}
          />
        </Cajon>
      )}
      {panel === 'disenos' && (
        <Cajon titulo="Elige cómo se ve" ancho="max-w-4xl" onCerrar={() => setPanel(null)}>
          <p className="mb-4 text-sm leading-6 text-edvanta-muted">Cada miniatura es tu hoja de vida real. Los marcados como «Más compatible» y los de una sola columna son los más seguros con los filtros automáticos.</p>
          <GaleriaPlantillas
            cv={sinIds(cv)}
            foto={cv.foto}
            valor={plantillaId}
            columnas="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
            onElegir={(id) => { tocar(); setPlantillaId(id); trackEvent('cv_diseno_elegido', { id }); }}
          />
          <div className="sticky bottom-0 -mx-5 mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-edvanta-border bg-white px-5 py-4 sm:-mx-7 sm:px-7">
            <button type="button" onClick={() => setPanel(null)} className="ed-btn ed-btn--secondary">Seguir editando</button>
            <button type="button" onClick={descargar} disabled={descargando || !tieneContenido(cv)} className="ed-btn ed-btn--primary">
              <Download className="h-4 w-4" aria-hidden="true" /> Descargar con «{diseno?.nombre}»
            </button>
          </div>
        </Cajon>
      )}
      <AcademiaLoginModal isOpen={loginAbierto} onClose={() => setLoginAbierto(false)} />
    </div>
  );
}

/** Panel lateral (revisión, diseños). Se cierra con Escape o tocando afuera. */
function Cajon({ titulo, onCerrar, children, ancho = 'max-w-md' }) {
  const caja = useRef(null);
  useEffect(() => {
    const tecla = (e) => { if (e.key === 'Escape') onCerrar(); };
    window.addEventListener('keydown', tecla);
    caja.current?.focus();
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', tecla); document.body.style.overflow = previo; };
  }, [onCerrar]);
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Cerrar" onClick={onCerrar} className="absolute inset-0 bg-[#031D5C]/35 backdrop-blur-[2px]" />
      <div ref={caja} tabIndex={-1} role="dialog" aria-modal="true" aria-label={titulo} className={`ds-rise relative flex h-full w-full ${ancho} flex-col bg-white shadow-[var(--ds-sh-lg)] outline-none`}>
        <div className="flex items-center justify-between gap-3 border-b border-edvanta-border px-5 py-4 sm:px-7">
          <h2 className="font-display text-lg font-extrabold text-edvanta-deep">{titulo}</h2>
          <button type="button" onClick={onCerrar} aria-label="Cerrar" className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-edvanta-subtle transition hover:bg-edvanta-bg hover:text-edvanta-blue"><X className="h-5 w-5" aria-hidden="true" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">{children}</div>
      </div>
    </div>
  );
}
