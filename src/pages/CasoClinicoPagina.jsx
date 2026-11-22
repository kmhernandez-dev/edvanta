/**
 * ============================================================
 *  CasoClinicoPagina — /casos-clinicos/:slug
 *
 *  Un caso clínico como examen de práctica tipo juego:
 *   · Modo estudio: retroalimentación y explicación al responder,
 *     pistas (valen la mitad) y bono por racha.
 *   · Modo parcial: cronómetro, sin ayudas, nota al entregar.
 *   · Resultado: nota de 0 a 5, nivel, estrellas, repaso explicado,
 *     puntos clave, el curso del tema con certificado y el siguiente caso.
 *
 *  El prerender (scripts/seo-rutas-fijas.mjs) escribe el caso completo,
 *  con respuestas y referencias, en el HTML para los buscadores; aquí
 *  React lo reemplaza por el juego.
 * ============================================================
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Award, BookOpen, Check, CheckCircle2, ClipboardList, Clock, Flame, GraduationCap,
  Lightbulb, ListChecks, RotateCcw, Share2, Sparkles, Star, Stethoscope, Target, Timer, Trophy, XCircle,
} from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { ConCitas } from '../components/vademecum/ConCitas';
import { areaDe, casoPorSlug, siguienteCaso } from '../data/casosClinicos';
import {
  NOTA_APROBATORIA, RUTA_BASE, SITIO, TIPOS, conEspacio, esAcierto, fraccionCorrecta, jsonLdDeCaso,
  notaEscrita, ordenDerecha, ordenOpciones, puntosDePregunta, respuestaCorrecta, resultado, robotsDeCaso, tituloDeCaso,
} from '../lib/casosClinicos/motor.js';
import { guardarIntento, leerProgreso } from '../lib/casosClinicos/progreso.js';
import { updatePageSeo } from '../utils/seo';
import '../styles/casos-clinicos.css';
import BotonesDeCompra from '../components/curso/BotonesDeCompra';

const LETRAS = ['A', 'B', 'C', 'D', 'E'];
const COLORES_PAR = ['#7c5cd6', '#1f9bd1', '#f08a24', '#16a37a', '#e14b5a', '#c7a008'];
const COLOR_NOTA = (pct) => (pct >= 80 ? '#12996f' : pct >= 60 ? '#f5a623' : '#e14b5a');

const fecha = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
const reloj = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

/** ¿La pregunta ya tiene una respuesta completa para comprobar? */
function respondida(p, r) {
  if (r == null) return false;
  if (p.tipo === 'completar') return String(r).trim().length > 0;
  if (p.tipo === 'relacionar') return p.pares.every((_, i) => r[i] != null);
  return true;
}

function Confeti() {
  const piezas = useMemo(() => Array.from({ length: 48 }, (_, i) => ({
    left: Math.random() * 100,
    color: COLORES_PAR[i % COLORES_PAR.length],
    dx: `${(Math.random() - 0.5) * 240}px`,
    giro: `${Math.round(Math.random() * 720)}deg`,
    delay: `${Math.random() * 0.6}s`,
  })), []);
  return (
    <div className="cc-confeti" aria-hidden="true">
      {piezas.map((p, i) => (
        <i key={i} style={{ left: `${p.left}%`, background: p.color, '--cc-dx': p.dx, '--cc-giro': p.giro, animationDelay: p.delay }} />
      ))}
    </div>
  );
}

