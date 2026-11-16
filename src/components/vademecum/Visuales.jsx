/**
 * ============================================================
 *  Visuales del vademécum — recursos pedagógicos interactivos
 *
 *  Cada bloque tiene su equivalente en texto en el HTML prerenderizado
 *  (src/lib/vademecum/html.js), así que nada se pierde para buscadores ni
 *  lectores de pantalla: los dibujos (SVG) van con aria-hidden.
 *
 *    { mapa: { centro, ramas: [{ titulo, icono, nodos: [] }] } }     mapa conceptual radial
 *    { triangulo: { titulo?, centro, vertices: [{ titulo, texto, icono }] x3 } }
 *    { ciclo: { titulo?, centro, pasos: [{ titulo, texto, icono }] } }  ciclo circular
 *    { barras: { titulo, unidad? (texto o [singular, plural]), datos: [{ etiqueta, valor, texto? }], nota? } }
 *    { claves: [{ icono, titulo, texto }] }                           tarjetas con ícono
 *    { alerta: { tono: 'alto'|'medio'|'bajo', titulo, texto } }       semáforo
 *    { quiz: { pregunta, opciones: [{ texto, correcta, retro }] } }   autoevaluación
 *    { cta: { etiqueta, titulo, texto, url, boton, icono? } }         curso o guía
 * ============================================================
 */
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Baby, Ban, Bandage, Bed, Bone, Brain, CheckCircle2, CircleHelp, Coffee, Dna, Ear,
  Heart, HeartPulse, Hourglass, Info, Moon, PersonStanding, Shield, ShieldAlert, Siren, Skull,
  Smile, Sprout, Stethoscope, Sunrise, Utensils, Wine, XCircle,
} from 'lucide-react';
import { ICONO } from '../experiencia/iconos';
import { ConCitas } from './ConCitas';

const EXTRA = {
  Baby, Ban, Bandage, Bed, Bone, Brain, CircleHelp, Coffee, Dna, Ear, Heart, HeartPulse, Hourglass,
  Info, Moon, PersonStanding, Shield, ShieldAlert, Siren, Skull, Smile, Sprout, Stethoscope,
  Sunrise, Utensils, Wine,
};
const iconoDe = (n) => EXTRA[n] || ICONO[n] || ICONO.Sparkles;

const TONOS = ['vd-t1', 'vd-t2', 'vd-t3', 'vd-t4', 'vd-t5', 'vd-t6'];

/** Aparece al entrar en pantalla (sin animación si el usuario la reduce). */
function useVisible() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setVisible(true); return undefined; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}

function Icono({ nombre, className = 'h-5 w-5' }) {
  const I = iconoDe(nombre);
  return <I className={className} aria-hidden="true" strokeWidth={1.8} />;
}

/** Mapa conceptual radial: el concepto en el centro y sus ramas alrededor. */
export function MapaRadial({ mapa }) {
  const [ref, visible] = useVisible();
  const [activa, setActiva] = useState(null);
  const n = mapa.ramas.length;
  return (
    <figure ref={ref} className={`vd-mapa ${visible ? 'is-visible' : ''}`} aria-label={`Mapa conceptual: ${mapa.centro}`}>
      <div className="vd-mapa__lienzo">
        <svg className="vd-mapa__lineas" viewBox="-100 -100 200 200" aria-hidden="true">
          {mapa.ramas.map((r, i) => {
            const a = (i / n) * Math.PI * 2 - Math.PI / 2;
            return <line key={r.titulo} x1="0" y1="0" x2={Math.cos(a) * 70} y2={Math.sin(a) * 70} className={activa === i ? 'is-activa' : ''} />;
          })}
          <circle r="86" className="vd-mapa__orbita" />
        </svg>
        <div className="vd-mapa__centro"><span><ConCitas texto={mapa.centro} /></span></div>
        {mapa.ramas.map((r, i) => {
          const a = (i / n) * Math.PI * 2 - Math.PI / 2;
          const estilo = { '--x': `${50 + Math.cos(a) * 37}%`, '--y': `${50 + Math.sin(a) * 37}%`, '--d': `${i * 90}ms` };
          return (
            <button
              type="button"
              key={r.titulo}
              className={`vd-mapa__rama ${TONOS[i % TONOS.length]} ${activa === i ? 'is-activa' : ''}`}
              style={estilo}
              onMouseEnter={() => setActiva(i)}
              onFocus={() => setActiva(i)}
              onClick={() => setActiva(activa === i ? null : i)}
              aria-expanded={activa === i}
            >
              <span className="vd-mapa__icono"><Icono nombre={r.icono} /></span>
              <span className="vd-mapa__titulo">{r.titulo}</span>
            </button>
          );
        })}
      </div>
      <ul className="vd-mapa__detalle">
        {mapa.ramas.map((r, i) => (
          <li key={r.titulo} className={`${TONOS[i % TONOS.length]} ${activa === null || activa === i ? 'is-on' : ''}`}>
            <p className="vd-mapa__detalle-titulo"><span className="vd-punto" aria-hidden="true" /><Icono nombre={r.icono} className="h-4 w-4" />{r.titulo}</p>
            <ul>{r.nodos.map((x) => <li key={x}><ConCitas texto={x} /></li>)}</ul>
          </li>
        ))}
      </ul>
    </figure>
  );
}

