/**
 * Experiencia de clase — la clase como un recorrido.
 *
 * Dibuja el bloque «experiencia» (api/lib/experiencia.js) en el aula y en
 * la página pública de la clase. Lectura limpia primero; la interacción
 * está donde ayuda a aprender un procedimiento:
 *
 *   · mapa conceptual: se enfoca una rama y las demás se atenúan;
 *   · mapa de proceso: se recorre paso a paso y, después, se practica
 *     ordenándolo de memoria;
 *   · caso: se toma una decisión y se recibe retroalimentación;
 *   · repaso: tarjetas que se voltean.
 *
 * Nada de esto califica ni se envía al servidor: es práctica.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, BookMarked, Check, CheckCircle2, ChevronDown, CircleHelp, Clock3, Compass,
  FileCheck2, Flag, ImageIcon, Lightbulb, ListChecks, Map as MapIcon, Network, RotateCcw, Shuffle,
  Sparkles, Target, TriangleAlert, Workflow, XCircle,
} from 'lucide-react';
import { iconoDe } from './iconos';
import './experiencia.css';

const TONOS = ['azul', 'turquesa', 'lavanda'];
const tono = (i) => TONOS[i % TONOS.length];

/** **negrita** → <strong>, sin HTML. */
function Rico({ children }) {
  const partes = String(children || '').split(/(\*\*[^*]+\*\*)/g);
  return partes.map((p, i) => (p.startsWith('**') && p.endsWith('**')
    ? <strong key={i}>{p.slice(2, -2)}</strong>
    : <span key={i}>{p}</span>));
}

function Encabezado({ icono: Icono, eyebrow, titulo, id }) {
  return (
    <header className="exp-encabezado">
      <span className="exp-encabezado__icono" aria-hidden="true"><Icono size={18} strokeWidth={2.2} /></span>
      <div>
        {eyebrow && <p className="exp-eyebrow">{eyebrow}</p>}
        <h2 id={id} className="exp-h2"><Rico>{titulo}</Rico></h2>
      </div>
    </header>
  );
}

// ── Navegación por secciones ─────────────────────────────────

