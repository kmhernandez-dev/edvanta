import { Component } from 'react';

const RELOAD_KEY = 'fst-chunk-reload-attempts';
// Los reintentos tienen que cubrir lo que tarda un despliegue de verdad.
// Medido en Coolify: entre 105 y 195 segundos desde el push hasta que el
// contenedor nuevo sirve los assets. Con los 5 intentos anteriores se
// esperaban 34 segundos en total y la persona acababa viendo el error.
const MAX_RELOADS = 7;
const WINDOW_MS = 420000;     // 7 min: fuera de esa ventana los intentos se reinician solos

// Detecta errores de "chunk desactualizado" tras un deploy: el navegador tiene
// un index.html/bundle viejo que apunta a assets con hash que ya no existen.
const CHUNK_ERROR = /dynamically imported module|importing a module script failed|failed to fetch|module script|import\(\)|loading (?:css )?chunk|chunkloaderror/i;

function readAttempts() {
  try { return JSON.parse(sessionStorage.getItem(RELOAD_KEY) || '[]'); } catch { return []; }
}
function writeAttempts(list) {
  try { sessionStorage.setItem(RELOAD_KEY, JSON.stringify(list)); } catch { /* noop */ }
}

/**
 * ErrorBoundary global. Ante un error de chunk desactualizado (típico tras un
 * deploy), recarga la página con cache-busting (?v=timestamp) para pedir el
 * index.html fresco. Reintenta con backoff creciente varias veces para superar
 * la ventana en la que el contenedor nuevo aún no sirve los assets; si tras
 * MAX_RELOADS sigue fallando, muestra el error con un botón "Recargar".
 */
export default class ErrorBoundary extends Component {
  state = { error: null, reloading: false };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary capturó un error:', error, info);
    const message = String(error?.message || error?.name || error);
    if (!CHUNK_ERROR.test(message)) return;            // error real (no de chunk): mostrar
    if (this.state.reloading) return;

    const now = Date.now();
    const attempts = readAttempts().filter(t => now - t < WINDOW_MS);
    if (attempts.length >= MAX_RELOADS) return;        // ya se reintentó suficiente
    attempts.push(now);
    writeAttempts(attempts);

    this.setState({ reloading: true, intento: attempts.length });
    this.esperarAlDespliegue();
  }

  componentWillUnmount() {
    this.cancelado = true;
    window.clearTimeout(this.temporizador);
  }

  /** El script de entrada que está cargado ahora mismo (lleva hash del build). */
  entradaActual() {
    const src = [...document.querySelectorAll('script[src]')]
      .map((s) => s.getAttribute('src') || '')
      .find((s) => /\/assets\/index-[A-Za-z0-9_-]+\.js/.test(s));
    return src || null;
  }

  /**
   * Espera a que el contenedor nuevo esté sirviendo, y recarga en cuanto
   * lo está.
   *
   * Antes esto era una espera a ciegas de hasta 60 segundos por intento.
   * Si el despliegue terminaba en el segundo uno, la persona se quedaba
   * mirando el giro los 59 restantes sin saber si esperar o no.
   *
   * Ahora se pregunta: se pide el index.html sin caché y se mira qué
   * script de entrada referencia. Mientras sea el mismo que ya falló, el
   * contenedor viejo sigue delante; cuando cambia, la versión nueva está
   * publicada y se recarga en ese momento.
   */
  async esperarAlDespliegue() {
    const anterior = this.entradaActual();
    const hasta = Date.now() + 240000;     // cuatro minutos: más que cualquier despliegue medido
    const recargar = () => {
      if (this.cancelado) return;
      const url = new URL(window.location.href);
      url.searchParams.set('v', String(Date.now())); // HTML fresco; conserva el hash (#access_token de OAuth)
      window.location.replace(url.toString());
    };

    // Un respiro antes de la primera pregunta: si el fallo fue un corte de
    // red puntual, recargar de inmediato suele bastar.
    await new Promise((r) => { this.temporizador = window.setTimeout(r, 1500); });

    while (!this.cancelado && Date.now() < hasta) {
      try {
        const res = await fetch(`/index.html?v=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const html = await res.text();
          const nueva = /\/assets\/index-[A-Za-z0-9_-]+\.js/.exec(html)?.[0] || null;
          // Sin referencia con la que comparar, no hay nada que esperar.
          if (!anterior || !nueva || !anterior.includes(nueva.replace(/^\//, ''))) {
            recargar();
            return;
          }
        }
      } catch { /* el contenedor todavía no responde: se vuelve a preguntar */ }
      await new Promise((r) => { this.temporizador = window.setTimeout(r, 2500); });
    }
    recargar(); // se acabó el plazo: se intenta igual
  }

  handleManualReload = () => {
    writeAttempts([]);                                 // reinicia el contador
    const url = new URL(window.location.href);
    url.searchParams.set('v', String(Date.now()));
    window.location.replace(url.toString());
  };

  render() {
    if (this.state.reloading) {
      return (
        <div className="fst-app flex min-h-screen items-center justify-center bg-[#FFF9F4] p-6">
          <div className="max-w-sm text-center">
            <div className="flex items-center justify-center gap-3 text-sm font-semibold text-[#0A2540]">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#0A2540] border-t-transparent" aria-hidden="true" />
              Actualizando a la última versión…
            </div>
            <p className="mt-3 text-sm leading-6 text-[#5B6B7F]">
              Se está publicando una versión nueva. La página se abre sola en
              cuanto esté lista, normalmente en menos de dos minutos.
            </p>
            {/* Siempre hay un botón. Una pantalla de espera sin nada que
                pulsar deja a la persona sin saber si esperar o si se colgó,
                y eso es justo lo que pasó. */}
            <button
              type="button"
              onClick={this.handleManualReload}
              className="mt-5 min-h-11 rounded-xl border border-[#0A2540]/20 bg-white px-5 text-sm font-bold text-[#0A2540] hover:bg-[#0A2540]/5"
            >
              Recargar ahora
            </button>
          </div>
        </div>
      );
    }

    if (this.state.error) {
      return (
        <div className="fst-app flex min-h-screen items-center justify-center bg-[#FFF9F4] p-6">
          <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-6 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-widest text-rose-600">Ocurrió un error</p>
            <h1 className="mt-2 text-lg font-semibold text-[#0A2540]">No se pudo cargar la aplicación</h1>
            <p className="mt-2 break-words rounded-xl bg-rose-50 p-3 text-xs leading-5 text-rose-700">
              {String(this.state.error?.message || this.state.error)}
            </p>
            <button
              type="button"
              onClick={this.handleManualReload}
              className="mt-4 min-h-11 rounded-xl bg-[#0A2540] px-4 text-sm font-bold text-white hover:bg-[#123b5f]"
            >
              Recargar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