/** Triángulo: tres vértices que se equilibran alrededor de una idea central. */
export function Triangulo({ triangulo }) {
  const [ref, visible] = useVisible();
  const v = triangulo.vertices;
  return (
    <figure ref={ref} className={`vd-tri ${visible ? 'is-visible' : ''}`}>
      {triangulo.titulo && <figcaption className="vd-titulo"><ConCitas texto={triangulo.titulo} /></figcaption>}
      <div className="vd-tri__lienzo">
        <svg viewBox="0 0 300 260" aria-hidden="true" className="vd-tri__svg">
          <defs>
            <linearGradient id="vdTriGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#25A7B0" />
              <stop offset="100%" stopColor="#6A61B8" />
            </linearGradient>
          </defs>
          <polygon points="150,22 278,238 22,238" className="vd-tri__forma" />
          <polygon points="150,22 278,238 22,238" className="vd-tri__trazo" />
        </svg>
        <div className="vd-tri__centro"><ConCitas texto={triangulo.centro} /></div>
        {v.map((x, i) => (
          <div key={x.titulo} className={`vd-tri__v vd-tri__v${i} ${TONOS[i]}`}>
            <span className="vd-tri__icono"><Icono nombre={x.icono} /></span>
            <span className="vd-tri__nombre">{x.titulo}</span>
          </div>
        ))}
      </div>
      <ol className="vd-tri__textos">
        {v.map((x, i) => (
          <li key={x.titulo} className={TONOS[i]}>
            <p className="font-semibold text-edvanta-deep">{x.titulo}</p>
            <p><ConCitas texto={x.texto} /></p>
          </li>
        ))}
      </ol>
    </figure>
  );
}

