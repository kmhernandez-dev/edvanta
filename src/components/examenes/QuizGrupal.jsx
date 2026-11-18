import { useEffect, useMemo, useState } from 'react';
import { Check, Clock3, RotateCcw, Share2, Trophy, Users, X } from 'lucide-react';
import { waLink } from '../../config/links';
import { trackEvent } from '../../utils/analytics';

const NOMBRES = ['Equipo 1', 'Equipo 2', 'Equipo 3', 'Equipo 4'];
const COLORES = [
  'border-edvanta-teal/50 bg-edvanta-mint/45',
  'border-edvanta-blue/35 bg-edvanta-bg',
  'border-amber-300 bg-amber-50',
  'border-violet-300 bg-violet-50',
];

const equiposIniciales = (cantidad) => Array.from({ length: cantidad }, (_, i) => ({
  id: i,
  nombre: NOMBRES[i],
  puntos: 0,
}));

function mezclar(items) {
  const copia = [...items];
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

const porcentaje = (actual, total) => (total ? Math.round((actual / total) * 100) : 0);

function Marcador({ equipos, turno, activo }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Marcador por equipos">
      {equipos.map((equipo, i) => (
        <div
          key={equipo.id}
          aria-current={activo && i === turno ? 'true' : undefined}
          className={`rounded-xl border p-3 ${COLORES[i % COLORES.length]} ${activo && i === turno ? 'ring-2 ring-edvanta-teal ring-offset-2' : ''}`}
        >
          <p className="truncate text-xs font-bold uppercase tracking-[.1em] text-edvanta-muted">{equipo.nombre}</p>
          <p className="mt-1 font-display text-2xl font-extrabold tabular-nums text-edvanta-deep">{equipo.puntos}</p>
          <p className="text-xs font-semibold text-edvanta-muted">puntos</p>
        </div>
      ))}
    </div>
  );
}