function Recorrido({ secciones, activa, logros }) {
  return (
    <nav className="exp-recorrido" aria-label="Recorrido de la clase">
      <ol>
        {secciones.map((s) => {
          const Icono = s.icono;
          const hecha = logros[s.id];
          return (
            <li key={s.id}>
              <a href={`#${s.ancla}`} className={`exp-recorrido__item${activa === s.ancla ? ' is-activa' : ''}`}
                aria-current={activa === s.ancla ? 'step' : undefined}>
                {hecha ? <Check size={14} strokeWidth={3} aria-label="completado" /> : <Icono size={14} aria-hidden="true" />}
                <span>{s.nombre}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ── Mapa conceptual ──────────────────────────────────────────

function MapaConceptual({ mapa, idBase }) {
  const [foco, setFoco] = useState(null);
  return (
    <div className="exp-mapa" data-foco={foco !== null ? 'si' : 'no'}>
      <div className="exp-mapa__centro">
        <Network size={18} aria-hidden="true" />
        <span><Rico>{mapa.centro}</Rico></span>
      </div>
      <p className="exp-ayuda">Toca una rama para enfocarla.</p>
      <ul className={`exp-mapa__ramas${mapa.ramas.length <= 4 ? ' is-una-fila' : ''}`}
        style={{ '--columnas': mapa.ramas.length <= 4 ? mapa.ramas.length : 3 }}>
        {mapa.ramas.map((r, i) => {
          const Icono = iconoDe(r.icono);
          const activa = foco === i;
          return (
            <li key={r.titulo} className={`exp-mapa__rama tono-${tono(i)}${activa ? ' is-foco' : ''}`}>
              <button type="button" className="exp-mapa__boton" aria-pressed={activa}
                aria-controls={`${idBase}-rama-${i}`} onClick={() => setFoco(activa ? null : i)}>
                <span className="exp-mapa__icono" aria-hidden="true"><Icono size={18} /></span>
                <span className="exp-mapa__titulo"><Rico>{r.titulo}</Rico></span>
              </button>
              <ul id={`${idBase}-rama-${i}`} className="exp-mapa__nodos">
                {r.nodos.map((n) => <li key={n}><Rico>{n}</Rico></li>)}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ── Mapa de proceso con práctica de orden ────────────────────

function barajar(n, semilla) {
  const orden = Array.from({ length: n }, (_, i) => i);
  let s = semilla;
  for (let i = n - 1; i > 0; i -= 1) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [orden[i], orden[j]] = [orden[j], orden[i]];
  }
  // Nunca empezar ya ordenado.
  return orden.every((v, i) => v === i) ? [...orden.slice(1), orden[0]] : orden;
}

function MapaDeProceso({ proceso, onPracticado }) {
  const pasos = proceso.pasos;
  const [actual, setActual] = useState(0);
  const [modo, setModo] = useState('recorrer');
  const [semilla, setSemilla] = useState(7);
  const desorden = useMemo(() => barajar(pasos.length, semilla), [pasos.length, semilla]);
  const [elegidos, setElegidos] = useState([]);
  const [revisado, setRevisado] = useState(false);
  const paso = pasos[actual];
  const IconoPaso = iconoDe(paso.icono);

  const reiniciar = () => { setElegidos([]); setRevisado(false); setSemilla((s) => s + 11); };
  const aciertos = elegidos.filter((v, i) => v === i).length;
  const completo = elegidos.length === pasos.length;

  useEffect(() => {
    if (revisado && aciertos === pasos.length) onPracticado?.();
  }, [revisado, aciertos, pasos.length, onPracticado]);

  return (
    <div className="exp-proceso">
      {proceso.intro && <p className="exp-parrafo"><Rico>{proceso.intro}</Rico></p>}
      <div className="exp-tabs" role="tablist" aria-label="Modo del mapa de proceso">
        <button type="button" role="tab" aria-selected={modo === 'recorrer'} className={modo === 'recorrer' ? 'is-activo' : ''} onClick={() => setModo('recorrer')}>
          <MapIcon size={15} aria-hidden="true" /> Recorrer el proceso
        </button>
        <button type="button" role="tab" aria-selected={modo === 'practicar'} className={modo === 'practicar' ? 'is-activo' : ''} onClick={() => { setModo('practicar'); reiniciar(); }}>
          <Shuffle size={15} aria-hidden="true" /> Practicar el orden
        </button>
      </div>

      {modo === 'recorrer' ? (
        <>
          <ol className="exp-proceso__linea" style={{ '--pasos': pasos.length }}>
            {pasos.map((p, i) => {
              const Icono = iconoDe(p.icono);
              return (
                <li key={p.titulo} className={`${i === actual ? 'is-actual' : ''}${i < actual ? ' is-hecho' : ''}`}>
                  <button type="button" onClick={() => setActual(i)} aria-current={i === actual ? 'step' : undefined}>
                    <span className="exp-proceso__nodo" aria-hidden="true"><Icono size={18} /></span>
                    <span className="exp-proceso__num">Paso {i + 1}</span>
                    <span className="exp-proceso__nombre">{p.titulo}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="exp-proceso__detalle" aria-live="polite">
            <div className="exp-proceso__cabecera">
              <span className="exp-proceso__nodo exp-proceso__nodo--grande" aria-hidden="true"><IconoPaso size={22} /></span>
              <div>
                <p className="exp-eyebrow">Paso {actual + 1} de {pasos.length}</p>
                <h3 className="exp-h3">{paso.titulo}</h3>
              </div>
            </div>
            <p className="exp-parrafo"><Rico>{paso.detalle}</Rico></p>
            {paso.evidencia && (
              <p className="exp-evidencia"><FileCheck2 size={16} aria-hidden="true" /><span><strong>Evidencia:</strong> <Rico>{paso.evidencia}</Rico></span></p>
            )}
            <div className="exp-proceso__nav">
              <button type="button" className="exp-boton exp-boton--suave" disabled={actual === 0} onClick={() => setActual((a) => a - 1)}>
                <ArrowLeft size={16} aria-hidden="true" /> Anterior
              </button>
              <button type="button" className="exp-boton" disabled={actual === pasos.length - 1} onClick={() => setActual((a) => a + 1)}>
                Siguiente <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="exp-practica">
          <p className="exp-ayuda">Toca los pasos en el orden en que se ejecutan. Si te equivocas, deshaz el último.</p>
          <div className="exp-practica__columnas">
            <ul className="exp-practica__fichas" aria-label="Pasos sin ordenar">
              {desorden.filter((i) => !elegidos.includes(i)).map((i) => (
                <li key={i}>
                  <button type="button" className="exp-ficha" disabled={revisado} onClick={() => setElegidos((e) => [...e, i])}>
                    {pasos[i].titulo}
                  </button>
                </li>
              ))}
              {completo && <li className="exp-practica__listo">Ya ubicaste todos los pasos.</li>}
            </ul>
            <ol className="exp-practica__orden" aria-label="Tu orden">
              {elegidos.map((v, pos) => {
                const bien = v === pos;
                return (
                  <li key={v} className={revisado ? (bien ? 'is-bien' : 'is-mal') : ''}>
                    <span className="exp-practica__pos">{pos + 1}</span>
                    <span>{pasos[v].titulo}</span>
                    {revisado && (bien
                      ? <CheckCircle2 size={16} aria-label="en su lugar" />
                      : <span className="exp-practica__correcto">va en el {v + 1}</span>)}
                  </li>
                );
              })}
              {elegidos.length === 0 && <li className="exp-practica__placeholder">Aquí se arma tu secuencia.</li>}
            </ol>
          </div>
          <div className="exp-proceso__nav">
            <button type="button" className="exp-boton exp-boton--suave" disabled={!elegidos.length || revisado} onClick={() => setElegidos((e) => e.slice(0, -1))}>
              <RotateCcw size={16} aria-hidden="true" /> Deshacer
            </button>
            {revisado ? (
              <button type="button" className="exp-boton" onClick={reiniciar}><Shuffle size={16} aria-hidden="true" /> Intentar otra vez</button>
            ) : (
              <button type="button" className="exp-boton" disabled={!completo} onClick={() => setRevisado(true)}><Check size={16} aria-hidden="true" /> Revisar mi orden</button>
            )}
          </div>
          {revisado && (
            <p className={`exp-resultado ${aciertos === pasos.length ? 'is-bien' : 'is-regular'}`} role="status">
              {aciertos === pasos.length
                ? '¡Secuencia perfecta! Este es el orden que sostiene el proceso.'
                : `${aciertos} de ${pasos.length} pasos en su lugar. Vuelve a «Recorrer el proceso» y fíjate en qué evidencia deja cada paso.`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Caso con decisión ────────────────────────────────────────

function Caso({ caso, onRespondido }) {
  const [elegida, setElegida] = useState(null);
  const correcta = caso.opciones.findIndex((o) => o.correcta);
  const responder = (i) => { setElegida(i); onRespondido?.(); };
  return (
    <div className="exp-caso">
      <p className="exp-parrafo"><Rico>{caso.contexto}</Rico></p>
      <p className="exp-caso__pregunta"><CircleHelp size={18} aria-hidden="true" /><span><Rico>{caso.pregunta}</Rico></span></p>
      <ul className="exp-caso__opciones">
        {caso.opciones.map((o, i) => {
          const estado = elegida === null ? '' : i === correcta ? 'is-correcta' : i === elegida ? 'is-incorrecta' : 'is-atenuada';
          return (
            <li key={o.texto}>
              <button type="button" className={`exp-opcion ${estado}`} disabled={elegida !== null} aria-pressed={elegida === i} onClick={() => responder(i)}>
                <span className="exp-opcion__letra" aria-hidden="true">{String.fromCharCode(65 + i)}</span>
                <span><Rico>{o.texto}</Rico></span>
                {elegida !== null && i === correcta && <CheckCircle2 size={18} className="exp-opcion__estado" aria-label="respuesta correcta" />}
                {elegida === i && i !== correcta && <XCircle size={18} className="exp-opcion__estado" aria-label="tu respuesta" />}
              </button>
            </li>
          );
        })}
      </ul>
      {elegida !== null && (
        <div className={`exp-retro ${elegida === correcta ? 'is-bien' : 'is-mal'}`} role="status">
          <p className="exp-retro__titulo">{elegida === correcta ? 'Buena decisión' : 'Revisemos esta decisión'}</p>
          <p><Rico>{caso.opciones[elegida].retro}</Rico></p>
          {elegida !== correcta && <p><strong>La mejor opción es la {String.fromCharCode(65 + correcta)}:</strong> <Rico>{caso.opciones[correcta].retro}</Rico></p>}
          <button type="button" className="exp-boton exp-boton--suave" onClick={() => setElegida(null)}><RotateCcw size={16} aria-hidden="true" /> Volver a decidir</button>
        </div>
      )}
    </div>
  );
}

// ── Tarjetas de repaso ───────────────────────────────────────

function Tarjetas({ items, onRepasado }) {
  const [vistas, setVistas] = useState(() => new Set());
  const voltear = (i) => setVistas((v) => {
    const n = new Set(v);
    if (n.has(i)) n.delete(i); else n.add(i);
    return n;
  });
  const [repasadas, setRepasadas] = useState(() => new Set());
  useEffect(() => {
    if (repasadas.size === items.length) onRepasado?.();
  }, [repasadas, items.length, onRepasado]);
  return (
    <>
      <p className="exp-ayuda">Piensa la respuesta antes de voltear la tarjeta. Repasadas: {repasadas.size} de {items.length}.</p>
      <ul className="exp-tarjetas">
        {items.map((c, i) => {
          const abierta = vistas.has(i);
          return (
            <li key={c.pregunta}>
              <button type="button" className={`exp-tarjeta${abierta ? ' is-volteada' : ''}`} aria-expanded={abierta}
                onClick={() => { voltear(i); setRepasadas((r) => new Set(r).add(i)); }}>
                <span className="exp-tarjeta__cara exp-tarjeta__frente">
                  <span className="exp-eyebrow">Pregunta {i + 1}</span>
                  <span className="exp-tarjeta__texto"><Rico>{c.pregunta}</Rico></span>
                  <span className="exp-tarjeta__accion">Voltear <RotateCcw size={14} aria-hidden="true" /></span>
                </span>
                <span className="exp-tarjeta__cara exp-tarjeta__dorso" aria-hidden={!abierta}>
                  <span className="exp-eyebrow">Respuesta</span>
                  <span className="exp-tarjeta__texto"><Rico>{c.respuesta}</Rico></span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

// ── La clase completa ────────────────────────────────────────

export default function ExperienciaDeClase({ data, modoAutoria = false, idBase = 'exp' }) {
  const d = data || {};
  const raiz = useRef(null);
  const [activa, setActiva] = useState(null);
  const [objetivosHechos, setObjetivosHechos] = useState(() => new Set());
  const [logros, setLogros] = useState({});
  const marcar = useMemo(() => ({
    proceso: () => setLogros((l) => (l.proceso ? l : { ...l, proceso: true })),
    caso: () => setLogros((l) => (l.caso ? l : { ...l, caso: true })),
    repaso: () => setLogros((l) => (l.repaso ? l : { ...l, repaso: true })),
  }), []);

  const ancla = (s) => `${idBase}-${s}`;
  const secciones = [
    { id: 'situacion', ancla: ancla('situacion'), nombre: 'Situación', icono: Compass },
    { id: 'objetivos', ancla: ancla('objetivos'), nombre: 'Objetivos', icono: Target },
    d.conceptos?.length && { id: 'conceptos', ancla: ancla('conceptos'), nombre: 'Conceptos', icono: Lightbulb },
    d.mapa && { id: 'mapa', ancla: ancla('mapa'), nombre: 'Mapa', icono: Network },
    { id: 'lectura', ancla: ancla('lectura'), nombre: 'Lectura', icono: BookMarked },
    d.proceso && { id: 'proceso', ancla: ancla('proceso'), nombre: 'Proceso', icono: Workflow },
    d.caso && { id: 'caso', ancla: ancla('caso'), nombre: 'Caso', icono: Flag },
    d.errores?.length && { id: 'errores', ancla: ancla('errores'), nombre: 'Errores', icono: TriangleAlert },
    d.comprueba?.length && { id: 'repaso', ancla: ancla('repaso'), nombre: 'Repaso', icono: ListChecks },
    { id: 'resumen', ancla: ancla('resumen'), nombre: 'Resumen', icono: Sparkles },
  ].filter(Boolean);

  useEffect(() => {
    const nodo = raiz.current;
    if (!nodo || typeof IntersectionObserver === 'undefined') return undefined;
    const obs = new IntersectionObserver((entradas) => {
      const visibles = entradas.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visibles[0]) setActiva(visibles[0].target.id);
    }, { rootMargin: '-20% 0px -65% 0px' });
    nodo.querySelectorAll('[data-exp-seccion]').forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [idBase]);

  if (!d.gancho) return null;
  const interactivos = ['proceso', 'caso', 'repaso'].filter((k) => (k === 'proceso' ? d.proceso : k === 'caso' ? d.caso : d.comprueba?.length));
  const hechos = interactivos.filter((k) => logros[k]).length;

  return (
    <div className="exp" ref={raiz} data-sin-revelado>
      <Recorrido secciones={secciones} activa={activa} logros={logros} />

      {/* Situación inicial */}
      <section id={ancla('situacion')} data-exp-seccion className="exp-hero" aria-labelledby={`${ancla('situacion')}-t`}>
        <svg className="exp-hero__trama" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
          <g fill="none" stroke="currentColor" strokeWidth="1.2">
            <polygon points="100,20 169,60 169,140 100,180 31,140 31,60" />
            <polygon points="100,50 143,75 143,125 100,150 57,125 57,75" />
            <line x1="100" y1="20" x2="100" y2="50" /><line x1="169" y1="60" x2="143" y2="75" />
            <line x1="169" y1="140" x2="143" y2="125" /><line x1="100" y1="180" x2="100" y2="150" />
            <line x1="31" y1="140" x2="57" y2="125" /><line x1="31" y1="60" x2="57" y2="75" />
          </g>
          <g fill="currentColor"><circle cx="100" cy="20" r="4" /><circle cx="169" cy="60" r="4" /><circle cx="169" cy="140" r="4" /><circle cx="100" cy="180" r="4" /><circle cx="31" cy="140" r="4" /><circle cx="31" cy="60" r="4" /></g>
        </svg>
        <p className="exp-eyebrow exp-eyebrow--hero"><Compass size={14} aria-hidden="true" /> Situación real</p>
        <h2 id={`${ancla('situacion')}-t`} className="exp-hero__titulo"><Rico>{d.gancho.titulo}</Rico></h2>
        <p className="exp-hero__texto"><Rico>{d.gancho.texto}</Rico></p>
        <ul className="exp-hero__chips">
          {d.duracion && <li><Clock3 size={14} aria-hidden="true" /> {d.duracion} min</li>}
          {d.conceptos?.length > 0 && <li><Lightbulb size={14} aria-hidden="true" /> {d.conceptos.length} conceptos</li>}
          {d.proceso && <li><Workflow size={14} aria-hidden="true" /> {d.proceso.pasos.length} pasos</li>}
          {interactivos.length > 0 && <li><Sparkles size={14} aria-hidden="true" /> {interactivos.length} prácticas</li>}
        </ul>
      </section>

      {/* Objetivos */}
      <section id={ancla('objetivos')} data-exp-seccion className="exp-seccion" aria-labelledby={`${ancla('objetivos')}-t`}>
        <Encabezado icono={Target} eyebrow="Al terminar podrás" titulo="Lo que vas a lograr" id={`${ancla('objetivos')}-t`} />
        <ul className="exp-objetivos">
          {d.objetivos.map((o, i) => {
            const hecho = objetivosHechos.has(i);
            return (
              <li key={o}>
                <button type="button" className={`exp-objetivo${hecho ? ' is-hecho' : ''}`} aria-pressed={hecho}
                  onClick={() => setObjetivosHechos((s) => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n; })}>
                  <span className="exp-objetivo__check" aria-hidden="true">{hecho ? <Check size={14} strokeWidth={3} /> : i + 1}</span>
                  <span><Rico>{o}</Rico></span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="exp-ayuda">Al final de la clase, marca los objetivos que sientes que ya dominas.</p>
      </section>

      {/* Conceptos */}
      {d.conceptos?.length > 0 && (
        <section id={ancla('conceptos')} data-exp-seccion className="exp-seccion" aria-labelledby={`${ancla('conceptos')}-t`}>
          <Encabezado icono={Lightbulb} eyebrow="Vocabulario de la clase" titulo="Conceptos clave" id={`${ancla('conceptos')}-t`} />
          <dl className="exp-conceptos">
            {d.conceptos.map((c, i) => {
              const Icono = iconoDe(c.icono);
              return (
                <div key={c.termino} className={`exp-concepto tono-${tono(i)}`}>
                  <span className="exp-concepto__icono" aria-hidden="true"><Icono size={20} /></span>
                  <dt><Rico>{c.termino}</Rico></dt>
                  <dd><Rico>{c.definicion}</Rico></dd>
                </div>
              );
            })}
          </dl>
        </section>
      )}

      {/* Mapa conceptual */}
      {d.mapa && (
        <section id={ancla('mapa')} data-exp-seccion className="exp-seccion" aria-labelledby={`${ancla('mapa')}-t`}>
          <Encabezado icono={Network} eyebrow="Mapa conceptual" titulo="Cómo se conectan las ideas" id={`${ancla('mapa')}-t`} />
          <MapaConceptual mapa={d.mapa} idBase={idBase} />
        </section>
      )}

      {/* Lectura */}
      <section id={ancla('lectura')} data-exp-seccion className="exp-seccion exp-lectura" aria-label="Lectura de la clase">
        {d.secciones.map((s, i) => (
          <article key={s.titulo} className="exp-articulo">
            <h2 className="exp-h2 exp-articulo__titulo"><span className="exp-articulo__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><Rico>{s.titulo}</Rico></h2>
            {s.parrafos.map((p) => <p key={p.slice(0, 40)} className="exp-parrafo"><Rico>{p}</Rico></p>)}
          </article>
        ))}
      </section>

      {/* Proceso */}
      {d.proceso && (
        <section id={ancla('proceso')} data-exp-seccion className="exp-seccion" aria-labelledby={`${ancla('proceso')}-t`}>
          <Encabezado icono={Workflow} eyebrow="Mapa de proceso" titulo={d.proceso.titulo} id={`${ancla('proceso')}-t`} />
          <MapaDeProceso proceso={d.proceso} onPracticado={marcar.proceso} />
        </section>
      )}

      {/* Caso */}
      {d.caso && (
        <section id={ancla('caso')} data-exp-seccion className="exp-seccion exp-seccion--caso" aria-labelledby={`${ancla('caso')}-t`}>
          <Encabezado icono={Flag} eyebrow="Caso para decidir" titulo={d.caso.titulo} id={`${ancla('caso')}-t`} />
          <Caso caso={d.caso} onRespondido={marcar.caso} />
        </section>
      )}

      {/* Errores frecuentes */}
      {d.errores?.length > 0 && (
        <section id={ancla('errores')} data-exp-seccion className="exp-seccion" aria-labelledby={`${ancla('errores')}-t`}>
          <Encabezado icono={TriangleAlert} eyebrow="Lo que se ve en auditoría" titulo="Errores frecuentes y cómo evitarlos" id={`${ancla('errores')}-t`} />
          <ul className="exp-errores">
            {d.errores.map((e) => (
              <li key={e.error}>
                <p className="exp-errores__mal"><XCircle size={18} aria-hidden="true" /><span><span className="sr-only">Error: </span><Rico>{e.error}</Rico></span></p>
                <p className="exp-errores__bien"><CheckCircle2 size={18} aria-hidden="true" /><span><span className="sr-only">Cómo se corrige: </span><Rico>{e.correccion}</Rico></span></p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Repaso */}
      {d.comprueba?.length > 0 && (
        <section id={ancla('repaso')} data-exp-seccion className="exp-seccion" aria-labelledby={`${ancla('repaso')}-t`}>
          <Encabezado icono={ListChecks} eyebrow="Autoevaluación (no califica)" titulo="Comprueba lo que aprendiste" id={`${ancla('repaso')}-t`} />
          <Tarjetas items={d.comprueba} onRepasado={marcar.repaso} />
        </section>
      )}

      {/* Resumen */}
      <section id={ancla('resumen')} data-exp-seccion className="exp-resumen" aria-labelledby={`${ancla('resumen')}-t`}>
        <p className="exp-eyebrow exp-eyebrow--claro"><Sparkles size={14} aria-hidden="true" /> Llévate esto</p>
        <h2 id={`${ancla('resumen')}-t`} className="exp-h2 exp-h2--claro">En resumen</h2>
        <ul>
          {d.resumen.map((r) => <li key={r}><CheckCircle2 size={18} aria-hidden="true" /><span><Rico>{r}</Rico></span></li>)}
        </ul>
        {interactivos.length > 0 && (
          <p className="exp-resumen__logros">Prácticas completadas: {hechos} de {interactivos.length}{hechos === interactivos.length ? ' — ¡clase dominada!' : ''}</p>
        )}
      </section>

      {/* Referencias */}
      <section className="exp-seccion exp-referencias" aria-labelledby={`${ancla('referencias')}-t`}>
        <details>
          <summary>
            <span id={`${ancla('referencias')}-t`} className="exp-h3">Referencias ({d.referencias.length})</span>
            <ChevronDown size={18} aria-hidden="true" />
          </summary>
          <ol>
            {d.referencias.map((r) => (
              <li key={r.cita}>
                <span><Rico>{r.cita}</Rico></span>
                {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer">{new URL(r.url).hostname.replace(/^www\./, '')}</a>}
              </li>
            ))}
          </ol>
        </details>
      </section>

      {/* Sugerencias de imagen: solo en autoría */}
      {modoAutoria && d.imagenes?.length > 0 && (
        <section className="exp-seccion exp-imagenes" aria-label="Sugerencias de imagen para autoría">
          <p className="exp-eyebrow"><ImageIcon size={14} aria-hidden="true" /> Sugerencias de imagen (solo autoría, no se publican)</p>
          <ul>
            {d.imagenes.map((m) => (
              <li key={m.descripcion}>
                <p><strong>{m.ubicacion}</strong></p>
                <p>{m.descripcion}</p>
                <p className="exp-imagenes__alt">Texto alternativo: {m.alt}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