/** Ciclo circular de pasos: se recorre con clic o con las flechas del teclado. */
export function Ciclo({ ciclo }) {
  const [ref, visible] = useVisible();
  const [i, setI] = useState(0);
  const n = ciclo.pasos.length;
  const paso = ciclo.pasos[i];
  return (
    <figure ref={ref} className={`vd-ciclo ${visible ? 'is-visible' : ''}`}>
      {ciclo.titulo && <figcaption className="vd-titulo"><ConCitas texto={ciclo.titulo} /></figcaption>}
      <div className="vd-ciclo__cuerpo">
        <div className="vd-ciclo__rueda">
          <svg viewBox="-100 -100 200 200" aria-hidden="true">
            <circle r="78" className="vd-ciclo__anillo" />
            <circle r="78" className="vd-ciclo__progreso" style={{ strokeDasharray: `${((i + 1) / n) * 490} 490` }} />
          </svg>
          <div className="vd-ciclo__centro"><ConCitas texto={ciclo.centro} /></div>
          {ciclo.pasos.map((p, k) => {
            const a = (k / n) * Math.PI * 2 - Math.PI / 2;
            return (
              <button
                type="button"
                key={p.titulo}
                className={`vd-ciclo__nodo ${TONOS[k % TONOS.length]} ${k === i ? 'is-activo' : ''}`}
                style={{ '--x': `${50 + Math.cos(a) * 39}%`, '--y': `${50 + Math.sin(a) * 39}%` }}
                onClick={() => setI(k)}
                aria-label={`Paso ${k + 1}: ${p.titulo}`}
                aria-pressed={k === i}
              >
                <Icono nombre={p.icono} className="h-4 w-4" />
                <span className="vd-ciclo__num">{k + 1}</span>
              </button>
            );
          })}
        </div>
        <div className="vd-ciclo__panel" aria-live="polite">
          <p className="vd-ciclo__etiqueta">Paso {i + 1} de {n}</p>
          <p className="vd-ciclo__paso">{paso.titulo}</p>
          <p><ConCitas texto={paso.texto} /></p>
          <div className="vd-ciclo__nav">
            <button type="button" onClick={() => setI((i - 1 + n) % n)} className="vd-btn-sec">Anterior</button>
            <button type="button" onClick={() => setI((i + 1) % n)} className="vd-btn">Siguiente <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
          </div>
        </div>
      </div>
      <ol className="sr-only">{ciclo.pasos.map((p) => <li key={p.titulo}>{p.titulo}: {p.texto}</li>)}</ol>
    </figure>
  );
}

/** Gráfico de barras horizontal, proporcional al valor más alto. */
/** Unidad de una barra: acepta 'mg' o ['semana', 'semanas']. */
export function unidadDeBarra(unidad, valor) {
  if (!unidad) return '';
  const u = Array.isArray(unidad) ? (valor === 1 ? unidad[0] : unidad[1]) : unidad;
  return ` ${u}`;
}

export function Barras({ barras }) {
  const [ref, visible] = useVisible();
  const max = Math.max(...barras.datos.map((d) => d.valor));
  return (
    <figure ref={ref} className={`vd-barras ${visible ? 'is-visible' : ''}`}>
      <figcaption className="vd-titulo"><ConCitas texto={barras.titulo} /></figcaption>
      <ul>
        {barras.datos.map((d, i) => (
          <li key={d.etiqueta}>
            <div className="vd-barras__fila">
              <span className="vd-barras__etiqueta">{d.etiqueta}</span>
              <span className="vd-barras__valor">{d.valor.toLocaleString('es-CO')}{unidadDeBarra(barras.unidad, d.valor)}</span>
            </div>
            <div className="vd-barras__pista">
              <span className={`vd-barras__barra ${TONOS[i % TONOS.length]}`} style={{ '--w': `${Math.max(4, (d.valor / max) * 100)}%`, '--d': `${i * 80}ms` }} />
            </div>
            {d.texto && <p className="vd-barras__texto"><ConCitas texto={d.texto} /></p>}
          </li>
        ))}
      </ul>
      {barras.nota && <p className="vd-barras__nota"><ConCitas texto={barras.nota} /></p>}
    </figure>
  );
}

/** Tarjetas con ícono para las ideas clave. */
export function Claves({ claves }) {
  const [ref, visible] = useVisible();
  return (
    <ul ref={ref} className={`vd-claves ${visible ? 'is-visible' : ''}`}>
      {claves.map((c, i) => (
        <li key={c.titulo} className={TONOS[i % TONOS.length]} style={{ '--d': `${i * 70}ms` }}>
          <span className="vd-claves__icono"><Icono nombre={c.icono} /></span>
          <p className="vd-claves__titulo">{c.titulo}</p>
          <p className="vd-claves__texto"><ConCitas texto={c.texto} /></p>
        </li>
      ))}
    </ul>
  );
}

const SEMAFORO = {
  alto: { clase: 'vd-alerta--alto', icono: Siren, etiqueta: 'Alerta alta' },
  medio: { clase: 'vd-alerta--medio', icono: ShieldAlert, etiqueta: 'Precaución' },
  bajo: { clase: 'vd-alerta--bajo', icono: CheckCircle2, etiqueta: 'Buena práctica' },
};