export default function QuizGrupal({ examen }) {
  const [fase, setFase] = useState('config');
  const [cantidad, setCantidad] = useState(2);
  const [equipos, setEquipos] = useState(() => equiposIniciales(2));
  const [conTiempo, setConTiempo] = useState(true);
  const [segundos, setSegundos] = useState(30);
  const [orden, setOrden] = useState(() => examen.preguntas.map((_, i) => i));
  const [indice, setIndice] = useState(0);
  const [turno, setTurno] = useState(0);
  const [seleccion, setSeleccion] = useState(null);
  const [respondida, setRespondida] = useState(false);
  const [tiempo, setTiempo] = useState(30);
  const [historial, setHistorial] = useState([]);

  const total = examen.preguntas.length;
  const pregunta = examen.preguntas[orden[indice]];
  const equipo = equipos[turno];

  useEffect(() => {
    if (fase !== 'juego' || respondida || !conTiempo) return undefined;
    if (tiempo <= 0) {
      setRespondida(true);
      setHistorial((prev) => [...prev, { indice, equipo: turno, acierto: false, agotado: true }]);
      trackEvent('group_quiz_timeout', { examen: examen.slug, pregunta: pregunta?.id });
      return undefined;
    }
    const temporizador = setTimeout(() => setTiempo((actual) => actual - 1), 1000);
    return () => clearTimeout(temporizador);
  }, [fase, respondida, conTiempo, tiempo, indice, turno, pregunta?.id, examen.slug]);

  const cambiarCantidad = (n) => {
    setCantidad(n);
    setEquipos((prev) => Array.from({ length: n }, (_, i) => prev[i] || { id: i, nombre: NOMBRES[i], puntos: 0 }));
  };

  const cambiarNombre = (i, nombre) => {
    setEquipos((prev) => prev.map((e, n) => (n === i ? { ...e, nombre: nombre.slice(0, 24) } : e)));
  };

  const empezar = () => {
    setOrden(mezclar(examen.preguntas.map((_, i) => i)));
    setEquipos((prev) => prev.map((e) => ({ ...e, puntos: 0 })));
    setIndice(0);
    setTurno(0);
    setSeleccion(null);
    setRespondida(false);
    setTiempo(segundos);
    setHistorial([]);
    setFase('juego');
    trackEvent('group_quiz_started', { examen: examen.slug, equipos: equipos.length, conTiempo, segundos });
  };

  const responder = (opcion) => {
    if (respondida || fase !== 'juego') return;
    const acierto = opcion === pregunta.correcta;
    setSeleccion(opcion);
    setRespondida(true);
    if (acierto) {
      setEquipos((prev) => prev.map((e, i) => (i === turno ? { ...e, puntos: e.puntos + 10 } : e)));
    }
    setHistorial((prev) => [...prev, { indice, equipo: turno, acierto, agotado: false }]);
    trackEvent('group_quiz_answered', {
      examen: examen.slug,
      categoria: examen.categoria,
      pregunta: pregunta.id,
      acierto,
    });
  };

  const siguiente = () => {
    if (indice + 1 >= total) {
      setFase('final');
      trackEvent('group_quiz_completed', {
        examen: examen.slug,
        equipos: equipos.length,
        puntos: equipos.map((e) => e.puntos),
      });
      return;
    }
    setIndice((actual) => actual + 1);
    setTurno((actual) => (actual + 1) % equipos.length);
    setSeleccion(null);
    setRespondida(false);
    setTiempo(segundos);
  };

  const ranking = useMemo(
    () => [...equipos].sort((a, b) => b.puntos - a.puntos || a.nombre.localeCompare(b.nombre)),
    [equipos],
  );
  const maximaPuntuacion = ranking[0]?.puntos ?? 0;
  const ganadores = ranking.filter((e) => e.puntos === maximaPuntuacion);

  if (fase === 'config') {
    return (
      <section id="quiz-grupal" className="scroll-mt-24">
        <div className="rounded-2xl border border-edvanta-teal/25 bg-edvanta-mint/20 p-5 sm:p-6">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">
            <Users className="h-4 w-4" aria-hidden="true" />
            Quiz en grupos
          </p>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-edvanta-deep">Practiquen juntos, por turnos</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-edvanta-ink/80">
            Formen de 2 a 4 equipos. Cada pregunta es para un equipo, con opciones, tiempo y explicación
            después de responder. Gana el equipo con más puntos al terminar las {total} preguntas.
          </p>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-sm font-bold text-edvanta-deep">Número de equipos</p>
              <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Número de equipos">
                {[2, 3, 4].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => cambiarCantidad(n)}
                    aria-pressed={cantidad === n}
                    className={`min-h-10 rounded-xl border px-4 text-sm font-bold transition ${cantidad === n ? 'border-edvanta-teal bg-edvanta-teal text-white' : 'border-edvanta-border bg-white text-edvanta-deep hover:border-edvanta-teal/50'}`}
                  >
                    {n} equipos
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-edvanta-deep">Tiempo por pregunta</p>
              <label className="mt-2 flex min-h-10 items-center gap-2 rounded-xl border border-edvanta-border bg-white px-3 text-sm font-semibold text-edvanta-deep">
                <input
                  type="checkbox"
                  checked={conTiempo}
                  onChange={(event) => setConTiempo(event.target.checked)}
                  className="h-4 w-4 rounded border-edvanta-border text-edvanta-teal focus:ring-edvanta-teal"
                />
                Usar temporizador
              </label>
              <select
                value={segundos}
                onChange={(event) => setSegundos(Number(event.target.value))}
                disabled={!conTiempo}
                aria-label="Segundos por pregunta"
                className="mt-2 min-h-10 w-full rounded-xl border border-edvanta-border bg-white px-3 text-sm font-semibold text-edvanta-deep disabled:opacity-50"
              >
                <option value={20}>20 segundos</option>
                <option value={30}>30 segundos</option>
                <option value={45}>45 segundos</option>
              </select>
            </div>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {equipos.map((e, i) => (
              <label key={e.id} className="block">
                <span className="text-xs font-bold uppercase tracking-[.1em] text-edvanta-muted">Equipo {i + 1}</span>
                <input
                  type="text"
                  value={e.nombre}
                  onChange={(event) => cambiarNombre(i, event.target.value)}
                  maxLength={24}
                  className="mt-1 min-h-10 w-full rounded-xl border border-edvanta-border bg-white px-3 text-sm font-semibold text-edvanta-deep focus:border-edvanta-teal focus:outline-none focus:ring-2 focus:ring-edvanta-teal/30"
                />
              </label>
            ))}
          </div>

          <button
            type="button"
            onClick={empezar}
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-edvanta-blue px-5 text-sm font-bold text-white transition hover:bg-edvanta-bluedark"
          >
            <Users className="h-4 w-4" aria-hidden="true" />
            Comenzar quiz en grupos
          </button>
          <p className="mt-3 text-xs text-edvanta-muted">Sin registro. El puntaje es educativo y no genera certificado.</p>
        </div>
      </section>
    );
  }

  if (fase === 'final') {
    const compartir = waLink(`Terminamos el ${examen.titulo} en Edvanta. Puntajes: ${ranking.map((e) => `${e.nombre} ${e.puntos}`).join(', ')}. Practica gratis: https://edvanta.co${examen.ruta}`);
    return (
      <section id="quiz-grupal" className="scroll-mt-24" aria-live="polite">
        <div className="rounded-2xl border border-edvanta-border bg-white p-5 sm:p-6">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">
            <Trophy className="h-4 w-4" aria-hidden="true" />
            Resultado del quiz
          </p>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-edvanta-deep">
            {ganadores.length > 1 ? 'Empate en el primer lugar' : `Ganó ${ganadores[0].nombre}`}
          </h2>
          <p className="mt-1 text-sm leading-6 text-edvanta-muted">
            {ganadores.length > 1
              ? `Los equipos empataron con ${maximaPuntuacion} puntos.`
              : `Con ${maximaPuntuacion} puntos de ${total * 10} posibles.`}
          </p>

          <ol className="mt-5 space-y-2">
            {ranking.map((e, i) => (
              <li key={e.id} className="flex items-center justify-between gap-3 rounded-xl border border-edvanta-border bg-edvanta-bg px-4 py-3">
                <span className="flex items-center gap-3">
                  <span className="font-display text-lg font-extrabold text-edvanta-blue">{i + 1}.º</span>
                  <span className="text-sm font-bold text-edvanta-deep">{e.nombre}</span>
                </span>
                <span className="font-display text-xl font-extrabold tabular-nums text-edvanta-deep">{e.puntos}</span>
              </li>
            ))}
          </ol>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={empezar}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-edvanta-border bg-white px-4 text-sm font-semibold text-edvanta-blue transition hover:bg-edvanta-light"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Jugar otra vez
            </button>
            <button
              type="button"
              onClick={() => setFase('config')}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-edvanta-border bg-white px-4 text-sm font-semibold text-edvanta-blue transition hover:bg-edvanta-light"
            >
              <Users className="h-4 w-4" aria-hidden="true" />
              Cambiar equipos
            </button>
            <a
              href={compartir}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('group_quiz_shared', { examen: examen.slug })}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#25D366] px-4 text-sm font-bold text-white transition hover:bg-[#1fb959]"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              Compartir resultado
            </a>
          </div>
        </div>
      </section>
    );
  }

  const acierto = respondida && seleccion === pregunta.correcta;
  const sinRespuesta = respondida && seleccion === null;

  return (
    <section id="quiz-grupal" className="scroll-mt-24">
      <div className="rounded-2xl border border-edvanta-border bg-edvanta-bg p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">
              <Users className="h-4 w-4" aria-hidden="true" />
              Quiz en grupos
            </p>
            <p className="mt-1 text-sm font-semibold text-edvanta-deep">
              Turno de {equipo.nombre}
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm font-semibold text-edvanta-muted">
            <span>Pregunta {indice + 1} de {total}</span>
            {conTiempo && (
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ring-1 ring-edvanta-border ${tiempo <= 5 && !respondida ? 'bg-amber-50 text-amber-900' : 'bg-white text-edvanta-deep'}`}>
                <Clock3 className="h-4 w-4" aria-hidden="true" />
                {respondida ? '—' : `${tiempo}s`}
              </span>
            )}
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={porcentaje(indice, total)}>
          <div className="h-full rounded-full bg-edvanta-teal transition-[width] duration-300" style={{ width: `${porcentaje(indice, total)}%` }} />
        </div>
      </div>

      <div className="mt-4">
        <Marcador equipos={equipos} turno={turno} activo />
      </div>

      <div className="mt-5 rounded-2xl border border-edvanta-border bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">{equipo.nombre}</p>
        <h3 className="mt-2 text-base font-bold leading-7 text-edvanta-deep">{pregunta.enunciado}</h3>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {pregunta.opciones.map((opcion, n) => {
            const esElegida = seleccion === n;
            const esCorrecta = n === pregunta.correcta;
            const estilo = !respondida
              ? esElegida
                ? 'border-edvanta-teal bg-edvanta-mint/60 text-edvanta-deep'
                : 'border-edvanta-border bg-white text-edvanta-ink hover:border-edvanta-teal/50'
              : esCorrecta
                ? 'border-edvanta-teal bg-edvanta-mint/60 text-edvanta-deep'
                : esElegida
                  ? 'border-amber-300 bg-amber-50 text-amber-900'
                  : 'border-edvanta-border bg-white text-edvanta-muted';
            return (
              <button
                key={opcion}
                type="button"
                onClick={() => responder(n)}
                disabled={respondida}
                aria-pressed={esElegida}
                className={`flex min-h-14 items-start gap-2.5 rounded-xl border p-3 text-left text-sm leading-6 transition ${estilo}`}
              >
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold">
                  {String.fromCharCode(65 + n)}
                </span>
                <span>{opcion}</span>
              </button>
            );
          })}
        </div>

        {respondida && (
          <div className="mt-4 rounded-xl bg-edvanta-bg p-4 text-sm leading-6 text-edvanta-ink/80" aria-live="polite">
            <p className={`inline-flex items-center gap-1.5 font-bold ${acierto ? 'text-edvanta-tealdark' : 'text-amber-800'}`}>
              {acierto ? <Check className="h-4 w-4" aria-hidden="true" /> : <X className="h-4 w-4" aria-hidden="true" />}
              {acierto ? `Correcta: ${equipo.nombre} suma 10 puntos` : sinRespuesta ? 'Se agotó el tiempo' : 'Respuesta incorrecta'}
            </p>
            <p className="mt-1"><strong className="text-edvanta-deep">Respuesta correcta:</strong> {pregunta.opciones[pregunta.correcta]}</p>
            <p className="mt-1"><strong className="text-edvanta-deep">Por qué:</strong> {pregunta.explicacion}</p>
            <p className="mt-1 text-xs text-edvanta-muted">Fuente: {pregunta.fuente}</p>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-edvanta-muted">El turno cambia después de cada pregunta.</p>
          {respondida ? (
            <button
              type="button"
              onClick={siguiente}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-edvanta-blue px-4 text-sm font-bold text-white transition hover:bg-edvanta-bluedark"
            >
              {indice + 1 >= total ? 'Ver resultados' : 'Siguiente pregunta'}
            </button>
          ) : (
            <span className="text-xs font-semibold text-edvanta-muted">Elige una opción para responder.</span>
          )}
        </div>
      </div>
    </section>
  );
}