/** Opción múltiple. */
function Opciones({ p, orden, valor, onCambio, revelar }) {
  return (
    <ul className="cc-opciones">
      {orden.map((k, pos) => {
        const o = p.opciones[k];
        let estado = valor === k ? 'is-elegida' : '';
        if (revelar) {
          if (k === p.correcta) estado = 'is-correcta';
          else if (valor === k) estado = 'is-incorrecta';
          else estado = '';
        }
        return (
          <li key={k}>
            <button type="button" className={`cc-opcion ${estado}`} onClick={() => onCambio(k)} disabled={revelar} aria-pressed={valor === k}>
              <span className="cc-letra">{LETRAS[pos]}</span>
              <span><ConCitas texto={o} /></span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** Completar el espacio. */
function Completar({ p, valor, onCambio, revelar, conPista, onPista, permitirPista, onEnter }) {
  const bien = revelar && fraccionCorrecta(p, valor) === 1;
  return (
    <div>
      <div className="cc-completar">
        <input
          type="text"
          value={valor ?? ''}
          onChange={(e) => onCambio(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onEnter?.(); }}
          disabled={revelar}
          placeholder="Escribe tu respuesta"
          aria-label="Respuesta"
          autoComplete="off"
          className={revelar ? (bien ? 'is-correcta' : 'is-incorrecta') : ''}
        />
        {permitirPista && p.pista && !revelar && !conPista && (
          <button type="button" className="cc-boton cc-boton--suave" onClick={onPista}>
            <Lightbulb size={18} aria-hidden="true" /> Pista (vale la mitad)
          </button>
        )}
      </div>
      {conPista && p.pista && <p className="cc-pista"><strong>Pista:</strong> {p.pista}</p>}
      {revelar && !bien && <p className="cc-pista"><strong>Respuesta:</strong> {p.respuestas[0]}</p>}
    </div>
  );
}

/** Relacionar: toca un término y luego su pareja. */
function Relacionar({ p, orden, valor = {}, onCambio, revelar }) {
  const [activa, setActiva] = useState(null);
  const derechaUsada = (d) => Object.entries(valor).find(([, v]) => v === d)?.[0];

  const tocarIzquierda = (i) => {
    if (revelar) return;
    if (valor[i] != null) {
      const nuevo = { ...valor };
      delete nuevo[i];
      onCambio(nuevo);
      setActiva(i);
      return;
    }
    setActiva(activa === i ? null : i);
  };
  const tocarDerecha = (d) => {
    if (revelar) return;
    const izquierda = activa ?? p.pares.findIndex((_, i) => valor[i] == null);
    if (izquierda < 0) return;
    const nuevo = { ...valor };
    const previa = derechaUsada(d);
    if (previa != null) delete nuevo[previa];
    nuevo[izquierda] = d;
    onCambio(nuevo);
    setActiva(null);
  };

  return (
    <div>
      <div className="cc-relacionar">
        <div className="cc-relacionar__col">
          <span className="cc-relacionar__titulo">Término</span>
          {p.pares.map(([a], i) => {
            const unida = valor[i] != null;
            let clase = unida ? 'is-unida' : '';
            if (revelar) clase = Number(valor[i]) === i ? 'is-correcta' : 'is-incorrecta';
            return (
              <button
                key={i}
                type="button"
                className={`cc-ficha ${clase} ${activa === i ? 'is-activa' : ''}`}
                style={{ '--cc-par': COLORES_PAR[i % COLORES_PAR.length] }}
                data-n={i + 1}
                onClick={() => tocarIzquierda(i)}
                disabled={revelar}
                aria-pressed={activa === i}
              >
                <ConCitas texto={a} />
              </button>
            );
          })}
        </div>
        <div className="cc-relacionar__col">
          <span className="cc-relacionar__titulo">Pareja</span>
          {orden.map((d) => {
            const izq = derechaUsada(d);
            let clase = izq != null ? 'is-unida' : '';
            if (revelar) clase = izq != null && Number(izq) === d ? 'is-correcta' : 'is-incorrecta';
            return (
              <button
                key={d}
                type="button"
                className={`cc-ficha ${clase}`}
                style={izq != null ? { '--cc-par': COLORES_PAR[Number(izq) % COLORES_PAR.length] } : undefined}
                data-n={izq != null ? Number(izq) + 1 : ''}
                onClick={() => tocarDerecha(d)}
                disabled={revelar}
              >
                <ConCitas texto={p.pares[d][1]} />
              </button>
            );
          })}
        </div>
      </div>
      {!revelar && <p className="cc-ayuda">Toca un término y después su pareja. Para deshacer una unión, toca el término otra vez.</p>}
      {revelar && (
        <ul className="cc-pista" style={{ listStyle: 'none' }}>
          {p.pares.map(([a, b]) => <li key={a}><strong>{a}</strong> → {b}</li>)}
        </ul>
      )}
    </div>
  );
}

const ESCUELA_SALUD = ['Escuela de Salud y Farmacia Clínica', '/escuelas/salud-y-farmacia-clinica'];

/**
 * Del caso al curso y al certificado: lo que vende. Los beneficios y el
 * precio son los del camino «Estudiar con certificado» de la ficha
 * (COP 60.000 en Colombia y 65.000 en otros países, con descuento, si
 * se compra al inscribirse o en los primeros 7 días).
 */
function CertificadoCta({ curso, final = null }) {
  const destino = curso || ESCUELA_SALUD;
  const aprobado = final && final.nota >= NOTA_APROBATORIA;
  const titulo = final
    ? (aprobado ? `Aprobaste el caso con ${notaEscrita(final.nota)}. Ahora certifícalo` : 'Refuerza el tema y certifícate')
    : 'Lleva este tema a tu hoja de vida';
  return (
    <div className="cc-cta cc-cta--certificado">
      <Award size={30} aria-hidden="true" />
      <div>
        <h3>{titulo}</h3>
        <p>
          {curso ? <>Estudia el <strong>{curso[0]}</strong> con certificado verificable de Edvanta.</> : <>Elige un curso de la {ESCUELA_SALUD[0]} y estúdialo con certificado verificable.</>}
        </p>
        <ul className="cc-beneficios">
          <li><Check size={16} aria-hidden="true" /> Acompañamiento personalizado por WhatsApp (respuesta en 48 horas hábiles)</li>
          <li><Check size={16} aria-hidden="true" /> Revisión de tus actividades por una química farmacéutica o un docente</li>
          <li><Check size={16} aria-hidden="true" /> Certificado con código de verificación para tu hoja de vida</li>
        </ul>
      </div>
      {curso ? (
        <BotonesDeCompra cursoUrl={curso[1]} origen="caso_clinico" className="cc-cta__botones" />
      ) : (
        <div className="cc-cta__botones">
          <Link to={destino[1]} className="cc-boton">
            <GraduationCap size={18} aria-hidden="true" /> Ver cursos con certificado
          </Link>
        </div>
      )}
    </div>
  );
}

/** Lo que respondió la persona, en texto (para el repaso). */
function respuestaEscrita(p, r) {
  if (r == null || r === '') return 'Sin responder';
  if (p.tipo === 'opcion') return p.opciones[r];
  if (p.tipo === 'completar') return String(r);
  return p.pares.map(([a], i) => `${a} → ${r[i] != null ? p.pares[r[i]][1] : '—'}`).join('; ');
}

export default function CasoClinicoPagina() {
  const { slug } = useParams();
  const caso = casoPorSlug(slug);
  const area = caso ? areaDe(caso) : null;
  const siguiente = caso ? siguienteCaso(caso) : null;
  const curso = caso?.enlaces?.find((e) => e[2] === 'Curso');

  const [fase, setFase] = useState('inicio');
  const [modo, setModo] = useState('estudio');
  const [i, setI] = useState(0);
  const [respuestas, setRespuestas] = useState([]);
  const [pistas, setPistas] = useState([]);
  const [comprobadas, setComprobadas] = useState([]);
  const [segundos, setSegundos] = useState(0);
  const [final, setFinal] = useState(null);
  const [casoAbierto, setCasoAbierto] = useState(true);
  const [mejor, setMejor] = useState(null);
  const [sube, setSube] = useState(false);
  const tarjeta = useRef(null);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);
  useEffect(() => {
    setFase('inicio'); setFinal(null); setI(0); setRespuestas([]); setPistas([]); setComprobadas([]);
    setMejor(caso ? leerProgreso().casos[caso.slug] || null : null);
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!caso) return undefined;
    const url = `${SITIO}${RUTA_BASE}/${caso.slug}`;
    return updatePageSeo({
      title: tituloDeCaso(caso),
      description: caso.seo.descripcion,
      canonical: url,
      type: 'article',
      robots: robotsDeCaso(caso),
      jsonLdId: `caso-${caso.slug}`,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: caso.titulo,
          description: caso.seo.descripcion,
          url,
          inLanguage: 'es-CO',
          dateModified: caso.actualizado,
          ...(caso.revisor ? { lastReviewed: caso.reviewedAt, reviewedBy: { '@type': 'Person', name: caso.revisor, ...(caso.revisorUrl ? { url: caso.revisorUrl } : {}) } } : {}),
          mainEntity: { '@context': 'https://schema.org', ...jsonLdDeCaso(caso, { area }) },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [['Inicio', `${SITIO}/`], ['Casos clínicos', `${SITIO}${RUTA_BASE}`], [caso.titulo, url]]
            .map(([name, item], k) => ({ '@type': 'ListItem', position: k + 1, name, item })),
        },
      ],
    });
  }, [caso, area]);

  // Cronómetro del modo parcial.
  useEffect(() => {
    if (fase !== 'jugando' || modo !== 'parcial') return undefined;
    if (segundos <= 0) { entregar(); return undefined; }
    const t = setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [fase, modo, segundos]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!caso) return <Navigate to={RUTA_BASE} replace />;

  const preguntas = caso.preguntas;
  const p = preguntas[i];
  const total = preguntas.length;
  const enEstudio = modo === 'estudio';
  const revelar = enEstudio && Boolean(comprobadas[i]);
  const parcialVivo = resultado(preguntas.slice(0, comprobadas.filter(Boolean).length), respuestas, pistas);
  const rachaViva = (() => {
    let n = 0;
    for (let k = 0; k < total && comprobadas[k]; k += 1) n = esAcierto(preguntas[k], respuestas[k]) ? n + 1 : 0;
    return n;
  })();

  const empezar = (m) => {
    setModo(m); setFase('jugando'); setI(0); setRespuestas([]); setPistas([]); setComprobadas([]); setFinal(null);
    setSegundos(caso.minutos * 60);
    if (typeof window !== 'undefined' && window.matchMedia?.('(max-width: 1023px)').matches) setCasoAbierto(false);
    setTimeout(() => tarjeta.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };
  const responder = (v) => setRespuestas((r) => { const n = [...r]; n[i] = v; return n; });
  const usarPista = () => setPistas((x) => { const n = [...x]; n[i] = true; return n; });
  const comprobar = () => {
    if (!respondida(p, respuestas[i])) return;
    setComprobadas((c) => { const n = [...c]; n[i] = true; return n; });
    if (esAcierto(p, respuestas[i]) || fraccionCorrecta(p, respuestas[i]) > 0) { setSube(true); setTimeout(() => setSube(false), 600); }
  };
  function entregar() {
    const r = resultado(preguntas, respuestas, pistas);
    const { record, anterior } = guardarIntento(caso.slug, r);
    setFinal({ ...r, record, anterior });
    setMejor(leerProgreso().casos[caso.slug] || null);
    setFase('final');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 30);
  }
  const ir = (k) => { setI(k); setTimeout(() => tarjeta.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30); };
  const siguientePregunta = () => (i + 1 < total ? ir(i + 1) : entregar());

  const ptsActual = revelar ? puntosDePregunta(p, respuestas[i], { racha: rachaViva, conPista: Boolean(pistas[i]) }) : null;
  const fraccion = revelar ? fraccionCorrecta(p, respuestas[i]) : 0;
  const url = `${SITIO}${RUTA_BASE}/${caso.slug}`;
  const textoWhatsApp = final
    ? `Saqué ${notaEscrita(final.nota)} de 5,0 en el ${caso.titulo.toLowerCase()} de Edvanta. ¿Te le mides? ${url}`
    : '';

  const estiloArea = area ? { '--cc-area': area.color, '--cc-area-suave': area.suave } : undefined;

  return (
    <div className="cc min-h-screen" style={estiloArea}>
      <SiteHeader />
      {final && final.porcentaje >= 80 && <Confeti />}
      <main>
        <section className="cc-heroe">
          <div className="cc-contenedor">
            <nav className="cc-migas" aria-label="Ruta de navegación">
              <Link to="/">Inicio</Link> › <Link to={RUTA_BASE}>Casos clínicos</Link> › <span>{caso.enfermedad}</span>
            </nav>
            {area && <span className="cc-chip"><Stethoscope size={14} aria-hidden="true" /> {area.nombre}</span>}
            <h1 className="cc-titulo">{caso.titulo}</h1>
            <p className="cc-sub">Examen de práctica tipo parcial: lee el caso, responde {total} preguntas y conoce tu nota de 0 a 5 con la explicación de cada respuesta.</p>
            <div className="cc-meta">
              <span><ListChecks size={16} aria-hidden="true" /> {total} preguntas</span>
              <span><Clock size={16} aria-hidden="true" /> {caso.minutos} min</span>
              <span><Target size={16} aria-hidden="true" /> {caso.nivel}</span>
              {mejor && <span><Trophy size={16} aria-hidden="true" /> Tu mejor nota: {notaEscrita(mejor.nota)}</span>}
            </div>
            <p className="cc-aviso-revision">
              Actualizado el {fecha(caso.actualizado)}
              {caso.revisor ? <> · Revisado por {caso.revisor} el {fecha(caso.reviewedAt)}</> : ' · En revisión clínica'}
            </p>
          </div>
        </section>

        <div className="cc-contenedor cc-cuerpo">
          <aside className="cc-panel cc-caso" aria-label="Historia clínica">
            <details open={casoAbierto} onToggle={(e) => setCasoAbierto(e.currentTarget.open)}>
              <summary><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><ClipboardList size={18} aria-hidden="true" /> El caso</span></summary>
              <p style={{ marginTop: 12 }}><ConCitas texto={caso.presentacion} /></p>
              {caso.datos?.length > 0 && (
                <table className="cc-datos">
                  <tbody>
                    {caso.datos.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td><ConCitas texto={v} /></td></tr>)}
                  </tbody>
                </table>
              )}
            </details>
          </aside>

          <div ref={tarjeta} style={{ scrollMarginTop: 90 }}>
            {fase === 'inicio' && (
              <section className="cc-panel cc-inicio">
                <h2>¿Listo para el parcial?</h2>
                <p className="cc-sub" style={{ fontSize: '0.96875rem' }}>Con este caso practicas:</p>
                <ul className="cc-objetivos">
                  {(caso.objetivos || []).map((o) => <li key={o}><CheckCircle2 size={18} aria-hidden="true" /> {o}</li>)}
                </ul>
                <div className="cc-modos">
                  <button type="button" className="cc-modo cc-modo--estudio" onClick={() => empezar('estudio')}>
                    <strong><BookOpen size={20} aria-hidden="true" /> Modo estudio</strong>
                    <span>Ves si acertaste y por qué en cada pregunta. Hay pistas y bonos por racha.</span>
                  </button>
                  <button type="button" className="cc-modo cc-modo--parcial" onClick={() => empezar('parcial')}>
                    <strong><Timer size={20} aria-hidden="true" /> Modo parcial</strong>
                    <span>{caso.minutos} minutos, sin ayudas. La nota y las respuestas, al entregar.</span>
                  </button>
                </div>
                <div style={{ marginTop: 20 }}><CertificadoCta curso={curso} /></div>
                {mejor && (
                  <p className="cc-mejor"><Trophy size={16} aria-hidden="true" /> Tu mejor resultado: {notaEscrita(mejor.nota)} ({mejor.mejor} %) en {mejor.intentos} {mejor.intentos === 1 ? 'intento' : 'intentos'}. ¿Lo superas?</p>
                )}
              </section>
            )}

            {fase === 'jugando' && (
              <section className="cc-panel" aria-label={`Pregunta ${i + 1} de ${total}`}>
                <div className="cc-marcador">
                  <div className="cc-marcador__grupo">
                    <span className={`cc-puntos ${sube ? 'cc-puntos--sube' : ''}`}><Sparkles size={20} aria-hidden="true" /> {enEstudio ? parcialVivo.puntos : '—'}</span>
                    {enEstudio && rachaViva > 1 && <span className="cc-racha cc-racha--viva"><Flame size={14} aria-hidden="true" /> Racha ×{rachaViva}</span>}
                  </div>
                  <div className="cc-marcador__grupo">
                    {!enEstudio && <span className={`cc-reloj ${segundos < 60 ? 'cc-reloj--poco' : ''}`}><Timer size={18} aria-hidden="true" /> {reloj(segundos)}</span>}
                    <span style={{ fontWeight: 700, color: 'var(--cc-muted)' }}>{enEstudio ? 'Modo estudio' : 'Modo parcial'}</span>
                  </div>
                </div>
                <div className="cc-progreso" aria-hidden="true">
                  {preguntas.map((q, k) => {
                    let c = '';
                    if (enEstudio && comprobadas[k]) {
                      const f = fraccionCorrecta(q, respuestas[k]);
                      c = f === 1 ? 'is-bien' : f > 0 ? 'is-parcial' : 'is-mal';
                    } else if (!enEstudio && respondida(q, respuestas[k])) c = 'is-respondida';
                    if (k === i && !(enEstudio && comprobadas[k])) c = 'is-actual';
                    return <span key={k} className={c} />;
                  })}
                </div>

                <div className="cc-pregunta">
                  <p className="cc-pregunta__cabeza">
                    <span>Pregunta {i + 1} de {total}</span>
                    <span className="cc-tipo">{TIPOS[p.tipo]}</span>
                  </p>
                  <p className="cc-enunciado"><ConCitas texto={p.tipo === 'completar' ? conEspacio(p.enunciado) : p.enunciado} /></p>

                  {p.tipo === 'opcion' && <Opciones p={p} orden={ordenOpciones(caso, i)} valor={respuestas[i]} onCambio={responder} revelar={revelar} />}
                  {p.tipo === 'completar' && (
                    <Completar
                      p={p}
                      valor={respuestas[i]}
                      onCambio={responder}
                      revelar={revelar}
                      conPista={Boolean(pistas[i])}
                      onPista={usarPista}
                      permitirPista={enEstudio}
                      onEnter={() => (enEstudio && !revelar ? comprobar() : null)}
                    />
                  )}
                  {p.tipo === 'relacionar' && (
                    <Relacionar key={`${caso.slug}-${i}`} p={p} orden={ordenDerecha(caso, i)} valor={respuestas[i]} onCambio={responder} revelar={revelar} />
                  )}

                  {revelar && (
                    <div className={`cc-retro ${fraccion === 1 ? 'cc-retro--bien' : fraccion > 0 ? 'cc-retro--parcial' : 'cc-retro--mal'}`} role="status" aria-live="polite">
                      <p className="cc-retro__titulo">
                        {fraccion === 1 ? <><CheckCircle2 size={20} aria-hidden="true" /> ¡Correcto!</> : fraccion > 0 ? <><Target size={20} aria-hidden="true" /> Casi: {Math.round(fraccion * 100)} %</> : <><XCircle size={20} aria-hidden="true" /> No es correcto</>}
                        {ptsActual && <span className="cc-ganados">+{ptsActual.total} pts{ptsActual.bono ? ` (incluye +${ptsActual.bono} por racha)` : ''}</span>}
                      </p>
                      {p.tipo === 'opcion' && fraccion < 1 && <p><strong>Respuesta correcta:</strong> {p.opciones[p.correcta]}</p>}
                      <p><ConCitas texto={p.explicacion} /></p>
                    </div>
                  )}

                  <div className="cc-acciones">
                    {enEstudio && !revelar && (
                      <button type="button" className="cc-boton" onClick={comprobar} disabled={!respondida(p, respuestas[i])}>
                        <Check size={18} aria-hidden="true" /> Comprobar
                      </button>
                    )}
                    {enEstudio && revelar && (
                      <button type="button" className="cc-boton" onClick={siguientePregunta}>
                        {i + 1 < total ? <>Siguiente <ArrowRight size={18} aria-hidden="true" /></> : <>Ver mi nota <Award size={18} aria-hidden="true" /></>}
                      </button>
                    )}
                    {!enEstudio && (
                      <>
                        {i > 0 && <button type="button" className="cc-boton cc-boton--suave" onClick={() => ir(i - 1)}><ArrowLeft size={18} aria-hidden="true" /> Anterior</button>}
                        {i + 1 < total
                          ? <button type="button" className="cc-boton" onClick={() => ir(i + 1)}>Siguiente <ArrowRight size={18} aria-hidden="true" /></button>
                          : <button type="button" className="cc-boton cc-boton--verde" onClick={entregar}><Award size={18} aria-hidden="true" /> Entregar examen</button>}
                      </>
                    )}
                  </div>
                </div>
              </section>
            )}

            {fase === 'final' && final && (
              <>
                <section className="cc-panel cc-final" aria-live="polite">
                  <div className="cc-anillo" style={{ '--cc-pct': final.porcentaje, '--cc-color-nota': COLOR_NOTA(final.porcentaje) }}>
                    <div className="cc-anillo__texto">
                      <span className="cc-nota">{notaEscrita(final.nota)}<small> /5,0</small></span>
                      <span style={{ fontWeight: 700, color: 'var(--cc-muted)' }}>{final.porcentaje} %</span>
                    </div>
                  </div>
                  <p className="cc-nivel" style={{ color: COLOR_NOTA(final.porcentaje) }}>{final.nivel.nombre}</p>
                  <div className="cc-estrellas" aria-label={`${final.estrellas} de 3 estrellas`}>
                    {[0, 1, 2].map((k) => <Star key={k} className={k < final.estrellas ? 'is-ganada' : ''} fill="currentColor" aria-hidden="true" />)}
                  </div>
                  <p className="cc-sub" style={{ margin: '0 auto', textAlign: 'center' }}>
                    {final.nota >= NOTA_APROBATORIA ? '¡Aprobarías el parcial! ' : ''}{final.nivel.mensaje}
                  </p>
                  {final.record && final.anterior && <p className="cc-mejor"><Trophy size={16} aria-hidden="true" /> ¡Nuevo récord! Antes tenías {notaEscrita(final.anterior.nota)}.</p>}
                  <div className="cc-cifras">
                    <div><strong>{final.aciertos}/{total}</strong><span>Aciertos</span></div>
                    <div><strong>{final.puntos}</strong><span>Puntos</span></div>
                    <div><strong>×{final.mejorRacha}</strong><span>Mejor racha</span></div>
                  </div>
                  <div className="cc-acciones">
                    <button type="button" className="cc-boton cc-boton--suave" onClick={() => empezar(modo)}><RotateCcw size={18} aria-hidden="true" /> Repetir</button>
                    {modo === 'estudio' && <button type="button" className="cc-boton cc-boton--suave" onClick={() => empezar('parcial')}><Timer size={18} aria-hidden="true" /> Probar modo parcial</button>}
                    {siguiente && <Link to={`${RUTA_BASE}/${siguiente.slug}`} className="cc-boton">Siguiente caso <ArrowRight size={18} aria-hidden="true" /></Link>}
                    <a className="cc-boton cc-boton--whatsapp" href={`https://wa.me/?text=${encodeURIComponent(textoWhatsApp)}`} target="_blank" rel="noopener noreferrer"><Share2 size={18} aria-hidden="true" /> Reta a un compañero</a>
                  </div>
                </section>

                <CertificadoCta curso={curso} final={final} />

                <section className="cc-panel cc-repaso" style={{ marginTop: 16 }}>
                  <h2>Repaso de tus respuestas</h2>
                  {preguntas.map((q, k) => {
                    const d = final.detalle[k];
                    const clase = d.fraccion === 1 ? 'is-bien' : d.fraccion > 0 ? 'is-parcial' : 'is-mal';
                    return (
                      <details key={k} className={clase} open={d.fraccion < 1}>
                        <summary>
                          {d.fraccion === 1 ? <CheckCircle2 size={20} aria-hidden="true" /> : d.fraccion > 0 ? <Target size={20} aria-hidden="true" /> : <XCircle size={20} aria-hidden="true" />}
                          <span>{k + 1}. <ConCitas texto={q.tipo === 'completar' ? conEspacio(q.enunciado) : q.enunciado} /></span>
                        </summary>
                        <div className="cc-repaso__cuerpo">
                          <p><strong>Tu respuesta:</strong> {respuestaEscrita(q, respuestas[k])}</p>
                          {d.fraccion < 1 && <p><strong>Respuesta correcta:</strong> <ConCitas texto={respuestaCorrecta(q)} /></p>}
                          <p><ConCitas texto={q.explicacion} /></p>
                        </div>
                      </details>
                    );
                  })}
                </section>
              </>
            )}

            {fase === 'final' && caso.claves?.length > 0 && (
              <section className="cc-panel cc-bloque" style={{ marginTop: 16 }}>
                <h2>Puntos clave para el parcial</h2>
                <ul>{caso.claves.map((c) => <li key={c}><ConCitas texto={c} /></li>)}</ul>
              </section>
            )}

            {caso.enlaces?.length > 0 && (
              <section className="cc-panel cc-bloque" style={{ marginTop: 16 }}>
                <h2>Para profundizar</h2>
                <ul>
                  {caso.enlaces.map(([t, u, tipo]) => <li key={u}><Link to={u}>{t}</Link> <span style={{ color: 'var(--cc-muted)', fontSize: '0.8125rem' }}>· {tipo}</span></li>)}
                </ul>
                <p style={{ marginTop: 14 }}>
                  <Link to={RUTA_BASE} className="cc-boton cc-boton--suave"><ListChecks size={18} aria-hidden="true" /> Ver los demás casos clínicos</Link>
                </p>
              </section>
            )}

            <section className="cc-panel cc-bloque" id="referencias" style={{ marginTop: 16 }}>
              <h2>Referencias</h2>
              <ol className="cc-referencias">
                {caso.referencias.map((r, k) => (
                  <li key={r.texto} id={`ref-${k + 1}`}>
                    {r.url ? <a href={r.url} target="_blank" rel="noopener noreferrer">{r.texto}</a> : r.texto}
                  </li>
                ))}
              </ol>
              <p className="cc-referencias" style={{ marginTop: 12 }}>Material educativo para estudiantes y profesionales de la salud. Los casos son ficticios y no reemplazan las guías vigentes ni el criterio clínico.</p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