/** Recuadro de alerta en tres niveles (semáforo). */
export function Alerta({ alerta }) {
  const s = SEMAFORO[alerta.tono] || SEMAFORO.medio;
  const I = s.icono;
  return (
    <aside className={`vd-alerta ${s.clase}`}>
      <span className="vd-alerta__icono"><I className="h-5 w-5" aria-hidden="true" /></span>
      <div>
        <p className="vd-alerta__etiqueta">{s.etiqueta}</p>
        <p className="vd-alerta__titulo"><ConCitas texto={alerta.titulo} /></p>
        <p><ConCitas texto={alerta.texto} /></p>
      </div>
    </aside>
  );
}

/** Autoevaluación: una pregunta con retroalimentación por respuesta. */
export function Quiz({ quiz }) {
  const [elegida, setElegida] = useState(null);
  const op = elegida === null ? null : quiz.opciones[elegida];
  return (
    <section className="vd-quiz" aria-label="Autoevaluación">
      <p className="vd-quiz__etiqueta"><CircleHelp className="h-4 w-4" aria-hidden="true" /> Ponte a prueba</p>
      <p className="vd-quiz__pregunta"><ConCitas texto={quiz.pregunta} /></p>
      <div className="vd-quiz__opciones">
        {quiz.opciones.map((o, i) => {
          const estado = elegida === null ? '' : o.correcta ? 'is-correcta' : i === elegida ? 'is-error' : 'is-apagada';
          return (
            <button type="button" key={o.texto} className={`vd-quiz__op ${estado}`} onClick={() => setElegida(i)} aria-pressed={elegida === i}>
              <span className="vd-quiz__letra">{String.fromCharCode(65 + i)}</span>
              <span><ConCitas texto={o.texto} /></span>
              {elegida !== null && o.correcta && <CheckCircle2 className="ml-auto h-5 w-5 shrink-0" aria-hidden="true" />}
              {elegida === i && !o.correcta && <XCircle className="ml-auto h-5 w-5 shrink-0" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      {op && (
        <p className={`vd-quiz__retro ${op.correcta ? 'is-correcta' : 'is-error'}`} aria-live="polite">
          <strong>{op.correcta ? 'Correcto. ' : 'Revisa esta idea. '}</strong><ConCitas texto={op.retro} />
        </p>
      )}
    </section>
  );
}

/** Llamado a la acción: curso, guía o kit de Edvanta. */
export function Cta({ cta }) {
  const externo = /^https?:/.test(cta.url);
  const contenido = (
    <>
      <span className="vd-cta__icono"><Icono nombre={cta.icono || 'GraduationCap'} className="h-6 w-6" /></span>
      <span className="vd-cta__cuerpo">
        <span className="vd-cta__etiqueta">{cta.etiqueta}</span>
        <span className="vd-cta__titulo">{cta.titulo}</span>
        <span className="vd-cta__texto">{cta.texto}</span>
      </span>
      <span className="vd-cta__boton">{cta.boton} <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
    </>
  );
  return externo
    ? <a href={cta.url} className="vd-cta" target="_blank" rel="noopener noreferrer">{contenido}</a>
    : <Link to={cta.url} className="vd-cta">{contenido}</Link>;
}

/** Ícono para cada dato clave según su etiqueta. */
export function iconoDeDato(etiqueta) {
  const e = etiqueta.toLowerCase();
  if (e.includes('atc') || e.includes('código')) return 'Tag';
  if (e.includes('clase') || e.includes('grupo')) return 'FlaskConical';
  if (e.includes('dosis') || e.includes('posolog')) return 'Pill';
  if (e.includes('metabol')) return 'Activity';
  if (e.includes('semivida') || e.includes('vida media') || e.includes('duración')) return 'Hourglass';
  if (e.includes('elimin')) return 'Droplets';
  if (e.includes('colombia') || e.includes('registro')) return 'MapPin';
  if (e.includes('embarazo')) return 'Baby';
  if (e.includes('riesgo') || e.includes('advert') || e.includes('alerta')) return 'ShieldAlert';
  if (e.includes('alcohol')) return 'Wine';
  return 'Sparkles';
}

export { Icono };
